import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import RetrospectivaV2 from '@/components/retro/RetrospectivaV2'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://presentim.app'

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('presentes')
    .select('dados_retro')
    .eq('slug', slug)
    .eq('tipo', 'retrospectiva')
    .eq('ativo', true)
    .single()

  if (!data?.dados_retro) {
    return {
      title: 'Retrospectiva não encontrada',
      robots: { index: false, follow: false },
    }
  }

  const d = data.dados_retro as { nome1: string; nome2: string; cidade?: string }
  const titulo = `💫 A história de ${d.nome1} e ${d.nome2}`
  const descricao = d.cidade
    ? `Uma retrospectiva especial do casal de ${d.cidade}. Abra para reviver os melhores momentos.`
    : `Uma retrospectiva especial. Abra para reviver os melhores momentos.`

  return {
    title: titulo,
    description: descricao,
    robots: { index: false, follow: false },
    openGraph: {
      type: 'website',
      url: `${BASE_URL}/retrospectiva/v2/${slug}`,
      title: titulo,
      description: descricao,
      siteName: 'Presentim',
      images: [
        {
          url: `/api/og/retrospectiva?slug=${slug}`,
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
      images: [`/api/og/retrospectiva?slug=${slug}`],
    },
  }
}

export default async function RetrospectivaV2Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const supabase = await createClient()
  const { slug } = await params

  const { data: presente, error } = await supabase
    .from('presentes')
    .select('*')
    .eq('slug', slug)
    .eq('tipo', 'retrospectiva')
    .eq('ativo', true)
    .single()

  if (error || !presente) notFound()

  // NOTA: V2 em desenvolvimento — não incrementa visualizações
  // (pra não poluir métricas da versão em produção)

  const dados = presente.dados_retro as {
    nome1: string
    nome2: string
    data_inicio: string
    cidade: string
    mensagem: string
    conquistas: string[]
    fotos: string[]
    musica?: { videoId: string; title: string } | null
    tema?: string | null
  }

  return <RetrospectivaV2 dados={dados} />
}