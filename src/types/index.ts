export type Profile = {
  id: string
  nome: string | null
  creditos: number
  created_at: string
}

export type TermoConfig = {
  palavra: string
  dica: string
}

export type Presente = {
  id: string
  user_id: string
  slug: string
  titulo: string | null
  texto_botao: string
  texto_final: string | null
  frases: string[]
  fotos: string[]
  musica_url: string | null
  musica_info: { videoId: string; title: string } | null
  retro_slug: string | null
  cor_primaria: string
  cor_fundo: string
  emoji: string
  data_liberacao: string | null
  visualizacoes: number
  ativo: boolean
  created_at: string
  roleta_opcoes: string[] | null
  termo_config: TermoConfig | null
}

export type Pagamento = {
  id: string
  user_id: string
  mp_payment_id: string | null
  tipo: 'avulso' | 'combo'
  valor: number
  status: 'pendente' | 'aprovado' | 'recusado'
  creditos_adicionados: number
  created_at: string
}

export type PresenteConfig = Omit<Presente,
  'id' | 'user_id' | 'slug' | 'visualizacoes' | 'ativo' | 'created_at'
>