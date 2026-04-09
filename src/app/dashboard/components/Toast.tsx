import styles from './Toast.module.css'

type ToastProps = {
  mensagem: string
}

export default function Toast({ mensagem }: ToastProps) {
  return <div className={styles.toast}>{mensagem}</div>
}