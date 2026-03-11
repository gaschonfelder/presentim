import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/dashboard'

  const supabase = await createClient()

  // Flow PKCE (OAuth, magic link)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(`${origin}${next}`)
  }

  // Flow token_hash (reset de senha) — passa os params para a página client-side processar
  if (token_hash && type === 'recovery') {
    return NextResponse.redirect(
      `${origin}/auth/reset-password?token_hash=${token_hash}&type=${type}`
    )
  }

  return NextResponse.redirect(`${origin}/login?erro=auth`)
}