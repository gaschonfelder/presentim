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

  // Polling a cada 4s enquanto aguarda pagamento
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
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Lato:wght@300;400;700&display=swap');
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
          body{font-family:'Lato',sans-serif;background:#fff8f9;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px}
          .card{background:white;border-radius:24px;padding:40px 32px;max-width:460px;width:100%;box-shadow:0 8px 40px rgba(232,98,122,.12);border:1px solid #fce4ea;text-align:center}
          .logo{font-family:'Playfair Display',serif;font-size:1.5rem;color:#e8627a;margin-bottom:24px;display:block;text-decoration:none}
          h1{font-family:'Playfair Display',serif;font-size:1.5rem;margin-bottom:6px;color:#3d1f28}
          .sub{color:#7a4f5a;font-size:.88rem;margin-bottom:24px;line-height:1.6}
          .resumo{background:#fdf0f3;border-radius:12px;padding:14px 18px;margin-bottom:24px;font-size:.88rem;color:#3d1f28}
          .resumo strong{color:#e8627a}
          .qrcode{width:200px;height:200px;margin:0 auto 20px;border-radius:12px;border:2px solid #fce4ea;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#fdf0f3}
          .qrcode img{width:100%;height:100%;object-fit:contain}
          .instrucao{font-size:.82rem;color:#7a4f5a;margin-bottom:16px;line-height:1.7}
          .pix-code{background:#f8f0f3;border:1px solid #fce4ea;border-radius:10px;padding:12px;font-size:.7rem;color:#3d1f28;word-break:break-all;margin-bottom:14px;font-family:monospace;max-height:72px;overflow:hidden;text-align:left}
          .btn{width:100%;padding:13px;border:none;border-radius:12px;font-family:'Lato',sans-serif;font-size:.92rem;font-weight:700;cursor:pointer;transition:all .2s;margin-bottom:10px}
          .btn-copiar{background:linear-gradient(135deg,#e8627a,#c94f68);color:white;box-shadow:0 4px 16px rgba(232,98,122,.28)}
          .btn-copiar:hover{transform:translateY(-1px)}
          .btn-verificar{background:#fdf0f3;color:#e8627a;border:1.5px solid #fce4ea}
          .btn-verificar:hover{background:#fce4ea}
          .btn:disabled{opacity:.6;cursor:not-allowed;transform:none!important}
          .aguardando{display:flex;align-items:center;justify-content:center;gap:8px;color:#7a4f5a;font-size:.82rem;margin-bottom:14px}
          @keyframes spin{to{transform:rotate(360deg)}}
          .spinner{width:14px;height:14px;border:2px solid #fce4ea;border-top-color:#e8627a;border-radius:50%;animation:spin .8s linear infinite;flex-shrink:0}
          .cancelar{display:block;text-align:center;color:#7a4f5a;font-size:.8rem;text-decoration:none;margin-top:4px;opacity:.7}
          .cancelar:hover{opacity:1;color:#e8627a}
          .erro-box{background:#fff0f2;border:1px solid #f9a8b8;border-radius:10px;padding:10px 14px;font-size:.82rem;color:#c0415a;margin-bottom:14px}
        `}</style>
        <div className="card">
          <Link href="/" className="logo">Presentim</Link>
          <h1>Pague com PIX 🟢</h1>
          <p className="sub">Escaneie o QR Code ou copie o código abaixo</p>
          <div className="resumo">
            Plano <strong>{planoInfo.nome}</strong> · {planoInfo.creditos} crédito{planoInfo.creditos > 1 ? 's' : ''} por <strong>{planoInfo.precoFmt}</strong>
          </div>
          <div className="qrcode">
            {pixData.pix_qrcode_base64
              ? <img src={pixData.pix_qrcode_base64} alt="QR Code PIX" />
              : <span style={{fontSize:'2.5rem'}}>📱</span>
            }
          </div>
          <p className="instrucao">
            1. Abra o app do seu banco<br/>
            2. Escolha <strong>PIX Copia e Cola</strong><br/>
            3. Cole o código abaixo
          </p>
          <div className="pix-code">{pixData.pix_copia_e_cola}</div>
          {erro && <div className="erro-box">⚠️ {erro}</div>}
          <button className="btn btn-copiar" onClick={handleCopiar}>
            {copiado ? '✅ Copiado!' : '📋 Copiar código PIX'}
          </button>
          <div className="aguardando">
            <div className="spinner" />
            Aguardando confirmação automática…
          </div>
          <button className="btn btn-verificar" onClick={handleVerificarManual} disabled={verificando}>
            {verificando ? '⏳ Verificando…' : 'Já paguei, verificar agora'}
          </button>
          <a href="/comprar" className="cancelar">← Cancelar e voltar</a>
        </div>
      </>
    )
  }

  // --- Tela principal ---
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Lato:wght@300;400;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--rose:#e8627a;--rose-light:#f9a8b8;--rose-pale:#fdf0f3;--rose-mid:#fce4ea;--cream:#fff8f9;--text:#3d1f28;--text-soft:#7a4f5a}
        body{font-family:'Lato',sans-serif;background:var(--cream);color:var(--text)}
        .navbar{background:white;border-bottom:1px solid var(--rose-mid);padding:0 48px;height:64px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;box-shadow:0 1px 8px rgba(232,98,122,.06)}
        .nav-logo{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:700;color:var(--rose);text-decoration:none}
        .nav-back{font-size:.88rem;color:var(--text-soft);text-decoration:none;transition:color .2s}
        .nav-back:hover{color:var(--rose)}
        .page{max-width:880px;margin:0 auto;padding:64px 24px 80px;text-align:center}
        .header{margin-bottom:48px}
        .header-eyebrow{font-size:.62rem;letter-spacing:.28em;text-transform:uppercase;color:var(--rose);opacity:.7;margin-bottom:12px}
        .header h1{font-family:'Playfair Display',serif;font-size:clamp(2rem,5vw,2.8rem);line-height:1.2;color:var(--text);margin-bottom:12px}
        .header h1 em{font-style:italic;color:var(--rose)}
        .header p{color:var(--text-soft);font-size:.95rem;line-height:1.7;max-width:460px;margin:0 auto}
        .como{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-bottom:44px}
        .como-item{display:flex;align-items:center;gap:6px;background:white;border:1.5px solid var(--rose-mid);border-radius:50px;padding:.4rem .95rem;font-size:.78rem;color:var(--text-soft);box-shadow:0 1px 4px rgba(232,98,122,.07)}
        .como-item strong{color:var(--rose)}
        .como-sep{color:var(--rose-light);display:flex;align-items:center;font-size:1.1rem}
        .aviso{border-radius:14px;padding:14px 18px;margin-bottom:28px;font-size:.85rem;display:flex;align-items:center;gap:10px;text-align:left;max-width:560px;margin-left:auto;margin-right:auto}
        .aviso.cancelado{background:#fffbea;border:1px solid #f0d080;color:#7a6020}
        .aviso.erro{background:#fff0f2;border:1px solid var(--rose-light);color:#c0415a}
        .planos{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:32px}
        @media(max-width:720px){.planos{grid-template-columns:1fr;max-width:380px;margin-left:auto;margin-right:auto}}
        .card{background:white;border:2px solid var(--rose-mid);border-radius:24px;padding:32px 24px 28px;position:relative;transition:all .2s;text-align:left;display:flex;flex-direction:column;box-shadow:0 2px 12px rgba(232,98,122,.06)}
        .card:hover{border-color:var(--rose-light);box-shadow:0 8px 32px rgba(232,98,122,.12);transform:translateY(-3px)}
        .card.destaque{border-color:var(--rose);box-shadow:0 8px 36px rgba(232,98,122,.18)}
        .card-badge{position:absolute;top:-13px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,var(--rose),#f9a8b8);color:white;font-size:.65rem;font-weight:700;padding:4px 14px;border-radius:20px;white-space:nowrap;letter-spacing:.04em;box-shadow:0 3px 10px rgba(232,98,122,.3)}
        .card-badge.alt{background:linear-gradient(135deg,#e8a020,#e8627a)}
        .card-emoji{font-size:2.2rem;margin-bottom:10px}
        .card-nome{font-family:'Playfair Display',serif;font-size:1.3rem;color:var(--text);margin-bottom:4px}
        .card-creditos{margin-bottom:18px}
        .card-creditos-num{background:var(--rose-pale);border:1px solid var(--rose-mid);border-radius:50px;padding:.18rem .6rem;color:var(--rose);font-weight:700;font-size:.75rem}
        .card-preco-val{font-family:'Playfair Display',serif;font-size:2.5rem;font-weight:700;color:var(--text);line-height:1}
        .card-preco-por{font-size:.7rem;color:var(--text-soft);opacity:.6;margin-top:4px;margin-bottom:4px}
        .card-uso{font-size:.72rem;color:var(--rose);font-weight:700;margin-bottom:20px;letter-spacing:.01em}
        .card-beneficios{list-style:none;margin-bottom:24px;flex:1}
        .card-beneficios li{font-size:.83rem;color:var(--text-soft);padding:6px 0;border-bottom:1px solid var(--rose-pale);display:flex;align-items:flex-start;gap:8px;line-height:1.45}
        .card-beneficios li:last-child{border:none}
        .card-beneficios li::before{content:'✓';color:var(--rose);font-weight:700;flex-shrink:0;margin-top:1px}
        .card.destaque .card-beneficios li{color:var(--text)}
        .btn-comprar{width:100%;padding:14px;border:none;border-radius:14px;font-family:'Lato',sans-serif;font-size:.92rem;font-weight:700;cursor:pointer;transition:all .2s;letter-spacing:.01em}
        .btn-comprar.primario{background:linear-gradient(135deg,var(--rose),#c94f68);color:white;box-shadow:0 6px 20px rgba(232,98,122,.28)}
        .btn-comprar.primario:hover:not(:disabled){box-shadow:0 10px 28px rgba(232,98,122,.4);transform:translateY(-1px)}
        .btn-comprar.secundario{background:var(--rose-pale);color:var(--rose);border:1.5px solid var(--rose-mid)}
        .btn-comprar.secundario:hover:not(:disabled){background:var(--rose-mid);border-color:var(--rose-light)}
        .btn-comprar:disabled{opacity:.55;cursor:not-allowed;transform:none!important}
        .pix-info{display:flex;align-items:center;justify-content:center;gap:8px;color:var(--text-soft);font-size:.78rem;opacity:.6;margin-bottom:52px}
        .pix-badge{background:#e8f7f0;border:1px solid #a8dfc0;border-radius:50px;padding:.22rem .7rem;color:#2a8a5a;font-size:.72rem;font-weight:700}
        .divisor{height:1px;background:var(--rose-mid);margin:52px 0}
        .faq{text-align:left;max-width:580px;margin:0 auto}
        .faq-titulo{font-family:'Playfair Display',serif;font-size:1.5rem;text-align:center;margin-bottom:28px;color:var(--text)}
        .faq-item{border-bottom:1px solid var(--rose-mid);padding:18px 0}
        .faq-item:last-child{border:none}
        .faq-item strong{display:block;color:var(--text);font-size:.9rem;margin-bottom:6px}
        .faq-item p{color:var(--text-soft);font-size:.85rem;line-height:1.65}
        @media(max-width:600px){.navbar{padding:0 16px}.como{gap:5px}}
      `}</style>

      <nav className="navbar">
                <Link href="/" className="nav-logo">
          <Image src="/logo.png" alt="Presentim" width={1024} height={272} priority style={{ height: 44, width: 'auto' }} />
        </Link>
        <Link href="/dashboard" className="nav-back">← Voltar ao dashboard</Link>
      </nav>

      <div className="page">
        <div className="header">
          <div className="header-eyebrow">Créditos</div>
          <h1>Crie presentes que<br/><em>emocionam de verdade</em></h1>
          <p>Compre créditos e use como quiser. Sem assinatura, sem prazo de validade.</p>
        </div>

        <div className="como">
          <div className="como-item">🎁 Página Virtual = <strong>1 crédito</strong></div>
          <div className="como-sep">·</div>
          <div className="como-item">💫 Retrospectiva = <strong>2 créditos</strong></div>
          <div className="como-sep">·</div>
          <div className="como-item">✨ Nunca expiram</div>
        </div>

        {cancelado && <div className="aviso cancelado">⚠️ Pagamento cancelado. Seus créditos não foram alterados.</div>}
        {erro && <div className="aviso erro">⚠️ {erro}</div>}

        <div className="planos">
          {PLANOS.map(p => (
            <div key={p.id} className={`card ${p.destaque ? 'destaque' : ''}`}>
              {p.badge && <div className={`card-badge ${p.badgeAlt ? 'alt' : ''}`}>{p.badge}</div>}
              <div className="card-emoji">{p.emoji}</div>
              <div className="card-nome">{p.nome}</div>
              <div className="card-creditos">
                <span className="card-creditos-num">{p.creditos} crédito{p.creditos > 1 ? 's' : ''}</span>
              </div>
              <div className="card-preco-val">{p.precoFmt}</div>
              <div className="card-preco-por">{p.porCredito}</div>
              <div className="card-uso">{p.uso}</div>
              <ul className="card-beneficios">
                {p.beneficios.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
              <button
                className={`btn-comprar ${p.destaque ? 'primario' : 'secundario'}`}
                onClick={() => handleComprar(p.id)}
                disabled={!!loading}
              >
                {loading === p.id ? '⏳ Gerando PIX…' : `Comprar por ${p.precoFmt}`}
              </button>
            </div>
          ))}
        </div>

        <div className="pix-info">
          <span className="pix-badge">PIX</span>
          Pagamento exclusivo via Pix · Aprovação instantânea
        </div>

        <div className="divisor" />

        <div className="faq">
          <div className="faq-titulo">Dúvidas frequentes</div>
          <div className="faq-item">
            <strong>Os créditos expiram?</strong>
            <p>Nunca. Compre hoje e use daqui a um ano se quiser.</p>
          </div>
          <div className="faq-item">
            <strong>Qual a diferença entre Página Virtual e Retrospectiva?</strong>
            <p>A Página Virtual é um presente com contagem regressiva, fotos e mensagem. A Retrospectiva é uma experiência completa com slides animados, conquistas do casal e muito mais. Custa 2 créditos.</p>
          </div>
          <div className="faq-item">
            <strong>Posso editar depois de publicar?</strong>
            <p>Sim, quantas vezes quiser. Editar não gasta crédito.</p>
          </div>
          <div className="faq-item">
            <strong>O pagamento é seguro?</strong>
            <p>Sim. PIX processado pelo Mercado Pago com aprovação instantânea. Os créditos são adicionados automaticamente após confirmação.</p>
          </div>
          <div className="faq-item">
            <strong>E se eu pagar e não receber os créditos?</strong>
            <p>Se o PIX for aprovado e os créditos não aparecerem em até 5 minutos, entre em contato pelo suporte que resolvemos na hora.</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default function ComprarPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#fff8f9' }} />}>
      <ComprarContent />
    </Suspense>
  )
}