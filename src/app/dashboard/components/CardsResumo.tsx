import Link from 'next/link'
import styles from './CardsResumo.module.css'
import {
  Gift, CircleStar, Eye, Sparkles,
} from 'lucide-react'

type CardsResumoProps = {
  creditos: number
  totalPresentes: number
  totalVisualizacoes: number
}

export default function CardsResumo({
  creditos,
  totalPresentes,
  totalVisualizacoes,
}: CardsResumoProps) {
  return (
    <div className={styles.creditsRow}>
      <div className={styles.creditCard}>
        <span className={styles.creditIcon}><CircleStar size={30} strokeWidth={2} color='#e8627a' /></span>
        <div className={styles.creditInfo}>
          <div className={styles.num}>{creditos}</div>
          <div className={styles.label}>créditos disponíveis</div>
        </div>
      </div>

      <div className={styles.creditCard}>
        <span className={styles.creditIcon}><Gift size={30} strokeWidth={2} color='#e8627a' /></span>
        <div className={styles.creditInfo}>
          <div className={styles.num}>{totalPresentes}</div>
          <div className={styles.label}>presentes criados</div>
        </div>
      </div>

      <div className={styles.creditCard}>
        <span className={styles.creditIcon}><Eye size={30} strokeWidth={2} color='#e8627a' /></span>
        <div className={styles.creditInfo}>
          <div className={styles.num}>{totalVisualizacoes}</div>
          <div className={styles.label}>visualizações totais</div>
        </div>
      </div>

      <div className={`${styles.creditCard} ${styles.creditCardHighlight}`}>
        <span className={styles.creditIcon}><Sparkles size={30} strokeWidth={2} color='white' /></span>
        <div className={styles.creditInfo}>
          <div className={styles.highlightLabel}>Precisa de mais créditos?</div>
          <Link href="/comprar" className={styles.btnComprar}>
            Ver planos
          </Link>
        </div>
      </div>
    </div>
  )
}