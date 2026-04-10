'use client'

import { useNovoContext } from '../NovoContext'
import styles from './steps.module.css'

export default function PassoMensagem() {
  const { cfg, set } = useNovoContext()

  return (
    <div>
      <div className={styles.stepHeader}>
        <p className={styles.stepEyebrow}>Mensagem do coração</p>
        <h1 className={styles.stepTitle}>
          O que você quer <em>dizer</em>?
        </h1>
        <p className={styles.stepDescription}>
          Essa é a mensagem que aparece destacada no final, depois das fotos.
          É o momento mais especial.
        </p>
      </div>

      <div className={styles.field}>
        <label>
          Mensagem final <span>(aparece como encerramento)</span>
        </label>
        <textarea
          rows={4}
          value={cfg.texto_final}
          onChange={e => set('texto_final', e.target.value)}
          placeholder="Ex: Te amo muito! Você é a melhor coisa que aconteceu na minha vida 💝"
          maxLength={120}
        />
        <p className={styles.fieldHint}>{cfg.texto_final.length}/120 caracteres</p>
      </div>
    </div>
  )
}