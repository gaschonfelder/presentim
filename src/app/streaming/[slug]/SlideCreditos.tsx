'use client'

import { useState, useEffect } from 'react'
import type { StreamingDados } from './page'

// ─── Component ────────────────────────────────────────────────────────────────

export default function SlideCreditos({
  dados,
  onNext,
}: {
  dados: StreamingDados
  onNext: () => void
}) {
  const [phase, setPhase] = useState(0)
  // 0 = nada, 1 = foto, 2 = eyebrow, 3 = mensagem, 4 = assinatura, 5 = botão

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2000),
      setTimeout(() => setPhase(4), 3200),
      setTimeout(() => setPhase(5), 4200),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const foto = dados.fotos?.[0] ?? null
  const msgFinal = dados.msg_final ?? ''
  const nome1 = dados.nome1 ?? ''
  const nome2 = dados.nome2 ?? ''

  return (
    <>
      <style>{`
        .cr-wrap {
          width:100%; min-height:100dvh; background:#0a0a0a; color:#fff;
          font-family:'Inter',sans-serif;
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          position:relative; overflow:hidden;
          padding:40px 24px;
        }

        /* ── Ambient ─────────────────────────────────────────────────── */
        .cr-bg-glow {
          position:absolute; inset:0; pointer-events:none;
          background:radial-gradient(ellipse at 50% 30%, rgba(229,9,20,.05) 0%, transparent 60%);
        }
        .cr-vignette {
          position:absolute; inset:0; pointer-events:none;
          background:radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,.6) 100%);
        }

        /* ── Foto ────────────────────────────────────────────────────── */
        .cr-photo-wrap {
          position:relative; width:180px; height:180px;
          margin-bottom:28px; flex-shrink:0;
          opacity:0; transform:scale(.85);
          transition:all 1s cubic-bezier(.4,0,.2,1);
        }
        .cr-photo-wrap.v { opacity:1; transform:scale(1); }

        .cr-photo-frame {
          position:relative; width:100%; height:100%;
          border-radius:50%; overflow:hidden;
          box-shadow:
            0 0 0 2px rgba(229,9,20,.3),
            0 0 40px rgba(229,9,20,.12),
            0 20px 60px rgba(0,0,0,.5);
        }
        .cr-photo-frame::after {
          content:''; position:absolute; inset:0;
          border-radius:50%;
          border:1.5px solid rgba(255,255,255,.1);
          pointer-events:none;
        }

        .cr-photo {
          width:100%; height:100%; object-fit:cover;
          filter:brightness(.95) contrast(1.05);
        }

        /* ring glow animado */
        .cr-photo-ring {
          position:absolute; inset:-4px;
          border-radius:50%;
          border:1.5px solid transparent;
          background:conic-gradient(from var(--cr-angle, 0deg), transparent, rgba(229,9,20,.4), transparent, rgba(229,9,20,.2), transparent) border-box;
          -webkit-mask:linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite:xor;
          mask-composite:exclude;
          animation:cr-ring-spin 6s linear infinite;
        }

        /* fallback sem foto */
        .cr-photo-fallback {
          width:100%; height:100%;
          display:flex; align-items:center; justify-content:center;
          background:linear-gradient(135deg, rgba(229,9,20,.15), rgba(229,9,20,.05));
          font-size:4rem;
        }

        /* ── Texto ───────────────────────────────────────────────────── */
        .cr-content {
          position:relative; z-index:1;
          max-width:400px; width:100%; text-align:center;
          display:flex; flex-direction:column; align-items:center;
        }

        .cr-eyebrow {
          font-size:11px; font-weight:700; letter-spacing:2px;
          text-transform:uppercase; color:#E50914;
          margin-bottom:16px;
          opacity:0; transform:translateY(12px);
          transition:all .8s ease;
        }
        .cr-eyebrow.v { opacity:1; transform:translateY(0); }

        .cr-mensagem {
          font-size:17px; line-height:1.8; color:rgba(255,255,255,.85);
          font-weight:400; letter-spacing:.2px;
          white-space:pre-line;
          opacity:0; transform:translateY(16px);
          transition:all 1s ease;
        }
        .cr-mensagem.v { opacity:1; transform:translateY(0); }

        /* ── Assinatura ──────────────────────────────────────────────── */
        .cr-sign {
          margin-top:28px;
          display:flex; flex-direction:column; align-items:center; gap:8px;
          opacity:0; transform:translateY(14px);
          transition:all .8s ease;
        }
        .cr-sign.v { opacity:1; transform:translateY(0); }

        .cr-sign-line {
          width:40px; height:1px;
          background:linear-gradient(90deg, transparent, rgba(229,9,20,.5), transparent);
        }

        .cr-sign-names {
          font-family:'Bebas Neue',sans-serif;
          font-size:24px; letter-spacing:3px; color:rgba(255,255,255,.9);
        }

        .cr-sign-label {
          font-size:10px; color:rgba(255,255,255,.3);
          text-transform:uppercase; letter-spacing:1.5px;
        }

        .cr-sign-heart {
          font-size:1.4rem; margin-top:4px;
          animation:cr-heart-beat 1.5s ease-in-out infinite;
        }

        /* ── Botão ───────────────────────────────────────────────────── */
        .cr-btn-wrap {
          margin-top:36px; width:100%; max-width:400px;
          opacity:0; transform:translateY(12px);
          transition:all .8s ease;
        }
        .cr-btn-wrap.v { opacity:1; transform:translateY(0); }

        .cr-btn {
          display:flex; align-items:center; justify-content:center; gap:8px;
          width:100%; padding:14px 32px;
          background:rgba(255,255,255,.1); color:#fff;
          border:1px solid rgba(255,255,255,.2); border-radius:4px;
          font-size:15px; font-weight:600; font-family:'Inter',sans-serif;
          cursor:pointer; transition:all .2s ease;
          -webkit-tap-highlight-color:transparent;
        }
        .cr-btn:hover { background:rgba(255,255,255,.15); }

        /* ── Keyframes ───────────────────────────────────────────────── */
        @property --cr-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes cr-ring-spin {
          to { --cr-angle: 360deg; }
        }
        @keyframes cr-heart-beat {
          0%, 100% { transform:scale(1); }
          15% { transform:scale(1.2); }
          30% { transform:scale(1); }
          45% { transform:scale(1.15); }
          60% { transform:scale(1); }
        }

        @media(max-width:480px) {
          .cr-wrap { padding:32px 20px; }
          .cr-photo-wrap { width:150px; height:150px; margin-bottom:24px; }
          .cr-mensagem { font-size:15px; line-height:1.75; }
          .cr-sign-names { font-size:20px; }
        }
        @media(max-width:360px) {
          .cr-photo-wrap { width:130px; height:130px; }
          .cr-mensagem { font-size:14px; }
        }
      `}</style>

      <div className="cr-wrap">
        <div className="cr-bg-glow" />
        <div className="cr-vignette" />

        {/* Foto */}
        <div className={`cr-photo-wrap ${phase >= 1 ? 'v' : ''}`}>
          <div className="cr-photo-ring" />
          <div className="cr-photo-frame">
            {foto ? (
              <img className="cr-photo" src={foto} alt={`${nome1} & ${nome2}`} />
            ) : (
              <div className="cr-photo-fallback">💕</div>
            )}
          </div>
        </div>

        {/* Conteúdo */}
        <div className="cr-content">
          <div className={`cr-eyebrow ${phase >= 2 ? 'v' : ''}`}>
            Uma mensagem especial
          </div>

          <div className={`cr-mensagem ${phase >= 3 ? 'v' : ''}`}>
            {msgFinal || 'Cada momento com você é o meu episódio favorito.'}
          </div>

          <div className={`cr-sign ${phase >= 4 ? 'v' : ''}`}>
            <div className="cr-sign-line" />
            <div className="cr-sign-names">{nome1} & {nome2}</div>
            <div className="cr-sign-label">Elenco principal</div>
            <div className="cr-sign-heart">❤️</div>
          </div>
        </div>

        {/* Botão */}
        <div className={`cr-btn-wrap ${phase >= 5 ? 'v' : ''}`}>
          <button className="cr-btn" onClick={onNext}>
            Continuar assistindo
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9,18 15,12 9,6" />
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}