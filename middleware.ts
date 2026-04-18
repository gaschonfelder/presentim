import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Rotas sempre públicas (nunca redirecionar)
  const publicRoutes = [
    '/comprar/sucesso',
    '/comprar/pendente',
    '/esqueci-senha',
    '/auth/reset-password',
  ]
  if (publicRoutes.some(r => pathname.startsWith(r))) {
    return supabaseResponse
  }

  // Rotas protegidas
  const protectedRoutes = ['/dashboard', '/novo', '/editar', '/comprar', '/retrospectiva/novo', '/retrospectiva/editar', '/presente']
  const isProtected = protectedRoutes.some(r => pathname.startsWith(r))
  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Se já logado, não precisa acessar login/cadastro
  const authRoutes = ['/login', '/cadastro']
  if (authRoutes.some(r => pathname.startsWith(r)) && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|p/|api/).*)',],
}