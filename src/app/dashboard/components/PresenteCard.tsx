import Link from 'next/link'
import type { Presente } from '@/types'
import styles from './PresenteCard.module.css'

import {
  Eye,Share, Video, Edit, Trash2,
} from 'lucide-react'


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
 
        <div className={styles.titulo}>
  <span className={styles.textoTitulo}>
    {p.titulo ?? 'Presente sem título'}
  </span>

  <div className={styles.badges}>
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
</div>
        <div className={styles.data}>Criado em {formatarData(p.created_at)}</div>
      </div>

      <div className={styles.stats}>
        <span className={styles.stat}>
          <Video size={20} strokeWidth={2} /> <strong>{p.visualizacoes}</strong> views
        </span>
        <span className={styles.stat}>🔗 {linkPath}</span>
      </div>

      <div className={styles.actions}>
        <Link href={verHref} className={`${styles.btn} ${styles.btnVer}`} target="_blank">
          <Eye size={15} strokeWidth={2} /> Ver
        </Link>
        <button
          className={`${styles.btn} ${styles.btnCompartilhar}`}
          onClick={() => onCompartilhar(p)}
        >
          <Share size={15} strokeWidth={2} /> Compartilhar
        </button>
        <Link href={editarHref} className={`${styles.btn} ${styles.btnEditar}`}>
          <Edit size={15} strokeWidth={2} /> Editar
        </Link>
        <button
          className={`${styles.btn} ${styles.btnDeletar}`}
          onClick={() => onDeletar(p.id)}
        >
          <Trash2 size={15} strokeWidth={2} /> Excluir
        </button>
      </div>
    </div>
  )
}