'use client'

import { useState, useEffect } from 'react'
import type { StreamingDados } from './page'
import { calcDiasJuntos } from './streaming-utils'

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Medal = 'bronze' | 'silver' | 'gold' | 'trophy' | 'diamond' | 'crown'

// ─── Conquistas de tempo ──────────────────────────────────────────────────────

const TIME_ACHIEVEMENTS: { dias: number; icon: string; medal: Medal; name: string; desc: string }[] = [
  { dias: 7,    icon: '🥉', medal: 'bronze',  name: 'Estreia do Episódio Piloto',  desc: 'A história começou a ser contada.' },
  { dias: 30,   icon: '🥉', medal: 'bronze',  name: 'Elenco Afinado',              desc: 'Já conhecem bem os personagens.' },
  { dias: 90,   icon: '🥈', medal: 'silver',  name: 'Plot Twist Revelado',         desc: 'Superaram os primeiros conflitos.' },
  { dias: 180,  icon: '🥈', medal: 'silver',  name: 'Primeira Temporada Completa', desc: 'A química já funciona perfeitamente.' },
  { dias: 270,  icon: '🥇', medal: 'gold',    name: 'Segredos de Bastidores',      desc: 'Já conhecem todos os defeitos um do outro.' },
  { dias: 365,  icon: '🏆', medal: 'trophy',  name: 'Temporada Renovada',          desc: 'Um ano inteiro de história juntos.' },
  { dias: 548,  icon: '🏆', medal: 'trophy',  name: 'Drama e Comédia',             desc: 'Entre cenas boas e difíceis, seguem juntos.' },
  { dias: 730,  icon: '🏆', medal: 'trophy',  name: 'Série de Sucesso',            desc: 'Rotina, planos e muitos episódios vividos.' },
  { dias: 1095, icon: '💎', medal: 'diamond', name: 'Trilogia Completa',           desc: 'Uma história sólida com vários capítulos.' },
  { dias: 1825, icon: '💎', medal: 'diamond', name: 'Saga Épica',                  desc: 'Já passaram por várias temporadas da vida.' },
  { dias: 3650, icon: '👑', medal: 'crown',   name: 'Clássico do Cinema',          desc: 'Uma história digna de eternidade.' },
]

// ─── Conquistas manuais (selecionáveis no editor) ─────────────────────────────

// Reação do Público — só pode 1
export const REACOES_PUBLICO = [
  { key: 'aprovado',    icon: '🍅', label: '100% aprovado',              desc: 'Nota máxima na crítica especializada.' },
  { key: 'todo_mundo',  icon: '❤️', label: 'Todo mundo ama',             desc: 'Impossível não torcer por esse casal.' },
  { key: 'inveja',      icon: '😏', label: 'Inveja dos outros',          desc: 'O casal que todo mundo queria ser.' },
  { key: 'insuperavel', icon: '👑', label: 'Ninguém supera',             desc: 'Referência absoluta de relacionamento.' },
  { key: 'critica',     icon: '👏', label: 'Crítica e público concordam', desc: 'Unanimidade total.' },
] as const

// Premiações — múltipla seleção
export const PREMIACOES = [
  { key: 'melhor_casal',       icon: '🏆', label: 'Melhor Casal',                 desc: 'O casal destaque da temporada.' },
  { key: 'melhor_quimica',     icon: '🎭', label: 'Melhor Química',               desc: 'Conexão que salta da tela.' },
  { key: 'melhor_comedia',     icon: '😂', label: 'Melhor Comédia Involuntária',  desc: 'Fazem todo mundo rir sem querer.' },
  { key: 'melhor_dialogo',     icon: '💬', label: 'Melhor Diálogo',               desc: 'Conversas que valem ouro.' },
  { key: 'melhor_superacao',   icon: '💔', label: 'Melhor Superação',             desc: 'Superaram o que parecia impossível.' },
  { key: 'casal_intenso',      icon: '🔥', label: 'Casal Mais Intenso',           desc: 'Emoção em cada cena.' },
  { key: 'melhor_roteiro',     icon: '🎬', label: 'Melhor Roteiro Improvisado',   desc: 'Os melhores momentos não foram planejados.' },
] as const

// Marcos da história — múltipla seleção
export const MARCOS_HISTORIA = [
  { key: 'spinoff_pet',        icon: '🐾', label: 'Spin-off com Pet',             desc: 'A história ganhou um novo protagonista de quatro patas.', medal: 'trophy' as Medal },
  { key: 'continuacao',        icon: '👶', label: 'Continuação Garantida',         desc: 'A próxima geração já faz parte do roteiro.',              medal: 'crown'  as Medal },
  { key: 'ep_internacional',   icon: '🌍', label: 'Episódio Internacional',        desc: 'A história atravessou fronteiras.',                       medal: 'diamond' as Medal },
  { key: 'cenario_novo',       icon: '✈️', label: 'Cenário Desbloqueado',          desc: 'Novos lugares entraram para a história.',                 medal: 'gold'   as Medal },
  { key: 'final_temporada',    icon: '💍', label: 'Final de Temporada Emocionante', desc: 'Um momento decisivo mudou tudo.',                        medal: 'crown'  as Medal },
  { key: 'compromisso',        icon: '💒', label: 'Compromisso Oficial',           desc: 'O roteiro ficou sério de vez.',                           medal: 'crown'  as Medal },
  { key: 'novo_cenario',       icon: '🏡', label: 'Novo Cenário Principal',        desc: 'A história ganhou um novo palco.',                        medal: 'diamond' as Medal },
  { key: 'crise_superada',     icon: '💪', label: 'Crise Superada',               desc: 'Os personagens saíram mais fortes.',                      medal: 'trophy' as Medal },
  { key: 'ep_caotico',         icon: '🎢', label: 'Episódio Caótico',             desc: 'Tudo saiu do controle (e foi ótimo).',                    medal: 'gold'   as Medal },
  { key: 'cena_improviso',     icon: '🎤', label: 'Cena de Improviso',            desc: 'Um momento espontâneo que virou lendário.',               medal: 'gold'   as Medal },
  { key: 'playlist_casal',     icon: '🎵', label: 'Trilha Sonora Própria',        desc: 'Já têm músicas que são só de vocês.',                     medal: 'silver' as Medal },
  { key: 'tradicao_criada',    icon: '🎄', label: 'Tradição Criada',              desc: 'Inventaram algo que só vocês fazem.',                     medal: 'gold'   as Medal },
] as const

// Mapa flat pra buscar por key
type ManualAch = { icon: string; label: string; desc: string; medal: Medal }
const ALL_MANUAL: Record<string, ManualAch> = {}

REACOES_PUBLICO.forEach(a => { ALL_MANUAL[a.key] = { ...a, medal: 'diamond' as Medal } })
PREMIACOES.forEach(a =>      { ALL_MANUAL[a.key] = { ...a, medal: 'trophy' as Medal } })
MARCOS_HISTORIA.forEach(a => { ALL_MANUAL[a.key] = { ...a, medal: a.medal } })

// ─── Série comparação ─────────────────────────────────────────────────────────

type SerieComparacao = { temporadas: number; titulo: string; exemplos: string[] }

const SERIES_COMPARACAO: SerieComparacao[] = [
  { temporadas: 1,        titulo: 'Minissérie de impacto',          exemplos: ['Chernobyl', "The Queen's Gambit", 'Band of Brothers'] },
  { temporadas: 2,        titulo: 'Começando a conquistar público', exemplos: ['Fleabag', 'Mindhunter', 'Euphoria'] },
  { temporadas: 3,        titulo: 'História envolvente',            exemplos: ['Dark', 'Atlanta', 'The Mandalorian'] },
  { temporadas: 4,        titulo: 'Sucesso consolidado',            exemplos: ['Stranger Things', 'The Boys', 'Ozark'] },
  { temporadas: 5,        titulo: 'Série marcante',                 exemplos: ['Breaking Bad', 'La Casa de Papel', 'Prison Break'] },
  { temporadas: 6,        titulo: 'Consistente e querida',          exemplos: ['Peaky Blinders', 'Glee', 'This Is Us'] },
  { temporadas: 7,        titulo: 'Grande produção',                exemplos: ['Game of Thrones', 'Parks and Recreation', 'The Good Wife'] },
  { temporadas: 8,        titulo: 'Fenômeno global',                exemplos: ['Game of Thrones', 'Brooklyn Nine-Nine', 'Dexter'] },
  { temporadas: 9,        titulo: 'Clássico moderno',               exemplos: ['The Office', 'How I Met Your Mother', 'Suits'] },
  { temporadas: 10,       titulo: 'Ícone da TV',                    exemplos: ['Friends', 'Modern Family', 'The Blacklist'] },
  { temporadas: Infinity, titulo: 'Lenda da televisão',             exemplos: ['The Walking Dead', 'The Big Bang Theory', "Grey's Anatomy"] },
]

function getSerieComparacao(dias: number): SerieComparacao & { temporadasCalc: number } {
  const temporadasCalc = Math.max(1, Math.floor(dias / 120))
  const match = SERIES_COMPARACAO.find(item => temporadasCalc <= item.temporadas) ?? SERIES_COMPARACAO[SERIES_COMPARACAO.length - 1]
  return { ...match, temporadasCalc }
}

function getSerieMedal(temporadas: number): Medal {
  if (temporadas <= 1) return 'bronze'
  if (temporadas <= 3) return 'silver'
  if (temporadas <= 5) return 'gold'
  if (temporadas <= 8) return 'trophy'
  if (temporadas <= 15) return 'diamond'
  return 'crown'
}

// ─── Config visual por medal ──────────────────────────────────────────────────

type MedalConfig = {
  label: string; color: string; glow: string; bg: string; border: string
  shimmer: boolean; particles: boolean; pulse: boolean; float: boolean
  iconScale: number; animation: string
}

const MEDAL_CONFIG: Record<Medal, MedalConfig> = {
  bronze: {
    label: 'Bronze', color: '#cd7f32', glow: 'transparent',
    bg: 'rgba(205,127,50,.06)', border: 'rgba(205,127,50,.18)',
    shimmer: false, particles: false, pulse: false, float: false,
    iconScale: 1, animation: '',
  },
  silver: {
    label: 'Prata', color: '#a8c4d4', glow: 'rgba(168,196,212,.30)',
    bg: 'rgba(168,196,212,.06)', border: 'rgba(168,196,212,.22)',
    shimmer: false, particles: false, pulse: false, float: false,
    iconScale: 1, animation: '',
  },
  gold: {
    label: 'Ouro', color: '#fbbf24', glow: 'rgba(251,191,36,.35)',
    bg: 'rgba(251,191,36,.07)', border: 'rgba(251,191,36,.28)',
    shimmer: true, particles: false, pulse: true, float: false,
    iconScale: 1.05, animation: 'cq-anim-gold',
  },
  trophy: {
    label: 'Troféu', color: '#f59e0b', glow: 'rgba(245,158,11,.40)',
    bg: 'rgba(245,158,11,.08)', border: 'rgba(245,158,11,.32)',
    shimmer: true, particles: false, pulse: true, float: true,
    iconScale: 1.1, animation: 'cq-anim-trophy',
  },
  diamond: {
    label: 'Diamante', color: '#a78bfa', glow: 'rgba(167,139,250,.40)',
    bg: 'rgba(167,139,250,.08)', border: 'rgba(167,139,250,.30)',
    shimmer: true, particles: false, pulse: true, float: true,
    iconScale: 1.15, animation: 'cq-anim-diamond',
  },
  crown: {
    label: 'Lendário', color: '#E50914', glow: 'rgba(229,9,20,.50)',
    bg: 'rgba(229,9,20,.10)', border: 'rgba(229,9,20,.38)',
    shimmer: true, particles: true, pulse: true, float: true,
    iconScale: 1.25, animation: 'cq-anim-crown',
  },
}

function isHighlight(medal: Medal) {
  return medal === 'crown' || medal === 'diamond' || medal === 'trophy'
}

function pseudoRand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

function medalVars(mc: MedalConfig): React.CSSProperties {
  return {
    '--c-main': mc.color, '--c-glow': mc.glow,
    '--c-bg': mc.bg, '--c-border': mc.border,
    '--c-10': `${mc.color}1a`, '--c-22': `${mc.color}38`,
  } as React.CSSProperties
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SlideConquistas({
  dados,
  onNext,
}: {
  dados: StreamingDados
  onNext: () => void
}) {
  const [visible, setVisible] = useState(false)
  const [selectedAch, setSelectedAch] = useState<{
    icon: string; name: string; desc: string; medal: Medal
  } | null>(null)

  const dias       = calcDiasJuntos(dados?.data_inicio ?? '2024-01-01')
  const serieComp  = getSerieComparacao(dias)
  const serieMedal = getSerieMedal(serieComp.temporadasCalc)
  const mcSerie    = MEDAL_CONFIG[serieMedal]
  const hiSerie    = isHighlight(serieMedal)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(t)
  }, [])

  // Conquistas de tempo — TODAS as desbloqueadas (mais recente primeiro)
  const unlocked = TIME_ACHIEVEMENTS.filter(a => dias >= a.dias)
  const timeCards = [...unlocked].reverse()
  const nextAch  = TIME_ACHIEVEMENTS.find(a => dias < a.dias)

  // Conquistas manuais do usuário
  const userKeys: string[] = (dados.conquistas ?? []).map((c: any) =>
    typeof c === 'string' ? c : c.key
  )
  const manualCards = userKeys
    .map(key => ALL_MANUAL[key])
    .filter(Boolean)

  // Total
  const totalCount = timeCards.length + manualCards.length

  return (
    <>
      <style>{`
        .cq-wrap {
          width:100%; min-height:100dvh; background:#0a0a0a; color:#fff;
          font-family:'Inter',sans-serif; padding-bottom:40px;
          position:relative; overflow:hidden;
        }
        .cq-glow {
          position:absolute; top:10%; left:50%; transform:translateX(-50%);
          width:340px; height:340px; border-radius:50%;
          background:radial-gradient(circle, rgba(229,9,20,.06) 0%, transparent 70%);
          pointer-events:none;
        }

        .cq-hdr { padding:48px 24px 12px; text-align:center; opacity:0; transform:translateY(20px); transition:all .7s ease .1s; }
        .cq-hdr.v { opacity:1; transform:translateY(0); }
        .cq-tag { display:inline-flex; align-items:center; gap:6px; background:rgba(229,9,20,.12); border:1px solid rgba(229,9,20,.25); color:#E50914; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; padding:5px 14px; border-radius:20px; margin-bottom:16px; }
        .cq-title { font-family:'Bebas Neue',sans-serif; font-size:36px; font-weight:400; letter-spacing:2px; margin-bottom:4px; }
        .cq-em { color:#E50914; }
        .cq-sub { font-size:14px; color:rgba(255,255,255,.35); }

        .cq-trophy { text-align:center; padding:20px 0 8px; opacity:0; transform:translateY(16px); transition:all .7s ease .25s; }
        .cq-trophy.v { opacity:1; transform:translateY(0); }
        .cq-trophy-icon { font-size:3rem; animation:cq-float 3s ease-in-out infinite; }

        .cq-count { text-align:center; margin-bottom:24px; opacity:0; transform:translateY(16px); transition:all .7s ease .35s; }
        .cq-count.v { opacity:1; transform:translateY(0); }
        .cq-count-n { font-family:'Bebas Neue',sans-serif; font-size:56px; color:#E50914; line-height:1; letter-spacing:2px; }
        .cq-count-l { font-size:12px; color:rgba(255,255,255,.35); text-transform:uppercase; letter-spacing:1px; margin-top:2px; }

        /* ── Seção "Se fosse uma série" ─────────────────────────────────── */
        .cq-serie {
          max-width:460px; margin:0 auto 20px; padding:0 24px;
          opacity:0; transform:translateY(16px); transition:all .7s ease .42s;
        }
        .cq-serie.v { opacity:1; transform:translateY(0); }
        .cq-serie-card {
          position:relative; overflow:hidden; border-radius:12px; padding:16px;
          background: var(--c-bg); border: 1px solid var(--c-border);
          transition: box-shadow .3s ease;
        }
        .cq-serie-card.hi { box-shadow: 0 0 24px var(--c-glow), inset 0 1px 0 rgba(255,255,255,.06); }
        .cq-serie-top { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:10px; }
        .cq-serie-tag { display:inline-flex; align-items:center; gap:6px; font-size:10px; text-transform:uppercase; letter-spacing:.12em; color:#E50914; font-weight:700; }
        .cq-serie-temp { font-size:11px; color:rgba(255,255,255,.45); text-transform:uppercase; letter-spacing:.08em; }
        .cq-serie-title { font-size:18px; font-weight:700; color:#fff; line-height:1.3; margin-bottom:6px; }
        .cq-serie-title.hi { color:var(--c-main); text-shadow:0 0 12px var(--c-glow); }
        .cq-serie-desc { font-size:13px; color:rgba(255,255,255,.72); line-height:1.5; }
        .cq-serie-list { margin-top:12px; display:flex; flex-wrap:wrap; gap:8px; }
        .cq-serie-pill { font-size:11px; color:rgba(255,255,255,.88); background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.08); border-radius:999px; padding:6px 10px; }

        /* ── Seção label (Premiações, Marcos, etc.) ─────────────────────── */
        .cq-section {
          max-width:460px; margin:20px auto 8px; padding:0 24px;
          opacity:0; transform:translateY(12px); transition:all .6s ease;
        }
        .cq-section.v { opacity:1; transform:translateY(0); }
        .cq-section-label {
          display:inline-flex; align-items:center; gap:6px;
          font-size:11px; font-weight:700; letter-spacing:1.2px;
          text-transform:uppercase; color:rgba(255,255,255,.4);
          padding-bottom:8px;
          border-bottom:1px solid rgba(255,255,255,.06);
          width:100%;
        }

        /* ── Lista de cards ─────────────────────────────────────────────── */
        .cq-list { display:flex; flex-direction:column; gap:10px; padding:0 24px; max-width:460px; margin:0 auto; }

        .cq-card {
          position:relative; display:flex; align-items:center; gap:12px;
          background: var(--c-bg); border: 1px solid var(--c-border);
          border-radius:12px; padding:12px 16px; overflow:hidden;
          transition: opacity .5s ease, transform .5s ease, box-shadow .3s ease;
          cursor: pointer; -webkit-tap-highlight-color: transparent;
        }
        .cq-card:active { transform: scale(.98) !important; }
        .cq-card.hi { box-shadow: 0 0 24px var(--c-glow), inset 0 1px 0 rgba(255,255,255,.06); }
        .cq-card-arrow { margin-left:auto; flex-shrink:0; opacity:.25; font-size:14px; position:relative; z-index:1; }

        /* ── Modal ────────────────────────────────────────────────────────── */
        .cq-overlay {
          position:fixed; inset:0; z-index:999;
          background: rgba(0,0,0,.7); backdrop-filter:blur(6px);
          display:flex; align-items:center; justify-content:center;
          padding:0 0 24px;
          animation: cq-overlay-in 0.22s ease;
        }
        @keyframes cq-overlay-in { from { opacity:0 } to { opacity:1 } }

        .cq-modal {
          width:100%; max-width:460px; margin:0 24px;
          background:#161616; border:1px solid var(--c-border);
          border-radius:20px; padding:28px 24px 24px;
          position:relative; overflow:hidden;
          box-shadow: 0 0 40px var(--c-glow), 0 24px 48px rgba(0,0,0,.6);
          animation: cq-modal-in .28s cubic-bezier(.34,1.56,.64,1);
        }
        @keyframes cq-modal-in { from { opacity:0; transform:translateY(32px) scale(.96) } to { opacity:1; transform:translateY(0) scale(1) } }

        .cq-modal-shimmer {
          position:absolute; inset:0; pointer-events:none;
          background: linear-gradient(90deg, transparent 0%, var(--c-10) 45%, var(--c-22) 50%, var(--c-10) 55%, transparent 100%);
          background-size:200% 100%; animation: cq-shimmer-move 13s ease-in-out infinite;
        }
        .cq-modal-icon {
          font-size:3rem; text-align:center; display:block; margin-bottom:12px;
          position:relative; z-index:1;
        }
        .cq-modal-icon.float { animation: cq-float 2.8s ease-in-out infinite; }
        .cq-modal-name {
          font-size:20px; font-weight:700; color:#fff; text-align:center;
          margin-bottom:4px; line-height:1.3; position:relative; z-index:1;
        }
        .cq-modal-name.hi { color:var(--c-main); text-shadow:0 0 16px var(--c-glow); }
        .cq-modal-desc {
          font-size:14px; color:rgba(255,255,255,.55); text-align:center;
          line-height:1.6; margin-bottom:20px; position:relative; z-index:1;
        }
        .cq-modal-badge {
          display:flex; align-items:center; justify-content:center; gap:6px;
          font-size:11px; letter-spacing:.14em; text-transform:uppercase;
          color:var(--c-main); opacity:.8; margin-bottom:20px;
          position:relative; z-index:1;
        }
        .cq-modal-badge-dot { width:5px; height:5px; border-radius:50%; background:var(--c-main); box-shadow:0 0 6px var(--c-glow); }
        .cq-modal-close {
          display:flex; align-items:center; justify-content:center;
          width:100%; padding:13px; border-radius:10px;
          background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.1);
          color:rgba(255,255,255,.7); font-size:14px; font-weight:600;
          font-family:'Inter',sans-serif; cursor:pointer;
          transition:background .2s; position:relative; z-index:1;
          -webkit-tap-highlight-color:transparent;
        }
        .cq-modal-close:hover { background:rgba(255,255,255,.12); }
        .cq-shimmer {
          position:absolute; inset:0; border-radius:12px; pointer-events:none;
          background: linear-gradient(90deg, transparent 0%, var(--c-10) 45%, var(--c-22) 50%, var(--c-10) 55%, transparent 100%);
          background-size:200% 100%; animation: cq-shimmer-move 20s ease-in-out infinite;
        }
        .cq-icon { font-size:1.5rem; flex-shrink:0; position:relative; z-index:1; }
        .cq-icon.hi { filter: drop-shadow(0 0 6px var(--c-glow)); }
        .cq-icon.float { animation: cq-float 2.8s ease-in-out infinite; }
        .cq-name { flex:1; font-size:14px; font-weight:600; color:rgba(255,255,255,.9); line-height:1.3; position:relative; z-index:1; }
        .cq-name.hi { color:var(--c-main); text-shadow: 0 0 12px var(--c-glow); }

        .cq-particle {
          position:absolute; width:3px; height:3px; border-radius:50%;
          background:var(--c-main); box-shadow:0 0 4px var(--c-main);
          pointer-events:none; animation:cq-particle-float 1.8s ease-out infinite;
        }

        .cq-next {
          display:flex; align-items:center; gap:14px;
          background:rgba(255,255,255,.02); border:1px dashed rgba(255,255,255,.1);
          border-radius:12px; padding:14px 16px; margin-top:4px;
          opacity:0; transition:opacity .5s ease 1s;
        }
        .cq-next.v { opacity:1; }
        .cq-next-icon { font-size:1.3rem; opacity:.25; filter:grayscale(1); }
        .cq-next-text { flex:1; }
        .cq-next-name { font-size:13px; font-weight:500; color:rgba(255,255,255,.25); }
        .cq-next-sub  { font-size:10px; color:rgba(255,255,255,.15); margin-top:2px; }
        .cq-next-lock { font-size:14px; opacity:.3; }

        .cq-empty { text-align:center; font-size:14px; color:rgba(255,255,255,.25); padding:40px 0; }

        .cq-btn {
          display:flex; align-items:center; justify-content:center; gap:8px;
          margin:32px auto 0; padding:14px 32px;
          background:rgba(255,255,255,.1); color:#fff;
          border:1px solid rgba(255,255,255,.2); border-radius:4px;
          font-size:15px; font-weight:600; font-family:'Inter',sans-serif;
          cursor:pointer; transition:all .2s ease; -webkit-tap-highlight-color:transparent;
          width:calc(100% - 48px); max-width:460px;
        }
        .cq-btn:hover { background:rgba(255,255,255,.15); }

        /* ── Keyframes ──────────────────────────────────────────────────── */
        @keyframes cq-float         { 0%,100%{ transform:translateY(0) }    50%{ transform:translateY(-6px) } }
        @keyframes cq-shimmer-move  { 0%,100%{ background-position:-200% center } 50%{ background-position:200% center } }
        @keyframes cq-pulse         { 0%,100%{ opacity:.6 }                 50%{ opacity:1 } }
        @keyframes cq-particle-float {
          0%  { opacity:0; transform:translateY(0)    scale(0) }
          20% { opacity:1; transform:translateY(-4px) scale(1) }
          100%{ opacity:0; transform:translateY(-28px) scale(.3) }
        }

        .cq-anim-gold { animation: cq-border-pulse-gold 3s ease-in-out infinite; }
        @keyframes cq-border-pulse-gold {
          0%, 100% { box-shadow: 0 0 10px rgba(251,191,36,.20); }
          50%       { box-shadow: 0 0 22px rgba(251,191,36,.45); }
        }
        .cq-anim-trophy { animation: cq-border-pulse-trophy 2.8s ease-in-out infinite; }
        @keyframes cq-border-pulse-trophy {
          0%, 100% { box-shadow: 0 0 14px rgba(245,158,11,.25); }
          50%       { box-shadow: 0 0 30px rgba(245,158,11,.55), 0 0 8px rgba(245,158,11,.15) inset; }
        }
        .cq-anim-diamond { animation: cq-aurora-diamond 4s ease-in-out infinite; }
        @keyframes cq-aurora-diamond {
          0%   { box-shadow: 0 0 18px rgba(167,139,250,.30), 4px 0 18px rgba(167,139,250,.15); }
          33%  { box-shadow: 0 0 28px rgba(167,139,250,.50), -4px 0 18px rgba(196,120,250,.20); }
          66%  { box-shadow: 0 0 18px rgba(139,92,246,.45),   4px 0 24px rgba(167,139,250,.25); }
          100% { box-shadow: 0 0 18px rgba(167,139,250,.30),  4px 0 18px rgba(167,139,250,.15); }
        }
        .cq-anim-crown { animation: cq-breathe-crown 2.2s ease-in-out infinite; }
        @keyframes cq-breathe-crown {
          0%, 100% { box-shadow: 0 0 22px rgba(229,9,20,.35), 0 0 6px rgba(229,9,20,.15) inset; }
          50%       { box-shadow: 0 0 42px rgba(229,9,20,.65), 0 0 14px rgba(229,9,20,.25) inset; }
        }

        @media(max-width:480px) {
          .cq-hdr    { padding:36px 20px 10px; }
          .cq-title  { font-size:28px; }
          .cq-count-n { font-size:44px; }
          .cq-list   { padding:0 16px; gap:8px; }
          .cq-card   { padding:12px 14px; gap:12px; }
          .cq-icon   { font-size:1.3rem; }
          .cq-name   { font-size:13px; }
          .cq-serie  { padding:0 16px; }
          .cq-serie-title { font-size:16px; }
          .cq-section { padding:0 16px; }
        }
      `}</style>

      {/* ── Modal ── */}
      {selectedAch && (() => {
        const mc = MEDAL_CONFIG[selectedAch.medal]
        const hi = isHighlight(selectedAch.medal)
        return (
          <div className="cq-overlay" onClick={() => setSelectedAch(null)}>
            <div
              className="cq-modal"
              style={medalVars(mc)}
              onClick={e => e.stopPropagation()}
            >
              {mc.shimmer && <div className="cq-modal-shimmer" />}
              <span className={`cq-modal-icon ${mc.float ? 'float' : ''}`}>{selectedAch.icon}</span>
              <div className={`cq-modal-name ${hi ? 'hi' : ''}`}>{selectedAch.name}</div>
              <div className="cq-modal-desc">{selectedAch.desc}</div>
              <div className="cq-modal-badge">
                <span className="cq-modal-badge-dot" />
                {mc.label}
              </div>
              <button className="cq-modal-close" onClick={() => setSelectedAch(null)}>
                Fechar
              </button>
            </div>
          </div>
        )
      })()}

      <div className="cq-wrap">
        <div className="cq-glow" />

        {/* ── Header ── */}
        <div className={`cq-hdr ${visible ? 'v' : ''}`}>
          <div className="cq-tag"><span>🏆</span>Conquistas</div>
          <div className="cq-title">Conquistas <span className="cq-em">Desbloqueadas</span></div>
          <div className="cq-sub">Os marcos da história de vocês</div>
        </div>

        <div className={`cq-trophy ${visible ? 'v' : ''}`}>
          <div className="cq-trophy-icon">🏆</div>
        </div>

        <div className={`cq-count ${visible ? 'v' : ''}`}>
          <div className="cq-count-n">{totalCount}</div>
          <div className="cq-count-l">
            conquista{totalCount !== 1 ? 's' : ''} desbloqueada{totalCount !== 1 ? 's' : ''}
          </div>
        </div>

        {/* ── Card "Se fosse uma série" ── */}
        <div className={`cq-serie ${visible ? 'v' : ''}`}>
          <div
            className={`cq-serie-card ${hiSerie ? 'hi' : ''} ${mcSerie.animation}`}
            style={medalVars(mcSerie)}
          >
            {mcSerie.shimmer && <div className="cq-shimmer" />}
            <div className="cq-serie-top">
              <div className="cq-serie-tag"><span>🎬</span>Se fosse uma série...</div>
              <div className="cq-serie-temp">
                {serieComp.temporadasCalc} temporada{serieComp.temporadasCalc !== 1 ? 's' : ''}
              </div>
            </div>
            <div className={`cq-serie-title ${hiSerie ? 'hi' : ''}`}>{serieComp.titulo}</div>
            <div className="cq-serie-desc">
              Pelo tempo juntos, vocês já estariam no nível de uma série com{' '}
              <strong>{serieComp.temporadasCalc} temporada{serieComp.temporadasCalc !== 1 ? 's' : ''}</strong>.
            </div>
            <div className="cq-serie-list">
              {serieComp.exemplos.map(nome => (
                <span key={nome} className="cq-serie-pill">{nome}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Conquistas manuais — Reação do Público, Premiações, Marcos ── */}
        {manualCards.length > 0 && (
          <>
            {/* Separar por tipo pra renderizar com section labels */}
            {(() => {
              const reacaoKeys = new Set(REACOES_PUBLICO.map(r => r.key))
              const premiacaoKeys = new Set(PREMIACOES.map(r => r.key))
              // const marcosKeys = new Set(MARCOS_HISTORIA.map(r => r.key))

              const reacoes = userKeys.filter(k => reacaoKeys.has(k)).map(k => ALL_MANUAL[k]).filter(Boolean)
              const premiacoes = userKeys.filter(k => premiacaoKeys.has(k)).map(k => ALL_MANUAL[k]).filter(Boolean)
              const marcos = userKeys.filter(k => !reacaoKeys.has(k) && !premiacaoKeys.has(k)).map(k => ALL_MANUAL[k]).filter(Boolean)

              const sections: { label: string; emoji: string; items: ManualAch[]; delay: number }[] = []
              if (reacoes.length > 0)   sections.push({ label: 'Reação do Público', emoji: '🍅', items: reacoes, delay: 0.5 })
              if (premiacoes.length > 0) sections.push({ label: 'Premiações', emoji: '🏆', items: premiacoes, delay: 0.6 })
              if (marcos.length > 0)     sections.push({ label: 'Marcos da História', emoji: '🎬', items: marcos, delay: 0.7 })

              let globalIdx = 0

              return sections.map((section) => (
                <div key={section.label}>
                  <div
                    className={`cq-section ${visible ? 'v' : ''}`}
                    style={{ transitionDelay: `${section.delay}s` }}
                  >
                    <div className="cq-section-label">
                      <span>{section.emoji}</span> {section.label}
                    </div>
                  </div>
                  <div className="cq-list">
                    {section.items.map((ach) => {
                      const mc = MEDAL_CONFIG[ach.medal]
                      const hi = isHighlight(ach.medal)
                      const idx = globalIdx++
                      return (
                        <div
                          key={ach.label}
                          className={`cq-card ${hi ? 'hi' : ''} ${mc.animation}`}
                          style={{
                            ...medalVars(mc),
                            opacity: visible ? 1 : 0,
                            transform: visible ? 'translateY(0)' : 'translateY(18px)',
                            transitionDelay: `${section.delay + 0.08 + idx * 0.07}s`,
                          } as React.CSSProperties}
                          onClick={() => setSelectedAch({ icon: ach.icon, name: ach.label, desc: ach.desc, medal: ach.medal })}
                        >
                          {mc.shimmer && <div className="cq-shimmer" />}
                          <span
                            className={`cq-icon ${hi ? 'hi' : ''} ${mc.float ? 'float' : ''}`}
                            style={{ fontSize: `${mc.iconScale * 1.5}rem` }}
                          >
                            {ach.icon}
                          </span>
                          <span className={`cq-name ${hi ? 'hi' : ''}`}>{ach.label}</span>
                          <span className="cq-card-arrow">›</span>
                          {mc.particles && [0, 1, 2, 3].map(p => (
                            <div
                              key={p}
                              className="cq-particle"
                              style={{
                                '--c-main': mc.color,
                                left: `${20 + p * 20}%`,
                                top: `${30 + pseudoRand(p * 7 + idx) * 40}%`,
                                animationDuration: `${1.5 + pseudoRand(p) * 1}s`,
                                animationDelay: `${pseudoRand(p * 3 + idx) * 1.2}s`,
                              } as React.CSSProperties}
                            />
                          ))}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))
            })()}
          </>
        )}

        {/* ── Conquistas de tempo — section label ── */}
        <div
          className={`cq-section ${visible ? 'v' : ''}`}
          style={{ transitionDelay: `${manualCards.length > 0 ? 0.8 : 0.5}s` }}
        >
          <div className="cq-section-label">
            <span>⏱️</span> Tempo Juntos
          </div>
        </div>

        {/* ── Lista de conquistas de tempo — TODAS ── */}
        <div className="cq-list">
          {timeCards.length === 0 ? (
            <div className="cq-empty">Vocês estão no começo da jornada ❤️</div>
          ) : (
            timeCards.map((ach, i) => {
              const mc = MEDAL_CONFIG[ach.medal]
              const hi = isHighlight(ach.medal)
              const baseDelay = manualCards.length > 0 ? 0.9 : 0.55

              return (
                <div
                  key={ach.dias}
                  className={`cq-card ${hi ? 'hi' : ''} ${mc.animation}`}
                  style={{
                    ...medalVars(mc),
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(18px)',
                    transitionDelay: `${baseDelay + i * 0.08}s`,
                  } as React.CSSProperties}
                  onClick={() => setSelectedAch({ icon: ach.icon, name: ach.name, desc: ach.desc, medal: ach.medal })}
                >
                  {mc.shimmer && <div className="cq-shimmer" />}
                  <span
                    className={`cq-icon ${hi ? 'hi' : ''} ${mc.float ? 'float' : ''}`}
                    style={{ fontSize: `${mc.iconScale * 1.5}rem` }}
                  >
                    {ach.icon}
                  </span>
                  <span className={`cq-name ${hi ? 'hi' : ''}`}>{ach.name}</span>
                  <span className="cq-card-arrow">›</span>
                  {mc.particles && [0, 1, 2, 3].map(p => (
                    <div
                      key={p}
                      className="cq-particle"
                      style={{
                        '--c-main': mc.color,
                        left: `${20 + p * 20}%`,
                        top: `${30 + pseudoRand(p * 7 + i) * 40}%`,
                        animationDuration: `${1.5 + pseudoRand(p) * 1}s`,
                        animationDelay: `${pseudoRand(p * 3 + i) * 1.2}s`,
                      } as React.CSSProperties}
                    />
                  ))}
                </div>
              )
            })
          )}

          {/* Próxima conquista (locked) */}
          {nextAch && (
            <div className={`cq-next ${visible ? 'v' : ''}`}>
              <span className="cq-next-icon">{nextAch.icon}</span>
              <div className="cq-next-text">
                <div className="cq-next-name">{nextAch.name}</div>
                <div className="cq-next-sub">
                  Faltam {nextAch.dias - dias} dia{nextAch.dias - dias !== 1 ? 's' : ''} para desbloquear
                </div>
              </div>
              <span className="cq-next-lock">🔒</span>
            </div>
          )}
        </div>

        <button className="cq-btn" onClick={onNext}>
          Continuar assistindo
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9,18 15,12 9,6" />
          </svg>
        </button>
      </div>
    </>
  )
}