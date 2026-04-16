'use client'

import { useEffect, useRef } from 'react'
import {
  BRIGHT_STARS,
  findVisibleConstellations,
  getMoonPhase,
  localSiderealTime,
  raDecToAltAz,
  altAzToXY,
  pseudoRand,
} from '@/lib/retro'

type Props = {
  date: Date
  lat: number
  lng: number
}

type StarRender = {
  x: number
  y: number
  sz: number
  alpha: number
  r: number
  g: number
  b: number
  name: string | null
  freq: number
  phase: number
}

/**
 * Canvas animado do céu estrelado V3.
 * Mais vivo: 600+ estrelas, nebulosas coloridas, Via Láctea visível,
 * constelações com linhas, estrelas cadentes aleatórias.
 */
export default function SkyCanvas({ date, lat, lng }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const W = canvas.offsetWidth
    const H = canvas.offsetHeight
    canvas.width = W
    canvas.height = H

    const skyDate = new Date(date)
    skyDate.setHours(22, 0, 0)
    const lst = localSiderealTime(skyDate, lng)
    const seed = skyDate.getTime()

    // ─── Estrelas reais ──────────────────────────────────────────────────

    const starMap: Record<string, { x: number; y: number }> = {}
    const starData: StarRender[] = []

    BRIGHT_STARS.forEach(([ra, dec, mag, name]) => {
      const { alt, az } = raDecToAltAz(ra, dec, lat, lst)
      const { x, y, visible } = altAzToXY(alt, az, W, H)
      if (!visible || alt < 3) return

      const sz = Math.max(1, 5 - mag * 0.9)
      const alpha = Math.max(0.5, Math.min(1, 1 - (mag + 1.5) * 0.1))
      const blue = ra < 100 || (ra > 270 && ra < 320)
      const red = (ra > 80 && ra < 90) || (ra > 240 && ra < 260)

      if (name) starMap[name] = { x, y }

      starData.push({
        x, y, sz, alpha,
        r: red ? 255 : blue ? 180 : 245,
        g: red ? 170 : blue ? 210 : 240,
        b: red ? 120 : blue ? 255 : 255,
        name: mag < 1.5 ? name : null,
        freq: 0.5 + pseudoRand(ra) * 2,
        phase: pseudoRand(dec) * Math.PI * 2,
      })
    })

    // ─── Estrelas procedurais (muito mais densas) ────────────────────────

    // Camada 1: estrelas médias (~250)
    for (let i = 0; i < 250; i++) {
      const x = pseudoRand(seed + i * 31) * W
      const y = pseudoRand(seed + i * 47) * H * 0.88
      starData.push({
        x, y,
        sz: 0.6 + pseudoRand(seed + i * 13) * 1.5,
        alpha: 0.3 + pseudoRand(seed + i * 17) * 0.5,
        r: 200 + Math.floor(pseudoRand(seed + i * 7) * 55),
        g: 210 + Math.floor(pseudoRand(seed + i * 11) * 45),
        b: 240 + Math.floor(pseudoRand(seed + i * 3) * 15),
        name: null,
        freq: 0.3 + pseudoRand(seed + i * 23) * 2,
        phase: pseudoRand(seed + i * 29) * Math.PI * 2,
      })
    }

    // Camada 2: estrelas pequenas/dim (~400)
    for (let i = 0; i < 400; i++) {
      const x = pseudoRand(seed + i * 53 + 1000) * W
      const y = pseudoRand(seed + i * 67 + 1000) * H * 0.92
      starData.push({
        x, y,
        sz: 0.2 + pseudoRand(seed + i * 41 + 1000) * 0.7,
        alpha: 0.15 + pseudoRand(seed + i * 37 + 1000) * 0.35,
        r: 210, g: 220, b: 255,
        name: null,
        freq: 0.2 + pseudoRand(seed + i * 43 + 1000) * 1,
        phase: pseudoRand(seed + i * 59 + 1000) * Math.PI * 2,
      })
    }

    // Camada 3: estrelas brilhantes extras (~30)
    for (let i = 0; i < 30; i++) {
      const x = pseudoRand(seed + i * 97 + 2000) * W
      const y = pseudoRand(seed + i * 83 + 2000) * H * 0.8
      starData.push({
        x, y,
        sz: 1.5 + pseudoRand(seed + i * 71 + 2000) * 2,
        alpha: 0.5 + pseudoRand(seed + i * 79 + 2000) * 0.4,
        r: 220 + Math.floor(pseudoRand(seed + i * 61 + 2000) * 35),
        g: 225 + Math.floor(pseudoRand(seed + i * 73 + 2000) * 30),
        b: 245 + Math.floor(pseudoRand(seed + i * 89 + 2000) * 10),
        name: null,
        freq: 0.4 + pseudoRand(seed + i * 91 + 2000) * 1.8,
        phase: pseudoRand(seed + i * 101 + 2000) * Math.PI * 2,
      })
    }

    // ─── Constelações ────────────────────────────────────────────────────

    const visibleConstellations = findVisibleConstellations(lat, lng, date, 4)

    type ConLine = { x1: number; y1: number; x2: number; y2: number }
    type ConRender = { name: string; lines: ConLine[]; lx: number; ly: number }

    const constellations: ConRender[] = visibleConstellations
      .map((c) => {
        const lines: ConLine[] = []
        let sx = 0, sy = 0, n = 0

        for (const [a, b] of c.lines) {
          const sa = starMap[a], sb = starMap[b]
          if (sa && sb) {
            lines.push({ x1: sa.x, y1: sa.y, x2: sb.x, y2: sb.y })
            sx += sa.x + sb.x
            sy += sa.y + sb.y
            n += 2
          }
        }

        if (!lines.length || !n) return null
        return { name: c.name, lines, lx: sx / n, ly: sy / n - 20 }
      })
      .filter(Boolean) as ConRender[]

    // ─── Nebulosas (manchas coloridas suaves) ────────────────────────────

    type Nebula = { x: number; y: number; r: number; color: string }
    const nebulae: Nebula[] = []
    for (let i = 0; i < 5; i++) {
      nebulae.push({
        x: pseudoRand(seed + i * 113) * W,
        y: pseudoRand(seed + i * 127) * H * 0.7,
        r: 60 + pseudoRand(seed + i * 131) * 100,
        color: [
          'rgba(80,100,200,.07)',
          'rgba(150,80,180,.05)',
          'rgba(100,60,180,.06)',
          'rgba(60,120,200,.06)',
          'rgba(200,100,150,.04)',
        ][i % 5],
      })
    }

    // ─── Lua ─────────────────────────────────────────────────────────────

    const phaseVal = getMoonPhase(skyDate)
    const moonPos = { x: W * 0.73, y: H * 0.15 }
    const moonR = 20

    // ─── Shooting stars ──────────────────────────────────────────────────

    type ShootingStar = {
      x: number; y: number; angle: number; speed: number; len: number
      life: number; maxLife: number; active: boolean; nextAt: number
    }

    const shootingStars: ShootingStar[] = Array.from({ length: 3 }, (_, i) => ({
      x: 0, y: 0, angle: 0, speed: 0, len: 0,
      life: 0, maxLife: 0, active: false,
      nextAt: 2000 + pseudoRand(seed + i * 200) * 6000,
    }))

    function spawnShootingStar(ss: ShootingStar) {
      ss.x = pseudoRand(Date.now() + ss.nextAt) * W * 0.8 + W * 0.1
      ss.y = pseudoRand(Date.now() + ss.nextAt + 1) * H * 0.4
      ss.angle = 0.5 + pseudoRand(Date.now() + ss.nextAt + 2) * 0.8
      ss.speed = 4 + pseudoRand(Date.now() + ss.nextAt + 3) * 5
      ss.len = 40 + pseudoRand(Date.now() + ss.nextAt + 4) * 60
      ss.life = 0
      ss.maxLife = 400 + pseudoRand(Date.now() + ss.nextAt + 5) * 300
      ss.active = true
      ss.nextAt = Date.now() + 4000 + Math.random() * 8000
    }

    // ─── Via Láctea ──────────────────────────────────────────────────────

    const milkyWayAngle = (lst * Math.PI) / 180

    // ─── Loop de animação ────────────────────────────────────────────────

    let elapsed = 0

    function draw(t: number) {
      ctx.clearRect(0, 0, W, H)

      // Fundo gradiente
      const grd = ctx.createRadialGradient(W / 2, H * 0.3, 0, W / 2, H * 0.3, H * 0.8)
      grd.addColorStop(0, '#0a1744')
      grd.addColorStop(0.5, '#060e2e')
      grd.addColorStop(1, '#020414')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, W, H)

      // Via Láctea — faixa mais visível
      ctx.save()
      ctx.translate(W / 2, H / 2)
      ctx.rotate(milkyWayAngle * 0.15 - 0.4)
      const mGrd = ctx.createLinearGradient(-W, 0, W, 0)
      mGrd.addColorStop(0, 'rgba(120,140,220,0)')
      mGrd.addColorStop(0.25, 'rgba(120,140,220,.06)')
      mGrd.addColorStop(0.4, 'rgba(160,170,230,.1)')
      mGrd.addColorStop(0.5, 'rgba(180,190,240,.12)')
      mGrd.addColorStop(0.6, 'rgba(160,170,230,.1)')
      mGrd.addColorStop(0.75, 'rgba(120,140,220,.06)')
      mGrd.addColorStop(1, 'rgba(120,140,220,0)')
      ctx.fillStyle = mGrd
      ctx.fillRect(-W, -H * 0.15, W * 2, H * 0.3)
      ctx.restore()

      // Nebulosas
      nebulae.forEach((n) => {
        const ng = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r)
        ng.addColorStop(0, n.color)
        ng.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = ng
        ctx.fill()
      })

      // Estrelas
      starData.forEach((s) => {
        const tw = 0.7 + 0.3 * Math.sin(t * 0.001 * s.freq + s.phase)
        const sz = s.sz * tw
        const a = s.alpha * tw

        // Glow pra estrelas maiores
        if (s.sz > 1.8) {
          const glowR = sz * (s.sz > 3 ? 5 : 3.5)
          const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowR)
          g.addColorStop(0, `rgba(${s.r},${s.g},${s.b},${a * 0.4})`)
          g.addColorStop(0.5, `rgba(${s.r},${s.g},${s.b},${a * 0.1})`)
          g.addColorStop(1, 'rgba(0,0,0,0)')
          ctx.beginPath()
          ctx.arc(s.x, s.y, glowR, 0, Math.PI * 2)
          ctx.fillStyle = g
          ctx.fill()
        }

        // Estrela
        ctx.beginPath()
        ctx.arc(s.x, s.y, Math.max(0.3, sz), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${s.r},${s.g},${s.b},${a})`
        ctx.fill()

        // Cruz de difração pras mais brilhantes
        if (s.sz > 3.5) {
          const cLen = sz * 3
          ctx.strokeStyle = `rgba(${s.r},${s.g},${s.b},${a * 0.2})`
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(s.x - cLen, s.y)
          ctx.lineTo(s.x + cLen, s.y)
          ctx.moveTo(s.x, s.y - cLen)
          ctx.lineTo(s.x, s.y + cLen)
          ctx.stroke()
        }

        // Nome
        if (s.name && s.sz > 3) {
          ctx.fillStyle = `rgba(200,215,255,${a * 0.5})`
          ctx.font = '10px DM Sans, sans-serif'
          ctx.fillText(s.name, s.x + sz + 5, s.y + 3)
        }
      })

      // Constelações — linhas sólidas com pontos de junção
      constellations.forEach((c) => {
        // Linhas
        ctx.strokeStyle = 'rgba(180,210,255,.4)'
        ctx.lineWidth = 1.2
        ctx.setLineDash([])
        c.lines.forEach((l) => {
          ctx.beginPath()
          ctx.moveTo(l.x1, l.y1)
          ctx.lineTo(l.x2, l.y2)
          ctx.stroke()
        })

        // Pontos de junção (círculos nos vértices)
        const points = new Set<string>()
        c.lines.forEach((l) => {
          points.add(`${l.x1},${l.y1}`)
          points.add(`${l.x2},${l.y2}`)
        })
        points.forEach((p) => {
          const [px, py] = p.split(',').map(Number)
          // Glow
          const jg = ctx.createRadialGradient(px, py, 0, px, py, 8)
          jg.addColorStop(0, 'rgba(180,210,255,.25)')
          jg.addColorStop(1, 'rgba(0,0,0,0)')
          ctx.beginPath()
          ctx.arc(px, py, 8, 0, Math.PI * 2)
          ctx.fillStyle = jg
          ctx.fill()
          // Ponto sólido
          ctx.beginPath()
          ctx.arc(px, py, 2.5, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(200,220,255,.7)'
          ctx.fill()
        })

        // Nome da constelação
        ctx.fillStyle = 'rgba(180,210,255,.5)'
        ctx.font = 'italic 12px DM Sans, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(c.name, c.lx, c.ly)
        ctx.textAlign = 'start'
      })

      // Shooting stars
      elapsed += 16 // ~60fps
      shootingStars.forEach((ss) => {
        if (!ss.active && elapsed > ss.nextAt) {
          spawnShootingStar(ss)
        }
        if (!ss.active) return

        ss.life += 16
        const progress = ss.life / ss.maxLife
        if (progress >= 1) { ss.active = false; return }

        const alpha = progress < 0.3 ? progress / 0.3 : 1 - (progress - 0.3) / 0.7
        const cx = ss.x + Math.cos(ss.angle) * ss.speed * ss.life * 0.15
        const cy = ss.y + Math.sin(ss.angle) * ss.speed * ss.life * 0.15
        const tx = cx - Math.cos(ss.angle) * ss.len * alpha
        const ty = cy - Math.sin(ss.angle) * ss.len * alpha

        const sg = ctx.createLinearGradient(tx, ty, cx, cy)
        sg.addColorStop(0, 'rgba(255,255,255,0)')
        sg.addColorStop(1, `rgba(255,255,255,${alpha * 0.8})`)
        ctx.strokeStyle = sg
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(tx, ty)
        ctx.lineTo(cx, cy)
        ctx.stroke()

        // Ponta brilhante
        ctx.beginPath()
        ctx.arc(cx, cy, 1.5 * alpha, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.9})`
        ctx.fill()
      })

      // Lua — glow
      const { x: mx, y: my } = moonPos
      const mg = ctx.createRadialGradient(mx, my, moonR * 0.4, mx, my, moonR * 4)
      mg.addColorStop(0, 'rgba(255,240,180,0.25)')
      mg.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.beginPath()
      ctx.arc(mx, my, moonR * 4, 0, Math.PI * 2)
      ctx.fillStyle = mg
      ctx.fill()

      // Lua — corpo
      ctx.save()
      ctx.beginPath()
      ctx.arc(mx, my, moonR, 0, Math.PI * 2)
      ctx.clip()
      ctx.fillStyle = '#f0dea0'
      ctx.fillRect(mx - moonR, my - moonR, moonR * 2, moonR * 2)

      if (phaseVal < 0.47 || phaseVal > 0.53) {
        ctx.fillStyle = 'rgba(4,7,28,0.9)'
        const cx = phaseVal < 0.5
          ? mx + moonR - 2 * moonR * phaseVal * 2
          : mx - moonR + 2 * moonR * (phaseVal - 0.5) * 2
        ctx.beginPath()
        ctx.arc(cx, my, moonR * 1.1, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => cancelAnimationFrame(rafRef.current)
  }, [date, lat, lng])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  )
}