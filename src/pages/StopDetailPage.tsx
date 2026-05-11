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
import { Link, useNavigate, useParams } from 'react-router-dom'
import stopDetailHero from '../assets/figma/stop-detail-hero.png'
import { PageShell } from '../components/layout/PageShell'
import { getRouteStops, getStop } from '../data/helpers'
import { routeImages } from '../data/routeImages'
import { useVisit } from '../hooks/useVisit'
import type { Stop } from '../types/domain'
import { cn } from '../utils/cn'

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

function StopContextHeader({ currentStopId }: { currentStopId: string }) {
  const { visit } = useVisit()
  const routeStops = getRouteStops(visit)
  const currentIndex = Math.max(0, routeStops.findIndex((stop) => stop.id === currentStopId))
  const currentStop = routeStops[currentIndex]

  return (
    <Panel className="p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#c04a2b]" />
          <SectionLabel>Current Stop - Stop {currentIndex + 1} of {routeStops.length}</SectionLabel>
        </div>
        <span className="inline-flex h-[22px] w-fit items-center gap-1.5 rounded-full border border-[#e8e1d3] bg-[#f2ede4] px-3 text-[11px] font-medium text-[#8a7a63]">
          <Route size={11} />
          Opened from your live route
        </span>
      </div>

      <h1 className="mt-3 text-[22px] font-semibold leading-[30px] text-[#2a2420]">{currentStop.name}</h1>
      <p className="mt-0.5 text-[15px] leading-[22px] text-[#6b6359]">Growing greenhouses · North & central area</p>

      <div className="mt-5 grid items-start gap-0" style={{ gridTemplateColumns: `repeat(${routeStops.length}, minmax(0, 1fr))` }}>
        {routeStops.map((step, index) => {
          const isDone = index < currentIndex
          const isCurrent = index === currentIndex
          const isNext = index === currentIndex + 1

          return (
            <div className="relative flex min-h-[60px] flex-col items-center gap-1" key={step.id}>
              {index < routeStops.length - 1 ? (
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
                  !isDone && !isCurrent && !isNext && 'border border-[#e8e1d3] bg-white text-[#8a7a63]',
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
                {step.shortName}
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
  const { visit } = useVisit()
  const reasons = [
    `Fits ${visit.selectedDuration}`,
    `${visit.selectedMode} mode`,
    `${visit.selectedSpiceLevel} tasting comfort`,
  ]

  return (
    <Panel className="p-6">
      <SectionLabel>AI recommendation</SectionLabel>
      <h2 className="mt-1 text-base font-semibold leading-6 text-[#2a2420]">Why this stop was recommended</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {reasons.map((reason) => (
          <SoftBadge key={reason} tone="green">{reason}</SoftBadge>
        ))}
      </div>
      <div className="mt-4 flex items-start gap-2 rounded-[10px] border border-[#b4d4cb] bg-[#e1efeb] px-3 py-3 text-xs leading-[18px] text-[#3e7f74]">
        <Star className="mt-0.5 shrink-0" size={13} />
        This stop was recommended because it keeps the route close to the Visitor Center, avoids staff-only areas,
        prepares you for tasting, and can be skipped or changed at any time.
      </div>
    </Panel>
  )
}

function NextStopPreview({ currentStopId }: { currentStopId: string }) {
  const { visit } = useVisit()
  const routeStops = getRouteStops(visit)
  const currentIndex = Math.max(0, routeStops.findIndex((stop) => stop.id === currentStopId))
  const nextStop = routeStops[currentIndex + 1]

  if (!nextStop) return null

  return (
    <Panel className="p-6">
      <SectionLabel>What comes next</SectionLabel>
      <h2 className="mt-1 text-base font-semibold leading-6 text-[#2a2420]">Next stop preview</h2>
      <div className="mt-4 flex items-center gap-3 rounded-[10px] border border-[#e8e1d3] bg-[#f2ede4] p-3">
        <img alt="" className="h-[58px] w-[58px] rounded-[8px] object-cover" src={routeImages[nextStop.id]} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-medium uppercase leading-4 tracking-[0.5px] text-[#8a7a63]">Stop {currentIndex + 2} of {routeStops.length}</span>
            <SoftBadge tone="red">Next stop</SoftBadge>
          </div>
          <h3 className="mt-1 text-[15px] font-semibold leading-[22px] text-[#2a2420]">{nextStop.name}</h3>
          <p className="mt-1 text-xs leading-[18px] text-[#8a7a63]">{nextStop.type} - {nextStop.tags.slice(0, 2).join(' - ')} - {nextStop.walkingMinutesFromPrevious} min walk</p>
        </div>
      </div>
      <div className="mt-3 flex items-start gap-2 rounded-[9px] border border-[#e8e1d3] bg-[#fbf8f3] px-3 py-2 text-xs leading-[18px] text-[#8a7a63]">
        <MapPin className="mt-0.5 shrink-0 text-[#c48b47]" size={13} />
        Walking cue: continue toward {nextStop.shortName}. It is about {nextStop.walkingMinutesFromPrevious} min from here.
      </div>
    </Panel>
  )
}

function ContinueRoutePanel({ currentStopId }: { currentStopId: string }) {
  const { markVisited, setActiveStop, chooseManual, visit } = useVisit()
  const navigate = useNavigate()
  const routeStops = getRouteStops(visit)
  const currentIndex = Math.max(0, routeStops.findIndex((stop) => stop.id === currentStopId))
  const currentStop = routeStops[currentIndex]
  const nextStop = routeStops[currentIndex + 1]

  const markCurrentStop = () => {
    markVisited(currentStop.id)
  }

  const continueToTasting = () => {
    markVisited(currentStop.id)
    if (nextStop) setActiveStop(nextStop.id)
    navigate('/route')
  }

  const skipThisStop = () => {
    if (nextStop) setActiveStop(nextStop.id)
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
          onClick={continueToTasting}
          type="button"
        >
          {nextStop ? `Continue to ${nextStop.shortName}` : 'Back to Route'}
          <ArrowRight size={14} />
        </button>
        <button
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-[10px] border border-[#e8e1d3] bg-white px-4 text-[13px] font-semibold text-[#2a2420] transition hover:bg-[#fbf8f3]"
          onClick={markCurrentStop}
          type="button"
        >
          <CheckCircle2 size={14} />
          Mark as Visited
        </button>
      </div>
      <p className="mt-3 flex items-center gap-2 text-[11px] leading-[16.5px] text-[#8a7a63]">
        <Info size={12} />
        Continuing will mark this stop as visited and move you to the next route step.
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
          Skip Stop
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
        <span className="font-medium text-[#c04a2b]">3 / 5 stops</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e8e1d3]">
        <div className="h-full w-[60%] rounded-full bg-[#c04a2b]" />
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
        image={routeImages['greenhouse-entry']}
        label="Previous Stop"
        meta="Orientation · Completed"
        status="Completed"
        title="Greenhouse Entry"
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

function stopTypeLabel(stop: Stop) {
  if (stop.type === 'arrival') return 'Orientation'
  if (stop.type === 'greenhouse') return 'Greenhouse'
  if (stop.type === 'tasting') return 'Tasting'
  if (stop.type === 'shop') return 'Product Shop'
  return 'Visitor area'
}

function GenericStopDetailPage({ stopId }: { stopId: string }) {
  const { chooseManual, finishVisit, markVisited, setActiveStop, visit } = useVisit()
  const navigate = useNavigate()
  const routeStops = getRouteStops(visit)
  const stop = getStop(stopId)
  const rawStopIndex = routeStops.findIndex((item) => item.id === stop.id)
  const activeRouteIndex = Math.max(0, routeStops.findIndex((item) => item.id === visit.activeStopId))
  const isRouteStop = rawStopIndex >= 0
  const stopIndex = isRouteStop ? rawStopIndex : activeRouteIndex
  const nextStop = isRouteStop && rawStopIndex < routeStops.length - 1 ? routeStops[rawStopIndex + 1] : null
  const previousStop = isRouteStop && rawStopIndex > 0 ? routeStops[rawStopIndex - 1] : null
  const isVisited = visit.visitedStopIds.includes(stop.id)
  const progressPercent = Math.round(((stopIndex + 1) / routeStops.length) * 100)
  const routePositionLabel = isRouteStop ? `Stop ${rawStopIndex + 1} of ${routeStops.length}` : 'Optional stop'

  const continueRoute = () => {
    markVisited(stop.id)
    if (!isRouteStop) {
      navigate('/route')
      return
    }

    if (nextStop) {
      setActiveStop(nextStop.id)
      navigate('/route')
      return
    }
    finishVisit()
    navigate('/finish')
  }

  const markCurrentStop = () => {
    markVisited(stop.id)
  }

  const openManualMap = () => {
    chooseManual()
    navigate('/map')
  }

  return (
    <PageShell className="py-8 md:py-9">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-5 flex flex-wrap items-center gap-2 text-xs leading-[18px]">
          <Link className="inline-flex items-center gap-1 font-medium text-[#6b6359] hover:text-[#c04a2b]" to="/route">
            <ArrowLeft size={13} />
            Back to Live Route
          </Link>
          <span className="text-[#d6cdbb]">/</span>
          <span className="font-medium text-[#2a2420]">{routePositionLabel} - {stop.name}</span>
        </div>

        <div className="mx-auto grid max-w-[980px] gap-6 lg:grid-cols-1">
          <div className="space-y-5">
            <Panel className="p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c04a2b]" />
                  <SectionLabel>{isVisited ? 'Visited Stop' : isRouteStop ? 'Route Stop' : 'Manual Option'} - {routePositionLabel}</SectionLabel>
                </div>
                <SoftBadge tone={stop.id === visit.activeStopId ? 'red' : isVisited ? 'green' : 'sand'}>
                  {stop.id === visit.activeStopId ? 'Current stop' : isVisited ? 'Visited' : 'Preview'}
                </SoftBadge>
              </div>

              <h1 className="mt-3 text-[24px] font-semibold leading-[31px] text-[#2a2420]">{stop.name}</h1>
              <p className="mt-1 text-[15px] leading-[22px] text-[#6b6359]">{stop.description}</p>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-xs text-[#8a7a63]">
                  <span>{isRouteStop ? 'Route progress' : 'Current route progress'}</span>
                  <span className="font-medium text-[#c04a2b]">{isRouteStop ? `${rawStopIndex + 1} / ${routeStops.length}` : routePositionLabel}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#e8e1d3]">
                  <div className="h-full rounded-full bg-[#c04a2b]" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            </Panel>

            <Panel className="overflow-hidden p-[1px]">
              <div className="relative h-[220px] overflow-hidden rounded-t-[17px]">
                <img alt={`${stop.name} route stop`} className="h-full w-full object-cover" src={routeImages[stop.id] ?? stopDetailHero} />
                <span className="absolute left-4 top-4 inline-flex h-[30px] items-center gap-1.5 rounded-full bg-[#3e7f74] px-3 text-xs font-medium text-white shadow-sm">
                  <MapPin size={12} />
                  {stopTypeLabel(stop)}
                </span>
                <span className="absolute right-4 top-4 inline-flex h-[30px] items-center gap-1.5 rounded-full border border-[#e8e1d3] bg-[rgba(255,255,255,0.9)] px-3 text-xs font-medium text-[#6b6359]">
                  <Clock size={13} />
                  {stop.durationMinutes} min
                </span>
              </div>
              <div className="space-y-3 px-6 pb-5 pt-4">
                <div className="flex flex-wrap items-center gap-2">
                  {stop.tags.map((tag) => (
                    <SoftBadge key={tag}>{tag}</SoftBadge>
                  ))}
                </div>
                <div className="flex items-start gap-2 rounded-[9px] border border-[#e8e1d3] bg-[#f2ede4] px-3 py-2 text-[11px] leading-[16.5px] text-[#8a7a63]">
                  <MapPin className="mt-0.5 shrink-0 text-[#c48b47]" size={13} />
                  <p>
                    <span className="font-medium text-[#6b6359]">Walking cue:</span>{' '}
                    {previousStop ? `${stop.walkingMinutesFromPrevious} min from ${previousStop.shortName}.` : isRouteStop ? 'Start here from the visitor entrance.' : `${stop.walkingMinutesFromPrevious} min from the main visitor path. Optional stop.`}
                  </p>
                </div>
              </div>
            </Panel>

            <Panel className="p-6">
              <SectionLabel>At this stop</SectionLabel>
              <h2 className="mt-1 text-base font-semibold leading-6 text-[#2a2420]">What you see here</h2>
              <ul className="mt-3 space-y-2 border-b border-[#e8e1d3] pb-5">
                {stop.whatYouSee.map((item) => (
                  <li className="flex gap-2 text-[13px] leading-5 text-[#2a2420]" key={item}>
                    <CheckCircle2 className="mt-[3px] shrink-0 text-[#3e7f74]" size={14} />
                    {item}
                  </li>
                ))}
              </ul>
              <h2 className="mt-5 text-base font-semibold leading-6 text-[#2a2420]">What to do here</h2>
              <ol className="mt-3 space-y-2">
                {stop.whatToDo.map((item, index) => (
                  <li className="flex gap-2 text-[13px] leading-5 text-[#2a2420]" key={item}>
                    <span className="mt-[2px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#c04a2b] text-[10px] font-semibold text-white">
                      {index + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </Panel>

            <Panel className="p-6">
              <SectionLabel>Safety</SectionLabel>
              <h2 className="mt-1 text-base font-semibold leading-6 text-[#2a2420]">Safety note</h2>
              <div className="mt-3 flex gap-2 rounded-[10px] border border-[#f0d9a4] bg-[#fef3e2] px-3 py-3 text-[13px] leading-5 text-[#8a5a2b]">
                <ShieldAlert className="mt-0.5 shrink-0" size={14} />
                {stop.safetyNotes}
              </div>
            </Panel>

            <Panel className="p-6">
              <SectionLabel>AI recommendation</SectionLabel>
              <h2 className="mt-1 text-base font-semibold leading-6 text-[#2a2420]">Why this stop was recommended</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <SoftBadge tone="green">Fits {visit.selectedDuration}</SoftBadge>
                <SoftBadge tone="green">{visit.selectedMode}</SoftBadge>
                <SoftBadge tone="green">{visit.selectedSpiceLevel} comfort</SoftBadge>
                <SoftBadge tone="green">Manual override available</SoftBadge>
              </div>
              <p className="mt-3 text-xs leading-[18px] text-[#3e7f74]">
                This is a route suggestion, not a rule. You can skip this stop, open the map, or choose another stop manually.
              </p>
            </Panel>

            <Panel className="p-6">
              <SectionLabel>Route in progress</SectionLabel>
              <h2 className="mt-1 text-base font-semibold leading-6 text-[#2a2420]">{nextStop ? `Next: ${nextStop.name}` : isRouteStop ? 'Finish your visit' : 'Return to your route'}</h2>
              {nextStop ? (
                <div className="mt-4 flex items-center gap-3 rounded-[10px] border border-[#e8e1d3] bg-[#f2ede4] p-3">
                  <img alt="" className="h-[58px] w-[58px] rounded-[8px] object-cover" src={routeImages[nextStop.id]} />
                  <div className="min-w-0 flex-1">
                    <SectionLabel>Stop {routeStops.findIndex((item) => item.id === nextStop.id) + 1} of {routeStops.length}</SectionLabel>
                    <h3 className="mt-1 text-[15px] font-semibold leading-[22px] text-[#2a2420]">{nextStop.name}</h3>
                    <p className="mt-1 text-xs leading-[18px] text-[#8a7a63]">{nextStop.durationMinutes} min · {nextStop.tags.slice(0, 2).join(' · ')}</p>
                  </div>
                </div>
              ) : null}
              <div className="mt-4 space-y-2">
                <button
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] border border-[#c04a2b] bg-[#c04a2b] px-4 text-sm font-semibold text-white transition hover:bg-[#a63d23]"
                  onClick={continueRoute}
                  type="button"
                >
                  {nextStop ? `Continue to ${nextStop.shortName}` : isRouteStop ? 'Finish Visit' : 'Back to Route'}
                  <ArrowRight size={14} />
                </button>
                <button
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-[10px] border border-[#e8e1d3] bg-white px-4 text-[13px] font-semibold text-[#2a2420] transition hover:bg-[#fbf8f3]"
                  onClick={markCurrentStop}
                  type="button"
                >
                  <CheckCircle2 size={14} />
                  {isVisited ? 'Visited' : 'Mark as Visited'}
                </button>
              </div>
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
                  onClick={openManualMap}
                  type="button"
                >
                  <Shuffle size={13} />
                  Choose Manually
                </button>
              </div>
            </Panel>
          </div>

          <aside className="hidden space-y-4 lg:sticky lg:top-24 lg:self-start">
            <Panel className="p-5">
              <div className="flex items-center justify-between gap-3">
                <SectionLabel>Route Progress</SectionLabel>
                <SoftBadge tone={isVisited ? 'green' : 'red'}>{isVisited ? 'Visited' : 'Preview'}</SoftBadge>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-[#8a7a63]">
                <span>{isRouteStop ? 'Route progress' : 'Current route progress'}</span>
                <span className="font-medium text-[#c04a2b]">{isRouteStop ? `${rawStopIndex + 1} / ${routeStops.length} stops` : 'Optional stop'}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e8e1d3]">
                <div className="h-full rounded-full bg-[#c04a2b]" style={{ width: `${progressPercent}%` }} />
              </div>
            </Panel>
            <SelectionsPanel />
            <QuickLinksPanel />
          </aside>
        </div>
      </div>
    </PageShell>
  )
}

export function StopDetailPage() {
  const { stopId } = useParams()
  const { visit } = useVisit()
  const currentStopId = stopId ?? 'greenhouse-route'
  const routeStops = getRouteStops(visit)
  const greenhouseIndex = Math.max(0, routeStops.findIndex((stop) => stop.id === 'greenhouse-route'))

  if (currentStopId !== 'greenhouse-route' || visit.activeStopId !== 'greenhouse-route') {
    return <GenericStopDetailPage stopId={currentStopId} />
  }

  return (
    <PageShell className="py-8 md:py-9">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-5 flex flex-wrap items-center gap-2 text-xs leading-[18px]">
          <Link className="inline-flex items-center gap-1 font-medium text-[#6b6359] hover:text-[#c04a2b]" to="/route">
            <ArrowLeft size={13} />
            Back to Live Route
          </Link>
          <span className="text-[#d6cdbb]">/</span>
          <span className="font-medium text-[#2a2420]">Stop {greenhouseIndex + 1} - Greenhouse Route</span>
        </div>

        <div className="mx-auto grid max-w-[980px] gap-6 lg:grid-cols-1">
          <div className="space-y-5">
            <StopContextHeader currentStopId="greenhouse-route" />
            <StopHeroCard />
            <ObserveAndDoCard />
            <PepperVarietiesCard />
            <SafetyNoteCard />
            <AIRecommendationCard />
            <NextStopPreview currentStopId="greenhouse-route" />
            <ContinueRoutePanel currentStopId="greenhouse-route" />
          </div>

          <aside className="hidden space-y-4 lg:sticky lg:top-24 lg:self-start">
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
