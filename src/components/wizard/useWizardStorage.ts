'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

type StoredData<T> = {
  data: T
  expires: number
  savedAt: number
}

type DraftInfo<T> = {
  data: T
  ageMs: number
}

/**
 * Hook que persiste dados no localStorage com TTL.
 *
 * Diferente de versões anteriores, esse hook NÃO restaura automaticamente
 * — ele apenas detecta se há rascunho válido e expõe `pendingDraft`.
 * O componente que usa decide quando aplicar via `applyDraft()`.
 *
 * Salvamento é manual: chamar `saveNow(data)` quando quiser persistir.
 *
 * @example
 * const { pendingDraft, applyDraft, dismissDraft, saveNow, clearStorage } =
 *   useWizardStorage<MyData>('wizard:novo', 30 * 60 * 1000)
 *
 * useEffect(() => {
 *   if (pendingDraft) showRestoreModal()  // pergunta ao usuário
 * }, [pendingDraft])
 *
 * // Quando muda de passo:
 * saveNow(currentData)
 *
 * // Após submit bem-sucedido:
 * clearStorage()
 */
export function useWizardStorage<T>(
  storageKey: string,
  ttlMs: number,
) {
  const [pendingDraft, setPendingDraft] = useState<DraftInfo<T> | null>(null)
  const checkedRef = useRef(false)

  // Verifica rascunho ao montar (uma vez)
  useEffect(() => {
    if (checkedRef.current) return
    checkedRef.current = true

    try {
      const raw = localStorage.getItem(storageKey)
      if (!raw) return
      const parsed = JSON.parse(raw) as StoredData<T>

      if (parsed.expires < Date.now()) {
        localStorage.removeItem(storageKey)
        return
      }

      setPendingDraft({
        data: parsed.data,
        ageMs: Date.now() - parsed.savedAt,
      })
    } catch {
      try { localStorage.removeItem(storageKey) } catch {}
    }
  }, [storageKey])

  /** Aplica o rascunho pendente — chamado quando usuário clica "Continuar" */
  const applyDraft = useCallback((): T | null => {
    if (!pendingDraft) return null
    const data = pendingDraft.data
    setPendingDraft(null)
    return data
  }, [pendingDraft])

  /** Descarta rascunho pendente E remove do storage */
  const dismissDraft = useCallback(() => {
    try { localStorage.removeItem(storageKey) } catch {}
    setPendingDraft(null)
  }, [storageKey])

  /** Salva dados imediatamente (chamar ao mudar de passo, por exemplo) */
  const saveNow = useCallback((data: T) => {
    try {
      const payload: StoredData<T> = {
        data,
        expires: Date.now() + ttlMs,
        savedAt: Date.now(),
      }
      localStorage.setItem(storageKey, JSON.stringify(payload))
    } catch {
      // localStorage cheio ou indisponível — silencioso
    }
  }, [storageKey, ttlMs])

  /** Limpa storage manualmente (após submit bem-sucedido) */
  const clearStorage = useCallback(() => {
    try { localStorage.removeItem(storageKey) } catch {}
  }, [storageKey])

  return { pendingDraft, applyDraft, dismissDraft, saveNow, clearStorage }
}