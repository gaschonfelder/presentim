import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import StreamingPlayer from './StreamingPlayer'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://presentim.app'

// ─── Tipos do dados_retro para streaming ──────────────────────────────────────
export type StreamingDados = {
  nome1: string
  nome2: string
  data_inicio: string
  cidade: string
  mensagem: string
  sinopse: string
  conquistas: Array<{ key: string; fotoIdx?: number; fotoUrl?: string }>
  fotos: string[]
  fotos_titulos: string[]
  musica: { videoId: string; title: string } | null
  quiz: Array<{ pergunta: string; opcoes: string[]; correta: number }> | null
  conquistas?: { key: string }[]
  msg_final?: string  
  pos_creditos?: string
}

// ─── Metadata (OG / Twitter) ──────────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('presentes')
    .select('dados_retro')
    .eq('slug', slug)
    .eq('tipo', 'streaming')
    .eq('ativo', true)
    .single()

  if (!data?.dados_retro) {
    return {
      title: 'Não encontrado',
      robots: { index: false, follow: false },
    }
  }

  const d = data.dados_retro as StreamingDados
  const titulo = `🎬 ${d.nome1} & ${d.nome2} — A Série`
  const descricao = d.sinopse
    || (d.cidade
      ? `Uma história de amor de ${d.cidade}. Aperte play e assista.`
      : `Uma história de amor inesquecível. Aperte play e assista.`)

  return {
    title: titulo,
    description: descricao,
    robots: { index: false, follow: false },
    openGraph: {
      type: 'website',
      url: `${BASE_URL}/streaming/${slug}`,
      title: titulo,
      description: descricao,
      siteName: 'Presentim',
      images: [
        {
          url: `/api/og/streaming?slug=${slug}`,
          width: 1200,
          height: 630,
          alt: titulo,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: titulo,
      description: descricao,
      images: [`/api/og/streaming?slug=${slug}`],
    },
  }
}

// ─── Página ───────────────────────────────────────────────────────────────────
export default async function StreamingPage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createClient()
  const { slug } = await params

  const { data: presente, error } = await supabase
    .from('presentes')
    .select('*')
    .eq('slug', slug)
    .eq('tipo', 'streaming')
    .eq('ativo', true)
    .single()

  if (error || !presente) notFound()

  // Incrementar visualizações
  await supabase
    .from('presentes')
    .update({ visualizacoes: (presente.visualizacoes ?? 0) + 1 })
    .eq('id', presente.id)

  const dados = presente.dados_retro as StreamingDados

  return <StreamingPlayer dados={dados} />
}