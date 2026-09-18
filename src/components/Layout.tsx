import { useEffect, useMemo } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Art } from './Art'

function StarField() {
  const stars = useMemo(
    () =>
      Array.from({ length: 60 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 3,
      })),
    [],
  )
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

const TABS = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/horoscope', label: 'Horoscope', icon: 'star' },
  { to: '/tarot', label: 'Tarot', icon: 'tarot' },
  { to: '/compatibility', label: 'Match', icon: 'hearts' },
  { to: '/profile', label: 'Me', icon: 'user' },
]

export default function Layout() {
  const { pathname } = useLocation()
  // Braces matter: newer browsers return a Promise from scrollTo, and React
  // would treat any returned value as a cleanup function.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="mx-auto min-h-dvh max-w-md px-4 pt-[max(env(safe-area-inset-top),0.75rem)] pb-28">
      <StarField />
      <main key={pathname} className="animate-fade-up">
        <Outlet />
      </main>
      <nav
        className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md px-3 pb-[max(env(safe-area-inset-bottom),0.6rem)]"
        aria-label="Main"
      >
        <div className="glass flex justify-around rounded-3xl bg-night-900/70 px-1 py-1.5 shadow-2xl shadow-black/50">
          {TABS.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.to === '/'}
              className={({ isActive }) =>
                `group flex min-w-14 flex-col items-center rounded-2xl px-2 py-1 text-[11px] font-bold transition ${
                  isActive ? 'active bg-white/12 text-gold-300' : 'text-violet-200/70'
                }`
              }
            >
              <Art
                name={t.icon}
                className="size-8 opacity-60 grayscale-[35%] transition group-[.active]:scale-110 group-[.active]:opacity-100 group-[.active]:grayscale-0"
              />
              <span className="mt-0.5">{t.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
