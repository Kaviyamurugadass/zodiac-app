import { SIGNS, type ZodiacSign } from '../data/signs'
import {
  CAREER, HEALTH, LOVE, LUCKY_COLORS, LUCKY_ITEMS, LUCKY_TIMES, MONEY, MOODS, OVERALL, THEMES_OF_DAY,
  type Tone,
} from '../data/horoscopeText'
import { dateKey, pick, seededRng, uniqueInts, type Rng } from './random'
import { bestMatches } from './compat'

export type Category = 'love' | 'career' | 'money' | 'health'

export interface CategoryReading {
  key: Category
  label: string
  art: string
  rating: number
  text: string
  tip: string
}

export interface Horoscope {
  date: string
  sign: ZodiacSign
  overall: { rating: number; text: string; tip: string }
  categories: CategoryReading[]
  mood: { label: string }
  energy: number
  theme: string
  lucky: {
    numbers: number[]
    color: { name: string; hex: string }
    time: string
    item: string
    buddy: ZodiacSign
  }
}

const CATEGORY_META: Record<Category, { label: string; art: string; pool: typeof LOVE }> = {
  love: { label: 'Love', art: 'love', pool: LOVE },
  career: { label: 'Work & Career', art: 'work', pool: CAREER },
  money: { label: 'Money', art: 'money', pool: MONEY },
  health: { label: 'Health', art: 'health', pool: HEALTH },
}

// Weighted so most days feel positive-to-average, with the occasional tough one.
function rollRating(rng: Rng): number {
  const r = rng()
  if (r < 0.07) return 1
  if (r < 0.22) return 2
  if (r < 0.5) return 3
  if (r < 0.8) return 4
  return 5
}

function toneOf(rating: number): Tone {
  return rating >= 4 ? 'high' : rating === 3 ? 'mid' : 'low'
}

function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? '')
}

export function generateHoroscope(signId: string, date: Date = new Date()): Horoscope {
  const sign = SIGNS.find((s) => s.id === signId) ?? SIGNS[0]
  const key = dateKey(date)
  const rng = seededRng(`${sign.id}|${key}`)

  const color = pick(LUCKY_COLORS, rng)
  const time = pick(LUCKY_TIMES, rng)
  const buddy = pick(bestMatches(sign, 4), rng)
  const numbers = uniqueInts(3, 1, 49, rng)
  const vars: Record<string, string> = {
    sign: sign.name,
    ruler: sign.ruler,
    element: sign.element.toLowerCase(),
    color: color.name.toLowerCase(),
    time,
    buddy: buddy.name,
    lucky: String(numbers[0]),
  }

  const categories = (Object.keys(CATEGORY_META) as Category[]).map((k) => {
    const meta = CATEGORY_META[k]
    const rating = rollRating(rng)
    return {
      key: k,
      label: meta.label,
      art: meta.art,
      rating,
      text: fill(pick(meta.pool[toneOf(rating)], rng), vars),
      tip: fill(pick(meta.pool.tips, rng), vars),
    }
  })

  const avg = categories.reduce((s, c) => s + c.rating, 0) / categories.length
  const overallRating = Math.max(1, Math.min(5, Math.round(avg + (rng() - 0.5))))

  return {
    date: key,
    sign,
    overall: {
      rating: overallRating,
      text: fill(pick(OVERALL[toneOf(overallRating)], rng), vars),
      tip: fill(pick(OVERALL.tips, rng), vars),
    },
    categories,
    mood: pick(MOODS, rng),
    energy: Math.round(40 + avg * 10 + rng() * 10),
    theme: pick(THEMES_OF_DAY, rng),
    lucky: { numbers, color, time, item: pick(LUCKY_ITEMS, rng), buddy },
  }
}
