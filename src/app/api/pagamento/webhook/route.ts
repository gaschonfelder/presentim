import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('MercadoPago webhook recebido:', JSON.stringify(body))

    // MP envia type=payment, action=payment.updated
    if (body.type !== 'payment') {
      return NextResponse.json({ ok: true, ignored: true })
    }

    const paymentId = String(body.data?.id)
    if (!paymentId) return NextResponse.json({ error: 'Payload inválido' }, { status: 400 })

    // Consulta o status real do pagamento na API do MP
    const token = process.env.MERCADOPAGO_ACCESS_TOKEN
    const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    const payment = await res.json()
    console.log('MercadoPago payment status:', payment.status)

    if (payment.status !== 'approved') {
      return NextResponse.json({ ok: true, status: payment.status })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: pag, error: pagError } = await supabase
      .from('pagamentos')
      .select('id, user_id, creditos, status')
      .eq('preference_id', paymentId)
      .single()

    if (pagError || !pag) {
      console.warn('Pagamento não encontrado para payment_id:', paymentId)
      return NextResponse.json({ error: 'Pagamento não encontrado' }, { status: 404 })
    }

    if (pag.status === 'aprovado') {
      return NextResponse.json({ ok: true, jaProcessado: true })
    }

    // Trava atomicamente: pendente -> aprovado
    const { data: pagAtualizado, error: updateError } = await supabase
      .from('pagamentos')
      .update({ status: 'aprovado' })
      .eq('preference_id', paymentId)
      .eq('status', 'pendente')
      .select('id, user_id, creditos')
      .single()

    if (updateError || !pagAtualizado) {
      return NextResponse.json({ ok: true, jaProcessado: true })
    }

    const { data: profile } = await supabase
      .from('profiles').select('creditos').eq('id', pagAtualizado.user_id).single()

    const { error: creditosError } = await supabase
      .from('profiles')
      .update({ creditos: (profile?.creditos ?? 0) + pagAtualizado.creditos })
      .eq('id', pagAtualizado.user_id)

    if (creditosError) {
      await supabase.from('pagamentos').update({ status: 'pendente' }).eq('id', pagAtualizado.id)
      return NextResponse.json({ error: 'Erro ao adicionar créditos' }, { status: 500 })
    }

    console.log(`✅ Webhook MP: ${pagAtualizado.creditos} crédito(s) para ${pagAtualizado.user_id}`)
    return NextResponse.json({ ok: true })

  } catch (err) {
    console.error('Erro webhook:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}