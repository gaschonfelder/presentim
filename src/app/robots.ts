import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://presentim.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Bloqueia páginas privadas de aparecer no Google
        disallow: ['/dashboard', '/novo', '/editar', '/retrospectiva/novo', '/retrospectiva/editar', '/streaming/novo', '/streaming/editar', '/comprar/sucesso', '/api/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}