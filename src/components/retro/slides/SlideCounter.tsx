'use client'

import { useEffect, useRef, useState } from 'react'
import { useRetro } from '../RetroProvider'

// Easing: começa rápido, desacelera no final (ease-out cubic)
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

const COUNT_UP_DURATION_MS = 2000

/**
 * Hook que anima um valor de 0 até `target` em `duration` ms.
 * Só inicia quando `active` vira true, e reseta se o slide sair e voltar.
 */
function useCountUp(target: number, active: boolean, duration = COUNT_UP_DURATION_MS) {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (!active) {
      setValue(0)
      startTimeRef.current = null
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      return
    }

    function step(ts: number) {
      if (startTimeRef.current === null) startTimeRef.current = ts
      const elapsed = ts - startTimeRef.current
      const progress = Math.min(1, elapsed / duration)
      const eased = easeOutCubic(progress)
      setValue(Math.floor(eased * target))

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        setValue(target) // garante valor final exato
      }
    }

    rafRef.current = requestAnimationFrame(step)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [target, active, duration])

  return value
}

export default function SlideCounter() {
  const { slide, startDate, theme } = useRetro()
  const isActive = slide === 2

  const [totalSecs, setTotalSecs] = useState<number>(() =>
    Math.floor((Date.now() - startDate.getTime()) / 1000),
  )

  // Contador só roda quando o slide está ativo (economiza CPU)
  useEffect(() => {
    if (!isActive) return
    const t = setInterval(() => setTotalSecs((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [isActive])

  const secs = totalSecs % 60
  const mins = Math.floor(totalSecs / 60) % 60
  const hours = Math.floor(totalSecs / 3600) % 24
  const daysCount = Math.floor(totalSecs / 86400)
  const monthsCount = Math.floor(daysCount / 30.44)
  const yearsCount = Math.floor(daysCount / 365.25)

  // Valores alvo pros campos animados (anos / meses / dias)
  const yearsTarget = yearsCount
  const monthsTarget = monthsCount % 12
  const daysTarget = daysCount % 30

  // Valores animados — sobem de 0 até o target quando o slide abre
  const yearsAnim = useCountUp(yearsTarget, isActive)
  const monthsAnim = useCountUp(monthsTarget, isActive)
  const daysAnim = useCountUp(daysTarget, isActive)

  const items = [
    { v: yearsAnim, l: 'anos' },
    { v: monthsAnim, l: 'meses' },
    { v: daysAnim, l: 'dias' },
    { v: hours, l: 'horas' },
    { v: mins, l: 'min' },
    { v: secs, l: 'seg' },
  ]

  return (
    <div
      className={`retro-v2-slide ${isActive ? 'active' : ''}`}
      style={{ background: theme.bg.counter }}
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
        Contando cada segundo
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
          animationDelay: '.15s',
        }}
      >
        Tempo{' '}
        <em
          style={{
            fontStyle: 'italic',
            background: theme.accentGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          juntos
        </em>
      </h2>

      <div
        className="retro-v2-anim"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 10,
          width: '100%',
          maxWidth: 340,
          marginTop: '1.5rem',
          animationDelay: '.3s',
        }}
      >
        {items.map(({ v, l }, i) => (
          <div
            key={i}
            style={{
              background: theme.statCard.bg,
              border: `1px solid ${theme.statCard.border}`,
              borderRadius: 18,
              padding: '1rem .5rem',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: "'DM Serif Display',serif",
                fontSize: '2rem',
                color: theme.text.primary,
                lineHeight: 1,
              }}
            >
              {String(v).padStart(2, '0')}
            </div>
            <div
              style={{
                fontSize: '.6rem',
                color: theme.text.muted,
                textTransform: 'uppercase',
                letterSpacing: '.15em',
                marginTop: 4,
              }}
            >
              {l}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}