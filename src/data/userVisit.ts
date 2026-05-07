import type { UserVisit } from '../types/domain'

export const initialUserVisit: UserVisit = {
  selectedDuration: '40-45 min',
  selectedMode: 'Family / Beginner-friendly',
  selectedInterests: ['Tasting'],
  selectedSpiceLevel: 'Mild',
  selectedWalkingPreference: 'Easy walking',
  selectedComfortNeeds: [],
  routeAccepted: false,
  activeStopId: 'greenhouse-route',
  visitedStopIds: ['visitor-center', 'greenhouse-entry'],
  savedPepperIds: ['lemon-drop', 'jalapeno', 'habanero'],
  comparedPepperIds: [],
  manualMode: false,
  finished: false,
}
