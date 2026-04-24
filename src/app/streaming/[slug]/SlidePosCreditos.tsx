'use client'

import { useState, useEffect, useRef } from 'react'
import type { StreamingDados } from './page'

// ─── Component ────────────────────────────────────────────────────────────────

export default function SlidePosCreditos({
  dados,
  onNext,
}: {
  dados: StreamingDados
  onNext: () => void
}) {
  const [phase, setPhase] = useState(0)
  // 0 = tela preta total (pausa dramática)
  // 1 = "nome1 & nome2"
  // 2 = "irão voltar em"
  // 3 = título do filme (grande, dramático)
  // 4 = botão sutil aparece

  const nome1 = dados.nome1 ?? ''
  const nome2 = dados.nome2 ?? ''
  const titulo = dados.pos_creditos || `Temporada ${new Date().getFullYear() + 1}`

  // ── Áudio ──────────────────────────────────────────────────────────────────
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // ✏️  Ajuste aqui o minuto/segundo que a música vai começar:
  const START_TIME_SECONDS = 0  // ex: 83 = 1min23s

  useEffect(() => {
    const audio = new Audio('/marvel.mp3')
    audio.currentTime = START_TIME_SECONDS
    audio.volume = 0.8
    audioRef.current = audio

    const playPromise = audio.play()
    // Navegadores podem bloquear autoplay — a promise silencia o erro
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay bloqueado: tentaremos no primeiro clique do usuário
        const unlock = () => {
          audio.play().catch(() => {})
          document.removeEventListener('click', unlock)
        }
        document.addEventListener('click', unlock)
      })
    }

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 4500),  // pausa longa dramática
      setTimeout(() => setPhase(2), 8500),  // "irão voltar em"
      setTimeout(() => setPhase(3), 13000),  // título épico
      setTimeout(() => setPhase(4), 13000),  // botão
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const handleNext = () => {
    audioRef.current?.pause()
    onNext()
  }

  return (
    <>
      <style>{`
        .pc-wrap {
          width:100%; min-height:100dvh; background:#000; color:#fff;
          font-family:'Inter',sans-serif;
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          position:relative; overflow:hidden;
          padding:40px 24px;
          cursor:pointer;
        }

        /* ── Nomes do casal ──────────────────────────────────────────── */
        .pc-names {
          font-family:'Bebas Neue',sans-serif;
          font-size:clamp(28px, 7vw, 42px);
          letter-spacing:4px;
          text-transform:uppercase;
          color:#fff;
          text-align:center;
          opacity:0;
          transition:opacity 1.2s ease;
        }
        .pc-names.v { opacity:1; }

        /* ── "irão voltar em" ─────────────────────────────────────────── */
        .pc-return {
          font-size:clamp(14px, 3.5vw, 18px);
          color:rgba(255,255,255,.5);
          letter-spacing:1.5px;
          margin-top:16px;
          text-align:center;
          opacity:0;
          transition:opacity 1s ease;
        }
        .pc-return.v { opacity:1; }

        /* ── Título do "filme" ────────────────────────────────────────── */
        .pc-title-wrap {
          margin-top:24px;
          text-align:center;
          opacity:0;
          transform:scale(.9);
          transition:all 1.2s cubic-bezier(.4,0,.2,1);
        }
        .pc-title-wrap.v { opacity:1; transform:scale(1); }

        .pc-title {
          font-family:'Bebas Neue',sans-serif;
          font-size:clamp(22px, 5.5vw, 32px);
          letter-spacing:6px;
          text-transform:uppercase;
          color:#E50914;
          line-height:1.3;
          text-shadow:
            0 0 30px rgba(229,9,20,.4),
            0 0 60px rgba(229,9,20,.15);
        }

        /* ── Botão sutil ─────────────────────────────────────────────── */
        .pc-btn-wrap {
          position:absolute;
          bottom:40px; left:50%; transform:translateX(-50%);
          opacity:0;
          transition:opacity 1s ease;
        }
        .pc-btn-wrap.v { opacity:1; }

        .pc-btn {
          display:flex; align-items:center; gap:6px;
          padding:10px 20px;
          background:transparent; color:rgba(255,255,255,.25);
          border:1px solid rgba(255,255,255,.08); border-radius:4px;
          font-size:12px; font-weight:500; font-family:'Inter',sans-serif;
          cursor:pointer; transition:all .3s ease;
          -webkit-tap-highlight-color:transparent;
          letter-spacing:.5px;
        }
        .pc-btn:hover {
          color:rgba(255,255,255,.6);
          border-color:rgba(255,255,255,.2);
          background:rgba(255,255,255,.04);
        }

        @media(max-width:480px) {
          .pc-wrap { padding:32px 20px; }
          .pc-btn-wrap { bottom:28px; }
        }
      `}</style>

      <div className="pc-wrap" onClick={() => { if (phase >= 3) handleNext() }}>
        {/* Nomes */}
        <div className={`pc-names ${phase >= 1 ? 'v' : ''}`}>
          {nome1} & {nome2}
        </div>

        {/* "irão voltar em" */}
        <div className={`pc-return ${phase >= 2 ? 'v' : ''}`}>
          irão voltar em
        </div>

        {/* Título épico */}
        <div className={`pc-title-wrap ${phase >= 3 ? 'v' : ''}`}>
          <div className="pc-title">
            {/* Temporada {new Date().getFullYear() + 1} */}
            <div className="pc-title">{titulo}</div>
          </div>
        </div>

        {/* Botão sutil */}
        <div className={`pc-btn-wrap ${phase >= 4 ? 'v' : ''}`}>
          <button className="pc-btn" onClick={(e) => { e.stopPropagation(); handleNext() }}>
            Continuar
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9,18 15,12 9,6" />
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}