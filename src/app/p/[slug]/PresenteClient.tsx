'use client'

import { useEffect, useState, useRef, use, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { urlPresente } from '@/lib/utils'
import type { Presente } from '@/types'
import { QRCodeCanvas as QRCode } from 'qrcode.react'

function getSoundCloudEmbedUrl(url: string): string | null {
  if (!url) return null
  if (/\.(mp3|ogg|wav|m4a)(\?|$)/i.test(url)) return null
  if (url.includes('soundcloud.com'))
    return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&auto_play=true&hide_related=true&show_comments=false&show_user=false&visual=false`
  return null
}

let ytApiLoaded = false
function loadYouTubeApi() {
  if (ytApiLoaded || typeof window === 'undefined') return
  ytApiLoaded = true
  const s = document.createElement('script')
  s.src = 'https://www.youtube.com/iframe_api'
  document.head.appendChild(s)
}

function Countdown({ target, cor }: { target: string; cor: string }) {
  const calc = () => {
    const diff = new Date(target).getTime() - Date.now()
    if (diff <= 0) return null
    return { dias: Math.floor(diff/86400000), horas: Math.floor((diff%86400000)/3600000), mins: Math.floor((diff%3600000)/60000), segs: Math.floor((diff%60000)/1000) }
  }
  const [time, setTime] = useState(calc)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { const t = setInterval(() => setTime(calc()), 1000); return () => clearInterval(t) }, [])
  if (!time) return null
  return (
    <div style={{ display:'flex', gap:20, justifyContent:'center', flexWrap:'wrap', padding:'20px 30px 30px', border:`2px solid ${cor}44`, borderRadius:30, marginBottom:32 }}>
      {[[String(time.dias),'dias'],[String(time.horas).padStart(2,'0'),'horas'],[String(time.mins).padStart(2,'0'),'min'],[String(time.segs).padStart(2,'0'),'s']].map(([n,l],idx) => (
        <div key={l} style={{ display:'flex', flexDirection:'column', alignItems:'center', ...(idx<3?{borderRight:`2px solid ${cor}33`,paddingRight:20}:{}) }}>
          <span style={{ fontSize:'5rem', fontWeight:'bold', color:cor, lineHeight:1, fontFamily:'sans-serif' }}>{n}</span>
          <small style={{ fontSize:'1.5rem', color:'#555', marginTop:4 }}>{l}</small>
        </div>
      ))}
    </div>
  )
}

function QRModal({ url, cor, onClose }: { url: string; cor: string; onClose: () => void }) {
  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,.6)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:'white', borderRadius:24, padding:'40px 32px', maxWidth:360, width:'100%', textAlign:'center' }}>
        <div style={{ fontSize:'2.5rem', marginBottom:12 }}>📱</div>
        <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.4rem', color:'#3d1f28', marginBottom:8 }}>Compartilhe este presente</h3>
        <p style={{ fontSize:'.85rem', color:'#7a4f5a', marginBottom:24, lineHeight:1.6 }}>Envie o link ou mostre o QR Code para quem você ama.</p>
        <div style={{ display:'flex', justifyContent:'center', marginBottom:20 }}>
          <QRCode value={url} size={180} fgColor={cor} />
        </div>
        <div style={{ background:'#f5f0f2', borderRadius:10, padding:'10px 14px', fontSize:'.78rem', color:'#7a4f5a', wordBreak:'break-all', marginBottom:20 }}>{url}</div>
        <button onClick={() => { navigator.clipboard.writeText(url); alert('Link copiado! 🎉') }}
          style={{ width:'100%', background:`linear-gradient(135deg,${cor},${cor}bb)`, color:'white', border:'none', borderRadius:12, padding:13, fontFamily:'Lato,sans-serif', fontSize:'1rem', fontWeight:700, cursor:'pointer', marginBottom:10 }}>
          📋 Copiar link
        </button>
        <button onClick={onClose} style={{ width:'100%', background:'none', border:'2px solid #e0d0d4', borderRadius:12, padding:11, fontFamily:'Lato,sans-serif', fontSize:'.9rem', color:'#7a4f5a', cursor:'pointer' }}>
          Fechar
        </button>
      </div>
    </div>
  )
}

// ─── Roleta ───────────────────────────────────────────────────────────────────
function RoletaSection({ opcoes, cor }: { opcoes: string[]; cor: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [spinning, setSpinning] = useState(false)
  const [resultado, setResultado] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const rotationRef = useRef(0)

  const drawWheel = useCallback((rotation: number) => {
    const colors = [
      `${cor}55`, `${cor}77`, `${cor}44`, `${cor}88`,
      `${cor}33`, `${cor}66`, `${cor}99`, `${cor}22`,
    ]
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const size = canvas.width
    const center = size / 2
    const radius = center - 10
    const sliceAngle = (Math.PI * 2) / opcoes.length

    ctx.clearRect(0, 0, size, size)
    ctx.save()
    ctx.translate(center, center)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.translate(-center, -center)

    for (let i = 0; i < opcoes.length; i++) {
      const startAngle = i * sliceAngle - Math.PI / 2
      const endAngle = startAngle + sliceAngle

      ctx.beginPath()
      ctx.moveTo(center, center)
      ctx.arc(center, center, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = colors[i % colors.length]
      ctx.fill()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 3
      ctx.stroke()

      ctx.save()
      ctx.translate(center, center)
      ctx.rotate(startAngle + sliceAngle / 2)
      ctx.textAlign = 'right'
      ctx.fillStyle = '#3d1f28'
      ctx.font = 'bold 14px Arial'
      const text = opcoes[i].length > 20 ? opcoes[i].slice(0, 18) + '…' : opcoes[i]
      ctx.fillText(text, radius - 14, 5)
      ctx.restore()
    }

    ctx.beginPath()
    ctx.arc(center, center, 22, 0, Math.PI * 2)
    ctx.fillStyle = cor
    ctx.fill()
    ctx.beginPath()
    ctx.arc(center, center, 8, 0, Math.PI * 2)
    ctx.fillStyle = '#fff'
    ctx.fill()

    ctx.restore()
  }, [opcoes, cor])

  useEffect(() => { drawWheel(0) }, [drawWheel])

  function getSelected(finalDeg: number): string {
    const normalized = ((finalDeg % 360) + 360) % 360
    const pointerAngle = (360 - normalized) % 360
    const sliceDeg = 360 / opcoes.length
    const index = Math.floor(pointerAngle / sliceDeg) % opcoes.length
    return opcoes[index]
  }

  function spin() {
    if (spinning) return
    setSpinning(true)
    setShowResult(false)
    setResultado(null)

    const extraSpins = 5 + Math.floor(Math.random() * 3)
    const randomStop = Math.floor(Math.random() * 360)
    const finalRotation = rotationRef.current + extraSpins * 360 + randomStop
    rotationRef.current = finalRotation

    const duration = 4800
    const start = performance.now()
    const startRot = finalRotation - (extraSpins * 360 + randomStop)

    function animate(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      const currentRot = startRot + (finalRotation - startRot) * ease
      drawWheel(currentRot)
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        drawWheel(finalRotation)
        const selected = getSelected(finalRotation)
        setResultado(selected)
        setShowResult(true)
        setSpinning(false)
      }
    }
    requestAnimationFrame(animate)
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'40px 24px 20px', textAlign:'center' }}>
      <p style={{ fontFamily:"'Dancing Script',cursive", fontSize:'1.1rem', color:'#888', marginBottom:6, letterSpacing:1 }}>✨ Roleta de date</p>
      <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(1.6rem,4vw,2.2rem)', color:'#3d1f28', marginBottom:4 }}>Roleta do próximo date</h2>
      <p style={{ fontSize:'.85rem', color:'#6e424d', marginBottom:28 }}>Gire e descubra nosso próximo encontro 💖</p>

      <div style={{ position:'relative', width:300, height:300, margin:'0 auto 24px' }}>
        <div style={{
          position:'absolute', top:-4, left:'50%', transform:'translateX(-50%)',
          width:0, height:0,
          borderLeft:'16px solid transparent', borderRight:'16px solid transparent',
          borderTop:`28px solid ${cor}`,
          zIndex:3, filter:'drop-shadow(0 3px 5px rgba(0,0,0,.2))',
        }} />
        <canvas ref={canvasRef} width={300} height={300}
          style={{ width:'100%', height:'100%', display:'block', borderRadius:'50%', boxShadow:'0 8px 28px rgba(0,0,0,.12)' }}
        />
      </div>

      <button onClick={spin} disabled={spinning} style={{
        border:'none', background: spinning ? '#ccc' : `linear-gradient(135deg,${cor},${cor}cc)`,
        color:'white', padding:'14px 36px', borderRadius:50, cursor: spinning ? 'not-allowed' : 'pointer',
        fontSize:'1rem', fontWeight:700, boxShadow: spinning ? 'none' : `0 6px 20px ${cor}55`,
        transition:'all .2s', marginBottom:16,
      }}>
        {spinning ? 'Girando…' : '💫 Girar roleta'}
      </button>

      <div style={{
        minHeight:56, padding:'14px 20px', borderRadius:16,
        background: showResult ? `linear-gradient(135deg,${cor}22,${cor}11)` : '#f5f0f2',
        border:`1.5px solid ${showResult ? cor+'66' : '#e0d0d4'}`,
        color:'#3d1f28', fontWeight:700, fontSize:'1rem',
        transition:'all .4s', maxWidth:320, width:'100%',
        display:'flex', alignItems:'center', justifyContent:'center',
        animation: showResult ? 'popIn .5s ease' : 'none',
      }}>
        {resultado ? `Próximo date: ${resultado}` : 'Seu próximo date aparecerá aqui ✨'}
      </div>
    </div>
  )
}

// ─── Termo ────────────────────────────────────────────────────────────────────
function TermoSection({ palavra, dica, cor }: { palavra: string; dica: string; cor: string }) {
  const MAX_TENTATIVAS = 5
  const answer = palavra.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim()
  const wordLen = answer.length

  const [tentativas, setTentativas] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [msg, setMsg] = useState('')
  const [gameOver, setGameOver] = useState(false)
  const [animating, setAnimating] = useState(false)
  const [revealRow, setRevealRow] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function normalize(w: string) {
    return w.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim()
  }

  function getStatus(guess: string): ('correct' | 'present' | 'absent')[] {
    const result: ('correct' | 'present' | 'absent')[] = Array(guess.length).fill('absent')
    const answerLetters = answer.split('')
    const used = Array(answer.length).fill(false)
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === answer[i]) { result[i] = 'correct'; used[i] = true }
    }
    for (let i = 0; i < guess.length; i++) {
      if (result[i] === 'correct') continue
      for (let j = 0; j < answerLetters.length; j++) {
        if (!used[j] && guess[i] === answerLetters[j]) { result[i] = 'present'; used[j] = true; break }
      }
    }
    return result
  }

  async function submit() {
    if (gameOver || animating) return
    const guess = normalize(input)
    if (guess.length !== wordLen) { setMsg(`A palavra deve ter ${wordLen} letras.`); return }

    const newTentativas = [...tentativas, guess]
    setTentativas(newTentativas)
    setInput('')
    setAnimating(true)
    setRevealRow(newTentativas.length - 1)

    await new Promise(r => setTimeout(r, wordLen * 200 + 500))
    setRevealRow(null)
    setAnimating(false)

    if (guess === answer) {
      setMsg('Parabéns! Você acertou 💘')
      setGameOver(true)
      return
    }
    if (newTentativas.length >= MAX_TENTATIVAS) {
      setMsg(`Fim de jogo! A resposta era: ${palavra.toUpperCase()}`)
      setGameOver(true)
      return
    }
    setMsg(`Tentativa ${newTentativas.length} de ${MAX_TENTATIVAS}`)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  function reset() {
    setTentativas([]); setInput(''); setMsg(''); setGameOver(false); setAnimating(false); setRevealRow(null)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const statusColors: Record<string, string> = {
    correct: cor,
    present: `${cor}99`,
    absent: '#c9b7bd',
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'40px 24px 20px', textAlign:'center' }}>
      <p style={{ fontFamily:"'Dancing Script',cursive", fontSize:'1.1rem', color:'#888', marginBottom:6, letterSpacing:1 }}>🎮 Mini jogo</p>
      <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(1.6rem,4vw,2.2rem)', color:'#3d1f28', marginBottom:4 }}>Descubra a palavra</h2>
      <p style={{ fontSize:'.85rem', color:'#7a4f5a', marginBottom:16 }}>Você tem {MAX_TENTATIVAS} tentativas para acertar</p>

      <div style={{ background:`${cor}22`, border:`1.5px solid ${cor}55`, padding:'12px 20px', borderRadius:14, marginBottom:20, fontWeight:700, color:'#3d1f28', fontSize:'.9rem', maxWidth:320, width:'100%' }}>
        💡 Dica: {dica}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:20 }}>
        {Array.from({ length: MAX_TENTATIVAS }).map((_, row) => {
          const guess = tentativas[row]
          const status = guess ? getStatus(guess) : null
          const isRevealing = revealRow === row

          return (
            <div key={row} style={{ display:'flex', justifyContent:'center', gap:6 }}>
              {Array.from({ length: wordLen }).map((_, col) => {
                const letter = guess?.[col] ?? ''
                const s = status?.[col]
                const delay = isRevealing ? col * 180 : 0
                return (
                  <div key={col} style={{
                    width:48, height:48, borderRadius:10,
                    border: s ? 'none' : '2px solid #e2a9b6',
                    background: s ? statusColors[s] : '#fff',
                    color: s ? 'white' : '#3d1f28',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:'1.3rem', fontWeight:700, textTransform:'uppercase',
                    transition: `background ${delay}ms, border ${delay}ms`,
                    boxShadow: s === 'correct' ? `0 0 12px ${cor}66` : 'none',
                  }}>
                    {letter}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      {!gameOver && (
        <div style={{ display:'flex', gap:8, marginBottom:12, maxWidth:320, width:'100%' }}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && submit()}
            maxLength={wordLen}
            placeholder={`Palavra com ${wordLen} letras`}
            disabled={animating}
            style={{
              flex:1, padding:'12px 14px', borderRadius:12,
              border:'2px solid #e2a9b6', outline:'none', fontSize:'1rem',
              textTransform:'uppercase', fontFamily:'Lato,sans-serif',
              background:'#fff', color:'#3d1f28',
            }}
          />
          <button onClick={submit} disabled={animating || !input} style={{
            border:'none', background: `linear-gradient(135deg,${cor},${cor}cc)`,
            color:'white', padding:'0 18px', borderRadius:12,
            fontWeight:700, cursor: animating || !input ? 'not-allowed' : 'pointer',
            opacity: !input ? .5 : 1, fontSize:'1rem',
          }}>Tentar</button>
        </div>
      )}

      {msg && (
        <p style={{ fontWeight:700, color: msg.includes('Parabéns') ? cor : '#6d2e40', marginBottom:12, fontSize:'.95rem' }}>{msg}</p>
      )}

      <button onClick={reset} style={{
        padding:'10px 28px', border:'none', borderRadius:50,
        background:'#f5e0e5', color:'#7a3244', fontWeight:700, cursor:'pointer', fontSize:'.85rem',
      }}>🔄 Reiniciar</button>
    </div>
  )
}

export default function PresenteClient({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const supabase = createClient()
  const [presente, setPresente] = useState<Presente | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [aberto, setAberto] = useState(false)
  const [mostrarQR, setMostrarQR] = useState(false)
  const [visibleSections, setVisibleSections] = useState<boolean[]>([])
  const [digitados, setDigitados] = useState<boolean[]>([])
  const [displayedTexts, setDisplayedTexts] = useState<string[]>([])
  const [atBottom, setAtBottom] = useState(false)
  const [ytPlayer, setYtPlayer] = useState<any>(null)
  const [musicaPlaying, setMusicaPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const ytContainerRef = useRef<HTMLDivElement>(null)
  const startBtnRef = useRef<HTMLButtonElement>(null)
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([])
  const pendingUnmuteRef = useRef(false)

  useEffect(() => {
    async function carregar() {
      const { data } = await supabase.from('presentes').select('*').eq('slug', slug).eq('ativo', true).single()
      if (!data) { setNotFound(true); setLoading(false); return }
      setPresente(data)
      const frases: string[] = Array.isArray(data.frases) ? data.frases : []
      setDisplayedTexts(frases.map(() => ''))
      setDigitados(frases.map(() => false))
      setLoading(false)
      await supabase.from('presentes').update({ visualizacoes: (data.visualizacoes ?? 0) + 1 }).eq('id', data.id)
    }
    carregar()
  }, [slug])

  // Heart effect
  useEffect(() => {
    const btn = startBtnRef.current
    if (!btn || !presente) return
    let interval: ReturnType<typeof setInterval>
    const start = () => {
      interval = setInterval(() => {
        const heart = document.createElement('div')
        heart.textContent = '❤️'
        heart.style.cssText = 'position:fixed;pointer-events:none;z-index:9999;font-size:1.5rem;animation:flyUpHeart 1s ease-out forwards;'
        const rect = btn.getBoundingClientRect()
        heart.style.left = `${rect.left + Math.random() * rect.width}px`
        heart.style.top = `${rect.top + Math.random() * rect.height}px`
        document.body.appendChild(heart)
        setTimeout(() => heart.remove(), 1000)
      }, 100)
    }
    const stop = () => clearInterval(interval)
    btn.addEventListener('mouseenter', start)
    btn.addEventListener('mouseleave', stop)
    return () => { btn.removeEventListener('mouseenter', start); btn.removeEventListener('mouseleave', stop); clearInterval(interval) }
  }, [aberto, presente])

  function typeText(index: number, text: string) {
    let c = 0
    function tick() {
      if (c <= text.length) {
        setDisplayedTexts(prev => { const n = [...prev]; n[index] = text.slice(0, c); return n })
        c++
        setTimeout(tick, 60)
      }
    }
    tick()
  }

  useEffect(() => {
    if (!aberto || !presente) return
    const fotos: string[] = Array.isArray(presente.fotos) ? presente.fotos : []
    setVisibleSections(new Array(fotos.length).fill(false))

    const onScroll = () => {
      const wh = window.innerHeight

      sectionsRef.current.forEach((el, i) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        const visivel = rect.top < wh * 0.6 && rect.top > -wh

        setVisibleSections(prev => { const n = [...prev]; n[i] = visivel; return n })

        if (visivel) {
          setDigitados(prev => {
            if (!prev[i]) {
              const frases: string[] = Array.isArray(presente.frases) ? presente.frases as string[] : []
              if (frases[i]) typeText(i, frases[i])
              const n = [...prev]; n[i] = true; return n
            }
            return prev
          })
        }
      })

      setAtBottom(window.scrollY + wh >= document.body.offsetHeight - 50)
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [aberto, presente])

  function handleAbrir() {
    setAberto(true)
    if (audioRef.current) { audioRef.current.volume = 0.5; audioRef.current.play().catch(() => {}) }
    if (ytPlayer) {
      ytPlayer.unMute()
      ytPlayer.setVolume(40)
      setMusicaPlaying(true)
    } else if (presente?.musica_info) {
      pendingUnmuteRef.current = true
    }
  }

  // ─── YouTube: inicializa assim que os dados chegam, div sempre no DOM ───────
  useEffect(() => {
    if (!presente?.musica_info?.videoId) return
    loadYouTubeApi()
    const videoId = presente.musica_info.videoId
    let cancelled = false

    const init = () => {
      if (cancelled) return
      if (!(window as any).YT?.Player) { setTimeout(init, 200); return }
      // usa o ID fixo — o div está sempre no DOM
      new (window as any).YT.Player('yt-player', {
        videoId,
        playerVars: { autoplay: 1, mute: 1, loop: 1, playlist: videoId, controls: 0 },
        events: {
          onReady: (e: { target: { unMute(): void; mute(): void; setVolume(v: number): void } }) => {
            cancelled = true
            setYtPlayer(e.target)
            if (pendingUnmuteRef.current) {
              e.target.unMute()
              e.target.setVolume(40)
              pendingUnmuteRef.current = false
            }
          },
          onStateChange: (e: { data: number }) => setMusicaPlaying(e.data === 1),
        },
      })
    }
    ;(window as any).onYouTubeIframeAPIReady = init
    init()
    return () => { cancelled = true }
  }, [presente])

  function toggleMusica() {
    if (!ytPlayer) return
    if (musicaPlaying) { ytPlayer.mute(); setMusicaPlaying(false) }
    else { ytPlayer.unMute(); ytPlayer.setVolume(40); setMusicaPlaying(true) }
  }

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#fff8f9' }}>
      <style>{`@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.2)}}`}</style>
      <div style={{ fontSize:'4rem', animation:'pulse 1s infinite' }}>💝</div>
    </div>
  )

  if (notFound || !presente) return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#fff8f9', fontFamily:'sans-serif', textAlign:'center', padding:24 }}>
      <div style={{ fontSize:'4rem', marginBottom:20 }}>🎁</div>
      <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.8rem', color:'#3d1f28', marginBottom:10 }}>Presente não encontrado</h2>
      <p style={{ color:'#7a4f5a' }}>Este link pode ter expirado ou não existe.</p>
    </div>
  )

  const cor = presente.cor_primaria ?? '#e8627a'
  const fundo = presente.cor_fundo ?? '#ffeef0'
  const fotos: string[] = Array.isArray(presente.fotos) ? presente.fotos : []
  const frases: string[] = Array.isArray(presente.frases) ? presente.frases as string[] : []
  const rotations = ['-7deg','8deg','-3deg','5deg','-5deg','4deg']
  const hasCountdown = !!presente.data_liberacao
  const countdownPassed = hasCountdown ? new Date(presente.data_liberacao!).getTime() <= Date.now() : true
  const scEmbedUrl = presente.musica_url ? getSoundCloudEmbedUrl(presente.musica_url) : null
  const isDirectAudio = !!presente.musica_url && !scEmbedUrl
  const shareUrl = urlPresente(slug)

  const temRoleta = Array.isArray(presente.roleta_opcoes) && presente.roleta_opcoes.length > 0
  const temTermo = !!presente.termo_config?.palavra && !!presente.termo_config?.dica

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Lato:wght@300;400;700&family=Dancing+Script:wght@400;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{font-family:'Lato',sans-serif;background:${fundo};color:#333;overflow-x:hidden}
        @keyframes flyUpHeart{0%{opacity:1;transform:translateY(0) scale(1) rotate(0deg)}100%{opacity:0;transform:translateY(-80px) scale(1.5) rotate(30deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%,100%{opacity:1}50%{opacity:.75}}
        @keyframes popIn{0%{transform:scale(.5);opacity:0}70%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
        @keyframes musicPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.2);opacity:.7}}

        .start-section{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:40px 24px}
        .btnInicial{display:block;margin:30px auto;padding:24px 48px;font-size:3.5rem;background-color:${cor};color:white;border:none;border-radius:8px;cursor:pointer;transition:background-color .2s,transform .2s;box-shadow:0 12px 40px ${cor}55;animation:shimmer 2s infinite;position:relative}
        .btnInicial:hover{background-color:${cor}cc;transform:scale(1.05);animation:none}

        .scroll-section{height:70vh;position:relative}

        .polaroid{
          position:fixed;top:50%;left:25%;
          transform:translate(-50%,-50%) scale(0.9) rotate(var(--rotation,0deg));
          width:clamp(220px,35vw,440px);
          opacity:0;transition:opacity .8s ease,transform .8s ease;z-index:0;
          background:white;padding:12px 12px 48px;
          box-shadow:0 8px 32px rgba(0,0,0,.18);
        }
        .polaroid.visible{opacity:1;transform:translate(-50%,-50%) scale(1) rotate(var(--rotation))}
        .polaroid img{width:100%;border:4px solid white;box-shadow:0 4px 12px rgba(0,0,0,.2);border-radius:4px;display:block}

        .polaroidText{position:fixed;top:50%;left:48%;width:40%;transform:translateY(-50%);display:flex;flex-direction:column;justify-content:center;gap:.4rem;max-height:70vh;overflow:hidden;pointer-events:none}
        .text{
          font-family:'Dancing Script',cursive;
          font-size:clamp(1.4rem,2.5vw,2.5rem);
          text-align:center;margin:.6rem 0;line-height:1.6;font-weight:700;color:#333;
          opacity:0;transform:translateY(20px);
          transition:opacity .6s ease,transform .6s ease;
        }
        .text.visible{opacity:1;transform:translateY(0)}

        .textoFinal{
          position:fixed;top:50%;left:50%;width:100vw;height:100vh;
          transform:translate(-50%,-50%) scale(0.9);
          opacity:0;pointer-events:none;transition:opacity .8s ease,transform .8s ease;
          z-index:999;display:flex;flex-direction:column;
          align-items:center;justify-content:center;gap:28px;
          background:linear-gradient(135deg,${cor},${cor}bb);
          color:white;text-align:center;padding:20px;
        }
        .textoFinal.visible{opacity:1;pointer-events:auto;transform:translate(-50%,-50%) scale(1)}
        .textoFinal h1{font-family:'Dancing Script',cursive;font-size:clamp(2.5rem,6vw,5rem);line-height:1.3;color:white}
        .btn-share{background:white;color:${cor};border:none;border-radius:50px;padding:14px 32px;font-family:'Lato',sans-serif;font-size:1rem;font-weight:700;cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,.15);transition:transform .2s}
        .btn-share:hover{transform:scale(1.05)}

        #mainContent h2{font-family:'Playfair Display',serif;font-size:clamp(2rem,5vw,4rem);text-align:center;color:#3d1f28;opacity:0;animation:fadeUp .8s .1s ease forwards}

        @media(max-width:700px){.polaroid{top:28%;left:50%;width:clamp(160px,72vw,300px)}.polaroidText{width:88%;top:auto;bottom:6%;left:6%;transform:none;max-height:28vh;justify-content:flex-end}.text{font-size:1.2rem}}
        @media(max-width:500px){.polaroid{top:22%;left:50%}.btnInicial{font-size:2.5rem;padding:18px 36px}}
      `}</style>

      {/* div do YouTube — SEMPRE no DOM, fora de qualquer condicional */}
      <div id="yt-player" ref={ytContainerRef} style={{ position:'fixed', width:1, height:1, opacity:0, pointerEvents:'none', zIndex:-1 }} />

      {isDirectAudio && <audio ref={audioRef} src={presente.musica_url!} loop preload="none" />}
      {aberto && scEmbedUrl && <iframe src={scEmbedUrl} style={{ display:'none' }} allow="autoplay" title="música" />}

      {/* Chip flutuante de música */}
      {aberto && (presente.musica_info || presente.musica_url) && (
        <div
          onClick={presente.musica_info ? toggleMusica : undefined}
          style={{
            position:'fixed', bottom:24, left:24, zIndex:1000,
            background:'rgba(255,255,255,.92)', backdropFilter:'blur(10px)',
            border:`1px solid ${cor}44`, borderRadius:50,
            padding:'8px 16px 8px 12px',
            display:'flex', alignItems:'center', gap:8,
            cursor: presente.musica_info ? 'pointer' : 'default',
            boxShadow:'0 4px 20px rgba(0,0,0,.12)',
            maxWidth:260,
          }}
        >
          <span style={{ fontSize:'1.1rem', animation: musicaPlaying ? 'musicPulse 1.2s ease-in-out infinite' : 'none' }}>♪</span>
          {presente.musica_info ? (
            <a
              href={`https://youtube.com/watch?v=${presente.musica_info.videoId}`}
              target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{ fontSize:'.75rem', color:'#3d1f28', textDecoration:'none', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}
            >{presente.musica_info.title}</a>
          ) : (
            <span style={{ fontSize:'.75rem', color:'#3d1f28' }}>Música de fundo</span>
          )}
        </div>
      )}

      {/* TELA INICIAL */}
      <div className="start-section">
        {hasCountdown && !countdownPassed && <Countdown target={presente.data_liberacao!} cor={cor} />}
        {countdownPassed && !aberto && (
          <button ref={startBtnRef} className="btnInicial" onClick={handleAbrir}>{presente.emoji} {presente.texto_botao}</button>
        )}
        {aberto && <div id="mainContent"><h2>{presente.titulo}</h2></div>}
        {!countdownPassed && (
          <p style={{ fontFamily:"'Dancing Script',cursive", fontSize:'1.5rem', color:cor, marginTop:24 }}>
            Aguarde… sua surpresa está a caminho 💌
          </p>
        )}
      </div>

      {/* SCROLL CONTAINER */}
      {aberto && (
        <div id="scrollContainer">
          {fotos.map((fotoUrl, i) => (
            <div key={i} className="scroll-section" ref={el => { sectionsRef.current[i] = el }}>
              <div
                className={`polaroid ${visibleSections[i] ? 'visible' : ''}`}
                style={{ '--rotation': rotations[i % rotations.length] } as React.CSSProperties}
              >
                <img src={fotoUrl} alt={`Foto ${i+1}`} />
              </div>
            </div>
          ))}

          <div style={{ height: '80vh' }} />

          <div className={`textoFinal ${atBottom ? 'visible' : ''}`}>
            <h1>{presente.texto_final}</h1>
            <button className="btn-share" onClick={() => setMostrarQR(true)}>📱 Compartilhar este presente</button>
            {presente.retro_slug && (
              <div style={{ marginTop:8, display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
                <p style={{ fontFamily:"'Dancing Script',cursive", fontSize:'1.1rem', opacity:.9 }}>
                  ✨ Tem ainda mais esperando por você…
                </p>
                <div style={{ background:'white', padding:12, borderRadius:16, boxShadow:'0 4px 20px rgba(0,0,0,.2)' }}>
                  <QRCode value={`${typeof window!=='undefined'?window.location.origin:''}/retrospectiva/${presente.retro_slug}`} size={140} fgColor={cor} />
                </div>
                <a
                  href={`/retrospectiva/${presente.retro_slug}`}
                  style={{ background:'rgba(255,255,255,.2)', border:'2px solid rgba(255,255,255,.6)', color:'white', borderRadius:50, padding:'10px 24px', fontFamily:"'Lato',sans-serif", fontSize:'.9rem', fontWeight:700, textDecoration:'none', backdropFilter:'blur(4px)' }}
                >
                  💫 Ver nossa Retrospectiva
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* polaroidText FIXO — só aparece quando estamos na zona de fotos */}
      {aberto && frases.length > 0 && visibleSections.some(v => v) && (
        <div className="polaroidText">
          {frases.map((_, i) => (
            <p key={i} className={`text ${displayedTexts[i] ? 'visible' : ''}`}>
              {displayedTexts[i] ?? ''}
            </p>
          ))}
        </div>
      )}

      {/* Seções extras — sempre interativas */}
      {aberto && (temTermo || temRoleta) && (
        <div style={{ position:'relative', zIndex:10, background:fundo, paddingBottom:220 }}>
          {temTermo && (
            <div style={{ background:'white', borderRadius:24, margin:'40px auto 0', maxWidth:500, width:'calc(100% - 48px)', boxShadow:'0 8px 32px rgba(0,0,0,.08)' }}>
              <TermoSection
                palavra={presente.termo_config!.palavra}
                dica={presente.termo_config!.dica}
                cor={cor}
              />
            </div>
          )}
          {temRoleta && (
            <div style={{ background:'white', borderRadius:24, margin:'32px auto 0', maxWidth:500, width:'calc(100% - 48px)', boxShadow:'0 8px 32px rgba(0,0,0,.08)' }}>
              <RoletaSection opcoes={presente.roleta_opcoes!} cor={cor} />
            </div>
          )}
        </div>
      )}

      {mostrarQR && <QRModal url={shareUrl} cor={cor} onClose={() => setMostrarQR(false)} />}
    </>
  )
}