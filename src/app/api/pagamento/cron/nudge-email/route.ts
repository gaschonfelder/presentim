import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Envia email de incentivo para usuários que criaram conta há 3 dias e nunca compraram

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    return NextResponse.json({ error: 'RESEND_API_KEY não configurada' }, { status: 500 })
  }

  const testMode = req.nextUrl.searchParams.get('test') === 'true'

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  let profiles

  if (testMode) {
    // Pega o perfil mais recente que tem 0 créditos (nunca comprou)
    const { data, error } = await supabase
      .from('profiles')
      .select('id, nome, created_at')
      .eq('creditos', 0)
      .order('created_at', { ascending: false })
      .limit(1)

    if (error) {
      console.error('Erro ao buscar perfil teste:', error)
      return NextResponse.json({ error: 'Erro ao buscar perfil', detail: error.message }, { status: 500 })
    }

    profiles = data
  } else {
    // Busca perfis criados há ~3 dias que nunca compraram
    const tresAtras = new Date()
    tresAtras.setDate(tresAtras.getDate() - 3)
    const doisAtras = new Date()
    doisAtras.setDate(doisAtras.getDate() - 2)

    const { data, error } = await supabase
      .from('profiles')
      .select('id, nome, created_at')
      .eq('creditos', 0)
      .eq('nudge_enviado', false)
      .gte('created_at', tresAtras.toISOString())
      .lt('created_at', doisAtras.toISOString())

    if (error) {
      console.error('Erro ao buscar perfis:', error)
      return NextResponse.json({ error: 'Erro ao buscar perfis', detail: error.message }, { status: 500 })
    }

    profiles = data
  }

  if (!profiles || profiles.length === 0) {
    return NextResponse.json({ ok: true, enviados: 0, testMode })
  }

  // Filtra quem realmente nunca fez pagamento aprovado
  let enviados = 0
  const erros: string[] = []

  for (const prof of profiles) {
    try {
      // Confirma que não tem nenhum pagamento aprovado
      const { data: pagamentos } = await supabase
        .from('pagamentos')
        .select('id')
        .eq('user_id', prof.id)
        .eq('status', 'aprovado')
        .limit(1)

      if (pagamentos && pagamentos.length > 0) continue // já comprou

      // Busca email
      const { data: userData } = await supabase.auth.admin.getUserById(prof.id)
      const email = userData?.user?.email
      if (!email) continue

      const nome = prof.nome?.split(' ')[0] ?? 'você'

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
          subject: `${nome}, seu presente virtual está esperando!`,
          html: buildNudgeHtml(nome),
        }),
      })

      if (res.ok) {
        if (!testMode) {
          await supabase
            .from('profiles')
            .update({ nudge_enviado: true })
            .eq('id', prof.id)
        }
        enviados++
      } else {
        const data = await res.json()
        erros.push(`${prof.id}: ${JSON.stringify(data)}`)
      }
    } catch (err) {
      erros.push(`${prof.id}: ${String(err)}`)
    }
  }

  console.log(`✅ Nudge emails: ${enviados} enviados, ${erros.length} erros, testMode: ${testMode}`)
  return NextResponse.json({ ok: true, enviados, erros, testMode })
}

function buildNudgeHtml(nome: string): string {
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
      <div style="font-size:3rem;text-align:center;margin-bottom:20px">🎁</div>
      <h2 style="font-family:Georgia,serif;font-size:1.5rem;text-align:center;margin:0 0 12px">
        ${nome}, já viu como funciona?
      </h2>
      <p style="font-size:.95rem;color:#7a4f5a;line-height:1.7;text-align:center;margin:0 0 24px">
        Você criou sua conta no Presentim mas ainda não criou seu primeiro presente virtual. Que tal dar uma olhada nos exemplos?
      </p>

      <p style="font-size:.92rem;color:#7a4f5a;line-height:1.7;margin:0 0 8px">
        Com o Presentim você pode criar:
      </p>
      <table style="width:100%;margin:0 0 24px" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:8px 0;font-size:.92rem;color:#7a4f5a"> <strong style="color:#3d1f28">Páginas Virtuais</strong> — com fotos, frases e música</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-size:.92rem;color:#7a4f5a"> <strong style="color:#3d1f28">Retrospectivas</strong> — a história do casal em slides animados</td>
        </tr>
      </table>

      <div style="text-align:center;margin-bottom:16px">
        <a href="${baseUrl}/demo"
           style="display:inline-block;background-color:#e8627a;background:linear-gradient(135deg,#e8627a,#c94f68);color:white;padding:14px 36px;border-radius:50px;font-weight:700;font-size:.95rem;text-decoration:none;box-shadow:0 6px 20px rgba(232,98,122,.3)">
          Ver exemplos
        </a>
      </div>

      <div style="text-align:center">
        <a href="${baseUrl}/comprar"
           style="display:inline-block;color:#e8627a;font-size:.88rem;font-weight:700;text-decoration:none">
          Comprar créditos →
        </a>
      </div>
    </div>

    <div style="text-align:center;margin-top:28px;font-size:.78rem;color:#b08090">
      <p>Você está recebendo este email porque criou uma conta no Presentim.</p>
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