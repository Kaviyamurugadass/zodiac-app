import { SIGNS, type ZodiacSign } from '../data/signs'
import { seededRng, randInt } from './random'

export interface CompatResult {
  a: ZodiacSign
  b: ZodiacSign
  overall: number
  love: number
  friendship: number
  communication: number
  trust: number
  title: string
  text: string
}

// Distance around the zodiac wheel (0–6) decides the astrological aspect.
const ASPECTS: Record<number, { base: number; title: string; text: string }> = {
  0: {
    base: 76,
    title: 'Mirror match',
    text: 'You understand each other instantly — same dreams, same quirks. The challenge is that you also share the same blind spots, so take turns leading.',
  },
  1: {
    base: 56,
    title: 'Curious neighbours',
    text: 'Next-door signs see life quite differently, which can feel puzzling at first. With patience you teach each other exactly what you are missing.',
  },
  2: {
    base: 83,
    title: 'Easy friends',
    text: 'A friendly, fun and supportive pairing. Conversation flows, you cheer each other on and life together feels light.',
  },
  3: {
    base: 50,
    title: 'Spicy challenge',
    text: 'Sparks fly — sometimes romantic, sometimes frustrating! This match pushes you both to grow. Compromise is the secret ingredient.',
  },
  4: {
    base: 93,
    title: 'Soulmate flow',
    text: 'Same element, same rhythm. This is one of the most harmonious pairings in the zodiac — natural, warm and deeply understanding.',
  },
  5: {
    base: 58,
    title: 'Mysterious puzzle',
    text: 'You are wired very differently, which makes this match intriguing. It works best when you respect each other’s space and ways.',
  },
  6: {
    base: 78,
    title: 'Opposites attract',
    text: 'Magnetic polar opposites! You balance each other beautifully — what one lacks, the other brings. Keep the tug-of-war playful.',
  },
}

const clamp = (n: number) => Math.max(5, Math.min(99, n))

export function aspectDistance(a: ZodiacSign, b: ZodiacSign): number {
  const ia = SIGNS.indexOf(a)
  const ib = SIGNS.indexOf(b)
  const d = Math.abs(ia - ib) % 12
  return Math.min(d, 12 - d)
}

export function compatibility(a: ZodiacSign, b: ZodiacSign): CompatResult {
  const aspect = ASPECTS[aspectDistance(a, b)]
  const rng = seededRng([a.id, b.id].sort().join('+'))
  const jitter = () => randInt(-9, 9, rng)
  const love = clamp(aspect.base + jitter())
  const friendship = clamp(aspect.base + jitter())
  const communication = clamp(aspect.base + jitter())
  const trust = clamp(aspect.base + jitter())
  const overall = Math.round((love + friendship + communication + trust) / 4)
  return { a, b, overall, love, friendship, communication, trust, title: aspect.title, text: aspect.text }
}

/** Best matches for a sign, highest first. */
export function bestMatches(sign: ZodiacSign, count = 3): ZodiacSign[] {
  return SIGNS.filter((s) => s.id !== sign.id)
    .map((s) => ({ s, score: compatibility(sign, s).overall }))
    .sort((x, y) => y.score - x.score)
    .slice(0, count)
    .map((x) => x.s)
}
