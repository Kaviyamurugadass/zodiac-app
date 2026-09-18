import { useState } from 'react'
import { useStore } from '../lib/storage'
import { PageHeader, Section } from '../components/ui'

type Side = 'heads' | 'tails'

interface CoinStats {
  heads: number
  tails: number
  history: Side[]
}

const FLIP_MS = 1600

function Face({ side }: { side: Side }) {
  const heads = side === 'heads'
  return (
    <div
      className="backface-hidden absolute inset-0 grid place-items-center rounded-full ring-8 ring-amber-600/60"
      style={{
        transform: heads ? undefined : 'rotateX(180deg)',
        background: heads
          ? 'radial-gradient(circle at 35% 30%, #fff1c7, #f5c95a 45%, #b7791f 100%)'
          : 'radial-gradient(circle at 35% 30%, #f1f5f9, #cbd5e1 45%, #64748b 100%)',
        boxShadow: 'inset 0 0 0 6px rgba(255,255,255,0.35), inset 0 -10px 20px rgba(0,0,0,0.25)',
      }}
    >
      <div className="flex flex-col items-center">
        <span className="text-6xl">{heads ? '☀️' : '🌙'}</span>
        <span className="mt-1 font-display text-lg font-bold text-night-900/80">{heads ? 'HEADS' : 'TAILS'}</span>
      </div>
    </div>
  )
}

export default function Coin() {
  const [rotation, setRotation] = useState(0)
  const [flipping, setFlipping] = useState(false)
  const [result, setResult] = useState<Side | null>(null)
  const [stats, setStats] = useStore<CoinStats>('coin', { heads: 0, tails: 0, history: [] })

  const flip = () => {
    if (flipping) return
    const side: Side = Math.random() < 0.5 ? 'heads' : 'tails'
    const target = side === 'heads' ? 0 : 180
    const current = ((rotation % 360) + 360) % 360
    // at least 5 full spins, then land on the right face
    setRotation(rotation + 1800 + ((target - current + 360) % 360))
    setFlipping(true)
    setResult(null)
    navigator.vibrate?.(40)
    setTimeout(() => {
      setFlipping(false)
      setResult(side)
      setStats((s) => ({ heads: s.heads + (side === 'heads' ? 1 : 0), tails: s.tails + (side === 'tails' ? 1 : 0), history: [side, ...s.history].slice(0, 12) }))
    }, FLIP_MS)
  }

  const total = stats.heads + stats.tails

  return (
    <div className="space-y-6">
      <PageHeader title="Heads or Tails" subtitle="Let fate decide" />

      <div className="perspective flex h-72 items-center justify-center">
        <button
          onClick={flip}
          aria-label="Flip the coin"
          className="preserve-3d relative size-52"
          style={{
            transform: `translateY(${flipping ? -40 : 0}px) rotateX(${rotation}deg)`,
            transition: `transform ${FLIP_MS}ms cubic-bezier(0.2, 0.7, 0.2, 1)`,
          }}
        >
          <Face side="heads" />
          <Face side="tails" />
        </button>
      </div>

      <div className="h-12 text-center">
        {result && (
          <p className="font-display text-3xl font-bold animate-pop">
            {result === 'heads' ? '☀️' : '🌙'} <span className="text-gold">{result === 'heads' ? 'Heads!' : 'Tails!'}</span>
          </p>
        )}
        {flipping && <p className="font-bold text-violet-200 animate-pulse">Flipping…</p>}
      </div>

      <div className="flex justify-center">
        <button className="btn-primary px-10" onClick={flip} disabled={flipping}>
          🪙 Flip coin
        </button>
      </div>

      <Section title="Your flips">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-white/6 p-2">
            <p className="text-2xl font-extrabold text-gold-300">{stats.heads}</p>
            <p className="text-xs text-violet-200/70">Heads</p>
          </div>
          <div className="rounded-2xl bg-white/6 p-2">
            <p className="text-2xl font-extrabold text-slate-200">{stats.tails}</p>
            <p className="text-xs text-violet-200/70">Tails</p>
          </div>
          <div className="rounded-2xl bg-white/6 p-2">
            <p className="text-2xl font-extrabold">{total}</p>
            <p className="text-xs text-violet-200/70">Total</p>
          </div>
        </div>
        {stats.history.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Recent flips">
            {stats.history.map((s, i) => (
              <span key={i} className="grid size-8 place-items-center rounded-full bg-white/8 text-base">
                {s === 'heads' ? '☀️' : '🌙'}
              </span>
            ))}
          </div>
        )}
        {total > 0 && (
          <button className="mt-3 text-xs font-bold text-violet-300 underline" onClick={() => setStats({ heads: 0, tails: 0, history: [] })}>
            Reset stats
          </button>
        )}
      </Section>
    </div>
  )
}
