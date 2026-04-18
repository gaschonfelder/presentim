import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { nome, nota, comentario } = await req.json()

    if (!nota || nota < 1 || nota > 5) {
      return NextResponse.json({ error: 'Nota inválida' }, { status: 400 })
    }

    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) {
      return NextResponse.json({ error: 'RESEND_API_KEY não configurada' }, { status: 500 })
    }

    const estrelas = '⭐'.repeat(nota) + '☆'.repeat(5 - nota)
    const nomeExibido = nome?.trim() || 'Anônimo'
    const comentarioTexto = comentario?.trim() || '(sem comentário)'

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Presentim <noreply@presentim.com.br>',
        to: 'presentim.sac@gmail.com',
        subject: `⭐ Feedback: ${nomeExibido} deu nota ${nota}/5`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:24px">
            <h2 style="color:#e8627a;margin-bottom:20px">Novo feedback recebido!</h2>
            <p><strong>Nome:</strong> ${nomeExibido}</p>
            <p><strong>Nota:</strong> ${estrelas} (${nota}/5)</p>
            <p><strong>Comentário:</strong></p>
            <div style="background:#f9f9f9;border-radius:12px;padding:16px;margin-top:8px;color:#333;line-height:1.6">
              ${comentarioTexto}
            </div>
            <hr style="margin:24px 0;border:none;border-top:1px solid #eee" />
            <p style="font-size:.8rem;color:#999">Enviado pela página de feedback do Presentim</p>
          </div>
        `,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      console.error('Erro Resend feedback:', data)
      return NextResponse.json({ error: 'Erro ao enviar feedback' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Erro feedback:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}