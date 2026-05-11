export type StopType = 'arrival' | 'greenhouse' | 'tasting' | 'shop' | 'support'
export type LanguageCode = 'EN' | 'HE' | 'AR'

export type Stop = {
  id: string
  name: string
  shortName: string
  type: StopType
  order: number
  durationMinutes: number
  walkingMinutesFromPrevious: number
  description: string
  whatYouSee: string[]
  whatToDo: string[]
  safetyNotes: string
  imageTone: 'farm' | 'greenhouse' | 'tasting' | 'shop'
  tags: string[]
  mapPosition: { x: number; y: number }
  isRestricted: boolean
  isOptional: boolean
}

export type Route = {
  id: string
  name: string
  durationMinutes: number
  totalStops: number
  fitLevel: string
  recommendedBecause: string[]
  stops: string[]
  activeStopId: string
  accepted: boolean
}

export type Pepper = {
  id: string
  name: string
  heatLevel: number
  shuRange: string
  origin: string
  color: string
  flavorTags: string[]
  suitabilityTags: string[]
  tastingStatus: string
  routeStopId: string
  imageTone: { a: string; b: string; c: string }
  caution: string
  saved: boolean
}

export type UserVisit = {
  selectedLanguage: LanguageCode
  selectedDuration: string
  selectedMode: string
  selectedInterests: string[]
  selectedSpiceLevel: string
  selectedWalkingPreference: string
  selectedComfortNeeds: string[]
  routeAccepted: boolean
  customRouteStopIds: string[] | null
  activeStopId: string
  visitedStopIds: string[]
  savedPepperIds: string[]
  comparedPepperIds: string[]
  manualMode: boolean
  finished: boolean
}
