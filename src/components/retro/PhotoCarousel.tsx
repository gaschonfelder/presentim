'use client'

import { useRef, useState, useEffect } from 'react'
import { useRetro } from './RetroProvider'
import { ALL_ACHIEVEMENTS, RARITY_CONFIG } from '@/lib/retro'
import RarityBadge from './RarityBadge'

/**
 * Carrossel de fotos com loop infinito.
 * - Swipe horizontal avança/volta uma foto por vez
 * - Depois da última volta pra primeira (e vice-versa)
 * - Swipe é independente da navegação de slides (captura touch no próprio carrossel)
 * - Dots indicadores mudam de cor quando foto tem conquista vinculada
 */
export default function PhotoCarousel() {
  const { fotos, fotoParaConquista, theme, slide } = useRetro()
  const isActive = slide === 4

  const [idx, setIdx] = useState(0)
  const [mounted, setMounted] = useState(false)

  // Reset do índice quando o slide reabre
  useEffect(() => {
    if (isActive) {
      setIdx(0)
      setMounted(true)
    }
  }, [isActive])

  // Swipe
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const touchConsumed = useRef<boolean>(false)

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    touchConsumed.current = false
  }

  function onTouchMove(e: React.TouchEvent) {
    if (touchStartX.current === null || touchStartY.current === null) return
    const dx = e.touches[0].clientX - touchStartX.current
    const dy = e.touches[0].clientY - touchStartY.current
    // Se for swipe horizontal claro, para a propagação pra navegação não pegar
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
      e.stopPropagation()
    }
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || touchStartY.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      e.stopPropagation() // impede que SlideNavigation troque o slide inteiro
      if (dx < 0) {
        // Próxima foto (loop no final)
        setIdx((i) => (i + 1) % fotos.length)
      } else {
        // Anterior (loop no começo)
        setIdx((i) => (i - 1 + fotos.length) % fotos.length)
      }
      touchConsumed.current = true
    }

    touchStartX.current = null
    touchStartY.current = null
  }

  // Caso vazio
  if (fotos.length === 0) {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '.8rem',
          background: theme.bg.photos,
        }}
      >
        <div style={{ fontSize: '3rem', opacity: 0.3 }}>📷</div>
        <div style={{ fontSize: '.85rem', color: theme.text.muted }}>
          Nenhuma foto adicionada
        </div>
      </div>
    )
  }

  return (
    <div
      style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Wrapper das fotos — desloca com transform */}
      <div
        style={{
          display: 'flex',
          height: '100%',
          transform: `translateX(-${idx * 100}%)`,
          transition: 'transform .7s cubic-bezier(.4,0,.2,1)',
        }}
      >
        {fotos.map((src, i) => {
          const conquistaKey = fotoParaConquista[src]
          const info = conquistaKey ? ALL_ACHIEVEMENTS[conquistaKey] : null
          const isCurrent = i === idx && isActive

          return (
            <div
              key={i}
              style={{
                flex: '0 0 100%',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <img
                src={src}
                alt=""
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />

              {/* Gradiente base (escuro no topo e rodapé) */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to bottom, rgba(0,0,0,.55) 0%, transparent 35%, transparent 65%, rgba(0,0,0,.4) 100%)',
                }}
              />

              {/* Badge de conquista (só se tem conquista vinculada) */}
              {info && isCurrent && mounted && (
                <RarityBadge
                  rarity={info.rarity}
                  icon={info.icon}
                  label={info.label}
                  mounted={true}
                />
              )}

              {/* Contador quando foto NÃO tem conquista */}
              {!info && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '.8rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '.6rem',
                    color: 'rgba(255,255,255,.3)',
                    letterSpacing: '.15em',
                    textTransform: 'uppercase',
                  }}
                >
                  {i + 1} / {fotos.length}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Título "Momentos nossos" — só aparece quando foto atual NÃO tem conquista */}
      {!fotoParaConquista[fotos[idx]] && (
        <div
          style={{
            position: 'absolute',
            bottom: '3.5rem',
            left: 0,
            right: 0,
            padding: '0 24px',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          <div
            style={{
              fontFamily: "'DM Serif Display',serif",
              fontSize: '1.6rem',
              color: '#ffffff',
              lineHeight: 1.1,
              textShadow: '0 2px 12px rgba(0,0,0,.6)',
            }}
          >
            Momentos{' '}
            <em
              style={{
                fontStyle: 'italic',
                background: theme.accentGradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              nossos
            </em>
          </div>
        </div>
      )}

      {/* Dots indicadores */}
      <div
        style={{
          position: 'absolute',
          bottom: '1.2rem',
          left: 0,
          right: 0,
          display: 'flex',
          gap: 5,
          justifyContent: 'center',
          zIndex: 4,
          pointerEvents: 'none',
        }}
      >
        {fotos.map((src, i) => {
          const conquistaKey = fotoParaConquista[src]
          const info = conquistaKey ? ALL_ACHIEVEMENTS[conquistaKey] : null
          const dotColor =
            i === idx
              ? info
                ? RARITY_CONFIG[info.rarity].color
                : theme.text.primary
              : 'rgba(255,255,255,.3)'

          return (
            <div
              key={i}
              style={{
                width: i === idx ? 18 : 5,
                height: 5,
                borderRadius: i === idx ? 3 : 50,
                background: dotColor,
                boxShadow:
                  i === idx && info
                    ? `0 0 6px ${RARITY_CONFIG[info.rarity].glow}`
                    : 'none',
                transition: 'all .3s',
              }}
            />
          )
        })}
      </div>

      {/* Dica de swipe (só aparece brevemente) */}
      {isActive && idx === 0 && (
        <div
          style={{
            position: 'absolute',
            top: 76,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: '.65rem',
            color: 'rgba(255,255,255,.5)',
            letterSpacing: '.18em',
            textTransform: 'uppercase',
            zIndex: 5,
            pointerEvents: 'none',
            animation: 'swipeHint 3s ease-out forwards',
          }}
        >
          Deslize para ver mais →
        </div>
      )}

      <style>{`
        @keyframes swipeHint {
          0% { opacity: 0 }
          20% { opacity: 1 }
          80% { opacity: 1 }
          100% { opacity: 0 }
        }
      `}</style>
    </div>
  )
}