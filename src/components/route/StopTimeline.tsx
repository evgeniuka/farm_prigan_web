import { ArrowRight, Clock, Footprints, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getStop } from '../../data/helpers'
import { mainRoute } from '../../data/routes'
import { useVisit } from '../../hooks/useVisit'
import { StatusPill } from '../ui/StatusPill'

export function StopTimeline({ compact = false }: { compact?: boolean }) {
  const { visit, setActiveStop } = useVisit()
  const routeStops = mainRoute.stops.map(getStop)

  return (
    <div className="space-y-3">
      {routeStops.map((stop) => {
        const active = stop.id === visit.activeStopId
        const visited = visit.visitedStopIds.includes(stop.id)
        return (
          <article className={`soft-card p-4 ${active ? 'ring-2 ring-[rgba(191,69,40,0.24)]' : ''}`} key={stop.id}>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <StatusPill tone={active ? 'red' : visited ? 'green' : 'cream'}>{active ? 'Current' : visited ? 'Visited' : `Stop ${stop.order}`}</StatusPill>
                  <StatusPill tone="cream"><Clock size={12} /> {stop.durationMinutes} min</StatusPill>
                  <StatusPill tone="cream"><Footprints size={12} /> {stop.walkingMinutesFromPrevious} min walk</StatusPill>
                </div>
                <h3 className="text-lg font-semibold text-[var(--ink)]">{stop.name}</h3>
                {!compact ? <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{stop.description}</p> : null}
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--soft-border)] bg-white px-3 text-sm font-semibold text-[var(--muted)] hover:bg-[var(--cream-100)]"
                  onClick={() => setActiveStop(stop.id)}
                  type="button"
                >
                  <MapPin size={15} />
                  Set current
                </button>
                <Link className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--soft-border)] bg-white px-3 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--cream-100)]" to={`/stops/${stop.id}`}>
                  Details
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
