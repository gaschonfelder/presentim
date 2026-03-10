'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { QRCodeCanvas as QRCode } from 'qrcode.react'
import type { Presente, Profile } from '@/types'

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function ModalEscolherTipo({ creditos, onClose }: { creditos: number; onClose: () => void }) {
  const router = useRouter()
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: 28, padding: '40px 32px', maxWidth: 480, width: '100%', boxShadow: '0 32px 80px rgba(0,0,0,.18)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '2rem', marginBottom: 10 }}>✨</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.6rem', color: '#3d1f28', marginBottom: 6 }}>Que tipo de presente?</h2>
          <p style={{ fontSize: '.88rem', color: '#7a4f5a', lineHeight: 1.6 }}>Escolha o formato ideal para surpreender quem você ama.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Opção 1: Página Presente */}
          <button
            onClick={() => { onClose(); router.push('/novo') }}
            disabled={creditos < 1}
            style={{
              background: creditos >= 1 ? 'linear-gradient(135deg,#fff5f7,#fff)' : '#f5f5f5',
              border: creditos >= 1 ? '2px solid #f9a8b8' : '2px solid #e0e0e0',
              borderRadius: 20, padding: '22px 24px',
              cursor: creditos >= 1 ? 'pointer' : 'not-allowed',
              textAlign: 'left', transition: 'all .2s', width: '100%',
              opacity: creditos >= 1 ? 1 : 0.6,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ fontSize: '2.4rem', flexShrink: 0 }}>🎁</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', color: '#3d1f28', fontWeight: 700 }}>Página Presente</span>
                  <span style={{ background: '#fce4ea', color: '#e8627a', fontSize: '.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: 50 }}>1 crédito</span>
                </div>
                <p style={{ fontSize: '.82rem', color: '#7a4f5a', lineHeight: 1.5, margin: 0 }}>
                  Contagem regressiva, fotos, música e mensagem personalizada. Clássico e emocionante.
                </p>
              </div>
            </div>
          </button>

          {/* Opção 2: Retrospectiva */}
          <button
            onClick={() => { onClose(); router.push('/retrospectiva/novo') }}
            disabled={creditos < 3}
            style={{
              background: creditos >= 3 ? 'linear-gradient(135deg,#0e0b1f,#1a1035)' : '#f5f5f5',
              border: creditos >= 3 ? '2px solid #7b5ea7' : '2px solid #e0e0e0',
              borderRadius: 20, padding: '22px 24px',
              cursor: creditos >= 3 ? 'pointer' : 'not-allowed',
              textAlign: 'left', transition: 'all .2s', width: '100%',
              opacity: creditos >= 3 ? 1 : 0.6,
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 12, right: 14, background: 'linear-gradient(135deg,#f857a6,#ffa726)', color: 'white', fontSize: '.68rem', fontWeight: 700, padding: '3px 10px', borderRadius: 50 }}>PREMIUM</div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ fontSize: '2.4rem', flexShrink: 0 }}>💫</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', color: creditos >= 3 ? 'white' : '#3d1f28', fontWeight: 700 }}>Retrospectiva</span>
                  <span style={{ background: 'rgba(248,87,166,.25)', color: '#f857a6', fontSize: '.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: 50, marginLeft: 40 }}>3 créditos</span>
                </div>
                <p style={{ fontSize: '.82rem', color: creditos >= 3 ? 'rgba(255,255,255,.65)' : '#7a4f5a', lineHeight: 1.5, margin: 0 }}>
                  Stories imersivos estilo Spotify Wrapped com céu estrelado, contador ao vivo, fotos e conquistas do casal.
                </p>
              </div>
            </div>
          </button>

          {creditos < 3 && (
            <p style={{ textAlign: 'center', fontSize: '.8rem', color: '#7a4f5a', marginTop: 4 }}>
              Você tem <strong>{creditos}</strong> crédito{creditos !== 1 ? 's' : ''}. A Retrospectiva exige 3.{' '}
              <Link href="/comprar" style={{ color: '#e8627a', fontWeight: 700 }} onClick={onClose}>Comprar mais</Link>
            </p>
          )}
        </div>

        <button onClick={onClose} style={{ width: '100%', marginTop: 20, background: 'none', border: '1.5px solid #e0d0d4', borderRadius: 12, padding: '10px', fontFamily: 'Lato,sans-serif', fontSize: '.88rem', color: '#7a4f5a', cursor: 'pointer' }}>
          Cancelar
        </button>
      </div>
    </div>
  )
}

function ModalCompartilhar({ slug, cor, tipo, onClose }: { slug: string; cor: string; tipo?: string; onClose: () => void }) {
  const base = typeof window !== 'undefined' ? window.location.origin : ''
  const url = tipo === 'retrospectiva' ? `${base}/retrospectiva/${slug}` : `${base}/p/${slug}`
  const [copiado, setCopiado] = useState(false)

  function copiar() {
    navigator.clipboard.writeText(url)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: 24, padding: '40px 32px', maxWidth: 360, width: '100%', textAlign: 'center', boxShadow: '0 24px 64px rgba(0,0,0,.15)' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📱</div>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.4rem', color: '#3d1f28', marginBottom: 8 }}>Compartilhar presente</h3>
        <p style={{ fontSize: '.85rem', color: '#7a4f5a', marginBottom: 24, lineHeight: 1.6 }}>Envie o link ou mostre o QR Code para quem você ama.</p>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20, padding: 12, background: '#fff8f9', borderRadius: 16 }}>
          <QRCode value={url} size={160} fgColor={cor} />
        </div>
        <div style={{ background: '#f5f0f2', borderRadius: 10, padding: '10px 14px', fontSize: '.78rem', color: '#7a4f5a', wordBreak: 'break-all', marginBottom: 20, textAlign: 'left' }}>{url}</div>
        <button onClick={copiar} style={{ width: '100%', background: copiado ? '#4caf50' : `linear-gradient(135deg,${cor},${cor}bb)`, color: 'white', border: 'none', borderRadius: 12, padding: 13, fontFamily: 'Lato,sans-serif', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', marginBottom: 10, transition: 'background .3s' }}>
          {copiado ? '✅ Link copiado!' : '📋 Copiar link'}
        </button>
        <button onClick={onClose} style={{ width: '100%', background: 'none', border: '2px solid #e0d0d4', borderRadius: 12, padding: 11, fontFamily: 'Lato,sans-serif', fontSize: '.9rem', color: '#7a4f5a', cursor: 'pointer' }}>Fechar</button>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [presentes, setPresentes] = useState<Presente[]>([])
  const [loading, setLoading] = useState(true)
  const [compartilhando, setCompartilhando] = useState<Presente | null>(null)
  const [escolhendoTipo, setEscolhendoTipo] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const retro = searchParams.get('retro')
    if (retro === 'criada') setToast('✨ Retrospectiva criada com sucesso!')
    if (retro === 'editada') setToast('💾 Alterações salvas!')
    if (retro) {
      const t = setTimeout(() => setToast(null), 4000)
      return () => clearTimeout(t)
    }
  }, [])

  useEffect(() => {
    async function carregar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(prof)
      const { data: pres } = await supabase.from('presentes').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      setPresentes(pres ?? [])
      setLoading(false)
    }
    carregar()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  async function handleDeletar(id: string) {
    if (!confirm('Tem certeza que deseja excluir este presente?')) return
    await supabase.from('presentes').delete().eq('id', id)
    setPresentes(prev => prev.filter(p => p.id !== id))
  }

  function handleNovo() {
    const creditos = profile?.creditos ?? 0
    if (creditos === 0) { router.push('/comprar'); return }
    setEscolhendoTipo(true)
  }

  if (loading) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lato:wght@400;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Lato',sans-serif;background:#fff8f9}
        .loading{min-height:100vh;display:flex;align-items:center;justify-content:center;font-size:1.5rem;color:#e8627a}
      `}</style>
      <div className="loading">Carregando… 💝</div>
    </>
  )

  const nomeExibido = profile?.nome?.split(' ')[0] ?? 'você'

  return (
    <>
      {escolhendoTipo && (
        <ModalEscolherTipo creditos={profile?.creditos ?? 0} onClose={() => setEscolhendoTipo(false)} />
      )}
      {compartilhando && (
        <ModalCompartilhar
          slug={compartilhando.slug}
          cor={compartilhando.cor_primaria ?? '#e8627a'}
          tipo={(compartilhando as any).tipo}
          onClose={() => setCompartilhando(null)}
        />
      )}
      {/* Toast de feedback */}
      {toast && (
        <div style={{ position:'fixed', bottom:28, left:'50%', transform:'translateX(-50%)', zIndex:2000, background:'#1a1a2e', color:'white', borderRadius:50, padding:'.75rem 1.5rem', fontSize:'.88rem', fontWeight:500, boxShadow:'0 8px 32px rgba(0,0,0,.25)', whiteSpace:'nowrap', animation:'fadeInUp .3s ease' }}>
          {toast}
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Lato:wght@300;400;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--rose:#e8627a;--rose-light:#f9a8b8;--rose-pale:#fdf0f3;--rose-mid:#fce4ea;--cream:#fff8f9;--text:#3d1f28;--text-soft:#7a4f5a}
        body{font-family:'Lato',sans-serif;background:var(--cream);color:var(--text)}
        .navbar{background:white;border-bottom:1px solid var(--rose-mid);padding:0 48px;height:64px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50}
        .navbar-logo{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:700;color:var(--rose);text-decoration:none}
        .navbar-right{display:flex;align-items:center;gap:16px}
        .navbar-user{font-size:.85rem;color:var(--text-soft)}
        .btn-logout{background:none;border:1px solid var(--rose-mid);border-radius:8px;padding:6px 14px;font-size:.82rem;color:var(--text-soft);cursor:pointer;transition:all .2s}
        .btn-logout:hover{border-color:var(--rose);color:var(--rose)}
        .page{max-width:1100px;margin:0 auto;padding:48px 24px}
        .page-header{margin-bottom:40px}
        .page-header h1{font-family:'Playfair Display',serif;font-size:2rem;color:var(--text);margin-bottom:6px}
        .page-header h1 em{font-style:italic;color:var(--rose)}
        .page-header p{color:var(--text-soft);font-size:.95rem}
        .credits-row{display:flex;gap:20px;margin-bottom:40px;flex-wrap:wrap}
        .credit-card{background:white;border-radius:20px;border:1px solid var(--rose-mid);padding:24px 28px;display:flex;align-items:center;gap:16px;flex:1;min-width:220px;box-shadow:0 2px 12px rgba(232,98,122,.06)}
        .credit-card.highlight{background:linear-gradient(135deg,var(--rose),#c94f68);border-color:transparent;color:white}
        .credit-icon{font-size:2rem}
        .credit-info .num{font-family:'Playfair Display',serif;font-size:2.2rem;font-weight:700;line-height:1;color:var(--rose)}
        .credit-card.highlight .credit-info .num{color:white}
        .credit-info .label{font-size:.82rem;color:var(--text-soft);margin-top:2px}
        .credit-card.highlight .credit-info .label{color:rgba(255,255,255,.8)}
        .btn-comprar{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,var(--rose),#c94f68);color:white;padding:12px 24px;border-radius:12px;font-weight:700;font-size:.9rem;text-decoration:none;box-shadow:0 4px 16px rgba(232,98,122,.3);transition:opacity .2s,transform .2s;white-space:nowrap}
        .btn-comprar.outline{background:transparent;color:white;border:2px solid rgba(255,255,255,.5);box-shadow:none}
        .btn-comprar.outline:hover{background:rgba(255,255,255,.1)}
        .section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:12px}
        .section-header h2{font-family:'Playfair Display',serif;font-size:1.4rem;color:var(--text)}
        .btn-novo{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,var(--rose),#c94f68);color:white;padding:10px 22px;border-radius:12px;font-weight:700;font-size:.9rem;border:none;cursor:pointer;box-shadow:0 4px 16px rgba(232,98,122,.3);transition:opacity .2s,transform .2s}
        .btn-novo:hover{opacity:.9;transform:translateY(-1px)}
        .empty{background:white;border-radius:20px;border:2px dashed var(--rose-mid);padding:64px 40px;text-align:center}
        .empty-icon{font-size:3rem;margin-bottom:16px}
        .empty h3{font-family:'Playfair Display',serif;font-size:1.3rem;color:var(--text);margin-bottom:8px}
        .empty p{color:var(--text-soft);font-size:.9rem;margin-bottom:24px}
        .presentes-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px}
        .presente-card{background:white;border-radius:20px;border:1px solid var(--rose-mid);overflow:hidden;box-shadow:0 2px 12px rgba(232,98,122,.06);transition:transform .2s,box-shadow .2s}
        .presente-card:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(232,98,122,.12)}
        .presente-card-top{padding:20px 20px 16px;border-bottom:1px solid var(--rose-pale)}
        .presente-card-emoji{font-size:1.8rem;margin-bottom:8px}
        .presente-card-titulo{font-family:'Playfair Display',serif;font-size:1.1rem;color:var(--text);margin-bottom:4px}
        .presente-card-data{font-size:.78rem;color:var(--text-soft)}
        .presente-card-stats{display:flex;gap:16px;padding:12px 20px;border-bottom:1px solid var(--rose-pale);flex-wrap:wrap}
        .stat{font-size:.8rem;color:var(--text-soft);display:flex;align-items:center;gap:4px}
        .stat strong{color:var(--text)}
        .presente-card-actions{display:flex;gap:0;padding:0}
        .card-btn{flex:1;padding:12px 8px;background:none;border:none;font-size:.82rem;font-weight:700;cursor:pointer;transition:background .2s;display:flex;align-items:center;justify-content:center;gap:5px;text-decoration:none}
        .card-btn:hover{background:var(--rose-pale)}
        .card-btn.ver{color:var(--rose)}
        .card-btn.compartilhar{color:#7b5ea7}
        .card-btn.compartilhar:hover{background:#f5eeff}
        .card-btn.editar{color:var(--text-soft);border-left:1px solid var(--rose-pale);border-right:1px solid var(--rose-pale)}
        .card-btn.deletar{color:#e05555}
        .card-btn.deletar:hover{background:#fff0f0}
        .badge{display:inline-block;padding:2px 10px;border-radius:50px;font-size:.72rem;font-weight:700;margin-left:8px}
        .badge.ativo{background:#e8f5e9;color:#388e3c}
        .badge.inativo{background:#fce4ea;color:var(--rose)}
        .tipo-badge{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:50px;font-size:.68rem;font-weight:700;margin-left:6px}
        .tipo-badge.retro{background:linear-gradient(135deg,#f857a6,#ffa726);color:white}
        .tipo-badge.pagina{background:#fce4ea;color:var(--rose)}
        @media(max-width:640px){.navbar{padding:0 16px}.page{padding:24px 16px}.credits-row{flex-direction:column}}
      `}</style>

      <nav className="navbar">
        <Link href="/" className="navbar-logo">Presentim</Link>
        <div className="navbar-right">
          <span className="navbar-user">Olá, {nomeExibido} 👋</span>
          <button className="btn-logout" onClick={handleLogout}>Sair</button>
        </div>
      </nav>

      <div className="page">
        <div className="page-header">
          <h1>Meus <em>presentes</em></h1>
          <p>Gerencie e acompanhe todos os presentes que você criou.</p>
        </div>

        <div className="credits-row">
          <div className="credit-card">
            <span className="credit-icon">🎁</span>
            <div className="credit-info">
              <div className="num">{profile?.creditos ?? 0}</div>
              <div className="label">créditos disponíveis</div>
            </div>
          </div>
          <div className="credit-card">
            <span className="credit-icon">📦</span>
            <div className="credit-info">
              <div className="num">{presentes.length}</div>
              <div className="label">presentes criados</div>
            </div>
          </div>
          <div className="credit-card">
            <span className="credit-icon">👀</span>
            <div className="credit-info">
              <div className="num">{presentes.reduce((acc, p) => acc + (p.visualizacoes ?? 0), 0)}</div>
              <div className="label">visualizações totais</div>
            </div>
          </div>
          <div className="credit-card highlight">
            <span className="credit-icon">✨</span>
            <div className="credit-info">
              <div className="label" style={{ fontSize: '.95rem', fontWeight: 700, marginBottom: 8 }}>Precisa de mais créditos?</div>
              <Link href="/comprar" className="btn-comprar outline">Ver planos</Link>
            </div>
          </div>
        </div>

        <div className="section-header">
          <h2>Seus presentes</h2>
          <button className="btn-novo" onClick={handleNovo}>+ Criar presente</button>
        </div>

        {presentes.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🎁</div>
            <h3>Nenhum presente ainda</h3>
            <p>Crie seu primeiro presente e surpreenda quem você ama!</p>
            <button className="btn-novo" onClick={handleNovo} style={{ display: 'inline-flex' }}>Criar meu primeiro presente</button>
          </div>
        ) : (
          <div className="presentes-grid">
            {presentes.map((p) => {
              const tipo = (p as any).tipo ?? 'pagina'
              const verHref = tipo === 'retrospectiva' ? `/retrospectiva/${p.slug}` : `/p/${p.slug}`
              const editarHref = tipo === 'retrospectiva' ? `/retrospectiva/editar/${p.id}` : `/editar/${p.id}`
              return (
                <div className="presente-card" key={p.id}>
                  <div className="presente-card-top">
                    <div className="presente-card-emoji">{tipo === 'retrospectiva' ? '💫' : (p.emoji ?? '🎁')}</div>
                    <div className="presente-card-titulo">
                      {p.titulo ?? 'Presente sem título'}
                      <span className={`tipo-badge ${tipo === 'retrospectiva' ? 'retro' : 'pagina'}`}>
                        {tipo === 'retrospectiva' ? '💫 Retrospectiva' : '🎁 Página'}
                      </span>
                      <span className={`badge ${p.ativo ? 'ativo' : 'inativo'}`}>
                        {p.ativo ? 'ativo' : 'inativo'}
                      </span>
                    </div>
                    <div className="presente-card-data">Criado em {formatarData(p.created_at)}</div>
                  </div>
                  <div className="presente-card-stats">
                    <span className="stat">👀 <strong>{p.visualizacoes}</strong> views</span>
                    <span className="stat">🔗 {tipo === 'retrospectiva' ? `/retrospectiva/${p.slug}` : `/p/${p.slug}`}</span>
                  </div>
                  <div className="presente-card-actions">
                    <Link href={verHref} className="card-btn ver" target="_blank">👁 Ver</Link>
                    <button className="card-btn compartilhar" onClick={() => setCompartilhando(p)}>📱 Compartilhar</button>
                    <Link href={editarHref} className="card-btn editar">✏️ Editar</Link>
                    <button className="card-btn deletar" onClick={() => handleDeletar(p.id)}>🗑 Excluir</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}