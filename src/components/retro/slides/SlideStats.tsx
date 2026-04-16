'use client'

import { useEffect, useState } from 'react'
import { useRetro } from '../RetroProvider'
import { getDestinationForKm } from '@/lib/retro'

export default function SlideStats() {
  const { slide, stats, theme, dias, fotos, conquistasManuais, conquistasTempo, conquistasAuto, moonPhase, seasonKey } = useRetro()
  const isActive = slide === 5

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isActive) {
      const t = setTimeout(() => setVisible(true), 200)
      return () => clearTimeout(t)
    } else {
      setVisible(false)
    }
  }, [isActive])

  // ─── Cálculos das estatísticas ────────────────────────────────────────────

  // 1. Duração vs outros casais
  const percentil = stats.percentilDuracao

  // 2. Nível de vínculo
  const bond = stats.bond

  // 3. Aniversários juntos (anos completos comemorados)
  const aniversarios = Math.floor(dias / 365.25)

  // 4. Se cada dia fosse 1 km
  const destino = getDestinationForKm(dias)

  // 5. Média de filmes (1 por semana)
  const filmes = Math.floor(dias / 7)

  // 6. Média de mensagens (45/dia)
  const mensagens = dias * 45

  // 7. Conquistas desbloqueadas
  const totalConquistas = conquistasManuais.length + conquistasTempo.length + conquistasAuto.length

  // 8. Estação do começo + fase da lua (combo)
  const estacoes: Record<string, string> = {
    summer: 'Verão',
    autumn: 'Outono',
    winter: 'Inverno',
    spring: 'Primavera',
  }
  const estacaoNome = estacoes[seasonKey]

  // Lista unificada — cada item tem ícone, label curto, valor destaque, descrição
  const items = [
    {
      icon: '📊',
      label: 'Mais que',
      big: `${percentil}%`,
      desc: `dos casais duram menos que vocês`,
    },
    {
      icon: '💞',
      label: `Nível ${bond.level} · ${bond.name}`,
      big: `${bond.bar}%`,
      desc: bond.desc,
    },
    {
      icon: '🎉',
      label: 'Aniversários juntos',
      big: `${aniversarios}`,
      desc: aniversarios === 0
        ? 'Ainda não completaram 1 ano'
        : aniversarios === 1
        ? 'ano de namoro celebrado'
        : 'anos de namoro celebrados',
    },
    {
      icon: destino.emoji,
      label: 'Se cada dia fosse 1 km',
      big: `${dias.toLocaleString('pt-BR')} km`,
      desc: `vocês já chegariam em ${destino.label}`,
    },
    {
      icon: '🎬',
      label: 'Filmes assistidos juntos',
      big: `~${filmes.toLocaleString('pt-BR')}`,
      desc: 'Considerando 1 filme por semana',
    },
    {
      icon: '💬',
      label: 'Mensagens trocadas',
      big: `~${mensagens.toLocaleString('pt-BR')}`,
      desc: 'Estimativa de 45 mensagens por dia',
    },
    {
      icon: '🏆',
      label: 'Conquistas desbloqueadas',
      big: `${totalConquistas}`,
      desc: `${conquistasManuais.length} manuais · ${conquistasTempo.length} de tempo · ${conquistasAuto.length} automáticas`,
    },
    {
      icon: moonPhase.emoji,
      label: 'O começo de tudo',
      big: estacaoNome,
      desc: `${moonPhase.name} brilhava no céu`,
    },
  ]

  return (
    <div
      className={`retro-v2-slide ${isActive ? 'active' : ''}`}
      style={{
        background: theme.bg.stats,
        justifyContent: 'flex-start',
        paddingTop: 72,
        paddingBottom: 44,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
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
          textAlign: 'center',
        }}
      >
        Vocês em números
      </p>

      <h2
        className="retro-v2-anim"
        style={{
          fontFamily: "'DM Serif Display',serif",
          fontSize: 'clamp(1.8rem,7vw,2.4rem)',
          color: theme.text.primary,
          textAlign: 'center',
          lineHeight: 1.15,
          marginBottom: '1.4rem',
          animationDelay: '.15s',
        }}
      >
        Estatísticas do{' '}
        <em
          style={{
            fontStyle: 'italic',
            background: theme.accentGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          casal
        </em>
      </h2>

      <div
        style={{
          width: '100%',
          maxWidth: 360,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {items.map((s, i) => (
          <div
            key={i}
            style={{
              background: theme.statCard.bg,
              border: `1px solid ${theme.statCard.border}`,
              borderRadius: 16,
              padding: '1rem 1.1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '.9rem',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(12px)',
              transition: `all .35s ease ${Math.min(i * 0.06, 0.5)}s`,
            }}
          >
            <div
              style={{
                fontSize: '1.8rem',
                flexShrink: 0,
                width: 44,
                textAlign: 'center',
              }}
            >
              {s.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '.6rem',
                  letterSpacing: '.15em',
                  textTransform: 'uppercase',
                  color: theme.text.muted,
                  marginBottom: '.2rem',
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontFamily: "'DM Serif Display',serif",
                  fontSize: '1.35rem',
                  color: theme.text.primary,
                  lineHeight: 1.15,
                  background: theme.accentGradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  display: 'inline-block',
                }}
              >
                {s.big}
              </div>
              <div
                style={{
                  fontSize: '.72rem',
                  color: theme.text.secondary,
                  marginTop: '.2rem',
                  lineHeight: 1.4,
                }}
              >
                {s.desc}
              </div>
            </div>
          </div>
        ))}

        {/* Nota sutil no final */}
        <p
          style={{
            fontSize: '.6rem',
            color: theme.text.muted,
            textAlign: 'center',
            marginTop: '.5rem',
            padding: '0 1rem',
            opacity: visible ? 0.6 : 0,
            transition: 'opacity .5s ease .6s',
            lineHeight: 1.5,
          }}
        >
          Algumas estatísticas são estimativas baseadas em médias de casais.
        </p>
      </div>
    </div>
  )
}