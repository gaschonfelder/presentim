// ─── Sistema de temas ─────────────────────────────────────────────────────────
// Cada tema define TODAS as cores usadas na retrospectiva.
// Nenhum slide deve hardcodar cores — tudo vem daqui.

export type RetroTheme = {
  id: string
  name: string
  emoji: string

  /** Gradientes de fundo por slide */
  bg: {
    intro: string
    season: string
    counter: string
    sky: string
    photos: string
    stats: string
    achievements: string
    message: string
    end: string
  }

  /** Cores de destaque */
  accent: string
  accentAlt: string
  accentGradient: string

  /** Cores de texto */
  text: {
    primary: string
    secondary: string
    muted: string
    eyebrow: string
  }

  /** Chips (badges inline) */
  chip: {
    bg: string
    border: string
    text: string
  }

  /** Barra de progresso */
  progress: {
    active: string
    done: string
    inactive: string
  }

  /** Botões de navegação */
  nav: {
    bg: string
    border: string
    color: string
  }

  /** Card de conquista (fundo genérico) */
  achievementCard: {
    bg: string
    border: string
  }

  /** Card de stat */
  statCard: {
    bg: string
    border: string
  }

  /** Corações flutuantes */
  floatingEmojis: string[]

  /** Música chip */
  musicChip: {
    bg: string
    border: string
    iconBg: string
  }
}

// ─── Tema: Neon (padrão — escuro) ─────────────────────────────────────────────

export const THEME_NEON: RetroTheme = {
  id: 'neon',
  name: 'Neon',
  emoji: '🌙',

  bg: {
    intro:        'radial-gradient(ellipse at 50% 30%, #2d0033 0%, #0a0010 60%, #06050f 100%)',
    season:       'radial-gradient(ellipse at 50% 25%, #1a1200 0%, #0a0800 70%)',
    counter:      'radial-gradient(ellipse at 50% 50%, #0a001a 0%, #03000d 70%)',
    sky:          'radial-gradient(ellipse at 50% 35%, #05103a 0%, #020414 100%)',
    photos:       'radial-gradient(ellipse at 50% 50%, #1a0e2e 0%, #080610 100%)',
    stats:        'radial-gradient(ellipse at 40% 20%, #0f1e3a 0%, #06050f 70%)',
    achievements: 'radial-gradient(ellipse at 30% 70%, #003825 0%, #000d08 70%)',
    message:      'radial-gradient(ellipse at 50% 50%, #45001e 0%, #180008 70%)',
    end:          'radial-gradient(ellipse at 50% 35%, #1a1a50 0%, #070714 70%)',
  },

  accent: '#f857a6',
  accentAlt: '#ffa726',
  accentGradient: 'linear-gradient(135deg, #f857a6, #ffa726)',

  text: {
    primary: '#ffffff',
    secondary: 'rgba(255,255,255,.55)',
    muted: 'rgba(255,255,255,.35)',
    eyebrow: 'rgba(255,255,255,.45)',
  },

  chip: {
    bg: 'rgba(255,255,255,.1)',
    border: 'rgba(255,255,255,.15)',
    text: 'rgba(255,255,255,.75)',
  },

  progress: {
    active: 'rgba(255,255,255,.5)',
    done: 'rgba(255,255,255,.9)',
    inactive: 'rgba(255,255,255,.22)',
  },

  nav: {
    bg: 'rgba(255,255,255,.12)',
    border: 'rgba(255,255,255,.18)',
    color: '#ffffff',
  },

  achievementCard: {
    bg: 'rgba(255,255,255,.05)',
    border: 'rgba(255,255,255,.09)',
  },

  statCard: {
    bg: 'rgba(255,255,255,.06)',
    border: 'rgba(255,255,255,.09)',
  },

  floatingEmojis: ['❤️', '🌸', '✨', '💕', '🌹'],

  musicChip: {
    bg: 'rgba(0,0,0,.55)',
    border: 'rgba(255,255,255,.15)',
    iconBg: 'rgba(255,60,60,.9)',
  },
}

// ─── Tema: Aurora (claro) ─────────────────────────────────────────────────────
// Tom suave com fundos claros, acentos em rosa antigo e dourado.
// Inspiração: papel de carta vintage, manhã ensolarada, pétalas de rosa.

export const THEME_AURORA: RetroTheme = {
  id: 'aurora',
  name: 'Aurora',
  emoji: '🌅',

  bg: {
    intro:        'radial-gradient(ellipse at 50% 30%, #fff5f7 0%, #fce4ec 40%, #f8e8ee 100%)',
    season:       'radial-gradient(ellipse at 50% 25%, #fffbf0 0%, #fef3e2 70%)',
    counter:      'radial-gradient(ellipse at 50% 50%, #f5f0ff 0%, #ede4f7 70%)',
    sky:          'radial-gradient(ellipse at 50% 35%, #1a2444 0%, #0c1222 100%)', // céu sempre escuro
    photos:       'radial-gradient(ellipse at 50% 50%, #fef7f0 0%, #f8ece0 100%)',
    stats:        'radial-gradient(ellipse at 40% 20%, #f0f4ff 0%, #e8edf8 70%)',
    achievements: 'radial-gradient(ellipse at 30% 70%, #f0faf5 0%, #e2f5ec 70%)',
    message:      'radial-gradient(ellipse at 50% 50%, #fff0f3 0%, #fce4ea 70%)',
    end:          'radial-gradient(ellipse at 50% 35%, #f8f0ff 0%, #efe4f8 70%)',
  },

  accent: '#d4637b',
  accentAlt: '#c9956b',
  accentGradient: 'linear-gradient(135deg, #d4637b, #c9956b)',

  text: {
    primary: '#2d2235',
    secondary: 'rgba(45,34,53,.6)',
    muted: 'rgba(45,34,53,.4)',
    eyebrow: 'rgba(45,34,53,.5)',
  },

  chip: {
    bg: 'rgba(45,34,53,.06)',
    border: 'rgba(45,34,53,.12)',
    text: 'rgba(45,34,53,.65)',
  },

  progress: {
    active: 'rgba(45,34,53,.4)',
    done: 'rgba(45,34,53,.7)',
    inactive: 'rgba(45,34,53,.15)',
  },

  nav: {
    bg: 'rgba(45,34,53,.08)',
    border: 'rgba(45,34,53,.15)',
    color: '#2d2235',
  },

  achievementCard: {
    bg: 'rgba(45,34,53,.04)',
    border: 'rgba(45,34,53,.08)',
  },

  statCard: {
    bg: 'rgba(45,34,53,.04)',
    border: 'rgba(45,34,53,.08)',
  },

  floatingEmojis: ['🌸', '🩷', '✨', '🌷', '🦋'],

  musicChip: {
    bg: 'rgba(255,255,255,.85)',
    border: 'rgba(45,34,53,.15)',
    iconBg: 'rgba(212,99,123,.85)',
  },
}

// ─── Registry ─────────────────────────────────────────────────────────────────

export const THEMES: Record<string, RetroTheme> = {
  neon: THEME_NEON,
  aurora: THEME_AURORA,
}

export const DEFAULT_THEME_ID = 'neon'

export function getTheme(id?: string | null): RetroTheme {
  if (id && THEMES[id]) return THEMES[id]
  return THEMES[DEFAULT_THEME_ID]
}