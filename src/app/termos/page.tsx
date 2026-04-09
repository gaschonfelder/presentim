import Link from 'next/link'

export default function TermosPage() {
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
        <h1>Termos de Uso</h1>
        <p className="updated">Última atualização: março de 2025</p>

        <h2>1. Aceitação dos Termos</h2>
        <p>Ao utilizar o Presentim, você concorda com estes Termos de Uso. Se não concordar com qualquer parte, não utilize o serviço.</p>

        <h2>2. Descrição do Serviço</h2>
        <p>O Presentim é uma plataforma que permite criar presentes virtuais personalizados — Páginas Virtuais e Retrospectivas — com fotos, músicas e mensagens, acessíveis por link único.</p>

        <h2>3. Uso Aceitável</h2>
        <p>Você concorda em não utilizar o Presentim para:</p>
        <ul>
          <li>Publicar conteúdo ofensivo, ilegal, discriminatório ou que viole direitos de terceiros</li>
          <li>Fazer upload de imagens ou músicas sem os devidos direitos autorais</li>
          <li>Tentar acessar contas de outros usuários</li>
          <li>Usar o serviço para fins comerciais sem autorização prévia</li>
        </ul>

        <h2>4. Créditos e Pagamentos</h2>
        <p>Os créditos adquiridos não possuem prazo de validade. Pagamentos são processados via Pix através da plataforma Mercado Pago. Após a confirmação do pagamento, os créditos são adicionados automaticamente à sua conta.</p>
        <p>Não realizamos reembolsos de créditos já utilizados para criação de presentes.</p>

        <h2>5. Validade dos Links</h2>
        <p>Os links de presentes ficam ativos por 90 dias a partir da data de criação. Após esse período, o link é desativado automaticamente. Os créditos utilizados não são reembolsados após a expiração.</p>

        <h2>6. Conteúdo do Usuário</h2>
        <p>Você é responsável por todo o conteúdo que publicar. O Presentim não reivindica propriedade sobre suas fotos, textos ou músicas, mas se reserva o direito de remover conteúdo que viole estes termos.</p>

        <h2>7. Disponibilidade do Serviço</h2>
        <p>Nos esforçamos para manter o serviço disponível 24/7, mas não garantimos disponibilidade ininterrupta. Podemos realizar manutenções com ou sem aviso prévio.</p>

        <h2>8. Limitação de Responsabilidade</h2>
        <p>O Presentim não se responsabiliza por danos indiretos, perda de dados ou interrupções no serviço. Nossa responsabilidade máxima fica limitada ao valor pago pelos créditos não utilizados.</p>

        <h2>9. Alterações nos Termos</h2>
        <p>Podemos atualizar estes termos a qualquer momento. Alterações significativas serão comunicadas por email. O uso continuado do serviço após as alterações implica aceitação dos novos termos.</p>

        <h2>10. Contato</h2>
        <p>Dúvidas sobre estes termos? Entre em contato: <a href="mailto:presentim.sac@gmail.com">presentim.sac@gmail.com</a></p>

        <div className="divider" />
      </div>

      <footer>
        <Link href="/privacidade">Privacidade</Link> · <Link href="/termos">Termos</Link> · <Link href="/contato">Contato</Link>
      </footer>
    </>
  )
}