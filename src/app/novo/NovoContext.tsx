'use client'

import { createContext, useContext, useState, useRef, type RefObject, type PropsWithChildren } from 'react'
import { type FallingAnimation, DEFAULT_FALLING_ANIMATION } from '@/lib/falling-animation'

// ─── Tipos ─────────────────────────────────────────────────────────────────────
export type MusicaInfo = { videoId: string; title: string }

export type Config = {
  titulo: string
  texto_botao: string
  texto_final: string
  frases: string[]
  cor_primaria: string
  cor_fundo: string
  gradiente: string | null
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
  falling_animation: FallingAnimation
}

export const DEFAULTS: Config = {
  titulo: 'Feliz aniversário, amor!',
  texto_botao: 'Vamos lá',
  texto_final: 'Te amo muito! 💝',
  frases: ['', '', ''],
  cor_primaria: '#e8627a',
  cor_fundo: '#ffeef0',
  gradiente: null,
  emoji: '🎁',
  data_liberacao: '',
  fotos: [],
  musica_url: '',
  musica_info: null,
  retro_slug: '',
  roleta_ativa: false,
  roleta_opcoes: [
    '🍝 Jantar romântico',
    '🎬 Cinema juntinhos',
    '🍦 Tomar sorvete',
    '🌅 Ver o pôr do sol',
    '🧺 Piquenique',
    '🎮 Noite de jogos',
    '🚗 Passeio surpresa',
    '🍕 Noite de pizza',
  ],
  termo_ativo: false,
  termo_palavra: '',
  termo_dica: '',
  falling_animation: DEFAULT_FALLING_ANIMATION,
}

export const EMOJIS = ['🎁', '💝', '💖', '🌸', '🎂', '🥂', '✨', '🦋', '🌹', '💌', '🎉', '🫶']

// ─── Context shape ─────────────────────────────────────────────────────────────
type NovoContextValue = {
  cfg: Config
  setCfg: React.Dispatch<React.SetStateAction<Config>>
  set: <K extends keyof Config>(key: K, val: Config[K]) => void
  setFrase: (i: number, val: string) => void
  addFrase: () => void
  removeFrase: (i: number) => void
  removerFoto: (i: number) => void

  // Estados de upload
  uploadingFoto: boolean
  setUploadingFoto: React.Dispatch<React.SetStateAction<boolean>>
  uploadingMusica: boolean
  setUploadingMusica: React.Dispatch<React.SetStateAction<boolean>>

  // Refs de inputs (cada passo que precisa pega daqui)
  fileInputRef: RefObject<HTMLInputElement | null>
  musicInputRef: RefObject<HTMLInputElement | null>

  // Erro global (passo de submit)
  erro: string
  setErro: React.Dispatch<React.SetStateAction<string>>
}

const NovoContext = createContext<NovoContextValue | null>(null)

export function useNovoContext(): NovoContextValue {
  const ctx = useContext(NovoContext)
  if (!ctx) throw new Error('useNovoContext deve ser usado dentro de <NovoProvider>')
  return ctx
}

// ─── Provider ──────────────────────────────────────────────────────────────────
export function NovoProvider({ children }: PropsWithChildren) {
  const [cfg, setCfg] = useState<Config>(DEFAULTS)
  const [uploadingFoto, setUploadingFoto] = useState(false)
  const [uploadingMusica, setUploadingMusica] = useState(false)
  const [erro, setErro] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const musicInputRef = useRef<HTMLInputElement>(null)

  function set<K extends keyof Config>(key: K, val: Config[K]) {
    setCfg(prev => ({ ...prev, [key]: val }))
  }

  function setFrase(i: number, val: string) {
    setCfg(prev => {
      const arr = [...prev.frases]
      arr[i] = val
      return { ...prev, frases: arr }
    })
  }

  function addFrase() {
    setCfg(prev => {
      if (prev.frases.length >= 5) return prev
      return { ...prev, frases: [...prev.frases, ''] }
    })
  }

  function removeFrase(i: number) {
    setCfg(prev => ({ ...prev, frases: prev.frases.filter((_, idx) => idx !== i) }))
  }

  function removerFoto(i: number) {
    setCfg(prev => ({ ...prev, fotos: prev.fotos.filter((_, idx) => idx !== i) }))
  }

  const value: NovoContextValue = {
    cfg,
    setCfg,
    set,
    setFrase,
    addFrase,
    removeFrase,
    removerFoto,
    uploadingFoto,
    setUploadingFoto,
    uploadingMusica,
    setUploadingMusica,
    fileInputRef,
    musicInputRef,
    erro,
    setErro,
  }

  return <NovoContext.Provider value={value}>{children}</NovoContext.Provider>
}