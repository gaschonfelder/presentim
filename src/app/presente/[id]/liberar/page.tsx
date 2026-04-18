'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

type Plano = 'starter' | 'duo' | 'popular' | 'max'

const PLANOS = [
  {
    id: 'starter' as Plano,
    creditos: 1,
    precoFmt: 'R$ 5,90',
    porCredito: 'R$ 5,90 por crédito',
    destaque: false,
    badge: null,
  },
  {
    id: 'duo' as Plano,
    creditos: 2,
    precoFmt: 'R$ 11,80',
    porCredito: 'R$ 5,90 por crédito',
    destaque: false,
    badge: null,
  },
  {
    id: 'popular' as Plano,
    creditos: 3,
    precoFmt: 'R$ 14,90',
    porCredito: 'R$ 4,97/cr — economia de 16%',
    destaque: true,
    badge: '⭐ Mais popular',
  },
  {
    id: 'max' as Plano,
    creditos: 6,
    precoFmt: 'R$ 24,90',
    porCredito: 'R$ 4,15/cr — economia de 30%',
    destaque: false,
    badge: '🔥 Melhor valor',
  },
]

type PixData = {
  payment_id: string
  pix_copia_e_cola: string
  pix_qrcode_base64: string | null
  plano: Plano
}

function LiberarContent() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [presente, setPresente] = useState<any>(null)
  const [creditos, setCreditos] = useState(0)
  const [erro, setErro] = useState('')
  const [liberando, setLiberando] = useState(false)

  // PIX state
  const [pixData, setPixData] = useState<PixData | null>(null)
  const [comprando, setComprando] = useState<Plano | null>(null)
  const [copiado, setCopiado] = useState(false)

  // Custo baseado no tipo do presente
  const custoCreditos = presente?.tipo === 'retrospectiva' ? 2 : 1

  // Planos filtrados: só mostra os que cobrem o custo
  const planosFiltrados = PLANOS.filter(p => p.creditos >= custoCreditos)

  useEffect(() => {
    async function carregar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const [presRes, profRes] = await Promise.all([
        supabase.from('presentes').select('*').eq('id', id).eq('user_id', user.id).single(),
        supabase.from('profiles').select('creditos').eq('id', user.id).single(),
      ])

      if (!presRes.data) {
        router.push('/dashboard')
        return
      }

      // Se já está ativo, redireciona pro dashboard
      if (presRes.data.status === 'ativo' || (presRes.data.ativo && presRes.data.status !== 'rascunho')) {
        router.push('/dashboard')
        return
      }

      setPresente(presRes.data)
      setCreditos(profRes.data?.creditos ?? 0)
      setLoading(false)
    }
    carregar()
  }, [id, router, supabase])

  // Polling PIX
  useEffect(() => {
    if (!pixData || !presente) return
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/pagamento/verificar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            payment_id: pixData.payment_id,
            presente_id: presente.id,
            custo_creditos: custoCreditos,
          }),
        })
        const data = await res.json()
        if (data.ok) {
          clearInterval(interval)
          router.push(`/dashboard?criado=${presente.slug}`)
        }
      } catch { /* silencioso */ }
    }, 4000)
    return () => clearInterval(interval)
  }, [pixData, presente, custoCreditos, router])

  // Liberar com créditos existentes
  async function handleLiberarComCreditos() {
    setLiberando(true)
    setErro('')
    try {
      const res = await fetch('/api/presente/liberar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ presente_id: id }),
      })
      const data = await res.json()
      if (data.ok) {
        router.push(`/dashboard?criado=${presente.slug}`)
      } else {
        setErro(data.error || 'Erro ao liberar presente.')
      }
    } catch {
      setErro('Erro de conexão. Tente novamente.')
    }
    setLiberando(false)
  }

  // Comprar créditos via PIX
  async function handleComprar(plano: Plano) {
    setComprando(plano)
    setErro('')
    try {
      const res = await fetch('/api/pagamento/criar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plano, presente_id: id }),
      })
      const data = await res.json()
      if (data.pix_copia_e_cola) {
        setPixData({ ...data, plano })
      } else {
        setErro('Erro ao gerar PIX. Tente novamente.')
      }
    } catch {
      setErro('Erro de conexão.')
    }
    setComprando(null)
  }

  async function handleCopiarPix() {
    if (!pixData) return
    try {
      await navigator.clipboard.writeText(pixData.pix_copia_e_cola)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 3000)
    } catch {}
  }

  if (loading) {
    return (
      <div style={S.loadingWrap}>
        <div style={S.loadingText}>Carregando… 💝</div>
      </div>
    )
  }

  const temCreditos = creditos >= custoCreditos
  const creditosFaltam = custoCreditos - creditos
  const tipoLabel = presente?.tipo === 'retrospectiva' ? 'Retrospectiva' : 'Página Presente'
  const tipoEmoji = presente?.tipo === 'retrospectiva' ? '💫' : '🎁'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lato:wght@300;400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --rose: #e8627a; --rose-light: #f9a8b8;
          --rose-pale: #fdf0f3; --rose-mid: #fce4ea;
          --cream: #fff8f9; --text: #3d1f28; --text-soft: #7a4f5a;
        }
        body { font-family: 'Lato', sans-serif; background: var(--cream); color: var(--text); }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .6; } }
      `}</style>

      <nav style={S.navbar}>
        <Link href="/">
          <Image src="/logo.png" alt="Presentim" width={1024} height={272} priority style={{ height: 44, width: 'auto' }} />
        </Link>
        <Link href="/dashboard" style={S.navLink}>← Dashboard</Link>
      </nav>

      <div style={S.page}>
        <div style={S.card}>
          {/* Cabeçalho */}
          <div style={S.header}>
            <div style={S.headerEmoji}>{tipoEmoji}</div>
            <h1 style={S.headerTitle}>Quase lá!</h1>
            <p style={S.headerSub}>
              Sua <strong>{tipoLabel}</strong> foi salva.
              {temCreditos
                ? ' Libere agora com seus créditos!'
                : ' Adquira créditos para ativar o link.'}
            </p>
          </div>

          {/* Resumo do presente */}
          <div style={S.resumo}>
            <div style={S.resumoTitulo}>{presente.titulo || 'Presente sem título'}</div>
            <div style={S.resumoCusto}>
              Custo: <strong>{custoCreditos} crédito{custoCreditos > 1 ? 's' : ''}</strong>
            </div>
            <div style={S.resumoSaldo}>
              Seu saldo: <strong>{creditos} crédito{creditos !== 1 ? 's' : ''}</strong>
            </div>
          </div>

          {erro && <div style={S.erro}>⚠️ {erro}</div>}

          {/* Caminho 1: Tem créditos suficientes */}
          {temCreditos && !pixData && (
            <div style={S.section}>
              <button
                onClick={handleLiberarComCreditos}
                disabled={liberando}
                style={{
                  ...S.btnPrimario,
                  opacity: liberando ? 0.7 : 1,
                  cursor: liberando ? 'wait' : 'pointer',
                }}
              >
                {liberando ? 'Liberando…' : `✨ Liberar presente (${custoCreditos} crédito${custoCreditos > 1 ? 's' : ''})`}
              </button>
              <p style={S.saldoApos}>
                Saldo após liberação: {creditos - custoCreditos} crédito{(creditos - custoCreditos) !== 1 ? 's' : ''}
              </p>
            </div>
          )}

          {/* Caminho 2: Não tem créditos — mostra planos */}
          {!temCreditos && !pixData && (
            <div style={S.section}>
              <p style={S.instrucao}>
                Você precisa de {creditosFaltam > 0 ? `mais ${creditosFaltam}` : custoCreditos} crédito{(creditosFaltam || custoCreditos) !== 1 ? 's' : ''}.
                Escolha um pacote:
              </p>
              <div style={S.planosGrid}>
                {planosFiltrados.map(plano => (
                  <button
                    key={plano.id}
                    onClick={() => handleComprar(plano.id)}
                    disabled={comprando !== null}
                    style={{
                      ...S.planoCard,
                      border: plano.destaque ? '2px solid var(--rose)' : '2px solid var(--rose-mid)',
                      background: plano.destaque ? 'var(--rose-pale)' : 'white',
                      opacity: comprando !== null ? 0.7 : 1,
                    }}
                  >
                    {plano.badge && <div style={S.planoBadge}>{plano.badge}</div>}
                    <div style={S.planoCreditos}>
                      {plano.creditos} crédito{plano.creditos > 1 ? 's' : ''}
                    </div>
                    <div style={S.planoPreco}>{plano.precoFmt}</div>
                    <div style={S.planoPorCredito}>{plano.porCredito}</div>
                    {comprando === plano.id && <div style={S.planoLoading}>Gerando PIX…</div>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* QR Code PIX */}
          {pixData && (
            <div style={S.pixSection}>
              <h2 style={S.pixTitle}>Pague via PIX</h2>
              <p style={S.pixSub}>Escaneie o QR Code ou copie o código</p>

              {pixData.pix_qrcode_base64 && (
                <div style={S.qrWrap}>
                  <img
                    src={pixData.pix_qrcode_base64.startsWith('data:') ? pixData.pix_qrcode_base64 : `data:image/png;base64,${pixData.pix_qrcode_base64}`}
                    alt="QR Code PIX"
                    style={S.qrImg}
                  />
                </div>
              )}

              <button onClick={handleCopiarPix} style={S.btnCopiar}>
                {copiado ? '✓ Copiado!' : '📋 Copiar código PIX'}
              </button>

              <div style={S.aguardando}>
                <div style={S.aguardandoDot} />
                Aguardando confirmação do pagamento…
              </div>

              <button
                onClick={() => setPixData(null)}
                style={S.btnVoltar}
              >
                ← Escolher outro pacote
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default function LiberarPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#fff8f9' }} />}>
      <LiberarContent />
    </Suspense>
  )
}

// ─── Estilos inline (mesma linguagem visual do Presentim) ─────────────────────
const S: Record<string, React.CSSProperties> = {
  loadingWrap: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#fff8f9',
  },
  loadingText: { fontSize: '1.5rem', color: '#e8627a' },
  navbar: {
    background: 'white', borderBottom: '1px solid #fce4ea',
    padding: '0 20px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  navLink: { fontSize: '.85rem', color: '#7a4f5a', textDecoration: 'none' },
  page: {
    maxWidth: 520, margin: '0 auto', padding: '40px 20px',
  },
  card: {
    background: 'white', borderRadius: 24, padding: '40px 28px',
    boxShadow: '0 8px 40px rgba(232,98,122,.08)',
    animation: 'fadeUp .5s ease',
  },
  header: { textAlign: 'center' as const, marginBottom: 28 },
  headerEmoji: { fontSize: '3rem', marginBottom: 12 },
  headerTitle: {
    fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: '#3d1f28', marginBottom: 8,
  },
  headerSub: { fontSize: '.92rem', color: '#7a4f5a', lineHeight: 1.6 },
  resumo: {
    background: '#fff8f9', borderRadius: 16, padding: '18px 20px', marginBottom: 24,
    border: '1px solid #fce4ea',
  },
  resumoTitulo: {
    fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', color: '#3d1f28',
    fontWeight: 700, marginBottom: 8,
  },
  resumoCusto: { fontSize: '.85rem', color: '#7a4f5a', marginBottom: 4 },
  resumoSaldo: { fontSize: '.85rem', color: '#7a4f5a' },
  erro: {
    background: '#fff0f0', color: '#c0415a', padding: '10px 16px', borderRadius: 12,
    fontSize: '.85rem', marginBottom: 20, textAlign: 'center' as const,
  },
  section: { textAlign: 'center' as const },
  btnPrimario: {
    width: '100%', padding: '16px 24px',
    background: 'linear-gradient(135deg, #e8627a, #c94f68)',
    color: 'white', border: 'none', borderRadius: 14,
    fontSize: '1rem', fontWeight: 700, fontFamily: "'Lato', sans-serif",
    boxShadow: '0 8px 24px rgba(232,98,122,.3)', transition: 'all .2s',
  },
  saldoApos: { fontSize: '.8rem', color: '#b08090', marginTop: 12 },
  instrucao: { fontSize: '.9rem', color: '#7a4f5a', marginBottom: 20, lineHeight: 1.6 },
  planosGrid: { display: 'flex', flexDirection: 'column' as const, gap: 12 },
  planoCard: {
    padding: '20px', borderRadius: 16, cursor: 'pointer', transition: 'all .2s',
    textAlign: 'left' as const, position: 'relative' as const, fontFamily: "'Lato', sans-serif",
  },
  planoBadge: {
    position: 'absolute' as const, top: -10, right: 16,
    background: 'linear-gradient(135deg, #e8627a, #f9a8b8)', color: 'white',
    fontSize: '.7rem', fontWeight: 700, padding: '3px 12px', borderRadius: 50,
  },
  planoCreditos: {
    fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', color: '#3d1f28',
    fontWeight: 700, marginBottom: 4,
  },
  planoPreco: { fontSize: '1.3rem', color: '#e8627a', fontWeight: 700, marginBottom: 2 },
  planoPorCredito: { fontSize: '.78rem', color: '#b08090' },
  planoLoading: { fontSize: '.8rem', color: '#e8627a', marginTop: 8, fontWeight: 600 },
  pixSection: { textAlign: 'center' as const },
  pixTitle: {
    fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', color: '#3d1f28', marginBottom: 6,
  },
  pixSub: { fontSize: '.85rem', color: '#7a4f5a', marginBottom: 20 },
  qrWrap: {
    background: 'white', padding: 16, borderRadius: 16, display: 'inline-block',
    boxShadow: '0 4px 20px rgba(0,0,0,.08)', marginBottom: 20,
  },
  qrImg: { width: 200, height: 200 },
  btnCopiar: {
    width: '100%', padding: '14px', background: 'var(--rose-pale)',
    border: '1px solid var(--rose-mid)', borderRadius: 12,
    fontSize: '.9rem', fontWeight: 600, color: '#e8627a', cursor: 'pointer',
    fontFamily: "'Lato', sans-serif", marginBottom: 20, transition: 'all .2s',
  },
  aguardando: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    fontSize: '.85rem', color: '#b08090', marginBottom: 16,
  },
  aguardandoDot: {
    width: 8, height: 8, borderRadius: '50%', background: '#f9a8b8',
    animation: 'pulse 1.5s ease infinite',
  },
  btnVoltar: {
    background: 'none', border: 'none', fontSize: '.82rem', color: '#b08090',
    cursor: 'pointer', textDecoration: 'underline',
  },
}