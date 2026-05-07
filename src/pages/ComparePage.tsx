import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Heart,
  Info,
  Map,
  MapPin,
  Plus,
  Route,
  Search,
  Sparkles,
  X,
} from 'lucide-react'
import { type ReactNode, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageShell } from '../components/layout/PageShell'
import { getPepper } from '../data/helpers'
import { compareImages, pepperImages } from '../data/pepperImages'
import { peppers } from '../data/peppers'
import { useVisit } from '../hooks/useVisit'
import type { Pepper } from '../types/domain'
import { cn } from '../utils/cn'

const defaultCompareIds = ['lemon-drop', 'jalapeno', 'habanero']

const compareMeta: Record<string, {
  heatLabel: string
  heatLevel: number
  origin: string
  color: string
  route: string
  caution: string
  suitability: string
  topBadge?: string
}> = {
  'lemon-drop': {
    heatLabel: 'Medium',
    heatLevel: 3,
    origin: 'Peru',
    color: 'Yellow',
    route: 'Greenhouse Route · Stop 4',
    caution: 'Taste with caution',
    suitability: 'Good for learning · Medium heat',
  },
  jalapeno: {
    heatLabel: 'Mild',
    heatLevel: 2,
    origin: 'Mexico',
    color: 'Green / Red',
    route: 'Tasting GH 1–2 · Stop 4',
    caution: 'Safe for beginners',
    suitability: 'Beginner-friendly · Good for tasting',
    topBadge: 'In My Visit',
  },
  habanero: {
    heatLabel: 'Very hot',
    heatLevel: 5,
    origin: 'Caribbean',
    color: 'Orange / Red',
    route: 'Tasting GH 3–4 · Optional',
    caution: 'Taste very carefully',
    suitability: 'Advanced visitors only',
    topBadge: 'Strong heat',
  },
}

function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={cn('rounded-[8px] border border-[#e8e1d3] bg-white p-[22px] shadow-[0_10px_24px_rgba(74,51,29,0.05)]', className)}>
      {children}
    </section>
  )
}

function StatusChip({ children, active = false }: { children: ReactNode; active?: boolean }) {
  return (
    <span className={cn('inline-flex h-[26px] items-center rounded-full border px-3 text-[12px] font-medium', active ? 'border-[#efb7a8] bg-[#fff0eb] text-[var(--terracotta)]' : 'border-[#d8e3cf] bg-[#f4f8ed] text-[#55743a]')}>
      {children}
    </span>
  )
}

function HeatDots({ level, compact = false }: { level: number; compact?: boolean }) {
  return (
    <span className={cn('inline-flex', compact ? 'gap-[3px]' : 'gap-1')}>
      {[1, 2, 3, 4, 5].map((dot) => (
        <span
          className={cn('rounded-full', compact ? 'h-[9px] w-[9px]' : 'h-2.5 w-2.5', dot <= level ? 'bg-[var(--terracotta)]' : 'bg-[#e8e1d3]')}
          key={dot}
        />
      ))}
    </span>
  )
}

function MiniBadge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'green' | 'red' | 'gold' | 'blue' }) {
  const styles = {
    neutral: 'border-[#e4d8c7] bg-[#fbf8f3] text-[#6b6359]',
    green: 'border-[#c9ddc3] bg-[#e2eee3] text-[#4e8a5a]',
    red: 'border-[#f0b7a8] bg-[#fbe4dc] text-[var(--terracotta)]',
    gold: 'border-[#ead8a7] bg-[#fbefcf] text-[#7a5a10]',
    blue: 'border-[#bdd4df] bg-[#dde9f0] text-[#3d6e8c]',
  }
  return <span className={cn('inline-flex rounded-full border px-2 py-1 text-[11px] font-medium leading-none', styles[tone])}>{children}</span>
}

function heatTone(id: string) {
  if (id === 'habanero') return 'border-[#f0b7a8] bg-[#fbe4dc] text-[var(--terracotta)]'
  if (id === 'lemon-drop') return 'border-[#ead8a7] bg-[#fbefcf] text-[#7a5a10]'
  return 'border-[#c9ddc3] bg-[#e2eee3] text-[#4e8a5a]'
}

function SelectedPepperCard({
  pepper,
  saved,
  onRemove,
  onSave,
}: {
  pepper: Pepper
  saved: boolean
  onRemove: () => void
  onSave: () => void
}) {
  const meta = compareMeta[pepper.id]
  const image = compareImages[pepper.id] ?? pepperImages[pepper.id]
  const flavorTags = pepper.flavorTags.slice(0, 3)
  const suitabilityTags = pepper.suitabilityTags.slice(0, pepper.id === 'habanero' ? 3 : 2)

  return (
    <article className="overflow-hidden rounded-[8px] border border-[#e8e1d3] bg-white">
      <div className="relative h-[148px] overflow-hidden bg-[#f2ede4]">
        <img alt={`${pepper.name} pepper`} className="h-full w-full object-cover" src={image} />
        <span className={cn('absolute bottom-2 left-2 rounded-full border px-2 py-1 text-[11px] font-semibold shadow-sm', heatTone(pepper.id))}>
          {pepper.id === 'habanero' ? '▲ ' : null}{meta.heatLabel}
        </span>
        {meta.topBadge ? (
          <span className={cn('absolute left-2 top-2 rounded-full px-2 py-1 text-[11px] font-semibold text-white shadow-sm', pepper.id === 'habanero' ? 'bg-[var(--terracotta)]' : 'bg-[#3e7f74]')}>
            {meta.topBadge}
          </span>
        ) : null}
        <button
          aria-label={`Remove ${pepper.name} from comparison`}
          className="absolute right-2 top-2 inline-flex h-[26px] w-[26px] items-center justify-center rounded-full bg-white/95 text-[#6b6359] shadow-sm"
          onClick={onRemove}
          type="button"
        >
          <X size={13} />
        </button>
      </div>

      <div className="grid gap-3 p-3.5">
        <div>
          <h3 className="text-base font-semibold text-[var(--ink)]">{pepper.name}</h3>
          <p className="mt-0.5 text-[12px] text-[#6b6359]">{meta.origin} · {meta.color}</p>
        </div>

        <div className="grid gap-1.5">
          <div className="flex items-center gap-2">
            <HeatDots level={meta.heatLevel} compact />
            <span className="text-[12px] font-semibold text-[#6b6359]">{meta.heatLabel}</span>
          </div>
          <p className="text-[12px] text-[#6b6359]">{pepper.shuRange}</p>
        </div>

        <div className="flex min-h-[22px] flex-wrap gap-1.5">
          {flavorTags.map((tag) => <MiniBadge key={tag}>{tag}</MiniBadge>)}
        </div>
        <div className="flex min-h-[66px] flex-wrap content-start gap-1.5">
          {suitabilityTags.map((tag) => (
            <MiniBadge key={tag} tone={tag.toLowerCase().includes('caution') || tag.toLowerCase().includes('carefully') || tag.toLowerCase().includes('advanced') || tag.toLowerCase().includes('strong') ? 'red' : 'green'}>
              {tag}
            </MiniBadge>
          ))}
          {pepper.id === 'habanero' ? <MiniBadge tone="red">Strong heat</MiniBadge> : <MiniBadge tone="green">Available for tasting</MiniBadge>}
        </div>

        <div className="flex items-center gap-1.5 text-[12px] text-[#6b6359]">
          <MapPin size={12} />
          <span>{meta.route}</span>
          <Link className="ml-auto font-semibold text-[var(--terracotta)] hover:underline" to="/map">Map ↗</Link>
        </div>

        <div className="grid gap-2 pt-1">
          <Link className="inline-flex h-9 items-center justify-center rounded-[8px] bg-[var(--terracotta)] text-[12px] font-semibold text-white hover:bg-[var(--terracotta-dark)]" to={`/peppers/${pepper.id}`}>
            View Details
          </Link>
          <div className="grid grid-cols-[minmax(0,1fr)_34px] gap-2">
            <button
              className={cn('inline-flex h-9 items-center justify-center gap-1.5 rounded-[8px] border text-[12px] font-semibold', saved ? 'border-[#c9ddc3] bg-[#e2eee3] text-[#4e8a5a]' : 'border-[#d6cdbb] bg-white text-[#6b6359]')}
              onClick={onSave}
              type="button"
            >
              <Heart size={13} fill={saved ? 'currentColor' : 'none'} />
              {saved ? 'In My Visit' : '+ My Visit'}
            </button>
            <button className="inline-flex h-9 w-[34px] items-center justify-center rounded-[8px] border border-[#d6cdbb] bg-white text-[#6b6359]" onClick={onSave} type="button">
              <Heart size={14} fill={saved ? 'currentColor' : 'none'} />
            </button>
          </div>
          {saved ? <p className="text-center text-[12px] font-medium text-[#4e8a5a]">✓ Saved to My Visit</p> : null}
        </div>
      </div>
    </article>
  )
}

function CompareTable({ selected }: { selected: Pepper[] }) {
  const rows: Array<{ label: string; render: (pepper: Pepper) => ReactNode }> = [
    { label: 'Heat level', render: (pepper) => <div className="space-y-1"><p className="font-semibold">{compareMeta[pepper.id].heatLabel}</p><p className="text-[12px] text-[#6b6359]">{pepper.shuRange}</p></div> },
    { label: 'Origin', render: (pepper) => compareMeta[pepper.id].origin },
    { label: 'Color', render: (pepper) => compareMeta[pepper.id].color },
    { label: 'Flavor', render: (pepper) => <div className="flex flex-wrap gap-1.5">{pepper.flavorTags.slice(0, 3).map((tag) => <MiniBadge key={tag}>{tag}</MiniBadge>)}</div> },
    { label: 'Suitability', render: (pepper) => compareMeta[pepper.id].suitability },
    { label: 'Tasting caution', render: (pepper) => <span className={cn(pepper.id === 'habanero' || pepper.id === 'lemon-drop' ? 'text-[var(--terracotta)]' : 'text-[#4e8a5a]')}>{compareMeta[pepper.id].caution}</span> },
    { label: 'Where to find it', render: (pepper) => <div className="space-y-1"><p>{compareMeta[pepper.id].route}</p><Link className="text-[12px] font-semibold text-[var(--terracotta)]" to="/map">Map ↗</Link></div> },
  ]

  return (
    <Card>
      <h2 className="text-xl font-semibold text-[var(--ink)]">Side-by-side comparison</h2>
      <p className="mt-1 text-sm text-[#6b6359]">Scan differences in heat, origin, flavor, and suitability at a glance.</p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr>
              <th className="w-[150px] rounded-l-[8px] border-y border-l border-[#e8e1d3] bg-[#fbf8f3] px-3 py-3 text-[12px] uppercase text-[#6b6359]">Category</th>
              {selected.map((pepper, index) => (
                <th className={cn('border-y border-[#e8e1d3] bg-[#fbf8f3] px-3 py-3 font-semibold text-[var(--ink)]', index === selected.length - 1 ? 'rounded-r-[8px] border-r' : '')} key={pepper.id}>
                  {pepper.name}
                  {pepper.id === 'jalapeno' ? <MiniBadge tone="green">Mild</MiniBadge> : null}
                  {pepper.id === 'habanero' ? <MiniBadge tone="red">Very hot</MiniBadge> : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <td className="border-b border-[#eee5d8] px-3 py-3 text-[12px] font-semibold text-[#6b6359]">{row.label}</td>
                {selected.map((pepper) => (
                  <td className="border-b border-[#eee5d8] px-3 py-3 align-top text-[13px] leading-5 text-[var(--ink)]" key={pepper.id}>{row.render(pepper)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export function ComparePage() {
  const { visit, toggleSavePepper, toggleComparePepper, removeComparedPepper, setActiveStop } = useVisit()
  const navigate = useNavigate()
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    const validIds = visit.comparedPepperIds.filter((id) => defaultCompareIds.includes(id))
    return validIds.length ? validIds.slice(0, 3) : defaultCompareIds
  })
  const [query, setQuery] = useState('')
  const selected = useMemo(() => selectedIds.map(getPepper), [selectedIds])
  const myVisitSelectedCount = Math.max(1, selectedIds.filter((id) => visit.savedPepperIds.includes(id)).length)
  const mildCount = selectedIds.filter((id) => compareMeta[id]?.heatLabel === 'Mild').length

  function removePepper(id: string) {
    setSelectedIds((current) => current.filter((item) => item !== id))
    if (visit.comparedPepperIds.includes(id)) removeComparedPepper(id)
  }

  function addPepper(id?: string) {
    const candidate = id ?? peppers.find((pepper) => !selectedIds.includes(pepper.id))?.id
    if (!candidate || selectedIds.includes(candidate) || selectedIds.length >= 3) return
    setSelectedIds((current) => [...current, candidate])
    if (!visit.comparedPepperIds.includes(candidate)) toggleComparePepper(candidate)
  }

  function clearComparison() {
    selectedIds.forEach((id) => {
      if (visit.comparedPepperIds.includes(id)) removeComparedPepper(id)
    })
    setSelectedIds([])
  }

  function findOnRoute() {
    setActiveStop('greenhouse-route')
    navigate('/stops/greenhouse-route')
  }

  return (
    <>
      <PageShell className="py-0">
        <div className="mx-auto max-w-[1200px]">
          <header className="py-5">
            <div className="flex items-center gap-2 text-[13px] font-medium">
              <Link className="text-[var(--terracotta)] hover:underline" to="/catalog">Peppers</Link>
              <ChevronRight size={14} className="text-[#9a8e7d]" />
              <span className="text-[var(--ink)]">Compare</span>
            </div>
            <p className="mt-4 text-[12px] font-semibold uppercase tracking-normal text-[var(--terracotta)]">Prigan Farm · Compare Peppers</p>
            <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="text-[30px] font-semibold leading-9 text-[var(--ink)]">Compare Peppers</h1>
                <p className="mt-1 text-sm text-[#6b6359]">Compare heat, flavor, origin, and route relevance side by side.</p>
              </div>
              <div className="flex max-w-[520px] items-start gap-2 rounded-[8px] border border-[#e8e1d3] bg-[#f4f0e8] px-3 py-2 text-[12px] leading-5 text-[#6b6359]">
                <Info size={14} className="mt-0.5 shrink-0 text-[#8a7a63]" />
                <span>You can browse freely. <strong className="font-semibold text-[#2a2420]">Your route will not change</strong> unless you choose to update it.</span>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <StatusChip active>{selectedIds.length} selected</StatusChip>
              <StatusChip>{mildCount || 1} mild option</StatusChip>
              <StatusChip>2 available for tasting</StatusChip>
              <StatusChip>On your route</StatusChip>
              <StatusChip>Compare up to 3</StatusChip>
            </div>
          </header>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,832px)_280px] lg:items-start">
            <main className="min-w-0 space-y-5">
              <section className="rounded-[8px] border border-[#c6ded8] bg-[#e1efeb] p-[18px] text-[#3e7f74]">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-[#3e7f74] text-white">
                      <Sparkles size={15} />
                    </span>
                    <div>
                      <h2 className="text-sm font-semibold text-[#2f5d54]">Recommended for your visit</h2>
                      <p className="mt-1 text-[13px] leading-5 text-[#4f766d]">
                        Lemon Drop is a good match — it fits your mild-to-medium spice preference, supports learning, and is on your route. Jalapeño is safer for beginners. Habanero is much hotter — taste carefully.
                      </p>
                    </div>
                  </div>
                  <Link className="shrink-0 text-[12px] font-semibold text-[#2f6d63] hover:underline" to="/ai">Why?</Link>
                </div>
              </section>

              <Card>
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold text-[var(--ink)]">Selected peppers</h2>
                  <span className="rounded-full bg-[#fbe4dc] px-3 py-1.5 text-[12px] font-semibold text-[var(--terracotta)]">{selectedIds.length} of 3 selected</span>
                </div>
                {selected.length ? (
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    {selected.map((pepper) => (
                      <SelectedPepperCard
                        key={pepper.id}
                        onRemove={() => removePepper(pepper.id)}
                        onSave={() => toggleSavePepper(pepper.id)}
                        pepper={pepper}
                        saved={visit.savedPepperIds.includes(pepper.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 rounded-[8px] border border-[#e8e1d3] bg-[#fbf8f3] p-8 text-sm text-[#6b6359]">No peppers selected. Add up to 3 peppers to compare.</div>
                )}
              </Card>

              <CompareTable selected={selected} />

              <Card>
                <h2 className="flex items-center gap-2 text-xl font-semibold text-[var(--ink)]"><Info size={18} className="text-[#3d6e8c]" /> Tasting guidance</h2>
                <p className="mt-2 text-sm text-[#6b6359]">Start with Jalapeño or Lemon Drop. Habanero is significantly hotter — only taste if you are comfortable with very strong heat.</p>
                <div className="mt-5 grid gap-3">
                  {[
                    ['1', 'Start with Jalapeño — safest for beginners', '2,500–8,000 SHU · Fresh and familiar'],
                    ['2', 'Try Lemon Drop next — citrusy and distinctive', '30,000–50,000 SHU · More heat than Jalapeño'],
                    ['3', 'Drink water between each tasting', 'Helps clear your palate between samples'],
                    ['4', 'Skip Habanero if not comfortable with very strong heat', '100,000–350,000 SHU · Advanced visitors only'],
                  ].map(([number, title, body]) => (
                    <div className="grid grid-cols-[24px_minmax(0,1fr)] gap-3" key={number}>
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#dde9f0] text-[12px] font-semibold text-[#3d6e8c]">{number}</span>
                      <div>
                        <p className="text-sm font-semibold text-[var(--ink)]">{title}</p>
                        <p className="mt-0.5 text-[12px] text-[#6b6359]">{body}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-start gap-2 rounded-[8px] bg-[#fbe4dc] px-4 py-3 text-[13px] leading-5 text-[var(--terracotta)]">
                  <AlertTriangle size={15} className="mt-0.5 shrink-0" />
                  Habanero is very hot (100,000–350,000 SHU). Advanced visitors only. Do not taste unless you are confident with strong heat.
                </div>
              </Card>

              <Card>
                <h2 className="text-xl font-semibold text-[var(--ink)]">Edit comparison</h2>
                <label className="relative mt-4 block">
                  <span className="sr-only">Search to add another pepper</span>
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a8e7d]" size={15} />
                  <input
                    className="h-10 w-full rounded-[6px] border border-[#d6cdbb] bg-[#fbf8f3] pl-10 pr-3 text-sm text-[var(--ink)] placeholder:text-[#9a8e7d]"
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search to add another pepper…"
                    value={query}
                  />
                </label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selected.map((pepper) => (
                    <button className="inline-flex h-[27px] items-center gap-2 rounded-full border border-[#f0b7a8] bg-[#fff0eb] px-3 text-[12px] font-medium text-[var(--terracotta)]" key={pepper.id} onClick={() => removePepper(pepper.id)} type="button">
                      {pepper.name}
                      <X size={12} />
                    </button>
                  ))}
                  <button className="inline-flex h-[27px] items-center gap-1.5 rounded-full border border-[#d6cdbb] bg-white px-3 text-[12px] font-medium text-[#6b6359]" onClick={() => addPepper()} type="button">
                    <Plus size={12} />
                    Add pepper
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 text-[12px] text-[#6b6359]">
                  <span>Compare up to 3 peppers at a time.</span>
                  <button className="font-semibold text-[var(--terracotta)] hover:underline" onClick={clearComparison} type="button">Clear comparison</button>
                </div>
              </Card>

              <section className="rounded-[8px] border border-[#c6ded8] bg-[#f2ede4] p-[18px]">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
                  <Sparkles size={14} className="text-[#3e7f74]" />
                  How comparison suggestions work
                </h2>
                <p className="mt-3 text-[13px] leading-5 text-[#6b6359]">
                  Prigan Guide suggests peppers based on your spice comfort, current route, tasting availability, and interests. It does not hide other peppers.
                </p>
                <ul className="mt-3 grid gap-2 text-[13px] text-[#4e8a5a]">
                  {['Based on your spice comfort and route', "Recommendations don't hide other peppers", 'You can change filters anytime', 'Hot pepper warnings shown clearly'].map((item) => (
                    <li className="flex items-center gap-2" key={item}><CheckCircle2 size={13} />{item}</li>
                  ))}
                </ul>
                <p className="mt-3 text-[12px] text-[#6b6359]">Note: Heat levels are approximate and vary by pepper and preparation.</p>
              </section>
            </main>

            <aside className="space-y-0 overflow-hidden rounded-[8px] border border-[#e8e1d3] bg-white shadow-[0_10px_24px_rgba(74,51,29,0.06)] lg:sticky lg:top-24">
              <div className="border-b border-[#e8e1d3] p-4">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-[#3e7f74]"><Sparkles size={14} /> Fit for your visit</h2>
                <div className="mt-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-semibold text-[var(--ink)]">Lemon Drop</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <HeatDots level={3} compact />
                      <MiniBadge tone="gold">Medium</MiniBadge>
                    </div>
                  </div>
                  <MiniBadge tone="green">Good match</MiniBadge>
                </div>
              </div>
              <div className="border-b border-[#e8e1d3] p-4">
                <h3 className="text-[13px] font-semibold uppercase text-[var(--terracotta)]">Why recommended</h3>
                <p className="mt-2 text-[13px] leading-5 text-[#6b6359]">
                  Lemon Drop fits your mild-to-medium spice preference, supports learning, and is available on your current route. Jalapeño is safer for beginners. Habanero is much hotter and should be tasted carefully.
                </p>
                <ul className="mt-3 grid gap-2 text-[12px] text-[#4e8a5a]">
                  {['Matches your spice comfort', 'Available on your current route', 'Good starting point for tasting', 'Jalapeño is the safer beginner choice'].map((item) => (
                    <li className="flex items-center gap-2" key={item}><CheckCircle2 size={12} />{item}</li>
                  ))}
                </ul>
                <p className="mt-3 text-[12px] leading-5 text-[#9b5a45]">Suggestion only — you can choose any pepper freely.</p>
              </div>
              <div className="border-b border-[#e8e1d3] p-4">
                <h3 className="text-[13px] font-semibold uppercase text-[var(--ink)]">Quick reference</h3>
                <div className="mt-3 grid gap-2">
                  {selected.map((pepper) => (
                    <div className="flex items-center justify-between rounded-[8px] bg-[#fbf8f3] px-3 py-2 text-[13px]" key={pepper.id}>
                      <span className="font-medium text-[#6b6359]">{pepper.name}</span>
                      <HeatDots level={compareMeta[pepper.id].heatLevel} compact />
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-2 border-b border-[#e8e1d3] p-4">
                <button className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] bg-[var(--terracotta)] text-sm font-semibold text-white" onClick={findOnRoute} type="button"><Route size={15} />Find on Route</button>
                <div className="grid grid-cols-2 gap-2">
                  <Link className="inline-flex h-9 items-center justify-center gap-2 rounded-[8px] border border-[#d6cdbb] text-sm font-semibold" to="/map"><Map size={14} />Open Map</Link>
                  <Link className="inline-flex h-9 items-center justify-center rounded-[8px] border border-[#d6cdbb] text-sm font-semibold" to="/peppers/lemon-drop">Details</Link>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button className="inline-flex h-9 items-center justify-center gap-2 rounded-[8px] border border-[#d6cdbb] text-sm font-semibold" onClick={() => toggleSavePepper('lemon-drop')} type="button"><Heart size={14} />+ My Visit</button>
                  <button className="inline-flex h-9 items-center justify-center gap-2 rounded-[8px] border border-[#d6cdbb] text-sm font-semibold" onClick={() => toggleSavePepper('jalapeno')} type="button"><Heart size={14} fill="currentColor" />Saved</button>
                </div>
                <Link className="inline-flex h-9 items-center justify-center rounded-[8px] border border-[#d6cdbb] text-sm font-semibold text-[var(--terracotta)]" to="/catalog">Back to Catalog</Link>
              </div>
              <p className="p-4 text-center text-[12px] leading-5 text-[#6b6359]">AI suggestions are based on your spice comfort. You can choose any pepper manually.</p>
            </aside>
          </div>
        </div>
      </PageShell>

      <div className="sticky bottom-0 z-30 border-y border-[#e8e1d3] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-4 py-3 text-[12px] text-[#6b6359] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="font-semibold text-[var(--ink)]">Comparing {selectedIds.length} of 3 peppers</span>
            <span className="ml-2">· Select up to 3 to compare side-by-side</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button className="font-semibold text-[var(--terracotta)]" onClick={clearComparison} type="button">Clear all</button>
            <span className="h-4 w-px bg-[#e8e1d3]" />
            <span className="inline-flex items-center gap-1.5"><Heart size={14} /> My Visit: {myVisitSelectedCount} saved pepper</span>
            <Link className="inline-flex h-9 items-center rounded-[8px] bg-[#fbf8f3] px-4 font-semibold text-[var(--ink)]" to="/my-visit">View My Visit</Link>
          </div>
        </div>
      </div>
    </>
  )
}
