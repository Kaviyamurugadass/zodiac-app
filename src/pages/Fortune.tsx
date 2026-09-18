import { useState } from 'react'
import { FORTUNES } from '../data/fortunes'
import { pick, uniqueInts } from '../lib/random'
import { useStore } from '../lib/storage'
import { PageHeader, ShareButton } from '../components/ui'

type Phase = 'whole' | 'cracking' | 'open'

export default function Fortune() {
  const [phase, setPhase] = useState<Phase>('whole')
  const [fortune, setFortune] = useState('')
  const [numbers, setNumbers] = useState<number[]>([])
  const [opened, setOpened] = useStore('cookies-opened', 0)

  const crack = () => {
    if (phase !== 'whole') return
    setFortune(pick(FORTUNES))
    setNumbers(uniqueInts(6, 1, 59))
    setPhase('cracking')
    setTimeout(() => {
      setPhase('open')
      setOpened((n) => n + 1)
    }, 700)
  }

  const cookieHalf = (side: 'left' | 'right') => (
    <span
      className="absolute inset-0 grid place-items-center text-[9rem] leading-none transition-all duration-700 ease-out select-none"
      style={{
        clipPath: side === 'left' ? 'inset(0 50% 0 0)' : 'inset(0 0 0 50%)',
        transform:
          phase === 'open'
            ? `translateX(${side === 'left' ? -70 : 70}px) translateY(20px) rotate(${side === 'left' ? -25 : 25}deg)`
            : 'none',
        opacity: phase === 'open' ? 0.9 : 1,
      }}
      aria-hidden
    >
      🥠
    </span>
  )

  return (
    <div className="space-y-5">
      <PageHeader title="Fortune Cookie" subtitle="Tap the cookie to crack it open" />

      <div className="relative flex min-h-80 flex-col items-center justify-center">
        <button
          onClick={crack}
          className={`relative size-48 ${phase === 'whole' ? 'animate-float' : ''} ${phase === 'cracking' ? 'animate-shake' : ''}`}
          aria-label="Crack the fortune cookie"
          disabled={phase === 'open'}
        >
          {cookieHalf('left')}
          {cookieHalf('right')}
        </button>

        {phase === 'open' && (
          <div className="relative z-10 -mt-16 w-full animate-pop">
            <div className="mx-auto max-w-sm rounded-md bg-[#fdf6e3] px-5 py-4 text-center text-night-900 shadow-2xl shadow-black/40 [transform:rotate(-1.5deg)]">
              <p className="font-serif text-lg leading-snug font-semibold">“{fortune}”</p>
              <p className="mt-3 text-xs font-bold tracking-widest text-rose-700">LUCKY NUMBERS</p>
              <p className="mt-1 font-mono text-sm font-bold text-night-700">{numbers.join('  ')}</p>
            </div>
          </div>
        )}

        {phase === 'whole' && <p className="mt-4 font-bold text-gold-300 animate-pulse">Tap to crack 🥢</p>}
      </div>

      {phase === 'open' && (
        <div className="flex flex-wrap justify-center gap-3 animate-fade-up">
          <button className="btn-primary" onClick={() => setPhase('whole')}>
            🥠 Another cookie
          </button>
          <ShareButton
            card={() => ({
              emoji: '🥠',
              title: 'My Fortune',
              subtitle: `Lucky numbers: ${numbers.join(' · ')}`,
              body: `“${fortune}”`,
            })}
          />
        </div>
      )}

      <p className="text-center text-xs text-violet-200/60">You have cracked {opened} cookie{opened === 1 ? '' : 's'} so far 🍪</p>
    </div>
  )
}
