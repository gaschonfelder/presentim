import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    const { payment_id, presente_id, custo_creditos } = await req.json()

    // Busca pagamento pelo payment_id ou pelo mais recente pendente
    let pagamento: any = null
    if (payment_id) {
      const { data } = await supabase
        .from('pagamentos')
        .select('id, status, creditos, preference_id')
        .eq('preference_id', payment_id)
        .eq('user_id', user.id)
        .single()
      pagamento = data
    }
    if (!pagamento) {
      const { data } = await supabase
        .from('pagamentos')
        .select('id, status, creditos, preference_id')
        .eq('user_id', user.id)
        .eq('status', 'pendente')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      pagamento = data
    }

    if (!pagamento) return NextResponse.json({ error: 'Pagamento não encontrado' }, { status: 404 })

    // Se já aprovado no banco (via webhook), retorna ok direto
    if (pagamento.status === 'aprovado') {
      // Se tem presente_id, tenta liberar o presente
      if (presente_id && custo_creditos) {
        await liberarPresente(supabase, user.id, presente_id, custo_creditos)
      }
      return NextResponse.json({ ok: true, creditos: pagamento.creditos })
    }

    // Consulta status real na API do Mercado Pago
    const token = process.env.MERCADOPAGO_ACCESS_TOKEN
    const res = await fetch(`https://api.mercadopago.com/v1/payments/${pagamento.preference_id}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    const data = await res.json()
    console.log('MP verificar:', data.status)

    if (data.status !== 'approved') {
      return NextResponse.json({ error: 'Pagamento não confirmado', mp_status: data.status }, { status: 402 })
    }

    // Aprovado — adiciona créditos ao saldo
    const { data: profile } = await supabase
      .from('profiles').select('creditos').eq('id', user.id).single()

    await supabase
      .from('profiles')
      .update({ creditos: (profile?.creditos ?? 0) + pagamento.creditos })
      .eq('id', user.id)

    await supabase
      .from('pagamentos')
      .update({ status: 'aprovado' })
      .eq('id', pagamento.id)

    console.log(`✅ Verificar MP: ${pagamento.creditos} crédito(s) para ${user.id}`)

    // Se tem presente_id, libera o presente automaticamente
    if (presente_id && custo_creditos) {
      await liberarPresente(supabase, user.id, presente_id, custo_creditos)
    }

    return NextResponse.json({ ok: true, creditos: pagamento.creditos })

  } catch (err) {
    console.error('Erro verificar:', err)
    return NextResponse.json({ error: 'Erro interno', detail: String(err) }, { status: 500 })
  }
}

// Debita créditos e ativa o presente
async function liberarPresente(
  supabase: any,
  userId: string,
  presenteId: string,
  custoCreditos: number,
) {
  try {
    // Verifica se o presente existe e é rascunho
    const { data: presente } = await supabase
      .from('presentes')
      .select('id, status')
      .eq('id', presenteId)
      .eq('user_id', userId)
      .single()

    if (!presente || presente.status === 'ativo') return

    // Busca saldo atualizado
    const { data: profile } = await supabase
      .from('profiles')
      .select('creditos')
      .eq('id', userId)
      .single()

    if (!profile || profile.creditos < custoCreditos) return

    // Debita e ativa
    await supabase
      .from('profiles')
      .update({ creditos: profile.creditos - custoCreditos })
      .eq('id', userId)

    await supabase
      .from('presentes')
      .update({ status: 'ativo', ativo: true })
      .eq('id', presenteId)

    console.log(`✅ Presente liberado via pagamento: ${presenteId}`)
  } catch (err) {
    console.error('Erro ao liberar presente após pagamento:', err)
  }
}