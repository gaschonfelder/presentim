import { customAlphabet } from 'nanoid'

// Gera slug único de 8 caracteres (sem caracteres confusos)
const nanoid = customAlphabet('abcdefghijkmnpqrstuvwxyz23456789', 8)

export function gerarSlug(): string {
  return nanoid()
}

// Formata preço em reais
export function formatarPreco(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor)
}

// Retorna a URL pública de um presente
export function urlPresente(slug: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${base}/p/${slug}`
}