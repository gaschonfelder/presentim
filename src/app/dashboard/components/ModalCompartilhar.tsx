'use client'

import { useState } from 'react'
import { QRCodeCanvas as QRCode } from 'qrcode.react'
import styles from './ModalCompartilhar.module.css'

import {
  Link2, Calendar, Share, Check,
} from 'lucide-react'

type ModalCompartilharProps = {
  slug: string
  cor: string
  tipo?: string
  onClose: () => void
}

export default function ModalCompartilhar({
  slug,
  cor,
  tipo,
  onClose,
}: ModalCompartilharProps) {
  const base = typeof window !== 'undefined' ? window.location.origin : ''
  const url = tipo === 'retrospectiva'
    ? `${base}/retrospectiva/${slug}`
    : tipo === 'streaming'
      ? `${base}/streaming/${slug}`
      : `${base}/p/${slug}`
  const [copiado, setCopiado] = useState(false)

  function copiar() {
    navigator.clipboard.writeText(url)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.icon}><Share size={40} strokeWidth={2} color='#e8627a' /></div>
        <h3 className={styles.title}>Compartilhar presente</h3>
        <p className={styles.subtitle}>
          Envie o link ou mostre o QR Code para quem você ama.
        </p>

        <div className={styles.qrWrapper}>
          <QRCode value={url} size={160} fgColor={cor} />
        </div>

        <div className={styles.urlBox}>{url}</div>

        <button
          onClick={copiar}
          className={`${styles.btnCopiar} ${copiado ? styles.btnCopiarSuccess : ''}`}
          style={
            copiado
              ? undefined
              : { background: `linear-gradient(135deg, ${cor}, ${cor}bb)` }
          }
        >
          {copiado ? (
            <span className={styles.btnContent}>
              <Check size={18} strokeWidth={3}/>Copiado
            </span>
          ) : (
            <span className={styles.btnContent}>
              <Link2 size={18} strokeWidth={3} />
              Copiar link
            </span>
          )}
        </button>

        <button onClick={onClose} className={styles.btnFechar}>
          Fechar
        </button>
      </div>
    </div>
  )
}