import { List, Map } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getRouteStops } from '../../data/helpers'
import { useVisit } from '../../hooks/useVisit'
import { cn } from '../../utils/cn'
import { DynamicFarmMapCanvas } from './DynamicFarmMapCanvas'

type UnifiedFarmMapVariant = 'full' | 'preview' | 'compact'

type UnifiedFarmMapProps = {
  activeStopId?: string
  className?: string
  interactive?: boolean
  onOpenMap?: () => void
  onStopSelect?: (stopId: string) => void
  selectedStopId?: string | null
  showControls?: boolean
  showHeader?: boolean
  showLegend?: boolean
  showOpenMapAction?: boolean
  showSafetyNote?: boolean
  statusLabel?: string
  title?: string
  variant?: UnifiedFarmMapVariant
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[11px] leading-4 text-[#6b6359]">
      <span className={cn('h-2.5 w-2.5 rounded-full', className)} />
      {label}
    </span>
  )
}

export function UnifiedFarmMap({
  activeStopId = 'greenhouse-route',
  className,
  interactive = false,
  onOpenMap,
  onStopSelect,
  selectedStopId,
  showControls = true,
  showHeader = true,
  showLegend = true,
  showOpenMapAction = true,
  showSafetyNote = false,
  statusLabel,
  title = 'Route Map',
  variant = 'preview',
}: UnifiedFarmMapProps) {
  const { visit } = useVisit()
  const isCompact = variant === 'compact'
  const routeStops = getRouteStops(visit)
  const activeIndex = Math.max(0, routeStops.findIndex((stop) => stop.id === activeStopId))
  const canSelectStops = interactive || Boolean(onStopSelect)
  const resolvedStatusLabel = statusLabel ?? `Stop ${activeIndex + 1} of ${routeStops.length}`

  return (
    <section className={cn('overflow-hidden rounded-[18px] border border-[#e8e1d3] bg-white shadow-[0_10px_24px_rgba(74,51,29,0.05)]', className)}>
      {showHeader ? (
        <div className="flex min-h-[52px] items-center justify-between gap-3 border-b border-[#e8e1d3] px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c04a2b]" />
            <h2 className="truncate text-[13px] font-semibold leading-5 text-[#2a2420]">{title}</h2>
          </div>
          <span className="shrink-0 rounded-full border border-[#e8e1d3] bg-[#f2ede4] px-3 py-1 text-[11px] font-medium leading-4 text-[#8a7a63]">
            {resolvedStatusLabel}
          </span>
        </div>
      ) : null}

      <div className={cn('bg-[#f6efe1]', isCompact ? 'p-1.5 sm:p-2' : 'p-2 sm:p-3')}>
        <div className="relative">
          <DynamicFarmMapCanvas
            activeStopId={activeStopId}
            onStopSelect={canSelectStops ? onStopSelect : undefined}
            routeStops={routeStops}
            selectedStopId={selectedStopId}
          />
          {showOpenMapAction ? (
            onOpenMap ? (
              <button
                aria-label="Open full farm map"
                className="absolute right-2 top-2 inline-flex h-8 items-center gap-1.5 rounded-[10px] border border-[#e8e1d3] bg-white/95 px-2.5 text-[11px] font-semibold text-[#c04a2b] shadow-sm hover:bg-white sm:right-3 sm:top-3 sm:px-3"
                onClick={onOpenMap}
                type="button"
              >
                <Map size={13} />
                Open Map
              </button>
            ) : (
              <Link
                aria-label="Open full farm map"
                className="absolute right-2 top-2 inline-flex h-8 items-center gap-1.5 rounded-[10px] border border-[#e8e1d3] bg-white/95 px-2.5 text-[11px] font-semibold text-[#c04a2b] shadow-sm hover:bg-white sm:right-3 sm:top-3 sm:px-3"
                to="/map"
              >
                <Map size={13} />
                Open Map
              </Link>
            )
          ) : null}
          {showControls && !isCompact ? (
            <Link
              aria-label="Open route list view"
              className="absolute bottom-2 right-2 inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-[#e8e1d3] bg-white/95 px-3 text-xs font-medium text-[#2a2420] shadow-sm hover:bg-white sm:bottom-[14px] sm:right-[14px]"
              title="List view"
              to="/route"
            >
              <List size={13} />
              List view
            </Link>
          ) : null}
        </div>
      </div>

      {showLegend ? (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#e8e1d3] px-4 py-3">
          <LegendDot className="bg-[#c04a2b]" label="You are here" />
          <LegendDot className="border border-[#c04a2b] bg-white" label="Next stop" />
          <LegendDot className="bg-[#3f8a4a]" label="Completed" />
          <LegendDot className="border border-[#9b8b72] bg-white" label="Upcoming" />
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[11px] leading-4 text-[#6b6359]">
            <span className="h-px w-5 bg-[#c04a2b]" />
            Next path
          </span>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[11px] leading-4 text-[#6b6359]">
            <span className="h-px w-5 border-t border-dashed border-[#3f8a4a]" />
            Route taken
          </span>
        </div>
      ) : null}

      {showSafetyNote ? (
        <div className="border-t border-[#e8e1d3] bg-[#fff7d7] px-4 py-3 text-xs leading-[18px] text-[#7a6122]">
          Location may be approximate inside greenhouse areas. Use landmarks or switch to list view if the route is unclear.
        </div>
      ) : null}
    </section>
  )
}
