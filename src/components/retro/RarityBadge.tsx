'use client'

import { RARITY_CONFIG, type Rarity } from '@/lib/retro'

type Props = {
  rarity: Rarity
  icon: string
  label: string
  mounted: boolean
}

export default function RarityBadge({ rarity, icon, label, mounted }: Props) {
  const rc = RARITY_CONFIG[rarity]

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '52px 1rem .8rem',
        background:
          'linear-gradient(to bottom, rgba(0,0,0,.85) 0%, rgba(0,0,0,.5) 60%, transparent 100%)',
        display: 'flex',
        alignItems: 'center',
        gap: '.65rem',
        animation: mounted ? 'badgeIn .4s ease forwards' : 'none',
        zIndex: 3,
      }}
    >
      {(rarity === 'epico' || rarity === 'lendario') && (
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: rc.glow,
            filter: `blur(${rc.glowSize})`,
            pointerEvents: 'none',
          }}
        />
      )}
      <span
        style={{
          fontSize: '1.5rem',
          position: 'relative',
          zIndex: 1,
          filter:
            rarity === 'lendario'
              ? 'drop-shadow(0 0 8px rgba(248,87,166,.9))'
              : rarity === 'epico'
              ? 'drop-shadow(0 0 6px rgba(255,200,50,.8))'
              : rarity === 'raro'
              ? 'drop-shadow(0 0 4px rgba(180,80,255,.6))'
              : 'none',
        }}
      >
        {icon}
      </span>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            fontSize: '.55rem',
            letterSpacing: '.2em',
            textTransform: 'uppercase',
            color: rc.color,
            textShadow: rarity !== 'comum' ? `0 0 10px ${rc.color}` : 'none',
            marginBottom: '.15rem',
            animation: rc.shimmer && mounted ? 'shimmerText 2s ease-in-out infinite' : 'none',
          }}
        >
          {rc.label} · conquista desbloqueada
        </div>
        <div
          style={{
            fontFamily: "'DM Serif Display',serif",
            fontSize: '.95rem',
            color: 'white',
            lineHeight: 1.2,
          }}
        >
          {label}
        </div>
      </div>

      {/* Partículas apenas para lendário */}
      {rc.particles &&
        mounted &&
        Array.from({ length: 6 }).map((_, i) => {
          const seed = Math.sin(i + 1) * 43758.5453
          const rand = seed - Math.floor(seed)
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${15 + i * 15}%`,
                top: `${40 + rand * 30}%`,
                width: 3,
                height: 3,
                borderRadius: '50%',
                background: 'rgba(248,87,166,.9)',
                boxShadow: '0 0 4px rgba(248,87,166,1)',
                animation: `particle ${1.5 + rand}s ease-out infinite`,
                animationDelay: `${rand * 0.8}s`,
                pointerEvents: 'none',
              }}
            />
          )
        })}
    </div>
  )
}