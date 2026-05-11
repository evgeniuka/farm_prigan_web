import { peppers } from './peppers'
import { getRouteStopIds } from './adaptiveRoute'
import { stops } from './stops'
import type { UserVisit } from '../types/domain'

export function getStop(stopId: string) {
  return stops.find((stop) => stop.id === stopId) ?? stops[0]
}

export function getPepper(pepperId: string) {
  return peppers.find((pepper) => pepper.id === pepperId) ?? peppers[0]
}

type RouteInput = Pick<UserVisit, 'selectedDuration' | 'selectedMode' | 'selectedSpiceLevel' | 'routeAccepted' | 'customRouteStopIds'>

export function getRouteStops(visit?: RouteInput) {
  return getRouteStopIds(visit).map(getStop)
}

export function getOptionalStops(visit?: RouteInput) {
  const routeStopIds = new Set(getRouteStopIds(visit))
  return stops
    .filter((stop) => !stop.isRestricted && !routeStopIds.has(stop.id) && stop.id !== 'visitor-center' && stop.id !== 'product-shop')
    .sort((a, b) => a.order - b.order)
}

export function getRouteStopIndex(stopId: string, visit?: RouteInput) {
  const index = getRouteStopIds(visit).indexOf(stopId)
  return index >= 0 ? index : 0
}

export function isRouteStopId(stopId: string, visit?: RouteInput) {
  return getRouteStopIds(visit).includes(stopId)
}

export function getNextStopId(activeStopId: string, visit?: RouteInput) {
  const routeStopIds = getRouteStopIds(visit)
  const currentIndex = getRouteStopIndex(activeStopId, visit)
  return routeStopIds[Math.min(currentIndex + 1, routeStopIds.length - 1)]
}

export function getNextRouteStopId(activeStopId: string, visit?: RouteInput) {
  const routeStopIds = getRouteStopIds(visit)
  const currentIndex = getRouteStopIndex(activeStopId, visit)
  return routeStopIds[currentIndex + 1] ?? null
}

export function getPreviousStopId(activeStopId: string, visit?: RouteInput) {
  const routeStopIds = getRouteStopIds(visit)
  const currentIndex = getRouteStopIndex(activeStopId, visit)
  return routeStopIds[Math.max(currentIndex - 1, 0)]
}
