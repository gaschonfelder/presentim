import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
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

  // Rotas protegidas — /comprar/sucesso e /comprar/pendente são públicas (redirect pós-pagamento)
  const protectedRoutes = [
    '/dashboard',
    '/novo',
    '/editar',
    '/comprar',
    '/retrospectiva/novo',
    '/retrospectiva/editar',
  ]
  const publicComprar = ['/comprar/sucesso', '/comprar/pendente']

  const pathname = request.nextUrl.pathname
  const isPublicComprar = publicComprar.some(r => pathname.startsWith(r))
  const isProtected = !isPublicComprar && protectedRoutes.some(r => pathname.startsWith(r))

  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Se já logado, não precisa acessar login/cadastro
  const authRoutes = ['/login', '/cadastro']
  const isAuthRoute = authRoutes.some(r => pathname.startsWith(r))

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|p/|api/).*)',
  ],
}