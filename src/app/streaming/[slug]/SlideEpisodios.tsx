'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { StreamingDados } from './page'
import { calcTemporadas } from './streaming-utils'

export default function SlideEpisodios({
  dados,
  onNext,
}: {
  dados: StreamingDados
  onNext: () => void
}) {
  const temporadas = calcTemporadas(dados.data_inicio)
  const [loaded, setLoaded] = useState(false)
  const [modalIdx, setModalIdx] = useState<number | null>(null)

  // Swipe refs for modal
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const swiping = useRef(false)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  const fotos = dados.fotos || []
  const titulos = dados.fotos_titulos || []
  // Descrições por foto — usa fotos_descricoes se existir, senão vazio
  const descricoes = (dados as any).fotos_descricoes || []
  const fotoHero = fotos[0] || ''

  // ── Carrossel circular: ao passar do último, volta ao primeiro e vice-versa ──
  const goToSlide = useCallback((idx: number) => {
    if (fotos.length === 0) return
    // Wrap around: circular
    const wrapped = ((idx % fotos.length) + fotos.length) % fotos.length
    setModalIdx(wrapped)
  }, [fotos.length])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchEndX.current = e.touches[0].clientX
    swiping.current = true
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!swiping.current || modalIdx === null) return
    swiping.current = false
    const diff = touchStartX.current - touchEndX.current
    const threshold = 50
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swipe left → próxima (circular)
        goToSlide(modalIdx + 1)
      } else {
        // Swipe right → anterior (circular)
        goToSlide(modalIdx - 1)
      }
    }
  }

  return (
    <>
      <style>{`
        .ep-container {
          width: 100%;
          min-height: 100dvh;
          background: #181818;
          color: #fff;
          font-family: 'Inter', sans-serif;
          padding-bottom: 40px;
        }

        /* Hero banner no topo */
        .ep-hero {
          width: 100%;
          height: 240px;
          position: relative;
          overflow: hidden;
        }
        .ep-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 0.8s ease;
        }
        .ep-hero-img.visible { opacity: 1; }
        .ep-hero-gradient {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 100px;
          background: linear-gradient(0deg, #181818 0%, transparent 100%);
        }
        .ep-hero-title {
          position: absolute;
          bottom: 16px; left: 24px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          font-weight: 400;
          letter-spacing: 1px;
          color: #fff;
          z-index: 2;
        }

        .ep-header {
          padding: 8px 24px 0;
          opacity: 0;
          transform: translateY(15px);
          transition: all 0.6s ease 0.2s;
        }
        .ep-header.visible { opacity: 1; transform: translateY(0); }
        .ep-header-title {
          font-size: 22px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 4px;
        }
        .ep-header-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          margin-bottom: 20px;
        }
        .ep-header-badge {
          background: #E50914;
          color: #fff;
          padding: 1px 6px;
          border-radius: 3px;
          font-size: 11px;
          font-weight: 700;
        }
        .ep-divider {
          height: 1px;
          background: rgba(255,255,255,0.1);
          margin: 0 24px 16px;
        }
        .ep-season-label {
          font-size: 14px;
          font-weight: 600;
          color: rgba(255,255,255,0.7);
          padding: 0 24px;
          margin-bottom: 16px;
        }
        .ep-list {
          display: flex;
          flex-direction: column;
        }
        .ep-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          opacity: 0;
          transform: translateY(12px);
          transition: all 0.5s ease;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }
        .ep-item.visible { opacity: 1; transform: translateY(0); }
        .ep-item:hover { background: rgba(255,255,255,0.05); }
        .ep-item:active { background: rgba(255,255,255,0.08); }
        .ep-num {
          font-size: 22px;
          font-weight: 500;
          color: rgba(255,255,255,0.4);
          min-width: 28px;
          text-align: center;
          padding-top: 8px;
          flex-shrink: 0;
        }
        .ep-thumb {
          width: 130px;
          height: 73px;
          border-radius: 4px;
          object-fit: cover;
          background: #2a2a2a;
          flex-shrink: 0;
        }
        .ep-info { flex: 1; min-width: 0; }
        .ep-title-text {
          font-size: 15px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 4px;
          line-height: 1.3;
        }
        .ep-desc {
          font-size: 12px;
          color: rgba(255,255,255,0.45);
          line-height: 1.5;
        }
        .ep-next-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin: 32px 24px 0;
          padding: 14px 32px;
          background: rgba(255,255,255,0.1);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 4px;
          font-size: 15px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
          -webkit-tap-highlight-color: transparent;
          width: calc(100% - 48px);
        }
        .ep-next-btn:hover { background: rgba(255,255,255,0.15); }

        /* ===== Modal carousel ===== */
        .ep-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.92);
          z-index: 9000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }
        .ep-modal-overlay.visible { opacity: 1; }

        .ep-modal {
          background: #1a1a1a;
          border-radius: 8px;
          overflow: hidden;
          max-width: 1000px;
          width: calc(100% - 40px);
          max-height: calc(100dvh - 80px);
          display: flex;
          flex-direction: column;
          transform: scale(0.95);
          transition: transform 0.3s ease;
          position: relative;
        }
        .ep-modal-overlay.visible .ep-modal { transform: scale(1); }

        .ep-modal-img-wrapper {
          width: 100%;
          overflow: hidden;
          position: relative;
        }
        .ep-modal-img {
          width: 100%;
          aspect-ratio: 7/4;
          object-fit: cover;
          display: block;
          transition: opacity 0.25s ease;
        }

        .ep-modal-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .ep-modal-ep {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .ep-modal-title {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
        }
        .ep-modal-msg {
          font-size: 14px;
          line-height: 1.7;
          color: rgba(255,255,255,0.7);
          margin-top: 4px;
        }
        .ep-modal-close {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(0,0,0,0.6);
          border: none;
          color: #fff;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          -webkit-tap-highlight-color: transparent;
          backdrop-filter: blur(4px);
        }
        .ep-modal-close:hover { background: rgba(0,0,0,0.9); }

        /* Nav arrows no modal (desktop) — sempre visíveis (circular) */
        .ep-modal-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(0,0,0,0.5);
          border: none;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          -webkit-tap-highlight-color: transparent;
          backdrop-filter: blur(4px);
          transition: all 0.2s ease;
        }
        .ep-modal-nav:hover { background: rgba(0,0,0,0.8); }
        .ep-modal-nav.prev { left: 10px; }
        .ep-modal-nav.next { right: 10px; }

        /* Dots no modal */
        .ep-modal-dots {
          display: flex;
          justify-content: center;
          gap: 5px;
          padding: 12px 0 0;
        }
        .ep-modal-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.25);
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.3s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .ep-modal-dot.active {
          background: #E50914;
          width: 16px;
          border-radius: 3px;
        }

        @media (max-width: 480px) {
          .ep-hero { height: 200px; }
          .ep-hero-title { font-size: 24px; }
          .ep-thumb { width: 110px; height: 62px; }
          .ep-num { font-size: 18px; min-width: 22px; }
          .ep-title-text { font-size: 14px; }
          .ep-header-title { font-size: 20px; }
          .ep-modal-img { aspect-ratio: 3/4;}

          .ep-modal {
            width: calc(100% - 24px);
            max-height: calc(100dvh - 40px);
            border-radius: 10px;
          }
          .ep-modal-nav { display: none; }
        }
        @media (max-width: 360px) {
          .ep-thumb { width: 90px; height: 51px; }
        }
      `}</style>

      <div className="ep-container">
        {/* Hero banner */}
        {fotoHero && (
          <div className="ep-hero">
            <img
              className={`ep-hero-img ${loaded ? 'visible' : ''}`}
              src={fotoHero}
              alt={`${dados.nome1} & ${dados.nome2}`}
            />
            <div className="ep-hero-gradient" />
            <div className="ep-hero-title">
              {dados.nome1} & {dados.nome2}
            </div>
          </div>
        )}

        {/* Header */}
        <div className={`ep-header ${loaded ? 'visible' : ''}`}>
          <div className="ep-header-title">Episódios</div>
          <div className="ep-header-meta">
            <span>Temporada 1</span>
            <span className="ep-header-badge">L</span>
            <span>{temporadas.label}</span>
          </div>
        </div>

        <div className="ep-divider" />

        <div className="ep-season-label">
          Temporada 1
        </div>

        {/* Episodes list */}
        <div className="ep-list">
          {fotos.map((foto, idx) => {
            const titulo = titulos[idx] || `Episódio ${idx + 1}`
            const descricao = descricoes[idx] || ''
            return (
              <div
                key={idx}
                className={`ep-item ${loaded ? 'visible' : ''}`}
                style={{ transitionDelay: `${0.3 + idx * 0.1}s` }}
                onClick={() => setModalIdx(idx)}
              >
                <div className="ep-num">{idx + 1}</div>
                <img
                  className="ep-thumb"
                  src={foto}
                  alt={titulo}
                  loading="lazy"
                />
                <div className="ep-info">
                  <div className="ep-title-text">{titulo}</div>
                  <div className="ep-desc">
                    {descricao || `S1:E${idx + 1}`}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Next button */}
        <button className="ep-next-btn" onClick={onNext}>
          Próximo episódio
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9,18 15,12 9,6" />
          </svg>
        </button>
      </div>

      {/* Modal com carousel circular + swipe */}
      {modalIdx !== null && (
        <div
          className={`ep-modal-overlay ${modalIdx !== null ? 'visible' : ''}`}
          onClick={() => setModalIdx(null)}
        >
          <div
            className="ep-modal"
            onClick={e => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <button className="ep-modal-close" onClick={() => setModalIdx(null)}>
              ✕
            </button>

            {/* Setas (visíveis só no desktop) — sempre ativas (circular) */}
            <button
              className="ep-modal-nav prev"
              onClick={() => goToSlide(modalIdx - 1)}
              aria-label="Anterior"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15,18 9,12 15,6" />
              </svg>
            </button>
            <button
              className="ep-modal-nav next"
              onClick={() => goToSlide(modalIdx + 1)}
              aria-label="Próximo"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9,18 15,12 9,6" />
              </svg>
            </button>

            <div className="ep-modal-img-wrapper">
              <img
                className="ep-modal-img"
                src={fotos[modalIdx]}
                alt={titulos[modalIdx] || `Episódio ${modalIdx + 1}`}
              />
            </div>

            <div className="ep-modal-body">
              <div className="ep-modal-ep">S1:E{modalIdx + 1}</div>
              <div className="ep-modal-title">
                {titulos[modalIdx] || `Episódio ${modalIdx + 1}`}
              </div>
              <div className="ep-modal-msg">
                {descricoes[modalIdx] || `Um momento especial de ${dados.nome1} & ${dados.nome2}.`}
              </div>

              {/* Dots */}
              <div className="ep-modal-dots">
                {fotos.map((_, idx) => (
                  <button
                    key={idx}
                    className={`ep-modal-dot ${idx === modalIdx ? 'active' : ''}`}
                    onClick={() => goToSlide(idx)}
                    aria-label={`Episódio ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}