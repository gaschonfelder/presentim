'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { gerarSlug } from '@/lib/utils'
import StreamingPlayer from '@/app/streaming/[slug]/StreamingPlayer'
import type { StreamingDados } from '@/app/streaming/[slug]/page'
import {
  REACOES_PUBLICO,
  PREMIACOES,
  MARCOS_HISTORIA,
} from '@/app/streaming/[slug]/SlideConquistas'

// ─── Constantes ───────────────────────────────────────────────────────────────

const CUSTO_CREDITOS = 2
const MAX_FOTOS = 6
const MAX_QUIZ = 3

const STEPS = [
  { label: 'O Casal', icon: '💑' },
  { label: 'Sinopse', icon: '📝' },
  { label: 'Episódios', icon: '📸' },
  { label: 'Conquistas', icon: '🏆' },
  { label: 'Quiz', icon: '🎮' },
  { label: 'Declaração', icon: '💌' },
  { label: 'Música', icon: '🎵' },
  { label: 'Criar', icon: '🚀' },
]

type MusicaInfo = { videoId: string; title: string; thumb: string }
type QuizItem = { pergunta: string; opcoes: string[]; correta: number }
type YTResult = { videoId: string; title: string; channel: string; thumb: string }

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extrairVideoId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('?')[0]
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v')
      if (v) return v
      const shorts = u.pathname.match(/\/shorts\/([^/?]+)/)
      if (shorts) return shorts[1]
    }
  } catch {}
  return null
}

function decodeHTML(str: string) {
  const el = typeof document !== 'undefined' ? document.createElement('textarea') : null
  if (!el) return str
  el.innerHTML = str
  return el.value
}

// ─── FirstSlidePreview ────────────────────────────────────────────────────────

function FirstSlidePreview({ nome1, nome2, dataInicio, cidade, foto }: {
  nome1: string; nome2: string; dataInicio: string; cidade: string; foto?: string | null
}) {
  const ano = dataInicio ? new Date(dataInicio).getFullYear() : new Date().getFullYear()
  const n1 = nome1 || 'Nome 1'
  const n2 = nome2 || 'Nome 2'

  return (
    <div style={{ minHeight: '100%', background: '#000', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '32px 24px 40px', fontFamily: "'Inter', sans-serif", position: 'relative', overflow: 'hidden' }}>
      {/* Background photo */}
      {foto && (
        <img src={foto} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
      )}
      {/* Gradient overlay — stronger when there's a photo */}
      <div style={{ position: 'absolute', inset: 0, background: foto ? 'linear-gradient(180deg, rgba(0,0,0,.1) 0%, rgba(0,0,0,.7) 40%, #000 75%)' : 'linear-gradient(180deg, rgba(229,9,20,.08) 0%, #000 60%)', pointerEvents: 'none' }} />
      {/* Netflix-style N logo */}
      <div style={{ position: 'absolute', top: 20, left: 20, fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#E50914', letterSpacing: 2 }}>N</div>

      <div style={{ position: 'relative' }}>
        {/* Names */}
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(42px, 10vw, 72px)', lineHeight: 1, color: '#fff', letterSpacing: 2, marginBottom: 12 }}>
          {n1}<br /><span style={{ color: 'rgba(255,255,255,.4)', fontSize: '0.55em' }}>&</span><br />{n2}
        </div>

        {/* Meta row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,.6)' }}>{ano}</span>
          <span style={{ background: '#E50914', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 5px', borderRadius: 3 }}>L</span>
          {cidade && <span style={{ fontSize: 13, color: 'rgba(255,255,255,.5)' }}>📍 {cidade}</span>}
          <span style={{ border: '1px solid rgba(255,255,255,.3)', color: 'rgba(255,255,255,.5)', fontSize: 10, padding: '1px 5px', borderRadius: 3 }}>HD</span>
        </div>

        {/* Sinopse placeholder */}
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,.35)', lineHeight: 1.5, marginBottom: 20, fontStyle: 'italic' }}>
          Disponível após a criação...
        </div>

        {/* Lock message */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(229,9,20,.08)', border: '1px solid rgba(229,9,20,.2)', borderRadius: 8 }}>
          <span style={{ fontSize: 16 }}>🔒</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', lineHeight: 1.4 }}>O restante da série é revelado<br />após a criação</span>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StreamingNovoPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [creditos, setCreditos] = useState(0)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [step, setStep] = useState(0)
  const [showPreview, setShowPreview] = useState(false)

  // Form fields
  const [nome1, setNome1] = useState('')
  const [nome2, setNome2] = useState('')
  const [dataInicio, setDataInicio] = useState('')
  const [cidade, setCidade] = useState('')
  const [sinopse, setSinopse] = useState('')
  const [fotos, setFotos] = useState<(string | null)[]>(Array(MAX_FOTOS).fill(null))
  const [fotosTitulos, setFotosTitulos] = useState<string[]>(Array(MAX_FOTOS).fill(''))
  const [fotosDescricoes, setFotosDescricoes] = useState<string[]>(Array(MAX_FOTOS).fill(''))
  const [conquistas, setConquistas] = useState<string[]>([])
  const [quiz, setQuiz] = useState<QuizItem[]>([])
  const [msgFinal, setMsgFinal] = useState('')
  const [posCreditos, setPosCreditos] = useState('')
  const [uploadando, setUploadando] = useState<number | null>(null)

  // Música
  const [musicaTab, setMusicaTab] = useState<'busca' | 'link'>('busca')
  const [musicaLink, setMusicaLink] = useState('')
  const [musicaInfo, setMusicaInfo] = useState<MusicaInfo | null>(null)
  const [musicaErro, setMusicaErro] = useState('')
  const [ytQuery, setYtQuery] = useState('')
  const [ytResults, setYtResults] = useState<YTResult[]>([])
  const [ytLoading, setYtLoading] = useState(false)
  const ytTimerRef = useRef<NodeJS.Timeout | null>(null)

  const fotosPreenchidas = fotos.filter(Boolean) as string[]
  const titulosPreenchidos = fotosTitulos.filter((_, i) => fotos[i])

  // ─── Auth check ─────────────────────────────────────────────────────────────
  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: prof } = await supabase.from('profiles').select('creditos').eq('id', user.id).single()
      setCreditos(prof?.creditos ?? 0)
      setLoading(false)
    }
    check()
  }, [])

  // ─── Preview data ───────────────────────────────────────────────────────────
  // Preview mostra apenas a primeira tela (O Casal) para proteger o conteúdo
  const previewDados: StreamingDados = useMemo(() => ({
    nome1: nome1 || 'Nome 1',
    nome2: nome2 || 'Nome 2',
    data_inicio: dataInicio || '2024-01-01',
    cidade: cidade || 'Sua cidade',
    mensagem: '',
    msg_final: '',
    pos_creditos: '',
    sinopse: 'Disponível após a criação...',
    conquistas: [],
    fotos: [],
    fotos_titulos: [],
    musica: null,
    quiz: null,
  }), [nome1, nome2, dataInicio, cidade])

  // ─── Validation ─────────────────────────────────────────────────────────────
  function validateStep(s: number): string | null {
    switch (s) {
      case 0:
        if (!nome1.trim()) return 'Preencha o nome 1'
        if (!nome2.trim()) return 'Preencha o nome 2'
        if (!dataInicio) return 'Escolha a data de início'
        return null
      case 1: return !sinopse.trim() ? 'Escreva a sinopse' : null
      case 2: return fotosPreenchidas.length === 0 ? 'Adicione pelo menos 1 foto' : null
      case 5: return !msgFinal.trim() ? 'Escreva a declaração final' : null
      default: return null
    }
  }

  function nextStep() {
    const err = validateStep(step)
    if (err) { setErro(err); return }
    setErro(''); setStep(s => Math.min(s + 1, STEPS.length - 1))
  }
  function prevStep() { setErro(''); setStep(s => Math.max(s - 1, 0)) }

  // ─── Upload foto ────────────────────────────────────────────────────────────
  async function handleFotoUpload(e: React.ChangeEvent<HTMLInputElement>, startIdx: number) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    // Find available slots from startIdx onward
    const availableSlots: number[] = []
    for (let i = startIdx; i < MAX_FOTOS && availableSlots.length < files.length; i++) {
      if (!fotos[i]) availableSlots.push(i)
    }
    // If startIdx slot is already filled, find next empty
    if (availableSlots.length === 0) {
      for (let i = 0; i < MAX_FOTOS && availableSlots.length < files.length; i++) {
        if (!fotos[i]) availableSlots.push(i)
      }
    }
    for (let fi = 0; fi < Math.min(files.length, availableSlots.length); fi++) {
      const file = files[fi]
      const idx = availableSlots[fi]
      setUploadando(idx)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        const ext = file.name.split('.').pop()
        const path = `${user!.id}/streaming-${Date.now()}-${idx}.${ext}`
        const { error } = await supabase.storage.from('fotos').upload(path, file, { upsert: true })
        if (error) throw error
        const { data: { publicUrl } } = supabase.storage.from('fotos').getPublicUrl(path)
        setFotos(prev => { const n = [...prev]; n[idx] = publicUrl; return n })
      } catch { setErro('Erro no upload.') }
      finally { setUploadando(null) }
    }
  }

  function removeFoto(idx: number) {
    setFotos(prev => { const n = [...prev]; n[idx] = null; return n })
    setFotosTitulos(prev => { const n = [...prev]; n[idx] = ''; return n })
    setFotosDescricoes(prev => { const n = [...prev]; n[idx] = ''; return n })
  }

  // ─── YouTube Search ─────────────────────────────────────────────────────────
  const handleYtSearch = useCallback((query: string) => {
    setYtQuery(query)
    if (ytTimerRef.current) clearTimeout(ytTimerRef.current)
    if (query.trim().length < 2) { setYtResults([]); return }

    ytTimerRef.current = setTimeout(async () => {
      setYtLoading(true)
      try {
        const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(query.trim())}`)
        const data = await res.json()
        if (data.results) {
          setYtResults(data.results.map((r: YTResult) => ({
            ...r,
            title: decodeHTML(r.title),
            channel: decodeHTML(r.channel),
          })))
        }
      } catch { /* silent */ }
      finally { setYtLoading(false) }
    }, 500) // debounce 500ms
  }, [])

  function selectYtResult(r: YTResult) {
    setMusicaInfo({ videoId: r.videoId, title: r.title, thumb: r.thumb })
    setMusicaLink(`https://www.youtube.com/watch?v=${r.videoId}`)
    setYtQuery('')
    setYtResults([])
  }

  // ─── Música via link ────────────────────────────────────────────────────────
  async function handleMusicaLink(url: string) {
    setMusicaLink(url); setMusicaErro(''); setMusicaInfo(null)
    if (!url.trim()) return
    const videoId = extrairVideoId(url.trim())
    if (!videoId) { setMusicaErro('Link inválido. Cole um link do YouTube.'); return }
    try {
      const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setMusicaInfo({ videoId, title: data.title, thumb: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` })
    } catch { setMusicaErro('Não foi possível carregar. Verifique o link.') }
  }

  // ─── Conquistas ─────────────────────────────────────────────────────────────
  function toggleConquista(key: string, exclusiveGroup?: string[]) {
    setConquistas(prev => {
      if (prev.includes(key)) return prev.filter(k => k !== key)
      if (exclusiveGroup) return [...prev.filter(k => !exclusiveGroup.includes(k)), key]
      return [...prev, key]
    })
  }

  // ─── Quiz ───────────────────────────────────────────────────────────────────
  function addQuiz() { if (quiz.length < MAX_QUIZ) setQuiz(prev => [...prev, { pergunta: '', opcoes: ['', '', '', ''], correta: 0 }]) }
  function updateQuiz(idx: number, field: string, value: any) { setQuiz(prev => prev.map((q, i) => i === idx ? { ...q, [field]: value } : q)) }
  function updateQuizOpcao(qIdx: number, oIdx: number, value: string) {
    setQuiz(prev => prev.map((q, i) => { if (i !== qIdx) return q; const opcoes = [...q.opcoes]; opcoes[oIdx] = value; return { ...q, opcoes } }))
  }
  function removeQuiz(idx: number) { setQuiz(prev => prev.filter((_, i) => i !== idx)) }

  // ─── Salvar ─────────────────────────────────────────────────────────────────
  async function handleSalvar() {
    for (let s = 0; s < STEPS.length - 1; s++) {
      const err = validateStep(s)
      if (err) { setErro(err); setStep(s); return }
    }
    for (const q of quiz) {
      if (!q.pergunta.trim() || q.opcoes.some(o => !o.trim())) {
        setErro('Preencha todas as perguntas e alternativas do quiz.'); setStep(4); return
      }
    }

    setSalvando(true); setErro('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profile } = await supabase
        .from('profiles').select('creditos').eq('id', user.id).single()

      const temCreditos = profile && profile.creditos >= CUSTO_CREDITOS
      const slug = gerarSlug()

      const dadosRetro: StreamingDados = {
        nome1: nome1.trim(), nome2: nome2.trim(),
        data_inicio: dataInicio,
        cidade: cidade.trim() || 'Sua cidade',
        mensagem: '',
        msg_final: msgFinal.trim(),
        pos_creditos: posCreditos.trim() || undefined,
        sinopse: sinopse.trim(),
        conquistas: conquistas.map(key => ({ key })),
        fotos: fotosPreenchidas,
        fotos_titulos: fotosPreenchidas.map((_, i) => {
          const origIdx = fotos.findIndex((f, fi) => f && fotos.slice(0, fi).filter(Boolean).length === i)
          return fotosTitulos[origIdx] || `Episódio ${i + 1}`
        }),
        musica: musicaInfo ? { videoId: musicaInfo.videoId, title: musicaInfo.title } : null,
        quiz: quiz.length > 0 ? quiz : null,
      }

      const { data: inserted, error } = await supabase.from('presentes').insert({
        user_id: user.id, slug, tipo: 'streaming',
        titulo: `${nome1} & ${nome2}`, emoji: '🎬',
        ativo: temCreditos ? true : false,
        status: temCreditos ? 'ativo' : 'rascunho',
        visualizacoes: 0, cor_primaria: '#E50914',
        dados_retro: dadosRetro,
      }).select('id').single()

      if (error || !inserted) { setErro('Erro ao salvar. Tente novamente.'); setSalvando(false); return }

      if (temCreditos) {
        await supabase.from('profiles').update({
          creditos: profile.creditos - CUSTO_CREDITOS,
        }).eq('id', user.id)
        router.push(`/dashboard?streaming=criada`)
      } else {
        // Sem créditos: redireciona pra compra
        router.push(`/comprar?pendente=${inserted.id}&tipo=streaming`)
      }
    } catch (err) {
      console.error(err); setErro('Erro ao salvar.'); setSalvando(false)
    }
  }

  // ─── Loading ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: '#E50914', fontSize: '1.4rem', fontFamily: "'Inter',sans-serif" }}>
      Carregando… 🎬
    </div>
  )

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{wizardStyles}</style>
      <div className="sw-layout">
        <div className="sw-form-side">
          {/* Header */}
          <div className="sw-header">
            <Link href="/dashboard" className="sw-back">← Voltar</Link>
            <div className="sw-credits">
              <span className="sw-credits-icon">🎬</span>
              <span>{creditos} crédito{creditos !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <h1 className="sw-title">Criar <span>Streaming</span></h1>
          <p className="sw-subtitle">
            {creditos >= CUSTO_CREDITOS
              ? `Custa ${CUSTO_CREDITOS} créditos · Será incrível!`
              : `Você poderá comprar créditos ao finalizar`}
          </p>

          {/* Steps */}
          <div className="sw-steps">
            {STEPS.map((s, i) => (
              <div
                key={i}
                className={`sw-step ${i === step ? 'active' : i < step ? 'done' : ''}`}
                onClick={() => { if (i < step) { setErro(''); setStep(i) } }}
              >
                <div className="sw-step-dot">{i < step ? '✓' : s.icon}</div>
                <span className="sw-step-label">{s.label}</span>
              </div>
            ))}
          </div>

          {erro && <div className="sw-error">{erro}</div>}

          <div className="sw-content">
            {/* Step 0: O Casal */}
            {step === 0 && (
              <div className="sw-section">
                <div className="sw-section-title">💑 O Casal</div>
                <div className="sw-field"><label>Nome 1</label><input value={nome1} onChange={e => setNome1(e.target.value)} placeholder="Ex: Gabriel" /></div>
                <div className="sw-field"><label>Nome 2</label><input value={nome2} onChange={e => setNome2(e.target.value)} placeholder="Ex: Maria" /></div>
                <div className="sw-field"><label>Quando começaram?</label><input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} /></div>
                <div className="sw-field"><label>Cidade <span className="sw-optional">(opcional)</span></label><input value={cidade} onChange={e => setCidade(e.target.value)} placeholder="Ex: São Paulo" /></div>
              </div>
            )}

            {/* Step 1: Sinopse */}
            {step === 1 && (
              <div className="sw-section">
                <div className="sw-section-title">📝 Sinopse</div>
                <p className="sw-hint">Aparece na tela inicial, como a descrição de um filme na Netflix.</p>
                <div className="sw-field">
                  <label>Sinopse da história</label>
                  <textarea value={sinopse} onChange={e => setSinopse(e.target.value)} rows={4} placeholder="Uma história que começou com um olhar e virou a melhor série de todos os tempos..." maxLength={300} />
                  <div className="sw-char-count">{sinopse.length}/300</div>
                </div>
              </div>
            )}

            {/* Step 2: Episódios */}
            {step === 2 && (
              <div className="sw-section">
                <div className="sw-section-title">📸 Episódios</div>
                <p className="sw-hint">Cada foto vira um episódio. Você pode selecionar várias fotos de uma vez! Adicione até {MAX_FOTOS} fotos.</p>
                {/* Bulk upload button */}
                <label className="sw-bulk-upload" htmlFor="foto-bulk">
                  <span>📁</span> Selecionar várias fotos de uma vez
                  <input id="foto-bulk" type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => handleFotoUpload(e, 0)} />
                </label>
                <div className="sw-foto-grid">
                  {Array.from({ length: MAX_FOTOS }).map((_, idx) => (
                    <div key={idx} className="sw-foto-card">
                      <div className="sw-foto-slot">
                        {fotos[idx] ? (
                          <>
                            <img src={fotos[idx]!} alt="" className="sw-foto-img" />
                            <button className="sw-foto-remove" onClick={() => removeFoto(idx)}>✕</button>
                          </>
                        ) : uploadando === idx ? (
                          <div className="sw-foto-loading">⏳</div>
                        ) : (
                          <label className="sw-foto-add" htmlFor={`foto-${idx}`}>
                            <span>📷</span>
                            <span className="sw-foto-add-text">{idx === 0 ? 'Adicionar foto' : `Foto ${idx + 1}`}</span>
                          </label>
                        )}
                        <input id={`foto-${idx}`} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFotoUpload(e, idx)} />
                      </div>
                      {fotos[idx] && (
                        <div className="sw-foto-meta">
                          <input
                            className="sw-foto-titulo-input"
                            value={fotosTitulos[idx]}
                            onChange={e => setFotosTitulos(prev => { const n = [...prev]; n[idx] = e.target.value; return n })}
                            placeholder={`Ep. ${idx + 1} — Título`}
                          />
                          <textarea
                            className="sw-foto-desc-input"
                            value={fotosDescricoes[idx]}
                            onChange={e => setFotosDescricoes(prev => { const n = [...prev]; n[idx] = e.target.value; return n })}
                            placeholder="Descrição do episódio... (opcional)"
                            rows={2}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Conquistas */}
            {step === 3 && (
              <div className="sw-section">
                <div className="sw-section-title">🏆 Conquistas & Prêmios</div>
                <p className="sw-hint">Selecione as que combinam com vocês. Passe o mouse (ou segure) em cada conquista para ver o que significa. Conquistas de tempo são automáticas! <span className="sw-optional">(opcional)</span></p>
                <div className="sw-conquista-group">
                  <div className="sw-conquista-group-label">🍅 Reação do Público <span className="sw-optional">(escolha 1)</span></div>
                  <div className="sw-conquista-list">
                    {REACOES_PUBLICO.map(r => (
                      <div key={r.key} className="sw-conquista-tooltip-wrap">
                        <button className={`sw-conquista-chip ${conquistas.includes(r.key) ? 'sel' : ''}`} onClick={() => toggleConquista(r.key, REACOES_PUBLICO.map(x => x.key))}>
                          <span>{r.icon}</span> {r.label}
                        </button>
                        {'desc' in r && r.desc && <div className="sw-conquista-tooltip">{r.desc}</div>}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="sw-conquista-group">
                  <div className="sw-conquista-group-label">🏆 Premiações</div>
                  <div className="sw-conquista-list">
                    {PREMIACOES.map(r => (
                      <div key={r.key} className="sw-conquista-tooltip-wrap">
                        <button className={`sw-conquista-chip ${conquistas.includes(r.key) ? 'sel' : ''}`} onClick={() => toggleConquista(r.key)}>
                          <span>{r.icon}</span> {r.label}
                        </button>
                        {'desc' in r && r.desc && <div className="sw-conquista-tooltip">{r.desc}</div>}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="sw-conquista-group">
                  <div className="sw-conquista-group-label">🎬 Marcos da História</div>
                  <div className="sw-conquista-list">
                    {MARCOS_HISTORIA.map(r => (
                      <div key={r.key} className="sw-conquista-tooltip-wrap">
                        <button className={`sw-conquista-chip ${conquistas.includes(r.key) ? 'sel' : ''}`} onClick={() => toggleConquista(r.key)}>
                          <span>{r.icon}</span> {r.label}
                        </button>
                        {'desc' in r && r.desc && <div className="sw-conquista-tooltip">{r.desc}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Quiz */}
            {step === 4 && (
              <div className="sw-section">
                <div className="sw-section-title">🎮 Quiz do Casal</div>
                <p className="sw-hint">Adicione até {MAX_QUIZ} perguntas. <span className="sw-optional">(opcional)</span></p>
                {quiz.map((q, qi) => (
                  <div key={qi} className="sw-quiz-card">
                    <div className="sw-quiz-header">
                      <span className="sw-quiz-num">Pergunta {qi + 1}</span>
                      <button className="sw-quiz-remove" onClick={() => removeQuiz(qi)}>🗑</button>
                    </div>
                    <div className="sw-field"><input value={q.pergunta} onChange={e => updateQuiz(qi, 'pergunta', e.target.value)} placeholder="Ex: Onde foi nosso primeiro encontro?" /></div>
                    {q.opcoes.map((op, oi) => (
                      <div key={oi} className="sw-quiz-opcao">
                        <button className={`sw-quiz-radio ${q.correta === oi ? 'sel' : ''}`} onClick={() => updateQuiz(qi, 'correta', oi)}>{q.correta === oi ? '✓' : String.fromCharCode(65 + oi)}</button>
                        <input value={op} onChange={e => updateQuizOpcao(qi, oi, e.target.value)} placeholder={`Alternativa ${String.fromCharCode(65 + oi)}`} />
                      </div>
                    ))}
                    <p className="sw-quiz-tip">Toque na letra para marcar a resposta correta</p>
                  </div>
                ))}
                {quiz.length < MAX_QUIZ && (<button className="sw-quiz-add" onClick={addQuiz}>+ Adicionar pergunta</button>)}
              </div>
            )}

            {/* Step 5: Declaração Final */}
            {step === 5 && (
              <div className="sw-section">
                <div className="sw-section-title">💌 Declaração Final</div>
                <p className="sw-hint">A mensagem que aparece nos créditos finais.</p>
                <div className="sw-field">
                  <label>Mensagem do coração</label>
                  <textarea value={msgFinal} onChange={e => setMsgFinal(e.target.value)} rows={5} placeholder="Do primeiro episódio até aqui, cada cena com você foi a melhor parte..." />
                </div>
                <div className="sw-field">
                  <label>Cena pós-créditos <span className="sw-optional">(opcional)</span></label>
                  <p className="sw-hint" style={{ marginTop: 0, marginBottom: 8 }}>Estilo Marvel — "{nome1} & {nome2} irão voltar em..."</p>
                  <input value={posCreditos} onChange={e => setPosCreditos(e.target.value)} placeholder="Ex: Vingadores: Doomsday" />
                </div>
              </div>
            )}

            {/* Step 6: Música */}
            {step === 6 && (
              <div className="sw-section">
                <div className="sw-section-title">🎵 Música de Fundo</div>
                <p className="sw-hint">Toca após o TUDUM até os pós-créditos. <span className="sw-optional">(opcional)</span></p>

                {/* Tabs busca / link */}
                <div className="sw-musica-tabs">
                  <button className={`sw-musica-tab ${musicaTab === 'busca' ? 'active' : ''}`} onClick={() => setMusicaTab('busca')}>🔍 Buscar música</button>
                  <button className={`sw-musica-tab ${musicaTab === 'link' ? 'active' : ''}`} onClick={() => setMusicaTab('link')}>🔗 Colar link</button>
                </div>

                {/* Tab: Busca */}
                {musicaTab === 'busca' && (
                  <div>
                    <div className="sw-field">
                      <input
                        value={ytQuery}
                        onChange={e => handleYtSearch(e.target.value)}
                        placeholder="Buscar no YouTube... ex: nossa música"
                      />
                    </div>
                    {ytLoading && <div className="sw-yt-loading">Buscando...</div>}
                    {ytResults.length > 0 && (
                      <div className="sw-yt-results">
                        {ytResults.map(r => (
                          <div
                            key={r.videoId}
                            className={`sw-yt-item ${musicaInfo?.videoId === r.videoId ? 'selected' : ''}`}
                            onClick={() => selectYtResult(r)}
                          >
                            <img src={r.thumb} alt="" className="sw-yt-thumb" />
                            <div className="sw-yt-info">
                              <div className="sw-yt-title">{r.title}</div>
                              <div className="sw-yt-channel">{r.channel}</div>
                            </div>
                            {musicaInfo?.videoId === r.videoId && <span className="sw-yt-check">✓</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Tab: Link */}
                {musicaTab === 'link' && (
                  <div className="sw-field">
                    <label>Link do YouTube</label>
                    <input
                      value={musicaLink}
                      onChange={e => handleMusicaLink(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      style={{ fontFamily: 'monospace', fontSize: '.85rem' }}
                    />
                    {musicaErro && <div className="sw-field-error">{musicaErro}</div>}
                  </div>
                )}

                {/* Música selecionada */}
                {musicaInfo && (
                  <div className="sw-musica-preview">
                    <img src={musicaInfo.thumb} alt="" className="sw-musica-thumb" />
                    <div className="sw-musica-info">
                      <div className="sw-musica-title">{musicaInfo.title}</div>
                      <div className="sw-musica-yt">▶ YouTube · tocará após o TUDUM</div>
                    </div>
                    <button className="sw-musica-remove" onClick={() => { setMusicaInfo(null); setMusicaLink(''); setYtQuery('') }}>✕</button>
                  </div>
                )}
              </div>
            )}

            {/* Step 7: Revisar & Criar */}
            {step === 7 && (
              <div className="sw-section">
                <div className="sw-section-title">🚀 Revisar & Criar</div>
                <div className="sw-review">
                  <div className="sw-review-item"><span>💑</span><strong>{nome1} & {nome2}</strong></div>
                  <div className="sw-review-item"><span>📅</span>{dataInicio}</div>
                  {cidade && <div className="sw-review-item"><span>📍</span>{cidade}</div>}
                  <div className="sw-review-item"><span>📝</span>{sinopse.slice(0, 60)}{sinopse.length > 60 ? '...' : ''}</div>
                  <div className="sw-review-item"><span>📸</span>{fotosPreenchidas.length} foto{fotosPreenchidas.length !== 1 ? 's' : ''}</div>
                  <div className="sw-review-item"><span>🏆</span>{conquistas.length} conquista{conquistas.length !== 1 ? 's' : ''}</div>
                  <div className="sw-review-item"><span>🎮</span>{quiz.length} pergunta{quiz.length !== 1 ? 's' : ''} no quiz</div>
                  <div className="sw-review-item"><span>💌</span>{msgFinal ? '✓ Declaração escrita' : '✗ Sem declaração'}</div>
                  <div className="sw-review-item"><span>🎵</span>{musicaInfo ? musicaInfo.title : 'Sem música'}</div>
                  {posCreditos && <div className="sw-review-item"><span>🎬</span>Pós-créditos: {posCreditos}</div>}
                </div>

                {creditos >= CUSTO_CREDITOS ? (
                  <div className="sw-review-cost">
                    <span>Custo: <strong>{CUSTO_CREDITOS} créditos</strong></span>
                    <span>Você tem: <strong>{creditos}</strong></span>
                  </div>
                ) : (
                  <div className="sw-review-cost" style={{ borderColor: 'rgba(251,191,36,.3)', background: 'rgba(251,191,36,.08)' }}>
                    <span>Custo: <strong style={{ color: '#fbbf24' }}>{CUSTO_CREDITOS} créditos</strong></span>
                    <span style={{ color: 'rgba(255,255,255,.5)' }}>Você será redirecionado para comprar</span>
                  </div>
                )}

                <button className="sw-create-btn" onClick={handleSalvar} disabled={salvando}>
                  {salvando ? '⏳ Criando...'
                    : creditos >= CUSTO_CREDITOS
                      ? '🎬 Criar meu Streaming'
                      : '🎬 Criar e comprar créditos'}
                </button>
              </div>
            )}
          </div>

          {/* Nav */}
          <div className="sw-nav">
            {step > 0 && <button className="sw-nav-btn back" onClick={prevStep}>← Voltar</button>}
            <div style={{ flex: 1 }} />
            <button className="sw-preview-btn-mobile" onClick={() => setShowPreview(true)}>👁 Preview</button>
            {step < STEPS.length - 1 && (
              <button className="sw-nav-btn next" onClick={nextStep}>{STEPS[step + 1].icon} {STEPS[step + 1].label} →</button>
            )}
          </div>
        </div>

        {/* Preview (desktop) */}
        <div className="sw-preview-side">
          <div className="sw-preview-label">Preview</div>
          <div className="sw-preview-wrap">
            <div className="sw-preview-inner">
              <FirstSlidePreview nome1={nome1} nome2={nome2} dataInicio={dataInicio} cidade={cidade} foto={fotos[0]} />
            </div>
          </div>
        </div>

        {/* Preview modal (mobile) */}
        {showPreview && (
          <div className="sw-preview-modal">
            <button className="sw-preview-modal-close" onClick={() => setShowPreview(false)}>✕ Fechar preview</button>
            <div className="sw-preview-modal-content">
              <FirstSlidePreview nome1={nome1} nome2={nome2} dataInicio={dataInicio} cidade={cidade} foto={fotos[0]} />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const wizardStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap');

  .sw-layout{display:flex;min-height:100vh;background:#0a0a0a;font-family:'Inter',sans-serif;color:#fff}
  .sw-form-side{flex:2;min-width:0;display:flex;flex-direction:column;padding:0 0 120px;overflow-y:auto}
  .sw-preview-side{flex:1;position:sticky;top:0;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;border-left:1px solid rgba(255,255,255,.06);background:rgba(0,0,0,.3)}
  .sw-header{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;border-bottom:1px solid rgba(255,255,255,.06)}
  .sw-back{color:rgba(255,255,255,.5);text-decoration:none;font-size:13px;font-weight:500;transition:color .2s}.sw-back:hover{color:#fff}
  .sw-credits{display:flex;align-items:center;gap:6px;font-size:12px;color:rgba(255,255,255,.4);background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:5px 12px}.sw-credits-icon{font-size:14px}
  .sw-title{font-family:'Bebas Neue',sans-serif;font-size:32px;letter-spacing:2px;font-weight:400;padding:24px 24px 0}.sw-title span{color:#E50914}
  .sw-subtitle{font-size:13px;color:rgba(255,255,255,.35);padding:4px 24px 0}
  .sw-steps{display:flex;gap:4px;padding:20px 24px 0;overflow-x:auto;-webkit-overflow-scrolling:touch}.sw-steps::-webkit-scrollbar{display:none}
  .sw-step{display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:20px;font-size:11px;font-weight:600;color:rgba(255,255,255,.3);background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);white-space:nowrap;cursor:default;transition:all .2s;flex-shrink:0}
  .sw-step.done{cursor:pointer;color:rgba(255,255,255,.6);border-color:rgba(229,9,20,.2)}.sw-step.done:hover{background:rgba(229,9,20,.08)}
  .sw-step.active{color:#fff;background:rgba(229,9,20,.15);border-color:rgba(229,9,20,.4)}.sw-step-dot{font-size:13px}
  .sw-error{margin:16px 24px 0;padding:10px 14px;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.25);border-radius:8px;font-size:13px;color:#ef4444}
  .sw-content{padding:20px 24px;flex:1}
  .sw-section-title{font-family:'Bebas Neue',sans-serif;font-size:24px;letter-spacing:1px;margin-bottom:16px}
  .sw-hint{font-size:12px;color:rgba(255,255,255,.35);line-height:1.5;margin-bottom:16px}.sw-optional{color:rgba(255,255,255,.2);font-weight:400}
  .sw-field{margin-bottom:16px}.sw-field label{display:block;font-size:12px;font-weight:600;color:rgba(255,255,255,.5);margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px}
  .sw-field input,.sw-field textarea{width:100%;padding:12px 14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:8px;color:#fff;font-size:14px;font-family:'Inter',sans-serif;outline:none;transition:border-color .2s}
  .sw-field input:focus,.sw-field textarea:focus{border-color:rgba(229,9,20,.5)}
  .sw-field input::placeholder,.sw-field textarea::placeholder{color:rgba(255,255,255,.2)}
  .sw-field textarea{resize:vertical;min-height:80px}.sw-field-error{font-size:12px;color:#ef4444;margin-top:4px}
  .sw-char-count{font-size:11px;color:rgba(255,255,255,.2);text-align:right;margin-top:4px}

  .sw-bulk-upload{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:12px;background:rgba(229,9,20,.06);border:1.5px dashed rgba(229,9,20,.3);border-radius:10px;color:rgba(229,9,20,.8);font-size:13px;font-weight:600;cursor:pointer;margin-bottom:14px;font-family:'Inter',sans-serif;transition:all .2s}.sw-bulk-upload:hover{background:rgba(229,9,20,.1);border-color:rgba(229,9,20,.5)}

  .sw-foto-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
  .sw-foto-card{display:flex;flex-direction:column;gap:0}
  .sw-foto-slot{position:relative;aspect-ratio:3/4;border-radius:10px 10px 0 0;overflow:hidden;background:rgba(255,255,255,.04);border:1.5px dashed rgba(255,255,255,.1);border-bottom:none;transition:border-color .2s}.sw-foto-slot:hover{border-color:rgba(255,255,255,.2)}
  .sw-foto-card:not(:has(.sw-foto-meta)) .sw-foto-slot{border-radius:10px;border-bottom:1.5px dashed rgba(255,255,255,.1)}
  .sw-foto-img{width:100%;height:100%;object-fit:cover}
  .sw-foto-remove{position:absolute;top:6px;right:6px;width:24px;height:24px;border-radius:50%;background:rgba(0,0,0,.7);border:none;color:#fff;font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:2}
  .sw-foto-loading{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:1.5rem}
  .sw-foto-add{position:absolute;inset:0;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;font-size:1.5rem;color:rgba(255,255,255,.2);transition:color .2s}.sw-foto-add:hover{color:rgba(255,255,255,.4)}.sw-foto-add-text{font-size:10px}
  .sw-foto-meta{background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.1);border-top:none;border-radius:0 0 10px 10px;padding:6px 6px 8px;display:flex;flex-direction:column;gap:4px}
  .sw-foto-titulo-input{width:100%;padding:5px 7px;background:rgba(229,9,20,.08);border:1px solid rgba(229,9,20,.3);border-radius:5px;color:#fff;font-size:11px;font-weight:600;font-family:'Inter',sans-serif;outline:none;box-sizing:border-box}.sw-foto-titulo-input::placeholder{color:rgba(255,255,255,.25)}.sw-foto-titulo-input:focus{border-color:rgba(229,9,20,.6);background:rgba(229,9,20,.12)}
  .sw-foto-desc-input{width:100%;padding:4px 7px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:5px;color:rgba(255,255,255,.7);font-size:10px;font-family:'Inter',sans-serif;outline:none;resize:none;box-sizing:border-box;line-height:1.4}.sw-foto-desc-input::placeholder{color:rgba(255,255,255,.2)}.sw-foto-desc-input:focus{border-color:rgba(255,255,255,.2)}

  .sw-conquista-group{margin-bottom:20px}.sw-conquista-group-label{font-size:13px;font-weight:600;color:rgba(255,255,255,.5);margin-bottom:10px}
  .sw-conquista-list{display:flex;flex-wrap:wrap;gap:8px}
  .sw-conquista-tooltip-wrap{position:relative;display:inline-flex}
  .sw-conquista-tooltip-wrap:hover .sw-conquista-tooltip,.sw-conquista-tooltip-wrap:focus-within .sw-conquista-tooltip{opacity:1;pointer-events:auto;transform:translateY(0)}
  .sw-conquista-tooltip{position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%) translateY(4px);background:rgba(20,20,20,.97);border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:8px 10px;font-size:11px;color:rgba(255,255,255,.8);line-height:1.4;white-space:nowrap;max-width:200px;white-space:normal;z-index:100;opacity:0;pointer-events:none;transition:all .15s;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,.6)}
  .sw-conquista-tooltip::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:rgba(20,20,20,.97)}
  .sw-conquista-chip{display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:20px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.6);font-size:12px;font-weight:500;cursor:pointer;transition:all .2s;font-family:'Inter',sans-serif}
  .sw-conquista-chip:hover{border-color:rgba(255,255,255,.2)}.sw-conquista-chip.sel{background:rgba(229,9,20,.12);border-color:rgba(229,9,20,.4);color:#fff}

  .sw-quiz-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:16px;margin-bottom:14px}
  .sw-quiz-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
  .sw-quiz-num{font-size:12px;font-weight:700;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:1px}
  .sw-quiz-remove{background:none;border:none;font-size:16px;cursor:pointer;color:rgba(255,255,255,.3);transition:color .2s}.sw-quiz-remove:hover{color:#ef4444}
  .sw-quiz-opcao{display:flex;align-items:center;gap:8px;margin-bottom:8px}
  .sw-quiz-radio{width:32px;height:32px;border-radius:8px;flex-shrink:0;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.4);font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;font-family:'Inter',sans-serif}
  .sw-quiz-radio.sel{background:rgba(34,197,94,.15);border-color:rgba(34,197,94,.4);color:#22c55e}
  .sw-quiz-tip{font-size:10px;color:rgba(255,255,255,.2);margin-top:6px}
  .sw-quiz-add{width:100%;padding:12px;background:rgba(255,255,255,.04);border:1px dashed rgba(255,255,255,.12);border-radius:10px;color:rgba(255,255,255,.4);font-size:13px;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif;transition:all .2s}.sw-quiz-add:hover{border-color:rgba(229,9,20,.3);color:rgba(255,255,255,.6)}

  /* ── Música: tabs ────────────────────────────────────────────── */
  .sw-musica-tabs{display:flex;gap:6px;margin-bottom:16px}
  .sw-musica-tab{padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;font-family:'Inter',sans-serif;cursor:pointer;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);color:rgba(255,255,255,.5);transition:all .2s}
  .sw-musica-tab.active{background:rgba(229,9,20,.12);border-color:rgba(229,9,20,.4);color:#fff}
  .sw-musica-tab:hover{border-color:rgba(255,255,255,.2)}

  /* ── YouTube search results ──────────────────────────────────── */
  .sw-yt-loading{font-size:12px;color:rgba(255,255,255,.3);padding:8px 0}
  .sw-yt-results{display:flex;flex-direction:column;gap:6px;margin-bottom:16px}
  .sw-yt-item{display:flex;align-items:center;gap:12px;padding:10px 12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:10px;cursor:pointer;transition:all .2s}
  .sw-yt-item:hover{border-color:rgba(255,255,255,.18);background:rgba(255,255,255,.06)}
  .sw-yt-item.selected{border-color:rgba(229,9,20,.4);background:rgba(229,9,20,.08)}
  .sw-yt-thumb{width:80px;height:45px;border-radius:6px;object-fit:cover;flex-shrink:0}
  .sw-yt-info{flex:1;min-width:0}
  .sw-yt-title{font-size:13px;font-weight:600;color:rgba(255,255,255,.9);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .sw-yt-channel{font-size:11px;color:rgba(255,255,255,.35);margin-top:2px}
  .sw-yt-check{color:#E50914;font-weight:700;font-size:16px;flex-shrink:0}

  .sw-musica-preview{display:flex;align-items:center;gap:12px;padding:12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:10px;margin-top:12px}
  .sw-musica-thumb{width:56px;height:42px;border-radius:6px;object-fit:cover}.sw-musica-info{flex:1;min-width:0}
  .sw-musica-title{font-size:13px;font-weight:600;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .sw-musica-yt{font-size:11px;color:rgba(255,255,255,.3);margin-top:2px}
  .sw-musica-remove{width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,.08);border:none;color:rgba(255,255,255,.4);font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}

  .sw-review{display:flex;flex-direction:column;gap:8px;margin-bottom:20px}
  .sw-review-item{display:flex;align-items:center;gap:10px;padding:10px 14px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:8px;font-size:13px;color:rgba(255,255,255,.7)}
  .sw-review-item span{font-size:16px;flex-shrink:0}.sw-review-item strong{color:#fff}
  .sw-review-cost{display:flex;justify-content:space-between;padding:14px;background:rgba(229,9,20,.08);border:1px solid rgba(229,9,20,.2);border-radius:10px;font-size:14px;color:rgba(255,255,255,.7);margin-bottom:20px}.sw-review-cost strong{color:#E50914}
  .sw-create-btn{width:100%;padding:16px;background:linear-gradient(135deg,#E50914,#b20710);border:none;border-radius:8px;color:#fff;font-size:16px;font-weight:700;font-family:'Inter',sans-serif;cursor:pointer;transition:all .2s;box-shadow:0 4px 20px rgba(229,9,20,.3)}
  .sw-create-btn:hover{box-shadow:0 6px 30px rgba(229,9,20,.5);transform:translateY(-1px)}.sw-create-btn:disabled{opacity:.6;cursor:not-allowed;transform:none}

  .sw-nav{position:fixed;bottom:0;left:0;width:calc(100% * 2/3);display:flex;align-items:center;gap:8px;padding:14px 24px;background:rgba(10,10,10,.95);backdrop-filter:blur(10px);border-top:1px solid rgba(255,255,255,.06);z-index:50}
  .sw-nav-btn{padding:10px 20px;border-radius:6px;font-size:13px;font-weight:600;font-family:'Inter',sans-serif;cursor:pointer;transition:all .2s;border:none;-webkit-tap-highlight-color:transparent}
  .sw-nav-btn.back{background:rgba(255,255,255,.06);color:rgba(255,255,255,.6);border:1px solid rgba(255,255,255,.1)}.sw-nav-btn.back:hover{background:rgba(255,255,255,.1)}
  .sw-nav-btn.next{background:rgba(229,9,20,.9);color:#fff}.sw-nav-btn.next:hover{background:#E50914}
  .sw-preview-btn-mobile{display:none;padding:10px 16px;border-radius:6px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.6);font-size:13px;font-weight:600;font-family:'Inter',sans-serif;cursor:pointer}

  .sw-preview-label{font-size:10px;font-weight:600;color:rgba(255,255,255,.2);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px}
  .sw-preview-wrap{width:100%;max-width:380px;height:calc(100vh - 80px);border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,.08);background:#0a0a0a;display:flex;flex-direction:column}
  .sw-preview-inner{flex:1;overflow:hidden;position:relative}
  .sw-preview-inner > *{position:absolute;inset:0;overflow-y:auto;overflow-x:hidden}
  .sw-preview-inner > *::-webkit-scrollbar{display:none}

  .sw-preview-modal{position:fixed;inset:0;z-index:200;background:#000;display:flex;flex-direction:column}
  .sw-preview-modal-close{position:absolute;top:12px;right:12px;z-index:210;padding:8px 16px;border-radius:20px;background:rgba(255,255,255,.1);border:none;color:#fff;font-size:12px;font-weight:600;font-family:'Inter',sans-serif;cursor:pointer;backdrop-filter:blur(8px)}
  .sw-preview-modal-content{flex:1;overflow-y:auto}

  @media(max-width:820px){.sw-preview-side{display:none}.sw-form-side{flex:1}.sw-preview-btn-mobile{display:block}.sw-nav{width:100%}}
  @media(max-width:480px){.sw-content{padding:16px 16px}.sw-header{padding:12px 16px}.sw-title{padding:20px 16px 0;font-size:26px}.sw-subtitle{padding:4px 16px 0}.sw-steps{padding:16px 16px 0}.sw-nav{padding:12px 16px}.sw-foto-grid{grid-template-columns:1fr 1fr}}
`