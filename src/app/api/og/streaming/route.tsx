import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug') ?? ''
  let nome1 = 'Vocês', nome2 = '', cidade = '', dataInicio = '', sinopse = ''

  if (slug) {
    try {
      const supabase = await createClient()
      const { data } = await supabase
        .from('presentes')
        .select('dados_retro')
        .eq('slug', slug)
        .eq('tipo', 'streaming')
        .eq('ativo', true)
        .single()

      if (data?.dados_retro) {
        const d = data.dados_retro as any
        nome1 = d.nome1 ?? nome1
        nome2 = d.nome2 ?? ''
        cidade = d.cidade ?? ''
        dataInicio = d.data_inicio ?? ''
        sinopse = d.sinopse ?? ''
      }
    } catch {}
  }

  const nomes = nome2 ? `${nome1} & ${nome2}` : nome1

  let tempoJuntos = ''
  if (dataInicio) {
    try {
      const inicio = new Date(dataInicio)
      const agora = new Date()
      const meses = (agora.getFullYear() - inicio.getFullYear()) * 12 + (agora.getMonth() - inicio.getMonth())
      if (meses >= 12) {
        const a = Math.floor(meses / 12)
        tempoJuntos = `${a} ${a === 1 ? 'ano' : 'anos'} juntos`
      } else {
        tempoJuntos = `${meses} ${meses === 1 ? 'mês' : 'meses'} juntos`
      }
    } catch {}
  }

  // Truncar sinopse
  const sinopseShort = sinopse.length > 80 ? sinopse.slice(0, 77) + '...' : sinopse

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
          background: 'linear-gradient(180deg, #0a0a0a 0%, #141414 40%, #1a0a0a 100%)',
          fontFamily: 'Georgia, serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Border frame */}
        <div
          style={{
            position: 'absolute',
            inset: 20,
            border: '1px solid rgba(229,9,20,.25)',
            borderRadius: 24,
            display: 'flex',
          }}
        />

        {/* Red glow */}
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            width: 500,
            height: 250,
            background: 'radial-gradient(ellipse, rgba(229,9,20,.12) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
          }}
        />

        {/* Top corner glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 300,
            height: 200,
            background: 'radial-gradient(ellipse at top right, rgba(229,9,20,.08) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Badge */}
        <div
          style={{
            background: '#E50914',
            color: 'white',
            fontSize: 16,
            fontWeight: 700,
            padding: '6px 20px',
            borderRadius: 50,
            marginBottom: 28,
            letterSpacing: '.08em',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          🎬 STREAMING
        </div>

        {/* Names */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: 'white',
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: 16,
            padding: '0 60px',
            display: 'flex',
          }}
        >
          {nomes}
        </div>

        {/* Sinopse */}
        {sinopseShort && (
          <div
            style={{
              fontSize: 20,
              color: 'rgba(255,255,255,.45)',
              textAlign: 'center',
              marginBottom: 24,
              padding: '0 120px',
              lineHeight: 1.5,
              display: 'flex',
            }}
          >
            {sinopseShort}
          </div>
        )}

        {/* Meta info */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 36 }}>
          {tempoJuntos && (
            <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
              ❤️ {tempoJuntos}
            </div>
          )}
          {cidade && (
            <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
              📍 {cidade}
            </div>
          )}
        </div>

        {/* Play button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(229,9,20,.9)',
            color: 'white',
            padding: '12px 32px',
            borderRadius: 4,
            fontSize: 18,
            fontWeight: 700,
          }}
        >
          ▶ Aperte Play
        </div>

        {/* Bottom branding */}
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: 'rgba(255,255,255,.2)',
            fontSize: 14,
          }}
        >
          🎬 Presentim
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}