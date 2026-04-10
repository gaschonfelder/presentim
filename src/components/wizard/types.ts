import type { ComponentType } from 'react'

/**
 * Definição de um passo do Wizard genérico.
 *
 * Cada passo tem um identificador, label exibido no header, um componente
 * a ser renderizado, e validação opcional.
 */
export type WizardStepDefinition = {
  /** Identificador único do passo (usado como React key) */
  key: string
  /** Label exibido no header do wizard */
  label: string
  /** Ícone (emoji) exibido no header */
  icon: string
  /** Componente React renderizado quando o passo está ativo */
  component: ComponentType
  /** Função de validação opcional. Se retornar false, o "Avançar" fica bloqueado. */
  isValid?: () => boolean
  /** Mensagem mostrada quando o passo não está válido */
  invalidHint?: string
  /** Se true, o passo pode ser pulado mesmo sem validação */
  optional?: boolean
}