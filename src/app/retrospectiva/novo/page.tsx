'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { gerarSlug } from '@/lib/utils'

// ─── Raridades ────────────────────────────────────────────────────────────────
export type Rarity = 'comum' | 'incomum' | 'raro' | 'epico' | 'lendario'

export const RARITY_CONFIG: Record<Rarity, { label: string; color: string; glow: string; icon: string }> = {
  comum:    { label: 'Comum',    icon: '⚪', color: 'rgba(180,180,180,.8)',  glow: 'rgba(180,180,180,.15)' },
  incomum:  { label: 'Incomum',  icon: '🔵', color: 'rgba(80,160,255,.9)',   glow: 'rgba(80,160,255,.2)'  },
  raro:     { label: 'Raro',     icon: '🟣', color: 'rgba(180,80,255,.95)',  glow: 'rgba(180,80,255,.25)' },
  epico:    { label: 'Épico',    icon: '🟡', color: 'rgba(255,200,50,.95)',  glow: 'rgba(255,200,50,.3)'  },
  lendario: { label: 'Lendário', icon: '👑', color: 'rgba(248,87,166,1)',    glow: 'rgba(248,87,166,.4)'  },
}

// ─── Conquistas por categoria ─────────────────────────────────────────────────
export const CATEGORIAS = [
  {
    key: 'primeiros', label: '💬 Primeiros Passos',
    items: [
      { key: 'primeira_msg',      icon: '🟢', label: 'Primeira Mensagem',       rarity: 'comum'    as Rarity },
      { key: 'primeira_risada',   icon: '😄', label: 'Primeira Risada',          rarity: 'comum'    as Rarity },
      { key: 'primeiro_flert',    icon: '😏', label: 'Primeiro Flert',           rarity: 'comum'    as Rarity },
      { key: 'madrugada',         icon: '🌙', label: 'Conversa Madrugada',       rarity: 'comum'    as Rarity },
      { key: 'bom_dia',           icon: '☀️', label: 'Primeiro "Bom dia"',       rarity: 'comum'    as Rarity },
      { key: 'audio_gigante',     icon: '🎤', label: 'Áudio Gigante',            rarity: 'comum'    as Rarity },
    ]
  },
  {
    key: 'inicio', label: '❤️ Início',
    items: [
      { key: 'primeiro_encontro', icon: '🟡', label: 'Primeiro Encontro',        rarity: 'comum'    as Rarity },
      { key: 'primeiro_abraco',   icon: '🤗', label: 'Primeiro Abraço',          rarity: 'comum'    as Rarity },
      { key: 'primeiro_beijo',    icon: '💋', label: 'Primeiro Beijo',           rarity: 'incomum'  as Rarity },
      { key: 'primeira_foto',     icon: '📸', label: 'Primeira Foto Juntos',     rarity: 'comum'    as Rarity },
      { key: 'selfie_casal',      icon: '🤳', label: 'Selfie de Casal',          rarity: 'comum'    as Rarity },
      { key: 'eu_gosto',          icon: '💌', label: '"Eu gosto de você"',       rarity: 'incomum'  as Rarity },
    ]
  },
  {
    key: 'experiencias', label: '🍿 Experiências',
    items: [
      { key: 'cinema',            icon: '🎬', label: 'Cinema Juntos',            rarity: 'comum'    as Rarity },
      { key: 'jantar',            icon: '🍕', label: 'Jantar Juntos',            rarity: 'comum'    as Rarity },
      { key: 'delivery',          icon: '🍔', label: 'Delivery Juntos',          rarity: 'comum'    as Rarity },
      { key: 'cafe',              icon: '☕', label: 'Café Juntos',              rarity: 'comum'    as Rarity },
      { key: 'sorvete',           icon: '🍨', label: 'Sorvete Compartilhado',    rarity: 'incomum'  as Rarity },
      { key: 'role_aleatorio',    icon: '📷', label: 'Rolê Aleatório',           rarity: 'incomum'  as Rarity },
    ]
  },
  {
    key: 'aventuras', label: '✈️ Aventuras',
    items: [
      { key: 'viagem',            icon: '🚗', label: 'Primeira Viagem',          rarity: 'raro'     as Rarity },
      { key: 'praia',             icon: '🏖️', label: 'Praia Juntos',             rarity: 'raro'     as Rarity },
      { key: 'hotel',             icon: '🏨', label: 'Primeiro Hotel',           rarity: 'raro'     as Rarity },
      { key: 'sem_planejamento',  icon: '🧭', label: 'Aventura Sem Plano',       rarity: 'incomum'  as Rarity },
      { key: 'por_do_sol',        icon: '🌄', label: 'Pôr do Sol Juntos',        rarity: 'incomum'  as Rarity },
      { key: 'lugar_novo',        icon: '🗺️', label: 'Lugar Novo',               rarity: 'incomum'  as Rarity },
    ]
  },
  {
    key: 'vida', label: '🏡 Vida de Casal',
    items: [
      { key: 'mercado',           icon: '🛒', label: 'Mercado Juntos',           rarity: 'raro'     as Rarity },
      { key: 'cozinhar',          icon: '🍳', label: 'Cozinharam Juntos',        rarity: 'raro'     as Rarity },
      { key: 'dia_inteiro',       icon: '🛋️', label: 'Dia Inteiro Juntos',       rarity: 'raro'     as Rarity },
      { key: 'tarefa_dom',        icon: '🧺', label: 'Tarefa Doméstica',         rarity: 'raro'     as Rarity },
      { key: 'noite_juntos',      icon: '🛏️', label: 'Primeira Noite',           rarity: 'raro'     as Rarity },
      { key: 'pet',               icon: '🐶', label: 'Pet Juntos',               rarity: 'raro'     as Rarity },
    ]
  },
  {
    key: 'marcantes', label: '💞 Marcantes',
    items: [
      { key: 'primeiro_choro',    icon: '😭', label: 'Primeiro Choro',           rarity: 'raro'     as Rarity },
      { key: 'reconciliacao',     icon: '🤝', label: 'Reconciliação',            rarity: 'raro'     as Rarity },
      { key: 'carta_romantica',   icon: '💌', label: 'Carta Romântica',          rarity: 'incomum'  as Rarity },
      { key: 'print_chat',        icon: '📱', label: 'Print do Chat',            rarity: 'incomum'  as Rarity },
      { key: 'ligacao_longa',     icon: '📞', label: 'Ligação Longa',            rarity: 'incomum'  as Rarity },
      { key: 'familia',           icon: '👨‍👩‍👧', label: 'Conheceu Família',         rarity: 'raro'     as Rarity },
    ]
  },
  {
    key: 'divertidas', label: '🎉 Divertidas',
    items: [
      { key: 'briga_comida',      icon: '🍕', label: 'Briga por Comida',         rarity: 'comum'    as Rarity },
      { key: 'maratona_serie',    icon: '📺', label: 'Maratona de Série',        rarity: 'incomum'  as Rarity },
      { key: 'dormiu_filme',      icon: '😴', label: 'Dormiu no Filme',          rarity: 'comum'    as Rarity },
      { key: 'foto_engracada',    icon: '📸', label: 'Foto Engraçada',           rarity: 'comum'    as Rarity },
      { key: 'apelido',           icon: '🧸', label: 'Apelido Fofo',             rarity: 'comum'    as Rarity },
      { key: 'planta',            icon: '🌱', label: 'Primeira Planta',          rarity: 'incomum'  as Rarity },
    ]
  },
  {
    key: 'lendarias', label: '👑 Lendárias',
    items: [
      { key: 'noivado',           icon: '💍', label: 'Noivado',                  rarity: 'epico'    as Rarity },
      { key: 'morar_juntos',      icon: '🏡', label: 'Morar Juntos',             rarity: 'epico'    as Rarity },
      { key: 'adotar_pet',        icon: '🐕', label: 'Adotar Pet',               rarity: 'epico'    as Rarity },
      { key: 'primeiro_filho',    icon: '👶', label: 'Primeiro Filho',           rarity: 'lendario' as Rarity },
      { key: 'construir_vida',    icon: '❤️', label: 'Construir uma Vida',       rarity: 'lendario' as Rarity },
      { key: 'aniversario_surp',  icon: '🎂', label: 'Aniversário Surpresa',     rarity: 'epico'    as Rarity },
    ]
  },
]

// Mapa flat key → { icon, label, rarity }
export const ALL_ACHIEVEMENTS: Record<string, { icon: string; label: string; rarity: Rarity }> = {}
CATEGORIAS.forEach(cat => cat.items.forEach(item => {
  ALL_ACHIEVEMENTS[item.key] = { icon: item.icon, label: item.label, rarity: item.rarity }
}))
// compat formato antigo
const COMPAT: Record<string, { icon: string; label: string; rarity: Rarity }> = {
  beijo:       { icon: '💋', label: 'Primeiro Beijo',      rarity: 'incomum' },
  casa:        { icon: '🏠', label: 'Moraram Juntos',      rarity: 'epico'   },
  anos1:       { icon: '🎉', label: '1 Ano Juntos',        rarity: 'raro'    },
  aniversario: { icon: '🎂', label: 'Aniversário Surpresa',rarity: 'epico'   },
}
Object.assign(ALL_ACHIEVEMENTS, COMPAT)

const CUSTO_CREDITOS = 2

export type ConquistaItem = { key: string; fotoIdx?: number }  // fotoIdx = índice em fotos[]

export default function RetrospectivaNovoPage() {
  const router = useRouter()
  const supabase = createClient()

  const [creditos, setCreditos]   = useState(0)
  const [loading, setLoading]     = useState(true)
  const [salvando, setSalvando]   = useState(false)
  const [erros, setErros]         = useState<Record<string, string>>({})

  const [nome1, setNome1]         = useState('')
  const [nome2, setNome2]         = useState('')
  const [dataInicio, setDataInicio] = useState('')
  const [cidade, setCidade]       = useState('')
  const [mensagem, setMensagem]   = useState('')
  const [conquistas, setConquistas] = useState<ConquistaItem[]>([])
  const [abaAtiva, setAbaAtiva]   = useState('primeiros')
  const [uploadando, setUploadando] = useState<number | null>(null)
  // Seletor de foto para conquista
  const [seletorAberto, setSeletorAberto] = useState<string | null>(null)

  const [fotos, setFotos] = useState<(string | null)[]>(Array(6).fill(null))
  const fotosPreenchidas = fotos.filter(Boolean) as string[]

  // Música
  const [musicaLink, setMusicaLink] = useState('')
  const [musicaInfo, setMusicaInfo] = useState<{ videoId: string; title: string; thumb: string } | null>(null)
  const [musicaErro, setMusicaErro] = useState('')

  useEffect(() => {
    async function verificar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: prof } = await supabase.from('profiles').select('creditos').eq('id', user.id).single()
      if ((prof?.creditos ?? 0) < CUSTO_CREDITOS) { router.push('/comprar'); return }
      setCreditos(prof?.creditos ?? 0)
      setLoading(false)
    }
    verificar()
  }, [])

  function toggleConquista(key: string) {
    setConquistas(prev => {
      const exists = prev.find(c => c.key === key)
      if (exists) return prev.filter(c => c.key !== key)
      return [...prev, { key }]
    })
  }

  function isSelected(key: string) { return conquistas.some(c => c.key === key) }
  function getFotoIdx(key: string) { return conquistas.find(c => c.key === key)?.fotoIdx }

  function setFotoConquista(key: string, fotoIdx: number | undefined) {
    setConquistas(prev => prev.map(c => c.key === key ? { ...c, fotoIdx } : c))
    setSeletorAberto(null)
  }

  function extrairVideoId(url: string): string | null {
    try {
      const u = new URL(url)
      // youtu.be/ID
      if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('?')[0]
      // youtube.com/watch?v=ID
      if (u.hostname.includes('youtube.com')) {
        const v = u.searchParams.get('v')
        if (v) return v
        // youtube.com/shorts/ID
        const shorts = u.pathname.match(/\/shorts\/([^/?]+)/)
        if (shorts) return shorts[1]
      }
    } catch {}
    return null
  }

  async function handleMusicaLink(url: string) {
    setMusicaLink(url)
    setMusicaErro('')
    setMusicaInfo(null)
    if (!url.trim()) return
    const videoId = extrairVideoId(url.trim())
    if (!videoId) { setMusicaErro('Link inválido. Cole um link do YouTube válido.'); return }
    // Usa oEmbed do YouTube — sem API key necessária
    try {
      const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setMusicaInfo({ videoId, title: data.title, thumb: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` })
    } catch {
      setMusicaErro('Não foi possível carregar as informações do vídeo. Verifique o link.')
    }
  }

  async function handleFotoGeral(e: React.ChangeEvent<HTMLInputElement>, idx: number) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadando(idx)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const ext = file.name.split('.').pop()
      const path = `${user!.id}/retro-${Date.now()}-${idx}.${ext}`
      const { error } = await supabase.storage.from('fotos').upload(path, file, { upsert: true })
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from('fotos').getPublicUrl(path)
      setFotos(prev => { const n = [...prev]; n[idx] = publicUrl; return n })
    } catch (err) { console.error(err) }
    finally { setUploadando(null) }
  }

  async function handleSalvar() {
    const novosErros: Record<string, string> = {}
    if (!nome1.trim()) novosErros.nome1 = 'Obrigatório'
    if (!nome2.trim()) novosErros.nome2 = 'Obrigatório'
    if (!dataInicio) novosErros.dataInicio = 'Obrigatório'
    if (!mensagem.trim()) novosErros.mensagem = 'Escreva uma mensagem'
    if (Object.keys(novosErros).length > 0) { setErros(novosErros); return }
    setErros({})
    setSalvando(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const slug = gerarSlug()
      // Resolve fotoUrl real a partir do índice
      const conquistasComFoto = conquistas.map(c => ({
        key: c.key,
        fotoUrl: c.fotoIdx !== undefined ? (fotos[c.fotoIdx] ?? undefined) : undefined,
      }))
      const dadosRetro = {
        nome1: nome1.trim(), nome2: nome2.trim(),
        data_inicio: dataInicio,
        cidade: cidade.trim() || 'São Paulo',
        mensagem: mensagem.trim(),
        conquistas: conquistasComFoto,
        fotos: fotos.filter(Boolean),
        musica: musicaInfo ? { videoId: musicaInfo.videoId, title: musicaInfo.title } : null,
      }
      const { error } = await supabase.from('presentes').insert({
        user_id: user!.id, slug, tipo: 'retrospectiva',
        titulo: `${nome1} & ${nome2}`, emoji: '💫',
        ativo: true, visualizacoes: 0, cor_primaria: '#f857a6',
        dados_retro: dadosRetro,
      })
      if (error) throw error
      const { data: prof } = await supabase.from('profiles').select('creditos').eq('id', user!.id).single()
      await supabase.from('profiles').update({ creditos: (prof?.creditos ?? CUSTO_CREDITOS) - CUSTO_CREDITOS }).eq('id', user!.id)
      router.push('/dashboard?retro=criada')
    } catch (err) { console.error(err); alert('Erro ao salvar. Tente novamente.') }
    finally { setSalvando(false) }
  }

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#06050f', color:'#f857a6', fontSize:'1.4rem' }}>
      Carregando… ✨
    </div>
  )

  const catAtiva = CATEGORIAS.find(c => c.key === abaAtiva)!

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'DM Sans',sans-serif;background:#06050f;color:white;min-height:100vh}
        .navbar{background:rgba(255,255,255,.04);border-bottom:1px solid rgba(255,255,255,.08);padding:0 48px;height:64px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;backdrop-filter:blur(12px)}
        .navbar-logo{font-family:'DM Serif Display',serif;font-size:1.4rem;color:#f857a6;text-decoration:none}
        .page{max-width:680px;margin:0 auto;padding:48px 24px 80px}
        .header{text-align:center;margin-bottom:48px}
        .header-logo{font-size:3rem;margin-bottom:12px}
        .header h1{font-family:'DM Serif Display',serif;font-size:2.2rem;margin-bottom:8px}
        .header h1 em{font-style:italic;background:linear-gradient(135deg,#f857a6,#ffa726);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .header p{font-size:.88rem;color:rgba(255,255,255,.4);font-weight:300}
        .creditos-aviso{display:flex;align-items:center;gap:10px;background:rgba(248,87,166,.1);border:1px solid rgba(248,87,166,.25);border-radius:14px;padding:14px 18px;margin-bottom:36px;font-size:.85rem;color:rgba(255,255,255,.7)}
        .section{margin-bottom:36px}
        .section-label{font-size:.6rem;letter-spacing:.25em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:14px;display:flex;align-items:center;gap:10px}
        .section-label::after{content:'';flex:1;height:1px;background:rgba(255,255,255,.07)}
        .row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .field{margin-bottom:14px}
        .field label{display:block;font-size:.65rem;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:6px}
        .field input,.field textarea{width:100%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:.8rem 1rem;color:white;font-family:'DM Sans',sans-serif;font-size:.92rem;outline:none;transition:border-color .2s;resize:none}
        .field input:focus,.field textarea:focus{border-color:rgba(248,87,166,.5)}
        .field input::placeholder,.field textarea::placeholder{color:rgba(255,255,255,.18)}
        .field .err{font-size:.72rem;color:#f857a6;margin-top:4px}
        /* foto grid */
        .photo-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
        .photo-slot{aspect-ratio:1;border-radius:12px;border:1.5px dashed rgba(255,255,255,.15);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;overflow:hidden;position:relative;background:rgba(255,255,255,.03);transition:all .2s}
        .photo-slot:hover{border-color:rgba(248,87,166,.4);background:rgba(248,87,166,.05)}
        .photo-slot img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        .photo-slot .slot-icon{font-size:1.4rem;opacity:.3;margin-bottom:4px}
        .photo-slot .slot-text{font-size:.6rem;color:rgba(255,255,255,.2)}
        .photo-slot .remove-btn{position:absolute;top:4px;right:4px;width:20px;height:20px;background:rgba(0,0,0,.7);border-radius:50%;border:none;color:white;font-size:.7rem;cursor:pointer;display:none;align-items:center;justify-content:center;z-index:2}
        .photo-slot:hover .remove-btn{display:flex}
        .photo-slot .num-badge{position:absolute;bottom:4px;left:4px;background:rgba(0,0,0,.6);border-radius:6px;font-size:.6rem;color:rgba(255,255,255,.6);padding:1px 5px}
        /* abas */
        .abas-wrap{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px}
        .aba-btn{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:50px;padding:.35rem .85rem;font-size:.72rem;color:rgba(255,255,255,.45);cursor:pointer;transition:all .2s;white-space:nowrap}
        .aba-btn.on{background:rgba(248,87,166,.18);border-color:rgba(248,87,166,.45);color:white}
        /* conquistas grid */
        .ach-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
        .ach-item{border-radius:12px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);transition:all .2s;cursor:pointer}
        .ach-item.on{border-color:rgba(248,87,166,.35);background:rgba(248,87,166,.08)}
        .ach-header{display:flex;align-items:center;gap:8px;padding:.6rem .8rem}
        .ach-icon{font-size:1.1rem;flex-shrink:0}
        .ach-label{font-size:.75rem;color:rgba(255,255,255,.55);line-height:1.3;flex:1}
        .ach-item.on .ach-label{color:white}
        .ach-rarity{font-size:.55rem;padding:.15rem .4rem;border-radius:50px;font-weight:600;letter-spacing:.05em;flex-shrink:0}
        .ach-check{font-size:.8rem;opacity:0;transition:opacity .2s;flex-shrink:0}
        .ach-item.on .ach-check{opacity:1}
        /* seletor de foto — inline, sem position absolute */
        .ach-foto-area{display:none;padding:0 .8rem .8rem}
        .ach-item.on .ach-foto-area{display:block}
        .foto-sel-btn{width:100%;background:rgba(255,255,255,.05);border:1.5px dashed rgba(248,87,166,.3);border-radius:10px;padding:.5rem;display:flex;align-items:center;gap:.5rem;cursor:pointer;transition:all .2s}
        .foto-sel-btn:hover{background:rgba(248,87,166,.08);border-color:rgba(248,87,166,.5)}
        .foto-sel-preview{width:36px;height:36px;border-radius:7px;object-fit:cover;flex-shrink:0}
        .foto-sel-text{font-size:.68rem;color:rgba(248,87,166,.7);flex:1}
        .foto-sel-clear{background:rgba(0,0,0,.5);border:none;border-radius:50%;width:18px;height:18px;font-size:.6rem;color:white;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        /* painel inline de seleção */
        .foto-inline{margin-top:6px;background:#120d1e;border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:8px;display:flex;gap:6px;flex-wrap:wrap}
        .foto-dd-item{width:48px;height:48px;border-radius:8px;overflow:hidden;cursor:pointer;border:2px solid transparent;transition:all .2s;flex-shrink:0;position:relative}
        .foto-dd-item:hover{border-color:#f857a6;transform:scale(1.06)}
        .foto-dd-item.sel{border-color:#f857a6;box-shadow:0 0 0 2px rgba(248,87,166,.35)}
        .foto-dd-item img{width:100%;height:100%;object-fit:cover;display:block}
        .foto-dd-none{font-size:.7rem;color:rgba(255,255,255,.3);padding:.3rem;width:100%}
        /* Música */
        .musica-preview{display:flex;align-items:center;gap:12px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:10px 12px;margin-top:10px}
        .musica-thumb{width:52px;height:52px;border-radius:8px;object-fit:cover;flex-shrink:0}
        .musica-title{font-size:.8rem;color:white;font-weight:500;line-height:1.4;flex:1}
        .musica-yt{font-size:.65rem;color:rgba(255,100,100,.7);margin-top:2px}
        .musica-clear{background:rgba(255,255,255,.1);border:none;border-radius:50%;width:24px;height:24px;color:rgba(255,255,255,.6);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:.7rem;flex-shrink:0}
        /* btn salvar */
        .btn-salvar{width:100%;background:linear-gradient(135deg,#f857a6,#ff5858 60%,#ffa726);border:none;border-radius:50px;color:white;font-family:'DM Sans',sans-serif;font-size:1rem;font-weight:600;padding:1.1rem;cursor:pointer;box-shadow:0 8px 35px rgba(248,87,166,.35);transition:all .3s;margin-top:8px}
        .btn-salvar:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 14px 45px rgba(248,87,166,.5)}
        .btn-salvar:disabled{opacity:.6;cursor:not-allowed}
        @media(max-width:640px){.navbar{padding:0 16px}.row{grid-template-columns:1fr}.page{padding:32px 16px 60px}}
      `}</style>

      <nav className="navbar">
        <Link href="/dashboard" className="navbar-logo">← Presentim</Link>
        <span style={{ fontSize:'.82rem', color:'rgba(255,255,255,.4)' }}>{creditos} crédito{creditos!==1?'s':''}</span>
      </nav>

      <div className="page">
        <div className="header">
          <div className="header-logo">💫</div>
          <h1>Nossa <em>Retrospectiva</em></h1>
          <p>Preencha os detalhes para criar uma retrospectiva inesquecível</p>
        </div>

        <div className="creditos-aviso">
          <span style={{ fontSize:'1.2rem' }}>💳</span>
          <span>Esta retrospectiva usa <strong>2 créditos</strong>. Você tem <strong>{creditos}</strong>.</span>
        </div>

        {/* Nomes e data */}
        <div className="section">
          <div className="section-label">Sobre vocês</div>
          <div className="row">
            <div className="field">
              <label>Seu nome</label>
              <input value={nome1} onChange={e => setNome1(e.target.value)} placeholder="Ana" />
              {erros.nome1 && <div className="err">{erros.nome1}</div>}
            </div>
            <div className="field">
              <label>Nome do amor</label>
              <input value={nome2} onChange={e => setNome2(e.target.value)} placeholder="Pedro" />
              {erros.nome2 && <div className="err">{erros.nome2}</div>}
            </div>
          </div>
          <div className="field">
            <label>Data que começaram juntos</label>
            <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
            {erros.dataInicio && <div className="err">{erros.dataInicio}</div>}
          </div>
          <div className="field">
            <label>Cidade onde estavam</label>
            <input value={cidade} onChange={e => setCidade(e.target.value)} placeholder="São Paulo, Rio, Curitiba…" />
          </div>
        </div>

        {/* Fotos — máx 6 */}
        <div className="section">
          <div className="section-label">Fotos do carrossel (máx. 6)</div>
          <p style={{ fontSize:'.78rem', color:'rgba(255,255,255,.3)', marginBottom:12, lineHeight:1.6 }}>
            Depois você pode vincular cada conquista a uma dessas fotos.
          </p>
          <div className="photo-grid">
            {fotos.map((foto, idx) => (
              <div key={idx} className="photo-slot" onClick={() => { if (!foto && uploadando === null) document.getElementById(`foto-g-${idx}`)?.click() }}>
                {foto ? (
                  <>
                    <img src={foto} alt="" />
                    <span className="num-badge">#{idx+1}</span>
                    <button className="remove-btn" onClick={e => {
                      e.stopPropagation()
                      // limpa fotoIdx de conquistas que apontavam pra este índice
                      setConquistas(prev => prev.map(c => c.fotoIdx === idx ? { ...c, fotoIdx: undefined } : c))
                      setFotos(prev => { const n=[...prev]; n[idx]=null; return n })
                    }}>✕</button>
                  </>
                ) : uploadando === idx ? (
                  <div style={{ fontSize:'1.5rem' }}>⏳</div>
                ) : (
                  <>
                    <div className="slot-icon">📷</div>
                    <div className="slot-text">{idx===0 ? 'Adicionar foto' : `Foto ${idx+1}`}</div>
                  </>
                )}
                <input id={`foto-g-${idx}`} type="file" accept="image/*" style={{ display:'none' }} onChange={e => handleFotoGeral(e, idx)} />
              </div>
            ))}
          </div>
        </div>

        {/* Mensagem */}
        <div className="section">
          <div className="section-label">Mensagem especial</div>
          <div className="field">
            <label>Escreva do coração</label>
            <textarea value={mensagem} onChange={e => setMensagem(e.target.value)} rows={4} placeholder="Você é a melhor coisa que já aconteceu na minha vida…" />
            {erros.mensagem && <div className="err">{erros.mensagem}</div>}
          </div>
        </div>

        {/* Música */}
        <div className="section">
          <div className="section-label">🎵 Música de fundo <span style={{ fontSize:'.65rem', color:'rgba(255,255,255,.25)', fontWeight:400 }}>(opcional)</span></div>
          <p style={{ fontSize:'.78rem', color:'rgba(255,255,255,.3)', marginBottom:12, lineHeight:1.6 }}>
            Cole um link do YouTube. A música vai tocar em background durante a retrospectiva.
          </p>
          <div className="field">
            <label>Link do YouTube</label>
            <input
              value={musicaLink}
              onChange={e => handleMusicaLink(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              style={{ fontFamily: 'monospace', fontSize: '.8rem' }}
            />
            {musicaErro && <div className="err">{musicaErro}</div>}
          </div>
          {musicaInfo && (
            <div className="musica-preview">
              <img className="musica-thumb" src={musicaInfo.thumb} alt="" />
              <div style={{ flex:1 }}>
                <div className="musica-title">{musicaInfo.title}</div>
                <div className="musica-yt">▶ YouTube · vai tocar na retrospectiva</div>
              </div>
              <button className="musica-clear" onClick={() => { setMusicaInfo(null); setMusicaLink('') }}>✕</button>
            </div>
          )}
        </div>

        {/* Conquistas */}
        <div className="section">
          <div className="section-label">Conquistas do casal</div>
          <p style={{ fontSize:'.78rem', color:'rgba(255,255,255,.3)', marginBottom:16, lineHeight:1.6 }}>
            Selecione as conquistas de vocês. Se quiser, vincule uma das fotos acima a cada conquista — ela aparece no carrossel com um badge especial.
          </p>

          <div className="abas-wrap">
            {CATEGORIAS.map(cat => (
              <button key={cat.key} className={`aba-btn ${abaAtiva===cat.key?'on':''}`} onClick={() => setAbaAtiva(cat.key)}>
                {cat.label}
              </button>
            ))}
          </div>

          <div className="ach-grid">
            {catAtiva.items.map(item => {
              const selected = isSelected(item.key)
              const fotoIdx = getFotoIdx(item.key)
              const fotoUrl = fotoIdx !== undefined ? fotos[fotoIdx] : undefined
              const rc = RARITY_CONFIG[item.rarity]
              return (
                <div key={item.key} className={`ach-item ${selected?'on':''}`}>
                  <div className="ach-header" onClick={() => toggleConquista(item.key)}>
                    <span className="ach-icon">{item.icon}</span>
                    <span className="ach-label">{item.label}</span>
                    <span className="ach-rarity" style={{ background: rc.glow, color: rc.color, border:`1px solid ${rc.color}` }}>{rc.icon}</span>
                    <span className="ach-check">✓</span>
                  </div>

                  {selected && (
                    <div className="ach-foto-area" onClick={e => e.stopPropagation()}>
                      {/* Botão toggle */}
                      <div className="foto-sel-btn" onClick={() => setSeletorAberto(seletorAberto===item.key ? null : item.key)}>
                        {fotoUrl
                          ? <img className="foto-sel-preview" src={fotoUrl} alt="" />
                          : <span style={{ fontSize:'1rem' }}>📷</span>
                        }
                        <span className="foto-sel-text">
                          {fotoUrl ? `Foto #${(fotoIdx!)+1} vinculada` : 'Vincular uma foto'}
                        </span>
                        {fotoUrl
                          ? <button className="foto-sel-clear" onClick={e => { e.stopPropagation(); setFotoConquista(item.key, undefined) }}>✕</button>
                          : <span style={{ fontSize:'.7rem', color:'rgba(255,255,255,.25)' }}>{seletorAberto===item.key?'▲':'▼'}</span>
                        }
                      </div>
                      {/* Painel inline — sem position absolute, não é cortado */}
                      {seletorAberto === item.key && (
                        <div className="foto-inline">
                          {fotosPreenchidas.length === 0
                            ? <span className="foto-dd-none">Adicione fotos acima primeiro</span>
                            : fotos.map((f, i) => f ? (
                              <div key={i} className={`foto-dd-item ${i===fotoIdx?'sel':''}`} onClick={() => setFotoConquista(item.key, i)}>
                                <img src={f} alt={`Foto ${i+1}`} />
                              </div>
                            ) : null)
                          }
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {conquistas.length > 0 && (
            <p style={{ fontSize:'.75rem', color:'rgba(248,87,166,.7)', marginTop:12 }}>
              ✓ {conquistas.length} conquista{conquistas.length!==1?'s':''} selecionada{conquistas.length!==1?'s':''}
              {conquistas.filter(c => c.fotoIdx !== undefined).length > 0 &&
                ` · ${conquistas.filter(c=>c.fotoIdx!==undefined).length} com foto vinculada`}
            </p>
          )}
        </div>

        <button className="btn-salvar" onClick={handleSalvar} disabled={salvando}>
          {salvando ? 'Criando retrospectiva…' : '✨ Criar retrospectiva'}
        </button>
      </div>
    </>
  )
}