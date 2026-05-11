import {
  ArrowRight,
  Clock,
  Info,
  Lock,
  ShoppingBag,
  SkipForward,
  Sprout,
  UsersRound,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageShell } from '../components/layout/PageShell'
import { UnifiedFarmMap } from '../components/map/UnifiedFarmMap'
import { isLockedRouteStop } from '../data/adaptiveRoute'
import { getRouteStops, getStop, isRouteStopId } from '../data/helpers'
import { useVisit } from '../hooks/useVisit'
import { cn } from '../utils/cn'

const nearbyStops = [
  {
    id: 'visitor-center',
    icon: <Info size={15} />,
    title: 'Visitor Center',
    meta: 'Info',
    time: '2 min',
    chip: 'Completed',
    tone: 'green' as const,
  },
  {
    id: 'tasting-gh-1-2',
    icon: <Sprout size={15} />,
    title: 'Tasting GH 1-2',
    meta: 'Tasting',
    time: '3 min',
    chip: 'Mild · Next stop',
    tone: 'red' as const,
  },
  {
    id: 'seedling-nursery',
    icon: <Sprout size={15} />,
    title: 'Seedling Nursery',
    meta: 'Learning',
    time: '2 min',
    chip: 'Optional',
    tone: 'green' as const,
  },
  {
    id: 'color-pepper-row',
    icon: <Sprout size={15} />,
    title: 'Color Pepper Row',
    meta: 'Compare',
    time: '4 min',
    chip: 'Optional',
    tone: 'blue' as const,
  },
  {
    id: 'tasting-gh-3-4',
    icon: <Sprout size={15} />,
    title: 'Tasting GH 3-4',
    meta: 'Tasting',
    time: '5 min',
    chip: 'Hot · Optional',
    tone: 'danger' as const,
  },
  {
    id: 'shade-rest-area',
    icon: <UsersRound size={15} />,
    title: 'Shade Rest Area',
    meta: 'Rest',
    time: '2 min',
    chip: 'Family option',
    tone: 'sand' as const,
  },
  {
    id: 'product-shop',
    icon: <ShoppingBag size={15} />,
    title: 'Product Shop',
    meta: 'Shop',
    time: '7 min',
    chip: 'Stop 5',
    tone: 'sand' as const,
  },
  {
    id: 'packing-demo',
    icon: <ShoppingBag size={15} />,
    title: 'Packing Demo Window',
    meta: 'Products',
    time: '3 min',
    chip: 'Optional',
    tone: 'sand' as const,
  },
  {
    id: 'production-greenhouses',
    icon: <Lock size={15} />,
    title: 'Production Greenhouses',
    meta: 'Staff',
    time: '-',
    chip: 'Restricted',
    tone: 'danger' as const,
  },
]

function Chip({ children, tone = 'sand' }: { children: ReactNode; tone?: 'red' | 'blue' | 'sand' | 'green' | 'danger' }) {
  const classes = {
    red: 'border-[#f0c4b4] bg-[#fbe4dc] text-[#c04a2b]',
    blue: 'border-[#bcd0e7] bg-[#e2ecf7] text-[#3a6aa3]',
    sand: 'border-[#e8e1d3] bg-[#f3ede0] text-[#6b6359]',
    green: 'border-[#bcd9a7] bg-[#eef6e2] text-[#3f8a4a]',
    danger: 'border-[#e9b9b5] bg-[#fdecec] text-[#a8423a]',
  }[tone]

  return <span className={cn('inline-flex min-h-[28px] items-center rounded-full border px-3 text-xs leading-[18px]', classes)}>{children}</span>
}

function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn('rounded-[12px] border border-[#e8e1d3] bg-white', className)}>{children}</section>
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="text-[11px] font-normal uppercase leading-[16.5px] tracking-[0.275px] text-[#8a7a63]">{children}</p>
}

function FarmMapVisual({
  activeStopId,
  onStopSelect,
  selectedStopId,
}: {
  activeStopId: string
  onStopSelect?: (stopId: string) => void
  selectedStopId?: string | null
}) {
  return (
    <UnifiedFarmMap
      activeStopId={activeStopId}
      className="shadow-none"
      interactive={Boolean(onStopSelect)}
      onStopSelect={onStopSelect}
      selectedStopId={selectedStopId}
      showHeader={false}
      showLegend={false}
      showOpenMapAction={false}
      showSafetyNote={false}
      variant="full"
    />
  )
}

function NextStopCard({ nextStop, nextStopIndex, totalStops }: { nextStop: { id: string; name: string; shortName: string; tags: string[]; walkingMinutesFromPrevious: number } | null; nextStopIndex: number | null; totalStops: number }) {
  const targetStop = nextStop ?? null

  return (
    <Panel className="border-[#f0c4b4] bg-[#fff8f4] p-5">
      <SectionLabel>{targetStop ? 'Next on your route' : 'Route status'}</SectionLabel>
      <div className="mt-3 flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#c04a2b] text-white">
          <Sprout size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <SectionLabel>{targetStop && nextStopIndex !== null ? `Stop ${nextStopIndex + 1} of ${totalStops}` : 'Final stop'}</SectionLabel>
          <div className="mt-0.5 flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold leading-[23px] text-[#2a2420]">{targetStop ? targetStop.name : 'Route complete'}</h2>
            <Chip tone="red">{targetStop ? 'Next stop' : 'Current stop'}</Chip>
          </div>
          <p className="mt-2 flex items-center gap-1 text-xs leading-[18px] text-[#6b6359]">
            <Clock size={13} />
            {targetStop ? `${targetStop.walkingMinutesFromPrevious} min walk` : 'Ready to finish'}
          </p>
          {(targetStop?.tags ?? ['Final stop']).slice(0, 2).map((tag) => (
            <p className="text-xs leading-[18px] text-[#6b6359]" key={tag}>{tag}</p>
          ))}
        </div>
      </div>
    </Panel>
  )
}

function ActionButtons({
  nextStop,
  onContinue,
  onSkip,
}: {
  nextStop: { id: string; shortName: string } | null
  onContinue: () => void
  onSkip: () => void
}) {
  return (
    <section className="space-y-2">
      <button
        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-[8px] border border-[#c04a2b] bg-[#c04a2b] text-[13px] font-semibold text-white transition hover:bg-[#a63d23]"
        onClick={onContinue}
        type="button"
      >
        <ArrowRight size={15} />
        {nextStop ? `Continue to ${nextStop.shortName}` : 'Finish Visit'}
      </button>
      <div className="grid gap-2 sm:grid-cols-2">
        <Link className="inline-flex h-9 items-center justify-center rounded-[8px] border border-[#e8e1d3] bg-white text-xs font-medium text-[#2a2420] hover:bg-[#fbf7f0]" to={`/stops/${nextStop?.id ?? 'product-shop'}`}>
          Open Stop Details
        </Link>
        <button
          className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-[#e8e1d3] bg-white text-xs font-medium text-[#2a2420] hover:bg-[#fbf7f0] sm:h-9"
          onClick={onSkip}
          type="button"
        >
          <SkipForward size={13} />
          Skip Stop
        </button>
      </div>
    </section>
  )
}

function SelectedMapStopCard({
  onClear,
  onOpen,
  stopId,
}: {
  onClear: () => void
  onOpen: () => void
  stopId: string | null
}) {
  const { addStopToRoute, removeStopFromRoute, visit } = useVisit()
  if (!stopId) return null

  const stop = getStop(stopId)
  const routeStops = getRouteStops(visit)
  const routeIndex = routeStops.findIndex((routeStop) => routeStop.id === stop.id)
  const isRouteStop = isRouteStopId(stop.id, visit)
  const canRemove = isRouteStop && !isLockedRouteStop(stop.id)

  return (
    <Panel className="border-[#d8c49f] bg-[#fffaf2] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <SectionLabel>{isRouteStop ? 'Selected route stop' : 'Selected optional stop'}</SectionLabel>
          <h2 className="mt-1 text-base font-semibold leading-6 text-[#2a2420]">{stop.name}</h2>
          <p className="mt-1 text-xs leading-[18px] text-[#6b6359]">{stop.description}</p>
        </div>
        <Chip tone={isRouteStop ? 'green' : 'sand'}>{isRouteStop ? `Stop ${routeIndex + 1}` : 'Addable'}</Chip>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Chip tone="blue">
          <Clock className="mr-1" size={12} />
          {stop.durationMinutes} min here
        </Chip>
        <Chip>{stop.type}</Chip>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {isRouteStop ? (
          <button
            className="inline-flex h-10 items-center justify-center rounded-[8px] border border-[#f0c4b4] bg-[#fff7f4] text-xs font-semibold text-[#c04a2b] hover:bg-[#fff1ed] disabled:cursor-not-allowed disabled:opacity-50 sm:h-9"
            disabled={!canRemove}
            onClick={() => removeStopFromRoute(stop.id)}
            type="button"
          >
            {canRemove ? 'Remove from Route' : 'Required Stop'}
          </button>
        ) : (
          <button
            className="inline-flex h-10 items-center justify-center rounded-[8px] border border-[#c04a2b] bg-[#c04a2b] text-xs font-semibold text-white hover:bg-[#a63d23] sm:h-9"
            onClick={() => addStopToRoute(stop.id)}
            type="button"
          >
            Add to Route
          </button>
        )}
        <button
          className="inline-flex h-10 items-center justify-center rounded-[8px] border border-[#e8e1d3] bg-white text-xs font-medium text-[#2a2420] hover:bg-[#fbf7f0] sm:h-9"
          onClick={onOpen}
          type="button"
        >
          Open Details
        </button>
        <button
          className="inline-flex h-10 items-center justify-center rounded-[8px] border border-[#e8e1d3] bg-white text-xs font-medium text-[#2a2420] hover:bg-[#fbf7f0] sm:h-9"
          onClick={onClear}
          type="button"
        >
          Clear Selection
        </button>
      </div>
    </Panel>
  )
}

function NearbyStopRow({ stop }: { stop: (typeof nearbyStops)[number] }) {
  const { addStopToRoute, setActiveStop, visit } = useVisit()
  const navigate = useNavigate()
  const disabled = stop.id === 'production-greenhouses'
  const routeStops = getRouteStops(visit)
  const routeIndex = routeStops.findIndex((routeStop) => routeStop.id === stop.id)
  const activeIndex = Math.max(0, routeStops.findIndex((routeStop) => routeStop.id === visit.activeStopId))
  const inRoute = routeIndex >= 0
  const isCurrent = stop.id === visit.activeStopId
  const isNext = routeIndex === activeIndex + 1
  const dynamicChip = disabled ? 'Restricted' : isCurrent ? 'Current' : isNext ? 'Next stop' : inRoute ? `Stop ${routeIndex + 1}` : 'Addable'
  const dynamicTone = disabled ? 'danger' : isCurrent || isNext ? 'red' : inRoute ? 'green' : stop.tone

  const viewStop = () => {
    if (disabled) return
    if (!inRoute) {
      addStopToRoute(stop.id)
      return
    }
    setActiveStop(stop.id)
    navigate('/route')
  }

  return (
    <div className="flex items-center gap-3 border-b border-[#efe7d5] px-3 py-2.5 last:border-b-0">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f6efe1] text-[#8a7a63]">
        {stop.icon}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[13px] font-medium leading-[19.5px] text-[#2a2420]">{stop.title}</h3>
        <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] leading-[16.5px] text-[#8a7a63]">{stop.meta}</span>
          <span className="flex items-center gap-1 text-[11px] leading-[16.5px] text-[#8a7a63]">
            <Clock size={12} />
            {stop.time}
          </span>
          <Chip tone={dynamicTone}>{dynamicChip}</Chip>
        </div>
      </div>
      <button
        className="h-[27px] rounded-[8px] border border-[#e8e1d3] bg-white px-3 text-[11px] font-medium text-[#3a342e] hover:bg-[#fbf7f0] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={disabled}
        onClick={viewStop}
        type="button"
      >
        {disabled ? 'Locked' : inRoute ? 'View' : 'Add'}
      </button>
    </div>
  )
}

function NearbyStops() {
  return (
    <section>
      <SectionLabel>Map stops</SectionLabel>
      <Panel className="mt-3 overflow-hidden">
        {nearbyStops.map((stop) => (
          <NearbyStopRow key={stop.id} stop={stop} />
        ))}
      </Panel>
    </section>
  )
}

export function FarmMapPage() {
  const { chooseManual, continueToNextStop, finishVisit, skipStop, visit } = useVisit()
  const navigate = useNavigate()
  const [selectedMapStopId, setSelectedMapStopId] = useState<string | null>(null)
  const routeStops = getRouteStops(visit)
  const activeIndex = Math.max(0, routeStops.findIndex((stop) => stop.id === visit.activeStopId))
  const nextStop = routeStops[activeIndex + 1] ?? null
  const nextStopIndex = nextStop ? activeIndex + 1 : null

  const continueRoute = () => {
    if (!nextStop) {
      finishVisit()
      navigate('/finish')
      return
    }

    continueToNextStop()
    navigate('/route')
  }

  const skipCurrentStop = () => {
    if (!nextStop) {
      finishVisit()
      navigate('/finish')
      return
    }

    skipStop()
    navigate('/route')
  }

  const openSelectedMapStop = () => {
    if (!selectedMapStopId) return
    if (!isRouteStopId(selectedMapStopId, visit)) chooseManual()
    navigate(`/stops/${selectedMapStopId}`)
  }

  return (
    <PageShell className="py-5 md:py-7">
      <div className="mx-auto grid max-w-[1180px] min-w-0 gap-5 lg:grid-cols-[minmax(0,746px)_minmax(320px,361px)] lg:gap-6">
        <section className="min-w-0">
          <SectionLabel>Farm Map · Stop {activeIndex + 1} of {routeStops.length}</SectionLabel>
          <h1 className="mt-1 text-[22px] font-semibold leading-[33px] text-[#2a2420]">Farm Map</h1>
          <p className="mt-1 text-[13px] leading-[19.5px] text-[#6b6359]">See your route, nearby stops, and tasting points across the farm.</p>
          <div className="mt-4">
            <FarmMapVisual activeStopId={visit.activeStopId} onStopSelect={setSelectedMapStopId} selectedStopId={selectedMapStopId} />
          </div>
        </section>

        <aside className="min-w-0 space-y-5 lg:sticky lg:top-24 lg:self-start">
          <NextStopCard nextStop={nextStop} nextStopIndex={nextStopIndex} totalStops={routeStops.length} />
          <SelectedMapStopCard onClear={() => setSelectedMapStopId(null)} onOpen={openSelectedMapStop} stopId={selectedMapStopId} />
          <ActionButtons nextStop={nextStop} onContinue={continueRoute} onSkip={skipCurrentStop} />
          <NearbyStops />
        </aside>
      </div>
    </PageShell>
  )
}
