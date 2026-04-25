'use client'

import { useState, useEffect, useRef, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ImageCropper from '@/components/ImageCropper'
import { GRADIENTE_PRESETS } from '@/lib/gradientes'
import { FALLING_PRESETS, DEFAULT_FALLING_ANIMATION, type FallingAnimation, type FallingType, type FallingPreset } from '@/lib/falling-animation'
import FallingParticles from '@/components/FallingParticles'

type MusicaInfo = { videoId: string; title: string }

type Config = {
  titulo: string; texto_botao: string; texto_final: string
  frases: string[]; cor_primaria: string; cor_fundo: string
  gradiente: string | null
  emoji: string; data_liberacao: string; fotos: string[]
  musica_url: string; musica_info: MusicaInfo | null; retro_slug: string
  roleta_ativa: boolean; roleta_opcoes: string[]
  termo_ativo: boolean; termo_palavra: string; termo_dica: string
  falling_animation: FallingAnimation
}

const EMOJIS = ['🎁', '💝', '💖', '🌸', '🎂', '🥂', '✨', '🦋', '🌹', '💌', '🎉', '🫶']

function Preview({ cfg }: { cfg: Config }) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t) }, [])
  const diff = cfg.data_liberacao ? new Date(cfg.data_liberacao).getTime() - now : 0
  const passou = diff <= 0
  return (
    <div style={{ background: cfg.gradiente ?? cfg.cor_fundo, borderRadius: 20, width: '100%', aspectRatio: '9/16', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', gap: 16, position: 'relative', overflow: 'hidden' }}>
      {cfg.data_liberacao && !passou ? (
        <div style={{ border: `2px solid ${cfg.cor_primaria}44`, borderRadius: 16, padding: '12px 20px', display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[[String(Math.floor(diff/86400000)),'dias'],[String(Math.floor((diff%86400000)/3600000)).padStart(2,'0'),'h'],[String(Math.floor((diff%3600000)/60000)).padStart(2,'0'),'min'],[String(Math.floor((diff%60000)/1000)).padStart(2,'0'),'s']].map(([n,l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: cfg.cor_primaria, lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: '.65rem', color: '#888' }}>{l}</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ background: cfg.cor_primaria, color: 'white', borderRadius: 8, padding: '12px 24px', fontSize: '1.8rem', boxShadow: `0 8px 24px ${cfg.cor_primaria}55` }}>
          {cfg.emoji} {cfg.texto_botao}
        </div>
      )}
      <div style={{ display: 'flex', gap: 6 }}>
        {cfg.fotos.slice(0, 2).map((url, i) => (
          <img key={i} src={url} alt="" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6, border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,.15)' }} />
        ))}
      </div>
      {cfg.frases.filter(Boolean).slice(0, 3).map((f, i) => (
        <p key={i} style={{ fontFamily: "'Dancing Script',cursive", fontSize: '.75rem', color: '#444', textAlign: 'center', margin: '2px 0' }}>{f}</p>
      ))}
      {cfg.texto_final && (
        <div style={{ background: `linear-gradient(135deg,${cfg.cor_primaria},${cfg.cor_primaria}bb)`, color: 'white', borderRadius: 8, padding: '8px 16px', fontSize: '.8rem', fontWeight: 700, textAlign: 'center' }}>
          {cfg.texto_final}
        </div>
      )}
      <p style={{ position: 'absolute', bottom: 8, fontSize: '.6rem', color: '#aaa' }}>Preview • {cfg.titulo}</p>
    </div>
  )
}

export default function EditarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [cfg, setCfg] = useState<Config | null>(null)
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)
  const [uploadingFoto, setUploadingFoto] = useState(false)
  const [uploadingMusica, setUploadingMusica] = useState(false)
  const [musicaTab, setMusicaTab] = useState(0) // 0=busca 1=link 2=upload
  const [musicaLink, setMusicaLink] = useState('')
  const [musicaErro, setMusicaErro] = useState('')
  const [musicaLoading, setMusicaLoading] = useState(false)
  const [musicaBusca, setMusicaBusca] = useState('')
  const [musicaResultados, setMusicaResultados] = useState<{videoId:string;title:string;channel:string;thumb:string}[]>([])
  const [buscandoMusica, setBuscandoMusica] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const musicInputRef = useRef<HTMLInputElement>(null)

  // Fila de crop — quando há arquivos aqui, o modal ImageCropper é mostrado
  const [cropQueue, setCropQueue] = useState<File[]>([])
  const [cropIndex, setCropIndex] = useState(0)

  // Preview da animação caindo (modal)
  const [showFaPreview, setShowFaPreview] = useState(false)

  // Trava de edição (7 dias)
  const [expirado, setExpirado] = useState(false)
  const [diasRestantes, setDiasRestantes] = useState(7)

  function extrairVideoId(url: string): string | null {
    const m = url.match(/(?:v=|youtu\.be\/|shorts\/)([\w-]{11})/)
    return m ? m[1] : null
  }

  async function handleMusicaYouTube() {
    const videoId = extrairVideoId(musicaLink)
    if (!videoId) { setMusicaErro('Link do YouTube inválido.'); return }
    setMusicaLoading(true); setMusicaErro('')
    try {
      const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      set('musica_info', { videoId, title: data.title })
      set('musica_url', '')
    } catch { setMusicaErro('Não foi possível carregar esse vídeo.') }
    setMusicaLoading(false)
  }

  async function handleBuscaMusica() {
    if (!musicaBusca.trim() || buscandoMusica) return
    setBuscandoMusica(true)
    setMusicaErro('')
    setMusicaResultados([])
    try {
      const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(musicaBusca.trim())}`)
      const data = await res.json()
      if (data.error) { setMusicaErro(data.error); return }
      setMusicaResultados(data.results ?? [])
      if ((data.results ?? []).length === 0) setMusicaErro('Nenhum resultado encontrado.')
    } catch { setMusicaErro('Erro ao buscar. Tente novamente.') }
    finally { setBuscandoMusica(false) }
  }

  function selecionarMusicaBusca(r: {videoId:string;title:string;channel:string;thumb:string}) {
    set('musica_info', { videoId: r.videoId, title: r.title })
    set('musica_url', '')
    setMusicaResultados([])
    setMusicaBusca('')
  }

  useEffect(() => {
    async function carregar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('presentes').select('*').eq('id', id).eq('user_id', user.id).single()
      if (!data) { setNotFound(true); setLoading(false); return }
      let dataLib = ''
      if (data.data_liberacao) dataLib = new Date(data.data_liberacao).toISOString().slice(0, 16)
      setCfg({
        titulo: data.titulo ?? '', texto_botao: data.texto_botao ?? '', texto_final: data.texto_final ?? '',
        frases: Array.isArray(data.frases) && data.frases.length > 0 ? data.frases : [''],
        cor_primaria: data.cor_primaria ?? '#e8627a', cor_fundo: data.cor_fundo ?? '#ffeef0',
        gradiente: data.gradiente ?? null,
        emoji: data.emoji ?? '🎁', data_liberacao: dataLib,
        fotos: Array.isArray(data.fotos) ? data.fotos : [],
        musica_url: data.musica_url ?? '',
        musica_info: data.musica_info ?? null,
        retro_slug: data.retro_slug ?? '',
        roleta_ativa: Array.isArray(data.roleta_opcoes) && data.roleta_opcoes.length > 0,
        roleta_opcoes: Array.isArray(data.roleta_opcoes) && data.roleta_opcoes.length > 0
          ? data.roleta_opcoes
          : ['🍝 Jantar romântico', '🎬 Cinema juntinhos', '🍦 Tomar sorvete', '🌅 Ver o pôr do sol', '🧺 Piquenique', '🎮 Noite de jogos', '🚗 Passeio surpresa', '🍕 Noite de pizza'],
        termo_ativo: !!(data.termo_config?.palavra),
        termo_palavra: data.termo_config?.palavra ?? '',
        termo_dica: data.termo_config?.dica ?? '',
        falling_animation: data.falling_animation ?? DEFAULT_FALLING_ANIMATION,
      })

      // Trava de edição: 7 dias após criação
      if (data.created_at) {
        const criadoEm = new Date(data.created_at)
        const agora = new Date()
        const diffMs = agora.getTime() - criadoEm.getTime()
        const diffDias = Math.floor(diffMs / 86400000)
        const restantes = 7 - diffDias
        if (restantes <= 0) {
          setExpirado(true)
          setDiasRestantes(0)
        } else {
          setDiasRestantes(restantes)
        }
      }

      setLoading(false)
    }
    carregar()
  }, [id])

  function set<K extends keyof Config>(k: K, v: Config[K]) { setCfg(p => p ? { ...p, [k]: v } : p) }
  function setFrase(i: number, v: string) { setCfg(p => { if (!p) return p; const f = [...p.frases]; f[i] = v; return { ...p, frases: f } }) }
  function addFrase() { setCfg(p => { if (!p || p.frases.length >= 5) return p; return { ...p, frases: [...p.frases, ''] } }) }
  function removeFrase(i: number) { setCfg(p => { if (!p || p.frases.length <= 1) return p; return { ...p, frases: p.frases.filter((_, idx) => idx !== i) } }) }

  async function handleFotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!cfg) return
    let files = Array.from(e.target.files ?? [])
    if (!files.length) return
    const restante = 5 - cfg.fotos.length
    if (files.length > restante) { files = files.slice(0, restante); setErro(`Máximo de 5 fotos. Apenas ${restante} será${restante !== 1 ? 'ão' : ''} adicionada${restante !== 1 ? 's' : ''}.`) }
    // Abre a fila de crop — cada arquivo passa pelo ImageCropper em sequência
    setCropQueue(files)
    setCropIndex(0)
    // Limpa o input pra permitir re-selecionar os mesmos arquivos depois
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Sobe um Blob/File pro Supabase Storage e retorna a URL pública
  async function uploadFotoBlob(blob: Blob, originalName: string): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    const ext = blob.type === 'image/jpeg' ? 'jpg' : (originalName.split('.').pop() || 'jpg')
    const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('fotos').upload(path, blob, {
      contentType: blob.type || 'image/jpeg',
    })
    if (error) return null
    const { data: { publicUrl } } = supabase.storage.from('fotos').getPublicUrl(path)
    return publicUrl
  }

  async function handleCropConfirm(croppedBlob: Blob) {
    if (!cfg) return
    setUploadingFoto(true)
    const currentFile = cropQueue[cropIndex]
    const url = await uploadFotoBlob(croppedBlob, currentFile?.name ?? 'foto.jpg')
    if (url) {
      set('fotos', [...cfg.fotos, url])
    } else {
      setErro('Erro ao enviar a foto. Tente novamente.')
    }
    setUploadingFoto(false)
    if (cropIndex + 1 < cropQueue.length) {
      setCropIndex(cropIndex + 1)
    } else {
      setCropQueue([])
      setCropIndex(0)
    }
  }

  async function handleCropSkip(originalFile: File) {
    if (!cfg) return
    setUploadingFoto(true)
    const url = await uploadFotoBlob(originalFile, originalFile.name)
    if (url) {
      set('fotos', [...cfg.fotos, url])
    } else {
      setErro('Erro ao enviar a foto. Tente novamente.')
    }
    setUploadingFoto(false)
    if (cropIndex + 1 < cropQueue.length) {
      setCropIndex(cropIndex + 1)
    } else {
      setCropQueue([])
      setCropIndex(0)
    }
  }

  function handleCropCancel() {
    setCropQueue([])
    setCropIndex(0)
  }

  async function handleMusicaUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { setErro('A música deve ter no máximo 10MB.'); return }
    setUploadingMusica(true)
    const { data: { user } } = await supabase.auth.getUser()
    const path = `${user!.id}/${Date.now()}.mp3`
    const { error } = await supabase.storage.from('musicas').upload(path, file)
    if (!error) { const { data: { publicUrl } } = supabase.storage.from('musicas').getPublicUrl(path); set('musica_url', publicUrl) }
    setUploadingMusica(false)
    if (musicInputRef.current) musicInputRef.current.value = ''
  }

  async function handleSalvar() {
    if (!cfg) return
    if (!cfg.titulo.trim()) { setErro('O título é obrigatório.'); return }
    if (!cfg.texto_botao.trim()) { setErro('O texto do botão é obrigatório.'); return }
    const fv = cfg.frases.filter(Boolean)
    if (cfg.fotos.length === 0 && fv.length > 0) { setErro('Adicione pelo menos 1 foto, ou remova as frases.'); return }
    if (fv.length > cfg.fotos.length) { setErro(`${fv.length} frases para ${cfg.fotos.length} foto${cfg.fotos.length !== 1 ? 's' : ''}. Adicione ${fv.length - cfg.fotos.length} foto${fv.length - cfg.fotos.length !== 1 ? 's' : ''} ou remova ${fv.length - cfg.fotos.length} frase${fv.length - cfg.fotos.length !== 1 ? 's' : ''}.`); return }
    if (cfg.fotos.length > fv.length && fv.length > 0) { setErro(`${cfg.fotos.length} fotos para ${fv.length} frase${fv.length !== 1 ? 's' : ''}. Adicione ${cfg.fotos.length - fv.length} frase${cfg.fotos.length - fv.length !== 1 ? 's' : ''} ou remova ${cfg.fotos.length - fv.length} foto${cfg.fotos.length - fv.length !== 1 ? 's' : ''}.`); return }
    setSaving(true); setErro('')
    const { error } = await supabase.from('presentes').update({
      titulo: cfg.titulo, texto_botao: cfg.texto_botao, texto_final: cfg.texto_final,
      frases: fv, fotos: cfg.fotos,
      musica_url: cfg.musica_url || null,
      musica_info: cfg.musica_info || null,
      retro_slug: cfg.retro_slug.trim() || null,
      roleta_opcoes: cfg.roleta_ativa && cfg.roleta_opcoes.filter(Boolean).length > 0
        ? cfg.roleta_opcoes.filter(Boolean) : null,
      termo_config: cfg.termo_ativo && cfg.termo_palavra.trim()
        ? { palavra: cfg.termo_palavra.trim(), dica: cfg.termo_dica.trim() } : null,
      cor_primaria: cfg.cor_primaria, cor_fundo: cfg.cor_fundo, emoji: cfg.emoji,
      gradiente: cfg.gradiente,
      falling_animation: cfg.falling_animation?.enabled ? cfg.falling_animation : null,
      data_liberacao: cfg.data_liberacao ? new Date(cfg.data_liberacao).toISOString() : null,
    }).eq('id', id)
    if (error) { setErro('Erro ao salvar. Tente novamente.'); setSaving(false); return }
    setSucesso(true)
    setTimeout(() => router.push('/dashboard'), 1500)
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff8f9' }}>
      <style>{`@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.2)}}`}</style>
      <div style={{ fontSize: '3rem', animation: 'pulse 1s infinite' }}>💝</div>
    </div>
  )

  if (notFound || !cfg) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff8f9', textAlign: 'center', padding: 24 }}>
      <div style={{ fontSize: '3rem', marginBottom: 16 }}>😕</div>
      <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.6rem', color: '#3d1f28', marginBottom: 8 }}>Presente não encontrado</h2>
      <p style={{ color: '#7a4f5a', marginBottom: 24 }}>Este presente não existe ou não pertence à sua conta.</p>
      <Link href="/dashboard" style={{ color: '#e8627a', fontWeight: 700 }}>← Voltar ao dashboard</Link>
    </div>
  )

  if (expirado) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff8f9', textAlign: 'center', padding: 24 }}>
      <div style={{ fontSize: '3rem', marginBottom: 16 }}>⏰</div>
      <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.6rem', color: '#3d1f28', marginBottom: 8 }}>Prazo de edição expirado</h2>
      <p style={{ color: '#7a4f5a', marginBottom: 24, lineHeight: 1.6, maxWidth: 400 }}>
        O prazo de 7 dias para editar este presente já passou. Os presentes ficam bloqueados para edição após esse período para garantir a integridade do presente.
      </p>
      <Link href="/dashboard" style={{ color: '#e8627a', fontWeight: 700 }}>← Voltar ao dashboard</Link>
    </div>
  )

  const tabs = ['✍️ Conteúdo', '🎨 Visual', '📅 Data']

  return (
    <>
      {/* Cropper modal — ativo quando há fila de crop */}
      {cropQueue.length > 0 && cropQueue[cropIndex] && (
        <ImageCropper
          file={cropQueue[cropIndex]}
          aspect={4 / 3}
          currentIndex={cropIndex}
          totalCount={cropQueue.length}
          allowSkip
          onConfirm={handleCropConfirm}
          onSkip={handleCropSkip}
          onCancel={handleCropCancel}
        />
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Lato:wght@300;400;700&family=Dancing+Script:wght@700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{height:100%;overflow:hidden}
        body{font-family:'Lato',sans-serif;background:#fff8f9;color:#3d1f28}
        :root{--rose:#e8627a;--rose-light:#f9a8b8;--rose-pale:#fdf0f3;--rose-mid:#fce4ea;--text:#3d1f28;--text-soft:#9a7080}
        .navbar{display:flex;align-items:center;justify-content:space-between;padding:0 24px;height:56px;background:white;border-bottom:1px solid var(--rose-mid);position:sticky;top:0;z-index:100;flex-shrink:0}
        .navbar-left{display:flex;align-items:center;gap:8px}
        .nav-logo{font-family:'Playfair Display',serif;font-size:1.3rem;color:var(--rose);text-decoration:none;font-weight:700}
        .nav-title{font-size:.9rem;color:var(--text-soft)}
        .nav-title span{color:var(--text);font-weight:600}
        .navbar-right{display:flex;gap:10px;align-items:center}
        .btn-cancelar{padding:8px 16px;border-radius:8px;border:1.5px solid var(--rose-mid);background:white;color:var(--text-soft);font-family:'Lato',sans-serif;font-size:.88rem;font-weight:600;cursor:pointer;text-decoration:none;display:flex;align-items:center}
        .btn-salvar{padding:9px 20px;border-radius:8px;border:none;background:linear-gradient(135deg,var(--rose),var(--rose-light));color:white;font-family:'Lato',sans-serif;font-size:.88rem;font-weight:700;cursor:pointer;transition:opacity .2s}
        .btn-salvar:disabled{opacity:.6;cursor:not-allowed}
        .editor-layout{display:grid;grid-template-columns:380px 1fr;height:calc(100vh - 56px);overflow:hidden}
        .editor-panel{border-right:1px solid var(--rose-mid);display:flex;flex-direction:column;overflow:hidden}
        .tabs{display:flex;border-bottom:1px solid var(--rose-mid);flex-shrink:0}
        .tab{flex:1;padding:12px 0;border:none;background:none;font-family:'Lato',sans-serif;font-size:.83rem;font-weight:600;color:var(--text-soft);cursor:pointer;border-bottom:2px solid transparent;transition:all .2s}
        .tab.active{color:var(--rose);border-bottom-color:var(--rose)}
        .form-scroll{flex:1;overflow-y:auto;padding:20px 20px 40px}
        .section-title{font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--rose);margin-bottom:12px}
        .field{margin-bottom:16px}
        .field label{display:block;font-size:.82rem;font-weight:600;color:var(--text);margin-bottom:6px}
        .field label span{font-weight:400;color:var(--text-soft)}
        .field input,.field textarea{width:100%;padding:10px 13px;border:1.5px solid var(--rose-mid);border-radius:10px;font-family:'Lato',sans-serif;font-size:.9rem;color:var(--text);background:white;outline:none;transition:border-color .2s;resize:none}
        .field input:focus,.field textarea:focus{border-color:var(--rose)}
        .frase-row{display:flex;gap:8px;margin-bottom:10px;align-items:center}
        .frase-row input{flex:1;padding:9px 12px;border:1.5px solid var(--rose-mid);border-radius:10px;font-family:'Lato',sans-serif;font-size:.88rem;color:var(--text);outline:none;transition:border-color .2s}
        .frase-row input:focus{border-color:var(--rose)}
        .btn-remove-frase{background:none;border:none;color:#ccc;font-size:1rem;cursor:pointer;padding:4px;line-height:1;transition:color .2s;flex-shrink:0}
        .btn-remove-frase:hover{color:var(--rose)}
        .btn-add-frase{background:none;border:1.5px dashed var(--rose-light);border-radius:8px;color:var(--rose);font-family:'Lato',sans-serif;font-size:.83rem;font-weight:600;cursor:pointer;padding:8px 14px;width:100%;transition:all .2s;margin-top:4px}
        .btn-add-frase:hover{background:var(--rose-pale)}
        .upload-area{border:2px dashed var(--rose-light);border-radius:12px;padding:20px;text-align:center;cursor:pointer;transition:all .2s;margin-bottom:8px}
        .upload-area:hover{border-color:var(--rose);background:var(--rose-pale)}
        .upload-area .icon{font-size:1.8rem;margin-bottom:6px}
        .upload-area p{font-size:.82rem;color:var(--text-soft)}
        .fotos-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px}
        .foto-thumb{position:relative;aspect-ratio:1;border-radius:8px;overflow:hidden}
        .foto-thumb img{width:100%;height:100%;object-fit:cover}
        .foto-thumb button{position:absolute;top:4px;right:4px;background:rgba(0,0,0,.6);color:white;border:none;border-radius:50%;width:22px;height:22px;font-size:.7rem;cursor:pointer;display:flex;align-items:center;justify-content:center}
        .musica-info{background:var(--rose-pale);border:1.5px solid var(--rose-mid);border-radius:10px;padding:12px 14px;font-size:.85rem;color:var(--text);display:flex;align-items:center;justify-content:space-between}
        .musica-info button{background:none;border:none;color:var(--rose);font-size:.8rem;cursor:pointer;font-weight:600}
        .emoji-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:8px}
        .emoji-btn{background:white;border:2px solid var(--rose-mid);border-radius:10px;font-size:1.4rem;padding:8px;cursor:pointer;transition:all .2s;aspect-ratio:1}
        .emoji-btn.selected,.emoji-btn:hover{border-color:var(--rose);background:var(--rose-pale)}
        .color-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px}
        .color-field label{display:block;font-size:.8rem;font-weight:600;color:var(--text);margin-bottom:8px}
        .color-picker-wrap{display:flex;align-items:center;gap:10px;border:1.5px solid var(--rose-mid);border-radius:10px;padding:8px 12px;background:white}
        .color-picker-wrap input[type=color]{width:32px;height:32px;border:none;border-radius:6px;cursor:pointer;padding:0;background:none}
        .color-picker-wrap span{font-size:.82rem;color:var(--text-soft);font-family:monospace}
        .preview-panel{display:flex;flex-direction:column;overflow:hidden;background:#f5f0f2}
        .preview-header{padding:12px 20px;font-size:.8rem;color:#9a7080;display:flex;align-items:center;gap:8px;border-bottom:1px solid #ecdde2;background:white;flex-shrink:0}
        .preview-header span{width:8px;height:8px;border-radius:50%;background:#4caf50;display:inline-block}
        .preview-body{flex:1;overflow-y:auto;display:flex;align-items:center;justify-content:center;padding:32px}
        .preview-frame{width:100%;max-width:320px}
        .erro-box{background:#fff0f2;border:1px solid var(--rose-light);border-radius:8px;padding:10px 14px;font-size:.83rem;color:#c0415a;margin-bottom:16px}
        .erro-toast{position:fixed;top:72px;left:50%;transform:translateX(-50%);background:#c0415a;color:white;padding:14px 24px;border-radius:12px;font-size:.9rem;font-weight:600;box-shadow:0 8px 32px rgba(0,0,0,.2);z-index:9999;max-width:480px;width:90%;text-align:center;animation:slideDown .3s ease;cursor:pointer}
        .sucesso-toast{position:fixed;top:72px;left:50%;transform:translateX(-50%);background:#4caf50;color:white;padding:14px 24px;border-radius:12px;font-size:.9rem;font-weight:600;box-shadow:0 8px 32px rgba(0,0,0,.2);z-index:9999;max-width:480px;width:90%;text-align:center;animation:slideDown .3s ease}
        @keyframes slideDown{from{opacity:0;transform:translateX(-50%) translateY(-16px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
        @media(max-width:768px){.editor-layout{grid-template-columns:1fr}.preview-panel{display:none}}
      `}</style>

      {erro && <div className="erro-toast" onClick={() => setErro('')}>⚠️ {erro} <span style={{ marginLeft: 12, opacity: .7, fontSize: '.8rem' }}>clique para fechar</span></div>}
      {sucesso && <div className="sucesso-toast">✅ Presente salvo com sucesso! Redirecionando…</div>}

      <nav className="navbar">
        <div className="navbar-left">
          <Link href="/" className="nav-logo">Presentim</Link>
          <span className="nav-title">/ <span>Editar presente</span></span>
          <span style={{ fontSize:'.72rem', color:'var(--text-soft)', marginLeft:8 }}>⏳ {diasRestantes} dia{diasRestantes !== 1 ? 's' : ''} restante{diasRestantes !== 1 ? 's' : ''}</span>
        </div>
        <div className="navbar-right">
          <Link href="/dashboard" className="btn-cancelar">Cancelar</Link>
          <button className="btn-salvar" onClick={handleSalvar} disabled={saving}>
            {saving ? '⏳ Salvando…' : '✓ Salvar alterações'}
          </button>
        </div>
      </nav>

      <div className="editor-layout">
        <div className="editor-panel">
          <div className="tabs">
            {tabs.map((t, i) => <button key={t} className={`tab ${step === i ? 'active' : ''}`} onClick={() => setStep(i)}>{t}</button>)}
          </div>
          <div className="form-scroll">
            {erro && <div className="erro-box">{erro}</div>}

            {step === 0 && (
              <>
                <p className="section-title">Textos principais</p>
                <div className="field"><label>Título <span>(aparece após abrir)</span></label><input value={cfg.titulo} onChange={e => set('titulo', e.target.value)} placeholder="Ex: Feliz aniversário, amor!" maxLength={60} /></div>
                <div className="field"><label>Texto do botão</label><input value={cfg.texto_botao} onChange={e => set('texto_botao', e.target.value)} placeholder="Ex: Vamos lá" maxLength={30} /></div>
                <div className="field"><label>Mensagem final <span>(encerramento)</span></label><textarea rows={2} value={cfg.texto_final} onChange={e => set('texto_final', e.target.value)} placeholder="Ex: Te amo muito! 💝" maxLength={120} /></div>

                <p className="section-title" style={{ marginTop: 8 }}>Frases das fotos</p>
                <p style={{ fontSize: '.8rem', color: 'var(--text-soft)', marginBottom: 12 }}>Essas frases aparecem animadas enquanto a pessoa rola a página.</p>
                {cfg.frases.map((f, i) => (
                  <div className="frase-row" key={i}>
                    <input value={f} onChange={e => setFrase(i, e.target.value)} placeholder={`Frase ${i + 1}…`} maxLength={120} />
                    {cfg.frases.length > 1 && <button className="btn-remove-frase" onClick={() => removeFrase(i)}>✕</button>}
                  </div>
                ))}
                {cfg.frases.length < 5 && cfg.frases.length < cfg.fotos.length && <button className="btn-add-frase" onClick={addFrase}>+ Adicionar frase</button>}

                {(() => {
                  const fv = cfg.frases.filter(Boolean).length, ft = cfg.fotos.length
                  if (ft === 0 && fv === 0) return null
                  if (fv === ft) return <p style={{ fontSize: '.78rem', color: '#4caf50', marginTop: 8 }}>✅ {ft} foto{ft !== 1 ? 's' : ''} e {fv} frase{fv !== 1 ? 's' : ''} — tudo certo!</p>
                  if (fv > ft) return <p style={{ fontSize: '.78rem', color: '#e53935', marginTop: 8 }}>⚠️ {fv} frases para {ft} foto{ft !== 1 ? 's' : ''}. Adicione {fv - ft} foto{fv - ft !== 1 ? 's' : ''} ou remova {fv - ft} frase{fv - ft !== 1 ? 's' : ''}.</p>
                  if (ft > fv && fv > 0) return <p style={{ fontSize: '.78rem', color: '#f57c00', marginTop: 8 }}>⚠️ {ft} fotos para {fv} frase{fv !== 1 ? 's' : ''}. Adicione {ft - fv} frase{ft - fv !== 1 ? 's' : ''} ou remova {ft - fv} foto{ft - fv !== 1 ? 's' : ''}.</p>
                  return null
                })()}

                <p className="section-title" style={{ marginTop: 20 }}>Fotos</p>
                {cfg.fotos.length > 0 && (
                  <div className="fotos-grid">
                    {cfg.fotos.map((url, i) => (
                      <div className="foto-thumb" key={i}>
                        <img src={url} alt="" />
                        <button onClick={() => set('fotos', cfg.fotos.filter((_, idx) => idx !== i))}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
                {cfg.fotos.length < 5 && (
                  <>
                    <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
                      <div className="icon">{uploadingFoto ? '⏳' : '📷'}</div>
                      <p>{uploadingFoto ? 'Enviando…' : `Clique para adicionar fotos (${cfg.fotos.length}/5)`}</p>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleFotoUpload} />
                  </>
                )}

                <p className="section-title" style={{ marginTop: 20 }}>Música de fundo</p>
                {cfg.musica_info ? (
                  <div className="musica-info">
                    <div style={{ display:'flex', alignItems:'center', gap:10, flex:1 }}>
                      <img src={`https://img.youtube.com/vi/${cfg.musica_info.videoId}/default.jpg`} alt="" style={{ width:48, height:36, borderRadius:6, objectFit:'cover' }} />
                      <div><div style={{ fontSize:'.82rem', fontWeight:700, color:'var(--text)' }}>{cfg.musica_info.title}</div><div style={{ fontSize:'.72rem', color:'var(--text-soft)' }}>YouTube</div></div>
                    </div>
                    <button onClick={() => { set('musica_info', null); setMusicaLink('') }}>Remover</button>
                  </div>
                ) : cfg.musica_url ? (
                  <div className="musica-info">🎵 Arquivo de música adicionado<button onClick={() => set('musica_url', '')}>Remover</button></div>
                ) : (
                  <>
                    <div style={{ display:'flex', marginBottom:12, borderRadius:10, overflow:'hidden', border:'2px solid var(--rose-mid)' }}>
                      {['🔍 Buscar', '🔗 Link', '📁 Upload'].map((t, i) => (
                        <button key={t} onClick={() => { setMusicaTab(i); setMusicaErro('') }} style={{ flex:1, padding:'9px 0', border:'none', cursor:'pointer', fontFamily:'Lato,sans-serif', fontSize:'.83rem', fontWeight:700, background: musicaTab===i ? 'var(--rose)' : 'white', color: musicaTab===i ? 'white' : 'var(--text-soft)', transition:'all .2s' }}>{t}</button>
                      ))}
                    </div>
                    {musicaTab === 0 ? (
                      <>
                        <div style={{ display:'flex', gap:8, marginBottom:8 }}>
                          <input style={{ flex:1, padding:'10px 14px', border:'2px solid var(--rose-mid)', borderRadius:10, fontFamily:'Lato,sans-serif', fontSize:'.88rem', outline:'none' }}
                            type="text" placeholder="Buscar música no YouTube…" value={musicaBusca}
                            onChange={e => setMusicaBusca(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleBuscaMusica()} />
                          <button onClick={handleBuscaMusica} disabled={buscandoMusica || !musicaBusca.trim()}
                            style={{ padding:'10px 16px', background:'var(--rose)', color:'white', border:'none', borderRadius:10, fontWeight:700, cursor:'pointer', opacity:(!musicaBusca.trim()||buscandoMusica)?.5:1 }}>
                            {buscandoMusica ? '⏳' : '🔍'}
                          </button>
                        </div>
                        {musicaErro && <p style={{ fontSize:'.75rem', color:'#c0415a', marginBottom:6 }}>{musicaErro}</p>}
                        {musicaResultados.length > 0 && (
                          <div style={{ display:'flex', flexDirection:'column', gap:6, maxHeight:260, overflowY:'auto', marginBottom:8 }}>
                            {musicaResultados.map(r => (
                              <button key={r.videoId} onClick={() => selecionarMusicaBusca(r)}
                                style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', border:'2px solid var(--rose-mid)', borderRadius:10, background:'white', cursor:'pointer', textAlign:'left', transition:'border-color .2s' }}
                                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--rose)')}
                                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--rose-mid)')}>
                                <img src={r.thumb} alt="" style={{ width:64, height:48, borderRadius:6, objectFit:'cover', flexShrink:0 }} />
                                <div style={{ flex:1, overflow:'hidden' }}>
                                  <div style={{ fontSize:'.82rem', fontWeight:600, color:'var(--text)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{r.title}</div>
                                  <div style={{ fontSize:'.7rem', color:'var(--text-soft)' }}>{r.channel}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                        <p style={{ fontSize:'.75rem', color:'var(--text-soft)', lineHeight:1.5 }}>✅ Pesquise por nome da música ou artista</p>
                      </>
                    ) : musicaTab === 1 ? (
                      <>
                        <div style={{ display:'flex', gap:8, marginBottom:8 }}>
                          <input style={{ flex:1, padding:'10px 14px', border:'2px solid var(--rose-mid)', borderRadius:10, fontFamily:'Lato,sans-serif', fontSize:'.88rem', outline:'none' }}
                            type="url" placeholder="Cole o link do YouTube…" value={musicaLink}
                            onChange={e => setMusicaLink(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleMusicaYouTube()} />
                          <button onClick={handleMusicaYouTube} disabled={musicaLoading || !musicaLink}
                            style={{ padding:'10px 16px', background:'var(--rose)', color:'white', border:'none', borderRadius:10, fontWeight:700, cursor:'pointer', opacity:(!musicaLink||musicaLoading)?.5:1 }}>
                            {musicaLoading ? '⏳' : 'OK'}
                          </button>
                        </div>
                        {musicaErro && <p style={{ fontSize:'.75rem', color:'#c0415a', marginBottom:6 }}>{musicaErro}</p>}
                        <p style={{ fontSize:'.75rem', color:'var(--text-soft)', lineHeight:1.5 }}>✅ Funciona com qualquer vídeo público do YouTube</p>
                      </>
                    ) : (
                      <>
                        <div className="upload-area" onClick={() => musicInputRef.current?.click()}><div className="icon">{uploadingMusica ? '⏳' : '🎵'}</div><p>{uploadingMusica ? 'Enviando…' : 'Clique para adicionar música (MP3, máx 10MB)'}</p></div>
                        <input ref={musicInputRef} type="file" accept="audio/mpeg,audio/mp3" style={{ display:'none' }} onChange={handleMusicaUpload} />
                      </>
                    )}
                  </>
                )}

                {/* ── Roleta ── */}
                <p className="section-title" style={{ marginTop: 24 }}>Roleta do próximo date <span style={{ fontWeight:400, color:'var(--text-soft)', fontSize:'.8rem' }}>(opcional)</span></p>
                <p style={{ fontSize:'.8rem', color:'var(--text-soft)', marginBottom:10, lineHeight:1.5 }}>Ative para adicionar uma roleta interativa com sugestões de encontros.</p>
                <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', marginBottom:14 }}>
                  <div onClick={() => set('roleta_ativa', !cfg.roleta_ativa)} style={{ width:44, height:24, borderRadius:12, background: cfg.roleta_ativa ? 'var(--rose)' : '#ddd', position:'relative', cursor:'pointer', transition:'background .2s', flexShrink:0 }}>
                    <div style={{ position:'absolute', top:3, left: cfg.roleta_ativa ? 23 : 3, width:18, height:18, borderRadius:'50%', background:'white', transition:'left .2s', boxShadow:'0 1px 4px rgba(0,0,0,.2)' }} />
                  </div>
                  <span style={{ fontSize:'.85rem', color:'var(--text)', fontWeight:600 }}>{cfg.roleta_ativa ? '🎡 Roleta ativada' : 'Ativar roleta'}</span>
                </label>
                {cfg.roleta_ativa && (
                  <div style={{ background:'var(--rose-pale)', border:'1px solid var(--rose-mid)', borderRadius:12, padding:'14px 16px', marginBottom:8 }}>
                    <p style={{ fontSize:'.78rem', fontWeight:700, color:'var(--text)', marginBottom:10 }}>Opções da roleta (mín. 2, máx. 10):</p>
                    {cfg.roleta_opcoes.map((op, i) => (
                      <div key={i} style={{ display:'flex', gap:6, marginBottom:6 }}>
                        <input value={op} onChange={e => { const arr = [...cfg.roleta_opcoes]; arr[i] = e.target.value; set('roleta_opcoes', arr) }} placeholder={`Opção ${i+1}…`} maxLength={40}
                          style={{ flex:1, padding:'8px 12px', border:'2px solid var(--rose-mid)', borderRadius:8, fontSize:'.85rem', fontFamily:'Lato,sans-serif', outline:'none', background:'white' }} />
                        {cfg.roleta_opcoes.length > 2 && (
                          <button onClick={() => set('roleta_opcoes', cfg.roleta_opcoes.filter((_, idx) => idx !== i))} style={{ background:'none', border:'none', cursor:'pointer', color:'#ccc', fontSize:'1rem', padding:'0 4px' }}>✕</button>
                        )}
                      </div>
                    ))}
                    {cfg.roleta_opcoes.length < 10 && (
                      <button onClick={() => set('roleta_opcoes', [...cfg.roleta_opcoes, ''])} style={{ background:'none', border:'2px dashed var(--rose-mid)', borderRadius:8, width:'100%', padding:'7px', fontSize:'.8rem', color:'var(--text-soft)', cursor:'pointer', marginTop:4 }}>+ Adicionar opção</button>
                    )}
                  </div>
                )}

                {/* ── Termo ── */}
                <p className="section-title" style={{ marginTop: 24 }}>Jogo de adivinhar a palavra <span style={{ fontWeight:400, color:'var(--text-soft)', fontSize:'.8rem' }}>(opcional)</span></p>
                <p style={{ fontSize:'.8rem', color:'var(--text-soft)', marginBottom:10, lineHeight:1.5 }}>Ative para incluir um mini jogo estilo Wordle. A pessoa tem 5 tentativas para adivinhar.</p>
                <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', marginBottom:14 }}>
                  <div onClick={() => set('termo_ativo', !cfg.termo_ativo)} style={{ width:44, height:24, borderRadius:12, background: cfg.termo_ativo ? 'var(--rose)' : '#ddd', position:'relative', cursor:'pointer', transition:'background .2s', flexShrink:0 }}>
                    <div style={{ position:'absolute', top:3, left: cfg.termo_ativo ? 23 : 3, width:18, height:18, borderRadius:'50%', background:'white', transition:'left .2s', boxShadow:'0 1px 4px rgba(0,0,0,.2)' }} />
                  </div>
                  <span style={{ fontSize:'.85rem', color:'var(--text)', fontWeight:600 }}>{cfg.termo_ativo ? '🎮 Jogo ativado' : 'Ativar jogo de palavras'}</span>
                </label>
                {cfg.termo_ativo && (
                  <div style={{ background:'var(--rose-pale)', border:'1px solid var(--rose-mid)', borderRadius:12, padding:'14px 16px', marginBottom:8, display:'flex', flexDirection:'column', gap:10 }}>
                    <div>
                      <label style={{ fontSize:'.78rem', fontWeight:700, color:'var(--text)', display:'block', marginBottom:4 }}>Palavra secreta <span style={{ fontWeight:400, color:'var(--text-soft)' }}>(sem acento, só letras)</span></label>
                      <input value={cfg.termo_palavra} onChange={e => set('termo_palavra', e.target.value.toUpperCase().replace(/[^A-ZÁÉÍÓÚÂÊÔÃÕÜÇÀÈÌ]/gi, ''))} placeholder="Ex: AMOR" maxLength={8}
                        style={{ width:'100%', padding:'8px 12px', border:'2px solid var(--rose-mid)', borderRadius:8, fontSize:'.9rem', fontFamily:'Lato,sans-serif', outline:'none', background:'white', textTransform:'uppercase', letterSpacing:2 }} />
                      {cfg.termo_palavra && <p style={{ fontSize:'.72rem', color:'var(--rose)', marginTop:4 }}>{cfg.termo_palavra.length} letra{cfg.termo_palavra.length !== 1 ? 's' : ''} — a pessoa terá que adivinhar esta palavra</p>}
                    </div>
                    <div>
                      <label style={{ fontSize:'.78rem', fontWeight:700, color:'var(--text)', display:'block', marginBottom:4 }}>Dica <span style={{ fontWeight:400, color:'var(--text-soft)' }}>(aparece no jogo)</span></label>
                      <input value={cfg.termo_dica} onChange={e => set('termo_dica', e.target.value)} placeholder="Ex: O que eu mais gosto em você" maxLength={80}
                        style={{ width:'100%', padding:'8px 12px', border:'2px solid var(--rose-mid)', borderRadius:8, fontSize:'.85rem', fontFamily:'Lato,sans-serif', outline:'none', background:'white' }} />
                    </div>
                  </div>
                )}

                <p className="section-title" style={{ marginTop: 24 }}>Vincular Retrospectiva <span style={{ fontWeight:400, color:'var(--text-soft)', fontSize:'.8rem' }}>(opcional)</span></p>
                <p style={{ fontSize:'.8rem', color:'var(--text-soft)', marginBottom:8, lineHeight:1.5 }}>Cole o link da Retrospectiva para exibir um QR Code no final desta Página.</p>
                <div className="field">
                  <input type="url" placeholder="https://presentim.app/retrospectiva/seu-slug"
                    value={cfg.retro_slug}
                    onChange={e => {
                      const val = e.target.value
                      const match = val.match(/retrospectiva\/([\w-]+)/)
                      set('retro_slug', match ? match[1] : val)
                    }} />
                </div>
                {cfg.retro_slug && (
                  <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:'.78rem', color:'var(--rose)', marginTop:4 }}>
                    ✅ Vinculada: <strong>{cfg.retro_slug}</strong>
                    <button onClick={() => set('retro_slug', '')} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-soft)', fontSize:'.75rem' }}>remover</button>
                  </div>
                )}
              </>
            )}

            {step === 1 && (
              <>
                <p className="section-title">Emoji do botão</p>
                <div className="emoji-grid">{EMOJIS.map(e => <button key={e} className={`emoji-btn ${cfg.emoji === e ? 'selected' : ''}`} onClick={() => set('emoji', e)}>{e}</button>)}</div>
                <p className="section-title" style={{ marginTop: 24 }}>Cores</p>
                <div className="color-row">
                  <div className="color-field"><label>Cor principal</label><div className="color-picker-wrap"><input type="color" value={cfg.cor_primaria} onChange={e => set('cor_primaria', e.target.value)} /><span>{cfg.cor_primaria}</span></div></div>
                  <div className="color-field"><label>Cor de fundo</label><div className="color-picker-wrap"><input type="color" value={cfg.cor_fundo} onChange={e => set('cor_fundo', e.target.value)} /><span>{cfg.cor_fundo}</span></div></div>
                </div>
                <p className="section-title" style={{ marginTop: 24 }}>Combinações prontas</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[{nome:'Rosa',primaria:'#e8627a',fundo:'#ffeef0'},{nome:'Roxo',primaria:'#9b59b6',fundo:'#f5eeff'},{nome:'Azul',primaria:'#3b82f6',fundo:'#eff6ff'},{nome:'Verde',primaria:'#10b981',fundo:'#ecfdf5'},{nome:'Laranja',primaria:'#f97316',fundo:'#fff7ed'},{nome:'Vermelho',primaria:'#ef4444',fundo:'#fef2f2'}].map(t => (
                    <button key={t.nome} onClick={() => { set('cor_primaria', t.primaria); set('cor_fundo', t.fundo) }} style={{ background: t.fundo, border: `2px solid ${cfg.cor_primaria === t.primaria ? t.primaria : '#e0d0d4'}`, borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', transition: 'all .2s', fontSize: '.85rem', fontWeight: 700, color: t.primaria }}>
                      <span style={{ width: 18, height: 18, borderRadius: '50%', background: t.primaria, display: 'inline-block', flexShrink: 0 }} />{t.nome}
                    </button>
                  ))}
                </div>

                {/* ─── Gradiente de fundo ─────────────────────────────────────── */}
                <p className="section-title" style={{ marginTop: 24 }}>Gradiente de fundo · opcional</p>
                <p style={{ fontSize: '.78rem', color: 'var(--text-soft)', marginBottom: 12, lineHeight: 1.5 }}>
                  Gradientes deixam o presente com um visual mais moderno. Se não escolher, usa a cor de fundo sólida acima.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
                  {/* Sem gradiente */}
                  <button
                    onClick={() => set('gradiente', null)}
                    style={{
                      position: 'relative',
                      borderRadius: 14,
                      padding: 0,
                      cursor: 'pointer',
                      overflow: 'hidden',
                      border: `2px solid ${!cfg.gradiente ? 'var(--rose)' : 'var(--rose-mid)'}`,
                      background: 'white',
                      fontFamily: 'Lato, sans-serif',
                      boxShadow: !cfg.gradiente ? '0 0 0 3px rgba(232,98,122,.15), 0 6px 16px rgba(232,98,122,.2)' : 'none',
                    }}
                  >
                    {!cfg.gradiente && (
                      <span style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.75rem', color: 'var(--rose)', fontWeight: 700, boxShadow: '0 2px 6px rgba(0,0,0,.15)' }}>✓</span>
                    )}
                    <span style={{ width: '100%', height: 64, display: 'block', background: 'repeating-linear-gradient(45deg, #f5f0f2, #f5f0f2 10px, #fbe9ed 10px, #fbe9ed 20px)' }} />
                    <span style={{ display: 'block', fontSize: '.78rem', fontWeight: 700, color: 'var(--text)', padding: '8px 6px', textAlign: 'center', background: 'white' }}>Cor sólida</span>
                  </button>
                  {GRADIENTE_PRESETS.map(preset => {
                    const selected = cfg.gradiente === preset.css
                    return (
                      <button
                        key={preset.key}
                        onClick={() => set('gradiente', preset.css)}
                        style={{
                          position: 'relative',
                          borderRadius: 14,
                          padding: 0,
                          cursor: 'pointer',
                          overflow: 'hidden',
                          border: `2px solid ${selected ? 'var(--rose)' : 'var(--rose-mid)'}`,
                          background: 'white',
                          fontFamily: 'Lato, sans-serif',
                          boxShadow: selected ? '0 0 0 3px rgba(232,98,122,.15), 0 6px 16px rgba(232,98,122,.2)' : 'none',
                        }}
                      >
                        {selected && (
                          <span style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.75rem', color: 'var(--rose)', fontWeight: 700, boxShadow: '0 2px 6px rgba(0,0,0,.15)' }}>✓</span>
                        )}
                        <span style={{ width: '100%', height: 64, display: 'block', background: preset.css }} />
                        <span style={{ display: 'block', fontSize: '.78rem', fontWeight: 700, color: 'var(--text)', padding: '8px 6px', textAlign: 'center', background: 'white' }}>{preset.label}</span>
                      </button>
                    )
                  })}
                </div>

                {/* ─── Animação de fundo (falling particles) ──────────────────── */}
                <p className="section-title" style={{ marginTop: 24 }}>Animação de fundo · opcional</p>

                <div
                  onClick={() => set('falling_animation', { ...cfg.falling_animation, enabled: !cfg.falling_animation.enabled })}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'white', border: '1.5px solid var(--rose-mid)', borderRadius: 14, padding: '14px 18px', marginBottom: 14, cursor: 'pointer' }}
                >
                  <div style={{ width: 44, height: 24, borderRadius: 12, background: cfg.falling_animation.enabled ? 'var(--rose)' : '#ddd', position: 'relative', flexShrink: 0, transition: 'background .2s' }}>
                    <div style={{ position: 'absolute', top: 3, left: cfg.falling_animation.enabled ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: 'white', transition: 'left .2s', boxShadow: '0 1px 4px rgba(0,0,0,.2)' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '.92rem', fontWeight: 700, color: 'var(--text)' }}>
                      {cfg.falling_animation.enabled ? '✨ Animação ativada' : 'Ativar animação'}
                    </div>
                    <div style={{ fontSize: '.78rem', color: 'var(--text-soft)', marginTop: 2 }}>
                      Partículas caindo no fundo do presente
                    </div>
                  </div>
                </div>

                {cfg.falling_animation.enabled && (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10, marginBottom: 12 }}>
                      {(Object.values(FALLING_PRESETS) as FallingPreset[]).map(preset => {
                        const selected = cfg.falling_animation.type === preset.type
                        return (
                          <button
                            key={preset.type}
                            onClick={() => set('falling_animation', { ...cfg.falling_animation, type: preset.type as FallingType })}
                            style={{ background: 'white', border: `2px solid ${selected ? 'var(--rose)' : 'var(--rose-mid)'}`, borderRadius: 12, padding: '14px 10px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontFamily: 'Lato, sans-serif', boxShadow: selected ? '0 0 0 3px rgba(232,98,122,.1)' : 'none' }}
                          >
                            <span style={{ fontSize: '1.6rem' }}>{preset.icon}</span>
                            <span style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--text)' }}>{preset.label}</span>
                          </button>
                        )
                      })}
                      <button
                        onClick={() => set('falling_animation', { ...cfg.falling_animation, type: 'personalizado' })}
                        style={{ background: 'white', border: `2px solid ${cfg.falling_animation.type === 'personalizado' ? 'var(--rose)' : 'var(--rose-mid)'}`, borderRadius: 12, padding: '14px 10px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontFamily: 'Lato, sans-serif', boxShadow: cfg.falling_animation.type === 'personalizado' ? '0 0 0 3px rgba(232,98,122,.1)' : 'none' }}
                      >
                        <span style={{ fontSize: '1.6rem' }}>🎨</span>
                        <span style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--text)' }}>Personalizado</span>
                      </button>
                    </div>

                    {cfg.falling_animation.type === 'personalizado' && (
                      <div style={{ background: 'var(--rose-pale)', border: '1.5px solid var(--rose-mid)', borderRadius: 12, padding: '14px 16px', marginBottom: 12 }}>
                        <label style={{ display: 'block', fontSize: '.78rem', fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Seu emoji (até 6)</label>
                        <input
                          value={cfg.falling_animation.customEmoji ?? ''}
                          onChange={e => set('falling_animation', { ...cfg.falling_animation, customEmoji: e.target.value })}
                          placeholder="🎈🎁🎂"
                          maxLength={20}
                          style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--rose-mid)', borderRadius: 10, fontSize: '1.4rem', fontFamily: 'Lato, sans-serif', background: 'white', outline: 'none', textAlign: 'center' }}
                        />
                        <p style={{ fontSize: '.74rem', color: 'var(--text-soft)', marginTop: 6, lineHeight: 1.5 }}>
                          Cole um ou mais emojis (máximo 6). Exemplo: 🎈 ou 🎈🎂🎁
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() => setShowFaPreview(true)}
                      style={{ width: '100%', background: 'linear-gradient(135deg, var(--rose), #c94f68)', color: 'white', border: 'none', borderRadius: 12, padding: 13, fontFamily: 'Lato, sans-serif', fontSize: '.92rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(232,98,122,.3)' }}
                    >
                      👁 Ver preview da animação
                    </button>
                  </>
                )}
              </>
            )}

            {step === 2 && (
              <>
                <p className="section-title">Data de liberação</p>
                <p style={{ fontSize: '.85rem', color: 'var(--text-soft)', marginBottom: 16, lineHeight: 1.6 }}>Altere ou remova a data de liberação. Deixe em branco para liberar imediatamente.</p>
                <div className="field"><label>Data e hora <span>(opcional)</span></label><input type="datetime-local" value={cfg.data_liberacao} onChange={e => set('data_liberacao', e.target.value)} min={new Date().toISOString().slice(0, 16)} /></div>
                {cfg.data_liberacao && (
                  <div style={{ background: 'var(--rose-pale)', border: '1px solid var(--rose-mid)', borderRadius: 12, padding: 16, marginTop: 8, fontSize: '.85rem', color: 'var(--text-soft)', lineHeight: 1.7 }}>
                    🎉 O presente será revelado em <strong style={{ color: 'var(--text)' }}>{new Date(cfg.data_liberacao).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })}</strong>.
                  </div>
                )}
                <button style={{ background: 'none', border: 'none', color: 'var(--rose)', fontSize: '.85rem', cursor: 'pointer', marginTop: 12, fontWeight: 700 }} onClick={() => set('data_liberacao', '')}>Limpar data (liberar imediatamente)</button>
              </>
            )}
          </div>
        </div>

        <div className="preview-panel">
          <div className="preview-header"><span /> Preview em tempo real</div>
          <div className="preview-body"><div className="preview-frame"><Preview cfg={cfg} /></div></div>
        </div>
      </div>

      {/* Preview modal da animação caindo */}
      {showFaPreview && (
        <div
          onClick={() => setShowFaPreview(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: cfg.gradiente ?? cfg.cor_fundo,
              borderRadius: 24,
              width: '100%',
              maxWidth: 320,
              aspectRatio: '9/16',
              maxHeight: '70vh',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 32px 80px rgba(0,0,0,.3)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '32px 24px',
              textAlign: 'center',
            }}
          >
            <button
              onClick={() => setShowFaPreview(false)}
              style={{ position: 'absolute', top: 12, right: 12, zIndex: 20, background: 'rgba(0,0,0,.5)', border: 'none', color: 'white', width: 36, height: 36, borderRadius: '50%', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >✕</button>
            <FallingParticles animation={cfg.falling_animation} count={14} zIndex={1} />
            <div style={{ position: 'relative', zIndex: 10 }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>{cfg.emoji}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: 'var(--text)', marginBottom: 8 }}>Preview</div>
              <div style={{ fontSize: '.85rem', color: 'var(--text-soft)' }}>É assim que vai ficar no presente</div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}