import Link from 'next/link'
import { CircleStar, Gift, Eye, Sparkles } from 'lucide-react'

/* ── tokens ── */
const R   = '#e8627a'
const G   = 'rgba(232,98,122,.35)'
const S   = 'rgba(255,255,255,.04)'
const B   = 'rgba(255,255,255,.08)'
const T   = '#f5e8ec'
const TS  = 'rgba(245,232,236,.65)'

type CardsResumoProps = {
  creditos: number
  totalPresentes: number
  totalVisualizacoes: number
}

type StatCardProps = {
  icon: React.ReactNode
  num: number
  label: string
}

function StatCard({ icon, num, label }: StatCardProps) {
  return (
    <div style={{
      background: S,
      border: `1px solid ${B}`,
      borderRadius: 20,
      padding: '22px 26px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      flex: 1,
      minWidth: 200,
      transition: 'border-color .2s',
    }}>
      <span style={{ flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{
          fontFamily: 'Fraunces, serif',
          fontSize: '2.2rem',
          fontWeight: 400,
          lineHeight: 1,
          color: R,
        }}>{num}</div>
        <div style={{
          fontSize: '.82rem',
          color: TS,
          marginTop: 4,
        }}>{label}</div>
      </div>
    </div>
  )
}

export default function CardsResumo({ creditos, totalPresentes, totalVisualizacoes }: CardsResumoProps) {
  return (
    <>
      <style>{`
        @media (max-width: 640px) { .credits-row { flex-direction: column !important; } }
        .credits-row > div { transition: border-color .2s; }
        .credits-row > div:hover { border-color: rgba(232,98,122,.35) !important; }
      `}</style>

      <div className="credits-row" style={{
        display: 'flex',
        gap: 16,
        marginBottom: 36,
        flexWrap: 'wrap',
      }}>
        <StatCard
          icon={<CircleStar size={28} strokeWidth={1.5} color={R} />}
          num={creditos}
          label="créditos disponíveis"
        />
        <StatCard
          icon={<Gift size={28} strokeWidth={1.5} color={R} />}
          num={totalPresentes}
          label="presentes criados"
        />
        <StatCard
          icon={<Eye size={28} strokeWidth={1.5} color={R} />}
          num={totalVisualizacoes}
          label="visualizações totais"
        />

        {/* highlight card */}
        <div style={{
          background: `linear-gradient(135deg, ${R}, #c94f68)`,
          borderRadius: 20,
          padding: '22px 26px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          flex: 1,
          minWidth: 200,
          boxShadow: `0 8px 28px ${G}`,
        }}>
          <Sparkles size={28} strokeWidth={1.5} color="white" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '.9rem', fontWeight: 700, color: 'white', marginBottom: 10 }}>
              Precisa de mais créditos?
            </div>
            <Link href="/comprar" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(255,255,255,.15)',
              color: 'white',
              border: '1.5px solid rgba(255,255,255,.4)',
              padding: '9px 20px',
              borderRadius: 99,
              fontWeight: 700,
              fontSize: '.85rem',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              backdropFilter: 'blur(6px)',
            }}>
              Ver planos →
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}