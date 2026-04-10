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

  return (
    <>
      <style>{`
        .wz-page {
          min-height: 100vh;
          background: var(--cream, #fff8f9);
          display: flex;
          flex-direction: column;
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
    </>
  )
}