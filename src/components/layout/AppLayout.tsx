import { BookOpen, ClipboardList, Globe2, HelpCircle, Home, Route, Sprout, UserRound } from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { getRouteStops } from '../../data/helpers'
import { useVisit } from '../../hooks/useVisit'
import { MapOverlay } from '../map/MapOverlay'
import { MapOverlayProvider } from '../map/MapOverlayContext'

type NavItem = {
  icon: typeof Home
  to: string
  label: string
  badge?: number
}

const navItems: NavItem[] = [
  { icon: Home, to: '/', label: 'Home' },
  { icon: ClipboardList, to: '/planner', label: 'Plan Visit' },
  { icon: Route, to: '/route', label: 'Route' },
  { icon: BookOpen, to: '/catalog', label: 'Catalog' },
  { icon: UserRound, to: '/my-visit', label: 'My Visit' },
]

function isRoutePath(pathname: string) {
  return pathname === '/recommended' || pathname === '/route' || pathname === '/map' || pathname.startsWith('/stops/')
}

function isCatalogPath(pathname: string) {
  return pathname === '/catalog' || pathname === '/compare' || pathname.startsWith('/peppers/')
}

function isHelpPath(pathname: string) {
  return pathname === '/help' || pathname === '/ai'
}

export function AppLayout() {
  const location = useLocation()
  const { visit } = useVisit()
  const routeStops = getRouteStops(visit)
  const activeIndex = Math.max(0, routeStops.findIndex((stop) => stop.id === visit.activeStopId))
  const routeProgressLabel = `Stop ${activeIndex + 1} of ${routeStops.length}`
  const isPlanner = location.pathname === '/planner'
  const isRecommended = location.pathname === '/recommended'
  const isMyVisit = location.pathname === '/my-visit'
  const routeRelated = isRoutePath(location.pathname) || isCatalogPath(location.pathname) || isMyVisit || isHelpPath(location.pathname)
  const statusLabel = isPlanner
    ? 'Planner - choose preferences'
    : isRecommended
      ? `Route review - ${routeStops.length} stops`
      : routeRelated
        ? `Route in progress - ${routeProgressLabel}`
        : null

  const navigation = navItems.map((item) => (
    item.to === '/my-visit' ? { ...item, badge: visit.savedPepperIds.length } : item
  ))

  return (
    <MapOverlayProvider>
      <div className="app-shell pb-20 md:pb-0">
        <header className="sticky top-0 z-40 border-b border-[var(--soft-border)] bg-[rgba(255,255,255,0.96)] backdrop-blur">
          <div className="page-band">
            <div className="flex h-14 items-center justify-between gap-3 px-0 md:h-16 md:px-8">
              <NavLink className="flex items-center gap-2.5 text-base font-normal text-[var(--ink)]" to="/">
                <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[var(--terracotta)] text-white">
                  <Sprout size={18} />
                </span>
                <span className="whitespace-nowrap">Prigan Guide</span>
              </NavLink>

              <nav className="hidden items-center gap-1 text-sm md:flex">
                {navigation.map((item) => (
                  <NavLink
                    className={({ isActive }) => {
                      const routeActive = item.to === '/route' && isRoutePath(location.pathname)
                      const catalogActive = item.to === '/catalog' && isCatalogPath(location.pathname)
                      const active = isActive || routeActive || catalogActive

                      return `inline-flex items-center rounded-lg px-3.5 py-2 font-normal leading-5 transition ${
                        active
                          ? 'bg-[#fbe4dc] text-[var(--terracotta)]'
                          : 'text-[var(--muted)] hover:bg-[var(--cream-100)] hover:text-[var(--ink)]'
                      }`
                    }}
                    key={item.to}
                    to={item.to}
                  >
                    <span>{item.label}</span>
                    {item.badge && item.badge > 0 ? (
                      <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--terracotta)] px-1.5 text-[11px] font-semibold text-white">
                        {item.badge}
                      </span>
                    ) : null}
                  </NavLink>
                ))}
              </nav>

              <div className="flex h-9 items-center gap-1 text-[var(--muted)]">
                {statusLabel ? (
                  <div className="mr-3 hidden h-8 items-center gap-2 rounded-full border border-[#f0c4b4] bg-[#fbe4dc] px-3 text-xs text-[var(--terracotta)] sm:inline-flex">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--terracotta)] opacity-75" />
                    <span className="font-medium">{statusLabel}</span>
                  </div>
                ) : null}
                <NavLink aria-label="Language" className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium hover:bg-[var(--cream-100)]" to="/help">
                  <Globe2 size={16} />
                  {visit.selectedLanguage}
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
              <div>Prigan Farm - Built for on-site visitors</div>
              <div className="flex gap-5">
                <NavLink to="/help">Privacy</NavLink>
                <NavLink to="/help">Accessibility</NavLink>
                <NavLink to="/help">Contact</NavLink>
              </div>
            </div>
          </div>
        </footer>

        <nav aria-label="Primary mobile navigation" className="fixed inset-x-0 bottom-0 z-50 border-t border-[#e8e1d3] bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-10px_24px_rgba(74,51,29,0.08)] backdrop-blur md:hidden">
          <div className="mx-auto grid max-w-[430px] grid-cols-5 gap-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const routeActive = item.to === '/route' && isRoutePath(location.pathname)
              const catalogActive = item.to === '/catalog' && isCatalogPath(location.pathname)

              return (
                <NavLink
                  className={({ isActive }) => {
                    const active = isActive || routeActive || catalogActive

                    return `relative flex min-h-[54px] flex-col items-center justify-center gap-1 rounded-[14px] px-1 text-[10px] font-semibold leading-3 transition ${
                      active
                        ? 'bg-[#fbe4dc] text-[var(--terracotta)]'
                        : 'text-[#7a6a59] hover:bg-[#fbf7f0] hover:text-[var(--ink)]'
                    }`
                  }}
                  key={item.to}
                  to={item.to}
                >
                  <Icon size={18} />
                  <span className="max-w-full truncate">{item.label === 'Plan Visit' ? 'Plan' : item.label === 'My Visit' ? 'Visit' : item.label}</span>
                  {item.badge && item.badge > 0 ? (
                    <span className="absolute right-2 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--terracotta)] px-1 text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  ) : null}
                </NavLink>
              )
            })}
          </div>
        </nav>
      </div>
      <MapOverlay />
    </MapOverlayProvider>
  )
}
