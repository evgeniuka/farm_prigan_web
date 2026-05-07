import { Check, CircleDot } from 'lucide-react'
import { getStop } from '../../data/helpers'
import { mainRoute } from '../../data/routes'
import { useVisit } from '../../hooks/useVisit'

export function RouteProgress() {
  const { visit } = useVisit()
  const routeStops = mainRoute.stops.map(getStop)
  const activeIndex = routeStops.findIndex((stop) => stop?.id === visit.activeStopId)

  return (
    <div className="quiet-panel p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-[var(--ink)]">Route progress</p>
        <p className="text-sm text-[var(--muted)]">Stop {activeIndex + 1} of {routeStops.length}</p>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {routeStops.map((stop, index) => {
          const isVisited = visit.visitedStopIds.includes(stop.id)
          const isActive = stop.id === visit.activeStopId
          return (
            <div className="min-w-0" key={stop.id}>
              <div
                className={`flex h-9 items-center justify-center rounded-lg border ${
                  isActive
                    ? 'border-[var(--terracotta)] bg-[#fff1ed] text-[var(--terracotta)]'
                    : isVisited
                      ? 'border-[#cfe0bd] bg-[var(--mint)] text-[var(--green-dark)]'
                      : 'border-[var(--soft-border)] bg-white text-[var(--muted)]'
                }`}
              >
                {isVisited ? <Check size={16} /> : isActive ? <CircleDot size={16} /> : index + 1}
              </div>
              <p className="mt-2 truncate text-center text-xs text-[var(--muted)]">{stop.shortName}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
