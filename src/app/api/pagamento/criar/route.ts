import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    const { plano } = await req.json()

    const planos: Record<string, { nome: string; preco: number; creditos: number }> = {
      starter: { nome: '1 Crédito — Presentim',  preco:  590, creditos: 1 },
      popular: { nome: '3 Créditos — Presentim',  preco: 1490, creditos: 3 },
      max:     { nome: '6 Créditos — Presentim',  preco: 2490, creditos: 6 },
    }

    const item = planos[plano]
    if (!item) return NextResponse.json({ error: 'Plano inválido' }, { status: 400 })

    const token = process.env.ABACATEPAY_API_KEY
    if (!token) return NextResponse.json({ error: 'Configuração incompleta' }, { status: 500 })

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

    // Busca dados do usuário
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, nome')
      .eq('id', user.id)
      .single()

    // Pega tokens de sessão para restaurar após redirect externo
    const { data: { session } } = await supabase.auth.getSession()
    const accessToken = session?.access_token ?? ''
    const refreshToken = session?.refresh_token ?? ''

    const completionUrl = `${baseUrl}/comprar/sucesso?plano=${plano}&access_token=${accessToken}&refresh_token=${refreshToken}`

    const res = await fetch('https://api.abacatepay.com/v1/billing/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        frequency: 'ONE_TIME',
        methods: ['PIX'],
        products: [{
          externalId: `${plano}-${user.id}`,
          name: item.nome,
          description: `${item.creditos} crédito${item.creditos > 1 ? 's' : ''} para criar presentes no Presentim`,
          quantity: 1,
          price: item.preco,
        }],
        returnUrl: `${baseUrl}/comprar?cancelado=true`,
        completionUrl,
        customer: {
          name: profile?.nome ?? 'Cliente',
          email: user.email ?? '',
          cellphone: '11999999999',
          taxId: '53523992060',
        },
        metadata: {
          userId: user.id,
          plano,
          creditos: item.creditos,
        },
      }),
    })

    const data = await res.json()
    console.log('AbacatePay criar:', res.status, JSON.stringify(data))

    if (!res.ok || data.error) {
      return NextResponse.json({ error: 'Erro ao criar cobrança', detail: data }, { status: 500 })
    }

    const billing = data.data

    await supabase.from('pagamentos').insert({
      user_id: user.id,
      preference_id: billing.id,
      plano,
      creditos: item.creditos,
      valor: item.preco / 100,
      status: 'pendente',
    })

    return NextResponse.json({ url: billing.url, billing_id: billing.id })
  } catch (err) {
    console.error('Erro criar pagamento:', err)
    return NextResponse.json({ error: 'Erro interno', detail: String(err) }, { status: 500 })
  }
}