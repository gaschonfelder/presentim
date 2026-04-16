'use client'

import { useRetro } from '../RetroProvider'
import FloatingEmojis from '../FloatingEmojis'

export default function SlideIntro() {
  const { slide, nome1, nome2, startDateFormatted, cidade, moonPhase, dias, theme } = useRetro()
  const isActive = slide === 0

  return (
    <div
      className={`retro-v2-slide ${isActive ? 'active' : ''}`}
      style={{ background: theme.bg.intro }}
    >
      <FloatingEmojis emojis={theme.floatingEmojis} count={16} mode="bottom" />

      <p
        className="retro-v2-anim"
        style={{
          fontSize: '.58rem',
          letterSpacing: '.3em',
          textTransform: 'uppercase',
          color: theme.text.eyebrow,
          marginBottom: '.55rem',
          animationDelay: '.1s',
        }}
      >
        Uma história de amor
      </p>

      <h1
        className="retro-v2-anim"
        style={{
          fontFamily: "'DM Serif Display',serif",
          fontSize: 'clamp(2.4rem,10vw,3.6rem)',
          color: theme.text.primary,
          textAlign: 'center',
          lineHeight: 1.05,
          marginBottom: '1rem',
          animationDelay: '.25s',
        }}
      >
        {nome1}{' '}
        <em
          style={{
            fontStyle: 'italic',
            background: theme.accentGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          &
        </em>{' '}
        {nome2}
      </h1>

      <p
        className="retro-v2-anim"
        style={{
          fontFamily: "'DM Serif Display',serif",
          fontStyle: 'italic',
          fontSize: '1rem',
          color: theme.text.secondary,
          animationDelay: '.4s',
        }}
      >
        desde {startDateFormatted}
      </p>

      <div
        className="retro-v2-anim"
        style={{
          display: 'flex',
          gap: 12,
          marginTop: '2rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          animationDelay: '.6s',
        }}
      >
        <Chip>📍 {cidade}</Chip>
        <Chip>
          {moonPhase.emoji} {moonPhase.name}
        </Chip>
        <Chip>⏳ {dias.toLocaleString('pt-BR')} dias</Chip>
      </div>

      <p
        className="retro-v2-anim"
        style={{
          position: 'absolute',
          bottom: '2rem',
          fontSize: '.65rem',
          color: theme.text.muted,
          letterSpacing: '.18em',
          textTransform: 'uppercase',
          animationDelay: '1s',
        }}
      >
        deslize para começar
      </p>
    </div>
  )
}

// ─── Helper local ─────────────────────────────────────────────────────────────

function Chip({ children }: { children: React.ReactNode }) {
  const { theme } = useRetro()
  return (
    <div
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
        margin: 3,
      }}
    >
      {children}
    </div>
  )
}