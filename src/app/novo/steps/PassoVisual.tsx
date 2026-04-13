'use client'

import { useState } from 'react'
import { useNovoContext, EMOJIS } from '../NovoContext'
import { FALLING_PRESETS, type FallingType, type FallingPreset } from '@/lib/falling-animation'
import { GRADIENTE_PRESETS } from '@/lib/gradientes'
import FallingParticles from '@/components/FallingParticles'
import styles from './steps.module.css'

const COMBINACOES = [
  { nome: 'Rosa', primaria: '#e8627a', fundo: '#ffeef0' },
  { nome: 'Roxo', primaria: '#9b59b6', fundo: '#f5eeff' },
  { nome: 'Azul', primaria: '#3b82f6', fundo: '#eff6ff' },
  { nome: 'Verde', primaria: '#10b981', fundo: '#ecfdf5' },
  { nome: 'Laranja', primaria: '#f97316', fundo: '#fff7ed' },
  { nome: 'Vermelho', primaria: '#ef4444', fundo: '#fef2f2' },
]

export default function PassoVisual() {
  const { cfg, set } = useNovoContext()
  const [showPreview, setShowPreview] = useState(false)

  const fa = cfg.falling_animation

  function setFallingType(type: FallingType) {
    set('falling_animation', { ...fa, type, enabled: true })
  }

  function toggleFallingEnabled() {
    set('falling_animation', { ...fa, enabled: !fa.enabled })
  }

  function setCustomEmoji(emoji: string) {
    set('falling_animation', { ...fa, customEmoji: emoji })
  }

  return (
    <>
      <style>{`
        .pv-emoji-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 10px;
          margin-bottom: 8px;
        }
        .pv-emoji-btn {
          aspect-ratio: 1;
          border-radius: 12px;
          border: 2px solid var(--rose-mid);
          background: white;
          font-size: 1.4rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pv-emoji-btn:hover,
        .pv-emoji-btn.selected {
          border-color: var(--rose);
          background: var(--rose-pale);
          transform: scale(1.05);
        }
        .pv-color-row {
          display: flex;
          gap: 12px;
          margin-bottom: 8px;
        }
        .pv-color-field {
          flex: 1;
        }
        .pv-color-field label {
          display: block;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 6px;
        }
        .pv-color-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          border: 2px solid var(--rose-mid);
          border-radius: 12px;
          padding: 10px 14px;
          background: white;
        }
        .pv-color-wrap input[type='color'] {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 6px;
          padding: 0;
          cursor: pointer;
          background: none;
        }
        .pv-color-wrap span {
          font-size: 0.84rem;
          color: var(--text-soft);
          font-family: monospace;
        }
        .pv-presets {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .pv-preset {
          border-radius: 12px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.88rem;
          font-weight: 700;
          font-family: 'Lato', sans-serif;
        }
        .pv-preset-dot {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* Gradiente section */
        .pv-grad-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 10px;
        }
        .pv-grad-item {
          position: relative;
          border-radius: 14px;
          padding: 0;
          cursor: pointer;
          transition: all 0.2s;
          overflow: hidden;
          border: 2px solid var(--rose-mid);
          background: white;
          font-family: 'Lato', sans-serif;
        }
        .pv-grad-item:hover {
          border-color: var(--rose);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(232, 98, 122, 0.15);
        }
        .pv-grad-item.selected {
          border-color: var(--rose);
          box-shadow: 0 0 0 3px rgba(232, 98, 122, 0.15), 0 6px 16px rgba(232, 98, 122, 0.2);
        }
        .pv-grad-swatch {
          width: 100%;
          height: 64px;
          display: block;
        }
        .pv-grad-label {
          display: block;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text);
          padding: 8px 6px;
          text-align: center;
          background: white;
        }
        .pv-grad-check {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 22px;
          height: 22px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          color: var(--rose);
          font-weight: 700;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }
        .pv-grad-none {
          background: repeating-linear-gradient(
            45deg,
            #f5f0f2,
            #f5f0f2 10px,
            #fbe9ed 10px,
            #fbe9ed 20px
          );
        }
        .pv-grad-hint {
          font-size: 0.78rem;
          color: var(--text-soft);
          margin-bottom: 12px;
          line-height: 1.5;
        }

        /* Falling animation section */
        .pv-fa-toggle {
          display: flex;
          align-items: center;
          gap: 12px;
          background: white;
          border: 1.5px solid var(--rose-mid);
          border-radius: 14px;
          padding: 14px 18px;
          margin-bottom: 14px;
          cursor: pointer;
        }
        .pv-fa-switch {
          width: 44px;
          height: 24px;
          border-radius: 12px;
          position: relative;
          flex-shrink: 0;
          transition: background 0.2s;
        }
        .pv-fa-switch.on { background: var(--rose); }
        .pv-fa-switch.off { background: #ddd; }
        .pv-fa-knob {
          position: absolute;
          top: 3px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          transition: left 0.2s;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
        }
        .pv-fa-switch.on .pv-fa-knob { left: 23px; }
        .pv-fa-switch.off .pv-fa-knob { left: 3px; }
        .pv-fa-toggle-text {
          flex: 1;
        }
        .pv-fa-toggle-title {
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--text);
        }
        .pv-fa-toggle-desc {
          font-size: 0.78rem;
          color: var(--text-soft);
          margin-top: 2px;
        }

        .pv-fa-options {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 10px;
          margin-bottom: 12px;
        }
        .pv-fa-option {
          background: white;
          border: 2px solid var(--rose-mid);
          border-radius: 12px;
          padding: 14px 10px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          font-family: 'Lato', sans-serif;
        }
        .pv-fa-option:hover {
          border-color: var(--rose);
          background: var(--rose-pale);
        }
        .pv-fa-option.selected {
          border-color: var(--rose);
          background: var(--rose-pale);
          box-shadow: 0 0 0 3px rgba(232, 98, 122, 0.1);
        }
        .pv-fa-option-icon {
          font-size: 1.6rem;
        }
        .pv-fa-option-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text);
        }

        .pv-fa-custom {
          background: var(--rose-pale);
          border: 1.5px solid var(--rose-mid);
          border-radius: 12px;
          padding: 14px 16px;
          margin-bottom: 12px;
        }
        .pv-fa-custom label {
          display: block;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 6px;
        }
        .pv-fa-custom input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid var(--rose-mid);
          border-radius: 10px;
          font-size: 1.4rem;
          font-family: 'Lato', sans-serif;
          background: white;
          outline: none;
          text-align: center;
        }
        .pv-fa-custom input:focus { border-color: var(--rose); }
        .pv-fa-custom-hint {
          font-size: 0.74rem;
          color: var(--text-soft);
          margin-top: 6px;
          line-height: 1.5;
        }

        .pv-fa-preview-btn {
          width: 100%;
          background: linear-gradient(135deg, var(--rose), #c94f68);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 13px;
          font-family: 'Lato', sans-serif;
          font-size: 0.92rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(232, 98, 122, 0.3);
        }

        /* Preview modal */
        .pv-preview-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .pv-preview-modal {
          background: var(--cream);
          border-radius: 24px;
          width: 100%;
          max-width: 320px;
          aspect-ratio: 9/16;
          max-height: 70vh;
          position: relative;
          overflow: hidden;
          box-shadow: 0 32px 80px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 32px 24px;
          text-align: center;
        }
        .pv-preview-content {
          position: relative;
          z-index: 10;
        }
        .pv-preview-emoji {
          font-size: 3rem;
          margin-bottom: 12px;
        }
        .pv-preview-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          color: var(--text);
          margin-bottom: 8px;
        }
        .pv-preview-text {
          font-size: 0.85rem;
          color: var(--text-soft);
        }
        .pv-preview-close {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 20;
          background: rgba(0, 0, 0, 0.5);
          border: none;
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      <div className={styles.stepHeader}>
        <p className={styles.stepEyebrow}>Identidade visual</p>
        <h1 className={styles.stepTitle}>
          Escolha um <em>visual</em>
        </h1>
        <p className={styles.stepDescription}>
          O emoji aparece no botão e as cores deixam o presente com a sua cara.
        </p>
      </div>

      <p className={styles.sectionTitle}>Emoji do botão</p>
      <div className="pv-emoji-grid">
        {EMOJIS.map(e => (
          <button
            key={e}
            className={`pv-emoji-btn ${cfg.emoji === e ? 'selected' : ''}`}
            onClick={() => set('emoji', e)}
            aria-label={`Escolher emoji ${e}`}
          >
            {e}
          </button>
        ))}
      </div>

      <p className={styles.sectionTitle} style={{ marginTop: 28 }}>
        Cores
      </p>
      <div className="pv-color-row">
        <div className="pv-color-field">
          <label>Cor principal</label>
          <div className="pv-color-wrap">
            <input
              type="color"
              value={cfg.cor_primaria}
              onChange={e => set('cor_primaria', e.target.value)}
            />
            <span>{cfg.cor_primaria}</span>
          </div>
        </div>
        <div className="pv-color-field">
          <label>Cor de fundo</label>
          <div className="pv-color-wrap">
            <input
              type="color"
              value={cfg.cor_fundo}
              onChange={e => set('cor_fundo', e.target.value)}
            />
            <span>{cfg.cor_fundo}</span>
          </div>
        </div>
      </div>

      <p className={styles.sectionTitle} style={{ marginTop: 28 }}>
        Combinações prontas
      </p>
      <div className="pv-presets">
        {COMBINACOES.map(t => (
          <button
            key={t.nome}
            className="pv-preset"
            onClick={() => {
              set('cor_primaria', t.primaria)
              set('cor_fundo', t.fundo)
            }}
            style={{
              background: t.fundo,
              border: `2px solid ${cfg.cor_primaria === t.primaria ? t.primaria : '#e0d0d4'}`,
              color: t.primaria,
            }}
          >
            <span className="pv-preset-dot" style={{ background: t.primaria }} />
            {t.nome}
          </button>
        ))}
      </div>

      <p className={styles.sectionTitle} style={{ marginTop: 28 }}>
        Gradiente de fundo · opcional
      </p>
      <p className="pv-grad-hint">
        Gradientes deixam o presente com um visual mais moderno. Se não escolher, usa a cor de fundo sólida acima.
      </p>
      <div className="pv-grad-grid">
        {/* Opção "sem gradiente" — usa cor_fundo sólida */}
        <button
          className={`pv-grad-item ${!cfg.gradiente ? 'selected' : ''}`}
          onClick={() => set('gradiente', null)}
          aria-label="Sem gradiente"
        >
          {!cfg.gradiente && <span className="pv-grad-check">✓</span>}
          <span className="pv-grad-swatch pv-grad-none" />
          <span className="pv-grad-label">Cor sólida</span>
        </button>

        {GRADIENTE_PRESETS.map(preset => {
          const selected = cfg.gradiente === preset.css
          return (
            <button
              key={preset.key}
              className={`pv-grad-item ${selected ? 'selected' : ''}`}
              onClick={() => set('gradiente', preset.css)}
              aria-label={`Gradiente ${preset.label}`}
            >
              {selected && <span className="pv-grad-check">✓</span>}
              <span className="pv-grad-swatch" style={{ background: preset.css }} />
              <span className="pv-grad-label">{preset.label}</span>
            </button>
          )
        })}
      </div>

      <p className={styles.sectionTitle} style={{ marginTop: 28 }}>
        Animação de fundo · opcional
      </p>

      <div className="pv-fa-toggle" onClick={toggleFallingEnabled}>
        <div className={`pv-fa-switch ${fa.enabled ? 'on' : 'off'}`}>
          <div className="pv-fa-knob" />
        </div>
        <div className="pv-fa-toggle-text">
          <div className="pv-fa-toggle-title">
            {fa.enabled ? '✨ Animação ativada' : 'Ativar animação'}
          </div>
          <div className="pv-fa-toggle-desc">
            Partículas caindo no fundo do presente
          </div>
        </div>
      </div>

      {fa.enabled && (
        <>
          <div className="pv-fa-options">
            {(Object.values(FALLING_PRESETS) as FallingPreset[]).map(preset => (
              <button
                key={preset.type}
                className={`pv-fa-option ${fa.type === preset.type ? 'selected' : ''}`}
                onClick={() => setFallingType(preset.type)}
              >
                <span className="pv-fa-option-icon">{preset.icon}</span>
                <span className="pv-fa-option-label">{preset.label}</span>
              </button>
            ))}
            <button
              className={`pv-fa-option ${fa.type === 'personalizado' ? 'selected' : ''}`}
              onClick={() => setFallingType('personalizado')}
            >
              <span className="pv-fa-option-icon">🎨</span>
              <span className="pv-fa-option-label">Personalizado</span>
            </button>
          </div>

          {fa.type === 'personalizado' && (
            <div className="pv-fa-custom">
              <label>Seu emoji (até 6)</label>
              <input
                value={fa.customEmoji ?? ''}
                onChange={e => setCustomEmoji(e.target.value)}
                placeholder="🎈🎁🎂"
                maxLength={20}
              />
              <p className="pv-fa-custom-hint">
                Cole um ou mais emojis (máximo 6). Exemplo: 🎈 ou 🎈🎂🎁
              </p>
            </div>
          )}

          <button
            className="pv-fa-preview-btn"
            onClick={() => setShowPreview(true)}
          >
            👁 Ver preview da animação
          </button>
        </>
      )}

      {showPreview && (
        <div className="pv-preview-overlay" onClick={() => setShowPreview(false)}>
          <div
            className="pv-preview-modal"
            onClick={e => e.stopPropagation()}
            style={{ background: cfg.gradiente ?? cfg.cor_fundo }}
          >
            <button className="pv-preview-close" onClick={() => setShowPreview(false)}>✕</button>
            <FallingParticles animation={fa} count={14} zIndex={1} />
            <div className="pv-preview-content">
              <div className="pv-preview-emoji">{cfg.emoji}</div>
              <div className="pv-preview-title">Preview</div>
              <div className="pv-preview-text">É assim que vai ficar no presente</div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}