// Numerology life-path number and Chinese zodiac animal from a birthday.

export interface LifePath {
  number: number
  title: string
  text: string
}

const LIFE_PATHS: Record<number, Omit<LifePath, 'number'>> = {
  1: { title: 'The Leader', text: 'Independent, driven and original. You are here to pioneer and to trust your own path.' },
  2: { title: 'The Peacemaker', text: 'Gentle, intuitive and cooperative. You bring people together and sense what others need.' },
  3: { title: 'The Creator', text: 'Expressive, joyful and social. Your gift is inspiring others through words, art and laughter.' },
  4: { title: 'The Builder', text: 'Practical, loyal and hardworking. You create solid foundations that others can rely on.' },
  5: { title: 'The Adventurer', text: 'Free-spirited and curious. Change, travel and new experiences are your fuel.' },
  6: { title: 'The Nurturer', text: 'Caring, responsible and loving. Home, family and community are where you shine.' },
  7: { title: 'The Seeker', text: 'Thoughtful, analytical and spiritual. You look beneath the surface for deeper truths.' },
  8: { title: 'The Powerhouse', text: 'Ambitious and confident. You are built for success, leadership and abundance.' },
  9: { title: 'The Humanitarian', text: 'Compassionate and wise. You are here to give back and make the world kinder.' },
  11: { title: 'The Intuitive (Master)', text: 'A master number: highly intuitive, inspiring and sensitive — a natural visionary.' },
  22: { title: 'The Master Builder', text: 'A master number: you turn big dreams into real, lasting achievements.' },
  33: { title: 'The Master Teacher', text: 'A master number: deep compassion and a calling to uplift others.' },
}

function reduce(n: number): number {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split('').reduce((s, d) => s + Number(d), 0)
  }
  return n
}

export function lifePath(birthday: string): LifePath {
  const [y, m, d] = birthday.split('-').map(Number)
  const n = reduce(reduce(y) + reduce(m) + reduce(d))
  return { number: n, ...LIFE_PATHS[n] }
}

export interface ChineseSign {
  animal: string
  emoji: string
  traits: string
}

const ANIMALS: ChineseSign[] = [
  { animal: 'Rat', emoji: '🐀', traits: 'Quick-witted, resourceful and charming.' },
  { animal: 'Ox', emoji: '🐂', traits: 'Diligent, dependable and determined.' },
  { animal: 'Tiger', emoji: '🐅', traits: 'Brave, confident and competitive.' },
  { animal: 'Rabbit', emoji: '🐇', traits: 'Gentle, elegant and kind.' },
  { animal: 'Dragon', emoji: '🐉', traits: 'Ambitious, energetic and lucky.' },
  { animal: 'Snake', emoji: '🐍', traits: 'Wise, intuitive and graceful.' },
  { animal: 'Horse', emoji: '🐎', traits: 'Free-spirited, active and warm.' },
  { animal: 'Goat', emoji: '🐐', traits: 'Calm, creative and compassionate.' },
  { animal: 'Monkey', emoji: '🐒', traits: 'Clever, curious and playful.' },
  { animal: 'Rooster', emoji: '🐓', traits: 'Observant, hardworking and honest.' },
  { animal: 'Dog', emoji: '🐕', traits: 'Loyal, honest and protective.' },
  { animal: 'Pig', emoji: '🐖', traits: 'Generous, easy-going and sincere.' },
]

/** Uses the Gregorian year (simplified — ignores the lunar new year boundary). */
export function chineseZodiac(birthday: string): ChineseSign {
  const year = Number(birthday.slice(0, 4))
  return ANIMALS[(((year - 2020) % 12) + 12) % 12]
}

export function ageFrom(birthday: string): number {
  const b = new Date(birthday + 'T00:00:00')
  const now = new Date()
  let age = now.getFullYear() - b.getFullYear()
  if (now.getMonth() < b.getMonth() || (now.getMonth() === b.getMonth() && now.getDate() < b.getDate())) age--
  return age
}

export function daysUntilBirthday(birthday: string): number {
  const [, m, d] = birthday.split('-').map(Number)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  let next = new Date(now.getFullYear(), m - 1, d)
  if (next < today) next = new Date(now.getFullYear() + 1, m - 1, d)
  return Math.round((next.getTime() - today.getTime()) / 86400000)
}
