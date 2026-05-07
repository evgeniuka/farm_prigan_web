import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  GitCompare,
  Heart,
  Info,
  Map,
  MapPin,
  Route,
  Sparkles,
} from 'lucide-react'
import { type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageShell } from '../components/layout/PageShell'
import { getPepper, getStop } from '../data/helpers'
import { pepperDetailFallback, pepperImages } from '../data/pepperImages'
import { useVisit } from '../hooks/useVisit'
import type { Pepper } from '../types/domain'
import { cn } from '../utils/cn'

const relatedIds = ['poblano', 'jalapeno', 'habanero']

function displayName(pepper: Pepper) {
  return pepper.id === 'sweet-pepper' ? 'Sweet Palermo' : pepper.name
}

function heatMeta(pepper: Pepper) {
  if (pepper.id === 'sweet-pepper') return { level: 0, label: 'Mild', range: '0 SHU', tone: 'green' as const }
  if (pepper.heatLevel >= 5) return { level: 5, label: 'Very hot', range: pepper.shuRange, tone: 'red' as const }
  if (pepper.heatLevel >= 4) return { level: 4, label: 'Hot', range: pepper.shuRange, tone: 'red' as const }
  if (pepper.heatLevel >= 3) return { level: 3, label: 'Medium', range: pepper.shuRange, tone: 'gold' as const }
  return { level: pepper.heatLevel, label: 'Mild', range: pepper.shuRange, tone: 'green' as const }
}

function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={cn('rounded-[16px] border border-[#e8e1d3] bg-white p-6 shadow-[0_10px_24px_rgba(74,51,29,0.04)]', className)}>
      {children}
    </section>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="text-[12px] font-semibold uppercase tracking-normal text-[var(--terracotta)]">{children}</p>
}

function Chip({ children, active = false }: { children: ReactNode; active?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex h-9 items-center rounded-full border px-4 text-sm font-medium',
        active
          ? 'border-[var(--terracotta)] bg-[#fbe4dc] text-[var(--terracotta)]'
          : 'border-[#d6cdbb] bg-white text-[#2a2420]',
      )}
    >
      {children}
    </span>
  )
}

function HeatDots({ level, size = 'md' }: { level: number; size?: 'sm' | 'md' }) {
  return (
    <span className={cn('inline-flex items-center', size === 'sm' ? 'gap-[3px]' : 'gap-1.5')} aria-label={`Heat level ${level} of 5`}>
      {[1, 2, 3, 4, 5].map((dot) => (
        <span
          className={cn(
            'rounded-full',
            size === 'sm' ? 'h-2 w-2' : 'h-4 w-4 border-2',
            dot <= level
              ? size === 'sm'
                ? 'bg-[var(--terracotta)]'
                : 'border-[var(--terracotta)] bg-[var(--terracotta)]'
              : size === 'sm'
                ? 'bg-[#e8e1d3]'
                : 'border-[#d6cdbb] bg-white',
          )}
          key={dot}
        />
      ))}
    </span>
  )
}

function ActionButton({
  children,
  icon,
  onClick,
  to,
  tone = 'secondary',
}: {
  children: ReactNode
  icon?: ReactNode
  onClick?: () => void
  to?: string
  tone?: 'primary' | 'secondary' | 'ghost'
}) {
  const className = cn(
    'inline-flex h-11 items-center justify-center gap-2 rounded-[16px] border px-5 text-sm font-semibold transition',
    tone === 'primary'
      ? 'border-[var(--terracotta)] bg-[var(--terracotta)] text-white hover:bg-[var(--terracotta-dark)]'
      : tone === 'ghost'
        ? 'border-transparent bg-transparent text-[var(--terracotta)] hover:bg-[#fbe4dc]'
        : 'border-[#d6cdbb] bg-white text-[#2a2420] hover:bg-[#fbf8f3]',
  )

  if (to) {
    return (
      <Link className={className} to={to}>
        {icon}
        {children}
      </Link>
    )
  }

  return (
    <button className={className} onClick={onClick} type="button">
      {icon}
      {children}
    </button>
  )
}

function GuidanceItem({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return (
    <div className="rounded-[10px] border border-[#eadfce] bg-[#fbf8f3] px-4 py-3">
      <div className="grid grid-cols-[32px_minmax(0,1fr)] gap-3">
        <span className="text-[12px] font-semibold text-[var(--terracotta)]">{number}</span>
        <div>
          <h3 className="text-sm font-semibold text-[var(--ink)]">{title}</h3>
          <p className="mt-1 text-[12px] leading-5 text-[#6b6359]">{children}</p>
        </div>
      </div>
    </div>
  )
}

function RelatedPepperCard({ pepper, onCompare }: { pepper: Pepper; onCompare: () => void }) {
  const meta = heatMeta(pepper)
  const tag =
    pepper.id === 'poblano'
      ? 'Beginner-friendly'
      : pepper.id === 'jalapeno'
        ? 'Popular comparison'
        : 'Strong heat'

  return (
    <article className="overflow-hidden rounded-[10px] border border-[#e8e1d3] bg-white">
      <img alt={`${displayName(pepper)} pepper`} className="h-[140px] w-full object-cover" src={pepperImages[pepper.id]} />
      <div className="grid gap-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-[var(--ink)]">{displayName(pepper)}</h3>
            <p className="text-[11px] text-[#6b6359]">{meta.label} · {meta.level} / 5</p>
          </div>
          <span className={cn('rounded-full px-2 py-1 text-[10px] font-semibold', pepper.id === 'habanero' ? 'bg-[#fbe4dc] text-[var(--terracotta)]' : 'bg-[#e2eee3] text-[#4e8a5a]')}>
            {tag}
          </span>
        </div>
        <HeatDots level={meta.level} size="sm" />
        <div className="grid grid-cols-2 gap-2">
          <Link className="inline-flex h-8 items-center justify-center rounded-[10px] border border-[#d6cdbb] text-[12px] font-semibold text-[#2a2420]" to={`/peppers/${pepper.id}`}>
            View
          </Link>
          <button className="inline-flex h-8 items-center justify-center rounded-[10px] border border-[#d6cdbb] text-[12px] font-semibold text-[#2a2420]" onClick={onCompare} type="button">
            Compare
          </button>
        </div>
      </div>
    </article>
  )
}

export function PepperDetailPage() {
  const { pepperId } = useParams()
  const { visit, toggleSavePepper, toggleComparePepper, setActiveStop } = useVisit()
  const navigate = useNavigate()
  const pepper = getPepper(pepperId ?? 'sweet-pepper')
  const name = displayName(pepper)
  const meta = heatMeta(pepper)
  const saved = visit.savedPepperIds.includes(pepper.id)
  const compared = visit.comparedPepperIds.includes(pepper.id)
  const locationStopId = pepper.id === 'sweet-pepper' ? 'tasting-gh-1-2' : pepper.routeStopId
  const stop = getStop(locationStopId)
  const savedCount = visit.savedPepperIds.length || 2
  const compareCount = Math.max(visit.comparedPepperIds.length, compared ? 1 : 0)

  const saveLabel = 'Save Pepper'
  const compareLabel = compared ? 'In Compare' : 'Add to Compare'

  function openStop() {
    setActiveStop(stop.id)
    navigate(`/stops/${stop.id}`)
  }

  function addCompareAndMaybeOpen(open = false) {
    if (!compared) toggleComparePepper(pepper.id)
    if (open) navigate('/compare')
  }

  return (
    <PageShell className="py-8 md:py-8">
      <div className="mb-5 flex items-center gap-2 text-[13px] font-medium">
        <Link className="text-[var(--terracotta)] hover:underline" to="/catalog">Peppers</Link>
        <ChevronRight size={14} className="text-[#9a8e7d]" />
        <span className="text-[var(--ink)]">{name}</span>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,848px)_320px] xl:items-start">
        <div className="min-w-0 space-y-6">
          <Card>
            <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
              <div className="overflow-hidden rounded-[12px] bg-[#f2ede4]">
                <img alt={`${name} pepper`} className="h-[364px] w-full object-cover" src={pepper.id === 'sweet-pepper' ? pepperDetailFallback : pepperImages[pepper.id]} />
              </div>
              <div className="flex flex-col justify-between gap-5">
                <div>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <SectionLabel>Pepper variety</SectionLabel>
                      <h1 className="mt-1 text-[32px] font-semibold leading-10 text-[var(--ink)]">{name}</h1>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-[10px] bg-[#fbefcf] px-3 py-1.5 text-[12px] font-medium text-[#3a2e12]">Tasting point</span>
                      <span className="rounded-[10px] bg-[#e2eee3] px-3 py-1.5 text-[12px] font-medium text-[#4e8a5a]">On your route</span>
                    </div>
                  </div>
                  <p className="mt-4 max-w-[494px] text-[15px] leading-6 text-[#6b6359]">
                    {pepper.id === 'sweet-pepper'
                      ? 'Long sweet pepper with mild flavor, bright color, and beginner-friendly tasting.'
                      : pepper.caution}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Chip active>{meta.label}</Chip>
                    <Chip>Beginner-friendly</Chip>
                    <Chip>Available for tasting</Chip>
                    <Chip>On your route</Chip>
                    <Chip>Family-friendly</Chip>
                  </div>
                </div>
                <div className="rounded-[12px] bg-[#e2eee3]">
                  <div className="flex gap-4 border-l-4 border-[#4e8a5a] px-4 py-3 text-sm leading-5 text-[var(--ink)]">
                    <Sparkles size={16} className="mt-0.5 shrink-0 text-[#4e8a5a]" />
                    <p>A safe choice if you prefer mild flavor or are tasting peppers for the first time.</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <ActionButton icon={<Heart size={16} fill={saved ? 'currentColor' : 'none'} />} onClick={() => toggleSavePepper(pepper.id)} tone="primary">
                    {saveLabel}
                  </ActionButton>
                  <ActionButton icon={<GitCompare size={16} />} onClick={() => addCompareAndMaybeOpen()}>
                    {compareLabel}
                  </ActionButton>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <SectionLabel>Safety and spice</SectionLabel>
                <h2 className="mt-1 text-2xl font-semibold text-[var(--ink)]">Heat level</h2>
              </div>
              <div className="inline-flex h-[57px] items-center gap-2 rounded-[12px] bg-[#f2ede4] px-4">
                <span className="text-[22px] font-semibold text-[var(--ink)]">{meta.level}</span>
                <span className="text-[15px] text-[#6b6359]">/ 5</span>
                <span className="text-[15px] font-medium text-[#4e8a5a]">{meta.label}</span>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <HeatDots level={meta.level} />
                <span className="text-sm font-medium text-[var(--ink)]">{meta.label} · {meta.level} / 5</span>
              </div>
              <div className="grid grid-cols-5 text-[11px] text-[#8a7a63]">
                {['Mild', 'Low', 'Medium', 'Hot', 'Very hot'].map((label) => <span key={label}>{label}</span>)}
              </div>
              <p className="text-sm text-[#6b6359]">
                {pepper.id === 'sweet-pepper' ? 'This pepper is sweet and not considered spicy.' : pepper.caution}
              </p>
              <div className="grid gap-2 md:grid-cols-3">
                {['Good for beginners', 'Suitable for family tasting', 'No strong heat warning'].map((item) => (
                  <div className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] bg-[#e2eee3] px-3 text-sm font-medium text-[#4e8a5a]" key={item}>
                    <CheckCircle2 size={14} />
                    {item}
                  </div>
                ))}
              </div>
              <p className="text-[12px] italic text-[#8a7a63]">Note: Heat can vary slightly by pepper and preparation.</p>
            </div>
          </Card>

          <Card>
            <SectionLabel>Tasting guidance</SectionLabel>
            <h2 className="mt-1 text-2xl font-semibold text-[var(--ink)]">What to notice</h2>
            <div className="mt-5 grid gap-3">
              <GuidanceItem number="01" title="Sweet, crisp flavor">Notice the clean, fruity sweetness without any heat.</GuidanceItem>
              <GuidanceItem number="02" title="Long shape and bright color">The distinctive elongated shape and vivid red make it easy to identify.</GuidanceItem>
              <GuidanceItem number="03" title="Useful for comparing sweet vs. hot varieties">Use this as your baseline before moving to hotter peppers.</GuidanceItem>
            </div>
            <div className="mt-4 inline-flex w-full items-center gap-2 rounded-[8px] bg-[#dde9f0] px-4 py-2 text-[13px] text-[#3d6e8c]">
              <Info size={14} />
              Tasting tip: Start here before moving to hotter peppers.
            </div>
          </Card>

          <Card>
            <SectionLabel>Farm location</SectionLabel>
            <h2 className="mt-1 text-2xl font-semibold text-[var(--ink)]">Where to find it</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
              <div className="relative h-[150px] overflow-hidden rounded-[12px] bg-[#e2eee3]">
                <div className="absolute left-7 top-24 h-2 w-2 rounded-full bg-[#b8d6a8]" />
                <div className="absolute left-24 top-12 h-2 w-2 rounded-full bg-[#b8d6a8]" />
                <div className="absolute left-40 top-22 h-2 w-2 rounded-full bg-[#b8d6a8]" />
                <div className="absolute left-10 top-[96px] h-0.5 w-[132px] -rotate-[30deg] bg-[#b8d6a8]" />
                <div className="absolute left-[92px] top-[62px] flex h-9 w-9 items-center justify-center rounded-full bg-[var(--terracotta)] text-white shadow-md">
                  <MapPin size={16} fill="currentColor" />
                </div>
                <p className="absolute bottom-3 left-3 text-[12px] font-semibold text-[#6b6359]">Farm map</p>
              </div>
              <div className="grid gap-3">
                <div className="rounded-[10px] border border-[#eadfce] bg-[#fbf8f3] px-4 py-3">
                  <p className="text-sm font-semibold text-[var(--ink)]">Mild Tasting Table</p>
                  <p className="mt-1 text-[12px] text-[#6b6359]">3 min from your current stop</p>
                </div>
                <div className="rounded-[10px] border border-[#eadfce] bg-[#fbf8f3] px-4 py-3">
                  <p className="text-sm font-semibold text-[var(--ink)]">Sweet Pepper Greenhouse</p>
                  <p className="mt-1 text-[12px] text-[#6b6359]">Also shown near this area</p>
                </div>
                <div className="rounded-[8px] bg-[#e2eee3] px-4 py-2 text-[12px] font-medium text-[#4e8a5a]">
                  Already included in your current route
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <ActionButton icon={<Map size={16} />} to="/map">Open on Map</ActionButton>
              <button className="inline-flex items-center gap-1 text-[13px] font-medium text-[var(--terracotta)]" onClick={openStop} type="button">
                Add this stop to my route
              </button>
            </div>
          </Card>

          <Card>
            <SectionLabel>Actions</SectionLabel>
            <h2 className="mt-1 text-2xl font-semibold text-[var(--ink)]">Save and compare</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#e2eee3] px-3 py-1.5 text-[12px] font-medium text-[#4e8a5a]">Saved peppers: {savedCount}</span>
              <span className="rounded-full bg-[#dde9f0] px-3 py-1.5 text-[12px] font-medium text-[#3d6e8c]">Compare: {compareCount || 1} selected</span>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <ActionButton onClick={() => toggleSavePepper(pepper.id)} tone="primary">{saveLabel}</ActionButton>
              <ActionButton onClick={() => addCompareAndMaybeOpen()}>{compareLabel}</ActionButton>
              <ActionButton to="/compare">Open Compare</ActionButton>
              <ActionButton icon={<ArrowLeft size={14} />} to="/catalog" tone="ghost">Back to Catalog</ActionButton>
            </div>
          </Card>

          <Card>
            <SectionLabel>Optional reading</SectionLabel>
            <h2 className="mt-1 text-2xl font-semibold text-[var(--ink)]">Learn more</h2>
            <p className="mt-2 text-sm text-[#6b6359]">Expand any section for deeper information. All sections are optional.</p>
            <div className="mt-5 divide-y divide-[#eadfce] rounded-[10px] border border-[#eadfce]">
              {['Origin and background', 'How it differs from hot peppers', 'Growing notes', 'Best comparison'].map((item) => (
                <button className="flex h-12 w-full items-center justify-between px-4 text-left text-sm font-medium text-[var(--ink)]" key={item} type="button">
                  {item}
                  <ChevronDown size={14} className="text-[#8a7a63]" />
                </button>
              ))}
            </div>
          </Card>

          <section>
            <SectionLabel>Comparison</SectionLabel>
            <h2 className="mt-1 text-2xl font-semibold text-[var(--ink)]">Compare with similar peppers</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {relatedIds.map((id) => {
                const relatedPepper = getPepper(id)
                return (
                  <RelatedPepperCard
                    key={id}
                    onCompare={() => {
                      if (!visit.comparedPepperIds.includes(id)) toggleComparePepper(id)
                    }}
                    pepper={relatedPepper}
                  />
                )
              })}
            </div>
          </section>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-24">
          <Card className="p-0">
            <div className="space-y-4 p-4">
              <div className="rounded-[12px] bg-[#e2eee3] p-4">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-[#2f5d54]">
                  <Sparkles size={15} />
                  Fit for your visit
                </h2>
                <p className="mt-1 text-[12px] text-[#4e7269]">Personalized match</p>
              </div>
              <div className="rounded-[12px] bg-[#e2eee3] p-4">
                <p className="flex items-center gap-2 text-base font-semibold text-[#4e8a5a]">
                  <CheckCircle2 size={18} />
                  Good match
                </p>
                <p className="mt-1 text-[12px] text-[#4e7269]">High fit for your preferences</p>
              </div>
              <div>
                <h3 className="text-[12px] font-semibold uppercase tracking-normal text-[var(--terracotta)]">Why recommended</h3>
                <p className="mt-2 text-[13px] leading-5 text-[#6b6359]">
                  Recommended because you selected mild tasting, family mode, and beginner-friendly options.
                </p>
                <ul className="mt-3 grid gap-2 text-[12px] text-[#4e8a5a]">
                  {['Matches your spice comfort', 'Available near your current route', 'Good first tasting choice', 'Useful for comparing with hotter peppers'].map((item) => (
                    <li className="flex items-center gap-2" key={item}>
                      <CheckCircle2 size={13} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[8px] bg-[#f8ede8] p-3 text-[12px] leading-5 text-[#8a604f]">
                This is a suggestion, not a required stop. Manual browsing is always available.
              </div>
              <div className="grid gap-2">
                <ActionButton icon={<Route size={16} />} onClick={openStop} tone="primary">Open Stop on Route</ActionButton>
                <ActionButton icon={<Map size={15} />} to="/map">Open on Map</ActionButton>
                <ActionButton onClick={() => addCompareAndMaybeOpen()}>Add to Compare</ActionButton>
                <ActionButton onClick={() => toggleSavePepper(pepper.id)}>{saveLabel}</ActionButton>
                <ActionButton icon={<ArrowLeft size={14} />} to="/catalog" tone="ghost">Back to Catalog</ActionButton>
              </div>
            </div>
          </Card>

          <Card>
            <SectionLabel>Quick reference</SectionLabel>
            <div className="mt-4 grid gap-2">
              {[
                { label: name, level: meta.level, current: true },
                { label: 'Poblano', level: 1 },
                { label: 'Jalapeño', level: 2 },
                { label: 'Habanero', level: 5 },
              ].map((item) => (
                <div className={cn('flex items-center justify-between rounded-[10px] px-3 py-2', item.current ? 'bg-[#e2eee3]' : 'bg-[#fbf8f3]')} key={item.label}>
                  <div className="flex min-w-0 items-center gap-2">
                    <span className={cn('truncate text-[13px] font-medium', item.current ? 'text-[#4e8a5a]' : 'text-[#6b6359]')}>{item.label}</span>
                    {item.current ? <span className="rounded-full bg-[#3e7f74] px-2 py-0.5 text-[10px] text-white">This pepper</span> : null}
                  </div>
                  <HeatDots level={item.level} size="sm" />
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </PageShell>
  )
}
