'use client'

import { useState } from 'react'
import { QRCodeCanvas as QRCode } from 'qrcode.react'
import styles from './ModalCompartilhar.module.css'

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
  const url = tipo === 'retrospectiva' ? `${base}/retrospectiva/${slug}` : `${base}/p/${slug}`
  const [copiado, setCopiado] = useState(false)

  function copiar() {
    navigator.clipboard.writeText(url)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.icon}>📱</div>
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
          {copiado ? '✅ Link copiado!' : '📋 Copiar link'}
        </button>

        <button onClick={onClose} className={styles.btnFechar}>
          Fechar
        </button>
      </div>
    </div>
  )
}