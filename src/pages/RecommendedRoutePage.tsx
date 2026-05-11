import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Eye,
  Footprints,
  Info,
  Leaf,
  MapPin,
  Pencil,
  Plus,
  RotateCcw,
  Shuffle,
  Sparkles,
  UsersRound,
  X,
} from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { PageShell } from '../components/layout/PageShell'
import { UnifiedFarmMap } from '../components/map/UnifiedFarmMap'
import { useMapOverlay } from '../components/map/useMapOverlay'
import { buildAdaptiveRoute, isLockedRouteStop } from '../data/adaptiveRoute'
import { getOptionalStops, getRouteStops, getStop } from '../data/helpers'
import { routeImages } from '../data/routeImages'
import { routeAlternatives } from '../data/routes'
import { useVisit } from '../hooks/useVisit'
import type { Stop, UserVisit } from '../types/domain'

const displayDuration = (duration: string) => (duration === '40-45 min' ? '40-45 min' : duration)
const displayMode = (mode: string) => (mode === 'Family / Beginner-friendly' ? 'Family / Beginner' : mode)

function routeStopLocation(stop: Stop) {
  const locations: Record<string, string> = {
    'visitor-center': 'Main entrance - right side of farm',
    'greenhouse-entry': 'Greenhouse zone - visitor orientation',
    'greenhouse-route': 'Greenhouse zone - 8 bays - west side',
    'tasting-gh-1-2': 'Tasting zone - mild and medium heat',
    'product-shop': 'Exit zone - final stop',
  }

  return locations[stop.id] ?? stop.type
}

function routeStopBadge(stop: Stop, index: number) {
  if (index === 0) return 'Start here'
  if (stop.id === 'greenhouse-entry') return 'Orientation'
  if (stop.id === 'greenhouse-route') return 'Key learning stop'
  if (stop.type === 'tasting') return 'Tasting'
  if (stop.type === 'shop') return 'Final stop'
  return null
}

function routeWalkAfter(index: number, routeStops: Stop[]) {
  const nextStop = routeStops[index + 1]
  if (!nextStop) return null

  return `~${nextStop.walkingMinutesFromPrevious} min walk - to ${nextStop.shortName}`
}

function totalWalkMinutes(routeStops: Stop[]) {
  return routeStops.reduce((sum, stop) => sum + stop.walkingMinutesFromPrevious, 0)
}

function buildWhyChips(visit: UserVisit) {
  return buildAdaptiveRoute(visit).recommendedBecause
}

function FitDots({ small = false }: { small?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${small ? 'ml-2' : 'mt-1'}`}>
      {[0, 1, 2, 3].map((dot) => (
        <span className={`${small ? 'h-[7px] w-[7px]' : 'h-1.5 w-1.5'} rounded-full bg-[#3e7f74]`} key={dot} />
      ))}
    </span>
  )
}

function HeroChip({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <span className="inline-flex h-[34px] items-center gap-2 rounded-full border border-[#f0c4b4] bg-[#fbe4dc] px-3 text-[13px] font-medium leading-5 text-[var(--terracotta)]">
      {icon}
      {children}
    </span>
  )
}

function RouteSummaryHero({
  routeDurationMinutes,
  routeName,
  isStaticMode,
  isCustomRoute,
  onAccept,
  routeStops,
  visit,
}: {
  routeDurationMinutes: number
  routeName: string
  isStaticMode: boolean
  isCustomRoute: boolean
  onAccept: () => void
  routeStops: Stop[]
  visit: UserVisit
}) {
  const firstStop = routeStops[0]

  return (
    <section className="rounded-[18px] border border-[#e8e1d3] bg-white p-6">
      <p className="text-[11px] font-medium uppercase leading-4 tracking-[0.6px] text-[var(--terracotta)]">
        {isStaticMode ? 'Static Route Baseline' : isCustomRoute ? 'Manual Route' : 'AI - Recommended Route'}
      </p>
      <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-[26px] font-semibold leading-[31px] text-[#2a2420]">{isStaticMode ? 'Static Visitor Route' : routeName}</h1>
          <p className="mt-1.5 max-w-[460px] text-sm leading-[22px] text-[#6b6359]">
            {isStaticMode
              ? 'A fixed visitor route for research comparison. You can still open the map or switch to manual choices.'
              : isCustomRoute
                ? 'You adjusted this route by adding or removing stops. The map, live route, and visit summary now use this custom sequence.'
              : 'Built from your time, visit mode, and spice comfort. You can edit or override any part.'}
          </p>
        </div>
        <div className="w-[104px] rounded-[14px] border border-[#b4d4cb] bg-[#e8f2ef] px-4 py-2 text-center">
          <p className="text-[22px] font-bold leading-[22px] text-[#2a6b61]">High</p>
          <p className="mt-0.5 text-[10px] font-medium uppercase leading-[15px] tracking-[0.3px] text-[#3e7f74]">Route fit</p>
          <FitDots />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <HeroChip icon={<Clock3 size={13} />}>{routeDurationMinutes} min</HeroChip>
        <HeroChip icon={<MapPin size={13} />}>{routeStops.length} stops</HeroChip>
        <HeroChip icon={<Leaf size={13} />}>{visit.selectedSpiceLevel} tasting</HeroChip>
        <HeroChip icon={<UsersRound size={13} />}>{displayMode(visit.selectedMode)}</HeroChip>
      </div>

      <div className="mt-5 flex flex-col gap-3 rounded-xl border-2 border-[var(--terracotta)] bg-[#fbe4dc] p-4 sm:flex-row sm:items-center">
        <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-[var(--terracotta)] text-xs font-bold text-white">1</span>
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] font-medium uppercase leading-[15px] tracking-[0.5px] text-[#a03a1e]">Start at</span>
          <span className="block text-sm font-semibold leading-[21px] text-[#2a2420]">{firstStop.name}</span>
        </span>
        <button
          className="inline-flex h-[26px] shrink-0 items-center justify-center gap-1.5 rounded-full bg-[var(--terracotta)] px-3 text-xs font-semibold text-white"
          onClick={onAccept}
          type="button"
        >
          Begin here
          <ArrowRight size={13} />
        </button>
      </div>
    </section>
  )
}

function WhyThisRoute({ chips }: { chips: string[] }) {
  return (
    <section className="rounded-[18px] border border-[#b4d4cb] bg-[#e8f2ef] p-5">
      <div className="flex gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#3e7f74] text-white">
          <Sparkles size={15} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-semibold leading-[21px] text-[#2a2420]">Why this route?</h2>
            <Link className="inline-flex h-7 w-fit items-center rounded-full border border-[#b4d4cb] px-3 text-xs font-medium text-[#3e7f74]" to="/ai">
              Full explanation
            </Link>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {chips.map((chip) => (
              <span className="inline-flex h-7 items-center gap-1 rounded-full border border-[#b4d4cb] bg-white px-3 text-xs font-medium text-[#2e6b61]" key={chip}>
                <Check size={12} />
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function StaticRouteBaseline() {
  return (
    <section className="rounded-[18px] border border-[#d6cdbb] bg-[#f4f0e8] p-5">
      <div className="flex gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#8a7a63] text-white">
          <Info size={15} />
        </span>
        <div>
          <h2 className="text-sm font-semibold leading-[21px] text-[#2a2420]">Static route baseline</h2>
          <p className="mt-2 max-w-[720px] text-xs leading-5 text-[#6b6359]">
            This version uses the same farm route without personalized AI reasons. It is useful for comparing task clarity, trust, and route success during the HCI evaluation.
          </p>
          <Link className="mt-3 inline-flex h-7 items-center rounded-full border border-[#d6cdbb] bg-white px-3 text-xs font-semibold text-[#6b6359]" to="/recommended">
            Return to AI route
          </Link>
        </div>
      </div>
    </section>
  )
}

function StopCard({
  index,
  onManual,
  onRemove,
  routeStops,
  stop,
}: {
  index: number
  onManual: (stopId: string) => void
  onRemove: (stopId: string) => void
  routeStops: Stop[]
  stop: Stop
}) {
  const isFirst = index === 0
  const badge = routeStopBadge(stop, index)
  const nextWalk = routeWalkAfter(index, routeStops)
  const canRemove = !isLockedRouteStop(stop.id)

  return (
    <div className="relative">
      <div className="grid gap-3 sm:grid-cols-[40px_minmax(0,1fr)]">
        <div className="hidden flex-col items-center sm:flex">
          <span className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold ${isFirst ? 'border-[var(--terracotta)] bg-[var(--terracotta)] text-white' : 'border-[#e8e1d3] bg-[#f2ede4] text-[#6b6359]'}`}>
            {index + 1}
          </span>
          {index < routeStops.length - 1 ? <span className="mt-1 h-[91px] w-px bg-[#e8e1d3]" /> : null}
        </div>

        <article className={`overflow-hidden rounded-[14px] bg-white ${isFirst ? 'border-2 border-[var(--terracotta)] shadow-[0_2px_12px_rgba(192,74,43,0.07)]' : 'border border-[#e8e1d3]'}`}>
          <div className="grid min-h-[119px] sm:grid-cols-[96px_minmax(0,1fr)]">
            <img alt={`${stop.name} route stop`} className="h-36 w-full object-cover sm:h-24 sm:w-24" src={routeImages[stop.id]} />
            <div className="flex min-w-0 flex-col justify-between gap-3 px-4 py-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold leading-[21px] text-[#2a2420]">{stop.name}</h3>
                  {badge ? <span className="rounded-full border border-[#f0c4b4] bg-[#fbe4dc] px-2 py-0.5 text-[10px] font-semibold text-[var(--terracotta)]">{badge}</span> : null}
                </div>
                <p className="mt-0.5 text-[11px] leading-4 text-[#8a7a63]">{routeStopLocation(stop)}</p>
                <p className="mt-1 text-xs leading-[18px] text-[#6b6359]">{stop.description}</p>
              </div>

              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex flex-wrap gap-1">
                  {stop.tags.slice(0, 3).map((tag) => (
                    <span className="rounded-full border border-[#e8e1d3] bg-[#f2ede4] px-2 py-0.5 text-[10px] leading-[15px] text-[#6b6359]" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 text-[11px] leading-4 text-[#8a7a63]"><Clock3 size={13} /> {stop.durationMinutes} min</span>
                  <Link
                    className="inline-flex h-[27px] items-center gap-1 rounded-full border border-[#f0c4b4] bg-white px-3 text-[11px] font-medium text-[var(--terracotta)]"
                    to={`/stops/${stop.id}`}
                  >
                    <Eye size={13} />
                    Open Stop
                  </Link>
                  <button
                    className="inline-flex h-[27px] items-center gap-1 rounded-full border border-[#e8e1d3] bg-white px-3 text-[11px] font-medium text-[#6b6359]"
                    onClick={() => onManual(stop.id)}
                    type="button"
                  >
                    <Shuffle size={13} />
                    Map
                  </button>
                  {canRemove ? (
                    <button
                      className="inline-flex h-[27px] items-center gap-1 rounded-full border border-[#f0c4b4] bg-[#fff7f4] px-3 text-[11px] font-semibold text-[var(--terracotta)]"
                      onClick={() => onRemove(stop.id)}
                      type="button"
                    >
                      <X size={13} />
                      Remove
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>

      {nextWalk ? (
        <div className="my-1 ml-0 flex sm:ml-[92px]">
          <span className="inline-flex h-[27px] items-center gap-1.5 rounded-full border border-[#e8e1d3] bg-[#f9f5ef] px-3 text-[11px] leading-4 text-[#8a7a63]">
            <Footprints size={13} />
            {nextWalk}
          </span>
        </div>
      ) : null}
    </div>
  )
}

function RouteSequence({ onManual, onRemove, routeStops }: { onManual: (stopId: string) => void; onRemove: (stopId: string) => void; routeStops: Stop[] }) {
  const routeLabel = routeStops.map((stop) => stop.shortName).join(' -> ')

  return (
    <section className="rounded-[18px] border border-[#e8e1d3] bg-white p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase leading-4 tracking-[0.6px] text-[var(--terracotta)]">Route Sequence - {routeStops.length} Stops</p>
          <h2 className="mt-0.5 text-sm font-semibold leading-[21px] text-[#2a2420]">{routeLabel}</h2>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-[10px] uppercase leading-[15px] tracking-[0.5px] text-[#8a7a63]">Total walk</p>
          <p className="text-[13px] font-semibold leading-5 text-[#2a2420]">~{totalWalkMinutes(routeStops)} min</p>
        </div>
      </div>
      <div>
        {routeStops.map((stop, index) => (
          <StopCard index={index} key={stop.id} onManual={onManual} onRemove={onRemove} routeStops={routeStops} stop={stop} />
        ))}
      </div>
    </section>
  )
}

function DetourStops({ onAdd, stops }: { onAdd: (stopId: string) => void; stops: Stop[] }) {
  return (
    <section className="rounded-[18px] border border-[#e8e1d3] bg-white p-5">
      <div className="mb-4">
        <p className="text-[11px] font-medium uppercase leading-4 tracking-[0.6px] text-[var(--terracotta)]">Available stops</p>
        <h2 className="mt-0.5 text-base font-semibold leading-6 text-[#2a2420]">Add a stop if you want</h2>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        {stops.map((stop) => (
          <article className="flex items-center gap-3 rounded-[12px] border border-[#e8e1d3] bg-[#fbf8f3] p-3" key={stop.id}>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold leading-5 text-[#2a2420]">{stop.name}</h3>
              <p className="mt-0.5 text-xs leading-[18px] text-[#6b6359]">+{stop.durationMinutes} min - {stop.type}</p>
            </div>
            <button
              className="inline-flex h-8 shrink-0 items-center rounded-full bg-[var(--terracotta)] px-3 text-[11px] font-semibold text-white"
              onClick={() => onAdd(stop.id)}
              type="button"
            >
              <Plus className="mr-1" size={12} />
              Add stop
            </button>
            <Link className="inline-flex h-8 shrink-0 items-center rounded-full border border-[#d6cdbb] bg-white px-3 text-[11px] font-semibold text-[#6b6359]" to={`/stops/${stop.id}`}>
              Details
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}

function RouteAlternatives({ onApply, onPreview }: { onApply: (routeId: string) => void; onPreview: (stopId: string) => void }) {
  return (
    <section className="rounded-[18px] border border-[#c6ded8] bg-[#e8f2ef] p-6">
      <p className="text-[11px] font-medium uppercase leading-4 tracking-[0.6px] text-[#2f6d63]">Route alternatives</p>
      <h2 className="mt-1 text-base font-semibold leading-6 text-[#2a2420]">Other route options</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {routeAlternatives.map((variant) => {
          const previewStop = variant.stopIds.map(getStop).find((stop) => stop.isOptional) ?? getStop(variant.stopIds[0])

          return (
            <article className="rounded-[14px] border border-[#b4d4cb] bg-white p-4" key={variant.id}>
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold leading-5 text-[#2a2420]">{variant.name}</h3>
                <span className="shrink-0 rounded-full bg-[#f2ede4] px-2 py-1 text-[10px] font-semibold text-[#6b6359]">{variant.durationMinutes} min</span>
              </div>
              <p className="mt-2 text-xs leading-[18px] text-[#2a2420]">{variant.bestFor}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  className="inline-flex h-8 items-center rounded-full border border-[#b4d4cb] bg-[#2f6d63] px-3 text-[11px] font-semibold text-white"
                  onClick={() => onApply(variant.id)}
                  type="button"
                >
                  Use route
                </button>
                <button
                  className="inline-flex h-8 items-center rounded-full border border-[#b4d4cb] bg-[#e8f2ef] px-3 text-[11px] font-semibold text-[#2f6d63]"
                  onClick={() => onPreview(previewStop.id)}
                  type="button"
                >
                  Preview stop
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function MiniRouteMap({ activeStopId, totalStops }: { activeStopId: string; totalStops: number }) {
  const { openMap } = useMapOverlay()

  return (
    <UnifiedFarmMap
      activeStopId={activeStopId}
      onOpenMap={() => openMap(activeStopId)}
      showControls={false}
      showLegend={false}
      statusLabel={`${totalStops} stops`}
      title="Route Map"
      variant="compact"
    />
  )
}

function SidebarRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex min-h-[51px] gap-3 border-b border-[#e8e1d3] py-2 last:border-b-0">
      <span className="mt-2 text-[#8a7a63]">{icon}</span>
      <span>
        <span className="block text-[10px] uppercase leading-[15px] tracking-[0.5px] text-[#8a7a63]">{label}</span>
        <span className="block text-[13px] font-medium leading-5 text-[#2a2420]">{value}</span>
      </span>
    </div>
  )
}

function RecommendedSidebar({
  onAccept,
  onManual,
  onReset,
  routeStops,
}: {
  onAccept: () => void
  onManual: (stopId?: string) => void
  onReset: () => void
  routeStops: Stop[]
}) {
  const { visit } = useVisit()
  const isCustomRoute = Boolean(visit.customRouteStopIds?.length)

  return (
    <aside className="space-y-4 lg:sticky lg:top-24">
      <Link className="inline-flex items-center gap-1 text-[13px] font-medium text-[#8a7a63] underline" to="/planner">
        <ArrowLeft size={14} />
        Back to Planner
      </Link>
      <section className="rounded-[18px] border border-[#e8e1d3] bg-white p-5">
        <h2 className="text-[13px] font-semibold leading-4 text-[#2a2420]">Current plan</h2>
        <div className="mt-3">
          <SidebarRow icon={<Clock3 size={16} />} label="Duration" value={displayDuration(visit.selectedDuration)} />
          <SidebarRow icon={<Footprints size={16} />} label="Total walk" value={`~${totalWalkMinutes(routeStops)} min`} />
          <SidebarRow icon={<UsersRound size={16} />} label="Visit mode" value={displayMode(visit.selectedMode)} />
          <SidebarRow icon={<Leaf size={16} />} label="Spice level" value={visit.selectedSpiceLevel} />
        </div>
        {isCustomRoute ? (
          <button
            className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-[10px] border border-[#d6cdbb] bg-[#fbf8f3] text-xs font-semibold text-[#6b6359] transition hover:bg-white"
            onClick={onReset}
            type="button"
          >
            <RotateCcw size={13} />
            Restore AI route
          </button>
        ) : null}
      </section>

      <MiniRouteMap activeStopId={routeStops[0]?.id ?? 'visitor-center'} totalStops={routeStops.length} />

      <button
        className="inline-flex h-[45px] w-full items-center justify-center gap-2 rounded-[12px] bg-[var(--terracotta)] text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--terracotta-dark)]"
        onClick={onAccept}
        type="button"
      >
        <Check size={14} />
        Accept Route
        <ArrowRight size={13} />
      </button>
      <button
        className="inline-flex h-[42px] w-full items-center justify-center gap-2 rounded-[12px] border border-[#d6cdbb] bg-white text-sm font-medium text-[#6b6359] transition hover:bg-[#f9f5ef]"
        onClick={() => onManual()}
        type="button"
      >
        <Pencil size={14} />
        Choose Manually
      </button>
    </aside>
  )
}

export function RecommendedRoutePage() {
  const { acceptRoute, addStopToRoute, chooseManual, chooseRecommended, removeStopFromRoute, resetCustomRoute, setPreference, visit } = useVisit()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { openMap } = useMapOverlay()
  const adaptiveRoute = buildAdaptiveRoute(visit)
  const routeStops = getRouteStops(visit)
  const optionalStops = getOptionalStops(visit)
  const whyChips = buildWhyChips(visit)
  const isStaticMode = searchParams.get('mode') === 'static'
  const isCustomRoute = Boolean(visit.customRouteStopIds?.length)

  const handleAccept = () => {
    acceptRoute()
    navigate('/route')
  }

  const handleManual = (stopId = 'greenhouse-route') => {
    chooseManual()
    openMap(stopId)
  }

  const handleAddStop = (stopId: string) => {
    addStopToRoute(stopId)
  }

  const handleRemoveStop = (stopId: string) => {
    removeStopFromRoute(stopId)
  }

  const applyAlternativeRoute = (routeId: string) => {
    chooseRecommended()

    if (routeId === 'quick-family-loop') {
      setPreference('selectedDuration', '30 min')
      setPreference('selectedMode', 'Fast overview')
      setPreference('selectedSpiceLevel', 'Mild')
      return
    }

    if (routeId === 'enthusiast-tasting') {
      setPreference('selectedDuration', '60 min')
      setPreference('selectedMode', 'Pepper enthusiast')
      setPreference('selectedSpiceLevel', 'Hot')
      return
    }

    setPreference('selectedDuration', '60 min')
    setPreference('selectedMode', 'Pepper enthusiast')
    setPreference('selectedSpiceLevel', 'Mild')
  }

  return (
    <PageShell className="bg-[#fbf8f3] py-8 md:px-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,900px)_292px] lg:items-start">
        <div className="space-y-4">
          <RouteSummaryHero isCustomRoute={isCustomRoute} isStaticMode={isStaticMode} onAccept={handleAccept} routeDurationMinutes={adaptiveRoute.durationMinutes} routeName={adaptiveRoute.name} routeStops={routeStops} visit={visit} />
          {isStaticMode ? <StaticRouteBaseline /> : <WhyThisRoute chips={whyChips} />}
          <RouteSequence onManual={handleManual} onRemove={handleRemoveStop} routeStops={routeStops} />
          <DetourStops onAdd={handleAddStop} stops={optionalStops} />
          <RouteAlternatives onApply={applyAlternativeRoute} onPreview={handleManual} />
        </div>
        <RecommendedSidebar onAccept={handleAccept} onManual={handleManual} onReset={resetCustomRoute} routeStops={routeStops} />
      </div>
    </PageShell>
  )
}
