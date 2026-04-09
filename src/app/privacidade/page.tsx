import Link from 'next/link'

export default function PrivacidadePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lato:wght@300;400;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Lato',sans-serif;background:#fff8f9;color:#3d1f28}
        .navbar{background:white;border-bottom:1px solid #fce4ea;padding:0 48px;height:64px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50}
        .nav-logo{font-family:'Playfair Display',serif;font-size:1.4rem;color:#e8627a;text-decoration:none;font-weight:700}
        .nav-back{font-size:.88rem;color:#7a4f5a;text-decoration:none}
        .nav-back:hover{color:#e8627a}
        .page{max-width:720px;margin:0 auto;padding:60px 24px 80px}
        h1{font-family:'Playfair Display',serif;font-size:2.2rem;margin-bottom:8px}
        .updated{font-size:.82rem;color:#b08090;margin-bottom:48px}
        h2{font-family:'Playfair Display',serif;font-size:1.25rem;margin:36px 0 12px;color:#3d1f28}
        p,li{font-size:.92rem;color:#7a4f5a;line-height:1.8;margin-bottom:10px}
        ul{padding-left:20px;margin-bottom:10px}
        a{color:#e8627a}
        .divider{height:1px;background:#fce4ea;margin:48px 0}
        footer{text-align:center;padding:32px 24px;color:#b08090;font-size:.82rem;border-top:1px solid #fce4ea}
        footer a{color:#e8627a;text-decoration:none;margin:0 6px}
      `}</style>

      <nav className="navbar">
        <Link href="/" className="nav-logo">Presentim</Link>
        <Link href="/" className="nav-back">← Voltar</Link>
      </nav>

      <div className="page">
        <h1>Política de Privacidade</h1>
        <p className="updated">Última atualização: março de 2025</p>

        <h2>1. Quais dados coletamos</h2>
        <p>Coletamos apenas os dados necessários para o funcionamento do serviço:</p>
        <ul>
          <li><strong>Cadastro:</strong> nome e endereço de email</li>
          <li><strong>Presentes:</strong> fotos, textos e músicas que você adiciona voluntariamente</li>
          <li><strong>Pagamentos:</strong> histórico de compras (sem armazenar dados de cartão — processados pelo Mercado Pago)</li>
          <li><strong>Uso:</strong> número de visualizações dos presentes</li>
        </ul>

        <h2>2. Como usamos seus dados</h2>
        <ul>
          <li>Para criar e exibir seus presentes virtuais</li>
          <li>Para gerenciar sua conta e créditos</li>
          <li>Para enviar emails transacionais (confirmação de compra, redefinição de senha)</li>
          <li>Para enviar email de feedback 7 dias após a compra (você pode cancelar a qualquer momento)</li>
        </ul>

        <h2>3. Compartilhamento de dados</h2>
        <p>Não vendemos nem compartilhamos seus dados pessoais com terceiros, exceto:</p>
        <ul>
          <li><strong>Mercado Pago:</strong> para processamento de pagamentos via Pix</li>
          <li><strong>Supabase:</strong> infraestrutura de banco de dados e armazenamento de arquivos</li>
          <li><strong>Resend:</strong> serviço de envio de emails transacionais</li>
        </ul>
        <p>Todos os parceiros seguem suas próprias políticas de privacidade e são tratados como operadores de dados sob a LGPD.</p>

        <h2>4. Armazenamento e segurança</h2>
        <p>Seus dados são armazenados em servidores seguros com criptografia em repouso e em trânsito. Utilizamos Row Level Security (RLS) no banco de dados para garantir que cada usuário acesse apenas seus próprios dados.</p>

        <h2>5. Seus direitos (LGPD)</h2>
        <p>De acordo com a Lei Geral de Proteção de Dados (Lei 13.709/2018), você tem direito a:</p>
        <ul>
          <li>Confirmar a existência de tratamento dos seus dados</li>
          <li>Acessar seus dados</li>
          <li>Corrigir dados incompletos ou desatualizados</li>
          <li>Solicitar a exclusão dos seus dados</li>
          <li>Revogar o consentimento a qualquer momento</li>
        </ul>
        <p>Para exercer qualquer um desses direitos, entre em contato: <a href="mailto:presentim.sac@gmail.com">presentim.sac@gmail.com</a></p>

        <h2>6. Cookies</h2>
        <p>Utilizamos apenas cookies essenciais para manter sua sessão autenticada. Não utilizamos cookies de rastreamento ou publicidade.</p>

        <h2>7. Retenção de dados</h2>
        <p>Seus dados são mantidos enquanto sua conta estiver ativa. Presentes são desativados automaticamente após 90 dias. Você pode solicitar a exclusão completa da sua conta e dados a qualquer momento pelo email de contato.</p>

        <h2>8. Contato</h2>
        <p>Dúvidas sobre privacidade ou para exercer seus direitos: <a href="mailto:presentim.sac@gmail.com">presentim.sac@gmail.com</a></p>

        <div className="divider" />
      </div>

      <footer>
        <Link href="/privacidade">Privacidade</Link> · <Link href="/termos">Termos</Link> · <Link href="/contato">Contato</Link>
      </footer>
    </>
  )
}