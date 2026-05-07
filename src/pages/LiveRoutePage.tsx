import { LiveRouteFigmaPanels } from '../components/route/LiveRouteFigmaPanels'
import { PageShell } from '../components/layout/PageShell'

export function LiveRoutePage() {
  return (
    <PageShell className="py-8 md:py-9">
      <div className="mx-auto max-w-[1216px]">
        <LiveRouteFigmaPanels />
      </div>
    </PageShell>
  )
}
