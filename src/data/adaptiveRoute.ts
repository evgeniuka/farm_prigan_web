import type { Route, Stop, UserVisit } from '../types/domain'
import { stops } from './stops'

type RouteProfile = {
  id: string
  name: string
  fitLevel: string
  reasons: string[]
  stopIds: string[]
}

const baseStart = ['visitor-center']
const baseEnd = ['product-shop']
const lockedRouteStops = new Set(['visitor-center', 'product-shop'])
const routeOrder: Record<string, number> = {
  'visitor-center': 10,
  'seedling-nursery': 20,
  'greenhouse-entry': 30,
  'greenhouse-route': 40,
  'color-pepper-row': 50,
  'tasting-gh-1-2': 60,
  'tasting-gh-3-4': 70,
  'shade-rest-area': 80,
  'packing-demo': 90,
  'product-shop': 100,
}

function hasHotSpice(visit: Pick<UserVisit, 'selectedSpiceLevel'>) {
  return visit.selectedSpiceLevel === 'Hot' || visit.selectedSpiceLevel === 'Very Hot'
}

function wantsExplore(visit: Pick<UserVisit, 'selectedDuration' | 'selectedMode'>) {
  return visit.selectedMode === 'Pepper enthusiast' || visit.selectedDuration === '60 min' || visit.selectedDuration === '75+ min'
}

function wantsQuick(visit: Pick<UserVisit, 'selectedDuration' | 'selectedMode'>) {
  return visit.selectedDuration === '30 min' || visit.selectedMode === 'Fast overview'
}

function stopById(stopId: string) {
  return stops.find((stop) => stop.id === stopId)
}

function routeDuration(stopIds: string[]) {
  return stopIds.reduce((total, stopId) => {
    const stop = stopById(stopId)
    return stop ? total + stop.durationMinutes : total
  }, 0)
}

function isAllowedStop(stopId: string) {
  const stop = stopById(stopId)
  return Boolean(stop && !stop.isRestricted)
}

function rankStop(stopId: string) {
  return routeOrder[stopId] ?? stopById(stopId)?.order ?? 999
}

export function isLockedRouteStop(stopId: string) {
  return lockedRouteStops.has(stopId)
}

export function normalizeRouteStopIds(stopIds: string[]) {
  const uniqueStops = Array.from(new Set(stopIds)).filter(isAllowedStop)
  const middleStops = uniqueStops
    .filter((stopId) => !lockedRouteStops.has(stopId))
    .sort((a, b) => rankStop(a) - rankStop(b))

  return ['visitor-center', ...middleStops, 'product-shop']
}

export function insertRouteStop(stopIds: string[], stopId: string) {
  return normalizeRouteStopIds([...stopIds, stopId])
}

export function removeRouteStop(stopIds: string[], stopId: string) {
  if (lockedRouteStops.has(stopId)) return normalizeRouteStopIds(stopIds)
  return normalizeRouteStopIds(stopIds.filter((id) => id !== stopId))
}

function buildProfile(visit: Pick<UserVisit, 'selectedDuration' | 'selectedMode' | 'selectedSpiceLevel'>): RouteProfile {
  const hot = hasHotSpice(visit)

  if (wantsQuick(visit)) {
    return {
      id: hot ? 'quick-hot-route' : 'quick-mild-route',
      name: hot ? 'Quick Route with Optional Heat' : 'Quick Family Route',
      fitLevel: 'High fit',
      reasons: [
        'Shorter route for a 30 minute or quick-tour visit',
        hot ? 'Keeps one stronger tasting option available' : 'Keeps tasting mild and beginner-friendly',
        'Skips longer greenhouse reading sections',
        'Ends near the Product Shop',
      ],
      stopIds: [
        ...baseStart,
        'greenhouse-entry',
        'tasting-gh-1-2',
        ...(hot ? ['tasting-gh-3-4'] : []),
        ...baseEnd,
      ],
    }
  }

  if (wantsExplore(visit)) {
    return {
      id: hot ? 'explore-hot-route' : 'explore-learning-route',
      name: hot ? 'Pepper Enthusiast Route' : 'Greenhouse Learning Route',
      fitLevel: 'High fit',
      reasons: [
        'Adds deeper greenhouse learning for a longer visit',
        'Includes comparison stops before tasting',
        hot ? 'Adds the hot tasting point with safety guidance' : 'Keeps tasting approachable',
        'Still avoids staff-only areas',
      ],
      stopIds: [
        ...baseStart,
        'seedling-nursery',
        'greenhouse-entry',
        'greenhouse-route',
        'color-pepper-row',
        'tasting-gh-1-2',
        ...(hot ? ['tasting-gh-3-4'] : []),
        ...(visit.selectedDuration === '75+ min' ? ['packing-demo'] : []),
        ...baseEnd,
      ],
    }
  }

  return {
    id: hot ? 'balanced-hot-route' : 'balanced-mild-route',
    name: hot ? 'Balanced Route with Hot Tasting' : 'Balanced Mild Route',
    fitLevel: 'High fit',
    reasons: [
      'Fits a standard 40-45 minute visit',
      'Keeps the main greenhouse route before tasting',
      hot ? 'Adds the optional hot tasting point' : 'Keeps tasting mild and family-friendly',
      'Avoids staff-only areas',
    ],
    stopIds: [
      ...baseStart,
      'greenhouse-entry',
      'greenhouse-route',
      'tasting-gh-1-2',
      ...(hot ? ['tasting-gh-3-4'] : []),
      ...baseEnd,
    ],
  }
}

type RouteVisitInput = Pick<UserVisit, 'selectedDuration' | 'selectedMode' | 'selectedSpiceLevel' | 'routeAccepted' | 'customRouteStopIds'>

export function buildAdaptiveRoute(visit: RouteVisitInput): Route {
  const profile = buildProfile(visit)
  const customStopIds = visit.customRouteStopIds?.length ? normalizeRouteStopIds(visit.customRouteStopIds) : null
  const stopIds = customStopIds ?? profile.stopIds

  return {
    id: customStopIds ? 'custom-visitor-route' : profile.id,
    name: customStopIds ? 'Custom Visitor Route' : profile.name,
    durationMinutes: routeDuration(stopIds),
    totalStops: stopIds.length,
    fitLevel: customStopIds ? 'Manual fit' : profile.fitLevel,
    recommendedBecause: customStopIds
      ? [
          'You manually adjusted this route',
          'Start and finish points are kept stable',
          'Staff-only areas are still excluded',
          'You can restore the AI route anytime',
        ]
      : profile.reasons,
    stops: stopIds,
    activeStopId: stopIds[0],
    accepted: visit.routeAccepted,
  }
}

export function getRouteStopIds(visit?: RouteVisitInput) {
  return visit ? buildAdaptiveRoute(visit).stops : buildProfile({
    selectedDuration: '40-45 min',
    selectedMode: 'Family / Beginner-friendly',
    selectedSpiceLevel: 'Mild',
  }).stopIds
}

export function getClosestStopInRoute(activeStopId: string, routeStopIds: string[]) {
  if (routeStopIds.includes(activeStopId)) return activeStopId

  const currentOrder = stopById(activeStopId)?.order ?? 1
  const nextByOrder = routeStopIds
    .map((stopId) => stopById(stopId))
    .filter((stop): stop is Stop => Boolean(stop))
    .find((stop) => stop.order >= currentOrder)

  return nextByOrder?.id ?? routeStopIds[routeStopIds.length - 1] ?? 'visitor-center'
}
