import { createContext } from 'react'
import type { UserVisit } from '../types/domain'

export type VisitContextValue = {
  visit: UserVisit
  setPreference: (key: keyof Pick<UserVisit, 'selectedDuration' | 'selectedMode' | 'selectedSpiceLevel' | 'selectedWalkingPreference'>, value: string) => void
  toggleInterest: (interest: string) => void
  toggleComfortNeed: (need: string) => void
  acceptRoute: () => void
  editPreferences: () => void
  markVisited: (stopId: string) => void
  continueToNextStop: () => string
  skipStop: () => string
  setActiveStop: (stopId: string) => void
  chooseRecommended: () => void
  chooseManual: () => void
  toggleSavePepper: (pepperId: string) => void
  toggleComparePepper: (pepperId: string) => void
  removeComparedPepper: (pepperId: string) => void
  finishVisit: () => void
  resetVisit: () => void
}

export const VisitContext = createContext<VisitContextValue | null>(null)
