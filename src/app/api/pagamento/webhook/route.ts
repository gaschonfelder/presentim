import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('AbacatePay webhook recebido:', JSON.stringify(body))

    const event = body.event
    if (event !== 'billing.paid') {
      return NextResponse.json({ ok: true, ignored: true })
    }

    const billing = body.data?.billing
    if (!billing) return NextResponse.json({ error: 'Payload inválido' }, { status: 400 })

    const billingId = billing.id

    // Usa service role para operar sem cookies/sessão
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: pag, error } = await supabase
      .from('pagamentos')
      .select('id, user_id, creditos, status')
      .eq('preference_id', billingId)
      .single()

    if (error || !pag) {
      console.warn('Pagamento não encontrado para billing_id:', billingId, error)
      return NextResponse.json({ error: 'Pagamento não encontrado' }, { status: 404 })
    }

    if (pag.status === 'aprovado') {
      console.log('Pagamento já processado:', billingId)
      return NextResponse.json({ ok: true, jaProcessado: true })
    }

    // Busca créditos atuais
    const { data: profile } = await supabase
      .from('profiles')
      .select('creditos')
      .eq('id', pag.user_id)
      .single()

    // Adiciona créditos
    await supabase
      .from('profiles')
      .update({ creditos: (profile?.creditos ?? 0) + pag.creditos })
      .eq('id', pag.user_id)

    // Marca pagamento como aprovado
    await supabase
      .from('pagamentos')
      .update({ status: 'aprovado' })
      .eq('preference_id', billingId)

    console.log(`✅ Webhook: ${pag.creditos} crédito(s) adicionado(s) para ${pag.user_id}`)
    return NextResponse.json({ ok: true })

  } catch (err) {
    console.error('Erro webhook:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}