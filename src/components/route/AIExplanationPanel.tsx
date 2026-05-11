import { Sparkles } from 'lucide-react'
import { buildAdaptiveRoute } from '../../data/adaptiveRoute'
import { useVisit } from '../../hooks/useVisit'
import { StatusPill } from '../ui/StatusPill'

export function AIExplanationPanel() {
  const { visit } = useVisit()
  const route = buildAdaptiveRoute(visit)
  return (
    <section className="quiet-panel p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-[#fff1ed] p-2 text-[var(--terracotta)]">
            <Sparkles size={18} />
          </span>
          <div>
            <h2 className="font-semibold text-[var(--ink)]">Why this route?</h2>
            <p className="text-sm text-[var(--muted)]">A narrow recommendation, not an autopilot.</p>
          </div>
        </div>
        <StatusPill tone="green">{route.fitLevel}</StatusPill>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <StatusPill tone="cream">{visit.selectedDuration}</StatusPill>
        <StatusPill tone="cream">{visit.selectedSpiceLevel}</StatusPill>
        <StatusPill tone="cream">{visit.selectedMode}</StatusPill>
      </div>
      <ul className="space-y-2 text-sm leading-6 text-[var(--muted)]">
        {route.recommendedBecause.map((reason) => (
          <li className="flex gap-2" key={reason}>
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--green)]" />
            <span>{reason}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
