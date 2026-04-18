'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Presente, Profile } from '@/types'

import CardsResumo from './components/CardsResumo'
import ListaPresentes from './components/ListaPresentes'
import ModalEscolherTipo from './components/ModalEscolherTipo'
import ModalCompartilhar from './components/ModalCompartilhar'
import Toast from './components/Toast'


import styles from './dashboard.module.css'

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [presentes, setPresentes] = useState<Presente[]>([])
  const [loading, setLoading] = useState(true)
  const [compartilhando, setCompartilhando] = useState<Presente | null>(null)
  const [escolhendoTipo, setEscolhendoTipo] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  // Toast de feedback após criar/editar retrospectiva
  useEffect(() => {
    const retro = searchParams.get('retro')
    if (retro === 'criada') setToast('✨ Retrospectiva criada com sucesso!')
    if (retro === 'editada') setToast('💾 Alterações salvas!')
    if (retro) {
      const t = setTimeout(() => setToast(null), 4000)
      return () => clearTimeout(t)
    }
  }, [searchParams])

  // Carregar profile + presentes em paralelo
  useEffect(() => {
    async function carregar() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const [profRes, presRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase
          .from('presentes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
      ])

      setProfile(profRes.data)
      setPresentes(presRes.data ?? [])
      setLoading(false)
    }
    carregar()
  }, [router, supabase])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  async function handleDeletar(id: string) {
    if (!confirm('Tem certeza que deseja excluir este presente?')) return
    await supabase.from('presentes').delete().eq('id', id)
    setPresentes((prev) => prev.filter((p) => p.id !== id))
  }

  function handleNovo() {
    // Agora permite criar mesmo sem créditos — pagamento é no final
    setEscolhendoTipo(true)
  }

  if (loading) {
    return <div className={styles.loading}>Carregando… 💝</div>
  }

  const nomeExibido = profile?.nome?.split(' ')[0] ?? 'você'
  const totalVisualizacoes = presentes.reduce(
    (acc, p) => acc + (p.visualizacoes ?? 0),
    0,
  )

  return (
    <>
      {escolhendoTipo && (
        <ModalEscolherTipo
          creditos={profile?.creditos ?? 0}
          onClose={() => setEscolhendoTipo(false)}
        />
      )}

      {compartilhando && (
        <ModalCompartilhar
          slug={compartilhando.slug}
          cor={compartilhando.cor_primaria ?? '#e8627a'}
          tipo={(compartilhando as Presente & { tipo?: string }).tipo}
          onClose={() => setCompartilhando(null)}
        />
      )}

      {toast && <Toast mensagem={toast} />}

      <nav className={styles.navbar}>
        <Link href="/" className="nav-logo">
          <Image src="/logo.png" alt="Presentim" width={1024} height={272} priority style={{ height: 44, width: 'auto' }} />
        </Link>
        <div className={styles.navbarRight}>
          <span className={styles.navbarUser}>Olá, {nomeExibido} 👋</span>
          <button className={styles.btnLogout} onClick={handleLogout}>
            Sair
          </button>
        </div>
      </nav>

      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1>
            Meus <em>presentes</em>
          </h1>
          <p>Gerencie e acompanhe todos os presentes que você criou.</p>
        </div>

        <CardsResumo
          creditos={profile?.creditos ?? 0}
          totalPresentes={presentes.length}
          totalVisualizacoes={totalVisualizacoes}
        />

        <div className={styles.sectionHeader}>
          <h2>Seus presentes</h2>
          <button className={styles.btnNovo} onClick={handleNovo}>
            + Criar presente
          </button>
        </div>

        <ListaPresentes
          presentes={presentes}
          onNovo={handleNovo}
          onCompartilhar={setCompartilhando}
          onDeletar={handleDeletar}
        />
      </div>
    </>
  )
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={<div style={{ minHeight: '100vh', background: '#fff8f9' }} />}
    >
      <DashboardContent />
    </Suspense>
  )
}