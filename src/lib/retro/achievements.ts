// ─── Conquistas ───────────────────────────────────────────────────────────────
// Extraído de RetrospectivaPlayer.tsx (linhas 19-89)
// + conquistas automáticas (NOVO)

import { Rarity } from './rarity'

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type AchievementInfo = {
  icon: string
  label: string
  rarity: Rarity
}

export type TimeAchievement = {
  dias: number
  icon: string
  medal: 'bronze' | 'silver' | 'gold' | 'trophy' | 'diamond' | 'crown'
  name: string
  desc: string
}

export type ConquistaItem = {
  key: string
  fotoUrl?: string
}

// ─── Conquistas manuais (selecionadas pelo usuário no wizard) ─────────────────

export const ALL_ACHIEVEMENTS: Record<string, AchievementInfo> = {
  // Primeiros momentos
  primeira_msg:      { icon: '🟢', label: 'Primeira Mensagem',       rarity: 'comum' },
  primeira_risada:   { icon: '😄', label: 'Primeira Risada',          rarity: 'comum' },
  primeiro_flert:    { icon: '😏', label: 'Primeiro Flert',           rarity: 'comum' },
  madrugada:         { icon: '🌙', label: 'Conversa Madrugada',       rarity: 'comum' },
  bom_dia:           { icon: '☀️', label: 'Primeiro "Bom dia"',       rarity: 'comum' },
  audio_gigante:     { icon: '🎤', label: 'Áudio Gigante',            rarity: 'comum' },
  primeiro_encontro: { icon: '🟡', label: 'Primeiro Encontro',        rarity: 'comum' },
  primeiro_abraco:   { icon: '🤗', label: 'Primeiro Abraço',          rarity: 'comum' },
  primeiro_beijo:    { icon: '💋', label: 'Primeiro Beijo',           rarity: 'incomum' },
  primeira_foto:     { icon: '📸', label: 'Primeira Foto Juntos',     rarity: 'comum' },
  selfie_casal:      { icon: '🤳', label: 'Selfie de Casal',          rarity: 'comum' },
  eu_gosto:          { icon: '💌', label: '"Eu gosto de você"',       rarity: 'incomum' },

  // Experiências
  cinema:            { icon: '🎬', label: 'Cinema Juntos',            rarity: 'comum' },
  jantar:            { icon: '🍕', label: 'Jantar Juntos',            rarity: 'comum' },
  delivery:          { icon: '🍔', label: 'Delivery Juntos',          rarity: 'comum' },
  cafe:              { icon: '☕', label: 'Café Juntos',              rarity: 'comum' },
  sorvete:           { icon: '🍨', label: 'Sorvete Compartilhado',    rarity: 'incomum' },
  role_aleatorio:    { icon: '📷', label: 'Rolê Aleatório',           rarity: 'incomum' },

  // Aventuras
  viagem:            { icon: '🚗', label: 'Primeira Viagem',          rarity: 'raro' },
  praia:             { icon: '🏖️', label: 'Praia Juntos',             rarity: 'raro' },
  hotel:             { icon: '🏨', label: 'Primeiro Hotel',           rarity: 'raro' },
  sem_planejamento:  { icon: '🧭', label: 'Aventura Sem Plano',       rarity: 'incomum' },
  por_do_sol:        { icon: '🌄', label: 'Pôr do Sol Juntos',        rarity: 'incomum' },
  lugar_novo:        { icon: '🗺️', label: 'Lugar Novo',               rarity: 'incomum' },

  // Vida de casal
  mercado:           { icon: '🛒', label: 'Mercado Juntos',           rarity: 'raro' },
  cozinhar:          { icon: '🍳', label: 'Cozinharam Juntos',        rarity: 'raro' },
  dia_inteiro:       { icon: '🛋️', label: 'Dia Inteiro Juntos',       rarity: 'raro' },
  tarefa_dom:        { icon: '🧺', label: 'Tarefa Doméstica',         rarity: 'raro' },
  noite_juntos:      { icon: '🛏️', label: 'Primeira Noite',           rarity: 'raro' },
  pet:               { icon: '🐶', label: 'Pet Juntos',               rarity: 'raro' },

  // Marcantes
  primeiro_choro:    { icon: '😭', label: 'Primeiro Choro',           rarity: 'raro' },
  reconciliacao:     { icon: '🤝', label: 'Reconciliação',            rarity: 'raro' },
  carta_romantica:   { icon: '💌', label: 'Carta Romântica',          rarity: 'incomum' },
  print_chat:        { icon: '📱', label: 'Print do Chat',            rarity: 'incomum' },
  ligacao_longa:     { icon: '📞', label: 'Ligação Longa',            rarity: 'incomum' },
  familia:           { icon: '👨‍👩‍👧', label: 'Conheceu Família',         rarity: 'raro' },

  // Divertidas
  briga_comida:      { icon: '🍕', label: 'Briga por Comida',         rarity: 'comum' },
  maratona_serie:    { icon: '📺', label: 'Maratona de Série',        rarity: 'incomum' },
  dormiu_filme:      { icon: '😴', label: 'Dormiu no Filme',          rarity: 'comum' },
  foto_engracada:    { icon: '📸', label: 'Foto Engraçada',           rarity: 'comum' },
  apelido:           { icon: '🧸', label: 'Apelido Fofo',             rarity: 'comum' },
  planta:            { icon: '🌱', label: 'Primeira Planta',          rarity: 'incomum' },

  // Épicos & lendários
  noivado:           { icon: '💍', label: 'Noivado',                  rarity: 'epico' },
  morar_juntos:      { icon: '🏡', label: 'Morar Juntos',             rarity: 'epico' },
  adotar_pet:        { icon: '🐕', label: 'Adotar Pet',               rarity: 'epico' },
  primeiro_filho:    { icon: '👶', label: 'Primeiro Filho',           rarity: 'lendario' },
  construir_vida:    { icon: '❤️', label: 'Construir uma Vida',       rarity: 'lendario' },
  aniversario_surp:  { icon: '🎂', label: 'Aniversário Surpresa',     rarity: 'epico' },

  // Compat antigo (aliases)
  beijo:             { icon: '💋', label: 'Primeiro Beijo',           rarity: 'incomum' },
  casa:              { icon: '🏠', label: 'Moraram Juntos',           rarity: 'epico' },
  anos1:             { icon: '🎉', label: '1 Ano Juntos',             rarity: 'raro' },
  aniversario:       { icon: '🎂', label: 'Aniversário Surpresa',     rarity: 'epico' },
}

// ─── Conquistas de tempo (desbloqueadas por dias de relacionamento) ────────────

export const TIME_ACHIEVEMENTS: TimeAchievement[] = [
  { dias: 7,    icon: '🥉', medal: 'bronze',  name: 'Primeiro Checkpoint',     desc: 'Vocês sobreviveram à primeira semana sem se cansar um do outro.' },
  { dias: 30,   icon: '🥉', medal: 'bronze',  name: 'Modo Tutorial Concluído', desc: 'Já sabem o gosto musical, comidas favoritas e algumas manias.' },
  { dias: 90,   icon: '🥈', medal: 'silver',  name: 'Crise dos 3',             desc: 'Primeiros pequenos conflitos superados. O jogo ficou sério.' },
  { dias: 180,  icon: '🥈', medal: 'silver',  name: 'Party Formada',           desc: 'Vocês já funcionam como um time.' },
  { dias: 270,  icon: '🥇', medal: 'gold',    name: 'Bug Descoberto',          desc: 'Agora vocês conhecem os defeitos um do outro.' },
  { dias: 365,  icon: '🏆', medal: 'trophy',  name: 'Primeiro Boss Derrotado', desc: 'Um ciclo completo. A relação passou pelo teste do tempo.' },
  { dias: 500,  icon: '🏆', medal: 'trophy',  name: 'Meio Milhar',             desc: '500 dias de uma história que vale a pena contar.' },
  { dias: 548,  icon: '🏆', medal: 'trophy',  name: 'DLC Emocional',           desc: 'Já passaram por momentos bons e difíceis juntos.' },
  { dias: 730,  icon: '🏆', medal: 'trophy',  name: 'Co-op Avançado',          desc: 'Já existe rotina, planos e histórias suficientes para um livro.' },
  { dias: 1000, icon: '💎', medal: 'diamond', name: 'Milésimo Dia',            desc: 'Mil dias de provas de que isso é real.' },
  { dias: 1095, icon: '💎', medal: 'diamond', name: 'Veteranos do Jogo',       desc: 'Vocês conhecem as estratégias um do outro.' },
  { dias: 1825, icon: '💎', medal: 'diamond', name: 'Guilda Permanente',       desc: 'Já enfrentaram vários bosses da vida juntos.' },
  { dias: 2000, icon: '💎', medal: 'diamond', name: 'Dois Mil Razões',         desc: 'Duas mil razões pra continuar escolhendo vocês.' },
  { dias: 3650, icon: '👑', medal: 'crown',   name: 'Lenda Viva',              desc: 'Casal desbloqueado no ranking lendário.' },
]

/** Ordem de prioridade de medalhas (menor = mais raro) */
export const MEDAL_ORDER: Record<string, number> = {
  crown: 0,
  diamond: 1,
  trophy: 2,
  gold: 3,
  silver: 4,
  bronze: 5,
}

// ─── Conquistas automáticas (geradas a partir dos dados) ──────────────────────

export type AutoAchievement = {
  id: string
  icon: string
  label: string
  desc: string
  rarity: Rarity
  /** Função que recebe os dados e retorna true se desbloqueada */
  check: (ctx: AutoAchievementContext) => boolean
}

export type AutoAchievementContext = {
  dias: number
  totalConquistasManuais: number
  totalConquistasTempo: number
  totalFotos: number
  raridadesManuais: Record<Rarity, number> // contagem por raridade
  categoriasManuais: string[]              // keys das conquistas selecionadas
}

export const AUTO_ACHIEVEMENTS: AutoAchievement[] = [
  // Meta — baseadas em coleção
  {
    id: 'auto_colecionador_1',
    icon: '🎖️',
    label: 'Colecionador Iniciante',
    desc: '5 conquistas desbloqueadas. A jornada começou!',
    rarity: 'incomum',
    check: (ctx) => ctx.totalConquistasManuais >= 5,
  },
  {
    id: 'auto_colecionador_2',
    icon: '🏅',
    label: 'Colecionador',
    desc: '10 conquistas! Vocês colecionam memórias.',
    rarity: 'raro',
    check: (ctx) => ctx.totalConquistasManuais >= 10,
  },
  {
    id: 'auto_colecionador_3',
    icon: '🥇',
    label: 'Colecionador Épico',
    desc: '20 conquistas. Vocês são completistas.',
    rarity: 'epico',
    check: (ctx) => ctx.totalConquistasManuais >= 20,
  },
  {
    id: 'auto_cacador_raras',
    icon: '💜',
    label: 'Caçador de Raridades',
    desc: '3 conquistas raras ou acima. Momentos únicos.',
    rarity: 'raro',
    check: (ctx) => {
      const rarasOuAcima = (ctx.raridadesManuais.raro ?? 0)
        + (ctx.raridadesManuais.epico ?? 0)
        + (ctx.raridadesManuais.lendario ?? 0)
      return rarasOuAcima >= 3
    },
  },
  {
    id: 'auto_momento_epico',
    icon: '⭐',
    label: 'Momento Épico',
    desc: 'Desbloquearam uma conquista épica. Poucos chegam aqui.',
    rarity: 'epico',
    check: (ctx) => (ctx.raridadesManuais.epico ?? 0) >= 1,
  },
  {
    id: 'auto_lenda',
    icon: '👑',
    label: 'Status Lendário',
    desc: 'Uma conquista lendária. Isso é raro de verdade.',
    rarity: 'lendario',
    check: (ctx) => (ctx.raridadesManuais.lendario ?? 0) >= 1,
  },
  // Fotos
  {
    id: 'auto_album_1',
    icon: '📷',
    label: 'Álbum Iniciante',
    desc: '3 fotos na retrospectiva. Os registros começaram.',
    rarity: 'comum',
    check: (ctx) => ctx.totalFotos >= 3,
  },
  {
    id: 'auto_album_2',
    icon: '📸',
    label: 'Fotógrafos Oficiais',
    desc: '5 fotos! Vocês documentam bem.',
    rarity: 'incomum',
    check: (ctx) => ctx.totalFotos >= 5,
  },
  {
    id: 'auto_album_3',
    icon: '🖼️',
    label: 'Álbum Completo',
    desc: '6 fotos — álbum lotado!',
    rarity: 'raro',
    check: (ctx) => ctx.totalFotos >= 6,
  },
]

// ─── Helper: computar conquistas automáticas desbloqueadas ────────────────────

export function computeAutoAchievements(ctx: AutoAchievementContext): AutoAchievement[] {
  return AUTO_ACHIEVEMENTS.filter((a) => a.check(ctx))
}

// ─── Helper: montar contexto de auto-achievements a partir dos dados ──────────

export function buildAutoContext(
  conquistas: ConquistaItem[],
  dias: number,
  totalFotos: number,
  conquistasTempo: TimeAchievement[],
): AutoAchievementContext {
  const raridadesManuais: Record<Rarity, number> = {
    comum: 0, incomum: 0, raro: 0, epico: 0, lendario: 0,
  }

  conquistas.forEach((c) => {
    const info = ALL_ACHIEVEMENTS[c.key]
    if (info) {
      raridadesManuais[info.rarity]++
    }
  })

  return {
    dias,
    totalConquistasManuais: conquistas.length,
    totalConquistasTempo: conquistasTempo.length,
    totalFotos,
    raridadesManuais,
    categoriasManuais: conquistas.map((c) => c.key),
  }
}