import {
  ArrowRight,
  BookOpen,
  Check,
  Clock3,
  HelpCircle,
  Leaf,
  Pencil,
  RotateCcw,
  Route,
  SlidersHorizontal,
  Sparkles,
  Sprout,
  Timer,
  UsersRound,
  Zap,
} from 'lucide-react'
import type { ComponentType, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageShell } from '../components/layout/PageShell'
import { buildAdaptiveRoute } from '../data/adaptiveRoute'
import { getRouteStops } from '../data/helpers'
import { useVisit } from '../hooks/useVisit'

type Option = {
  label: string
  value: string
  description?: string
  icon?: ComponentType<{ size?: number; className?: string }>
}

const durationOptions: Option[] = [
  { label: '30 min', value: '30 min', description: 'Quick look' },
  { label: '45 min', value: '40-45 min', description: 'Popular' },
  { label: '60 min', value: '60 min', description: 'Comfortable' },
  { label: '75+ min', value: '75+ min', description: 'Full experience' },
]

const visitModes: Option[] = [
  { label: 'Family', value: 'Family / Beginner-friendly', description: 'Gentle, child-friendly stops', icon: UsersRound },
  { label: 'Quick Tour', value: 'Fast overview', description: 'Highlights only, fast pace', icon: Zap },
  { label: 'Explore', value: 'Pepper enthusiast', description: 'Deep dive, all varieties', icon: BookOpen },
]

const spiceOptions: Option[] = [
  { label: 'Mild', value: 'Mild', icon: Leaf },
  { label: 'Medium', value: 'Medium', icon: Sprout },
  { label: 'Hot', value: 'Hot', icon: Sparkles },
  { label: 'Very Hot', value: 'Very Hot', icon: Sparkles },
]

const displayDuration = (duration: string) => duration === '40-45 min' ? '45 min' : duration

const displayMode = (mode: string) => {
  if (mode === 'Family / Beginner-friendly') return 'Family'
  if (mode === 'Fast overview') return 'Quick Tour'
  if (mode === 'Pepper enthusiast') return 'Explore'
  return mode
}

function SectionCard({ letter, title, children, className = '' }: { letter: string; title: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-[18px] border border-[#e8e1d3] bg-white p-5 ${className}`}>
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[11px] font-medium uppercase leading-4 text-[var(--terracotta)]">{letter}</span>
        <h2 className="text-[15px] font-semibold leading-[22px] text-[#2a2420]">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function SummaryRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex min-h-[63px] gap-3 border-b border-[#e8e1d3] py-3 last:border-b-0">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#f2ede4] text-[#8a7a63]">
        {icon}
      </span>
      <span>
        <span className="block text-[11px] font-medium uppercase leading-4 text-[#8a7a63]">{label}</span>
        <span className="block text-[13px] font-medium leading-5 text-[#2a2420]">{value}</span>
      </span>
    </div>
  )
}

export function VisitPlannerPage() {
  const {
    visit,
    setPreference,
    chooseRecommended,
    chooseManual,
    resetVisit,
  } = useVisit()
  const navigate = useNavigate()
  const routePreview = buildAdaptiveRoute(visit)
  const previewStops = getRouteStops(visit)

  return (
    <PageShell className="bg-[#fbf8f3] pb-12 pt-10 md:px-8">
      <section className="mb-6">
        <p className="text-xs font-medium uppercase leading-[18px] text-[var(--terracotta)]">Visit Planner</p>
        <h1 className="mt-2 text-[32px] font-semibold leading-[38px] text-[#2a2420]">Plan Your Visit</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[#6b6359]">
          Choose three simple settings. The route will change based on time, visit mode, and spice comfort.
        </p>
      </section>

      <div className="mx-auto grid max-w-[1180px] gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="space-y-4">
          <SectionCard letter="A" title="How much time do you have?">
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {durationOptions.map((option) => {
                const active = visit.selectedDuration === option.value

                return (
                  <button
                    aria-pressed={active}
                    className={`flex min-h-20 flex-col items-center justify-center rounded-[14px] px-3 py-4 text-center transition ${
                      active
                        ? 'border-2 border-[var(--terracotta)] bg-[#fbe4dc] text-[var(--terracotta)]'
                        : 'border border-[#e8e1d3] bg-[#fbf8f3] text-[#2a2420] hover:border-[#d6cdbb]'
                    }`}
                    key={option.value}
                    onClick={() => setPreference('selectedDuration', option.value)}
                    type="button"
                  >
                    <span className="text-base font-semibold leading-6">{option.label}</span>
                    <span className={`text-xs font-medium leading-[18px] ${active ? 'text-[var(--terracotta)]' : 'text-[#6b6359]'}`}>
                      {option.description}
                    </span>
                  </button>
                )
              })}
            </div>
          </SectionCard>

          <SectionCard letter="B" title="Visit mode">
            <div className="grid gap-3 md:grid-cols-3">
              {visitModes.map((option) => {
                const active = visit.selectedMode === option.value
                const Icon = option.icon ?? UsersRound

                return (
                  <button
                    aria-pressed={active}
                    className={`min-h-[121px] rounded-[14px] p-4 text-left transition ${
                      active
                        ? 'border-2 border-[var(--terracotta)] bg-[#fbe4dc] text-[var(--terracotta)]'
                        : 'border border-[#e8e1d3] bg-[#fbf8f3] text-[#2a2420] hover:border-[#d6cdbb]'
                    }`}
                    key={option.value}
                    onClick={() => setPreference('selectedMode', option.value)}
                    type="button"
                  >
                    <span className={`flex h-9 w-9 items-center justify-center rounded-[10px] ${active ? 'bg-[var(--terracotta)] text-white' : 'bg-[#f2ede4] text-[#8a7a63]'}`}>
                      <Icon size={22} />
                    </span>
                    <span className="mt-3 block text-sm font-semibold leading-[21px]">{option.label}</span>
                    <span className={`block text-xs font-medium leading-[18px] ${active ? 'text-[var(--terracotta)]' : 'text-[#6b6359]'}`}>
                      {option.description}
                    </span>
                  </button>
                )
              })}
            </div>
          </SectionCard>

          <SectionCard letter="C" title="Spice tolerance">
            <p className="mb-3 text-[13px] leading-5 text-[#8a7a63]">We'll use this to suggest suitable tasting stops.</p>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {spiceOptions.map((option) => {
                const active = visit.selectedSpiceLevel === option.value
                const Icon = option.icon ?? Leaf

                return (
                  <button
                    aria-pressed={active}
                    className={`flex min-h-[72px] flex-col items-center justify-center gap-1 rounded-[14px] text-xs font-medium transition ${
                      active
                        ? 'border-2 border-[#6a8f4d] bg-[#eef4e5] text-[#4b5e38]'
                        : 'border border-[#e8e1d3] bg-[#fbf8f3] text-[#6b6359] hover:border-[#d6cdbb]'
                    }`}
                    key={option.value}
                    onClick={() => setPreference('selectedSpiceLevel', option.value)}
                    type="button"
                  >
                    <Icon size={16} />
                    {option.label}
                  </button>
                )
              })}
            </div>
          </SectionCard>

          <SectionCard letter="D" title="Navigation mode">
            <div className="space-y-3">
              <button
                aria-pressed={!visit.manualMode}
                className={`flex min-h-[82px] w-full items-center gap-4 rounded-[14px] p-4 text-left transition ${
                  !visit.manualMode
                    ? 'border-2 border-[#3e7f74] bg-[#e1efeb]'
                    : 'border border-[#e8e1d3] bg-[#fbf8f3] hover:border-[#d6cdbb]'
                }`}
                onClick={chooseRecommended}
                type="button"
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] ${!visit.manualMode ? 'bg-[#3e7f74] text-white' : 'bg-[#f2ede4] text-[#8a7a63]'}`}>
                  <Route size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2 text-[15px] font-semibold leading-[22px] text-[#2a2420]">
                    AI Recommended Route
                    <span className="rounded-full border border-[#b8d8cf] bg-[#e1efeb] px-2 py-0.5 text-[11px] font-medium text-[#3e7f74]">Suggested</span>
                  </span>
                  <span className="block text-[13px] leading-5 text-[#3e7f74]">Personalized route based on your preferences and time.</span>
                </span>
                {!visit.manualMode ? <Check className="text-[#3e7f74]" size={18} /> : null}
              </button>

              <button
                aria-pressed={visit.manualMode}
                className={`flex min-h-20 w-full items-center gap-4 rounded-[14px] p-4 text-left transition ${
                  visit.manualMode
                    ? 'border-2 border-[var(--terracotta)] bg-[#fbe4dc]'
                    : 'border border-[#e8e1d3] bg-[#fbf8f3] hover:border-[#d6cdbb]'
                }`}
                onClick={chooseManual}
                type="button"
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] ${visit.manualMode ? 'bg-[var(--terracotta)] text-white' : 'bg-[#f2ede4] text-[#8a7a63]'}`}>
                  <Pencil size={18} />
                </span>
                <span>
                  <span className="block text-[15px] font-semibold leading-[22px] text-[#2a2420]">Manual Planning</span>
                  <span className="block text-[13px] leading-5 text-[#6b6359]">Choose stops yourself without AI recommendations.</span>
                </span>
              </button>
            </div>
          </SectionCard>

          <section className="rounded-[18px] border border-[#c7e1da] bg-[#e1efeb] p-5">
            <div className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#3e7f74] text-white">
                <HelpCircle size={16} />
              </span>
              <div>
                <h2 className="text-[15px] font-semibold leading-[22px] text-[#3e7f74]">How the recommendation works</h2>
                <p className="text-[13px] leading-5 text-[#3e7f74]">
                  The system chooses a route from your time, visit mode, and spice comfort.
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-[10px] bg-white/65 p-4 text-[13px] leading-5 text-[#3e7f74]">
              <p className="flex items-center gap-2"><Check size={14} /> You will see why the route was suggested</p>
              <p className="mt-2 flex items-center gap-2"><Check size={14} /> You can edit or shorten it later</p>
              <p className="mt-2 flex items-center gap-2"><Check size={14} /> You can switch to manual mode anytime</p>
            </div>
          </section>

          <section className="rounded-[18px] border border-[#e8e1d3] bg-white p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <button
                className="inline-flex h-[50px] items-center justify-center gap-2 rounded-[10px] border border-[var(--terracotta)] bg-[var(--terracotta)] px-7 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--terracotta-dark)]"
                onClick={() => {
                  chooseRecommended()
                  navigate('/recommended')
                }}
                type="button"
              >
                <Sparkles size={16} />
                Generate My Route
                <ArrowRight size={16} />
              </button>
              <button
                className="inline-flex h-[52px] items-center justify-center rounded-[10px] border border-[#d6cdbb] bg-white px-5 text-sm font-medium text-[#2a2420] transition hover:bg-[#fbf8f3]"
                onClick={() => {
                  chooseManual()
                  navigate('/map')
                }}
                type="button"
              >
                Choose Manually
              </button>
              <button
                className="inline-flex h-[36px] items-center justify-center gap-2 rounded-lg px-2 text-xs font-medium text-[#8a7a63] transition hover:bg-[#f2ede4] md:ml-auto"
                onClick={resetVisit}
                type="button"
              >
                <RotateCcw size={13} />
                Reset selections
              </button>
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-[18px] border border-[#e8e1d3] bg-white p-5 shadow-[0_10px_30px_rgba(42,36,32,0.08)] lg:sticky lg:top-24">
          <h2 className="text-xs font-medium uppercase leading-5 text-[var(--terracotta)]">Your selections</h2>
          <div className="mt-3">
            <SummaryRow icon={<Clock3 size={14} />} label="Time" value={displayDuration(visit.selectedDuration)} />
            <SummaryRow icon={<UsersRound size={14} />} label="Mode" value={displayMode(visit.selectedMode)} />
            <SummaryRow icon={<Sparkles size={14} />} label="Spice level" value={visit.selectedSpiceLevel} />
            <SummaryRow icon={<SlidersHorizontal size={14} />} label="Navigation" value={visit.manualMode ? 'Manual Planning' : 'AI Recommended'} />
          </div>
          <div className="mt-4 rounded-[12px] border border-[#e8e1d3] bg-[#fbf8f3] p-3">
            <p className="text-[11px] font-medium uppercase leading-4 text-[#8a7a63]">Route preview</p>
            <h3 className="mt-1 text-sm font-semibold leading-5 text-[#2a2420]">{routePreview.name}</h3>
            <p className="mt-1 text-xs leading-[18px] text-[#6b6359]">{routePreview.durationMinutes} min / {routePreview.totalStops} stops</p>
            <p className="mt-2 text-xs leading-[18px] text-[#8a7a63]">
              {previewStops.map((stop) => stop.shortName).join(' -> ')}
            </p>
          </div>
          <div className="mt-4 flex gap-2 rounded-[12px] bg-[#e1efeb] p-3 text-xs leading-[18px] text-[#3e7f74]">
            <Timer className="mt-0.5 shrink-0" size={14} />
            <p>AI will personalize your route based on these choices.</p>
          </div>
        </aside>
      </div>
    </PageShell>
  )
}
