'use client'

import { useEffect, useState } from 'react'
import { useRetro } from '../RetroProvider'

export default function SlideStats() {
  const { slide, stats, theme, dias } = useRetro()
  const isActive = slide === 5

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isActive) {
      const t = setTimeout(() => setVisible(true), 300)
      return () => clearTimeout(t)
    } else {
      setVisible(false)
    }
  }, [isActive])

  // 3 métricas embasadas:
  // 1. Percentil de duração (IBGE + dados internos)
  // 2. Nível de vínculo (fases de Knapp)
  // 3. XP acumulado
  const bars = [
    {
      label: 'Duração vs outros casais',
      bar: stats.percentilDuracao,
      gradient: `linear-gradient(90deg, ${theme.accent}, ${theme.accentAlt})`,
      highlight: `Mais que ${stats.percentilDuracao}% dos casais`,
      sub: `${dias.toLocaleString('pt-BR')} dias juntos`,
    },
    {
      label: `Nível ${stats.bond.level} · ${stats.bond.name}`,
      bar: stats.bond.bar,
      gradient: 'linear-gradient(90deg,#3a7bd5,#7b68ee)',
      highlight: stats.bond.desc,
      sub:
        stats.bond.level <= 3
          ? 'A história está começando 🌱'
          : stats.bond.level <= 5
          ? 'Vínculo em construção 💫'
          : stats.bond.level <= 7
          ? 'Amor consolidado 🔥'
          : 'Casais assim duram 🌟',
    },
    {
      label: `XP acumulado · Nível ${stats.xpLevel}`,
      bar: Math.min(100, stats.xpLevel),
      gradient: 'linear-gradient(90deg,#d4a853,#ffa726)',
      highlight: `${stats.xp.toLocaleString('pt-BR')} pontos de amor`,
      sub: `${stats.totalConquistas} conquista${stats.totalConquistas !== 1 ? 's' : ''} desbloqueada${stats.totalConquistas !== 1 ? 's' : ''}`,
    },
  ]

  return (
    <div
      className={`retro-v2-slide ${isActive ? 'active' : ''}`}
      style={{ background: theme.bg.stats }}
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
        Vocês em números
      </p>

      <h2
        className="retro-v2-anim"
        style={{
          fontFamily: "'DM Serif Display',serif",
          fontSize: 'clamp(1.8rem,7vw,2.6rem)',
          color: theme.text.primary,
          textAlign: 'center',
          lineHeight: 1.12,
          marginBottom: '.6rem',
          animationDelay: '.15s',
        }}
      >
        Como vocês se{' '}
        <em
          style={{
            fontStyle: 'italic',
            background: theme.accentGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          comparam
        </em>
      </h2>

      <div
        style={{
          width: '100%',
          maxWidth: 350,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          marginTop: '1.4rem',
        }}
      >
        {bars.map((s, i) => (
          <div
            key={i}
            style={{
              background: theme.statCard.bg,
              border: `1px solid ${theme.statCard.border}`,
              borderRadius: 18,
              padding: '1.1rem 1.2rem',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(18px)',
              transition: `all .5s ease ${i * 0.2}s`,
            }}
          >
            <div
              style={{
                fontSize: '.62rem',
                letterSpacing: '.18em',
                textTransform: 'uppercase',
                color: theme.text.muted,
                marginBottom: '.5rem',
              }}
            >
              {s.label}
            </div>
            <div
              style={{
                height: 6,
                background: 'rgba(127,127,127,.15)',
                borderRadius: 3,
                overflow: 'hidden',
                marginBottom: '.5rem',
              }}
            >
              <div
                style={{
                  height: '100%',
                  borderRadius: 3,
                  background: s.gradient,
                  width: visible ? `${s.bar}%` : '0%',
                  transition: 'width 1.2s cubic-bezier(.4,0,.2,1) .3s',
                }}
              />
            </div>
            <div
              style={{
                fontFamily: "'DM Serif Display',serif",
                fontSize: '1.15rem',
                color: theme.text.primary,
                lineHeight: 1.3,
              }}
            >
              {s.highlight}
            </div>
            <div
              style={{
                fontSize: '.72rem',
                color: theme.text.muted,
                marginTop: '.2rem',
              }}
            >
              {s.sub}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}