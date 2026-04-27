'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function LoginContent() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErro('')

    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })

    if (error) {
      setErro('E-mail ou senha incorretos. Tente novamente.')
      setLoading(false)
      return
    }

    const next = new URLSearchParams(window.location.search).get('next') ?? '/dashboard'; router.push(next)
  }

  async function handleGoogleLogin() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
    if (error) {
      setErro('Erro ao entrar com Google. Tente novamente.')
      setLoading(false)
    }
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
        body{background:#150810!important;color:#f5e8ec!important;font-family:'Inter',system-ui,sans-serif!important}
        a{color:inherit;text-decoration:none}
        @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .auth-fade{animation:fadeIn .6s ease both}
        @media(max-width:768px){
          .auth-layout{grid-template-columns:1fr!important}
          .auth-left{display:none!important}
          .auth-right{padding:40px 24px!important}
        }
      `}</style>

      <div className="auth-layout" style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#150810', fontFamily: 'Inter,system-ui,sans-serif', color: T }}>
        {/* Lado esquerdo — decorativo */}
        <div className="auth-left" style={{ background: 'linear-gradient(160deg, #1f0f1a 0%, #2a1422 50%, #1a0c15 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48, position: 'relative', overflow: 'hidden' }}>
          {/* Glows */}
          <div aria-hidden="true" style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle,${G},transparent 65%)`, filter: 'blur(40px)', pointerEvents: 'none' }} />
          <div aria-hidden="true" style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(120,80,200,.2),transparent 65%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

          <Link href="/" style={{ marginBottom: 32, position: 'relative', zIndex: 1 }}>
            <Image src="/logo.png" alt="Presentim" width={1024} height={272} priority style={{ height: 44, width: 'auto', filter: 'brightness(0) invert(1)' }} />
          </Link>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '2.2rem', color: T, lineHeight: 1.2, textAlign: 'center', marginBottom: 20, position: 'relative', zIndex: 1 }}>
            Crie presentes que<br />
            <span style={{ fontStyle: 'italic', background: `linear-gradient(135deg,${R2},${R3})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>emocionam de verdade</span>
          </h2>
          <p style={{ color: TS, textAlign: 'center', fontSize: '1rem', lineHeight: 1.7, maxWidth: 360, position: 'relative', zIndex: 1 }}>
            Fotos, músicas e mensagens num link único. A experiência mais carinhosa para quem você ama.
          </p>

          {/* Testimonial */}
          <div style={{ marginTop: 48, background: S, border: `1px solid ${B}`, borderRadius: 20, padding: '24px 28px', maxWidth: 380, boxShadow: '0 8px 32px rgba(0,0,0,.3)', position: 'relative', zIndex: 1 }}>
            <p style={{ fontStyle: 'italic', fontSize: '.9rem', color: TS, marginBottom: 14, lineHeight: 1.7 }}>
              "Fiz um presente para minha mãe no aniversário dela. Ela chorou de emoção! Nunca vi algo tão carinhoso."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, background: 'rgba(232,98,122,.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>👩‍🦰</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '.85rem', color: T }}>Ana Clara</div>
                <div style={{ color: '#c9956a', fontSize: '.75rem' }}>★★★★★</div>
              </div>
            </div>
          </div>
        </div>

        {/* Lado direito — formulário */}
        <div className="auth-right auth-fade" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 40px' }}>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', color: T, marginBottom: 8, fontWeight: 400 }}>Bem-vindo de volta</h1>
            <p style={{ color: TS, fontSize: '.95rem', marginBottom: 36 }}>Entre na sua conta para gerenciar seus presentes.</p>

            {/* Google */}
            <button onClick={handleGoogleLogin} disabled={loading} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, background: 'transparent', border: `1.5px solid ${B}`, borderRadius: 14, padding: 13, fontSize: '.95rem', fontWeight: 700, color: T, cursor: 'pointer', marginBottom: 24, fontFamily: 'Inter,system-ui,sans-serif', transition: 'border-color .2s' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Entrar com Google
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ flex: 1, height: 1, background: B }} />
              <span style={{ fontSize: '.8rem', color: TS, whiteSpace: 'nowrap' }}>ou entre com e-mail</span>
              <div style={{ flex: 1, height: 1, background: B }} />
            </div>

            {erro && (
              <div style={{ background: 'rgba(232,98,122,.12)', border: `1px solid rgba(232,98,122,.3)`, borderRadius: 10, padding: '12px 16px', fontSize: '.875rem', color: '#ff8da7', marginBottom: 18 }}>
                {erro}
              </div>
            )}

            <form onSubmit={handleEmailLogin}>
              <div style={{ marginBottom: 18 }}>
                <label htmlFor="email" style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: T, marginBottom: 7 }}>E-mail</label>
                <input
                  id="email" type="email" placeholder="seu@email.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  required autoComplete="email"
                  style={{ width: '100%', border: `1.5px solid ${B}`, borderRadius: 12, padding: '13px 16px', fontSize: '.95rem', fontFamily: 'Inter,system-ui,sans-serif', color: T, background: S, outline: 'none', transition: 'border-color .2s' }}
                  onFocus={e => e.target.style.borderColor = R}
                  onBlur={e => e.target.style.borderColor = B}
                />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label htmlFor="senha" style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: T, marginBottom: 7 }}>Senha</label>
                <input
                  id="senha" type="password" placeholder="••••••••"
                  value={senha} onChange={e => setSenha(e.target.value)}
                  required autoComplete="current-password"
                  style={{ width: '100%', border: `1.5px solid ${B}`, borderRadius: 12, padding: '13px 16px', fontSize: '.95rem', fontFamily: 'Inter,system-ui,sans-serif', color: T, background: S, outline: 'none', transition: 'border-color .2s' }}
                  onFocus={e => e.target.style.borderColor = R}
                  onBlur={e => e.target.style.borderColor = B}
                />
              </div>

              <div style={{ textAlign: 'right', marginTop: -10, marginBottom: 24 }}>
                <Link href="/esqueci-senha" style={{ fontSize: '.82rem', color: R }}>Esqueci minha senha</Link>
              </div>

              <button type="submit" disabled={loading} style={{ width: '100%', background: `linear-gradient(135deg, ${R}, #c94f68)`, color: 'white', border: 'none', borderRadius: 14, padding: 14, fontSize: '1rem', fontWeight: 700, fontFamily: 'Inter,system-ui,sans-serif', cursor: 'pointer', boxShadow: `0 6px 20px ${G}`, transition: 'opacity .2s, transform .2s', opacity: loading ? .6 : 1 }}>
                {loading ? 'Entrando…' : 'Entrar'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: 24, fontSize: '.9rem', color: TS }}>
              Não tem conta? <Link href="/cadastro" style={{ color: R, fontWeight: 700 }}>Criar conta grátis</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#150810' }} />}>
      <LoginContent />
    </Suspense>
  )
}