'use client'

type RestoreDraftModalProps = {
  ageMs: number
  onContinue: () => void
  onDiscard: () => void
}

function formatAge(ms: number): string {
  const minutes = Math.floor(ms / 60000)
  if (minutes < 1) return 'agora há pouco'
  if (minutes === 1) return '1 minuto atrás'
  if (minutes < 60) return `${minutes} minutos atrás`
  const hours = Math.floor(minutes / 60)
  if (hours === 1) return '1 hora atrás'
  return `${hours} horas atrás`
}

export default function RestoreDraftModal({
  ageMs,
  onContinue,
  onDiscard,
}: RestoreDraftModalProps) {
  return (
    <>
      <style>{`
        .rdm-overlay {
          position: fixed;
          inset: 0;
          z-index: 3000;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: rdmFadeIn 0.2s ease;
        }

        .rdm-modal {
          background: white;
          border-radius: 24px;
          padding: 36px 28px 28px;
          max-width: 420px;
          width: 100%;
          text-align: center;
          box-shadow: 0 32px 80px rgba(0, 0, 0, 0.2);
          animation: rdmSlideUp 0.3s ease;
        }

        .rdm-icon {
          font-size: 2.5rem;
          margin-bottom: 12px;
        }

        .rdm-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--text, #3d1f28);
          margin-bottom: 10px;
        }

        .rdm-text {
          font-size: 0.92rem;
          color: var(--text-soft, #7a4f5a);
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .rdm-text strong {
          color: var(--text, #3d1f28);
        }

        .rdm-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .rdm-btn {
          padding: 13px 20px;
          border-radius: 12px;
          font-family: 'Lato', sans-serif;
          font-size: 0.92rem;
          font-weight: 700;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }

        .rdm-btn:active {
          transform: scale(0.97);
        }

        .rdm-btn-primary {
          background: linear-gradient(135deg, var(--rose, #e8627a), #c94f68);
          color: white;
          box-shadow: 0 4px 14px rgba(232, 98, 122, 0.3);
        }

        .rdm-btn-primary:hover {
          opacity: 0.92;
        }

        .rdm-btn-secondary {
          background: none;
          border: 1.5px solid var(--rose-mid, #fce4ea);
          color: var(--text-soft, #7a4f5a);
        }

        .rdm-btn-secondary:hover {
          border-color: var(--rose, #e8627a);
          color: var(--rose, #e8627a);
        }

        @keyframes rdmFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes rdmSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="rdm-overlay">
        <div className="rdm-modal">
          <div className="rdm-icon">📝</div>
          <h2 className="rdm-title">Você tem um rascunho</h2>
          <p className="rdm-text">
            Encontramos um presente que você começou a criar <strong>{formatAge(ageMs)}</strong>.
            <br />Quer continuar de onde parou?
          </p>

          <div className="rdm-buttons">
            <button className="rdm-btn rdm-btn-primary" onClick={onContinue}>
              ✨ Continuar rascunho
            </button>
            <button className="rdm-btn rdm-btn-secondary" onClick={onDiscard}>
              Começar do zero
            </button>
          </div>
        </div>
      </div>
    </>
  )
}