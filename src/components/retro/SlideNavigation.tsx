'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { useRetro } from './RetroProvider'

type Props = {
  children: ReactNode
}

/**
 * Navegação manual:
 * - Swipe horizontal no mobile
 * - Teclado ← → no desktop
 * - Botões ‹ › laterais
 * - Barra de progresso no topo (indicador de posição, SEM timer)
 */
export default function SlideNavigation({ children }: Props) {
  const { slide, totalSlides, goTo, next, prev, theme } = useRetro()

  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  // Teclado
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  // Touch swipe
  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || touchStartY.current === null) return

    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current

    // Só considera swipe horizontal se deslocamento horizontal > vertical
    // (evita conflito com scroll vertical em slides que têm conteúdo longo)
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) next()
      else prev()
    }

    touchStartX.current = null
    touchStartY.current = null
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#000;overscroll-behavior:none}

        .retro-v2-player{
          position:relative;
          width:100vw;
          height:100dvh;
          max-width:430px;
          margin:0 auto;
          overflow:hidden;
          user-select:none;
          background:#06050f;
        }

        .retro-v2-progress{
          position:absolute;
          top:0;
          left:0;
          right:0;
          z-index:30;
          display:flex;
          gap:3px;
          padding:10px 12px;
        }
        .retro-v2-seg{
          flex:1;
          height:2.5px;
          background:${theme.progress.inactive};
          border-radius:2px;
          overflow:hidden;
          transition:background .3s;
        }
        .retro-v2-seg.done{background:${theme.progress.done}}
        .retro-v2-seg.active{background:${theme.progress.active}}

        .retro-v2-nav{
          position:absolute;
          top:50%;
          transform:translateY(-50%);
          z-index:20;
          background:${theme.nav.bg};
          border:1px solid ${theme.nav.border};
          backdrop-filter:blur(8px);
          border-radius:50%;
          width:38px;
          height:38px;
          display:flex;
          align-items:center;
          justify-content:center;
          cursor:pointer;
          transition:all .2s;
          color:${theme.nav.color};
          font-size:.9rem;
        }
        .retro-v2-nav:hover:not(.disabled){
          transform:translateY(-50%) scale(1.08);
          opacity:.9;
        }
        .retro-v2-nav:active:not(.disabled){
          transform:translateY(-50%) scale(.95);
        }
        .retro-v2-nav.disabled{opacity:.2;cursor:default;pointer-events:none}
        .retro-v2-nav.left{left:10px}
        .retro-v2-nav.right{right:10px}

        .retro-v2-slide{
          position:absolute;
          inset:0;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          padding:72px 28px 44px;
          opacity:0;
          pointer-events:none;
          transition:opacity .45s;
        }
        .retro-v2-slide.active{opacity:1;pointer-events:auto}

        .retro-v2-anim{
          opacity:0;
          transform:translateY(16px);
          animation:retroSlideUp .6s forwards;
        }
        @keyframes retroSlideUp{to{opacity:1;transform:translateY(0)}}
        @keyframes floatUp{
          0%{opacity:0;transform:translateY(0) scale(.8)}
          20%{opacity:.7}
          80%{opacity:.4}
          100%{opacity:0;transform:translateY(-120px) scale(1.1)}
        }
        @keyframes badgeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmerText{0%,100%{opacity:1}50%{opacity:.65}}
        @keyframes particle{
          0%{opacity:1;transform:translateY(0) scale(1)}
          100%{opacity:0;transform:translateY(-28px) scale(.4)}
        }
      `}</style>

      <div
        ref={containerRef}
        className="retro-v2-player"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Barra de progresso (indicador, sem timer) */}
        <div className="retro-v2-progress">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <div
              key={i}
              className={`retro-v2-seg ${
                i < slide ? 'done' : i === slide ? 'active' : ''
              }`}
            />
          ))}
        </div>

        {/* Botões de navegação */}
        <button
          className={`retro-v2-nav left ${slide === 0 ? 'disabled' : ''}`}
          onClick={prev}
          aria-label="Slide anterior"
        >
          ‹
        </button>
        <button
          className={`retro-v2-nav right ${slide === totalSlides - 1 ? 'disabled' : ''}`}
          onClick={next}
          aria-label="Próximo slide"
        >
          ›
        </button>

        {children}
      </div>
    </>
  )
}