'use client'

import { useState } from 'react'

/* ── tokens ── */
const R  = '#e8627a'
const G  = 'rgba(232,98,122,.35)'
const S  = 'rgba(255,255,255,.04)'
const B  = 'rgba(255,255,255,.08)'
const T  = '#f5e8ec'
const TS = 'rgba(245,232,236,.65)'

type CodigoResgateProps = {
  onSucesso: (creditos: number) => void
}

export default function CodigoResgate({ onSucesso }: CodigoResgateProps) {
  const [aberto,  setAberto]  = useState(false)
  const [codigo,  setCodigo]  = useState('')
  const [loading, setLoading] = useState(false)
  const [erro,    setErro]    = useState('')
  const [sucesso, setSucesso] = useState('')

  async function handleResgatar() {
    if (!codigo.trim()) return
    setLoading(true)
    setErro('')
    setSucesso('')

    try {
      const res  = await fetch('/api/codigo/resgatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: codigo.trim() }),
      })
      const data = await res.json()

      if (data.ok) {
        setSucesso(data.mensagem)
        setCodigo('')
        onSucesso(data.creditos)
        setTimeout(() => { setSucesso(''); setAberto(false) }, 3000)
      } else {
        setErro(data.error || 'Erro ao resgatar código.')
      }
    } catch {
      setErro('Erro de conexão. Tente novamente.')
    }
    setLoading(false)
  }

  if (!aberto) {
    return (
      <>
        <style>{`.toggle-promo:hover{border-color:${R}!important;color:${R}!important;background:rgba(232,98,122,.06)!important;}`}</style>
        <button
          className="toggle-promo"
          onClick={() => setAberto(true)}
          style={{
            background: 'none',
            border: `1px dashed rgba(232,98,122,.35)`,
            borderRadius: 12,
            padding: '10px 18px',
            marginBottom: '10px',
            fontSize: '.82rem',
            color: TS,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all .2s',
            width: '100%',
            marginTop: 8,
          }}
        >
          🎟️ Tem um código promocional?
        </button>
      </>
    )
  }

  return (
    <>
      <style>{`
        .resgate-input:focus { border-color: ${R} !important; }
        .resgate-input::placeholder { text-transform: none; letter-spacing: normal; color: rgba(245,232,236,.3); }
        .btn-resgatar:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 14px ${G}; }
        .btn-resgatar:disabled { opacity: .45; cursor: not-allowed; }
        .btn-fechar:hover { background: rgba(232,98,122,.1) !important; color: ${R} !important; }
      `}</style>

      <div style={{
        border: `1px solid ${B}`,
        borderRadius: 16,
        padding: 16,
        background: S,
        marginTop: 8,
        backdropFilter: 'blur(8px)',
      }}>
        {/* header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: '.88rem', fontWeight: 700, color: T }}>
            🎟️ Código promocional
          </span>
          <button
            className="btn-fechar"
            onClick={() => { setAberto(false); setErro(''); setSucesso('') }}
            style={{
              background: 'none', border: 'none',
              color: TS, cursor: 'pointer',
              padding: '2px 8px', borderRadius: 6,
              fontSize: '1rem', transition: 'all .2s',
              fontFamily: 'inherit',
            }}
          >
            ✕
          </button>
        </div>

        {/* input row */}
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            className="resgate-input"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
            placeholder="Digite o código"
            maxLength={30}
            disabled={loading}
            onKeyDown={(e) => e.key === 'Enter' && handleResgatar()}
            style={{
              flex: 1,
              padding: '10px 14px',
              border: `1.5px solid ${B}`,
              borderRadius: 10,
              fontSize: '.9rem',
              fontFamily: 'inherit',
              background: 'rgba(255,255,255,.06)',
              color: T,
              letterSpacing: '.08em',
              textTransform: 'uppercase',
              outline: 'none',
              transition: 'border-color .2s',
            }}
          />
          <button
            className="btn-resgatar"
            onClick={handleResgatar}
            disabled={loading || !codigo.trim()}
            style={{
              padding: '10px 20px',
              background: `linear-gradient(135deg,${R},#c94f68)`,
              color: 'white',
              border: 'none',
              borderRadius: 10,
              fontSize: '.85rem',
              fontWeight: 700,
              fontFamily: 'inherit',
              cursor: 'pointer',
              transition: 'all .2s',
              whiteSpace: 'nowrap',
            }}
          >
            {loading ? '…' : 'Resgatar'}
          </button>
        </div>

        {/* feedback */}
        {erro && (
          <div style={{
            marginTop: 10, fontSize: '.8rem',
            color: '#f87171',
            background: 'rgba(248,113,113,.1)',
            border: '1px solid rgba(248,113,113,.2)',
            padding: '8px 12px', borderRadius: 8,
          }}>
            ⚠️ {erro}
          </div>
        )}
        {sucesso && (
          <div style={{
            marginTop: 10, fontSize: '.8rem',
            color: '#4ade80', fontWeight: 600,
            background: 'rgba(74,222,128,.1)',
            border: '1px solid rgba(74,222,128,.2)',
            padding: '8px 12px', borderRadius: 8,
          }}>
            🎉 {sucesso}
          </div>
        )}
      </div>
    </>
  )
}