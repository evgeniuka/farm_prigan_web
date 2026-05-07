import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  Flame,
  HelpCircle,
  Info,
  List,
  Map,
  MapPin,
  Route,
  ShieldAlert,
  Shuffle,
  SkipForward,
  Star,
  UsersRound,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import stopDetailHero from '../assets/figma/stop-detail-hero.png'
import { PageShell } from '../components/layout/PageShell'
import { routeImages } from '../data/routeImages'
import { useVisit } from '../hooks/useVisit'
import { cn } from '../utils/cn'

const routeSteps = [
  { label: 'Visitor Center', state: 'done' },
  { label: 'Greenhouse Route', state: 'current' },
  { label: 'Tasting GH 1-2', state: 'next' },
  { label: 'Product Shop', state: 'upcoming' },
] as const

const seeItems = [
  'Pepper plants growing in 8 controlled bays - each at a different growth stage',
  'Plant heights from 30 cm seedlings to over 1 metre',
  'Fruit colours ranging from bright green to deep red',
  'Visitor path runs the full length of the bays',
]

const doItems = [
  'Look at plant height, fruit colour, pepper shape, and ripeness stage',
  'Walk the full visitor aisle to compare bays side by side',
  'Notice the growth stages - from green seedling to ripe red',
  'Continue when ready - no rush',
]

const safetyItems = [
  'Stay on the marked visitor path through the greenhouse bays',
  'Do not touch irrigation equipment or growing structures',
  'Do not enter staff-only or restricted areas',
  'Follow any signs posted by farm staff',
]

const aiReasons = ['Matches learning interest', 'Close to Visitor Center', 'Fits visit time', 'Prepares for tasting']

function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn('rounded-[18px] border border-[#e8e1d3] bg-white shadow-[0_1px_2px_rgba(42,36,32,0.03)]', className)}>{children}</section>
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="text-[11px] font-medium uppercase leading-4 tracking-[0.5px] text-[#8a7a63]">{children}</p>
}

function SoftBadge({ children, tone = 'sand' }: { children: ReactNode; tone?: 'sand' | 'green' | 'red' }) {
  const toneClass = {
    sand: 'border-[#e8e1d3] bg-[#f2ede4] text-[#6b6359]',
    green: 'border-[#b4d4cb] bg-[#e1efeb] text-[#3e7f74]',
    red: 'border-[#f0c4b4] bg-[#fbe4dc] text-[#c04a2b]',
  }[tone]

  return <span className={cn('inline-flex h-6 items-center rounded-full border px-3 text-xs font-medium leading-[18px]', toneClass)}>{children}</span>
}

function StopContextHeader() {
  return (
    <Panel className="p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#c04a2b]" />
          <SectionLabel>Current Stop · Stop 2 of 4</SectionLabel>
        </div>
        <span className="inline-flex h-[22px] w-fit items-center gap-1.5 rounded-full border border-[#e8e1d3] bg-[#f2ede4] px-3 text-[11px] font-medium text-[#8a7a63]">
          <Route size={11} />
          Opened from your live route
        </span>
      </div>

      <h1 className="mt-3 text-[22px] font-semibold leading-[30px] text-[#2a2420]">Greenhouse Route</h1>
      <p className="mt-0.5 text-[15px] leading-[22px] text-[#6b6359]">Growing greenhouses · North & central area</p>

      <div className="mt-5 grid grid-cols-4 items-start gap-0">
        {routeSteps.map((step, index) => {
          const isDone = step.state === 'done'
          const isCurrent = step.state === 'current'
          const isNext = step.state === 'next'

          return (
            <div className="relative flex min-h-[60px] flex-col items-center gap-1" key={step.label}>
              {index < routeSteps.length - 1 ? (
                <span
                  className={cn(
                    'absolute left-1/2 top-3 h-0.5 w-full rounded-full',
                    isDone ? 'bg-[#3e7f74]' : 'bg-[#e8e1d3]',
                  )}
                />
              ) : null}
              <span
                className={cn(
                  'relative z-10 inline-flex h-[26px] w-[26px] items-center justify-center rounded-full text-[11px] font-semibold',
                  isDone && 'bg-[#3e7f74] text-white',
                  isCurrent && 'bg-[#c04a2b] text-white',
                  isNext && 'border border-[#c04a2b] bg-white text-[#c04a2b]',
                  step.state === 'upcoming' && 'border border-[#e8e1d3] bg-white text-[#8a7a63]',
                )}
              >
                {isDone ? <Check size={11} /> : index + 1}
              </span>
              <span
                className={cn(
                  'relative z-10 max-w-[72px] text-center text-[10px] font-medium leading-[15px]',
                  isDone && 'text-[#3e7f74]',
                  isCurrent && 'text-[#c04a2b]',
                  !isDone && !isCurrent && 'text-[#8a7a63]',
                )}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </Panel>
  )
}

function StopHeroCard() {
  return (
    <Panel className="overflow-hidden p-[1px]">
      <div className="relative h-[200px] overflow-hidden rounded-t-[17px]">
        <img alt="Visitor path inside the greenhouse route" className="h-full w-full object-cover" src={stopDetailHero} />
        <span className="absolute left-4 top-4 inline-flex h-[30px] items-center gap-1.5 rounded-full bg-[#3e7f74] px-3 text-xs font-medium text-white shadow-sm">
          <MapPin size={12} />
          You have arrived
        </span>
        <span className="absolute right-4 top-4 inline-flex h-[30px] items-center gap-1.5 rounded-full border border-[#e8e1d3] bg-[rgba(255,255,255,0.9)] px-3 text-xs font-medium text-[#6b6359]">
          <Clock size={13} />
          12 min at stop
        </span>
      </div>
      <div className="space-y-3 px-6 pb-4 pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <SoftBadge>Learn</SoftBadge>
          <SoftBadge>8 Bays</SoftBadge>
          <SoftBadge>Photo spot</SoftBadge>
          <SoftBadge tone="red">
            <Clock size={12} />
            <span className="ml-1">Open · 12 min</span>
          </SoftBadge>
        </div>
        <div className="flex items-start gap-2 rounded-[9px] border border-[#e8e1d3] bg-[#f2ede4] px-3 py-2 text-[11px] leading-[16.5px] text-[#8a7a63]">
          <MapPin className="mt-0.5 shrink-0 text-[#c48b47]" size={13} />
          <p>
            <span className="font-medium text-[#6b6359]">Landmark:</span> Follow the green visitor path markers at the greenhouse entrance.
            Bays 1-8 are marked with signs.
          </p>
        </div>
      </div>
    </Panel>
  )
}

function ObserveAndDoCard() {
  return (
    <Panel className="p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <SectionLabel>At this stop</SectionLabel>
          <h2 className="mt-1 text-base font-semibold leading-6 text-[#2a2420]">What you see here</h2>
        </div>
        <SoftBadge tone="green">
          <MapPin size={12} />
          <span className="ml-1">You are here</span>
        </SoftBadge>
      </div>
      <ul className="mt-3 space-y-2 border-b border-[#e8e1d3] pb-5">
        {seeItems.map((item) => (
          <li className="flex gap-2 text-[13px] leading-5 text-[#2a2420]" key={item}>
            <CheckCircle2 className="mt-[3px] shrink-0 text-[#3e7f74]" size={14} />
            {item}
          </li>
        ))}
      </ul>
      <h2 className="mt-5 text-base font-semibold leading-6 text-[#2a2420]">What to do here</h2>
      <ol className="mt-3 space-y-2">
        {doItems.map((item, index) => (
          <li className="flex gap-2 text-[13px] leading-5 text-[#2a2420]" key={item}>
            <span className="mt-[2px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#c04a2b] text-[10px] font-semibold text-white">
              {index + 1}
            </span>
            {item}
          </li>
        ))}
      </ol>
      <div className="mt-5 border-t border-[#e8e1d3] pt-3 text-[11px] leading-[16.5px] text-[#8a7a63]">
        Short on time? Focus on <span className="font-medium text-[#c04a2b]">steps 1 and 2</span> - the most visible parts.
      </div>
    </Panel>
  )
}

function PepperVarietiesCard() {
  return (
    <Panel className="p-6">
      <SectionLabel>Pepper at this stop</SectionLabel>
      <h2 className="mt-1 text-base font-semibold leading-6 text-[#2a2420]">Pepper varieties nearby</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-[10px] border border-[#e8e1d3] bg-[#f5f0e8] p-4">
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase leading-4 tracking-[0.5px] text-[#8a7a63]">
            <Flame size={13} />
            Spice level
          </div>
          <div className="mt-3 flex gap-1">
            <span className="h-1.5 w-9 rounded-full bg-[#c04a2b]" />
            <span className="h-1.5 w-9 rounded-full bg-[#e8e1d3]" />
            <span className="h-1.5 w-9 rounded-full bg-[#e8e1d3]" />
            <span className="h-1.5 w-9 rounded-full bg-[#e8e1d3]" />
            <span className="h-1.5 w-9 rounded-full bg-[#e8e1d3]" />
          </div>
          <p className="mt-3 text-sm font-semibold leading-5 text-[#2a2420]">Mild · No heat</p>
          <p className="mt-1 text-xs leading-[18px] text-[#8a7a63]">Suitable for all visitors</p>
        </div>
        <div className="rounded-[10px] border border-[#b4d4cb] bg-[#edf6f3] p-4">
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase leading-4 tracking-[0.5px] text-[#3e7f74]">
            <UsersRound size={13} />
            Suitability
          </div>
          <div className="mt-3 space-y-2">
            <span className="block rounded-full border border-[#b4d4cb] bg-[#e1efeb] px-3 py-1 text-xs font-medium text-[#3e7f74]">
              Good for beginners
            </span>
            <span className="block rounded-full border border-[#b4d4cb] bg-[#e1efeb] px-3 py-1 text-xs font-medium text-[#3e7f74]">
              Kid-friendly
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-start gap-2 rounded-[10px] border border-[#b4d4cb] bg-[#e1efeb] px-3 py-2 text-xs leading-[18px] text-[#3e7f74]">
        <Info className="mt-0.5 shrink-0" size={13} />
        These mild varieties are the same ones available at Tasting GH 1-2.
      </div>
    </Panel>
  )
}

function SafetyNoteCard() {
  return (
    <Panel className="p-6">
      <SectionLabel>Safety</SectionLabel>
      <h2 className="mt-1 text-base font-semibold leading-6 text-[#2a2420]">Safety note</h2>
      <ul className="mt-3 space-y-2">
        {safetyItems.map((item) => (
          <li className="flex gap-2 text-[13px] leading-5 text-[#2a2420]" key={item}>
            <ShieldAlert className="mt-[3px] shrink-0 text-[#c04a2b]" size={14} />
            {item}
          </li>
        ))}
      </ul>
    </Panel>
  )
}

function AIRecommendationCard() {
  return (
    <Panel className="p-6">
      <SectionLabel>AI recommendation</SectionLabel>
      <h2 className="mt-1 text-base font-semibold leading-6 text-[#2a2420]">Why this stop was recommended</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {aiReasons.map((reason) => (
          <SoftBadge key={reason} tone="green">{reason}</SoftBadge>
        ))}
      </div>
      <div className="mt-4 flex items-start gap-2 rounded-[10px] border border-[#b4d4cb] bg-[#e1efeb] px-3 py-3 text-xs leading-[18px] text-[#3e7f74]">
        <Star className="mt-0.5 shrink-0" size={13} />
        This stop was recommended because it matches your learning-focused visit, keeps the route close to the Visitor Center,
        avoids staff-only areas, and connects naturally to Tasting GH 1-2.
      </div>
    </Panel>
  )
}

function NextStopPreview() {
  return (
    <Panel className="p-6">
      <SectionLabel>What comes next</SectionLabel>
      <h2 className="mt-1 text-base font-semibold leading-6 text-[#2a2420]">Next stop preview</h2>
      <div className="mt-4 flex items-center gap-3 rounded-[10px] border border-[#e8e1d3] bg-[#f2ede4] p-3">
        <img alt="" className="h-[58px] w-[58px] rounded-[8px] object-cover" src={routeImages['tasting-gh-1-2']} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-medium uppercase leading-4 tracking-[0.5px] text-[#8a7a63]">Stop 3 of 4</span>
            <SoftBadge tone="red">Next stop</SoftBadge>
          </div>
          <h3 className="mt-1 text-[15px] font-semibold leading-[22px] text-[#2a2420]">Tasting GH 1-2</h3>
          <p className="mt-1 text-xs leading-[18px] text-[#8a7a63]">Tasting · Mild heat · 3 min walk</p>
        </div>
      </div>
      <div className="mt-3 flex items-start gap-2 rounded-[9px] border border-[#e8e1d3] bg-[#fbf8f3] px-3 py-2 text-xs leading-[18px] text-[#8a7a63]">
        <MapPin className="mt-0.5 shrink-0 text-[#c48b47]" size={13} />
        Walking cue: Walk back toward the centre path. Tasting GH 1-2 is marked with a blue sign - 3 min from here.
      </div>
    </Panel>
  )
}

function ContinueRoutePanel() {
  const { markVisited, setActiveStop, chooseManual } = useVisit()
  const navigate = useNavigate()

  const markCurrentStop = () => {
    markVisited('greenhouse-route')
  }

  const continueToTasting = () => {
    markVisited('greenhouse-route')
    setActiveStop('tasting-gh-1-2')
    navigate('/route')
  }

  const skipThisStop = () => {
    setActiveStop('tasting-gh-1-2')
    navigate('/route')
  }

  const openManualMap = () => {
    chooseManual()
    navigate('/map')
  }

  return (
    <Panel className="p-6">
      <SectionLabel>Route in progress</SectionLabel>
      <h2 className="mt-1 text-base font-semibold leading-6 text-[#2a2420]">Continue your route</h2>
      <div className="mt-4 space-y-2">
        <button
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] border border-[#c04a2b] bg-[#c04a2b] px-4 text-sm font-semibold text-white transition hover:bg-[#a63d23]"
          onClick={markCurrentStop}
          type="button"
        >
          <CheckCircle2 size={14} />
          Mark as Visited
        </button>
        <button
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-[10px] border border-[#e8e1d3] bg-white px-4 text-[13px] font-semibold text-[#2a2420] transition hover:bg-[#fbf8f3]"
          onClick={continueToTasting}
          type="button"
        >
          Continue to Tasting GH 1-2
          <ArrowRight size={14} />
        </button>
      </div>
      <p className="mt-3 flex items-center gap-2 text-[11px] leading-[16.5px] text-[#8a7a63]">
        <Info size={12} />
        Mark as visited first, then continue to the next stop.
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Link className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] border border-[#e8e1d3] bg-white text-[13px] font-medium text-[#2a2420] hover:bg-[#fbf8f3]" to="/map">
          <Map size={14} />
          Open Map
        </Link>
        <Link className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] border border-[#e8e1d3] bg-white text-[13px] font-medium text-[#2a2420] hover:bg-[#fbf8f3]" to="/route">
          <ArrowLeft size={14} />
          Back to Route
        </Link>
        <button
          className="inline-flex h-9 items-center justify-center gap-2 rounded-[9px] border border-[#e8e1d3] bg-[#fbf8f3] text-xs font-medium text-[#6b6359] hover:bg-white"
          onClick={skipThisStop}
          type="button"
        >
          <SkipForward size={13} />
          Skip This Stop
        </button>
        <button
          className="inline-flex h-9 items-center justify-center gap-2 rounded-[9px] border border-[#e8e1d3] bg-[#fbf8f3] text-xs font-medium text-[#6b6359] hover:bg-white"
          onClick={openManualMap}
          type="button"
        >
          <Shuffle size={13} />
          Choose Manually
        </button>
      </div>
    </Panel>
  )
}

function RouteProgressPanel() {
  return (
    <Panel className="p-5">
      <div className="flex items-center justify-between gap-3">
        <SectionLabel>Route Progress</SectionLabel>
        <SoftBadge tone="green">In progress</SoftBadge>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-[#8a7a63]">
        <span>Route progress</span>
        <span className="font-medium text-[#c04a2b]">2 / 4 stops</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e8e1d3]">
        <div className="h-full w-1/2 rounded-full bg-[#c04a2b]" />
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs font-medium text-[#c04a2b]">
        <Clock size={13} />
        20 min remaining
      </div>
    </Panel>
  )
}

function StopMiniCard({
  image,
  label,
  meta,
  status,
  title,
  tone = 'sand',
}: {
  image: string
  label: string
  meta: string
  status: string
  title: string
  tone?: 'sand' | 'green' | 'red'
}) {
  const wrapperClass = tone === 'red' ? 'border-[#f0c4b4] bg-[#fbe4dc]' : 'border-[#e8e1d3] bg-white'

  return (
    <div className={cn('flex gap-3 rounded-[10px] border p-2', wrapperClass)}>
      <img alt="" className="h-12 w-12 shrink-0 rounded-[8px] object-cover" src={image} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-medium uppercase leading-[15px] tracking-[0.5px] text-[#8a7a63]">{label}</span>
          <span className={cn('text-[10px] font-medium', tone === 'red' ? 'text-[#c04a2b]' : 'text-[#3e7f74]')}>{status}</span>
        </div>
        <h3 className="truncate text-[13px] font-semibold leading-5 text-[#2a2420]">{title}</h3>
        <p className="text-[11px] leading-[16.5px] text-[#8a7a63]">{meta}</p>
      </div>
    </div>
  )
}

function StopsPanelSidebar() {
  return (
    <Panel className="space-y-2 p-5">
      <StopMiniCard
        image={routeImages['visitor-center']}
        label="Previous Stop"
        meta="Info · Completed"
        status="Completed"
        title="Visitor Center"
        tone="green"
      />
      <StopMiniCard
        image={routeImages['greenhouse-route']}
        label="Current Stop"
        meta="Learn · 12 min"
        status="You are here"
        title="Greenhouse Route"
        tone="red"
      />
      <StopMiniCard
        image={routeImages['tasting-gh-1-2']}
        label="Next Stop"
        meta="Tasting · 3 min walk"
        status="Preview"
        title="Tasting GH 1-2"
      />
    </Panel>
  )
}

function SelectionRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs leading-[18px]">
      <span className="text-[#8a7a63]">{label}</span>
      <span className="font-medium text-[#2a2420]">{value}</span>
    </div>
  )
}

function SelectionsPanel() {
  return (
    <Panel className="p-5">
      <SectionLabel>Your Selections</SectionLabel>
      <div className="mt-4 space-y-2">
        <SelectionRow label="Visit style" value="Family" />
        <SelectionRow label="Spice level" value="Mild" />
        <SelectionRow label="Time remaining" value="20 min" />
        <SelectionRow label="Stops left" value="2 stops" />
        <SelectionRow label="Navigation" value="AI Recommended" />
      </div>
      <div className="mt-4 flex items-start gap-2 rounded-[10px] border border-[#b4d4cb] bg-[#e1efeb] px-3 py-3 text-[11px] leading-[16.5px] text-[#3e7f74]">
        <Compass className="mt-0.5 shrink-0" size={13} />
        AI personalises your route based on these choices.
      </div>
    </Panel>
  )
}

function QuickLink({ children, icon, to }: { children: ReactNode; icon: ReactNode; to: string }) {
  return (
    <Link className="flex h-10 items-center gap-3 rounded-[10px] px-2 text-[13px] font-medium text-[#6b6359] hover:bg-[#fbf8f3]" to={to}>
      <span className="text-[#8a7a63]">{icon}</span>
      {children}
    </Link>
  )
}

function QuickLinksPanel() {
  return (
    <Panel className="p-4">
      <QuickLink icon={<ArrowLeft size={14} />} to="/route">
        <span className="text-[#c04a2b]">Back to Live Route</span>
      </QuickLink>
      <QuickLink icon={<Map size={14} />} to="/map">View Full Map</QuickLink>
      <QuickLink icon={<List size={13} />} to="/route">View All Stops</QuickLink>
      <QuickLink icon={<HelpCircle size={16} />} to="/help">Help</QuickLink>
    </Panel>
  )
}

export function StopDetailPage() {
  return (
    <PageShell className="py-8 md:py-9">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-5 flex flex-wrap items-center gap-2 text-xs leading-[18px]">
          <Link className="inline-flex items-center gap-1 font-medium text-[#6b6359] hover:text-[#c04a2b]" to="/route">
            <ArrowLeft size={13} />
            Back to Live Route
          </Link>
          <span className="text-[#d6cdbb]">/</span>
          <span className="font-medium text-[#2a2420]">Stop 2 - Greenhouse Route</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,856px)_320px]">
          <div className="space-y-5">
            <StopContextHeader />
            <StopHeroCard />
            <ObserveAndDoCard />
            <PepperVarietiesCard />
            <SafetyNoteCard />
            <AIRecommendationCard />
            <NextStopPreview />
            <ContinueRoutePanel />
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <RouteProgressPanel />
            <StopsPanelSidebar />
            <SelectionsPanel />
            <QuickLinksPanel />
          </aside>
        </div>
      </div>
    </PageShell>
  )
}
