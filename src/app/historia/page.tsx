import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Nossa história',
  description:
    'Como o Presentim nasceu: a história por trás do projeto, contada por quem criou.',
  openGraph: {
    title: 'Nossa história | Presentim',
    description:
      'Como o Presentim nasceu: a história por trás do projeto, contada por quem criou.',
  },
}

export default function HistoriaPage() {
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
        .hist-fade{animation:fadeIn .6s ease both}
        .hist-fade-d1{animation-delay:.1s}
        .hist-fade-d2{animation-delay:.2s}
        .hist-fade-d3{animation-delay:.3s}
        .hist-fade-d4{animation-delay:.35s}
        @media(max-width:640px){
          .hist-nav{padding:0 20px!important}
          .hist-nav .nav-links-inner{display:none!important}
          .hist-page{padding:48px 24px 60px!important}
          .hist-page h1{font-size:2rem!important}
        }
      `}</style>

      <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden', background: '#150810', color: T, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 15 }}>
        {/* Ambient glows */}
        <div aria-hidden="true" style={{ position: 'absolute', top: -200, right: -200, width: 700, height: 700, borderRadius: '50%', background: `radial-gradient(circle,${G},transparent 65%)`, filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 600, left: -200, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(120,80,200,.22),transparent 65%)', filter: 'blur(40px)', pointerEvents: 'none', opacity: .8 }} />

        {/* NAV */}
        <header className="hist-nav" style={{ position: 'sticky', top: 0, zIndex: 50, display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 32, padding: '18px 56px', background: 'rgba(21,8,16,.65)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${B}` }}>
          <Link href="/">
            <Image src="/logo.png" alt="Presentim" width={1024} height={272} priority style={{ height: 38, width: 'auto', filter: 'brightness(0) invert(1)' }} />
          </Link>
          <nav className="nav-links-inner" style={{ display: 'flex', gap: 28, justifyContent: 'center' }}>
            <Link href="/#como-funciona" style={{ fontSize: 13, color: TS, fontWeight: 500 }}>Como funciona</Link>
            <Link href="/#precos" style={{ fontSize: 13, color: TS, fontWeight: 500 }}>Preços</Link>
            <Link href="/#faq" style={{ fontSize: 13, color: TS, fontWeight: 500 }}>FAQ</Link>
            <Link href="/historia" style={{ fontSize: 13, color: R, fontWeight: 600 }}>História</Link>
            <Link href="/demo" style={{ fontSize: 13, color: TS, fontWeight: 500 }}>Ver demo</Link>
          </nav>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link href="/login" style={{ fontSize: 13, color: TS }}>Entrar</Link>
            <Link href="/cadastro" style={{ background: R, color: 'white', padding: '10px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, boxShadow: `0 8px 24px -8px ${G}` }}>Criar presente →</Link>
          </div>
        </header>

        {/* CONTENT */}
        <article className="hist-page" style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px 100px', position: 'relative', zIndex: 1 }}>

          {/* Eyebrow + Title */}
          <div className="hist-fade" style={{ marginBottom: 56 }}>
            <div style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: R, fontWeight: 600, marginBottom: 18 }}>Nossa história</div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, lineHeight: 1.15, letterSpacing: '-.02em', color: T, margin: '0 0 12px' }}>
              Como o{' '}
              <span style={{ fontStyle: 'italic', background: `linear-gradient(135deg,${R2},${R3})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Presentim
              </span>{' '}
              nasceu
            </h1>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: TS, maxWidth: 560 }}>
              Um projeto que começou com a vontade de presentear alguém especial
              de um jeito diferente, e acabou virando algo maior.
            </p>
          </div>

          {/* Sections */}
          <section className="hist-fade hist-fade-d1">
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.25rem', fontWeight: 500, color: T, margin: '0 0 14px' }}>Como tudo começou</h2>
            <p style={{ fontSize: 15, color: TS, lineHeight: 1.85, marginBottom: 16 }}>
              A ideia do projeto nasceu de algo simples, mas muito especial:
              a vontade de presentear minha namorada de uma forma diferente.
              Eu queria fugir do comum, criar algo mais significativo, que não
              fosse apenas um presente físico, mas uma experiência, algo que
              guardasse memórias, sentimentos e momentos importantes da nossa
              história.
            </p>
          </section>

          <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${B},transparent)`, margin: '40px 0' }} />

          <section className="hist-fade hist-fade-d2">
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.25rem', fontWeight: 500, color: T, margin: '0 0 14px' }}>A primeira versão</h2>
            <p style={{ fontSize: 15, color: TS, lineHeight: 1.85, marginBottom: 16 }}>
              Foi assim que surgiu a primeira versão: uma página personalizada
              com fotos, música e uma mensagem única. Quando ela viu, a reação
              foi muito mais do que eu esperava. Foi emocionante, marcante… e
              ali eu percebi que aquele tipo de presente tinha um valor muito
              maior do que imaginava.
            </p>
          </section>

          <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${B},transparent)`, margin: '40px 0' }} />

          <section className="hist-fade hist-fade-d3">
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.25rem', fontWeight: 500, color: T, margin: '0 0 14px' }}>De um presente para muitos</h2>
            <p style={{ fontSize: 15, color: TS, lineHeight: 1.85, marginBottom: 16 }}>
              Depois disso, veio a ideia: por que não permitir que outras
              pessoas também possam criar algo assim? Foi então que o projeto
              começou a tomar forma, com o objetivo de ajudar outras pessoas
              a surpreender quem amam de uma maneira criativa e inesquecível.
            </p>
            <p style={{ fontSize: 15, color: TS, lineHeight: 1.85, marginBottom: 16 }}>
              Hoje, o Presentim existe para isso: transformar sentimentos em
              algo visual, compartilhável e único.
            </p>
          </section>

          <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${B},transparent)`, margin: '40px 0' }} />

          <section className="hist-fade hist-fade-d4">
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.25rem', fontWeight: 500, color: T, margin: '0 0 14px' }}>Sobre os valores cobrados</h2>
            <p style={{ fontSize: 15, color: TS, lineHeight: 1.85, marginBottom: 16 }}>
              Vale destacar que os valores cobrados no site não têm como
              objetivo lucro, mas sim ajudar a manter o projeto no ar,
              cobrindo custos como hospedagem, infraestrutura e melhorias
              contínuas.
            </p>
          </section>

          {/* Closing */}
          <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${R}40,transparent)`, margin: '56px 0 40px' }} />

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: '1.15rem', color: T, lineHeight: 1.7, marginBottom: 24 }}>
              No fim, tudo isso nasceu de um gesto simples de amor, e continua
              sendo movido por isso.
            </p>
            <p style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: '1rem', color: R }}>— Gabriel</p>
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center', marginTop: 64 }}>
            <Link href="/cadastro" style={{ background: R, color: 'white', padding: '15px 28px', borderRadius: 99, fontSize: 14, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 10, boxShadow: `0 12px 32px -8px ${G}` }}>
              Criar meu presente <span>→</span>
            </Link>
          </div>
        </article>

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