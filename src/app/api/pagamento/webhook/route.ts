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
    if (!billing?.id) {
      return NextResponse.json({ error: 'Payload inválido' }, { status: 400 })
    }

    const billingId = billing.id

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: pag, error: pagError } = await supabase
      .from('pagamentos')
      .select('id, user_id, creditos, status')
      .eq('preference_id', billingId)
      .single()

    if (pagError || !pag) {
      console.warn('Pagamento não encontrado para billing_id:', billingId, pagError)
      return NextResponse.json({ error: 'Pagamento não encontrado' }, { status: 404 })
    }

    if (pag.status === 'aprovado') {
      console.log('Pagamento já processado:', billingId)
      return NextResponse.json({ ok: true, jaProcessado: true })
    }

    // Primeiro tenta "travar" o processamento mudando de pendente -> aprovado
    const { data: pagamentoAtualizado, error: updatePagamentoError } = await supabase
      .from('pagamentos')
      .update({ status: 'aprovado' })
      .eq('preference_id', billingId)
      .eq('status', 'pendente')
      .select('id, user_id, creditos')
      .single()

    if (updatePagamentoError || !pagamentoAtualizado) {
      console.log('Pagamento já foi processado por outra execução:', billingId)
      return NextResponse.json({ ok: true, jaProcessado: true })
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('creditos')
      .eq('id', pagamentoAtualizado.user_id)
      .single()

    if (profileError) {
      console.error('Erro ao buscar profile:', profileError)

      // rollback simples
      await supabase
        .from('pagamentos')
        .update({ status: 'pendente' })
        .eq('id', pagamentoAtualizado.id)

      return NextResponse.json({ error: 'Erro ao buscar profile' }, { status: 500 })
    }

    const novosCreditos = (profile?.creditos ?? 0) + pagamentoAtualizado.creditos

    const { error: creditosError } = await supabase
      .from('profiles')
      .update({ creditos: novosCreditos })
      .eq('id', pagamentoAtualizado.user_id)

    if (creditosError) {
      console.error('Erro ao adicionar créditos:', creditosError)

      // rollback simples
      await supabase
        .from('pagamentos')
        .update({ status: 'pendente' })
        .eq('id', pagamentoAtualizado.id)

      return NextResponse.json({ error: 'Erro ao adicionar créditos' }, { status: 500 })
    }

    console.log(`✅ Webhook: ${pagamentoAtualizado.creditos} crédito(s) adicionado(s) para ${pagamentoAtualizado.user_id}`)
    return NextResponse.json({ ok: true })

  } catch (err) {
    console.error('Erro webhook:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}