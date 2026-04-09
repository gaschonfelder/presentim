'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function ContatoPage() {
  const [copiado, setCopiado] = useState(false)

  function copiar() {
    navigator.clipboard.writeText('presentim.sac@gmail.com')
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Lato:wght@300;400;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Lato',sans-serif;background:#fff8f9;color:#3d1f28}
        .navbar{background:white;border-bottom:1px solid #fce4ea;padding:0 48px;height:64px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50}
        .nav-logo{font-family:'Playfair Display',serif;font-size:1.4rem;color:#e8627a;text-decoration:none;font-weight:700}
        .nav-back{font-size:.88rem;color:#7a4f5a;text-decoration:none}
        .nav-back:hover{color:#e8627a}
        .page{max-width:600px;margin:0 auto;padding:80px 24px;text-align:center}
        .emoji{font-size:4rem;margin-bottom:24px}
        h1{font-family:'Playfair Display',serif;font-size:2.2rem;margin-bottom:12px}
        h1 em{font-style:italic;color:#e8627a}
        .sub{color:#7a4f5a;font-size:1rem;line-height:1.7;max-width:440px;margin:0 auto 48px}
        .email-card{background:white;border:2px solid #fce4ea;border-radius:20px;padding:36px 32px;margin-bottom:32px;box-shadow:0 4px 20px rgba(232,98,122,.07)}
        .email-card .label{font-size:.75rem;color:#b08090;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px}
        .email-card .email{font-family:'Playfair Display',serif;font-size:1.5rem;color:#3d1f28;margin-bottom:24px}
        .btn-row{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
        .btn{padding:13px 28px;border-radius:12px;font-family:'Lato',sans-serif;font-size:.92rem;font-weight:700;cursor:pointer;transition:all .2s;text-decoration:none;display:inline-flex;align-items:center;gap:8px;border:none}
        .btn-primary{background:linear-gradient(135deg,#e8627a,#c94f68);color:white;box-shadow:0 6px 20px rgba(232,98,122,.28)}
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(232,98,122,.4)}
        .btn-secondary{background:white;color:#e8627a;border:2px solid #fce4ea}
        .btn-secondary:hover{border-color:#e8627a;background:#fdf0f3}
        .copied{color:#2a8a5a;font-size:.82rem;margin-top:8px;height:18px;transition:opacity .2s}
        .info-cards{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:40px}
        @media(max-width:500px){.info-cards{grid-template-columns:1fr}}
        .info-card{background:white;border:1.5px solid #fce4ea;border-radius:16px;padding:20px;text-align:left}
        .info-card .ic-emoji{font-size:1.5rem;margin-bottom:8px}
        .info-card strong{display:block;color:#3d1f28;font-size:.9rem;margin-bottom:4px}
        .info-card p{font-size:.82rem;color:#7a4f5a;line-height:1.6}
        footer{text-align:center;padding:32px 24px;color:#b08090;font-size:.82rem;border-top:1px solid #fce4ea;margin-top:60px}
        footer a{color:#e8627a;text-decoration:none;margin:0 6px}
      `}</style>

      <nav className="navbar">
        <Link href="/" className="nav-logo">Presentim</Link>
        <Link href="/" className="nav-back">← Voltar</Link>
      </nav>

      <div className="page">
        <div className="emoji">💌</div>
        <h1>Fale com a <em>gente</em></h1>
        <p className="sub">Tem alguma dúvida, sugestão ou problema? Estamos aqui para ajudar. Respondemos em até 1 dia útil.</p>

        <div className="email-card">
          <div className="label">Email de suporte</div>
          <div className="email">presentim.sac@gmail.com</div>
          <div className="btn-row">
            <a href="mailto:presentim.sac@gmail.com" className="btn btn-primary">
              ✉️ Enviar email
            </a>
            <button className="btn btn-secondary" onClick={copiar}>
              {copiado ? '✅ Copiado!' : '📋 Copiar email'}
            </button>
          </div>
          <div className="copied" style={{ opacity: copiado ? 1 : 0 }}>
            Email copiado para a área de transferência
          </div>
        </div>

        <div className="info-cards">
          <div className="info-card">
            <div className="ic-emoji">⏱️</div>
            <strong>Tempo de resposta</strong>
            <p>Respondemos em até 1 dia útil, geralmente muito antes disso.</p>
          </div>
          <div className="info-card">
            <div className="ic-emoji">🔧</div>
            <strong>Problemas técnicos</strong>
            <p>Descreva o problema com detalhes e, se possível, inclua prints.</p>
          </div>
          <div className="info-card">
            <div className="ic-emoji">💳</div>
            <strong>Pagamentos</strong>
            <p>Créditos não chegaram? Informe o comprovante do Pix no email.</p>
          </div>
          <div className="info-card">
            <div className="ic-emoji">💡</div>
            <strong>Sugestões</strong>
            <p>Adoramos ouvir ideias para melhorar o Presentim.</p>
          </div>
        </div>
      </div>

      <footer>
        <Link href="/privacidade">Privacidade</Link> · <Link href="/termos">Termos</Link> · <Link href="/contato">Contato</Link> · <Link href="/historia">História</Link>
      </footer>
    </>
  )
}