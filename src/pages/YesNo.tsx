import { useState } from 'react'
import { EIGHT_BALL } from '../data/fortunes'
import { pick } from '../lib/random'
import { PageHeader, ShareButton } from '../components/ui'

type Kind = keyof typeof EIGHT_BALL

const KIND_COLOR: Record<Kind, string> = {
  yes: 'text-emerald-300',
  maybe: 'text-amber-200',
  no: 'text-rose-300',
}

export default function YesNo() {
  const [question, setQuestion] = useState('')
  const [shaking, setShaking] = useState(false)
  const [answer, setAnswer] = useState<{ text: string; kind: Kind } | null>(null)

  const ask = () => {
    if (shaking) return
    setAnswer(null)
    setShaking(true)
    navigator.vibrate?.(120)
    setTimeout(() => {
      const r = Math.random()
      const kind: Kind = r < 0.45 ? 'yes' : r < 0.75 ? 'maybe' : 'no'
      setAnswer({ text: pick(EIGHT_BALL[kind]), kind })
      setShaking(false)
    }, 1100)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Yes or No" subtitle="Ask the magic orb anything" />

      <input
        className="input text-center"
        placeholder="Type your yes/no question…"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && ask()}
        maxLength={120}
      />

      <div className="flex justify-center py-4">
        <button
          onClick={ask}
          aria-label="Shake the magic orb"
          className={`relative grid size-64 place-items-center rounded-full shadow-[0_30px_60px_-15px_rgba(124,58,237,0.6)] transition active:scale-95 ${
            shaking ? 'animate-shake' : 'animate-float'
          }`}
          style={{
            background: 'radial-gradient(circle at 32% 28%, #5b4a9e 0%, #1a1238 35%, #07040f 75%)',
            animationIterationCount: shaking ? 2 : undefined,
          }}
        >
          <span className="absolute top-8 left-14 h-10 w-16 rotate-[-30deg] rounded-full bg-white/15 blur-md" />
          <span className="grid size-36 place-items-center rounded-full bg-gradient-to-br from-indigo-950 to-black ring-4 ring-night-700">
            {answer ? (
              <span key={answer.text} className="flex flex-col items-center px-3 text-center animate-pop">
                <span
                  className="mb-1 h-0 w-0 border-x-[18px] border-t-[30px] border-x-transparent border-t-violet-600/70"
                  aria-hidden
                />
                <span className={`text-sm leading-tight font-extrabold ${KIND_COLOR[answer.kind]}`}>{answer.text}</span>
              </span>
            ) : (
              <span className="font-display text-5xl font-bold text-white/90">{shaking ? '…' : '8'}</span>
            )}
          </span>
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <button className="btn-primary" onClick={ask} disabled={shaking}>
          🔮 {answer ? 'Ask again' : 'Shake the orb'}
        </button>
        {answer && (
          <ShareButton
            card={() => ({
              emoji: '🔮',
              title: 'The Orb Says',
              subtitle: question ? `“${question}”` : 'Yes or No?',
              body: answer.text,
            })}
          />
        )}
      </div>
      <p className="text-center text-xs text-violet-200/60">Tip: concentrate on your question before tapping ✨</p>
    </div>
  )
}
