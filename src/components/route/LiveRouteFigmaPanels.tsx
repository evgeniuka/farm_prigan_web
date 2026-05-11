import {
  ArrowRight,
  Check,
  Clock,
  HelpCircle,
  Info,
  List,
  Lock,
  Map,
  MapPin,
  Pencil,
  RefreshCw,
  Shuffle,
  SkipForward,
  Sparkles,
  Waypoints,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getNextStopId, getRouteStops } from '../../data/helpers'
import { routeImages } from '../../data/routeImages'
import { useVisit } from '../../hooks/useVisit'
import { UnifiedFarmMap } from '../map/UnifiedFarmMap'
import { useMapOverlay } from '../map/useMapOverlay'
import { Button } from '../ui/Button'

type PillTone = 'neutral' | 'red' | 'green' | 'blue' | 'gold'

const figmaLiveRoutePlan = {
  duration: '40–45 min',
  mode: 'Family / Beginner',
  spiceLevel: 'Mild',
}

const routeSummary = ['Visitor Center', 'Greenhouse Entry', 'Greenhouse Route', 'Tasting GH 1-2', 'Product Shop']

const sequenceRows = [
  {
    id: 'visitor-center',
    title: 'Visitor Center',
    status: 'Completed',
    statusTone: 'green' as const,
    tags: ['Welcome', 'Orientation', 'Info'],
    duration: '8 min',
    image: routeImages['visitor-center'],
    completed: true,
  },
  {
    id: 'greenhouse-entry',
    title: 'Greenhouse Entry',
    status: 'Completed',
    statusTone: 'green' as const,
    tags: ['Learn', 'Orientation'],
    duration: '5 min',
    image: routeImages['greenhouse-entry'],
    completed: true,
  },
  {
    id: 'greenhouse-route',
    title: 'Greenhouse Route',
    status: 'You are here',
    statusTone: 'red' as const,
    tags: ['Learn', '8 Bays', 'Photo spot'],
    duration: '12 min',
    image: routeImages['greenhouse-route'],
    current: true,
    walkCue: '↑ 3 min walk · back toward center → Tasting Point',
  },
  {
    id: 'tasting-gh-1-2',
    title: 'Tasting Point — GH 1 & 2',
    status: 'Next stop',
    statusTone: 'red' as const,
    tags: ['Tasting', 'Mild heat', 'Beginner-friendly'],
    duration: '12 min',
    image: routeImages['tasting-gh-1-2'],
    next: true,
  },
  {
    id: 'product-shop',
    title: 'Product Shop',
    status: 'Upcoming',
    statusTone: 'neutral' as const,
    tags: ['Shop', 'Final stop', 'Family-friendly'],
    duration: '8 min',
    image: routeImages['product-shop'],
  },
]

function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-[18px] border border-[#e8e1d3] bg-white ${className}`}>
      {children}
    </section>
  )
}

function TinyPill({ children, tone = 'neutral' }: { children: ReactNode; tone?: PillTone }) {
  const classes: Record<PillTone, string> = {
    neutral: 'border-[#e8e1d3] bg-[#f2ede4] text-[#6b6359]',
    red: 'border-[#f0c4b4] bg-[#fbe4dc] text-[#c04a2b]',
    green: 'border-[#b4d4cb] bg-white text-[#3e7f74]',
    blue: 'border-[#bcd0e7] bg-[#e2ecf7] text-[#3a6aa3]',
    gold: 'border-[#f0d9a4] bg-[#fef3e2] text-[#8a5a2b]',
  }

  return (
    <span className={`inline-flex h-[26px] items-center gap-1 rounded-full border px-[11px] text-xs font-medium leading-[18px] ${classes[tone]}`}>
      {children}
    </span>
  )
}

function HeaderChip({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return (
    <span className="inline-flex h-[33px] items-center gap-2 rounded-full border border-[#f0c4b4] bg-[#fbe4dc] px-3 text-[13px] font-medium leading-5 text-[#c04a2b]">
      {icon}
      {children}
    </span>
  )
}

function IconStat({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return <span className="inline-flex items-center gap-[5px] text-[13px] leading-5 text-[#8a7a63]">{icon}{children}</span>
}

function RouteContextBar() {
  const { visit } = useVisit()
  const routeStops = getRouteStops()
  const currentIndex = Math.max(0, routeStops.findIndex((stop) => stop.id === visit.activeStopId))
  const currentStop = routeStops[currentIndex]
  const nextStop = routeStops[currentIndex + 1]
  const progressPercent = Math.round(((currentIndex + 1) / routeStops.length) * 100)

  return (
    <Panel className="p-7">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase leading-4 tracking-[0.6px] text-[#c04a2b]">AI · Live Route</p>
          <h1 className="mt-3 text-[26px] font-semibold leading-[31px] text-[#2a2420]">Follow Your Route</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            <HeaderChip icon={<Clock size={13} />}>{figmaLiveRoutePlan.duration}</HeaderChip>
            <HeaderChip icon={<MapPin size={13} />}>{routeStops.length} stops</HeaderChip>
            <HeaderChip icon={<Waypoints size={13} />}>Short walks</HeaderChip>
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-[#e8e1d3] pt-4">
        <div className="mb-2.5 flex justify-between text-xs leading-[18px] text-[#8a7a63]">
          <span>Route progress</span>
          <span className="text-[#c04a2b]">Stop {currentIndex + 1} of {routeStops.length}</span>
        </div>
        <div className="h-[5px] overflow-hidden rounded-full bg-[#e8e1d3]">
          <div className="h-full bg-[#c04a2b]" style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="mt-2 grid grid-cols-5 text-center text-[10px] leading-[15px] text-[#8a7a63]">
          {['VC', 'GH Entry', 'GH Route', 'Tasting', 'Shop'].map((label, index) => (
            <div className="flex flex-col items-center gap-[3px]" key={label}>
              <span className={`h-2 w-2 rounded-full ${index <= currentIndex ? 'bg-[#3e7f74]' : 'bg-[#e8e1d3]'}`} />
              {label}
            </div>
          ))}
        </div>
      </div>

      <div className="hidden">
        <p className="text-xs leading-[18px] text-[#8a7a63]">Route sequence · {routeStops.length} stops</p>
        <p className="mt-1 text-[13px] leading-5 text-[#6b6359]">
          {routeSummary.map((item, index) => (
            <span key={item}>
              <span className={item === currentStop.name ? 'font-semibold text-[#3e7f74]' : item === nextStop?.name ? 'font-medium text-[#c04a2b]' : undefined}>
                {item}
              </span>
              {index < routeSummary.length - 1 ? <span className="px-1.5 text-[#d6cdbb]">→</span> : null}
            </span>
          ))}
        </p>
      </div>
    </Panel>
  )
}

function CurrentStopCard() {
  const { visit } = useVisit()
  const routeStops = getRouteStops()
  const currentIndex = Math.max(0, routeStops.findIndex((stop) => stop.id === visit.activeStopId))
  const currentStop = routeStops[currentIndex]
  const locationLabel = currentStop.type === 'tasting'
    ? 'Tasting Zone · Mild & Medium heat'
    : currentStop.type === 'shop'
      ? 'Product area · Exit side'
      : currentStop.type === 'arrival'
        ? 'Main entrance · Visitor area'
        : 'Greenhouse Zone · West side'

  return (
    <Panel className="p-6">
      <div className="flex gap-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#3e7f74] text-white">
          <Check size={15} />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase leading-4 tracking-[0.5px] text-[#3e7f74]">You are here · Stop {currentIndex + 1} of {routeStops.length}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h2 className="text-[22px] font-semibold leading-[27px] text-[#2a2420]">{currentStop.name}</h2>
            <TinyPill tone="blue">Accessible</TinyPill>
          </div>
          <div className="mt-2 flex flex-wrap gap-4">
            <IconStat icon={<MapPin size={12} />}>{locationLabel}</IconStat>
            <IconStat icon={<Clock size={12} />}>{currentStop.durationMinutes} min · Active stop</IconStat>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {currentStop.tags.map((tag) => (
              <TinyPill key={tag}>{tag}</TinyPill>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  )
}

function NextStopHeroCard() {
  const { continueToNextStop, skipStop, chooseManual, finishVisit, shortenRoute, visit } = useVisit()
  const navigate = useNavigate()
  const { openMap } = useMapOverlay()
  const routeStops = getRouteStops()
  const currentIndex = Math.max(0, routeStops.findIndex((stop) => stop.id === visit.activeStopId))
  const currentStop = routeStops[currentIndex]
  const nextStop = routeStops[currentIndex + 1]
  const hasNextStop = Boolean(nextStop)

  const continueRoute = () => {
    if (!hasNextStop) {
      finishVisit()
      navigate('/finish')
      return
    }

    continueToNextStop()
    navigate('/route')
  }

  return (
    <section className="overflow-hidden rounded-[18px] border-2 border-[#c04a2b] bg-white">
      <div className="flex h-10 items-center justify-between bg-[#c04a2b] px-6 text-white">
        <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase leading-4 tracking-[0.6px]">
          <span className="h-[7px] w-[7px] rounded-full bg-white" />
          Next on your route
        </span>
        <span className="inline-flex h-[22px] items-center gap-1 rounded-full bg-white/20 px-2.5 text-[11px] font-medium leading-4">
          <Waypoints size={11} />
          {nextStop ? `${nextStop.walkingMinutesFromPrevious} min walk` : 'Final stop'}
        </span>
      </div>

      <div className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase leading-4 tracking-[0.5px] text-[#a03a1e]">{nextStop ? `Stop ${nextStop.order} of ${routeStops.length}` : 'Route complete'}</p>
            <div className="mt-0.5 flex flex-wrap items-center gap-2">
              <h2 className="text-[22px] font-semibold leading-[26px] text-[#2a2420]">{nextStop?.name ?? 'Finish Visit'}</h2>
              <TinyPill tone="red">{nextStop?.type === 'shop' ? 'Final stop' : nextStop?.type === 'tasting' ? 'Tasting' : 'Next stop'}</TinyPill>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(nextStop?.tags ?? ['Summary']).slice(0, 3).map((tag) => (
                <TinyPill key={tag} tone={tag.includes('Mild') || tag.includes('Family') ? 'gold' : 'neutral'}>{tag}</TinyPill>
              ))}
              <TinyPill tone="blue">Accessible</TinyPill>
            </div>
            <div className="mt-3 flex flex-wrap gap-4">
              <IconStat icon={<Waypoints size={12} />}>{nextStop ? `${nextStop.walkingMinutesFromPrevious} min walk from here` : 'No more walking'}</IconStat>
              <IconStat icon={<Clock size={12} />}>{nextStop ? `${nextStop.durationMinutes} min at stop` : 'Visit summary'}</IconStat>
              <IconStat icon={<MapPin size={12} />}>{nextStop ? nextStop.description : 'Review saved peppers and finish'}</IconStat>
            </div>
          </div>

        </div>

        <div className="hidden">
          <div className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#3e7f74] text-white">
              <Sparkles size={13} />
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold leading-5 text-[#2a2420]">Recommended because</p>
              <p className="mt-1 text-[13px] leading-5 text-[#4a6359]">
                {nextStop
                  ? `This next stop follows naturally after ${currentStop.shortName}, fits your visit time, and keeps the route visitor-friendly.`
                  : 'You have reached the final route step. Finish the visit to review your saved peppers and completed stops.'}
              </p>
            </div>
          </div>
        </div>

        <div className="hidden">
          <p className="text-xs font-semibold uppercase leading-[18px] tracking-[0.3px] text-[#6b6359]">Why this stop?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {['Matches spice comfort', 'Closest to you', 'Fits visit time', 'No long walk'].map((label) => (
              <TinyPill key={label} tone="green"><Check size={11} /> {label}</TinyPill>
            ))}
          </div>
        </div>

        <div className="mt-5 flex gap-2 rounded-[10px] border border-[#e8e1d3] bg-[#f2ede4] px-4 py-3 text-xs leading-[18px] text-[#6b6359]">
          <MapPin className="mt-0.5 shrink-0 text-[#8a5a2b]" size={14} />
          <p>
            <span className="font-semibold text-[#8a5a2b]">Walking cue: </span>
            {nextStop
              ? `${nextStop.walkingMinutesFromPrevious} min from ${currentStop.shortName}. Follow visitor signs and avoid restricted staff paths.`
              : 'You can finish now or return to any previous screen from My Visit.'}
          </p>
        </div>

        <Button
          className="mt-5 h-12 w-full rounded-[12px] bg-[#c04a2b] text-[15px]"
          icon={<ArrowRight size={16} />}
          onClick={continueRoute}
        >
          {nextStop ? `Continue to ${nextStop.shortName}` : 'Finish Visit'}
        </Button>

        <div className="mt-2.5 grid gap-2 md:grid-cols-2">
          <Button className="h-10 rounded-[10px] bg-[#fbf8f3] text-[13px] font-medium text-[#6b6359]" icon={<Map size={14} />} onClick={() => navigate(`/stops/${nextStop?.id ?? currentStop.id}`)} tone="secondary">
            Open Stop Details
          </Button>
          <Button className="h-10 rounded-[10px] bg-[#fbf8f3] text-[13px] font-medium text-[#6b6359]" icon={<SkipForward size={14} />} onClick={() => { skipStop(); navigate('/route') }} tone="secondary">
            Skip Stop
          </Button>
          <Button className="h-10 rounded-[10px] bg-[#fbf8f3] text-[13px] font-medium text-[#6b6359]" icon={<Shuffle size={14} />} onClick={() => { chooseManual(); openMap(nextStop?.id ?? currentStop.id) }} tone="secondary">
            Choose Manually
          </Button>
          <Button className="h-10 rounded-[10px] bg-[#fbf8f3] text-[13px] font-medium text-[#6b6359]" icon={<RefreshCw size={14} />} onClick={() => { shortenRoute(); navigate('/route') }} tone="secondary">
            Shorten Route
          </Button>
        </div>
      </div>
    </section>
  )
}

function RouteSequenceCard() {
  const { setActiveStop, visit } = useVisit()
  const navigate = useNavigate()
  const routeStops = getRouteStops()
  const currentIndex = Math.max(0, routeStops.findIndex((stop) => stop.id === visit.activeStopId))
  const rows = sequenceRows.map((row) => {
    const routeIndex = routeStops.findIndex((stop) => stop.id === row.id)
    const completed = visit.visitedStopIds.includes(row.id) || routeIndex < currentIndex
    const current = row.id === visit.activeStopId
    const next = routeIndex === currentIndex + 1

    return {
      ...row,
      completed,
      current,
      next,
      status: current ? 'You are here' : next ? 'Next stop' : completed ? 'Completed' : 'Upcoming',
      statusTone: current || next ? 'red' as const : completed ? 'green' as const : 'neutral' as const,
      walkCue: current ? `${row.duration} here · next route step stays visible below` : undefined,
    }
  })

  return (
    <Panel className="p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase leading-4 tracking-[0.5px] text-[#8a7a63]">Route Sequence · {routeStops.length} stops</p>
          <p className="mt-1 text-[13px] leading-5 text-[#6b6359]">
            {routeStops.map((stop, index) => (
              <span key={stop.id}>
                <span className={index < currentIndex ? 'text-[#3e7f74]' : index === currentIndex ? 'font-semibold text-[#3e7f74]' : index === currentIndex + 1 ? 'font-semibold text-[#c04a2b]' : undefined}>
                  {stop.name}
                </span>
                {index < routeStops.length - 1 ? <span className="px-1.5 text-[#d6cdbb]">→</span> : null}
              </span>
            ))}
          </p>
        </div>
        <span className="text-xs leading-[18px] text-[#8a7a63]">Total walk ~10 min · 450 m</span>
      </div>

      <div>
        {rows.map((row, index) => (
          <div className={`grid gap-4 ${row.current ? 'min-h-[116px]' : 'min-h-[85px]'} grid-cols-[30px_minmax(0,1fr)]`} key={row.id}>
            <div className="flex flex-col items-center">
              <span
                className={`flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 text-xs font-bold ${
                  row.completed
                    ? 'border-[#3e7f74] bg-[#3e7f74] text-white'
                    : row.current
                      ? 'border-[#c04a2b] bg-[#c04a2b] text-white'
                      : row.next
                        ? 'border-[#c04a2b] bg-white text-[#c04a2b]'
                        : 'border-[#d6cdbb] bg-white text-[#6b6359]'
                }`}
              >
                {row.completed ? <Check size={13} /> : index + 1}
              </span>
              {index < sequenceRows.length - 1 ? (
                <span className={`mt-0.5 h-7 w-0.5 ${row.completed ? 'bg-[#3e7f74]' : 'bg-[#e8e1d3]'}`} />
              ) : null}
            </div>

            <article
              className={`mb-2 overflow-hidden rounded-[12px] ${
                row.current
                  ? 'border-2 border-[#c04a2b] bg-white shadow-sm'
                  : row.next
                    ? 'border-2 border-[#f0c4b4] bg-[#fff8f5]'
                    : 'border border-[#e8e1d3] bg-white'
              } ${row.completed ? 'opacity-75' : ''}`}
            >
              <div className="flex items-center gap-3 p-3">
                <img alt="" className={`h-[42px] w-14 shrink-0 rounded-lg object-cover ${row.completed ? 'opacity-60' : ''}`} src={row.image} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className={`text-sm font-semibold leading-[21px] ${row.completed ? 'text-[#8a7a63] line-through' : 'text-[#2a2420]'}`}>{row.title}</h3>
                    <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium leading-4 ${
                      row.statusTone === 'green'
                        ? 'border-[#b4d4cb] bg-[#e1efeb] text-[#3e7f74]'
                        : row.statusTone === 'red'
                          ? 'border-[#f0c4b4] bg-[#fbe4dc] text-[#c04a2b]'
                          : 'border-[#e8e1d3] bg-[#f2ede4] text-[#8a7a63]'
                    }`}>
                      {row.status}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    {row.tags.map((tag) => <TinyPill key={tag}>{tag}</TinyPill>)}
                    <span className="ml-auto inline-flex items-center gap-1 text-xs leading-[18px] text-[#8a7a63]">
                      <Clock size={11} />
                      {row.duration}
                    </span>
                  </div>
                </div>
                <button
                  className="hidden h-[26px] shrink-0 items-center gap-1 rounded-full border border-[#e8e1d3] px-3 text-[11px] font-medium text-[#8a7a63] sm:inline-flex"
                  onClick={() => {
                    setActiveStop(row.id)
                    navigate(`/stops/${row.id}`)
                  }}
                  type="button"
                >
                  Open
                </button>
              </div>
              {row.walkCue ? (
                <div className="border-t border-[#f0c4b4]/50 bg-[#fbe4dc]/40 px-3 py-1.5 text-[11px] leading-4 text-[#a03a1e]">
                  {row.walkCue}
                </div>
              ) : null}
            </article>
          </div>
        ))}
      </div>

    </Panel>
  )
}

export function LegacyLiveRouteMapPanel() {
  return (
    <Panel className="overflow-hidden">
      <div className="flex h-[55px] items-center justify-between border-b border-[#e8e1d3] px-[18px]">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#c04a2b]" />
          <h2 className="text-[13px] font-semibold leading-5 text-[#2a2420]">Route Map</h2>
          <span className="text-[11px] leading-4 text-[#8a7a63]">· Stop 3 of 5</span>
        </div>
        <div className="inline-flex h-[30px] rounded-full bg-[#f2ede4] p-[3px]">
          <Link className="inline-flex h-6 items-center gap-1 rounded-full bg-white px-2 text-xs font-medium text-[#2a2420] shadow-sm" to="/map">
            <Map size={11} />
            Map
          </Link>
          <Link className="inline-flex h-6 items-center gap-1 rounded-full px-2 text-xs font-medium text-[#8a7a63]" to="/route">
            <List size={11} />
            List
          </Link>
        </div>
      </div>

      <div className="relative h-[280px] overflow-hidden bg-[#f0ebe0]">
        <svg className="h-full w-full" viewBox="0 0 318 280" role="img" aria-label="Live schematic map showing current and next stop">
          <rect fill="#f0ebe0" height="280" width="318" />
          <rect fill="#e7f0d9" height="202" rx="10" stroke="#9ebc76" width="140" x="14" y="34" />
          <text fill="#3f8a4a" fontSize="8" textAnchor="middle" x="84" y="47">Greenhouse Zone</text>
          <text fill="#3f8a4a" fontSize="7" textAnchor="middle" x="84" y="58">Bays 1–8 · Active</text>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((row) => (
            <rect fill="#cfe6b7" height="14" key={row} rx="3" stroke="#8eb26e" width="104" x="22" y={73 + row * 19} />
          ))}
          <rect fill="#f5d8d2" height="77" rx="6" stroke="#d88977" width="126" x="174" y="20" />
          <text fill="#c04a2b" fontSize="8" fontWeight="700" textAnchor="middle" x="237" y="42">⚠ Staff / Restricted Area</text>
          <text fill="#c04a2b" fontSize="7" textAnchor="middle" x="237" y="56">No visitor access</text>
          <rect fill="#fff4d8" height="28" rx="5" stroke="#d6cdbb" width="90" x="190" y="112" />
          <text fill="#8a7a63" fontSize="7" textAnchor="middle" x="235" y="130">Parking · 3 min</text>
          <rect fill="#ffffff" height="48" rx="7" stroke="#d6cdbb" width="126" x="174" y="150" />
          <text fill="#2a2420" fontSize="8" fontWeight="700" textAnchor="middle" x="237" y="169">Visitor Center</text>
          <text fill="#3e7f74" fontSize="7" textAnchor="middle" x="237" y="184">✓ Completed · Stop 1</text>
          <rect fill="#fff8f5" height="56" rx="7" stroke="#f0c4b4" width="126" x="174" y="207" />
          <text fill="#c04a2b" fontSize="8" fontWeight="700" textAnchor="middle" x="237" y="226">Tasting Point — GH 1 & 2</text>
          <text fill="#8a5a2b" fontSize="7" textAnchor="middle" x="237" y="240">Mild heat · Beginner-friendly</text>
          <text fill="#6b6359" fontSize="7" textAnchor="middle" x="237" y="252">Accessible · 3 min walk from here</text>
          <path d="M96 150 C122 168, 155 206, 174 232" fill="none" stroke="#c04a2b" strokeDasharray="5 4" strokeLinecap="round" strokeWidth="3" />
          <circle cx="96" cy="150" fill="#c04a2b" r="13" stroke="#ffffff" strokeWidth="3" />
          <text fill="#ffffff" fontSize="8" fontWeight="700" textAnchor="middle" x="96" y="148">▶ You are here</text>
          <text fill="#ffffff" fontSize="7" textAnchor="middle" x="96" y="158">GH Route</text>
          <circle cx="22" cy="82" fill="#3e7f74" r="5" />
          <text fill="#ffffff" fontSize="6" textAnchor="middle" x="22" y="85">✓</text>
          <circle cx="22" cy="101" fill="#3e7f74" r="5" />
          <text fill="#ffffff" fontSize="6" textAnchor="middle" x="22" y="104">✓</text>
          <circle cx="300" cy="234" fill="#c04a2b" r="7" />
          <text fill="#ffffff" fontSize="7" fontWeight="700" textAnchor="middle" x="300" y="237">4</text>
        </svg>
        <Link className="absolute right-3 top-2.5 inline-flex h-[26px] items-center gap-1 rounded-lg border border-[#e8e1d3] bg-white px-3 text-[11px] font-medium text-[#6b6359] shadow-sm" to="/map">
          <Map size={11} />
          Open Map
        </Link>
      </div>

      <div className="grid min-h-[63px] grid-cols-3 gap-y-2 border-t border-[#e8e1d3] px-4 py-2.5 text-[10px] leading-[15px] text-[#8a7a63]">
        <span className="inline-flex items-center gap-[5px]"><span className="h-[9px] w-[9px] rounded-full bg-[#3e7f74]" />Completed</span>
        <span className="inline-flex items-center gap-[5px]"><span className="h-[9px] w-[9px] rounded-full bg-[#c04a2b]" />You are here</span>
        <span className="inline-flex items-center gap-[5px]"><span className="h-[9px] w-[9px] rounded-full border border-[#c04a2b] bg-white" />Next stop</span>
        <span className="inline-flex items-center gap-[5px]"><span className="h-[9px] w-[9px] rounded-full border border-[#e8e1d3] bg-white" />Upcoming</span>
      </div>

      <div className="mx-3.5 mb-3 flex min-h-[51px] items-center gap-2 rounded-lg border border-[#f0d9a4] bg-[#fef3e2] px-3 text-[11px] leading-4 text-[#8a5a2b]">
        <Info size={13} />
        Location may be approximate inside greenhouse areas.
      </div>
    </Panel>
  )
}

function NearbyStopsPanel() {
  const rows = [
    { id: 'visitor-center', title: 'Visitor Center', icon: <Check size={12} />, label: 'Completed', tone: 'green' as const, meta: 'Info · 2 min', to: '/stops/visitor-center' },
    { id: 'tasting-gh-1-2', title: 'Tasting GH 1–2', icon: <MapPin size={12} />, label: 'Mild · Next stop', tone: 'red' as const, meta: 'Tasting · 3 min', to: '/stops/tasting-gh-1-2' },
    { id: 'tasting-gh-3-4', title: 'Tasting GH 3–4', icon: <MapPin size={12} />, label: 'Hot · Optional', tone: 'gold' as const, meta: 'Tasting · 5 min' },
    { id: 'product-shop', title: 'Product Shop', icon: <MapPin size={12} />, label: 'Stop 5', tone: 'neutral' as const, meta: 'Shop · 7 min', to: '/stops/product-shop' },
    { id: 'restricted', title: 'Production Greenhouses', icon: <Lock size={12} />, label: 'Restricted', tone: 'red' as const, meta: 'Staff' },
  ]

  return (
    <Panel className="overflow-hidden">
      <h2 className="border-b border-[#e8e1d3] px-[18px] py-3 text-sm font-semibold leading-5 text-[#2a2420]">Nearby Stops</h2>
      <div className="divide-y divide-[#e8e1d3]">
        {rows.map((row) => (
          <div className="flex min-h-[68px] items-center gap-3 px-3.5 py-2.5" key={row.id}>
            <span className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full ${
              row.tone === 'green'
                ? 'bg-[#3e7f74] text-white'
                : row.tone === 'red'
                  ? 'bg-[#fbe4dc] text-[#c04a2b]'
                  : 'bg-[#f2ede4] text-[#8a7a63]'
            }`}>
              {row.icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold leading-5 text-[#2a2420]">{row.title}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs leading-[18px] text-[#8a7a63]">
                <span>{row.meta}</span>
                <TinyPill tone={row.tone}>{row.label}</TinyPill>
              </div>
            </div>
            {row.to ? (
              <Link className="inline-flex h-6 items-center rounded-lg bg-[#fbf8f3] px-2.5 text-[11px] font-medium text-[#6b6359]" to={row.to}>View</Link>
            ) : null}
          </div>
        ))}
      </div>
    </Panel>
  )
}

function AIAdaptationPanel() {
  return (
    <section className="rounded-[16px] border border-[#b4d4cb] bg-[#e1efeb] p-[18px]">
      <div className="flex items-center gap-2.5">
        <span className="flex h-[26px] w-[26px] items-center justify-center rounded-lg bg-[#3e7f74] text-white">
          <Info size={13} />
        </span>
        <h2 className="text-[13px] font-semibold leading-5 text-[#2a2420]">How the route is adapted</h2>
      </div>
      <p className="mt-3 text-xs leading-[19px] text-[#4a6359]">
        Prigan Guide uses your selected time, spice comfort, and interests to suggest the next stop. You can override any suggestion.
      </p>
      <ul className="mt-3 space-y-1.5 text-[11px] leading-4 text-[#3e7f74]">
        {['Based on your visit preferences', 'Updated when you skip or shorten the route', 'Manual mode is always available'].map((item) => (
          <li className="flex gap-2" key={item}><Check size={11} /> {item}</li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] leading-4 text-[#4a6359]">Location may be approximate inside greenhouse area.</p>
    </section>
  )
}

function SelectionsSummary() {
  const { visit } = useVisit()
  const { openMap } = useMapOverlay()
  const rows = [
    ['Total duration', figmaLiveRoutePlan.duration],
    ['Stops', '4 main stops'],
    ['Total walk', '~10 min · 450 m'],
    ['Visit mode', figmaLiveRoutePlan.mode],
    ['Spice level', figmaLiveRoutePlan.spiceLevel],
    ['Route type', 'AI Recommended'],
  ]

  return (
    <Panel className="overflow-hidden">
      <h2 className="border-b border-[#e8e1d3] px-[18px] py-3 text-[13px] font-semibold leading-4 text-[#2a2420]">Your Selections</h2>
      <dl className="space-y-2.5 px-[18px] py-3.5">
        {rows.map(([label, value]) => (
          <div className="flex justify-between gap-3 text-xs leading-5" key={label}>
            <dt className="text-[#8a7a63]">{label}</dt>
            <dd className="text-right font-semibold text-[#2a2420]">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="grid gap-1.5 border-t border-[#e8e1d3] px-3.5 py-3">
        <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#e8e1d3] bg-[#fbf8f3] px-3 text-left text-xs font-medium text-[#6b6359]" onClick={() => openMap(visit.activeStopId)} type="button"><Map size={13} /> Open Map</button>
        <Link className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#e8e1d3] bg-[#fbf8f3] px-3 text-xs font-medium text-[#6b6359]" to="/route"><List size={13} /> View All Stops</Link>
        <Link className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#e8e1d3] bg-[#fbf8f3] px-3 text-xs font-medium text-[#6b6359]" to="/help"><HelpCircle size={13} /> Help</Link>
      </div>
    </Panel>
  )
}

function ControlAction({ icon, onClick, primary, title, to }: { icon: ReactNode; onClick?: () => void; primary?: boolean; title: string; to?: string }) {
  const className = `flex min-h-[52px] items-center gap-2.5 rounded-[12px] border p-[15px] text-left ${
    primary
      ? 'border-[#f0c4b4] bg-[#fbe4dc] text-[#c04a2b]'
      : 'border-[#e8e1d3] bg-[#fbf8f3] text-[#2a2420]'
  }`
  const content = (
    <>
      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${primary ? 'bg-[#fbe4dc]' : 'bg-[#f2ede4]'}`}>{icon}</span>
      <span>
        <span className="block text-[13px] font-medium leading-5">{title}</span>
      </span>
    </>
  )

  if (onClick) {
    return <button className={className} onClick={onClick} type="button">{content}</button>
  }

  return <Link className={className} to={to ?? '/route'}>{content}</Link>
}

function ControlPanel() {
  const { chooseManual, visit } = useVisit()
  const { openMap } = useMapOverlay()

  return (
    <Panel className="p-5">
      <p className="mb-3 text-[11px] font-semibold uppercase leading-4 tracking-[0.4px] text-[#8a7a63]">Your Control · Adjust or replace this route</p>
      <div className="grid gap-2.5 md:grid-cols-2">
        <ControlAction icon={<Pencil size={14} />} primary title="Edit Preferences" to="/planner" />
        <ControlAction icon={<Map size={14} />} onClick={() => openMap(visit.activeStopId)} title="Open Map" />
        <ControlAction icon={<Shuffle size={14} />} onClick={() => { chooseManual(); openMap(visit.activeStopId) }} title="Choose Manually" />
        <ControlAction icon={<RefreshCw size={14} />} title="Alternative Route" to="/recommended" />
      </div>
    </Panel>
  )
}

export function LiveRouteFigmaPanels() {
  const { visit } = useVisit()
  const { openMap } = useMapOverlay()

  if (visit.activeStopId !== 'greenhouse-route' && !getNextStopId(visit.activeStopId)) {
    return null
  }

  return (
    <div className="grid gap-7 lg:grid-cols-[minmax(0,868px)_320px] lg:items-start">
      <div className="space-y-5">
        <RouteContextBar />
        <CurrentStopCard />
        <NextStopHeroCard />
        <RouteSequenceCard />
        <ControlPanel />
      </div>
      <aside className="space-y-5">
        <UnifiedFarmMap
          activeStopId={visit.activeStopId}
          onOpenMap={() => openMap(visit.activeStopId)}
          showControls={false}
          showLegend={false}
          showSafetyNote={false}
          statusLabel="Stop 3 of 5"
          title="Route Map"
          variant="compact"
        />
        <NearbyStopsPanel />
        <div className="hidden">
          <AIAdaptationPanel />
          <SelectionsSummary />
        </div>
      </aside>
    </div>
  )
}
