import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    const { plano } = await req.json()

    const planos: Record<string, { nome: string; preco: number; creditos: number }> = {
      starter: { nome: '1 Crédito — Presentim', preco: 5.90, creditos: 1 },
      duo:     { nome: '2 Créditos — Presentim', preco: 11.80, creditos: 2 },
      popular: { nome: '3 Créditos — Presentim', preco: 14.90, creditos: 3 },
      max:     { nome: '6 Créditos — Presentim', preco: 24.90, creditos: 6 },
    }

    const item = planos[plano]
    if (!item) return NextResponse.json({ error: 'Plano inválido' }, { status: 400 })

    const token = process.env.MERCADOPAGO_ACCESS_TOKEN
    if (!token) return NextResponse.json({ error: 'Configuração incompleta' }, { status: 500 })

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

    const { data: profile } = await supabase
      .from('profiles')
      .select('email, nome')
      .eq('id', user.id)
      .single()

    // Cria preferência PIX no Mercado Pago
    const res = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Idempotency-Key': `${user.id}-${plano}-${Date.now()}`,
      },
      body: JSON.stringify({
        transaction_amount: item.preco,
        description: item.nome,
        payment_method_id: 'pix',
        payer: {
          email: user.email ?? profile?.email ?? 'comprador@presentim.com.br',
          first_name: profile?.nome?.split(' ')[0] ?? 'Cliente',
          last_name: profile?.nome?.split(' ').slice(1).join(' ') || 'Presentim',
        },
        notification_url: `${baseUrl}/api/pagamento/webhook`,
        metadata: {
          user_id: user.id,
          plano,
          creditos: item.creditos,
        },
      }),
    })

    const data = await res.json()
    console.log('MercadoPago criar:', res.status, JSON.stringify(data))

    if (!res.ok || data.error) {
      return NextResponse.json({ error: 'Erro ao criar cobrança', detail: data }, { status: 500 })
    }

    const paymentId = String(data.id)
    const pixData = data.point_of_interaction?.transaction_data
    const pixCopiaECola = pixData?.qr_code
    const pixQrcode = pixData?.qr_code_base64

    await supabase.from('pagamentos').insert({
      user_id: user.id,
      preference_id: paymentId,
      plano,
      creditos: item.creditos,
      valor: item.preco,
      status: 'pendente',
    })

    return NextResponse.json({
      payment_id: paymentId,
      pix_copia_e_cola: pixCopiaECola,
      pix_qrcode_base64: pixQrcode ? `data:image/png;base64,${pixQrcode}` : null,
    })

  } catch (err) {
    console.error('Erro criar pagamento:', err)
    return NextResponse.json({ error: 'Erro interno', detail: String(err) }, { status: 500 })
  }
}