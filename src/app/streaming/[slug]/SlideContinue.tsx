'use client'

import { useState, useCallback } from 'react'
import type { StreamingDados } from './page'

// ─── Slide IDs no streaming player (pra captura) ─────────────────────────────

type SlideId = 'hero' | 'tudum' | 'timeline' | 'stats' | 'conquistas' | 'quiz' | 'creditos' | 'continue'

const SLIDE_META: { id: SlideId; icon: string; label: string; capturable: boolean }[] = [
  { id: 'hero',       icon: '🎬', label: 'Capa',            capturable: true  },
  { id: 'tudum',      icon: '🔊', label: 'TUDUM',           capturable: false }, // animação, não faz sentido capturar
  { id: 'timeline',   icon: '📸', label: 'Episódios',       capturable: true  },
  { id: 'stats',      icon: '📊', label: 'Estatísticas',    capturable: true  },
  { id: 'conquistas', icon: '🏆', label: 'Conquistas',      capturable: true  },
  { id: 'quiz',       icon: '🎮', label: 'Quiz',            capturable: false }, // interativo
  { id: 'creditos',   icon: '💌', label: 'Declaração Final', capturable: true  },
]

const CAPTURABLE_SLIDES = SLIDE_META.filter(s => s.capturable)

// ─── Component ────────────────────────────────────────────────────────────────

export default function SlideContinue({
  dados,
  onReplay,
  onGoTo,
}: {
  dados: StreamingDados
  onReplay: () => void
  onGoTo: (slide: SlideId) => void
}) {
  const [visible, setVisible] = useState(false)
  const [shareModal, setShareModal] = useState(false)
  const [copied, setCopied] = useState(false)

  // Fade in
  useState(() => {
    setTimeout(() => setVisible(true), 200)
  })

  const nome1 = dados.nome1 ?? ''
  const nome2 = dados.nome2 ?? ''

  // ── Compartilhar link ──
  const handleShare = useCallback(async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: `🎬 ${nome1} & ${nome2}`, url })
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard?.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [nome1, nome2])

  // ── Tela principal ──
  if (!shareModal) {
    return (
      <>
        <style>{styles}</style>
        <div className="ct-wrap">
          <div className="ct-glow" />

          <div className={`ct-content ${visible ? 'v' : ''}`}>
            {/* Ícone */}
            <div className="ct-icon">🎬</div>

            {/* Título */}
            <h2 className="ct-title">Continue assistindo?</h2>
            <p className="ct-sub">A história de {nome1} & {nome2}</p>

            {/* Botões */}
            <div className="ct-actions">
              {/* Assistir de novo */}
              <button className="ct-btn primary" onClick={onReplay}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5,3 19,12 5,21" fill="currentColor" stroke="none" />
                </svg>
                Assistir de novo
              </button>

              {/* Compartilhar link */}
              <button className="ct-btn secondary" onClick={handleShare}>
                {copied ? '✓ Link copiado!' : '🔗 Compartilhar link'}
              </button>

              {/* Salvar para Stories */}
              <button className="ct-btn secondary" onClick={() => setShareModal(true)}>
                📲 Salvar para Stories
              </button>
            </div>

            {/* Branding */}
            <div className="ct-brand">
              presentim.com.br
            </div>
          </div>
        </div>
      </>
    )
  }

  // ── Modal de seleção de slides ──
  return (
    <>
      <style>{styles}</style>
      <ShareModalInner
        dados={dados}
        onClose={() => setShareModal(false)}
        onGoTo={onGoTo}
      />
    </>
  )
}

// ─── Share Modal (inline) ─────────────────────────────────────────────────────

function ShareModalInner({
  dados,
  onClose,
  onGoTo,
}: {
  dados: StreamingDados
  onClose: () => void
  onGoTo: (slide: SlideId) => void
}) {
  const [selected, setSelected] = useState<SlideId[]>([])
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)

  function toggle(id: SlideId) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  function toggleAll() {
    if (selected.length === CAPTURABLE_SLIDES.length) {
      setSelected([])
    } else {
      setSelected(CAPTURABLE_SLIDES.map(s => s.id))
    }
  }

  async function generate() {
    setGenerating(true)
    setProgress(0)

    const sorted = CAPTURABLE_SLIDES.filter(s => selected.includes(s.id))
    const total = sorted.length

    for (let i = 0; i < total; i++) {
      const slide = sorted[i]

      // Navega pro slide
      onGoTo(slide.id)

      // Espera renderizar
      await new Promise(r => setTimeout(r, 1200))

      // Captura via html-to-image (importação dinâmica pra não quebrar SSR)
      try {
        const { toPng } = await import('html-to-image')

        // Encontra o container — o pai direto do player
        // O StreamingPlayer renderiza dentro de um div com transition
        const container = document.querySelector('[data-streaming-player]') as HTMLElement
          ?? document.querySelector('.ct-wrap')?.closest('div[style]') as HTMLElement

        if (container) {
          const dataUrl = await toPng(container, {
            quality: 1,
            pixelRatio: 2,
            filter: (node: HTMLElement) => {
              // Remove elementos de UI que não devem aparecer na imagem
              if (node.classList?.contains('ct-wrap')) return false
              if (node.classList?.contains('sts-btn')) return false
              if (node.classList?.contains('cq-btn')) return false
              if (node.classList?.contains('cr-btn-wrap')) return false
              if (node.tagName === 'BUTTON') return false
              return true
            },
          })

          const a = document.createElement('a')
          a.download = `${dados.nome1}-${dados.nome2}-${slide.id}.png`
          a.href = dataUrl
          a.click()
        }
      } catch (err) {
        console.error('Erro ao capturar slide:', err)
      }

      setProgress((i + 1) / total)

      // Pausa entre downloads
      if (i < total - 1) {
        await new Promise(r => setTimeout(r, 500))
      }
    }

    // Volta pra tela continue
    onGoTo('continue')
    setGenerating(false)
    setProgress(0)
    onClose()
  }

  return (
    <div className="ct-wrap" style={{ justifyContent: 'flex-start' }}>
      <div className="sm-modal">
        {/* Header */}
        <div className="sm-header">
          <div>
            <div className="sm-title">Salvar para Stories</div>
            <div className="sm-sub">Escolha quais telas baixar como imagem</div>
          </div>
          <button
            className="sm-close"
            onClick={onClose}
            disabled={generating}
          >
            ✕
          </button>
        </div>

        {/* Selecionar todos */}
        <div className="sm-select-bar">
          <span className="sm-count">
            {selected.length === 0
              ? 'Nenhum selecionado'
              : `${selected.length} slide${selected.length !== 1 ? 's' : ''}`}
          </span>
          <button
            className="sm-toggle-all"
            onClick={toggleAll}
            disabled={generating}
          >
            {selected.length === CAPTURABLE_SLIDES.length ? 'Desmarcar tudo' : 'Selecionar tudo'}
          </button>
        </div>

        {/* Grid */}
        <div className="sm-grid" style={{ opacity: generating ? 0.4 : 1, pointerEvents: generating ? 'none' : 'auto' }}>
          {CAPTURABLE_SLIDES.map(s => {
            const sel = selected.includes(s.id)
            return (
              <div
                key={s.id}
                className={`sm-card ${sel ? 'sel' : ''}`}
                onClick={() => toggle(s.id)}
              >
                {sel && <div className="sm-check">✓</div>}
                <div className="sm-card-icon">{s.icon}</div>
                <div className="sm-card-label">{s.label}</div>
              </div>
            )
          })}
        </div>

        {/* Progress bar */}
        {generating && (
          <div className="sm-progress-wrap">
            <div className="sm-progress-bar">
              <div className="sm-progress-fill" style={{ width: `${progress * 100}%` }} />
            </div>
          </div>
        )}

        {/* Botão gerar */}
        <button
          className={`sm-generate ${selected.length === 0 ? 'disabled' : ''}`}
          onClick={generate}
          disabled={selected.length === 0 || generating}
        >
          {generating
            ? `⏳ Capturando ${Math.round(progress * 100)}%...`
            : selected.length === 0
              ? 'Selecione ao menos 1 slide'
              : `📲 Baixar ${selected.length} imagem${selected.length !== 1 ? 's' : ''}`}
        </button>

        <p className="sm-hint">
          Imagens em alta resolução prontas para o Instagram Stories
        </p>
      </div>
    </div>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = `
  .ct-wrap {
    width:100%; min-height:100dvh; background:#0a0a0a; color:#fff;
    font-family:'Inter',sans-serif;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    position:relative; overflow:hidden; padding:40px 24px;
  }
  .ct-glow {
    position:absolute; top:30%; left:50%; transform:translateX(-50%);
    width:400px; height:400px; border-radius:50%;
    background:radial-gradient(circle, rgba(229,9,20,.06) 0%, transparent 65%);
    pointer-events:none;
  }

  .ct-content {
    position:relative; z-index:1; text-align:center;
    max-width:400px; width:100%;
    opacity:0; transform:translateY(20px);
    transition:all .8s cubic-bezier(.4,0,.2,1);
  }
  .ct-content.v { opacity:1; transform:translateY(0); }

  .ct-icon {
    font-size:4rem; margin-bottom:20px;
    animation:ct-float 3s ease-in-out infinite;
  }

  .ct-title {
    font-family:'Bebas Neue',sans-serif;
    font-size:36px; font-weight:400; letter-spacing:2px;
    margin-bottom:6px;
  }
  .ct-sub {
    font-size:14px; color:rgba(255,255,255,.4); margin-bottom:36px;
  }

  .ct-actions {
    display:flex; flex-direction:column; gap:12px; width:100%;
  }

  .ct-btn {
    display:flex; align-items:center; justify-content:center; gap:10px;
    width:100%; padding:16px 24px;
    border:none; border-radius:4px;
    font-size:15px; font-weight:600; font-family:'Inter',sans-serif;
    cursor:pointer; transition:all .2s ease;
    -webkit-tap-highlight-color:transparent;
  }
  .ct-btn.primary {
    background:rgba(229,9,20,.9); color:#fff;
    box-shadow:0 4px 24px rgba(229,9,20,.3);
  }
  .ct-btn.primary:hover {
    background:rgba(229,9,20,1);
    box-shadow:0 6px 32px rgba(229,9,20,.4);
    transform:translateY(-1px);
  }
  .ct-btn.secondary {
    background:rgba(255,255,255,.08); color:rgba(255,255,255,.85);
    border:1px solid rgba(255,255,255,.12);
  }
  .ct-btn.secondary:hover {
    background:rgba(255,255,255,.12);
    border-color:rgba(255,255,255,.2);
  }

  .ct-brand {
    margin-top:48px; font-size:12px; color:rgba(255,255,255,.15);
    letter-spacing:1px;
  }

  /* ── Share Modal ─────────────────────────────────────────────── */
  .sm-modal {
    width:100%; max-width:460px; padding-top:20px;
  }

  .sm-header {
    display:flex; align-items:flex-start; justify-content:space-between;
    padding:0 0 16px; gap:12px;
  }
  .sm-title {
    font-family:'Bebas Neue',sans-serif;
    font-size:28px; letter-spacing:1.5px;
  }
  .sm-sub {
    font-size:12px; color:rgba(255,255,255,.35); margin-top:2px;
  }
  .sm-close {
    width:34px; height:34px; border-radius:50%;
    background:rgba(255,255,255,.08); border:none;
    color:rgba(255,255,255,.6); font-size:16px;
    cursor:pointer; display:flex; align-items:center; justify-content:center;
    flex-shrink:0;
  }
  .sm-close:hover { background:rgba(255,255,255,.15); }
  .sm-close:disabled { opacity:.3; cursor:not-allowed; }

  .sm-select-bar {
    display:flex; align-items:center; justify-content:space-between;
    padding:0 0 12px;
  }
  .sm-count { font-size:12px; color:rgba(255,255,255,.35); }
  .sm-toggle-all {
    background:none; border:1px solid rgba(229,9,20,.4);
    border-radius:50px; padding:4px 12px;
    color:rgba(229,9,20,.9); font-size:11px; font-weight:600;
    cursor:pointer;
  }
  .sm-toggle-all:disabled { opacity:.4; cursor:not-allowed; }

  .sm-grid {
    display:grid; grid-template-columns:1fr 1fr; gap:10px;
    margin-bottom:20px; transition:opacity .3s;
  }

  .sm-card {
    background:rgba(255,255,255,.04);
    border:1.5px solid rgba(255,255,255,.08);
    border-radius:14px; padding:16px 12px;
    cursor:pointer; transition:all .2s;
    position:relative; text-align:center;
  }
  .sm-card:hover { border-color:rgba(255,255,255,.15); }
  .sm-card.sel {
    background:rgba(229,9,20,.1);
    border-color:rgba(229,9,20,.4);
  }
  .sm-check {
    position:absolute; top:8px; right:8px;
    width:18px; height:18px; border-radius:50%;
    background:#E50914;
    display:flex; align-items:center; justify-content:center;
    font-size:10px; color:#fff; font-weight:700;
  }
  .sm-card-icon { font-size:1.8rem; margin-bottom:6px; }
  .sm-card-label {
    font-size:12px; font-weight:600;
    color:rgba(255,255,255,.7);
  }
  .sm-card.sel .sm-card-label { color:#fff; }

  .sm-progress-wrap { margin-bottom:12px; }
  .sm-progress-bar {
    height:4px; background:rgba(255,255,255,.1);
    border-radius:2px; overflow:hidden;
  }
  .sm-progress-fill {
    height:100%; background:linear-gradient(90deg, #E50914, #ff4444);
    border-radius:2px; transition:width .3s ease;
  }

  .sm-generate {
    width:100%; padding:14px;
    background:linear-gradient(135deg, #E50914, #b20710);
    border:none; border-radius:50px;
    color:#fff; font-size:15px; font-weight:600;
    font-family:'Inter',sans-serif; cursor:pointer;
    transition:all .2s;
  }
  .sm-generate:hover { box-shadow:0 4px 20px rgba(229,9,20,.4); }
  .sm-generate.disabled {
    background:rgba(255,255,255,.08); color:rgba(255,255,255,.3);
    cursor:not-allowed; box-shadow:none;
  }
  .sm-generate:disabled { opacity:.7; cursor:not-allowed; }

  .sm-hint {
    font-size:11px; color:rgba(255,255,255,.2);
    text-align:center; margin-top:10px; line-height:1.5;
  }

  @keyframes ct-float {
    0%,100% { transform:translateY(0); }
    50% { transform:translateY(-8px); }
  }

  @media(max-width:480px) {
    .ct-wrap { padding:32px 20px; }
    .ct-title { font-size:28px; }
    .ct-btn { padding:14px 20px; font-size:14px; }
    .sm-modal { padding-top:12px; }
    .sm-title { font-size:24px; }
    .sm-grid { gap:8px; }
    .sm-card { padding:14px 10px; }
  }
`