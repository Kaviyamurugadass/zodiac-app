import { useCallback, useEffect, useState } from 'react'
import { addDays, dateKey } from './random'

const PREFIX = 'zodiac-play:'

export function readStore<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function writeStore<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
    window.dispatchEvent(new CustomEvent('zodiac-store', { detail: key }))
  } catch {
    /* storage unavailable (private mode) — app still works, just forgets */
  }
}

/** useState that persists to localStorage and stays in sync across components. */
export function useStore<T>(key: string, fallback: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => readStore(key, fallback))

  useEffect(() => {
    const onChange = (e: Event) => {
      if ((e as CustomEvent).detail === key) setValue(readStore(key, fallback))
    }
    window.addEventListener('zodiac-store', onChange)
    return () => window.removeEventListener('zodiac-store', onChange)
  }, [key])

  const set = useCallback(
    (v: T | ((prev: T) => T)) => {
      const next = typeof v === 'function' ? (v as (p: T) => T)(readStore(key, fallback)) : v
      setValue(next)
      writeStore(key, next)
    },
    [key],
  )

  return [value, set]
}

// ---------- Profile ----------

export interface Profile {
  name: string
  birthday: string // YYYY-MM-DD, may be empty
  signId: string // may be empty
}

export const EMPTY_PROFILE: Profile = { name: '', birthday: '', signId: '' }

export function useProfile() {
  return useStore<Profile>('profile', EMPTY_PROFILE)
}

// ---------- Daily streak ----------

export interface Streak {
  count: number
  best: number
  last: string // date key of last visit
  total: number // total distinct days visited
}

const EMPTY_STREAK: Streak = { count: 0, best: 0, last: '', total: 0 }

/** Call once per app load; bumps the streak if this is the first visit today. */
export function touchStreak(): Streak {
  const s = readStore<Streak>('streak', EMPTY_STREAK)
  const today = dateKey()
  if (s.last === today) return s
  const yesterday = dateKey(addDays(new Date(), -1))
  const count = s.last === yesterday ? s.count + 1 : 1
  const next = { count, best: Math.max(s.best, count), last: today, total: s.total + 1 }
  writeStore('streak', next)
  return next
}

export function useStreak() {
  return useStore<Streak>('streak', EMPTY_STREAK)
}
