import type { Metadata } from 'next'
import { Playfair_Display, Lato } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://presentim.com.br'

// Playfair Display — títulos (serif italic)
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

// Lato — corpo de texto
const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Presentim — Presentes virtuais que emocionam de verdade',
    template: '%s | Presentim',
  },
  description:
    'Crie um presente virtual personalizado com fotos, músicas e mensagens. Compartilhe um link único e surpreenda quem você ama.',
  keywords: [
    'presente virtual',
    'presente online',
    'aniversário',
    'dia dos namorados',
    'retrospectiva casal',
    'presente personalizado',
  ],
  authors: [{ name: 'Presentim' }],
  creator: 'Presentim',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: BASE_URL,
    siteName: 'Presentim',
    title: 'Presentim — Presentes virtuais que emocionam de verdade',
    description:
      'Crie um presente virtual personalizado com fotos, músicas e mensagens. Compartilhe um link único e surpreenda quem você ama.',
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Presentim — Presentes virtuais',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Presentim — Presentes virtuais que emocionam de verdade',
    description: 'Crie um presente virtual personalizado com fotos, músicas e mensagens.',
    images: ['/og-default.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${lato.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}