'use client'

import { useNovoContext } from '../NovoContext'
import styles from './steps.module.css'

export default function PassoFrases() {
  const { cfg, setFrase, addFrase, removeFrase } = useNovoContext()

  const frasesValidas = cfg.frases.filter(Boolean).length
  const totalFotos = cfg.fotos.length

  return (
    <>
      <style>{`
        .pfr-row {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
          align-items: center;
        }
        .pfr-row input {
          flex: 1;
          border: 2px solid var(--rose-mid);
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 0.95rem;
          font-family: 'Lato', sans-serif;
          color: var(--text);
          background: white;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .pfr-row input:focus {
          border-color: var(--rose);
          box-shadow: 0 0 0 3px rgba(232, 98, 122, 0.1);
        }
        .pfr-remove {
          background: none;
          border: none;
          cursor: pointer;
          color: #ccc;
          font-size: 1.2rem;
          padding: 6px;
          transition: color 0.2s;
          flex-shrink: 0;
        }
        .pfr-remove:hover {
          color: var(--rose);
        }
        .pfr-add {
          background: none;
          border: 2px dashed var(--rose-mid);
          border-radius: 12px;
          width: 100%;
          padding: 12px;
          font-size: 0.85rem;
          color: var(--text-soft);
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 4px;
          font-family: 'Lato', sans-serif;
          font-weight: 700;
        }
        .pfr-add:hover {
          border-color: var(--rose);
          color: var(--rose);
        }
        .pfr-status {
          background: white;
          border: 1.5px solid var(--rose-mid);
          border-radius: 12px;
          padding: 14px 18px;
          margin-top: 16px;
          font-size: 0.85rem;
          line-height: 1.5;
        }
        .pfr-status.ok {
          border-color: #4caf50;
          color: #2e7d32;
          background: #f1f8e9;
        }
        .pfr-status.warn {
          border-color: #f57c00;
          color: #e65100;
          background: #fff3e0;
        }
        .pfr-status.error {
          border-color: #e53935;
          color: #c62828;
          background: #ffebee;
        }
      `}</style>

      <div className={styles.stepHeader}>
        <p className={styles.stepEyebrow}>Palavras animadas</p>
        <h1 className={styles.stepTitle}>
          As <em>frases</em> que aparecem com as fotos
        </h1>
        <p className={styles.stepDescription}>
          Cada frase aparece animada junto com uma foto, conforme a pessoa rola a página.
          Você precisa de uma frase pra cada foto.
        </p>
      </div>

      {totalFotos === 0 ? (
        <div className="pfr-status warn">
          ⚠️ Você ainda não adicionou nenhuma foto. Volte pro passo anterior pra adicionar fotos primeiro.
        </div>
      ) : (
        <>
          {cfg.frases.map((f, i) => (
            <div className="pfr-row" key={i}>
              <input
                value={f}
                onChange={e => setFrase(i, e.target.value)}
                placeholder={`Frase para a foto ${i + 1}…`}
                maxLength={120}
              />
              {cfg.frases.length > 1 && (
                <button className="pfr-remove" onClick={() => removeFrase(i)} aria-label="Remover">
                  ✕
                </button>
              )}
            </div>
          ))}

          {cfg.frases.length < 5 && cfg.frases.length < totalFotos && (
            <button className="pfr-add" onClick={addFrase}>
              + Adicionar frase
            </button>
          )}

          <div
            className={`pfr-status ${
              frasesValidas === totalFotos
                ? 'ok'
                : frasesValidas > totalFotos
                ? 'error'
                : 'warn'
            }`}
          >
            {frasesValidas === totalFotos && (
              <>
                ✅ {totalFotos} foto{totalFotos !== 1 ? 's' : ''} e {frasesValidas}{' '}
                frase{frasesValidas !== 1 ? 's' : ''} — tudo certo!
              </>
            )}
            {frasesValidas > totalFotos && (
              <>
                ⚠️ Você tem {frasesValidas} frases para apenas {totalFotos} foto
                {totalFotos !== 1 ? 's' : ''}. Remova {frasesValidas - totalFotos}{' '}
                frase{frasesValidas - totalFotos !== 1 ? 's' : ''} pra continuar.
              </>
            )}
            {frasesValidas < totalFotos && (
              <>
                ⚠️ Você tem {totalFotos} foto{totalFotos !== 1 ? 's' : ''} e apenas{' '}
                {frasesValidas} frase{frasesValidas !== 1 ? 's' : ''} preenchida
                {frasesValidas !== 1 ? 's' : ''}. Preencha mais {totalFotos - frasesValidas}{' '}
                pra continuar.
              </>
            )}
          </div>
        </>
      )}
    </>
  )
}