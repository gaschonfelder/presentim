import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('AbacatePay webhook:', JSON.stringify(body))

    // Verifica secret na query string (suporta ?secret= e ?webhookSecret=)
    const secret = req.nextUrl.searchParams.get('secret') ?? req.nextUrl.searchParams.get('webhookSecret')
    const expectedSecret = process.env.ABACATEPAY_WEBHOOK_SECRET
    if (expectedSecret && secret !== expectedSecret) {
      console.warn('Webhook secret inválido:', secret)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const event = body.event
    if (event !== 'billing.paid') {
      return NextResponse.json({ ok: true, ignored: true })
    }

    const billing = body.data?.billing
    if (!billing) return NextResponse.json({ error: 'Payload inválido' }, { status: 400 })

    const billingId = billing.id
    const supabase = await createClient()

    // Busca o pagamento no Supabase pelo billing_id
    const { data: pag } = await supabase
      .from('pagamentos')
      .select('id, user_id, creditos, status')
      .eq('preference_id', billingId)
      .single()

    if (!pag) {
      console.warn('Pagamento não encontrado para billing_id:', billingId)
      return NextResponse.json({ error: 'Pagamento não encontrado' }, { status: 404 })
    }

    if (pag.status === 'aprovado') {
      console.log('Pagamento já processado:', billingId)
      return NextResponse.json({ ok: true, jaProcessado: true })
    }

    // Adiciona créditos
    const { data: profile } = await supabase
      .from('profiles').select('creditos').eq('id', pag.user_id).single()

    await supabase
      .from('profiles')
      .update({ creditos: (profile?.creditos ?? 0) + pag.creditos })
      .eq('id', pag.user_id)

    // Marca como aprovado
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