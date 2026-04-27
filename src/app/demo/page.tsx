'use client'

import Link from 'next/link'
import Image from 'next/image'

const DEMO_RETRO = 'https://www.presentim.com.br/retrospectiva/ai4469tu'
const DEMO_PAGINA = 'https://www.presentim.com.br/p/jbka676s'
const DEMO_FILME  = 'https://www.presentim.com.br/streaming/sdiduqww'

const img_RETRO = '/retro.png'
const img_PAGINA = '/pagina.png'
const img_FILME  = '/cinema.png'

/* ── colour tokens (mesmos do landing) ── */
const R  = '#e8627a'
const R2 = '#ff8da7'
const R3 = '#ffa726'
const G  = 'rgba(232,98,122,.35)'
const T  = '#f5e8ec'
const TS = 'rgba(245,232,236,.65)'
const S  = 'rgba(255,255,255,.04)'
const B  = 'rgba(255,255,255,.08)'

/* ── Clapboard (mantido do original, adaptado para inline styles) ── */
function Clapboard() {
  return (
    <div style={{ position:'relative', zIndex:2, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
      <style>{`
        @keyframes clap {
          0%,80%,100% { transform:rotate(0deg); }
          85%          { transform:rotate(-28deg); }
          90%          { transform:rotate(0deg); }
        }
      `}</style>
      <div style={{
        width:72, height:18, borderRadius:'4px 4px 0 0',
        background:'repeating-linear-gradient(90deg,#f5c842 0px,#f5c842 8px,#1a1a1a 8px,#1a1a1a 16px)',
        border:'2px solid #f5c842', transformOrigin:'bottom center',
        animation:'clap 3.6s ease-in-out infinite',
      }}/>
      <div style={{ width:72, height:44, borderRadius:'0 0 6px 6px', background:'#1c1c1c', border:'2px solid #555', borderTop:'none', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <span style={{ fontSize:'.45rem', color:'rgba(255,255,255,.6)', fontFamily:'monospace', letterSpacing:'.5px', textAlign:'center', lineHeight:1.6 }}>NOSSA{'\n'}HISTÓRIA{'\n'}★ 2024 ★</span>
      </div>
      <span style={{ fontSize:'.65rem', letterSpacing:3, textTransform:'uppercase', color:'rgba(245,200,66,.6)', fontFamily:'monospace', marginTop:8 }}>Now Showing</span>
    </div>
  )
}

/* ── card configs ── */
const cards = [
  {
    label: 'Produto 1',
    name:  'Página Virtual',
    tagline: 'Para celebrar agora.',
    desc:  'Uma página animada com fotos, frases personalizadas, música e contagem regressiva. A pessoa abre o link e vive a surpresa.',
    features: ['Fotos com efeito typewriter','Contagem regressiva até a data especial','Música de fundo personalizada','Link único + QR Code'],
    href:  DEMO_PAGINA,
    previewBg: 'linear-gradient(160deg,#f8a5b9 0%,#e8627a 60%,#c8395a 100%)',
    glow:      'rgba(232,98,122,.45)',
    labelColor: R,
    btnStyle:  { background: R, color: '#fff', boxShadow:`0 6px 20px ${G}` } as React.CSSProperties,
    featured:  false,
    type: 'pagina' as const,
  },
  {
    label: 'Produto 2',
    name:  'Retrospectiva',
    tagline: 'Para contar a história.',
    desc:  'Slides animados, cinematográficos, com o céu estrelado exato da data, conquistas raras do casal e Stories prontos pra postar.',
    features: ['Céu da data especial do casal','Conquistas em raridades épicas','Carrossel de fotos animado','Exportar slides para Stories'],
    href:  DEMO_RETRO,
    previewBg: 'linear-gradient(160deg,#1a0a2e 0%,#3b1565 50%,#5b2a8a 100%)',
    glow:      'rgba(248,87,166,.55)',
    labelColor: 'rgba(248,87,166,.8)',
    btnStyle:  { background:'linear-gradient(135deg,#f857a6,#ff5858)', color:'#fff', boxShadow:'0 6px 20px rgba(248,87,166,.4)' } as React.CSSProperties,
    featured:  true,
    type: 'retro' as const,
  },
  {
    label: 'Produto 3',
    name:  'Retrospectiva Cinema',
    tagline: 'Para os amores épicos.',
    desc:  'Uma experiência cinematográfica da história do casal — com trailer, trilha épica, créditos finais e pôster personalizado.',
    features: ['Abertura estilo trailer de cinema','Linha do tempo em cenas animadas','Trilha sonora personalizada','Créditos finais com vocês como protagonistas'],
    href:  DEMO_FILME,
    previewBg: 'linear-gradient(160deg,#2d1810 0%,#5a2a1a 60%,#8b4a2a 100%)',
    glow:      'rgba(212,165,116,.45)',
    labelColor: 'rgba(245,200,66,.75)',
    btnStyle:  { background:'linear-gradient(135deg,#c9972a,#f5c842)', color:'#1a1200', boxShadow:'0 6px 20px rgba(245,200,66,.35)' } as React.CSSProperties,
    featured:  false,
    type: 'cinema' as const,
  },
]

export default function DemoPage() {
  return (
    <div style={{ background:'#0d0508', minHeight:'100vh', fontFamily:'system-ui,sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        body { background:#0d0508; }

        /* header */
        .demo-nav { position:sticky; top:0; z-index:50; backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px); background:rgba(13,5,8,.75); border-bottom:1px solid ${B}; }

        /* cards grid */
        .demo-cards { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; max-width:1200px; margin:0 auto; padding:0 40px 100px; }
        @media(max-width:960px){ .demo-cards{ grid-template-columns:1fr; max-width:480px; } }
        @media(max-width:600px){ .demo-cards{ padding:0 20px 80px; } }

        /* film holes */
        .film-holes { display:flex; gap:10px; padding:6px 10px; }
        .film-holes span { display:block; width:10px; height:8px; border-radius:2px; background:rgba(255,255,255,.12); border:1px solid rgba(255,255,255,.08); }

        /* hover lift */
        .demo-card { transition:transform .25s,box-shadow .25s; }
        .demo-card:hover { transform:translateY(-6px); }

        /* link reset */
        a { text-decoration:none; }

        /* featured ring pulse */
        @keyframes ring { 0%,100%{ box-shadow:0 0 0 0 rgba(232,98,122,.5); } 60%{ box-shadow:0 0 0 8px rgba(232,98,122,0); } }
        .featured-ring { animation:ring 2.8s ease-out infinite; }
      `}</style>

      {/* ── HEADER ── */}
      <nav className="demo-nav">
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'16px 40px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <Link href="/">
          <Image src="/logo.png" alt="Presentim" width={1024} height={272} priority style={{ height:38, width:'auto', filter:'brightness(0) invert(1)' }} />
          </Link>
          <Link href="/cadastro" style={{ background:R, color:'#fff', padding:'10px 24px', borderRadius:99, fontWeight:600, fontSize:'.9rem', boxShadow:`0 4px 14px ${G}` }}>
            Criar o meu 💝
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ textAlign:'center', padding:'96px 24px 72px', position:'relative', overflow:'hidden' }}>
        {/* glow de fundo */}
        <div aria-hidden="true" style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:700, height:350, borderRadius:'50%', background:`radial-gradient(ellipse,${G},transparent 70%)`, filter:'blur(60px)', pointerEvents:'none' }}/>

        <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:S, border:`1px solid ${B}`, borderRadius:99, padding:'6px 20px', fontSize:11, letterSpacing:'.15em', textTransform:'uppercase', color:R, fontWeight:600, marginBottom:28, position:'relative' }}>
          👀 Exemplos reais
        </div>

        <h1 style={{ fontFamily:'Fraunces,serif', fontSize:'clamp(2.2rem,5vw,3.8rem)', fontWeight:400, lineHeight:1.1, letterSpacing:'-.02em', color:T, margin:'0 0 20px', position:'relative' }}>
          Veja como fica o seu<br/>
          <em style={{ fontStyle:'italic', background:`linear-gradient(135deg,${R2},${R3})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', filter:`drop-shadow(0 0 20px ${G})` }}>presente virtual</em>
        </h1>

        <p style={{ color:TS, fontSize:'1.1rem', maxWidth:480, margin:'0 auto', lineHeight:1.7, position:'relative' }}>
          Abra os exemplos abaixo e experimente como quem recebe se sente ao abrir um Presentim.
        </p>
      </section>

      {/* ── CARDS ── */}
      <div className="demo-cards">
        {cards.map(c => (
          <article
            key={c.name}
            className={`demo-card${c.featured ? ' featured-ring' : ''}`}
            style={{
              background: S,
              border: c.featured ? `1.5px solid ${R}` : `1px solid ${B}`,
              borderRadius: 24,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              position: 'relative',
              transform: c.featured ? 'translateY(-8px)' : undefined,
              boxShadow: c.featured ? `0 24px 64px -20px ${G}` : '0 8px 24px -12px rgba(0,0,0,.15)',
            }}
          >
            {/* badge */}
            {c.featured && (
              <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', background:R, color:'#fff', padding:'5px 18px', borderRadius:99, fontSize:11, fontWeight:700, letterSpacing:1, whiteSpace:'nowrap', zIndex:3 }}>
                Mais popular
              </div>
            )}

            {/* preview */}
            <div style={{ position:'relative', width:'100%', aspectRatio:'4/3', background:c.previewBg, overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:0 }}>
              {/* glow overlay */}
              <div style={{ position:'absolute', inset:0, background:`radial-gradient(circle at 50% 100%,${c.glow},transparent 60%)`, pointerEvents:'none' }}/>

              {c.type === 'pagina' && (
                <img
                  src={img_PAGINA}
                  alt="Preview Página Virtual"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              )}

              {c.type === 'retro' && (
                <img
                  src={img_RETRO}
                  alt="Preview Página Virtual"
                  style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                  }}
                />
              )}

              {c.type === 'cinema' && (
                <img
                  src={img_FILME}
                  alt="Preview Página Virtual"
                  style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                  }}
                />
              )}
            </div>

            {/* body */}
            <div style={{ padding:'28px 28px 32px', display:'flex', flexDirection:'column', flex:1 }}>
              <div style={{ fontSize:11, letterSpacing:1.5, textTransform:'uppercase', color:c.labelColor, marginBottom:8, fontWeight:700 }}>{c.label}</div>
              <h3 style={{ fontFamily:'Fraunces,serif', fontSize:'1.7rem', fontWeight:400, color:T, margin:'0 0 6px' }}>{c.name}</h3>
              <div style={{ fontFamily:'Fraunces,serif', fontStyle:'italic', fontSize:'1rem', color:R, marginBottom:14 }}>{c.tagline}</div>
              <p style={{ fontSize:14, color:TS, lineHeight:1.6, margin:'0 0 18px' }}>{c.desc}</p>

              <ul style={{ listStyle:'none', padding:0, margin:'0 0 22px', borderTop:`1px solid ${B}`, flex:1 }}>
                {c.features.map(f => (
                  <li key={f} style={{ padding:'10px 0', fontSize:13, color:T, opacity:.85, display:'flex', gap:10, borderBottom:`1px solid ${B}`, alignItems:'flex-start' }}>
                    <span style={{ color:R, flexShrink:0, marginTop:1 }}>✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...c.btnStyle,
                  padding:'13px 22px',
                  borderRadius:99,
                  fontSize:13,
                  fontWeight:600,
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center',
                  gap:8,
                }}
              >
                Ver exemplo ao vivo →
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* ── CTA FINAL ── */}
      <section style={{ padding:'140px 56px', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div aria-hidden="true" style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:800, height:400, borderRadius:'50%', background:`radial-gradient(ellipse,${G},transparent 70%)`, filter:'blur(40px)', pointerEvents:'none' }}/>
        <h2 style={{ fontFamily:'Fraunces,serif', fontSize:'clamp(2.4rem,4.5vw,4.5rem)', fontWeight:400, lineHeight:1.05, letterSpacing:'-.02em', color:T, position:'relative', margin:'0 0 20px' }}>
          Pronto para criar o seu<br/>
          <span style={{ fontStyle:'italic', background:`linear-gradient(135deg,${R2},${R3})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', filter:`drop-shadow(0 0 24px ${G})` }}>presente inesquecível?</span>
        </h2>
        <p style={{ color:TS, fontSize:'1rem', maxWidth:440, margin:'0 auto 36px', lineHeight:1.7, position:'relative' }}>
          Em menos de 5 minutos você cria um presente que a pessoa vai guardar para sempre.
        </p>
        <Link href="/cadastro" style={{ background:R, color:'white', padding:'18px 44px', borderRadius:99, fontSize:'1.05rem', fontWeight:600, display:'inline-flex', alignItems:'center', gap:10, position:'relative', boxShadow:`0 16px 40px -10px ${G}` }}>
          Criar meu presente agora 💝
        </Link>
        <p style={{ fontSize:13, color:TS, marginTop:18, position:'relative' }}>R$ 5,90 · sem mensalidade · sem cartão recorrente</p>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding:56, textAlign:'center', borderTop:`1px solid ${B}`, fontSize:13, color:TS }}>
        <div style={{ fontFamily:'Fraunces,serif', fontSize:'1.4rem', color:T, marginBottom:8 }}>
          presentim<span style={{ color:R }}>·</span>
        </div>
        <div style={{ marginTop:16, display:'flex', gap:20, justifyContent:'center', flexWrap:'wrap' }}>
          <Link href="/" style={{ color:TS }}>← Página inicial</Link>
          <Link href="/termos" style={{ color:TS }}>Termos de uso</Link>
          <Link href="/privacidade" style={{ color:TS }}>Privacidade</Link>
          <Link href="/contato" style={{ color:TS }}>Contato</Link>
        </div>
      </footer>
    </div>
  )
}