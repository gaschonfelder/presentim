'use client'

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react'
import {
  type Rarity,
  type ConquistaItem,
  type TimeAchievement,
  type AutoAchievement,
  type RetroTheme,
  type RetroStats,
  type MoonInfo,
  type SeasonInfo,
  type SeasonKey,
  ALL_ACHIEVEMENTS,
  TIME_ACHIEVEMENTS,
  MEDAL_ORDER,
  RARITY_ORDER,
  buildAutoContext,
  computeAutoAchievements,
  getMoonPhase,
  moonInfo,
  getSeason,
  SEASONS,
  getCoords,
  computeStats,
  getTheme,
} from '@/lib/retro'

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type Dados = {
  nome1: string
  nome2: string
  data_inicio: string
  cidade: string
  mensagem: string
  conquistas: ConquistaItem[] | string[]
  fotos: string[]
  musica?: { videoId: string; title: string } | null
  tema?: string | null
}

/** Item unificado no ranking de conquistas (manual, tempo, ou auto) */
export type MixedAchievement =
  | { tipo: 'tempo'; data: TimeAchievement; peso: number }
  | { tipo: 'manual'; data: ConquistaItem; info: (typeof ALL_ACHIEVEMENTS)[string]; peso: number }
  | { tipo: 'auto'; data: AutoAchievement; peso: number }

export type RetroContextValue = {
  // Dados brutos
  nome1: string
  nome2: string
  cidade: string
  mensagem: string
  fotos: string[]
  musica: { videoId: string; title: string } | null
  startDate: Date
  startDateFormatted: string

  // Dados derivados
  dias: number
  stats: RetroStats
  moonPhase: MoonInfo
  season: SeasonInfo
  seasonKey: SeasonKey
  cityCoords: { lat: number; lng: number; label: string }

  // Conquistas (todas unificadas, ordenadas por raridade)
  conquistasManuais: ConquistaItem[]
  conquistasTempo: TimeAchievement[]
  conquistasAuto: AutoAchievement[]
  allAchievements: MixedAchievement[]

  // Mapa foto → conquista (pra badge no carrossel)
  fotoParaConquista: Record<string, string>

  // Tema
  theme: RetroTheme

  // Navegação
  slide: number
  totalSlides: number
  goTo: (idx: number) => void
  next: () => void
  prev: () => void
}

const RetroContext = createContext<RetroContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

const TOTAL_SLIDES = 9

export function RetroProvider({ dados, children }: { dados: Dados; children: ReactNode }) {
  const { nome1, nome2, cidade, mensagem, fotos } = dados
  const musica = dados.musica ?? null

  // Parse conquistas (compat: array de strings ou objetos)
  const conquistasManuais: ConquistaItem[] = useMemo(() => {
    const raw = dados.conquistas ?? []
    return raw.map((c: any) => (typeof c === 'string' ? { key: c } : c))
  }, [dados.conquistas])

  // Datas
  const startDate = useMemo(() => new Date(dados.data_inicio + 'T12:00:00'), [dados.data_inicio])
  const dias = useMemo(() => Math.floor((Date.now() - startDate.getTime()) / 86400000), [startDate])
  const startDateFormatted = useMemo(
    () => startDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }),
    [startDate],
  )

  // Conquistas de tempo
  const conquistasTempo = useMemo(
    () => TIME_ACHIEVEMENTS.filter((a) => dias >= a.dias),
    [dias],
  )

  // Conquistas automáticas
  const conquistasAuto = useMemo(() => {
    const ctx = buildAutoContext(conquistasManuais, dias, fotos.length, conquistasTempo)
    return computeAutoAchievements(ctx)
  }, [conquistasManuais, dias, fotos.length, conquistasTempo])

  // Stats
  const stats = useMemo(
    () => computeStats(dias, conquistasManuais.length, conquistasTempo.length, conquistasAuto.length),
    [dias, conquistasManuais.length, conquistasTempo.length, conquistasAuto.length],
  )

  // Astronomia
  const moonPhase = useMemo(() => moonInfo(getMoonPhase(startDate)), [startDate])
  const seasonKey = useMemo(() => getSeason(startDate), [startDate])
  const season = SEASONS[seasonKey]
  const cityCoords = useMemo(() => getCoords(cidade), [cidade])

  // Mapa foto → conquista
  const fotoParaConquista = useMemo(() => {
    const map: Record<string, string> = {}
    conquistasManuais.forEach((c) => {
      if (c.fotoUrl) map[c.fotoUrl] = c.key
    })
    return map
  }, [conquistasManuais])

  // Todas as conquistas unificadas e ordenadas (mais rara primeiro)
  const allAchievements = useMemo(() => {
    const pool: MixedAchievement[] = []

    conquistasTempo.forEach((a) =>
      pool.push({ tipo: 'tempo', data: a, peso: MEDAL_ORDER[a.medal] ?? 5 }),
    )

    conquistasManuais.forEach((c) => {
      const info = ALL_ACHIEVEMENTS[c.key]
      if (info) {
        pool.push({ tipo: 'manual', data: c, info, peso: 10 + RARITY_ORDER[info.rarity] })
      }
    })

    conquistasAuto.forEach((a) =>
      pool.push({ tipo: 'auto', data: a, peso: 20 + RARITY_ORDER[a.rarity] }),
    )

    return pool.sort((a, b) => a.peso - b.peso)
  }, [conquistasTempo, conquistasManuais, conquistasAuto])

  // Tema
  const theme = useMemo(() => getTheme(dados.tema), [dados.tema])

  // Navegação
  const [slide, setSlide] = useState(0)

  const goTo = useCallback((idx: number) => {
    if (idx >= 0 && idx < TOTAL_SLIDES) setSlide(idx)
  }, [])

  const next = useCallback(() => {
    setSlide((s) => Math.min(s + 1, TOTAL_SLIDES - 1))
  }, [])

  const prev = useCallback(() => {
    setSlide((s) => Math.max(s - 1, 0))
  }, [])

  const value: RetroContextValue = {
    nome1,
    nome2,
    cidade,
    mensagem,
    fotos,
    musica,
    startDate,
    startDateFormatted,
    dias,
    stats,
    moonPhase,
    season,
    seasonKey,
    cityCoords,
    conquistasManuais,
    conquistasTempo,
    conquistasAuto,
    allAchievements,
    fotoParaConquista,
    theme,
    slide,
    totalSlides: TOTAL_SLIDES,
    goTo,
    next,
    prev,
  }

  return <RetroContext.Provider value={value}>{children}</RetroContext.Provider>
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useRetro(): RetroContextValue {
  const ctx = useContext(RetroContext)
  if (!ctx) throw new Error('useRetro must be used inside <RetroProvider>')
  return ctx
}