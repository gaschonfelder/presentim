'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function ContatoPage() {
  const [copiado, setCopiado] = useState(false)

  function copiar() {
    navigator.clipboard.writeText('presentim.sac@gmail.com')
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  const R = '#e8627a'
  const R2 = '#ff8da7'
  const R3 = '#ffa726'
  const G = 'rgba(232,98,122,.35)'
  const T = '#f5e8ec'
  const TS = 'rgba(245,232,236,.65)'
  const B = 'rgba(255,255,255,.08)'
  const S = 'rgba(255,255,255,.04)'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:#150810!important;color:#f5e8ec!important;font-family:'Inter',system-ui,sans-serif!important}
        a{color:inherit;text-decoration:none}
        @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .contato-fade{animation:fadeIn .6s ease both}
        .contato-fade-d1{animation-delay:.15s}
        .contato-fade-d2{animation-delay:.3s}
        @media(max-width:640px){
          .contato-nav{padding:0 20px!important}
          .contato-nav .nav-links-inner{display:none!important}
          .contato-page{padding:48px 24px 60px!important}
          .contato-page h1{font-size:1.8rem!important}
          .info-grid{grid-template-columns:1fr!important}
        }
      `}</style>

      <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden', background: '#150810', color: T, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 15 }}>
        {/* Ambient glows */}
        <div aria-hidden="true" style={{ position: 'absolute', top: -200, right: -200, width: 700, height: 700, borderRadius: '50%', background: `radial-gradient(circle,${G},transparent 65%)`, filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 600, left: -200, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(120,80,200,.22),transparent 65%)', filter: 'blur(40px)', pointerEvents: 'none', opacity: .8 }} />

        {/* NAV */}
        <header className="contato-nav" style={{ position: 'sticky', top: 0, zIndex: 50, display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 32, padding: '18px 56px', background: 'rgba(21,8,16,.65)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${B}` }}>
          <Link href="/">
            <Image src="/logo.png" alt="Presentim" width={1024} height={272} priority style={{ height: 38, width: 'auto', filter: 'brightness(0) invert(1)' }} />
          </Link>
          <nav className="nav-links-inner" style={{ display: 'flex', gap: 28, justifyContent: 'center' }}>
            <Link href="/#como-funciona" style={{ fontSize: 13, color: TS, fontWeight: 500 }}>Como funciona</Link>
            <Link href="/#precos" style={{ fontSize: 13, color: TS, fontWeight: 500 }}>Preços</Link>
            <Link href="/#faq" style={{ fontSize: 13, color: TS, fontWeight: 500 }}>FAQ</Link>
            <Link href="/historia" style={{ fontSize: 13, color: TS, fontWeight: 500 }}>História</Link>
            <Link href="/demo" style={{ fontSize: 13, color: TS, fontWeight: 500 }}>Ver demo</Link>
          </nav>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link href="/login" style={{ fontSize: 13, color: TS }}>Entrar</Link>
            <Link href="/cadastro" style={{ background: R, color: 'white', padding: '10px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, boxShadow: `0 8px 24px -8px ${G}` }}>Criar presente →</Link>
          </div>
        </header>

        {/* CONTENT */}
        <div className="contato-page" style={{ maxWidth: 640, margin: '0 auto', padding: '80px 24px 100px', textAlign: 'center', position: 'relative', zIndex: 1 }}>

          {/* Hero */}
          <div className="contato-fade">
            <div style={{ fontSize: '3.5rem', marginBottom: 24 }}>💌</div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 400, lineHeight: 1.15, letterSpacing: '-.02em', color: T, margin: '0 0 12px' }}>
              Fale com a{' '}
              <span style={{ fontStyle: 'italic', background: `linear-gradient(135deg,${R2},${R3})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>gente</span>
            </h1>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: TS, maxWidth: 440, margin: '0 auto 48px' }}>Tem alguma dúvida, sugestão ou problema? Estamos aqui para ajudar. Respondemos em até 1 dia útil.</p>
          </div>

          {/* Email card */}
          <div className="contato-fade contato-fade-d1" style={{ background: S, border: `1px solid ${B}`, borderRadius: 24, padding: '36px 32px', marginBottom: 32, boxShadow: `0 24px 64px -20px rgba(0,0,0,.3)` }}>
            <div style={{ fontSize: 11, letterSpacing: '.15em', textTransform: 'uppercase', color: TS, opacity: .7, marginBottom: 8 }}>Email de suporte</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '1.5rem', color: T, marginBottom: 24 }}>presentim.sac@gmail.com</div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="mailto:presentim.sac@gmail.com" style={{ background: R, color: 'white', padding: '13px 24px', borderRadius: 99, fontSize: 14, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: `0 12px 28px -8px ${G}` }}>
                ✉️ Enviar email
              </a>
              <button onClick={copiar} style={{ background: 'transparent', color: T, padding: '13px 24px', borderRadius: 99, fontSize: 14, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8, border: `1.5px solid ${B}`, cursor: 'pointer', fontFamily: 'Inter,system-ui,sans-serif' }}>
                {copiado ? '✅ Copiado!' : '📋 Copiar email'}
              </button>
            </div>
            <div style={{ color: '#65d97a', fontSize: 13, marginTop: 10, height: 18, opacity: copiado ? 1 : 0, transition: 'opacity .2s' }}>
              Email copiado para a área de transferência
            </div>
          </div>

          {/* Info cards */}
          <div className="info-grid contato-fade contato-fade-d2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, textAlign: 'left' }}>
            {[
              ['⏱️', 'Tempo de resposta', 'Respondemos em até 1 dia útil, geralmente muito antes disso.'],
              ['🔧', 'Problemas técnicos', 'Descreva o problema com detalhes e, se possível, inclua prints.'],
              ['💳', 'Pagamentos', 'Créditos não chegaram? Informe o comprovante do Pix no email.'],
              ['💡', 'Sugestões', 'Adoramos ouvir ideias para melhorar o Presentim.'],
            ].map(([emoji, title, desc]) => (
              <div key={title} style={{ background: S, border: `1px solid ${B}`, borderRadius: 20, padding: 24 }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 10 }}>{emoji}</div>
                <div style={{ fontWeight: 600, color: T, fontSize: 14, marginBottom: 6 }}>{title}</div>
                <p style={{ fontSize: 13, color: TS, lineHeight: 1.65, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <footer style={{ padding: 56, textAlign: 'center', borderTop: `1px solid ${B}`, fontSize: 13, color: TS }}>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: '1.4rem', color: T }}>presentim<span style={{ color: R }}>·</span></div>
          <p style={{ opacity: .7, marginTop: 8 }}>Feito com 💝 para eternizar momentos especiais</p>
          <div style={{ marginTop: 16, display: 'flex', gap: 20, justifyContent: 'center' }}>
            <Link href="/termos" style={{ color: TS }}>Termos de uso</Link>
            <Link href="/privacidade" style={{ color: TS }}>Privacidade</Link>
            <Link href="/contato" style={{ color: TS }}>Contato</Link>
            <Link href="/historia" style={{ color: TS }}>História</Link>
          </div>
        </footer>
      </div>
    </>
  )
}