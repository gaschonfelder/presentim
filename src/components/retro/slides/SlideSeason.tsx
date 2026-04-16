'use client'

import { useRetro } from '../RetroProvider'

export default function SlideSeason() {
  const { slide, season, theme } = useRetro()
  const isActive = slide === 1

  return (
    <div
      className={`retro-v2-slide ${isActive ? 'active' : ''}`}
      style={{ background: theme.bg.season }}
    >
      <div
        className="retro-v2-anim"
        style={{
          fontSize: '5rem',
          marginBottom: '1rem',
          filter: 'drop-shadow(0 0 20px rgba(255,200,0,.4))',
        }}
      >
        {season.icon}
      </div>

      <p
        className="retro-v2-anim"
        style={{
          fontSize: '.58rem',
          letterSpacing: '.3em',
          textTransform: 'uppercase',
          color: theme.text.eyebrow,
          marginBottom: '.55rem',
          animationDelay: '.15s',
        }}
      >
        A estação de vocês
      </p>

      <h2
        className="retro-v2-anim"
        style={{
          fontFamily: "'DM Serif Display',serif",
          fontSize: 'clamp(2rem,8vw,2.8rem)',
          color: theme.text.primary,
          textAlign: 'center',
          lineHeight: 1.12,
          marginBottom: '.6rem',
          animationDelay: '.3s',
        }}
      >
        {season.name}{' '}
        <em
          style={{
            fontStyle: 'italic',
            background: theme.accentGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          especial
        </em>
      </h2>

      <p
        className="retro-v2-anim"
        style={{
          fontSize: '.9rem',
          color: theme.text.secondary,
          textAlign: 'center',
          lineHeight: 1.7,
          maxWidth: 280,
          margin: '.8rem 0 1.8rem',
          fontWeight: 300,
          animationDelay: '.45s',
        }}
      >
        {season.desc}
      </p>

      <div
        className="retro-v2-anim"
        style={{
          display: 'flex',
          gap: 6,
          flexWrap: 'wrap',
          justifyContent: 'center',
          animationDelay: '.6s',
        }}
      >
        {season.chips.map((c, i) => (
          <span
            key={i}
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
            {c}
          </span>
        ))}
      </div>
    </div>
  )
}