'use client'

import { useRetro } from '../RetroProvider'

export default function SlideEnd() {
  const { slide, nome1, nome2, theme } = useRetro()
  const isActive = slide === 8

  function onShareLink(e: React.MouseEvent) {
    e.stopPropagation()
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: `${nome1} & ${nome2}`,
        text: '💕 Veja nossa retrospectiva!',
        url: window.location.href,
      })
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copiado! 💕')
    }
  }

  return (
    <div
      className={`retro-v2-slide ${isActive ? 'active' : ''}`}
      style={{ background: theme.bg.end }}
    >
      {/* Círculo pulsante */}
      <div
        className="retro-v2-anim"
        style={{
          width: 130,
          height: 130,
          borderRadius: '50%',
          background: theme.accentGradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem',
          animation: 'retroSlideUp .6s forwards, endpulse 2.5s ease-in-out infinite 1s',
        }}
      >
        <div
          style={{
            width: 110,
            height: 110,
            borderRadius: '50%',
            background: theme.bg.end.includes('fff') ? '#ffffff' : '#07071a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3.2rem',
          }}
        >
          ❤️
        </div>
      </div>

      <h1
        className="retro-v2-anim"
        style={{
          fontFamily: "'DM Serif Display',serif",
          fontSize: '2rem',
          color: theme.text.primary,
          textAlign: 'center',
          marginBottom: '.5rem',
          animationDelay: '.2s',
        }}
      >
        Para sempre,
        <br />
        {nome1} & {nome2}
      </h1>

      <p
        className="retro-v2-anim"
        style={{
          fontSize: '.85rem',
          color: theme.text.muted,
          textAlign: 'center',
          fontWeight: 300,
          maxWidth: 260,
          lineHeight: 1.65,
          marginBottom: '1.5rem',
          animationDelay: '.35s',
        }}
      >
        Que essa história continue sendo escrita todos os dias.
      </p>

      <div
        className="retro-v2-anim"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          alignItems: 'center',
          width: '100%',
          maxWidth: 280,
          animationDelay: '.5s',
        }}
      >
        {/* Placeholder: botão Stories virá na Fase 5 */}
        <button
          disabled
          style={{
            width: '100%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '.5rem',
            background: theme.accentGradient,
            border: 'none',
            borderRadius: 50,
            color: 'white',
            fontFamily: "'DM Sans',sans-serif",
            fontSize: '.9rem',
            fontWeight: 600,
            padding: '.9rem 2rem',
            cursor: 'not-allowed',
            opacity: 0.6,
            boxShadow: `0 8px 28px ${theme.accent}55`,
          }}
        >
          📲 Salvar para Stories (em breve)
        </button>

        <button
          onClick={onShareLink}
          style={{
            width: '100%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '.5rem',
            background: theme.chip.bg,
            border: `1px solid ${theme.chip.border}`,
            borderRadius: 50,
            color: theme.text.secondary,
            fontFamily: "'DM Sans',sans-serif",
            fontSize: '.85rem',
            fontWeight: 500,
            padding: '.75rem 2rem',
            cursor: 'pointer',
          }}
        >
          🔗 Compartilhar link
        </button>
      </div>

      <style>{`
        @keyframes endpulse {
          0%,100% { transform: scale(1) }
          50% { transform: scale(1.06) }
        }
      `}</style>
    </div>
  )
}