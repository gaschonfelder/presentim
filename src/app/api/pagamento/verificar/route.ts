import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    const { billing_id, plano } = await req.json()
    const token = process.env.ABACATEPAY_API_KEY
    const isDevMode = token?.startsWith('abc_dev_')

    // Busca pagamento pendente no Supabase
    let pagamento: any = null
    if (billing_id) {
      const { data } = await supabase
        .from('pagamentos')
        .select('id, status, creditos, preference_id')
        .eq('preference_id', billing_id)
        .eq('user_id', user.id)
        .single()
      pagamento = data
    }
    // Fallback: pega o pendente mais recente
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
    if (pagamento.status === 'aprovado') return NextResponse.json({ ok: true, creditos: pagamento.creditos })

    // Em dev mode, confiar no redirect e adicionar créditos direto
    // Em produção, verificar na API
    let pago = isDevMode

    if (!isDevMode) {
      const url = `https://api.abacatepay.com/v1/billing/get?id=${pagamento.preference_id}`
      console.log('Verificando na AbacatePay:', url)
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      const data = await res.json()
      console.log('AbacatePay get:', res.status, JSON.stringify(data))
      pago = data.data?.status === 'PAID'
    } else {
      console.log('⚠️ Dev mode: pulando verificação AbacatePay, adicionando créditos direto')
    }

    if (!pago) {
      return NextResponse.json({ error: 'Pagamento não confirmado' }, { status: 402 })
    }

    // Adiciona créditos
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

    console.log(`✅ ${pagamento.creditos} crédito(s) adicionado(s) para ${user.id}`)
    return NextResponse.json({ ok: true, creditos: pagamento.creditos })
  } catch (err) {
    console.error('Erro verificar pagamento:', err)
    return NextResponse.json({ error: 'Erro interno', detail: String(err) }, { status: 500 })
  }
}