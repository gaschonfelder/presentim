'use client'

import type { WizardStepDefinition } from './types'

type WizardHeaderProps = {
  steps: WizardStepDefinition[]
  currentStep: number
  maxReached: number
  onStepClick: (index: number) => void
}

export default function WizardHeader({
  steps,
  currentStep,
  maxReached,
  onStepClick,
}: WizardHeaderProps) {
  const progress = ((currentStep + 1) / steps.length) * 100
  const currentStepDef = steps[currentStep]

  return (
    <>
      <style>{`
        .wh-wrap {
          background: white;
          border-bottom: 1px solid var(--rose-mid, #fce4ea);
          padding: 16px 20px 14px;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .wh-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          gap: 12px;
        }

        .wh-current {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Playfair Display', serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text, #3d1f28);
        }

        .wh-current-icon {
          font-size: 1.3rem;
        }

        .wh-counter {
          font-size: 1rem;
          color: var(--text-soft, #7a4f5a);
          font-weight: 600;
          white-space: nowrap;
        }

        .wh-bar {
          position: relative;
          height: 4px;
          background: var(--rose-mid, #fce4ea);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 14px;
        }

        .wh-bar-fill {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, var(--rose, #e8627a), #c94f68);
          border-radius: 4px;
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .wh-dots {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 4px;
          padding: 0 2px;
        }

        .wh-dot {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          padding: 4px 0;
          cursor: pointer;
          font-family: inherit;
          transition: opacity 0.2s;
        }

        .wh-dot:disabled {
          cursor: default;
          opacity: 0.4;
        }

        .wh-dot:hover:not(:disabled) .wh-dot-label {
          color: var(--rose, #e8627a);
        }

        .wh-dot-circle {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: var(--rose-mid, #fce4ea);
          color: var(--text-soft, #7a4f5a);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 700;
          transition: all 0.2s;
        }

        .wh-dot.active .wh-dot-circle {
          background: var(--rose, #e8627a);
          color: white;
          box-shadow: 0 2px 8px rgba(232, 98, 122, 0.3);
          transform: scale(1.1);
        }

        .wh-dot.completed .wh-dot-circle {
          background: var(--rose, #e8627a);
          color: white;
        }

        .wh-dot-label {
          font-size: .92rem;
          color: var(--text-soft, #7a4f5a);
          font-weight: 600;
          letter-spacing: 0.02em;
          transition: color 0.2s;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 60px;
        }

        .wh-dot.active .wh-dot-label {
          color: var(--rose, #e8627a);
        }

        @media (max-width: 540px) {
          .wh-dot-label {
            display: none;
          }
        }
      `}</style>

      <div className="wh-wrap">
        <div className="wh-top">
          <div className="wh-current">
            {currentStepDef.icon && (
              <span className="wh-current-icon">{currentStepDef.icon}</span>
            )}
            <span>{currentStepDef.label}</span>
          </div>
          <span className="wh-counter">
            Passo {currentStep + 1} de {steps.length}
          </span>
        </div>

        <div className="wh-bar">
          <div className="wh-bar-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="wh-dots">
          {steps.map((step, idx) => {
            const isActive = idx === currentStep
            const isCompleted = idx < currentStep
            const isClickable = idx <= maxReached

            return (
              <button
                key={step.key}
                className={`wh-dot ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={() => onStepClick(idx)}
                disabled={!isClickable}
                aria-label={`Ir para passo ${idx + 1}: ${step.label}`}
              >
                <span className="wh-dot-circle">
                  {isCompleted ? '✓' : idx + 1}
                </span>
                <span className="wh-dot-label">{step.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}