import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Footprints,
  Info,
  List,
  MapPin,
  X,
} from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isLockedRouteStop } from '../../data/adaptiveRoute'
import { getOptionalStops, getRouteStops, getStop, isRouteStopId } from '../../data/helpers'
import { useVisit } from '../../hooks/useVisit'
import { Button } from '../ui/Button'
import { UnifiedFarmMap } from './UnifiedFarmMap'
import { useMapOverlay } from './useMapOverlay'

function StopStatusPill({ label, tone = 'neutral' }: { label: string; tone?: 'current' | 'green' | 'neutral' | 'next' }) {
  const classes = {
    current: 'border-[#f0c4b4] bg-[#fbe4dc] text-[#c04a2b]',
    green: 'border-[#b4d4cb] bg-[#e1efeb] text-[#3e7f74]',
    neutral: 'border-[#e8e1d3] bg-[#f2ede4] text-[#6b6359]',
    next: 'border-[#f0c4b4] bg-white text-[#c04a2b]',
  }

  return (
    <span className={`inline-flex h-7 items-center rounded-full border px-3 text-xs font-medium ${classes[tone]}`}>
      {label}
    </span>
  )
}

export function MapOverlay() {
  const { closeMap, isMapOpen, selectedStopId, selectStop } = useMapOverlay()
  const { addStopToRoute, continueToNextStop, finishVisit, removeStopFromRoute, setActiveStop, visit } = useVisit()
  const navigate = useNavigate()
  const routeStops = getRouteStops(visit)
  const addableStops = getOptionalStops(visit)
  const activeIndex = Math.max(0, routeStops.findIndex((stop) => stop.id === visit.activeStopId))
  const selectedStop = selectedStopId ? getStop(selectedStopId) : routeStops[activeIndex]
  const selectedInRoute = isRouteStopId(selectedStop.id, visit)
  const selectedIndex = routeStops.findIndex((stop) => stop.id === selectedStop.id)
  const nextStop = routeStops[activeIndex + 1] ?? null
  const selectedIsActive = selectedInRoute && selectedStop.id === visit.activeStopId
  const selectedIsNext = selectedInRoute && selectedIndex === activeIndex + 1
  const selectedIsCompleted = visit.visitedStopIds.includes(selectedStop.id) || (selectedInRoute && selectedIndex < activeIndex)
  const selectedCanRemove = selectedInRoute && !isLockedRouteStop(selectedStop.id)

  useEffect(() => {
    if (!isMapOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMap()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [closeMap, isMapOpen])

  if (!isMapOpen) return null

  const openStopDetails = () => {
    navigate(`/stops/${selectedStop.id}`)
    closeMap()
  }

  const openFullMapPage = () => {
    navigate('/map')
    closeMap()
  }

  const continueRoute = () => {
    if (selectedIsActive) {
      if (!nextStop) {
        finishVisit()
        navigate('/finish')
        closeMap()
        return
      }

      const nextId = continueToNextStop()
      selectStop(nextId)
      navigate('/route')
      closeMap()
      return
    }

    if (selectedInRoute) {
      setActiveStop(selectedStop.id)
      navigate('/route')
      closeMap()
      return
    }

    addStopToRoute(selectedStop.id)
    navigate('/route')
    closeMap()
  }

  const removeSelectedStop = () => {
    if (!selectedCanRemove) return
    removeStopFromRoute(selectedStop.id)
    selectStop(visit.activeStopId)
  }

  return (
    <div aria-labelledby="farm-map-overlay-title" aria-modal="true" className="fixed inset-0 z-[90] flex items-end bg-[#1f1b17]/45 p-0 backdrop-blur-sm md:items-center md:p-6" role="dialog">
      <button aria-hidden="true" className="absolute inset-0 h-full w-full cursor-default" onClick={closeMap} tabIndex={-1} type="button" />
      <section className="relative mx-auto flex max-h-[96vh] w-full max-w-[1180px] flex-col overflow-hidden rounded-t-[24px] border border-[#e8e1d3] bg-[#fbf8f3] shadow-[0_24px_60px_rgba(42,36,32,0.28)] md:rounded-[24px]">
        <header className="flex min-h-[70px] items-center justify-between gap-3 border-b border-[#e8e1d3] bg-white px-4 py-3 md:px-6">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase leading-4 tracking-[0.6px] text-[#c04a2b]">Prigan Guide map</p>
            <h2 className="mt-0.5 truncate text-xl font-semibold leading-7 text-[#2a2420]" id="farm-map-overlay-title">Farm Map</h2>
          </div>
          <div className="flex items-center gap-2">
            <StopStatusPill label={`Stop ${activeIndex + 1} of ${routeStops.length}`} tone="current" />
            <button aria-label="Close map" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e8e1d3] bg-white text-[#6b6359] transition hover:bg-[#fbf8f3] hover:text-[#2a2420]" onClick={closeMap} type="button">
              <X size={18} />
            </button>
          </div>
        </header>

        <div className="grid flex-1 gap-4 overflow-y-auto p-4 md:p-5 lg:grid-cols-[minmax(0,1fr)_318px]">
          <div className="space-y-3">
            <UnifiedFarmMap
              activeStopId={visit.activeStopId}
              className="shadow-none"
              interactive
              onStopSelect={selectStop}
              selectedStopId={selectedStop.id}
              showControls
              showHeader={false}
              showLegend={false}
              showOpenMapAction={false}
              showSafetyNote={false}
              variant="compact"
            />
          </div>

          <aside className="space-y-4">
            <section className="rounded-[18px] border border-[#e8e1d3] bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase leading-4 tracking-[0.5px] text-[#8a7a63]">
                  {selectedIsActive ? 'You are here' : selectedIsNext ? 'Next stop' : selectedIsCompleted ? 'Completed' : selectedInRoute ? 'Route stop' : 'Addable stop'}
                  </p>
                  <h3 className="mt-1 text-[20px] font-semibold leading-6 text-[#2a2420]">{selectedStop.name}</h3>
                </div>
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  selectedIsActive
                    ? 'bg-[#c04a2b] text-white'
                    : selectedIsCompleted
                      ? 'bg-[#3e7f74] text-white'
                      : 'border border-[#f0c4b4] bg-white text-[#c04a2b]'
                }`}>
                  {selectedStop.order}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <StopStatusPill label={selectedIsActive ? 'Current stop' : selectedIsNext ? 'Next stop' : selectedIsCompleted ? 'Completed' : selectedInRoute ? 'Upcoming' : 'Addable'} tone={selectedIsActive ? 'current' : selectedIsNext ? 'next' : selectedIsCompleted ? 'green' : 'neutral'} />
                <StopStatusPill label={`${selectedStop.durationMinutes} min`} />
                <StopStatusPill label={selectedStop.type} />
              </div>

              <p className="mt-4 text-sm leading-[21px] text-[#6b6359]">{selectedStop.description}</p>

              <dl className="mt-4 space-y-2.5 text-xs leading-[18px]">
                <div className="flex gap-2">
                  <Clock3 className="mt-0.5 shrink-0 text-[#8a7a63]" size={14} />
                  <div>
                    <dt className="font-semibold text-[#2a2420]">Time here</dt>
                    <dd className="text-[#6b6359]">{selectedStop.durationMinutes} minutes at this stop</dd>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Footprints className="mt-0.5 shrink-0 text-[#8a7a63]" size={14} />
                  <div>
                    <dt className="font-semibold text-[#2a2420]">Walking cue</dt>
                    <dd className="text-[#6b6359]">{selectedStop.walkingMinutesFromPrevious ? `${selectedStop.walkingMinutesFromPrevious} min from previous stop` : 'Starts at the visitor entrance'}</dd>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Info className="mt-0.5 shrink-0 text-[#8a7a63]" size={14} />
                  <div>
                    <dt className="font-semibold text-[#2a2420]">Safety note</dt>
                    <dd className="text-[#6b6359]">{selectedStop.safetyNotes}</dd>
                  </div>
                </div>
              </dl>
            </section>

            <section className="rounded-[18px] border border-[#e8e1d3] bg-white p-4">
              <h3 className="text-[13px] font-semibold leading-5 text-[#2a2420]">Route list</h3>
              <div className="mt-3 space-y-1.5">
                {routeStops.map((stop, index) => {
                  const isActive = stop.id === visit.activeStopId
                  const isSelected = stop.id === selectedStop.id
                  const isCompleted = visit.visitedStopIds.includes(stop.id) || index < activeIndex

                  return (
                    <button
                      className={`flex min-h-[40px] w-full items-center gap-2 rounded-[10px] border px-2.5 text-left text-xs transition ${
                        isSelected
                          ? 'border-[#f0c4b4] bg-[#fbe4dc] text-[#c04a2b]'
                          : 'border-transparent bg-[#fbf8f3] text-[#6b6359] hover:border-[#e8e1d3] hover:bg-white'
                      }`}
                      key={stop.id}
                      onClick={() => selectStop(stop.id)}
                      type="button"
                    >
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                        isActive
                          ? 'bg-[#c04a2b] text-white'
                          : isCompleted
                            ? 'bg-[#3e7f74] text-white'
                            : 'border border-[#d6cdbb] bg-white text-[#6b6359]'
                      }`}>
                        {isCompleted ? <CheckCircle2 size={13} /> : index + 1}
                      </span>
                      <span className="min-w-0 flex-1 truncate">{stop.name}</span>
                    </button>
                  )
                })}
              </div>
              <div className="mt-4 border-t border-[#e8e1d3] pt-3">
                <h4 className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#8a7a63]">Available stops</h4>
                <div className="mt-2 space-y-1.5">
                  {addableStops.map((stop) => {
                    const isSelected = stop.id === selectedStop.id

                    return (
                      <button
                        className={`flex min-h-[36px] w-full items-center gap-2 rounded-[10px] border px-2.5 text-left text-xs transition ${
                          isSelected
                            ? 'border-[#f0c4b4] bg-[#fff0eb] text-[#c04a2b]'
                            : 'border-transparent bg-[#fff8e8] text-[#6b6359] hover:border-[#e8e1d3] hover:bg-white'
                        }`}
                        key={stop.id}
                        onClick={() => selectStop(stop.id)}
                        type="button"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#d8c49f] bg-white text-[13px] font-bold text-[#8a5a2b]">+</span>
                        <span className="min-w-0 flex-1 truncate">{stop.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </section>

            <div className="space-y-2">
              <Button className="h-11 w-full rounded-[12px]" icon={<ArrowRight size={15} />} onClick={continueRoute}>
                {selectedIsActive ? (nextStop ? `Continue to ${nextStop.shortName}` : 'Finish Visit') : selectedInRoute ? `Choose ${selectedStop.shortName}` : 'Add to route'}
              </Button>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                {selectedCanRemove ? (
                  <Button className="h-10 rounded-[10px] text-xs" icon={<X size={14} />} onClick={removeSelectedStop} tone="secondary">
                    Remove from Route
                  </Button>
                ) : null}
                <Button className="h-10 rounded-[10px] text-xs" icon={<MapPin size={14} />} onClick={openStopDetails} tone="secondary">
                  Open Stop Details
                </Button>
                <Button className="h-10 rounded-[10px] text-xs" icon={<List size={14} />} onClick={() => { navigate('/route'); closeMap() }} tone="secondary">
                  Back to Route
                </Button>
                <Button className="h-10 rounded-[10px] text-xs" icon={<ExternalLink size={14} />} onClick={openFullMapPage} tone="secondary">
                  Full Map Page
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
