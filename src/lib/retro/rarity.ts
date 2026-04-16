// ─── Raridades ────────────────────────────────────────────────────────────────
// Extraído de RetrospectivaPlayer.tsx (linhas 6-17)
// Fonte única de verdade pra raridades no sistema de conquistas

export type Rarity = 'comum' | 'incomum' | 'raro' | 'epico' | 'lendario'

export type RarityConfig = {
  label: string
  color: string
  bg: string
  glow: string
  glowSize: string
  shimmer: boolean
  particles: boolean
}

export const RARITY_CONFIG: Record<Rarity, RarityConfig> = {
  comum: {
    label: 'Comum',
    color: 'rgba(190,190,190,.9)',
    bg: 'rgba(80,80,80,.35)',
    glow: 'rgba(180,180,180,.0)',
    glowSize: '0px',
    shimmer: false,
    particles: false,
  },
  incomum: {
    label: 'Incomum',
    color: 'rgba(100,180,255,1)',
    bg: 'rgba(30,80,180,.4)',
    glow: 'rgba(80,160,255,.35)',
    glowSize: '12px',
    shimmer: false,
    particles: false,
  },
  raro: {
    label: 'Raro',
    color: 'rgba(200,100,255,1)',
    bg: 'rgba(100,30,180,.45)',
    glow: 'rgba(160,60,255,.45)',
    glowSize: '18px',
    shimmer: true,
    particles: false,
  },
  epico: {
    label: 'Épico',
    color: 'rgba(255,210,50,1)',
    bg: 'rgba(160,100,0,.45)',
    glow: 'rgba(255,190,30,.55)',
    glowSize: '24px',
    shimmer: true,
    particles: false,
  },
  lendario: {
    label: 'Lendário',
    color: 'rgba(255,100,200,1)',
    bg: 'rgba(140,0,80,.5)',
    glow: 'rgba(248,87,166,.7)',
    glowSize: '30px',
    shimmer: true,
    particles: true,
  },
}

/** Ordem de prioridade (menor = mais raro) pra ordenação */
export const RARITY_ORDER: Record<Rarity, number> = {
  lendario: 0,
  epico: 1,
  raro: 2,
  incomum: 3,
  comum: 4,
}