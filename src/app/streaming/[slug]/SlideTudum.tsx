'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export default function SlideTudum({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [showSkip, setShowSkip] = useState(false)
  const completedRef = useRef(false)
  const playerRef = useRef<any>(null)

  useEffect(() => {
    completedRef.current = false
    setShowSkip(false)

    const finish = () => {
      if (completedRef.current) return
      completedRef.current = true
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      if (playerRef.current) {
        try { playerRef.current.stop() } catch {}
      }
      onComplete()
    }

    const scriptId = 'dotlottie-script'
    if (!customElements.get('dotlottie-player') && !document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.id = scriptId
      script.type = 'module'
      script.src = 'https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs'
      document.head.appendChild(script)
    }

    const createPlayer = () => {
      if (!containerRef.current || completedRef.current) return
      containerRef.current.innerHTML = ''

      const audio = new Audio('/tudum.mp3')
      audio.preload = 'auto'
      audioRef.current = audio

      const player = document.createElement('dotlottie-player') as any
      player.setAttribute('src', '/netflix_intro.json')
      player.setAttribute('background', 'transparent')
      player.setAttribute('speed', '1')
      player.style.width = '100%'
      player.style.height = '100%'
      player.style.maxWidth = '100vw'
      player.style.maxHeight = '100dvh'
      playerRef.current = player

      player.addEventListener('complete', finish)

      const startPlayback = () => {
        if (completedRef.current) return
        try { player.stop(); player.play() } catch (e) {
          console.warn('Lottie play error:', e)
        }
        setTimeout(() => {
          if (completedRef.current) return
          audio.currentTime = 0
          audio.play().catch(err => console.warn('Erro ao tocar áudio:', err))
        }, 400)
      }

      player.addEventListener('ready', startPlayback)
      containerRef.current.appendChild(player)
    }

    const waitForElement = () => {
      if (customElements.get('dotlottie-player')) {
        createPlayer()
      } else {
        let attempts = 0
        const poll = setInterval(() => {
          attempts++
          if (customElements.get('dotlottie-player')) {
            clearInterval(poll)
            createPlayer()
          } else if (attempts > 30) {
            clearInterval(poll)
            finish()
          }
        }, 100)
      }
    }

    const setupTimer = setTimeout(waitForElement, 200)
    const skipTimer = setTimeout(() => setShowSkip(true), 1000)
    const fallbackTimer = setTimeout(finish, 8000)

    return () => {
      clearTimeout(setupTimer)
      clearTimeout(skipTimer)
      clearTimeout(fallbackTimer)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        audioRef.current = null
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
      playerRef.current = null
    }
  }, [onComplete])

  const handleSkip = useCallback(() => {
    if (completedRef.current) return
    completedRef.current = true
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    if (playerRef.current) {
      try { playerRef.current.stop() } catch {}
    }
    onComplete()
  }, [onComplete])

  return (
    <div style={{
      position: 'fixed', inset: 0, width: '100vw', height: '100dvh',
      background: '#000', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 9999,
    }}>
      <div ref={containerRef} style={{
        width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }} />

      <button onClick={handleSkip} style={{
        position: 'absolute',
        bottom: 'max(30px, env(safe-area-inset-bottom))',
        right: 'max(30px, env(safe-area-inset-right))',
        padding: '10px 20px', background: 'rgba(0,0,0,0.6)', color: '#fff',
        border: '1px solid rgba(255,255,255,0.3)', borderRadius: '4px',
        fontSize: '14px', fontFamily: "'Inter', sans-serif", cursor: 'pointer',
        opacity: showSkip ? 1 : 0, transition: 'opacity 0.3s ease',
        zIndex: 10, WebkitTapHighlightColor: 'transparent',
      }}>
        Pular
      </button>
    </div>
  )
}