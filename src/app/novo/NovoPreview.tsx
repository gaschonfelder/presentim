'use client'

import { useState, useEffect } from 'react'
import { useNovoContext } from './NovoContext'

/**
 * Preview em tempo real do presente — renderizado na sidebar do Wizard (desktop)
 * e no modal flutuante (mobile).
 */
export default function NovoPreview() {
  const { cfg } = useNovoContext()

  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const diff = cfg.data_liberacao ? new Date(cfg.data_liberacao).getTime() - now : 0
  const passou = diff <= 0

  return (
    <div
      style={{
        background: cfg.gradiente ?? cfg.cor_fundo,
        borderRadius: 20,
        width: '100%',
        aspectRatio: '9 / 16',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        gap: 16,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Countdown ou botão */}
      {cfg.data_liberacao && !passou ? (
        <div
          style={{
            border: `2px solid ${cfg.cor_primaria}44`,
            borderRadius: 16,
            padding: '12px 20px',
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {[
            [String(Math.floor(diff / 86400000)), 'dias'],
            [String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0'), 'h'],
            [String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'), 'min'],
            [String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'), 's'],
          ].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: cfg.cor_primaria, lineHeight: 1 }}>
                {n}
              </div>
              <div style={{ fontSize: '.65rem', color: '#888' }}>{l}</div>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            background: cfg.cor_primaria,
            color: 'white',
            borderRadius: 8,
            padding: '12px 24px',
            fontSize: '1.8rem',
            boxShadow: `0 8px 24px ${cfg.cor_primaria}55`,
          }}
        >
          {cfg.emoji} {cfg.texto_botao || 'Vamos lá'}
        </div>
      )}

      {/* Fotos mini */}
      {cfg.fotos.length > 0 && (
        <div style={{ display: 'flex', gap: 6 }}>
          {cfg.fotos.slice(0, 3).map((url, i) => (
            <img
              key={i}
              src={url}
              alt=""
              style={{
                width: 56,
                height: 56,
                objectFit: 'cover',
                borderRadius: 8,
                border: '2px solid white',
                boxShadow: '0 2px 8px rgba(0,0,0,.15)',
                transform: `rotate(${[-4, 3, -2][i % 3]}deg)`,
              }}
            />
          ))}
          {cfg.fotos.length > 3 && (
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 8,
                background: 'rgba(0,0,0,.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '.8rem',
                color: '#888',
                border: '2px solid white',
              }}
            >
              +{cfg.fotos.length - 3}
            </div>
          )}
        </div>
      )}

      {/* Frases */}
      {cfg.frases.filter(Boolean).length > 0 && (
        <div style={{ textAlign: 'center' }}>
          {cfg.frases.filter(Boolean).slice(0, 3).map((f, i) => (
            <p
              key={i}
              style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: '.85rem',
                color: '#444',
                margin: '3px 0',
                lineHeight: 1.5,
              }}
            >
              {f}
            </p>
          ))}
          {cfg.frases.filter(Boolean).length > 3 && (
            <p style={{ fontSize: '.7rem', color: '#aaa', marginTop: 4 }}>
              +{cfg.frases.filter(Boolean).length - 3} frases
            </p>
          )}
        </div>
      )}

      {/* Texto final */}
      {cfg.texto_final && (
        <div
          style={{
            background: `linear-gradient(135deg, ${cfg.cor_primaria}, ${cfg.cor_primaria}bb)`,
            color: 'white',
            borderRadius: 10,
            padding: '10px 18px',
            fontSize: '.82rem',
            fontWeight: 700,
            textAlign: 'center',
            maxWidth: '90%',
          }}
        >
          {cfg.texto_final}
        </div>
      )}

      {/* Música */}
      {cfg.musica_info && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(0,0,0,.04)',
            borderRadius: 10,
            padding: '8px 12px',
            width: '90%',
          }}
        >
          <img
            src={`https://img.youtube.com/vi/${cfg.musica_info.videoId}/default.jpg`}
            alt=""
            style={{ width: 36, height: 27, borderRadius: 4, objectFit: 'cover' }}
          />
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div
              style={{
                fontSize: '.7rem',
                fontWeight: 600,
                color: '#555',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              🎵 {cfg.musica_info.title}
            </div>
          </div>
        </div>
      )}

      {/* Rodapé */}
      <p style={{ position: 'absolute', bottom: 8, fontSize: '.6rem', color: '#aaa' }}>
        Preview • {cfg.titulo || 'Seu presente'}
      </p>
    </div>
  )
}