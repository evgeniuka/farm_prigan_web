import {
  Accessibility,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Compass,
  Eye,
  Globe2,
  HelpCircle,
  Info,
  LifeBuoy,
  ListChecks,
  Map,
  MapPin,
  ShieldCheck,
  Volume2,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageShell } from '../components/layout/PageShell'
import { useVisit } from '../hooks/useVisit'
import type { LanguageCode } from '../types/domain'
import { cn } from '../utils/cn'

type Language = LanguageCode
type TextSize = 'Small' | 'Medium' | 'Large'

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="text-[11px] font-semibold uppercase tracking-[0.02em] text-[var(--terracotta)]">{children}</p>
}

function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn('rounded-2xl border border-[var(--soft-border)] bg-white p-5 shadow-[0_12px_32px_rgba(74,51,29,0.05)]', className)}>{children}</section>
}

function IconTile({ children, tone = 'blue' }: { children: ReactNode; tone?: 'blue' | 'cream' | 'green' | 'red' }) {
  const classes = {
    blue: 'bg-[#eaf4f8] text-[#3d6e8c]',
    cream: 'bg-[var(--cream-100)] text-[#8a7a63]',
    green: 'bg-[#e1efeb] text-[#317267]',
    red: 'bg-[#fbe4dc] text-[var(--terracotta)]',
  }[tone]

  return <span className={cn('inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', classes)}>{children}</span>
}

function PrimaryButton({ children, onClick, to }: { children: ReactNode; onClick?: () => void; to?: string }) {
  const className = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[var(--terracotta)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--terracotta-dark)]'

  if (to) {
    return (
      <Link className={className} to={to}>
        {children}
      </Link>
    )
  }

  return (
    <button className={className} onClick={onClick} type="button">
      {children}
    </button>
  )
}

function SecondaryButton({ children, onClick, to }: { children: ReactNode; onClick?: () => void; to?: string }) {
  const className =
    'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[var(--soft-border)] bg-white px-4 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--cream-100)]'

  if (to) {
    return (
      <Link className={className} to={to}>
        {children}
      </Link>
    )
  }

  return (
    <button className={className} onClick={onClick} type="button">
      {children}
    </button>
  )
}

function Toggle({ enabled, label, onChange }: { enabled: boolean; label: string; onChange: () => void }) {
  return (
    <button
      aria-pressed={enabled}
      className={cn(
        'relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition',
        enabled ? 'border-[var(--terracotta)] bg-[var(--terracotta)]' : 'border-[#d8cfbd] bg-[#d8cfbd]',
      )}
      onClick={onChange}
      type="button"
    >
      <span className="sr-only">{label}</span>
      <span className={cn('absolute h-5 w-5 rounded-full bg-white shadow-sm transition', enabled ? 'left-[22px]' : 'left-1')} />
    </button>
  )
}

function SegmentedButton({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: ReactNode
  onClick: () => void
}) {
  return (
    <button
      className={cn(
        'inline-flex h-9 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-semibold transition',
        active ? 'bg-white text-[var(--ink)] shadow-[0_2px_8px_rgba(74,51,29,0.12)]' : 'text-[#7d705f] hover:bg-white/60',
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  )
}

function AccessibilityRow({ children, icon, label }: { children: ReactNode; icon: ReactNode; label: string }) {
  return (
    <div className="flex min-h-12 items-center justify-between gap-4">
      <div className="flex items-center gap-3 text-sm font-semibold text-[var(--ink)]">
        <span className="text-[#708a43]">{icon}</span>
        {label}
      </div>
      {children}
    </div>
  )
}

function AccessibilityControls({
  highContrast,
  language,
  readAloud,
  setHighContrast,
  setLanguage,
  setReadAloud,
  setTextSize,
  textSize,
}: {
  highContrast: boolean
  language: Language
  readAloud: boolean
  setHighContrast: (value: boolean) => void
  setLanguage: (value: Language) => void
  setReadAloud: (value: boolean) => void
  setTextSize: (value: TextSize) => void
  textSize: TextSize
}) {
  const textOptions: Array<{ label: TextSize; className: string }> = [
    { label: 'Small', className: 'text-sm' },
    { label: 'Medium', className: 'text-base' },
    { label: 'Large', className: 'text-xl' },
  ]

  return (
    <Card className="min-h-[328px] p-6">
      <AccessibilityRow icon={<Globe2 size={16} />} label="Language">
        <div className="inline-flex rounded-2xl bg-[#e9e2d3] p-1">
          {(['EN', 'HE', 'AR'] as Language[]).map((option) => (
            <SegmentedButton active={language === option} key={option} onClick={() => setLanguage(option)}>
              {option}
            </SegmentedButton>
          ))}
        </div>
      </AccessibilityRow>

      <AccessibilityRow icon={<ListChecks size={16} />} label="Text size">
        <div className="inline-flex rounded-2xl bg-[#e9e2d3] p-1">
          {textOptions.map((option) => (
            <SegmentedButton active={textSize === option.label} key={option.label} onClick={() => setTextSize(option.label)}>
              <span className={option.className}>A</span>
            </SegmentedButton>
          ))}
        </div>
      </AccessibilityRow>

      <AccessibilityRow icon={<Eye size={16} />} label="High contrast">
        <Toggle enabled={highContrast} label="High contrast" onChange={() => setHighContrast(!highContrast)} />
      </AccessibilityRow>

      <AccessibilityRow icon={<Volume2 size={16} />} label="Read aloud">
        <Toggle enabled={readAloud} label="Read aloud" onChange={() => setReadAloud(!readAloud)} />
      </AccessibilityRow>
    </Card>
  )
}

function SupportCards({ onFindStaff, onTryLocation, onUsePrintedMap, supportMessage }: { onFindStaff: () => void; onTryLocation: () => void; onUsePrintedMap: () => void; supportMessage: string }) {
  return (
    <div className="grid gap-4">
      <Card className="min-h-[156px]">
        <div className="flex items-start gap-4">
          <IconTile>
            <LifeBuoy size={18} />
          </IconTile>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-[var(--ink)]">Need help?</h2>
            <p className="mt-1 text-sm leading-6 text-[var(--muted)]">Staff are near the main barn and the tasting point. Look for the olive-green aprons.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <SecondaryButton onClick={onFindStaff}>Find nearest staff</SecondaryButton>
              <button className="inline-flex min-h-10 items-center rounded-xl px-2 text-sm font-semibold text-[var(--terracotta)] hover:bg-[#fff0eb]" onClick={onFindStaff} type="button">
                Contact info
              </button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="min-h-[156px] border-dashed">
        <div className="flex items-start gap-4">
          <IconTile tone="cream">
            <ShieldCheck size={18} />
          </IconTile>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-[var(--ink)]">Location services unavailable</h2>
            <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
              We can't detect where you are right now. You can still follow the route using stop numbers and the printed map at the entrance.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <PrimaryButton onClick={onTryLocation}>Try again</PrimaryButton>
              <SecondaryButton onClick={onUsePrintedMap}>Use printed map</SecondaryButton>
            </div>
          </div>
        </div>
      </Card>

      <div className="min-h-10 rounded-xl border border-[var(--soft-border)] bg-[#fffaf1] px-4 py-3 text-sm font-semibold text-[var(--muted)]">{supportMessage}</div>
    </div>
  )
}

function HelpOption({ children, icon, title, to }: { children: ReactNode; icon: ReactNode; title: string; to: string }) {
  return (
    <Link className="group rounded-2xl border border-[var(--soft-border)] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(74,51,29,0.08)]" to={to}>
      <div className="flex items-start justify-between gap-4">
        <IconTile tone="green">{icon}</IconTile>
        <ChevronRight className="mt-2 text-[var(--muted)] transition group-hover:text-[var(--terracotta)]" size={17} />
      </div>
      <h3 className="mt-4 text-base font-semibold text-[var(--ink)]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{children}</p>
    </Link>
  )
}

function QuestionRow({ children }: { children: ReactNode }) {
  return (
    <button className="flex w-full items-center justify-between gap-4 border-b border-[var(--soft-border)] px-5 py-4 text-left text-sm font-semibold text-[var(--ink)] last:border-b-0 hover:bg-[var(--cream-100)]" type="button">
      {children}
      <ChevronRight className="shrink-0 text-[var(--muted)]" size={16} />
    </button>
  )
}

function StickyPanel({
  highContrast,
  language,
  onManualMode,
  readAloud,
  textSize,
}: {
  highContrast: boolean
  language: Language
  onManualMode: () => void
  readAloud: boolean
  textSize: TextSize
}) {
  const settings = [
    ['Language', language],
    ['Text size', textSize],
    ['High contrast', highContrast ? 'On' : 'Off'],
    ['Read aloud', readAloud ? 'On' : 'Off'],
  ]

  return (
    <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
      <Card className="bg-[#f2ede4]">
        <SectionLabel>Current support state</SectionLabel>
        <h2 className="mt-1 text-base font-semibold text-[var(--ink)]">Help while walking</h2>
        <div className="mt-4 space-y-3">
          {settings.map(([label, value]) => (
            <div className="flex items-center justify-between gap-3 text-sm" key={label}>
              <span className="inline-flex items-center gap-2 text-[var(--muted)]">
                <CheckCircle2 size={14} />
                {label}
              </span>
              <span className="font-semibold text-[var(--ink)]">{value}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="grid gap-3">
          <PrimaryButton to="/map">
            <Map size={15} />
            Open Farm Map
          </PrimaryButton>
          <SecondaryButton to="/route">
            <ArrowRight size={15} />
            Continue Route
          </SecondaryButton>
          <SecondaryButton onClick={onManualMode}>
            <Compass size={15} />
            Choose Manually
          </SecondaryButton>
          <SecondaryButton to="/ai">
            <Info size={15} />
            How AI Works
          </SecondaryButton>
        </div>
        <p className="mt-4 text-xs leading-5 text-[var(--muted)]">Help settings are part of this prototype session only.</p>
      </Card>

      <div className="rounded-2xl border border-[#edd4a5] bg-[#fff2d6] p-4 text-sm leading-6 text-[#7f5b20]">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-1 shrink-0" size={16} />
          <p>For safety questions, follow farm signs and ask staff before entering any unclear area.</p>
        </div>
      </div>
    </aside>
  )
}

export function HelpPage() {
  const { chooseManual, setLanguage, visit } = useVisit()
  const navigate = useNavigate()
  const [textSize, setTextSize] = useState<TextSize>('Medium')
  const [highContrast, setHighContrast] = useState(true)
  const [readAloud, setReadAloud] = useState(false)
  const [supportMessage, setSupportMessage] = useState('Use route numbers, map labels, and staff help if location is unclear.')

  const switchToManualMode = () => {
    chooseManual()
    navigate('/map')
  }

  const findStaff = () => {
    setSupportMessage('Nearest staff: main barn desk or the mild tasting point. Look for olive-green aprons.')
  }

  const tryLocation = () => {
    setSupportMessage('Location still unavailable in this prototype. Use the printed map or open the schematic farm map.')
  }

  const usePrintedMap = () => {
    setSupportMessage('Printed map mode selected. Follow stop numbers and the visitor route labels.')
    navigate('/map')
  }

  return (
    <PageShell className="py-8 md:py-10">
      <div className="mx-auto max-w-[1200px]">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[var(--muted)]">
          <Link className="hover:text-[var(--ink)]" to="/route">Route</Link>
          <ChevronRight size={13} />
          <span className="font-semibold text-[var(--ink)]">Help / Accessibility</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,848px)_320px]">
          <main className="space-y-8">
            <section>
              <SectionLabel>11 · Accessibility &amp; support</SectionLabel>
              <h1 className="mt-2 text-[32px] font-semibold leading-tight text-[var(--ink)]">Inclusive by default</h1>
              <p className="mt-2 max-w-[620px] text-base leading-7 text-[var(--muted)]">Language, text size, contrast, clear focus states, and graceful fallbacks.</p>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
              <AccessibilityControls
                highContrast={highContrast}
                language={visit.selectedLanguage}
                readAloud={readAloud}
                setHighContrast={setHighContrast}
                setLanguage={setLanguage}
                setReadAloud={setReadAloud}
                setTextSize={setTextSize}
                textSize={textSize}
              />
              <SupportCards onFindStaff={findStaff} onTryLocation={tryLocation} onUsePrintedMap={usePrintedMap} supportMessage={supportMessage} />
            </section>

            <section>
              <SectionLabel>Support paths</SectionLabel>
              <h2 className="mt-1 text-2xl font-semibold text-[var(--ink)]">Choose another way to continue</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <HelpOption icon={<MapPin size={18} />} title="Use the map" to="/map">
                  Follow the same route with stop numbers, labels, and staff-only areas visible.
                </HelpOption>
                <HelpOption icon={<Compass size={18} />} title="Manual mode" to="/map">
                  Browse stops in any order while keeping saved peppers and route progress.
                </HelpOption>
                <HelpOption icon={<HelpCircle size={18} />} title="AI transparency" to="/ai">
                  See what the route assistant uses and how to override every suggestion.
                </HelpOption>
              </div>
            </section>

            <Card>
              <div className="flex items-start gap-4">
                <IconTile tone="red">
                  <Accessibility size={18} />
                </IconTile>
                <div>
                  <SectionLabel>Readable interface</SectionLabel>
                  <h2 className="mt-1 text-xl font-semibold text-[var(--ink)]">Designed for walking, not studying the screen</h2>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                    The prototype keeps visible status, short labels, one main action per screen, keyboard-accessible buttons, and clear fallbacks when location or AI suggestions are not useful.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-0">
              <div className="border-b border-[var(--soft-border)] px-5 py-4">
                <SectionLabel>Common help</SectionLabel>
                <h2 className="mt-1 text-xl font-semibold text-[var(--ink)]">Quick questions</h2>
              </div>
              <QuestionRow>How do I make text easier to read?</QuestionRow>
              <QuestionRow>What should I do if location is unavailable?</QuestionRow>
              <QuestionRow>Can I stop using the recommended route?</QuestionRow>
              <QuestionRow>Where can I ask farm staff for help?</QuestionRow>
            </Card>

            <div className="flex items-start gap-3 rounded-2xl border border-[var(--soft-border)] bg-[#fbf6ec] px-5 py-4 text-sm leading-6 text-[var(--muted)]">
              <Info className="mt-1 shrink-0 text-[#d98a2b]" size={16} />
              <p>
                This prototype does not require registration. Visit settings are used for this session, including route progress, saved peppers, compare items, accessibility controls, and optional classroom demo analytics when enabled.
              </p>
            </div>
          </main>

          <StickyPanel highContrast={highContrast} language={visit.selectedLanguage} onManualMode={switchToManualMode} readAloud={readAloud} textSize={textSize} />
        </div>
      </div>
    </PageShell>
  )
}
