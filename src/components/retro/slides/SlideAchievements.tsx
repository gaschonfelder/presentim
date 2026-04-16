'use client'

import { useEffect, useState } from 'react'
import { useRetro } from '../RetroProvider'
import { RARITY_CONFIG, type Rarity } from '@/lib/retro'
import AchievementModal, { type AchievementDetail } from '../AchievementModal'

export default function SlideAchievements() {
  const { slide, allAchievements, theme } = useRetro()
  const isActive = slide === 6

  const [visible, setVisible] = useState(false)
  const [selected, setSelected] = useState<AchievementDetail | null>(null)

  useEffect(() => {
    if (isActive) {
      const t = setTimeout(() => setVisible(true), 200)
      return () => clearTimeout(t)
    } else {
      setVisible(false)
      setSelected(null)
    }
  }, [isActive])

  // Exibe todas as conquistas — scroll vertical quando ultrapassa o container
  const all = allAchievements

  /** Normaliza qualquer item pro formato do modal */
  function itemToDetail(item: (typeof allAchievements)[number]): AchievementDetail {
    if (item.tipo === 'tempo') {
      const medalRarityMap: Record<string, Rarity> = {
        bronze: 'comum',
        silver: 'incomum',
        gold: 'raro',
        trophy: 'raro',
        diamond: 'epico',
        crown: 'lendario',
      }
      return {
        icon: item.data.icon,
        label: item.data.name,
        desc: item.data.desc,
        rarity: medalRarityMap[item.data.medal] ?? 'raro',
        kind: 'tempo',
      }
    }
    if (item.tipo === 'manual') {
      return {
        icon: item.info.icon,
        label: item.info.label,
        desc: 'Momento especial do relacionamento que vocês escolheram registrar.',
        rarity: item.info.rarity,
        kind: 'manual',
      }
    }
    return {
      icon: item.data.icon,
      label: item.data.label,
      desc: item.data.desc,
      rarity: item.data.rarity,
      kind: 'auto',
    }
  }

  return (
    <div
      className={`retro-v2-slide ${isActive ? 'active' : ''}`}
      style={{
        background: theme.bg.achievements,
        overflowY: 'auto',
        justifyContent: 'flex-start',
        paddingTop: 72,
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
          marginBottom: '.5rem',
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

      <p
        className="retro-v2-anim"
        style={{
          fontSize: '.7rem',
          color: theme.text.muted,
          textAlign: 'center',
          marginBottom: '1.2rem',
          animationDelay: '.25s',
        }}
      >
        Toque em qualquer conquista pra ver os detalhes
      </p>

      {all.length === 0 ? (
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
            gap: 8,
            paddingBottom: '1rem',
          }}
        >
          {all.map((item, i) => {
            const detail = itemToDetail(item)
            return (
              <AchievementCard
                key={`${item.tipo}-${i}`}
                detail={detail}
                index={i}
                visible={visible}
                onClick={() => setSelected(detail)}
              />
            )
          })}

          <div
            style={{
              textAlign: 'center',
              fontSize: '.65rem',
              color: theme.text.muted,
              marginTop: '.5rem',
              opacity: visible ? 0.7 : 0,
              transition: 'opacity .4s ease .6s',
            }}
          >
            {all.length} conquista{all.length !== 1 ? 's' : ''} desbloqueada
            {all.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {/* Modal */}
      <AchievementModal
        detail={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  )
}

// ─── Card compacto ────────────────────────────────────────────────────────────

function AchievementCard({
  detail,
  index,
  visible,
  onClick,
}: {
  detail: AchievementDetail
  index: number
  visible: boolean
  onClick: () => void
}) {
  const { theme } = useRetro()
  const rc = RARITY_CONFIG[detail.rarity]

  // Cores de borda/fundo por raridade
  const borderMap: Record<Rarity, string> = {
    comum: theme.achievementCard.border,
    incomum: 'rgba(80,160,255,.35)',
    raro: 'rgba(180,80,255,.4)',
    epico: 'rgba(255,190,30,.45)',
    lendario: 'rgba(248,87,166,.55)',
  }
  const bgMap: Record<Rarity, string> = {
    comum: theme.achievementCard.bg,
    incomum: 'rgba(20,60,160,.18)',
    raro: 'rgba(100,30,180,.22)',
    epico: 'rgba(140,90,0,.25)',
    lendario: 'rgba(120,0,60,.3)',
  }

  const isHighlight = detail.rarity === 'lendario' || detail.rarity === 'epico'

  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '.7rem',
        background: bgMap[detail.rarity],
        border: `1px solid ${borderMap[detail.rarity]}`,
        borderRadius: 12,
        padding: '.7rem .9rem',
        width: '100%',
        textAlign: 'left',
        cursor: 'pointer',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: `all .35s ease ${Math.min(index * 0.08, 0.5)}s`,
        boxShadow:
          detail.rarity === 'lendario'
            ? '0 0 12px rgba(248,87,166,.2)'
            : detail.rarity === 'epico'
            ? '0 0 8px rgba(255,190,30,.15)'
            : 'none',
      }}
    >
      <span
        style={{
          fontSize: isHighlight ? '1.5rem' : '1.3rem',
          flexShrink: 0,
          filter:
            detail.rarity === 'lendario'
              ? 'drop-shadow(0 0 6px rgba(248,87,166,.8))'
              : detail.rarity === 'epico'
              ? 'drop-shadow(0 0 4px rgba(255,200,50,.6))'
              : detail.rarity === 'raro'
              ? 'drop-shadow(0 0 3px rgba(180,80,255,.4))'
              : 'none',
        }}
      >
        {detail.icon}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '.88rem',
            fontWeight: isHighlight ? 600 : 500,
            color: isHighlight ? rc.color : theme.text.primary,
            textShadow: detail.rarity === 'lendario' ? `0 0 10px ${rc.color}` : 'none',
          }}
        >
          {detail.label}
        </div>
      </div>
      <span
        style={{
          fontSize: '.9rem',
          color: theme.text.muted,
          flexShrink: 0,
        }}
      >
        ›
      </span>
    </button>
  )
}