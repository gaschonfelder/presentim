'use client'

import { useRef, useState, useEffect } from 'react'
import { useRetro } from './RetroProvider'
import { ALL_ACHIEVEMENTS, RARITY_CONFIG } from '@/lib/retro'
import RarityBadge from './RarityBadge'

/**
 * Carrossel de fotos com loop infinito.
 * - Cards ocupam ~85% da área, com margem mostrando o fundo
 * - Mobile: swipe horizontal
 * - Desktop: botões ‹ › dentro do carrossel
 * - Loop infinito (última → primeira e vice-versa)
 */
export default function PhotoCarousel() {
  const { fotos, fotoParaConquista, theme, slide } = useRetro()
  const isActive = slide === 4

  const [idx, setIdx] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (isActive) {
      setIdx(0)
      setMounted(true)
    }
  }, [isActive])

  // ─── Navegação ─────────────────────────────────────────────────────────────

  function nextPhoto() {
    if (fotos.length === 0) return
    setIdx((i) => (i + 1) % fotos.length)
  }

  function prevPhoto() {
    if (fotos.length === 0) return
    setIdx((i) => (i - 1 + fotos.length) % fotos.length)
  }

  // ─── Swipe mobile ──────────────────────────────────────────────────────────

  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  function onTouchMove(e: React.TouchEvent) {
    if (touchStartX.current === null || touchStartY.current === null) return
    const dx = e.touches[0].clientX - touchStartX.current
    const dy = e.touches[0].clientY - touchStartY.current
    // Se for swipe horizontal, impede a navegação de slides inteiros
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
      e.stopPropagation()
    }
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || touchStartY.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      e.stopPropagation()
      if (dx < 0) nextPhoto()
      else prevPhoto()
    }

    touchStartX.current = null
    touchStartY.current = null
  }

  // ─── Caso vazio ────────────────────────────────────────────────────────────

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
        }}
      >
        <div style={{ fontSize: '3rem', opacity: 0.3 }}>📷</div>
        <div style={{ fontSize: '.85rem', color: theme.text.muted }}>
          Nenhuma foto adicionada
        </div>
      </div>
    )
  }

  const currentSrc = fotos[idx]
  const currentConquistaKey = fotoParaConquista[currentSrc]
  const currentInfo = currentConquistaKey ? ALL_ACHIEVEMENTS[currentConquistaKey] : null

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '72px 20px 60px',
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Título */}
      <p
        className="retro-v2-anim"
        style={{
          fontSize: '.58rem',
          letterSpacing: '.3em',
          textTransform: 'uppercase',
          color: theme.text.eyebrow,
          marginBottom: '.4rem',
          textAlign: 'center',
        }}
      >
        Nossas memórias
      </p>
      <h2
        className="retro-v2-anim"
        style={{
          fontFamily: "'DM Serif Display',serif",
          fontSize: 'clamp(1.6rem,6vw,2rem)',
          color: theme.text.primary,
          textAlign: 'center',
          lineHeight: 1.15,
          marginBottom: '1rem',
          animationDelay: '.15s',
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
      </h2>

      {/* Container do card */}
      <div
        className="retro-v2-anim"
        style={{
          position: 'relative',
          width: '85%',
          maxWidth: 360,
          flex: 1,
          maxHeight: 520,
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,.5)',
          animationDelay: '.3s',
        }}
      >
        {/* Fotos em fila horizontal com transform */}
        <div
          style={{
            display: 'flex',
            height: '100%',
            width: '100%',
            transform: `translateX(-${idx * 100}%)`,
            transition: 'transform .6s cubic-bezier(.4,0,.2,1)',
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

                {/* Gradiente suave topo/rodapé */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(to bottom, rgba(0,0,0,.45) 0%, transparent 30%, transparent 70%, rgba(0,0,0,.35) 100%)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Badge de conquista */}
                {info && isCurrent && mounted && (
                  <RarityBadge
                    rarity={info.rarity}
                    icon={info.icon}
                    label={info.label}
                    mounted={true}
                  />
                )}

                {/* Contador foto N/total */}
                {!info && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '.8rem',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '.62rem',
                      color: 'rgba(255,255,255,.7)',
                      letterSpacing: '.15em',
                      textTransform: 'uppercase',
                      background: 'rgba(0,0,0,.4)',
                      backdropFilter: 'blur(6px)',
                      padding: '.25rem .7rem',
                      borderRadius: 50,
                    }}
                  >
                    {i + 1} / {fotos.length}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Botões ‹ › — aparecem no hover (desktop) e sempre no mobile */}
        {fotos.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                prevPhoto()
              }}
              aria-label="Foto anterior"
              style={{
                position: 'absolute',
                top: '50%',
                left: 10,
                transform: 'translateY(-50%)',
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: 'rgba(0,0,0,.45)',
                border: '1px solid rgba(255,255,255,.25)',
                color: '#fff',
                fontSize: '1.1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(8px)',
                zIndex: 5,
                transition: 'all .2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(0,0,0,.7)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(0,0,0,.45)'
              }}
            >
              ‹
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                nextPhoto()
              }}
              aria-label="Próxima foto"
              style={{
                position: 'absolute',
                top: '50%',
                right: 10,
                transform: 'translateY(-50%)',
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: 'rgba(0,0,0,.45)',
                border: '1px solid rgba(255,255,255,.25)',
                color: '#fff',
                fontSize: '1.1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(8px)',
                zIndex: 5,
                transition: 'all .2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(0,0,0,.7)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(0,0,0,.45)'
              }}
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Dots indicadores — abaixo do card */}
      {fotos.length > 1 && (
        <div
          className="retro-v2-anim"
          style={{
            display: 'flex',
            gap: 5,
            justifyContent: 'center',
            marginTop: '1rem',
            animationDelay: '.5s',
          }}
        >
          {fotos.map((src, i) => {
            const conquistaKey = fotoParaConquista[src]
            const info = conquistaKey ? ALL_ACHIEVEMENTS[conquistaKey] : null
            const isCurrent = i === idx
            const dotColor = isCurrent
              ? info
                ? RARITY_CONFIG[info.rarity].color
                : theme.accent
              : theme.text.muted

            return (
              <div
                key={i}
                onClick={() => setIdx(i)}
                style={{
                  width: isCurrent ? 22 : 6,
                  height: 6,
                  borderRadius: isCurrent ? 3 : 50,
                  background: dotColor,
                  boxShadow:
                    isCurrent && info
                      ? `0 0 6px ${RARITY_CONFIG[info.rarity].glow}`
                      : 'none',
                  transition: 'all .3s',
                  cursor: 'pointer',
                }}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}