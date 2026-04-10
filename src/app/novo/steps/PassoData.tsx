'use client'

import { useNovoContext } from '../NovoContext'
import styles from './steps.module.css'

export default function PassoData() {
  const { cfg, set } = useNovoContext()

  return (
    <>
      <style>{`
        .pd-confirm {
          background: var(--rose-pale);
          border: 1.5px solid var(--rose-mid);
          border-radius: 14px;
          padding: 16px 20px;
          margin-top: 16px;
          font-size: 0.88rem;
          color: var(--text-soft);
          line-height: 1.65;
        }
        .pd-confirm strong {
          color: var(--text);
        }
        .pd-clear {
          background: none;
          border: none;
          color: var(--rose);
          font-size: 0.85rem;
          cursor: pointer;
          margin-top: 14px;
          font-weight: 700;
          font-family: 'Lato', sans-serif;
        }
        .pd-clear:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className={styles.stepHeader}>
        <p className={styles.stepEyebrow}>Data de liberação · opcional</p>
        <h1 className={styles.stepTitle}>
          Quando vai <em>revelar</em>?
        </h1>
        <p className={styles.stepDescription}>
          Defina uma data e hora pra liberação. Antes disso, quem acessar o link
          vai ver uma contagem regressiva. Deixe em branco pra liberar imediatamente.
        </p>
      </div>

      <div className={styles.field}>
        <label>
          Data e hora <span>(opcional)</span>
        </label>
        <input
          type="datetime-local"
          value={cfg.data_liberacao}
          onChange={e => set('data_liberacao', e.target.value)}
          min={new Date().toISOString().slice(0, 16)}
        />
      </div>

      {cfg.data_liberacao && (
        <>
          <div className="pd-confirm">
            🎉 O presente será revelado em{' '}
            <strong>
              {new Date(cfg.data_liberacao).toLocaleString('pt-BR', {
                dateStyle: 'long',
                timeStyle: 'short',
              })}
            </strong>
            . Até lá, quem acessar o link vai ver a contagem regressiva.
          </div>
          <button className="pd-clear" onClick={() => set('data_liberacao', '')}>
            Limpar data (liberar imediatamente)
          </button>
        </>
      )}
    </>
  )
}