// Complete 78-card tarot deck with original short meanings (free to use).
// Cards use the app's own cartoon art: majors show their traditional zodiac/planet
// correspondence, minors show their suit. No image licences needed.

export type Suit = 'major' | 'wands' | 'cups' | 'swords' | 'pentacles'
export type YesNo = 'yes' | 'no' | 'maybe'

export interface TarotCard {
  id: string
  name: string
  suit: Suit
  numeral: string
  /** illustration name in src/assets/art */
  art: string
  keywords: string[]
  upright: string
  reversed: string
  yesNo: YesNo
}

type Row = [name: string, art: string, keywords: string, upright: string, reversed: string, yesNo: YesNo]

const MAJOR: Row[] = [
  ['The Fool', 'uranus', 'beginnings, freedom, leap of faith', 'A fresh start calls. Take the leap with an open heart — the journey itself is the gift.', 'Hesitation or recklessness. Look before you leap, but do not let fear keep you still.', 'yes'],
  ['The Magician', 'mercury', 'willpower, skill, manifestation', 'You have every tool you need. Focus your intention and make it happen.', 'Scattered energy or untapped potential. Align your actions with your goals.', 'yes'],
  ['The High Priestess', 'moon', 'intuition, mystery, inner voice', 'Trust your inner knowing. The answer is quiet but clear if you listen.', 'You are ignoring your intuition. Step back from the noise and tune in.', 'maybe'],
  ['The Empress', 'venus', 'abundance, nurture, creativity', 'Growth, comfort and creativity bloom. Nurture yourself and your ideas.', 'Creative block or self-neglect. Refill your own cup first.', 'yes'],
  ['The Emperor', 'aries', 'structure, authority, stability', 'Take charge with clear plans and firm boundaries. Stability comes from order.', 'Too much control or too little. Find a healthy balance of power.', 'yes'],
  ['The Hierophant', 'taurus', 'tradition, guidance, learning', 'Wisdom from a mentor or tradition helps. Learn from those who walked the path.', 'Break from convention. Your own path may not follow the rulebook.', 'maybe'],
  ['The Lovers', 'gemini', 'love, harmony, choices', 'Deep connection and alignment of values. A heartfelt choice leads the way.', 'Disharmony or a tough choice. Realign with what truly matters to you.', 'yes'],
  ['The Chariot', 'cancer', 'determination, victory, drive', 'Charge forward with focus. Willpower wins the race.', 'Lack of direction. Pause, regain control, then move.', 'yes'],
  ['Strength', 'leo', 'courage, patience, compassion', 'Gentle strength conquers all. Lead with kindness and calm confidence.', 'Self-doubt creeps in. Remember how much you have already overcome.', 'yes'],
  ['The Hermit', 'virgo', 'solitude, reflection, wisdom', 'Step back and look within. Quiet time brings the clarity you seek.', 'Isolation or avoiding reflection. Reach out — you are not alone.', 'maybe'],
  ['Wheel of Fortune', 'jupiter', 'luck, cycles, destiny', 'The wheel turns in your favour. Embrace change — luck is on the move.', 'A downswing, but temporary. What goes down must come up.', 'yes'],
  ['Justice', 'libra', 'fairness, truth, cause & effect', 'Fair outcomes and honest decisions. The truth will balance the scales.', 'Unfairness or dodging accountability. Own your part and move forward.', 'maybe'],
  ['The Hanged Man', 'neptune', 'pause, surrender, new perspective', 'Pause and see things from a new angle. Surrender brings insight.', 'Stalling or resisting change. Let go of what is stuck.', 'maybe'],
  ['Death', 'scorpio', 'endings, transformation, change', 'One chapter closes so a better one can open. Transformation is here.', 'Resisting a necessary ending. Release it and feel lighter.', 'no'],
  ['Temperance', 'sagittarius', 'balance, moderation, patience', 'Blend, balance and be patient. The middle path is the magic one.', 'Excess or imbalance. Recalibrate your habits.', 'yes'],
  ['The Devil', 'capricorn', 'temptation, attachment, shadow', 'Notice what is holding you back — habits, fears or people. Awareness frees you.', 'Breaking free! You are releasing an old chain.', 'no'],
  ['The Tower', 'mars', 'sudden change, revelation, upheaval', 'A surprise shake-up clears false foundations. Rebuild stronger.', 'Avoiding a needed change. The sooner you face it, the gentler it is.', 'no'],
  ['The Star', 'aquarius', 'hope, healing, inspiration', 'Hope returns. Healing and inspiration pour in — keep believing.', 'Feeling discouraged. Reconnect with what gives you faith.', 'yes'],
  ['The Moon', 'pisces', 'illusion, dreams, uncertainty', 'Things are not as they seem. Trust intuition while the fog clears.', 'Confusion lifting. Truth comes to light.', 'no'],
  ['The Sun', 'sun', 'joy, success, positivity', 'Pure sunshine! Joy, success and warmth light up everything.', 'Joy is dimmed but not gone. Find the small bright spots.', 'yes'],
  ['Judgement', 'pluto', 'awakening, renewal, calling', 'A wake-up call. Rise to your higher purpose and forgive the past.', 'Self-doubt or harsh self-judgement. Be kinder to yourself.', 'yes'],
  ['The World', 'saturn', 'completion, achievement, wholeness', 'A cycle completes beautifully. Celebrate how far you have come.', 'Almost there — tie up loose ends to finish strong.', 'yes'],
]

const ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI']
const RANKS = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King']
const RANK_NUMERAL = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'P', 'Kn', 'Q', 'K']

// Minor arcana rows: [keywords, upright, reversed, yesNo] for Ace..King
type MinorRow = [keywords: string, upright: string, reversed: string, yesNo: YesNo]

const MINOR: Record<Exclude<Suit, 'major'>, { label: string; rows: MinorRow[] }> = {
  wands: {
    label: 'Wands',
    rows: [
      ['inspiration, spark, new passion', 'A spark of inspiration! Start that exciting project.', 'Delays or lost motivation. Reignite your why.', 'yes'],
      ['planning, decisions, future', 'Plan your next big move. The world is bigger than you think.', 'Fear of the unknown. Step outside your comfort zone.', 'maybe'],
      ['expansion, progress, foresight', 'Your efforts are expanding. Ships are coming in.', 'Obstacles slow progress. Adjust and keep going.', 'yes'],
      ['celebration, home, harmony', 'Celebrate! Joyful milestones and happy homecomings.', 'Tension at home. Small gestures restore harmony.', 'yes'],
      ['competition, conflict, rivalry', 'Friendly competition sharpens you. Pick battles wisely.', 'Avoiding conflict or finally finding peace.', 'no'],
      ['victory, recognition, pride', 'Victory and applause! Your success gets noticed.', 'Self-doubt or ego. Stay humble and confident.', 'yes'],
      ['defence, perseverance, standing firm', 'Stand your ground. You are in a strong position.', 'Feeling overwhelmed. Choose which fights matter.', 'maybe'],
      ['speed, movement, news', 'Things move fast! Expect news and quick progress.', 'Delays and frustration. Patience — it is coming.', 'yes'],
      ['resilience, persistence, last push', 'You are nearly there. One last push!', 'Exhaustion. Rest before you continue.', 'maybe'],
      ['burden, responsibility, overload', 'Carrying too much. Delegate some of the load.', 'Letting go of burdens. Relief is near.', 'no'],
      ['curiosity, enthusiasm, discovery', 'Exciting news or a fun new idea. Explore it!', 'Scattered ideas. Focus on one.', 'yes'],
      ['adventure, action, boldness', 'Adventure calls. Chase it with passion.', 'Haste causes mistakes. Slow down a little.', 'yes'],
      ['confidence, warmth, determination', 'Radiant confidence. You inspire everyone around you.', 'Jealousy or insecurity. Reclaim your sparkle.', 'yes'],
      ['vision, leadership, boldness', 'A visionary leader. Take bold charge of your goals.', 'Impulsive decisions. Think before commanding.', 'yes'],
    ],
  },
  cups: {
    label: 'Cups',
    rows: [
      ['new love, emotion, compassion', 'Love overflows! A new emotional beginning.', 'Emotional block. Open your heart gently.', 'yes'],
      ['partnership, attraction, unity', 'A beautiful connection. Mutual attraction and respect.', 'Imbalance in a relationship. Talk it through.', 'yes'],
      ['friendship, celebration, community', 'Celebrate with friends! Joy is shared.', 'Too much partying or gossip. Choose your circle.', 'yes'],
      ['apathy, contemplation, missed chance', 'Do not overlook an offer right in front of you.', 'Renewed interest. You are ready to engage.', 'maybe'],
      ['loss, regret, disappointment', 'Grieve what is lost, but notice what still remains.', 'Healing and moving on.', 'no'],
      ['nostalgia, childhood, innocence', 'Sweet memories and simple joys. Reconnect with your inner child.', 'Stuck in the past. Look ahead.', 'yes'],
      ['choices, fantasy, illusion', 'Many options — some are illusions. Choose with care.', 'Clarity arrives. You know what you want.', 'maybe'],
      ['walking away, seeking more', 'It is okay to leave what no longer fulfils you.', 'Fear of change. Staying may cost more.', 'no'],
      ['wishes, contentment, satisfaction', 'The wish card! What you desire may come true.', 'Unfulfilled wishes. Redefine what happiness means.', 'yes'],
      ['happiness, family, fulfilment', 'Emotional fulfilment and happy home life.', 'Family tension. Reconnect with loved ones.', 'yes'],
      ['creativity, intuition, a message', 'A sweet message or creative idea arrives.', 'Emotional immaturity. Express feelings clearly.', 'yes'],
      ['romance, charm, invitation', 'A romantic offer or invitation comes your way.', 'Moodiness or unrealistic expectations.', 'yes'],
      ['empathy, care, intuition', 'Lead with compassion and trust your feelings.', 'Emotional overwhelm. Set gentle boundaries.', 'yes'],
      ['emotional balance, diplomacy', 'Calm, caring and wise. Balance heart and head.', 'Emotional manipulation or suppression.', 'yes'],
    ],
  },
  swords: {
    label: 'Swords',
    rows: [
      ['clarity, breakthrough, truth', 'A breakthrough idea cuts through confusion.', 'Mental fog. Get the facts before deciding.', 'yes'],
      ['stalemate, difficult choice', 'A tough decision is avoided. Remove the blindfold.', 'Information overload. Pick one path.', 'maybe'],
      ['heartbreak, sorrow, grief', 'Pain is real, but it will pass. Let yourself feel it.', 'Recovery and forgiveness begin.', 'no'],
      ['rest, recovery, contemplation', 'Rest and recharge. Your mind needs a break.', 'Restlessness. Return slowly to action.', 'maybe'],
      ['conflict, tension, winning at a cost', 'Is winning worth the cost? Choose peace.', 'Making amends and moving on.', 'no'],
      ['transition, moving on, calmer waters', 'Moving towards calmer waters. Leave the storm behind.', 'Resisting change. The shore is waiting.', 'yes'],
      ['strategy, secrecy, cunning', 'Be strategic — but stay honest.', 'Truth comes out. Come clean.', 'no'],
      ['restriction, feeling stuck', 'You are less trapped than you think. Open your eyes.', 'Freedom! You are releasing limits.', 'no'],
      ['anxiety, worry, sleepless nights', 'Worries loom large at night. Talk them out.', 'The worst is over. Hope returns.', 'no'],
      ['ending, rock bottom, release', 'A painful ending — but the only way now is up.', 'Recovery and regeneration.', 'no'],
      ['curiosity, new ideas, vigilance', 'Curious mind! Ask questions and learn.', 'All talk, no action. Follow through.', 'maybe'],
      ['ambition, fast action, drive', 'Charge ahead with clear purpose.', 'Rushing without a plan. Slow down.', 'yes'],
      ['clear thinking, independence, honesty', 'Speak your truth with clarity and grace.', 'Coldness or bitterness. Soften a little.', 'maybe'],
      ['authority, truth, intellect', 'Lead with logic and fairness.', 'Misuse of power. Stay ethical.', 'maybe'],
    ],
  },
  pentacles: {
    label: 'Pentacles',
    rows: [
      ['opportunity, prosperity, new venture', 'A golden opportunity — financial or career. Grab it!', 'A missed chance. Plan better next time.', 'yes'],
      ['balance, juggling, adaptability', 'Juggling many things well. Stay flexible.', 'Overcommitted. Drop a ball on purpose.', 'maybe'],
      ['teamwork, skill, collaboration', 'Teamwork makes it happen. Your skills are valued.', 'Poor teamwork. Clarify roles.', 'yes'],
      ['security, saving, control', 'Save and protect what you have built.', 'Too tight a grip. Loosen up a little.', 'maybe'],
      ['hardship, loss, isolation', 'A tough time — but help is closer than you think.', 'Recovery from hardship begins.', 'no'],
      ['generosity, giving, sharing', 'Give and receive generously. Karma is kind.', 'Strings attached. Check the terms.', 'yes'],
      ['patience, long-term view, investment', 'Your investment is growing. Be patient.', 'Impatience. Rushing harvest spoils it.', 'maybe'],
      ['skill, diligence, mastery', 'Practice makes perfect. Keep honing your craft.', 'Perfectionism or lack of focus.', 'yes'],
      ['luxury, independence, reward', 'Enjoy the fruits of your hard work.', 'Overspending. Treat yourself wisely.', 'yes'],
      ['wealth, legacy, family', 'Lasting wealth and family blessings.', 'Financial disputes. Be transparent.', 'yes'],
      ['ambition, learning, new goals', 'A new opportunity to learn and grow.', 'Procrastination. Start today.', 'yes'],
      ['hard work, routine, reliability', 'Slow and steady wins. Keep showing up.', 'Boredom or stagnation. Shake up the routine.', 'yes'],
      ['nurturing, practical, abundance', 'Practical care and a cosy abundance.', 'Work-life imbalance. Care for yourself too.', 'yes'],
      ['wealth, success, security', 'Abundance and success. You have built something solid.', 'Greed or stubbornness. Share the wealth.', 'yes'],
    ],
  },
}

function buildDeck(): TarotCard[] {
  const deck: TarotCard[] = MAJOR.map(([name, art, kw, up, rev, yn], i) => ({
    id: `major-${i}`,
    name,
    suit: 'major',
    numeral: ROMAN[i],
    art,
    keywords: kw.split(', '),
    upright: up,
    reversed: rev,
    yesNo: yn,
  }))
  for (const suit of ['wands', 'cups', 'swords', 'pentacles'] as const) {
    const { label, rows } = MINOR[suit]
    rows.forEach(([kw, up, rev, yn], i) => {
      deck.push({
        id: `${suit}-${i + 1}`,
        name: `${RANKS[i]} of ${label}`,
        suit,
        numeral: RANK_NUMERAL[i],
        art: suit,
        keywords: kw.split(', '),
        upright: up,
        reversed: rev,
        yesNo: yn,
      })
    })
  }
  return deck
}

export const DECK: TarotCard[] = buildDeck()

export const SUIT_STYLE: Record<Suit, { label: string; gradient: string; ring: string }> = {
  major: { label: 'Major Arcana', gradient: 'from-violet-700 via-purple-800 to-indigo-900', ring: 'ring-amber-300/70' },
  wands: { label: 'Wands · Fire', gradient: 'from-orange-600 via-rose-700 to-red-900', ring: 'ring-orange-300/70' },
  cups: { label: 'Cups · Water', gradient: 'from-sky-600 via-blue-700 to-indigo-900', ring: 'ring-sky-300/70' },
  swords: { label: 'Swords · Air', gradient: 'from-slate-500 via-slate-700 to-slate-900', ring: 'ring-slate-200/70' },
  pentacles: { label: 'Pentacles · Earth', gradient: 'from-emerald-600 via-green-700 to-emerald-900', ring: 'ring-lime-300/70' },
}
