'use client'

import Link from 'next/link'

export default function PendentePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lato:wght@300;400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Lato', sans-serif; background: #fff8f9; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .page { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px 24px; }
        .emoji { font-size: 4rem; margin-bottom: 24px; }
        h1 { font-family: 'Playfair Display', serif; font-size: 2rem; color: #3d1f28; margin-bottom: 12px; }
        h1 span { color: #f57c00; }
        p { color: #7a4f5a; font-size: .95rem; line-height: 1.7; max-width: 420px; margin-bottom: 32px; }
        .btn { display: inline-block; padding: 14px 36px; background: linear-gradient(135deg, #e8627a, #f9a8b8); color: white; border-radius: 12px; font-weight: 700; text-decoration: none; font-family: 'Lato', sans-serif; }
      `}</style>
      <div className="page">
        <div className="emoji">⏳</div>
        <h1>Pagamento <span>pendente</span></h1>
        <p>Seu pagamento está sendo processado. Assim que for confirmado, os créditos serão adicionados automaticamente à sua conta.</p>
        <Link href="/dashboard" className="btn">Voltar ao dashboard</Link>
      </div>
    </>
  )
}