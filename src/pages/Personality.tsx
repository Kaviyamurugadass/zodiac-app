import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ELEMENT_INFO, MODALITY_INFO, SIGN_BY_ID, signFromDate } from '../data/signs'
import { bestMatches } from '../lib/compat'
import { ageFrom, chineseZodiac, daysUntilBirthday, lifePath } from '../lib/extras'
import { useProfile } from '../lib/storage'
import { PageHeader, Section, ShareButton, SignPicker } from '../components/ui'
import { Art, artUrl, rulerArt } from '../components/Art'

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

// Year >= 1900 so a half-typed year (0001, 0019…) doesn't count as a birthday
const isValidBirthday = (b: string) => /^\d{4}-\d{2}-\d{2}$/.test(b) && Number(b.slice(0, 4)) >= 1900 && ageFrom(b) >= 0
const today = () => new Date().toISOString().slice(0, 10)

/**
 * Shows a sign's traits. The sign comes from, in order:
 * the URL (/personality/leo), a birthday (typed here or saved in the profile),
 * or the sign saved in the profile. Birthday-only extras (numerology, Chinese
 * zodiac, age) appear only when a birthday is known.
 */
export default function Personality() {
  const { signId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [profile, setProfile] = useProfile()
  const [birthday, setBirthday] = useState<string>(
    signId ? '' : ((location.state as { birthday?: string } | null)?.birthday ?? profile.birthday),
  )
  const [picking, setPicking] = useState(false)

  const hasBirthday = !signId && isValidBirthday(birthday)
  const sign = signId
    ? SIGN_BY_ID[signId]
    : hasBirthday
      ? signFromDate(Number(birthday.slice(5, 7)), Number(birthday.slice(8, 10)))
      : profile.signId
        ? SIGN_BY_ID[profile.signId]
        : undefined

  const showSign = (id: string) => navigate(`/personality/${id}`)
  const showBirthday = (b: string) => {
    if (!isValidBirthday(b)) return
    setPicking(false)
    if (signId) navigate('/personality', { state: { birthday: b } })
    else setBirthday(b)
  }

  if (!sign || picking) {
    return (
      <div className="space-y-4">
        <PageHeader title="Your Personality" subtitle="Discover what the stars say about you" />
        <Section title="Pick your sign" icon="star">
          <SignPicker value={sign?.id} onChange={(s) => showSign(s.id)} />
        </Section>
        <div className="flex items-center gap-3 text-xs font-bold text-violet-200/60 uppercase">
          <span className="h-px flex-1 bg-white/15" /> or <span className="h-px flex-1 bg-white/15" />
        </div>
        <Section title="Don't know your sign?" icon="mirror">
          <p className="mb-3 text-sm text-violet-100/90">
            Enter your birthday and we'll find it — plus your numerology life path and Chinese zodiac.
          </p>
          <input
            type="date"
            className="input"
            max={today()}
            onChange={(e) => showBirthday(e.target.value)}
            aria-label="Your birthday"
          />
        </Section>
      </div>
    )
  }

  const el = ELEMENT_INFO[sign.element]
  const matches = bestMatches(sign, 3)
  const lp = hasBirthday ? lifePath(birthday) : undefined
  const cz = hasBirthday ? chineseZodiac(birthday) : undefined
  const untilBday = hasBirthday ? daysUntilBirthday(birthday) : 0
  const isMine = hasBirthday ? profile.birthday === birthday : profile.signId === sign.id

  const saveAsMine = () => {
    if (hasBirthday) setProfile({ ...profile, birthday, signId: sign.id })
    else {
      // keep a saved birthday only if it agrees with the chosen sign
      const keep =
        profile.birthday &&
        signFromDate(Number(profile.birthday.slice(5, 7)), Number(profile.birthday.slice(8, 10))).id === sign.id
      setProfile({ ...profile, signId: sign.id, birthday: keep ? profile.birthday : '' })
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title={hasBirthday ? 'Your Personality' : `${sign.name} Traits`}
        subtitle={
          hasBirthday
            ? new Date(birthday + 'T00:00:00').toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })
            : sign.dates
        }
      />

      <div className={`rounded-3xl bg-gradient-to-br p-[1.5px] ${sign.gradient}`}>
        <div className="rounded-[1.4rem] bg-night-900/80 p-5 text-center">
          <Art name={sign.id} className="mx-auto size-36 animate-float" alt={sign.name} />
          <h2 className="mt-2 font-display text-2xl font-bold">
            <span className="text-gold-300">{sign.symbol}</span> <span className="text-gold">{sign.name}</span>
          </h2>
          <p className="text-sm text-violet-200/80">{sign.dates}</p>
          <p className="mt-3 leading-relaxed">{sign.summary}</p>
          {hasBirthday && (
            <p className="mt-3 text-sm text-violet-200/80">
              {untilBday === 0 ? 'Happy birthday today!' : `${untilBday} days until your next birthday`} · Age {ageFrom(birthday)}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <button className="btn-ghost text-sm" onClick={() => setPicking(true)}>
          Change sign
        </button>
        {!isMine && (
          <button className="btn-ghost text-sm" onClick={saveAsMine}>
            {hasBirthday ? 'Save as my profile' : 'This is my sign'}
          </button>
        )}
        <Link to={`/horoscope/${sign.id}`} className="btn-ghost text-sm">
          Today's horoscope
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div className="glass p-3">
          <Art name={el.art} className="mx-auto size-12" />
          <p className="font-extrabold">{sign.element}</p>
          <p className="text-[10px] text-violet-200/70">Element</p>
        </div>
        <div className="glass p-3">
          <Art name="star" className="mx-auto size-12" />
          <p className="font-extrabold">{sign.modality}</p>
          <p className="text-[10px] text-violet-200/70">Modality</p>
        </div>
        <div className="glass p-3">
          <div className="flex justify-center -space-x-3">
            {rulerArt(sign.ruler).map((r) => (
              <Art key={r} name={r} className="size-12" />
            ))}
          </div>
          <p className="text-sm leading-tight font-extrabold">{sign.ruler}</p>
          <p className="text-[10px] text-violet-200/70">Ruler</p>
        </div>
      </div>
      <p className="px-1 text-sm text-violet-200/80">
        {el.text} {MODALITY_INFO[sign.modality]}
      </p>

      <Section title="Strengths" icon="sun">
        <Chips items={sign.strengths} tone="good" />
      </Section>
      <Section title="Weaknesses" icon="moon">
        <Chips items={sign.weaknesses} tone="bad" />
      </Section>
      <div className="grid grid-cols-2 gap-3">
        <Section title="Likes" icon="love">
          <ul className="space-y-1 text-sm">{sign.likes.map((l) => <li key={l}>• {l}</li>)}</ul>
        </Section>
        <Section title="Dislikes" icon="mars">
          <ul className="space-y-1 text-sm">{sign.dislikes.map((l) => <li key={l}>• {l}</li>)}</ul>
        </Section>
      </div>

      <Section title="In love" icon="hearts">
        <p className="leading-relaxed">{sign.loveStyle}</p>
        <p className="mt-3 text-sm text-violet-200/80">Best matches:</p>
        <div className="mt-2 flex gap-2">
          {matches.map((s) => (
            <Link key={s.id} to={`/personality/${s.id}`} className="flex-1 rounded-2xl bg-white/6 p-2 text-center text-sm font-bold">
              <Art name={s.id} className="mx-auto block size-12" />
              {s.name}
            </Link>
          ))}
        </div>
      </Section>

      <Section title="At work" icon="work">
        <p className="leading-relaxed">{sign.careerStyle}</p>
      </Section>

      <Section title="Lucky charms" icon="clover">
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

      {lp && cz ? (
        <>
          <Section title="Numerology life path" icon="star">
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

          <Section title="Chinese zodiac" icon="moon">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{cz.emoji}</span>
              <div>
                <p className="font-extrabold">Year of the {cz.animal}</p>
                <p className="text-sm text-violet-100/90">{cz.traits}</p>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-violet-200/60">Based on birth year; January/February birthdays may fall in the previous lunar year.</p>
          </Section>
        </>
      ) : (
        <Section title="Want more?" icon="mirror">
          <p className="mb-3 text-sm text-violet-100/90">
            Add a birthday to unlock the numerology life path, Chinese zodiac and birthday countdown.
          </p>
          <input type="date" className="input" max={today()} onChange={(e) => showBirthday(e.target.value)} aria-label="Birthday" />
        </Section>
      )}

      <div className="flex justify-center">
        <ShareButton
          label={hasBirthday ? 'Share my traits' : `Share ${sign.name} traits`}
          card={() => ({
            images: [artUrl(sign.id)],
            title: hasBirthday ? `I'm a ${sign.name}` : sign.name,
            subtitle: lp && cz ? `${sign.element} · Life path ${lp.number} · ${cz.animal}` : `${sign.element} · ${sign.modality} · ${sign.ruler}`,
            body: `${sign.summary}  Strengths: ${sign.strengths.slice(0, 3).join(', ')}.`,
          })}
        />
      </div>
    </div>
  )
}
