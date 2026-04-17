'use client'

import { useState } from 'react'
import { useRetro } from './RetroProvider'
import { captureMultipleSlides } from './StoryGenerator'

/**
 * Modal de seleção de slides pra export como Stories.
 * Captura o DOM real (o que você vê = o que exporta).
 *
 * Durante a geração: fecha o modal, navega pelos slides selecionados,
 * captura cada um, e volta pro slide de encerramento.
 */
export default function ShareModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const retroCtx = useRetro()
  const { nome1, nome2, fotos, conquistasTempo, conquistasManuais, conquistasAuto, theme, goTo, slide } = retroCtx

  const totalSlides = 9

  const SLIDE_META = [
    { id: 0, icon: '💫', label: 'Capa', desc: `${nome1} & ${nome2}` },
    { id: 1, icon: '🌸', label: 'Estação', desc: 'A época do primeiro encontro' },
    { id: 2, icon: '⏱️', label: 'Tempo juntos', desc: 'Contando cada segundo' },
    { id: 3, icon: '🌙', label: 'Céu estrelado', desc: 'As estrelas naquela noite' },
    { id: 4, icon: '📷', label: 'Fotos', desc: `${fotos.length} memória${fotos.length !== 1 ? 's' : ''}` },
    { id: 5, icon: '📊', label: 'Estatísticas', desc: 'Vocês em números' },
    { id: 6, icon: '🏆', label: 'Conquistas', desc: `${conquistasTempo.length + conquistasManuais.length + conquistasAuto.length} desbloqueadas` },
    { id: 7, icon: '💌', label: 'Mensagem', desc: 'A carta do coração' },
    { id: 8, icon: '❤️', label: 'Encerramento', desc: 'Para sempre juntos' },
  ]

  const [selected, setSelected] = useState<number[]>([])
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)

  if (!open) return null

  function toggle(id: number) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  function toggleAll() {
    setSelected(
      selected.length === totalSlides ? [] : [...Array(totalSlides).keys()],
    )
  }

  async function generate() {
    // Encontra o container do player
    const container = document.querySelector('.retro-v2-player') as HTMLElement
    if (!container) {
      console.error('Container .retro-v2-player não encontrado')
      return
    }

    setGenerating(true)
    setProgress(0)

    // Fecha o modal pra mostrar os slides sendo capturados
    // (o modal cobre os slides, então precisamos fechar)
    const currentSlide = slide

    // Esconde o modal temporariamente (mantém o estado)
    const modalEl = container.querySelector('[data-share-modal]') as HTMLElement
    if (modalEl) modalEl.style.display = 'none'

    await captureMultipleSlides(
      container,
      selected,
      goTo,
      nome1,
      nome2,
      currentSlide,
      (p) => setProgress(p),
    )

    // Restaura o modal
    if (modalEl) modalEl.style.display = ''

    setGenerating(false)
    setProgress(0)
    onClose()
  }

  return (
    <div
      data-share-modal
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(6,5,15,.97)',
        backdropFilter: 'blur(12px)',
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px 20px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'DM Serif Display',serif",
              fontSize: '1.3rem',
              color: theme.text.primary,
            }}
          >
            Salvar para Stories
          </div>
          <div
            style={{
              fontSize: '.72rem',
              color: theme.text.muted,
              marginTop: 3,
            }}
          >
            Escolha quais slides baixar como imagem
          </div>
        </div>
        <button
          onClick={onClose}
          disabled={generating}
          style={{
            background: 'rgba(255,255,255,.1)',
            border: 'none',
            borderRadius: '50%',
            width: 34,
            height: 34,
            color: theme.text.primary,
            fontSize: '1rem',
            cursor: generating ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: generating ? 0.3 : 1,
          }}
        >
          ✕
        </button>
      </div>

      {/* Selecionar todos */}
      <div
        style={{
          padding: '12px 20px 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: '.75rem', color: theme.text.muted }}>
          {selected.length === 0
            ? 'Nenhum selecionado'
            : `${selected.length} slide${selected.length !== 1 ? 's' : ''} selecionado${selected.length !== 1 ? 's' : ''}`}
        </span>
        <button
          onClick={toggleAll}
          disabled={generating}
          style={{
            background: 'none',
            border: `1px solid ${theme.accent}66`,
            borderRadius: 50,
            padding: '.25rem .75rem',
            color: theme.accent,
            fontSize: '.72rem',
            cursor: generating ? 'not-allowed' : 'pointer',
            opacity: generating ? 0.5 : 1,
          }}
        >
          {selected.length === totalSlides ? 'Desmarcar tudo' : 'Selecionar tudo'}
        </button>
      </div>

      {/* Grid de slides */}
      <div
        style={{
          padding: '0 16px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          flex: 1,
          opacity: generating ? 0.4 : 1,
          pointerEvents: generating ? 'none' : 'auto',
          transition: 'opacity .3s',
        }}
      >
        {SLIDE_META.map((s) => {
          const sel = selected.includes(s.id)
          return (
            <div
              key={s.id}
              onClick={() => toggle(s.id)}
              style={{
                background: sel ? `${theme.accent}22` : 'rgba(255,255,255,.04)',
                border: `1.5px solid ${sel ? `${theme.accent}80` : 'rgba(255,255,255,.08)'}`,
                borderRadius: 14,
                padding: '14px 12px',
                cursor: 'pointer',
                transition: 'all .2s',
                position: 'relative',
              }}
            >
              {sel && (
                <div
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: theme.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '.6rem',
                    color: 'white',
                    fontWeight: 700,
                  }}
                >
                  ✓
                </div>
              )}
              <div style={{ fontSize: '1.6rem', marginBottom: 6 }}>{s.icon}</div>
              <div
                style={{
                  fontSize: '.8rem',
                  fontWeight: 600,
                  color: sel ? theme.text.primary : theme.text.secondary,
                  marginBottom: 2,
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontSize: '.65rem',
                  color: theme.text.muted,
                  lineHeight: 1.4,
                }}
              >
                {s.desc}
              </div>
            </div>
          )
        })}
      </div>

      {/* Botão gerar */}
      <div style={{ padding: '16px 20px 28px', flexShrink: 0 }}>
        {generating && (
          <div
            style={{
              height: 4,
              background: 'rgba(255,255,255,.1)',
              borderRadius: 2,
              marginBottom: 12,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                background: theme.accentGradient,
                borderRadius: 2,
                width: `${progress * 100}%`,
                transition: 'width .3s ease',
              }}
            />
          </div>
        )}

        <button
          onClick={generate}
          disabled={selected.length === 0 || generating}
          style={{
            width: '100%',
            background: selected.length === 0 ? 'rgba(255,255,255,.08)' : theme.accentGradient,
            border: 'none',
            borderRadius: 50,
            color: selected.length === 0 ? theme.text.muted : 'white',
            fontFamily: "'DM Sans',sans-serif",
            fontSize: '.95rem',
            fontWeight: 600,
            padding: '1rem',
            cursor: selected.length === 0 || generating ? 'not-allowed' : 'pointer',
            transition: 'all .2s',
          }}
        >
          {generating
            ? `⏳ Capturando ${Math.round(progress * 100)}%...`
            : selected.length === 0
            ? 'Selecione ao menos 1 slide'
            : `📲 Baixar ${selected.length} imagem${selected.length !== 1 ? 's' : ''}`}
        </button>
        <p
          style={{
            fontSize: '.65rem',
            color: theme.text.muted,
            textAlign: 'center',
            marginTop: 10,
            lineHeight: 1.5,
            opacity: 0.6,
          }}
        >
          Captura a tela real dos slides — o que você vê é o que exporta
        </p>
      </div>
    </div>
  )
}