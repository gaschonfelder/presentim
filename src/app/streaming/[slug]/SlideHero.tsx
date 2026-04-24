'use client'

import { useState, useEffect } from 'react'
import type { StreamingDados } from './page'
import { calcTemporadas, calcDiasJuntos } from './streaming-utils'

export default function SlideHero({
  dados,
  onPlay,
}: {
  dados: StreamingDados
  onPlay: () => void
}) {
  const temporadas = calcTemporadas(dados.data_inicio)
  const dias = calcDiasJuntos(dados.data_inicio)
  const anoInicio = new Date(dados.data_inicio).getFullYear()
  const [loaded, setLoaded] = useState(false)
  const [hover, setHover] = useState(false)
  const fotoHero = dados.fotos?.[0] || ''

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  const badgeEl = (
    <div style={{
      opacity: loaded ? 1 : 0,
      transform: loaded ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.7s ease 0.5s',
    }}>
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: 'rgba(229, 9, 20, 0.9)',
        color: '#fff',
        fontSize: '11px',
        fontFamily: "'Inter', sans-serif",
        fontWeight: 700,
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        padding: '4px 12px',
        borderRadius: '2px',
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
        {temporadas.badge}
      </span>
    </div>
  )

  const titleEl = (
    <div style={{
      marginTop: '14px',
      opacity: loaded ? 1 : 0,
      transform: loaded ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.7s ease 0.7s',
    }}>
      <h1 className="hero-title" style={{
        margin: 0,
        fontFamily: "'Bebas Neue', sans-serif",
        fontWeight: 400,
        color: '#fff',
        lineHeight: 0.92,
        letterSpacing: '2px',
      }}>
        {dados.nome1}
        <span className="hero-ampersand" style={{
          display: 'block',
          fontFamily: "'Inter', sans-serif",
          fontWeight: 400,
          color: 'rgba(255,255,255,0.5)',
          letterSpacing: '6px',
          textTransform: 'uppercase',
          margin: '4px 0 2px',
        }}>
          &amp;
        </span>
        {dados.nome2}
      </h1>
    </div>
  )

  const metaEl = (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginTop: '16px',
      fontFamily: "'Inter', sans-serif",
      flexWrap: 'wrap',
      opacity: loaded ? 1 : 0,
      transform: loaded ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.7s ease 0.9s',
    }}>
      <span style={{ color: '#fff', fontSize: '14px', fontWeight: 600 }}>
        {anoInicio}
      </span>
      <span style={{
        background: '#E50914',
        color: '#fff',
        padding: '1px 7px',
        borderRadius: '3px',
        fontSize: '12px',
        fontWeight: 700,
      }}>
        L
      </span>
      <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: 500 }}>
        {temporadas.label}
      </span>
      <span style={{
        border: '1px solid rgba(255,255,255,0.4)',
        color: 'rgba(255,255,255,0.7)',
        padding: '0px 6px',
        borderRadius: '3px',
        fontSize: '11px',
        fontWeight: 600,
      }}>
        HD
      </span>
      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
        {dias} dias
      </span>
    </div>
  )

  const playEl = (
    <div style={{
      marginTop: '20px',
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      opacity: loaded ? 1 : 0,
      transform: loaded ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.7s ease 1.1s',
    }}>
      <button
        onClick={onPlay}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          background: hover ? 'rgba(255,255,255,0.85)' : '#fff',
          color: '#000',
          border: 'none',
          borderRadius: '4px',
          padding: '12px 32px',
          fontSize: '16px',
          fontWeight: 700,
          fontFamily: "'Inter', sans-serif",
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          transform: hover ? 'scale(1.03)' : 'scale(1)',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#000">
          <polygon points="5,3 19,12 5,21" />
        </svg>
        Assistir
      </button>

      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      </div>
    </div>
  )

  const synopsisEl = dados.sinopse ? (
    <p className="hero-synopsis" style={{
      marginTop: '16px',
      fontFamily: "'Inter', sans-serif",
      fontSize: '14px',
      lineHeight: 1.6,
      color: 'rgba(255,255,255,0.75)',
      maxWidth: '480px',
      opacity: loaded ? 1 : 0,
      transform: loaded ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.7s ease 1.3s',
    }}>
      {dados.sinopse}
    </p>
  ) : null

  const genreEl = (
    <div className="hero-genre" style={{
      opacity: loaded ? 1 : 0,
      transition: 'opacity 0.7s ease 1.5s',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.15)',
        borderLeft: '2px solid rgba(255,255,255,0.4)',
        padding: '6px 20px 6px 12px',
        fontSize: '13px',
        fontFamily: "'Inter', sans-serif",
        color: 'rgba(255,255,255,0.7)',
        fontWeight: 500,
      }}>
        Romance
      </div>
    </div>
  )

  return (
    <>
      <style>{`
        .hero-container {
          width: 100%;
          min-height: 100dvh;
          background: #000;
          position: relative;
          overflow: hidden;
        }
        @media (min-width: 769px) {
          .hero-container { display: block; }
          .hero-photo {
            position: absolute; inset: 0;
            background-size: cover; background-position: center 30%;
            transform: scale(1.02);
          }
          .hero-overlay-v {
            position: absolute; inset: 0;
            background: linear-gradient(0deg, #000 0%, rgba(0,0,0,0.85) 25%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 70%, rgba(0,0,0,0.4) 100%);
          }
          .hero-overlay-h {
            position: absolute; inset: 0;
            background: linear-gradient(90deg, rgba(0,0,0,0.7) 0%, transparent 50%);
          }
          .hero-content {
            position: absolute; bottom: 0; left: 0; right: 0;
            padding: 0 24px 48px; z-index: 10;
            display: flex; flex-direction: column;
          }
          .hero-genre { position: absolute; bottom: 48px; right: 0; z-index: 10; }
          .hero-title { font-size: clamp(48px, 12vw, 86px); }
          .hero-ampersand { font-size: clamp(18px, 4vw, 28px); }
          .hero-vignette-top {
            position: absolute; top: 0; left: 0; right: 0; height: 80px;
            background: linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 100%);
            z-index: 5;
          }
          .hero-photo-mobile { display: none; }
        }
        @media (max-width: 768px) {
          .hero-container { display: flex; flex-direction: column; min-height: 100dvh; }
          .hero-photo, .hero-overlay-v, .hero-overlay-h, .hero-vignette-top { display: none; }
          .hero-photo-mobile {
            display: block; width: 100%; height: 55dvh;
            position: relative; overflow: hidden; flex-shrink: 0;
          }
          .hero-photo-mobile-img {
            width: 100%; height: 100%;
            background-size: cover; background-position: center;
            transform: scale(1.02);
          }
          .hero-photo-mobile-gradient {
            position: absolute; bottom: 0; left: 0; right: 0; height: 120px;
            background: linear-gradient(0deg, #000 0%, transparent 100%);
          }
          .hero-photo-mobile-logo {
            position: absolute; top: 16px; left: 20px;
            color: #E50914; font-size: 28px;
            font-family: 'Bebas Neue', sans-serif;
            letter-spacing: 2px; z-index: 2;
          }
          .hero-content {
            position: relative; padding: 0 20px 32px; z-index: 10;
            display: flex; flex-direction: column; flex: 1; margin-top: -24px;
          }
          .hero-genre { margin-top: 20px; align-self: flex-start; }
          .hero-title { font-size: 52px; }
          .hero-ampersand { font-size: 18px; }
          .hero-synopsis { font-size: 13px !important; }
        }
        @media (max-width: 380px) { .hero-title { font-size: 44px; } }
        @media (max-width: 768px) { .hero-desktop-logo { display: none; } }
        @media (min-width: 769px) { .hero-photo-mobile-logo { display: none; } }
      `}</style>

      <div className="hero-container">
        {fotoHero && (
          <div className="hero-photo" style={{
            backgroundImage: `url(${fotoHero})`,
            opacity: loaded ? 1 : 0,
            transition: 'opacity 1.2s ease',
          }} />
        )}
        <div className="hero-overlay-v" />
        <div className="hero-overlay-h" />
        <div className="hero-vignette-top" />

        <div className="hero-photo-mobile">
          <div className="hero-photo-mobile-logo">P</div>
          {fotoHero && (
            <div className="hero-photo-mobile-img" style={{
              backgroundImage: `url(${fotoHero})`,
              opacity: loaded ? 1 : 0,
              transition: 'opacity 1.2s ease',
            }} />
          )}
          <div className="hero-photo-mobile-gradient" />
        </div>

        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          padding: '20px 24px', display: 'flex', alignItems: 'center',
          zIndex: 10, opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'all 0.8s ease 0.3s',
        }}>
          <div className="hero-desktop-logo" style={{
            color: '#E50914', fontSize: '32px',
            fontFamily: "'Bebas Neue', sans-serif",
            letterSpacing: '2px', fontWeight: 400, userSelect: 'none',
          }}>P</div>
        </div>

        <div className="hero-content">
          {badgeEl}
          {titleEl}
          {metaEl}
          {playEl}
          {synopsisEl}
          {genreEl}
        </div>

        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '3px', background: 'rgba(255,255,255,0.1)', zIndex: 15,
        }}>
          <div style={{
            height: '100%', width: loaded ? '15%' : '0%',
            background: '#E50914', transition: 'width 2s ease 1s',
            borderRadius: '0 2px 2px 0',
          }} />
        </div>
      </div>
    </>
  )
}