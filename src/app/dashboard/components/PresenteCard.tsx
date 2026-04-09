import Link from 'next/link'
import type { Presente } from '@/types'
import styles from './PresenteCard.module.css'

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

type PresenteCardProps = {
  presente: Presente
  onCompartilhar: (p: Presente) => void
  onDeletar: (id: string) => void
}

export default function PresenteCard({
  presente: p,
  onCompartilhar,
  onDeletar,
}: PresenteCardProps) {
  // TODO: adicionar `tipo` ao tipo Presente em @/types e remover este cast
  const tipo = (p as Presente & { tipo?: string }).tipo ?? 'pagina'
  const isRetro = tipo === 'retrospectiva'

  const verHref = isRetro ? `/retrospectiva/${p.slug}` : `/p/${p.slug}`
  const editarHref = isRetro ? `/retrospectiva/editar/${p.id}` : `/editar/${p.id}`
  const linkPath = isRetro ? `/retrospectiva/${p.slug}` : `/p/${p.slug}`

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={styles.emoji}>{isRetro ? '💫' : (p.emoji ?? '🎁')}</div>
        <div className={styles.titulo}>
          {p.titulo ?? 'Presente sem título'}
          <span
            className={`${styles.tipoBadge} ${
              isRetro ? styles.tipoBadgeRetro : styles.tipoBadgePagina
            }`}
          >
            {isRetro ? '💫 Retrospectiva' : '🎁 Página'}
          </span>
          <span
            className={`${styles.badge} ${
              p.ativo ? styles.badgeAtivo : styles.badgeInativo
            }`}
          >
            {p.ativo ? 'ativo' : 'inativo'}
          </span>
        </div>
        <div className={styles.data}>Criado em {formatarData(p.created_at)}</div>
      </div>

      <div className={styles.stats}>
        <span className={styles.stat}>
          👀 <strong>{p.visualizacoes}</strong> views
        </span>
        <span className={styles.stat}>🔗 {linkPath}</span>
      </div>

      <div className={styles.actions}>
        <Link href={verHref} className={`${styles.btn} ${styles.btnVer}`} target="_blank">
          👁 Ver
        </Link>
        <button
          className={`${styles.btn} ${styles.btnCompartilhar}`}
          onClick={() => onCompartilhar(p)}
        >
          📱 Compartilhar
        </button>
        <Link href={editarHref} className={`${styles.btn} ${styles.btnEditar}`}>
          ✏️ Editar
        </Link>
        <button
          className={`${styles.btn} ${styles.btnDeletar}`}
          onClick={() => onDeletar(p.id)}
        >
          🗑 Excluir
        </button>
      </div>
    </div>
  )
}