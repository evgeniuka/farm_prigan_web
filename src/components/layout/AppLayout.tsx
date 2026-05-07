import { Globe2, HelpCircle, Sprout } from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useVisit } from '../../hooks/useVisit'

type NavItem = {
  to: string
  label: string
  badge?: number
}

const navItems: NavItem[] = [
  { to: '/planner', label: 'Plan Visit' },
  { to: '/route', label: 'Route' },
  { to: '/catalog', label: 'Catalog' },
  { to: '/my-visit', label: 'My Visit' },
]

const recommendedNavItems: NavItem[] = [
  { to: '/planner', label: 'Plan Visit' },
  { to: '/recommended', label: 'Route' },
  { to: '/map', label: 'Map' },
  { to: '/my-visit', label: 'My Visit' },
]

const liveRouteNavItems: NavItem[] = [
  { to: '/planner', label: 'Plan Visit' },
  { to: '/route', label: 'Route' },
  { to: '/map', label: 'Map' },
  { to: '/my-visit', label: 'My Visit' },
]

const mapNavItems: NavItem[] = [
  { to: '/route', label: 'Route' },
  { to: '/map', label: 'Map' },
  { to: '/catalog', label: 'Peppers' },
  { to: '/help', label: 'Help' },
]

export function AppLayout() {
  const location = useLocation()
  const { visit } = useVisit()
  const isPlanner = location.pathname === '/planner'
  const isRecommended = location.pathname === '/recommended'
  const isLiveRoute = location.pathname === '/route'
  const isFarmMap = location.pathname === '/map'
  const isCatalog = location.pathname === '/catalog'
  const isPepperDetail = location.pathname.startsWith('/peppers/')
  const isCompare = location.pathname === '/compare'
  const isMyVisit = location.pathname === '/my-visit'
  const isHowAI = location.pathname === '/ai'
  const isHelp = location.pathname === '/help'
  const isStopDetail = location.pathname.startsWith('/stops/')
  const isRouteFamily = isRecommended || isLiveRoute
  const isPeppersFlow = isCatalog || isPepperDetail || isCompare
  const isHelpFlow = isHowAI || isHelp
  const step = isPlanner ? 2 : isRouteFamily ? 3 : null

  const catalogNavItems: NavItem[] = [
    { to: '/route', label: 'Route' },
    { to: '/map', label: 'Map' },
    { to: '/catalog', label: 'Peppers' },
    { to: '/my-visit', label: 'My Visit', badge: visit.savedPepperIds.length || 2 },
    { to: '/help', label: 'Help' },
  ]
  const pepperDetailNavItems: NavItem[] = [
    { to: '/route', label: 'Route' },
    { to: '/map', label: 'Map' },
    { to: '/catalog', label: 'Peppers' },
    { to: '/help', label: 'Help' },
  ]
  const compareNavItems: NavItem[] = [
    { to: '/route', label: 'Route' },
    { to: '/map', label: 'Map' },
    { to: '/catalog', label: 'Peppers' },
    { to: '/my-visit', label: 'My Visit', badge: Math.max(1, visit.savedPepperIds.length) },
    { to: '/help', label: 'Help' },
  ]
  const myVisitNavItems: NavItem[] = [
    { to: '/route', label: 'Route' },
    { to: '/map', label: 'Map' },
    { to: '/catalog', label: 'Peppers' },
    { to: '/my-visit', label: 'My Visit' },
  ]
  const helpNavItems: NavItem[] = [
    { to: '/route', label: 'Route' },
    { to: '/map', label: 'Map' },
    { to: '/catalog', label: 'Peppers' },
    { to: '/help', label: 'Help' },
  ]

  const navigation = isHelpFlow
    ? helpNavItems
    : isMyVisit
      ? myVisitNavItems
      : isCompare
        ? compareNavItems
        : isPepperDetail
          ? pepperDetailNavItems
          : isCatalog
            ? catalogNavItems
            : isFarmMap
              ? mapNavItems
              : isLiveRoute
                ? liveRouteNavItems
                : isRecommended
                  ? recommendedNavItems
                  : navItems

  return (
    <div className="app-shell">
      <header className="sticky top-0 z-40 border-b border-[var(--soft-border)] bg-[rgba(255,255,255,0.96)] backdrop-blur">
        <div className="page-band">
          <div className="flex h-16 items-center justify-between gap-4 px-0 md:px-8">
            <NavLink className="flex items-center gap-2.5 text-base font-normal text-[var(--ink)]" to="/">
              <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[var(--terracotta)] text-white">
                <Sprout size={18} />
              </span>
              Prigan Guide
            </NavLink>
            <nav className="hidden items-center gap-1 text-sm md:flex">
              {navigation.map((item) => {
                const routeItemActive = item.to === '/route' && isStopDetail
                const peppersItemActive = item.to === '/catalog' && (isPepperDetail || isCompare)
                const helpItemActive = item.to === '/help' && isHelpFlow

                return (
                  <NavLink
                    className={({ isActive }) => {
                      const active = isActive || routeItemActive || peppersItemActive || helpItemActive || (item.to === '/planner' && location.pathname === '/') || (item.to === '/recommended' && isRecommended)
                      const terracottaActive = active && (isRouteFamily || routeItemActive || isFarmMap || isPeppersFlow)

                      return `inline-flex items-center rounded-lg px-3.5 py-2 font-normal leading-5 transition ${
                        active
                          ? terracottaActive
                            ? 'bg-[#fbe4dc] text-[var(--terracotta)]'
                            : 'bg-[var(--cream-100)] text-[var(--ink)]'
                          : 'text-[var(--muted)] hover:bg-[var(--cream-100)] hover:text-[var(--ink)]'
                      }`
                    }}
                    key={item.to}
                    to={item.to}
                  >
                    <span>{item.label}</span>
                    {item.badge ? (
                      <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--terracotta)] px-1.5 text-[11px] font-semibold text-white">
                        {item.badge}
                      </span>
                    ) : null}
                  </NavLink>
                )
              })}
            </nav>
            <div className="flex h-9 items-center gap-1 text-[var(--muted)]">
              {isFarmMap || isPeppersFlow || isMyVisit || isHelpFlow ? (
                <div
                  className={`mr-3 hidden h-8 items-center gap-2 rounded-full border px-3 text-xs sm:inline-flex ${
                    isHelpFlow
                      ? 'border-[var(--soft-border)] bg-[var(--cream-100)] text-[var(--ink)]'
                      : 'border-[#f0c4b4] bg-[#fbe4dc] text-[var(--terracotta)]'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${isHelpFlow ? 'bg-[#d98a2b]' : 'bg-[var(--terracotta)] opacity-75'}`} />
                  <span className="font-medium">{isMyVisit ? 'Route in progress' : 'My Visit'}</span>
                  <span className="opacity-60">·</span>
                  <span className="font-medium">Stop 3 of 5</span>
                </div>
              ) : isStopDetail ? (
                <div className="mr-3 hidden h-8 items-center gap-2 rounded-full border border-[#f0c4b4] bg-[#fbe4dc] px-3 text-xs text-[var(--terracotta)] sm:inline-flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--terracotta)] opacity-75" />
                  <span className="font-medium">Route in progress</span>
                  <span className="opacity-60">·</span>
                  <span className="font-medium">Stop 2 of 4</span>
                </div>
              ) : step ? (
                <div className="mr-3 hidden h-8 items-center gap-2 rounded-full border border-[var(--soft-border)] bg-[var(--cream-100)] px-3 text-xs sm:inline-flex">
                  <span className="font-semibold text-[var(--terracotta)]">Step {step}</span>
                  <span>of 4</span>
                  <span className="ml-1 flex items-center gap-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--terracotta)]" />
                    <span className={`h-1.5 rounded-full bg-[var(--terracotta)] ${step === 2 ? 'w-4' : 'w-1.5'}`} />
                    <span className={`h-1.5 rounded-full ${step === 3 ? 'w-4 bg-[var(--terracotta)]' : 'w-1.5 bg-[#d6cdbb]'}`} />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#d6cdbb]" />
                  </span>
                </div>
              ) : null}
              <NavLink aria-label="Language" className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium hover:bg-[var(--cream-100)]" to="/help">
                <Globe2 size={16} />
                {isPepperDetail ? 'EN / HE' : 'EN'}
              </NavLink>
              <NavLink aria-label="Help and accessibility" className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-[var(--cream-100)]" to="/help">
                <HelpCircle size={16} />
              </NavLink>
            </div>
          </div>
        </div>
        {isPlanner ? (
          <div className="h-[3px] w-full bg-[var(--soft-border)]">
            <div className="h-full w-1/2 bg-[var(--terracotta)]" />
          </div>
        ) : null}
      </header>
      <Outlet />
      <footer className="page-band text-xs text-[#8a7a63]">
        <div className="border-t border-[var(--soft-border)] px-0 py-6 md:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>© Prigan Farm · Built for on-site visitors</div>
            <div className="flex gap-5">
              <NavLink to="/help">Privacy</NavLink>
              <NavLink to="/help">Accessibility</NavLink>
              <NavLink to="/help">Contact</NavLink>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
