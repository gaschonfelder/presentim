'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

/* ───────────────────── Typewriter hook ───────────────────── */
function useTypewriter(words: string[]) {
  const [idx, setIdx] = useState(0)
  const [txt, setTxt] = useState('')
  const [del, setDel] = useState(false)

  useEffect(() => {
    if (!words?.length) return
    const cur = words[idx]
    const t = setTimeout(() => {
      if (!del) {
        setTxt(cur.substring(0, txt.length + 1))
        if (txt === cur) setTimeout(() => setDel(true), 2200)
      } else {
        setTxt(cur.substring(0, txt.length - 1))
        if (txt === '') { setDel(false); setIdx((i) => (i + 1) % words.length) }
      }
    }, del ? 70 : 110)
    return () => clearTimeout(t)
  }, [txt, del, idx, words])

  return txt
}

/* ───────────────────── Template previews ───────────────────── */
function PreviewPagina() {
    return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <img
        src="/pagina.png"
        alt="Preview Página Virtual"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
    </div>
  );
}

function PreviewRetro() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <img
        src="/retro.png"
        alt="Preview Página Virtual"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
    </div>
  )
}

function PreviewCinema() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <img
        src="/cinema.png"
        alt="Preview Página Virtual"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
    </div>
  )
}

/* ───────────────────── Section heading ───────────────────── */
function SectionHead({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <div style={{ textAlign:'center', maxWidth:760, margin:'0 auto 64px' }}>
      <div style={{ fontSize:11, letterSpacing:'.2em', textTransform:'uppercase', color:'#e8627a', fontWeight:600, marginBottom:18 }}>{eyebrow}</div>
      <h2 style={{ fontFamily:'Fraunces, serif', fontSize:'clamp(2rem, 3.6vw, 3rem)', fontWeight:400, lineHeight:1.15, letterSpacing:'-.02em', color:'#f5e8ec', margin:0 }}>{children}</h2>
    </div>
  )
}

const fotos = ['/retro-mob.png', '/pag-mob.png', '/cinema-mob.png']
/* ───────────────────── MAIN PAGE ───────────────────── */
export default function LandingPage() {
  const typedWord = useTypewriter(['ama!','cuida!','adora!','quer!','valoriza!','respeita!','admira!','protege!'])

  const [demoSlide, setDemoSlide] = useState(0)
  useEffect(() => { const id = setInterval(() => setDemoSlide(s => (s+1)%3), 3200); return () => clearInterval(id) }, [])


  const slide = fotos[demoSlide]

  const [stars, setStars] = useState<Array<{id:number;left:string;top:string;size:number;opacity:number}>>([])
  useEffect(() => { setStars(Array.from({length:30}, (_,i) => ({ id:i, left:`${(i*37)%100}%`, top:`${(i*53)%100}%`, size:(i%3)+1, opacity:0.3+(i%5)*0.15 }))) }, [])

  const R = '#e8627a', R2 = '#ff8da7', R3 = '#ffa726', G = 'rgba(232,98,122,.35)', T = '#f5e8ec', TS = 'rgba(245,232,236,.65)', S = 'rgba(255,255,255,.04)', B = 'rgba(255,255,255,.08)'

  const tpls = [
    { name:'Página Virtual',href: 'https://www.presentim.com.br/p/jbka676s', tagline:'Para celebrar agora.', desc:'Uma página dedicada, com fotos, frases e música. Perfeita pra aniversários, declarações ou aquela desculpa que precisa de capricho.', features:['Layout limpo e responsivo','Fotos, frases e música','Contagem regressiva','Link permanente + QR Code'], duration:'5 min para criar', price:'1 crédito', pv:'R$ 5,90', Preview:PreviewPagina, bg:'linear-gradient(160deg,#f8a5b9 0%,#e8627a 60%,#c8395a 100%)', glow:'rgba(232,98,122,.45)', label:'MAIS RÁPIDO', featured:false },
    { name:'Retrospectiva',href: 'https://www.presentim.com.br/retrospectiva/ai4469tu', tagline:'Para contar a história.', desc:'Slides animados, cinematográficos, com o céu estrelado exato da data, conquistas raras do casal e Stories prontos pra postar.', features:['Slides cinematográficos animados','Céu estrelado da data exata','Conquistas e marcos do casal','Exportação para Stories'], duration:'Impactante', price:'2 créditos', pv:'R$ 9,90', Preview:PreviewRetro, bg:'linear-gradient(160deg,#1a0a2e 0%,#3b1565 50%,#5b2a8a 100%)', glow:'rgba(248,87,166,.55)', label:'MAIS POPULAR', featured:true },
    { name:'Cinema',href: 'https://www.presentim.com.br/streaming/sdiduqww', tagline:'Para os amores épicos.', desc:'Estilo telão. Abertura cinematográfica, narrativa em ato, identidade visual de filme romântico do começo ao fim.', features:['Abertura cinematográfica','Narrativa em ato','Destaques visuais épicos','Trilha sonora curada'], duration:'Único', price:'2 créditos', pv:'R$ 9,90', Preview:PreviewCinema, bg:'linear-gradient(160deg,#2d1810 0%,#5a2a1a 60%,#8b4a2a 100%)', glow:'rgba(212,165,116,.45)', label:'MAIS IMPACTO', featured:false },
  ]
  const prices = [
    { name:'Starter', price:'5,90', desc:'1 ocasião', features:['1 Página Virtual','Fotos + frases + música','Link + QR Code','Contagem regressiva'], featured:false },
    { name:'Popular', price:'14,90', desc:'3 créditos · R$ 4,97/un', features:['1 Retrospectiva + 1 Página','Slides animados','Conquistas + Stories','Créditos eternos'], featured:true },
    { name:'Max', price:'24,90', desc:'6 créditos · R$ 4,15/un', features:['3 Retros OU 6 Páginas','Misture como quiser','Suporte prioritário','Créditos eternos'], featured:false },
  ]

  const faqs = [['Preciso saber programar?','Não. Formulário, fotos, link pronto.'],['Quanto tempo o link fica ativo?','3 meses a partir da criação.'],['Posso editar depois?','Sim, no painel, a qualquer momento.'],['Os créditos expiram?','Nunca. Use quando quiser.'],['Funciona no celular?','Perfeitamente.'],['Como recebo o link?','Por e-mail, na hora do pagamento.']]

  return (<>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap');
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
      html{scroll-behavior:smooth}
      body{background:#150810!important;color:#f5e8ec!important;font-family:'Inter',system-ui,sans-serif!important}
      a{color:inherit;text-decoration:none}
      details summary::-webkit-details-marker{display:none}
      details summary{list-style:none}
      details[open] summary .faq-plus{transform:rotate(45deg)}
      @keyframes twkBlink{50%{opacity:0}}
      @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      .slide-fade{animation:fadeIn .5s ease both}
      @media(max-width:900px){
        .hero-grid{grid-template-columns:1fr!important}
        .hero-phone-wrap{display:none!important}
        .tpl-grid,.price-grid,.test-grid{grid-template-columns:1fr!important}
        .stats-grid,.how-grid{grid-template-columns:repeat(2,1fr)!important}
        .nav-links-inner{display:none!important}
        .hero-section{padding:60px 24px 80px!important}
        .section-pad{padding-left:24px!important;padding-right:24px!important}
      }
    `}</style>

    <div style={{ minHeight:'100vh', position:'relative', overflowX:'hidden', background:'#150810', color:T, fontFamily:'Inter,system-ui,sans-serif', fontSize:15 }}>
      {/* Ambient glows */}
      <div aria-hidden="true" style={{ position:'absolute', top:-200, right:-200, width:700, height:700, borderRadius:'50%', background:`radial-gradient(circle,${G},transparent 65%)`, filter:'blur(40px)', pointerEvents:'none' }}/>
      <div aria-hidden="true" style={{ position:'absolute', top:600, left:-200, width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle,rgba(120,80,200,.22),transparent 65%)', filter:'blur(40px)', pointerEvents:'none', opacity:.8 }}/>

      {/* NAV */}
      <header style={{ position:'sticky', top:0, zIndex:50, display:'grid', gridTemplateColumns:'auto 1fr auto', alignItems:'center', gap:32, padding:'18px 56px', background:'rgba(21,8,16,.65)', backdropFilter:'blur(16px)', borderBottom:`1px solid ${B}` }}>
        <Link href="/">
          <Image src="/logo.png" alt="Presentim" width={1024} height={272} priority style={{ height:38, width:'auto', filter:'brightness(0) invert(1)' }} />
        </Link>
        <nav className="nav-links-inner" style={{ display:'flex', gap:28, justifyContent:'center' }}>
          <a href="#como-funciona" style={{ fontSize:13, color:TS, fontWeight:500, cursor:'pointer' }}>Como funciona</a>
          <a href="#precos" style={{ fontSize:13, color:TS, fontWeight:500, cursor:'pointer' }}>Preços</a>
          <a href="#faq" style={{ fontSize:13, color:TS, fontWeight:500, cursor:'pointer' }}>FAQ</a>
          <Link href="/historia" style={{ fontSize:13, color:TS, fontWeight:500 }}>História</Link>
          <Link href="/demo" style={{ fontSize:13, color:TS, fontWeight:500 }}>Ver demo</Link>
        </nav>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <Link href="/login" style={{ fontSize:13, color:TS }}>Entrar</Link>
          <Link href="/cadastro" style={{ background:R, color:'white', padding:'10px 18px', borderRadius:99, fontSize:13, fontWeight:600, boxShadow:`0 8px 24px -8px ${G}` }}>Criar presente →</Link>
        </div>
      </header>

      {/* HERO */}
      <section className="hero-section section-pad" style={{ padding:'80px 56px 100px', position:'relative', zIndex:1 }}>
        <div className="hero-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:72, alignItems:'center', maxWidth:1400, margin:'0 auto' }}>
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:10, background:S, border:`1px solid ${B}`, borderRadius:99, padding:'7px 16px', fontSize:12, color:TS, marginBottom:32 }}>
              <span style={{ width:6, height:6, borderRadius:99, background:'#65d97a', boxShadow:'0 0 8px #65d97a' }}/> +423 presentes criados nas últimas 24h
            </div>
            <h1 style={{ fontFamily:'Fraunces,serif', fontSize:'clamp(3rem,5.5vw,5.5rem)', fontWeight:400, lineHeight:1, letterSpacing:'-.025em', color:T, margin:0 }}>
              Surpreenda quem<br/>
              <span style={{ fontStyle:'italic', background:`linear-gradient(135deg,${R2},${R3})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', filter:`drop-shadow(0 0 24px ${G})`, display:'inline-block', minWidth:'4ch' }}>
                {typedWord}<span style={{ display:'inline-block', width:'.05em', height:'.9em', verticalAlign:'-0.1em', background:R, marginLeft:2, animation:'twkBlink 1s steps(1) infinite', WebkitTextFillColor:'initial' }}/>
              </span>
            </h1>
            <p style={{ fontSize:'1.1rem', lineHeight:1.6, color:TS, maxWidth:480, marginTop:28 }}>Crie uma página única ou uma retrospectiva animada com fotos, músicas e mensagens. Compartilhe um link — e veja a emoção acontecer ao vivo.</p>
            <div style={{ display:'flex', gap:14, marginTop:40, alignItems:'center', flexWrap:'wrap' }}>
              <Link href="/dashboard" style={{ background:R, color:'white', padding:'15px 28px', borderRadius:99, fontSize:14, fontWeight:600, display:'inline-flex', alignItems:'center', gap:10, boxShadow:`0 12px 32px -8px ${G}` }}>Criar meu presente <span>→</span></Link>

            </div>
            <div style={{ display:'flex', gap:18, marginTop:56, paddingTop:28, borderTop:`1px solid ${B}`, fontSize:13, color:TS, alignItems:'center', flexWrap:'wrap' }}>
              <div><strong style={{ color:T }}>R$ 5,90</strong> a partir de</div>
              <div style={{ width:1, height:14, background:B }}/><div><strong style={{ color:T }}>5 min</strong> para criar</div>
              <div style={{ width:1, height:14, background:B }}/><div><strong style={{ color:T }}>★ 4.9</strong> · 12k+ avaliações</div>
            </div>
          </div>

          {/* Phone mock */}
          <div className="hero-phone-wrap" style={{ position:'relative', display:'grid', placeItems:'center', minHeight:600 }}>
            <div style={{ width:300, height:600, background:'#000', borderRadius:42, padding:8, boxShadow:`0 40px 80px -20px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.08), 0 0 80px -20px ${G}`, position:'relative' }}>
              <div style={{ position:'absolute', top:18, left:'50%', transform:'translateX(-50%)', width:90, height:24, background:'#000', borderRadius:14, zIndex:10 }}/>
              <div style={{
                width:'100%',
                height:'100%',
                borderRadius:34,
                overflow:'hidden',
                backgroundImage:`url(${fotos[demoSlide] ?? fotos[0]})`,
                backgroundSize:'cover',
                backgroundPosition:'center',
                position:'relative'
              }}>
                <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.4)', zIndex:1 }}/>

                <div key={demoSlide} className="slide-fade" style={{ position:'absolute', inset:0, padding:'80px 28px 48px', display:'flex', flexDirection:'column', justifyContent:'flex-end', zIndex:2 }}>
                  <div style={{ height:3, background:'rgba(255,255,255,.15)', borderRadius:99, overflow:'hidden', marginBottom:14 }}>
                    <div style={{ height:'100%', width:`${33+demoSlide*30}%`, background:`linear-gradient(90deg,${R2},${R3})`, borderRadius:99, transition:'width .4s' }}/>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:11, color:'rgba(255,255,255,.6)' }}>
                    <span>0{demoSlide+1} / 12</span><span style={{ color:'#fff' }}>▮▮</span><span>02:14</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ position:'absolute', top:40, left:-50, background:S, backdropFilter:'blur(10px)', border:`1px solid ${B}`, borderRadius:99, padding:'8px 14px', fontSize:12, color:T, display:'inline-flex', gap:8, boxShadow:'0 8px 24px rgba(0,0,0,.3)' }}><span style={{ color:'#ffa726' }}>★</span> Stories prontos pra Instagram</div>
            <div style={{ position:'absolute', bottom:80, right:-30, background:S, backdropFilter:'blur(10px)', border:`1px solid ${B}`, borderRadius:99, padding:'8px 14px', fontSize:12, color:T, display:'inline-flex', gap:8, boxShadow:'0 8px 24px rgba(0,0,0,.3)' }}><span style={{ color:R2 }}>♥</span> Música personalizada</div>
            <div style={{ position:'absolute', top:'45%', right:-70, background:S, backdropFilter:'blur(10px)', border:`1px solid ${B}`, borderRadius:99, padding:'8px 14px', fontSize:12, color:T, display:'inline-flex', gap:8, boxShadow:'0 8px 24px rgba(0,0,0,.3)' }}><span style={{ color:'#7dd3fc' }}>✦</span> Céu da data exata</div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="section-pad" id="como-funciona" style={{ padding:'120px 56px' }}>
        <SectionHead eyebrow="Como funciona">Em 4 passos. <span style={{ color:TS }}>De uma ideia a um link em 5 minutos.</span></SectionHead>
        <div className="how-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:32, position:'relative', maxWidth:1100, margin:'0 auto' }}>
          <div style={{ position:'absolute', top:24, left:'12%', right:'12%', height:1, background:`linear-gradient(90deg,transparent,${B},transparent)` }}/>
          {[['01','Personalize','Textos, fotos, música, cores. Você manda em tudo.'],['02','Marque a data','Quando o link revela? Hoje? Aniversário? Daqui 3 meses?'],['03','Compartilhe','Link único + QR Code para WhatsApp ou impressão.'],['04','Emocione','A pessoa abre. O resto é amor.']].map(([n,t,d])=>(
            <div key={n} style={{ textAlign:'center' }}>
              <div style={{ width:48, height:48, borderRadius:99, background:`linear-gradient(135deg,${R},#8b3a50)`, display:'grid', placeItems:'center', margin:'0 auto 20px', fontFamily:'Fraunces,serif', fontWeight:600, color:'#fff', position:'relative', zIndex:1, boxShadow:`0 8px 24px -6px ${G}` }}>{n}</div>
              <div style={{ fontFamily:'Fraunces,serif', fontSize:'1.3rem', color:T, marginBottom:8 }}>{t}</div>
              <div style={{ fontSize:14, color:TS, lineHeight:1.6 }}>{d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TEMPLATES */}
      <section className="section-pad" id="templates" style={{ padding:'120px 56px', background:S, borderTop:`1px solid ${B}`, borderBottom:`1px solid ${B}` }}>
        <SectionHead eyebrow="Três formatos">O presente certo <span style={{ color:TS }}>para cada momento.</span></SectionHead>
        <div className="tpl-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24, maxWidth:1280, margin:'0 auto', alignItems:'stretch' }}>
          {tpls.map(t=>{ const P=t.Preview; return (
            <article key={t.name} style={{ background:S, border:t.featured?`1.5px solid ${R}`:`1px solid ${B}`, borderRadius:24, display:'flex', flexDirection:'column', boxShadow:t.featured?`0 24px 64px -20px ${G}`:'0 8px 24px -12px rgba(0,0,0,.15)', position:'relative', transform:t.featured?'translateY(-8px)':'none', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:14, right:14, zIndex:2, fontSize:9, letterSpacing:1.4, fontWeight:700, color:t.featured?'#fff':TS, background:t.featured?R:'rgba(5, 5, 5, 0.85)', padding:'5px 10px', borderRadius:99 }}>{t.label}</div>
              <div style={{ position:'relative', width:'100%', aspectRatio:'4/3', background:t.bg, boxShadow:'inset 0 -40px 60px -30px rgba(0,0,0,.4)', overflow:'hidden' }}>
                <P/><div style={{ position:'absolute', inset:0, background:`radial-gradient(circle at 50% 100%,${t.glow},transparent 60%)`, pointerEvents:'none' }}/>
              </div>
              <div style={{ padding:'28px 28px 32px', display:'flex', flexDirection:'column', flex:1 }}>
                <div style={{ fontSize:11, letterSpacing:1.5, textTransform:'uppercase', color:TS, marginBottom:8, fontWeight:600 }}>{t.duration}</div>
                <h3 style={{ fontFamily:'Fraunces,serif', fontSize:'1.7rem', fontWeight:400, color:T, margin:'0 0 6px' }}>{t.name}</h3>
                <div style={{ fontFamily:'Fraunces,serif', fontStyle:'italic', fontSize:'1rem', color:R, marginBottom:14 }}>{t.tagline}</div>
                <p style={{ fontSize:14, color:TS, lineHeight:1.6, margin:'0 0 18px' }}>{t.desc}</p>
                <ul style={{ listStyle:'none', padding:0, margin:'0 0 22px', borderTop:`1px solid ${B}` }}>
                  {t.features.map(f=>(<li key={f} style={{ padding:'10px 0', fontSize:13, color:T, opacity:.85, display:'flex', gap:10, borderBottom:`1px solid ${B}` }}><span style={{ color:R, flexShrink:0 }}>✓</span><span>{f}</span></li>))}
                </ul>
                <div style={{ marginTop:'auto' }}>
                  <div style={{ fontSize:13, color:TS, marginBottom:14, display:'flex', justifyContent:'space-between', alignItems:'baseline' }}><span style={{ fontWeight:600, color:T }}>{t.price}</span><span style={{ fontSize:11 }}>{t.pv}</span></div>
                  <Link href={t.href} style={{ background:t.featured?R:'transparent', color:t.featured?'#fff':T, padding:'13px 22px', borderRadius:99, fontSize:13, fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center', gap:8, border:t.featured?'none':`1.5px solid ${B}`, boxShadow:t.featured?`0 12px 28px -8px ${G}`:'none' }}>Ver exemplo ao vivo →</Link>
                </div>
              </div>
            </article>
          )})}
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="section-pad" style={{ padding:'120px 56px', textAlign:'center', maxWidth:1000, margin:'0 auto' }}>
        <div className="stats-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:32, marginBottom:80, padding:'40px 0', borderTop:`1px solid ${B}`, borderBottom:`1px solid ${B}` }}>
          {[['12.400+','presentes criados'],['★ 4.9','nota média'],['97%','recomendam'],['5 min','para criar']].map(([n,l])=>(
            <div key={l}><div style={{ fontFamily:'Fraunces,serif', fontSize:'2.6rem', color:T, fontWeight:400, marginBottom:6 }}>{n}</div><div style={{ fontSize:13, color:TS }}>{l}</div></div>
          ))}
        </div>
        <blockquote style={{ fontFamily:'Fraunces,serif', fontSize:'clamp(1.5rem,2.6vw,2.2rem)', fontWeight:400, lineHeight:1.35, color:T, margin:'0 0 32px' }}>
          &ldquo;Minha mãe abriu o link, ficou em silêncio, depois <em style={{ color:R, fontStyle:'italic' }}>chorou por 10 minutos</em>. Disse que foi o presente mais lindo que já recebeu na vida.&rdquo;
        </blockquote>
        <div style={{ display:'inline-flex', gap:14, alignItems:'center' }}>
          <div style={{ width:48, height:48, borderRadius:99, background:`linear-gradient(135deg,${R2},${R})` }}/>
          <div style={{ textAlign:'left' }}><div style={{ fontWeight:600, color:T }}>Ana Clara, 28</div><div style={{ fontSize:13, color:TS }}>presente para a mãe · São Paulo</div></div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-pad" style={{ padding:'0 56px 100px', maxWidth:1200, margin:'0 auto' }}>
        <div className="test-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
          {[['Surpreendi minha namorada no Dia dos Namorados. A reação dela…','Rafael M.'],['Comprei o combo, fiz pro meu pai e ainda sobrou crédito.','Juliana K.'],['Imprimi o QR Code, colei dentro de um cartão. Ela travou.','Pedro H.']].map(([q,n])=>(
            <div key={n} style={{ background:S, border:`1px solid ${B}`, borderRadius:20, padding:28 }}>
              <div style={{ color:'#ffa726', fontSize:13, marginBottom:10 }}>★★★★★</div>
              <p style={{ fontSize:14, lineHeight:1.65, color:T, marginBottom:18, opacity:.9 }}>{q}</p>
              <div style={{ fontSize:13, color:TS }}>— {n}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="section-pad" id="precos" style={{ padding:'120px 56px' }}>
        <SectionHead eyebrow="Preços">Pague uma vez. <span style={{ color:TS }}>Sem mensalidade. Sem pegadinha.</span></SectionHead>
        <div className="price-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20, maxWidth:1100, margin:'0 auto' }}>
          {prices.map(c=>(
            <div key={c.name} style={{ background:c.featured?'linear-gradient(180deg,rgba(232,98,122,.25),rgba(40,20,30,.9))':S, border:`1px solid ${c.featured?R:B}`, borderRadius:24, padding:36, position:'relative', display:'flex', flexDirection:'column', transform:c.featured?'scale(1.04)':'none', boxShadow:c.featured?`0 24px 64px -16px ${G}`:'none' }}>
              {c.featured && <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', background:R, color:'#fff', padding:'5px 16px', borderRadius:99, fontSize:11, fontWeight:600 }}>Mais escolhido</div>}
              <div style={{ fontFamily:'Fraunces,serif', fontSize:'1.4rem', marginBottom:14, color:T }}>{c.name}</div>
              <div style={{ fontFamily:'Fraunces,serif', fontSize:'2.8rem', color:R, fontWeight:500, lineHeight:1 }}>R$ {c.price}</div>
              <div style={{ fontSize:13, color:TS, marginBottom:28, marginTop:6 }}>{c.desc}</div>
              <ul style={{ listStyle:'none', padding:0, margin:'0 0 28px', flex:1 }}>
                {c.features.map(x=>(<li key={x} style={{ padding:'10px 0', borderTop:`1px solid ${B}`, fontSize:13, color:T, opacity:.9, display:'flex', gap:10 }}><span style={{ color:R }}>✓</span> {x}</li>))}
              </ul>
              <Link href="/cadastro" style={c.featured?{ background:R, color:'#fff', padding:14, borderRadius:12, textAlign:'center' as const, fontWeight:600, fontSize:14, display:'block', boxShadow:`0 8px 24px -6px ${G}` }:{ padding:14, borderRadius:12, textAlign:'center' as const, fontWeight:600, fontSize:14, border:`1.5px solid ${B}`, color:T, display:'block' }}>{c.featured?'Quero esse':'Começar'} →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="section-pad" id="faq" style={{ padding:'120px 56px', background:S }}>
        <SectionHead eyebrow="Dúvidas">Tem alguma dúvida? <span style={{ color:TS }}>Provavelmente respondida.</span></SectionHead>
        <div style={{ maxWidth:760, margin:'0 auto' }}>
          {faqs.map(([q,a],i)=>(
            <details key={q} {...(i===0?{open:true}:{})} style={{ background:'rgba(255,255,255,.03)', borderRadius:14, padding:'18px 24px', marginBottom:8, border:`1px solid ${B}`, cursor:'pointer' }}>
              <summary style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontWeight:600, fontSize:15, color:T, listStyle:'none' }}>{q}<span className="faq-plus" style={{ color:R, fontSize:'1.4rem', fontWeight:300, transition:'transform .2s' }}>+</span></summary>
              <p style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${B}`, fontSize:14, color:TS, lineHeight:1.6, marginBottom:0 }}>{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="section-pad" style={{ padding:'140px 56px', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div aria-hidden="true" style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:800, height:400, borderRadius:'50%', background:`radial-gradient(ellipse,${G},transparent 70%)`, filter:'blur(40px)', pointerEvents:'none' }}/>
        <h2 style={{ fontFamily:'Fraunces,serif', fontSize:'clamp(2.4rem,4.5vw,4.5rem)', fontWeight:400, lineHeight:1.05, letterSpacing:'-.02em', color:T, position:'relative', margin:'0 0 40px' }}>
          Em 5 minutos<br/><span style={{ fontStyle:'italic', background:`linear-gradient(135deg,${R2},${R3})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', filter:`drop-shadow(0 0 24px ${G})` }}>vocês têm um momento eterno.</span>
        </h2>
        <Link href="/cadastro" style={{ background:R, color:'white', padding:'18px 36px', borderRadius:99, fontSize:'1.05rem', fontWeight:600, display:'inline-flex', alignItems:'center', gap:10, position:'relative', boxShadow:`0 16px 40px -10px ${G}` }}>Criar meu presente agora <span>→</span></Link>
        <p style={{ fontSize:13, color:TS, marginTop:18, position:'relative' }}>R$ 5,90 · sem mensalidade · sem cartão recorrente</p>
      </section>

      {/* FOOTER */}
      <footer style={{ padding:56, textAlign:'center', borderTop:`1px solid ${B}`, fontSize:13, color:TS }}>
        <div style={{ fontFamily:'Fraunces,serif', fontSize:'1.4rem', color:T }}>presentim<span style={{ color:R }}>·</span></div>
        <p style={{ opacity:.7, marginTop:8 }}>Feito com 💝 para eternizar momentos especiais</p>
        <div style={{ marginTop:16, display:'flex', gap:20, justifyContent:'center' }}>
          <Link href="/termos" style={{ color:TS }}>Termos de uso</Link>
          <Link href="/privacidade" style={{ color:TS }}>Privacidade</Link>
          <Link href="/contato" style={{ color:TS }}>Contato</Link>
          <Link href="/historia" style={{ color:TS }}>História</Link>
        </div>
      </footer>
    </div>
  </>)
}