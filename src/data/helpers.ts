import { peppers } from './peppers'
import { mainRoute } from './routes'
import { stops } from './stops'

export function getStop(stopId: string) {
  return stops.find((stop) => stop.id === stopId) ?? stops[0]
}

export function getPepper(pepperId: string) {
  return peppers.find((pepper) => pepper.id === pepperId) ?? peppers[0]
}

export function getRouteStops() {
  return mainRoute.stops.map(getStop)
}

export function getNextStopId(activeStopId: string) {
  const currentIndex = mainRoute.stops.indexOf(activeStopId)
  return mainRoute.stops[Math.min(currentIndex + 1, mainRoute.stops.length - 1)]
}

export function getPreviousStopId(activeStopId: string) {
  const currentIndex = mainRoute.stops.indexOf(activeStopId)
  return mainRoute.stops[Math.max(currentIndex - 1, 0)]
}
