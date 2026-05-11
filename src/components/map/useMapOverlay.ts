import { useContext } from 'react'
import { MapOverlayContext } from './mapOverlayContextValue'

export function useMapOverlay() {
  const context = useContext(MapOverlayContext)
  if (!context) {
    throw new Error('useMapOverlay must be used inside MapOverlayProvider')
  }
  return context
}
