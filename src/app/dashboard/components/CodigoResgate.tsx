'use client'

import { useState } from 'react'
import styles from './CodigoResgate.module.css'

type CodigoResgateProps = {
  onSucesso: (creditos: number) => void
}

export default function CodigoResgate({ onSucesso }: CodigoResgateProps) {
  const [aberto, setAberto] = useState(false)
  const [codigo, setCodigo] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  async function handleResgatar() {
    if (!codigo.trim()) return
    setLoading(true)
    setErro('')
    setSucesso('')

    try {
      const res = await fetch('/api/codigo/resgatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: codigo.trim() }),
      })
      const data = await res.json()

      if (data.ok) {
        setSucesso(data.mensagem)
        setCodigo('')
        onSucesso(data.creditos)
        setTimeout(() => {
          setSucesso('')
          setAberto(false)
        }, 3000)
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
      <button className={styles.toggleBtn} onClick={() => setAberto(true)}>
        🎟️ Tem um código promocional?
      </button>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>🎟️ Código promocional</span>
        <button className={styles.fechar} onClick={() => { setAberto(false); setErro(''); setSucesso('') }}>✕</button>
      </div>

      <div className={styles.inputRow}>
        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value.toUpperCase())}
          placeholder="Digite o código"
          className={styles.input}
          maxLength={30}
          onKeyDown={(e) => e.key === 'Enter' && handleResgatar()}
          disabled={loading}
        />
        <button
          onClick={handleResgatar}
          disabled={loading || !codigo.trim()}
          className={styles.btnResgatar}
        >
          {loading ? '…' : 'Resgatar'}
        </button>
      </div>

      {erro && <div className={styles.erro}>⚠️ {erro}</div>}
      {sucesso && <div className={styles.sucesso}>🎉 {sucesso}</div>}
    </div>
  )
}