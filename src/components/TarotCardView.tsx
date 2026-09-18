import { SUIT_STYLE, type TarotCard } from '../data/tarot'

interface Props {
  card?: TarotCard
  reversed?: boolean
  flipped: boolean
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

const SIZES = {
  sm: 'w-[5.5rem] h-[9rem] text-3xl',
  md: 'w-28 h-44 text-4xl',
  lg: 'w-44 h-72 text-6xl',
}

export function CardBack({ className = '' }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 grid place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-night-700 via-night-800 to-night-950 ring-2 ring-gold-400/60 ${className}`}
    >
      <div className="absolute inset-1.5 rounded-lg border border-gold-300/40" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, #ffe7a3 1px, transparent 1.5px)',
          backgroundSize: '12px 12px',
        }}
      />
      <span className="relative text-gold-300 drop-shadow-[0_0_8px_#f5b94a]">☾✦☽</span>
    </div>
  )
}

export default function TarotCardView({ card, reversed, flipped, onClick, size = 'md', label }: Props) {
  const style = card ? SUIT_STYLE[card.suit] : undefined
  return (
    <div className="flex flex-col items-center gap-1.5">
      <button
        type="button"
        onClick={onClick}
        disabled={!onClick}
        className={`perspective relative ${SIZES[size]} disabled:cursor-default`}
        aria-label={flipped && card ? `${card.name}${reversed ? ' reversed' : ''}` : 'Face-down tarot card'}
      >
        <div
          className={`preserve-3d relative size-full transition-transform duration-700 ${flipped ? 'rotate-y-180' : ''}`}
        >
          <div className="backface-hidden absolute inset-0">
            <CardBack />
          </div>
          <div className="backface-hidden rotate-y-180 absolute inset-0">
            {card && style && (
              <div
                className={`flex size-full flex-col items-center justify-between rounded-xl bg-gradient-to-b p-2 ring-2 ${style.gradient} ${style.ring} ${
                  reversed ? 'rotate-180' : ''
                }`}
              >
                <span className="font-serif text-[0.45em] font-bold text-gold-200">{card.numeral}</span>
                <span className="drop-shadow-[0_0_12px_rgba(255,231,163,0.6)]">{card.emoji}</span>
                <span className="text-center text-[0.3em] leading-tight font-extrabold text-white">{card.name}</span>
              </div>
            )}
          </div>
        </div>
      </button>
      {label && <span className="text-xs font-bold text-violet-200/80">{label}</span>}
    </div>
  )
}
