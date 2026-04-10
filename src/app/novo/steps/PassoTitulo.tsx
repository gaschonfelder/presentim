'use client'

import { useNovoContext } from '../NovoContext'
import styles from './steps.module.css'

export default function PassoTitulo() {
  const { cfg, set } = useNovoContext()

  return (
    <div>
      <div className={styles.stepHeader}>
        <p className={styles.stepEyebrow}>Vamos começar</p>
        <h1 className={styles.stepTitle}>
          Como vai começar a <em>surpresa</em>?
        </h1>
        <p className={styles.stepDescription}>
          Esses textos aparecem logo que a pessoa abrir o presente.
        </p>
      </div>

      <div className={styles.field}>
        <label>
          Título <span>(aparece após abrir o presente)</span>
        </label>
        <input
          value={cfg.titulo}
          onChange={e => set('titulo', e.target.value)}
          placeholder="Ex: Feliz aniversário, amor!"
          maxLength={60}
        />
        <p className={styles.fieldHint}>{cfg.titulo.length}/60 caracteres</p>
      </div>

      <div className={styles.field}>
        <label>Texto do botão</label>
        <input
          value={cfg.texto_botao}
          onChange={e => set('texto_botao', e.target.value)}
          placeholder="Ex: Vamos lá"
          maxLength={30}
        />
        <p className={styles.fieldHint}>
          Esse é o botão que a pessoa clica pra começar a experiência
        </p>
      </div>
    </div>
  )
}