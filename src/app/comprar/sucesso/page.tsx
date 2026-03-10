'use client'

import { useEffect, useRef, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function SucessoContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const plano = searchParams.get('plano')
  const [contagem, setContagem] = useState(6)
  const [status, setStatus] = useState<'confirmando' | 'ok'>('confirmando')
  const CREDITOS_PLANO: Record<string, number> = { starter: 1, popular: 3, max: 6 }
  const [creditos, setCreditos] = useState(CREDITOS_PLANO[plano ?? ''] ?? 1)
  const redirecionou = useRef(false)

  useEffect(() => {
    async function verificar() {
      try {
        // Tenta pegar do sessionStorage primeiro
        const billingId = sessionStorage.getItem('abacate_billing_id')

        const res = await fetch('/api/pagamento/verificar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ billing_id: billingId, plano }),
        })
        const data = await res.json()
        console.log('verificar:', res.status, data)

        if (res.ok) {
          setCreditos(data.creditos ?? CREDITOS_PLANO[plano ?? ''] ?? 1)
          sessionStorage.removeItem('abacate_billing_id')
        }
      } catch (err) {
        console.error('Erro ao verificar:', err)
      } finally {
        setStatus('ok')
      }
    }
    verificar()
  }, [])

  useEffect(() => {
    if (status !== 'ok') return
    const t = setInterval(() => setContagem(p => p - 1), 1000)
    return () => clearInterval(t)
  }, [status])

  useEffect(() => {
    if (contagem <= 0 && !redirecionou.current) {
      redirecionou.current = true
      router.push('/dashboard')
    }
  }, [contagem])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lato:wght@300;400;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Lato',sans-serif;background:#fff8f9}
        @keyframes popIn{0%{transform:scale(.5);opacity:0}70%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .page{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px 24px}
        .emoji{font-size:5rem;animation:popIn .6s ease;margin-bottom:24px}
        .spinner{width:48px;height:48px;border:4px solid #f9a8b8;border-top-color:#e8627a;border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 24px}
        h1{font-family:'Playfair Display',serif;font-size:2.2rem;color:#3d1f28;margin-bottom:12px;animation:fadeUp .6s .2s ease both}
        h1 span{color:#e8627a}
        .sub{color:#7a4f5a;font-size:1rem;line-height:1.6;margin-bottom:8px;animation:fadeUp .6s .3s ease both}
        .creditos-badge{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,#e8627a,#f9a8b8);color:white;font-size:1.1rem;font-weight:700;padding:12px 28px;border-radius:50px;margin:24px 0;animation:fadeUp .6s .4s ease both;box-shadow:0 8px 24px rgba(232,98,122,.3)}
        .redirect{color:#b08090;font-size:.85rem;margin-bottom:32px;animation:fadeUp .6s .5s ease both}
        .btn{display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#e8627a,#f9a8b8);color:white;border:none;border-radius:12px;font-family:'Lato',sans-serif;font-size:1rem;font-weight:700;text-decoration:none;box-shadow:0 8px 24px rgba(232,98,122,.3);animation:fadeUp .6s .6s ease both;transition:transform .2s}
        .btn:hover{transform:translateY(-2px)}
      `}</style>
      <div className="page">
        {status === 'confirmando' ? (
          <>
            <div className="spinner" />
            <p style={{ color: '#7a4f5a' }}>Confirmando seu pagamento…</p>
          </>
        ) : (
          <>
            <div className="emoji">🎉</div>
            <h1>Pagamento <span>confirmado!</span></h1>
            <p className="sub">Seus créditos já estão disponíveis na sua conta.</p>
            <div className="creditos-badge">
              🎁 +{creditos} crédito{creditos !== 1 ? 's' : ''} adicionado{creditos !== 1 ? 's' : ''}
            </div>
            <p className="redirect">Redirecionando para o dashboard em {contagem}s…</p>
            <Link href="/dashboard" className="btn">Ir para o dashboard agora</Link>
          </>
        )}
      </div>
    </>
  )
}

export default function SucessoPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#fff8f9' }} />}>
      <SucessoContent />
    </Suspense>
  )
}