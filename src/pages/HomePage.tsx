import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Clock3,
  Info,
  Leaf,
  Map,
  MapPin,
  Pencil,
  Route,
  Sparkles,
  UsersRound,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import homeHeroPeppers from '../assets/figma/home-hero-peppers.png'
import { PageShell } from '../components/layout/PageShell'
import { useVisit } from '../hooks/useVisit'

const quickStarts = [
  {
    title: '45 min · First Visit',
    description: 'A short, easy route with the most loved peppers.',
    badge: 'Mild',
    icon: Clock3,
    iconClass: 'bg-[#fbe4dc] text-[#b83c26]',
    badgeClass: 'bg-[#fbe4dc] text-[#b83c26]',
    to: '/planner',
  },
  {
    title: 'Family Visit',
    description: 'Gentle path, short stops, picking activity included.',
    badge: 'Kid-friendly',
    icon: UsersRound,
    iconClass: 'bg-[#fdf5e4] text-[#8a5a2b]',
    badgeClass: 'bg-[#fdf5e4] text-[#8a5a2b]',
    to: '/planner',
  },
  {
    title: 'Explore Peppers First',
    description: 'Browse varieties, then build a route from favorites.',
    badge: 'Catalog',
    icon: Leaf,
    iconClass: 'bg-[#eef4e5] text-[#6a8f4d]',
    badgeClass: 'bg-[#eef4e5] text-[#6a8f4d]',
    to: '/catalog',
  },
]

const secondaryActions = [
  {
    title: 'Open Map',
    description: 'See the whole farm at a glance.',
    icon: Map,
    to: '/map',
  },
  {
    title: 'Plan Manually',
    description: 'Build your own route, stop by stop.',
    icon: Pencil,
    to: '/map',
  },
  {
    title: 'How AI Works',
    description: 'What it uses, and what you control.',
    icon: Info,
    to: '/ai',
  },
]

const trustItems = [
  {
    title: 'Clear route',
    description: 'Know where to go next, always.',
    icon: Route,
  },
  {
    title: 'Easy changes',
    description: 'Edit, skip or reorder any stop.',
    icon: Sparkles,
  },
  {
    title: 'Learn as you go',
    description: 'Short notes at every tasting point.',
    icon: BookOpen,
  },
]

export function HomePage() {
  const { chooseRecommended, setPreference } = useVisit()

  const applyQuickStart = (title: string) => {
    if (title.startsWith('Explore')) return

    chooseRecommended()
    setPreference('selectedDuration', '40-45 min')
    setPreference('selectedSpiceLevel', 'Mild')
    setPreference('selectedWalkingPreference', 'Easy walking')

    if (title.startsWith('Family')) {
      setPreference('selectedMode', 'Family / Beginner-friendly')
    }
  }

  return (
    <PageShell className="pb-0 pt-0">
      <section className="px-0 pt-7 md:px-8 md:pt-14">
        <div className="grid gap-8 lg:min-h-[604px] lg:grid-cols-[minmax(0,693px)_483px] lg:gap-10">
          <div className="pt-0 lg:pt-[77px]">
            <span className="inline-flex h-[30px] items-center gap-2 rounded-full border border-[var(--soft-border)] bg-[var(--cream-100)] px-3 text-xs leading-4 text-[#8a5a2b]">
              <MapPin size={14} />
              Prigan Pepper Farm · Northern Israel
            </span>
            <h1 className="mt-5 max-w-[560px] text-[34px] font-medium leading-[1.08] text-[var(--ink)] md:mt-6 md:text-[44px]">
              Explore the farm with a route that fits your visit
            </h1>
            <p className="mt-4 max-w-[520px] text-base leading-[1.55] text-[var(--muted)] md:mt-5 md:text-[17px] md:leading-[1.625]">
              Get a clear path, learn about pepper varieties, and adjust your route anytime.
            </p>
            <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap md:mt-8">
              <Link
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[14px] border border-[var(--terracotta)] bg-[var(--terracotta)] px-4 text-sm font-medium text-white shadow-sm transition hover:bg-[var(--terracotta-dark)]"
                to="/planner"
              >
                Start Visit
                <ArrowRight size={16} />
              </Link>
              <Link
                className="inline-flex h-12 items-center justify-center rounded-[14px] border border-[#d9cdb3] bg-white/60 px-5 text-sm font-medium text-[var(--ink)] transition hover:bg-white"
                to="/catalog"
              >
                Browse Peppers
              </Link>
            </div>
            <div className="mt-5 flex max-w-[520px] gap-3 rounded-[10px] border border-[#f0e4c6] bg-[#fdf5e4] px-4 py-3 text-sm leading-[22px] text-[var(--muted)]">
              <Sparkles className="mt-0.5 shrink-0 text-[#c57a2d]" size={16} />
              <p>AI helps suggest a route based on your time and preferences. You can edit everything later.</p>
            </div>
            <p className="mt-3 text-sm leading-5 text-[var(--muted)]">No download. No account. Start from the farm QR code.</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm leading-5 text-[var(--muted)]">
              <span className="inline-flex items-center gap-2"><Clock3 className="text-[var(--terracotta)]" size={16} /> Starts in 2 min</span>
              <span className="hidden h-4 w-px bg-[var(--soft-border)] sm:inline-block" />
              <span className="inline-flex items-center gap-2"><Leaf className="text-[var(--green)]" size={16} /> 12 pepper varieties</span>
              <span className="hidden h-4 w-px bg-[var(--soft-border)] sm:inline-block" />
              <span className="inline-flex items-center gap-2"><MapPin className="text-[#8a5a2b]" size={16} /> 4 tasting points</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[483px] pb-8 lg:mx-0 lg:pb-0">
            <div className="relative h-[360px] overflow-hidden rounded-[20px] border border-[var(--soft-border)] shadow-[0_30px_60px_-30px_rgba(138,90,43,0.35)] sm:h-[460px] lg:h-[604px] lg:rounded-[24px]">
              <img alt="Colorful peppers from Prigan farm" className="absolute inset-0 h-full w-full object-cover" src={homeHeroPeppers} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2a1d14]/40 via-transparent to-transparent" />
              <div className="absolute left-4 top-4 inline-flex h-7 items-center gap-2 rounded-full bg-white/95 px-3 text-xs leading-4 text-[var(--ink)] shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--green)]" />
                Live route · 45 min
              </div>
              <div className="absolute bottom-4 left-4 right-4 rounded-[14px] bg-white/95 px-4 py-3 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs leading-4 text-[var(--muted)]">Next stop</p>
                    <p className="mt-0.5 text-sm leading-5 text-[var(--ink)]">Greenhouse A · Sweet Reds</p>
                  </div>
                  <div className="flex w-[68px] shrink-0">
                    <span className="h-7 w-7 rounded-full border-2 border-white bg-[var(--terracotta)]" />
                    <span className="-ml-2 h-7 w-7 rounded-full border-2 border-white bg-[#e09f3e]" />
                    <span className="-ml-2 h-7 w-7 rounded-full border-2 border-white bg-[var(--green)]" />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-3 right-3 flex min-h-[62px] items-center gap-3 rounded-2xl border border-[var(--soft-border)] bg-white px-4 py-3 shadow-[0_10px_15px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)] lg:bottom-0 lg:left-[-20px] lg:right-auto">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fdf5e4] text-[#c57a2d]">
                <Sparkles size={16} />
              </span>
              <span>
                <span className="block text-xs leading-4 text-[var(--muted)]">Suggested for you</span>
                <span className="block text-sm leading-5 text-[var(--ink)]">Mild tasting route</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-0 pt-6 md:px-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-medium leading-[30px] text-[var(--ink)]">Quick start</h2>
            <p className="mt-1 text-sm leading-5 text-[var(--muted)]">Pick a ready-made path or fine-tune it later.</p>
          </div>
          <Link className="hidden items-center gap-0.5 text-sm font-normal leading-5 text-[#8a5a2b] sm:inline-flex" to="/recommended">
            See all presets
            <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {quickStarts.map((item) => {
            const Icon = item.icon

            return (
              <Link
                className="min-h-[187px] rounded-[12px] border border-[var(--soft-border)] bg-white px-5 py-5 transition hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(74,51,29,0.08)]"
                key={item.title}
                onClick={() => applyQuickStart(item.title)}
                to={item.to}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-[10px] ${item.iconClass}`}>
                    <Icon size={20} />
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium leading-4 ${item.badgeClass}`}>{item.badge}</span>
                </div>
                <h3 className="mt-7 text-base font-medium leading-6 text-[var(--ink)]">{item.title}</h3>
                <p className="mt-1 text-sm font-medium leading-[22px] text-[var(--muted)]">{item.description}</p>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="px-0 pt-8 md:px-8">
        <div className="rounded-2xl border border-[var(--soft-border)] bg-[var(--surface)] p-2">
          <div className="grid md:grid-cols-3">
            {secondaryActions.map((item, index) => {
              const Icon = item.icon

              return (
                <Link
                  className={`flex min-h-[72px] items-center gap-4 rounded-[14px] px-4 py-4 transition hover:bg-white ${
                    index < secondaryActions.length - 1 ? 'md:border-r md:border-[var(--soft-border)]' : ''
                  }`}
                  key={item.title}
                  to={item.to}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-[var(--soft-border)] bg-white text-[#8a5a2b]">
                    <Icon size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium leading-5 text-[var(--ink)]">{item.title}</span>
                    <span className="block text-xs font-medium leading-4 text-[var(--muted)]">{item.description}</span>
                  </span>
                  <ChevronRight className="shrink-0 text-[#8a7a63]" size={16} />
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-0 pb-10 pt-10 md:px-8">
        <div className="grid gap-6 border-t border-[var(--soft-border)] pt-8 md:grid-cols-3">
          {trustItems.map((item) => {
            const Icon = item.icon

            return (
              <div className="flex items-start gap-3" key={item.title}>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--cream-100)] text-[#8a5a2b]">
                  <Icon size={16} />
                </span>
                <span>
                  <span className="block text-sm leading-5 text-[var(--ink)]">{item.title}</span>
                  <span className="block text-sm leading-5 text-[var(--muted)]">{item.description}</span>
                </span>
              </div>
            )
          })}
        </div>
      </section>
    </PageShell>
  )
}
