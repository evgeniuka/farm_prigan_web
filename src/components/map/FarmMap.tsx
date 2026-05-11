import { Link } from 'react-router-dom'
import { getNextStopId, getRouteStops } from '../../data/helpers'
import { useVisit } from '../../hooks/useVisit'

export function FarmMap({ compact = false }: { compact?: boolean }) {
  const { visit, setActiveStop } = useVisit()
  const routeStops = getRouteStops(visit)
  const nextStopId = getNextStopId(visit.activeStopId, visit)
  const polyline = routeStops.map((stop) => `${stop.mapPosition.x},${stop.mapPosition.y}`).join(' ')

  return (
    <section className="soft-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--soft-border)] px-5 py-4">
        <div>
          <h2 className="font-semibold text-[var(--ink)]">Farm map</h2>
          <p className="text-sm text-[var(--muted)]">Schematic visitor route, not GPS.</p>
        </div>
        {!compact ? <Link className="text-sm font-semibold text-[var(--terracotta)]" to="/map">Open full map</Link> : null}
      </div>
      <div className="bg-[#f4ead5] p-4">
        <svg className="h-auto w-full" viewBox="0 0 100 86" role="img" aria-label="Schematic farm map">
          <rect fill="#fffaf0" height="86" rx="4" width="100" />
          <rect fill="#e4efd5" height="28" rx="3" width="28" x="26" y="14" />
          <rect fill="#eaf3df" height="28" rx="3" width="28" x="58" y="18" />
          <rect fill="#f3d6cf" height="18" rx="3" width="18" x="46" y="60" />
          <rect fill="#fbf2df" height="14" rx="3" stroke="#d9c5a5" width="18" x="7" y="65" />
          <rect fill="#fff4d8" height="14" rx="3" stroke="#d9c5a5" width="18" x="75" y="65" />
          <text className="map-label" x="30" y="29">GH Route</text>
          <text className="map-label" x="61" y="33">GH 1-2</text>
          <text className="map-muted" x="47" y="70">Restricted</text>
          <text className="map-muted" x="9" y="74">Visitor</text>
          <text className="map-muted" x="79" y="74">Shop</text>
          <polyline fill="none" points={polyline} stroke="#bf4528" strokeDasharray="2 1.6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
          {routeStops.map((stop) => {
            const current = stop.id === visit.activeStopId
            const next = stop.id === nextStopId && stop.id !== visit.activeStopId
            return (
              <g key={stop.id}>
                <circle
                  cx={stop.mapPosition.x}
                  cy={stop.mapPosition.y}
                  fill={current ? '#bf4528' : next ? '#6f8f3f' : '#ffffff'}
                  r={current ? 3.5 : 2.8}
                  stroke={current ? '#8f301d' : '#7f6f57'}
                  strokeWidth="0.8"
                />
                {!compact ? <text className="map-muted" textAnchor="middle" x={stop.mapPosition.x} y={stop.mapPosition.y - 5}>{stop.shortName}</text> : null}
              </g>
            )
          })}
        </svg>
      </div>
      {!compact ? (
        <div className="grid gap-2 p-4 md:grid-cols-2">
          {routeStops.map((stop, index) => (
            <button
              className={`rounded-lg border px-3 py-2 text-left text-sm ${stop.id === visit.activeStopId ? 'border-[var(--terracotta)] bg-[#fff1ed]' : 'border-[var(--soft-border)] bg-white hover:bg-[var(--cream-100)]'}`}
              key={stop.id}
              onClick={() => setActiveStop(stop.id)}
              type="button"
            >
              <span className="font-semibold text-[var(--ink)]">{index + 1}. {stop.shortName}</span>
              <span className="block text-xs text-[var(--muted)]">{stop.tags.slice(0, 2).join(' / ')}</span>
            </button>
          ))}
        </div>
      ) : null}
    </section>
  )
}
