'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from './ModalEscolherTipo.module.css'

import {
  Gift,Sparkles,
} from 'lucide-react'

type ModalEscolherTipoProps = {
  creditos: number
  onClose: () => void
}

export default function ModalEscolherTipo({ creditos, onClose }: ModalEscolherTipoProps) {
  const router = useRouter()

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerIcon}><Sparkles size={30} strokeWidth={2} /></div>
          <h2>Que tipo de presente?</h2>
          <p>Escolha o formato ideal para surpreender quem você ama.</p>
        </div>

        <div className={styles.opcoes}>
          {/* Opção 1: Página Presente */}
          <button
            onClick={() => {
              onClose()
              router.push('/novo')
            }}
            className={`${styles.opcao} ${styles.opcaoPagina}`}
          >
            <div className={styles.opcaoConteudo}>
              <div className={styles.opcaoEmoji}><Gift size={30} strokeWidth={2} /></div>
              <div className={styles.opcaoInfo}>
                <div className={styles.opcaoTituloRow}>
                  <span className={`${styles.opcaoTitulo} ${styles.opcaoTituloLight}`}>
                    Página Presente
                  </span>
                  <span
                    className={`${styles.opcaoCreditos} ${styles.opcaoCreditosPagina}`}
                  >
                    1 crédito
                  </span>
                </div>
                <p className={`${styles.opcaoDesc} ${styles.opcaoDescLight}`}>
                  Contagem regressiva, fotos, música e mensagem personalizada.
                  Clássico e emocionante.
                </p>
              </div>
            </div>
          </button>

          {/* Opção 2: Retrospectiva */}
          <button
            onClick={() => {
              onClose()
              router.push('/retrospectiva/novo')
            }}
            className={`${styles.opcao} ${styles.opcaoRetro}`}
          >
            <div className={styles.badgePremium}>PREMIUM</div>
            <div className={styles.opcaoConteudo}>
              <div className={styles.opcaoEmoji}>💫</div>
              <div className={styles.opcaoInfo}>
                <div className={styles.opcaoTituloRow}>
                  <span className={`${styles.opcaoTitulo} ${styles.opcaoTituloLight}`}>
                    Retrospectiva
                  </span>
                  <span className={`${styles.opcaoCreditos} ${styles.opcaoCreditosRetro}`}>
                    2 créditos
                  </span>
                </div>
                <p className={`${styles.opcaoDesc} ${styles.opcaoDescLight}`}>
                  Stories imersivos estilo Spotify Wrapped com céu estrelado,
                  contador ao vivo, fotos e conquistas do casal.
                </p>
              </div>
            </div>
          </button>
        </div>

        <button onClick={onClose} className={styles.btnCancelar}>
          Cancelar
        </button>
      </div>
    </div>
  )
}