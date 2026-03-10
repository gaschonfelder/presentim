import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug') ?? ''

  let titulo = 'Um presente especial para você'
  let emoji = '🎁'
  let cor = '#e8627a'

  if (slug) {
    try {
      const supabase = await createClient()
      const { data } = await supabase
        .from('presentes')
        .select('titulo, emoji, cor_primaria')
        .eq('slug', slug)
        .eq('ativo', true)
        .single()

      if (data) {
        titulo = data.titulo ?? titulo
        emoji = data.emoji ?? emoji
        cor = data.cor_primaria ?? cor
      }
    } catch {}
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, #fff8f9 0%, #fce4ea 50%, ${cor}22 100%)`,
          fontFamily: 'Georgia, serif',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', top: 40, left: 60, fontSize: 48, opacity: 0.15 }}>💝</div>
        <div style={{ position: 'absolute', bottom: 40, right: 60, fontSize: 40, opacity: 0.12 }}>💫</div>
        <div style={{ position: 'absolute', inset: 20, border: `2px solid ${cor}33`, borderRadius: 32 }} />

        <div style={{ fontSize: 96, marginBottom: 24 }}>{emoji}</div>
        <div style={{ fontSize: 52, fontWeight: 700, color: '#3d1f28', textAlign: 'center', maxWidth: 900, lineHeight: 1.2, marginBottom: 20, padding: '0 40px' }}>
          {titulo}
        </div>
        <div style={{ fontSize: 22, color: '#7a4f5a', marginBottom: 40 }}>
          Alguém preparou isso especialmente para você 💌
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: cor, color: 'white', padding: '10px 28px', borderRadius: 50, fontSize: 20, fontWeight: 700 }}>
          🎁 Presentim
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}