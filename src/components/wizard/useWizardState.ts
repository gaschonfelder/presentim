'use client'

import { useState, useCallback, useMemo } from 'react'

/**
 * Hook que gerencia o estado de navegação do wizard:
 * - Passo atual (índice)
 * - Maior passo já visitado (pra controlar quais são clicáveis no header)
 * - Funções de navegação (next, prev, goTo)
 *
 * Não lida com validação — quem chama next() decide se pode ou não.
 */
export function useWizardState(totalSteps: number, initialStep = 0) {
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [maxReached, setMaxReached] = useState(initialStep)

  const goToStep = useCallback((index: number) => {
    if (index < 0 || index >= totalSteps) return
    // Só permite ir para passos já visitados ou o atual+1
    if (index > maxReached + 1) return
    setCurrentStep(index)
    setMaxReached(prev => Math.max(prev, index))
  }, [totalSteps, maxReached])

  const next = useCallback(() => {
    if (currentStep >= totalSteps - 1) return
    const newStep = currentStep + 1
    setCurrentStep(newStep)
    setMaxReached(prev => Math.max(prev, newStep))
  }, [currentStep, totalSteps])

  const prev = useCallback(() => {
    if (currentStep <= 0) return
    setCurrentStep(currentStep - 1)
  }, [currentStep])

  const isFirst = currentStep === 0
  const isLast = currentStep === totalSteps - 1

  const progress = useMemo(
    () => (totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0),
    [currentStep, totalSteps],
  )

  return {
    currentStep,
    maxReached,
    setCurrentStep: goToStep,
    next,
    prev,
    isFirst,
    isLast,
    progress,
  }
}