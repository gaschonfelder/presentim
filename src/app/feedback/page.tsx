'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function FeedbackPage() {
  const [nome, setNome] = useState('')
  const [nota, setNota] = useState(0)
  const [hover, setHover] = useState(0)
  const [comentario, setComentario] = useState('')
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState('')

  async function handleEnviar() {
    if (nota === 0) {
      setErro('Selecione uma nota de 1 a 5 estrelas.')
      return
    }

    setLoading(true)
    setErro('')

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, nota, comentario }),
      })

      if (res.ok) {
        setEnviado(true)
      } else {
        setErro('Erro ao enviar. Tente novamente.')
      }
    } catch {
      setErro('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
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
        .page{max-width:560px;margin:0 auto;padding:60px 24px 80px;text-align:center}
        .emoji{font-size:3.5rem;margin-bottom:20px}
        h1{font-family:'Playfair Display',serif;font-size:2rem;margin-bottom:8px}
        h1 em{font-style:italic;color:#e8627a}
        .sub{color:#7a4f5a;font-size:.95rem;line-height:1.7;max-width:400px;margin:0 auto 40px}
        .card{background:white;border:2px solid #fce4ea;border-radius:20px;padding:36px 32px;box-shadow:0 4px 20px rgba(232,98,122,.07);text-align:left}
        .field{margin-bottom:24px}
        .field label{display:block;font-size:.82rem;font-weight:700;color:#3d1f28;margin-bottom:8px}
        .field input,.field textarea{width:100%;border:2px solid #fce4ea;border-radius:12px;padding:12px 16px;font-size:.92rem;font-family:'Lato',sans-serif;color:#3d1f28;background:#fff8f9;transition:border-color .2s;outline:none}
        .field input:focus,.field textarea:focus{border-color:#e8627a}
        .field textarea{resize:vertical;min-height:100px}
        .field .opcional{font-weight:400;color:#b08090;font-size:.78rem;margin-left:4px}
        .stars-wrap{text-align:center;margin-bottom:28px}
        .stars-label{font-size:.82rem;font-weight:700;color:#3d1f28;margin-bottom:12px}
        .stars{display:inline-flex;gap:8px}
        .star{font-size:2.4rem;cursor:pointer;transition:transform .15s;user-select:none;-webkit-user-select:none}
        .star:hover{transform:scale(1.2)}
        .nota-texto{font-size:.82rem;color:#7a4f5a;margin-top:8px;height:20px}
        .btn-enviar{width:100%;background:linear-gradient(135deg,#e8627a,#c94f68);color:white;border:none;border-radius:14px;padding:15px;font-size:1rem;font-weight:700;font-family:'Lato',sans-serif;cursor:pointer;box-shadow:0 6px 20px rgba(232,98,122,.35);transition:opacity .2s,transform .2s;margin-top:8px}
        .btn-enviar:hover:not(:disabled){opacity:.9;transform:translateY(-1px)}
        .btn-enviar:disabled{opacity:.6;cursor:not-allowed}
        .erro{background:#fff0f0;color:#d44;border:1px solid #fdd;border-radius:10px;padding:12px 16px;font-size:.85rem;margin-bottom:20px;text-align:center}
        .sucesso{text-align:center;padding:20px 0}
        .sucesso .icone{font-size:4rem;margin-bottom:20px}
        .sucesso h2{font-family:'Playfair Display',serif;font-size:1.8rem;color:#3d1f28;margin-bottom:12px}
        .sucesso p{color:#7a4f5a;font-size:.95rem;line-height:1.7;margin-bottom:32px}
        .btn-voltar{display:inline-block;background:white;color:#e8627a;border:2px solid #fce4ea;border-radius:14px;padding:13px 32px;font-size:.92rem;font-weight:700;text-decoration:none;transition:all .2s;font-family:'Lato',sans-serif}
        .btn-voltar:hover{border-color:#e8627a;background:#fdf0f3}
        footer{text-align:center;padding:32px 24px;color:#b08090;font-size:.82rem;border-top:1px solid #fce4ea;margin-top:60px}
        footer a{color:#e8627a;text-decoration:none;margin:0 6px}
        @media(max-width:500px){.navbar{padding:0 20px}.page{padding:40px 20px 60px}.card{padding:28px 20px}}
      `}</style>

      <nav className="navbar">
        <Link href="/" className="nav-logo">Presentim</Link>
        <Link href="/" className="nav-back">← Voltar</Link>
      </nav>

      <div className="page">
        <div className="emoji">⭐</div>
        <h1>Sua <em>opinião</em></h1>
        <p className="sub">Conta pra gente como foi sua experiência com o Presentim. Leva menos de 1 minuto!</p>

        <div className="card">
          {enviado ? (
            <div className="sucesso">
              <div className="icone">💝</div>
              <h2>Obrigado!</h2>
              <p>Sua avaliação foi enviada com sucesso. Ela nos ajuda muito a melhorar o Presentim!</p>
              <Link href="/" className="btn-voltar">Voltar para o início</Link>
            </div>
          ) : (
            <>
              {erro && <div className="erro">{erro}</div>}

              <div className="stars-wrap">
                <div className="stars-label">Como foi sua experiência?</div>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span
                      key={i}
                      className="star"
                      role="button"
                      aria-label={`${i} estrela${i > 1 ? 's' : ''}`}
                      onClick={() => setNota(i)}
                      onMouseEnter={() => setHover(i)}
                      onMouseLeave={() => setHover(0)}
                    >
                      {i <= (hover || nota) ? '⭐' : '☆'}
                    </span>
                  ))}
                </div>
                <div className="nota-texto">
                  {nota === 1 && '😕 Precisa melhorar'}
                  {nota === 2 && '😐 Razoável'}
                  {nota === 3 && '🙂 Bom'}
                  {nota === 4 && '😄 Muito bom!'}
                  {nota === 5 && '🤩 Incrível!'}
                </div>
              </div>

              <div className="field">
                <label>Seu nome <span className="opcional">(opcional)</span></label>
                <input
                  type="text"
                  placeholder="Como você se chama?"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div className="field">
                <label>Comentário <span className="opcional">(opcional)</span></label>
                <textarea
                  placeholder="O que você mais gostou? O que podemos melhorar?"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                />
              </div>

              <button
                className="btn-enviar"
                onClick={handleEnviar}
                disabled={loading}
              >
                {loading ? '⏳ Enviando…' : '💌 Enviar avaliação'}
              </button>
            </>
          )}
        </div>
      </div>

      <footer>
        <Link href="/privacidade">Privacidade</Link> · <Link href="/termos">Termos</Link> · <Link href="/contato">Contato</Link>
      </footer>
    </>
  )
}