import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    const { codigo } = await req.json()
    if (!codigo || typeof codigo !== 'string') {
      return NextResponse.json({ error: 'Código obrigatório' }, { status: 400 })
    }

    const codigoLimpo = codigo.trim().toUpperCase()

    // Busca o código
    const { data: codigoData, error: codigoError } = await supabase
      .from('codigos_resgate')
      .select('*')
      .eq('codigo', codigoLimpo)
      .eq('ativo', true)
      .single()

    if (codigoError || !codigoData) {
      return NextResponse.json({ error: 'Código inválido ou expirado' }, { status: 404 })
    }

    // Verifica se já atingiu o limite de usos
    if (codigoData.uso_atual >= codigoData.uso_maximo) {
      return NextResponse.json({ error: 'Este código já foi utilizado o máximo de vezes' }, { status: 410 })
    }

    // Verifica se o usuário já usou este código
    const { data: jaUsou } = await supabase
      .from('resgates')
      .select('id')
      .eq('codigo_id', codigoData.id)
      .eq('user_id', user.id)
      .single()

    if (jaUsou) {
      return NextResponse.json({ error: 'Você já resgatou este código' }, { status: 409 })
    }

    // Registra o resgate
    const { error: resgateError } = await supabase
      .from('resgates')
      .insert({ codigo_id: codigoData.id, user_id: user.id })

    if (resgateError) {
      return NextResponse.json({ error: 'Erro ao registrar resgate' }, { status: 500 })
    }

    // Incrementa uso_atual
    await supabase
      .from('codigos_resgate')
      .update({ uso_atual: codigoData.uso_atual + 1 })
      .eq('id', codigoData.id)

    // Adiciona créditos ao usuário
    const { data: profile } = await supabase
      .from('profiles')
      .select('creditos')
      .eq('id', user.id)
      .single()

    await supabase
      .from('profiles')
      .update({ creditos: (profile?.creditos ?? 0) + codigoData.creditos })
      .eq('id', user.id)

    console.log(`✅ Código resgatado: ${codigoLimpo} → ${codigoData.creditos} crédito(s) para ${user.id}`)

    return NextResponse.json({
      ok: true,
      creditos: codigoData.creditos,
      mensagem: `+${codigoData.creditos} crédito${codigoData.creditos > 1 ? 's' : ''} adicionado${codigoData.creditos > 1 ? 's' : ''}!`,
    })

  } catch (err) {
    console.error('Erro resgate:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}