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
import CodigoResgate from './components/CodigoResgate'
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap');
        body { background: #150810 !important; color: #f5e8ec !important; font-family: 'Inter', system-ui, sans-serif !important; }
      `}</style>

      <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden', background: '#150810', color: '#f5e8ec', fontFamily: 'Inter,system-ui,sans-serif' }}>
        {/* Ambient glows */}
        <div aria-hidden="true" style={{ position: 'absolute', top: -200, right: -200, width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,98,122,.35), transparent 65%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: 600, left: -200, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(120,80,200,.22), transparent 65%)', filter: 'blur(40px)', pointerEvents: 'none', opacity: 0.8 }} />

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
          <Link href="/">
            <Image src="/logo.png" alt="Presentim" width={1024} height={272} priority style={{ height: 38, width: 'auto', filter: 'brightness(0) invert(1)' }} />
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

          <CodigoResgate
            onSucesso={(creditos) => {
              setProfile(prev => prev ? { ...prev, creditos: (prev.creditos ?? 0) + creditos } : prev)
              setToast(`🎉 +${creditos} crédito${creditos > 1 ? 's' : ''} adicionado${creditos > 1 ? 's' : ''}!`)
              setTimeout(() => setToast(null), 4000)
            }}
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
      </div>
    </>
  )
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={<div style={{ minHeight: '100vh', background: '#150810' }} />}
    >
      <DashboardContent />
    </Suspense>
  )
}