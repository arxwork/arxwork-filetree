// arxwork: the pieces of the desktop's activity cards. A card is a native box (fixed height,
// full width); its icon circle and tags are small SVGs of fixed size drawn inside it.

export type CardInput = {
  // "RIGHT NOW", "13 MIN AGO": drawn at the right edge of the title line.
  time: string
  // What is happening to it: "EDITING", "READ", "COMMITTED", a colored tag before the title.
  action: string
  // The file name, a commit hash.
  title: string
  // Where it sits: "PROJECT > FILES", a grey tag under the title.
  tag: string
  tone: 'read' | 'edit' | 'git' | 'idle' | 'failed'
}

export const CARD_COLORS = {
  read: '#c084fc',
  edit: '#f0883e',
  git: '#4ade80',
  idle: '#8b8b8b',
  failed: '#f87171',
  text: '#f2f2f2',
  muted: '#9a9a9a',
  card: '#232323',
  border: '#343434',
  tag: '#2e2e2e',
}

// Cells a card takes: its border and two lines; and how much each card down the stack fades.
export const CARD_ROWS = 3
export const CARD_GAP = 1
export const CARD_FADE = [1, 0.85, 0.72, 0.6, 0.5]
export const CARD_ICON_PX = 30
export const TAG_PX_H = 15

const FONT = "font-family=\"'Segoe UI', system-ui, -apple-system, sans-serif\""

const ICONS: Record<CardInput['tone'], string> = {
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  read: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  git: '<circle cx="12" cy="12" r="3"/><path d="M3 12h6"/><path d="M15 12h6"/>',
  idle: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  failed: '<circle cx="12" cy="12" r="9"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export function fit(s: string, max: number): string {
  return s.length > max ? s.slice(0, Math.max(1, max - 1)) + '…' : s
}

// `hex` faded toward the card's own color: what a card lower in the stack draws.
export function fade(hex: string, amount: number): string {
  const a = parseInt(hex.slice(1), 16)
  const b = parseInt(CARD_COLORS.card.slice(1), 16)
  const ch = (s: number) => Math.round(((a >> s) & 255) * amount + ((b >> s) & 255) * (1 - amount))
  return `#${[16, 8, 0].map(s => ch(s).toString(16).padStart(2, '0')).join('')}`
}

// The event's icon in a faint circle of its color.
export function toneIconSvg(tone: CardInput['tone'], amount = 1): string {
  const c = CARD_COLORS[tone]
  const s = CARD_ICON_PX
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 36 36"><g opacity="${amount}">` +
    `<circle cx="18" cy="18" r="18" fill="${c}" fill-opacity="0.16"/>` +
    `<g transform="translate(9 9) scale(0.75)" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${ICONS[tone]}</g></g></svg>`
  )
}

// A rounded uppercase tag: uppercase 9px with letter spacing runs about 6px a glyph.
export function tagPx(text: string): number {
  return Math.round(text.length * 6 + 14)
}

export function tagSvg(text: string, color: string, fill: string, fillOpacity: number, amount = 1): string {
  const label = text.toUpperCase()
  const w = tagPx(label)
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${TAG_PX_H}" viewBox="0 0 ${w} ${TAG_PX_H}"><g opacity="${amount}">` +
    `<rect width="${w}" height="${TAG_PX_H}" rx="7.5" fill="${fill}" fill-opacity="${fillOpacity}"/>` +
    `<text x="${w / 2}" y="10.7" font-size="9" font-weight="700" letter-spacing="0.6" text-anchor="middle" fill="${color}" ${FONT}>${esc(label)}</text></g></svg>`
  )
}

// The card's "2 min ago": small, plain, right-aligned in its box, below the title in weight.
export function timePx(text: string): number {
  return Math.round(text.length * 5.6 + 4)
}

export function timeSvg(text: string, color: string): string {
  const w = timePx(text)
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${TAG_PX_H}" viewBox="0 0 ${w} ${TAG_PX_H}">` +
    `<text x="${w}" y="11" font-size="11" text-anchor="end" fill="${color}" ${FONT}>${esc(text)}</text></svg>`
  )
}
