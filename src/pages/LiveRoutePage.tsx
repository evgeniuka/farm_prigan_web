import { ArrowRight, CheckCircle2, Clock, Map, Plus, RotateCcw, SkipForward, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { PageShell } from '../components/layout/PageShell'
import { UnifiedFarmMap } from '../components/map/UnifiedFarmMap'
import { useMapOverlay } from '../components/map/useMapOverlay'
import { isLockedRouteStop } from '../data/adaptiveRoute'
import { getOptionalStops, getRouteStops } from '../data/helpers'
import { routeImages } from '../data/routeImages'
import { useVisit } from '../hooks/useVisit'
import { cn } from '../utils/cn'

export function LiveRoutePage() {
  const { addStopToRoute, continueToNextStop, finishVisit, markVisited, removeStopFromRoute, resetCustomRoute, shortenRoute, skipStop, visit } = useVisit()
  const { openMap } = useMapOverlay()
  const navigate = useNavigate()
  const routeStops = getRouteStops(visit)
  const optionalStops = getOptionalStops(visit)
  const activeIndex = Math.max(0, routeStops.findIndex((stop) => stop.id === visit.activeStopId))
  const currentStop = routeStops[activeIndex]
  const nextStop = routeStops[activeIndex + 1] ?? null
  const progress = Math.round(((activeIndex + 1) / routeStops.length) * 100)

  const continueRoute = () => {
    markVisited(currentStop.id)
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

  const shortenCurrentRoute = () => {
    shortenRoute()
    navigate('/route')
  }

  return (
    <PageShell className="py-7 md:py-8">
      <div className="mx-auto max-w-[1120px] space-y-5">
        <section className="rounded-[16px] border border-[#e8e1d3] bg-white p-5 shadow-[0_10px_24px_rgba(74,51,29,0.05)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[var(--terracotta)]">Live Route</p>
              <h1 className="mt-1 text-[28px] font-semibold leading-9 text-[var(--ink)]">Follow your visit</h1>
              <p className="mt-2 max-w-[620px] text-sm leading-6 text-[#6b6359]">
                You are at {currentStop.name}. Continue when ready, or open the map to reorient.
              </p>
            </div>
            <button
              className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] border border-[#e8e1d3] bg-white px-4 text-sm font-semibold text-[#2a2420] hover:bg-[#fbf8f3]"
              onClick={() => openMap(currentStop.id)}
              type="button"
            >
              <Map size={15} />
              Open Map
            </button>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-xs text-[#8a7a63]">
              <span>Stop {activeIndex + 1} of {routeStops.length}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#e8e1d3]">
              <div className="h-full rounded-full bg-[var(--terracotta)]" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <main className="space-y-5">
            <section className="overflow-hidden rounded-[16px] border border-[#e8e1d3] bg-white shadow-[0_10px_24px_rgba(74,51,29,0.05)]">
              <img alt={`${currentStop.name} stop`} className="h-[260px] w-full object-cover" src={routeImages[currentStop.id]} />
              <div className="p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-[#f0c4b4] bg-[#fbe4dc] px-3 py-1 text-xs font-semibold text-[var(--terracotta)]">You are here</span>
                  <span className="rounded-full border border-[#d8e3cf] bg-[#f4f8ed] px-3 py-1 text-xs font-semibold text-[#55743a]">{currentStop.durationMinutes} min</span>
                  {currentStop.tags.slice(0, 3).map((tag) => (
                    <span className="rounded-full border border-[#e8e1d3] bg-[#fbf8f3] px-3 py-1 text-xs font-medium text-[#6b6359]" key={tag}>{tag}</span>
                  ))}
                </div>

                <h2 className="mt-4 text-2xl font-semibold text-[var(--ink)]">{currentStop.name}</h2>
                <p className="mt-2 text-sm leading-6 text-[#6b6359]">{currentStop.description}</p>

                {nextStop ? (
                  <div className="mt-4 rounded-[12px] border border-[#e8e1d3] bg-[#fbf8f3] p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#8a7a63]">Next stop</p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-[var(--ink)]">{nextStop.name}</h3>
                        <p className="mt-1 flex items-center gap-1 text-xs text-[#6b6359]">
                          <Clock size={12} />
                          {nextStop.walkingMinutesFromPrevious} min walk
                        </p>
                      </div>
                      <Link className="text-xs font-semibold text-[var(--terracotta)] hover:underline" to={`/stops/${nextStop.id}`}>
                        Preview
                      </Link>
                    </div>
                  </div>
                ) : null}

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <button
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-[var(--terracotta)] px-4 text-sm font-semibold text-white hover:bg-[var(--terracotta-dark)] sm:col-span-2"
                    onClick={continueRoute}
                    type="button"
                  >
                    {nextStop ? `Continue to ${nextStop.shortName}` : 'Finish Visit'}
                    <ArrowRight size={15} />
                  </button>
                  <Link
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] border border-[#e8e1d3] bg-white px-4 text-sm font-semibold text-[#2a2420] hover:bg-[#fbf8f3]"
                    to={`/stops/${currentStop.id}`}
                  >
                    Details
                  </Link>
                  <button
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] border border-[#e8e1d3] bg-white px-4 text-xs font-semibold text-[#6b6359] hover:bg-[#fbf8f3]"
                    onClick={skipCurrentStop}
                    type="button"
                  >
                    <SkipForward size={14} />
                    Skip
                  </button>
                  <button
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] border border-[#e8e1d3] bg-white px-4 text-xs font-semibold text-[#6b6359] hover:bg-[#fbf8f3]"
                    onClick={shortenCurrentRoute}
                    type="button"
                  >
                    <ArrowRight size={14} />
                    Shorten
                  </button>
                </div>
              </div>
            </section>
          </main>

          <aside className="space-y-4">
            <UnifiedFarmMap
              activeStopId={currentStop.id}
              onOpenMap={() => openMap(currentStop.id)}
              showControls={false}
              showLegend={false}
              statusLabel={`Stop ${activeIndex + 1} of ${routeStops.length}`}
              title="Farm Map"
              variant="compact"
            />

            <section className="rounded-[16px] border border-[#e8e1d3] bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#8a7a63]">Edit route</p>
                {visit.customRouteStopIds?.length ? (
                  <button
                    className="inline-flex h-7 items-center gap-1 rounded-full border border-[#e8e1d3] bg-white px-2 text-[11px] font-semibold text-[#6b6359] hover:bg-[#fbf8f3]"
                    onClick={resetCustomRoute}
                    type="button"
                  >
                    <RotateCcw size={12} />
                    AI route
                  </button>
                ) : null}
              </div>
              <div className="mt-3 space-y-2">
                {routeStops.map((stop, index) => {
                  const active = stop.id === currentStop.id
                  const done = index < activeIndex || visit.visitedStopIds.includes(stop.id)
                  const canRemove = !isLockedRouteStop(stop.id)

                  return (
                    <div
                      className={cn(
                        'flex min-h-10 items-center gap-2 rounded-[10px] px-3 text-sm',
                        active ? 'bg-[#fbe4dc] font-semibold text-[var(--terracotta)]' : 'bg-[#fbf8f3] text-[#6b6359]',
                      )}
                      key={stop.id}
                    >
                      <span className={cn('flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold', done ? 'bg-[#3e7f74] text-white' : active ? 'bg-[var(--terracotta)] text-white' : 'border border-[#d6cdbb] bg-white text-[#6b6359]')}>
                        {done ? <CheckCircle2 size={13} /> : index + 1}
                      </span>
                      <Link className="min-w-0 flex-1 truncate hover:underline" to={`/stops/${stop.id}`}>{stop.name}</Link>
                      {canRemove ? (
                        <button
                          aria-label={`Remove ${stop.name} from route`}
                          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#f0c4b4] bg-white text-[var(--terracotta)] hover:bg-[#fff1ed]"
                          onClick={() => removeStopFromRoute(stop.id)}
                          type="button"
                        >
                          <X size={13} />
                        </button>
                      ) : null}
                    </div>
                  )
                })}
              </div>
              {optionalStops.length ? (
                <div className="mt-4 border-t border-[#e8e1d3] pt-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#8a7a63]">Add stop</p>
                  <div className="mt-2 space-y-2">
                    {optionalStops.slice(0, 4).map((stop) => (
                      <button
                        className="flex min-h-9 w-full items-center gap-2 rounded-[10px] border border-[#e8e1d3] bg-white px-3 text-left text-xs font-semibold text-[#2a2420] hover:bg-[#fbf8f3]"
                        key={stop.id}
                        onClick={() => addStopToRoute(stop.id)}
                        type="button"
                      >
                        <Plus size={13} />
                        <span className="min-w-0 flex-1 truncate">{stop.name}</span>
                        <span className="text-[#8a7a63]">+{stop.durationMinutes} min</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </section>
          </aside>
        </div>
      </div>
    </PageShell>
  )
}
