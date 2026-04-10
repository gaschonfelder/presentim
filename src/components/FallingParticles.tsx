'use client'

import { useMemo } from 'react'
import {
  type FallingAnimation,
  getEmojisForAnimation,
} from '@/lib/falling-animation'

type FallingParticlesProps = {
  animation: FallingAnimation
  /** Quantidade de partículas (default: 18) */
  count?: number
  /** z-index (default: 0 — atrás do conteúdo) */
  zIndex?: number
}

type Particle = {
  id: number
  emoji: string
  left: number       // posição X em %
  size: number       // tamanho em px
  duration: number   // duração da queda em segundos
  delay: number      // delay inicial em segundos
  rotate: number     // rotação inicial em graus
  drift: number      // desvio horizontal em px (sway)
  opacity: number
}

/**
 * Renderiza partículas caindo continuamente como overlay de fundo.
 *
 * - DOM puro com CSS animation (GPU-accelerated)
 * - position: fixed, pointer-events: none — não interfere em interações
 * - 18 partículas por padrão (suficiente pra preencher sem pesar)
 * - Cada partícula tem variação aleatória pra parecer orgânico
 *
 * Importante: as partículas são geradas uma única vez (useMemo) — se
 * `animation.type` mudar, o componente regenera com novos emojis.
 */
export default function FallingParticles({
  animation,
  count = 20,
  zIndex = 0,
}: FallingParticlesProps) {
  // useMemo precisa rodar SEMPRE (Rules of Hooks) — early return depois
  const particles = useMemo<Particle[]>(() => {
    if (!animation.enabled) return []
    const emojis = getEmojisForAnimation(animation)
    const list: Particle[] = []
    for (let i = 0; i < count; i++) {
      list.push({
        id: i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        left: Math.random() * 100,
        size: 16 + Math.random() * 22, // 16-38px
        duration: 9 + Math.random() * 2, // 9-17s
        delay: -Math.random() * 17, // negativo pra começarem em posições aleatórias
        rotate: Math.random() * 360,
        drift: -30 + Math.random() * 60, // -30 a +30 px
        opacity: 0.5 + Math.random() * 0.4, // 0.5 a 0.9
      })
    }
    return list
  }, [animation.enabled, animation.type, animation.customEmoji, count])

  // Não renderiza se desabilitado
  if (!animation.enabled) return null

  return (
    <>
      <style>{`
        .fp-wrap {
          position: fixed;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: ${zIndex};
        }

        .fp-particle {
          position: absolute;
          top: -10%;
          will-change: transform, opacity;
          user-select: none;
          animation-name: fp-fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        @keyframes fp-fall {
          0% {
            transform: translate(0, -10vh) rotate(var(--rot, 0deg));
            opacity: 0;
          }
          10% {
            opacity: var(--op, 0.7);
          }
          50% {
            transform: translate(var(--drift, 0px), 50vh) rotate(calc(var(--rot, 0deg) + 180deg));
          }
          90% {
            opacity: var(--op, 0.7);
          }
          100% {
            transform: translate(calc(var(--drift, 0px) * -0.5), 110vh) rotate(calc(var(--rot, 0deg) + 360deg));
            opacity: 0;
          }
        }
      `}</style>

      <div className="fp-wrap" aria-hidden="true">
        {particles.map(p => (
          <div
            key={p.id}
            className="fp-particle"
            style={{
              left: `${p.left}%`,
              fontSize: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              ['--rot' as string]: `${p.rotate}deg`,
              ['--drift' as string]: `${p.drift}px`,
              ['--op' as string]: `${p.opacity}`,
            }}
          >
            {p.emoji}
          </div>
        ))}
      </div>
    </>
  )
}