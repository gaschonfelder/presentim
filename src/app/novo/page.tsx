'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { gerarSlug } from '@/lib/utils'
import ImageCropper from '@/components/ImageCropper'

// ─── Tipos locais ──────────────────────────────────────────────────────────────
type MusicaInfo = { videoId: string; title: string }

type Config = {
  titulo: string
  texto_botao: string
  texto_final: string
  frases: string[]
  cor_primaria: string
  cor_fundo: string
  emoji: string
  data_liberacao: string
  fotos: string[]
  musica_url: string
  musica_info: MusicaInfo | null
  retro_slug: string
  roleta_ativa: boolean
  roleta_opcoes: string[]
  termo_ativo: boolean
  termo_palavra: string
  termo_dica: string
}

const DEFAULTS: Config = {
  titulo: 'Feliz aniversário, amor!',
  texto_botao: 'Vamos lá',
  texto_final: 'Te amo muito! 💝',
  frases: ['', '', ''],
  cor_primaria: '#e8627a',
  cor_fundo: '#ffeef0',
  emoji: '🎁',
  data_liberacao: '',
  fotos: [],
  musica_url: '',
  musica_info: null,
  retro_slug: '',
  roleta_ativa: false,
  roleta_opcoes: ['🍝 Jantar romântico', '🎬 Cinema juntinhos', '🍦 Tomar sorvete', '🌅 Ver o pôr do sol', '🧺 Piquenique', '🎮 Noite de jogos', '🚗 Passeio surpresa', '🍕 Noite de pizza'],
  termo_ativo: false,
  termo_palavra: '',
  termo_dica: '',
}

const EMOJIS = ['🎁', '💝', '💖', '🌸', '🎂', '🥂', '✨', '🦋', '🌹', '💌', '🎉', '🫶']

// ─── Preview mini ──────────────────────────────────────────────────────────────
function Preview({ cfg }: { cfg: Config }) {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 1000)
    return () => clearInterval(t)
  }, [])

  const hasDate = !!cfg.data_liberacao
  const target = hasDate ? new Date(cfg.data_liberacao) : null
  const diff = target ? target.getTime() - Date.now() : 0
  const dias = diff > 0 ? Math.floor(diff / 86400000) : 0
  const horas = diff > 0 ? Math.floor((diff % 86400000) / 3600000) : 0
  const mins = diff > 0 ? Math.floor((diff % 3600000) / 60000) : 0
  const segs = diff > 0 ? Math.floor((diff % 60000) / 1000) : 0
  const passou = diff <= 0

  return (
    <div style={{
      background: cfg.cor_fundo,
      borderRadius: 20,
      overflow: 'hidden',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 24px',
      gap: 20,
      fontFamily: 'sans-serif',
    }}>
      {/* Countdown */}
      {!passou && hasDate ? (
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '.8rem', color: '#888', marginBottom: 12 }}>Sua surpresa está chegando…</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            {[
              [String(dias).padStart(2,'0'), 'dias'],
              [String(horas).padStart(2,'0'), 'horas'],
              [String(mins).padStart(2,'0'), 'min'],
              [String(segs).padStart(2,'0'), 's'],
            ].map(([n, l]) => (
              <div key={l} style={{
                background: 'white', borderRadius: 10, padding: '8px 12px', textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,.08)',
              }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: cfg.cor_primaria, lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: '.6rem', color: '#999', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Botão */}
      <button style={{
        background: cfg.cor_primaria,
        color: 'white', border: 'none',
        borderRadius: 12, padding: '14px 32px',
        fontSize: '1rem', fontWeight: 700, cursor: 'default',
        boxShadow: `0 6px 20px ${cfg.cor_primaria}55`,
      }}>
        {cfg.emoji} {cfg.texto_botao}
      </button>

      {/* Fotos */}
      {cfg.fotos.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {cfg.fotos.slice(0, 3).map((url, i) => (
            <img key={i} src={url} alt="" style={{
              width: 72, height: 72, objectFit: 'cover',
              borderRadius: 10, border: '3px solid white',
              boxShadow: '0 2px 8px rgba(0,0,0,.12)',
              transform: `rotate(${[-4, 3, -2][i % 3]}deg)`,
            }} />
          ))}
        </div>
      )}

      {/* Frases */}
      {cfg.frases.filter(Boolean).length > 0 && (
        <div style={{ textAlign: 'center' }}>
          {cfg.frases.filter(Boolean).map((f, i) => (
            <p key={i} style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: '1rem', color: '#444',
              margin: '4px 0', lineHeight: 1.5,
            }}>{f}</p>
          ))}
        </div>
      )}

      {/* Texto final */}
      {cfg.texto_final && (
        <div style={{
          background: `linear-gradient(135deg, ${cfg.cor_primaria}, ${cfg.cor_primaria}cc)`,
          color: 'white', borderRadius: 14,
          padding: '16px 20px', textAlign: 'center',
          fontSize: '.95rem', fontWeight: 700,
        }}>
          {cfg.texto_final}
        </div>
      )}

      {/* Título */}
      <p style={{ fontSize: '.75rem', color: '#aaa', textAlign: 'center', marginTop: 8 }}>
        Preview • {cfg.titulo}
      </p>
    </div>
  )
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function NovoPage() {
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const musicInputRef = useRef<HTMLInputElement>(null)

  const [cfg, setCfg] = useState<Config>(DEFAULTS)
  const [saving, setSaving] = useState(false)
  const [erro, setErro] = useState('')
  const [uploadingFoto, setUploadingFoto] = useState(false)
  const [uploadingMusica, setUploadingMusica] = useState(false)
  const [step, setStep] = useState(0) // 0=conteudo 1=visual 2=data
  const [musicaTab, setMusicaTab] = useState(0) // 0=youtube 1=upload
  const [musicaLink, setMusicaLink] = useState('')
  const [musicaErro, setMusicaErro] = useState('')
  const [musicaLoading, setMusicaLoading] = useState(false)

  // Fila de crop — quando há arquivos aqui, o modal ImageCropper é mostrado
  const [cropQueue, setCropQueue] = useState<File[]>([])
  const [cropIndex, setCropIndex] = useState(0)

  function extrairVideoId(url: string): string | null {
    const m = url.match(/(?:v=|youtu\.be\/|shorts\/)([\w-]{11})/)
    return m ? m[1] : null
  }

  async function handleMusicaYouTube() {
    const videoId = extrairVideoId(musicaLink)
    if (!videoId) { setMusicaErro('Link do YouTube inválido.'); return }
    setMusicaLoading(true)
    setMusicaErro('')
    try {
      const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      set('musica_info', { videoId, title: data.title })
      set('musica_url', '')
    } catch {
      setMusicaErro('Não foi possível carregar esse vídeo. Verifique o link.')
    }
    setMusicaLoading(false)
  }

  function set<K extends keyof Config>(key: K, val: Config[K]) {
    setCfg(prev => ({ ...prev, [key]: val }))
  }

  function setFrase(i: number, val: string) {
    const arr = [...cfg.frases]
    arr[i] = val
    set('frases', arr)
  }

  function addFrase() {
    if (cfg.frases.length >= 5) return
    set('frases', [...cfg.frases, ''])
  }

  function removeFrase(i: number) {
    set('frases', cfg.frases.filter((_, idx) => idx !== i))
  }

  async function handleFotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    let files = Array.from(e.target.files ?? [])
    if (!files.length) return
    const restante = 5 - cfg.fotos.length
    if (files.length > restante) {
      files = files.slice(0, restante)
      setErro(`Máximo de 5 fotos. Apenas ${restante} foto${restante !== 1 ? 's' : ''} será${restante !== 1 ? 'ão' : ''} adicionada${restante !== 1 ? 's' : ''}.`)
    }
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
    // Crops sempre viram JPEG; originais mantêm a extensão
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
    setUploadingFoto(true)
    const currentFile = cropQueue[cropIndex]
    const url = await uploadFotoBlob(croppedBlob, currentFile?.name ?? 'foto.jpg')
    if (url) {
      set('fotos', [...cfg.fotos, url])
    } else {
      setErro('Erro ao enviar a foto. Tente novamente.')
    }
    setUploadingFoto(false)
    // Próxima da fila, ou encerra
    if (cropIndex + 1 < cropQueue.length) {
      setCropIndex(cropIndex + 1)
    } else {
      setCropQueue([])
      setCropIndex(0)
    }
  }

  async function handleCropSkip(originalFile: File) {
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
    // Cancela a fila inteira — fotos já enviadas permanecem
    setCropQueue([])
    setCropIndex(0)
  }

  async function handleMusicaUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      setErro('A música deve ter no máximo 10MB.')
      return
    }

    setUploadingMusica(true)
    const { data: { user } } = await supabase.auth.getUser()
    const path = `${user!.id}/${Date.now()}.mp3`
    const { error } = await supabase.storage.from('musicas').upload(path, file)

    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('musicas').getPublicUrl(path)
      set('musica_url', publicUrl)
    }
    setUploadingMusica(false)
    if (musicInputRef.current) musicInputRef.current.value = ''
  }

  function removerFoto(i: number) {
    set('fotos', cfg.fotos.filter((_, idx) => idx !== i))
  }

  async function handleSalvar() {
    if (!cfg.titulo.trim()) { setErro('O título é obrigatório.'); return }
    if (!cfg.texto_botao.trim()) { setErro('O texto do botão é obrigatório.'); return }

    const frasesValidas = cfg.frases.filter(Boolean)
    if (cfg.fotos.length === 0 && frasesValidas.length > 0) {
      setErro('Adicione pelo menos 1 foto, ou remova as frases.')
      return
    }
    if (frasesValidas.length > cfg.fotos.length) {
      setErro(`Você tem ${frasesValidas.length} frases mas só ${cfg.fotos.length} foto${cfg.fotos.length !== 1 ? 's' : ''}. Cada frase precisa de uma foto correspondente. Adicione mais ${frasesValidas.length - cfg.fotos.length} foto${frasesValidas.length - cfg.fotos.length !== 1 ? 's' : ''} ou remova ${frasesValidas.length - cfg.fotos.length} frase${frasesValidas.length - cfg.fotos.length !== 1 ? 's' : ''}.`)
      return
    }
    if (cfg.fotos.length > frasesValidas.length && frasesValidas.length > 0) {
      setErro(`Você tem ${cfg.fotos.length} fotos mas só ${frasesValidas.length} frase${frasesValidas.length !== 1 ? 's' : ''}. Adicione mais ${cfg.fotos.length - frasesValidas.length} frase${cfg.fotos.length - frasesValidas.length !== 1 ? 's' : ''} ou remova ${cfg.fotos.length - frasesValidas.length} foto${cfg.fotos.length - frasesValidas.length !== 1 ? 's' : ''}.`)
      return
    }

    setSaving(true)
    setErro('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    // Verifica créditos
    const { data: profile } = await supabase
      .from('profiles').select('creditos').eq('id', user.id).single()

    if (!profile || profile.creditos < 1) {
      setErro('Você não tem créditos disponíveis. Compre créditos para continuar.')
      setSaving(false)
      return
    }

    const slug = gerarSlug()

    const { error } = await supabase.from('presentes').insert({
      user_id: user.id,
      slug,
      titulo: cfg.titulo,
      texto_botao: cfg.texto_botao,
      texto_final: cfg.texto_final,
      frases: cfg.frases.filter(Boolean),
      fotos: cfg.fotos,
      musica_url: cfg.musica_url || null,
      musica_info: cfg.musica_info || null,
      retro_slug: cfg.retro_slug.trim() || null,
      cor_primaria: cfg.cor_primaria,
      cor_fundo: cfg.cor_fundo,
      emoji: cfg.emoji,
      data_liberacao: cfg.data_liberacao ? new Date(cfg.data_liberacao).toISOString() : null,
      roleta_opcoes: cfg.roleta_ativa && cfg.roleta_opcoes.filter(Boolean).length > 0
        ? cfg.roleta_opcoes.filter(Boolean)
        : null,
      termo_config: cfg.termo_ativo && cfg.termo_palavra.trim()
        ? { palavra: cfg.termo_palavra.trim(), dica: cfg.termo_dica.trim() }
        : null,
    })

    if (error) {
      setErro('Erro ao salvar. Tente novamente.')
      setSaving(false)
      return
    }

    // Desconta 1 crédito
    await supabase.from('profiles')
      .update({ creditos: profile.creditos - 1 })
      .eq('id', user.id)

    router.push(`/dashboard?criado=${slug}`)
  }

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
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --rose: #e8627a; --rose-light: #f9a8b8;
          --rose-pale: #fdf0f3; --rose-mid: #fce4ea;
          --cream: #fff8f9; --text: #3d1f28; --text-soft: #7a4f5a;
        }

        body { font-family: 'Lato', sans-serif; background: var(--cream); color: var(--text); height: 100vh; overflow: hidden; }

        /* Navbar */
        .navbar {
          background: white; border-bottom: 1px solid var(--rose-mid);
          padding: 0 24px; height: 56px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .navbar-left { display: flex; align-items: center; gap: 16px; }
        .nav-logo { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 700; color: var(--rose); text-decoration: none; }
        .nav-title { font-size: .9rem; color: var(--text-soft); }
        .nav-title span { color: var(--text); font-weight: 700; }
        .navbar-right { display: flex; gap: 10px; }
        .btn-cancelar {
          background: none; border: 1px solid var(--rose-mid); border-radius: 8px;
          padding: 7px 16px; font-size: .85rem; color: var(--text-soft);
          cursor: pointer; text-decoration: none; display: inline-flex; align-items: center;
          transition: all .2s;
        }
        .btn-cancelar:hover { border-color: var(--rose); color: var(--rose); }
        .btn-salvar {
          background: linear-gradient(135deg, var(--rose), #c94f68);
          color: white; border: none; border-radius: 8px;
          padding: 8px 20px; font-size: .85rem; font-weight: 700;
          cursor: pointer; font-family: 'Lato', sans-serif;
          box-shadow: 0 4px 14px rgba(232,98,122,.3);
          transition: opacity .2s; display: flex; align-items: center; gap: 6px;
        }
        .btn-salvar:hover:not(:disabled) { opacity: .9; }
        .btn-salvar:disabled { opacity: .6; cursor: not-allowed; }

        /* Split layout */
        .editor-layout {
          display: grid;
          grid-template-columns: 460px 1fr;
          height: calc(100vh - 56px);
          overflow: hidden;
        }

        /* Left panel */
        .editor-panel {
          background: white;
          border-right: 1px solid var(--rose-mid);
          display: flex; flex-direction: column;
          overflow: hidden;
        }

        /* Tabs */
        .tabs {
          display: flex; border-bottom: 1px solid var(--rose-mid);
          padding: 0 16px; gap: 4px; flex-shrink: 0;
        }
        .tab {
          padding: 14px 16px; font-size: .85rem; font-weight: 700;
          color: var(--text-soft); cursor: pointer; border: none;
          background: none; border-bottom: 2px solid transparent;
          transition: color .2s, border-color .2s;
          white-space: nowrap;
        }
        .tab.active { color: var(--rose); border-bottom-color: var(--rose); }
        .tab:hover:not(.active) { color: var(--text); }

        /* Form scroll */
        .form-scroll { flex: 1; overflow-y: auto; padding: 24px; }
        .form-scroll::-webkit-scrollbar { width: 4px; }
        .form-scroll::-webkit-scrollbar-track { background: transparent; }
        .form-scroll::-webkit-scrollbar-thumb { background: var(--rose-mid); border-radius: 2px; }

        /* Fields */
        .field { margin-bottom: 20px; }
        .field label {
          display: block; font-size: .82rem; font-weight: 700;
          color: var(--text); margin-bottom: 6px;
        }
        .field label span { font-weight: 400; color: var(--text-soft); }
        .field input, .field textarea {
          width: 100%; border: 2px solid var(--rose-mid); border-radius: 10px;
          padding: 10px 14px; font-size: .9rem; font-family: 'Lato', sans-serif;
          color: var(--text); background: var(--cream); outline: none;
          transition: border-color .2s, box-shadow .2s; resize: none;
        }
        .field input:focus, .field textarea:focus {
          border-color: var(--rose); box-shadow: 0 0 0 3px rgba(232,98,122,.1);
          background: white;
        }

        .section-title {
          font-size: .75rem; font-weight: 700; letter-spacing: 1px;
          text-transform: uppercase; color: var(--rose);
          margin-bottom: 14px; margin-top: 4px;
        }

        /* Frases */
        .frase-row { display: flex; gap: 8px; margin-bottom: 10px; align-items: center; }
        .frase-row input { flex: 1; }
        .btn-remove-frase {
          background: none; border: none; cursor: pointer;
          color: #ccc; font-size: 1.1rem; padding: 4px;
          transition: color .2s; flex-shrink: 0;
        }
        .btn-remove-frase:hover { color: var(--rose); }
        .btn-add-frase {
          background: none; border: 2px dashed var(--rose-mid); border-radius: 8px;
          width: 100%; padding: 8px; font-size: .82rem; color: var(--text-soft);
          cursor: pointer; transition: all .2s; margin-top: 4px;
        }
        .btn-add-frase:hover { border-color: var(--rose); color: var(--rose); }

        /* Emoji picker */
        .emoji-grid {
          display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;
        }
        .emoji-btn {
          width: 40px; height: 40px; border-radius: 10px;
          border: 2px solid var(--rose-mid); background: var(--cream);
          font-size: 1.2rem; cursor: pointer; transition: all .2s;
          display: flex; align-items: center; justify-content: center;
        }
        .emoji-btn:hover, .emoji-btn.selected {
          border-color: var(--rose); background: var(--rose-pale);
          transform: scale(1.1);
        }

        /* Color pickers */
        .color-row { display: flex; gap: 12px; }
        .color-field { flex: 1; }
        .color-field label { display: block; font-size: .8rem; font-weight: 700; color: var(--text); margin-bottom: 6px; }
        .color-picker-wrap {
          display: flex; align-items: center; gap: 10px;
          border: 2px solid var(--rose-mid); border-radius: 10px;
          padding: 8px 12px; background: var(--cream);
        }
        .color-picker-wrap input[type=color] {
          width: 28px; height: 28px; border: none; border-radius: 6px;
          padding: 0; cursor: pointer; background: none;
        }
        .color-picker-wrap span { font-size: .82rem; color: var(--text-soft); }

        /* Upload areas */
        .upload-area {
          border: 2px dashed var(--rose-mid); border-radius: 12px;
          padding: 20px; text-align: center; cursor: pointer;
          transition: all .2s; background: var(--cream);
        }
        .upload-area:hover { border-color: var(--rose); background: var(--rose-pale); }
        .upload-area p { font-size: .85rem; color: var(--text-soft); margin-top: 6px; }
        .upload-area .icon { font-size: 1.6rem; }

        .fotos-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
        .foto-thumb {
          position: relative; width: 64px; height: 64px;
        }
        .foto-thumb img {
          width: 100%; height: 100%; object-fit: cover;
          border-radius: 8px; border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,.1);
        }
        .foto-thumb button {
          position: absolute; top: -6px; right: -6px;
          width: 18px; height: 18px; border-radius: 50%;
          background: var(--rose); color: white; border: none;
          font-size: .65rem; cursor: pointer; display: flex;
          align-items: center; justify-content: center;
        }

        .musica-info {
          display: flex; align-items: center; gap: 10px;
          background: var(--rose-pale); border-radius: 10px;
          padding: 10px 14px; margin-bottom: 10px;
          font-size: .85rem; color: var(--text-soft);
        }
        .musica-info button {
          margin-left: auto; background: none; border: none;
          color: var(--rose); cursor: pointer; font-size: .8rem; font-weight: 700;
        }

        /* Erro */
        .erro-box {
          background: #fff0f2; border: 1px solid var(--rose-light);
          border-radius: 8px; padding: 10px 14px;
          font-size: .83rem; color: #c0415a; margin-bottom: 16px;
        }
        .erro-toast {
          position: fixed; top: 72px; left: 50%; transform: translateX(-50%);
          background: #c0415a; color: white;
          padding: 14px 24px; border-radius: 12px;
          font-size: .9rem; font-weight: 600;
          box-shadow: 0 8px 32px rgba(0,0,0,.2);
          z-index: 9999; max-width: 480px; width: 90%;
          text-align: center; animation: slideDown .3s ease;
        }
        @keyframes slideDown { from { opacity:0; transform: translateX(-50%) translateY(-16px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }

        /* Right preview */
        .preview-panel {
          background: #f5f0f2;
          display: flex; flex-direction: column;
          overflow: hidden;
        }
        .preview-header {
          padding: 12px 20px;
          background: white; border-bottom: 1px solid var(--rose-mid);
          font-size: .8rem; color: var(--text-soft);
          display: flex; align-items: center; gap: 6px; flex-shrink: 0;
        }
        .preview-header span { width: 8px; height: 8px; border-radius: 50%; background: #4caf50; display: inline-block; }
        .preview-body {
          flex: 1; overflow: hidden;
          padding: 24px; display: flex; align-items: center; justify-content: center;
        }
        .preview-frame {
          width: 100%; max-width: 420px; height: 100%;
          border-radius: 20px; overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,.15);
        }

        @media (max-width: 900px) {
          .editor-layout { grid-template-columns: 1fr; }
          .preview-panel { display: none; }
          body { overflow: auto; }
        }
      `}</style>

      {/* Toast de erro — fixo no topo, sempre visível */}
      {erro && (
        <div className="erro-toast" onClick={() => setErro('')}>
          ⚠️ {erro} <span style={{ marginLeft: 12, opacity: .7, fontSize: '.8rem' }}>clique para fechar</span>
        </div>
      )}

      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <Link href="/" className="nav-logo">Presentim</Link>
          <span className="nav-title">/ <span>Novo presente</span></span>
        </div>
        <div className="navbar-right">
          <Link href="/dashboard" className="btn-cancelar">Cancelar</Link>
          <button className="btn-salvar" onClick={handleSalvar} disabled={saving}>
            {saving ? '⏳ Salvando…' : '✓ Publicar presente'}
          </button>
        </div>
      </nav>

      <div className="editor-layout">
        {/* ── Painel esquerdo ── */}
        <div className="editor-panel">
          <div className="tabs">
            {tabs.map((t, i) => (
              <button key={t} className={`tab ${step === i ? 'active' : ''}`} onClick={() => setStep(i)}>{t}</button>
            ))}
          </div>

          <div className="form-scroll">
            {erro && <div className="erro-box">{erro}</div>}

            {/* ── ABA 0: CONTEÚDO ── */}
            {step === 0 && (
              <>
                <p className="section-title">Textos principais</p>

                <div className="field">
                  <label>Título <span>(aparece após abrir)</span></label>
                  <input value={cfg.titulo} onChange={e => set('titulo', e.target.value)} placeholder="Ex: Feliz aniversário, amor!" maxLength={60} />
                </div>

                <div className="field">
                  <label>Texto do botão</label>
                  <input value={cfg.texto_botao} onChange={e => set('texto_botao', e.target.value)} placeholder="Ex: Vamos lá" maxLength={30} />
                </div>

                <div className="field">
                  <label>Mensagem final <span>(encerramento)</span></label>
                  <textarea rows={2} value={cfg.texto_final} onChange={e => set('texto_final', e.target.value)} placeholder="Ex: Te amo muito! 💝" maxLength={120} />
                </div>

                <p className="section-title" style={{ marginTop: 8 }}>Frases das fotos</p>
                <p style={{ fontSize: '.8rem', color: 'var(--text-soft)', marginBottom: 12 }}>
                  Essas frases aparecem animadas enquanto a pessoa rola a página.
                </p>

                {cfg.frases.map((f, i) => (
                  <div className="frase-row" key={i}>
                    <input
                      value={f}
                      onChange={e => setFrase(i, e.target.value)}
                      placeholder={`Frase ${i + 1}…`}
                      maxLength={120}
                    />
                    {cfg.frases.length > 1 && (
                      <button className="btn-remove-frase" onClick={() => removeFrase(i)}>✕</button>
                    )}
                  </div>
                ))}
                {cfg.frases.length < 5 && cfg.frases.length < cfg.fotos.length && (
                  <button className="btn-add-frase" onClick={addFrase}>+ Adicionar frase</button>
                )}

                {/* Aviso em tempo real de desbalanceamento */}
                {(() => {
                  const fv = cfg.frases.filter(Boolean).length
                  const ft = cfg.fotos.length
                  if (ft === 0 && fv === 0) return null
                  if (fv === ft) return (
                    <p style={{ fontSize: '.78rem', color: '#4caf50', marginTop: 8 }}>
                      ✅ {ft} foto{ft !== 1 ? 's' : ''} e {fv} frase{fv !== 1 ? 's' : ''} — tudo certo!
                    </p>
                  )
                  if (fv > ft) return (
                    <p style={{ fontSize: '.78rem', color: '#e53935', marginTop: 8 }}>
                      ⚠️ {fv} frases para {ft} foto{ft !== 1 ? 's' : ''}. Adicione {fv - ft} foto{fv - ft !== 1 ? 's' : ''} ou remova {fv - ft} frase{fv - ft !== 1 ? 's' : ''}.
                    </p>
                  )
                  if (ft > fv && fv > 0) return (
                    <p style={{ fontSize: '.78rem', color: '#f57c00', marginTop: 8 }}>
                      ⚠️ {ft} fotos para {fv} frase{fv !== 1 ? 's' : ''}. Adicione {ft - fv} frase{ft - fv !== 1 ? 's' : ''} ou remova {ft - fv} foto{ft - fv !== 1 ? 's' : ''}.
                    </p>
                  )
                  return null
                })()}

                <p className="section-title" style={{ marginTop: 20 }}>Fotos</p>
                {cfg.fotos.length > 0 && (
                  <div className="fotos-grid">
                    {cfg.fotos.map((url, i) => (
                      <div className="foto-thumb" key={i}>
                        <img src={url} alt="" />
                        <button onClick={() => removerFoto(i)}>✕</button>
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
                      <div>
                        <div style={{ fontSize:'.82rem', fontWeight:700, color:'var(--text)' }}>{cfg.musica_info.title}</div>
                        <div style={{ fontSize:'.72rem', color:'var(--text-soft)' }}>YouTube</div>
                      </div>
                    </div>
                    <button onClick={() => { set('musica_info', null); setMusicaLink('') }}>Remover</button>
                  </div>
                ) : cfg.musica_url ? (
                  <div className="musica-info">
                    🎵 Arquivo de música adicionado
                    <button onClick={() => set('musica_url', '')}>Remover</button>
                  </div>
                ) : (
                  <>
                    <div style={{ display:'flex', gap:0, marginBottom:12, borderRadius:10, overflow:'hidden', border:'2px solid var(--rose-mid)' }}>
                      {['▶️ YouTube', '📁 Upload MP3'].map((t, i) => (
                        <button key={t} onClick={() => setMusicaTab(i)}
                          style={{ flex:1, padding:'9px 0', border:'none', cursor:'pointer', fontFamily:'Lato,sans-serif', fontSize:'.83rem', fontWeight:700,
                            background: musicaTab===i ? 'var(--rose)' : 'white',
                            color: musicaTab===i ? 'white' : 'var(--text-soft)', transition:'all .2s' }}>{t}</button>
                      ))}
                    </div>

                    {musicaTab === 0 ? (
                      <>
                        <div style={{ display:'flex', gap:8, marginBottom:8 }}>
                          <input
                            style={{ flex:1, padding:'10px 14px', border:'2px solid var(--rose-mid)', borderRadius:10, fontFamily:'Lato,sans-serif', fontSize:'.88rem', outline:'none' }}
                            type="url"
                            placeholder="Cole o link do YouTube…"
                            value={musicaLink}
                            onChange={e => setMusicaLink(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleMusicaYouTube()}
                          />
                          <button onClick={handleMusicaYouTube} disabled={musicaLoading || !musicaLink}
                            style={{ padding:'10px 16px', background:'var(--rose)', color:'white', border:'none', borderRadius:10, fontWeight:700, cursor:'pointer', opacity: (!musicaLink || musicaLoading) ? .5 : 1 }}>
                            {musicaLoading ? '⏳' : 'OK'}
                          </button>
                        </div>
                        {musicaErro && <p style={{ fontSize:'.75rem', color:'#c0415a', marginBottom:6 }}>{musicaErro}</p>}
                        <p style={{ fontSize:'.75rem', color:'var(--text-soft)', lineHeight:1.5 }}>
                          ✅ Funciona com qualquer vídeo público do YouTube
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="upload-area" onClick={() => musicInputRef.current?.click()}>
                          <div className="icon">{uploadingMusica ? '⏳' : '🎵'}</div>
                          <p>{uploadingMusica ? 'Enviando…' : 'Clique para adicionar música (MP3, máx 10MB)'}</p>
                        </div>
                        <input ref={musicInputRef} type="file" accept="audio/mpeg,audio/mp3" style={{ display:'none' }} onChange={handleMusicaUpload} />
                      </>
                    )}
                  </>
                )}

                {/* ── Roleta ── */}
                <p className="section-title" style={{ marginTop: 24 }}>
                  Roleta do próximo date
                  <span style={{ fontWeight:400, color:'var(--text-soft)', fontSize:'.8rem' }}> (opcional)</span>
                </p>
                <p style={{ fontSize:'.8rem', color:'var(--text-soft)', marginBottom:10, lineHeight:1.5 }}>
                  Ative para adicionar uma roleta interativa com sugestões de encontros.
                </p>
                <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', marginBottom:14 }}>
                  <div
                    onClick={() => set('roleta_ativa', !cfg.roleta_ativa)}
                    style={{
                      width:44, height:24, borderRadius:12,
                      background: cfg.roleta_ativa ? 'var(--rose)' : '#ddd',
                      position:'relative', cursor:'pointer', transition:'background .2s', flexShrink:0,
                    }}
                  >
                    <div style={{
                      position:'absolute', top:3, left: cfg.roleta_ativa ? 23 : 3,
                      width:18, height:18, borderRadius:'50%', background:'white',
                      transition:'left .2s', boxShadow:'0 1px 4px rgba(0,0,0,.2)',
                    }} />
                  </div>
                  <span style={{ fontSize:'.85rem', color:'var(--text)', fontWeight:600 }}>
                    {cfg.roleta_ativa ? '🎡 Roleta ativada' : 'Ativar roleta'}
                  </span>
                </label>

                {cfg.roleta_ativa && (
                  <div style={{ background:'var(--rose-pale)', border:'1px solid var(--rose-mid)', borderRadius:12, padding:'14px 16px', marginBottom:8 }}>
                    <p style={{ fontSize:'.78rem', fontWeight:700, color:'var(--text)', marginBottom:10 }}>Opções da roleta (mín. 2, máx. 10):</p>
                    {cfg.roleta_opcoes.map((op, i) => (
                      <div key={i} style={{ display:'flex', gap:6, marginBottom:6 }}>
                        <input
                          value={op}
                          onChange={e => {
                            const arr = [...cfg.roleta_opcoes]; arr[i] = e.target.value; set('roleta_opcoes', arr)
                          }}
                          placeholder={`Opção ${i+1}…`}
                          maxLength={40}
                          style={{ flex:1, padding:'8px 12px', border:'2px solid var(--rose-mid)', borderRadius:8, fontSize:'.85rem', fontFamily:'Lato,sans-serif', outline:'none', background:'white' }}
                        />
                        {cfg.roleta_opcoes.length > 2 && (
                          <button
                            onClick={() => set('roleta_opcoes', cfg.roleta_opcoes.filter((_, idx) => idx !== i))}
                            style={{ background:'none', border:'none', cursor:'pointer', color:'#ccc', fontSize:'1rem', padding:'0 4px' }}
                          >✕</button>
                        )}
                      </div>
                    ))}
                    {cfg.roleta_opcoes.length < 10 && (
                      <button
                        onClick={() => set('roleta_opcoes', [...cfg.roleta_opcoes, ''])}
                        style={{ background:'none', border:'2px dashed var(--rose-mid)', borderRadius:8, width:'100%', padding:'7px', fontSize:'.8rem', color:'var(--text-soft)', cursor:'pointer', marginTop:4 }}
                      >+ Adicionar opção</button>
                    )}
                  </div>
                )}

                {/* ── Termo ── */}
                <p className="section-title" style={{ marginTop: 24 }}>
                  Jogo de adivinhar a palavra
                  <span style={{ fontWeight:400, color:'var(--text-soft)', fontSize:'.8rem' }}> (opcional)</span>
                </p>
                <p style={{ fontSize:'.8rem', color:'var(--text-soft)', marginBottom:10, lineHeight:1.5 }}>
                  Ative para incluir um mini jogo estilo Wordle. A pessoa tem 5 tentativas para adivinhar.
                </p>
                <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', marginBottom:14 }}>
                  <div
                    onClick={() => set('termo_ativo', !cfg.termo_ativo)}
                    style={{
                      width:44, height:24, borderRadius:12,
                      background: cfg.termo_ativo ? 'var(--rose)' : '#ddd',
                      position:'relative', cursor:'pointer', transition:'background .2s', flexShrink:0,
                    }}
                  >
                    <div style={{
                      position:'absolute', top:3, left: cfg.termo_ativo ? 23 : 3,
                      width:18, height:18, borderRadius:'50%', background:'white',
                      transition:'left .2s', boxShadow:'0 1px 4px rgba(0,0,0,.2)',
                    }} />
                  </div>
                  <span style={{ fontSize:'.85rem', color:'var(--text)', fontWeight:600 }}>
                    {cfg.termo_ativo ? '🎮 Jogo ativado' : 'Ativar jogo de palavras'}
                  </span>
                </label>

                {cfg.termo_ativo && (
                  <div style={{ background:'var(--rose-pale)', border:'1px solid var(--rose-mid)', borderRadius:12, padding:'14px 16px', marginBottom:8, display:'flex', flexDirection:'column', gap:10 }}>
                    <div>
                      <label style={{ fontSize:'.78rem', fontWeight:700, color:'var(--text)', display:'block', marginBottom:4 }}>
                        Palavra secreta <span style={{ fontWeight:400, color:'var(--text-soft)' }}>(sem acento, só letras)</span>
                      </label>
                      <input
                        value={cfg.termo_palavra}
                        onChange={e => set('termo_palavra', e.target.value.toUpperCase().replace(/[^A-ZÁÉÍÓÚÂÊÔÃÕÜÇÀÈÌ]/gi, ''))}
                        placeholder="Ex: AMOR"
                        maxLength={8}
                        style={{ width:'100%', padding:'8px 12px', border:'2px solid var(--rose-mid)', borderRadius:8, fontSize:'.9rem', fontFamily:'Lato,sans-serif', outline:'none', background:'white', textTransform:'uppercase', letterSpacing:2 }}
                      />
                      {cfg.termo_palavra && (
                        <p style={{ fontSize:'.72rem', color:'var(--rose)', marginTop:4 }}>
                          {cfg.termo_palavra.length} letra{cfg.termo_palavra.length !== 1 ? 's' : ''} — a pessoa terá que adivinhar esta palavra
                        </p>
                      )}
                    </div>
                    <div>
                      <label style={{ fontSize:'.78rem', fontWeight:700, color:'var(--text)', display:'block', marginBottom:4 }}>
                        Dica <span style={{ fontWeight:400, color:'var(--text-soft)' }}>(aparece no jogo)</span>
                      </label>
                      <input
                        value={cfg.termo_dica}
                        onChange={e => set('termo_dica', e.target.value)}
                        placeholder="Ex: O que eu mais gosto em você"
                        maxLength={80}
                        style={{ width:'100%', padding:'8px 12px', border:'2px solid var(--rose-mid)', borderRadius:8, fontSize:'.85rem', fontFamily:'Lato,sans-serif', outline:'none', background:'white' }}
                      />
                    </div>
                  </div>
                )}

                {/* ── Link da Retrospectiva ── */}
                <p className="section-title" style={{ marginTop: 24 }}>Vincular Retrospectiva <span style={{ fontWeight:400, color:'var(--text-soft)', fontSize:'.8rem' }}>(opcional)</span></p>
                <p style={{ fontSize:'.8rem', color:'var(--text-soft)', marginBottom:8, lineHeight:1.5 }}>
                  Se você criou uma Retrospectiva para esta pessoa, cole o link abaixo. Um QR Code aparecerá no final da Página para ela poder acessar.
                </p>
                <div className="field">
                  <input
                    type="url"
                    placeholder="https://presentim.app/retrospectiva/seu-slug"
                    value={cfg.retro_slug}
                    onChange={e => {
                      // aceita URL completa ou só o slug
                      const val = e.target.value
                      const match = val.match(/retrospectiva\/([\w-]+)/)
                      set('retro_slug', match ? match[1] : val)
                    }}
                  />
                </div>
                {cfg.retro_slug && (
                  <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:'.78rem', color:'var(--rose)', marginTop:4 }}>
                    ✅ Retrospectiva vinculada: <strong>{cfg.retro_slug}</strong>
                    <button onClick={() => set('retro_slug', '')} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-soft)', fontSize:'.75rem' }}>remover</button>
                  </div>
                )}
              </>
            )}

            {/* ── ABA 1: VISUAL ── */}
            {step === 1 && (
              <>
                <p className="section-title">Emoji do botão</p>
                <div className="emoji-grid">
                  {EMOJIS.map(e => (
                    <button key={e} className={`emoji-btn ${cfg.emoji === e ? 'selected' : ''}`} onClick={() => set('emoji', e)}>{e}</button>
                  ))}
                </div>

                <p className="section-title" style={{ marginTop: 24 }}>Cores</p>
                <div className="color-row">
                  <div className="color-field">
                    <label>Cor principal</label>
                    <div className="color-picker-wrap">
                      <input type="color" value={cfg.cor_primaria} onChange={e => set('cor_primaria', e.target.value)} />
                      <span>{cfg.cor_primaria}</span>
                    </div>
                  </div>
                  <div className="color-field">
                    <label>Cor de fundo</label>
                    <div className="color-picker-wrap">
                      <input type="color" value={cfg.cor_fundo} onChange={e => set('cor_fundo', e.target.value)} />
                      <span>{cfg.cor_fundo}</span>
                    </div>
                  </div>
                </div>

                <p className="section-title" style={{ marginTop: 24 }}>Combinações prontas</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    { nome: 'Rosa', primaria: '#e8627a', fundo: '#ffeef0' },
                    { nome: 'Roxo', primaria: '#9b59b6', fundo: '#f5eeff' },
                    { nome: 'Azul', primaria: '#3b82f6', fundo: '#eff6ff' },
                    { nome: 'Verde', primaria: '#10b981', fundo: '#ecfdf5' },
                    { nome: 'Laranja', primaria: '#f97316', fundo: '#fff7ed' },
                    { nome: 'Vermelho', primaria: '#ef4444', fundo: '#fef2f2' },
                  ].map(t => (
                    <button key={t.nome} onClick={() => { set('cor_primaria', t.primaria); set('cor_fundo', t.fundo) }}
                      style={{
                        background: t.fundo, border: `2px solid ${cfg.cor_primaria === t.primaria ? t.primaria : '#e0d0d4'}`,
                        borderRadius: 10, padding: '10px 14px',
                        display: 'flex', alignItems: 'center', gap: 10,
                        cursor: 'pointer', transition: 'all .2s',
                        fontSize: '.85rem', fontWeight: 700, color: t.primaria,
                      }}>
                      <span style={{ width: 18, height: 18, borderRadius: '50%', background: t.primaria, display: 'inline-block', flexShrink: 0 }} />
                      {t.nome}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* ── ABA 2: DATA ── */}
            {step === 2 && (
              <>
                <p className="section-title">Data de liberação</p>
                <p style={{ fontSize: '.85rem', color: 'var(--text-soft)', marginBottom: 16, lineHeight: 1.6 }}>
                  Defina quando o presente será revelado. Uma contagem regressiva vai aparecer até essa data. Deixe em branco para liberar imediatamente.
                </p>

                <div className="field">
                  <label>Data e hora <span>(opcional)</span></label>
                  <input
                    type="datetime-local"
                    value={cfg.data_liberacao}
                    onChange={e => set('data_liberacao', e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>

                {cfg.data_liberacao && (
                  <div style={{
                    background: 'var(--rose-pale)', border: '1px solid var(--rose-mid)',
                    borderRadius: 12, padding: '16px', marginTop: 8,
                    fontSize: '.85rem', color: 'var(--text-soft)', lineHeight: 1.7,
                  }}>
                    🎉 O presente será revelado em{' '}
                    <strong style={{ color: 'var(--text)' }}>
                      {new Date(cfg.data_liberacao).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })}
                    </strong>
                    . Até lá, quem acessar o link vai ver a contagem regressiva.
                  </div>
                )}

                <button
                  style={{ background: 'none', border: 'none', color: 'var(--rose)', fontSize: '.85rem', cursor: 'pointer', marginTop: 12, fontWeight: 700 }}
                  onClick={() => set('data_liberacao', '')}
                >
                  Limpar data (liberar imediatamente)
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Painel direito: preview ── */}
        <div className="preview-panel">
          <div className="preview-header">
            <span /> Preview em tempo real
          </div>
          <div className="preview-body">
            <div className="preview-frame">
              <Preview cfg={cfg} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}