import type { Presente } from '@/types'
import PresenteCard from './PresenteCard'

/* ── tokens ── */
const R  = '#e8627a'
const G  = 'rgba(232,98,122,.35)'
const S  = 'rgba(255,255,255,.04)'
const B  = 'rgba(255,255,255,.08)'
const T  = '#f5e8ec'
const TS = 'rgba(245,232,236,.65)'

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
      <div style={{
        background: S,
        border: `2px dashed rgba(232,98,122,.3)`,
        borderRadius: 24,
        padding: '72px 40px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎁</div>
        <h3 style={{
          fontFamily: 'Fraunces, serif',
          fontSize: '1.4rem',
          fontWeight: 400,
          color: T,
          marginBottom: 8,
        }}>
          Nenhum presente ainda
        </h3>
        <p style={{ color: TS, fontSize: '.9rem', marginBottom: 28, lineHeight: 1.6 }}>
          Crie seu primeiro presente e surpreenda quem você ama!
        </p>
        <button
          onClick={onNovo}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: R,
            color: 'white',
            padding: '12px 28px',
            borderRadius: 99,
            fontWeight: 700,
            fontSize: '.9rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: `0 6px 20px ${G}`,
            fontFamily: 'inherit',
          }}
        >
          Criar meu primeiro presente
        </button>
      </div>
    )
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: 20,
    }}>
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