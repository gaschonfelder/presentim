'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRetro } from './RetroProvider'

/**
 * YouTube embed invisível + chip flutuante.
 * - NÃO faz autoplay ao carregar (navegadores bloqueiam sem interação)
 * - Começa a tocar na primeira troca de slide (swipe ou botão)
 * - Chip flutuante com play/pause manual
 */
export default function MusicPlayer() {
  const { musica, slide, theme } = useRetro()

  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)
  const [started, setStarted] = useState(false)

  const ytRef = useRef<any>(null)
  const ytContainerRef = useRef<HTMLDivElement>(null)
  const prevSlideRef = useRef(0)

  // ─── Inicializa o YouTube player (sem autoplay) ─────────────────────────

  useEffect(() => {
    if (!musica?.videoId) return

    function initPlayer() {
      if (!ytContainerRef.current) return
      ytRef.current = new (window as any).YT.Player(ytContainerRef.current, {
        videoId: musica!.videoId,
        playerVars: {
          autoplay: 0, // SEM autoplay
          loop: 1,
          playlist: musica!.videoId,
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: () => {
            ytRef.current?.setVolume(40)
            setReady(true)
          },
          onStateChange: (e: any) => {
            setPlaying(e.data === 1)
          },
        },
      })
    }

    if ((window as any).YT?.Player) {
      initPlayer()
    } else {
      if (!document.getElementById('yt-api')) {
        const s = document.createElement('script')
        s.id = 'yt-api'
        s.src = 'https://www.youtube.com/iframe_api'
        document.head.appendChild(s)
      }
      ;(window as any).onYouTubeIframeAPIReady = initPlayer
    }

    return () => {
      try { ytRef.current?.destroy() } catch {}
    }
  }, [musica?.videoId])

  // ─── Detecta primeira troca de slide → inicia música ───────────────────

  useEffect(() => {
    // Se não tem música, player não tá pronto, ou já iniciou, ignora
    if (!musica || !ready || started) return

    // Slide mudou? (saiu do 0 pra qualquer outro, ou qualquer troca)
    if (slide !== prevSlideRef.current) {
      ytRef.current?.playVideo()
      setStarted(true)
    }

    prevSlideRef.current = slide
  }, [slide, musica, ready, started])

  // ─── Toggle manual ─────────────────────────────────────────────────────

  function togglePlay(e: React.MouseEvent) {
    e.stopPropagation()
    if (!ready) return

    if (playing) {
      ytRef.current?.pauseVideo()
    } else {
      ytRef.current?.playVideo()
      if (!started) setStarted(true)
    }
  }

  if (!musica) return null

  return (
    <>
      {/* YouTube player — invisível */}
      <div
        ref={ytContainerRef}
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />

      {/* Chip flutuante — aparece quando player tá pronto */}
      {ready && (
        <div
          className="retro-music-chip"
          onClick={togglePlay}
          style={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 25,
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            background: theme.musicChip.bg,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.musicChip.border}`,
            borderRadius: 50,
            padding: '.35rem .9rem .35rem .5rem',
            cursor: 'pointer',
            transition: 'all .2s',
            whiteSpace: 'nowrap',
            maxWidth: 'calc(100% - 100px)',
          }}
        >
          {/* Ícone play/pause */}
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: theme.musicChip.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '.7rem',
              flexShrink: 0,
            }}
          >
            {playing ? '⏸' : '▶'}
          </div>

          {/* Nota musical animada */}
          <span
            style={{
              fontSize: '.75rem',
              opacity: playing ? undefined : 0.5,
              animation: playing ? 'musicPulse 1.2s ease-in-out infinite' : 'none',
            }}
          >
            {playing ? '♪' : '♩'}
          </span>

          {/* Título com link */}
          <a
            href={`https://www.youtube.com/watch?v=${musica.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              fontSize: '.65rem',
              color: theme.text.secondary,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 180,
              textDecoration: 'none',
            }}
          >
            {musica.title}
          </a>
        </div>
      )}

      <style>{`
        @keyframes musicPulse {
          0%, 100% { opacity: .5; transform: scale(1) }
          50% { opacity: 1; transform: scale(1.2) }
        }
      `}</style>
    </>
  )
}