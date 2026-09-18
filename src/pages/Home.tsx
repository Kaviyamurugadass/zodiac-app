import { Link } from 'react-router-dom'
import { SIGN_BY_ID } from '../data/signs'
import { generateHoroscope } from '../lib/horoscope'
import { useProfile, useStreak } from '../lib/storage'
import { StarRating } from '../components/ui'

const FEATURES = [
  { to: '/horoscope', title: 'Daily Horoscope', desc: 'Love, work, money & health', emoji: '✨', bg: 'from-violet-500/40 to-fuchsia-500/30' },
  { to: '/tarot', title: 'Tarot Reading', desc: 'Card of the day & spreads', emoji: '🃏', bg: 'from-indigo-500/40 to-sky-500/30' },
  { to: '/fortune', title: 'Fortune Cookie', desc: 'Crack open your luck', emoji: '🥠', bg: 'from-amber-500/40 to-orange-500/30' },
  { to: '/yes-no', title: 'Yes or No', desc: 'Ask the magic orb', emoji: '🔮', bg: 'from-purple-500/40 to-pink-500/30' },
  { to: '/coin', title: 'Heads or Tails', desc: 'Flip a lucky coin', emoji: '🪙', bg: 'from-yellow-500/40 to-amber-600/30' },
  { to: '/personality', title: 'Your Personality', desc: 'Traits, numerology & more', emoji: '🪞', bg: 'from-emerald-500/40 to-teal-500/30' },
  { to: '/compatibility', title: 'Love Match', desc: 'Zodiac compatibility', emoji: '💞', bg: 'from-rose-500/40 to-pink-500/30' },
  { to: '/profile', title: 'My Profile', desc: 'Birthday & streaks', emoji: '👤', bg: 'from-slate-500/40 to-violet-500/30' },
]

function greeting(): string {
  const h = new Date().getHours()
  if (h < 5) return 'Up with the stars'
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  if (h < 21) return 'Good evening'
  return 'Good night'
}

export default function Home() {
  const [profile] = useProfile()
  const [streak] = useStreak()
  const sign = profile.signId ? SIGN_BY_ID[profile.signId] : undefined
  const today = sign ? generateHoroscope(sign.id) : undefined

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between pt-3">
        <div>
          <p className="text-sm text-violet-200/80">
            {greeting()}
            {profile.name ? `, ${profile.name}` : ''} 🌙
          </p>
          <h1 className="font-display text-3xl font-bold text-gold">Zodiac Play</h1>
          <p className="text-xs text-violet-200/60">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <Link to="/profile" className="glass flex flex-col items-center px-3 py-2" aria-label="Daily streak">
          <span className="text-2xl leading-none animate-wiggle">🔥</span>
          <span className="mt-1 text-sm font-extrabold text-gold-300">{streak.count}</span>
          <span className="text-[10px] text-violet-200/70">day streak</span>
        </Link>
      </header>

      {sign && today ? (
        <Link
          to={`/horoscope/${sign.id}`}
          className={`block overflow-hidden rounded-3xl bg-gradient-to-br p-[1.5px] ${sign.gradient}`}
        >
          <div className="rounded-[1.4rem] bg-night-900/85 p-4">
            <div className="flex items-center gap-3">
              <span className="text-5xl animate-float">{sign.emoji}</span>
              <div className="flex-1">
                <p className="text-xs font-bold tracking-wider text-violet-200/70 uppercase">Today for {sign.name}</p>
                <StarRating value={today.overall.rating} size="text-lg" />
                <p className="text-xs text-violet-200/80">
                  Mood: {today.mood.emoji} {today.mood.label} · Theme: {today.theme}
                </p>
              </div>
            </div>
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed">{today.overall.text}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {today.categories.map((c) => (
                <span key={c.key} className="rounded-full bg-white/8 px-2.5 py-1">
                  {c.emoji} {c.rating}/5
                </span>
              ))}
            </div>
            <p className="mt-3 text-right text-sm font-bold text-gold-300">Read full horoscope →</p>
          </div>
        </Link>
      ) : (
        <Link to="/profile" className="glass block p-4">
          <p className="font-bold">🌟 Set your birthday</p>
          <p className="mt-1 text-sm text-violet-200/80">
            Add your birthday once and we will show your personal horoscope right here every day.
          </p>
        </Link>
      )}

      <div className="grid grid-cols-2 gap-3">
        {FEATURES.map((f, i) => (
          <Link
            key={f.to}
            to={f.to}
            className={`glass animate-pop bg-gradient-to-br p-4 transition active:scale-95 ${f.bg}`}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <span className="text-3xl">{f.emoji}</span>
            <p className="mt-2 leading-tight font-extrabold">{f.title}</p>
            <p className="mt-0.5 text-xs text-violet-100/75">{f.desc}</p>
          </Link>
        ))}
      </div>

      <p className="pb-2 text-center text-[11px] text-violet-200/50">
        For fun & reflection only ✦ Readings are playful, not predictions.
      </p>
    </div>
  )
}
