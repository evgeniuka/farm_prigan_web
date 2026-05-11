import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { getNextStopId, isRouteStopId } from '../data/helpers'
import { getClosestStopInRoute, getRouteStopIds, insertRouteStop, isLockedRouteStop, removeRouteStop } from '../data/adaptiveRoute'
import { initialUserVisit } from '../data/userVisit'
import type { UserVisit } from '../types/domain'
import { VisitContext } from './VisitContext'
import type { VisitContextValue } from './VisitContext'

const storageKey = 'prigan-guide-visit'
const storageVersion = 8

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

function sameRoute(left: string[], right: string[]) {
  return left.length === right.length && left.every((stopId, index) => stopId === right[index])
}

export function VisitProvider({ children }: { children: ReactNode }) {
  const [visit, setVisit] = useState<UserVisit>(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('resetVisit') === '1' ? initialUserVisit : readStoredVisit()
  })

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify({ ...visit, storageVersion }))
  }, [visit])

  const setPreference: VisitContextValue['setPreference'] = useCallback((key, value) => {
    setVisit((current) => {
      const nextVisit = { ...current, [key]: value, customRouteStopIds: null, routeAccepted: false, finished: false }
      const routeStopIds = getRouteStopIds(nextVisit)
      return {
        ...nextVisit,
        activeStopId: getClosestStopInRoute(current.activeStopId, routeStopIds),
      }
    })
  }, [])

  const setLanguage: VisitContextValue['setLanguage'] = useCallback((selectedLanguage) => {
    setVisit((current) => ({ ...current, selectedLanguage }))
  }, [])

  const toggleInterest = useCallback((interest: string) => {
    setVisit((current) => {
      const selectedInterests = current.selectedInterests.includes(interest)
        ? current.selectedInterests.filter((item) => item !== interest)
        : [...current.selectedInterests, interest]

      return { ...current, selectedInterests, routeAccepted: false, finished: false }
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

      return { ...current, selectedComfortNeeds, selectedWalkingPreference, routeAccepted: false, finished: false }
    })
  }, [])

  const acceptRoute = useCallback(() => {
    setVisit((current) => ({
      ...current,
      activeStopId: isRouteStopId(current.activeStopId, current) ? current.activeStopId : getRouteStopIds(current)[0],
      routeAccepted: true,
      manualMode: false,
      finished: false,
    }))
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
      nextId = getNextStopId(current.activeStopId, current)
      const visitedStopIds = markCurrent && !current.visitedStopIds.includes(current.activeStopId)
        ? [...current.visitedStopIds, current.activeStopId]
        : current.visitedStopIds
      return { ...current, activeStopId: nextId, visitedStopIds }
    })
    return nextId
  }, [])

  const continueToNextStop = useCallback(() => moveToNext(true), [moveToNext])
  const skipStop = useCallback(() => moveToNext(false), [moveToNext])
  const shortenRoute = useCallback(() => {
    let nextActiveStopId = initialUserVisit.activeStopId

    setVisit((current) => ({
      ...current,
      activeStopId: (() => {
        const nextVisit = { ...current, selectedDuration: '30 min', customRouteStopIds: null, manualMode: false, routeAccepted: true, finished: false }
        const routeStopIds = getRouteStopIds(nextVisit)
        nextActiveStopId = getClosestStopInRoute(current.activeStopId, routeStopIds)
        return nextActiveStopId
      })(),
      manualMode: false,
      routeAccepted: true,
      finished: false,
      customRouteStopIds: null,
      selectedDuration: '30 min',
    }))

    return nextActiveStopId
  }, [])

  const addStopToRoute = useCallback((stopId: string) => {
    setVisit((current) => {
      const currentRouteStopIds = getRouteStopIds(current)
      const customRouteStopIds = insertRouteStop(current.customRouteStopIds ?? currentRouteStopIds, stopId)
      const recommendedRouteStopIds = getRouteStopIds({ ...current, customRouteStopIds: null })
      const customMatchesRecommended = sameRoute(customRouteStopIds, recommendedRouteStopIds)

      return {
        ...current,
        customRouteStopIds: customMatchesRecommended ? null : customRouteStopIds,
        manualMode: !customMatchesRecommended,
        finished: false,
      }
    })
  }, [])

  const removeStopFromRoute = useCallback((stopId: string) => {
    if (isLockedRouteStop(stopId)) return

    setVisit((current) => {
      const currentRouteStopIds = getRouteStopIds(current)
      const customRouteStopIds = removeRouteStop(current.customRouteStopIds ?? currentRouteStopIds, stopId)
      const activeStopId = getClosestStopInRoute(current.activeStopId === stopId ? stopId : current.activeStopId, customRouteStopIds)
      const recommendedRouteStopIds = getRouteStopIds({ ...current, customRouteStopIds: null })
      const customMatchesRecommended = sameRoute(customRouteStopIds, recommendedRouteStopIds)

      return {
        ...current,
        activeStopId,
        customRouteStopIds: customMatchesRecommended ? null : customRouteStopIds,
        manualMode: !customMatchesRecommended,
        finished: false,
      }
    })
  }, [])

  const resetCustomRoute = useCallback(() => {
    setVisit((current) => {
      const nextVisit = { ...current, customRouteStopIds: null, manualMode: false, routeAccepted: false, finished: false }
      const routeStopIds = getRouteStopIds(nextVisit)
      return {
        ...nextVisit,
        activeStopId: getClosestStopInRoute(current.activeStopId, routeStopIds),
      }
    })
  }, [])

  const setActiveStop = useCallback((stopId: string) => {
    setVisit((current) => ({ ...current, activeStopId: stopId, finished: false }))
  }, [])

  const chooseRecommended = useCallback(() => {
    setVisit((current) => ({ ...current, customRouteStopIds: null, manualMode: false, routeAccepted: false }))
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
      setLanguage,
      toggleInterest,
      toggleComfortNeed,
      acceptRoute,
      editPreferences,
      markVisited,
      continueToNextStop,
      skipStop,
      shortenRoute,
      addStopToRoute,
      removeStopFromRoute,
      resetCustomRoute,
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
      addStopToRoute,
      chooseManual,
      chooseRecommended,
      continueToNextStop,
      editPreferences,
      finishVisit,
      markVisited,
      removeComparedPepper,
      removeStopFromRoute,
      resetVisit,
      resetCustomRoute,
      setActiveStop,
      setPreference,
      setLanguage,
      shortenRoute,
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
