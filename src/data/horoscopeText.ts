// Phrase pools for the offline horoscope generator.
// Placeholders: {sign} {ruler} {element} {color} {time} {buddy}
// Each category has lines for a high / mid / low day plus neutral tips.

export type Tone = 'high' | 'mid' | 'low'

interface Pool {
  high: string[]
  mid: string[]
  low: string[]
  tips: string[]
}

export const OVERALL: Pool = {
  high: [
    'The stars are firmly on your side today, {sign}. Energy flows easily and doors open with the slightest push.',
    'A bright, lucky current runs through your day. {ruler} lends you extra charm, so say yes to what excites you.',
    'Today feels like a fresh page. Your confidence is glowing and people notice — ride this wave.',
    'Cosmic tailwinds! Plans that felt stuck start moving, and a small win early on sets a joyful tone.',
    'Your natural {element} energy is turned all the way up. Trust your instincts; they are unusually sharp.',
    'Something you have been hoping for takes a step closer. Keep your eyes open for a pleasant surprise.',
    'Good vibes are contagious today, and you are the source. Share them generously.',
    'This is one of those days where timing works in your favour. Act on the idea you keep coming back to.',
  ],
  mid: [
    'A steady, balanced day, {sign}. Nothing dramatic — just good progress if you stay focused.',
    'Mixed signals from the sky mean you should pick one priority and give it your full attention.',
    'The day starts slowly but picks up. Save important conversations for the afternoon.',
    'You are in a reflective mood. Use it to tidy loose ends rather than start something brand new.',
    '{ruler} asks you to pace yourself today. Small, consistent steps beat one big leap.',
    'An ordinary day with a hidden gem in it — a kind word, a good idea or a helpful connection.',
    'Balance is the theme. Give time to both your duties and your joys and the day will feel complete.',
    'Your {element} nature wants to rush ahead, but a little patience pays off today.',
  ],
  low: [
    'The cosmic weather is a bit cloudy today, {sign}. Keep plans simple and be gentle with yourself.',
    'Minor hiccups may test your patience. Breathe, laugh it off and do not take things personally.',
    'Energy dips a little today. It is a perfect excuse to rest, recharge and say no to extra tasks.',
    'Not every day needs to be a victory. Focus on the basics and let tomorrow handle the rest.',
    'Someone may misunderstand you. Clarify calmly rather than reacting — it will blow over quickly.',
    'A plan might need a detour. Flexibility is your superpower today, even if it does not feel like it.',
    'Retrograde-ish vibes! Double-check messages and details before hitting send.',
    'Your mood may swing a bit. Comfort food, good music and an early night will reset everything.',
  ],
  tips: [
    'Wear something {color} for a subtle confidence boost.',
    'Your luckiest window is around {time}.',
    'Connect with a {buddy} today — your energies click.',
    'Write down one thing you are grateful for before bed.',
    'Drink more water than you think you need.',
    'Take a 10-minute walk without your phone.',
    'Clear one small clutter spot — it clears your mind too.',
    'Send a message to someone you have not spoken to in a while.',
  ],
}

export const LOVE: Pool = {
  high: [
    'Romance sparkles! If you are attached, plan something sweet and spontaneous. Single? Flirty energy is magnetic today.',
    'Hearts are open and conversations flow. Someone may be thinking about you more than you realise.',
    'Venus smiles on you. A compliment, a message or a glance could turn into something special.',
    'Deep, cosy connection is highlighted. Share a feeling you usually keep to yourself — it lands beautifully.',
    'Your charm is irresistible today. Couples rediscover the spark; singles attract admirers without trying.',
    'A lovely day for dates, heartfelt talks and making memories. Say what you feel.',
  ],
  mid: [
    'Love is calm and steady today. Small gestures matter more than grand ones.',
    'If you are attached, listen more than you talk — your partner needs to feel heard. Singles: keep it light and fun.',
    'A friendship could hint at something more, but there is no rush. Let it unfold naturally.',
    'You may crave affection but feel shy to ask. A simple, honest message works wonders.',
    'Old memories may surface. Learn from them, then return to the present with a lighter heart.',
    'Romance takes a back seat to routine today — and that is okay. Comfort is a love language too.',
  ],
  low: [
    'Sensitivity is high in matters of the heart. Avoid reading too much into short replies.',
    'A small disagreement could flare up. Choose kindness over being right and it will fade fast.',
    'Singles may feel a little lonely today. Pour that love into yourself — you deserve it.',
    'Mixed signals are possible. Ask directly instead of guessing what someone means.',
    'Give your relationship some breathing room today. Space now makes closeness sweeter later.',
    'Not the best day for big relationship decisions. Sleep on it.',
  ],
  tips: [
    'Love tip: a handwritten note beats a text today.',
    'Love tip: plan a tiny surprise, even just their favourite snack.',
    'Love tip: put the phone away during dinner.',
    'Love tip: compatibility is high with a {buddy} today.',
    'Love tip: be the first to say sorry if needed.',
    'Love tip: self-love counts — treat yourself kindly.',
  ],
}

export const CAREER: Pool = {
  high: [
    'Work shines today! Your ideas get noticed, so speak up in meetings and pitch that plan.',
    'Productivity is at a peak. Tackle the hardest task first and you will glide through the rest.',
    'Recognition is in the air. A boss, client or teacher may praise your effort — you earned it.',
    'Great day for interviews, applications and starting new projects. Your confidence is convincing.',
    'Teamwork clicks. Collaborating brings better results than going solo today.',
    'Creative problem-solving is your superpower now. A tricky issue suddenly has an obvious fix.',
  ],
  mid: [
    'A solid, routine workday. Clear your inbox and organise tasks for a smoother week.',
    'Progress is steady but not flashy. Consistency is quietly building your reputation.',
    'You may juggle many small tasks. Make a list and tick them off one by one.',
    'A colleague may need your help. Supporting them builds goodwill you will appreciate later.',
    'Good day to learn something new — a skill, a tool or a shortcut that makes work easier.',
    'Stay flexible — plans may shift slightly, but nothing you cannot handle.',
  ],
  low: [
    'Work might feel slow or frustrating. Focus on what you can control and skip office drama.',
    'Double-check details today; small errors are more likely than usual.',
    'Avoid making major career decisions today. Gather information and decide later.',
    'You may feel under-appreciated. Your effort is seen, even if nobody says it today.',
    'Deadlines could feel heavy. Break big tasks into tiny steps and take short breaks.',
    'Communication at work may get crossed. Put important things in writing.',
  ],
  tips: [
    'Work tip: your most focused hours are around {time}.',
    'Work tip: say no to one unnecessary meeting.',
    'Work tip: update your CV or portfolio — opportunity loves the prepared.',
    'Work tip: tidy your workspace before starting.',
    'Work tip: ask for feedback; it will be useful.',
    'Work tip: celebrate one small win before logging off.',
  ],
}

export const MONEY: Pool = {
  high: [
    'Finances look bright. A small windfall, refund or good deal could come your way.',
    'Great day to plan budgets or investments — your judgement about money is sharp.',
    'Abundance vibes! Money you are owed may finally arrive.',
    'A smart purchase today could save you money in the long run.',
    'Side-hustle energy is strong. An idea to earn extra could be worth exploring.',
  ],
  mid: [
    'Money matters are stable. Stick to your budget and all is well.',
    'Think twice before impulse buys — wait 24 hours and see if you still want it.',
    'Good day to review subscriptions and cancel the ones you forgot about.',
    'Neither gains nor losses stand out today. Keep calm and save on.',
    'A shared expense may need discussion. Clear agreements keep everyone happy.',
  ],
  low: [
    'Guard your wallet today — tempting deals may not be as good as they look.',
    'Avoid lending money or making big financial commitments right now.',
    'An unexpected expense could pop up. A little buffer saves the day.',
    'Retail therapy might be calling loudly. Choose a free treat instead.',
    'Read the fine print on any contract or offer before agreeing.',
  ],
  tips: [
    'Money tip: skip one takeaway coffee and save the difference.',
    'Money tip: check your bank statement for surprise charges.',
    'Money tip: lucky number for purchases today is {lucky}.',
    'Money tip: put a small amount into savings, however tiny.',
    'Money tip: compare prices before buying anything big.',
  ],
}

export const HEALTH: Pool = {
  high: [
    'Vitality is strong! A great day for exercise, dancing or trying a new workout.',
    'You feel light and energised. Get outside and soak up some fresh air.',
    'Your body and mind are in sync. Healthy habits stick more easily today.',
    'Sleep and energy align nicely — use the boost to be active.',
    'A glowing day for self-care. Your skin, mood and energy all benefit.',
  ],
  mid: [
    'Energy is moderate. Gentle movement like stretching or walking suits you best.',
    'Listen to your body — a snack, water or short rest may be exactly what you need.',
    'Balance screen time with a little time outdoors today.',
    'Eat something colourful and fresh; your body will thank you.',
    'A calm routine keeps you feeling good. No need to push hard.',
  ],
  low: [
    'You may feel a bit drained. Prioritise rest and an early night.',
    'Stress could show up as tension in your shoulders — stretch and breathe deeply.',
    'Go easy on caffeine and sugar today; steady energy is better than spikes.',
    'Take breaks from screens to avoid headaches.',
    'Be extra careful with sharp objects and hurried movements today.',
  ],
  tips: [
    'Health tip: 5 minutes of deep breathing resets your nervous system.',
    'Health tip: aim for 8 glasses of water.',
    'Health tip: stretch when you wake up.',
    'Health tip: a short walk after meals helps digestion.',
    'Health tip: go to bed 30 minutes earlier tonight.',
  ],
}

export const MOODS = [
  { emoji: '😄', label: 'Joyful' },
  { emoji: '😌', label: 'Peaceful' },
  { emoji: '🤩', label: 'Inspired' },
  { emoji: '🥰', label: 'Affectionate' },
  { emoji: '💪', label: 'Motivated' },
  { emoji: '🤔', label: 'Thoughtful' },
  { emoji: '😎', label: 'Confident' },
  { emoji: '🌙', label: 'Dreamy' },
  { emoji: '🎉', label: 'Playful' },
  { emoji: '🧘', label: 'Calm' },
  { emoji: '🔥', label: 'Fired up' },
  { emoji: '🌧️', label: 'Sensitive' },
]

export const LUCKY_COLORS = [
  { name: 'Crimson', hex: '#dc143c' }, { name: 'Gold', hex: '#ffd700' }, { name: 'Emerald', hex: '#50c878' },
  { name: 'Sky Blue', hex: '#87ceeb' }, { name: 'Lavender', hex: '#b57edc' }, { name: 'Coral', hex: '#ff7f50' },
  { name: 'Teal', hex: '#14b8a6' }, { name: 'Rose Pink', hex: '#ff66cc' }, { name: 'Silver', hex: '#c0c0c0' },
  { name: 'Orange', hex: '#ff8c00' }, { name: 'Indigo', hex: '#6366f1' }, { name: 'White', hex: '#f8fafc' },
  { name: 'Mint', hex: '#98ff98' }, { name: 'Maroon', hex: '#9b2335' }, { name: 'Turquoise', hex: '#40e0d0' },
]

export const LUCKY_TIMES = [
  '7 – 9 AM', '9 – 11 AM', '11 AM – 1 PM', '1 – 3 PM', '3 – 5 PM', '5 – 7 PM', '7 – 9 PM', '9 – 11 PM',
]

export const LUCKY_ITEMS = [
  'a coin', 'a scented candle', 'a notebook', 'a pair of sunglasses', 'a houseplant', 'a hair tie', 'a key',
  'a crystal', 'a favourite song', 'a silver ring', 'a cup of tea', 'a handwritten note', 'a feather',
]

export const THEMES_OF_DAY = [
  'New beginnings', 'Patience pays', 'Say it out loud', 'Trust the process', 'Small joys', 'Be bold',
  'Let go', 'Connect & share', 'Rest is productive', 'Follow curiosity', 'Kindness returns', 'Focus mode',
]
