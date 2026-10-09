// arxwork: the desktop tree's look: file-type badges, row bars, pills and short times.

export const DESK = {
  folder: '#5b9bd5',
  changed: '#e5c07b',
  text: '#ececec',
  muted: '#8b8b8b',
  // The tile the tree sits on, and row highlights inside it.
  tile: '#1d1d1d',
  tileBorder: '#2f2f2f',
  selected: '#2c3440',
  hover: '#262626',
  // Cells per tree row, and the rows the card, search, buttons and tile frame take.
  rowHeight: 2,
  fixedRows: 18,
  // How long a committed file keeps its green bar.
  committedMs: 120_000,
}

// Tree icons, every one in the same 18px square: a rounded folder, or a rounded tile with the
// file type's label. Each is a faint fill of its color under a stroke of it.
export const ICON_PX = 18
// Cells a row keeps free for its icon, drawn over the rows by the pane.
export const ICON_CELLS = 3

const FOLDER_PATH = 'M2.5 5.4a1.6 1.6 0 0 1 1.6-1.6h3.1l1.7 1.9h5a1.6 1.6 0 0 1 1.6 1.6v5.9a1.6 1.6 0 0 1-1.6 1.6H4.1a1.6 1.6 0 0 1-1.6-1.6Z'
const FOLDER_OPEN = 'M2.5 5.4a1.6 1.6 0 0 1 1.6-1.6h3.1l1.7 1.9h5a1.6 1.6 0 0 1 1.6 1.6v.9M2.5 13V5.4M2.5 13l1.6-4.6a1.2 1.2 0 0 1 1.1-.8h10.1a.9.9 0 0 1 .9 1.2l-1.5 4a1.2 1.2 0 0 1-1.1.8H4.1A1.6 1.6 0 0 1 2.5 13Z'

export function iconSvg(icon: { label?: string; color: string; open?: boolean }): string {
  const c = icon.color
  const open = `<svg xmlns="http://www.w3.org/2000/svg" width="${ICON_PX}" height="${ICON_PX}" viewBox="0 0 18 18">`
  if (!icon.label) {
    const d = icon.open ? FOLDER_OPEN : FOLDER_PATH
    return `${open}<path d="${d}" fill="${c}" fill-opacity="0.2" stroke="${c}" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round"/></svg>`
  }
  const size = icon.label.length >= 3 ? 6.6 : 8
  return (
    `${open}<rect x="1.5" y="1.5" width="15" height="15" rx="4" fill="${c}" fill-opacity="0.16" stroke="${c}" stroke-opacity="0.6" stroke-width="1"/>` +
    `<text x="9" y="${size >= 7 ? 11.8 : 11.3}" font-size="${size}" font-weight="700" text-anchor="middle" fill="${c}" font-family="'Segoe UI', system-ui, sans-serif">${icon.label.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text></svg>`
  )
}

// A faint fill of `hex` over the tile: the background behind an icon drawn in `hex`.
export function tint(hex: string, alpha = 0.16): string {
  const v = parseInt(hex.slice(1), 16)
  const base = parseInt(DESK.tile.slice(1), 16)
  const ch = (shift: number) => Math.round(((base >> shift) & 255) * (1 - alpha) + ((v >> shift) & 255) * alpha)
  return `#${[16, 8, 0].map(s => ch(s).toString(16).padStart(2, '0')).join('')}`
}

// One row state: the bar behind the row, the pill on its right and the name color.
export const ROW_STATES = {
  editing: { bar: '#3a2516', pillBg: '#5c3519', pill: '#fb9a4b', label: 'editing' },
  edited: { bar: '#3a2516', pillBg: '#5c3519', pill: '#fb9a4b', label: 'edited' },
  reading: { bar: '#2a2140', pillBg: '#3d2c5c', pill: '#c084fc', label: 'reading' },
  read: { bar: '#2a2140', pillBg: '#3d2c5c', pill: '#c084fc', label: 'read' },
  committed: { bar: '#17301f', pillBg: '#1d4a2b', pill: '#4ade80', label: 'committed' },
} as const

export type RowState = keyof typeof ROW_STATES

const BADGES: [RegExp, string, string][] = [
  [/\.(m|c)?jsx?$/i, 'JS', '#e5c07b'],
  [/\.(m|c)?tsx?$/i, 'TS', '#5b9bd5'],
  [/\.jsonc?$/i, '{}', '#98c379'],
  [/\.(md|mdx)$/i, 'MD', '#9a9a9a'],
  [/\.(css|scss|sass|less)$/i, 'CSS', '#c084fc'],
  [/\.html?$/i, 'HTM', '#f0883e'],
  [/\.py$/i, 'PY', '#5b9bd5'],
  [/\.rs$/i, 'RS', '#f0883e'],
  [/\.(ya?ml|toml|ini)$/i, 'CFG', '#9a9a9a'],
  [/\.(png|jpe?g|gif|webp|svg|ico)$/i, 'IMG', '#4fb3a8'],
  [/\.(blend|blend1|fbx|obj|glb|gltf)$/i, '3D', '#f0883e'],
  [/\.(sh|ps1|cmd|bat)$/i, 'SH', '#98c379'],
  [/^\.git(ignore|attributes|modules)?$/i, 'GIT', '#9a9a9a'],
  [/^\.env/i, 'ENV', '#e5c07b'],
  [/\.lock$|^package-lock\.json$/i, 'LCK', '#8b8b8b'],
]

export function fileBadge(name: string): { label: string; color: string } {
  for (const [re, label, color] of BADGES) if (re.test(name)) return { label, color }
  const ext = /\.([a-z0-9]{1,3})[a-z0-9]*$/i.exec(name)?.[1]
  return { label: ext ? ext.toUpperCase() : '··', color: DESK.muted }
}

export function shortStamp(ms: number, now: number): string {
  if (!ms) return ''
  const d = new Date(ms)
  const n = new Date(now)
  const p = (v: number) => String(v).padStart(2, '0')
  if (d.toDateString() === n.toDateString()) return `${p(d.getHours())}:${p(d.getMinutes())}`
  const month = d.toLocaleString('en', { month: 'short' })
  return d.getFullYear() === n.getFullYear() ? `${month} ${d.getDate()}` : `${month} ${d.getFullYear()}`
}

// Status pills ("EDITED", "COMMITTED"): fully rounded, the label centered, drawn over the cells a
// row keeps free for them at its right edge. A cell is at least 6px, so pillCells always holds pillPx.
export function pillPx(label: string): number {
  return Math.round(label.length * 6.6 + 18)
}

export function pillCells(label: string): number {
  return label.length + 4
}

export function pillSvg(pill: { label: string; color: string; bg: string }): string {
  const w = pillPx(pill.label)
  const text = pill.label.toUpperCase().replace(/&/g, '&amp;').replace(/</g, '&lt;')
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="18" viewBox="0 0 ${w} 18">` +
    `<rect x="0" y="0" width="${w}" height="18" rx="9" fill="${pill.bg}"/>` +
    `<text x="${w / 2}" y="12.6" font-size="10" font-weight="700" letter-spacing="0.6" text-anchor="middle" fill="${pill.color}" font-family="'Segoe UI', system-ui, sans-serif">${text}</text></svg>`
  )
}
