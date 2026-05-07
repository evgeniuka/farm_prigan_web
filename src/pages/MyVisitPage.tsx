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
  Info,
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
import { getNextStopId, getPepper, getRouteStops, getStop } from '../data/helpers'
import { useVisit } from '../hooks/useVisit'
import type { Pepper } from '../types/domain'
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

function VisitSummarySection({ savedCount, savedNames }: { savedCount: number; savedNames: string }) {
  return (
    <SectionCard>
      <SectionOverline>01 · Visit Summary</SectionOverline>
      <div className="mt-1">
        <h1 className="text-3xl font-semibold leading-tight text-[var(--ink)]">My Visit</h1>
        <p className="mt-2 text-[15px] leading-6 text-[var(--muted)]">Track your route progress, saved peppers, and next steps.</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Chip tone="red">Route in progress</Chip>
        <Chip tone="gold">Stop 3 of 5</Chip>
        <Chip tone="cream">~20 min remaining</Chip>
        <Chip tone="green">AI Recommended</Chip>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <MetricCard icon={<Route size={15} />} label="Route progress" value="3 / 5 stops" detail="Next: Tasting GH 1–2" />
        <MetricCard icon={<Timer size={15} />} label="Time remaining" value="~20 min" detail="Fits your 40–45 min visit" />
        <MetricCard icon={<Heart size={15} />} label="Saved peppers" value={`${savedCount} peppers`} detail={savedNames || 'No saved peppers yet'} />
        <MetricCard icon={<Sparkles size={15} />} label="Route type" value="AI Recommended" detail="Family / Beginner · Mild" />
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-lg border border-[var(--soft-border)] bg-[#fbf6ec] px-4 py-3 text-sm leading-5 text-[var(--muted)]">
        <Info className="mt-0.5 shrink-0 text-[#d98a2b]" size={15} />
        <p>You can continue the route, edit it, or switch to manual mode anytime. You stay in control.</p>
      </div>
    </SectionCard>
  )
}

function RouteProgressSection({ onContinue }: { onContinue: () => void }) {
  const routeStops = getRouteStops()
  const completedCount = 2
  const progressPercent = Math.round((completedCount / routeStops.length) * 100)

  return (
    <SectionCard>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <SectionOverline>02 · Route Progress</SectionOverline>
          <h2 className="mt-1 text-[22px] font-semibold leading-tight text-[var(--ink)]">Current route</h2>
          <p className="mt-2 text-sm leading-5 text-[var(--muted)]">Visitor Center → Greenhouse Route → Tasting GH 1–2 → Product Shop</p>
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
          const isCompleted = index < 2
          const isCurrent = stop.id === 'greenhouse-route'
          const isNext = stop.id === 'tasting-gh-1-2'
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
                      <TinyBadge tone="green">Mild heat</TinyBadge>
                      <TinyBadge tone="green">Beginner-friendly</TinyBadge>
                    </>
                  ) : null}
                  {!isCompleted && !isCurrent && !isNext ? <TinyBadge>Upcoming</TinyBadge> : null}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                  <span className="inline-flex items-center gap-1">
                    <Clock3 size={12} />
                    {stop.durationMinutes} min
                  </span>
                  {(isCompleted || isCurrent) && <TinyBadge>{isCompleted && index === 0 ? 'Welcome' : isCompleted ? 'Orientation' : 'Learning'}</TinyBadge>}
                  {isNext ? (
                    <>
                      <TinyBadge>Tasting</TinyBadge>
                      <span>Tasting</span>
                      <span>Mild heat</span>
                      <span>Beginner-friendly</span>
                    </>
                  ) : null}
                  {isCurrent ? (
                    <>
                      <span>Learn</span>
                      <span>8 Bays</span>
                      <span>Photo spot</span>
                    </>
                  ) : null}
                  {!isCompleted && !isCurrent && !isNext ? <TinyBadge>Shop</TinyBadge> : null}
                </div>
                {isCurrent ? (
                  <p className="mt-3 text-[11px] italic leading-5 text-[var(--muted)]">↑ 3 min walk · back toward center · face Tasting Point</p>
                ) : null}
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

      <p className="mt-4 text-xs leading-5 text-[var(--muted)]">You can edit, skip, or swap any stop at any time. Manual mode is always available.</p>
    </SectionCard>
  )
}

function NextActionSection({ onContinue, onChooseManual, onSkip }: { onContinue: () => void; onChooseManual: () => void; onSkip: () => void }) {
  return (
    <SectionCard className="overflow-hidden p-0">
      <div className="flex items-center justify-between bg-[var(--terracotta)] px-6 py-3 text-xs font-semibold text-white">
        <span className="inline-flex items-center gap-2">
          <ArrowRight size={14} />
          Next on your route
        </span>
        <span>3 min walk</span>
      </div>
      <div className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <SectionOverline>Stop 4 of 5</SectionOverline>
            <h2 className="mt-1 text-2xl font-semibold text-[var(--ink)]">Tasting GH 1–2</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <TinyBadge tone="gold">Tasting</TinyBadge>
              <TinyBadge tone="green">Mild heat</TinyBadge>
              <TinyBadge tone="green">Beginner-friendly</TinyBadge>
              <TinyBadge tone="green">Accessible</TinyBadge>
            </div>
            <div className="mt-4 flex flex-wrap gap-5 text-sm text-[var(--muted)]">
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} />
                Tasting Zone · Mild & Medium heat
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={14} />
                12 min at this stop
              </span>
            </div>
          </div>
          <div className="text-left md:text-right">
            <p className="text-xs text-[var(--muted)]">Estimated time at stop</p>
            <p className="text-xl font-semibold text-[var(--ink)]">12 min</p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-[#c9e2db] bg-[#e1efeb] p-4">
          <p className="text-sm font-semibold text-[#245f56]">Recommended because</p>
          <p className="mt-1 text-sm leading-5 text-[var(--ink)]">
            This stop matches your mild tasting preference, is close to your current location, fits your visit time, and avoids unnecessary walking.
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
            Continue to Tasting GH 1–2
            <ArrowRight size={15} />
          </button>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[var(--soft-border)] bg-white text-xs font-semibold text-[var(--ink)] hover:bg-[var(--cream-100)]" to="/stops/tasting-gh-1-2">
              <Eye size={14} />
              Open Stop Details
            </Link>
            <button className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[var(--soft-border)] bg-white text-xs font-semibold text-[var(--ink)] hover:bg-[var(--cream-100)]" onClick={onSkip} type="button">
              <ArrowRight size={14} />
              Skip This Stop
            </button>
            <button className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[var(--soft-border)] bg-white text-xs font-semibold text-[var(--ink)] hover:bg-[var(--cream-100)]" onClick={onChooseManual} type="button">
              <PenLine size={14} />
              Choose Manually
            </button>
            <button className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[var(--soft-border)] bg-white text-xs font-semibold text-[var(--ink)] hover:bg-[var(--cream-100)]" onClick={onChooseManual} type="button">
              <Compass size={14} />
              Switch to Manual Mode
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

      <div className="mt-4 flex items-start gap-2 rounded-lg border border-[var(--soft-border)] bg-[#fbf6ec] px-4 py-3 text-sm leading-5 text-[var(--muted)]">
        <Info className="mt-0.5 shrink-0 text-[#d98a2b]" size={15} />
        <p>Peppers you save during your visit appear here. You can compare them or view full details.</p>
      </div>
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
}: {
  onContinue: () => void
  onChooseManual: () => void
  onEditRoute: () => void
  onFinish: () => void
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
        <Link className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[var(--soft-border)] bg-white px-4 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--cream-100)]" to="/map">
          <Map size={15} />
          Open Map
        </Link>
        <button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[var(--soft-border)] bg-white px-4 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--cream-100)]" onClick={onEditRoute} type="button">
          <Edit3 size={15} />
          Edit Route
        </button>
        <button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[var(--soft-border)] bg-white px-4 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--cream-100)]" onClick={onChooseManual} type="button">
          <Compass size={15} />
          Choose Manually
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
  savedCount,
  onChooseManual,
  onContinue,
  onEditRoute,
  onFinish,
}: {
  savedCount: number
  onChooseManual: () => void
  onContinue: () => void
  onEditRoute: () => void
  onFinish: () => void
}) {
  return (
    <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
      <div className="overflow-hidden rounded-2xl border border-[var(--soft-border)] bg-white shadow-[0_12px_32px_rgba(74,51,29,0.06)]">
        <div className="bg-[var(--terracotta)] px-5 py-4 text-white">
          <p className="text-[11px] font-semibold uppercase tracking-[0.02em]">Next on your route</p>
          <p className="mt-1 text-sm">Stop 4 of 5</p>
        </div>
        <div className="p-5">
          <div className="flex gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff2d6] text-[#d98a2b]">
              <MapPin size={17} />
            </span>
            <div>
              <h3 className="font-semibold text-[var(--ink)]">Tasting GH 1–2</h3>
              <p className="mt-1 text-xs leading-5 text-[var(--muted)]">3 min walk · 12 min at stop</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <TinyBadge tone="gold">Tasting</TinyBadge>
                <TinyBadge tone="green">Mild heat</TinyBadge>
                <TinyBadge tone="green">Beginner-friendly</TinyBadge>
              </div>
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-[#c9e2db] bg-[#e1efeb] p-3 text-xs leading-5 text-[#245f56]">
            Recommended: mild spice preference, close to current location, fits visit time.
          </div>
          <div className="mt-4 grid gap-3">
            <button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--terracotta)] px-4 text-sm font-semibold text-white hover:bg-[var(--terracotta-dark)]" onClick={onContinue} type="button">
              Continue to Tasting GH 1–2
            </button>
            <div className="grid grid-cols-2 gap-2">
              <Link className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[var(--soft-border)] bg-white text-xs font-semibold text-[var(--ink)] hover:bg-[var(--cream-100)]" to="/map">
                Open Map
              </Link>
              <Link className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[var(--soft-border)] bg-white text-xs font-semibold text-[var(--ink)] hover:bg-[var(--cream-100)]" to="/stops/tasting-gh-1-2">
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
          ['Stops', '4 main stops'],
          ['Total walk', '~10 min · 450 m'],
          ['Visit mode', 'Family / Beginner'],
          ['Spice level', 'Mild'],
          ['Route type', 'AI Recommended'],
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
          ['Switch to Manual Mode', onChooseManual],
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
    skipStop,
    toggleComparePepper,
    toggleSavePepper,
    visit,
  } = useVisit()
  const navigate = useNavigate()
  const savedPeppers = visit.savedPepperIds.map(getPepper)
  const displayedSavedPeppers = savedPeppers
  const savedNames = displayedSavedPeppers.map((pepper) => pepper.name).join(' · ')
  const nextStop = getStop(getNextStopId(visit.activeStopId))

  const continueRoute = () => {
    continueToNextStop()
    navigate('/route')
  }

  const skipNextStop = () => {
    skipStop()
    navigate('/route')
  }

  const chooseManualRoute = () => {
    chooseManual()
    navigate('/map')
  }

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

        <div className="grid gap-8 lg:grid-cols-[minmax(0,848px)_320px]">
          <div className="space-y-6">
            <VisitSummarySection savedCount={displayedSavedPeppers.length} savedNames={savedNames} />
            <RouteProgressSection onContinue={continueRoute} />
            <NextActionSection onChooseManual={chooseManualRoute} onContinue={continueRoute} onSkip={skipNextStop} />
            <SavedPeppersSection onCompare={comparePepper} onRemove={toggleSavePepper} savedPeppers={displayedSavedPeppers} />
            <AiSummarySection />
            <SafetySection />
            <UserControlsSection onChooseManual={chooseManualRoute} onContinue={continueRoute} onEditRoute={editRoute} onFinish={finishCurrentVisit} />
          </div>
          <SidebarPanel
            onChooseManual={chooseManualRoute}
            onContinue={continueRoute}
            onEditRoute={editRoute}
            onFinish={finishCurrentVisit}
            savedCount={displayedSavedPeppers.length}
          />
        </div>

        <p className="sr-only">Next route stop is {nextStop.name}.</p>
      </div>
    </PageShell>
  )
}
