'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import type { StreamingDados } from './page'
import SlideHero from './SlideHero'
import SlideTudum from './SlideTudum'
import SlideEpisodios from './SlideEpisodios'
import SlideStats from './SlideStats'
import SlideConquistas from './SlideConquistas'
import SlideQuiz from './SlideQuiz'
import SlideCreditos from './SlideCreditos'
import SlidePosCreditos from './SlidePosCreditos'
import SlideContinue from './SlideContinue'

type SlideId = 'hero' | 'tudum' | 'timeline' | 'stats' | 'conquistas' | 'quiz' | 'creditos' | 'pos-creditos' | 'continue'

// Slides onde a música deve tocar (após TUDUM, até antes do pós-créditos)
const MUSIC_SLIDES: SlideId[] = ['timeline', 'stats', 'conquistas', 'quiz', 'creditos']

// Slides que podem ser capturados para Stories
const CAPTURABLE_SLIDES: SlideId[] = ['hero', 'timeline', 'stats', 'conquistas', 'creditos']

export default function StreamingPlayer({ dados }: { dados: StreamingDados }) {
  const [currentSlide, setCurrentSlide] = useState<SlideId>('hero')
  const [transitioning, setTransitioning] = useState(false)

  // ─── Screenshots capturados durante navegação ─────────────────────────────
  const screenshotsRef = useRef<Map<SlideId, string>>(new Map())
  const [screenshotCount, setScreenshotCount] = useState(0)

  const captureCurrentSlide = useCallback(async (slideId: SlideId) => {
    if (!CAPTURABLE_SLIDES.includes(slideId)) return
    if (screenshotsRef.current.has(slideId)) return

    try {
      const container = document.querySelector('[data-streaming-player]') as HTMLElement
      if (!container) return

      const { toPng } = await import('html-to-image')

      // Remove stylesheets externas que causam CORS (Google Fonts etc)
      const removedNodes: Node[] = []
      try {
        for (const sheet of Array.from(document.styleSheets)) {
          try { void sheet.cssRules } catch {
            if (sheet.ownerNode?.parentNode) {
              removedNodes.push(sheet.ownerNode)
              sheet.ownerNode.parentNode.removeChild(sheet.ownerNode)
            }
          }
        }
      } catch { }

      const dataUrl = await toPng(container, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
        includeQueryParams: true,
        filter: (node: HTMLElement) => {
          if (node.tagName === 'BUTTON') return false
          if (node.classList?.contains('music-chip')) return false
          return true
        },
      })

      // Restaura stylesheets removidas
      for (const node of removedNodes) {
        try { document.head.appendChild(node) } catch { }
      }

      screenshotsRef.current.set(slideId, dataUrl)
      setScreenshotCount(c => c + 1)
    } catch (err) {
      console.warn('Screenshot falhou para', slideId, err)
    }
  }, [])

  // ─── YouTube Music ────────────────────────────────────────────────────────
  const [musicReady, setMusicReady] = useState(false)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const ytRef = useRef<any>(null)
  const ytContainerRef = useRef<HTMLDivElement>(null)
  const musica = dados.musica ?? null
  const userInteractedRef = useRef(false)
  const musicWarmedUpRef = useRef(false)

  useEffect(() => {
    if (!musica?.videoId) return

    function initPlayer() {
      if (!ytContainerRef.current || ytRef.current) return
      ytRef.current = new (window as any).YT.Player(ytContainerRef.current, {
        videoId: musica!.videoId,
        playerVars: {
          autoplay: 0, loop: 1, playlist: musica!.videoId,
          controls: 0, disablekb: 1, modestbranding: 1, rel: 0,
          playsinline: 1,
        },
        events: {
          onReady: () => setMusicReady(true),
          onStateChange: (e: any) => setMusicPlaying(e.data === 1),
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
      ; (window as any).onYouTubeIframeAPIReady = initPlayer
    }

    return () => { try { ytRef.current?.destroy(); ytRef.current = null } catch { } }
  }, [musica?.videoId])

  useEffect(() => {
    if (!musicReady || !ytRef.current) return

    if (MUSIC_SLIDES.includes(currentSlide) && userInteractedRef.current) {
      try { ytRef.current.setVolume(35); ytRef.current.playVideo() } catch { }
    } else {
      try { ytRef.current.pauseVideo() } catch { }
    }
  }, [currentSlide, musicReady])

  // ─── Navigation ───────────────────────────────────────────────────────────
  const goTo = useCallback((nextSlide: SlideId) => {
    // Captura o slide atual ANTES de sair (animações já terminaram)
    captureCurrentSlide(currentSlide)

    setTransitioning(true)
    setTimeout(() => {
      setCurrentSlide(nextSlide)
      setTransitioning(false)
    }, 400)
  }, [currentSlide, captureCurrentSlide])

  const handlePlay = useCallback(() => {
    userInteractedRef.current = true

    if (musicReady && ytRef.current && !musicWarmedUpRef.current) {
      try {
        ytRef.current.setVolume(0)
        ytRef.current.playVideo()
        setTimeout(() => {
          try { ytRef.current?.pauseVideo() } catch { }
        }, 100)
        musicWarmedUpRef.current = true
      } catch { }
    }

    goTo('tudum')
  }, [goTo, musicReady])

  const handleTudumComplete = useCallback(() => goTo('timeline'), [goTo])

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; height: 100dvh; background: #000; overflow-x: hidden; }
        body { -webkit-font-smoothing: antialiased; }
      `}</style>

      {musica && (
        <div
          ref={ytContainerRef}
          style={{ position: 'fixed', width: 1, height: 1, opacity: 0, pointerEvents: 'none', zIndex: -1 }}
        />
      )}

      {musica && musicReady && MUSIC_SLIDES.includes(currentSlide) && (
        <div
          className="music-chip"
          onClick={(e) => {
            e.stopPropagation()
            if (musicPlaying) { ytRef.current?.pauseVideo() } else { ytRef.current?.playVideo() }
          }}
          style={{
            position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)',
            zIndex: 100, display: 'flex', alignItems: 'center', gap: 7,
            background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,.15)', borderRadius: 50,
            padding: '6px 14px 6px 8px', cursor: 'pointer',
            transition: 'all .2s', maxWidth: 'calc(100% - 48px)',
          }}
        >
          <div style={{
            width: 24, height: 24, borderRadius: '50%',
            background: 'rgba(229,9,20,.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '10px', color: '#fff', flexShrink: 0,
          }}>
            {musicPlaying ? '⏸' : '▶'}
          </div>
          <span style={{
            fontSize: '11px', color: 'rgba(255,255,255,.7)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            maxWidth: 180, fontFamily: "'Inter',sans-serif",
          }}>
            {musica.title}
          </span>
        </div>
      )}

      <div
        data-streaming-player
        style={{
          opacity: transitioning ? 0 : 1,
          transition: 'opacity 0.4s ease',
          minHeight: '100dvh',
        }}
      >
        {currentSlide === 'hero' && (
          <SlideHero dados={dados} onPlay={handlePlay} />
        )}

        {currentSlide === 'tudum' && (
          <SlideTudum onComplete={handleTudumComplete} />
        )}

        {currentSlide === 'timeline' && (
          <SlideEpisodios dados={dados} onNext={() => goTo('stats')} />
        )}

        {currentSlide === 'stats' && (
          <SlideStats dados={dados} onNext={() => goTo('conquistas')} />
        )}

        {currentSlide === 'conquistas' && (
          <SlideConquistas dados={dados} onNext={() => goTo('quiz')} />
        )}

        {currentSlide === 'quiz' && (
          <SlideQuiz dados={dados} onNext={() => goTo('creditos')} />
        )}

        {currentSlide === 'creditos' && (
          <SlideCreditos dados={dados} onNext={() => goTo('pos-creditos')} />
        )}

        {currentSlide === 'pos-creditos' && (
          <SlidePosCreditos dados={dados} onNext={() => goTo('continue')} />
        )}

        {currentSlide === 'continue' && (
          <SlideContinue
            dados={dados}
            screenshots={screenshotsRef.current}
            onReplay={() => {
              screenshotsRef.current.clear()
              setScreenshotCount(0)
              goTo('hero')
            }}
          />
        )}
      </div>
    </>
  )
}