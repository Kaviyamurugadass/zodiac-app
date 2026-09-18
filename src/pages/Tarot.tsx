import { useMemo, useState } from 'react'
import { DECK, SUIT_STYLE, type TarotCard, type YesNo } from '../data/tarot'
import { dateKey, seededRng, shuffle } from '../lib/random'
import { useStore } from '../lib/storage'
import TarotCardView, { CardBack } from '../components/TarotCardView'
import { PageHeader, Section, ShareButton } from '../components/ui'

type Mode = 'daily' | 'three' | 'love' | 'yesno'

const MODES: { id: Mode; label: string; emoji: string; positions: string[]; intro: string }[] = [
  { id: 'daily', label: 'Card of the Day', emoji: '🌞', positions: ['Today'], intro: 'One card to guide your whole day. It stays the same until midnight.' },
  { id: 'three', label: 'Past · Present · Future', emoji: '⏳', positions: ['Past', 'Present', 'Future'], intro: 'Think about a situation, then pick three cards.' },
  { id: 'love', label: 'Love Reading', emoji: '💘', positions: ['You', 'Them', 'Your bond'], intro: 'Think of someone special and pick three cards.' },
  { id: 'yesno', label: 'Yes / No', emoji: '❓', positions: ['Answer'], intro: 'Ask a yes-or-no question and pick one card.' },
]

interface Drawn {
  card: TarotCard
  reversed: boolean
  flipped: boolean
}

const FAN_SIZE = 15

function answerOf(d: Drawn): YesNo {
  if (!d.reversed) return d.card.yesNo
  return d.card.yesNo === 'yes' ? 'maybe' : 'no'
}

const ANSWER_STYLE: Record<YesNo, { text: string; className: string }> = {
  yes: { text: 'YES', className: 'from-emerald-300 to-teal-400' },
  no: { text: 'NO', className: 'from-rose-300 to-red-400' },
  maybe: { text: 'MAYBE', className: 'from-amber-200 to-orange-400' },
}

function Meaning({ d, position }: { d: Drawn; position: string }) {
  const style = SUIT_STYLE[d.card.suit]
  return (
    <Section className="animate-fade-up">
      <p className="text-xs font-bold tracking-wider text-violet-200/70 uppercase">{position}</p>
      <h3 className="mt-0.5 text-lg font-extrabold">
        {d.card.emoji} {d.card.name} {d.reversed && <span className="text-sm font-bold text-rose-300">(Reversed)</span>}
      </h3>
      <p className="text-xs text-violet-200/70">{style.label}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {d.card.keywords.map((k) => (
          <span key={k} className="rounded-full bg-white/8 px-2.5 py-0.5 text-xs capitalize">
            {k}
          </span>
        ))}
      </div>
      <p className="mt-2 leading-relaxed">{d.reversed ? d.card.reversed : d.card.upright}</p>
    </Section>
  )
}

export default function Tarot() {
  const [mode, setMode] = useState<Mode>('daily')
  const cfg = MODES.find((m) => m.id === mode)!

  return (
    <div className="space-y-4">
      <PageHeader title="Tarot" subtitle="Shuffle, pick and let the cards speak" />
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
              mode === m.id ? 'bg-gradient-to-r from-gold-200 to-gold-500 text-night-900' : 'bg-white/8 text-violet-100 ring-1 ring-white/10'
            }`}
          >
            {m.emoji} {m.label}
          </button>
        ))}
      </div>
      {mode === 'daily' ? <DailyCard /> : <Spread key={mode} cfg={cfg} />}
    </div>
  )
}

function DailyCard() {
  const today = dateKey()
  const drawn = useMemo<Drawn>(() => {
    const rng = seededRng(`tarot-daily|${today}`)
    return { card: DECK[Math.floor(rng() * DECK.length)], reversed: rng() < 0.2, flipped: true }
  }, [today])
  const [revealedOn, setRevealedOn] = useStore('tarot-daily', '')
  const flipped = revealedOn === today

  return (
    <div className="space-y-4">
      <p className="text-center text-sm text-violet-200/80">{MODES[0].intro}</p>
      <div className="flex justify-center py-2">
        <TarotCardView
          card={drawn.card}
          reversed={drawn.reversed}
          flipped={flipped}
          size="lg"
          onClick={flipped ? undefined : () => setRevealedOn(today)}
        />
      </div>
      {!flipped ? (
        <p className="text-center font-bold text-gold-300 animate-pulse">Tap the card to reveal ✨</p>
      ) : (
        <>
          <Meaning d={drawn} position="Your card for today" />
          <div className="flex justify-center">
            <ShareButton
              label="Share my card"
              card={() => ({
                emoji: drawn.card.emoji,
                title: drawn.card.name,
                subtitle: `Card of the Day${drawn.reversed ? ' · Reversed' : ''}`,
                body: drawn.reversed ? drawn.card.reversed : drawn.card.upright,
              })}
            />
          </div>
        </>
      )}
    </div>
  )
}

function Spread({ cfg }: { cfg: (typeof MODES)[number] }) {
  const [phase, setPhase] = useState<'intro' | 'shuffling' | 'picking' | 'reveal'>('intro')
  const [question, setQuestion] = useState('')
  const [fan, setFan] = useState<Drawn[]>([])
  const [picked, setPicked] = useState<number[]>([])
  const [drawn, setDrawn] = useState<Drawn[]>([])
  const need = cfg.positions.length

  const start = () => {
    setPhase('shuffling')
    setPicked([])
    setDrawn([])
    const deck = shuffle(DECK).slice(0, FAN_SIZE)
    setFan(deck.map((card) => ({ card, reversed: Math.random() < 0.25, flipped: false })))
    setTimeout(() => setPhase('picking'), 1300)
  }

  const pickCard = (i: number) => {
    if (picked.includes(i) || picked.length >= need) return
    const next = [...picked, i]
    setPicked(next)
    if (next.length === need) {
      setTimeout(() => {
        setDrawn(next.map((idx) => fan[idx]))
        setPhase('reveal')
      }, 450)
    }
  }

  const flip = (i: number) => setDrawn((d) => d.map((x, j) => (j === i ? { ...x, flipped: true } : x)))
  const allFlipped = drawn.length > 0 && drawn.every((d) => d.flipped)

  if (phase === 'intro') {
    return (
      <Section className="space-y-4 text-center">
        <div className="relative mx-auto h-36 w-28">
          {[0, 1, 2].map((i) => (
            <div key={i} className="absolute inset-0" style={{ transform: `rotate(${(i - 1) * 8}deg)` }}>
              <CardBack />
            </div>
          ))}
        </div>
        <p className="text-violet-100/90">{cfg.intro}</p>
        {cfg.id === 'yesno' && (
          <input
            className="input text-center"
            placeholder="e.g. Should I apply for that job?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            maxLength={120}
          />
        )}
        <button className="btn-primary w-full" onClick={start}>
          🔀 Shuffle the deck
        </button>
      </Section>
    )
  }

  if (phase === 'shuffling') {
    return (
      <div className="grid place-items-center py-10">
        <div className="relative h-44 w-28">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="absolute inset-0 animate-shake"
              style={{ animationDelay: `${i * 90}ms`, animationIterationCount: 2 }}
            >
              <CardBack />
            </div>
          ))}
        </div>
        <p className="mt-6 font-bold text-gold-300">Shuffling the deck…</p>
      </div>
    )
  }

  if (phase === 'picking') {
    return (
      <div className="space-y-4">
        <p className="text-center font-bold">
          Pick <span className="text-gold-300">{need - picked.length}</span> more card{need - picked.length === 1 ? '' : 's'}
        </p>
        <div className="relative mx-auto h-52 w-full">
          {fan.map((_, i) => {
            const mid = (FAN_SIZE - 1) / 2
            const isPicked = picked.includes(i)
            return (
              <button
                key={i}
                onClick={() => pickCard(i)}
                className="absolute top-6 h-32 w-20 transition-all duration-300"
                style={{
                  left: `calc(${i} * (100% - 5rem) / ${FAN_SIZE - 1})`,
                  transform: `rotate(${(i - mid) * 3}deg) translateY(${isPicked ? -26 : Math.abs(i - mid) * 2}px)`,
                  opacity: isPicked ? 0.35 : 1,
                  zIndex: i,
                }}
                aria-label={`Card ${i + 1}`}
              >
                <CardBack className={isPicked ? 'ring-4 ring-gold-300' : ''} />
              </button>
            )
          })}
        </div>
        <p className="text-center text-xs text-violet-200/70">Trust your intuition — tap the cards that call to you.</p>
      </div>
    )
  }

  const verdict = cfg.id === 'yesno' && allFlipped ? ANSWER_STYLE[answerOf(drawn[0])] : undefined

  return (
    <div className="space-y-4">
      {question && cfg.id === 'yesno' && <p className="text-center text-sm text-violet-200/80 italic">“{question}”</p>}
      <div className="flex justify-center gap-3">
        {drawn.map((d, i) => (
          <TarotCardView
            key={d.card.id}
            card={d.card}
            reversed={d.reversed}
            flipped={d.flipped}
            size={need === 1 ? 'lg' : 'sm'}
            label={cfg.positions[i]}
            onClick={d.flipped ? undefined : () => flip(i)}
          />
        ))}
      </div>
      {!allFlipped && <p className="text-center font-bold text-gold-300 animate-pulse">Tap each card to reveal ✨</p>}

      {verdict && (
        <div className="text-center animate-pop">
          <p className="text-sm text-violet-200/80">The cards say…</p>
          <p className={`bg-gradient-to-r bg-clip-text font-display text-5xl font-bold text-transparent ${verdict.className}`}>
            {verdict.text}
          </p>
        </div>
      )}

      {drawn.map((d, i) => (d.flipped ? <Meaning key={d.card.id} d={d} position={cfg.positions[i]} /> : null))}

      {allFlipped && (
        <div className="flex flex-wrap justify-center gap-3">
          <button className="btn-primary" onClick={start}>
            🔄 New reading
          </button>
          <ShareButton
            card={() => ({
              emoji: drawn.map((d) => d.card.emoji).join(' '),
              title: cfg.label,
              subtitle: verdict ? `The answer: ${verdict.text}` : drawn.map((d) => d.card.name).join(' · '),
              body: drawn
                .map((d, i) => `${cfg.positions[i]}: ${d.card.name}${d.reversed ? ' (R)' : ''} — ${d.reversed ? d.card.reversed : d.card.upright}`)
                .join('   '),
            })}
          />
        </div>
      )}
    </div>
  )
}
