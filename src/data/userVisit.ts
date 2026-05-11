import type { UserVisit } from '../types/domain'

export const initialUserVisit: UserVisit = {
  selectedLanguage: 'EN',
  selectedDuration: '40-45 min',
  selectedMode: 'Family / Beginner-friendly',
  selectedInterests: ['Tasting'],
  selectedSpiceLevel: 'Mild',
  selectedWalkingPreference: 'Easy walking',
  selectedComfortNeeds: [],
  routeAccepted: false,
  customRouteStopIds: null,
  activeStopId: 'visitor-center',
  visitedStopIds: [],
  savedPepperIds: [],
  comparedPepperIds: [],
  manualMode: false,
  finished: false,
}
