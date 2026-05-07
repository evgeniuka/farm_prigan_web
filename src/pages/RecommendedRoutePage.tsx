import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Eye,
  Footprints,
  Info,
  Leaf,
  Map,
  MapPin,
  Pencil,
  Shuffle,
  Sparkles,
  UsersRound,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { PageShell } from '../components/layout/PageShell'
import { routeImages } from '../data/routeImages'
import { useVisit } from '../hooks/useVisit'

const recommendedStops = [
  {
    id: 'visitor-center',
    title: 'Visitor Center',
    location: 'Main Entrance · Right side of farm',
    description: 'Welcome briefing, route overview, and farm orientation',
    tags: ['Welcome', 'Orientation', 'Info'],
    duration: '8 min',
    walkAfter: '~5 min walk · cross to west side',
    badge: 'Start here',
    image: routeImages['visitor-center'],
  },
  {
    id: 'greenhouse-route',
    title: 'Greenhouse Route',
    location: 'Greenhouse Zone · 8 Bays · West side',
    description: 'Walk through active pepper growing bays — all growth stages visible',
    tags: ['Learn', '8 Bays', 'Photo spot'],
    duration: '12 min',
    walkAfter: '~3 min walk · back toward center',
    image: routeImages['greenhouse-route'],
  },
  {
    id: 'tasting-gh-1-2',
    title: 'Tasting GH 1–2',
    location: 'Tasting Zone · Mild & Medium heat',
    description: 'Sample mild pepper varieties in a dedicated tasting greenhouse',
    tags: ['Tasting', 'Mild heat', 'Beginner-friendly'],
    duration: '12 min',
    walkAfter: '~2 min walk · toward exit',
    image: routeImages['tasting-gh-1-2'],
  },
  {
    id: 'product-shop',
    title: 'Product Shop',
    location: 'Exit Zone · Final stop',
    description: 'Browse fresh sauces, dried peppers, and farm products to take home',
    tags: ['Shop', 'Final stop', 'Family-friendly'],
    duration: '8 min',
    image: routeImages['product-shop'],
  },
]

const whyChips = [
  'Fits your 40–45 min visit',
  'Matches spice comfort (mild)',
  'Avoids staff-only areas',
  'No long walk between stops',
  'Includes greenhouse learning',
  'Beginner-friendly experience',
]

const figmaRecommendedPlan = {
  duration: '40-45 min',
  mode: 'Family / Beginner-friendly',
  spiceLevel: 'Mild',
}

const displayDuration = (duration: string) => duration === '40-45 min' ? '40–45 min' : duration
const displayMode = (mode: string) => mode === 'Family / Beginner-friendly' ? 'Family / Beginner' : mode

function FitDots({ small = false }: { small?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${small ? 'ml-2' : 'mt-1'}`}>
      {[0, 1, 2, 3].map((dot) => (
        <span className={`${small ? 'h-[7px] w-[7px]' : 'h-1.5 w-1.5'} rounded-full bg-[#3e7f74]`} key={dot} />
      ))}
    </span>
  )
}

function HeroChip({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <span className="inline-flex h-[34px] items-center gap-2 rounded-full border border-[#f0c4b4] bg-[#fbe4dc] px-3 text-[13px] font-medium leading-5 text-[var(--terracotta)]">
      {icon}
      {children}
    </span>
  )
}

function RouteSummaryHero({ onAccept }: { onAccept: () => void }) {
  return (
    <section className="rounded-[18px] border border-[#e8e1d3] bg-white p-6">
      <p className="text-[11px] font-medium uppercase leading-4 tracking-[0.6px] text-[var(--terracotta)]">
        AI · Recommended Route
      </p>
      <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-[26px] font-semibold leading-[31px] text-[#2a2420]">Your Recommended Route</h1>
          <p className="mt-1.5 max-w-[460px] text-sm leading-[22px] text-[#6b6359]">
            Built from your time, tasting preference, and comfort level. You can edit or override any part.
          </p>
        </div>
        <div className="w-[89px] rounded-[14px] border border-[#b4d4cb] bg-[#e8f2ef] px-4 py-2 text-center">
          <p className="text-[22px] font-bold leading-[22px] text-[#2a6b61]">High</p>
          <p className="mt-0.5 text-[10px] font-medium uppercase leading-[15px] tracking-[0.3px] text-[#3e7f74]">Route fit</p>
          <FitDots />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <HeroChip icon={<Clock3 size={13} />}>{displayDuration(figmaRecommendedPlan.duration)}</HeroChip>
        <HeroChip icon={<MapPin size={13} />}>4 stops</HeroChip>
        <HeroChip icon={<Leaf size={13} />}>{figmaRecommendedPlan.spiceLevel} tasting</HeroChip>
        <HeroChip icon={<UsersRound size={13} />}>Family-friendly</HeroChip>
        <HeroChip icon={<Footprints size={13} />}>Short walks</HeroChip>
        <HeroChip>AI route active</HeroChip>
      </div>

      <div className="mt-5 flex flex-col gap-3 rounded-xl border-2 border-[var(--terracotta)] bg-[#fbe4dc] p-4 sm:flex-row sm:items-center">
        <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-[var(--terracotta)] text-xs font-bold text-white">1</span>
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] font-medium uppercase leading-[15px] tracking-[0.5px] text-[#a03a1e]">Start at</span>
          <span className="block text-sm font-semibold leading-[21px] text-[#2a2420]">Visitor Center</span>
        </span>
        <button
          className="inline-flex h-[26px] shrink-0 items-center justify-center gap-1.5 rounded-full bg-[var(--terracotta)] px-3 text-xs font-semibold text-white"
          onClick={onAccept}
          type="button"
        >
          Begin here
          <ArrowRight size={13} />
        </button>
      </div>
      <p className="mt-3 text-xs leading-[18px] text-[#8a7a63]">
        You can edit, skip, or swap any stop at any time. Manual mode is always available.
      </p>
    </section>
  )
}

function WhyThisRoute() {
  return (
    <section className="rounded-[18px] border border-[#b4d4cb] bg-[#e8f2ef] p-5">
      <div className="flex gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#3e7f74] text-white">
          <Sparkles size={15} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-semibold leading-[21px] text-[#2a2420]">Why this route?</h2>
            <button className="inline-flex h-7 w-fit items-center rounded-full border border-[#b4d4cb] px-3 text-xs font-medium text-[#3e7f74]" type="button">
              Full explanation ↓
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {whyChips.map((chip) => (
              <span className="inline-flex h-7 items-center gap-1 rounded-full border border-[#b4d4cb] bg-white px-3 text-xs font-medium text-[#2e6b61]" key={chip}>
                <Check size={12} />
                {chip}
              </span>
            ))}
          </div>
          <p className="mt-3 text-[11px] italic leading-4 text-[#5a7a6e]">This is a suggestion, not a fixed plan. You stay in control.</p>
        </div>
      </div>
    </section>
  )
}

function StopCard({ stop, index, onManual }: { stop: (typeof recommendedStops)[number]; index: number; onManual: () => void }) {
  const isFirst = index === 0

  return (
    <div className="relative">
      <div className="grid gap-3 sm:grid-cols-[40px_minmax(0,1fr)]">
        <div className="hidden flex-col items-center sm:flex">
          <span className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold ${isFirst ? 'border-[var(--terracotta)] bg-[var(--terracotta)] text-white' : 'border-[#e8e1d3] bg-[#f2ede4] text-[#6b6359]'}`}>
            {index + 1}
          </span>
          {index < recommendedStops.length - 1 ? <span className="mt-1 h-[91px] w-px bg-[#e8e1d3]" /> : null}
        </div>

        <article className={`overflow-hidden rounded-[14px] bg-white ${isFirst ? 'border-2 border-[var(--terracotta)] shadow-[0_2px_12px_rgba(192,74,43,0.07)]' : 'border border-[#e8e1d3]'}`}>
          <div className="grid min-h-[119px] sm:grid-cols-[96px_minmax(0,1fr)]">
            <img alt="" className="h-36 w-full object-cover sm:h-24 sm:w-24" src={stop.image} />
            <div className="flex min-w-0 flex-col justify-between gap-3 px-4 py-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold leading-[21px] text-[#2a2420]">{stop.title}</h3>
                  {stop.badge ? <span className="rounded-full border border-[#f0c4b4] bg-[#fbe4dc] px-2 py-0.5 text-[10px] font-semibold text-[var(--terracotta)]">{stop.badge}</span> : null}
                  <span className="rounded-full border border-[#bcd0e7] bg-[#e2ecf7] px-2 py-0.5 text-[10px] text-[#3a6aa3]">Accessible</span>
                </div>
                <p className="mt-0.5 text-[11px] leading-4 text-[#8a7a63]">{stop.location}</p>
                <p className="mt-1 text-xs leading-[18px] text-[#6b6359]">{stop.description}</p>
              </div>

              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex flex-wrap gap-1">
                  {stop.tags.map((tag) => (
                    <span className="rounded-full border border-[#e8e1d3] bg-[#f2ede4] px-2 py-0.5 text-[10px] leading-[15px] text-[#6b6359]" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 text-[11px] leading-4 text-[#8a7a63]"><Clock3 size={13} /> {stop.duration}</span>
                  <Link
                    className="inline-flex h-[27px] items-center gap-1 rounded-full border border-[#f0c4b4] bg-white px-3 text-[11px] font-medium text-[var(--terracotta)]"
                    to={`/stops/${stop.id}`}
                  >
                    <Eye size={13} />
                    Open Stop
                  </Link>
                  <button
                    className="inline-flex h-[27px] items-center gap-1 rounded-full border border-[#e8e1d3] bg-white px-3 text-[11px] font-medium text-[#6b6359]"
                    onClick={onManual}
                    type="button"
                  >
                    <Shuffle size={13} />
                    Swap / Skip
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>

      {stop.walkAfter ? (
        <div className="my-1 ml-0 flex sm:ml-[92px]">
          <span className="inline-flex h-[27px] items-center gap-1.5 rounded-full border border-[#e8e1d3] bg-[#f9f5ef] px-3 text-[11px] leading-4 text-[#8a7a63]">
            <Footprints size={13} />
            {stop.walkAfter}
          </span>
        </div>
      ) : null}
    </div>
  )
}

function RouteSequence({ onManual }: { onManual: () => void }) {
  return (
    <section className="rounded-[18px] border border-[#e8e1d3] bg-white p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase leading-4 tracking-[0.6px] text-[var(--terracotta)]">Route Sequence · 4 Stops</p>
          <h2 className="mt-0.5 text-sm font-semibold leading-[21px] text-[#2a2420]">Visitor Center → Greenhouse → Tasting GH 1–2 → Shop</h2>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-[10px] uppercase leading-[15px] tracking-[0.5px] text-[#8a7a63]">Total walk</p>
          <p className="text-[13px] font-semibold leading-5 text-[#2a2420]">~10 min · 450 m</p>
        </div>
      </div>
      <div>
        {recommendedStops.map((stop, index) => (
          <StopCard index={index} key={stop.id} onManual={onManual} stop={stop} />
        ))}
      </div>
    </section>
  )
}

function MiniRouteMap() {
  return (
    <section className="rounded-[18px] border border-[#e8e1d3] bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[13px] font-semibold leading-4 text-[#2a2420]">Route Map</h2>
        <span className="rounded-full border border-[#e8e1d3] bg-[#f2ede4] px-2 py-1 text-[11px] text-[#8a7a63]">Not started</span>
      </div>
      <div className="relative overflow-hidden rounded-[14px] bg-[#f9f5ef] p-2">
        <svg className="h-auto w-full" viewBox="0 0 258 236" role="img" aria-label="Schematic farm route map">
          <rect fill="#fbf8f3" height="236" rx="12" width="258" />
          <rect fill="#f1f5ea" height="210" rx="18" stroke="#d6cdbb" width="210" x="23" y="12" />
          <rect fill="#e7f0d9" height="18" rx="4" stroke="#9ebc76" width="47" x="27" y="47" />
          <rect fill="#e7f0d9" height="18" rx="4" stroke="#9ebc76" width="47" x="27" y="68" />
          <rect fill="#e7f0d9" height="18" rx="4" stroke="#9ebc76" width="47" x="27" y="89" />
          <rect fill="#e7f0d9" height="18" rx="4" stroke="#9ebc76" width="47" x="27" y="110" />
          <rect fill="#e7f0d9" height="18" rx="4" stroke="#9ebc76" width="47" x="27" y="131" />
          <rect fill="#e7f0d9" height="18" rx="4" stroke="#9ebc76" width="47" x="27" y="152" />
          <rect fill="#e7f0d9" height="18" rx="4" stroke="#9ebc76" width="47" x="27" y="173" />
          <rect fill="#e7f0d9" height="18" rx="4" stroke="#9ebc76" width="47" x="27" y="194" />
          <rect fill="#f5d8d2" height="51" rx="6" stroke="#d88977" width="44" x="166" y="14" />
          <rect fill="#fff4d8" height="28" rx="5" stroke="#d6cdbb" width="70" x="123" y="14" />
          <rect fill="#fff" height="28" rx="6" stroke="#d6cdbb" width="51" x="151" y="110" />
          <rect fill="#fff" height="21" rx="5" stroke="#d6cdbb" width="51" x="123" y="136" />
          <rect fill="#fff" height="23" rx="5" stroke="#d6cdbb" width="47" x="142" y="187" />
          <path d="M177 126 L53 108 L149 147 L168 185" fill="none" stroke="#c04a2b" strokeDasharray="6 5" strokeLinecap="round" strokeWidth="4" />
          {[
            { x: 177, y: 126, n: 1, active: true },
            { x: 53, y: 108, n: 2 },
            { x: 151, y: 147, n: 3 },
            { x: 168, y: 185, n: 4 },
          ].map((marker) => (
            <g key={marker.n}>
              <circle cx={marker.x} cy={marker.y} fill={marker.active ? '#c04a2b' : '#f2ede4'} r={marker.active ? 15 : 10} stroke="#ffffff" strokeWidth="3" />
              <text fill={marker.active ? '#ffffff' : '#6b6359'} fontSize="10" fontWeight="700" textAnchor="middle" x={marker.x} y={marker.y + 4}>{marker.n}</text>
            </g>
          ))}
          <text fill="#2a2420" fontSize="9" fontWeight="700" x="34" y="24">GH Route</text>
          <text fill="#8a7a63" fontSize="8" x="40" y="34">8 Bays</text>
          <text fill="#8a7a63" fontSize="8" x="145" y="31">Parking</text>
          <text fill="#b3341f" fontSize="8" x="176" y="34">Staff only</text>
          <text fill="#2a2420" fontSize="8" x="165" y="124">Visitor</text>
          <text fill="#2a2420" fontSize="8" x="166" y="133">Center</text>
          <text fill="#2a2420" fontSize="8" x="124" y="149">Tasting GH 1-2</text>
          <text fill="#2a2420" fontSize="8" x="151" y="202">Product</text>
          <text fill="#2a2420" fontSize="8" x="157" y="210">Shop</text>
        </svg>
        <Link className="absolute right-3 top-3 inline-flex h-[25px] items-center gap-1 rounded-full bg-white px-2 text-[11px] font-medium text-[var(--terracotta)] shadow-sm" to="/map">
          <Map size={13} />
          Open Map
        </Link>
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-[11px] leading-4 text-[#8a7a63]">
        <span className="inline-flex items-center gap-1"><span className="h-1 w-4 rounded-full bg-[var(--terracotta)]" />Your route</span>
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#f5d8d2]" />Staff only</span>
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#fff4d8]" />Optional</span>
      </div>
      <div className="mt-3">
        <div className="mb-1 flex justify-between text-[11px] leading-4 text-[#8a7a63]">
          <span>Progress</span>
          <span>0 / 4 stops</span>
        </div>
        <div className="h-[5px] overflow-hidden rounded-full bg-[#f2ede4]">
          <div className="h-full w-[1px] bg-[var(--terracotta)]" />
        </div>
      </div>
    </section>
  )
}

function SidebarRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex min-h-[51px] gap-3 border-b border-[#e8e1d3] py-2 last:border-b-0">
      <span className="mt-2 text-[#8a7a63]">{icon}</span>
      <span>
        <span className="block text-[10px] uppercase leading-[15px] tracking-[0.5px] text-[#8a7a63]">{label}</span>
        <span className="block text-[13px] font-medium leading-5 text-[#2a2420]">{value}</span>
      </span>
    </div>
  )
}

function RecommendedSidebar({ onAccept, onManual }: { onAccept: () => void; onManual: () => void }) {
  const { visit } = useVisit()

  return (
    <aside className="space-y-4 lg:sticky lg:top-24">
      <Link className="inline-flex items-center gap-1 text-[13px] font-medium text-[#8a7a63] underline" to="/planner">
        <ArrowLeft size={14} />
        Back to Planner
      </Link>
      <section className="rounded-[18px] border border-[#e8e1d3] bg-white p-5">
        <h2 className="text-[13px] font-semibold leading-4 text-[#2a2420]">Current plan</h2>
        <div className="mt-3">
          <SidebarRow icon={<Clock3 size={16} />} label="Duration" value={displayDuration(figmaRecommendedPlan.duration)} />
          <SidebarRow icon={<Footprints size={16} />} label="Total walk" value="~10 min · 450 m" />
          <SidebarRow icon={<UsersRound size={16} />} label="Visit mode" value={displayMode(figmaRecommendedPlan.mode)} />
          <SidebarRow icon={<Leaf size={16} />} label="Spice level" value={figmaRecommendedPlan.spiceLevel} />
          <SidebarRow icon={<Sparkles size={16} />} label="Route type" value={visit.manualMode ? 'Manual Planning' : 'AI Recommended'} />
        </div>
        <div className="mt-4 rounded-[12px] border border-[#b4d4cb] bg-[#e8f2ef] p-3">
          <div className="flex items-center justify-between text-[13px] leading-[18px]">
            <span className="inline-flex items-center gap-1 text-[#2a2420]"><Sparkles size={13} />Route fit</span>
            <span className="font-medium text-[#3e7f74]">High <FitDots small /></span>
          </div>
          <p className="mt-2 text-[11px] leading-4 text-[#5a7a6e]">Strong match based on your preferences.</p>
        </div>
      </section>

      <MiniRouteMap />

      <section className="rounded-[18px] border border-[#e8e1d3] bg-white p-4">
        <h2 className="flex items-center gap-2 text-[13px] font-semibold leading-[18px] text-[#2a2420]"><Info size={14} /> How the route is adapted</h2>
        <p className="mt-2 text-xs leading-[18px] text-[#6b6359]">
          Prigan Guide uses your selected time, spice comfort, and walking preference to keep the route short and visitor-friendly.
        </p>
        <ul className="mt-3 space-y-1.5 text-[11px] leading-4 text-[#3e7f74]">
          <li className="flex gap-2"><Check size={12} /> Based on your visit preferences</li>
          <li className="flex gap-2"><Check size={12} /> Updated when you skip or shorten the route</li>
          <li className="flex gap-2"><Check size={12} /> Manual mode is always available</li>
        </ul>
        <p className="mt-3 text-[11px] leading-4 text-[#8a7a63]">Location may be approximate inside greenhouse areas.</p>
      </section>

      <button
        className="inline-flex h-[45px] w-full items-center justify-center gap-2 rounded-[12px] bg-[var(--terracotta)] text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--terracotta-dark)]"
        onClick={onAccept}
        type="button"
      >
        <Check size={14} />
        Accept Route
        <ArrowRight size={13} />
      </button>
      <button
        className="inline-flex h-[42px] w-full items-center justify-center gap-2 rounded-[12px] border border-[#d6cdbb] bg-white text-sm font-medium text-[#6b6359] transition hover:bg-[#f9f5ef]"
        onClick={onManual}
        type="button"
      >
        <Pencil size={14} />
        Choose Manually
      </button>
    </aside>
  )
}

export function RecommendedRoutePage() {
  const { acceptRoute, chooseManual } = useVisit()
  const navigate = useNavigate()

  const handleAccept = () => {
    acceptRoute()
    navigate('/route')
  }

  const handleManual = () => {
    chooseManual()
    navigate('/map')
  }

  return (
    <PageShell className="bg-[#fbf8f3] py-8 md:px-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,900px)_292px] lg:items-start">
        <div className="space-y-4">
          <RouteSummaryHero onAccept={handleAccept} />
          <WhyThisRoute />
          <RouteSequence onManual={handleManual} />
        </div>
        <RecommendedSidebar onAccept={handleAccept} onManual={handleManual} />
      </div>
    </PageShell>
  )
}
