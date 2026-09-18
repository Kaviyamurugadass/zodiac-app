import { Link } from 'react-router-dom'
import { SIGN_BY_ID, signFromDate } from '../data/signs'
import { isIOS, isStandalone, useInstallPrompt } from '../lib/install'
import { EMPTY_PROFILE, useProfile, useStore, useStreak } from '../lib/storage'
import { PageHeader, Section, SignPicker } from '../components/ui'
import { Art } from '../components/Art'

export default function Profile() {
  const [profile, setProfile] = useProfile()
  const [streak] = useStreak()
  const [cookies] = useStore('cookies-opened', 0)
  const { canInstall, install } = useInstallPrompt()
  const sign = profile.signId ? SIGN_BY_ID[profile.signId] : undefined

  const onBirthday = (value: string) => {
    if (!value) return setProfile({ ...profile, birthday: '' })
    const [, m, d] = value.split('-').map(Number)
    setProfile({ ...profile, birthday: value, signId: signFromDate(m, d).id })
  }

  return (
    <div className="space-y-4">
      <PageHeader title="My Profile" subtitle="Saved only on this device" back={false} />

      <Section className="space-y-3">
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-violet-200/90">Your name</span>
          <input
            className="input"
            placeholder="What should we call you?"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value.slice(0, 30) })}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-violet-200/90">Birthday</span>
          <input
            type="date"
            className="input"
            value={profile.birthday}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => onBirthday(e.target.value)}
          />
        </label>
        {sign && (
          <div className="flex items-center gap-3 rounded-2xl bg-white/6 p-3">
            <Art name={sign.id} className="size-16" alt={sign.name} />
            <div className="flex-1">
              <p className="font-extrabold">{sign.name}</p>
              <p className="text-xs text-violet-200/70">{sign.dates}</p>
            </div>
            <Link to="/personality" className="text-sm font-bold text-gold-300">
              Traits →
            </Link>
          </div>
        )}
      </Section>

      {!profile.birthday && (
        <Section title="Or just pick your sign">
          <SignPicker compact value={profile.signId} onChange={(s) => setProfile({ ...profile, signId: s.id })} />
        </Section>
      )}

      <Section title="Your streak" icon="fire">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-white/6 p-3">
            <p className="text-2xl font-extrabold text-gold-300">{streak.count}</p>
            <p className="text-[11px] text-violet-200/70">Current</p>
          </div>
          <div className="rounded-2xl bg-white/6 p-3">
            <p className="text-2xl font-extrabold">{streak.best}</p>
            <p className="text-[11px] text-violet-200/70">Best</p>
          </div>
          <div className="rounded-2xl bg-white/6 p-3">
            <p className="text-2xl font-extrabold">{streak.total}</p>
            <p className="text-[11px] text-violet-200/70">Days visited</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-violet-200/80">
          Come back every day to keep your streak glowing. Cookies cracked: {cookies}
        </p>
      </Section>

      {!isStandalone() && (
        <Section title="Install the app" icon="star">
          {canInstall ? (
            <button className="btn-primary w-full" onClick={install}>
              Add Zodiac Play to home screen
            </button>
          ) : isIOS() ? (
            <p className="text-sm text-violet-100/90">
              In Safari, tap the <b>Share</b> button, then <b>Add to Home Screen</b>.
            </p>
          ) : (
            <p className="text-sm text-violet-100/90">
              Open your browser menu and choose <b>Install app</b> or <b>Add to Home screen</b>.
            </p>
          )}
        </Section>
      )}

      <button
        className="mx-auto block text-xs font-bold text-rose-300/80 underline"
        onClick={() => {
          if (confirm('Clear your name, birthday and sign from this device?')) setProfile(EMPTY_PROFILE)
        }}
      >
        Clear my profile
      </button>
    </div>
  )
}
