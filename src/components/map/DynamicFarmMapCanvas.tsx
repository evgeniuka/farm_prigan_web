import { Check, Lock, MapPin } from 'lucide-react'
import { getRouteStops } from '../../data/helpers'
import { stops } from '../../data/stops'
import type { Stop } from '../../types/domain'
import { cn } from '../../utils/cn'

type DynamicFarmMapCanvasProps = {
  activeStopId: string
  className?: string
  onStopSelect?: (stopId: string) => void
  routeStops?: Stop[]
  selectedStopId?: string | null
}

type StopPoint = {
  id: string
  x: number
  y: number
}

const stopPoints: StopPoint[] = [
  { id: 'visitor-center', x: 548, y: 204 },
  { id: 'greenhouse-entry', x: 286, y: 88 },
  { id: 'greenhouse-route', x: 176, y: 238 },
  { id: 'tasting-gh-1-2', x: 548, y: 288 },
  { id: 'product-shop', x: 548, y: 416 },
]

const optionalStopPoints: StopPoint[] = [
  { id: 'seedling-nursery', x: 82, y: 118 },
  { id: 'color-pepper-row', x: 254, y: 246 },
  { id: 'shade-rest-area', x: 510, y: 136 },
  { id: 'tasting-gh-3-4', x: 548, y: 372 },
  { id: 'packing-demo', x: 512, y: 438 },
]

const overlayButtonPositions: Record<string, { left: string; top: string }> = {
  'visitor-center': { left: '76%', top: '44%' },
  'greenhouse-entry': { left: '39.6%', top: '19.1%' },
  'greenhouse-route': { left: '24.4%', top: '51.7%' },
  'tasting-gh-1-2': { left: '76%', top: '62.6%' },
  'product-shop': { left: '76%', top: '90.4%' },
  'seedling-nursery': { left: '11.4%', top: '25.7%' },
  'color-pepper-row': { left: '35.2%', top: '53.5%' },
  'shade-rest-area': { left: '70.7%', top: '29.6%' },
  'tasting-gh-3-4': { left: '76%', top: '80.9%' },
  'packing-demo': { left: '71%', top: '95.2%' },
}

const pointById = [...stopPoints, ...optionalStopPoints].reduce<Record<string, StopPoint>>((points, point) => {
  points[point.id] = point
  return points
}, {})

function getRoutePath(points: StopPoint[]) {
  if (points.length <= 1) return ''
  const commands = [`M ${points[0].x} ${points[0].y}`]

  for (let index = 0; index < points.length - 1; index += 1) {
    const from = points[index]
    const to = points[index + 1]
    const bends: Array<Pick<StopPoint, 'x' | 'y'>> = []
    const crossesBetweenGreenhouseAndRightSide = (from.x < 380 && to.x > 500) || (from.x > 500 && to.x < 380)
    const greenhouseTopMove = from.x < 380 && to.x < 380 && (from.y < 150 || to.y < 150)

    if (crossesBetweenGreenhouseAndRightSide) {
      bends.push({ x: from.x, y: 416 }, { x: to.x, y: 416 })
    } else if (greenhouseTopMove) {
      bends.push({ x: from.x, y: 96 }, { x: to.x, y: 96 })
    }

    for (const bend of bends) {
      const lastCommand = commands[commands.length - 1]
      if (!lastCommand.endsWith(`${bend.x} ${bend.y}`)) commands.push(`L ${bend.x} ${bend.y}`)
    }
    commands.push(`L ${to.x} ${to.y}`)
  }

  return commands.join(' ')
}

function getRouteStatus(routeStops: Stop[], stopId: string, fallback = 'Available') {
  const index = routeStops.findIndex((stop) => stop.id === stopId)
  return index >= 0 ? `Stop ${index + 1}` : fallback
}

function getRouteStatusFill(routeStops: Stop[], stopId: string, activeStopId: string, selectedStopId?: string | null) {
  if (activeStopId === stopId || selectedStopId === stopId) return '#fff1ed'
  if (routeStops.some((stop) => stop.id === stopId)) return '#fffaf2'
  return '#fff8e8'
}

function getRouteStatusStroke(routeStops: Stop[], stopId: string, activeStopId: string, selectedStopId?: string | null) {
  if (activeStopId === stopId || selectedStopId === stopId) return '#c04a2b'
  if (routeStops.some((stop) => stop.id === stopId)) return '#d8c49f'
  return '#d8c49f'
}

function getCurrentCallout(activeStopId: string, label: string, progressLabel: string) {
  if (activeStopId === 'greenhouse-route') {
    return (
      <g>
        <rect fill="#fffaf2" height="54" rx="8" stroke="#c04a2b" strokeWidth="2" width="142" x="34" y="220" />
        <path d="M176 247 L196 247" stroke="#c04a2b" strokeLinecap="round" strokeWidth="2" />
        <text fill="#c04a2b" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700" textAnchor="middle" x="105" y="238">
          You are here
        </text>
        <text fill="#2a2420" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700" textAnchor="middle" x="105" y="253">
          {label}
        </text>
        <text fill="#6b6359" fontFamily="Inter, sans-serif" fontSize="8.5" textAnchor="middle" x="105" y="266">
          {progressLabel}
        </text>
      </g>
    )
  }

  return null
}

export function DynamicFarmMapCanvas({
  activeStopId,
  className,
  onStopSelect,
  routeStops: providedRouteStops,
  selectedStopId,
}: DynamicFarmMapCanvasProps) {
  const routeStops = providedRouteStops ?? getRouteStops()
  const routeStopIds = new Set(routeStops.map((stop) => stop.id))
  const addableStops = stops.filter((stop) => !stop.isRestricted && !routeStopIds.has(stop.id) && stop.id !== 'visitor-center' && stop.id !== 'product-shop')
  const routePointEntries = routeStops
    .map((stop) => ({ point: pointById[stop.id], stop }))
    .filter((entry): entry is { point: StopPoint; stop: Stop } => Boolean(entry.point))
  const activeIndex = Math.max(0, routeStops.findIndex((stop) => stop.id === activeStopId))
  const activeStop = routeStops[activeIndex] ?? routeStops[0]
  const nextStop = routeStops[activeIndex + 1] ?? null
  const greenhouseRouteActive = activeStopId === 'greenhouse-route'
  const greenhouseRouteInRoute = routeStopIds.has('greenhouse-route')
  const tastingGh34Selected = selectedStopId === 'tasting-gh-3-4'
  const tastingGh34InRoute = routeStopIds.has('tasting-gh-3-4')
  const fullRoutePath = getRoutePath(routePointEntries.map((entry) => entry.point))
  const completedPath = getRoutePath(routePointEntries.slice(0, activeIndex + 1).map((entry) => entry.point))
  const nextPath = getRoutePath(routePointEntries.slice(activeIndex, activeIndex + 2).map((entry) => entry.point))
  const progressLabel = `Stop ${activeIndex + 1} of ${routeStops.length}`
  const addablePointEntries = addableStops
    .map((stop) => ({ point: pointById[stop.id], stop }))
    .filter((entry): entry is { point: StopPoint; stop: Stop } => Boolean(entry.point))

  return (
    <div className={cn('relative overflow-x-auto rounded-[14px] bg-[#f6efe1]', className)}>
      <svg
        aria-label={`Schematic farm map. Current stop is ${activeStop.name}.`}
        className="block h-auto min-w-[721px] max-w-none sm:min-w-0 sm:w-full"
        role="img"
        viewBox="0 0 721 460"
      >
        <title>Prigan farm route map</title>
        <rect fill="#f6efe1" height="460" rx="14" width="721" />

        <rect fill="#c04a2b" height="22" rx="11" width="282" x="16" y="14" />
        <circle cx="30" cy="25" fill="#f4d6c9" r="4" />
        <text fill="#ffffff" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700" x="42" y="29">
          You are here: {activeStop.shortName} - {progressLabel}
        </text>

        <rect fill="#e6f4d5" height="384" rx="10" stroke="#9ecb85" strokeDasharray="5 4" strokeWidth="1.5" width="352" x="20" y="54" />
        <text fill="#3a6535" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="700" textAnchor="middle" x="196" y="76">
          Greenhouse Route - 8 Bays
        </text>
        <text fill="#5a7a5a" fontFamily="Inter, sans-serif" fontSize="8.5" textAnchor="middle" x="196" y="91">
          {greenhouseRouteActive ? 'Bays 1-3 completed - Bay 4 active - Bays 5-8 upcoming' : greenhouseRouteInRoute ? 'Included in this route - tap marker for details' : 'Available learning stop - add it when needed'}
        </text>

        {[0, 1, 2, 3, 4, 5, 6, 7].map((bay) => {
          const x = 36 + bay * 39
          const done = bay < 3
          return (
            <g key={bay}>
              <rect
                fill={done ? '#b0d995' : '#d8efc4'}
                height="300"
                rx="5"
                stroke="#88ba6b"
                strokeWidth="1.4"
                width="34"
                x={x}
                y="106"
              />
              {bay === 3 && greenhouseRouteInRoute ? (
                <rect fill="none" height="346" rx="4" stroke={greenhouseRouteActive ? '#c04a2b' : '#3f8a4a'} strokeDasharray={greenhouseRouteActive ? undefined : '5 4'} strokeWidth="2.2" width="42" x={x - 4} y="104" />
              ) : null}
              <text fill="#8a9c75" fontFamily="Inter, sans-serif" fontSize="7.5" textAnchor="middle" x={x + 17} y="427">
                {bay + 1}
              </text>
              {done ? (
                <g>
                  <circle cx={x + 17} cy="392" fill="#3f8a4a" r="8" />
                  <path d={`M${x + 13} 391 l3 3 l6 -7`} fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
                </g>
              ) : null}
            </g>
          )
        })}

        <rect fill="#d8f1ff" height="16" rx="8" stroke="#8ec3d7" strokeWidth="1" width="352" x="20" y="416" />
        <text fill="#3a6aa3" fontFamily="Inter, sans-serif" fontSize="7.5" textAnchor="middle" x="196" y="428">
          Accessible path - south side of greenhouse
        </text>

        <rect fill={getRouteStatusFill(routeStops, 'seedling-nursery', activeStopId, selectedStopId)} height="28" rx="6" stroke={getRouteStatusStroke(routeStops, 'seedling-nursery', activeStopId, selectedStopId)} strokeWidth={routeStopIds.has('seedling-nursery') ? 1.8 : 1.1} width="84" x="40" y="68" />
        <text fill="#6b4d24" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" textAnchor="middle" x="82" y="82">
          Nursery
        </text>
        <text fill="#8a7a63" fontFamily="Inter, sans-serif" fontSize="7" textAnchor="middle" x="82" y="93">
          {getRouteStatus(routeStops, 'seedling-nursery')}
        </text>

        <rect fill={getRouteStatusFill(routeStops, 'color-pepper-row', activeStopId, selectedStopId)} height="28" rx="6" stroke={getRouteStatusStroke(routeStops, 'color-pepper-row', activeStopId, selectedStopId)} strokeWidth={routeStopIds.has('color-pepper-row') ? 1.8 : 1.1} width="78" x="215" y="194" />
        <text fill="#6b4d24" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" textAnchor="middle" x="254" y="208">
          Color Row
        </text>
        <text fill="#8a7a63" fontFamily="Inter, sans-serif" fontSize="7" textAnchor="middle" x="254" y="219">
          {getRouteStatus(routeStops, 'color-pepper-row')}
        </text>

        <rect fill="#eadfc8" height="286" rx="10" stroke="#d8c49f" strokeWidth="1.4" width="132" x="390" y="116" />
        <text fill="#6b4d24" fontFamily="Inter, sans-serif" fontSize="12" fontWeight="700" textAnchor="middle" x="456" y="140">
          Parking
        </text>
        <text fill="#8a7a63" fontFamily="Inter, sans-serif" fontSize="8.5" textAnchor="middle" x="456" y="154">
          ~3 min walk to tasting area
        </text>
        {[0, 1, 2, 3, 4].map((slot) => (
          <g key={slot}>
            <rect fill="#ffffff" height="34" rx="5" stroke="#e0d7c7" width="92" x="410" y={172 + slot * 43} />
            <g transform={`translate(445 ${184 + slot * 43})`}>
              <rect fill="#c04a2b" height="8" rx="2" width="22" x="0" y="6" />
              <path d="M4 6 L8 1 H15 L19 6 Z" fill="#ef7a5d" stroke="#c04a2b" strokeLinejoin="round" strokeWidth="1" />
              <circle cx="5" cy="15" fill="#2a2420" r="2.5" />
              <circle cx="17" cy="15" fill="#2a2420" r="2.5" />
              <rect fill="#dff1ff" height="4" rx="1" width="5" x="9" y="3" />
            </g>
          </g>
        ))}

        <rect fill={getRouteStatusFill(routeStops, 'shade-rest-area', activeStopId, selectedStopId)} height="24" rx="6" stroke={getRouteStatusStroke(routeStops, 'shade-rest-area', activeStopId, selectedStopId)} strokeWidth={routeStopIds.has('shade-rest-area') ? 1.8 : 1.1} width="76" x="420" y="96" />
        <text fill="#6b4d24" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" textAnchor="middle" x="458" y="112">
          Rest Area
        </text>

        <rect fill="#fff2f2" height="122" rx="10" stroke="#e9a5a0" strokeDasharray="5 4" strokeWidth="1.6" width="176" x="532" y="54" />
        <text fill="#a8423a" fontFamily="Inter, sans-serif" fontSize="12" fontWeight="700" textAnchor="middle" x="620" y="78">
          Staff / Restricted Area
        </text>
        <text fill="#a8423a" fontFamily="Inter, sans-serif" fontSize="8.5" textAnchor="middle" x="620" y="93">
          Production Facility - No visitor access
        </text>
        <rect fill="#f5cccc" height="58" rx="6" stroke="#d99b96" width="148" x="546" y="106" />
        <text fill="#7f3a34" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700" textAnchor="middle" x="620" y="130">
          Production Greenhouses
        </text>
        <text fill="#7f3a34" fontFamily="Inter, sans-serif" fontSize="7.5" textAnchor="middle" x="620" y="144">
          Staff only - visitor access not permitted
        </text>

        <rect fill="#fbf0dc" height="250" rx="7" stroke="#d8c49f" strokeDasharray="4 4" width="42" x="671" y="190" />
        <text fill="#6b6359" fontFamily="Inter, sans-serif" fontSize="8.5" fontWeight="700" textAnchor="middle" x="692" y="213">
          Entrance
        </text>
        <text fill="#6b6359" fontFamily="Inter, sans-serif" fontSize="8.5" textAnchor="middle" x="692" y="225">
          / Exit
        </text>
        <text fill="#8a7a63" fontFamily="Inter, sans-serif" fontSize="8" textAnchor="middle" x="692" y="428">
          Service
        </text>

        {fullRoutePath ? <path d={fullRoutePath} fill="none" stroke="#d3b98e" strokeDasharray="4 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" /> : null}
        <path d={completedPath} fill="none" stroke="#3f8a4a" strokeDasharray="7 5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.6" />
        {nextPath ? <path d={nextPath} fill="none" stroke="#c04a2b" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.8" /> : null}

        <rect
          fill={getRouteStatusFill(routeStops, 'visitor-center', activeStopId, selectedStopId)}
          height="64"
          rx="8"
          stroke={getRouteStatusStroke(routeStops, 'visitor-center', activeStopId, selectedStopId)}
          strokeWidth={activeStopId === 'visitor-center' ? 2 : 1.4}
          width="136"
          x="570"
          y="192"
        />
        <text fill="#7a551b" fontFamily="Inter, sans-serif" fontSize="12" fontWeight="700" textAnchor="middle" x="638" y="212">
          Visitor Center
        </text>
        <text fill="#8a7a63" fontFamily="Inter, sans-serif" fontSize="8.5" textAnchor="middle" x="638" y="228">
          Info - Tickets
        </text>
        <text fill="#3f8a4a" fontFamily="Inter, sans-serif" fontSize="8.5" textAnchor="middle" x="638" y="246">
          {getRouteStatus(routeStops, 'visitor-center')}
        </text>

        <rect
          fill={activeStopId === 'tasting-gh-1-2' || nextStop?.id === 'tasting-gh-1-2' || selectedStopId === 'tasting-gh-1-2' ? '#fff1ed' : routeStopIds.has('tasting-gh-1-2') ? '#fffaf2' : '#fff8e8'}
          height="74"
          rx="8"
          stroke={activeStopId === 'tasting-gh-1-2' || nextStop?.id === 'tasting-gh-1-2' ? '#c04a2b' : '#e8d7bd'}
          strokeWidth={activeStopId === 'tasting-gh-1-2' || nextStop?.id === 'tasting-gh-1-2' ? 2 : 1.4}
          width="136"
          x="570"
          y="266"
        />
        {nextStop?.id === 'tasting-gh-1-2' ? <rect fill="#c04a2b" height="17" rx="4" width="72" x="570" y="266" /> : null}
        {nextStop?.id === 'tasting-gh-1-2' ? (
          <text fill="#ffffff" fontFamily="Inter, sans-serif" fontSize="8" fontWeight="700" textAnchor="middle" x="606" y="278">
            Next stop
          </text>
        ) : null}
        <text fill="#7f321f" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="700" textAnchor="middle" x="638" y="300">
          Tasting GH 1-2
        </text>
        <text fill="#8a4c36" fontFamily="Inter, sans-serif" fontSize="8.5" textAnchor="middle" x="638" y="316">
          Mild heat
        </text>
        <text fill="#3a6aa3" fontFamily="Inter, sans-serif" fontSize="7.5" textAnchor="middle" x="638" y="330">
          {getRouteStatus(routeStops, 'tasting-gh-1-2')}
        </text>

        <rect
          fill={tastingGh34Selected || tastingGh34InRoute ? '#fff1ed' : '#ffd7c5'}
          height="58"
          rx="8"
          stroke={tastingGh34Selected || tastingGh34InRoute ? '#c04a2b' : '#ee9c74'}
          strokeWidth={tastingGh34Selected || tastingGh34InRoute ? 2.2 : 1.4}
          width="136"
          x="570"
          y="352"
        />
        <text fill="#7f321f" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="700" textAnchor="middle" x="638" y="377">
          Tasting GH 3-4
        </text>
        <text fill="#8a4c36" fontFamily="Inter, sans-serif" fontSize="8.5" textAnchor="middle" x="638" y="393">
          {tastingGh34InRoute ? `${getRouteStatus(routeStops, 'tasting-gh-3-4')} - Hot tasting` : 'Hot - Addable stop'}
        </text>

        <rect
          fill={activeStopId === 'product-shop' ? '#fff1ed' : nextStop?.id === 'product-shop' ? '#fff1ed' : '#efe4d0'}
          height="52"
          rx="8"
          stroke={activeStopId === 'product-shop' || nextStop?.id === 'product-shop' ? '#c04a2b' : '#d8c49f'}
          strokeWidth={activeStopId === 'product-shop' || nextStop?.id === 'product-shop' ? 2 : 1.4}
          width="136"
          x="570"
          y="404"
        />
        <text fill="#6b4d24" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="700" textAnchor="middle" x="638" y="440">
          Product Shop
        </text>
        <text fill="#8a7a63" fontFamily="Inter, sans-serif" fontSize="8.5" textAnchor="middle" x="638" y="454">
          {getRouteStatus(routeStops, 'product-shop')} - Final stop
        </text>

        <rect fill={getRouteStatusFill(routeStops, 'packing-demo', activeStopId, selectedStopId)} height="24" rx="6" stroke={getRouteStatusStroke(routeStops, 'packing-demo', activeStopId, selectedStopId)} strokeWidth={routeStopIds.has('packing-demo') ? 1.8 : 1.1} width="76" x="460" y="390" />
        <text fill="#6b4d24" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" textAnchor="middle" x="498" y="406">
          Packing
        </text>

        {getCurrentCallout(activeStopId, activeStop.shortName, progressLabel)}

        {routePointEntries.map(({ point, stop }, index) => {
          const isActive = stop.id === activeStopId
          const isSelected = stop.id === selectedStopId
          const isCompleted = index < activeIndex
          const isNext = index === activeIndex + 1

          return (
            <g key={point.id}>
              {isActive ? <circle cx={point.x} cy={point.y} fill="#c04a2b" opacity="0.18" r="24" /> : null}
              {isSelected ? <circle cx={point.x} cy={point.y} fill="none" r="20" stroke="#f0c4b4" strokeWidth="5" /> : null}
              <circle
                cx={point.x}
                cy={point.y}
                fill={isActive ? '#c04a2b' : isCompleted ? '#3f8a4a' : '#ffffff'}
                r={isActive ? 15 : 12}
                stroke={isActive || isCompleted ? '#ffffff' : isNext ? '#c04a2b' : '#9b8b72'}
                strokeWidth={isActive ? 2.5 : 2}
              />
              {isCompleted ? (
                <path d={`M${point.x - 5} ${point.y} l3.5 4 l7 -8`} fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              ) : (
                <text
                  fill={isActive ? '#ffffff' : isNext ? '#c04a2b' : '#6b6359'}
                  fontFamily="Inter, sans-serif"
                  fontSize={isActive ? 13 : 11}
                  fontWeight="700"
                  textAnchor="middle"
                  x={point.x}
                  y={point.y + 4}
                >
                  {index + 1}
                </text>
              )}
            </g>
          )
        })}

        {addablePointEntries.map(({ point }) => {
          const isSelected = point.id === selectedStopId
          return (
            <g key={point.id}>
              {isSelected ? <circle cx={point.x} cy={point.y} fill="#c04a2b" opacity="0.16" r="18" /> : null}
              <circle
                cx={point.x}
                cy={point.y}
                fill={isSelected ? '#c04a2b' : '#fff8e8'}
                r="9"
                stroke={isSelected ? '#ffffff' : '#b99a61'}
                strokeWidth="2"
              />
              <text
                fill={isSelected ? '#ffffff' : '#8a5a2b'}
                fontFamily="Inter, sans-serif"
                fontSize="10"
                fontWeight="700"
                textAnchor="middle"
                x={point.x}
                y={point.y + 3.5}
              >
                +
              </text>
            </g>
          )
        })}

        <g transform="translate(533 62)">
          <Lock color="#a8423a" size={12} />
        </g>
        <g transform="translate(26 420)">
          <MapPin color="#3a6aa3" size={10} />
        </g>
      </svg>

      {onStopSelect ? (
        <div className="pointer-events-none absolute inset-0 min-w-[721px] sm:min-w-0">
          {routeStops.map((stop, index) => {
            const position = overlayButtonPositions[stop.id]
            const isActive = stop.id === activeStopId
            const isSelected = stop.id === selectedStopId
            const isCompleted = index < activeIndex
            if (!position) return null

            return (
              <button
                aria-label={`Select ${stop.name} on farm map`}
                className={cn(
                  'pointer-events-auto absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-[12px] font-bold shadow-[0_2px_8px_rgba(42,36,32,0.18)] transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#f0c4b4]/70',
                  isActive
                    ? 'border-white bg-[#c04a2b] text-white'
                    : isCompleted
                      ? 'border-white bg-[#3e7f74] text-white'
                      : 'border-[#d6cdbb] bg-white text-[#6b6359]',
                  isSelected && 'ring-4 ring-[#f0c4b4]/80',
                )}
                key={stop.id}
                onClick={() => onStopSelect(stop.id)}
                style={position}
                type="button"
              >
                {isCompleted ? <Check size={15} /> : index + 1}
              </button>
            )
          })}
          {addableStops.map((stop) => {
            const position = overlayButtonPositions[stop.id]
            const isSelected = stop.id === selectedStopId
            if (!position) return null

            return (
              <button
                aria-label={`Select optional stop ${stop.name} on farm map`}
                className={cn(
                  'pointer-events-auto absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-[14px] font-bold shadow-[0_2px_8px_rgba(42,36,32,0.14)] transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#f0c4b4]/70',
                  isSelected ? 'border-white bg-[#c04a2b] text-white' : 'border-[#d8c49f] bg-[#fff8e8] text-[#8a5a2b]',
                )}
                key={stop.id}
                onClick={() => onStopSelect(stop.id)}
                style={position}
                type="button"
              >
                +
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
