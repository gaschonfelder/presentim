import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import PresenteClient from './PresenteClient'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://presentim.app'

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('presentes')
    .select('titulo, emoji, cor_primaria')
    .eq('slug', slug)
    .eq('ativo', true)
    .single()

  if (!data) {
    return {
      title: 'Presente não encontrado',
      robots: { index: false, follow: false },
    }
  }

  const emoji = data.emoji ?? '🎁'
  const titulo = data.titulo ?? 'Um presente especial para você'
  const descricao = 'Alguém preparou um presente virtual especial. Abra para descobrir!'

  return {
    title: `${emoji} ${titulo}`,
    description: descricao,
    robots: { index: false, follow: false },
    openGraph: {
      type: 'website',
      url: `${BASE_URL}/p/${slug}`,
      title: `${emoji} ${titulo}`,
      description: descricao,
      siteName: 'Presentim',
      images: [
        {
          url: `/api/og/presente?slug=${slug}`,
          width: 1200,
          height: 630,
          alt: titulo,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${emoji} ${titulo}`,
      description: descricao,
      images: [`/api/og/presente?slug=${slug}`],
    },
  }
}

export default function PresentePage({ params }: { params: Promise<{ slug: string }> }) {
  return <PresenteClient params={params} />
}