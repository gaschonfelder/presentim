'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRetro } from '../RetroProvider'

// Easing: começa rápido, desacelera no final (ease-out cubic)
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

const COUNT_UP_DURATION_MS = 2000

/**
 * Anima 3 valores simultâneos de 0 até os targets quando `active` vira true.
 * Targets são congelados no momento de ativação — não se atualizam durante
 * a animação, mesmo que o componente re-renderize por outros motivos.
 */
function useCountUpTriple(
  targets: [number, number, number],
  active: boolean,
  duration = COUNT_UP_DURATION_MS,
) {
  const [values, setValues] = useState<[number, number, number]>([0, 0, 0])
  const rafRef = useRef<number | null>(null)
  const frozenTargetsRef = useRef<[number, number, number]>([0, 0, 0])

  useEffect(() => {
    if (!active) {
      setValues([0, 0, 0])
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      return
    }

    // Congela os targets no momento de ativação
    frozenTargetsRef.current = targets

    let startTime: number | null = null

    function step(ts: number) {
      if (startTime === null) startTime = ts
      const elapsed = ts - startTime
      const progress = Math.min(1, elapsed / duration)
      const eased = easeOutCubic(progress)

      const [t1, t2, t3] = frozenTargetsRef.current
      const newValues: [number, number, number] = [
        Math.floor(eased * t1),
        Math.floor(eased * t2),
        Math.floor(eased * t3),
      ]
      setValues(newValues)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        setValues(frozenTargetsRef.current) // garante valor final exato
        rafRef.current = null
      }
    }

    rafRef.current = requestAnimationFrame(step)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]) // IMPORTANTE: só depende de `active`, não de `targets`

  return values
}

export default function SlideCounter() {
  const { slide, startDate, theme } = useRetro()
  const isActive = slide === 2

  // Targets dos campos animados — calculados UMA vez com base no startDate.
  // Como startDate não muda, esses valores ficam estáveis.
  const { yearsTarget, monthsTarget, daysTarget } = useMemo(() => {
    const totalSecsAtMount = Math.floor((Date.now() - startDate.getTime()) / 1000)
    const days = Math.floor(totalSecsAtMount / 86400)
    return {
      yearsTarget: Math.floor(days / 365.25),
      monthsTarget: Math.floor(days / 30.44) % 12,
      daysTarget: days % 30,
    }
  }, [startDate])

  // Animação dos 3 campos simultaneamente
  const [yearsAnim, monthsAnim, daysAnim] = useCountUpTriple(
    [yearsTarget, monthsTarget, daysTarget],
    isActive,
  )

  // Contador vivo APENAS de horas/min/seg (componente isolado abaixo).
  // Separação intencional: re-renders do ticker não afetam a animação.

  const items = [
    { v: yearsAnim, l: 'anos' },
    { v: monthsAnim, l: 'meses' },
    { v: daysAnim, l: 'dias' },
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
        {/* Anos / Meses / Dias — animados */}
        {items.map(({ v, l }, i) => (
          <CounterCell key={i} value={v} label={l} />
        ))}

        {/* Horas / Min / Seg — ticker vivo isolado */}
        <LiveTicker startDate={startDate} isActive={isActive} />
      </div>
    </div>
  )
}

// ─── Célula simples do grid ──────────────────────────────────────────────────

function CounterCell({ value, label }: { value: number; label: string }) {
  const { theme } = useRetro()
  return (
    <div
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
        {String(value).padStart(2, '0')}
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
        {label}
      </div>
    </div>
  )
}

// ─── Ticker vivo — isolado pra não interferir na animação principal ──────────

function LiveTicker({ startDate, isActive }: { startDate: Date; isActive: boolean }) {
  const [totalSecs, setTotalSecs] = useState<number>(() =>
    Math.floor((Date.now() - startDate.getTime()) / 1000),
  )

  useEffect(() => {
    if (!isActive) return
    const t = setInterval(() => setTotalSecs((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [isActive])

  const secs = totalSecs % 60
  const mins = Math.floor(totalSecs / 60) % 60
  const hours = Math.floor(totalSecs / 3600) % 24

  return (
    <>
      <CounterCell value={hours} label="horas" />
      <CounterCell value={mins} label="min" />
      <CounterCell value={secs} label="seg" />
    </>
  )
}