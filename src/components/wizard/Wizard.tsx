'use client'

import { useEffect, useState } from 'react'
import WizardHeader from './WizardHeader'
import WizardFooter from './WizardFooter'
import RestoreDraftModal from './RestoreDraftModal'
import { useWizardState } from './useWizardState'
import { useWizardStorage } from './useWizardStorage'
import type { WizardStepDefinition } from './types'

type WizardProps<T> = {
  /** Lista de passos do wizard */
  steps: WizardStepDefinition[]
  /** Dados atuais (vão pro localStorage ao avançar de passo) */
  data: T
  /** Chave única do localStorage */
  storageKey: string
  /** TTL do rascunho em milissegundos */
  storageTTL: number
  /** Callback quando o usuário aceita restaurar um rascunho */
  onRestore: (restored: T) => void
  /** Callback do submit final */
  onSubmit: () => void | Promise<void>
  /** Indica se o submit está em andamento (desabilita botões) */
  submitting?: boolean
  /** Label customizado pro botão de submit no último passo */
  submitLabel?: string
  /** Componente de preview opcional — renderizado na sidebar (desktop) e modal (mobile) */
  preview?: React.ReactNode
}

/**
 * Wizard genérico — orquestra navegação, validação, persistência e
 * restauração de rascunho.
 *
 * Não conhece a forma dos dados (`T`). Cada projeto define seus
 * próprios passos e gerencia seu próprio estado, passando para cá.
 */
export default function Wizard<T>({
  steps,
  data,
  storageKey,
  storageTTL,
  onRestore,
  onSubmit,
  submitting,
  submitLabel,
  preview,
}: WizardProps<T>) {
  const {
    currentStep,
    maxReached,
    setCurrentStep,
    next,
    prev,
    isFirst,
    isLast,
  } = useWizardState(steps.length)

  const {
    pendingDraft,
    applyDraft,
    dismissDraft,
    saveNow,
    clearStorage,
  } = useWizardStorage<T>(storageKey, storageTTL)

  // Estado do modal de restore (separado pra controlar quando mostra)
  const [showRestoreModal, setShowRestoreModal] = useState(false)
  // Estado do modal de preview (mobile)
  const [showPreviewModal, setShowPreviewModal] = useState(false)

  // Quando detecta rascunho pendente, mostra modal
  useEffect(() => {
    if (pendingDraft) setShowRestoreModal(true)
  }, [pendingDraft])

  function handleContinueDraft() {
    const restored = applyDraft()
    if (restored) onRestore(restored)
    setShowRestoreModal(false)
  }

  function handleDiscardDraft() {
    dismissDraft()
    setShowRestoreModal(false)
  }

  // Helper: passo atual válido?
  const currentStepDef = steps[currentStep]
  const canAdvance = currentStepDef.optional || (currentStepDef.isValid?.() ?? true)

  function handleNext() {
    if (!canAdvance) return
    saveNow(data)
    next()
  }

  function handlePrev() {
    saveNow(data)
    prev()
  }

  function handleStepClick(index: number) {
    saveNow(data)
    setCurrentStep(index)
  }

  async function handleSubmit() {
    if (!canAdvance) return
    try {
      await onSubmit()
      // Se chegou aqui, deu certo — limpa storage
      clearStorage()
    } catch {
      // Erro tratado pelo onSubmit
    }
  }

  // Renderiza o componente do passo atual
  const StepComponent = currentStepDef.component
  const hasPreview = !!preview

  return (
    <>
      <style>{`
        .wz-page {
          min-height: 100vh;
          background: var(--cream, #fff8f9);
          display: flex;
          flex-direction: column;
        }

        .wz-body {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        /* Quando tem preview: layout split no desktop */
        .wz-body--has-preview {
          display: grid;
          grid-template-columns: 1fr 380px;
        }

        .wz-main {
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .wz-content {
          flex: 1;
          padding: 28px 20px 32px;
          max-width: 600px;
          width: 100%;
          margin: 0 auto;
          animation: wzStepFadeIn 0.3s ease;
        }

        @keyframes wzStepFadeIn {
          from {
            opacity: 0;
            transform: translateX(8px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* ── Preview sidebar (desktop) ── */
        .wz-preview-sidebar {
          background: #f5f0f2;
          border-left: 1px solid var(--rose-mid, #fce4ea);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: sticky;
          top: 0;
          height: 85vh;
        }

        .wz-preview-header {
          padding: 12px 20px;
          background: white;
          border-bottom: 1px solid var(--rose-mid, #fce4ea);
          font-size: .8rem;
          font-weight: 600;
          color: var(--text-soft, #9a7080);
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .wz-preview-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #4caf50;
          display: inline-block;
        }

        .wz-preview-body {
          flex: 1;
          overflow: hidden;
          padding: 20px;
          display: flex;
          align-items: stretch;
          justify-content: center;
          min-height: 0;
        }

        .wz-preview-frame {
          width: 100%;
          max-width: 320px;
          height: 100%;
        }

        /* ── Botão flutuante de preview (mobile) ── */
        .wz-preview-fab {
          display: none;
          position: fixed;
          bottom: 100px;
          right: 16px;
          z-index: 90;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--rose, #e8627a), #c94f68);
          color: white;
          border: none;
          box-shadow: 0 6px 24px rgba(232, 98, 122, 0.45);
          cursor: pointer;
          font-size: 1.3rem;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        }

        .wz-preview-fab:hover {
          transform: scale(1.08);
        }

        /* ── Modal de preview (mobile) ── */
        .wz-preview-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: wzModalIn 0.25s ease;
        }

        @keyframes wzModalIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .wz-preview-modal-content {
          width: 100%;
          max-width: 340px;
          max-height: 80vh;
          overflow-y: auto;
          position: relative;
          border-radius: 24px;
          box-shadow: 0 32px 80px rgba(0, 0, 0, 0.3);
          animation: wzModalSlideUp 0.3s ease;
        }

        @keyframes wzModalSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .wz-preview-modal-close {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 10;
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

        /* ── Responsivo ── */
        @media (max-width: 900px) {
          .wz-body--has-preview {
            display: flex;
            flex-direction: column;
          }
          .wz-preview-sidebar {
            display: none;
          }
          .wz-preview-fab {
            display: flex;
          }
        }
      `}</style>

      {showRestoreModal && pendingDraft && (
        <RestoreDraftModal
          ageMs={pendingDraft.ageMs}
          onContinue={handleContinueDraft}
          onDiscard={handleDiscardDraft}
        />
      )}

      <div className="wz-page">
        <WizardHeader
          steps={steps}
          currentStep={currentStep}
          maxReached={maxReached}
          onStepClick={handleStepClick}
        />

        <div className={`wz-body ${hasPreview ? 'wz-body--has-preview' : ''}`}>
          <div className="wz-main">
            <div className="wz-content" key={currentStepDef.key}>
              <StepComponent />
            </div>

            <WizardFooter
              isFirst={isFirst}
              isLast={isLast}
              canAdvance={canAdvance}
              invalidHint={currentStepDef.invalidHint}
              optional={currentStepDef.optional}
              submitting={submitting}
              submitLabel={submitLabel}
              onPrev={handlePrev}
              onNext={handleNext}
              onSubmit={handleSubmit}
            />
          </div>

          {/* Preview sidebar — desktop */}
          {hasPreview && (
            <div className="wz-preview-sidebar">
              <div className="wz-preview-header">
                <span className="wz-preview-dot" /> Preview em tempo real
              </div>
              <div className="wz-preview-body">
                <div className="wz-preview-frame">
                  {preview}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FAB de preview — mobile */}
      {hasPreview && (
        <button
          className="wz-preview-fab"
          onClick={() => setShowPreviewModal(true)}
          aria-label="Ver preview"
        >
          👁
        </button>
      )}

      {/* Modal de preview — mobile */}
      {hasPreview && showPreviewModal && (
        <div
          className="wz-preview-modal-overlay"
          onClick={() => setShowPreviewModal(false)}
        >
          <div
            className="wz-preview-modal-content"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="wz-preview-modal-close"
              onClick={() => setShowPreviewModal(false)}
            >
              ✕
            </button>
            {preview}
          </div>
        </div>
      )}
    </>
  )
}