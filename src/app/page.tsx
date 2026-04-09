'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// ─── Floating petals background ───────────────────────────────────────────────
function Petals() {
  const [petals, setPetals] = useState<Array<{
    id: number; left: string; delay: string; duration: string; size: string; emoji: string
  }>>([])

  useEffect(() => {
    setPetals(Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${6 + Math.random() * 6}s`,
      size: `${12 + Math.random() * 16}px`,
      emoji: ['🌸', '✿', '❀', '🌷', '💮'][Math.floor(Math.random() * 5)],
    })))
  }, [])

  return (
    <div className="petals-container" aria-hidden="true">
      {petals.map((p) => (
        <span
          key={p.id}
          className="petal"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            fontSize: p.size,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  )
}

// ─── Testimonials data ─────────────────────────────────────────────────────────
const testimonials = [
  {
    name: 'Ana Clara',
    avatar: '👩‍🦰',
    text: 'Fiz um presente para minha mãe no aniversário dela. Ela chorou de emoção! Nunca vi algo tão carinhoso.',
    stars: 5,
  },
  {
    name: 'Rafael M.',
    avatar: '👨',
    text: 'Surprendi minha namorada no dia dos namorados com um link personalizado. Foi incrível ver a reação dela.',
    stars: 5,
  },
  {
    name: 'Juliana K.',
    avatar: '👩',
    text: 'Super fácil de configurar e o resultado ficou lindo. Comprei o combo e ainda tenho presentes sobrando!',
    stars: 5,
  },
  {
    name: 'Pedro H.',
    avatar: '🧑',
    text: 'A minha amiga ficou sem acreditar quando abriu o link. O efeito de contagem regressiva é demais!',
    stars: 5,
  },
]

// ─── FAQ data ─────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: 'Preciso saber programar para usar?',
    a: 'Não! O Presentim foi feito para qualquer pessoa. Você preenche um formulário simples, adiciona suas fotos e textos, e o site gera tudo automaticamente.',
  },
  {
    q: 'Por quanto tempo o link fica ativo?',
    a: 'Por 3 meses a partir da data de criação. Tempo mais que suficiente para o presente ser visto e guardado com carinho.',
  },
  {
    q: 'Posso editar o presente depois de criar?',
    a: 'Sim! Você pode editar textos, fotos e configurações a qualquer momento pelo seu painel.',
  },
  {
    q: 'Os créditos expiram?',
    a: 'Não! Seus créditos ficam disponíveis para sempre. Compre agora e use quando quiser.',
  },
  {
    q: 'Funciona no celular?',
    a: 'Perfeitamente! Tanto a criação quanto a visualização do presente são totalmente adaptadas para celular.',
  },
]

// ─── FAQ Item ─────────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className={`faq-item ${open ? 'open' : ''}`}
      onClick={() => setOpen(!open)}
    >
      <div className="faq-question">
        <span>{q}</span>
        <span className="faq-icon">{open ? '−' : '+'}</span>
      </div>
      {open && <div className="faq-answer">{a}</div>}
    </div>
  )
}

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --rose:      #e8627a;
          --rose-light:#f9a8b8;
          --rose-pale: #fdf0f3;
          --rose-mid:  #fce4ea;
          --cream:     #fff8f9;
          --text:      #3d1f28;
          --text-soft: #7a4f5a;
          --gold:      #c9956a;
        }

        html { scroll-behavior: smooth; }

        body {
          font-family: 'Lato', sans-serif;
          background: var(--cream);
          color: var(--text);
          overflow-x: hidden;
        }

        /* ── Petals ── */
        .petals-container {
          position: fixed; inset: 0;
          pointer-events: none; z-index: 0;
          overflow: hidden;
        }
        .petal {
          position: absolute; top: -40px;
          animation: fall linear infinite;
          opacity: 0.55;
          user-select: none;
        }
        @keyframes fall {
          0%   { transform: translateY(-40px) rotate(0deg);   opacity: 0; }
          10%  { opacity: 0.55; }
          90%  { opacity: 0.3; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }

        /* ── Navbar ── */
        nav {
          position: fixed; top: 0; left: 0; right: 0;
          z-index: 100;
          padding: 18px 48px;
          display: flex; align-items: center; justify-content: space-between;
          transition: background .3s, box-shadow .3s;
        }
        nav.scrolled {
          background: rgba(253,240,243,.92);
          backdrop-filter: blur(12px);
          box-shadow: 0 2px 20px rgba(232,98,122,.12);
        }
        .nav-logo {
          font-family: 'Playfair Display', serif;
          font-size: 1.7rem; font-weight: 700;
          color: var(--rose);
          text-decoration: none;
          letter-spacing: -0.5px;
        }
        .nav-logo span { color: var(--gold); }
        .nav-links { display: flex; gap: 32px; align-items: center; }
        .nav-links a {
          font-size: .9rem; font-weight: 400;
          color: var(--text-soft); text-decoration: none;
          transition: color .2s;
        }
        .nav-links a:hover { color: var(--rose); }
        .btn-nav {
          background: var(--rose);
          color: white !important;
          padding: 10px 24px;
          border-radius: 50px;
          font-weight: 700 !important;
          transition: background .2s, transform .2s !important;
          box-shadow: 0 4px 14px rgba(232,98,122,.35);
        }
        .btn-nav:hover {
          background: #d44d66 !important;
          transform: translateY(-1px) !important;
        }

        /* ── Hero ── */
        .hero {
          min-height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center;
          padding: 120px 24px 80px;
          position: relative; z-index: 1;
          background: radial-gradient(ellipse 80% 60% at 50% 0%, #fce4ea 0%, transparent 70%);
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: white;
          border: 1px solid var(--rose-light);
          border-radius: 50px;
          padding: 6px 18px;
          font-size: .8rem; color: var(--rose);
          font-weight: 700; letter-spacing: .5px;
          margin-bottom: 28px;
          box-shadow: 0 2px 12px rgba(232,98,122,.1);
          animation: fadeUp .7s ease both;
        }
        .hero h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.8rem, 7vw, 5.5rem);
          line-height: 1.1;
          color: var(--text);
          max-width: 800px;
          animation: fadeUp .7s .1s ease both;
        }
        .hero h1 em {
          font-style: italic; color: var(--rose);
          position: relative;
        }
        .hero h1 em::after {
          content: '';
          position: absolute; bottom: 2px; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--rose-light), var(--rose));
          border-radius: 2px;
        }
        .hero-sub {
          margin-top: 24px;
          font-size: 1.15rem; color: var(--text-soft);
          max-width: 520px; line-height: 1.7;
          font-weight: 300;
          animation: fadeUp .7s .2s ease both;
        }
        .hero-ctas {
          margin-top: 44px;
          display: flex; gap: 16px; flex-wrap: wrap; justify-content: center;
          animation: fadeUp .7s .3s ease both;
        }
        .btn-primary {
          background: linear-gradient(135deg, var(--rose), #c94f68);
          color: white;
          padding: 16px 40px;
          border-radius: 50px;
          font-size: 1rem; font-weight: 700;
          text-decoration: none;
          box-shadow: 0 8px 28px rgba(232,98,122,.4);
          transition: transform .2s, box-shadow .2s;
          display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 36px rgba(232,98,122,.5);
        }
        .btn-secondary {
          background: white;
          color: var(--rose);
          padding: 16px 32px;
          border-radius: 50px;
          font-size: 1rem; font-weight: 700;
          text-decoration: none;
          border: 2px solid var(--rose-light);
          transition: border-color .2s, transform .2s;
        }
        .btn-secondary:hover {
          border-color: var(--rose);
          transform: translateY(-2px);
        }
        .hero-note {
          margin-top: 20px;
          font-size: .82rem; color: var(--text-soft);
          animation: fadeUp .7s .4s ease both;
        }

        /* Mock preview */
        .hero-preview {
          margin-top: 72px;
          position: relative;
          animation: fadeUp .9s .5s ease both;
          width: 100%; max-width: 680px;
        }
        .mock-phone {
          background: white;
          border-radius: 28px;
          box-shadow: 0 32px 80px rgba(61,31,40,.15), 0 0 0 1px var(--rose-mid);
          overflow: hidden;
          padding: 24px;
        }
        .mock-top {
          background: linear-gradient(135deg, #fce4ea, #fdf0f3);
          border-radius: 16px;
          padding: 32px 24px;
          text-align: center;
        }
        .mock-countdown {
          display: flex; gap: 12px; justify-content: center; margin-bottom: 20px;
        }
        .mock-box {
          background: white;
          border-radius: 12px;
          padding: 10px 16px;
          box-shadow: 0 2px 8px rgba(232,98,122,.1);
        }
        .mock-box .num {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem; font-weight: 700; color: var(--rose);
          display: block;
        }
        .mock-box .label {
          font-size: .65rem; color: var(--text-soft); letter-spacing: .5px;
        }
        .mock-btn {
          background: var(--rose); color: white;
          border-radius: 12px; padding: 12px 32px;
          font-weight: 700; font-size: 1rem;
          display: inline-block; margin-top: 8px;
        }

        /* ── Section shared ── */
        section { position: relative; z-index: 1; }
        .section-label {
          font-size: .75rem; font-weight: 700; letter-spacing: 2px;
          color: var(--rose); text-transform: uppercase;
          margin-bottom: 12px;
        }
        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 4vw, 3rem);
          color: var(--text); line-height: 1.2;
        }
        .section-title em { font-style: italic; color: var(--rose); }

        /* ── How it works ── */
        .how {
          padding: 100px 24px;
          background: white;
        }
        .how-inner { max-width: 1100px; margin: 0 auto; }
        .how-header { text-align: center; margin-bottom: 64px; }
        .how-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 32px;
        }
        .step {
          background: var(--rose-pale);
          border-radius: 24px;
          padding: 40px 32px;
          text-align: center;
          border: 1px solid var(--rose-mid);
          transition: transform .25s, box-shadow .25s;
          position: relative; overflow: hidden;
        }
        .step::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--rose-light), var(--rose));
        }
        .step:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(232,98,122,.12); }
        .step-num {
          width: 52px; height: 52px;
          background: linear-gradient(135deg, var(--rose-light), var(--rose));
          color: white;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem; font-weight: 700;
          margin: 0 auto 20px;
          box-shadow: 0 6px 18px rgba(232,98,122,.3);
        }
        .step h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem; color: var(--text);
          margin-bottom: 12px;
        }
        .step p { font-size: .92rem; color: var(--text-soft); line-height: 1.7; }
        .step-emoji { font-size: 2.2rem; margin-bottom: 16px; }

        /* ── Pricing ── */
        .pricing {
          padding: 100px 24px;
          background: linear-gradient(180deg, var(--rose-pale) 0%, white 100%);
        }
        .pricing-inner { max-width: 900px; margin: 0 auto; }
        .pricing-header { text-align: center; margin-bottom: 56px; }
        .pricing-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }
        .price-card {
          background: white;
          border-radius: 28px;
          padding: 44px 36px;
          border: 2px solid var(--rose-mid);
          position: relative;
          transition: transform .25s, box-shadow .25s;
        }
        .price-card:hover { transform: translateY(-6px); box-shadow: 0 24px 56px rgba(232,98,122,.12); }
        .price-card.featured {
          border-color: var(--rose);
          box-shadow: 0 16px 48px rgba(232,98,122,.18);
        }
        .badge-featured {
          position: absolute; top: -14px; left: 50%; transform: translateX(-50%);
          background: linear-gradient(135deg, var(--rose), #c94f68);
          color: white;
          padding: 5px 20px; border-radius: 50px;
          font-size: .75rem; font-weight: 700; letter-spacing: .5px;
          white-space: nowrap;
        }
        .price-card h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem; color: var(--text);
          margin-bottom: 8px;
        }
        .price-card .price {
          font-size: 3rem; font-weight: 700; color: var(--rose);
          font-family: 'Playfair Display', serif;
          line-height: 1;
          margin: 20px 0 4px;
        }
        .price-card .price sup { font-size: 1.4rem; vertical-align: super; }
        .price-card .price-desc { font-size: .85rem; color: var(--text-soft); margin-bottom: 28px; }
        .price-features { list-style: none; margin-bottom: 32px; }
        .price-features li {
          padding: 10px 0;
          border-bottom: 1px solid var(--rose-pale);
          font-size: .92rem; color: var(--text-soft);
          display: flex; align-items: center; gap: 10px;
        }
        .price-features li:last-child { border: none; }
        .price-features li::before { content: '✦'; color: var(--rose); font-size: .7rem; }
        .btn-buy {
          display: block; width: 100%;
          background: linear-gradient(135deg, var(--rose), #c94f68);
          color: white; text-align: center;
          padding: 14px; border-radius: 14px;
          font-weight: 700; font-size: 1rem;
          text-decoration: none;
          transition: opacity .2s, transform .2s;
          box-shadow: 0 6px 20px rgba(232,98,122,.3);
        }
        .btn-buy:hover { opacity: .9; transform: translateY(-1px); }
        .btn-buy.outline {
          background: transparent;
          border: 2px solid var(--rose);
          color: var(--rose);
          box-shadow: none;
        }
        .btn-buy.outline:hover { background: var(--rose-pale); }

        /* ── Testimonials ── */
        .testimonials {
          padding: 100px 24px;
          background: white;
        }
        .testimonials-inner { max-width: 1100px; margin: 0 auto; }
        .testimonials-header { text-align: center; margin-bottom: 56px; }
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
        }
        .tcard {
          background: var(--rose-pale);
          border-radius: 20px;
          padding: 28px;
          border: 1px solid var(--rose-mid);
          transition: transform .2s;
        }
        .tcard:hover { transform: translateY(-4px); }
        .tcard-top { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .tcard-avatar {
          width: 44px; height: 44px;
          background: var(--rose-mid);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.4rem;
        }
        .tcard-name { font-weight: 700; color: var(--text); font-size: .95rem; }
        .tcard-stars { color: var(--gold); font-size: .85rem; }
        .tcard p { font-size: .9rem; color: var(--text-soft); line-height: 1.7; font-style: italic; }
        .tcard p::before { content: '"'; font-size: 1.4rem; color: var(--rose-light); font-family: 'Playfair Display', serif; }

        /* ── FAQ ── */
        .faq {
          padding: 100px 24px;
          background: var(--rose-pale);
        }
        .faq-inner { max-width: 720px; margin: 0 auto; }
        .faq-header { text-align: center; margin-bottom: 48px; }
        .faq-item {
          background: white;
          border-radius: 16px;
          margin-bottom: 12px;
          padding: 20px 24px;
          cursor: pointer;
          border: 1px solid var(--rose-mid);
          transition: box-shadow .2s;
        }
        .faq-item:hover { box-shadow: 0 4px 20px rgba(232,98,122,.1); }
        .faq-question {
          display: flex; justify-content: space-between; align-items: center;
          font-weight: 700; color: var(--text); font-size: .95rem;
        }
        .faq-icon { color: var(--rose); font-size: 1.4rem; font-weight: 300; }
        .faq-answer {
          margin-top: 14px; padding-top: 14px;
          border-top: 1px solid var(--rose-pale);
          font-size: .9rem; color: var(--text-soft); line-height: 1.7;
        }

        /* ── CTA Final ── */
        .cta-final {
          padding: 120px 24px;
          background: linear-gradient(135deg, #f9c5d0 0%, #fce4ea 50%, #fdf0f3 100%);
          text-align: center;
          position: relative; overflow: hidden;
        }
        .cta-final::before {
          content: '💝';
          position: absolute; font-size: 20rem;
          opacity: .05; top: -40px; right: -60px;
          pointer-events: none;
        }
        .cta-final h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 5vw, 3.5rem);
          color: var(--text); margin-bottom: 20px; line-height: 1.2;
        }
        .cta-final h2 em { font-style: italic; color: var(--rose); }
        .cta-final p {
          font-size: 1.1rem; color: var(--text-soft);
          max-width: 480px; margin: 0 auto 44px; line-height: 1.7;
        }

        /* ── Footer ── */
        footer {
          background: var(--text);
          color: rgba(255,255,255,.6);
          text-align: center;
          padding: 40px 24px;
          font-size: .85rem;
        }
        footer a { color: var(--rose-light); text-decoration: none; }
        footer .footer-logo {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem; color: white;
          margin-bottom: 12px; display: block;
        }

        /* ── Animations ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          nav { padding: 16px 20px; }
          .nav-links { gap: 16px; }
          .nav-links a:not(.btn-nav) { display: none; }
        }
      `}</style>

      <Petals />

      {/* NAVBAR */}
      <nav className={scrolled ? 'scrolled' : ''}>
        <Link href="/" className="nav-logo">Presenti<span>m</span></Link>
        <div className="nav-links">
          <a href="#como-funciona">Como funciona</a>
          <a href="#precos">Preços</a>
          <a href="#faq">FAQ</a>
          <Link href="/historia">História</Link>
          <Link href="/demo">Ver demo</Link>
          <Link href="/cadastro" className="btn-nav">Criar presente 🎁</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-badge">✨ Presente virtual que emociona de verdade</div>
        <h1>
          Surpreenda quem você<br />
          <em>ama de verdade</em>
        </h1>
        <p className="hero-sub">
          Crie uma <strong>Página Virtual</strong> ou uma <strong>Retrospectiva animada</strong> com fotos, músicas e mensagens. Compartilhe um link único — e veja a emoção no rosto de quem você ama.
        </p>
        <div className="hero-ctas">
          <Link href="/cadastro" className="btn-primary">Criar meu presente 💝</Link>
          <Link href="/demo" className="btn-secondary">Ver exemplos 👀</Link>
        </div>
        <p className="hero-note">🔒 Sem assinatura — pague só pelo que usar</p>

        {/* Mock preview */}
        <div className="hero-preview">
          <div className="mock-phone">
            <div className="mock-top">
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', color: 'var(--text-soft)', marginBottom: 16 }}>
                Sua surpresa está quase chegando…
              </p>
              <div className="mock-countdown">
                {[['02', 'dias'], ['14', 'horas'], ['37', 'min'], ['09', 's']].map(([n, l]) => (
                  <div className="mock-box" key={l}>
                    <span className="num">{n}</span>
                    <span className="label">{l}</span>
                  </div>
                ))}
              </div>
              <div className="mock-btn">Vamos lá 🎁</div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how" id="como-funciona">
        <div className="how-inner">
          <div className="how-header">
            <p className="section-label">Como funciona</p>
            <h2 className="section-title">Tão simples quanto <em>escrever uma carta</em></h2>
          </div>
          <div className="how-steps">
            {[
              { n: '1', emoji: '✍️', title: 'Personalize', desc: 'Escreva textos, escolha cores, adicione fotos e uma música especial. Tudo no seu jeito.' },
              { n: '2', emoji: '📅', title: 'Defina a data', desc: 'Escolha quando o presente será revelado. Uma contagem regressiva vai aumentar a expectativa!' },
              { n: '3', emoji: '🔗', title: 'Compartilhe', desc: 'Receba um link único e um QR Code para enviar por WhatsApp, e-mail ou imprimir.' },
              { n: '4', emoji: '💝', title: 'Emocione', desc: 'A pessoa abre o link e vive uma experiência única, com fotos e mensagens animadas.' },
            ].map((s) => (
              <div className="step" key={s.n}>
                <div className="step-emoji">{s.emoji}</div>
                <div className="step-num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RETROSPECTIVA */}
      <section style={{ padding:'100px 24px', background:'linear-gradient(135deg,#1a0a2e,#2d1155)', position:'relative', zIndex:1, overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(248,87,166,.15), transparent)', pointerEvents:'none' }} />
        <div style={{ maxWidth:1000, margin:'0 auto', textAlign:'center', position:'relative' }}>
          <p style={{ fontSize:'.75rem', fontWeight:700, letterSpacing:'2px', color:'rgba(248,87,166,.8)', textTransform:'uppercase', marginBottom:12 }}>Novo</p>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(2rem,4vw,3rem)', color:'white', lineHeight:1.2, marginBottom:20 }}>
            Retrospectiva <em style={{ fontStyle:'italic', background:'linear-gradient(135deg,#f857a6,#ffa726)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>animada</em>
          </h2>
          <p style={{ color:'rgba(255,255,255,.5)', fontSize:'1rem', lineHeight:1.7, maxWidth:520, margin:'0 auto 56px' }}>
            Mais do que um presente — uma experiência completa que conta a história do casal slide por slide.
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:20, marginBottom:48 }}>
            {[
              { emoji:'🌌', title:'Céu estrelado', desc:'Veja o céu exato da data especial do casal' },
              { emoji:'🏆', title:'Conquistas', desc:'Marcos do relacionamento em raridades épicas' },
              { emoji:'📸', title:'Carrossel de fotos', desc:'Fotos animadas em slides cinematográficos' },
              { emoji:'📲', title:'Stories', desc:'Exporte slides prontos para o Instagram' },
            ].map(f => (
              <div key={f.title} style={{ background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', borderRadius:20, padding:'28px 20px', textAlign:'center' }}>
                <div style={{ fontSize:'2rem', marginBottom:12 }}>{f.emoji}</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.05rem', color:'white', marginBottom:8 }}>{f.title}</div>
                <div style={{ fontSize:'.82rem', color:'rgba(255,255,255,.4)', lineHeight:1.5 }}>{f.desc}</div>
              </div>
            ))}
          </div>
          <Link href="/cadastro" style={{ display:'inline-flex', alignItems:'center', gap:10, background:'linear-gradient(135deg,#f857a6,#ff5858)', color:'white', padding:'16px 40px', borderRadius:50, fontWeight:700, fontSize:'1rem', textDecoration:'none', boxShadow:'0 8px 28px rgba(248,87,166,.4)' }}>
            Criar minha Retrospectiva 💫
          </Link>
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing" id="precos">
        <div className="pricing-inner">
          <div className="pricing-header">
            <p className="section-label">Preços</p>
            <h2 className="section-title">Simples e <em>sem surpresas</em></h2>
            <p style={{ color: 'var(--text-soft)', marginTop: 12, fontSize: '.95rem' }}>
              Sem mensalidade. Pague uma vez e crie quando quiser.
            </p>
          </div>
          {/* Como funciona os créditos */}
          <div style={{ display:'flex', justifyContent:'center', gap:8, flexWrap:'wrap', marginBottom:40 }}>
            {[
              { icon:'🎁', label:'Página Virtual', cost:'1 crédito' },
              { icon:'💫', label:'Retrospectiva', cost:'2 créditos' },
              { icon:'✨', label:'Links ativos', cost:'por 3 meses' },
            ].map(item => (
              <div key={item.label} style={{ display:'flex', alignItems:'center', gap:8, background:'white', border:'1.5px solid var(--rose-mid)', borderRadius:50, padding:'.4rem 1rem', fontSize:'.8rem', color:'var(--text-soft)', boxShadow:'0 1px 4px rgba(232,98,122,.07)' }}>
                {item.icon} <strong style={{ color:'var(--text)' }}>{item.label}</strong> = <span style={{ color:'var(--rose)', fontWeight:700 }}>{item.cost}</span>
              </div>
            ))}
          </div>

          <div className="pricing-cards" style={{ gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))' }}>
            {/* Starter */}
            <div className="price-card">
              <h3>Starter</h3>
              <p style={{ color:'var(--text-soft)', fontSize:'.9rem' }}>Para uma ocasião especial</p>
              <div className="price"><sup>R$</sup>5<span style={{ fontSize:'1.6rem' }}>,90</span></div>
              <p className="price-desc">1 crédito · pagamento único</p>
              <ul className="price-features">
                <li>1 Página Virtual completa</li>
                <li>Fotos, frases e música</li>
                <li>Link eterno + QR Code</li>
                <li>Contagem regressiva</li>
              </ul>
              <Link href="/cadastro" className="btn-buy outline">Começar agora</Link>
            </div>

            {/* Popular */}
            <div className="price-card featured">
              <span className="badge-featured">⭐ Mais popular</span>
              <h3>Popular</h3>
              <p style={{ color:'var(--text-soft)', fontSize:'.9rem' }}>Para criar mais de um presente</p>
              <div className="price"><sup>R$</sup>14<span style={{ fontSize:'1.6rem' }}>,90</span></div>
              <p className="price-desc">3 créditos · R$4,97 por crédito</p>
              <ul className="price-features">
                <li>1 Retrospectiva + 1 Página</li>
                <li>Slides animados + conquistas</li>
                <li>Exportar para Stories</li>
                <li>Créditos nunca expiram</li>
              </ul>
              <Link href="/cadastro" className="btn-buy">Quero esse 💫</Link>
            </div>

            {/* Max */}
            <div className="price-card">
              <span className="badge-featured" style={{ background:'linear-gradient(135deg,#ffa726,#e8627a)' }}>🔥 Melhor valor</span>
              <h3>Max</h3>
              <p style={{ color:'var(--text-soft)', fontSize:'.9rem' }}>Para quem ama presentear</p>
              <div className="price"><sup>R$</sup>24<span style={{ fontSize:'1.6rem' }}>,90</span></div>
              <p className="price-desc">6 créditos · R$4,15 por crédito</p>
              <ul className="price-features">
                <li>3 Retrospectivas completas</li>
                <li>OU 6 Páginas Virtuais</li>
                <li>Misture como quiser</li>
                <li>Créditos nunca expiram</li>
              </ul>
              <Link href="/cadastro" className="btn-buy outline">Quero o Max 💝</Link>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <div className="testimonials-inner">
          <div className="testimonials-header">
            <p className="section-label">Depoimentos</p>
            <h2 className="section-title">Momentos que <em>emocionaram</em></h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t) => (
              <div className="tcard" key={t.name}>
                <div className="tcard-top">
                  <div className="tcard-avatar">{t.avatar}</div>
                  <div>
                    <div className="tcard-name">{t.name}</div>
                    <div className="tcard-stars">{'★'.repeat(t.stars)}</div>
                  </div>
                </div>
                <p>{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq" id="faq">
        <div className="faq-inner">
          <div className="faq-header">
            <p className="section-label">Dúvidas</p>
            <h2 className="section-title">Perguntas <em>frequentes</em></h2>
          </div>
          {faqs.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-final">
        <h2>Pronto para criar um<br /><em>momento inesquecível?</em></h2>
        <p>Em menos de 5 minutos você cria um presente que a pessoa vai guardar para sempre.</p>
        <Link href="/cadastro" className="btn-primary" style={{ display: 'inline-flex', fontSize: '1.1rem', padding: '18px 48px' }}>
          Criar meu presente agora 💝
        </Link>
      </section>

      {/* FOOTER */}
      <footer>
        <span className="footer-logo">Presentim</span>
        <p>Feito com 💝 para eternizar momentos especiais</p>
        <p style={{ marginTop: 8 }}>
          <Link href="/termos">Termos de uso</Link> · <Link href="/privacidade">Privacidade</Link> · <Link href="/contato">Contato</Link> · <Link href="/historia">História</Link>
        </p>
      </footer>
    </>
  )
}