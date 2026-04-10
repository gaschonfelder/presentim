'use client'

import { useNovoContext } from '../NovoContext'
import styles from './steps.module.css'

export default function PassoExtras() {
  const { cfg, set } = useNovoContext()

  return (
    <>
      <style>{`
        .pe-section {
          background: white;
          border: 1.5px solid var(--rose-mid);
          border-radius: 14px;
          padding: 18px 20px;
          margin-bottom: 14px;
        }
        .pe-section-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 4px;
        }
        .pe-section-title span {
          font-weight: 400;
          color: var(--text-soft);
          font-size: 0.78rem;
          margin-left: 6px;
        }
        .pe-section-desc {
          font-size: 0.82rem;
          color: var(--text-soft);
          line-height: 1.55;
          margin-bottom: 12px;
        }
        .pe-toggle {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          margin-top: 4px;
        }
        .pe-toggle-switch {
          width: 44px;
          height: 24px;
          border-radius: 12px;
          position: relative;
          flex-shrink: 0;
          transition: background 0.2s;
        }
        .pe-toggle-switch.on {
          background: var(--rose);
        }
        .pe-toggle-switch.off {
          background: #ddd;
        }
        .pe-toggle-knob {
          position: absolute;
          top: 3px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          transition: left 0.2s;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
        }
        .pe-toggle-switch.on .pe-toggle-knob {
          left: 23px;
        }
        .pe-toggle-switch.off .pe-toggle-knob {
          left: 3px;
        }
        .pe-toggle-label {
          font-size: 0.88rem;
          color: var(--text);
          font-weight: 600;
        }
        .pe-content {
          background: var(--rose-pale);
          border: 1px solid var(--rose-mid);
          border-radius: 12px;
          padding: 14px 16px;
          margin-top: 14px;
        }
        .pe-content-title {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 10px;
        }
        .pe-opcao-row {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
        }
        .pe-opcao-row input {
          flex: 1;
          padding: 9px 12px;
          border: 2px solid var(--rose-mid);
          border-radius: 8px;
          font-size: 0.88rem;
          font-family: 'Lato', sans-serif;
          outline: none;
          background: white;
        }
        .pe-opcao-row input:focus {
          border-color: var(--rose);
        }
        .pe-opcao-remove {
          background: none;
          border: none;
          cursor: pointer;
          color: #ccc;
          font-size: 1rem;
          padding: 4px 8px;
        }
        .pe-opcao-remove:hover {
          color: var(--rose);
        }
        .pe-opcao-add {
          background: none;
          border: 2px dashed var(--rose-mid);
          border-radius: 8px;
          width: 100%;
          padding: 8px;
          font-size: 0.82rem;
          color: var(--text-soft);
          cursor: pointer;
          margin-top: 4px;
          font-family: 'Lato', sans-serif;
        }
        .pe-opcao-add:hover {
          border-color: var(--rose);
          color: var(--rose);
        }
        .pe-input-full {
          width: 100%;
          padding: 10px 14px;
          border: 2px solid var(--rose-mid);
          border-radius: 10px;
          font-size: 0.92rem;
          font-family: 'Lato', sans-serif;
          outline: none;
          background: white;
          margin-bottom: 10px;
        }
        .pe-input-full:focus {
          border-color: var(--rose);
        }
        .pe-vinculada {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          border: 1.5px solid #4caf50;
          border-radius: 10px;
          padding: 10px 14px;
          margin-top: 8px;
          font-size: 0.85rem;
          color: #2e7d32;
        }
      `}</style>

      <div className={styles.stepHeader}>
        <p className={styles.stepEyebrow}>Extras divertidos · opcional</p>
        <h1 className={styles.stepTitle}>
          Toque <em>especial</em> (opcional)
        </h1>
        <p className={styles.stepDescription}>
          Adicione interatividades pra surpreender ainda mais. Tudo aqui é opcional —
          pode pular se preferir.
        </p>
      </div>

      {/* Roleta */}
      <div className="pe-section">
        <div className="pe-section-title">
          🎡 Roleta do próximo date
        </div>
        <p className="pe-section-desc">
          Adiciona uma roleta interativa onde a pessoa gira pra sortear sugestões
          de encontros.
        </p>

        <label className="pe-toggle">
          <div
            className={`pe-toggle-switch ${cfg.roleta_ativa ? 'on' : 'off'}`}
            onClick={() => set('roleta_ativa', !cfg.roleta_ativa)}
          >
            <div className="pe-toggle-knob" />
          </div>
          <span className="pe-toggle-label">
            {cfg.roleta_ativa ? 'Roleta ativada' : 'Ativar roleta'}
          </span>
        </label>

        {cfg.roleta_ativa && (
          <div className="pe-content">
            <div className="pe-content-title">Opções da roleta (mín. 2, máx. 10)</div>
            {cfg.roleta_opcoes.map((op, i) => (
              <div className="pe-opcao-row" key={i}>
                <input
                  value={op}
                  onChange={e => {
                    const arr = [...cfg.roleta_opcoes]
                    arr[i] = e.target.value
                    set('roleta_opcoes', arr)
                  }}
                  placeholder={`Opção ${i + 1}…`}
                  maxLength={40}
                />
                {cfg.roleta_opcoes.length > 2 && (
                  <button
                    className="pe-opcao-remove"
                    onClick={() =>
                      set('roleta_opcoes', cfg.roleta_opcoes.filter((_, idx) => idx !== i))
                    }
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            {cfg.roleta_opcoes.length < 10 && (
              <button
                className="pe-opcao-add"
                onClick={() => set('roleta_opcoes', [...cfg.roleta_opcoes, ''])}
              >
                + Adicionar opção
              </button>
            )}
          </div>
        )}
      </div>

      {/* Jogo de palavras */}
      <div className="pe-section">
        <div className="pe-section-title">
          🎮 Jogo de adivinhar a palavra
        </div>
        <p className="pe-section-desc">
          Mini jogo estilo Wordle. A pessoa tem 5 tentativas pra adivinhar uma palavra
          escolhida por você.
        </p>

        <label className="pe-toggle">
          <div
            className={`pe-toggle-switch ${cfg.termo_ativo ? 'on' : 'off'}`}
            onClick={() => set('termo_ativo', !cfg.termo_ativo)}
          >
            <div className="pe-toggle-knob" />
          </div>
          <span className="pe-toggle-label">
            {cfg.termo_ativo ? 'Jogo ativado' : 'Ativar jogo de palavras'}
          </span>
        </label>

        {cfg.termo_ativo && (
          <div className="pe-content">
            <label
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--text)',
                display: 'block',
                marginBottom: 6,
              }}
            >
              Palavra secreta <span style={{ fontWeight: 400, color: 'var(--text-soft)' }}>(sem acento, só letras)</span>
            </label>
            <input
              className="pe-input-full"
              value={cfg.termo_palavra}
              onChange={e =>
                set(
                  'termo_palavra',
                  e.target.value.toUpperCase().replace(/[^A-ZÁÉÍÓÚÂÊÔÃÕÜÇÀÈÌ]/gi, ''),
                )
              }
              placeholder="Ex: AMOR"
              maxLength={8}
              style={{ textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700 }}
            />
            {cfg.termo_palavra && (
              <p style={{ fontSize: '0.74rem', color: 'var(--rose)', marginBottom: 10 }}>
                {cfg.termo_palavra.length} letra{cfg.termo_palavra.length !== 1 ? 's' : ''}
              </p>
            )}

            <label
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--text)',
                display: 'block',
                marginBottom: 6,
              }}
            >
              Dica <span style={{ fontWeight: 400, color: 'var(--text-soft)' }}>(aparece no jogo)</span>
            </label>
            <input
              className="pe-input-full"
              value={cfg.termo_dica}
              onChange={e => set('termo_dica', e.target.value)}
              placeholder="Ex: O que eu mais gosto em você"
              maxLength={80}
              style={{ marginBottom: 0 }}
            />
          </div>
        )}
      </div>

      {/* Vincular Retrospectiva */}
      <div className="pe-section">
        <div className="pe-section-title">
          💫 Vincular Retrospectiva
        </div>
        <p className="pe-section-desc">
          Se você criou uma Retrospectiva pra essa pessoa, cole o link aqui.
          Um QR Code aparece no final do presente pra ela acessar.
        </p>

        <input
          className="pe-input-full"
          type="url"
          placeholder="https://presentim.com.br/retrospectiva/seu-slug"
          value={cfg.retro_slug}
          onChange={e => {
            const val = e.target.value
            const match = val.match(/retrospectiva\/([\w-]+)/)
            set('retro_slug', match ? match[1] : val)
          }}
          style={{ marginBottom: 0 }}
        />

        {cfg.retro_slug && (
          <div className="pe-vinculada">
            ✅ Retrospectiva vinculada: <strong>{cfg.retro_slug}</strong>
            <button
              onClick={() => set('retro_slug', '')}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-soft)',
                fontSize: '0.78rem',
              }}
            >
              remover
            </button>
          </div>
        )}
      </div>
    </>
  )
}