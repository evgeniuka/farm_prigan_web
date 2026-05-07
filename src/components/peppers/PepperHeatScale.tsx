export function PepperHeatScale({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Heat level ${level} of 5`}>
      {[0, 1, 2, 3, 4].map((step) => (
        <span
          className={`h-2.5 w-6 rounded-full ${step < level ? 'bg-[var(--terracotta)]' : 'bg-[var(--cream-200)]'}`}
          key={step}
        />
      ))}
    </div>
  )
}
