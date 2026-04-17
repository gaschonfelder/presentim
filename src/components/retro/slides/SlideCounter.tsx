'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRetro } from '../RetroProvider'

// Easing: começa rápido, desacelera no final (ease-out cubic)
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

const COUNT_UP_DURATION_MS = 2000

export default function SlideCounter() {
  const { slide, startDate, theme } = useRetro()
  const isActive = slide === 2

  // Targets dos campos animados — congelados uma vez por startDate
  const { yearsTarget, monthsTarget, daysTarget } = useMemo(() => {
    const totalSecsAtMount = Math.floor((Date.now() - startDate.getTime()) / 1000)
    const days = Math.floor(totalSecsAtMount / 86400)
    return {
      yearsTarget: Math.floor(days / 365.25),
      monthsTarget: Math.floor(days / 30.44) % 12,
      daysTarget: days % 30,
    }
  }, [startDate])

  // Refs pros elementos de texto — animação escreve DIRETO no DOM, sem React
  const yearsRef = useRef<HTMLDivElement>(null)
  const monthsRef = useRef<HTMLDivElement>(null)
  const daysRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Quando slide sai: zera o display
    if (!isActive) {
      if (yearsRef.current) yearsRef.current.textContent = '00'
      if (monthsRef.current) monthsRef.current.textContent = '00'
      if (daysRef.current) daysRef.current.textContent = '00'
      return
    }

    let rafId: number | null = null
    let startTime: number | null = null

    function step(ts: number) {
      if (startTime === null) startTime = ts
      const elapsed = ts - startTime
      const progress = Math.min(1, elapsed / COUNT_UP_DURATION_MS)
      const eased = easeOutCubic(progress)

      const y = Math.floor(eased * yearsTarget)
      const m = Math.floor(eased * monthsTarget)
      const d = Math.floor(eased * daysTarget)

      // Escreve direto no DOM — não dispara re-render React
      if (yearsRef.current) yearsRef.current.textContent = String(y).padStart(2, '0')
      if (monthsRef.current) monthsRef.current.textContent = String(m).padStart(2, '0')
      if (daysRef.current) daysRef.current.textContent = String(d).padStart(2, '0')

      if (progress < 1) {
        rafId = requestAnimationFrame(step)
      } else {
        // Valor final exato
        if (yearsRef.current) yearsRef.current.textContent = String(yearsTarget).padStart(2, '0')
        if (monthsRef.current) monthsRef.current.textContent = String(monthsTarget).padStart(2, '0')
        if (daysRef.current) daysRef.current.textContent = String(daysTarget).padStart(2, '0')
      }
    }

    rafId = requestAnimationFrame(step)

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [isActive, yearsTarget, monthsTarget, daysTarget])

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
        {/* Anos / Meses / Dias — animados via ref, sem estado React */}
        <AnimatedCell valueRef={yearsRef} label="anos" initial="00" />
        <AnimatedCell valueRef={monthsRef} label="meses" initial="00" />
        <AnimatedCell valueRef={daysRef} label="dias" initial="00" />

        {/* Horas / Min / Seg — ticker vivo isolado */}
        <LiveTicker startDate={startDate} isActive={isActive} />
      </div>
    </div>
  )
}

// ─── Célula animada via ref (não re-renderiza) ───────────────────────────────

function AnimatedCell({
  valueRef,
  label,
  initial,
}: {
  valueRef: React.RefObject<HTMLDivElement | null>
  label: string
  initial: string
}) {
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
        ref={valueRef}
        style={{
          fontFamily: "'DM Serif Display',serif",
          fontSize: '2rem',
          color: theme.text.primary,
          lineHeight: 1,
        }}
      >
        {initial}
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

// ─── Ticker vivo — isolado (horas/min/seg atualizando ao vivo) ───────────────

function LiveTicker({ startDate, isActive }: { startDate: Date; isActive: boolean }) {
  const [totalSecs, setTotalSecs] = useState(0)

  // Calcula valor real só no client (evita mismatch de hidratação)
  useEffect(() => {
    setTotalSecs(Math.floor((Date.now() - startDate.getTime()) / 1000))
  }, [startDate])

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
      <StaticCell value={hours} label="horas" />
      <StaticCell value={mins} label="min" />
      <StaticCell value={secs} label="seg" />
    </>
  )
}

function StaticCell({ value, label }: { value: number; label: string }) {
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