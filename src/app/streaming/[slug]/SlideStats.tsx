'use client'

import { useState, useEffect } from 'react'
import type { StreamingDados } from './page'
import { calcTemporadas, calcDiasJuntos } from './streaming-utils'

// ─── Filmes e séries famosas (escolhidos aleatoriamente) ──────────────────────

const FILMES = [
  { nome: 'Vingadores: Ultimato', min: 181 },
  { nome: 'Titanic', min: 195 },
  { nome: 'Interestelar', min: 169 },
  { nome: 'O Senhor dos Anéis: O Retorno do Rei', min: 201 },
  { nome: 'Forrest Gump', min: 142 },
  { nome: 'Harry Potter e o Cálice de Fogo', min: 157 },
  { nome: 'Jurassic Park', min: 127 },
  { nome: 'Matrix', min: 136 },
  { nome: 'Coringa', min: 122 },
  { nome: 'Oppenheimer', min: 180 },
]

const SERIES = [
  { nome: 'Friends', eps: 236, minEp: 22 },
  { nome: 'Grey\'s Anatomy', eps: 430, minEp: 43 },
  { nome: 'Breaking Bad', eps: 62, minEp: 47 },
  { nome: 'Stranger Things', eps: 34, minEp: 50 },
  { nome: 'The Office', eps: 201, minEp: 22 },
  { nome: 'Game of Thrones', eps: 73, minEp: 57 },
  { nome: 'La Casa de Papel', eps: 41, minEp: 50 },
  { nome: 'The Chosen', eps: 32, minEp: 55 },
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// ─── Animated number ──────────────────────────────────────────────────────────

function AnimNum({ target, visible }: { target: number; visible: boolean }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!visible) return
    let s: number, f: number
    const dur = 2000
    const go = (ts: number) => {
      if (!s) s = ts
      const p = Math.min((ts - s) / dur, 1)
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) f = requestAnimationFrame(go)
    }
    f = requestAnimationFrame(go)
    return () => cancelAnimationFrame(f)
  }, [target, visible])
  return <>{val.toLocaleString('pt-BR')}</>
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Stat = {
  id: string
  icon: string
  title: string
  number: number
  unit: string
  details: string[]
  color: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SlideStats({
  dados,
  onNext,
}: {
  dados: StreamingDados
  onNext: () => void
}) {
  const [visible, setVisible] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const [filme] = useState(() => pick(FILMES))
  const [serie] = useState(() => pick(SERIES))

  const dias = calcDiasJuntos(dados.data_inicio)
  const temporadas = calcTemporadas(dados.data_inicio)
  const minTotal = dias * 24 * 60
  const hrsTotal = dias * 24

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(t)
  }, [])

  const filmesQtd = Math.floor(minTotal / filme.min)
  const serieVezes = Math.floor(minTotal / (serie.eps * serie.minEp))
  const kilosPipoca = Math.round(filmesQtd * 0.08)
  const cafes = dias * 2
  const maratonas = Math.floor(dias / 7)
  const trailers = Math.floor(minTotal / 2.5)

  const stats: Stat[] = [
    {
      id: 'minutos',
      icon: '⏱️',
      title: 'Minutos juntos',
      number: minTotal,
      unit: 'minutos',
      details: [
        `São ${hrsTotal.toLocaleString('pt-BR')} horas lado a lado`,
        `Equivale a ${temporadas.label} de uma série hit`,
        `Ou ${Math.floor(dias / 365)} anos e ${dias % 365} dias de história`,
      ],
      color: '#E50914',
    },
    {
      id: 'filmes',
      icon: '🎬',
      title: 'Sessões de cinema',
      number: filmesQtd,
      unit: 'filmes',
      details: [
        `Daria pra assistir "${filme.nome}" ${filmesQtd.toLocaleString('pt-BR')} vezes`,
        `Cada sessão com ${filme.min} minutos de emoção`,
        `Uma sessão atrás da outra, sem parar`,
      ],
      color: '#FFB800',
    },
    {
      id: 'serie',
      icon: '📺',
      title: 'Maratona de série',
      number: serieVezes,
      unit: `vezes`,
      details: [
        `Vocês poderiam maratonar "${serie.nome}" ${serieVezes.toLocaleString('pt-BR')} vezes`,
        `São ${serie.eps} episódios por rodada`,
        `Total: ${(serieVezes * serie.eps).toLocaleString('pt-BR')} episódios assistidos`,
      ],
      color: '#A855F7',
    },
    {
      id: 'pipoca',
      icon: '🍿',
      title: 'Pipoca consumida',
      number: kilosPipoca,
      unit: 'kg de pipoca',
      details: [
        `${kilosPipoca.toLocaleString('pt-BR')} quilos de pipoca`,
        `Um balde por sessão de cinema`,
        `Manteiga pra encher ${Math.max(1, Math.floor(kilosPipoca / 5))} baldes gigantes`,
      ],
      color: '#F97316',
    },
    {
      id: 'cafe',
      icon: '☕',
      title: 'Cafés juntos',
      number: cafes,
      unit: 'cafés',
      details: [
        `${cafes.toLocaleString('pt-BR')} cafés — dois por dia`,
        `São ${Math.floor(cafes * 0.06)} litros de café`,
        `Energia pra ${Math.floor(cafes / 365)} anos de manhãs juntos`,
      ],
      color: '#92400E',
    },
    {
      id: 'maratonas',
      icon: '🛋️',
      title: 'Noites de maratona',
      number: maratonas,
      unit: 'maratonas',
      details: [
        `${maratonas.toLocaleString('pt-BR')} fins de semana com cobertor e tela`,
        `Pelo menos ${maratonas * 4} episódios nas maratonas`,
        `"Só mais um episódio" dito ${maratonas * 3} vezes`,
      ],
      color: '#06B6D4',
    },
    {
      id: 'trailers',
      icon: '🎞️',
      title: 'Trailers assistidos',
      number: trailers,
      unit: 'trailers',
      details: [
        `${trailers.toLocaleString('pt-BR')} trailers de 2min30`,
        `Mais que todos os trailers já lançados na história`,
        `E ainda sobraria tempo pra criar os de vocês`,
      ],
      color: '#EC4899',
    },
  ]

  const openStat = openId ? stats.find(s => s.id === openId) : null

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;700&display=swap');

        .sts-wrap { width:100%; min-height:100dvh; background:#0a0a0a; color:#fff; font-family:'Inter',sans-serif; padding-bottom:40px; }
        .sts-hdr { padding:48px 24px 20px; text-align:center; opacity:0; transform:translateY(20px); transition:all .7s ease .1s; }
        .sts-hdr.v { opacity:1; transform:translateY(0); }
        .sts-tag { display:inline-flex; align-items:center; gap:6px; background:rgba(229,9,20,.12); border:1px solid rgba(229,9,20,.25); color:#E50914; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; padding:5px 14px; border-radius:20px; margin-bottom:16px; }
        .sts-title { font-family:'Bebas Neue',sans-serif; font-size:36px; font-weight:400; letter-spacing:2px; margin-bottom:6px; }
        .sts-sub { font-size:14px; color:rgba(255,255,255,.4); }
        .sts-days { text-align:center; padding:28px 24px 12px; opacity:0; transform:translateY(20px); transition:all .7s ease .3s; }
        .sts-days.v { opacity:1; transform:translateY(0); }
        .sts-days-n { font-family:'Bebas Neue',sans-serif; font-size:72px; font-weight:400; letter-spacing:3px; color:#E50914; line-height:1; }
        .sts-days-l { font-size:15px; font-weight:600; color:rgba(255,255,255,.5); text-transform:uppercase; letter-spacing:2px; margin-top:4px; }
        .sts-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; padding:24px 20px 0; max-width:600px; margin:0 auto; }

        /* ── Card com neon na borda ─────────────────────────────────── */
        .sts-card-wrap {
          position: relative;
          border-radius: 13px;
          padding: 1.5px;        /* espessura da borda neon */
          background: transparent;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          opacity: 0;
          transform: translateY(20px);
        }
        /* camada giratória do neon */
        .sts-card-wrap::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 14px;
          background: conic-gradient(
            from var(--angle, 0deg),
            transparent 0deg,
            var(--c) 60deg,
            transparent 120deg
          );
          animation: neon-spin 4s linear infinite;
          opacity: .18;
          transition: opacity .4s ease;
        }
        .sts-card-wrap:hover::before { opacity: .38; }

        /* Fundo interno do card */
        .sts-card {
          background: rgba(255,255,255,.03);
          border-radius: 12px;
          padding: 20px 14px;
          text-align: center;
          transition: background .3s ease, transform .2s ease;
          position: relative;
          overflow: hidden;
          height: 100%;
        }
        .sts-card-wrap:hover .sts-card { background: rgba(255,255,255,.06); transform: translateY(-2px); }
        .sts-card-wrap:active .sts-card { transform: scale(.97); }

        .sts-card-glow { position:absolute; top:-20px; left:50%; transform:translateX(-50%); width:80px; height:80px; border-radius:50%; background:var(--c); opacity:.06; filter:blur(25px); pointer-events:none; }
        .sc-i { font-size:26px; margin-bottom:8px; position:relative; z-index:1; }
        .sc-n { font-family:'Bebas Neue',sans-serif; font-size:34px; font-weight:400; letter-spacing:1px; line-height:1; margin-bottom:2px; position:relative; z-index:1; }
        .sc-u { font-size:10px; color:rgba(255,255,255,.4); text-transform:uppercase; letter-spacing:.5px; position:relative; z-index:1; }
        .sc-t { font-size:11px; font-weight:600; color:rgba(255,255,255,.55); margin-top:8px; position:relative; z-index:1; }
        .sc-tap { font-size:9px; color:rgba(255,255,255,.2); margin-top:6px; position:relative; z-index:1; }

        .sts-btn { display:flex; align-items:center; justify-content:center; gap:8px; margin:32px auto 0; padding:14px 32px; background:rgba(255,255,255,.1); color:#fff; border:1px solid rgba(255,255,255,.2); border-radius:4px; font-size:15px; font-weight:600; font-family:'Inter',sans-serif; cursor:pointer; transition:all .2s ease; -webkit-tap-highlight-color:transparent; width:calc(100% - 48px); max-width:552px; }
        .sts-btn:hover { background:rgba(255,255,255,.15); }

        /* ── Modal com neon na borda ────────────────────────────────── */
        .sts-overlay { position:fixed; inset:0; background:rgba(0,0,0,.88); z-index:9000; display:flex; align-items:center; justify-content:center; padding:20px; opacity:0; transition:opacity .3s ease; -webkit-tap-highlight-color:transparent; }
        .sts-overlay.v { opacity:1; }

        .sts-modal-wrap {
          position: relative;
          border-radius: 17px;
          padding: 2px;              /* espessura da borda neon no modal */
          max-width: 400px;
          width: 100%;
          transform: scale(.93);
          transition: transform .3s ease;
        }
        .sts-overlay.v .sts-modal-wrap { transform: scale(1); }

        /* camada giratória do neon no modal */
        .sts-modal-wrap::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 18px;
          background: conic-gradient(
            from var(--angle, 0deg),
            transparent 0deg,
            var(--c) 80deg,
            transparent 160deg
          );
          animation: neon-spin 2.5s linear infinite;
        }

        .sts-modal {
          background: #141414;
          border-radius: 16px;
          padding: 32px 24px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .sts-modal-glow { position:absolute; inset:-30px; border-radius:30px; background:var(--c); opacity:.05; filter:blur(30px); pointer-events:none; }
        .sm-i { font-size:40px; margin-bottom:14px; position:relative; z-index:1; }
        .sm-n { font-family:'Bebas Neue',sans-serif; font-size:52px; font-weight:400; letter-spacing:2px; line-height:1; margin-bottom:4px; position:relative; z-index:1; }
        .sm-u { font-size:13px; color:rgba(255,255,255,.45); text-transform:uppercase; letter-spacing:1px; margin-bottom:20px; position:relative; z-index:1; }
        .sm-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  z-index: 1;
}

.sm-item {
  position: relative;
  font-size: 14px;
  line-height: 1.6;
  color: rgba(255,255,255,.75);

  padding: 12px 16px 12px 18px;

  background: rgba(255,255,255,0.05);
  border-radius: 10px;

  border: 1px solid rgba(255,255,255,0.06);

  backdrop-filter: blur(6px);

  transition: all 0.25s ease;
}

/* 🔥 BARRA LATERAL COM EFEITO */
.sm-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 6px;
  bottom: 6px;
  width: 3px;
  border-radius: 10px;

  background: var(--c);

  opacity: 0.6;
  transition: all 0.3s ease;
}

/* ✨ HOVER SÓ NA BORDA */
.sm-item:hover::before {
  opacity: 1;
  width: 4px;
  box-shadow: 0 0 10px var(--c), 0 0 20px var(--c);
}

/* hover leve no item (sem roubar atenção) */
.sm-item:hover {
  background: rgba(255,255,255,0.07);
  color: rgba(255,255,255,0.95);
}
   background:rgba(255,255,255,.04); border-radius:8px; border-left:2px solid var(--c); text-align:left; }
        .sm-close { position:absolute; top:12px; right:12px; width:32px; height:32px; border-radius:50%; background:rgba(255,255,255,.08); border:none; color:rgba(255,255,255,.6); font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; z-index:10; -webkit-tap-highlight-color:transparent; }
        .sm-close:hover { background:rgba(255,255,255,.15); }

        /* ── Keyframe principal do neon ─────────────────────────────── */
        @property --angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes neon-spin {
          to { --angle: 360deg; }
        }

        @media(max-width:480px) {
          .sts-hdr { padding:36px 20px 16px; }
          .sts-title { font-size:28px; }
          .sts-days-n { font-size:56px; }
          .sts-grid { gap:10px; padding:20px 16px 0; }
          .sts-card { padding:16px 10px; }
          .sc-n { font-size:28px; }
          .sc-i { font-size:22px; }
          .sm-n { font-size:42px; }
        }
        @media(max-width:360px) { .sts-grid { grid-template-columns:1fr; } }
      `}</style>

      <div className="sts-wrap">
        <div className={`sts-hdr ${visible ? 'v' : ''}`}>
          <div className="sts-tag">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
            </svg>
            Vocês em números
          </div>
          <div className="sts-title">{dados.nome1} & {dados.nome2}</div>
          <div className="sts-sub">Toque nos cards para ver mais</div>
        </div>

        <div className={`sts-days ${visible ? 'v' : ''}`}>
          <div className="sts-days-n">{visible ? dias.toLocaleString('pt-BR') : '0'}</div>
          <div className="sts-days-l">dias juntos</div>
        </div>

        <div className="sts-grid">
          {stats.map((s, i) => (
            <div
              key={s.id}
              className="sts-card-wrap"
              style={{
                '--c': s.color,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity .5s ease ${0.4 + i * 0.1}s, transform .5s ease ${0.4 + i * 0.1}s`,
              } as React.CSSProperties}
              onClick={() => setOpenId(s.id)}
            >
              <div className="sts-card">
                <div className="sts-card-glow" style={{ '--c': s.color } as React.CSSProperties} />
                <div className="sc-i">{s.icon}</div>
                <div className="sc-n" style={{ color: s.color }}>
                  <AnimNum target={s.number} visible={visible} />
                </div>
                <div className="sc-u">{s.unit}</div>
                <div className="sc-t">{s.title}</div>
                <div className="sc-tap">toque para ver</div>
              </div>
            </div>
          ))}
        </div>

        <button className="sts-btn" onClick={onNext}>
          Continuar assistindo
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9,18 15,12 9,6" />
          </svg>
        </button>
      </div>

      {openStat && (
        <div className={`sts-overlay ${openStat ? 'v' : ''}`} onClick={() => setOpenId(null)}>
          <div
            className="sts-modal-wrap"
            style={{ '--c': openStat.color } as React.CSSProperties}
            onClick={e => e.stopPropagation()}
          >
            <div className="sts-modal">
              <div className="sts-modal-glow" style={{ '--c': openStat.color } as React.CSSProperties} />
              <button className="sm-close" onClick={() => setOpenId(null)}>✕</button>
              <div className="sm-i">{openStat.icon}</div>
              <div className="sm-n" style={{ color: openStat.color }}>{openStat.number.toLocaleString('pt-BR')}</div>
              <div className="sm-u">{openStat.unit}</div>
              <div className="sm-items">
                {openStat.details.map((d, i) => (
                  <div key={i} className="sm-item" style={{ '--c': openStat.color } as React.CSSProperties}>{d}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}