import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug') ?? ''
  let nome1 = 'Vocês', nome2 = '', cidade = '', dataInicio = ''

  if (slug) {
    try {
      const supabase = await createClient()
      const { data } = await supabase
        .from('presentes')
        .select('dados_retro')
        .eq('slug', slug).eq('tipo', 'retrospectiva').eq('ativo', true).single()
      if (data?.dados_retro) {
        const d = data.dados_retro as any
        nome1 = d.nome1 ?? nome1; nome2 = d.nome2 ?? ''; cidade = d.cidade ?? ''; dataInicio = d.data_inicio ?? ''
      }
    } catch {}
  }

  const nomes = nome2 ? `${nome1} & ${nome2}` : nome1
  let tempoJuntos = ''
  if (dataInicio) {
    try {
      const inicio = new Date(dataInicio), agora = new Date()
      const meses = (agora.getFullYear() - inicio.getFullYear()) * 12 + (agora.getMonth() - inicio.getMonth())
      if (meses >= 12) { const a = Math.floor(meses/12); tempoJuntos = `${a} ${a===1?'ano':'anos'} juntos` }
      else { tempoJuntos = `${meses} ${meses===1?'mês':'meses'} juntos` }
    } catch {}
  }

  return new ImageResponse(
    (
      <div style={{ width:'1200px', height:'630px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#1a0a2e 0%,#2d1155 50%,#1a0a2e 100%)', fontFamily:'Georgia,serif', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:20, border:'1px solid rgba(248,87,166,.3)', borderRadius:32 }} />
        <div style={{ position:'absolute', top:'50%', left:'50%', width:600, height:300, background:'radial-gradient(ellipse,rgba(248,87,166,.2) 0%,transparent 70%)', transform:'translate(-50%,-50%)' }} />
        <div style={{ background:'linear-gradient(135deg,#f857a6,#ff5858)', color:'white', fontSize:16, fontWeight:700, padding:'6px 20px', borderRadius:50, marginBottom:24, letterSpacing:'.05em' }}>✨ RETROSPECTIVA</div>
        <div style={{ fontSize:68, fontWeight:700, color:'white', textAlign:'center', lineHeight:1.1, marginBottom:16, padding:'0 60px' }}>{nomes}</div>
        <div style={{ display:'flex', gap:20, alignItems:'center', marginBottom:36 }}>
          {tempoJuntos && <div style={{ color:'rgba(255,255,255,.6)', fontSize:22 }}>💕 {tempoJuntos}</div>}
          {cidade && <div style={{ color:'rgba(255,255,255,.6)', fontSize:22 }}>📍 {cidade}</div>}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.2)', color:'white', padding:'10px 28px', borderRadius:50, fontSize:18 }}>💫 Presentim</div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}