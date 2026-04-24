// ─── Helpers compartilhados do Streaming ──────────────────────────────────────

export function calcTemporadas(dataInicio: string) {
  const inicio = new Date(dataInicio)
  const agora = new Date()
  const meses =
    (agora.getFullYear() - inicio.getFullYear()) * 12 +
    (agora.getMonth() - inicio.getMonth())

  if (meses <= 6) return { num: 1, label: '1 temporada', badge: 'Lançamento' }
  if (meses <= 12) return { num: 2, label: '2 temporadas', badge: 'Nova série' }
  if (meses <= 24) return { num: 3, label: '3 temporadas', badge: 'Em alta' }
  if (meses <= 48) return { num: 5, label: '5 temporadas', badge: 'Top 10' }
  if (meses <= 84) return { num: 7, label: '7 temporadas', badge: 'Hit consagrado' }
  if (meses <= 120) return { num: 10, label: '10 temporadas', badge: 'Clássico' }
  return {
    num: Math.floor(meses / 8),
    label: `${Math.floor(meses / 8)} temporadas`,
    badge: 'Lendária',
  }
}

export function calcDiasJuntos(dataInicio: string) {
  const inicio = new Date(dataInicio)
  const agora = new Date()
  return Math.floor((agora.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24))
}