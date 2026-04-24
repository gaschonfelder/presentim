'use client'

import Link from 'next/link'
import Image from 'next/image'
const DEMO_RETRO = 'https://www.presentim.com.br/retrospectiva/ai4469tu'
const DEMO_PAGINA = 'https://www.presentim.com.br/p/jbka676s'
const DEMO_FILME = 'https://www.presentim.com.br/filme/DEMO' // substitua pela URL real

export default function DemoPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --rose: #e8627a; --rose-light: #f9a8b8; --rose-pale: #fdf0f3;
          --rose-mid: #fce4ea; --cream: #fff8f9; --text: #3d1f28; --text-soft: #7a4f5a;
        }
        body { font-family: 'Lato', sans-serif; background: var(--cream); color: var(--text); }
        .demo-header {
          background: white; border-bottom: 1px solid var(--rose-mid);
          padding: 18px 32px; display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; z-index: 50;
        }
        .logo { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 700; color: var(--rose); text-decoration: none; }
        .logo span { color: #c9956a; }
        .btn-criar {
          background: linear-gradient(135deg, var(--rose), #c94f68); color: white;
          padding: 10px 24px; border-radius: 50px; font-weight: 700; font-size: .9rem;
          text-decoration: none; box-shadow: 0 4px 14px rgba(232,98,122,.35);
          transition: transform .2s;
        }
        .btn-criar:hover { transform: translateY(-1px); }
        .hero {
          text-align: center; padding: 72px 24px 56px;
          background: radial-gradient(ellipse 80% 60% at 50% 0%, #fce4ea, transparent 70%);
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: white; border: 1px solid var(--rose-light); border-radius: 50px;
          padding: 6px 18px; font-size: .8rem; color: var(--rose); font-weight: 700;
          letter-spacing: .5px; margin-bottom: 24px;
          box-shadow: 0 2px 12px rgba(232,98,122,.1);
        }
        .hero h1 { font-family: 'Playfair Display', serif; font-size: clamp(2rem, 5vw, 3.5rem); color: var(--text); line-height: 1.2; margin-bottom: 16px; }
        .hero h1 em { font-style: italic; color: var(--rose); }
        .hero p { color: var(--text-soft); font-size: 1.1rem; max-width: 500px; margin: 0 auto; line-height: 1.7; }
        .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; max-width: 1200px; margin: 0 auto; padding: 0 24px 80px; }
        @media (max-width: 900px) { .cards { grid-template-columns: 1fr; max-width: 480px; } }
        .card {
          background: white; border-radius: 28px; overflow: hidden;
          border: 2px solid var(--rose-mid); transition: transform .25s, box-shadow .25s;
          display: flex; flex-direction: column;
        }
        .card:hover { transform: translateY(-6px); box-shadow: 0 24px 56px rgba(232,98,122,.14); }
        .card-dark { border-color: rgba(248,87,166,.3); background: linear-gradient(160deg, #1a0a2e, #2d1155); }

        /* ── CARD FILME ── */
        .card-film {
          border-color: rgba(180,140,60,.4);
          background: linear-gradient(160deg, #0d0b07, #1c1507);
        }
        .card-preview {
          height: 220px; display: flex; align-items: center; justify-content: center;
          font-size: 5rem; background: linear-gradient(135deg, #fce4ea, #fdf0f3);
          position: relative; overflow: hidden;
        }
        .card-preview-dark { background: linear-gradient(135deg, #1a0a2e, #3d1070); }
        .card-preview-film {
          background: #0d0b07;
          flex-direction: column;
          gap: 0;
        }
        /* Película / sprockets */
        .film-strip {
          position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: space-between; pointer-events: none;
        }
        .film-holes {
          display: flex; gap: 10px; padding: 6px 10px;
        }
        .film-holes span {
          display: block; width: 10px; height: 8px; border-radius: 2px;
          background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.08);
        }
        /* Brilho central tipo lens flare */
        .film-glow {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 50% at 50% 45%, rgba(255,210,80,.12), transparent 70%);
        }
        /* Claquete animada */
        .clapboard {
          position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center;
          gap: 4px;
        }
        .clapboard-top {
          width: 72px; height: 18px; border-radius: 4px 4px 0 0;
          background: repeating-linear-gradient(
            90deg,
            #f5c842 0px, #f5c842 8px,
            #1a1a1a 8px, #1a1a1a 16px
          );
          border: 2px solid #f5c842;
          transform-origin: bottom center;
          animation: clap 3.6s ease-in-out infinite;
        }
        .clapboard-body {
          width: 72px; height: 44px; border-radius: 0 0 6px 6px;
          background: #1c1c1c; border: 2px solid #555; border-top: none;
          display: flex; align-items: center; justify-content: center;
        }
        .clapboard-body span {
          font-size: .45rem; color: rgba(255,255,255,.6); font-family: monospace; letter-spacing: .5px; text-align: center; line-height: 1.6;
        }
        @keyframes clap {
          0%, 80%, 100% { transform: rotate(0deg); }
          85% { transform: rotate(-28deg); }
          90% { transform: rotate(0deg); }
        }
        .film-label {
          position: relative; z-index: 2;
          font-size: .65rem; letter-spacing: 3px; text-transform: uppercase;
          color: rgba(245,200,66,.6); font-family: monospace; margin-top: 8px;
        }

        .card-preview-stars {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 40%, rgba(248,87,166,.2), transparent 70%);
        }
        .card-body { padding: 32px; flex: 1; display: flex; flex-direction: column; }
        .card-label { font-size: .7rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--rose); margin-bottom: 8px; }
        .card-label-dark { color: rgba(248,87,166,.8); }
        .card-label-film { color: rgba(245,200,66,.75); }
        .card-title { font-family: 'Playfair Display', serif; font-size: 1.6rem; color: var(--text); margin-bottom: 10px; }
        .card-title-dark { color: white; }
        .card-desc { font-size: .9rem; color: var(--text-soft); line-height: 1.7; margin-bottom: 24px; }
        .card-desc-dark { color: rgba(255,255,255,.55); }
        .card-features { list-style: none; margin-bottom: 28px; flex: 1; }
        .card-features li {
          font-size: .88rem; color: var(--text-soft); padding: 7px 0;
          border-bottom: 1px solid var(--rose-pale); display: flex; align-items: center; gap: 8px;
        }
        .card-features li:last-child { border: none; }
        .card-features-dark li { color: rgba(255,255,255,.5); border-bottom-color: rgba(255,255,255,.07); }
        .card-features-film li { color: rgba(255,255,255,.5); border-bottom-color: rgba(245,200,66,.1); }
        .btn-demo {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          background: linear-gradient(135deg, var(--rose), #c94f68); color: white;
          padding: 14px; border-radius: 14px; font-weight: 700; font-size: 1rem;
          text-decoration: none; transition: opacity .2s, transform .2s;
          box-shadow: 0 6px 20px rgba(232,98,122,.3);
        }
        .btn-demo:hover { opacity: .9; transform: translateY(-1px); }
        .btn-demo-dark {
          background: linear-gradient(135deg, #f857a6, #ff5858);
          box-shadow: 0 6px 20px rgba(248,87,166,.4);
        }
        .btn-demo-film {
          background: linear-gradient(135deg, #c9972a, #f5c842);
          color: #1a1200;
          box-shadow: 0 6px 20px rgba(245,200,66,.35);
        }
        .cta {
          text-align: center; padding: 80px 24px;
          background: linear-gradient(135deg, #f9c5d0, #fce4ea, #fdf0f3);
          position: relative; overflow: hidden;
        }
        .cta::before { content: '💝'; position: absolute; font-size: 18rem; opacity: .05; top: -30px; right: -50px; pointer-events: none; }
        .cta h2 { font-family: 'Playfair Display', serif; font-size: clamp(1.8rem, 4vw, 3rem); color: var(--text); margin-bottom: 16px; line-height: 1.2; }
        .cta h2 em { font-style: italic; color: var(--rose); }
        .cta p { color: var(--text-soft); font-size: 1rem; max-width: 440px; margin: 0 auto 36px; line-height: 1.7; }
        .btn-cta {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, var(--rose), #c94f68); color: white;
          padding: 16px 44px; border-radius: 50px; font-weight: 700; font-size: 1.05rem;
          text-decoration: none; box-shadow: 0 8px 28px rgba(232,98,122,.4); transition: transform .2s;
        }
        .btn-cta:hover { transform: translateY(-2px); }
        footer { background: var(--text); color: rgba(255,255,255,.5); text-align: center; padding: 32px 24px; font-size: .82rem; }
        footer a { color: #f9a8b8; text-decoration: none; }
        @media (max-width: 640px) {
          .demo-header { padding: 14px 20px; }
        }
      `}</style>

      {/* HEADER */}
      <header className="demo-header">
        <Link href="/" className="nav-logo">
          <Image src="/logo.png" alt="Presentim" width={1024} height={272} priority style={{ height: 44, width: 'auto' }} />
        </Link>
        <Link href="/cadastro" className="btn-criar">Criar o meu 💝</Link>
      </header>

      {/* HERO */}
      <div className="hero">
        <div className="hero-badge">👀 Exemplos reais</div>
        <h1>Veja como fica o seu<br /><em>presente virtual</em></h1>
        <p>Abra os exemplos abaixo e experimente como quem recebe se sente ao abrir um Presentim.</p>
      </div>

      {/* CARDS */}
      <div className="cards">
        {/* Página Virtual */}
        <div className="card">
          <div className="card-preview">
            🎁
          </div>
          <div className="card-body">
            <p className="card-label">Produto 1</p>
            <h2 className="card-title">Página Virtual</h2>
            <p className="card-desc">Uma página animada com fotos, frases personalizadas, música e contagem regressiva. A pessoa abre o link e vive a surpresa.</p>
            <ul className="card-features">
              <li>🖼️ Fotos com efeito typewriter</li>
              <li>⏳ Contagem regressiva até a data especial</li>
              <li>🎵 Música de fundo personalizada</li>
              <li>🔗 Link único + QR Code</li>
            </ul>
            <a href={DEMO_PAGINA} target="_blank" rel="noopener noreferrer" className="btn-demo">
              Abrir exemplo ao vivo →
            </a>
          </div>
        </div>

        {/* Retrospectiva */}
        <div className="card card-dark">
          <div className="card-preview card-preview-dark">
            <div className="card-preview-stars" />
            <span style={{ position: 'relative', zIndex: 1 }}>💫</span>
          </div>
          <div className="card-body">
            <p className="card-label card-label-dark">Produto 2</p>
            <h2 className="card-title card-title-dark">Retrospectiva</h2>
            <p className="card-desc card-desc-dark">Uma apresentação de slides animada que conta a história do casal — com céu estrelado, conquistas, fotos e música. Pronta para compartilhar nos Stories.</p>
            <ul className="card-features card-features-dark">
              <li>🌌 Céu da data especial do casal</li>
              <li>🏆 Conquistas em raridades épicas</li>
              <li>📸 Carrossel de fotos animado</li>
              <li>📲 Exportar slides para Stories</li>
            </ul>
            <a href={DEMO_RETRO} target="_blank" rel="noopener noreferrer" className="btn-demo btn-demo-dark">
              Abrir exemplo ao vivo →
            </a>
          </div>
        </div>

        {/* Retrospectiva Estilo Filme */}
        <div className="card card-film">
          <div className="card-preview card-preview-film">
            {/* Película */}
            <div className="film-strip">
              <div className="film-holes">
                {[...Array(8)].map((_, i) => <span key={i} />)}
              </div>
              <div className="film-holes">
                {[...Array(8)].map((_, i) => <span key={i} />)}
              </div>
            </div>
            {/* Brilho dourado */}
            <div className="film-glow" />
            {/* Claquete */}
            <div className="clapboard">
              <div className="clapboard-top" />
              <div className="clapboard-body">
                <span>NOSSA<br />HISTÓRIA<br />★ 2024 ★</span>
              </div>
            </div>
            <span className="film-label">Now Showing</span>
          </div>
          <div className="card-body">
            <p className="card-label card-label-film">Produto 3</p>
            <h2 className="card-title card-title-dark">Retrospectiva Cinema</h2>
            <p className="card-desc card-desc-dark">Uma experiência cinematográfica da história do casal — com trailer, trilha sonora épica, créditos finais e pôster personalizado. Como se a vida de vocês virasse um filme.</p>
            <ul className="card-features card-features-film">
              <li>🎬 Abertura estilo trailer de cinema</li>
              <li>🎞️ Linha do tempo em cenas animadas</li>
              <li>🎼 Trilha sonora personalizada</li>
              <li>🏆 Créditos finais com vocês como protagonistas</li>
            </ul>
            <a href={DEMO_FILME} target="_blank" rel="noopener noreferrer" className="btn-demo btn-demo-film">
              Abrir exemplo ao vivo →
            </a>
          </div>
        </div>
      </div>

      {/* CTA FINAL */}
      <div className="cta">
        <h2>Pronto para criar o seu<br /><em>presente inesquecível?</em></h2>
        <p>Em menos de 5 minutos você cria um presente que a pessoa vai guardar para sempre.</p>
        <Link href="/cadastro" className="btn-cta">Criar meu presente agora 💝</Link>
      </div>

      <footer>
        <Link href="/">← Voltar para a página inicial</Link>
      </footer>
    </>
  )
}