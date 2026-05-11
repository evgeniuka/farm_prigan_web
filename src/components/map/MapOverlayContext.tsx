import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { MapOverlayContext } from './mapOverlayContextValue'

export function MapOverlayProvider({ children }: { children: ReactNode }) {
  const [isMapOpen, setIsMapOpen] = useState(false)
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null)

  const closeMap = useCallback(() => {
    setIsMapOpen(false)
  }, [])

  const openMap = useCallback((stopId?: string) => {
    setSelectedStopId(stopId ?? null)
    setIsMapOpen(true)
  }, [])

  const selectStop = useCallback((stopId: string) => {
    setSelectedStopId(stopId)
  }, [])

  const value = useMemo(
    () => ({ closeMap, isMapOpen, openMap, selectedStopId, selectStop }),
    [closeMap, isMapOpen, openMap, selectedStopId, selectStop],
  )

  return <MapOverlayContext.Provider value={value}>{children}</MapOverlayContext.Provider>
}
