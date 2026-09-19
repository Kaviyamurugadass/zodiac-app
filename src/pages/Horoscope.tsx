import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { SIGN_BY_ID } from '../data/signs'
import { generateHoroscope } from '../lib/horoscope'
import { addDays } from '../lib/random'
import { useProfile } from '../lib/storage'
import { Meter, PageHeader, Section, ShareButton, SignPicker, StarRating } from '../components/ui'
import { Art, artUrl } from '../components/Art'

const DAYS = [
  { offset: -1, label: 'Yesterday' },
  { offset: 0, label: 'Today' },
  { offset: 1, label: 'Tomorrow' },
]

export default function HoroscopePage() {
  const { signId } = useParams()
  const navigate = useNavigate()
  const [profile] = useProfile()
  const [offset, setOffset] = useState(0)
  const [picking, setPicking] = useState(false)

  const activeId = signId ?? profile.signId
  const sign = activeId ? SIGN_BY_ID[activeId] : undefined
  const date = useMemo(() => addDays(new Date(), offset), [offset])
  const h = useMemo(() => (sign ? generateHoroscope(sign.id, date) : undefined), [sign, date])

  if (!sign || !h || picking) {
    return (
      <div>
        <PageHeader title="Daily Horoscope" subtitle="Choose your zodiac sign" />
        <SignPicker
          value={sign?.id}
          onChange={(s) => {
            setPicking(false)
            navigate(`/horoscope/${s.id}`, { replace: true })
          }}
        />
      </div>
    )
  }

  const dateLabel = date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })

  return (
    <div className="space-y-4">
      <PageHeader title="Daily Horoscope" subtitle={dateLabel} />

      {/* Sign hero */}
      <div className={`rounded-3xl bg-gradient-to-br p-[1.5px] ${sign.gradient}`}>
        <div className="flex items-center gap-4 rounded-[1.4rem] bg-night-900/80 p-4">
          <Art name={sign.id} className="size-24 shrink-0 animate-float" alt={sign.name} />
          <div className="flex-1">
            <h2 className="font-display text-xl font-bold">
              {sign.symbol} {sign.name}
            </h2>
            <p className="text-xs text-violet-200/80">
              {sign.dates} · {sign.element} · {sign.ruler}
            </p>
            <div className="mt-2 flex gap-4 text-xs font-bold text-gold-300">
              <button onClick={() => setPicking(true)} className="underline-offset-2 hover:underline">
                Change sign ⇄
              </button>
              <Link to={`/personality/${sign.id}`} className="underline-offset-2 hover:underline">
                See traits →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Day tabs */}
      <div className="glass flex p-1" role="tablist">
        {DAYS.map((d) => (
          <button
            key={d.offset}
            role="tab"
            aria-selected={offset === d.offset}
            onClick={() => setOffset(d.offset)}
            className={`flex-1 rounded-2xl py-2 text-sm font-bold transition ${
              offset === d.offset ? 'bg-gradient-to-r from-gold-200 to-gold-500 text-night-900' : 'text-violet-200/80'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Overall */}
      <Section key={h.date + sign.id} className="animate-pop">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-extrabold tracking-wider text-violet-200/90 uppercase">
            <Art name="crystal" className="size-8" /> Overall
          </h2>
          <StarRating value={h.overall.rating} size="text-lg" />
        </div>
        <p className="mt-2 leading-relaxed">{h.overall.text}</p>
        <p className="mt-2 text-sm text-gold-200/90">✦ {h.overall.tip}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-white/8 px-3 py-1">Mood: {h.mood.label}</span>
          <span className="rounded-full bg-white/8 px-3 py-1">Theme: {h.theme}</span>
        </div>
        <div className="mt-4">
          <Meter label="Cosmic energy" icon="sun" value={h.energy} />
        </div>
      </Section>

      {/* Categories */}
      {h.categories.map((c, i) => (
        <Section key={c.key + h.date}>
          <div className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-extrabold">
                <Art name={c.art} className="size-10" /> {c.label}
              </h3>
              <StarRating value={c.rating} />
            </div>
            <p className="mt-2 text-[15px] leading-relaxed text-violet-50/95">{c.text}</p>
            <p className="mt-2 text-sm text-gold-200/90">{c.tip}</p>
          </div>
        </Section>
      ))}

      {/* Lucky stuff */}
      <Section title="Your lucky charms" icon="clover">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-white/6 p-3">
            <p className="text-xs text-violet-200/70">Lucky numbers</p>
            <p className="mt-1 text-lg font-extrabold text-gold-300">{h.lucky.numbers.join(' · ')}</p>
          </div>
          <div className="rounded-2xl bg-white/6 p-3">
            <p className="text-xs text-violet-200/70">Lucky colour</p>
            <p className="mt-1 flex items-center gap-2 font-extrabold">
              <span className="size-4 rounded-full ring-2 ring-white/40" style={{ background: h.lucky.color.hex }} />
              {h.lucky.color.name}
            </p>
          </div>
          <div className="rounded-2xl bg-white/6 p-3">
            <p className="text-xs text-violet-200/70">Lucky time</p>
            <p className="mt-1 font-extrabold">{h.lucky.time}</p>
          </div>
          <div className="rounded-2xl bg-white/6 p-3">
            <p className="text-xs text-violet-200/70">Best match today</p>
            <p className="mt-1 flex items-center gap-1 font-extrabold">
              <Art name={h.lucky.buddy.id} className="size-8" /> {h.lucky.buddy.name}
            </p>
          </div>
          <div className="col-span-2 rounded-2xl bg-white/6 p-3">
            <p className="text-xs text-violet-200/70">Lucky charm</p>
            <p className="mt-1 font-extrabold capitalize">{h.lucky.item}</p>
          </div>
        </div>
      </Section>

      <div className="flex justify-center gap-3">
        <ShareButton
          label="Share my horoscope"
          card={() => ({
            images: [artUrl(sign.id)],
            title: sign.name,
            subtitle: `${dateLabel} · ${'★'.repeat(h.overall.rating)}${'☆'.repeat(5 - h.overall.rating)}`,
            body: `${h.overall.text}  Love: ${h.categories[0].text}  Lucky: ${h.lucky.numbers.join(', ')} · ${h.lucky.color.name}`,
          })}
        />
      </div>
    </div>
  )
}
