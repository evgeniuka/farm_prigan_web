import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Compass,
  Edit3,
  Heart,
  HelpCircle,
  Info,
  ListChecks,
  Map,
  MapPin,
  Route,
  ShieldCheck,
  Shuffle,
  Sparkles,
  Sprout,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageShell } from '../components/layout/PageShell'
import { useVisit } from '../hooks/useVisit'
import { cn } from '../utils/cn'

function SectionCard({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn('rounded-2xl border border-[var(--soft-border)] bg-white p-6', className)}>{children}</section>
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="text-xs font-semibold uppercase text-[var(--terracotta)]">{children}</p>
}

function SectionHeader({ label, title, children }: { label: string; title: string; children?: ReactNode }) {
  return (
    <div>
      <SectionLabel>{label}</SectionLabel>
      <h2 className="mt-1 text-2xl font-semibold leading-tight text-[var(--ink)]">{title}</h2>
      {children ? <div className="mt-3 text-[15px] leading-6 text-[var(--muted)]">{children}</div> : null}
    </div>
  )
}

function Chip({ children, tone = 'cream' }: { children: ReactNode; tone?: 'cream' | 'red' | 'green' | 'blue' | 'gold' }) {
  const classes = {
    cream: 'border-[#d6cdbb] bg-white text-[var(--ink)]',
    red: 'border-[#efc2b4] bg-[#fbe4dc] text-[var(--terracotta)]',
    green: 'border-[#cfe5d9] bg-[#edf7ed] text-[#3e7f74]',
    blue: 'border-[#c8d8e2] bg-[#eaf4f8] text-[#3d6e8c]',
    gold: 'border-[#edd4a5] bg-[#fff2d6] text-[#9a661c]',
  }[tone]

  return <span className={cn('inline-flex min-h-7 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold', classes)}>{children}</span>
}

function TinyButton({ children, to, onClick, tone = 'secondary' }: { children: ReactNode; to?: string; onClick?: () => void; tone?: 'primary' | 'secondary' }) {
  const className = cn(
    'inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition',
    tone === 'primary'
      ? 'border-[var(--terracotta)] bg-[var(--terracotta)] text-white hover:bg-[var(--terracotta-dark)]'
      : 'border-[#d6cdbb] bg-white text-[var(--ink)] hover:bg-[var(--cream-100)]',
  )

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

function SuggestionCard({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <article className="rounded-2xl border border-[var(--soft-border)] bg-white p-6">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#fbe4dc] text-[var(--terracotta)]">{icon}</span>
      <h3 className="mt-4 text-base font-semibold text-[var(--ink)]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{children}</p>
    </article>
  )
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-[var(--soft-border)] bg-[linear-gradient(168deg,rgba(251,228,220,0.45),#fbf8f3_54%,rgba(225,239,235,0.35))] p-8">
      <div className="absolute -right-14 -top-16 h-48 w-48 rounded-full bg-[#fbe4dc] opacity-40" />
      <div className="relative">
        <SectionLabel>Help · AI transparency</SectionLabel>
        <h1 className="mt-2 text-[32px] font-semibold leading-tight text-[var(--ink)]">How AI Works</h1>
        <p className="mt-4 max-w-[580px] text-base leading-7 text-[var(--muted)]">
          Understand how Prigan Guide suggests routes and peppers, and how you stay in control.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Chip tone="red">Suggestions only</Chip>
          <Chip tone="red">Manual mode available</Chip>
          <Chip tone="red">No registration required</Chip>
          <Chip tone="red">You can override anytime</Chip>
        </div>
        <div className="mt-5 inline-flex max-w-full items-center gap-2 rounded-xl border border-[var(--soft-border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--ink)]">
          <Info className="shrink-0 text-[#d98a2b]" size={16} />
          <span>Prigan Guide helps you choose, but it does not decide for you.</span>
        </div>
      </div>
    </section>
  )
}

function WhatItDoesSection() {
  return (
    <section>
      <SectionHeader label="01 · What it does" title="What Prigan Guide suggests">
        Prigan Guide makes suggestions based on your preferences. These are not instructions. You can always choose differently.
      </SectionHeader>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <SuggestionCard icon={<Route size={20} />} title="Route order">
          Suggests a route based on your time, interests, spice comfort, and current progress.
        </SuggestionCard>
        <SuggestionCard icon={<MapPin size={20} />} title="Next stop">
          Suggests what to visit next when you complete, skip, or shorten part of the route.
        </SuggestionCard>
        <SuggestionCard icon={<Sprout size={20} />} title="Pepper recommendations">
          Highlights peppers that may fit your spice comfort, learning goals, and tasting availability.
        </SuggestionCard>
      </div>
    </section>
  )
}

function InputsSection() {
  const chips = ['Visit time', 'Spice comfort', 'Selected interests', 'Visit mode', 'Completed stops', 'Skipped stops', 'Saved peppers', 'Approximate location', 'Accessibility preferences (if selected)']

  return (
    <section>
      <SectionHeader label="02 · Inputs" title="What information is used" />
      <SectionCard className="mt-3">
        <p className="text-[15px] leading-6 text-[var(--muted)]">Only information from this visit session is used. No personal account or history is needed.</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <Chip key={chip}>{chip}</Chip>
          ))}
        </div>
        <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#eaf4f8] px-4 py-3 text-sm font-semibold text-[#3d6e8c]">
          <Info className="mt-0.5 shrink-0" size={16} />
          <span>No account or personal history is needed. Classroom demo analytics may be enabled only to show aggregate prototype activity.</span>
        </div>
      </SectionCard>
    </section>
  )
}

function ProcessSection() {
  const steps = [
    {
      title: 'You choose preferences',
      detail: '40 minutes, mild tasting, family mode',
      tone: 'red',
    },
    {
      title: 'The system checks route options',
      detail: 'Nearby stops, tasting points, walking time',
      tone: 'green',
    },
    {
      title: 'The system suggests a route',
      detail: 'Short route with mild tasting and less walking',
      tone: 'green',
    },
    {
      title: 'You decide what to do',
      detail: 'Continue, skip, replan, or switch to manual mode',
      tone: 'red',
    },
  ] as const

  return (
    <section>
      <SectionHeader label="03 · The process" title="How a recommendation is made">
        Every recommendation follows the same simple four-step process. You are always at the end of it.
      </SectionHeader>
      <SectionCard className="mt-5">
        <div className="grid gap-4 md:grid-cols-4">
          {steps.map((step, index) => (
            <article className="text-center" key={step.title}>
              <div
                className={cn(
                  'mx-auto flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold',
                  step.tone === 'red' ? 'border-[#efc2b4] bg-[#fff0eb] text-[var(--terracotta)]' : 'border-[#cfe5d9] bg-[#edf7ed] text-[#3e7f74]',
                )}
              >
                {index + 1}
              </div>
              <h3 className="mt-4 text-sm font-semibold text-[var(--ink)]">{step.title}</h3>
              <p className="mt-2 text-xs italic leading-5 text-[var(--muted)]">{step.detail}</p>
              {index === 3 ? <Chip tone="red">Your choice</Chip> : null}
            </article>
          ))}
        </div>
      </SectionCard>
    </section>
  )
}

function ExampleSection() {
  return (
    <section>
      <SectionHeader label="04 · Examples" title="Example explanations">
        When Prigan Guide makes a suggestion, it shows you why. Here are two examples.
      </SectionHeader>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <SectionCard>
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e1efeb] text-[#3e7f74]">
              <Route size={18} />
            </span>
            <div>
              <SectionLabel>Route explanation</SectionLabel>
              <h3 className="mt-1 text-[15px] font-semibold text-[var(--ink)]">Why this route?</h3>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
            Recommended because it fits your 40-minute visit, includes mild tasting, and avoids long walking.
          </p>
          <p className="mt-5 text-xs font-semibold text-[var(--muted)]">Factors used</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Chip tone="green">Time fit</Chip>
            <Chip tone="green">Mild tasting</Chip>
            <Chip tone="green">Family mode</Chip>
            <Chip tone="green">Short walking</Chip>
          </div>
        </SectionCard>
        <SectionCard>
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff2d6] text-[#d98a2b]">
              <Sprout size={18} />
            </span>
            <div>
              <SectionLabel>Pepper explanation</SectionLabel>
              <h3 className="mt-1 text-[15px] font-semibold text-[var(--ink)]">Why this pepper?</h3>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
            Recommended because it is beginner-friendly, available near your next stop, and matches your mild spice preference.
          </p>
          <p className="mt-5 text-xs font-semibold text-[var(--muted)]">Factors used</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Chip tone="green">Beginner-friendly</Chip>
            <Chip tone="green">On route</Chip>
            <Chip tone="green">Mild heat</Chip>
            <Chip tone="green">Available for tasting</Chip>
          </div>
        </SectionCard>
      </div>
    </section>
  )
}

function ControlSection({ onManual }: { onManual: () => void }) {
  return (
    <section>
      <SectionHeader label="05 · Your control" title="You stay in control">
        AI recommendations are optional. You can always browse stops and peppers manually.
      </SectionHeader>
      <SectionCard className="mt-5">
        <div className="flex flex-wrap gap-3">
          <TinyButton to="/planner" tone="primary">
            <Edit3 size={15} />
            Change preferences
          </TinyButton>
          <TinyButton to="/recommended">
            <Shuffle size={15} />
            Replan route
          </TinyButton>
          <TinyButton to="/route">
            <ArrowRight size={15} />
            Skip a stop
          </TinyButton>
          <TinyButton to="/map">
            <MapPin size={15} />
            Choose different stop
          </TinyButton>
          <TinyButton onClick={onManual}>
            <Compass size={15} />
            Choose manually
          </TinyButton>
          <TinyButton to="/map">
            <Map size={15} />
            Open full map
          </TinyButton>
          <TinyButton to="/route">
            <ListChecks size={15} />
            Use list view
          </TinyButton>
        </div>
        <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#edf7ed] px-4 py-3 text-sm font-semibold text-[#3e7f74]">
          <CheckCircle2 className="mt-0.5 shrink-0" size={16} />
          <span>You are always in control. Switching off AI suggestions does not affect your visit in any other way.</span>
        </div>
      </SectionCard>
    </section>
  )
}

function LimitationsSection() {
  const limits = [
    'Location may be approximate inside greenhouse areas.',
    'Walking time is estimated and may vary.',
    'Pepper heat can vary by pepper and preparation.',
    'The system may not know about current crowding or temporary closures.',
    'Recommendations are based on your selected preferences, not personal medical advice.',
  ]

  return (
    <section>
      <SectionHeader label="06 · Limitations" title="What Prigan Guide may not know">
        Prigan Guide tries to give helpful suggestions, but it has limits. Knowing them helps you make better decisions.
      </SectionHeader>
      <SectionCard className="mt-5 p-0">
        {limits.map((limit) => (
          <div className="flex items-start gap-3 border-b border-[var(--soft-border)] px-6 py-4 last:border-b-0" key={limit}>
            <HelpCircle className="mt-0.5 shrink-0 text-[#d98a2b]" size={16} />
            <p className="text-[15px] leading-6 text-[var(--muted)]">{limit}</p>
          </div>
        ))}
      </SectionCard>
      <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#edd4a5] bg-[#fff2d6] px-4 py-3 text-sm leading-6 text-[#7f5b20]">
        <AlertTriangle className="mt-1 shrink-0" size={16} />
        <p>If something looks wrong, use the map, list view, or ask farm staff. You are not required to follow any suggestion.</p>
      </div>
    </section>
  )
}

function PrivacySection() {
  const notes = ['No account required', 'Preferences can be changed', 'Saved peppers are part of the current visit only', 'Manual mode does not require AI suggestions']

  return (
    <section>
      <SectionHeader label="07 · Privacy" title="Privacy and visit data" />
      <SectionCard className="mt-5">
        <div className="flex items-start gap-4">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf4f8] text-[#3d6e8c]">
            <ShieldCheck size={20} />
          </span>
          <p className="text-[15px] leading-6 text-[var(--muted)]">
            This prototype does not require registration. Visit data is used to support the current session, such as route progress, saved peppers, selected preferences, and optional classroom demo analytics when enabled.
          </p>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {notes.map((note) => (
            <div className="flex items-center gap-2 rounded-lg bg-[#f2ede4] px-3 py-3 text-sm text-[var(--muted)]" key={note}>
              <CheckCircle2 className="shrink-0 text-[#6a8f4d]" size={15} />
              {note}
            </div>
          ))}
        </div>
      </SectionCard>
    </section>
  )
}

function QuestionsSection() {
  const questions = [
    'Can I ignore the recommended route?',
    'Does the AI know my exact location?',
    'Why does the route change?',
    'Are hot pepper warnings exact?',
    'Do I need to create an account?',
  ]

  return (
    <section>
      <SectionHeader label="08 · Questions" title="Common questions" />
      <SectionCard className="mt-5 divide-y divide-[var(--soft-border)] p-0">
        {questions.map((question) => (
          <button className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-[15px] font-semibold text-[var(--ink)] hover:bg-[var(--cream-100)]" key={question} type="button">
            {question}
            <ChevronDown className="shrink-0 text-[var(--muted)]" size={16} />
          </button>
        ))}
      </SectionCard>
      <div className="mt-4 flex items-start gap-3 rounded-xl border border-[var(--soft-border)] bg-white px-4 py-3 text-sm text-[var(--muted)]">
        <Info className="mt-0.5 shrink-0 text-[#d98a2b]" size={16} />
        <p>
          More questions? Ask a farm staff member or explore the <Link className="font-semibold text-[var(--terracotta)] hover:underline" to="/catalog">pepper catalog</Link> and{' '}
          <Link className="font-semibold text-[var(--terracotta)] hover:underline" to="/map">farm map</Link>.
        </p>
      </div>
    </section>
  )
}

function Sidebar({ onManual }: { onManual: () => void }) {
  return (
    <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-2xl border border-[var(--soft-border)] bg-[#f2ede4] p-5">
        <SectionLabel>Current preferences</SectionLabel>
        <h2 className="mt-1 text-base font-semibold text-[var(--ink)]">Control your recommendations</h2>
        <div className="mt-4 space-y-3 text-sm">
          {[
            ['Visit time', '40 min'],
            ['Spice comfort', 'Mild'],
            ['Mode', 'Family'],
            ['Interests', 'Tasting, Learning'],
            ['Route mode', 'AI-assisted'],
          ].map(([label, value]) => (
            <div className="flex items-center justify-between gap-3" key={label}>
              <span className="inline-flex items-center gap-2 text-[var(--muted)]">
                <ListChecks size={14} />
                {label}
              </span>
              <span className="font-semibold text-[var(--ink)]">{value}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#e1efeb] px-3 py-2 text-xs font-semibold text-[#3e7f74]">
          <Sparkles size={14} />
          AI-assisted · Suggestions only
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--soft-border)] bg-white p-4">
        <div className="grid gap-2">
          <TinyButton to="/planner" tone="primary">
            <Edit3 size={15} />
            Change Preferences
          </TinyButton>
          <TinyButton to="/recommended">
            <Shuffle size={15} />
            Replan Route
          </TinyButton>
          <TinyButton onClick={onManual}>
            <Compass size={15} />
            Choose Manually
          </TinyButton>
          <TinyButton to="/my-visit">
            <Heart size={15} />
            Open My Visit
          </TinyButton>
          <TinyButton to="/map">
            <Map size={15} />
            Open Map
          </TinyButton>
        </div>
        <p className="mt-4 text-xs leading-5 text-[var(--muted)]">You can change these at any time.</p>
      </div>
    </aside>
  )
}

export function HowAIWorksPage() {
  const { chooseManual } = useVisit()
  const navigate = useNavigate()

  const switchToManual = () => {
    chooseManual()
    navigate('/map')
  }

  return (
    <PageShell className="py-8 md:py-10">
      <div className="mx-auto max-w-[1200px]">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-[var(--muted)]">
          <Link className="hover:text-[var(--ink)]" to="/help">Help</Link>
          <ChevronRight size={15} />
          <span className="font-semibold text-[var(--ink)]">How AI Works</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,888px)_278px]">
          <main className="space-y-10">
            <HeroSection />
            <WhatItDoesSection />
            <InputsSection />
            <ProcessSection />
            <ExampleSection />
            <ControlSection onManual={switchToManual} />
            <LimitationsSection />
            <PrivacySection />
            <QuestionsSection />
          </main>
          <Sidebar onManual={switchToManual} />
        </div>
      </div>
    </PageShell>
  )
}
