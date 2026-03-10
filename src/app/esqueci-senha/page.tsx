'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function EsqueciSenhaPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErro('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/callback?next=/auth/reset-password`,
    })

    if (error) {
      setErro('Erro ao enviar e-mail. Verifique o endereço e tente novamente.')
      setLoading(false)
      return
    }

    setEnviado(true)
    setLoading(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Lato:wght@300;400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --rose: #e8627a; --rose-light: #f9a8b8; --rose-mid: #fce4ea;
          --cream: #fff8f9; --text: #3d1f28; --text-soft: #7a4f5a;
        }
        body { font-family: 'Lato', sans-serif; background: var(--cream); color: var(--text); min-height: 100vh; }
        .auth-layout { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; }
        .auth-left {
          background: linear-gradient(160deg, #fce4ea 0%, #f9c5d0 50%, #f0a8bc 100%);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 48px; position: relative; overflow: hidden;
        }
        .auth-left::before { content: '🔑'; position: absolute; font-size: 24rem; opacity: .07; top: -60px; right: -80px; pointer-events: none; }
        .auth-left-logo { font-family: 'Playfair Display', serif; font-size: 2.2rem; font-weight: 700; color: var(--rose); margin-bottom: 32px; text-decoration: none; }
        .auth-left h2 { font-family: 'Playfair Display', serif; font-size: 2.4rem; color: var(--text); line-height: 1.2; text-align: center; margin-bottom: 20px; }
        .auth-left h2 em { font-style: italic; color: var(--rose); }
        .auth-left p { color: var(--text-soft); text-align: center; font-size: 1rem; line-height: 1.7; max-width: 360px; }
        .auth-right { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 40px; }
        .auth-form-wrap { width: 100%; max-width: 400px; }
        .auth-form-wrap h1 { font-family: 'Playfair Display', serif; font-size: 2rem; color: var(--text); margin-bottom: 8px; }
        .auth-form-wrap .subtitle { color: var(--text-soft); font-size: .95rem; margin-bottom: 36px; line-height: 1.6; }
        .field { margin-bottom: 18px; }
        .field label { display: block; font-size: .85rem; font-weight: 700; color: var(--text); margin-bottom: 7px; }
        .field input { width: 100%; border: 2px solid var(--rose-mid); border-radius: 12px; padding: 13px 16px; font-size: .95rem; font-family: 'Lato', sans-serif; color: var(--text); background: white; transition: border-color .2s, box-shadow .2s; outline: none; }
        .field input:focus { border-color: var(--rose); box-shadow: 0 0 0 3px rgba(232,98,122,.12); }
        .erro-box { background: #fff0f2; border: 1px solid var(--rose-light); border-radius: 10px; padding: 12px 16px; font-size: .875rem; color: #c0415a; margin-bottom: 18px; }
        .sucesso-box { background: #f0fff4; border: 1px solid #86efac; border-radius: 16px; padding: 32px 24px; text-align: center; }
        .sucesso-box .icone { font-size: 3rem; margin-bottom: 16px; }
        .sucesso-box h2 { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: var(--text); margin-bottom: 12px; }
        .sucesso-box p { color: var(--text-soft); font-size: .9rem; line-height: 1.6; margin-bottom: 24px; }
        .btn-submit { width: 100%; background: linear-gradient(135deg, var(--rose), #c94f68); color: white; border: none; border-radius: 14px; padding: 14px; font-size: 1rem; font-weight: 700; font-family: 'Lato', sans-serif; cursor: pointer; box-shadow: 0 6px 20px rgba(232,98,122,.35); transition: opacity .2s, transform .2s; margin-bottom: 20px; }
        .btn-submit:hover:not(:disabled) { opacity: .9; transform: translateY(-1px); }
        .btn-submit:disabled { opacity: .6; cursor: not-allowed; }
        .auth-switch { text-align: center; margin-top: 24px; font-size: .9rem; color: var(--text-soft); }
        .auth-switch a { color: var(--rose); font-weight: 700; text-decoration: none; }
        .auth-switch a:hover { text-decoration: underline; }
        @media (max-width: 768px) { .auth-layout { grid-template-columns: 1fr; } .auth-left { display: none; } .auth-right { padding: 40px 24px; } }
      `}</style>

      <div className="auth-layout">
        <div className="auth-left">
          <Link href="/" className="auth-left-logo">Presentim</Link>
          <h2>Recupere o acesso à sua <em>conta</em></h2>
          <p>Enviaremos um link para você criar uma nova senha e voltar a criar presentes inesquecíveis.</p>
        </div>

        <div className="auth-right">
          <div className="auth-form-wrap">
            {enviado ? (
              <div className="sucesso-box">
                <div className="icone">📬</div>
                <h2>E-mail enviado!</h2>
                <p>Verifique sua caixa de entrada em <strong>{email}</strong> e clique no link para criar uma nova senha.</p>
                <Link href="/login"><button className="btn-submit">Voltar para o login</button></Link>
              </div>
            ) : (
              <>
                <h1>Esqueci minha senha 🔑</h1>
                <p className="subtitle">Digite seu e-mail e enviaremos um link para você redefinir sua senha.</p>
                {erro && <div className="erro-box">{erro}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="field">
                    <label htmlFor="email">E-mail</label>
                    <input id="email" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
                  </div>
                  <button className="btn-submit" type="submit" disabled={loading}>
                    {loading ? 'Enviando…' : 'Enviar link de recuperação'}
                  </button>
                </form>
                <p className="auth-switch">Lembrou a senha? <Link href="/login">Voltar para o login</Link></p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}