import { createContext } from 'react'

export type MapOverlayContextValue = {
  closeMap: () => void
  isMapOpen: boolean
  openMap: (stopId?: string) => void
  selectedStopId: string | null
  selectStop: (stopId: string) => void
}

export const MapOverlayContext = createContext<MapOverlayContextValue | null>(null)
