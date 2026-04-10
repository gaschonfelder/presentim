import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Nossa história',
  description:
    'Como o Presentim nasceu: a história por trás do projeto, contada por quem criou.',
  openGraph: {
    title: 'Nossa história | Presentim',
    description:
      'Como o Presentim nasceu: a história por trás do projeto, contada por quem criou.',
  },
}

export default function HistoriaPage() {
  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        .navbar{background:white;border-bottom:1px solid #fce4ea;padding:0 48px;height:64px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50}
        .nav-logo{font-family:var(--font-playfair),'Playfair Display',serif;font-size:1.4rem;color:#e8627a;text-decoration:none;font-weight:700}
        .nav-back{font-size:.88rem;color:#7a4f5a;text-decoration:none;transition:color .2s}
        .nav-back:hover{color:#e8627a}
        .page{max-width:680px;margin:0 auto;padding:72px 24px 80px}
        .intro-badge{display:inline-block;font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;color:#e8627a;font-weight:700;margin-bottom:18px}
        h1{font-family:var(--font-playfair),'Playfair Display',serif;font-size:2.6rem;line-height:1.15;color:#3d1f28;margin-bottom:12px}
        h1 em{font-style:italic;color:#e8627a}
        .subtitle{font-size:1rem;color:#7a4f5a;margin-bottom:56px;line-height:1.7;font-weight:300}
        h2{font-family:var(--font-playfair),'Playfair Display',serif;font-size:1.15rem;color:#3d1f28;margin:44px 0 14px;font-weight:700}
        h2:first-of-type{margin-top:0}
        p{font-size:.98rem;color:#5a3842;line-height:1.85;margin-bottom:16px;font-weight:400}
        p em{font-style:italic;color:#3d1f28}
        .divider{height:1px;background:linear-gradient(90deg,transparent,#fce4ea,transparent);margin:56px 0 40px}
        .closing{font-family:var(--font-playfair),'Playfair Display',serif;font-style:italic;font-size:1.1rem;color:#3d1f28;text-align:center;line-height:1.7;margin-bottom:32px}
        .signature{text-align:center;font-family:var(--font-playfair),'Playfair Display',serif;font-size:1rem;color:#e8627a;font-style:italic}
        footer{text-align:center;padding:32px 24px;color:#b08090;font-size:.82rem;border-top:1px solid #fce4ea;margin-top:40px}
        footer a{color:#e8627a;text-decoration:none;margin:0 6px;transition:opacity .2s}
        footer a:hover{opacity:.7}
        @media(max-width:640px){
          .navbar{padding:0 20px}
          .page{padding:48px 24px 60px}
          h1{font-size:2rem}
          h2{font-size:1.05rem}
        }
      `}</style>

      <nav className="navbar">
        <Link href="/" className="nav-logo">
          <Image src="/logo.png" alt="Presentim" width={1024} height={272} priority style={{ height: 44, width: 'auto' }} />
        </Link>
        <Link href="/" className="nav-back">← Voltar</Link>
      </nav>

      <article className="page">
        <span className="intro-badge">Nossa história</span>
        <h1>Como o <em>Presentim</em> nasceu</h1>
        <p className="subtitle">
          Um projeto que começou com a vontade de presentear alguém especial
          de um jeito diferente, e acabou virando algo maior.
        </p>

        <h2>Como tudo começou</h2>
        <p>
          A ideia do projeto nasceu de algo simples, mas muito especial:
          a vontade de presentear minha namorada de uma forma diferente.
          Eu queria fugir do comum, criar algo mais significativo, que não
          fosse apenas um presente físico, mas uma experiência, algo que
          guardasse memórias, sentimentos e momentos importantes da nossa
          história.
        </p>

        <h2>A primeira versão</h2>
        <p>
          Foi assim que surgiu a primeira versão: uma página personalizada
          com fotos, música e uma mensagem única. Quando ela viu, a reação
          foi muito mais do que eu esperava. Foi emocionante, marcante… e
          ali eu percebi que aquele tipo de presente tinha um valor muito
          maior do que imaginava.
        </p>

        <h2>De um presente para muitos</h2>
        <p>
          Depois disso, veio a ideia: por que não permitir que outras
          pessoas também possam criar algo assim? Foi então que o projeto
          começou a tomar forma, com o objetivo de ajudar outras pessoas
          a surpreender quem amam de uma maneira criativa e inesquecível.
        </p>
        <p>
          Hoje, o Presentim existe para isso: transformar sentimentos em
          algo visual, compartilhável e único.
        </p>

        <h2>Sobre os valores cobrados</h2>
        <p>
          Vale destacar que os valores cobrados no site não têm como
          objetivo lucro, mas sim ajudar a manter o projeto no ar,
          cobrindo custos como hospedagem, infraestrutura e melhorias
          contínuas.
        </p>

        <div className="divider" />

        <p className="closing">
          No fim, tudo isso nasceu de um gesto simples de amor, e continua
          sendo movido por isso.
        </p>
        <p className="signature">— Gabriel</p>
      </article>

      <footer>
        <Link href="/historia">História</Link> ·
        <Link href="/privacidade">Privacidade</Link> ·
        <Link href="/termos">Termos</Link> ·
        <Link href="/contato">Contato</Link>
      </footer>
    </>
  )
}