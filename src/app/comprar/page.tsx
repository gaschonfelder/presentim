'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

type Plano = 'starter' | 'popular' | 'max'

const PLANOS = [
  {
    id: 'starter' as Plano,
    emoji: '🎁',
    nome: 'Starter',
    creditos: 1,
    precoFmt: 'R$ 5,90',
    porCredito: 'R$ 5,90 por crédito',
    destaque: false,
    badge: null,
    badgeAlt: false,
    beneficios: ['1 Página Virtual completa','Fotos, frases e música','Link eterno para compartilhar','QR Code incluso'],
    uso: '= 1 Página Virtual',
  },
  {
    id: 'popular' as Plano,
    emoji: '💫',
    nome: 'Popular',
    creditos: 3,
    precoFmt: 'R$ 14,90',
    porCredito: 'R$ 4,97/cr — economia de 16%',
    destaque: true,
    badge: '⭐ Mais popular',
    badgeAlt: false,
    beneficios: ['1 Retrospectiva + 1 Página','Slides animados + conquistas','Exportar para Stories do Instagram','Créditos nunca expiram'],
    uso: '= 1 Retrospectiva + 1 Página',
  },
  {
    id: 'max' as Plano,
    emoji: '💝',
    nome: 'Max',
    creditos: 6,
    precoFmt: 'R$ 24,90',
    porCredito: 'R$ 4,15/cr — economia de 30%',
    destaque: false,
    badge: '🔥 Melhor valor',
    badgeAlt: true,
    beneficios: ['3 Retrospectivas completas','OU 6 Páginas Virtuais','Misture como quiser','Créditos nunca expiram'],
    uso: '= 3 Retrospectivas',
  },
]

type PixData = {
  payment_id: string
  pix_copia_e_cola: string
  pix_qrcode_base64: string | null
  plano: Plano
}

function ComprarContent() {
  const searchParams = useSearchParams()
  const cancelado = searchParams.get('cancelado')
  const [loading, setLoading] = useState<Plano | null>(null)
  const [erro, setErro] = useState('')
  const [pixData, setPixData] = useState<PixData | null>(null)
  const [copiado, setCopiado] = useState(false)
  const [verificando, setVerificando] = useState(false)

  const R = '#e8627a'
  const R2 = '#ff8da7'
  const R3 = '#ffa726'
  const G = 'rgba(232,98,122,.35)'
  const T = '#f5e8ec'
  const TS = 'rgba(245,232,236,.65)'
  const B = 'rgba(255,255,255,.08)'
  const S = 'rgba(255,255,255,.04)'

  useEffect(() => {
    if (!pixData) return
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/pagamento/verificar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ payment_id: pixData.payment_id }),
        })
        const data = await res.json()
        if (data.ok) {
          clearInterval(interval)
          window.location.href = `/comprar/sucesso?plano=${pixData.plano}`
        }
      } catch { /* silencioso */ }
    }, 4000)
    return () => clearInterval(interval)
  }, [pixData])

  async function handleComprar(plano: Plano) {
    setLoading(plano)
    setErro('')
    try {
      const res = await fetch('/api/pagamento/criar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plano }),
      })
      const data = await res.json()
      if (data.pix_copia_e_cola) {
        setPixData({ ...data, plano })
      } else {
        setErro('Erro ao gerar PIX. Tente novamente.')
        console.error('Erro MP:', data)
      }
    } catch {
      setErro('Erro ao conectar. Tente novamente.')
    } finally {
      setLoading(null)
    }
  }

  async function handleCopiar() {
    if (!pixData?.pix_copia_e_cola) return
    await navigator.clipboard.writeText(pixData.pix_copia_e_cola)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 3000)
  }

  async function handleVerificarManual() {
    if (!pixData) return
    setVerificando(true)
    setErro('')
    try {
      const res = await fetch('/api/pagamento/verificar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_id: pixData.payment_id }),
      })
      const data = await res.json()
      if (data.ok) {
        window.location.href = `/comprar/sucesso?plano=${pixData.plano}`
      } else {
        setErro('Pagamento ainda não confirmado. Aguarde alguns instantes.')
      }
    } catch {
      setErro('Erro ao verificar. Tente novamente.')
    } finally {
      setVerificando(false)
    }
  }

  // --- Tela PIX ---
  if (pixData) {
    const planoInfo = PLANOS.find(p => p.id === pixData.plano)!
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap');
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
          body{background:#150810!important;font-family:'Inter',system-ui,sans-serif!important;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px}
          @keyframes spin{to{transform:rotate(360deg)}}
        `}</style>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#150810', padding: 24, position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden="true" style={{ position: 'absolute', top: -200, right: -200, width: 700, height: 700, borderRadius: '50%', background: `radial-gradient(circle,${G},transparent 65%)`, filter: 'blur(40px)', pointerEvents: 'none' }} />

          <div style={{ background: S, border: `1px solid ${B}`, borderRadius: 24, padding: '40px 32px', maxWidth: 460, width: '100%', boxShadow: '0 24px 64px -20px rgba(0,0,0,.4)', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Link href="/" style={{ fontFamily: 'Fraunces, serif', fontSize: '1.5rem', color: R, marginBottom: 24, display: 'block' }}>Presentim</Link>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.5rem', marginBottom: 6, color: T, fontWeight: 500 }}>Pague com PIX 🟢</h1>
            <p style={{ color: TS, fontSize: '.88rem', marginBottom: 24, lineHeight: 1.6 }}>Escaneie o QR Code ou copie o código abaixo</p>

            <div style={{ background: 'rgba(232,98,122,.08)', borderRadius: 12, padding: '14px 18px', marginBottom: 24, fontSize: '.88rem', color: T }}>
              Plano <strong style={{ color: R }}>{planoInfo.nome}</strong> · {planoInfo.creditos} crédito{planoInfo.creditos > 1 ? 's' : ''} por <strong style={{ color: R }}>{planoInfo.precoFmt}</strong>
            </div>

            <div style={{ width: 200, height: 200, margin: '0 auto 20px', borderRadius: 12, border: `2px solid ${B}`, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,.05)' }}>
              {pixData.pix_qrcode_base64
                ? <img src={pixData.pix_qrcode_base64} alt="QR Code PIX" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                : <span style={{ fontSize: '2.5rem' }}>📱</span>
              }
            </div>

            <p style={{ fontSize: '.82rem', color: TS, marginBottom: 16, lineHeight: 1.7 }}>
              1. Abra o app do seu banco<br />
              2. Escolha <strong style={{ color: T }}>PIX Copia e Cola</strong><br />
              3. Cole o código abaixo
            </p>

            <div style={{ background: 'rgba(255,255,255,.04)', border: `1px solid ${B}`, borderRadius: 10, padding: 12, fontSize: '.7rem', color: T, wordBreak: 'break-all', fontFamily: 'monospace', maxHeight: 72, overflow: 'hidden', textAlign: 'left', marginBottom: 14 }}>
              {pixData.pix_copia_e_cola}
            </div>

            {erro && (
              <div style={{ background: 'rgba(232,98,122,.12)', border: '1px solid rgba(232,98,122,.3)', borderRadius: 10, padding: '10px 14px', fontSize: '.82rem', color: '#ff8da7', marginBottom: 14 }}>
                ⚠️ {erro}
              </div>
            )}

            <button onClick={handleCopiar} style={{ width: '100%', padding: 13, border: 'none', borderRadius: 12, fontSize: '.92rem', fontWeight: 700, cursor: 'pointer', marginBottom: 10, background: `linear-gradient(135deg,${R},#c94f68)`, color: 'white', boxShadow: `0 4px 16px ${G}`, fontFamily: 'Inter,system-ui,sans-serif' }}>
              {copiado ? '✅ Copiado!' : '📋 Copiar código PIX'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: TS, fontSize: '.82rem', marginBottom: 14 }}>
              <div style={{ width: 14, height: 14, border: `2px solid ${B}`, borderTopColor: R, borderRadius: '50%', animation: 'spin .8s linear infinite', flexShrink: 0 }} />
              Aguardando confirmação automática…
            </div>

            <button onClick={handleVerificarManual} disabled={verificando} style={{ width: '100%', padding: 13, borderRadius: 12, fontSize: '.92rem', fontWeight: 700, cursor: 'pointer', marginBottom: 10, background: 'transparent', color: R, border: `1.5px solid ${B}`, fontFamily: 'Inter,system-ui,sans-serif', opacity: verificando ? .6 : 1 }}>
              {verificando ? '⏳ Verificando…' : 'Já paguei, verificar agora'}
            </button>

            <a href="/comprar" style={{ display: 'block', textAlign: 'center', color: TS, fontSize: '.8rem', marginTop: 4, opacity: .7 }}>← Cancelar e voltar</a>
          </div>
        </div>
      </>
    )
  }

  // --- Tela principal ---
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#150810!important;color:#f5e8ec!important;font-family:'Inter',system-ui,sans-serif!important}
        a{color:inherit;text-decoration:none}
        @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .comprar-fade{animation:fadeIn .6s ease both}
        @media(max-width:720px){
          .planos-grid{grid-template-columns:1fr!important;max-width:380px!important;margin-left:auto!important;margin-right:auto!important}
          .comprar-nav{padding:0 16px!important}
        }
        @media(max-width:640px){
          .comprar-nav .nav-links-inner{display:none!important}
        }
          .card-plano:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 20px 50px -10px rgba(0,0,0,.5);
  border-color: #e8627a !important;
}
      `}</style>

      <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden', background: '#150810', color: T, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 15 }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: -200, right: -200, width: 700, height: 700, borderRadius: '50%', background: `radial-gradient(circle,${G},transparent 65%)`, filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 600, left: -200, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(120,80,200,.22),transparent 65%)', filter: 'blur(40px)', pointerEvents: 'none', opacity: .8 }} />

        {/* NAV */}
        <header className="comprar-nav" style={{ position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 56px', background: 'rgba(21,8,16,.65)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${B}` }}>
          <Link href="/">
            <Image src="/logo.png" alt="Presentim" width={1024} height={272} priority style={{ height: 38, width: 'auto', filter: 'brightness(0) invert(1)' }} />
          </Link>
          <Link href="/dashboard" style={{ fontSize: 13, color: TS }}>← Voltar ao dashboard</Link>
        </header>

        {/* CONTENT */}
        <div className="comprar-fade" style={{ maxWidth: 920, margin: '0 auto', padding: '64px 24px 80px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: R, fontWeight: 600, marginBottom: 12 }}>Créditos</div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(2rem, 4vw, 2.8rem)', lineHeight: 1.2, color: T, marginBottom: 12, fontWeight: 400 }}>
              Crie presentes que<br />
              <span style={{ fontStyle: 'italic', background: `linear-gradient(135deg,${R2},${R3})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>emocionam de verdade</span>
            </h1>
            <p style={{ color: TS, fontSize: '.95rem', lineHeight: 1.7, maxWidth: 460, margin: '0 auto' }}>Compre créditos e use como quiser. Sem assinatura, sem prazo de validade.</p>
          </div>

          {/* Como funciona */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 44 }}>
            {[
              ['🎁', 'Página Virtual = ', '1 crédito'],
              ['💫', 'Retrospectiva = ', '2 créditos'],
              ['✨', '', 'Nunca expiram'],
            ].map(([emoji, label, val], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {i > 0 && <span style={{ color: R, marginRight: 4, fontSize: '1.1rem' }}>·</span>}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: S, border: `1px solid ${B}`, borderRadius: 50, padding: '.4rem .95rem', fontSize: '.78rem', color: TS }}>
                  {emoji} {label}<strong style={{ color: R }}>{val}</strong>
                </div>
              </div>
            ))}
          </div>

          {cancelado && (
            <div style={{ borderRadius: 14, padding: '14px 18px', marginBottom: 28, fontSize: '.85rem', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left', maxWidth: 560, margin: '0 auto 28px', background: 'rgba(240,208,128,.1)', border: '1px solid rgba(240,208,128,.3)', color: '#f0d080' }}>
              ⚠️ Pagamento cancelado. Seus créditos não foram alterados.
            </div>
          )}
          {erro && (
            <div style={{ borderRadius: 14, padding: '14px 18px', marginBottom: 28, fontSize: '.85rem', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left', maxWidth: 560, margin: '0 auto 28px', background: 'rgba(232,98,122,.1)', border: '1px solid rgba(232,98,122,.3)', color: '#ff8da7' }}>
              ⚠️ {erro}
            </div>
          )}

          {/* Cards */}
          <div className="planos-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginBottom: 32 }}>
            {PLANOS.map(p => (
              <div key={p.id} className="card-plano" style={{ background: S, border: `1.5px solid ${p.destaque ? R : B}`, borderRadius: 24, padding: '32px 24px 28px', position: 'relative', transition: 'all .2s', textAlign: 'left', display: 'flex', flexDirection: 'column', boxShadow: p.destaque ? `0 8px 36px ${G}` : '0 2px 12px rgba(0,0,0,.15)' }}>
                {p.badge && (
                  <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: p.badgeAlt ? `linear-gradient(135deg,#e8a020,${R})` : `linear-gradient(135deg,${R},${R2})`, color: 'white', fontSize: '.65rem', fontWeight: 700, padding: '4px 14px', borderRadius: 20, whiteSpace: 'nowrap', letterSpacing: '.04em', boxShadow: `0 3px 10px ${G}` }}>
                    {p.badge}
                  </div>
                )}
                <div style={{ fontSize: '2.2rem', marginBottom: 10 }}>{p.emoji}</div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '1.3rem', color: T, marginBottom: 4 }}>{p.nome}</div>
                <div style={{ marginBottom: 18 }}>
                  <span style={{ background: 'rgba(232,98,122,.12)', border: '1px solid rgba(232,98,122,.2)', borderRadius: 50, padding: '.18rem .6rem', color: R, fontWeight: 700, fontSize: '.75rem' }}>
                    {p.creditos} crédito{p.creditos > 1 ? 's' : ''}
                  </span>
                </div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '2.5rem', fontWeight: 700, color: T, lineHeight: 1 }}>{p.precoFmt}</div>
                <div style={{ fontSize: '.7rem', color: TS, opacity: .6, marginTop: 4, marginBottom: 4 }}>{p.porCredito}</div>
                <div style={{ fontSize: '.72rem', color: R, fontWeight: 700, marginBottom: 20, letterSpacing: '.01em' }}>{p.uso}</div>
                <ul style={{ listStyle: 'none', marginBottom: 24, flex: 1, padding: 0 }}>
                  {p.beneficios.map((b, i) => (
                    <li key={i} style={{ fontSize: '.83rem', color: p.destaque ? T : TS, padding: '6px 0', borderBottom: `1px solid ${B}`, display: 'flex', alignItems: 'flex-start', gap: 8, lineHeight: 1.45 }}>
                      <span style={{ color: R, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleComprar(p.id)}
                  disabled={!!loading}
                  style={{
                    width: '100%', padding: 14, border: 'none', borderRadius: 14,
                    fontFamily: 'Inter,system-ui,sans-serif', fontSize: '.92rem', fontWeight: 700,
                    cursor: 'pointer', transition: 'all .2s', letterSpacing: '.01em',
                    ...(p.destaque
                      ? { background: `linear-gradient(135deg,${R},#c94f68)`, color: 'white', boxShadow: `0 6px 20px ${G}` }
                      : { background: 'rgba(232,98,122,.1)', color: R, border: `1.5px solid rgba(232,98,122,.2)` }),
                    opacity: loading ? .55 : 1,
                  }}
                >
                  {loading === p.id ? '⏳ Gerando PIX…' : `Comprar por ${p.precoFmt}`}
                </button>
              </div>
            ))}
          </div>

          {/* PIX info */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: TS, fontSize: '.78rem', opacity: .6, marginBottom: 52 }}>
            <span style={{ background: 'rgba(42,138,90,.15)', border: '1px solid rgba(42,138,90,.3)', borderRadius: 50, padding: '.22rem .7rem', color: '#65d97a', fontSize: '.72rem', fontWeight: 700 }}>PIX</span>
            Pagamento exclusivo via Pix · Aprovação instantânea
          </div>

          <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${B},transparent)`, margin: '52px 0' }} />

          {/* FAQ */}
          <div style={{ textAlign: 'left', maxWidth: 580, margin: '0 auto' }}>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '1.5rem', textAlign: 'center', marginBottom: 28, color: T }}>Dúvidas frequentes</div>
            {[
              ['Os créditos expiram?', 'Nunca. Compre hoje e use daqui a um ano se quiser.'],
              ['Qual a diferença entre Página Virtual e Retrospectiva?', 'A Página Virtual é um presente com contagem regressiva, fotos e mensagem. A Retrospectiva é uma experiência completa com slides animados, conquistas do casal e muito mais. Custa 2 créditos.'],
              ['Posso editar depois de publicar?', 'Sim, quantas vezes quiser. Editar não gasta crédito.'],
              ['O pagamento é seguro?', 'Sim. PIX processado pelo Mercado Pago com aprovação instantânea. Os créditos são adicionados automaticamente após confirmação.'],
              ['E se eu pagar e não receber os créditos?', 'Se o PIX for aprovado e os créditos não aparecerem em até 5 minutos, entre em contato pelo suporte que resolvemos na hora.'],
            ].map(([q, a], i) => (
              <div key={i} style={{ borderBottom: `1px solid ${B}`, padding: '18px 0', ...(i === 4 ? { borderBottom: 'none' } : {}) }}>
                <strong style={{ display: 'block', color: T, fontSize: '.9rem', marginBottom: 6 }}>{q}</strong>
                <p style={{ color: TS, fontSize: '.85rem', lineHeight: 1.65, margin: 0 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default function ComprarPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#150810' }} />}>
      <ComprarContent />
    </Suspense>
  )
}