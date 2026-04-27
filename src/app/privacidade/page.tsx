import Link from 'next/link'
import Image from 'next/image'

export default function PrivacidadePage() {
  const R = '#e8627a'
  const G = 'rgba(232,98,122,.35)'
  const T = '#f5e8ec'
  const TS = 'rgba(245,232,236,.65)'
  const B = 'rgba(255,255,255,.08)'
  const S = 'rgba(255,255,255,.04)'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:#150810!important;color:#f5e8ec!important;font-family:'Inter',system-ui,sans-serif!important}
        a{color:inherit;text-decoration:none}
        @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .legal-fade{animation:fadeIn .6s ease both}
        @media(max-width:640px){
          .legal-nav{padding:0 20px!important}
          .legal-nav .nav-links-inner{display:none!important}
          .legal-page{padding:48px 24px 60px!important}
          .legal-page h1{font-size:1.8rem!important}
        }
      `}</style>

      <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden', background: '#150810', color: T, fontFamily: 'Inter,system-ui,sans-serif', fontSize: 15 }}>
        {/* Ambient glows */}
        <div aria-hidden="true" style={{ position: 'absolute', top: -200, right: -200, width: 700, height: 700, borderRadius: '50%', background: `radial-gradient(circle,${G},transparent 65%)`, filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 600, left: -200, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(120,80,200,.22),transparent 65%)', filter: 'blur(40px)', pointerEvents: 'none', opacity: .8 }} />

        {/* NAV */}
        <header className="legal-nav" style={{ position: 'sticky', top: 0, zIndex: 50, display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 32, padding: '18px 56px', background: 'rgba(21,8,16,.65)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${B}` }}>
          <Link href="/">
            <Image src="/logo.png" alt="Presentim" width={1024} height={272} priority style={{ height: 38, width: 'auto', filter: 'brightness(0) invert(1)' }} />
          </Link>
          <nav className="nav-links-inner" style={{ display: 'flex', gap: 28, justifyContent: 'center' }}>
            <Link href="/#como-funciona" style={{ fontSize: 13, color: TS, fontWeight: 500 }}>Como funciona</Link>
            <Link href="/#precos" style={{ fontSize: 13, color: TS, fontWeight: 500 }}>Preços</Link>
            <Link href="/#faq" style={{ fontSize: 13, color: TS, fontWeight: 500 }}>FAQ</Link>
            <Link href="/historia" style={{ fontSize: 13, color: TS, fontWeight: 500 }}>História</Link>
            <Link href="/demo" style={{ fontSize: 13, color: TS, fontWeight: 500 }}>Ver demo</Link>
          </nav>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link href="/login" style={{ fontSize: 13, color: TS }}>Entrar</Link>
            <Link href="/cadastro" style={{ background: R, color: 'white', padding: '10px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, boxShadow: `0 8px 24px -8px ${G}` }}>Criar presente →</Link>
          </div>
        </header>

        {/* CONTENT */}
        <article className="legal-page legal-fade" style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px 100px', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: R, fontWeight: 600, marginBottom: 18 }}>Privacidade</div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 400, lineHeight: 1.15, letterSpacing: '-.02em', color: T, margin: '0 0 8px' }}>Política de Privacidade</h1>
          <p style={{ fontSize: 13, color: TS, opacity: .7, marginBottom: 48 }}>Última atualização: março de 2025</p>

          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.2rem', fontWeight: 500, color: T, margin: '0 0 12px' }}>1. Quais dados coletamos</h2>
          <p style={{ fontSize: 15, color: TS, lineHeight: 1.85, marginBottom: 10 }}>Coletamos apenas os dados necessários para o funcionamento do serviço:</p>
          <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
            {[
              ['Cadastro:', 'nome e endereço de email'],
              ['Presentes:', 'fotos, textos e músicas que você adiciona voluntariamente'],
              ['Pagamentos:', 'histórico de compras (sem armazenar dados de cartão — processados pelo Mercado Pago)'],
              ['Uso:', 'número de visualizações dos presentes'],
            ].map(([b, t]) => (
              <li key={b} style={{ fontSize: 14, color: TS, lineHeight: 1.8, marginBottom: 6 }}><strong style={{ color: T }}>{b}</strong> {t}</li>
            ))}
          </ul>

          <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${B},transparent)`, margin: '32px 0' }} />

          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.2rem', fontWeight: 500, color: T, margin: '0 0 12px' }}>2. Como usamos seus dados</h2>
          <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
            {['Para criar e exibir seus presentes virtuais','Para gerenciar sua conta e créditos','Para enviar emails transacionais (confirmação de compra, redefinição de senha)','Para enviar email de feedback 7 dias após a compra (você pode cancelar a qualquer momento)'].map(t => (
              <li key={t} style={{ fontSize: 14, color: TS, lineHeight: 1.8, marginBottom: 6 }}>{t}</li>
            ))}
          </ul>

          <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${B},transparent)`, margin: '32px 0' }} />

          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.2rem', fontWeight: 500, color: T, margin: '0 0 12px' }}>3. Compartilhamento de dados</h2>
          <p style={{ fontSize: 15, color: TS, lineHeight: 1.85, marginBottom: 10 }}>Não vendemos nem compartilhamos seus dados pessoais com terceiros, exceto:</p>
          <ul style={{ paddingLeft: 20, marginBottom: 10 }}>
            {[
              ['Mercado Pago:', 'para processamento de pagamentos via Pix'],
              ['Supabase:', 'infraestrutura de banco de dados e armazenamento de arquivos'],
              ['Resend:', 'serviço de envio de emails transacionais'],
            ].map(([b, t]) => (
              <li key={b} style={{ fontSize: 14, color: TS, lineHeight: 1.8, marginBottom: 6 }}><strong style={{ color: T }}>{b}</strong> {t}</li>
            ))}
          </ul>
          <p style={{ fontSize: 14, color: TS, lineHeight: 1.85, marginBottom: 16 }}>Todos os parceiros seguem suas próprias políticas de privacidade e são tratados como operadores de dados sob a LGPD.</p>

          <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${B},transparent)`, margin: '32px 0' }} />

          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.2rem', fontWeight: 500, color: T, margin: '0 0 12px' }}>4. Armazenamento e segurança</h2>
          <p style={{ fontSize: 15, color: TS, lineHeight: 1.85, marginBottom: 16 }}>Seus dados são armazenados em servidores seguros com criptografia em repouso e em trânsito. Utilizamos Row Level Security (RLS) no banco de dados para garantir que cada usuário acesse apenas seus próprios dados.</p>

          <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${B},transparent)`, margin: '32px 0' }} />

          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.2rem', fontWeight: 500, color: T, margin: '0 0 12px' }}>5. Seus direitos (LGPD)</h2>
          <p style={{ fontSize: 15, color: TS, lineHeight: 1.85, marginBottom: 10 }}>De acordo com a Lei Geral de Proteção de Dados (Lei 13.709/2018), você tem direito a:</p>
          <ul style={{ paddingLeft: 20, marginBottom: 10 }}>
            {['Confirmar a existência de tratamento dos seus dados','Acessar seus dados','Corrigir dados incompletos ou desatualizados','Solicitar a exclusão dos seus dados','Revogar o consentimento a qualquer momento'].map(t => (
              <li key={t} style={{ fontSize: 14, color: TS, lineHeight: 1.8, marginBottom: 6 }}>{t}</li>
            ))}
          </ul>
          <p style={{ fontSize: 14, color: TS, lineHeight: 1.85, marginBottom: 16 }}>Para exercer qualquer um desses direitos, entre em contato: <a href="mailto:presentim.sac@gmail.com" style={{ color: R }}>presentim.sac@gmail.com</a></p>

          <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${B},transparent)`, margin: '32px 0' }} />

          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.2rem', fontWeight: 500, color: T, margin: '0 0 12px' }}>6. Cookies</h2>
          <p style={{ fontSize: 15, color: TS, lineHeight: 1.85, marginBottom: 16 }}>Utilizamos apenas cookies essenciais para manter sua sessão autenticada. Não utilizamos cookies de rastreamento ou publicidade.</p>

          <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${B},transparent)`, margin: '32px 0' }} />

          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.2rem', fontWeight: 500, color: T, margin: '0 0 12px' }}>7. Retenção de dados</h2>
          <p style={{ fontSize: 15, color: TS, lineHeight: 1.85, marginBottom: 16 }}>Seus dados são mantidos enquanto sua conta estiver ativa. Presentes são desativados automaticamente após 90 dias. Você pode solicitar a exclusão completa da sua conta e dados a qualquer momento pelo email de contato.</p>

          <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${B},transparent)`, margin: '32px 0' }} />

          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.2rem', fontWeight: 500, color: T, margin: '0 0 12px' }}>8. Contato</h2>
          <p style={{ fontSize: 15, color: TS, lineHeight: 1.85, marginBottom: 16 }}>Dúvidas sobre privacidade ou para exercer seus direitos: <a href="mailto:presentim.sac@gmail.com" style={{ color: R }}>presentim.sac@gmail.com</a></p>
        </article>

        {/* FOOTER */}
        <footer style={{ padding: 56, textAlign: 'center', borderTop: `1px solid ${B}`, fontSize: 13, color: TS }}>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: '1.4rem', color: T }}>presentim<span style={{ color: R }}>·</span></div>
          <p style={{ opacity: .7, marginTop: 8 }}>Feito com 💝 para eternizar momentos especiais</p>
          <div style={{ marginTop: 16, display: 'flex', gap: 20, justifyContent: 'center' }}>
            <Link href="/termos" style={{ color: TS }}>Termos de uso</Link>
            <Link href="/privacidade" style={{ color: TS }}>Privacidade</Link>
            <Link href="/contato" style={{ color: TS }}>Contato</Link>
            <Link href="/historia" style={{ color: TS }}>História</Link>
          </div>
        </footer>
      </div>
    </>
  )
}