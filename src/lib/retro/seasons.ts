// ─── Estações do ano ──────────────────────────────────────────────────────────
// Extraído de RetrospectivaPlayer.tsx (linhas 120-126)
// Nota: usa estações do hemisfério sul (Brasil)

export type SeasonKey = 'summer' | 'autumn' | 'winter' | 'spring'

export type SeasonInfo = {
  icon: string
  name: string
  desc: string
  chips: string[]
}

export const SEASONS: Record<SeasonKey, SeasonInfo> = {
  summer: {
    icon: '☀️',
    name: 'Verão',
    desc: 'Calor, luz e energia. O verão reflete a intensidade do que vocês sentiram desde o primeiro momento.',
    chips: ['☀️ Verão', '🌊 Dias quentes', '🍦 Sorvete a dois'],
  },
  autumn: {
    icon: '🍂',
    name: 'Outono',
    desc: 'Transformação e profundidade. O outono representa a beleza das mudanças que o amor traz.',
    chips: ['🍂 Outono', '🌬️ Ventos novos', '🍵 Chá quentinho'],
  },
  winter: {
    icon: '❄️',
    name: 'Inverno',
    desc: 'Uma época fria, mas o amor de vocês aqueceu tudo ao redor.',
    chips: ['❄️ Inverno', '🧣 Agasalhos', '☕ Café quentinho'],
  },
  spring: {
    icon: '🌸',
    name: 'Primavera',
    desc: 'Florescimento e novos começos. Vocês eram o renascimento um do outro.',
    chips: ['🌸 Primavera', '🌼 Flores', '🦋 Novos começos'],
  },
}

/** Determina estação do hemisfério sul pela data */
export function getSeason(d: Date): SeasonKey {
  const m = d.getMonth() + 1
  const dd = d.getDate()

  if ((m === 12 && dd >= 21) || m <= 2 || (m === 3 && dd < 20)) return 'summer'
  if ((m === 3 && dd >= 20) || m <= 5 || (m === 6 && dd < 21)) return 'autumn'
  if ((m === 6 && dd >= 21) || m <= 8 || (m === 9 && dd < 22)) return 'winter'
  return 'spring'
}