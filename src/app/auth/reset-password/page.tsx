'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = createClient()
  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)
  const [sessaoOk, setSessaoOk] = useState(false)

  // Supabase injeta o token na URL como hash — precisa esperar a sessão ser restaurada
  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSessaoOk(true)
      }
    })
  }, [])

  async function handleSalvar() {
    if (!senha || senha.length < 6) { setErro('A senha deve ter pelo menos 6 caracteres.'); return }
    if (senha !== confirmar) { setErro('As senhas não coincidem.'); return }
    setLoading(true); setErro('')
    const { error } = await supabase.auth.updateUser({ password: senha })
    if (error) { setErro('Erro ao redefinir senha. O link pode ter expirado.'); setLoading(false); return }
    setSucesso(true)
    setTimeout(() => router.push('/dashboard'), 2500)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Lato:wght@300;400;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Lato',sans-serif;background:#fff8f9;color:#3d1f28}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes popIn{0%{transform:scale(.5);opacity:0}70%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
        .page{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 24px}
        .card{background:white;border-radius:24px;padding:48px 40px;width:100%;max-width:420px;box-shadow:0 8px 40px rgba(232,98,122,.1);border:1px solid #fce4ea;animation:fadeUp .5s ease both}
        .logo{font-family:'Playfair Display',serif;font-size:1.6rem;color:#e8627a;text-align:center;margin-bottom:32px;text-decoration:none;display:block}
        h1{font-family:'Playfair Display',serif;font-size:1.6rem;text-align:center;margin-bottom:8px}
        .sub{font-size:.88rem;color:#7a4f5a;text-align:center;margin-bottom:28px;line-height:1.6}
        label{display:block;font-size:.82rem;font-weight:700;color:#7a4f5a;margin-bottom:6px}
        input{width:100%;padding:12px 16px;border:2px solid #fce4ea;border-radius:12px;font-family:'Lato',sans-serif;font-size:.92rem;color:#3d1f28;outline:none;transition:border-color .2s;margin-bottom:16px}
        input:focus{border-color:#e8627a}
        .btn{width:100%;padding:14px;background:linear-gradient(135deg,#e8627a,#c94f68);color:white;border:none;border-radius:12px;font-family:'Lato',sans-serif;font-size:1rem;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 6px 20px rgba(232,98,122,.28)}
        .btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 28px rgba(232,98,122,.4)}
        .btn:disabled{opacity:.6;cursor:not-allowed;transform:none}
        .erro{background:#fff0f2;border:1px solid #f9a8b8;border-radius:10px;padding:12px 16px;color:#c0415a;font-size:.85rem;margin-bottom:16px}
        .sucesso-wrap{text-align:center;animation:fadeUp .5s ease}
        .sucesso-emoji{font-size:4rem;animation:popIn .6s ease;margin-bottom:16px}
        .link{display:block;text-align:center;margin-top:20px;font-size:.85rem;color:#7a4f5a}
        .link a{color:#e8627a;font-weight:700;text-decoration:none}
        .aguardando{text-align:center;padding:20px 0}
        .aguardando p{color:#7a4f5a;font-size:.9rem;margin-top:12px}
        @keyframes spin{to{transform:rotate(360deg)}}
        .spinner{width:36px;height:36px;border:3px solid #fce4ea;border-top-color:#e8627a;border-radius:50%;animation:spin .8s linear infinite;margin:0 auto}
      `}</style>

      <div className="page">
        <div className="card">
          <Link href="/" className="logo">Presentim</Link>

          {sucesso ? (
            <div className="sucesso-wrap">
              <div className="sucesso-emoji">🎉</div>
              <h1>Senha redefinida!</h1>
              <p style={{ color:'#7a4f5a', fontSize:'.9rem', marginTop:8 }}>Redirecionando para o dashboard…</p>
            </div>
          ) : !sessaoOk ? (
            <div className="aguardando">
              <div className="spinner" />
              <p>Verificando link de redefinição…</p>
              <p style={{ fontSize:'.8rem', marginTop:8 }}>Se demorar, <a href="/login" style={{ color:'#e8627a' }}>solicite um novo link</a>.</p>
            </div>
          ) : (
            <>
              <h1>Nova senha</h1>
              <p className="sub">Digite sua nova senha abaixo.</p>

              {erro && <div className="erro">⚠️ {erro}</div>}

              <label>Nova senha</label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={senha}
                onChange={e => setSenha(e.target.value)}
              />

              <label>Confirmar senha</label>
              <input
                type="password"
                placeholder="Repita a nova senha"
                value={confirmar}
                onChange={e => setConfirmar(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSalvar()}
              />

              <button className="btn" onClick={handleSalvar} disabled={loading}>
                {loading ? '⏳ Salvando…' : 'Salvar nova senha'}
              </button>

              <p className="link"><a href="/login">← Voltar ao login</a></p>
            </>
          )}
        </div>
      </div>
    </>
  )
}