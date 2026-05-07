import {
  ArrowRight,
  Check,
  Clock,
  Info,
  LocateFixed,
  Lock,
  Minus,
  Move,
  RefreshCcw,
  ShieldAlert,
  ShoppingBag,
  SkipForward,
  Sprout,
  UsersRound,
  ZoomIn,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageShell } from '../components/layout/PageShell'
import { useVisit } from '../hooks/useVisit'
import { cn } from '../utils/cn'

const nearbyStops = [
  {
    id: 'visitor-center',
    icon: <Info size={15} />,
    title: 'Visitor Center',
    meta: 'Info',
    time: '2 min',
    chip: 'Completed',
    tone: 'green' as const,
  },
  {
    id: 'tasting-gh-1-2',
    icon: <Sprout size={15} />,
    title: 'Tasting GH 1-2',
    meta: 'Tasting',
    time: '3 min',
    chip: 'Mild · Next stop',
    tone: 'red' as const,
  },
  {
    id: 'tasting-gh-3-4',
    icon: <Sprout size={15} />,
    title: 'Tasting GH 3-4',
    meta: 'Tasting',
    time: '5 min',
    chip: 'Hot · Optional',
    tone: 'danger' as const,
  },
  {
    id: 'product-shop',
    icon: <ShoppingBag size={15} />,
    title: 'Product Shop',
    meta: 'Shop',
    time: '7 min',
    chip: 'Stop 5',
    tone: 'sand' as const,
  },
  {
    id: 'production-greenhouses',
    icon: <Lock size={15} />,
    title: 'Production Greenhouses',
    meta: 'Staff',
    time: '-',
    chip: 'Restricted',
    tone: 'danger' as const,
  },
]

function Chip({ children, tone = 'sand' }: { children: ReactNode; tone?: 'red' | 'blue' | 'sand' | 'green' | 'danger' }) {
  const classes = {
    red: 'border-[#f0c4b4] bg-[#fbe4dc] text-[#c04a2b]',
    blue: 'border-[#bcd0e7] bg-[#e2ecf7] text-[#3a6aa3]',
    sand: 'border-[#e8e1d3] bg-[#f3ede0] text-[#6b6359]',
    green: 'border-[#bcd9a7] bg-[#eef6e2] text-[#3f8a4a]',
    danger: 'border-[#e9b9b5] bg-[#fdecec] text-[#a8423a]',
  }[tone]

  return <span className={cn('inline-flex min-h-[28px] items-center rounded-full border px-3 text-xs leading-[18px]', classes)}>{children}</span>
}

function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn('rounded-[12px] border border-[#e8e1d3] bg-white', className)}>{children}</section>
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="text-[11px] font-normal uppercase leading-[16.5px] tracking-[0.275px] text-[#8a7a63]">{children}</p>
}

function MapControl({ children, label }: { children: ReactNode; label: string }) {
  return (
    <button
      aria-label={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#6b6359] transition hover:bg-white hover:text-[#2a2420]"
      type="button"
    >
      {children}
    </button>
  )
}

function LegendItem({ children, icon }: { children: ReactNode; icon: ReactNode }) {
  return (
    <li className="flex items-center gap-2 whitespace-nowrap text-xs leading-[18px] text-[#6b6359]">
      {icon}
      {children}
    </li>
  )
}

function FarmMapVisual() {
  return (
    <div>
      <div className="overflow-hidden rounded-[14px] border border-[#e8e1d3] bg-[#f6efe1] p-3">
        <div className="overflow-hidden rounded-[10px] bg-[#f6efe1]">
          <svg
            aria-label="Schematic farm map showing the Greenhouse Route, eight greenhouse bays, visitor center, tasting points, product shop, parking, entrance exit, accessible path, and restricted staff area."
            className="block h-auto w-full"
            role="img"
            viewBox="0 0 721 460"
          >
            <title>Farm map schematic</title>
            <rect fill="#f6efe1" height="460" rx="10" width="721" />

            <rect fill="#c04a2b" height="22" rx="11" width="260" x="0" y="0" />
            <circle cx="11" cy="11" fill="#f4d6c9" r="4" />
            <text fill="#ffffff" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700" x="23" y="15">
              You are here: Greenhouse Route - Stop 3 of 5
            </text>

            <rect fill="#e6f4d5" height="374" rx="9" stroke="#9ecb85" strokeDasharray="5 4" strokeWidth="1.5" width="360" x="10" y="42" />
            <text fill="#3a6535" fontFamily="Inter, sans-serif" fontSize="12" fontWeight="700" textAnchor="middle" x="190" y="62">
              Greenhouse Route - 8 Bays
            </text>
            <text fill="#5a7a5a" fontFamily="Inter, sans-serif" fontSize="8.5" textAnchor="middle" x="190" y="76">
              Bays 1-3 completed - Bay 4 active - Bays 5-8 upcoming
            </text>

            {[0, 1, 2, 3, 4, 5, 6, 7].map((bay) => {
              const x = 22 + bay * 41
              const done = bay < 3
              return (
                <g key={bay}>
                  <rect fill={done ? '#b0d995' : '#d8efc4'} height="275" rx="4" stroke="#88ba6b" strokeWidth="1.2" width="36" x={x} y="98" />
                  {bay === 3 ? <rect fill="none" height="310" rx="3" stroke="#c04a2b" strokeWidth="2" width="42" x={x - 3} y="96" /> : null}
                  <text fill="#8a9c75" fontFamily="Inter, sans-serif" fontSize="7.5" textAnchor="middle" x={x + 18} y="392">
                    {bay + 1}
                  </text>
                  {done ? (
                    <g>
                      <circle cx={x + 18} cy="363" fill="#3f8a4a" r="8" />
                      <path d={`M${x + 14} 362 l3 3 l6 -7`} fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
                    </g>
                  ) : null}
                </g>
              )
            })}

            <rect fill="#d8f1ff" height="16" rx="8" stroke="#8ec3d7" strokeWidth="1" width="360" x="10" y="395" />
            <text fill="#3a6aa3" fontFamily="Inter, sans-serif" fontSize="7.5" textAnchor="middle" x="190" y="407">
              Accessible path - south side of greenhouse
            </text>

            <rect fill="#eadfc8" height="260" rx="8" stroke="#d8c49f" strokeWidth="1.4" width="120" x="390" y="100" />
            <text fill="#6b4d24" fontFamily="Inter, sans-serif" fontSize="12" fontWeight="700" textAnchor="middle" x="450" y="124">
              Parking
            </text>
            <text fill="#8a7a63" fontFamily="Inter, sans-serif" fontSize="8.5" textAnchor="middle" x="450" y="139">
              ~3 min walk to tasting area
            </text>
            {[0, 1, 2, 3, 4].map((slot) => (
              <g key={slot}>
                <rect fill="#ffffff" height="34" rx="4" stroke="#e0d7c7" width="88" x="406" y={156 + slot * 42} />
                <g transform={`translate(439 ${169 + slot * 42})`}>
                  <rect fill="#c04a2b" height="8" rx="2" width="22" x="0" y="6" />
                  <path d="M4 6 L8 1 H15 L19 6 Z" fill="#ef7a5d" stroke="#c04a2b" strokeLinejoin="round" strokeWidth="1" />
                  <circle cx="5" cy="15" fill="#2a2420" r="2.5" />
                  <circle cx="17" cy="15" fill="#2a2420" r="2.5" />
                  <rect fill="#dff1ff" height="4" rx="1" width="5" x="9" y="3" />
                </g>
              </g>
            ))}

            <rect fill="#fff2f2" height="122" rx="9" stroke="#e9a5a0" strokeDasharray="5 4" strokeWidth="1.5" width="184" x="525" y="42" />
            <text fill="#a8423a" fontFamily="Inter, sans-serif" fontSize="12" fontWeight="700" textAnchor="middle" x="617" y="65">
              Staff / Restricted Area
            </text>
            <text fill="#a8423a" fontFamily="Inter, sans-serif" fontSize="8.5" textAnchor="middle" x="617" y="80">
              Production Facility - No visitor access
            </text>
            <rect fill="#f5cccc" height="58" rx="5" stroke="#d99b96" width="156" x="539" y="94" />
            <text fill="#7f3a34" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700" textAnchor="middle" x="617" y="116">
              Production Greenhouses
            </text>
            <text fill="#7f3a34" fontFamily="Inter, sans-serif" fontSize="7.5" textAnchor="middle" x="617" y="131">
              Staff only - visitor access not permitted
            </text>
            <text fill="#a8423a" fontFamily="Inter, sans-serif" fontSize="6.8" textAnchor="middle" x="617" y="143">
              Restricted zone extends beyond this boundary
            </text>

            <path d="M505 207 H486 V86 H286" fill="none" stroke="#3f8a4a" strokeDasharray="6 5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d="M176 236 V389 H506 V282" fill="none" stroke="#c04a2b" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" />
            <path d="M286 86 H390" fill="none" stroke="#3f8a4a" strokeDasharray="6 5" strokeLinecap="round" strokeWidth="2" />

            <rect fill="#fff7e5" height="64" rx="7" stroke="#d9c59a" width="144" x="524" y="180" />
            <text fill="#7a551b" fontFamily="Inter, sans-serif" fontSize="12" fontWeight="700" textAnchor="middle" x="596" y="199">
              Visitor Center
            </text>
            <text fill="#8a7a63" fontFamily="Inter, sans-serif" fontSize="8.5" textAnchor="middle" x="596" y="215">
              Info - Tickets - Orientation
            </text>
            <text fill="#3f8a4a" fontFamily="Inter, sans-serif" fontSize="8.5" textAnchor="middle" x="596" y="233">
              Completed - Stop 1
            </text>
            <circle cx="648" cy="190" fill="#3f8a4a" r="11" />
            <path d="M643 189 l4 4 l8 -9" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />

            <rect fill="#fbf0dc" height="250" rx="7" stroke="#d8c49f" strokeDasharray="4 4" width="42" x="671" y="178" />
            <text fill="#6b6359" fontFamily="Inter, sans-serif" fontSize="8.5" fontWeight="700" textAnchor="middle" x="692" y="200">
              Entrance
            </text>
            <text fill="#6b6359" fontFamily="Inter, sans-serif" fontSize="8.5" textAnchor="middle" x="692" y="212">
              / Exit
            </text>
            <text fill="#8a7a63" fontFamily="Inter, sans-serif" fontSize="8" textAnchor="middle" x="692" y="416">
              Service
            </text>

            <rect fill="#fff1ed" height="75" rx="7" stroke="#c04a2b" strokeWidth="2" width="144" x="524" y="254" />
            <rect fill="#c04a2b" height="18" rx="4" width="86" x="524" y="254" />
            <text fill="#ffffff" fontFamily="Inter, sans-serif" fontSize="8" fontWeight="700" textAnchor="middle" x="567" y="267">
              Next stop
            </text>
            <text fill="#7f321f" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="700" textAnchor="middle" x="596" y="286">
              Tasting Point - GH 1 & 2
            </text>
            <text fill="#8a4c36" fontFamily="Inter, sans-serif" fontSize="8.5" textAnchor="middle" x="596" y="302">
              Mild heat - Beginner-friendly
            </text>
            <text fill="#3a6aa3" fontFamily="Inter, sans-serif" fontSize="7.5" textAnchor="middle" x="596" y="315">
              Accessible - 3 min walk from here
            </text>
            <text fill="#7f321f" fontFamily="Inter, sans-serif" fontSize="8" textAnchor="middle" x="596" y="325">
              Stop 4 of 5
            </text>

            <rect fill="#ffd7c5" height="58" rx="7" stroke="#ee9c74" width="144" x="524" y="340" />
            <text fill="#7f321f" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="700" textAnchor="middle" x="596" y="366">
              Tasting GH 3-4
            </text>
            <text fill="#8a4c36" fontFamily="Inter, sans-serif" fontSize="8.5" textAnchor="middle" x="596" y="382">
              Hot - Optional stop
            </text>

            <rect fill="#efe4d0" height="54" rx="7" stroke="#d8c49f" width="144" x="524" y="406" />
            <text fill="#6b4d24" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="700" textAnchor="middle" x="596" y="429">
              Product Shop
            </text>
            <text fill="#8a7a63" fontFamily="Inter, sans-serif" fontSize="8.5" textAnchor="middle" x="596" y="444">
              Stop 5 - Final stop
            </text>

            <circle cx="286" cy="86" fill="#3f8a4a" r="10" />
            <text fill="#ffffff" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700" textAnchor="middle" x="286" y="90">
              2
            </text>
            <circle cx="176" cy="236" fill="#c04a2b" opacity="0.2" r="24" />
            <circle cx="176" cy="236" fill="#c04a2b" r="16" />
            <text fill="#ffffff" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="700" textAnchor="middle" x="176" y="241">
              3
            </text>
            <circle cx="505" cy="207" fill="#3f8a4a" r="11" />
            <text fill="#ffffff" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700" textAnchor="middle" x="505" y="211">
              1
            </text>
            <circle cx="505" cy="282" fill="#ffffff" r="12" stroke="#c04a2b" strokeWidth="2" />
            <text fill="#c04a2b" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="700" textAnchor="middle" x="505" y="286">
              4
            </text>
            <circle cx="505" cy="434" fill="#ffffff" r="11" stroke="#9b8b72" strokeWidth="1.5" />
            <text fill="#6b6359" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700" textAnchor="middle" x="505" y="438">
              5
            </text>

            <rect fill="#ffffff" height="48" rx="6" stroke="#c04a2b" strokeWidth="1.8" width="118" x="28" y="214" />
            <text fill="#c04a2b" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" textAnchor="middle" x="87" y="232">
              You are here
            </text>
            <text fill="#2a2420" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" textAnchor="middle" x="87" y="246">
              Greenhouse Route
            </text>
            <text fill="#6b6359" fontFamily="Inter, sans-serif" fontSize="8" textAnchor="middle" x="87" y="258">
              Stop 3 of 5
            </text>
          </svg>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="inline-flex h-10 items-center gap-1 rounded-full bg-white px-2 shadow-[0_1px_2px_rgba(42,36,32,0.08)]">
            <MapControl label="Zoom in"><ZoomIn size={15} /></MapControl>
            <MapControl label="Zoom out"><Minus size={15} /></MapControl>
            <MapControl label="Center current location"><LocateFixed size={14} /></MapControl>
            <MapControl label="Reset map"><RefreshCcw size={14} /></MapControl>
            <MapControl label="Expand map"><Move size={14} /></MapControl>
          </div>
          <Link className="inline-flex h-9 items-center rounded-[10px] border border-[#e8e1d3] bg-white px-3 text-xs font-medium text-[#2a2420] hover:bg-[#fbf7f0]" to="/route">
            List view
          </Link>
        </div>
      </div>

      <ul className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
        <LegendItem icon={<span className="h-2.5 w-2.5 rounded-full bg-[#c04a2b]" />}>You are here</LegendItem>
        <LegendItem icon={<span className="h-2.5 w-2.5 rounded-full border border-[#c04a2b]" />}>Next stop</LegendItem>
        <LegendItem icon={<span className="h-2.5 w-2.5 rounded-full bg-[#3f8a4a]" />}>Completed</LegendItem>
        <LegendItem icon={<span className="h-2.5 w-2.5 rounded-full border border-[#9b8b72]" />}>Upcoming</LegendItem>
        <LegendItem icon={<span className="h-px w-4 border-t border-dashed border-[#3f8a4a]" />}>Route taken</LegendItem>
        <LegendItem icon={<span className="h-px w-4 bg-[#c04a2b]" />}>Next path</LegendItem>
        <LegendItem icon={<UsersRound className="text-[#3a6aa3]" size={13} />}>Accessible</LegendItem>
        <LegendItem icon={<Lock className="text-[#a8423a]" size={13} />}>Restricted</LegendItem>
      </ul>

      <div className="mt-4 rounded-[12px] border border-[#edd57a] bg-[#fff7d7] px-4 py-3">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 shrink-0 text-[#a8791c]" size={17} />
          <div>
            <h2 className="text-[13px] font-semibold leading-5 text-[#5a3f12]">Location not accurate?</h2>
            <p className="mt-1 text-xs leading-[18px] text-[#7a6122]">Use landmarks on the map or switch to list view.</p>
            <Link className="mt-2 inline-flex h-8 items-center rounded-[8px] bg-[#2a2420] px-4 text-xs font-medium text-white hover:bg-[#3a342e]" to="/route">
              Open List View
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function NextStopCard() {
  return (
    <Panel className="border-[#f0c4b4] bg-[#fff8f4] p-5">
      <SectionLabel>Next on your route</SectionLabel>
      <div className="mt-3 flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#c04a2b] text-white">
          <Sprout size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <SectionLabel>Stop 4 of 5</SectionLabel>
          <div className="mt-0.5 flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold leading-[23px] text-[#2a2420]">Tasting Point - GH 1 & 2</h2>
            <Chip tone="red">Tasting</Chip>
          </div>
          <p className="mt-2 flex items-center gap-1 text-xs leading-[18px] text-[#6b6359]">
            <Clock size={13} />
            3 min walk
          </p>
          <p className="text-xs leading-[18px] text-[#6b6359]">Mild heat</p>
          <p className="text-xs leading-[18px] text-[#6b6359]">Beginner-friendly</p>
          <Chip tone="blue">
            <UsersRound className="mr-1" size={12} />
            Accessible
          </Chip>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between rounded-[8px] border border-[#d7e9cf] bg-white px-3 py-2">
        <span className="flex items-center gap-2 text-xs text-[#3f8a4a]">
          <Check size={13} />
          Route fit: High
        </span>
        <span className="flex gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#3f8a4a]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#3f8a4a]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#3f8a4a]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#3f8a4a]" />
        </span>
      </div>
      <p className="mt-4 text-xs leading-[18px] text-[#6b6359]">
        Recommended because you selected mild tasting, family mode, and a 40-minute visit.
      </p>
    </Panel>
  )
}

function WhyThisStop() {
  return (
    <section>
      <SectionLabel>Why this stop?</SectionLabel>
      <div className="mt-3 flex flex-wrap gap-2">
        <Chip tone="green">✓ Matches spice comfort</Chip>
        <Chip tone="green">✓ Closest to you</Chip>
        <Chip tone="green">✓ Fits visit time</Chip>
        <Chip tone="green">✓ No long walk</Chip>
      </div>
    </section>
  )
}

function ActionButtons() {
  const { chooseManual, setActiveStop } = useVisit()
  const navigate = useNavigate()

  const continueToTasting = () => {
    setActiveStop('tasting-gh-1-2')
    navigate('/route')
  }

  const openManualMode = () => {
    chooseManual()
    navigate('/map')
  }

  return (
    <section className="space-y-2">
      <button
        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-[8px] border border-[#c04a2b] bg-[#c04a2b] text-[13px] font-semibold text-white transition hover:bg-[#a63d23]"
        onClick={continueToTasting}
        type="button"
      >
        <ArrowRight size={15} />
        Continue to Tasting Point
      </button>
      <div className="grid gap-2 sm:grid-cols-2">
        <Link className="inline-flex h-9 items-center justify-center rounded-[8px] border border-[#e8e1d3] bg-white text-xs font-medium text-[#2a2420] hover:bg-[#fbf7f0]" to="/stops/greenhouse-route">
          Open Stop Details
        </Link>
        <button
          className="inline-flex h-9 items-center justify-center gap-2 rounded-[8px] border border-[#e8e1d3] bg-white text-xs font-medium text-[#2a2420] hover:bg-[#fbf7f0]"
          onClick={continueToTasting}
          type="button"
        >
          <SkipForward size={13} />
          Skip This Stop
        </button>
        <button
          className="inline-flex h-9 items-center justify-center rounded-[8px] border border-[#e8e1d3] bg-white text-xs font-medium text-[#2a2420] hover:bg-[#fbf7f0]"
          onClick={openManualMode}
          type="button"
        >
          Choose Manually
        </button>
        <button
          className="inline-flex h-9 items-center justify-center rounded-[8px] border border-[#e8e1d3] bg-white text-xs font-medium text-[#2a2420] hover:bg-[#fbf7f0]"
          onClick={openManualMode}
          type="button"
        >
          Switch to Manual Mode
        </button>
      </div>
    </section>
  )
}

function NearbyStopRow({ stop }: { stop: (typeof nearbyStops)[number] }) {
  const { chooseManual, setActiveStop } = useVisit()
  const navigate = useNavigate()
  const disabled = stop.id === 'production-greenhouses'

  const viewStop = () => {
    if (disabled) return
    if (stop.id === 'tasting-gh-3-4') {
      chooseManual()
      navigate('/map')
      return
    }
    setActiveStop(stop.id)
    navigate('/route')
  }

  return (
    <div className="flex items-center gap-3 border-b border-[#efe7d5] px-3 py-2.5 last:border-b-0">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f6efe1] text-[#8a7a63]">
        {stop.icon}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[13px] font-medium leading-[19.5px] text-[#2a2420]">{stop.title}</h3>
        <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] leading-[16.5px] text-[#8a7a63]">{stop.meta}</span>
          <span className="flex items-center gap-1 text-[11px] leading-[16.5px] text-[#8a7a63]">
            <Clock size={12} />
            {stop.time}
          </span>
          <Chip tone={stop.tone}>{stop.chip}</Chip>
        </div>
      </div>
      <button
        className="h-[27px] rounded-[8px] border border-[#e8e1d3] bg-white px-3 text-[11px] font-medium text-[#3a342e] hover:bg-[#fbf7f0] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={disabled}
        onClick={viewStop}
        type="button"
      >
        View
      </button>
    </div>
  )
}

function NearbyStops() {
  return (
    <section>
      <SectionLabel>Nearby stops</SectionLabel>
      <Panel className="mt-3 overflow-hidden">
        {nearbyStops.map((stop) => (
          <NearbyStopRow key={stop.id} stop={stop} />
        ))}
      </Panel>
    </section>
  )
}

function HowAdapted() {
  return (
    <Panel className="border-[#bcd9a7] bg-[#eef6e2] p-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-5 w-2.5 shrink-0 items-center justify-center rounded-full bg-[#3f8a4a] text-[11px] text-white">i</span>
        <div>
          <h2 className="text-xs font-semibold leading-[18px] text-[#2a4a2a]">How the route is adapted</h2>
          <p className="mt-1 text-xs leading-[18px] text-[#3f6b3f]">
            Prigan Guide uses your selected time, spice comfort, interests, and current route progress to suggest the next stop. You can override any suggestion.
          </p>
          <ul className="mt-3 list-disc space-y-0.5 pl-4 text-xs leading-[18px] text-[#3f6b3f]">
            <li>Based on your visit preferences</li>
            <li>Updated when you skip or shorten the route</li>
            <li>Manual mode is always available</li>
          </ul>
          <p className="mt-3 text-xs italic leading-[18px] text-[#6b8a6b]">Location may be approximate inside greenhouse areas.</p>
        </div>
      </div>
    </Panel>
  )
}

export function FarmMapPage() {
  return (
    <PageShell className="py-8 md:py-7">
      <div className="mx-auto grid max-w-[1180px] gap-6 lg:grid-cols-[minmax(0,746px)_minmax(320px,361px)]">
        <section>
          <SectionLabel>Farm Map · Stop 3 of 5</SectionLabel>
          <h1 className="mt-1 text-[22px] font-semibold leading-[33px] text-[#2a2420]">Farm Map</h1>
          <p className="mt-1 text-[13px] leading-[19.5px] text-[#6b6359]">See your route, nearby stops, and tasting points across the farm.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Chip tone="red">
              <span className="mr-2 h-1.5 w-1.5 rounded-full bg-[#c04a2b]" />
              AI route active
            </Chip>
            <Chip tone="blue">Manual selection available</Chip>
            <Chip>Location approximate</Chip>
          </div>
          <p className="mt-2 text-xs leading-[18px] text-[#8a7a63]">You can follow the suggested route or choose any stop manually.</p>
          <div className="mt-4">
            <FarmMapVisual />
          </div>
        </section>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <NextStopCard />
          <WhyThisStop />
          <ActionButtons />
          <NearbyStops />
          <HowAdapted />
        </aside>
      </div>
    </PageShell>
  )
}
