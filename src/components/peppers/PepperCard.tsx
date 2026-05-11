import { CheckCircle2, ChevronRight, GitCompare, Heart, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { pepperImages } from '../../data/pepperImages'
import type { Pepper } from '../../types/domain'
import { cn } from '../../utils/cn'
import { useMapOverlay } from '../map/useMapOverlay'

const routeLabels: Record<string, string> = {
  'lemon-drop': 'Greenhouse Route · Bay 4',
  jalapeno: 'Tasting GH 1–2 · Stop 4',
  habanero: 'Tasting GH 3–4 · Optional',
  'sweet-pepper': 'Visitor Center · Stop 1',
  poblano: 'Greenhouse Route · Bay 6',
  cayenne: 'Product Shop · Stop 5',
}

function getHeatMeta(pepper: Pepper) {
  if (pepper.heatLevel >= 5) return { label: 'Very Hot', icon: '🔥', tone: 'red' as const, activeDots: 5 }
  if (pepper.heatLevel >= 4) return { label: 'Hot', icon: '🔴', tone: 'red' as const, activeDots: 4 }
  if (pepper.heatLevel >= 3) return { label: 'Medium', icon: '🟡', tone: 'gold' as const, activeDots: 3 }
  return { label: 'Mild', icon: '🌿', tone: 'green' as const, activeDots: Math.max(1, pepper.heatLevel) }
}

function tagTone(tag: string) {
  if (tag.toLowerCase().includes('caution') || tag.toLowerCase().includes('carefully') || tag.toLowerCase().includes('advanced')) {
    return 'border-[#f0b3a8] bg-[#fff0eb] text-[#a33b27]'
  }
  if (tag.toLowerCase().includes('available') || tag.toLowerCase().includes('beginner') || tag.toLowerCase().includes('family') || tag.toLowerCase().includes('learning')) {
    return 'border-[#cfdfbd] bg-[#eef6e5] text-[#55743a]'
  }
  return 'border-[#e4d8c7] bg-[#fbf8f3] text-[#6b6359]'
}

export function PepperCard({
  pepper,
  saved,
  compared,
  onSave,
  onCompare,
  compareDisabled = false,
}: {
  pepper: Pepper
  saved: boolean
  compared: boolean
  onSave: () => void
  onCompare: () => void
  compareDisabled?: boolean
}) {
  const { openMap } = useMapOverlay()
  const heat = getHeatMeta(pepper)
  const heatTone =
    heat.tone === 'red'
      ? 'border-[#f3b0a5] bg-[#ffe8e2] text-[#b3341f]'
      : heat.tone === 'gold'
        ? 'border-[#ead8a7] bg-[#fff5cf] text-[#8a691a]'
        : 'border-[#b8d8c8] bg-[#e1efeb] text-[#3e7f74]'

  return (
    <article className="h-full overflow-hidden rounded-[8px] border border-[#e8e1d3] bg-white shadow-[0_10px_26px_rgba(74,51,29,0.08)]">
      <div className="relative h-[148px] overflow-hidden bg-[#f4f0e8]">
        <img alt={`${pepper.name} pepper`} className="h-full w-full object-cover" src={pepperImages[pepper.id]} />
      </div>

      <div className="grid gap-3 p-3.5">
        <div>
          <h3 className="text-base font-semibold leading-5 text-[var(--ink)]">{pepper.name}</h3>
          <div className="mt-1 flex items-center gap-1.5 text-[12px] text-[#7f7162]">
            <span>{pepper.origin}</span>
            <span>·</span>
            <span className="flex gap-1">
              {['#f6d44f', '#66a650', '#c04a2b'].map((color) => (
                <span className="h-1.5 w-1.5 rounded-full" key={color} style={{ backgroundColor: color }} />
              ))}
            </span>
          </div>
        </div>

        <p className="min-h-[38px] text-[13px] leading-5 text-[#6b6359]">
          {pepper.id === 'lemon-drop'
            ? 'Citrusy Peruvian chili with fruity sharpness and medium heat.'
            : pepper.id === 'jalapeno'
              ? 'Classic Mexican pepper — familiar, fresh, and mild spice.'
              : pepper.id === 'habanero'
                ? 'Fruity and intensely hot. Advanced visitors only.'
                : pepper.id === 'sweet-pepper'
                  ? 'Crisp, sweet, and safe for everyone — a farm classic.'
                  : pepper.id === 'poblano'
                    ? 'Mild and earthy — great for comparing with hotter varieties.'
                    : 'Sharp, dry heat — commonly dried and used as powder.'}
        </p>

        <div className={cn('flex min-h-7 items-center justify-between rounded-full border px-3 text-[12px]', heatTone)}>
          <span className="font-semibold">
            {heat.icon} {heat.label}
          </span>
          <span>{pepper.shuRange}</span>
          <span className="flex gap-1">
            {[1, 2, 3, 4, 5].map((dot) => (
              <span
                className={cn('h-1.5 w-1.5 rounded-full', dot <= heat.activeDots ? 'bg-current' : 'bg-[#e6ded1]')}
                key={dot}
              />
            ))}
          </span>
        </div>

        <div className="flex min-h-[50px] flex-wrap content-start gap-1.5">
          {[...pepper.flavorTags, ...pepper.suitabilityTags].slice(0, pepper.id === 'sweet-pepper' ? 6 : 5).map((tag) => (
            <span className={cn('rounded-full border px-2 py-1 text-[11px] font-medium leading-none', tagTone(tag))} key={tag}>
              {tag}
            </span>
          ))}
        </div>

        <div className="grid gap-1.5 text-[12px]">
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#cddfc7] bg-[#f2f8ec] px-2 py-1 text-[#55743a]">
            <CheckCircle2 size={12} />
            {pepper.tastingStatus.includes('Available') ? pepper.tastingStatus : 'Available for tasting'}
          </div>
          <div className="flex items-center justify-between gap-2 rounded-md border border-[#eadfce] bg-[#fbf8f3] px-2 py-1.5 text-[#6f6357]">
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <MapPin size={12} className="shrink-0" />
              <span className="truncate">{routeLabels[pepper.id]}</span>
            </span>
            <button
              className="shrink-0 text-[11px] font-semibold text-[var(--terracotta)] hover:underline"
              onClick={() => openMap(pepper.routeStopId)}
              type="button"
            >
              Map <ChevronRight size={10} className="inline" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-2 pt-1">
          <Link
            className="inline-flex h-9 items-center justify-center rounded-md bg-[var(--terracotta)] px-3 text-[12px] font-semibold text-white transition hover:bg-[var(--terracotta-dark)]"
            to={`/peppers/${pepper.id}`}
          >
            View Details
          </Link>
          <button
            className={cn(
              'inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-[12px] font-semibold transition',
              saved
                ? 'border-[#f0b7a8] bg-[#fff0eb] text-[var(--terracotta)]'
                : 'border-[#e4d8c7] bg-white text-[#6b6359] hover:bg-[#fbf8f3]',
            )}
            onClick={onSave}
            type="button"
          >
            <Heart size={13} fill={saved ? 'currentColor' : 'none'} />
            {saved ? 'Saved' : 'My Visit'}
          </button>
          <button
            aria-label={`${compared ? 'Remove' : 'Compare'} ${pepper.name}`}
            aria-pressed={compared}
            className={cn(
              'inline-flex h-9 w-9 items-center justify-center rounded-md border text-[#6b6359] transition',
              compared
                ? 'border-[#f0b7a8] bg-[#fff0eb] text-[var(--terracotta)]'
                : 'border-[#e4d8c7] bg-white hover:bg-[#fbf8f3]',
            )}
            disabled={compareDisabled}
            onClick={onCompare}
            type="button"
          >
            <GitCompare size={14} />
          </button>
        </div>
      </div>
    </article>
  )
}
