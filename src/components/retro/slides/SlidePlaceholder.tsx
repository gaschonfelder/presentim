'use client'

import { useRetro } from '../RetroProvider'

type Props = {
  index: number
  label: string
  icon: string
  bgKey: keyof ReturnType<typeof useRetro>['theme']['bg']
}

/**
 * Placeholder temporário pros slides ainda não implementados na V2.
 * Será substituído por componentes próprios em entregas seguintes.
 */
export default function SlidePlaceholder({ index, label, icon, bgKey }: Props) {
  const { slide, theme } = useRetro()
  const isActive = slide === index

  return (
    <div
      className={`retro-v2-slide ${isActive ? 'active' : ''}`}
      style={{ background: theme.bg[bgKey] }}
    >
      <div
        className="retro-v2-anim"
        style={{
          fontSize: '4rem',
          marginBottom: '1rem',
          opacity: 0.5,
        }}
      >
        {icon}
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
        Slide {index + 1}
      </p>
      <h2
        className="retro-v2-anim"
        style={{
          fontFamily: "'DM Serif Display',serif",
          fontSize: 'clamp(1.8rem,6vw,2.4rem)',
          color: theme.text.primary,
          textAlign: 'center',
          marginBottom: '1rem',
          animationDelay: '.3s',
        }}
      >
        {label}
      </h2>
      <p
        className="retro-v2-anim"
        style={{
          fontSize: '.8rem',
          color: theme.text.muted,
          textAlign: 'center',
          animationDelay: '.45s',
        }}
      >
        Em construção
      </p>
    </div>
  )
}