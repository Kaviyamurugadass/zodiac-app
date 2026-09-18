// Generates the app's cartoon SVG art into src/assets/art/.
// All characters share one style: plum outlines, sparkly anime eyes, blush.
// Run: npm run art
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'assets', 'art')
mkdirSync(OUT_DIR, { recursive: true })

// ---------------------------------------------------------------- helpers

const INK = '#3b2350'
const ST = `stroke="${INK}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"`
const ST_THIN = `stroke="${INK}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"`

const svg = (body, defs = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">${defs ? `<defs>${defs}</defs>` : ''}${body}</svg>\n`

const mirror = (inner) => `<g transform="translate(200 0) scale(-1 1)">${inner}</g>`
const shadow = (rx = 50, cy = 188) => `<ellipse cx="100" cy="${cy}" rx="${rx}" ry="7" fill="#000" opacity=".22"/>`
const shine = (cx, cy, rx, ry, rot = -30) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" opacity=".45" transform="rotate(${rot} ${cx} ${cy})"/>`

/** Thick outlined "tube" along a path (horns, legs, arms, stems). */
const tube = (d, color, w = 10) =>
  `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 10}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`

/** Fluffy outlined blob from overlapping circles (wool, manes, clouds). */
const cloud = (circles, fill) =>
  circles.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${ST}/>`).join('') +
  circles.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r - 2.6}" fill="${fill}"/>`).join('')

/** Sparkly anime eye centred at 0,0. */
const eye = (x, y, s = 1, iris = '#7c4dcc') =>
  `<g transform="translate(${x} ${y}) scale(${s})">` +
  `<ellipse rx="8.5" ry="11.5" fill="#2b1840"/>` +
  `<ellipse cy="4" rx="6.5" ry="6" fill="${iris}" opacity=".75"/>` +
  `<circle cx="-3" cy="-4.2" r="3.8" fill="#fff"/>` +
  `<circle cx="3.2" cy="4.8" r="1.8" fill="#fff"/>` +
  `</g>`

const closedEye = (x, y, s = 1) =>
  `<path d="M ${x - 8 * s} ${y} Q ${x} ${y + 8 * s} ${x + 8 * s} ${y}" fill="none" ${ST_THIN}/>`

const mouths = {
  smile: `<path d="M -6 0 Q 0 7 6 0" fill="none" ${ST_THIN}/>`,
  cat: `<path d="M -9 0 Q -4.5 6 0 0 Q 4.5 6 9 0" fill="none" ${ST_THIN}/>`,
  open: `<path d="M -7 -1 Q 0 12 7 -1 Z" fill="#c2185b" ${ST_THIN}/><ellipse cy="5" rx="3.5" ry="2" fill="#ff8fab"/>`,
  tiny: `<path d="M -3.5 0 Q 0 4 3.5 0" fill="none" ${ST_THIN}/>`,
  none: '',
}

/**
 * Face centred at (cx, cy): eyes at cy, mouth below.
 * opts: gap (eye spacing), s (scale), mouth, blush, sleepy, iris
 */
function face(cx, cy, { gap = 17, s = 1, mouth = 'smile', blush = true, sleepy = false, noEyes = false, iris } = {}) {
  const eyes = noEyes
    ? ''
    : sleepy
      ? closedEye(-gap, 0) + closedEye(gap, 0)
      : eye(-gap, 0, 1, iris) + eye(gap, 0, 1, iris)
  const cheeks = blush
    ? `<ellipse cx="${-gap - 9}" cy="13" rx="7.5" ry="4.5" fill="#ff6f9c" opacity=".55"/>` +
      `<ellipse cx="${gap + 9}" cy="13" rx="7.5" ry="4.5" fill="#ff6f9c" opacity=".55"/>`
    : ''
  return `<g transform="translate(${cx} ${cy}) scale(${s})">${eyes}${cheeks}<g transform="translate(0 15)">${mouths[mouth]}</g></g>`
}

/** 4-point twinkle star. */
const sparkle = (x, y, r, color = '#ffe7a3') =>
  `<path d="M ${x} ${y - r} Q ${x} ${y} ${x + r} ${y} Q ${x} ${y} ${x} ${y + r} Q ${x} ${y} ${x - r} ${y} Q ${x} ${y} ${x} ${y - r} Z" fill="${color}"/>`

const heart = (x, y, s, color) =>
  `<path transform="translate(${x} ${y}) scale(${s})" d="M 0 6 C -10 -2 -10 -12 -4 -12 C -1 -12 0 -9 0 -8 C 0 -9 1 -12 4 -12 C 10 -12 10 -2 0 6 Z" fill="${color}" ${ST_THIN}/>`

const flower = (x, y, petal = '#fff', center = '#ffd166', r = 5) =>
  [0, 72, 144, 216, 288]
    .map((a) => {
      const px = x + Math.cos((a * Math.PI) / 180) * r
      const py = y + Math.sin((a * Math.PI) / 180) * r
      return `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${r * 0.85}" fill="${petal}" stroke="${INK}" stroke-width="2.5"/>`
    })
    .join('') + `<circle cx="${x}" cy="${y}" r="${r * 0.75}" fill="${center}" stroke="${INK}" stroke-width="2.5"/>`

const radial = (id, inner, outer, cx = '35%', cy = '30%') =>
  `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="75%"><stop offset="0" stop-color="${inner}"/><stop offset="1" stop-color="${outer}"/></radialGradient>`

const art = {}

// ---------------------------------------------------------------- zodiac

art.aries = svg(
  shadow(46) +
    cloud([[100, 64, 30], [66, 76, 24], [134, 76, 24], [54, 108, 22], [146, 108, 22], [66, 140, 22], [134, 140, 22], [100, 152, 26]], '#fff8ec') +
    `<ellipse cx="100" cy="112" rx="38" ry="35" fill="#ffd9c2" ${ST}/>` +
    cloud([[86, 80, 11], [100, 75, 12], [114, 80, 11]], '#fff8ec') +
    tube('M 68 84 C 38 62 14 92 28 114 C 40 132 66 122 58 104 C 54 94 42 98 45 107', '#ff8a5b', 11) +
    mirror(tube('M 68 84 C 38 62 14 92 28 114 C 40 132 66 122 58 104 C 54 94 42 98 45 107', '#ff8a5b', 11)) +
    face(100, 112, { gap: 16, s: 0.95, mouth: 'cat' }) +
    sparkle(170, 40, 9) + sparkle(28, 44, 6),
)

art.taurus = svg(
  shadow(48) +
    `<path d="M 72 70 C 50 68 32 54 30 30 C 46 46 64 50 84 56 Z" fill="#fff1d6" ${ST}/>` +
    mirror(`<path d="M 72 70 C 50 68 32 54 30 30 C 46 46 64 50 84 56 Z" fill="#fff1d6" ${ST}/>`) +
    `<ellipse cx="46" cy="94" rx="19" ry="10" transform="rotate(-25 46 94)" fill="#c98552" ${ST}/>` +
    mirror(`<ellipse cx="46" cy="94" rx="19" ry="10" transform="rotate(-25 46 94)" fill="#c98552" ${ST}/>`) +
    `<ellipse cx="100" cy="106" rx="47" ry="45" fill="#dca06b" ${ST}/>` +
    shine(76, 84, 12, 7) +
    cloud([[90, 64, 9], [101, 60, 10], [112, 65, 9]], '#b8743f') +
    `<ellipse cx="100" cy="136" rx="33" ry="21" fill="#f7cbab" ${ST}/>` +
    `<ellipse cx="88" cy="135" rx="4.5" ry="6" fill="#8a4b2b"/><ellipse cx="112" cy="135" rx="4.5" ry="6" fill="#8a4b2b"/>` +
    `<circle cx="100" cy="158" r="8" fill="none" stroke="${INK}" stroke-width="8"/><circle cx="100" cy="158" r="8" fill="none" stroke="#f5c95a" stroke-width="4"/>` +
    face(100, 102, { gap: 19, mouth: 'none' }) +
    flower(70, 64, '#ffb3c7') + flower(132, 62, '#c3f0a4', '#fff'),
)

art.gemini = svg(
  shadow(62) +
    sparkle(100, 36, 10) + sparkle(30, 62, 7, '#c9b8ff') + sparkle(172, 58, 7, '#c9b8ff') +
    `<path d="M 134 80 q -6 -16 8 -20 q 12 -2 8 10" fill="none" ${ST}/>` +
    `<circle cx="134" cy="120" r="38" fill="#ffb870" ${ST}/>` + shine(118, 100, 10, 6) +
    `<path d="M 66 80 q 6 -16 -8 -20 q -12 -2 -8 10" fill="none" ${ST}/>` +
    `<circle cx="66" cy="120" r="38" fill="#ffd166" ${ST}/>` + shine(50, 100, 10, 6) +
    `<circle cx="100" cy="148" r="9" fill="#ffc46b" ${ST}/>` +
    face(66, 118, { gap: 13, s: 0.85, mouth: 'open' }) +
    face(134, 118, { gap: 13, s: 0.85, mouth: 'cat' }),
)

const claw = `<path d="M 22 88 C 10 60 44 46 54 68 L 38 76 L 50 86 C 44 100 26 102 22 88 Z" fill="#ff6b6b" ${ST}/>`
art.cancer = svg(
  shadow(58) +
    tube('M 62 120 L 42 96', '#ff8a80', 8) + claw +
    mirror(tube('M 62 120 L 42 96', '#ff8a80', 8) + claw) +
    tube('M 60 146 L 42 160', '#ff8a80', 6) + tube('M 72 154 L 60 170', '#ff8a80', 6) +
    mirror(tube('M 60 146 L 42 160', '#ff8a80', 6) + tube('M 72 154 L 60 170', '#ff8a80', 6)) +
    tube('M 86 104 L 80 72', '#ff8a80', 6) + tube('M 114 104 L 120 72', '#ff8a80', 6) +
    `<ellipse cx="100" cy="130" rx="55" ry="38" fill="#ff8a80" ${ST}/>` + shine(72, 110, 14, 7) +
    `<circle cx="80" cy="62" r="15" fill="#fff" ${ST}/>` + eye(81, 63, 0.95) +
    `<circle cx="120" cy="62" r="15" fill="#fff" ${ST}/>` + eye(119, 63, 0.95) +
    // eyes live on the stalks, so the body face is just blush + mouth
    face(100, 120, { gap: 20, mouth: 'open', noEyes: true }) +
    `<circle cx="84" cy="146" r="3" fill="#ffd0cc"/><circle cx="116" cy="146" r="3" fill="#ffd0cc"/>`,
)

const maneRing = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2
  return [+(100 + Math.cos(a) * 52).toFixed(1), +(108 + Math.sin(a) * 50).toFixed(1), 23]
})
art.leo = svg(
  shadow(52) +
    cloud(maneRing, '#f08a2c') +
    `<circle cx="66" cy="68" r="14" fill="#ffcf7a" ${ST}/><circle cx="66" cy="68" r="6" fill="#ff9fb5"/>` +
    `<circle cx="134" cy="68" r="14" fill="#ffcf7a" ${ST}/><circle cx="134" cy="68" r="6" fill="#ff9fb5"/>` +
    `<circle cx="100" cy="110" r="44" fill="#ffd580" ${ST}/>` + shine(80, 90, 11, 6) +
    `<ellipse cx="89" cy="134" rx="14" ry="10" fill="#fff3dc" ${ST_THIN}/><ellipse cx="111" cy="134" rx="14" ry="10" fill="#fff3dc" ${ST_THIN}/>` +
    `<path d="M 91 121 Q 100 116 109 121 Q 105 130 100 131 Q 95 130 91 121 Z" fill="#8a4b2b" ${ST_THIN}/>` +
    face(100, 104, { gap: 18, mouth: 'none' }) +
    `<path d="M 76 48 L 80 26 L 92 40 L 100 20 L 108 40 L 120 26 L 124 48 Z" fill="#ffd54f" ${ST}/>` +
    `<circle cx="100" cy="38" r="3.5" fill="#ff5d8f"/>`,
)

art.virgo = svg(
  shadow(48) +
    `<path d="M 50 112 C 44 60 80 42 100 42 C 120 42 156 60 150 112 L 158 170 C 142 180 122 174 114 162 L 86 162 C 78 174 58 180 42 170 Z" fill="#8b5e3c" ${ST}/>` +
    `<ellipse cx="100" cy="114" rx="38" ry="40" fill="#ffe0c7" ${ST}/>` +
    `<path d="M 60 106 C 56 70 80 56 100 56 C 122 56 146 70 140 106 C 132 94 126 86 122 80 C 116 94 104 96 100 84 C 94 96 82 98 78 84 C 74 94 68 102 60 106 Z" fill="#8b5e3c" ${ST}/>` +
    shine(82, 70, 10, 4, -20) +
    face(100, 118, { gap: 16, mouth: 'tiny', iris: '#3aa76d' }) +
    `<path d="M 76 110 l -6 -5 M 124 110 l 6 -5" ${ST_THIN}/>` +
    flower(70, 64, '#fff', '#ffd166') + flower(86, 54, '#e9ffd9', '#ffd166') + flower(114, 54, '#fff', '#ffd166') + flower(130, 64, '#e9ffd9', '#ffd166') +
    `<path d="M 100 50 q -4 -10 0 -18 q 4 8 0 18 Z" fill="#b5e48c" ${ST_THIN}/>`,
)

const pan = `<path d="M 32 58 L 16 106 M 32 58 L 48 106" stroke="${INK}" stroke-width="3"/>` +
  `<path d="M 8 106 Q 32 132 56 106 Z" fill="#f5c95a" ${ST}/>`
art.libra = svg(
  shadow(44) +
    tube('M 100 60 L 100 96', '#f5c95a', 8) +
    tube('M 30 58 L 170 58', '#f5c95a', 8) +
    pan + mirror(pan) +
    heart(32, 100, 0.9, '#ff6f9c') + sparkle(168, 96, 8, '#fff1c7') +
    heart(100, 50, 1.1, '#ff6f9c') +
    `<circle cx="100" cy="134" r="40" fill="#f7a1c4" ${ST}/>` + shine(82, 114, 11, 6) +
    face(100, 132, { gap: 15, mouth: 'smile' }),
)

const tailSegs = [[138, 34, 11], [157, 48, 12], [163, 72, 13], [155, 96, 15], [136, 114, 17]]
art.scorpio = svg(
  shadow(52) +
    tailSegs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#9d6bd6" ${ST}/>`).join('') +
    `<path d="M 128 36 C 120 22 104 26 108 38 C 100 34 94 46 106 50 Z" fill="#ff6fae" ${ST}/>` +
    tube('M 64 140 L 42 124', '#b784e0', 8) +
    `<path d="M 20 128 C 8 102 40 88 50 110 L 36 116 L 46 126 C 40 140 24 142 20 128 Z" fill="#b784e0" ${ST}/>` +
    tube('M 136 150 L 158 150', '#b784e0', 8) +
    `<path d="M 180 154 C 192 128 160 114 150 136 L 164 142 L 154 152 C 160 166 176 168 180 154 Z" fill="#b784e0" ${ST}/>` +
    `<ellipse cx="96" cy="138" rx="46" ry="38" fill="#b784e0" ${ST}/>` + shine(76, 118, 12, 6) +
    face(96, 134, { gap: 15, mouth: 'cat', iris: '#ff6fae' }) +
    sparkle(40, 50, 8, '#e9d5ff'),
)

art.sagittarius = svg(
  shadow(46) +
    tube('M 40 170 L 160 50', '#c08457', 6) +
    `<path d="M 178 32 L 150 42 L 168 60 Z" fill="#ffd166" ${ST}/>` +
    `<path d="M 44 166 L 22 170 L 34 150 Z M 46 164 L 42 186 L 58 174 Z" fill="#a78bfa" ${ST_THIN}/>` +
    `<circle cx="96" cy="116" r="44" fill="#ffe0c7" ${ST}/>` +
    `<path d="M 54 110 C 50 70 78 60 96 60 C 120 60 144 72 140 110 C 134 98 130 92 126 88 L 118 100 L 108 86 L 98 100 L 88 86 L 78 100 L 70 90 C 64 98 58 104 54 110 Z" fill="#ff8c42" ${ST}/>` +
    shine(80, 72, 10, 4, -15) +
    `<path d="M 62 78 C 50 58 52 34 64 22 C 70 40 70 60 66 78 Z" fill="#a78bfa" ${ST_THIN}/>` +
    face(96, 120, { gap: 16, mouth: 'open' }),
)

const goatHorn = `<path d="M 80 72 C 72 50 58 34 38 28 C 52 44 60 58 64 80 Z" fill="#a47551" ${ST}/>` +
  `<path d="M 58 48 l 8 -4 M 64 58 l 8 -3" ${ST_THIN}/>`
art.capricorn = svg(
  shadow(50) +
    tube('M 112 160 C 160 176 184 136 164 112', '#4fb3a0', 16) +
    `<path d="M 164 112 C 150 92 176 80 184 96 C 196 84 200 110 180 118 Z" fill="#7dd3c0" ${ST}/>` +
    goatHorn + mirror(goatHorn) +
    `<ellipse cx="52" cy="98" rx="18" ry="9" transform="rotate(20 52 98)" fill="#d5cbb8" ${ST}/>` +
    mirror(`<ellipse cx="52" cy="98" rx="18" ry="9" transform="rotate(20 52 98)" fill="#d5cbb8" ${ST}/>`) +
    `<path d="M 88 140 Q 100 176 112 140 Z" fill="#fff" ${ST}/>` +
    `<ellipse cx="100" cy="106" rx="39" ry="43" fill="#ebe4d6" ${ST}/>` + shine(82, 84, 10, 6) +
    `<ellipse cx="100" cy="130" rx="19" ry="12" fill="#f6d7c3" ${ST_THIN}/>` +
    `<ellipse cx="94" cy="130" rx="2.5" ry="3.5" fill="#8a4b2b"/><ellipse cx="106" cy="130" rx="2.5" ry="3.5" fill="#8a4b2b"/>` +
    face(100, 104, { gap: 16, mouth: 'none', iris: '#4fb3a0' }),
)

art.aquarius = svg(
  shadow(46) +
    tube('M 24 150 q 8 -8 16 0 q 8 8 16 0', '#7dd3fc', 5) +
    mirror(tube('M 24 150 q 8 -8 16 0 q 8 8 16 0', '#7dd3fc', 5)) +
    `<path d="M 100 30 C 118 62 152 90 152 128 C 152 160 128 180 100 180 C 72 180 48 160 48 128 C 48 90 82 62 100 30 Z" fill="url(#aq)" ${ST}/>` +
    shine(78, 104, 9, 16, 20) +
    face(100, 132, { gap: 17, mouth: 'open', iris: '#1d4ed8' }) +
    // tilted amphora pouring a little stream
    `<path d="M 137 28 C 127 38 135 52 125 62" fill="none" stroke="#7dd3fc" stroke-width="5" stroke-linecap="round"/>` +
    `<g transform="translate(160 50) rotate(-40) scale(1.25)"><rect x="-7" y="-27" width="14" height="12" rx="3" fill="#f4a261" ${ST_THIN}/><ellipse rx="16" ry="18" fill="#f4a261" ${ST_THIN}/><path d="M -14 -3 L 14 -3" stroke="#ffe7a3" stroke-width="4"/><path d="M 15 -10 q 11 3 5 15" fill="none" ${ST_THIN}/></g>` +
    sparkle(32, 50, 7, '#bae6fd'),
  radial('aq', '#a5f3fc', '#3b82f6'),
)

const fish = (cx, cy, color, fin, flip) =>
  `<g transform="translate(${cx} ${cy}) scale(${flip ? -1 : 1} 1)">` +
  `<path d="M -28 0 L -54 -20 Q -46 0 -54 20 Z" fill="${fin}" ${ST}/>` +
  `<path d="M -8 -22 Q 4 -40 18 -20 Z" fill="${fin}" ${ST}/>` +
  `<ellipse rx="36" ry="25" fill="${color}" ${ST}/>` +
  `<ellipse cx="-8" cy="-10" rx="10" ry="5" fill="#fff" opacity=".45" transform="rotate(-15)"/>` +
  eye(14, -3, 0.85) +
  `<ellipse cx="23" cy="10" rx="6" ry="3.5" fill="#ff6f9c" opacity=".55"/>` +
  `<path d="M 28 3 Q 32 7 36 3" fill="none" ${ST_THIN}/>` +
  `</g>`
art.pisces = svg(
  shadow(52) +
    `<path d="M 62 70 C 20 100 30 140 70 144 M 138 142 C 180 112 170 72 130 68" fill="none" stroke="#c9b8ff" stroke-width="4" stroke-dasharray="2 9" stroke-linecap="round"/>` +
    fish(98, 66, '#5eead4', '#2dd4bf', false) +
    fish(102, 140, '#c4b5fd', '#a78bfa', true) +
    `<circle cx="160" cy="104" r="6" fill="none" stroke="#bae6fd" stroke-width="3"/><circle cx="170" cy="88" r="4" fill="none" stroke="#bae6fd" stroke-width="3"/>` +
    `<circle cx="36" cy="100" r="5" fill="none" stroke="#bae6fd" stroke-width="3"/>`,
)

// ---------------------------------------------------------------- planets

const planet = (id, inner, outer, extrasBehind = '', extrasFront = '', faceOpts = {}, r = 50) =>
  svg(
    shadow(40) + extrasBehind +
      `<circle cx="100" cy="104" r="${r}" fill="url(#${id})" ${ST}/>` +
      shine(78, 80, 12, 7) + extrasFront + face(100, 104, faceOpts),
    radial(id, inner, outer),
  )

const rays = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * 360
  return `<path transform="rotate(${a} 100 104)" d="M 90 44 Q 100 18 110 44 Z" fill="#ffb703" ${ST}/>`
}).join('')
art.sun = planet('sun', '#fff3b0', '#ffb703', rays, '', { mouth: 'open' }, 48)

art.moon = svg(
  shadow(40) +
    `<path d="M 122 30 C 70 30 40 70 46 116 C 52 160 100 186 146 166 C 104 166 76 134 80 96 C 83 64 100 42 122 30 Z" fill="url(#moon)" ${ST}/>` +
    `<circle cx="66" cy="84" r="6" fill="#e9d8a6" opacity=".7"/><circle cx="74" cy="140" r="4" fill="#e9d8a6" opacity=".7"/>` +
    closedEye(64, 110) + closedEye(90, 116) +
    `<ellipse cx="62" cy="124" rx="6" ry="3.5" fill="#ff6f9c" opacity=".55"/>` +
    `<path d="M 72 130 Q 78 135 84 131" fill="none" ${ST_THIN}/>` +
    sparkle(150, 60, 12) + sparkle(168, 104, 7) + sparkle(132, 92, 5),
  radial('moon', '#fffbeb', '#fcd34d'),
)

const wing = `<path d="M 54 92 C 30 70 14 86 22 98 C 12 104 24 120 40 110 C 34 122 50 128 56 112 Z" fill="#fff" ${ST}/>`
art.mercury = planet('mercury', '#e0f2fe', '#94a3b8', wing + mirror(wing), '', { mouth: 'open' }, 42)

art.venus = planet('venus', '#fde2f3', '#f472b6', heart(100, 44, 1.6, '#ff4f8b') + tube('M 100 50 L 100 58', '#ff4f8b', 4), '', { mouth: 'smile', iris: '#db2777' })

art.mars = planet(
  'mars', '#fecaca', '#ef4444', '',
  `<circle cx="126" cy="84" r="8" fill="#b91c1c" opacity=".45"/><circle cx="72" cy="128" r="6" fill="#b91c1c" opacity=".45"/><circle cx="132" cy="132" r="5" fill="#b91c1c" opacity=".45"/>` +
    `<path d="M 72 88 L 90 94 M 128 88 L 110 94" ${ST_THIN}/>`,
  { mouth: 'smile', iris: '#b91c1c' },
)

art.jupiter = planet(
  'jupiter', '#fde7c7', '#d97706', '',
  `<path d="M 54 84 Q 100 74 146 84" fill="none" stroke="#c2410c" stroke-width="6" opacity=".45"/><path d="M 52 128 Q 100 138 148 128" fill="none" stroke="#c2410c" stroke-width="6" opacity=".45"/>` +
    `<ellipse cx="128" cy="138" rx="10" ry="6" fill="#dc2626" opacity=".7"/>`,
  { mouth: 'cat' }, 54,
)

art.saturn = svg(
  shadow(40) +
    `<ellipse cx="100" cy="108" rx="86" ry="22" transform="rotate(-14 100 108)" fill="none" stroke="${INK}" stroke-width="15"/>` +
    `<ellipse cx="100" cy="108" rx="86" ry="22" transform="rotate(-14 100 108)" fill="none" stroke="#fcd34d" stroke-width="7"/>` +
    `<circle cx="100" cy="104" r="46" fill="url(#sat)" ${ST}/>` + shine(80, 82, 11, 6) +
    face(100, 100, { mouth: 'smile' }) +
    `<path d="M 16 132 A 86 22 -14 0 0 184 88" transform="rotate(0)" fill="none" stroke="${INK}" stroke-width="15" stroke-linecap="round" clip-path="url(#front)"/>` +
    `<path d="M 16 132 A 86 22 -14 0 0 184 88" fill="none" stroke="#fcd34d" stroke-width="7" stroke-linecap="round" clip-path="url(#front)"/>`,
  radial('sat', '#fef3c7', '#f59e0b') + `<clipPath id="front"><rect x="0" y="112" width="200" height="90"/></clipPath>`,
)

art.uranus = planet(
  'uranus', '#ccfbf1', '#22d3ee',
  `<ellipse cx="100" cy="104" rx="16" ry="72" transform="rotate(12 100 104)" fill="none" stroke="${INK}" stroke-width="13"/><ellipse cx="100" cy="104" rx="16" ry="72" transform="rotate(12 100 104)" fill="none" stroke="#a5f3fc" stroke-width="6"/>`,
  sparkle(150, 50, 10, '#fff'),
  { mouth: 'open', iris: '#0e7490' }, 46,
)

art.neptune = planet(
  'neptune', '#bfdbfe', '#2563eb',
  tube('M 150 170 L 158 40', '#fcd34d', 5) + `<path d="M 144 52 L 146 30 M 158 44 L 160 20 M 172 54 L 174 32" ${ST}/><path d="M 144 52 L 146 30 M 158 44 L 160 20 M 172 54 L 174 32" stroke="#fcd34d" stroke-width="4" stroke-linecap="round"/><path d="M 144 54 Q 158 64 172 56" fill="none" ${ST}/>`,
  `<path d="M 62 124 q 10 -8 20 0 q 10 8 20 0 q 10 -8 20 0" fill="none" stroke="#93c5fd" stroke-width="4" stroke-linecap="round"/>`,
  { mouth: 'smile', iris: '#1e3a8a' }, 46,
)

art.pluto = planet(
  'pluto', '#e9d5ff', '#8b5cf6', '',
  `<path d="M 118 128 C 106 118 108 106 116 106 C 120 106 122 110 122 112 C 122 110 124 106 128 106 C 136 106 138 118 118 128 Z" fill="#fff" opacity=".85"/>`,
  { mouth: 'tiny', gap: 15 }, 40,
)

// ---------------------------------------------------------------- UI icons

art.star = svg(
  shadow(40) +
    `<path d="M 100 22 L 122 72 L 176 76 L 134 112 L 148 166 L 100 138 L 52 166 L 66 112 L 24 76 L 78 72 Z" fill="url(#star)" ${ST}/>` +
    shine(84, 70, 9, 5) + face(100, 104, { gap: 15, mouth: 'open' }) +
    sparkle(170, 30, 9) + sparkle(30, 150, 7, '#c9b8ff'),
  radial('star', '#fff7cc', '#fbbf24'),
)

const tarotCard = (rot, fill, symbol) =>
  `<g transform="rotate(${rot} 100 150)"><rect x="62" y="36" width="76" height="118" rx="10" fill="${fill}" ${ST}/>` +
  `<rect x="70" y="44" width="60" height="102" rx="6" fill="none" stroke="#fcd34d" stroke-width="3"/>${symbol}</g>`
art.tarot = svg(
  shadow(52) +
    tarotCard(-16, '#6d28d9', sparkle(100, 95, 18)) +
    tarotCard(14, '#312e81', `<path d="M 108 74 A 24 24 0 1 0 110 118 A 18 18 0 1 1 108 74 Z" fill="#fde68a"/>` + sparkle(116, 124, 6)),
)

// Plump folded cookie seen from the front: two lobes pinched at a centre crease
const cookiePath = 'M 24 132 C 14 72 64 40 100 40 C 136 40 186 72 176 132 C 164 148 136 146 120 128 Q 100 156 80 128 C 64 146 36 148 24 132 Z'
art.cookie = svg(
  shadow(62, 184) +
    `<g transform="rotate(14 130 142)"><rect x="96" y="130" width="84" height="22" rx="3" fill="#fffdf3" ${ST_THIN}/>` +
    `<path d="M 112 141 L 164 141" stroke="#e11d48" stroke-width="3" stroke-linecap="round" stroke-dasharray="10 5"/></g>` +
    `<path d="${cookiePath}" fill="url(#ck)" ${ST}/>` +
    `<path d="M 100 52 C 92 80 92 110 100 136" fill="none" stroke="#b86b1f" stroke-width="5" stroke-linecap="round"/>` +
    shine(58, 76, 16, 7) + face(64, 100, { gap: 13, s: 0.85, mouth: 'cat' }) +
    `<circle cx="140" cy="84" r="3" fill="#b86b1f" opacity=".5"/><circle cx="152" cy="104" r="2.5" fill="#b86b1f" opacity=".5"/><circle cx="128" cy="106" r="2" fill="#b86b1f" opacity=".5"/>` +
    sparkle(168, 36, 10),
  radial('ck', '#ffe7b3', '#e0913a'),
)

art.crystal = svg(
  `<path d="M 50 170 L 60 146 L 140 146 L 150 170 Z" fill="#a16207" ${ST}/>` +
    `<rect x="42" y="166" width="116" height="16" rx="6" fill="#ca8a04" ${ST}/>` +
    `<circle cx="100" cy="94" r="62" fill="url(#cb)" ${ST}/>` +
    `<ellipse cx="74" cy="66" rx="18" ry="10" fill="#fff" opacity=".5" transform="rotate(-35 74 66)"/>` +
    sparkle(112, 100, 16, '#fff') + sparkle(84, 118, 8, '#f5d0fe') + sparkle(128, 70, 6, '#f5d0fe'),
  radial('cb', '#f5d0fe', '#7c3aed', '40%', '35%'),
)

art.coin = svg(
  shadow(48) +
    `<ellipse cx="108" cy="104" rx="60" ry="62" fill="#b7791f" ${ST}/>` +
    `<circle cx="100" cy="100" r="60" fill="url(#cn)" ${ST}/>` +
    `<circle cx="100" cy="100" r="46" fill="none" stroke="#b7791f" stroke-width="4" stroke-dasharray="3 7" stroke-linecap="round"/>` +
    shine(76, 72, 12, 6) + face(100, 98, { gap: 16, mouth: 'open' }) + sparkle(168, 40, 10),
  radial('cn', '#fff1c7', '#f5b94a'),
)

art.mirror = svg(
  shadow(34) +
    tube('M 100 150 L 100 184', '#c084fc', 12) +
    `<ellipse cx="100" cy="88" rx="56" ry="66" fill="#c084fc" ${ST}/>` +
    `<ellipse cx="100" cy="88" rx="44" ry="54" fill="url(#mr)" ${ST_THIN}/>` +
    `<path d="M 72 70 L 92 50 M 76 86 L 108 54" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"/>` +
    heart(112, 110, 1.5, '#ff6f9c') + sparkle(158, 30, 9) + flower(100, 22, '#fbcfe8', '#fde047', 6),
  radial('mr', '#ecfeff', '#a5b4fc'),
)

const bigHeart = (x, y, s, fill) =>
  `<path transform="translate(${x} ${y}) scale(${s})" d="M 0 30 C -44 4 -44 -40 -18 -40 C -6 -40 0 -30 0 -24 C 0 -30 6 -40 18 -40 C 44 -40 44 4 0 30 Z" fill="${fill}" ${ST}/>`
art.hearts = svg(
  shadow(50) +
    bigHeart(128, 100, 1.2, '#f9a8d4') + face(128, 86, { gap: 11, s: 0.75, mouth: 'cat' }) +
    bigHeart(76, 118, 1.3, '#fb7185') + shine(56, 82, 8, 5) + face(76, 104, { gap: 12, s: 0.8, mouth: 'open' }) +
    sparkle(160, 36, 9) + sparkle(30, 50, 7, '#fbcfe8'),
)

art.user = svg(
  `<path d="M 40 188 C 40 150 64 138 100 138 C 136 138 160 150 160 188 Z" fill="#a78bfa" ${ST}/>` +
    `<circle cx="100" cy="92" r="46" fill="#ffe0c7" ${ST}/>` +
    `<path d="M 54 92 C 50 50 80 40 100 40 C 124 40 152 52 146 92 C 136 80 124 70 112 64 C 102 76 80 80 64 76 C 60 82 56 88 54 92 Z" fill="#6d4aa8" ${ST}/>` +
    sparkle(130, 56, 11, '#fde047') + face(100, 98, { gap: 16, mouth: 'smile' }),
)

art.home = svg(
  shadow(52) +
    `<rect x="46" y="92" width="108" height="86" rx="10" fill="#fde2f3" ${ST}/>` +
    `<path d="M 30 100 L 100 34 L 170 100 Z" fill="#8b5cf6" ${ST}/>` +
    `<rect x="84" y="128" width="32" height="50" rx="14" fill="#c084fc" ${ST}/>` +
    `<circle cx="108" cy="154" r="3" fill="${INK}"/>` +
    `<path d="M 116 70 A 12 12 0 1 0 118 90 A 9 9 0 1 1 116 70 Z" fill="#fde047"/>` +
    `<rect x="54" y="110" width="22" height="20" rx="4" fill="#fef9c3" ${ST_THIN}/><rect x="124" y="110" width="22" height="20" rx="4" fill="#fef9c3" ${ST_THIN}/>` +
    sparkle(170, 34, 9),
)

// ---- horoscope categories
art.love = svg(shadow(44) + bigHeart(100, 110, 1.9, 'url(#lv)') + shine(70, 62, 12, 7) + face(100, 92, { gap: 17, mouth: 'open' }) + sparkle(168, 34, 9), radial('lv', '#fecdd3', '#f43f5e'))

art.work = svg(
  shadow(56) +
    `<path d="M 76 60 L 76 46 Q 76 38 84 38 L 116 38 Q 124 38 124 46 L 124 60" fill="none" stroke="${INK}" stroke-width="14"/><path d="M 76 60 L 76 46 Q 76 38 84 38 L 116 38 Q 124 38 124 46 L 124 60" fill="none" stroke="#a16207" stroke-width="6"/>` +
    `<rect x="30" y="58" width="140" height="112" rx="16" fill="url(#wk)" ${ST}/>` +
    `<path d="M 30 100 L 170 100" ${ST}/><rect x="88" y="92" width="24" height="18" rx="4" fill="#fcd34d" ${ST_THIN}/>` +
    shine(58, 74, 12, 5, 0) + face(100, 136, { gap: 20, mouth: 'smile' }),
  radial('wk', '#fde68a', '#d97706'),
)

art.money = svg(
  shadow(52) +
    `<path d="M 72 58 C 58 48 66 30 82 36 L 100 44 L 118 36 C 134 30 142 48 128 58 Z" fill="#65a30d" ${ST}/>` +
    `<path d="M 80 60 C 30 90 30 180 100 180 C 170 180 170 90 120 60 Z" fill="url(#mn)" ${ST}/>` +
    tube('M 78 62 L 122 62', '#fcd34d', 6) +
    shine(70, 98, 10, 16, 20) + face(100, 128, { gap: 17, mouth: 'open' }) +
    `<circle cx="160" cy="160" r="18" fill="#fcd34d" ${ST}/><path d="M 160 150 L 160 170" stroke="#b45309" stroke-width="4" stroke-linecap="round"/>`,
  radial('mn', '#d9f99d', '#4d7c0f'),
)

art.health = svg(
  shadow(48) +
    `<path d="M 100 56 C 96 40 104 28 114 22" fill="none" ${ST}/>` +
    `<path d="M 106 44 C 120 22 150 24 156 36 C 140 50 120 54 106 44 Z" fill="#4ade80" ${ST}/>` +
    `<path d="M 100 60 C 70 40 30 60 32 104 C 34 150 70 184 100 168 C 130 184 166 150 168 104 C 170 60 130 40 100 60 Z" fill="url(#ap)" ${ST}/>` +
    shine(62, 86, 12, 7) + face(100, 112, { gap: 18, mouth: 'smile' }),
  radial('ap', '#bbf7d0', '#16a34a'),
)

art.clover = svg(
  shadow(40) +
    tube('M 100 110 C 104 140 96 160 110 184', '#16a34a', 6) +
    // four heart leaves, each with its point toward the centre
    [0, 90, 180, 270].map((a) => `<g transform="rotate(${a} 100 100)">${bigHeart(100, 70, 0.78, '#4ade80')}</g>`).join('') +
    `<circle cx="100" cy="100" r="10" fill="#22c55e" ${ST_THIN}/>` + face(100, 96, { gap: 9, s: 0.6, mouth: 'tiny' }) + sparkle(162, 40, 9),
)

// ---- elements
art.fire = svg(
  shadow(40) +
    `<path d="M 100 20 C 116 56 160 74 156 124 C 152 164 124 182 100 182 C 70 182 44 160 46 124 C 48 98 62 86 70 72 C 74 92 84 100 90 100 C 84 74 90 44 100 20 Z" fill="url(#fr)" ${ST}/>` +
    `<path d="M 100 110 C 112 126 126 136 122 156 C 118 172 82 172 78 154 C 76 140 90 130 100 110 Z" fill="#fde047" opacity=".9"/>` +
    face(100, 136, { gap: 15, s: 0.95, mouth: 'open' }),
  radial('fr', '#fdba74', '#ef4444', '50%', '70%'),
)

art.earth = svg(
  shadow(60) +
    `<path d="M 16 176 L 70 70 L 100 116 L 128 60 L 184 176 Z" fill="url(#er)" ${ST}/>` +
    `<path d="M 116 84 L 128 60 L 140 84 L 134 80 L 128 88 L 122 80 Z" fill="#fff" ${ST_THIN}/>` +
    `<path d="M 60 90 L 70 70 L 80 90 L 70 86 Z" fill="#fff" ${ST_THIN}/>` +
    face(100, 144, { gap: 18, mouth: 'smile' }) +
    flower(40, 170, '#fbcfe8') + flower(160, 170, '#fef08a', '#fb923c'),
  radial('er', '#bef264', '#15803d', '50%', '20%'),
)

art.air = svg(
  shadow(52) +
    cloud([[64, 110, 30], [96, 88, 36], [134, 100, 30], [150, 124, 22], [100, 128, 30], [58, 132, 20]], '#eef2ff') +
    face(100, 112, { gap: 18, mouth: 'cat', iris: '#6366f1' }) +
    tube('M 20 62 C 50 62 60 50 50 42', '#a5b4fc', 4) + tube('M 150 52 C 170 52 186 60 182 72', '#a5b4fc', 4) +
    tube('M 140 170 C 160 170 176 160 172 150', '#a5b4fc', 4),
)

art.water = svg(
  shadow(44) +
    `<path d="M 100 20 C 120 56 156 88 156 128 C 156 160 130 182 100 182 C 70 182 44 160 44 128 C 44 88 80 56 100 20 Z" fill="url(#wt)" ${ST}/>` +
    shine(76, 100, 9, 18, 20) + face(100, 132, { gap: 18, mouth: 'open', iris: '#1d4ed8' }),
  radial('wt', '#bae6fd', '#2563eb'),
)

// ---- tarot suits
art.wands = svg(
  shadow(30) +
    `<g transform="rotate(20 100 100)">` + tube('M 100 186 L 100 60', '#c08457', 12) +
    `<path d="M 100 70 C 80 60 80 30 100 12 C 120 30 120 60 100 70 Z" fill="#fb923c" ${ST}/><path d="M 100 64 C 92 56 94 42 100 34 C 106 42 108 56 100 64 Z" fill="#fde047"/>` +
    `<path d="M 100 120 C 80 112 70 120 66 130 C 80 134 94 130 100 120 Z" fill="#4ade80" ${ST_THIN}/><path d="M 100 150 C 120 142 130 150 134 160 C 120 164 106 160 100 150 Z" fill="#4ade80" ${ST_THIN}/></g>`,
)

art.cups = svg(
  shadow(40) +
    `<path d="M 46 40 L 154 40 C 154 96 130 118 100 118 C 70 118 46 96 46 40 Z" fill="url(#cp)" ${ST}/>` +
    `<ellipse cx="100" cy="40" rx="54" ry="10" fill="#60a5fa" ${ST}/>` +
    tube('M 100 118 L 100 158', '#f59e0b', 12) +
    `<path d="M 60 172 Q 100 150 140 172 Z" fill="#f59e0b" ${ST}/>` +
    `<circle cx="100" cy="78" r="9" fill="#ef4444" ${ST_THIN}/>` + shine(68, 62, 8, 12, 20) + sparkle(160, 24, 9),
  radial('cp', '#fde68a', '#d97706'),
)

art.swords = svg(
  shadow(30) +
    `<g transform="rotate(-35 100 100)">` +
    `<path d="M 92 150 L 92 44 L 100 16 L 108 44 L 108 150 Z" fill="url(#sw)" ${ST}/>` +
    `<path d="M 100 30 L 100 146" stroke="#fff" stroke-width="3" opacity=".7"/>` +
    `<rect x="64" y="146" width="72" height="14" rx="7" fill="#f59e0b" ${ST}/>` +
    tube('M 100 164 L 100 186', '#7c3aed', 10) + `<circle cx="100" cy="190" r="7" fill="#f59e0b" ${ST_THIN}/></g>` + sparkle(160, 40, 10, '#fff'),
  radial('sw', '#ffffff', '#94a3b8', '30%', '50%'),
)

const starPts = Array.from({ length: 5 }, (_, i) => {
  const a = -Math.PI / 2 + (i * 4 * Math.PI) / 5
  return `${(100 + Math.cos(a) * 44).toFixed(1)},${(100 + Math.sin(a) * 44).toFixed(1)}`
}).join(' ')
art.pentacles = svg(
  shadow(48) +
    `<circle cx="100" cy="100" r="66" fill="url(#pt)" ${ST}/>` +
    `<circle cx="100" cy="100" r="52" fill="none" stroke="#b45309" stroke-width="4"/>` +
    `<polygon points="${starPts}" fill="none" stroke="#b45309" stroke-width="5" stroke-linejoin="round"/>` +
    shine(72, 66, 12, 6) + sparkle(168, 36, 9),
  radial('pt', '#fef3c7', '#f59e0b'),
)

// ---------------------------------------------------------------- write

for (const [name, content] of Object.entries(art)) writeFileSync(join(OUT_DIR, `${name}.svg`), content)
console.log(`Wrote ${Object.keys(art).length} SVGs to ${OUT_DIR}`)
