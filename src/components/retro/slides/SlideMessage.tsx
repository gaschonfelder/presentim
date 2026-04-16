'use client'

import { useRetro } from '../RetroProvider'
import FloatingEmojis from '../FloatingEmojis'

export default function SlideMessage() {
  const { slide, mensagem, nome2, theme } = useRetro()
  const isActive = slide === 7

  return (
    <div
      className={`retro-v2-slide ${isActive ? 'active' : ''}`}
      style={{ background: theme.bg.message }}
    >
      <FloatingEmojis emojis={theme.floatingEmojis} count={14} mode="spread" />

      <div
        className="retro-v2-anim"
        style={{
          fontFamily: "'DM Serif Display',serif",
          fontSize: '7rem',
          color: theme.accent,
          opacity: 0.22,
          lineHeight: 0.5,
          alignSelf: 'flex-start',
          marginLeft: -10,
        }}
      >
        "
      </div>

      <p
        className="retro-v2-anim"
        style={{
          fontFamily: "'DM Serif Display',serif",
          fontSize: 'clamp(1.2rem,4.5vw,1.65rem)',
          fontStyle: 'italic',
          color: theme.text.primary,
          lineHeight: 1.7,
          textAlign: 'center',
          margin: '.5rem 0 1.8rem',
          animationDelay: '.2s',
        }}
      >
        "{mensagem}"
      </p>

      <p
        className="retro-v2-anim"
        style={{
          fontSize: '.72rem',
          letterSpacing: '.2em',
          textTransform: 'uppercase',
          color: theme.accent,
          opacity: 0.8,
          animationDelay: '.4s',
        }}
      >
        — com todo meu amor, {nome2}
      </p>
    </div>
  )
}