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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Lato:wght@300;400;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --rose:      #e8627a;
          --rose-light:#f9a8b8;
          --rose-pale: #fdf0f3;
          --rose-mid:  #fce4ea;
          --cream:     #fff8f9;
          --text:      #3d1f28;
          --text-soft: #7a4f5a;
        }

        body {
          font-family: 'Lato', sans-serif;
          background: var(--cream);
          color: var(--text);
          min-height: 100vh;
        }

        .auth-layout {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        /* Lado esquerdo — decorativo */
        .auth-left {
          background: linear-gradient(160deg, #fce4ea 0%, #f9c5d0 50%, #f0a8bc 100%);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 48px;
          position: relative; overflow: hidden;
        }
        .auth-left-logo {
          font-family: 'Playfair Display', serif;
          font-size: 2.2rem; font-weight: 700;
          color: var(--rose); margin-bottom: 32px;
          text-decoration: none;
        }
        .auth-left h2 {
          font-family: 'Playfair Display', serif;
          font-size: 2.4rem; color: var(--text);
          line-height: 1.2; text-align: center;
          margin-bottom: 20px;
        }
        .auth-left h2 em { font-style: italic; color: var(--rose); }
        .auth-left p {
          color: var(--text-soft); text-align: center;
          font-size: 1rem; line-height: 1.7; max-width: 360px;
        }
        .auth-testimonial {
          margin-top: 48px;
          background: white;
          border-radius: 20px;
          padding: 24px 28px;
          max-width: 380px;
          box-shadow: 0 8px 32px rgba(232,98,122,.12);
        }
        .auth-testimonial p {
          font-style: italic; font-size: .9rem;
          color: var(--text-soft); margin-bottom: 14px;
        }
        .auth-testimonial-author {
          display: flex; align-items: center; gap: 10px;
        }
        .auth-testimonial-avatar {
          width: 36px; height: 36px;
          background: var(--rose-mid); border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.2rem;
        }
        .auth-testimonial-name {
          font-weight: 700; font-size: .85rem; color: var(--text);
        }
        .auth-testimonial-stars { color: #c9956a; font-size: .75rem; }

        /* Lado direito — formulário */
        .auth-right {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 48px 40px;
        }
        .auth-form-wrap { width: 100%; max-width: 400px; }

        .auth-form-wrap h1 {
          font-family: 'Playfair Display', serif;
          font-size: 2rem; color: var(--text);
          margin-bottom: 8px;
        }
        .auth-form-wrap .subtitle {
          color: var(--text-soft); font-size: .95rem;
          margin-bottom: 36px;
        }

        /* Google btn */
        .btn-google {
          width: 100%;
          display: flex; align-items: center; justify-content: center; gap: 12px;
          background: white;
          border: 2px solid #e0d0d4;
          border-radius: 14px;
          padding: 13px;
          font-size: .95rem; font-weight: 700; color: var(--text);
          cursor: pointer;
          transition: border-color .2s, box-shadow .2s;
          margin-bottom: 24px;
        }
        .btn-google:hover {
          border-color: var(--rose-light);
          box-shadow: 0 4px 16px rgba(232,98,122,.1);
        }
        .btn-google svg { width: 20px; height: 20px; }

        .divider {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 24px;
        }
        .divider::before, .divider::after {
          content: ''; flex: 1;
          height: 1px; background: var(--rose-mid);
        }
        .divider span { font-size: .8rem; color: var(--text-soft); white-space: nowrap; }

        /* Campos */
        .field { margin-bottom: 18px; }
        .field label {
          display: block; font-size: .85rem; font-weight: 700;
          color: var(--text); margin-bottom: 7px;
        }
        .field input {
          width: 100%;
          border: 2px solid var(--rose-mid);
          border-radius: 12px;
          padding: 13px 16px;
          font-size: .95rem; font-family: 'Lato', sans-serif;
          color: var(--text); background: white;
          transition: border-color .2s, box-shadow .2s;
          outline: none;
        }
        .field input:focus {
          border-color: var(--rose);
          box-shadow: 0 0 0 3px rgba(232,98,122,.12);
        }

        .forgot {
          text-align: right; margin-top: -10px; margin-bottom: 24px;
        }
        .forgot a {
          font-size: .82rem; color: var(--rose); text-decoration: none;
        }
        .forgot a:hover { text-decoration: underline; }

        /* Erro */
        .erro-box {
          background: #fff0f2;
          border: 1px solid var(--rose-light);
          border-radius: 10px;
          padding: 12px 16px;
          font-size: .875rem; color: #c0415a;
          margin-bottom: 18px;
        }

        /* Submit */
        .btn-submit {
          width: 100%;
          background: linear-gradient(135deg, var(--rose), #c94f68);
          color: white; border: none;
          border-radius: 14px; padding: 14px;
          font-size: 1rem; font-weight: 700;
          font-family: 'Lato', sans-serif;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(232,98,122,.35);
          transition: opacity .2s, transform .2s;
        }
        .btn-submit:hover:not(:disabled) { opacity: .9; transform: translateY(-1px); }
        .btn-submit:disabled { opacity: .6; cursor: not-allowed; }

        .auth-switch {
          text-align: center; margin-top: 24px;
          font-size: .9rem; color: var(--text-soft);
        }
        .auth-switch a { color: var(--rose); font-weight: 700; text-decoration: none; }
        .auth-switch a:hover { text-decoration: underline; }

        /* Responsive */
        @media (max-width: 768px) {
          .auth-layout { grid-template-columns: 1fr; }
          .auth-left { display: none; }
          .auth-right { padding: 40px 24px; }
        }
      `}</style>

      <div className="auth-layout">
        {/* Lado esquerdo */}
        <div className="auth-left">
                  <Link href="/" className="nav-logo">
          <Image src="/logo.png" alt="Presentim" width={1024} height={272} priority style={{ height: 44, width: 'auto' }} />
        </Link>
          <h2>Crie presentes que<br /><em>emocionam de verdade</em></h2>
          <p>Fotos, músicas e mensagens num link único. A experiência mais carinhosa para quem você ama.</p>
          <div className="auth-testimonial">
            <p>"Fiz um presente para minha mãe no aniversário dela. Ela chorou de emoção! Nunca vi algo tão carinhoso."</p>
            <div className="auth-testimonial-author">
              <div className="auth-testimonial-avatar">👩‍🦰</div>
              <div>
                <div className="auth-testimonial-name">Ana Clara</div>
                <div className="auth-testimonial-stars">★★★★★</div>
              </div>
            </div>
          </div>
        </div>

        {/* Lado direito */}
        <div className="auth-right">
          <div className="auth-form-wrap">
            <h1>Bem-vindo de volta</h1>
            <p className="subtitle">Entre na sua conta para gerenciar seus presentes.</p>

            {/* Google */}
            <button className="btn-google" onClick={handleGoogleLogin} disabled={loading}>
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Entrar com Google
            </button>

            <div className="divider"><span>ou entre com e-mail</span></div>

            {erro && <div className="erro-box">{erro}</div>}

            <form onSubmit={handleEmailLogin}>
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input
                  id="email" type="email" placeholder="seu@email.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  required autoComplete="email"
                />
              </div>
              <div className="field">
                <label htmlFor="senha">Senha</label>
                <input
                  id="senha" type="password" placeholder="••••••••"
                  value={senha} onChange={e => setSenha(e.target.value)}
                  required autoComplete="current-password"
                />
              </div>

              <div className="forgot">
                <Link href="/esqueci-senha">Esqueci minha senha</Link>
              </div>

              <button className="btn-submit" type="submit" disabled={loading}>
                {loading ? 'Entrando…' : 'Entrar'}
              </button>
            </form>

            <p className="auth-switch">
              Não tem conta? <Link href="/cadastro">Criar conta grátis</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#fff8f9' }} />}>
      <LoginContent />
    </Suspense>
  )
}