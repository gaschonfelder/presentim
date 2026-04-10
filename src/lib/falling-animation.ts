/**
 * Configuração da animação de partículas caindo no presente.
 *
 * Cada preset define:
 * - emojis: array de emojis usados aleatoriamente nas partículas
 * - label: nome exibido no seletor
 * - icon: emoji que representa o preset no botão de seleção
 */

export type FallingType = 'flores' | 'coracoes' | 'estrelas' | 'bolhas' | 'personalizado'

export type FallingAnimation = {
  enabled: boolean
  type: FallingType
  /** Usado apenas quando type === 'personalizado' */
  customEmoji?: string
}

export type FallingPreset = {
  type: FallingType
  label: string
  icon: string
  emojis: string[]
}

export const FALLING_PRESETS: Record<Exclude<FallingType, 'personalizado'>, FallingPreset> = {
  flores: {
    type: 'flores',
    label: 'Flores',
    icon: '🌸',
    emojis: ['🌸', '🌺', '🌷', '🌹', '🌼', '💐'],
  },
  coracoes: {
    type: 'coracoes',
    label: 'Corações',
    icon: '💕',
    emojis: ['❤️', '💕', '💖', '💗', '💝', '💞'],
  },
  estrelas: {
    type: 'estrelas',
    label: 'Estrelas',
    icon: '⭐',
    emojis: ['⭐', '✨', '🌟', '💫', '⚡'],
  },
  bolhas: {
    type: 'bolhas',
    label: 'Bolhas',
    icon: '🫧',
    emojis: ['🫧', '⚪', '🔵', '💧'],
  },
}

/** Retorna os emojis a serem usados baseado no tipo + emoji custom (se aplicável) */
export function getEmojisForAnimation(animation: FallingAnimation): string[] {
  if (animation.type === 'personalizado') {
    const custom = animation.customEmoji?.trim()
    if (!custom) return ['✨'] // fallback
    // Permite múltiplos emojis no mesmo input — só pega 6 primeiros
    // Usa Array.from pra dividir corretamente em grafemas (suporta surrogate pairs)
    const chars = Array.from(custom).slice(0, 6)
    return chars.length > 0 ? chars : ['✨']
  }
  return FALLING_PRESETS[animation.type].emojis
}

export const DEFAULT_FALLING_ANIMATION: FallingAnimation = {
  enabled: false,
  type: 'flores',
}