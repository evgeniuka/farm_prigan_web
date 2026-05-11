import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Compass,
  Edit3,
  Eye,
  Flag,
  Heart,
  ListChecks,
  Map,
  MapPin,
  PenLine,
  Route,
  ShieldAlert,
  Sparkles,
  Sprout,
  Timer,
  X,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageShell } from '../components/layout/PageShell'
import { useMapOverlay } from '../components/map/useMapOverlay'
import { getPepper, getRouteStops } from '../data/helpers'
import { useVisit } from '../hooks/useVisit'
import type { Pepper, Stop, UserVisit } from '../types/domain'
import { cn } from '../utils/cn'

const savedPepperMeta: Record<string, { level: string; score: string; tags: string[]; note?: string }> = {
  'lemon-drop': {
    level: 'Hot',
    score: '4 / 5',
    tags: ['Citrusy', 'Fruity'],
    note: 'At next stop',
  },
  jalapeno: {
    level: 'Medium',
    score: '3 / 5',
    tags: ['Classic', 'Popular'],
  },
  habanero: {
    level: 'Very Hot',
    score: '5 / 5',
    tags: ['Fruity', 'Advanced'],
  },
}

function SectionCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={cn('rounded-2xl border border-[var(--soft-border)] bg-white p-6 shadow-[0_12px_32px_rgba(74,51,29,0.05)]', className)}>
      {children}
    </section>
  )
}

function SectionOverline({ children }: { children: ReactNode }) {
  return <p className="text-[11px] font-semibold uppercase tracking-[0.02em] text-[var(--terracotta)]">{children}</p>
}

function Chip({ children, tone = 'cream' }: { children: ReactNode; tone?: 'cream' | 'red' | 'gold' | 'green' | 'blue' }) {
  const classes = {
    cream: 'border-[var(--soft-border)] bg-[var(--cream-100)] text-[var(--muted)]',
    red: 'border-[#efc2b4] bg-[#fbe4dc] text-[var(--terracotta)]',
    gold: 'border-[#ecd5aa] bg-[#fff2d6] text-[#9a661c]',
    green: 'border-[#cfe5d9] bg-[#e1efeb] text-[#317267]',
    blue: 'border-[#c8d8e2] bg-[#eaf4f8] text-[#3d6e8c]',
  }[tone]

  return <span className={cn('inline-flex min-h-8 items-center rounded-full border px-3 text-xs font-semibold', classes)}>{children}</span>
}

function TinyBadge({ children, tone = 'cream' }: { children: ReactNode; tone?: 'cream' | 'green' | 'gold' | 'red' }) {
  const classes = {
    cream: 'border-[var(--soft-border)] bg-white text-[var(--muted)]',
    green: 'border-[#cfe5d9] bg-[#edf7ed] text-[#3e7f74]',
    gold: 'border-[#ecd5aa] bg-[#fff2d6] text-[#9a661c]',
    red: 'border-[#efc2b4] bg-[#fff0eb] text-[var(--terracotta)]',
  }[tone]

  return <span className={cn('inline-flex h-6 items-center rounded-full border px-2 text-[11px] font-medium', classes)}>{children}</span>
}

function IconButton({ children, to, onClick }: { children: ReactNode; to?: string; onClick?: () => void }) {
  const className =
    'inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[var(--soft-border)] bg-white px-3 text-xs font-semibold text-[var(--ink)] transition hover:bg-[var(--cream-100)]'

  if (to) {
    return (
      <Link className={className} to={to}>
        {children}
      </Link>
    )
  }

  return (
    <button className={className} onClick={onClick} type="button">
      {children}
    </button>
  )
}

function MetricCard({ icon, label, value, detail }: { icon: ReactNode; label: string; value: string; detail: string }) {
  return (
    <div className="rounded-xl border border-[var(--soft-border)] bg-[#fffaf1] p-4">
      <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold text-[var(--muted)]">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[#d98a2b]">{icon}</span>
        {label}
      </div>
      <div className="text-base font-semibold text-[var(--ink)]">{value}</div>
      <div className="mt-1 text-[11px] leading-4 text-[var(--muted)]">{detail}</div>
    </div>
  )
}

function VisitSummarySection({
  activeIndex,
  currentStop,
  nextStop,
  routeStops,
  savedCount,
  savedNames,
  visit,
}: {
  activeIndex: number
  currentStop: Stop
  nextStop: Stop | null
  routeStops: Stop[]
  savedCount: number
  savedNames: string
  visit: UserVisit
}) {
  const remainingMinutes = routeStops.slice(activeIndex + 1).reduce((total, stop) => total + stop.durationMinutes + stop.walkingMinutesFromPrevious, 0)
  const routeType = visit.manualMode ? 'Manual Planning' : visit.routeAccepted ? 'AI Recommended' : 'Route ready'

  return (
    <SectionCard>
      <SectionOverline>01 · Visit Summary</SectionOverline>
      <div className="mt-1">
        <h1 className="text-3xl font-semibold leading-tight text-[var(--ink)]">My Visit</h1>
        <p className="mt-2 text-[15px] leading-6 text-[var(--muted)]">Track your route progress, saved peppers, and next steps.</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Chip tone={visit.finished ? 'green' : 'red'}>{visit.finished ? 'Visit finished' : 'Route in progress'}</Chip>
        <Chip tone="gold">Stop {activeIndex + 1} of {routeStops.length}</Chip>
        <Chip tone="cream">{remainingMinutes ? `~${remainingMinutes} min remaining` : 'Final stop'}</Chip>
        <Chip tone="green">{routeType}</Chip>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <MetricCard icon={<Route size={15} />} label="Route progress" value={`${activeIndex + 1} / ${routeStops.length} stops`} detail={nextStop ? `Next: ${nextStop.name}` : 'Ready to finish'} />
        <MetricCard icon={<Timer size={15} />} label="Time remaining" value={remainingMinutes ? `~${remainingMinutes} min` : 'Final stop'} detail={`Current: ${currentStop.shortName}`} />
        <MetricCard icon={<Heart size={15} />} label="Saved peppers" value={`${savedCount} peppers`} detail={savedNames || 'No saved peppers yet'} />
      </div>
    </SectionCard>
  )
}

function RouteProgressSection({ activeIndex, onContinue, routeStops, visit }: { activeIndex: number; onContinue: () => void; routeStops: Stop[]; visit: UserVisit }) {
  const completedCount = routeStops.filter((stop, index) => visit.visitedStopIds.includes(stop.id) || index < activeIndex).length
  const progressPercent = Math.round(((activeIndex + 1) / routeStops.length) * 100)

  return (
    <SectionCard>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <SectionOverline>02 · Route Progress</SectionOverline>
          <h2 className="mt-1 text-[22px] font-semibold leading-tight text-[var(--ink)]">Current route</h2>
          <p className="mt-2 text-sm leading-5 text-[var(--muted)]">{routeStops.map((stop) => stop.name).join(' → ')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <IconButton to="/route">
            <Route size={14} />
            Live Route
          </IconButton>
          <IconButton to="/map">
            <Map size={14} />
            Farm Map
          </IconButton>
          <IconButton to="/planner">
            <Edit3 size={14} />
            Edit Route
          </IconButton>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs text-[var(--muted)]">
          <span>{completedCount} of {routeStops.length} stops completed</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--cream-100)]">
          <div className="h-full rounded-full bg-[var(--terracotta)]" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="mt-5 divide-y divide-[var(--soft-border)]">
        {routeStops.map((stop, index) => {
          const isCompleted = visit.visitedStopIds.includes(stop.id) || index < activeIndex
          const isCurrent = stop.id === visit.activeStopId
          const isNext = index === activeIndex + 1
          const isLast = index === routeStops.length - 1

          return (
            <article
              className={cn(
                'relative grid gap-3 py-4 md:grid-cols-[2rem_minmax(0,1fr)_auto]',
                isCurrent && '-mx-2 rounded-xl border border-[#eea58e] bg-[#fbe4dc] px-2',
              )}
              key={stop.id}
            >
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    'inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold',
                    isCompleted && 'border-[#b9d7bf] bg-[#edf7ed] text-[#4e8b63]',
                    isCurrent && 'border-[var(--terracotta)] bg-[var(--terracotta)] text-white',
                    !isCompleted && !isCurrent && 'border-[#e2d6c4] bg-white text-[var(--muted)]',
                  )}
                >
                  {isCompleted ? <CheckCircle2 size={15} /> : index + 1}
                </span>
                {!isLast ? <span className="mt-1 h-5 w-px bg-[#e0d4c3]" /> : null}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className={cn('text-sm font-semibold', isCurrent ? 'text-[var(--ink)]' : 'text-[var(--muted)]')}>
                    {index + 1}. {stop.name}
                  </h3>
                  {isCompleted ? <TinyBadge tone="green">Completed</TinyBadge> : null}
                  {isCurrent ? <TinyBadge tone="red">You are here</TinyBadge> : null}
                  {isNext ? (
                    <>
                      <TinyBadge tone="gold">Next stop</TinyBadge>
                      {stop.tags.slice(0, 2).map((tag) => (
                        <TinyBadge key={tag} tone="green">{tag}</TinyBadge>
                      ))}
                    </>
                  ) : null}
                  {!isCompleted && !isCurrent && !isNext ? <TinyBadge>Upcoming</TinyBadge> : null}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                  <span className="inline-flex items-center gap-1">
                    <Clock3 size={12} />
                    {stop.durationMinutes} min
                  </span>
                  {(isCompleted || isCurrent) && stop.tags.slice(0, 2).map((tag) => <TinyBadge key={tag}>{tag}</TinyBadge>)}
                  {isNext ? (
                    <>
                      {stop.tags.slice(0, 3).map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </>
                  ) : null}
                  {isCurrent ? (
                    <>
                      {stop.tags.slice(0, 3).map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </>
                  ) : null}
                  {!isCompleted && !isCurrent && !isNext ? <TinyBadge>{stop.type}</TinyBadge> : null}
                </div>
              </div>

              <div className="flex items-start gap-2 md:justify-end">
                {isCurrent ? (
                  <button
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[var(--terracotta)] px-4 text-xs font-semibold text-white transition hover:bg-[var(--terracotta-dark)]"
                    onClick={onContinue}
                    type="button"
                  >
                    Continue
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <Link className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--terracotta)] hover:underline" to={`/stops/${stop.id}`}>
                    {isCompleted ? 'View' : 'Preview'}
                  </Link>
                )}
                {!isCompleted && !isCurrent && !isNext ? <span className="text-xs font-semibold text-[var(--terracotta)]">Skip</span> : null}
              </div>
            </article>
          )
        })}
      </div>

    </SectionCard>
  )
}

function NextActionSection({
  currentStop,
  nextStop,
  onChooseManual,
  onContinue,
  onFinish,
  onShorten,
  onSkip,
  routeStops,
}: {
  currentStop: Stop
  nextStop: Stop | null
  onChooseManual: () => void
  onContinue: () => void
  onFinish: () => void
  onShorten: () => void
  onSkip: () => void
  routeStops: Stop[]
}) {
  const targetStop = nextStop ?? currentStop

  return (
    <SectionCard className="overflow-hidden p-0">
      <div className="flex items-center justify-between bg-[var(--terracotta)] px-6 py-3 text-xs font-semibold text-white">
        <span className="inline-flex items-center gap-2">
          <ArrowRight size={14} />
          Next on your route
        </span>
        <span>{nextStop ? `${nextStop.walkingMinutesFromPrevious} min walk` : 'Final step'}</span>
      </div>
      <div className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <SectionOverline>{nextStop ? `Stop ${nextStop.order} of ${routeStops.length}` : 'Visit complete'}</SectionOverline>
            <h2 className="mt-1 text-2xl font-semibold text-[var(--ink)]">{nextStop ? nextStop.name : 'Ready to finish'}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {(nextStop?.tags ?? ['Summary', 'Completed']).slice(0, 4).map((tag) => (
                <TinyBadge key={tag} tone={tag.includes('Mild') || tag.includes('Family') ? 'green' : 'gold'}>{tag}</TinyBadge>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-5 text-sm text-[var(--muted)]">
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} />
                {nextStop ? nextStop.description : `Current stop: ${currentStop.name}`}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={14} />
                {nextStop ? nextStop.durationMinutes : currentStop.durationMinutes} min at this stop
              </span>
            </div>
          </div>
          <div className="text-left md:text-right">
            <p className="text-xs text-[var(--muted)]">Estimated time at stop</p>
            <p className="text-xl font-semibold text-[var(--ink)]">{nextStop ? nextStop.durationMinutes : currentStop.durationMinutes} min</p>
          </div>
        </div>

        <div className="hidden">
          <p className="text-sm font-semibold text-[#245f56]">Recommended because</p>
          <p className="mt-1 text-sm leading-5 text-[var(--ink)]">
            {nextStop
              ? `This stop follows ${currentStop.shortName}, fits your selected visit preferences, and keeps the route visitor-friendly.`
              : 'You have reached the last route stop. Finish the visit to review your completed route and saved peppers.'}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <TinyBadge tone="green">Matches spice comfort</TinyBadge>
            <TinyBadge tone="green">Closest to you</TinyBadge>
            <TinyBadge tone="green">Fits visit time</TinyBadge>
            <TinyBadge tone="green">No long walk</TinyBadge>
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          <button
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--terracotta)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--terracotta-dark)]"
            onClick={onContinue}
            type="button"
          >
            {nextStop ? `Continue to ${nextStop.shortName}` : 'Finish Visit'}
            <ArrowRight size={15} />
          </button>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[var(--soft-border)] bg-white text-xs font-semibold text-[var(--ink)] hover:bg-[var(--cream-100)]" to={`/stops/${targetStop.id}`}>
              <Eye size={14} />
              Open Stop Details
            </Link>
            <button className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[var(--soft-border)] bg-white text-xs font-semibold text-[var(--ink)] hover:bg-[var(--cream-100)]" onClick={onSkip} type="button">
              <ArrowRight size={14} />
              Skip Stop
            </button>
            <button className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[var(--soft-border)] bg-white text-xs font-semibold text-[var(--ink)] hover:bg-[var(--cream-100)]" onClick={onChooseManual} type="button">
              <PenLine size={14} />
              Choose Manually
            </button>
            <button className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[var(--soft-border)] bg-white text-xs font-semibold text-[var(--ink)] hover:bg-[var(--cream-100)]" onClick={onShorten} type="button">
              <Compass size={14} />
              Shorten Route
            </button>
            <button className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[#efc2b4] bg-white text-xs font-semibold text-[var(--terracotta)] hover:bg-[#fff0eb]" onClick={onFinish} type="button">
              <Flag size={14} />
              Finish Visit
            </button>
          </div>
        </div>
      </div>
    </SectionCard>
  )
}

function SavedPepperCard({ pepper, onCompare, onRemove }: { pepper: Pepper; onCompare: () => void; onRemove: () => void }) {
  const meta = savedPepperMeta[pepper.id] ?? {
    level: pepper.heatLevel >= 4 ? 'Hot' : 'Mild',
    score: `${pepper.heatLevel} / 5`,
    tags: pepper.flavorTags.slice(0, 2),
  }

  return (
    <article className="rounded-xl border border-[var(--soft-border)] bg-white p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-[var(--ink)]">{pepper.name}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-[var(--muted)]">
            <TinyBadge tone={meta.level === 'Very Hot' || meta.level === 'Hot' ? 'red' : 'gold'}>{meta.level}</TinyBadge>
            <span>{meta.score}</span>
          </div>
        </div>
        {meta.note ? <TinyBadge tone="green">{meta.note}</TinyBadge> : null}
      </div>
      <div className="flex flex-wrap gap-2">
        {meta.tags.map((tag) => (
          <TinyBadge key={tag}>{tag}</TinyBadge>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
        <Link className="font-semibold text-[var(--terracotta)] hover:underline" to={`/peppers/${pepper.id}`}>
          View Details
        </Link>
        <button className="font-semibold text-[var(--terracotta)] hover:underline" onClick={onCompare} type="button">
          Compare
        </button>
        <button className="inline-flex items-center gap-1 font-semibold text-[var(--muted)] hover:text-[var(--danger)]" onClick={onRemove} type="button">
          <X size={12} />
          Remove
        </button>
      </div>
    </article>
  )
}

function SavedPeppersSection({ savedPeppers, onCompare, onRemove }: { savedPeppers: Pepper[]; onCompare: (pepperId: string) => void; onRemove: (pepperId: string) => void }) {
  return (
    <SectionCard>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <SectionOverline>04 · Saved Peppers</SectionOverline>
          <h2 className="mt-1 text-[22px] font-semibold text-[var(--ink)]">Saved peppers</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Chip tone="blue">{savedPeppers.length} saved</Chip>
          <Link className="inline-flex h-9 items-center gap-2 rounded-lg border border-[var(--soft-border)] bg-white px-3 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--cream-100)]" to="/catalog">
            <Sprout size={14} />
            Pepper Catalog
          </Link>
        </div>
      </div>

      {savedPeppers.length ? (
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {savedPeppers.map((pepper) => (
            <SavedPepperCard
              key={pepper.id}
              onCompare={() => onCompare(pepper.id)}
              onRemove={() => onRemove(pepper.id)}
              pepper={pepper}
            />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-[var(--soft-border)] bg-[#fffaf1] p-5 text-sm text-[var(--muted)]">
          Peppers you save during your visit will appear here.
        </div>
      )}

    </SectionCard>
  )
}

function AiSummarySection() {
  return (
    <SectionCard className="border-[#b8dcd4] bg-[#e1efeb]">
      <SectionOverline>05 · AI Route Summary</SectionOverline>
      <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--ink)]">How your route was adapted</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <TinyBadge tone="green">AI Recommended</TinyBadge>
            <TinyBadge tone="green">Family / Beginner</TinyBadge>
            <TinyBadge tone="green">Mild</TinyBadge>
          </div>
        </div>
        <Sparkles className="hidden text-[#3e7f74] sm:block" size={22} />
      </div>
      <p className="mt-4 text-sm leading-5 text-[var(--ink)]">
        This route was adapted based on your 40–45 minute visit, mild spice preference, family-friendly mode, short walking distance, and restricted-area avoidance.
      </p>
      <p className="mt-5 border-t border-[#c4ddd6] pt-4 text-xs leading-5 text-[#5f746f]">
        Location may be approximate inside greenhouse areas. This prototype does not require registration.
      </p>
    </SectionCard>
  )
}

function SafetySection() {
  const reminders = [
    'Stay on marked visitor paths at all times.',
    'Do not enter staff-only or restricted areas. Follow signs posted by farm staff.',
    'Follow tasting guidance for hot peppers. Ask staff if you are unsure.',
  ]

  return (
    <SectionCard>
      <SectionOverline>06 · Safety</SectionOverline>
      <h2 className="mt-1 text-[22px] font-semibold text-[var(--ink)]">Safety reminders</h2>
      <div className="mt-5 space-y-3">
        {reminders.map((reminder) => (
          <div className="flex items-start gap-3 rounded-lg border border-[#f1dfba] bg-[#fff2d6] px-4 py-3 text-sm text-[var(--ink)]" key={reminder}>
            <ShieldAlert className="mt-0.5 shrink-0 text-[#d98a2b]" size={15} />
            {reminder}
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

function UserControlsSection({
  onContinue,
  onChooseManual,
  onEditRoute,
  onFinish,
  onOpenMap,
  onShorten,
}: {
  onContinue: () => void
  onChooseManual: () => void
  onEditRoute: () => void
  onFinish: () => void
  onOpenMap: () => void
  onShorten: () => void
}) {
  return (
    <SectionCard>
      <SectionOverline>07 · Your Control</SectionOverline>
      <h2 className="mt-1 text-[22px] font-semibold text-[var(--ink)]">Adjust or finish your visit</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--terracotta)] px-4 text-sm font-semibold text-white hover:bg-[var(--terracotta-dark)]" onClick={onContinue} type="button">
          <ArrowRight size={15} />
          Continue Route
        </button>
        <button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[var(--soft-border)] bg-white px-4 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--cream-100)]" onClick={onOpenMap} type="button">
          <Map size={15} />
          Open Map
        </button>
        <button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[var(--soft-border)] bg-white px-4 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--cream-100)]" onClick={onEditRoute} type="button">
          <Edit3 size={15} />
          Edit Route
        </button>
        <button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[var(--soft-border)] bg-white px-4 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--cream-100)]" onClick={onChooseManual} type="button">
          <Compass size={15} />
          Choose Manually
        </button>
        <button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[var(--soft-border)] bg-white px-4 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--cream-100)]" onClick={onShorten} type="button">
          <Timer size={15} />
          Shorten Route
        </button>
        <Link className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[var(--soft-border)] bg-white px-4 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--cream-100)]" to="/route">
          <ArrowLeft size={15} />
          Back to Route
        </Link>
        <button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#efc2b4] bg-white px-4 text-sm font-semibold text-[var(--terracotta)] hover:bg-[#fff0eb]" onClick={onFinish} type="button">
          <Flag size={15} />
          Finish Visit
        </button>
      </div>
      <p className="mt-4 text-center text-xs text-[var(--muted)]">You can pause and return to this visit summary at any time.</p>
    </SectionCard>
  )
}

function SidebarPanel({
  activeIndex,
  currentStop,
  nextStop,
  savedCount,
  onChooseManual,
  onContinue,
  onEditRoute,
  onFinish,
  onOpenMap,
  routeStops,
  visit,
}: {
  activeIndex: number
  currentStop: Stop
  nextStop: Stop | null
  savedCount: number
  onChooseManual: () => void
  onContinue: () => void
  onEditRoute: () => void
  onFinish: () => void
  onOpenMap: () => void
  routeStops: Stop[]
  visit: UserVisit
}) {
  const targetStop = nextStop ?? currentStop
  const routeType = visit.manualMode ? 'Manual Planning' : visit.routeAccepted ? 'AI Recommended' : 'Route ready'

  return (
    <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
      <div className="overflow-hidden rounded-2xl border border-[var(--soft-border)] bg-white shadow-[0_12px_32px_rgba(74,51,29,0.06)]">
        <div className="bg-[var(--terracotta)] px-5 py-4 text-white">
          <p className="text-[11px] font-semibold uppercase tracking-[0.02em]">{nextStop ? 'Next on your route' : 'Current route status'}</p>
          <p className="mt-1 text-sm">{nextStop ? `Stop ${nextStop.order} of ${routeStops.length}` : 'Final stop'}</p>
        </div>
        <div className="p-5">
          <div className="flex gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff2d6] text-[#d98a2b]">
              <MapPin size={17} />
            </span>
            <div>
              <h3 className="font-semibold text-[var(--ink)]">{targetStop.name}</h3>
              <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                {nextStop ? `${nextStop.walkingMinutesFromPrevious} min walk · ${nextStop.durationMinutes} min at stop` : 'Ready to finish the visit'}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {targetStop.tags.slice(0, 3).map((tag) => (
                  <TinyBadge key={tag} tone={tag.includes('Mild') || tag.includes('Family') ? 'green' : 'gold'}>{tag}</TinyBadge>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-[#c9e2db] bg-[#e1efeb] p-3 text-xs leading-5 text-[#245f56]">
            {nextStop
              ? `Recommended: ${nextStop.shortName} follows ${currentStop.shortName} and fits your current route.`
              : 'You are at the final route step. Finish when you are ready.'}
          </div>
          <div className="mt-4 grid gap-3">
            <button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--terracotta)] px-4 text-sm font-semibold text-white hover:bg-[var(--terracotta-dark)]" onClick={onContinue} type="button">
              {nextStop ? `Continue to ${nextStop.shortName}` : 'Finish Visit'}
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[var(--soft-border)] bg-white text-xs font-semibold text-[var(--ink)] hover:bg-[var(--cream-100)]" onClick={onOpenMap} type="button">
                Open Map
              </button>
              <Link className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[var(--soft-border)] bg-white text-xs font-semibold text-[var(--ink)] hover:bg-[var(--cream-100)]" to={`/stops/${targetStop.id}`}>
                Stop Details
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--soft-border)] bg-white p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.02em] text-[var(--muted)]">Your selections</p>
        {[
          ['Total duration', '40–45 min'],
          ['Stops', `${routeStops.length} stops`],
          ['Total walk', '~10 min · 450 m'],
          ['Visit mode', 'Family / Beginner'],
          ['Spice level', 'Mild'],
          ['Current stop', `${activeIndex + 1}. ${currentStop.shortName}`],
          ['Route type', routeType],
          ['Saved peppers', `${savedCount} saved`],
        ].map(([label, value]) => (
          <div className="flex items-center justify-between gap-3 py-2 text-xs" key={label}>
            <span className="inline-flex items-center gap-2 text-[var(--muted)]">
              <ListChecks size={13} />
              {label}
            </span>
            <span className="font-semibold text-[var(--ink)]">{value}</span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[var(--soft-border)] bg-white p-5">
        <p className="mb-4 text-sm font-semibold text-[var(--ink)]">Route adjustments</p>
        {[
          ['Edit Route Preferences', onEditRoute],
          ['Replan Remaining Route', onEditRoute],
          ['Choose Manually', onChooseManual],
        ].map(([label, handler]) => (
          <button
            className="mb-2 flex h-10 w-full items-center justify-between rounded-lg border border-[var(--soft-border)] bg-white px-3 text-left text-xs font-semibold text-[var(--ink)] hover:bg-[var(--cream-100)]"
            key={label as string}
            onClick={handler as () => void}
            type="button"
          >
            <span>{label as string}</span>
            <ChevronRight size={14} />
          </button>
        ))}
        <Link className="flex h-10 w-full items-center justify-between rounded-lg border border-[var(--soft-border)] bg-white px-3 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--cream-100)]" to="/route">
          View All Stops
          <ChevronRight size={14} />
        </Link>
      </div>

      <button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#efc2b4] bg-white text-sm font-semibold text-[var(--terracotta)] hover:bg-[#fff0eb]" onClick={onFinish} type="button">
        <Flag size={15} />
        Finish Visit
      </button>
    </aside>
  )
}

export function MyVisitPage() {
  const {
    chooseManual,
    continueToNextStop,
    editPreferences,
    finishVisit,
    shortenRoute,
    skipStop,
    toggleComparePepper,
    toggleSavePepper,
    visit,
  } = useVisit()
  const navigate = useNavigate()
  const { openMap } = useMapOverlay()
  const routeStops = getRouteStops(visit)
  const activeIndex = Math.max(0, routeStops.findIndex((stop) => stop.id === visit.activeStopId))
  const currentStop = routeStops[activeIndex]
  const nextStop = routeStops[activeIndex + 1] ?? null
  const savedPeppers = visit.savedPepperIds.map(getPepper)
  const displayedSavedPeppers = savedPeppers
  const savedNames = displayedSavedPeppers.map((pepper) => pepper.name).join(' · ')

  const continueRoute = () => {
    if (!nextStop) {
      finishCurrentVisit()
      return
    }

    continueToNextStop()
    navigate('/route')
  }

  const skipNextStop = () => {
    if (!nextStop) {
      finishCurrentVisit()
      return
    }

    skipStop()
    navigate('/route')
  }

  const shortenCurrentRoute = () => {
    shortenRoute()
    navigate('/route')
  }

  const chooseManualRoute = () => {
    chooseManual()
    openMap(visit.activeStopId)
  }

  const openCurrentMap = () => openMap(visit.activeStopId)

  const editRoute = () => {
    editPreferences()
    navigate('/planner')
  }

  const finishCurrentVisit = () => {
    finishVisit()
    navigate('/finish')
  }

  const comparePepper = (pepperId: string) => {
    toggleComparePepper(pepperId)
    navigate('/compare')
  }

  return (
    <PageShell className="py-8 md:py-10">
      <div className="mx-auto max-w-[1200px]">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[var(--muted)]">
          <Route size={13} />
          <Link className="hover:text-[var(--ink)]" to="/route">Route</Link>
          <ChevronRight size={13} />
          <span className="font-semibold text-[var(--ink)]">My Visit</span>
        </nav>

        <div className="mx-auto grid max-w-[980px] gap-8 lg:grid-cols-1">
          <div className="space-y-6">
            <VisitSummarySection activeIndex={activeIndex} currentStop={currentStop} nextStop={nextStop} routeStops={routeStops} savedCount={displayedSavedPeppers.length} savedNames={savedNames} visit={visit} />
            <RouteProgressSection activeIndex={activeIndex} onContinue={continueRoute} routeStops={routeStops} visit={visit} />
            <NextActionSection currentStop={currentStop} nextStop={nextStop} onChooseManual={chooseManualRoute} onContinue={continueRoute} onFinish={finishCurrentVisit} onShorten={shortenCurrentRoute} onSkip={skipNextStop} routeStops={routeStops} />
            <SavedPeppersSection onCompare={comparePepper} onRemove={toggleSavePepper} savedPeppers={displayedSavedPeppers} />
            <SafetySection />
            <div className="hidden">
              <AiSummarySection />
              <UserControlsSection onChooseManual={chooseManualRoute} onContinue={continueRoute} onEditRoute={editRoute} onFinish={finishCurrentVisit} onOpenMap={openCurrentMap} onShorten={shortenCurrentRoute} />
            </div>
          </div>
          <div className="hidden">
            <SidebarPanel
              activeIndex={activeIndex}
              currentStop={currentStop}
              nextStop={nextStop}
              onChooseManual={chooseManualRoute}
              onContinue={continueRoute}
              onEditRoute={editRoute}
              onFinish={finishCurrentVisit}
              onOpenMap={openCurrentMap}
              routeStops={routeStops}
              savedCount={displayedSavedPeppers.length}
              visit={visit}
            />
          </div>
        </div>

        <p className="sr-only">Next route stop is {nextStop?.name ?? 'finish visit'}.</p>
      </div>
    </PageShell>
  )
}
