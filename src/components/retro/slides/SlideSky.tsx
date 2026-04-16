'use client'

import { useRetro } from '../RetroProvider'
import SkyCanvas from '../SkyCanvas'

export default function SlideSky() {
  const { slide, startDate, cityCoords, moonPhase, theme } = useRetro()
  const isActive = slide === 3

  return (
    <div
      className={`retro-v2-slide ${isActive ? 'active' : ''}`}
      style={{
        padding: 0,
        overflow: 'hidden',
        background: theme.bg.sky,
      }}
    >
      {/* Canvas só renderiza quando o slide está ativo (economia CPU) */}
      {isActive && (
        <SkyCanvas
          date={startDate}
          lat={cityCoords.lat}
          lng={cityCoords.lng}
        />
      )}

      {/* Overlay com texto embaixo */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 28px 56px',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      >
        <p
          className="retro-v2-anim"
          style={{
            fontSize: '.58rem',
            letterSpacing: '.3em',
            textTransform: 'uppercase',
            color: theme.text.eyebrow,
            marginBottom: '.55rem',
          }}
        >
          O céu naquela noite
        </p>

        <h2
          className="retro-v2-anim"
          style={{
            fontFamily: "'DM Serif Display',serif",
            fontSize: '1.8rem',
            color: theme.text.primary,
            textAlign: 'center',
            lineHeight: 1.15,
            marginBottom: '.8rem',
            animationDelay: '.15s',
          }}
        >
          As estrelas{' '}
          <em
            style={{
              fontStyle: 'italic',
              background: theme.accentGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            testemunharam
          </em>
        </h2>

        <div
          className="retro-v2-anim"
          style={{
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            justifyContent: 'center',
            animationDelay: '.3s',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              background: theme.chip.bg,
              border: `1px solid ${theme.chip.border}`,
              borderRadius: 50,
              padding: '.28rem .75rem',
              fontSize: '.68rem',
              color: theme.chip.text,
            }}
          >
            {moonPhase.emoji} {moonPhase.name}
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              background: theme.chip.bg,
              border: `1px solid ${theme.chip.border}`,
              borderRadius: 50,
              padding: '.28rem .75rem',
              fontSize: '.68rem',
              color: theme.chip.text,
            }}
          >
            📍 {cityCoords.label}
          </span>
        </div>
      </div>
    </div>
  )
}