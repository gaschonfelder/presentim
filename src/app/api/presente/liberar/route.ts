import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    const { presente_id } = await req.json()
    if (!presente_id) return NextResponse.json({ error: 'presente_id obrigatório' }, { status: 400 })

    // Busca o presente (deve ser rascunho e do usuário)
    const { data: presente, error: presError } = await supabase
      .from('presentes')
      .select('id, user_id, tipo, status, ativo')
      .eq('id', presente_id)
      .eq('user_id', user.id)
      .single()

    if (presError || !presente) {
      return NextResponse.json({ error: 'Presente não encontrado' }, { status: 404 })
    }

    if (presente.status === 'ativo') {
      return NextResponse.json({ ok: true, ja_ativo: true })
    }

    // Calcula custo
    const custo = presente.tipo === 'retrospectiva' ? 2 : 1

    // Verifica créditos
    const { data: profile } = await supabase
      .from('profiles')
      .select('creditos')
      .eq('id', user.id)
      .single()

    if (!profile || profile.creditos < custo) {
      return NextResponse.json(
        { error: `Créditos insuficientes. Necessário: ${custo}, disponível: ${profile?.creditos ?? 0}` },
        { status: 402 },
      )
    }

    // Debita créditos
    const { error: creditoError } = await supabase
      .from('profiles')
      .update({ creditos: profile.creditos - custo })
      .eq('id', user.id)

    if (creditoError) {
      return NextResponse.json({ error: 'Erro ao debitar créditos' }, { status: 500 })
    }

    // Ativa o presente
    const { error: ativarError } = await supabase
      .from('presentes')
      .update({ status: 'ativo', ativo: true })
      .eq('id', presente_id)

    if (ativarError) {
      // Rollback dos créditos
      await supabase
        .from('profiles')
        .update({ creditos: profile.creditos })
        .eq('id', user.id)
      return NextResponse.json({ error: 'Erro ao ativar presente' }, { status: 500 })
    }

    console.log(`✅ Presente liberado: ${presente_id} (${custo} crédito${custo > 1 ? 's' : ''}) para ${user.id}`)
    return NextResponse.json({ ok: true })

  } catch (err) {
    console.error('Erro liberar:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}