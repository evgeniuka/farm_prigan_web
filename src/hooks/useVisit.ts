import { useContext } from 'react'
import { VisitContext } from '../app/VisitContext'

export function useVisit() {
  const context = useContext(VisitContext)
  if (!context) {
    throw new Error('useVisit must be used inside VisitProvider')
  }
  return context
}
