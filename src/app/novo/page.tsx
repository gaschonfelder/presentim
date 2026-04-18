'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { gerarSlug } from '@/lib/utils'

import Wizard from '@/components/wizard/Wizard'
import type { WizardStepDefinition } from '@/components/wizard/types'

import { NovoProvider, useNovoContext, type Config } from './NovoContext'

import PassoTitulo from './steps/PassoTitulo'
import PassoMensagem from './steps/PassoMensagem'
import PassoFotos from './steps/PassoFotos'
import PassoFrases from './steps/PassoFrases'
import PassoMusica from './steps/PassoMusica'
import PassoVisual from './steps/PassoVisual'
import PassoData from './steps/PassoData'
import PassoExtras from './steps/PassoExtras'

const STORAGE_KEY = 'wizard:novo'
const STORAGE_TTL = 30 * 60 * 1000 // 30 minutos

function NovoWizardContent() {
  const router = useRouter()
  const supabase = createClient()
  const { cfg, setCfg, erro, setErro } = useNovoContext()
  const [saving, setSaving] = useState(false)

  // ─── Submit final ────────────────────────────────────────────────────────────
  async function handleSalvar() {
    // Validação cruzada final (rede de segurança)
    const frasesValidas = cfg.frases.filter(Boolean)
    if (cfg.fotos.length === 0) {
      setErro('Adicione pelo menos 1 foto.')
      return
    }
    if (frasesValidas.length !== cfg.fotos.length) {
      setErro(
        `Você tem ${cfg.fotos.length} foto${cfg.fotos.length !== 1 ? 's' : ''} mas ${frasesValidas.length} frase${frasesValidas.length !== 1 ? 's' : ''}. Volte ao passo de frases pra ajustar.`,
      )
      return
    }

    setSaving(true)
    setErro('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Verifica créditos disponíveis
      const { data: profile } = await supabase
        .from('profiles')
        .select('creditos')
        .eq('id', user.id)
        .single()

      const temCreditos = profile && profile.creditos >= 1

      const slug = gerarSlug()

      const { data: inserted, error } = await supabase.from('presentes').insert({
        user_id: user.id,
        slug,
        titulo: cfg.titulo,
        texto_botao: cfg.texto_botao,
        texto_final: cfg.texto_final,
        frases: frasesValidas,
        fotos: cfg.fotos,
        musica_url: cfg.musica_url || null,
        musica_info: cfg.musica_info || null,
        retro_slug: cfg.retro_slug.trim() || null,
        cor_primaria: cfg.cor_primaria,
        cor_fundo: cfg.cor_fundo,
        gradiente: cfg.gradiente,
        emoji: cfg.emoji,
        data_liberacao: cfg.data_liberacao
          ? new Date(cfg.data_liberacao).toISOString()
          : null,
        roleta_opcoes:
          cfg.roleta_ativa && cfg.roleta_opcoes.filter(Boolean).length > 0
            ? cfg.roleta_opcoes.filter(Boolean)
            : null,
        termo_config:
          cfg.termo_ativo && cfg.termo_palavra.trim()
            ? { palavra: cfg.termo_palavra.trim(), dica: cfg.termo_dica.trim() }
            : null,
        falling_animation: cfg.falling_animation?.enabled ? cfg.falling_animation : null,
        // Novo: status baseado em créditos
        ativo: temCreditos ? true : false,
        status: temCreditos ? 'ativo' : 'rascunho',
      }).select('id').single()

      if (error || !inserted) {
        setErro('Erro ao salvar. Tente novamente.')
        setSaving(false)
        return
      }

      if (temCreditos) {
        // Desconta 1 crédito e vai pro dashboard
        await supabase
          .from('profiles')
          .update({ creditos: profile.creditos - 1 })
          .eq('id', user.id)
        router.push(`/dashboard?criado=${slug}`)
      } else {
        // Sem créditos: redireciona pra tela de liberação
        router.push(`/presente/${inserted.id}/liberar`)
      }
    } catch (err) {
      console.error(err)
      setSaving(false)
    }
  }

  // ─── Definição dos passos ────────────────────────────────────────────────────
  const steps: WizardStepDefinition[] = [
    {
      key: 'titulo',
      label: 'Título',
      icon: '✏️',
      component: PassoTitulo,
      isValid: () => !!cfg.titulo.trim() && !!cfg.texto_botao.trim(),
      invalidHint: 'Preencha o título e o texto do botão pra continuar',
    },
    {
      key: 'mensagem',
      label: 'Mensagem',
      icon: '💌',
      component: PassoMensagem,
      isValid: () => !!cfg.texto_final.trim(),
      invalidHint: 'Escreva a mensagem final pra continuar',
    },
    {
      key: 'fotos',
      label: 'Fotos',
      icon: '📷',
      component: PassoFotos,
      isValid: () => cfg.fotos.length > 0,
      invalidHint: 'Adicione pelo menos 1 foto pra continuar',
    },
    {
      key: 'frases',
      label: 'Frases',
      icon: '💭',
      component: PassoFrases,
      isValid: () => {
        const fv = cfg.frases.filter(Boolean).length
        return cfg.fotos.length > 0 && fv === cfg.fotos.length
      },
      invalidHint: 'Cada foto precisa de uma frase correspondente',
    },
    {
      key: 'musica',
      label: 'Música',
      icon: '🎵',
      component: PassoMusica,
      optional: true,
    },
    {
      key: 'visual',
      label: 'Visual',
      icon: '🎨',
      component: PassoVisual,
      isValid: () => !!cfg.emoji && !!cfg.cor_primaria && !!cfg.cor_fundo,
    },
    {
      key: 'data',
      label: 'Data',
      icon: '📅',
      component: PassoData,
      optional: true,
    },
    {
      key: 'extras',
      label: 'Extras',
      icon: '✨',
      component: PassoExtras,
      optional: true,
    },
  ]

  function handleRestore(restored: Config) {
    setCfg(restored)
  }

  return (
    <>
      {erro && (
        <div
          style={{
            position: 'fixed',
            top: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            background: '#c0415a',
            color: 'white',
            padding: '10px 18px',
            borderRadius: 50,
            fontSize: '0.85rem',
            boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
            maxWidth: 'calc(100% - 24px)',
            textAlign: 'center',
          }}
          onClick={() => setErro('')}
        >
          ⚠️ {erro}
        </div>
      )}

      {/* Navbar simples */}
      <nav
        style={{
          background: 'white',
          borderBottom: '1px solid var(--rose-mid)',
          padding: '0 20px',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link href="/" className="nav-logo">
          <Image src="/logo.png" alt="Presentim" width={1024} height={272} priority style={{ height: 44, width: 'auto' }} />
        </Link>
        <Link
          href="/dashboard"
          style={{
            fontSize: '0.85rem',
            color: 'var(--text-soft)',
            textDecoration: 'none',
          }}
        >
          Cancelar
        </Link>
      </nav>

      <Wizard
        steps={steps}
        data={cfg}
        storageKey={STORAGE_KEY}
        storageTTL={STORAGE_TTL}
        onRestore={handleRestore}
        onSubmit={handleSalvar}
        submitting={saving}
        submitLabel="Criar presente"
      />
    </>
  )
}

export default function NovoPage() {
  return (
    <NovoProvider>
      <NovoWizardContent />
    </NovoProvider>
  )
}