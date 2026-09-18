// Renders a shareable story-style image on a canvas and hands it to the
// native share sheet (mobile) or downloads it (desktop). No libraries needed.

export interface ShareCard {
  title: string
  subtitle?: string
  emoji: string
  body: string
  footer?: string
}

const W = 1080
const H = 1350

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = w
    } else line = test
  }
  if (line) lines.push(line)
  return lines
}

async function render(card: ShareCard): Promise<Blob> {
  await document.fonts?.ready
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  const bg = ctx.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0, '#2d1f73')
  bg.addColorStop(0.55, '#120b2e')
  bg.addColorStop(1, '#4a1450')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // stars
  for (let i = 0; i < 140; i++) {
    ctx.globalAlpha = Math.random() * 0.8 + 0.2
    ctx.fillStyle = i % 5 === 0 ? '#ffe7a3' : '#ffffff'
    ctx.beginPath()
    ctx.arc(Math.random() * W, Math.random() * H, Math.random() * 2.4 + 0.4, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1

  // panel
  ctx.fillStyle = 'rgba(255,255,255,0.07)'
  ctx.strokeStyle = 'rgba(255,255,255,0.18)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.roundRect(70, 130, W - 140, H - 300, 48)
  ctx.fill()
  ctx.stroke()

  ctx.textAlign = 'center'
  ctx.font = '170px serif'
  ctx.fillText(card.emoji, W / 2, 360)

  const gold = ctx.createLinearGradient(0, 0, W, 0)
  gold.addColorStop(0, '#fff1c7')
  gold.addColorStop(1, '#f5b94a')
  ctx.fillStyle = gold
  ctx.font = 'bold 64px "Cinzel Decorative", Georgia, serif'
  ctx.fillText(card.title, W / 2, 480)

  if (card.subtitle) {
    ctx.fillStyle = '#c9b8ff'
    ctx.font = '600 38px Nunito, sans-serif'
    ctx.fillText(card.subtitle, W / 2, 545)
  }

  ctx.fillStyle = '#f4f0ff'
  let size = 46
  let lines: string[] = []
  // shrink text until it fits the panel
  for (; size >= 28; size -= 2) {
    ctx.font = `600 ${size}px Nunito, sans-serif`
    lines = wrapLines(ctx, card.body, W - 260)
    if (lines.length * size * 1.45 < H - 300 - 520) break
  }
  lines.forEach((l, i) => ctx.fillText(l, W / 2, 640 + i * size * 1.45))

  ctx.fillStyle = '#ffe7a3'
  ctx.font = 'bold 40px "Cinzel Decorative", Georgia, serif'
  ctx.fillText(card.footer ?? '✦ Zodiac Play ✦', W / 2, H - 80)

  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Canvas export failed'))), 'image/png'),
  )
}

export async function shareCard(card: ShareCard): Promise<'shared' | 'downloaded' | 'cancelled'> {
  const blob = await render(card)
  const file = new File([blob], 'zodiac-play.png', { type: 'image/png' })
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: card.title, text: `${card.title} — ${card.body}` })
      return 'shared'
    } catch {
      return 'cancelled'
    }
  }
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'zodiac-play.png'
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
  return 'downloaded'
}
