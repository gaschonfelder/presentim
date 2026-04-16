// ─── Astronomia ───────────────────────────────────────────────────────────────
// Extraído de RetrospectivaPlayer.tsx (linhas 92-105)
// + constelações (NOVO)

// ─── Fase da lua ──────────────────────────────────────────────────────────────

export function getMoonPhase(d: Date): number {
  const k = new Date('2000-01-06T18:14:00Z')
  const diff = (d.getTime() - k.getTime()) / 86400000
  const c = 29.530588853
  return (((diff % c) + c) % c) / c
}

export type MoonInfo = { emoji: string; name: string }

export function moonInfo(p: number): MoonInfo {
  if (p < 0.03 || p > 0.97) return { emoji: '🌑', name: 'Lua Nova' }
  if (p < 0.22) return { emoji: '🌒', name: 'Lua Crescente' }
  if (p < 0.28) return { emoji: '🌓', name: 'Quarto Crescente' }
  if (p < 0.47) return { emoji: '🌔', name: 'Gibosa Crescente' }
  if (p < 0.53) return { emoji: '🌕', name: 'Lua Cheia' }
  if (p < 0.72) return { emoji: '🌖', name: 'Gibosa Minguante' }
  if (p < 0.78) return { emoji: '🌗', name: 'Quarto Minguante' }
  return { emoji: '🌘', name: 'Lua Minguante' }
}

// ─── Cálculos astronômicos ────────────────────────────────────────────────────

export function julianDay(d: Date): number {
  const y = d.getUTCFullYear()
  const m = d.getUTCMonth() + 1
  const dd = d.getUTCDate()
  return (
    367 * y -
    Math.floor((7 * (y + Math.floor((m + 9) / 12))) / 4) +
    Math.floor((275 * m) / 9) +
    dd +
    1721013.5
  )
}

export function localSiderealTime(d: Date, lng: number): number {
  const jd = julianDay(d)
  const T = (jd - 2451545) / 36525
  let g =
    280.46061837 +
    360.98564736629 * (jd - 2451545) +
    0.000387933 * T * T -
    (T * T * T) / 38710000
  return ((g + lng) % 360 + 360) % 360
}

export function raDecToAltAz(
  ra: number,
  dec: number,
  lat: number,
  lst: number,
): { alt: number; az: number } {
  const ha = ((lst - ra) % 360 + 360) % 360
  const haR = (ha * Math.PI) / 180
  const decR = (dec * Math.PI) / 180
  const latR = (lat * Math.PI) / 180

  const sinAlt =
    Math.sin(decR) * Math.sin(latR) +
    Math.cos(decR) * Math.cos(latR) * Math.cos(haR)
  const alt = Math.asin(Math.max(-1, Math.min(1, sinAlt))) * (180 / Math.PI)

  const cosAz =
    (Math.sin(decR) - Math.sin((alt * Math.PI) / 180) * Math.sin(latR)) /
    (Math.cos((alt * Math.PI) / 180) * Math.cos(latR))
  let az = Math.acos(Math.max(-1, Math.min(1, cosAz))) * (180 / Math.PI)
  if (Math.sin(haR) > 0) az = 360 - az

  return { alt, az }
}

export function altAzToXY(
  alt: number,
  az: number,
  W: number,
  H: number,
): { x: number; y: number; visible: boolean } {
  const r = (1 - alt / 90) * (H * 0.52)
  const theta = ((az - 180) * Math.PI) / 180
  return {
    x: W / 2 + r * Math.sin(theta),
    y: H * 0.4 + r * Math.cos(theta),
    visible: alt > 4,
  }
}

export function pseudoRand(n: number): number {
  const x = Math.sin(n + 1) * 43758.5453
  return x - Math.floor(x)
}

// ─── Catálogo de estrelas brilhantes ──────────────────────────────────────────
// [RA, Dec, magnitude, nome]

export type StarEntry = [number, number, number, string]

export const BRIGHT_STARS: StarEntry[] = [
  [101.287, -16.716, -1.46, 'Sírius'],
  [95.988, -52.696, -0.74, 'Canopo'],
  [219.917, -60.834, -0.29, 'Rigil Kent.'],
  [213.915, 19.182, -0.05, 'Arcturus'],
  [279.235, 38.783, 0.03, 'Vega'],
  [114.825, 5.225, 0.12, 'Procyon'],
  [88.793, 7.407, 0.42, 'Betelgeuse'],
  [78.634, -8.201, 0.13, 'Rigel'],
  [24.429, -57.237, 0.50, 'Achernar'],
  [116.329, 28.026, 0.71, 'Pólux'],
  [297.696, 8.868, 0.77, 'Altair'],
  [68.980, 16.509, 0.85, 'Aldebaran'],
  [152.093, 11.967, 1.00, 'Régulo'],
  [344.413, -29.621, 1.16, 'Fomalhaut'],
  // Novas estrelas pro catálogo expandido
  [79.172, 45.998, 1.65, 'Capella'],
  [187.791, -57.113, 1.25, 'Mimosa'],
  [186.650, -63.099, 0.77, 'Acrux'],
  [191.930, -59.689, 1.59, 'Gacrux'],
  [104.656, -28.972, 1.50, 'Wezen'],
  [263.402, -37.104, 1.62, 'Shaula'],
  [247.352, -26.432, 1.06, 'Antares'],
  [210.956, -60.373, 1.33, 'Hadar'],
  [201.298, -11.161, 0.98, 'Spica'],
  [310.358, 45.280, 1.25, 'Deneb'],
  [37.954, 89.264, 1.98, 'Polaris'],
  [81.283, 6.350, 1.64, 'Bellatrix'],
  [84.053, -1.202, 1.69, 'Alnilam'],
  [83.002, -0.299, 1.70, 'Alnitak'],
  [81.573, -1.943, 2.23, 'Mintaka'],
  [88.079, -1.942, 2.07, 'Saiph'],
  [122.383, -47.337, 1.68, 'Avior'],
  [138.300, -69.717, 1.67, 'Miaplacidus'],
  [113.650, 31.888, 1.58, 'Castor'],
  [283.816, -26.296, 1.85, 'Kaus Austr.'],
  [305.557, -14.782, 1.77, 'Dabih'],
]

// ─── Constelações ─────────────────────────────────────────────────────────────
// Cada constelação tem: nome, abreviação, linhas (pares de nomes de estrelas),
// e uma posição central aproximada em RA/Dec pra determinar visibilidade

export type Constellation = {
  name: string
  abbr: string
  centerRA: number
  centerDec: number
  /** Pares de nomes de estrelas que formam as linhas */
  lines: [string, string][]
}

export const CONSTELLATIONS: Constellation[] = [
  {
    name: 'Órion',
    abbr: 'Ori',
    centerRA: 84,
    centerDec: 0,
    lines: [
      ['Betelgeuse', 'Bellatrix'],
      ['Betelgeuse', 'Alnilam'],
      ['Bellatrix', 'Mintaka'],
      ['Mintaka', 'Alnilam'],
      ['Alnilam', 'Alnitak'],
      ['Alnitak', 'Saiph'],
      ['Saiph', 'Rigel'],
      ['Rigel', 'Mintaka'],
    ],
  },
  {
    name: 'Cruzeiro do Sul',
    abbr: 'Cru',
    centerRA: 189,
    centerDec: -60,
    lines: [
      ['Acrux', 'Gacrux'],
      ['Mimosa', 'Gacrux'], // braço lateral (delta Cru não está, usa Gacrux como proxy)
    ],
  },
  {
    name: 'Escorpião',
    abbr: 'Sco',
    centerRA: 255,
    centerDec: -30,
    lines: [
      ['Antares', 'Shaula'],
    ],
  },
  {
    name: 'Triângulo de Verão',
    abbr: 'Sum',
    centerRA: 296,
    centerDec: 30,
    lines: [
      ['Vega', 'Deneb'],
      ['Deneb', 'Altair'],
      ['Altair', 'Vega'],
    ],
  },
  {
    name: 'Cão Maior',
    abbr: 'CMa',
    centerRA: 101,
    centerDec: -20,
    lines: [
      ['Sírius', 'Wezen'],
    ],
  },
  {
    name: 'Gêmeos',
    abbr: 'Gem',
    centerRA: 114,
    centerDec: 28,
    lines: [
      ['Castor', 'Pólux'],
    ],
  },
  {
    name: 'Centauro',
    abbr: 'Cen',
    centerRA: 215,
    centerDec: -50,
    lines: [
      ['Rigil Kent.', 'Hadar'],
    ],
  },
]

// ─── Helper: achar as 2 constelações mais visíveis ────────────────────────────

export function findVisibleConstellations(
  lat: number,
  lng: number,
  date: Date,
  maxCount: number = 2,
): Constellation[] {
  const skyDate = new Date(date)
  skyDate.setHours(22, 0, 0)
  const lst = localSiderealTime(skyDate, lng)

  // Calcula altitude do centro de cada constelação
  const scored = CONSTELLATIONS.map((c) => {
    const { alt } = raDecToAltAz(c.centerRA, c.centerDec, lat, lst)
    return { constellation: c, alt }
  })
    .filter((s) => s.alt > 15) // mínimo 15° acima do horizonte
    .sort((a, b) => b.alt - a.alt) // mais alta primeiro

  return scored.slice(0, maxCount).map((s) => s.constellation)
}