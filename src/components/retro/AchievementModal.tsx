'use client'

import { useEffect } from 'react'
import { RARITY_CONFIG, type Rarity } from '@/lib/retro'
import { useRetro } from './RetroProvider'

export type AchievementDetail = {
  icon: string
  label: string
  desc: string
  rarity: Rarity
  kind: 'tempo' | 'manual' | 'auto'
}

const KIND_LABELS: Record<AchievementDetail['kind'], string> = {
  tempo: 'Conquista de tempo',
  manual: 'Conquista registrada',
  auto: 'Conquista automática',
}

/**
 * Modal de detalhe de conquista — estilo progressivo por raridade:
 * - Comum:   cinza, borda simples
 * - Incomum: azul, brilho sutil
 * - Raro:    roxo, glow médio + partículas
 * - Épico:   dourado/laranja, glow forte + shimmer
 * - Lendário: rosa/neon, glow pulsante + shimmer + partículas + fundo animado
 */
export default function AchievementModal({
  detail,
  onClose,
}: {
  detail: AchievementDetail | null
  onClose: () => void
}) {
  const { theme } = useRetro()

  // Escape fecha o modal
  useEffect(() => {
    if (!detail) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [detail, onClose])

  if (!detail) return null

  const rc = RARITY_CONFIG[detail.rarity]

  // ─── Config visual por raridade ────────────────────────────────────────────

  const config = getRarityVisualConfig(detail.rarity)

  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,.75)',
        backdropFilter: 'blur(10px)',
        animation: 'achModalFadeIn .25s ease',
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 320,
          background: config.bg,
          border: `2px solid ${config.borderColor}`,
          borderRadius: 20,
          padding: '2.2rem 1.5rem 1.5rem',
          textAlign: 'center',
          overflow: 'hidden',
          boxShadow: config.boxShadow,
          animation: `achModalIn .4s cubic-bezier(.34,1.56,.64,1), ${
            config.borderAnimation ? config.borderAnimation + ' ' : ''
          }`,
        }}
      >
        {/* Fundo animado (épico/lendário) */}
        {config.hasAnimatedBg && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: config.animatedBgGradient,
              opacity: 0.25,
              pointerEvents: 'none',
              animation: 'achBgSweep 4s linear infinite',
              backgroundSize: '200% 100%',
            }}
          />
        )}

        {/* Partículas (raro+) */}
        {config.hasParticles && (
          <>
            {Array.from({ length: 8 }).map((_, i) => {
              const seed = Math.sin(i * 17 + 3) * 43758.5453
              const rand = seed - Math.floor(seed)
              const left = 10 + rand * 80
              const delay = rand * 2
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: `${left}%`,
                    bottom: 0,
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: config.particleColor,
                    boxShadow: `0 0 6px ${config.particleColor}`,
                    animation: `achParticleUp ${2.5 + rand}s ease-out ${delay}s infinite`,
                    pointerEvents: 'none',
                  }}
                />
              )
            })}
          </>
        )}

        {/* Botão fechar */}
        <button
          onClick={onClose}
          aria-label="Fechar"
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'rgba(255,255,255,.1)',
            border: 'none',
            color: theme.text.primary,
            fontSize: '.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3,
          }}
        >
          ✕
        </button>

        {/* Conteúdo */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          {/* Ícone */}
          <div
            style={{
              fontSize: '4rem',
              marginBottom: '.8rem',
              filter: config.iconFilter,
              animation: config.iconAnimation,
            }}
          >
            {detail.icon}
          </div>

          {/* Selo de raridade */}
          <div
            style={{
              display: 'inline-block',
              fontSize: '.6rem',
              letterSpacing: '.25em',
              textTransform: 'uppercase',
              color: rc.color,
              padding: '.25rem .8rem',
              borderRadius: 50,
              border: `1px solid ${rc.color}`,
              marginBottom: '.8rem',
              textShadow: detail.rarity !== 'comum' ? `0 0 10px ${rc.color}` : 'none',
              animation: rc.shimmer ? 'achShimmer 2s ease-in-out infinite' : 'none',
            }}
          >
            {rc.label}
          </div>

          {/* Título */}
          <h3
            style={{
              fontFamily: "'DM Serif Display',serif",
              fontSize: '1.5rem',
              color: config.titleColor,
              lineHeight: 1.2,
              marginBottom: '.6rem',
              textShadow: config.titleTextShadow,
            }}
          >
            {detail.label}
          </h3>

          {/* Descrição */}
          <p
            style={{
              fontSize: '.82rem',
              color: 'rgba(255,255,255,.75)',
              lineHeight: 1.55,
              marginBottom: '1rem',
            }}
          >
            {detail.desc}
          </p>

          {/* Tipo de conquista */}
          <p
            style={{
              fontSize: '.62rem',
              color: 'rgba(255,255,255,.45)',
              letterSpacing: '.15em',
              textTransform: 'uppercase',
            }}
          >
            {KIND_LABELS[detail.kind]}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes achModalFadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }
        @keyframes achModalIn {
          from { opacity: 0; transform: scale(.85) translateY(20px) }
          to { opacity: 1; transform: scale(1) translateY(0) }
        }
        @keyframes achBgSweep {
          0% { background-position: 0% 50% }
          100% { background-position: 200% 50% }
        }
        @keyframes achParticleUp {
          0% { transform: translateY(0) scale(1); opacity: 0 }
          20% { opacity: 1 }
          100% { transform: translateY(-280px) scale(.3); opacity: 0 }
        }
        @keyframes achShimmer {
          0%, 100% { opacity: 1 }
          50% { opacity: .6 }
        }
        @keyframes achBorderPulseLegendary {
          0%, 100% {
            box-shadow:
              0 0 30px rgba(248,87,166,.5),
              0 20px 60px rgba(0,0,0,.6),
              inset 0 0 20px rgba(248,87,166,.15);
          }
          50% {
            box-shadow:
              0 0 50px rgba(248,87,166,.9),
              0 20px 60px rgba(0,0,0,.6),
              inset 0 0 30px rgba(248,87,166,.25);
          }
        }
        @keyframes achBorderGlowEpic {
          0%, 100% {
            box-shadow:
              0 0 25px rgba(255,190,30,.4),
              0 15px 40px rgba(0,0,0,.5);
          }
          50% {
            box-shadow:
              0 0 40px rgba(255,190,30,.7),
              0 15px 40px rgba(0,0,0,.5);
          }
        }
        @keyframes achIconBounce {
          0%, 100% { transform: scale(1) }
          50% { transform: scale(1.08) }
        }
        @keyframes achIconFloat {
          0%, 100% { transform: translateY(0) }
          50% { transform: translateY(-4px) }
        }
      `}</style>
    </div>
  )
}

// ─── Config visual por raridade ──────────────────────────────────────────────

type VisualConfig = {
  bg: string
  borderColor: string
  boxShadow: string
  borderAnimation?: string
  hasAnimatedBg: boolean
  animatedBgGradient: string
  hasParticles: boolean
  particleColor: string
  titleColor: string
  titleTextShadow: string
  iconFilter: string
  iconAnimation: string
}

function getRarityVisualConfig(rarity: Rarity): VisualConfig {
  switch (rarity) {
    case 'lendario':
      return {
        bg: 'linear-gradient(135deg, #2a0015 0%, #1a0010 100%)',
        borderColor: 'rgba(248,87,166,.8)',
        boxShadow:
          '0 0 30px rgba(248,87,166,.5), 0 20px 60px rgba(0,0,0,.6), inset 0 0 20px rgba(248,87,166,.15)',
        borderAnimation: 'achBorderPulseLegendary 2.5s ease-in-out infinite',
        hasAnimatedBg: true,
        animatedBgGradient:
          'linear-gradient(90deg, transparent 0%, rgba(248,87,166,.5) 25%, rgba(255,87,87,.5) 50%, rgba(255,167,38,.5) 75%, transparent 100%)',
        hasParticles: true,
        particleColor: 'rgba(248,87,166,.9)',
        titleColor: '#ffdce9',
        titleTextShadow: '0 0 20px rgba(248,87,166,.8)',
        iconFilter: 'drop-shadow(0 0 15px rgba(248,87,166,.9))',
        iconAnimation: 'achIconFloat 2s ease-in-out infinite',
      }
    case 'epico':
      return {
        bg: 'linear-gradient(135deg, #2a1a00 0%, #1a0f00 100%)',
        borderColor: 'rgba(255,190,30,.7)',
        boxShadow:
          '0 0 25px rgba(255,190,30,.4), 0 15px 40px rgba(0,0,0,.5)',
        borderAnimation: 'achBorderGlowEpic 3s ease-in-out infinite',
        hasAnimatedBg: true,
        animatedBgGradient:
          'linear-gradient(90deg, transparent 0%, rgba(255,190,30,.4) 50%, transparent 100%)',
        hasParticles: true,
        particleColor: 'rgba(255,200,50,.8)',
        titleColor: '#ffe69a',
        titleTextShadow: '0 0 15px rgba(255,200,50,.6)',
        iconFilter: 'drop-shadow(0 0 12px rgba(255,200,50,.8))',
        iconAnimation: 'achIconBounce 2.5s ease-in-out infinite',
      }
    case 'raro':
      return {
        bg: 'linear-gradient(135deg, #1a0030 0%, #10001f 100%)',
        borderColor: 'rgba(180,80,255,.6)',
        boxShadow:
          '0 0 18px rgba(180,80,255,.3), 0 10px 30px rgba(0,0,0,.4)',
        hasAnimatedBg: false,
        animatedBgGradient: '',
        hasParticles: true,
        particleColor: 'rgba(180,80,255,.7)',
        titleColor: '#e9d0ff',
        titleTextShadow: '0 0 10px rgba(180,80,255,.5)',
        iconFilter: 'drop-shadow(0 0 8px rgba(180,80,255,.6))',
        iconAnimation: 'none',
      }
    case 'incomum':
      return {
        bg: 'linear-gradient(135deg, #001830 0%, #000f1f 100%)',
        borderColor: 'rgba(80,160,255,.5)',
        boxShadow: '0 0 12px rgba(80,160,255,.2), 0 8px 24px rgba(0,0,0,.4)',
        hasAnimatedBg: false,
        animatedBgGradient: '',
        hasParticles: false,
        particleColor: '',
        titleColor: '#d0e8ff',
        titleTextShadow: '0 0 8px rgba(80,160,255,.3)',
        iconFilter: 'drop-shadow(0 0 6px rgba(80,160,255,.4))',
        iconAnimation: 'none',
      }
    case 'comum':
    default:
      return {
        bg: 'linear-gradient(135deg, #1a1a1f 0%, #0f0f13 100%)',
        borderColor: 'rgba(200,200,200,.25)',
        boxShadow: '0 8px 24px rgba(0,0,0,.4)',
        hasAnimatedBg: false,
        animatedBgGradient: '',
        hasParticles: false,
        particleColor: '',
        titleColor: '#ffffff',
        titleTextShadow: 'none',
        iconFilter: 'none',
        iconAnimation: 'none',
      }
  }
}