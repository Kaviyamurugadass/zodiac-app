import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ELEMENT_INFO, MODALITY_INFO, signFromDate } from '../data/signs'
import { bestMatches } from '../lib/compat'
import { ageFrom, chineseZodiac, daysUntilBirthday, lifePath } from '../lib/extras'
import { useProfile } from '../lib/storage'
import { PageHeader, Section, ShareButton } from '../components/ui'

function Chips({ items, tone }: { items: string[]; tone: 'good' | 'bad' | 'plain' }) {
  const cls = {
    good: 'bg-emerald-400/15 text-emerald-200 ring-emerald-300/30',
    bad: 'bg-rose-400/15 text-rose-200 ring-rose-300/30',
    plain: 'bg-white/8 text-violet-100 ring-white/10',
  }[tone]
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((t) => (
        <span key={t} className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${cls}`}>
          {t}
        </span>
      ))}
    </div>
  )
}

export default function Personality() {
  const [profile, setProfile] = useProfile()
  const [birthday, setBirthday] = useState(profile.birthday)
  const valid = /^\d{4}-\d{2}-\d{2}$/.test(birthday) && ageFrom(birthday) >= 0

  if (!valid) {
    return (
      <div className="space-y-4">
        <PageHeader title="Your Personality" subtitle="Discover what the stars say about you" />
        <Section className="space-y-3 text-center">
          <p className="text-5xl animate-float">🪞</p>
          <p>Enter your birthday to reveal your zodiac traits, element, numerology life path and Chinese zodiac.</p>
          <input
            type="date"
            className="input"
            value={birthday}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setBirthday(e.target.value)}
            aria-label="Your birthday"
          />
        </Section>
      </div>
    )
  }

  const [, m, d] = birthday.split('-').map(Number)
  const sign = signFromDate(m, d)
  const el = ELEMENT_INFO[sign.element]
  const lp = lifePath(birthday)
  const cz = chineseZodiac(birthday)
  const matches = bestMatches(sign, 3)
  const untilBday = daysUntilBirthday(birthday)
  const isSaved = profile.birthday === birthday

  return (
    <div className="space-y-4">
      <PageHeader title="Your Personality" subtitle={new Date(birthday + 'T00:00:00').toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })} />

      <div className={`rounded-3xl bg-gradient-to-br p-[1.5px] ${sign.gradient}`}>
        <div className="rounded-[1.4rem] bg-night-900/80 p-5 text-center">
          <p className="text-7xl animate-float">{sign.emoji}</p>
          <h2 className="mt-2 font-display text-2xl font-bold">
            <span className="text-gold-300">{sign.symbol}</span> <span className="text-gold">{sign.name}</span>
          </h2>
          <p className="text-sm text-violet-200/80">{sign.dates}</p>
          <p className="mt-3 leading-relaxed">{sign.summary}</p>
          <p className="mt-3 text-sm text-violet-200/80">
            🎂 {untilBday === 0 ? 'Happy birthday today! 🎉' : `${untilBday} days until your next birthday`} · Age {ageFrom(birthday)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <input type="date" className="input max-w-44 py-2 text-sm" value={birthday} onChange={(e) => setBirthday(e.target.value)} aria-label="Change birthday" />
        {!isSaved && (
          <button
            className="btn-ghost text-sm"
            onClick={() => setProfile({ ...profile, birthday, signId: sign.id })}
          >
            💾 Save as my profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div className="glass p-3">
          <p className="text-2xl">{el.emoji}</p>
          <p className="font-extrabold">{sign.element}</p>
          <p className="text-[10px] text-violet-200/70">Element</p>
        </div>
        <div className="glass p-3">
          <p className="text-2xl">🧭</p>
          <p className="font-extrabold">{sign.modality}</p>
          <p className="text-[10px] text-violet-200/70">Modality</p>
        </div>
        <div className="glass p-3">
          <p className="text-2xl">🪐</p>
          <p className="text-sm leading-tight font-extrabold">{sign.ruler}</p>
          <p className="text-[10px] text-violet-200/70">Ruler</p>
        </div>
      </div>
      <p className="px-1 text-sm text-violet-200/80">
        {el.text} {MODALITY_INFO[sign.modality]}
      </p>

      <Section title="💪 Strengths">
        <Chips items={sign.strengths} tone="good" />
      </Section>
      <Section title="🙈 Weaknesses">
        <Chips items={sign.weaknesses} tone="bad" />
      </Section>
      <div className="grid grid-cols-2 gap-3">
        <Section title="😍 Likes">
          <ul className="space-y-1 text-sm">{sign.likes.map((l) => <li key={l}>• {l}</li>)}</ul>
        </Section>
        <Section title="😤 Dislikes">
          <ul className="space-y-1 text-sm">{sign.dislikes.map((l) => <li key={l}>• {l}</li>)}</ul>
        </Section>
      </div>

      <Section title="💖 In love">
        <p className="leading-relaxed">{sign.loveStyle}</p>
        <p className="mt-3 text-sm text-violet-200/80">Best matches:</p>
        <div className="mt-2 flex gap-2">
          {matches.map((s) => (
            <Link key={s.id} to="/compatibility" className="flex-1 rounded-2xl bg-white/6 p-2 text-center text-sm font-bold">
              <span className="block text-2xl">{s.emoji}</span>
              {s.name}
            </Link>
          ))}
        </div>
      </Section>

      <Section title="💼 At work">
        <p className="leading-relaxed">{sign.careerStyle}</p>
      </Section>

      <Section title="🍀 Lucky charms">
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div className="rounded-2xl bg-white/6 p-2">
            <p className="text-[10px] text-violet-200/70">Day</p>
            <p className="font-extrabold">{sign.luckyDay}</p>
          </div>
          <div className="rounded-2xl bg-white/6 p-2">
            <p className="text-[10px] text-violet-200/70">Colours</p>
            <p className="font-extrabold">{sign.luckyColors.join(', ')}</p>
          </div>
          <div className="rounded-2xl bg-white/6 p-2">
            <p className="text-[10px] text-violet-200/70">Gemstone</p>
            <p className="font-extrabold">{sign.gemstone}</p>
          </div>
        </div>
      </Section>

      <Section title="🔢 Numerology life path">
        <div className="flex items-center gap-4">
          <span className="grid size-16 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold-200 to-gold-500 font-display text-3xl font-bold text-night-900">
            {lp.number}
          </span>
          <div>
            <p className="font-extrabold">{lp.title}</p>
            <p className="text-sm leading-relaxed text-violet-100/90">{lp.text}</p>
          </div>
        </div>
      </Section>

      <Section title="🏮 Chinese zodiac">
        <div className="flex items-center gap-4">
          <span className="text-5xl">{cz.emoji}</span>
          <div>
            <p className="font-extrabold">Year of the {cz.animal}</p>
            <p className="text-sm text-violet-100/90">{cz.traits}</p>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-violet-200/60">Based on birth year; January/February birthdays may fall in the previous lunar year.</p>
      </Section>

      <div className="flex justify-center">
        <ShareButton
          label="Share my traits"
          card={() => ({
            emoji: sign.emoji,
            title: `I'm a ${sign.name}`,
            subtitle: `${sign.element} · Life path ${lp.number} · ${cz.animal}`,
            body: `${sign.summary}  Strengths: ${sign.strengths.slice(0, 3).join(', ')}.`,
          })}
        />
      </div>
    </div>
  )
}
