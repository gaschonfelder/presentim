'use client'

import { useEffect, useState, useRef, use } from 'react'
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

// Injeta YouTube IFrame API uma vez
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
  const [time, setTime] = useState(calc())
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

  // Typewriter para um texto específico
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

  // Scroll listener — fiel ao original
  useEffect(() => {
    if (!aberto || !presente) return
    const fotos: string[] = Array.isArray(presente.fotos) ? presente.fotos : []
    setVisibleSections(new Array(fotos.length).fill(false))

    const onScroll = () => {
      const wh = window.innerHeight
      sectionsRef.current.forEach((el, i) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        const visivel = rect.top < wh * 0.6

        setVisibleSections(prev => { const n = [...prev]; n[i] = visivel; return n })

        // Typewriter: digita ao entrar, some ao sair (igual ao original)
        if (visivel) {
          setDigitados(prev => {
            if (!prev[i]) {
              // ainda não digitou — inicia
              const frases: string[] = Array.isArray(presente.frases) ? presente.frases as string[] : []
              if (frases[i]) typeText(i, frases[i])
              const n = [...prev]; n[i] = true; return n
            }
            return prev
          })
        } else {
          // Sai da área — reseta para poder digitar de novo
          setDigitados(prev => { const n = [...prev]; n[i] = false; return n })
          setDisplayedTexts(prev => { const n = [...prev]; n[i] = ''; return n })
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
  }

  // Inicia YouTube player após abrir
  useEffect(() => {
    if (!aberto || !presente?.musica_info?.videoId) return
    loadYouTubeApi()
    const videoId = presente.musica_info.videoId
    const init = () => {
      if (!(window as any).YT?.Player) { setTimeout(init, 300); return }
      const p = new (window as any).YT.Player(ytContainerRef.current, {
        videoId,
        playerVars: { autoplay: 1, loop: 1, playlist: videoId, controls: 0, mute: 0 },
        events: {
          onReady: (e: any) => { e.target.setVolume(40); e.target.playVideo(); setMusicaPlaying(true) },
          onStateChange: (e: any) => setMusicaPlaying(e.data === 1),
        },
      })
      setYtPlayer(p)
    }
    ;(window as any).onYouTubeIframeAPIReady = init
    init()
  }, [aberto, presente])

  function toggleMusica() {
    if (!ytPlayer) return
    if (musicaPlaying) { ytPlayer.pauseVideo(); setMusicaPlaying(false) }
    else { ytPlayer.playVideo(); setMusicaPlaying(true) }
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

        /* Igual ao original — scroll-section como espaçador */
        .scroll-section{height:70vh;position:relative}

        /* Polaroid fixo no viewport */
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

        /* polaroidText fixo — contém TODOS os textos, cada um some/aparece */
        .polaroidText{position:fixed;top:20%;left:48%;width:40%}
        .text{
          font-family:'Dancing Script',cursive;
          font-size:clamp(1.4rem,2.5vw,2.5rem);
          text-align:center;margin:.6rem 0;line-height:1.6;font-weight:700;color:#333;
          opacity:0;transform:translateY(20px);
          transition:opacity .6s ease,transform .6s ease;
        }
        .text.visible{opacity:1;transform:translateY(0)}

        /* Texto final fullscreen */
        .textoFinal{
          position:fixed;top:50%;left:50%;width:100vw;height:100vh;
          transform:translate(-50%,-50%) scale(0.9);
          opacity:0;transition:opacity .8s ease,transform .8s ease;
          z-index:999;display:flex;flex-direction:column;
          align-items:center;justify-content:center;gap:28px;
          background:linear-gradient(135deg,${cor},${cor}bb);
          color:white;text-align:center;padding:20px;
        }
        .textoFinal.visible{opacity:1;transform:translate(-50%,-50%) scale(1)}
        .textoFinal h1{font-family:'Dancing Script',cursive;font-size:clamp(2.5rem,6vw,5rem);line-height:1.3}
        .btn-share{background:white;color:${cor};border:none;border-radius:50px;padding:14px 32px;font-family:'Lato',sans-serif;font-size:1rem;font-weight:700;cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,.15);transition:transform .2s}
        .btn-share:hover{transform:scale(1.05)}

        #mainContent h2{font-family:'Playfair Display',serif;font-size:clamp(2rem,5vw,4rem);text-align:center;color:#3d1f28;opacity:0;animation:fadeUp .8s .1s ease forwards}

        @media(max-width:700px){.polaroid{top:30%;left:45%;width:clamp(180px,80vw,320px)}.polaroidText{width:90%;top:55%;left:5%}.text{font-size:1.4rem}}
        @media(max-width:500px){.polaroid{top:25%;left:40%}.polaroidText{top:48%}.btnInicial{font-size:2.5rem;padding:18px 36px}}
      `}</style>

      {isDirectAudio && <audio ref={audioRef} src={presente.musica_url!} loop preload="none" />}
      {aberto && scEmbedUrl && <iframe src={scEmbedUrl} style={{ display:'none' }} allow="autoplay" title="música" />}
      {/* YouTube player invisível */}
      {aberto && presente.musica_info && (
        <div ref={ytContainerRef} style={{ position:'fixed', width:1, height:1, opacity:0, pointerEvents:'none', zIndex:-1 }} />
      )}
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

      {/* SCROLL CONTAINER — estrutura fiel ao original */}
      {aberto && (
        <div id="scrollContainer">

          {/* Uma scroll-section por foto */}
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

          {/* Espaçador final */}
          <div style={{ height: '150vh' }} />

          {/* Texto final fullscreen */}
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

      {/* polaroidText FIXO — fora do scrollContainer, igual ao original */}
      {/* Cada <p> corresponde à foto do mesmo index */}
      {aberto && frases.length > 0 && (
        <div className="polaroidText">
          {frases.map((_, i) => (
            <p
              key={i}
              className={`text ${visibleSections[i] ? 'visible' : ''}`}
            >
              {displayedTexts[i] ?? ''}
            </p>
          ))}
        </div>
      )}

      {mostrarQR && <QRModal url={shareUrl} cor={cor} onClose={() => setMostrarQR(false)} />}
    </>
  )
}