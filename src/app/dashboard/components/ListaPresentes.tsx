import type { Presente } from '@/types'
import PresenteCard from './PresenteCard'
import styles from './ListaPresentes.module.css'

type ListaPresentesProps = {
  presentes: Presente[]
  onNovo: () => void
  onCompartilhar: (p: Presente) => void
  onDeletar: (id: string) => void
}

export default function ListaPresentes({
  presentes,
  onNovo,
  onCompartilhar,
  onDeletar,
}: ListaPresentesProps) {
  if (presentes.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>🎁</div>
        <h3>Nenhum presente ainda</h3>
        <p>Crie seu primeiro presente e surpreenda quem você ama!</p>
        <button className={styles.btnNovo} onClick={onNovo}>
          Criar meu primeiro presente
        </button>
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {presentes.map((p) => (
        <PresenteCard
          key={p.id}
          presente={p}
          onCompartilhar={onCompartilhar}
          onDeletar={onDeletar}
        />
      ))}
    </div>
  )
}