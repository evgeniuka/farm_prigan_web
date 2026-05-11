import { BookOpen, CheckCircle2, ChevronRight, CircleHelp, GitCompare, Heart, Leaf, Search, Sparkles, X } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { PageShell } from '../components/layout/PageShell'
import { PepperCard } from '../components/peppers/PepperCard'
import { pepperImages } from '../data/pepperImages'
import { peppers } from '../data/peppers'
import { useVisit } from '../hooks/useVisit'
import type { Pepper } from '../types/domain'
import { cn } from '../utils/cn'

const heatFilters = [
  { label: 'Mild', icon: '🌿' },
  { label: 'Medium', icon: '🟡' },
  { label: 'Hot', icon: '🔴' },
  { label: 'Very hot', icon: '🔥' },
]

const colorFilters = ['Yellow', 'Red', 'Green', 'Orange']
const suitabilityFilters = ['Good for tasting', 'Good for learning', 'Beginner-friendly', 'In My Visit']
const recommendedIds = ['lemon-drop', 'jalapeno']

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

function getHeatLabel(pepper: Pepper) {
  if (pepper.heatLevel >= 5) return 'Very hot'
  if (pepper.heatLevel >= 4) return 'Hot'
  if (pepper.heatLevel >= 3) return 'Medium'
  return 'Mild'
}

function FilterChip({
  active,
  children,
  onClick,
}: {
  active?: boolean
  children: ReactNode
  onClick: () => void
}) {
  return (
    <button
      className={cn(
        'inline-flex h-8 items-center rounded-full border px-3 text-[12px] font-medium transition',
        active
          ? 'border-[#efb7a8] bg-[#fff0eb] text-[var(--terracotta)]'
          : 'border-[#ddd2c2] bg-white text-[#4f4439] hover:bg-[#fbf8f3]',
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  )
}

function CatalogStat({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-7 items-center gap-1.5 rounded-full border border-[#d8e3cf] bg-[#f4f8ed] px-3 text-[12px] font-medium text-[#55743a]">
      <CheckCircle2 size={12} />
      {children}
    </span>
  )
}

function SidebarPepper({
  pepper,
  saved,
  onSave,
}: {
  pepper: Pepper
  saved: boolean
  onSave: () => void
}) {
  const heatLabel = getHeatLabel(pepper)
  const heatIcon = heatLabel === 'Medium' ? '🟡' : heatLabel === 'Mild' ? '🌿' : heatLabel === 'Hot' ? '🔴' : '🔥'

  return (
    <div className="rounded-[8px] border border-[#eadfce] bg-[#fbf8f3]">
      <div className="grid grid-cols-[68px_minmax(0,1fr)]">
        <img alt={`${pepper.name} pepper`} className="h-[68px] w-[68px] rounded-l-[8px] object-cover" src={pepperImages[pepper.id]} />
        <div className="min-w-0 p-2.5">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-[13px] font-semibold text-[var(--ink)]">{pepper.name}</p>
            <span className="inline-flex h-6 shrink-0 items-center gap-1 rounded-full border border-[#cbdcc4] bg-[#eef6e5] px-2 text-[11px] font-semibold text-[#55743a]">
              {heatIcon} {heatLabel}
            </span>
          </div>
          <p className="mt-1.5 line-clamp-2 text-[11px] leading-4 text-[#6b6359]">
            {pepper.id === 'lemon-drop'
              ? 'Matches your mild–medium preference and is on the Greenhouse Route.'
              : 'Beginner-friendly and available at your next tasting stop.'}
          </p>
        </div>
      </div>
      <div className="flex h-10 items-center justify-between border-t border-[#eadfce] px-2.5">
        <Link className="inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--terracotta)] hover:underline" to={`/peppers/${pepper.id}`}>
          View Details <ChevronRight size={11} />
        </Link>
        <button
          aria-label={saved ? `Remove ${pepper.name} from My Visit` : `Save ${pepper.name} to My Visit`}
          className={cn(
            'inline-flex h-6 items-center gap-1 rounded-md border px-2 text-[11px] font-semibold',
            saved
              ? 'border-[#f0b7a8] bg-[#fff0eb] text-[var(--terracotta)]'
              : 'border-[#e1d5c5] bg-white text-[#6b6359]',
          )}
          onClick={onSave}
          type="button"
        >
          <Heart size={10} fill={saved ? 'currentColor' : 'none'} />
          {saved ? 'Saved' : 'Add'}
        </button>
      </div>
    </div>
  )
}

export function CatalogPage() {
  const { visit, toggleSavePepper, toggleComparePepper } = useVisit()
  const [query, setQuery] = useState('')
  const [heatFilter, setHeatFilter] = useState<string | null>(null)
  const [colorFilter, setColorFilter] = useState<string | null>(null)
  const [suitabilityFilter, setSuitabilityFilter] = useState<string | null>(null)

  const savedPepperIds = visit.savedPepperIds
  const savedPeppers = peppers.filter((pepper) => savedPepperIds.includes(pepper.id)).slice(0, 2)
  const comparedCount = visit.comparedPepperIds.length

  const visiblePeppers = useMemo(() => {
    const normalizedQuery = normalize(query)

    return peppers.filter((pepper) => {
      const searchable = normalize([
        pepper.name,
        pepper.origin,
        pepper.color,
        pepper.flavorTags.join(' '),
        pepper.suitabilityTags.join(' '),
      ].join(' '))
      const matchesQuery = !normalizedQuery || searchable.includes(normalizedQuery)
      const matchesHeat = !heatFilter || getHeatLabel(pepper) === heatFilter
      const matchesColor = !colorFilter || normalize(pepper.color).includes(normalize(colorFilter))
      const matchesSuitability =
        !suitabilityFilter ||
        (suitabilityFilter === 'In My Visit'
          ? savedPepperIds.includes(pepper.id)
          : pepper.suitabilityTags.some((tag) => tag === suitabilityFilter))

      return matchesQuery && matchesHeat && matchesColor && matchesSuitability
    })
  }, [colorFilter, heatFilter, query, savedPepperIds, suitabilityFilter])

  function handleCompare(pepperId: string) {
    const alreadyCompared = visit.comparedPepperIds.includes(pepperId)
    if (alreadyCompared || comparedCount < 3) {
      toggleComparePepper(pepperId)
    }
  }

  return (
    <PageShell className="py-7 md:py-7">
      <div className="mx-auto grid max-w-[1120px] gap-6 xl:grid-cols-1 xl:items-start">
        <div className="min-w-0 space-y-5">
          <section className="rounded-[8px] border border-[#e8e1d3] bg-[#fbf8f3] px-5 py-5 shadow-[0_12px_30px_rgba(74,51,29,0.05)] md:px-6">
            <p className="text-[11px] font-semibold uppercase tracking-normal text-[var(--terracotta)]">Prigan Farm · Pepper Catalog</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight text-[var(--ink)]">Pepper Catalog</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b6359]">
              Browse pepper varieties, check heat levels, and add peppers to your visit.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <CatalogStat>6 varieties</CatalogStat>
              <CatalogStat>6 available for tasting</CatalogStat>
              <CatalogStat>Beginner-friendly options</CatalogStat>
              <CatalogStat>Compare up to 3</CatalogStat>
            </div>
            <div className="mt-4 flex items-start gap-2 rounded-[6px] border border-[#dcd1c0] bg-[#f4f0e8] px-3 py-2.5 text-[12px] leading-5 text-[#6b6359]">
              <CircleHelp size={14} className="mt-0.5 shrink-0 text-[#8b765d]" />
              <span>You can browse freely. <strong className="font-semibold text-[#4f4439]">Your route will not change</strong> unless you choose to update it.</span>
            </div>
          </section>

          <section className="flex flex-col gap-3 rounded-[8px] border border-[#c6ded8] bg-[#e1efeb] px-5 py-4 text-[#3e7f74] md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#3e7f74] text-white">
                <Sparkles size={15} />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-[#2f5d54]">Recommended for your visit</h2>
                <p className="mt-0.5 text-[12px] leading-5 text-[#4f766d]">
                  Based on your mild spice preference and learning-focused route, Lemon Drop and Jalapeño are suggested for comparison.
                </p>
              </div>
            </div>
            <Link className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#2f6d63] hover:underline" to="/ai">
              Why? <ChevronRight size={12} />
            </Link>
          </section>

          <section className="rounded-[8px] border border-[#e8e1d3] bg-white px-5 py-5 shadow-[0_10px_26px_rgba(74,51,29,0.05)]">
            <label className="relative block">
              <span className="sr-only">Search peppers</span>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a8e7d]" size={16} />
              <input
                className="h-10 w-full rounded-[6px] border border-[#dcd1c0] bg-[#fbf8f3] pl-10 pr-3 text-[13px] text-[var(--ink)] placeholder:text-[#9a8e7d]"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by pepper name, origin, or flavor"
                value={query}
              />
            </label>

            <div className="mt-5 grid gap-4">
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase text-[#7f7162]">Heat level</p>
                <div className="flex flex-wrap gap-2">
                  {heatFilters.map((filter) => (
                    <FilterChip
                      active={heatFilter === filter.label}
                      key={filter.label}
                      onClick={() => setHeatFilter((current) => (current === filter.label ? null : filter.label))}
                    >
                      {filter.icon} {filter.label}
                    </FilterChip>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase text-[#7f7162]">Color</p>
                <div className="flex flex-wrap gap-2">
                  {colorFilters.map((filter) => (
                    <FilterChip
                      active={colorFilter === filter}
                      key={filter}
                      onClick={() => setColorFilter((current) => (current === filter ? null : filter))}
                    >
                      {filter}
                    </FilterChip>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="mr-1 text-[11px] font-semibold uppercase text-[#7f7162]">Suitability:</span>
                  {suitabilityFilters.map((filter) => (
                    <FilterChip
                      active={suitabilityFilter === filter}
                      key={filter}
                      onClick={() => setSuitabilityFilter((current) => (current === filter ? null : filter))}
                    >
                      {filter}
                    </FilterChip>
                  ))}
                </div>
                <button className="inline-flex h-8 items-center gap-1 rounded-[6px] border border-[#dcd1c0] bg-[#fbf8f3] px-3 text-[12px] text-[#4f4439]" type="button">
                  Sort: <strong>Recommended</strong> <ChevronRight size={12} />
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <p className="text-[12px] text-[#6b6359]">Showing {visiblePeppers.length} of {peppers.length} varieties</p>
            {visiblePeppers.length ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {visiblePeppers.map((pepper) => {
                  const compared = visit.comparedPepperIds.includes(pepper.id)

                  return (
                    <PepperCard
                      compared={compared}
                      compareDisabled={!compared && comparedCount >= 3}
                      key={pepper.id}
                      onCompare={() => handleCompare(pepper.id)}
                      onSave={() => toggleSavePepper(pepper.id)}
                      pepper={pepper}
                      saved={savedPepperIds.includes(pepper.id)}
                    />
                  )
                })}
              </div>
            ) : (
              <div className="rounded-[8px] border border-[#e8e1d3] bg-white p-8 text-sm text-[#6b6359]">
                No peppers match these filters yet.
              </div>
            )}
          </section>

          <section className="grid gap-3 rounded-[8px] border border-[#e8e1d3] bg-white px-5 py-4 shadow-[0_10px_26px_rgba(74,51,29,0.05)] md:grid-cols-2">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#e1efeb] text-[#3e7f74]">
                  <GitCompare size={16} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[var(--ink)]">Compare peppers: {comparedCount} of 3</p>
                  <p className="text-[12px] text-[#6b6359]">Select up to 3 to compare side-by-side</p>
                </div>
              </div>
              <Link className="shrink-0 rounded-[6px] bg-[#f4f0e8] px-3 py-2 text-[12px] font-semibold text-[#6b6359] hover:bg-[#ece4d8]" to="/compare">
                Open Compare
              </Link>
            </div>
            <div className="flex items-center justify-between gap-4 md:border-l md:border-[#e8e1d3] md:pl-5">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#fff0eb] text-[var(--terracotta)]">
                  <Heart size={16} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[var(--ink)]">My Visit peppers: {savedPepperIds.length} saved</p>
                  <p className="text-[12px] text-[#6b6359]">Access saved peppers in My Visit</p>
                </div>
              </div>
              <Link className="shrink-0 rounded-[6px] border border-[#f0b7a8] bg-[#fff0eb] px-3 py-2 text-[12px] font-semibold text-[var(--terracotta)] hover:bg-[#ffe6dd]" to="/my-visit">
                View My Visit
              </Link>
            </div>
          </section>
        </div>

        <aside className="hidden space-y-4 xl:sticky xl:top-24">
          <section className="overflow-hidden rounded-[8px] border border-[#e8e1d3] bg-white shadow-[0_10px_26px_rgba(74,51,29,0.06)]">
            <div className="border-b border-[#eadfce] bg-[#fbf8f3] px-4 py-3">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
                <Sparkles size={14} className="text-[var(--terracotta)]" />
                Recommended for your visit
              </h2>
              <p className="mt-1 text-[11px] text-[#6b6359]">Based on your spice level, route, and interests</p>
            </div>
            <div className="grid gap-3 p-3.5">
              {recommendedIds.map((pepperId) => {
                const pepper = peppers.find((item) => item.id === pepperId)!
                const saved = savedPepperIds.includes(pepper.id)

                return (
                  <SidebarPepper
                    key={pepper.id}
                    onSave={() => toggleSavePepper(pepper.id)}
                    pepper={pepper}
                    saved={saved}
                  />
                )
              })}
              <Link className="flex h-9 items-center justify-between rounded-[6px] border border-[#e1d5c5] bg-[#fbf8f3] px-3 text-[12px] font-semibold text-[#6b6359]" to="/ai">
                Why these recommendations?
                <ChevronRight size={13} />
              </Link>
            </div>
          </section>

          <section className="overflow-hidden rounded-[8px] border border-[#e8e1d3] bg-white shadow-[0_10px_26px_rgba(74,51,29,0.06)]">
            <div className="flex items-center justify-between border-b border-[#eadfce] bg-[#fbf8f3] px-4 py-3">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
                <BookOpen size={14} className="text-[var(--terracotta)]" />
                My Visit Peppers
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--terracotta)] px-1.5 text-[11px] text-white">{savedPepperIds.length}</span>
              </h2>
              <Link className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--terracotta)] hover:underline" to="/my-visit">
                View all <ChevronRight size={11} />
              </Link>
            </div>
            <div className="grid gap-2 p-3.5">
              {savedPeppers.map((pepper) => (
                <div className="flex items-center justify-between gap-3" key={pepper.id}>
                  <div className="flex min-w-0 items-center gap-2">
                    <img alt={`${pepper.name} pepper`} className="h-8 w-8 rounded object-cover" src={pepperImages[pepper.id]} />
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold text-[var(--ink)]">{pepper.name}</p>
                      <span className="mt-0.5 inline-flex h-5 items-center rounded-full border border-[#cbdcc4] bg-[#eef6e5] px-2 text-[11px] font-semibold text-[#55743a]">🌿 Mild</span>
                    </div>
                  </div>
                  <button
                    aria-label={`Remove ${pepper.name} from My Visit`}
                    className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#e1d5c5] bg-[#fbf8f3] text-[#9a8e7d]"
                    onClick={() => toggleSavePepper(pepper.id)}
                    type="button"
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="overflow-hidden rounded-[8px] border border-[#c6ded8] bg-white shadow-[0_10px_26px_rgba(74,51,29,0.06)]">
            <div className="border-b border-[#c6ded8] bg-[#d8eee9] px-4 py-3">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-[#2f5d54]">
                <Leaf size={14} />
                How recommendations work
              </h2>
            </div>
            <div className="grid gap-3 p-4 text-[12px] leading-5 text-[#5c6f67]">
              <p>Prigan Guide suggests peppers based on your spice comfort, current route, tasting availability, and interests.</p>
              <ul className="grid gap-1.5">
                {[
                  "Recommendations don't hide other peppers",
                  'You can change filters anytime',
                  'Hot pepper warnings shown clearly',
                ].map((item) => (
                  <li className="flex items-center gap-2" key={item}>
                    <CheckCircle2 size={12} className="text-[#3e7f74]" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="rounded-[6px] border border-[#e1d5c5] bg-[#fbf8f3] p-2 text-[11px] leading-4 text-[#7f7162]">
                Note: Heat levels are approximate and vary by pepper and preparation.
              </div>
            </div>
          </section>
        </aside>
      </div>
    </PageShell>
  )
}
