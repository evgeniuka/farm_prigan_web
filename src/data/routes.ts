import type { Route } from '../types/domain'

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
