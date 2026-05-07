import type { ReactNode } from 'react'
import type { Pepper } from '../../types/domain'
import { PepperHeatScale } from './PepperHeatScale'

const rows: Array<{ label: string; render: (pepper: Pepper) => ReactNode }> = [
  { label: 'Heat / SHU', render: (pepper) => <div className="space-y-2"><PepperHeatScale level={pepper.heatLevel} /><span>{pepper.shuRange}</span></div> },
  { label: 'Origin', render: (pepper) => pepper.origin },
  { label: 'Color', render: (pepper) => pepper.color },
  { label: 'Flavor', render: (pepper) => pepper.flavorTags.join(', ') },
  { label: 'Suitability', render: (pepper) => pepper.suitabilityTags.join(', ') },
  { label: 'Caution', render: (pepper) => pepper.caution },
  { label: 'Where to find it', render: (pepper) => pepper.tastingStatus },
]

export function PepperCompareTable({ peppers }: { peppers: Pepper[] }) {
  return (
    <div className="soft-card overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse text-left">
        <thead>
          <tr className="border-b border-[var(--soft-border)] bg-[var(--cream-100)]">
            <th className="w-40 px-4 py-4 text-sm font-semibold text-[var(--muted)]">Attribute</th>
            {peppers.map((pepper) => (
              <th className="px-4 py-4 text-lg font-semibold text-[var(--ink)]" key={pepper.id}>{pepper.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr className="border-b border-[var(--soft-border)] last:border-b-0" key={row.label}>
              <td className="px-4 py-4 text-sm font-semibold text-[var(--muted)]">{row.label}</td>
              {peppers.map((pepper) => (
                <td className="px-4 py-4 text-sm leading-6 text-[var(--ink)]" key={pepper.id}>{row.render(pepper)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
