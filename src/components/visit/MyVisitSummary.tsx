import { Heart, Route, Trophy } from 'lucide-react'
import { getStop } from '../../data/helpers'
import { peppers } from '../../data/peppers'
import { mainRoute } from '../../data/routes'
import { useVisit } from '../../hooks/useVisit'
import { InfoCard } from '../ui/InfoCard'

export function MyVisitSummary() {
  const { visit } = useVisit()
  const saved = peppers.filter((pepper) => visit.savedPepperIds.includes(pepper.id))
  const routeStops = mainRoute.stops.map(getStop)
  const visited = routeStops.filter((stop) => visit.visitedStopIds.includes(stop.id))

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <InfoCard icon={<Route size={18} />} title="Accepted route">
        <p>{visit.routeAccepted ? mainRoute.name : 'Route ready to accept'}</p>
        <p className="mt-1">{mainRoute.durationMinutes} min / {mainRoute.totalStops} stops</p>
      </InfoCard>
      <InfoCard icon={<Trophy size={18} />} title="Visited stops">
        <p>{visited.length} of {routeStops.length} completed</p>
        <p className="mt-1">{visited.map((stop) => stop.shortName).join(', ') || 'No stops yet'}</p>
      </InfoCard>
      <InfoCard icon={<Heart size={18} />} title="Saved peppers">
        <p>{saved.length} saved</p>
        <p className="mt-1">{saved.map((pepper) => pepper.name).join(', ') || 'No saved peppers yet'}</p>
      </InfoCard>
    </div>
  )
}
