import Link from 'next/link'
import type { Presente } from '@/types'
import { Eye, Share, Video, Edit, Trash2, Lock, Unlock } from 'lucide-react'

/* ── tokens ── */
const R  = '#e8627a'
const G  = 'rgba(232,98,122,.35)'
const S  = 'rgba(255,255,255,.04)'
const B  = 'rgba(255,255,255,.08)'
const T  = '#f5e8ec'
const TS = 'rgba(245,232,236,.65)'

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

type PresenteCardProps = {
  presente: Presente
  onCompartilhar: (p: Presente) => void
  onDeletar: (id: string) => void
}

export default function PresenteCard({ presente: p, onCompartilhar, onDeletar }: PresenteCardProps) {
  const tipo       = (p as Presente & { tipo?: string }).tipo ?? 'pagina'
  const isRetro    = tipo === 'retrospectiva'
  const isStreaming = tipo === 'streaming'
  const isRascunho = (p as Presente & { status?: string }).status === 'rascunho'

  const verHref = isRetro
    ? `/retrospectiva/${p.slug}`
    : isStreaming ? `/streaming/${p.slug}` : `/p/${p.slug}`

  const editarHref = isRetro
    ? `/retrospectiva/editar/${p.id}`
    : isStreaming ? `/streaming/editar/${p.id}` : `/editar/${p.id}`

  const linkPath = isRetro
    ? `/retrospectiva/${p.slug}`
    : isStreaming ? `/streaming/${p.slug}` : `/p/${p.slug}`

  const liberarHref = isStreaming
    ? `/comprar?pendente=${p.id}&tipo=streaming`
    : `/presente/${p.id}/liberar`

  const criadoEm    = new Date(p.created_at)
  const diffDias    = Math.floor((Date.now() - criadoEm.getTime()) / 86400000)
  const podeEditar  = diffDias < 7
  const diasRestantes = Math.max(0, 7 - diffDias)

  /* ── tipo badge ── */
  const tipoBadge = isStreaming
    ? { label: '🎬 Streaming',     bg: 'linear-gradient(135deg,#E50914,#b20710)',            color: 'white' }
    : isRetro
    ? { label: '💫 Retrospectiva', bg: 'linear-gradient(135deg,#f857a6,#ffa726)',             color: 'white' }
    : { label: '🎁 Página',        bg: 'rgba(232,98,122,.15)',                                color: R }

  /* ── status badge ── */
  const statusBadge = isRascunho
    ? { label: '📝 rascunho', bg: 'rgba(230,170,50,.15)', color: '#e6aa32' }
    : p.ativo
    ? { label: 'ativo',       bg: 'rgba(56,142,60,.15)',  color: '#4caf50' }
    : { label: 'inativo',     bg: 'rgba(232,98,122,.12)', color: R }

  /* shared action-button style */
  const btnBase: React.CSSProperties = {
    flex: 1,
    padding: '11px 6px',
    background: 'none',
    border: 'none',
    fontSize: '.8rem',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    textDecoration: 'none',
    fontFamily: 'inherit',
    color: TS,
    transition: 'background .15s, color .15s',
    borderLeft: `1px solid ${B}`,
  }

  return (
    <div style={{
      background: S,
      border: `1px solid ${isRascunho ? 'rgba(232,98,122,.2)' : B}`,
      borderStyle: isRascunho ? 'dashed' : 'solid',
      borderRadius: 20,
      overflow: 'hidden',
      opacity: isRascunho ? .9 : 1,
      transition: 'transform .2s, box-shadow .2s',
      display: 'flex',
      flexDirection: 'column',
    }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'translateY(-4px)'
        el.style.boxShadow = `0 16px 40px -10px ${G}`
        el.style.borderColor = 'rgba(232,98,122,.3)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = ''
        el.style.boxShadow = ''
        el.style.borderColor = isRascunho ? 'rgba(232,98,122,.2)' : B
      }}
    >
      {/* ── top ── */}
      <div style={{ padding: '18px 20px 14px', borderBottom: `1px solid ${B}` }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{
            fontFamily: 'Fraunces, serif',
            fontSize: '1.15rem',
            fontWeight: 400,
            color: T,
            lineHeight: 1.3,
          }}>
            {p.titulo ?? 'Presente sem título'}
          </span>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {/* tipo */}
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '3px 10px', borderRadius: 99,
              fontSize: '.78rem', fontWeight: 700,
              background: tipoBadge.bg, color: tipoBadge.color,
            }}>
              {tipoBadge.label}
            </span>
            {/* status */}
            <span style={{
              display: 'inline-block',
              padding: '3px 10px', borderRadius: 99,
              fontSize: '.78rem', fontWeight: 700,
              background: statusBadge.bg, color: statusBadge.color,
            }}>
              {statusBadge.label}
            </span>
          </div>
        </div>

        <div style={{ fontSize: '.75rem', color: TS, marginTop: 8 }}>
          Criado em {formatarData(p.created_at)}
        </div>
      </div>

      {/* ── stats ── */}
      <div style={{
        display: 'flex', gap: 16, padding: '10px 20px',
        borderBottom: `1px solid ${B}`, flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: '.78rem', color: TS, display: 'flex', alignItems: 'center', gap: 5 }}>
          <Video size={14} strokeWidth={2} />
          <strong style={{ color: T }}>{p.visualizacoes}</strong> views
        </span>
        <span style={{
          fontSize: '.72rem', color: TS, overflow: 'hidden',
          textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180,
        }}>
          🔗 {linkPath}
        </span>
      </div>

      {/* ── actions ── */}
      <div style={{ display: 'flex', gap: 0 }}>
        {isRascunho ? (
          <>
            <Link
              href={liberarHref}
              style={{
                ...btnBase,
                borderLeft: 'none',
                flex: 2,
                background: isStreaming
                  ? 'linear-gradient(135deg,#E50914,#b20710)'
                  : R,
                color: 'white',
              }}
            >
              <Unlock size={14} strokeWidth={2} /> Liberar presente
            </Link>
            {podeEditar ? (
              <Link href={editarHref} style={btnBase}>
                <Edit size={14} strokeWidth={2} /> Editar
              </Link>
            ) : (
              <span style={{ ...btnBase, opacity: .35, cursor: 'default', pointerEvents: 'none' }}>
                <Lock size={14} strokeWidth={2} /> Editar
              </span>
            )}
            <button style={{ ...btnBase, color: '#f87171' }} onClick={() => onDeletar(p.id)}>
              <Trash2 size={14} strokeWidth={2} /> Excluir
            </button>
          </>
        ) : (
          <>
            <Link href={verHref} target="_blank" style={{ ...btnBase, borderLeft: 'none', color: R }}>
              <Eye size={14} strokeWidth={2} /> Ver
            </Link>
            <button style={{ ...btnBase, color: '#b494f0' }} onClick={() => onCompartilhar(p)}>
              <Share size={14} strokeWidth={2} /> Compartilhar
            </button>
            {podeEditar ? (
              <Link href={editarHref} style={btnBase}>
                <Edit size={14} strokeWidth={2} /> Editar ({diasRestantes}d)
              </Link>
            ) : (
              <span style={{ ...btnBase, opacity: .35, cursor: 'default', pointerEvents: 'none' }}>
                <Lock size={14} strokeWidth={2} /> Editar
              </span>
            )}
            <button style={{ ...btnBase, color: '#f87171' }} onClick={() => onDeletar(p.id)}>
              <Trash2 size={14} strokeWidth={2} /> Excluir
            </button>
          </>
        )}
      </div>
    </div>
  )
}