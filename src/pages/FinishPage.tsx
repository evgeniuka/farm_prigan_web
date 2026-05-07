import { CheckCircle2, Heart, RotateCcw } from 'lucide-react'
import { Button, ButtonLink } from '../components/ui/Button'
import { InfoCard } from '../components/ui/InfoCard'
import { PageTitle } from '../components/ui/PageTitle'
import { MyVisitSummary } from '../components/visit/MyVisitSummary'
import { peppers } from '../data/peppers'
import { useVisit } from '../hooks/useVisit'
import { PageShell } from '../components/layout/PageShell'

export function FinishPage() {
  const { visit, resetVisit } = useVisit()
  const saved = peppers.filter((pepper) => visit.savedPepperIds.includes(pepper.id))

  return (
    <PageShell>
      <PageTitle eyebrow="Finish Visit" title="Visit completed">
        This state gives the usability test a clear ending without adding real accounts, backend, or analytics.
      </PageTitle>
      <div className="space-y-6">
        <div className="panel p-8 text-center">
          <CheckCircle2 className="mx-auto text-[var(--green)]" size={48} />
          <h2 className="mt-4 text-3xl font-semibold text-[var(--ink)]">You completed the mild farm route</h2>
          <p className="mx-auto mt-3 max-w-2xl text-[var(--muted)]">
            You visited the greenhouse path, reviewed tasting guidance, and saved pepper notes for the product shop.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <ButtonLink to="/my-visit">Review My Visit</ButtonLink>
            <Button icon={<RotateCcw size={16} />} onClick={resetVisit} tone="secondary">Reset Demo</Button>
          </div>
        </div>
        <MyVisitSummary />
        <InfoCard icon={<Heart size={18} />} title="Saved pepper notes">
          {saved.length ? saved.map((pepper) => pepper.name).join(', ') : 'No saved peppers were added during this run.'}
        </InfoCard>
      </div>
    </PageShell>
  )
}
