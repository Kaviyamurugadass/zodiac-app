export type Element = 'Fire' | 'Earth' | 'Air' | 'Water'
export type Modality = 'Cardinal' | 'Fixed' | 'Mutable'

export interface ZodiacSign {
  id: string
  name: string
  symbol: string
  dates: string
  /** [month, day] inclusive start, 1-based month */
  start: [number, number]
  element: Element
  modality: Modality
  ruler: string
  color: string
  gradient: string
  strengths: string[]
  weaknesses: string[]
  likes: string[]
  dislikes: string[]
  summary: string
  loveStyle: string
  careerStyle: string
  luckyDay: string
  luckyColors: string[]
  gemstone: string
}

export const SIGNS: ZodiacSign[] = [
  {
    id: 'aries', name: 'Aries', symbol: '♈', dates: 'Mar 21 – Apr 19', start: [3, 21],
    element: 'Fire', modality: 'Cardinal', ruler: 'Mars', color: '#ff6b6b', gradient: 'from-rose-500 to-orange-400',
    strengths: ['Courageous', 'Determined', 'Confident', 'Enthusiastic', 'Honest'],
    weaknesses: ['Impatient', 'Short-tempered', 'Impulsive', 'Competitive to a fault'],
    likes: ['Being first', 'Challenges', 'Sports', 'Leadership roles'],
    dislikes: ['Waiting', 'Inactivity', 'Being told what to do'],
    summary: 'The spark of the zodiac. Aries charges forward with bold energy, loves a challenge and inspires everyone around them to get moving.',
    loveStyle: 'Passionate and direct — you fall fast, love loudly and appreciate a partner who can keep up with your adventures.',
    careerStyle: 'A natural starter. You thrive where speed, initiative and leadership are rewarded.',
    luckyDay: 'Tuesday', luckyColors: ['Red', 'Scarlet'], gemstone: 'Diamond',
  },
  {
    id: 'taurus', name: 'Taurus', symbol: '♉', dates: 'Apr 20 – May 20', start: [4, 20],
    element: 'Earth', modality: 'Fixed', ruler: 'Venus', color: '#7bc96f', gradient: 'from-emerald-500 to-lime-400',
    strengths: ['Reliable', 'Patient', 'Practical', 'Devoted', 'Sensual'],
    weaknesses: ['Stubborn', 'Possessive', 'Resistant to change'],
    likes: ['Good food', 'Comfort', 'Nature', 'Music', 'Quality things'],
    dislikes: ['Sudden changes', 'Complications', 'Being rushed'],
    summary: 'Grounded and steady, Taurus builds a beautiful life one solid step at a time and knows how to enjoy every bit of it.',
    loveStyle: 'Loyal and affectionate — you show love through time, touch and thoughtful little comforts.',
    careerStyle: 'Steady and dependable. You shine in roles that reward persistence, craft and financial sense.',
    luckyDay: 'Friday', luckyColors: ['Green', 'Pink'], gemstone: 'Emerald',
  },
  {
    id: 'gemini', name: 'Gemini', symbol: '♊', dates: 'May 21 – Jun 20', start: [5, 21],
    element: 'Air', modality: 'Mutable', ruler: 'Mercury', color: '#ffd166', gradient: 'from-amber-400 to-yellow-300',
    strengths: ['Curious', 'Witty', 'Adaptable', 'Sociable', 'Quick learner'],
    weaknesses: ['Restless', 'Indecisive', 'Easily bored', 'Inconsistent'],
    likes: ['Conversation', 'Books', 'Travel', 'Learning new things'],
    dislikes: ['Routine', 'Being alone too long', 'Boredom'],
    summary: 'The social butterfly with a brilliant mind. Gemini collects ideas, stories and friends everywhere they go.',
    loveStyle: 'Playful and flirty — mental chemistry is everything, and a partner who can banter wins your heart.',
    careerStyle: 'A communicator. Writing, media, sales and anything fast-paced keep your mind happy.',
    luckyDay: 'Wednesday', luckyColors: ['Yellow', 'Light green'], gemstone: 'Agate',
  },
  {
    id: 'cancer', name: 'Cancer', symbol: '♋', dates: 'Jun 21 – Jul 22', start: [6, 21],
    element: 'Water', modality: 'Cardinal', ruler: 'Moon', color: '#9ad1ff', gradient: 'from-sky-400 to-indigo-400',
    strengths: ['Caring', 'Intuitive', 'Loyal', 'Protective', 'Imaginative'],
    weaknesses: ['Moody', 'Overly sensitive', 'Clingy', 'Holds grudges'],
    likes: ['Home', 'Family', 'Cooking', 'Nostalgia', 'Deep talks'],
    dislikes: ['Strangers prying', 'Criticism of loved ones', 'Superficiality'],
    summary: 'The heart of the zodiac. Cancer nurtures, protects and remembers — and makes everyone feel at home.',
    loveStyle: 'Devoted and nurturing — you want a safe harbour and you build one for the person you love.',
    careerStyle: 'Caring roles, hospitality, teaching and creative work let your intuition lead.',
    luckyDay: 'Monday', luckyColors: ['Silver', 'White'], gemstone: 'Pearl',
  },
  {
    id: 'leo', name: 'Leo', symbol: '♌', dates: 'Jul 23 – Aug 22', start: [7, 23],
    element: 'Fire', modality: 'Fixed', ruler: 'Sun', color: '#ffa94d', gradient: 'from-orange-400 to-yellow-400',
    strengths: ['Generous', 'Warm-hearted', 'Creative', 'Charismatic', 'Loyal'],
    weaknesses: ['Proud', 'Dramatic', 'Needs attention', 'Stubborn'],
    likes: ['The spotlight', 'Celebrations', 'Compliments', 'Luxury'],
    dislikes: ['Being ignored', 'Harsh reality', 'Not being treated like royalty'],
    summary: 'Sunshine in human form. Leo lights up every room with warmth, creativity and a big, generous heart.',
    loveStyle: 'Romantic and grand — you love with big gestures and expect to be adored in return.',
    careerStyle: 'Born to lead and perform. Creative, public-facing or management roles suit you.',
    luckyDay: 'Sunday', luckyColors: ['Gold', 'Orange'], gemstone: 'Ruby',
  },
  {
    id: 'virgo', name: 'Virgo', symbol: '♍', dates: 'Aug 23 – Sep 22', start: [8, 23],
    element: 'Earth', modality: 'Mutable', ruler: 'Mercury', color: '#b5e48c', gradient: 'from-lime-400 to-teal-400',
    strengths: ['Analytical', 'Kind', 'Hardworking', 'Practical', 'Detail-oriented'],
    weaknesses: ['Overcritical', 'Worrier', 'Perfectionist', 'Shy'],
    likes: ['Organisation', 'Healthy living', 'Books', 'Helping others'],
    dislikes: ['Mess', 'Rudeness', 'Asking for help'],
    summary: 'The quiet perfectionist. Virgo notices everything, improves everything and helps everyone — often without being asked.',
    loveStyle: 'Thoughtful and devoted — you show love through acts of service and remembering the little things.',
    careerStyle: 'Precise and reliable. Health, research, editing, analysis and planning are your arenas.',
    luckyDay: 'Wednesday', luckyColors: ['Grey', 'Beige'], gemstone: 'Sapphire',
  },
  {
    id: 'libra', name: 'Libra', symbol: '♎', dates: 'Sep 23 – Oct 22', start: [9, 23],
    element: 'Air', modality: 'Cardinal', ruler: 'Venus', color: '#f7a1c4', gradient: 'from-pink-400 to-fuchsia-400',
    strengths: ['Diplomatic', 'Fair-minded', 'Social', 'Gracious', 'Romantic'],
    weaknesses: ['Indecisive', 'Avoids conflict', 'People-pleaser'],
    likes: ['Harmony', 'Beauty', 'Art', 'Sharing with others'],
    dislikes: ['Injustice', 'Violence', 'Loudness', 'Conformity'],
    summary: 'The peacemaker with impeccable taste. Libra seeks balance, beauty and fairness in everything.',
    loveStyle: 'Charming and partnership-minded — you blossom in a relationship built on equality and romance.',
    careerStyle: 'Great with people. Law, design, diplomacy, HR and the arts reward your balance.',
    luckyDay: 'Friday', luckyColors: ['Pink', 'Light blue'], gemstone: 'Opal',
  },
  {
    id: 'scorpio', name: 'Scorpio', symbol: '♏', dates: 'Oct 23 – Nov 21', start: [10, 23],
    element: 'Water', modality: 'Fixed', ruler: 'Pluto & Mars', color: '#c77dff', gradient: 'from-purple-600 to-rose-500',
    strengths: ['Passionate', 'Resourceful', 'Brave', 'Loyal', 'Perceptive'],
    weaknesses: ['Jealous', 'Secretive', 'Intense', 'Distrusting'],
    likes: ['Truth', 'Mysteries', 'Deep connections', 'Being right'],
    dislikes: ['Dishonesty', 'Revealing secrets', 'Passive people'],
    summary: 'Magnetic and mysterious. Scorpio feels everything deeply and transforms every challenge into power.',
    loveStyle: 'All or nothing — intensely loyal, deeply emotional and looking for a soul-level bond.',
    careerStyle: 'A strategist. Research, psychology, finance and investigation suit your laser focus.',
    luckyDay: 'Tuesday', luckyColors: ['Maroon', 'Black'], gemstone: 'Topaz',
  },
  {
    id: 'sagittarius', name: 'Sagittarius', symbol: '♐', dates: 'Nov 22 – Dec 21', start: [11, 22],
    element: 'Fire', modality: 'Mutable', ruler: 'Jupiter', color: '#ff9f68', gradient: 'from-orange-500 to-violet-500',
    strengths: ['Optimistic', 'Adventurous', 'Funny', 'Generous', 'Philosophical'],
    weaknesses: ['Impatient', 'Tactless', 'Overpromises', 'Restless'],
    likes: ['Travel', 'Freedom', 'Philosophy', 'Being outdoors'],
    dislikes: ['Clingy people', 'Being constrained', 'Details'],
    summary: 'The explorer of the zodiac. Sagittarius chases horizons, big ideas and a good laugh wherever they are.',
    loveStyle: 'Fun and free-spirited — you need a partner who is also your best adventure buddy.',
    careerStyle: 'Teaching, travel, publishing and entrepreneurship keep your fire burning.',
    luckyDay: 'Thursday', luckyColors: ['Purple', 'Blue'], gemstone: 'Turquoise',
  },
  {
    id: 'capricorn', name: 'Capricorn', symbol: '♑', dates: 'Dec 22 – Jan 19', start: [12, 22],
    element: 'Earth', modality: 'Cardinal', ruler: 'Saturn', color: '#a3b18a', gradient: 'from-stone-500 to-emerald-600',
    strengths: ['Disciplined', 'Responsible', 'Ambitious', 'Patient', 'Wise'],
    weaknesses: ['Pessimistic', 'Workaholic', 'Unforgiving', 'Rigid'],
    likes: ['Tradition', 'Quality craftsmanship', 'Achievement', 'Family'],
    dislikes: ['Almost everything at some point', 'Laziness', 'Unreliability'],
    summary: 'The mountain climber. Capricorn plays the long game and always, always reaches the summit.',
    loveStyle: 'Slow to open up but fiercely committed — you build love to last a lifetime.',
    careerStyle: 'Management, finance, engineering and anything with a clear ladder to climb.',
    luckyDay: 'Saturday', luckyColors: ['Brown', 'Dark green'], gemstone: 'Garnet',
  },
  {
    id: 'aquarius', name: 'Aquarius', symbol: '♒', dates: 'Jan 20 – Feb 18', start: [1, 20],
    element: 'Air', modality: 'Fixed', ruler: 'Uranus & Saturn', color: '#64dfdf', gradient: 'from-cyan-400 to-blue-500',
    strengths: ['Original', 'Independent', 'Humanitarian', 'Inventive', 'Friendly'],
    weaknesses: ['Aloof', 'Unpredictable', 'Stubborn about ideas'],
    likes: ['Causes', 'Technology', 'Intellectual chats', 'Being unique'],
    dislikes: ['Limitations', 'Broken promises', 'Dull people'],
    summary: 'The visionary rebel. Aquarius thinks decades ahead and dreams of a better world for everyone.',
    loveStyle: 'Friendship first — you need freedom, honesty and someone who loves your weird side.',
    careerStyle: 'Tech, science, activism and innovation — anywhere you can change the system.',
    luckyDay: 'Saturday', luckyColors: ['Electric blue', 'Silver'], gemstone: 'Amethyst',
  },
  {
    id: 'pisces', name: 'Pisces', symbol: '♓', dates: 'Feb 19 – Mar 20', start: [2, 19],
    element: 'Water', modality: 'Mutable', ruler: 'Neptune & Jupiter', color: '#8ecae6', gradient: 'from-teal-400 to-indigo-500',
    strengths: ['Compassionate', 'Artistic', 'Intuitive', 'Gentle', 'Wise'],
    weaknesses: ['Escapist', 'Overly trusting', 'Sad at times', 'Indecisive'],
    likes: ['Daydreaming', 'Music', 'Romance', 'Spirituality', 'Water'],
    dislikes: ['Know-it-alls', 'Cruelty', 'Being criticised'],
    summary: 'The dreamer and empath. Pisces swims between worlds, feeling deeply and creating magic from emotion.',
    loveStyle: 'Deeply romantic — you love with your whole soul and dream of a fairytale connection.',
    careerStyle: 'Art, music, healing and helping professions let your imagination and empathy flow.',
    luckyDay: 'Thursday', luckyColors: ['Sea green', 'Lavender'], gemstone: 'Aquamarine',
  },
]

export const SIGN_BY_ID: Record<string, ZodiacSign> = Object.fromEntries(SIGNS.map((s) => [s.id, s]))

export function signFromDate(month: number, day: number): ZodiacSign {
  // Walk signs in calendar order and find the last one whose start is <= the date.
  const ordered = [...SIGNS].sort((a, b) => a.start[0] - b.start[0] || a.start[1] - b.start[1])
  let found = ordered[ordered.length - 1] // Capricorn wraps around New Year
  for (const s of ordered) {
    if (month > s.start[0] || (month === s.start[0] && day >= s.start[1])) found = s
  }
  return found
}

export const ELEMENT_INFO: Record<Element, { art: string; text: string }> = {
  Fire: { art: 'fire', text: 'Energetic, passionate and action-driven.' },
  Earth: { art: 'earth', text: 'Grounded, practical and dependable.' },
  Air: { art: 'air', text: 'Intellectual, social and communicative.' },
  Water: { art: 'water', text: 'Emotional, intuitive and deeply feeling.' },
}

export const MODALITY_INFO: Record<Modality, string> = {
  Cardinal: 'Initiator — you start things and lead the way.',
  Fixed: 'Stabiliser — you persist, commit and see things through.',
  Mutable: 'Adapter — you flow, change and connect ideas.',
}
