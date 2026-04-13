'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

import {
  Gift, Heart, Music, Link2,
  PenLine, Calendar, Share, HeartHandshake,
  Stars, Trophy, Images, Smartphone,
  Star, Flame,
  ChevronDown,
} from 'lucide-react'

export default function CadastroPage() {
  const router = useRouter()
  const supabase = createClient()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErro('')

    if (senha.length < 6) {
      setErro('A senha precisa ter pelo menos 6 caracteres.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { data: { full_name: nome } },
    })

    if (error) {
      setErro('Erro ao criar conta. Verifique os dados e tente novamente.')
      setLoading(false)
      return
    }

    setSucesso(true)
    setLoading(false)
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

  if (sucesso) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Lato:wght@300;400;700&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          :root { --rose: #e8627a; --rose-pale: #fdf0f3; --rose-mid: #fce4ea; --cream: #fff8f9; --text: #3d1f28; --text-soft: #7a4f5a; }
          body { font-family: 'Lato', sans-serif; background: var(--cream); }
          .sucesso-wrap {
            min-height: 100vh; display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            text-align: center; padding: 40px 24px;
          }
          .sucesso-icon { font-size: 4rem; margin-bottom: 24px; }
          .sucesso-wrap h2 { font-family: 'Playfair Display', serif; font-size: 2rem; color: var(--text); margin-bottom: 12px; }
          .sucesso-wrap p { color: var(--text-soft); font-size: 1rem; max-width: 400px; line-height: 1.7; }
          .sucesso-wrap a {
            display: inline-block; margin-top: 32px;
            background: linear-gradient(135deg, #e8627a, #c94f68);
            color: white; padding: 14px 36px; border-radius: 50px;
            font-weight: 700; text-decoration: none;
            box-shadow: 0 6px 20px rgba(232,98,122,.3);
          }
        `}</style>
        <div className="sucesso-wrap">
          <div className="sucesso-icon">💌</div>
          <h2>Verifique seu e-mail!</h2>
          <p>Enviamos um link de confirmação para <strong>{email}</strong>. Acesse seu e-mail e clique no link para ativar sua conta.</p>
          <Link href="/login">Ir para o login</Link>
        </div>
      </>
    )
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

        .auth-left {
          background: linear-gradient(160deg, #fce4ea 0%, #f9c5d0 50%, #f0a8bc 100%);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 48px;
          position: relative; overflow: hidden;
        }

        .auth-left h2 {
          font-family: 'Playfair Display', serif;
          font-size: 2.2rem; color: var(--text);
          line-height: 1.2; text-align: center; margin-bottom: 20px;
        }
        .auth-left h2 em { font-style: italic; color: var(--rose); }
        .auth-left p {
          color: var(--text-soft); text-align: center;
          font-size: 1rem; line-height: 1.7; max-width: 360px;
        }

        .steps-list {
          margin-top: 40px; list-style: none;
          display: flex; flex-direction: column; gap: 16px;
          width: 100%; max-width: 360px;
        }
        .steps-list li {
          display: flex; align-items: center; gap: 14px;
          background: white; border-radius: 14px;
          padding: 14px 18px;
          box-shadow: 0 4px 16px rgba(232,98,122,.1);
          font-size: .9rem; color: var(--text);
        }
        .steps-list li span:first-child {
          font-size: 1.3rem; flex-shrink: 0;
        }

        .auth-right {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 48px 40px;
        }
        .auth-form-wrap { width: 100%; max-width: 400px; }
        .auth-form-wrap h1 {
          font-family: 'Playfair Display', serif;
          font-size: 2rem; color: var(--text); margin-bottom: 8px;
        }
        .auth-form-wrap .subtitle {
          color: var(--text-soft); font-size: .95rem; margin-bottom: 36px;
        }

        .btn-google {
          width: 100%;
          display: flex; align-items: center; justify-content: center; gap: 12px;
          background: white; border: 2px solid #e0d0d4; border-radius: 14px;
          padding: 13px; font-size: .95rem; font-weight: 700; color: var(--text);
          cursor: pointer; transition: border-color .2s, box-shadow .2s;
          margin-bottom: 24px;
        }
        .btn-google:hover { border-color: var(--rose-light); box-shadow: 0 4px 16px rgba(232,98,122,.1); }
        .btn-google svg { width: 20px; height: 20px; }

        .divider {
          display: flex; align-items: center; gap: 12px; margin-bottom: 24px;
        }
        .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--rose-mid); }
        .divider span { font-size: .8rem; color: var(--text-soft); white-space: nowrap; }

        .field { margin-bottom: 18px; }
        .field label { display: block; font-size: .85rem; font-weight: 700; color: var(--text); margin-bottom: 7px; }
        .field input {
          width: 100%; border: 2px solid var(--rose-mid); border-radius: 12px;
          padding: 13px 16px; font-size: .95rem; font-family: 'Lato', sans-serif;
          color: var(--text); background: white;
          transition: border-color .2s, box-shadow .2s; outline: none;
        }
        .field input:focus { border-color: var(--rose); box-shadow: 0 0 0 3px rgba(232,98,122,.12); }

        .senha-hint { font-size: .78rem; color: var(--text-soft); margin-top: 5px; }

        .erro-box {
          background: #fff0f2; border: 1px solid var(--rose-light); border-radius: 10px;
          padding: 12px 16px; font-size: .875rem; color: #c0415a; margin-bottom: 18px;
        }

        .btn-submit {
          width: 100%;
          background: linear-gradient(135deg, var(--rose), #c94f68);
          color: white; border: none; border-radius: 14px; padding: 14px;
          font-size: 1rem; font-weight: 700; font-family: 'Lato', sans-serif;
          cursor: pointer; box-shadow: 0 6px 20px rgba(232,98,122,.35);
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

        .terms {
          font-size: .78rem; color: var(--text-soft);
          text-align: center; margin-top: 16px; line-height: 1.5;
        }
        .terms a { color: var(--rose); text-decoration: none; }

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
          <h2>Seu presente em<br /><em>menos de 5 minutos</em></h2>
          <p>Crie, personalize e compartilhe. É simples assim.</p>
          <ul className="steps-list">
            <li><span><Gift size={25} strokeWidth={2} color="#ff4d6d" /></span><span>Escreva textos e adicione fotos</span></li>
            <li><span><Music size={25} strokeWidth={2} color="#ff4d6d" /></span><span>Escolha uma música especial</span></li>
            <li><span><Link2 size={25} strokeWidth={2} color="#ff4d6d" /></span><span>Receba um link único + QR Code</span></li>
            <li><span><Heart size={25} strokeWidth={2} color="#ff4d6d" /></span><span>Compartilhe e emocione!</span></li>
          </ul>
        </div>

        {/* Lado direito */}
        <div className="auth-right">
          <div className="auth-form-wrap">
            <h1>Criar conta</h1>
            <p className="subtitle">Comece agora — criar a conta é gratuito.</p>

            <button className="btn-google" onClick={handleGoogleLogin} disabled={loading}>
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Cadastrar com Google
            </button>

            <div className="divider"><span>ou cadastre com e-mail</span></div>

            {erro && <div className="erro-box">{erro}</div>}

            <form onSubmit={handleCadastro}>
              <div className="field">
                <label htmlFor="nome">Seu nome</label>
                <input
                  id="nome" type="text" placeholder="Como você se chama?"
                  value={nome} onChange={e => setNome(e.target.value)}
                  required autoComplete="name"
                />
              </div>
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
                  id="senha" type="password" placeholder="Mínimo 6 caracteres"
                  value={senha} onChange={e => setSenha(e.target.value)}
                  required autoComplete="new-password"
                />
                <p className="senha-hint">Mínimo de 6 caracteres</p>
              </div>

              <button className="btn-submit" type="submit" disabled={loading}>
                {loading ? 'Criando conta…' : 'Criar conta grátis'}
              </button>
            </form>

            <p className="terms">
              Ao criar sua conta, você concorda com nossos{' '}
              <a href="#">Termos de uso</a> e <a href="#">Política de privacidade</a>.
            </p>

            <p className="auth-switch">
              Já tem conta? <Link href="/login">Entrar</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}