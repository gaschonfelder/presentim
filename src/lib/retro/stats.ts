// ─── Estatísticas embasadas ───────────────────────────────────────────────────
// Dados de referência + fórmulas pra stats reais na retrospectiva
//
// FONTES:
// - Duração mediana de relacionamentos: IBGE (Estatísticas do Registro Civil 2022)
//   Duração média de casamentos que terminam em divórcio no Brasil: ~14 anos
//   Mas a maioria dos casais aqui são jovens/namorando, não casados.
//   Usamos distribuição estimada pra namoros (mais curta).
//
// - Valores hardcoded — atualizar periodicamente conforme base cresce.
//   Última atualização: Abril 2026

// ─── Distribuição de duração de namoros (percentis) ───────────────────────────
// Baseado em: pesquisas de comportamento + dados agregados do Presentim
// Interpretação: se um casal tem X dias juntos, está no percentil Y

const DURATION_PERCENTILES: [number, number][] = [
  // [dias, percentil]
  [7, 5],
  [30, 12],
  [60, 18],
  [90, 25],
  [120, 30],
  [180, 38],
  [270, 45],
  [365, 55],
  [500, 62],
  [548, 65],
  [730, 73],
  [1000, 80],
  [1095, 83],
  [1460, 88],
  [1825, 92],
  [2555, 95],
  [3650, 98],
]

/** Calcula percentil de duração do relacionamento (interpolação linear) */
export function getDurationPercentile(dias: number): number {
  if (dias <= 0) return 1

  // Antes do primeiro ponto
  if (dias < DURATION_PERCENTILES[0][0]) {
    return Math.max(1, Math.floor((dias / DURATION_PERCENTILES[0][0]) * DURATION_PERCENTILES[0][1]))
  }

  // Depois do último ponto
  const last = DURATION_PERCENTILES[DURATION_PERCENTILES.length - 1]
  if (dias >= last[0]) return Math.min(99, last[1])

  // Interpolação
  for (let i = 0; i < DURATION_PERCENTILES.length - 1; i++) {
    const [d1, p1] = DURATION_PERCENTILES[i]
    const [d2, p2] = DURATION_PERCENTILES[i + 1]
    if (dias >= d1 && dias < d2) {
      const t = (dias - d1) / (d2 - d1)
      return Math.floor(p1 + t * (p2 - p1))
    }
  }

  return 50
}

// ─── Nível de vínculo ─────────────────────────────────────────────────────────
// Baseado em psicologia de relacionamentos — fases de Knapp (1978)
// Adaptado pra uma escala amigável ao produto

export type BondLevel = {
  level: number
  name: string
  desc: string
  bar: number // 0-100
}

export function getBondLevel(dias: number): BondLevel {
  if (dias < 30) return { level: 1, name: 'Descoberta', desc: 'Tudo é novo e emocionante', bar: 15 }
  if (dias < 90) return { level: 2, name: 'Experimentação', desc: 'Vocês testam compatibilidades', bar: 28 }
  if (dias < 180) return { level: 3, name: 'Intensificação', desc: 'O relacionamento ficou sério', bar: 40 }
  if (dias < 365) return { level: 4, name: 'Integração', desc: 'Já são parte da vida um do outro', bar: 55 }
  if (dias < 730) return { level: 5, name: 'Vínculo', desc: 'Existe compromisso real', bar: 68 }
  if (dias < 1095) return { level: 6, name: 'Consolidação', desc: 'O amor amadureceu', bar: 78 }
  if (dias < 1825) return { level: 7, name: 'Parceria', desc: 'Vocês são um time de verdade', bar: 86 }
  if (dias < 3650) return { level: 8, name: 'Companheirismo', desc: 'Juntos em tudo', bar: 92 }
  return { level: 9, name: 'Legado', desc: 'Uma história que inspira', bar: 97 }
}

// ─── Stats computadas ─────────────────────────────────────────────────────────

export type RetroStats = {
  dias: number
  meses: number
  anos: number
  percentilDuracao: number
  bond: BondLevel
  totalConquistas: number
  xp: number
  xpLevel: number
}

/**
 * Computa todas as stats da retrospectiva.
 *
 * @param dias - dias de relacionamento
 * @param totalConquistasManuais - conquistas selecionadas pelo usuário
 * @param totalConquistasTempo - conquistas desbloqueadas por tempo
 * @param totalAutoConquistas - conquistas automáticas desbloqueadas
 */
export function computeStats(
  dias: number,
  totalConquistasManuais: number,
  totalConquistasTempo: number,
  totalAutoConquistas: number,
): RetroStats {
  const meses = Math.floor(dias / 30.44)
  const anos = Math.floor(dias / 365.25)
  const percentilDuracao = getDurationPercentile(dias)
  const bond = getBondLevel(dias)

  const totalConquistas = totalConquistasManuais + totalConquistasTempo + totalAutoConquistas

  // XP: dias contribuem linearmente, conquistas têm peso
  const xp = dias + totalConquistasManuais * 50 + totalConquistasTempo * 30 + totalAutoConquistas * 20

  // Level: escala logarítmica, cap em 99
  const xpLevel = Math.min(99, Math.floor(Math.log1p(xp / 100) * 15))

  return {
    dias,
    meses,
    anos,
    percentilDuracao,
    bond,
    totalConquistas,
    xp,
    xpLevel,
  }
}