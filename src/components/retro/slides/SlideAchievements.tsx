'use client'

import { useEffect, useState } from 'react'
import { useRetro } from '../RetroProvider'
import { RARITY_CONFIG, type Rarity } from '@/lib/retro'

export default function SlideAchievements() {
  const { slide, allAchievements, theme } = useRetro()
  const isActive = slide === 6

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isActive) {
      const t = setTimeout(() => setVisible(true), 300)
      return () => clearTimeout(t)
    } else {
      setVisible(false)
    }
  }, [isActive])

  // Top 6 (já vem ordenado por raridade no provider)
  const top6 = allAchievements.slice(0, 6)
  const hidden = allAchievements.length - top6.length

  return (
    <div
      className={`retro-v2-slide ${isActive ? 'active' : ''}`}
      style={{
        background: theme.bg.achievements,
        overflowY: 'auto',
        justifyContent: 'flex-start',
        paddingTop: 80,
      }}
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
        Conquistas desbloqueadas
      </p>

      <h2
        className="retro-v2-anim"
        style={{
          fontFamily: "'DM Serif Display',serif",
          fontSize: '2rem',
          color: theme.text.primary,
          textAlign: 'center',
          lineHeight: 1.12,
          marginBottom: '1.2rem',
          animationDelay: '.15s',
        }}
      >
        Nossa{' '}
        <em
          style={{
            fontStyle: 'italic',
            background: theme.accentGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          jornada
        </em>
      </h2>

      {top6.length === 0 ? (
        <p
          className="retro-v2-anim"
          style={{
            fontSize: '.85rem',
            color: theme.text.muted,
            textAlign: 'center',
          }}
        >
          Vocês estão no começo da jornada ❤️
        </p>
      ) : (
        <div
          style={{
            width: '100%',
            maxWidth: 340,
            display: 'flex',
            flexDirection: 'column',
            gap: 9,
          }}
        >
          {top6.map((item, i) => (
            <AchievementRow
              key={`${item.tipo}-${i}`}
              item={item}
              index={i}
              visible={visible}
            />
          ))}

          {hidden > 0 && (
            <div
              style={{
                textAlign: 'center',
                fontSize: '.7rem',
                color: theme.text.muted,
                marginTop: 4,
                opacity: visible ? 1 : 0,
                transition: 'opacity .4s ease .6s',
              }}
            >
              +{hidden} conquista{hidden !== 1 ? 's' : ''} desbloqueada
              {hidden !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Item individual ──────────────────────────────────────────────────────────

type RowProps = {
  item: ReturnType<typeof useRetro>['allAchievements'][number]
  index: number
  visible: boolean
}

function AchievementRow({ item, index, visible }: RowProps) {
  const { theme } = useRetro()

  // Conquista de tempo
  if (item.tipo === 'tempo') {
    const a = item.data
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '.8rem',
          background: theme.achievementCard.bg,
          border: `1px solid ${theme.achievementCard.border}`,
          borderRadius: 14,
          padding: '.7rem 1rem',
          width: '100%',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateX(0)' : 'translateX(-20px)',
          transition: `all .4s ease ${index * 0.08}s`,
        }}
      >
        <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>{a.icon}</span>
        <div>
          <div
            style={{
              fontSize: '.85rem',
              fontWeight: 600,
              color: theme.text.primary,
              ...(a.medal === 'crown' && {
                background: 'linear-gradient(135deg,#ffd700,#ffa726)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }),
              ...(a.medal === 'diamond' && {
                background: 'linear-gradient(135deg,#a8edea,#fed6e3)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }),
              ...(a.medal === 'trophy' && {
                background: 'linear-gradient(135deg,#f857a6,#ffa726)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }),
            }}
          >
            {a.name}
          </div>
          <div
            style={{
              fontSize: '.68rem',
              color: theme.text.muted,
              marginTop: '.1rem',
              lineHeight: 1.4,
            }}
          >
            {a.desc}
          </div>
        </div>
      </div>
    )
  }

  // Conquista manual (selecionada pelo usuário no wizard)
  if (item.tipo === 'manual') {
    return (
      <RarityCard
        icon={item.info.icon}
        label={item.info.label}
        rarity={item.info.rarity}
        index={index}
        visible={visible}
      />
    )
  }

  // Conquista automática (gerada)
  return (
    <RarityCard
      icon={item.data.icon}
      label={item.data.label}
      desc={item.data.desc}
      rarity={item.data.rarity}
      index={index}
      visible={visible}
      isAuto
    />
  )
}

// ─── Card com estilo por raridade ─────────────────────────────────────────────

function RarityCard({
  icon,
  label,
  desc,
  rarity,
  index,
  visible,
  isAuto,
}: {
  icon: string
  label: string
  desc?: string
  rarity: Rarity
  index: number
  visible: boolean
  isAuto?: boolean
}) {
  const { theme } = useRetro()
  const rc = RARITY_CONFIG[rarity]
  const isHighlight = rarity === 'lendario' || rarity === 'epico'

  const bgByRarity: Record<Rarity, string> = {
    comum: theme.achievementCard.bg,
    incomum: 'rgba(20,60,160,.25)',
    raro: 'rgba(100,30,180,.25)',
    epico: 'rgba(140,90,0,.3)',
    lendario: 'rgba(120,0,60,.35)',
  }
  const borderByRarity: Record<Rarity, string> = {
    comum: theme.achievementCard.border,
    incomum: 'rgba(80,160,255,.25)',
    raro: 'rgba(180,80,255,.3)',
    epico: 'rgba(255,190,30,.4)',
    lendario: 'rgba(248,87,166,.5)',
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '.6rem',
        background: bgByRarity[rarity],
        border: `1px solid ${borderByRarity[rarity]}`,
        borderRadius: 12,
        padding: '.55rem .8rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: rarity === 'lendario' ? '0 0 12px rgba(248,87,166,.2)' : 'none',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(14px)',
        transition: `all .35s ease ${index * 0.08}s`,
      }}
    >
      <span
        style={{
          fontSize: isHighlight ? '1.4rem' : '1.2rem',
          filter:
            rarity === 'lendario'
              ? 'drop-shadow(0 0 6px rgba(248,87,166,.8))'
              : rarity === 'epico'
              ? 'drop-shadow(0 0 4px rgba(255,200,50,.6))'
              : rarity === 'raro'
              ? 'drop-shadow(0 0 3px rgba(180,80,255,.4))'
              : 'none',
        }}
      >
        {icon}
      </span>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: '.85rem',
            fontWeight: isHighlight ? 600 : 400,
            color: isHighlight ? rc.color : theme.text.primary,
            textShadow: rarity === 'lendario' ? `0 0 10px ${rc.color}` : 'none',
          }}
        >
          {label}
        </div>
        {isHighlight && (
          <div
            style={{
              fontSize: '.6rem',
              color: rc.color,
              opacity: 0.7,
              marginTop: 2,
              letterSpacing: '.1em',
            }}
          >
            {rc.label}
            {isAuto && ' · AUTO'}
          </div>
        )}
        {!isHighlight && isAuto && desc && (
          <div
            style={{
              fontSize: '.65rem',
              color: theme.text.muted,
              marginTop: 2,
              lineHeight: 1.3,
            }}
          >
            {desc}
          </div>
        )}
      </div>
    </div>
  )
}