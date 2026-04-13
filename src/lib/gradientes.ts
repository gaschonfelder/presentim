/**
 * Gradientes pré-definidos usados como fundo da página do presente.
 *
 * Cada preset tem:
 * - key: identificador único (usado em config, comparação)
 * - label: nome exibido no seletor
 * - css: string CSS completa (linear-gradient) — é o valor que vai pro banco
 * - previewColors: 2 cores usadas pra mostrar o preview no seletor
 */

export type GradientePreset = {
  key: string
  label: string
  css: string
  /** Duas cores representativas pra mostrar no thumb do seletor */
  previewColors: [string, string]
}

export const GRADIENTE_PRESETS: GradientePreset[] = [
  {
    key: 'lavanda',
    label: 'Lavanda',
    css: 'linear-gradient(135deg, #e0c3fc 0%, #ffd6e0 50%, #ffb088 100%)',
    previewColors: ['#e0c3fc', '#ffb088'],
  },
  {
    key: 'algodao',
    label: 'Algodão',
    css: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
    previewColors: ['#fbc2eb', '#a6c1ee'],
  },
  {
    key: 'pessego',
    label: 'Pêssego',
    css: 'linear-gradient(135deg, #ffe0c1 0%, #ffb6b9 100%)',
    previewColors: ['#ffe0c1', '#ffb6b9'],
  },
  {
    key: 'menta',
    label: 'Menta',
    css: 'linear-gradient(135deg, #c2f0e6 0%, #fed6e3 100%)',
    previewColors: ['#c2f0e6', '#fed6e3'],
  },
  {
    key: 'champanhe',
    label: 'Champanhe',
    css: 'linear-gradient(135deg, #fef6e4 0%, #fbcfe8 100%)',
    previewColors: ['#fef6e4', '#fbcfe8'],
  },
  {
    key: 'ceu',
    label: 'Céu',
    css: 'linear-gradient(135deg, #cfe2ff 0%, #e8e3f2 100%)',
    previewColors: ['#cfe2ff', '#e8e3f2'],
  },
  {
    key: 'sunset',
    label: 'Sunset',
    css: 'linear-gradient(135deg, #ffd89b 0%, #ffadbc 100%)',
    previewColors: ['#ffd89b', '#ffadbc'],
  },
  {
    key: 'nuvem',
    label: 'Nuvem',
    css: 'linear-gradient(220deg, #fdf0f3 0%, #e8d5ff 100%)',
    previewColors: ['#fdf0f3', '#e8d5ff'],
  },
]

/** Retorna o preset pela chave, ou `null` se não encontrar */
export function getGradientePreset(key: string | null | undefined): GradientePreset | null {
  if (!key) return null
  return GRADIENTE_PRESETS.find(p => p.key === key) ?? null
}