import { useState } from 'react'
import { SIGN_BY_ID, type ZodiacSign } from '../data/signs'
import { compatibility, type CompatResult } from '../lib/compat'
import { useProfile } from '../lib/storage'
import { Meter, PageHeader, Section, ShareButton, SignPicker } from '../components/ui'
import { Art, artUrl } from '../components/Art'

function Ring({ value }: { value: number }) {
  const r = 54
  const c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 128 128" className="size-40 -rotate-90" aria-hidden>
      <defs>
        <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f472b6" />
          <stop offset="1" stopColor="#ffe7a3" />
        </linearGradient>
      </defs>
      <circle cx="64" cy="64" r={r} fill="none" stroke="rgb(255 255 255 / 0.1)" strokeWidth="12" />
      <circle
        cx="64"
        cy="64"
        r={r}
        fill="none"
        stroke="url(#ring)"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - value / 100)}
        style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
      />
    </svg>
  )
}

function verdict(score: number): string {
  if (score >= 88) return 'Written in the stars'
  if (score >= 75) return 'A beautiful match'
  if (score >= 60) return 'Good potential'
  if (score >= 48) return 'Needs some work'
  return 'A spicy challenge'
}

export default function Compatibility() {
  const [profile] = useProfile()
  const [a, setA] = useState<ZodiacSign | undefined>(profile.signId ? SIGN_BY_ID[profile.signId] : undefined)
  const [b, setB] = useState<ZodiacSign | undefined>()
  const [step, setStep] = useState<'a' | 'b' | 'calc' | 'result'>(profile.signId ? 'b' : 'a')
  const [result, setResult] = useState<CompatResult | null>(null)

  const calculate = (x: ZodiacSign, y: ZodiacSign) => {
    setStep('calc')
    setTimeout(() => {
      setResult(compatibility(x, y))
      setStep('result')
    }, 1200)
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Love Match" subtitle="How compatible are your signs?" />

      {/* Pair display */}
      <div className="glass flex items-center justify-around p-4">
        <button onClick={() => setStep('a')} className="flex flex-col items-center">
          <span className={`grid size-20 place-items-center rounded-full text-3xl font-extrabold text-violet-200/60 ring-2 ${step === 'a' ? 'ring-gold-300' : 'ring-white/15'} bg-white/6`}>
            {a ? <Art name={a.id} className="size-16" /> : '?'}
          </span>
          <span className="mt-1 text-sm font-bold">{a?.name ?? 'You'}</span>
        </button>
        <Art name="hearts" className={`size-14 ${step === 'calc' ? 'animate-ping' : 'animate-pulse'}`} />
        <button onClick={() => a && setStep('b')} className="flex flex-col items-center">
          <span className={`grid size-20 place-items-center rounded-full text-3xl font-extrabold text-violet-200/60 ring-2 ${step === 'b' ? 'ring-gold-300' : 'ring-white/15'} bg-white/6`}>
            {b ? <Art name={b.id} className="size-16" /> : '?'}
          </span>
          <span className="mt-1 text-sm font-bold">{b?.name ?? 'Them'}</span>
        </button>
      </div>

      {step === 'a' && (
        <Section title="Pick your sign">
          <SignPicker
            compact
            value={a?.id}
            onChange={(s) => {
              setA(s)
              if (b) calculate(s, b)
              else setStep('b')
            }}
          />
        </Section>
      )}

      {step === 'b' && (
        <Section title="Pick their sign">
          <SignPicker
            compact
            value={b?.id}
            onChange={(s) => {
              setB(s)
              if (a) calculate(a, s)
            }}
          />
        </Section>
      )}

      {step === 'calc' && <p className="py-8 text-center font-bold text-gold-300 animate-pulse">Reading the stars…</p>}

      {step === 'result' && result && (
        <div className="space-y-4 animate-fade-up">
          <div className="relative grid place-items-center">
            <Ring value={result.overall} />
            <div className="absolute text-center">
              <p className="font-display text-4xl font-bold text-gold">{result.overall}%</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-xl font-extrabold">{verdict(result.overall)}</p>
            <p className="text-sm text-violet-200/80">
              {result.a.name} × {result.b.name} · {result.title}
            </p>
          </div>
          <Section className="space-y-3">
            <Meter label="Love & romance" icon="love" value={result.love} />
            <Meter label="Friendship" icon="star" value={result.friendship} />
            <Meter label="Communication" icon="air" value={result.communication} />
            <Meter label="Trust" icon="moon" value={result.trust} />
          </Section>
          <Section>
            <p className="leading-relaxed">{result.text}</p>
            <p className="mt-3 text-sm text-violet-200/80">
              {result.a.element} + {result.b.element}: {result.a.name} brings {result.a.strengths[0].toLowerCase()} energy while{' '}
              {result.b.name} adds a {result.b.strengths[1].toLowerCase()} touch.
            </p>
          </Section>
          <div className="flex flex-wrap justify-center gap-3">
            <button className="btn-primary" onClick={() => setStep('b')}>
              Try another sign
            </button>
            <ShareButton
              card={() => ({
                images: [artUrl(result.a.id), artUrl('hearts'), artUrl(result.b.id)],
                title: `${result.overall}% Match`,
                subtitle: `${result.a.name} × ${result.b.name}`,
                body: `${verdict(result.overall)} — ${result.text}`,
              })}
            />
          </div>
        </div>
      )}
    </div>
  )
}
