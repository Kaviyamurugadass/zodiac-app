import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { SIGNS, type ZodiacSign } from '../data/signs'
import { shareCard, type ShareCard } from '../lib/share'

export function PageHeader({ title, subtitle, back = true }: { title: string; subtitle?: string; back?: boolean }) {
  const navigate = useNavigate()
  return (
    <header className="mb-5 flex items-start gap-3 pt-2">
      {back && (
        <button
          onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
          className="mt-1 grid size-10 shrink-0 place-items-center rounded-full bg-white/8 text-lg ring-1 ring-white/15 active:scale-95"
          aria-label="Go back"
        >
          ←
        </button>
      )}
      <div>
        <h1 className="font-display text-2xl leading-tight font-bold text-gold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-violet-200/80">{subtitle}</p>}
      </div>
    </header>
  )
}

export function StarRating({ value, max = 5, size = 'text-base' }: { value: number; max?: number; size?: string }) {
  return (
    <span className={`${size} tracking-tight`} aria-label={`${value} out of ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < value ? 'text-gold-400' : 'text-white/20'}>
          ★
        </span>
      ))}
    </span>
  )
}

export function SignPicker({
  value,
  onChange,
  compact = false,
}: {
  value?: string
  onChange: (sign: ZodiacSign) => void
  compact?: boolean
}) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
      {SIGNS.map((s) => {
        const active = s.id === value
        return (
          <button
            key={s.id}
            onClick={() => onChange(s)}
            className={`flex flex-col items-center rounded-2xl px-1 py-2.5 transition active:scale-95 ${
              active ? 'bg-gradient-to-br text-white ring-2 ring-gold-300 ' + s.gradient : 'bg-white/6 ring-1 ring-white/10 hover:bg-white/10'
            }`}
            aria-pressed={active}
          >
            <span className={compact ? 'text-xl' : 'text-2xl'}>{s.emoji}</span>
            <span className="mt-1 text-[11px] leading-none font-bold">{s.name}</span>
            {!compact && <span className="mt-1 text-[9px] leading-none opacity-70">{s.dates.split(' – ')[0]}</span>}
          </button>
        )
      })}
    </div>
  )
}

export function ShareButton({ card, label = 'Share' }: { card: () => ShareCard; label?: string }) {
  const [state, setState] = useState<'idle' | 'busy' | 'done'>('idle')
  return (
    <button
      className="btn-ghost text-sm"
      disabled={state === 'busy'}
      onClick={async () => {
        setState('busy')
        try {
          const r = await shareCard(card())
          setState(r === 'downloaded' ? 'done' : 'idle')
          if (r === 'downloaded') setTimeout(() => setState('idle'), 2000)
        } catch {
          setState('idle')
        }
      }}
    >
      {state === 'busy' ? '✨ Creating…' : state === 'done' ? '✅ Saved image' : `📤 ${label}`}
    </button>
  )
}

export function Section({ title, children, className = '' }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`glass p-4 ${className}`}>
      {title && <h2 className="mb-3 text-sm font-extrabold tracking-wider text-violet-200/90 uppercase">{title}</h2>}
      {children}
    </section>
  )
}

export function Meter({ label, value, emoji }: { label: string; value: number; emoji?: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="font-bold">
          {emoji} {label}
        </span>
        <span className="font-extrabold text-gold-300">{value}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 via-violet-400 to-gold-300 transition-[width] duration-1000"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}
