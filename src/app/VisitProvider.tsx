import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { getNextStopId } from '../data/helpers'
import { initialUserVisit } from '../data/userVisit'
import type { UserVisit } from '../types/domain'
import { VisitContext } from './VisitContext'
import type { VisitContextValue } from './VisitContext'

const storageKey = 'prigan-guide-visit'
const storageVersion = 3

function readStoredVisit() {
  const stored = window.localStorage.getItem(storageKey)
  if (!stored) return initialUserVisit
  try {
    const parsed = JSON.parse(stored) as Partial<UserVisit> & { storageVersion?: number }
    if (parsed.storageVersion !== storageVersion) return initialUserVisit
    return { ...initialUserVisit, ...parsed } as UserVisit
  } catch {
    return initialUserVisit
  }
}

export function VisitProvider({ children }: { children: ReactNode }) {
  const [visit, setVisit] = useState<UserVisit>(() => readStoredVisit())

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify({ ...visit, storageVersion }))
  }, [visit])

  const setPreference: VisitContextValue['setPreference'] = useCallback((key, value) => {
    setVisit((current) => ({ ...current, [key]: value }))
  }, [])

  const toggleInterest = useCallback((interest: string) => {
    setVisit((current) => {
      const selectedInterests = current.selectedInterests.includes(interest)
        ? current.selectedInterests.filter((item) => item !== interest)
        : [...current.selectedInterests, interest]

      return { ...current, selectedInterests }
    })
  }, [])

  const toggleComfortNeed = useCallback((need: string) => {
    setVisit((current) => {
      const selectedComfortNeeds = current.selectedComfortNeeds.includes(need)
        ? current.selectedComfortNeeds.filter((item) => item !== need)
        : [...current.selectedComfortNeeds, need]
      const selectedWalkingPreference = selectedComfortNeeds.some((item) => item === 'Prefer less walking' || item === 'Need an easier route')
        ? 'Easy walking'
        : current.selectedWalkingPreference

      return { ...current, selectedComfortNeeds, selectedWalkingPreference }
    })
  }, [])

  const acceptRoute = useCallback(() => {
    setVisit((current) => ({ ...current, routeAccepted: true, manualMode: false, finished: false }))
  }, [])

  const editPreferences = useCallback(() => {
    setVisit((current) => ({ ...current, routeAccepted: false }))
  }, [])

  const markVisited = useCallback((stopId: string) => {
    setVisit((current) => ({
      ...current,
      visitedStopIds: current.visitedStopIds.includes(stopId)
        ? current.visitedStopIds
        : [...current.visitedStopIds, stopId],
    }))
  }, [])

  const moveToNext = useCallback((markCurrent: boolean) => {
    let nextId = initialUserVisit.activeStopId
    setVisit((current) => {
      nextId = getNextStopId(current.activeStopId)
      const visitedStopIds = markCurrent && !current.visitedStopIds.includes(current.activeStopId)
        ? [...current.visitedStopIds, current.activeStopId]
        : current.visitedStopIds
      return { ...current, activeStopId: nextId, visitedStopIds }
    })
    return nextId
  }, [])

  const continueToNextStop = useCallback(() => moveToNext(true), [moveToNext])
  const skipStop = useCallback(() => moveToNext(false), [moveToNext])

  const setActiveStop = useCallback((stopId: string) => {
    setVisit((current) => ({ ...current, activeStopId: stopId }))
  }, [])

  const chooseRecommended = useCallback(() => {
    setVisit((current) => ({ ...current, manualMode: false, routeAccepted: false }))
  }, [])

  const chooseManual = useCallback(() => {
    setVisit((current) => ({ ...current, manualMode: true }))
  }, [])

  const toggleSavePepper = useCallback((pepperId: string) => {
    setVisit((current) => ({
      ...current,
      savedPepperIds: current.savedPepperIds.includes(pepperId)
        ? current.savedPepperIds.filter((id) => id !== pepperId)
        : [...current.savedPepperIds, pepperId],
    }))
  }, [])

  const toggleComparePepper = useCallback((pepperId: string) => {
    setVisit((current) => {
      if (current.comparedPepperIds.includes(pepperId)) {
        return { ...current, comparedPepperIds: current.comparedPepperIds.filter((id) => id !== pepperId) }
      }
      const comparedPepperIds = [...current.comparedPepperIds, pepperId].slice(-3)
      return { ...current, comparedPepperIds }
    })
  }, [])

  const removeComparedPepper = useCallback((pepperId: string) => {
    setVisit((current) => ({
      ...current,
      comparedPepperIds: current.comparedPepperIds.filter((id) => id !== pepperId),
    }))
  }, [])

  const finishVisit = useCallback(() => {
    setVisit((current) => ({ ...current, finished: true, routeAccepted: true }))
  }, [])

  const resetVisit = useCallback(() => {
    setVisit(initialUserVisit)
  }, [])

  const value = useMemo(
    () => ({
      visit,
      setPreference,
      toggleInterest,
      toggleComfortNeed,
      acceptRoute,
      editPreferences,
      markVisited,
      continueToNextStop,
      skipStop,
      setActiveStop,
      chooseRecommended,
      chooseManual,
      toggleSavePepper,
      toggleComparePepper,
      removeComparedPepper,
      finishVisit,
      resetVisit,
    }),
    [
      acceptRoute,
      chooseManual,
      chooseRecommended,
      continueToNextStop,
      editPreferences,
      finishVisit,
      markVisited,
      removeComparedPepper,
      resetVisit,
      setActiveStop,
      setPreference,
      skipStop,
      toggleComfortNeed,
      toggleComparePepper,
      toggleInterest,
      toggleSavePepper,
      visit,
    ],
  )

  return <VisitContext.Provider value={value}>{children}</VisitContext.Provider>
}
