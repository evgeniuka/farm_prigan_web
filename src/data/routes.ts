import type { Route } from '../types/domain'

export type RouteAlternative = {
  id: string
  name: string
  durationMinutes: number
  description: string
  bestFor: string
  stopIds: string[]
  tradeoff: string
}

export const mainRoute: Route = {
  id: 'recommended-family-mild',
  name: 'Mild Farm Route',
  durationMinutes: 45,
  totalStops: 5,
  fitLevel: 'Strong fit',
  recommendedBecause: [
    'Matches a 40-45 minute visit',
    'Keeps walking distance short',
    'Starts near the Visitor Center',
    'Includes greenhouse learning before tasting',
    'Avoids staff-only and restricted areas',
  ],
  stops: ['visitor-center', 'greenhouse-entry', 'greenhouse-route', 'tasting-gh-1-2', 'product-shop'],
  activeStopId: 'greenhouse-route',
  accepted: false,
}

export const routeAlternatives: RouteAlternative[] = [
  {
    id: 'quick-family-loop',
    name: 'Quick Family Loop',
    durationMinutes: 30,
    description: 'A shorter version that keeps orientation, mild tasting, and the Product Shop.',
    bestFor: 'Families, low reading, tired visitors',
    stopIds: ['visitor-center', 'greenhouse-entry', 'tasting-gh-1-2', 'product-shop'],
    tradeoff: 'Less greenhouse learning, lower walking time.',
  },
  {
    id: 'learning-detour',
    name: 'Greenhouse Learning Detour',
    durationMinutes: 55,
    description: 'Adds young plants and color comparison before tasting.',
    bestFor: 'Visitors who want to understand how peppers grow',
    stopIds: ['visitor-center', 'seedling-nursery', 'greenhouse-entry', 'greenhouse-route', 'color-pepper-row', 'tasting-gh-1-2', 'product-shop'],
    tradeoff: 'More reading and a longer greenhouse section.',
  },
  {
    id: 'enthusiast-tasting',
    name: 'Pepper Enthusiast Route',
    durationMinutes: 60,
    description: 'Adds color comparison and the optional hot tasting point.',
    bestFor: 'Pepper enthusiasts and comparison tasks',
    stopIds: ['visitor-center', 'greenhouse-route', 'color-pepper-row', 'tasting-gh-1-2', 'tasting-gh-3-4', 'product-shop'],
    tradeoff: 'Includes stronger heat warnings and is not ideal for beginners.',
  },
]
