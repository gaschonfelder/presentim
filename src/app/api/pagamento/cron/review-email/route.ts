import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Chamada pelo cron da Vercel (vercel.json) ou manualmente
// Envia email de review para usuários que compraram há 3 dias e ainda não receberam

export async function GET(req: NextRequest) {
  // Proteção básica por secret
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    return NextResponse.json({ error: 'RESEND_API_KEY não configurada' }, { status: 500 })
  }

  // Modo teste: ?test=true envia para o usuário do pagamento mais recente (ignora filtro de data)
  const testMode = req.nextUrl.searchParams.get('test') === 'true'

  const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

  let pagamentos

  if (testMode) {
    const { data, error } = await supabase
      .from('pagamentos')
      .select('id, user_id, plano, creditos, created_at')
      .eq('status', 'aprovado')
      .order('created_at', { ascending: false })
      .limit(1)

    if (error) {
      console.error('Erro ao buscar pagamento teste:', error)
      return NextResponse.json({ error: 'Erro ao buscar pagamento' }, { status: 500 })
    }

    pagamentos = data
  } else {
    // Busca pagamentos aprovados há ~3 dias que ainda não receberam email de review
    const tresAtras = new Date()
    tresAtras.setDate(tresAtras.getDate() - 3)
    const doisAtras = new Date()
    doisAtras.setDate(doisAtras.getDate() - 2)

    const { data, error } = await supabase
      .from('pagamentos')
      .select('id, user_id, plano, creditos, created_at')
      .eq('status', 'aprovado')
      .eq('review_enviado', false)
      .gte('created_at', tresAtras.toISOString())
      .lt('created_at', doisAtras.toISOString())

    if (error) {
      console.error('Erro ao buscar pagamentos:', error)
      return NextResponse.json({ error: 'Erro ao buscar pagamentos' }, { status: 500 })
    }

    pagamentos = data
  }

  if (!pagamentos || pagamentos.length === 0) {
    return NextResponse.json({ ok: true, enviados: 0, testMode })
  }

  let enviados = 0
  const erros: string[] = []

  for (const pag of pagamentos) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('nome')
        .eq('id', pag.user_id)
        .single()

      const { data: userData } = await supabase.auth.admin.getUserById(pag.user_id)
      const email = userData?.user?.email
      if (!email) continue

      const nome = profile?.nome?.split(' ')[0] ?? 'você'

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Presentim <noreply@presentim.com.br>',
          reply_to: 'presentim.sac@gmail.com',
          to: email,
          subject: `${nome}, como foi a experiência com o Presentim? 💝`,
          html: buildEmailHtml(nome),
        }),
      })

      if (res.ok) {
        if (!testMode) {
          await supabase
            .from('pagamentos')
            .update({ review_enviado: true })
            .eq('id', pag.id)
        }
        enviados++
      } else {
        const data = await res.json()
        erros.push(`${pag.id}: ${JSON.stringify(data)}`)
      }
    } catch (err) {
      erros.push(`${pag.id}: ${String(err)}`)
    }
  }

  console.log(`✅ Review emails: ${enviados} enviados, ${erros.length} erros, testMode: ${testMode}`)
  return NextResponse.json({ ok: true, enviados, erros, testMode })
}

function buildEmailHtml(nome: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://presentim.com.br'

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#fff8f9;font-family:'Lato',Arial,sans-serif;color:#3d1f28">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px">

    <div style="text-align:center;margin-bottom:32px">
      <h1 style="font-family:Georgia,serif;font-size:2rem;color:#e8627a;margin:0">Presentim</h1>
    </div>

    <div style="background:white;border-radius:20px;padding:40px 32px;border:1px solid #fce4ea;box-shadow:0 4px 20px rgba(232,98,122,.08)">
      <div style="font-size:3rem;text-align:center;margin-bottom:20px">💝</div>
      <h2 style="font-family:Georgia,serif;font-size:1.5rem;text-align:center;margin:0 0 12px">
        Oi, ${nome}! Como foi?
      </h2>
      <p style="font-size:.95rem;color:#7a4f5a;line-height:1.7;text-align:center;margin:0 0 28px">
        Faz alguns dias que você criou um presente no Presentim.<br>
        A reação de quem recebeu foi boa? 😊
      </p>

      <p style="font-size:.92rem;color:#7a4f5a;line-height:1.7;margin:0 0 24px">
        Se tiver um minutinho, adoraríamos saber sua opinião. Sua experiência nos ajuda muito a melhorar o Presentim para todo mundo.
      </p>

      <div style="text-align:center;margin-bottom:28px">
        <a href="${baseUrl}/feedback"
           style="display:inline-block;background-color:#e8627a;background:linear-gradient(135deg,#e8627a,#c94f68);color:white;padding:14px 36px;border-radius:50px;font-weight:700;font-size:.95rem;text-decoration:none;box-shadow:0 6px 20px rgba(232,98,122,.3)">
          ⭐ Avaliar minha experiência
        </a>
      </div>

      <p style="font-size:.82rem;color:#b08090;text-align:center;margin:0">
        Leva menos de 1 minuto! 💌
      </p>
    </div>

    <div style="text-align:center;margin-top:28px;font-size:.78rem;color:#b08090">
      <p>Você está recebendo este email porque fez uma compra no Presentim.</p>
      <p style="margin-top:6px">
        <a href="${baseUrl}/contato" style="color:#e8627a;text-decoration:none">Contato</a> ·
        <a href="${baseUrl}/privacidade" style="color:#e8627a;text-decoration:none">Privacidade</a>
      </p>
    </div>

  </div>
</body>
</html>
  `.trim()
}