'use client'

type WizardFooterProps = {
  isFirst: boolean
  isLast: boolean
  canAdvance: boolean
  invalidHint?: string
  optional?: boolean
  submitting?: boolean
  submitLabel?: string
  onPrev: () => void
  onNext: () => void
  onSubmit: () => void
}

export default function WizardFooter({
  isFirst,
  isLast,
  canAdvance,
  invalidHint,
  optional,
  submitting,
  submitLabel = 'Criar presente',
  onPrev,
  onNext,
  onSubmit,
}: WizardFooterProps) {
  return (
    <>
      <style>{`
        .wf-wrap {
          background: white;
          border-top: 1px solid var(--rose-mid, #fce4ea);
          padding: 14px 20px 18px;
          position: sticky;
          bottom: 0;
          z-index: 50;
          box-shadow: 0 -4px 16px rgba(232, 98, 122, 0.04);
        }

        .wf-hint {
          font-size: 0.75rem;
          color: var(--text-soft, #7a4f5a);
          text-align: center;
          margin-bottom: 10px;
          min-height: 1em;
        }

        .wf-hint.error {
          color: #c0415a;
        }

        .wf-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 10px;
          align-items: stretch;
        }

        .wf-btn {
          flex: 1;
          padding: 14px 20px;
          border-radius: 12px;
          font-family: 'Lato', sans-serif;
          font-size: 0.92rem;
          font-weight: 700;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .wf-btn:active:not(:disabled) {
          transform: scale(0.97);
        }

        .wf-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .wf-btn-prev {
          flex: 0 0 auto;
          background: white;
          color: var(--text-soft, #7a4f5a);
          border: 1.5px solid var(--rose-mid, #fce4ea);
          padding: 14px 20px;
        }

        .wf-btn-prev:hover:not(:disabled) {
          border-color: var(--rose, #e8627a);
          color: var(--rose, #e8627a);
        }

        .wf-btn-next {
          background: linear-gradient(135deg, var(--rose, #e8627a), #c94f68);
          color: white;
          box-shadow: 0 4px 14px rgba(232, 98, 122, 0.3);
        }

        .wf-btn-next:hover:not(:disabled) {
          opacity: 0.92;
        }

        .wf-btn-submit {
          background: linear-gradient(135deg, #4caf50, #388e3c);
          color: white;
          box-shadow: 0 4px 14px rgba(76, 175, 80, 0.3);
          font-size: 0.98rem;
        }

        .wf-btn-submit:hover:not(:disabled) {
          opacity: 0.92;
        }
      `}</style>

      <div className="wf-wrap">
        <div className={`wf-hint ${invalidHint && !canAdvance ? 'error' : ''}`}>
          {!canAdvance && invalidHint
            ? invalidHint
            : optional && !isLast
            ? 'Esse passo é opcional, você pode pular'
            : ''}
        </div>

        <div className="wf-buttons">
          {!isFirst && (
            <button
              className="wf-btn wf-btn-prev"
              onClick={onPrev}
              disabled={submitting}
            >
              ← Voltar
            </button>
          )}

          {isLast ? (
            <button
              className="wf-btn wf-btn-submit"
              onClick={onSubmit}
              disabled={!canAdvance || submitting}
            >
              {submitting ? '⏳ Criando…' : `✨ ${submitLabel}`}
            </button>
          ) : (
            <button
              className="wf-btn wf-btn-next"
              onClick={onNext}
              disabled={!canAdvance || submitting}
            >
              Próximo →
            </button>
          )}
        </div>
      </div>
    </>
  )
}