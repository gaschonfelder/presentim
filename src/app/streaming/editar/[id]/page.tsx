'use client'

import { useState, useEffect, useMemo, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import StreamingPlayer from '@/app/streaming/[slug]/StreamingPlayer'
import type { StreamingDados } from '@/app/streaming/[slug]/page'
import {
  REACOES_PUBLICO,
  PREMIACOES,
  MARCOS_HISTORIA,
} from '@/app/streaming/[slug]/SlideConquistas'

// ─── Constantes ───────────────────────────────────────────────────────────────

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
  { label: 'Salvar', icon: '💾' },
]

type MusicaInfo = { videoId: string; title: string; thumb: string }
type QuizItem = { pergunta: string; opcoes: string[]; correta: number }

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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StreamingEditarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [slug, setSlug] = useState('')
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
  const [conquistas, setConquistas] = useState<string[]>([])
  const [quiz, setQuiz] = useState<QuizItem[]>([])
  const [msgFinal, setMsgFinal] = useState('')
  const [posCreditos, setPosCreditos] = useState('')
  const [musicaLink, setMusicaLink] = useState('')
  const [musicaInfo, setMusicaInfo] = useState<MusicaInfo | null>(null)
  const [musicaErro, setMusicaErro] = useState('')
  const [uploadando, setUploadando] = useState<number | null>(null)

  const fotosPreenchidas = fotos.filter(Boolean) as string[]

  // ─── Load existing data ─────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data } = await supabase
        .from('presentes')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .eq('tipo', 'streaming')
        .single()

      if (!data) { setNotFound(true); setLoading(false); return }

      const d = (data.dados_retro ?? {}) as StreamingDados
      setSlug(data.slug)
      setNome1(d.nome1 ?? '')
      setNome2(d.nome2 ?? '')
      setDataInicio(d.data_inicio ?? '')
      setCidade(d.cidade ?? '')
      setSinopse(d.sinopse ?? '')
      setMsgFinal(d.msg_final ?? '')
      setPosCreditos(d.pos_creditos ?? '')

      // Fotos
      const fotosArr: (string | null)[] = Array(MAX_FOTOS).fill(null)
      const titulosArr: string[] = Array(MAX_FOTOS).fill('')
      ;(d.fotos ?? []).forEach((url: string, i: number) => {
        if (i < MAX_FOTOS) fotosArr[i] = url
      })
      ;(d.fotos_titulos ?? []).forEach((t: string, i: number) => {
        if (i < MAX_FOTOS) titulosArr[i] = t
      })
      setFotos(fotosArr)
      setFotosTitulos(titulosArr)

      // Conquistas
      const cqs = (d.conquistas ?? []).map((c: any) => typeof c === 'string' ? c : c.key)
      setConquistas(cqs)

      // Quiz
      setQuiz(d.quiz ?? [])

      // Música
      if (d.musica?.videoId) {
        setMusicaInfo({
          videoId: d.musica.videoId,
          title: d.musica.title,
          thumb: `https://img.youtube.com/vi/${d.musica.videoId}/mqdefault.jpg`,
        })
        setMusicaLink(`https://www.youtube.com/watch?v=${d.musica.videoId}`)
      }

      setLoading(false)
    }
    load()
  }, [id])

  // Preview data
  const previewDados: StreamingDados = useMemo(() => ({
    nome1: nome1 || 'Nome 1',
    nome2: nome2 || 'Nome 2',
    data_inicio: dataInicio || '2024-01-01',
    cidade: cidade || 'Sua cidade',
    mensagem: '',
    msg_final: msgFinal || '',
    pos_creditos: posCreditos || '',
    sinopse: sinopse || 'Sua sinopse aparecerá aqui...',
    conquistas: conquistas.map(key => ({ key })),
    fotos: fotosPreenchidas,
    fotos_titulos: fotosPreenchidas.map((_, i) => {
      const origIdx = fotos.findIndex((f, fi) => f && fotos.slice(0, fi).filter(Boolean).length === i)
      return fotosTitulos[origIdx] || `Episódio ${i + 1}`
    }),
    musica: musicaInfo ? { videoId: musicaInfo.videoId, title: musicaInfo.title } : null,
    quiz: quiz.length > 0 ? quiz : null,
  }), [nome1, nome2, dataInicio, cidade, sinopse, fotosPreenchidas, conquistas, quiz, msgFinal, posCreditos, musicaInfo])

  // Validation
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

  // Upload
  async function handleFotoUpload(e: React.ChangeEvent<HTMLInputElement>, idx: number) {
    const file = e.target.files?.[0]
    if (!file) return
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

  function removeFoto(idx: number) {
    setFotos(prev => { const n = [...prev]; n[idx] = null; return n })
    setFotosTitulos(prev => { const n = [...prev]; n[idx] = ''; return n })
  }

  // Música
  async function handleMusicaLink(url: string) {
    setMusicaLink(url); setMusicaErro(''); setMusicaInfo(null)
    if (!url.trim()) return
    const videoId = extrairVideoId(url.trim())
    if (!videoId) { setMusicaErro('Link inválido.'); return }
    try {
      const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setMusicaInfo({ videoId, title: data.title, thumb: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` })
    } catch { setMusicaErro('Não foi possível carregar.') }
  }

  // Conquistas
  function toggleConquista(key: string, exclusiveGroup?: string[]) {
    setConquistas(prev => {
      if (prev.includes(key)) return prev.filter(k => k !== key)
      if (exclusiveGroup) return [...prev.filter(k => !exclusiveGroup.includes(k)), key]
      return [...prev, key]
    })
  }

  // Quiz
  function addQuiz() { if (quiz.length < MAX_QUIZ) setQuiz(prev => [...prev, { pergunta: '', opcoes: ['', '', '', ''], correta: 0 }]) }
  function updateQuiz(idx: number, field: string, value: any) { setQuiz(prev => prev.map((q, i) => i === idx ? { ...q, [field]: value } : q)) }
  function updateQuizOpcao(qIdx: number, oIdx: number, value: string) {
    setQuiz(prev => prev.map((q, i) => { if (i !== qIdx) return q; const opcoes = [...q.opcoes]; opcoes[oIdx] = value; return { ...q, opcoes } }))
  }
  function removeQuiz(idx: number) { setQuiz(prev => prev.filter((_, i) => i !== idx)) }

  // ─── Salvar (update, sem cobrar créditos) ───────────────────────────────────
  async function handleSalvar() {
    for (let s = 0; s < STEPS.length - 1; s++) {
      const err = validateStep(s)
      if (err) { setErro(err); setStep(s); return }
    }
    for (const q of quiz) {
      if (!q.pergunta.trim() || q.opcoes.some(o => !o.trim())) {
        setErro('Preencha todas as perguntas e alternativas do quiz.')
        setStep(4); return
      }
    }

    setSalvando(true); setErro('')
    try {
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

      const { error } = await supabase
        .from('presentes')
        .update({
          titulo: `${nome1} & ${nome2}`,
          dados_retro: dadosRetro,
        })
        .eq('id', id)

      if (error) throw error
      router.push('/dashboard?streaming=editada')
    } catch (err) {
      console.error(err)
      setErro('Erro ao salvar.')
    } finally { setSalvando(false) }
  }

  // ─── Loading / Not found ────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: '#E50914', fontSize: '1.4rem', fontFamily: "'Inter',sans-serif" }}>
      Carregando… 🎬
    </div>
  )

  if (notFound) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: '#fff', fontFamily: "'Inter',sans-serif", gap: 16 }}>
      <div style={{ fontSize: '3rem' }}>🎬</div>
      <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>Streaming não encontrado</div>
      <Link href="/dashboard" style={{ color: '#E50914', fontSize: '14px' }}>← Voltar ao painel</Link>
    </div>
  )

  // ─── Render — REUSA o mesmo JSX do novo, com diferenças mínimas ─────────────
  // Importo as mesmas classes CSS inline — mesma stylesheet
  // A única diferença: título diz "Editar", step 7 diz "Salvar", e não cobra créditos

  return (
    <>
      {/* Reusa exatamente o mesmo CSS do /streaming/novo */}
      <style>{editStyles}</style>

      <div className="sw-layout">
        <div className="sw-form-side">
          <div className="sw-header">
            <Link href="/dashboard" className="sw-back">← Voltar</Link>
            <div className="sw-credits">
              <span className="sw-credits-icon">🎬</span>
              <span>Editando</span>
            </div>
          </div>

          <h1 className="sw-title">Editar <span>Streaming</span></h1>
          <p className="sw-subtitle">Alterações são salvas sem custo</p>

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
            {step === 0 && (
              <div className="sw-section">
                <div className="sw-section-title">💑 O Casal</div>
                <div className="sw-field"><label>Nome 1</label><input value={nome1} onChange={e => setNome1(e.target.value)} placeholder="Ex: Gabriel" /></div>
                <div className="sw-field"><label>Nome 2</label><input value={nome2} onChange={e => setNome2(e.target.value)} placeholder="Ex: Maria" /></div>
                <div className="sw-field"><label>Quando começaram?</label><input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} /></div>
                <div className="sw-field"><label>Cidade <span className="sw-optional">(opcional)</span></label><input value={cidade} onChange={e => setCidade(e.target.value)} placeholder="Ex: São Paulo" /></div>
              </div>
            )}
            {step === 1 && (
              <div className="sw-section">
                <div className="sw-section-title">📝 Sinopse</div>
                <p className="sw-hint">Aparece na tela inicial.</p>
                <div className="sw-field"><label>Sinopse</label><textarea value={sinopse} onChange={e => setSinopse(e.target.value)} rows={4} placeholder="Uma história que começou..." maxLength={300} /><div className="sw-char-count">{sinopse.length}/300</div></div>
              </div>
            )}
            {step === 2 && (
              <div className="sw-section">
                <div className="sw-section-title">📸 Episódios</div>
                <p className="sw-hint">Cada foto vira um episódio. Até {MAX_FOTOS} fotos.</p>
                <div className="sw-foto-grid">
                  {Array.from({ length: MAX_FOTOS }).map((_, idx) => (
                    <div key={idx} className="sw-foto-slot">
                      {fotos[idx] ? (<><img src={fotos[idx]!} alt="" className="sw-foto-img" /><button className="sw-foto-remove" onClick={() => removeFoto(idx)}>✕</button><input className="sw-foto-titulo" value={fotosTitulos[idx]} onChange={e => setFotosTitulos(prev => { const n = [...prev]; n[idx] = e.target.value; return n })} placeholder={`Título ep. ${idx + 1}`} /></>) : uploadando === idx ? (<div className="sw-foto-loading">⏳</div>) : (<label className="sw-foto-add" htmlFor={`foto-e-${idx}`}><span>📷</span><span className="sw-foto-add-text">{idx === 0 ? 'Adicionar' : `Foto ${idx + 1}`}</span></label>)}
                      <input id={`foto-e-${idx}`} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFotoUpload(e, idx)} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="sw-section">
                <div className="sw-section-title">🏆 Conquistas</div>
                <p className="sw-hint">Conquistas de tempo são automáticas.</p>
                <div className="sw-conquista-group"><div className="sw-conquista-group-label">🍅 Reação do Público <span className="sw-optional">(1)</span></div><div className="sw-conquista-list">{REACOES_PUBLICO.map(r => (<button key={r.key} className={`sw-conquista-chip ${conquistas.includes(r.key) ? 'sel' : ''}`} onClick={() => toggleConquista(r.key, REACOES_PUBLICO.map(x => x.key))}><span>{r.icon}</span> {r.label}</button>))}</div></div>
                <div className="sw-conquista-group"><div className="sw-conquista-group-label">🏆 Premiações</div><div className="sw-conquista-list">{PREMIACOES.map(r => (<button key={r.key} className={`sw-conquista-chip ${conquistas.includes(r.key) ? 'sel' : ''}`} onClick={() => toggleConquista(r.key)}><span>{r.icon}</span> {r.label}</button>))}</div></div>
                <div className="sw-conquista-group"><div className="sw-conquista-group-label">🎬 Marcos</div><div className="sw-conquista-list">{MARCOS_HISTORIA.map(r => (<button key={r.key} className={`sw-conquista-chip ${conquistas.includes(r.key) ? 'sel' : ''}`} onClick={() => toggleConquista(r.key)}><span>{r.icon}</span> {r.label}</button>))}</div></div>
              </div>
            )}
            {step === 4 && (
              <div className="sw-section">
                <div className="sw-section-title">🎮 Quiz</div>
                <p className="sw-hint">Até {MAX_QUIZ} perguntas. <span className="sw-optional">(opcional)</span></p>
                {quiz.map((q, qi) => (<div key={qi} className="sw-quiz-card"><div className="sw-quiz-header"><span className="sw-quiz-num">Pergunta {qi + 1}</span><button className="sw-quiz-remove" onClick={() => removeQuiz(qi)}>🗑</button></div><div className="sw-field"><input value={q.pergunta} onChange={e => updateQuiz(qi, 'pergunta', e.target.value)} placeholder="Pergunta..." /></div>{q.opcoes.map((op, oi) => (<div key={oi} className="sw-quiz-opcao"><button className={`sw-quiz-radio ${q.correta === oi ? 'sel' : ''}`} onClick={() => updateQuiz(qi, 'correta', oi)}>{q.correta === oi ? '✓' : String.fromCharCode(65 + oi)}</button><input value={op} onChange={e => updateQuizOpcao(qi, oi, e.target.value)} placeholder={`Alt. ${String.fromCharCode(65 + oi)}`} /></div>))}<p className="sw-quiz-tip">Toque na letra para marcar a correta</p></div>))}
                {quiz.length < MAX_QUIZ && (<button className="sw-quiz-add" onClick={addQuiz}>+ Adicionar pergunta</button>)}
              </div>
            )}
            {step === 5 && (
              <div className="sw-section">
                <div className="sw-section-title">💌 Declaração Final</div>
                <div className="sw-field"><label>Mensagem</label><textarea value={msgFinal} onChange={e => setMsgFinal(e.target.value)} rows={5} placeholder="Sua declaração..." /></div>
                <div className="sw-field"><label>Cena pós-créditos <span className="sw-optional">(opcional)</span></label><p className="sw-hint" style={{ marginTop: 0, marginBottom: 8 }}>Estilo Marvel.</p><input value={posCreditos} onChange={e => setPosCreditos(e.target.value)} placeholder="Ex: Temporada 2026" /></div>
              </div>
            )}
            {step === 6 && (
              <div className="sw-section">
                <div className="sw-section-title">🎵 Música</div>
                <p className="sw-hint">Link do YouTube. <span className="sw-optional">(opcional)</span></p>
                <div className="sw-field"><label>Link</label><input value={musicaLink} onChange={e => handleMusicaLink(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." style={{ fontFamily: 'monospace', fontSize: '.85rem' }} />{musicaErro && <div className="sw-field-error">{musicaErro}</div>}</div>
                {musicaInfo && (<div className="sw-musica-preview"><img src={musicaInfo.thumb} alt="" className="sw-musica-thumb" /><div className="sw-musica-info"><div className="sw-musica-title">{musicaInfo.title}</div><div className="sw-musica-yt">▶ YouTube</div></div><button className="sw-musica-remove" onClick={() => { setMusicaInfo(null); setMusicaLink('') }}>✕</button></div>)}
              </div>
            )}
            {step === 7 && (
              <div className="sw-section">
                <div className="sw-section-title">💾 Salvar Alterações</div>
                <div className="sw-review">
                  <div className="sw-review-item"><span>💑</span><strong>{nome1} & {nome2}</strong></div>
                  <div className="sw-review-item"><span>📅</span>{dataInicio}</div>
                  <div className="sw-review-item"><span>📸</span>{fotosPreenchidas.length} foto{fotosPreenchidas.length !== 1 ? 's' : ''}</div>
                  <div className="sw-review-item"><span>🏆</span>{conquistas.length} conquista{conquistas.length !== 1 ? 's' : ''}</div>
                  <div className="sw-review-item"><span>🎮</span>{quiz.length} pergunta{quiz.length !== 1 ? 's' : ''}</div>
                  <div className="sw-review-item"><span>🎵</span>{musicaInfo ? musicaInfo.title : 'Sem música'}</div>
                </div>
                <button className="sw-create-btn" onClick={handleSalvar} disabled={salvando}>
                  {salvando ? '⏳ Salvando...' : '💾 Salvar alterações'}
                </button>
              </div>
            )}
          </div>

          <div className="sw-nav">
            {step > 0 && <button className="sw-nav-btn back" onClick={prevStep}>← Voltar</button>}
            <div style={{ flex: 1 }} />
            <button className="sw-preview-btn-mobile" onClick={() => setShowPreview(true)}>👁 Preview</button>
            {step < STEPS.length - 1 && <button className="sw-nav-btn next" onClick={nextStep}>{STEPS[step + 1].icon} {STEPS[step + 1].label} →</button>}
          </div>
        </div>

        <div className="sw-preview-side">
          <div className="sw-preview-frame">
            <div className="sw-preview-topbar"><div className="sw-preview-dots"><span /><span /><span /></div><span className="sw-preview-url">streaming/{slug}</span></div>
            <div className="sw-preview-content"><StreamingPlayer dados={previewDados} /></div>
          </div>
        </div>

        {showPreview && (
          <div className="sw-preview-modal">
            <button className="sw-preview-modal-close" onClick={() => setShowPreview(false)}>✕ Fechar</button>
            <div className="sw-preview-modal-content"><StreamingPlayer dados={previewDados} /></div>
          </div>
        )}
      </div>
    </>
  )
}

// Reusa o MESMO CSS do /streaming/novo (copiar é intencional pra manter independência)
const editStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap');
  .sw-layout{display:flex;min-height:100vh;background:#0a0a0a;font-family:'Inter',sans-serif;color:#fff}.sw-form-side{flex:1;min-width:0;max-width:640px;display:flex;flex-direction:column;padding:0 0 120px;overflow-y:auto}.sw-preview-side{flex:1;min-width:380px;max-width:480px;position:sticky;top:0;height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;border-left:1px solid rgba(255,255,255,.06);background:rgba(0,0,0,.3)}.sw-header{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;border-bottom:1px solid rgba(255,255,255,.06)}.sw-back{color:rgba(255,255,255,.5);text-decoration:none;font-size:13px;font-weight:500;transition:color .2s}.sw-back:hover{color:#fff}.sw-credits{display:flex;align-items:center;gap:6px;font-size:12px;color:rgba(255,255,255,.4);background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:5px 12px}.sw-credits-icon{font-size:14px}.sw-title{font-family:'Bebas Neue',sans-serif;font-size:32px;letter-spacing:2px;font-weight:400;padding:24px 24px 0}.sw-title span{color:#E50914}.sw-subtitle{font-size:13px;color:rgba(255,255,255,.35);padding:4px 24px 0}.sw-steps{display:flex;gap:4px;padding:20px 24px 0;overflow-x:auto;-webkit-overflow-scrolling:touch}.sw-steps::-webkit-scrollbar{display:none}.sw-step{display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:20px;font-size:11px;font-weight:600;color:rgba(255,255,255,.3);background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);white-space:nowrap;cursor:default;transition:all .2s;flex-shrink:0}.sw-step.done{cursor:pointer;color:rgba(255,255,255,.6);border-color:rgba(229,9,20,.2)}.sw-step.done:hover{background:rgba(229,9,20,.08)}.sw-step.active{color:#fff;background:rgba(229,9,20,.15);border-color:rgba(229,9,20,.4)}.sw-step-dot{font-size:13px}.sw-error{margin:16px 24px 0;padding:10px 14px;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.25);border-radius:8px;font-size:13px;color:#ef4444}.sw-content{padding:20px 24px;flex:1}.sw-section{}.sw-section-title{font-family:'Bebas Neue',sans-serif;font-size:24px;letter-spacing:1px;margin-bottom:16px}.sw-hint{font-size:12px;color:rgba(255,255,255,.35);line-height:1.5;margin-bottom:16px}.sw-optional{color:rgba(255,255,255,.2);font-weight:400}.sw-field{margin-bottom:16px}.sw-field label{display:block;font-size:12px;font-weight:600;color:rgba(255,255,255,.5);margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px}.sw-field input,.sw-field textarea{width:100%;padding:12px 14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:8px;color:#fff;font-size:14px;font-family:'Inter',sans-serif;outline:none;transition:border-color .2s}.sw-field input:focus,.sw-field textarea:focus{border-color:rgba(229,9,20,.5)}.sw-field input::placeholder,.sw-field textarea::placeholder{color:rgba(255,255,255,.2)}.sw-field textarea{resize:vertical;min-height:80px}.sw-field-error{font-size:12px;color:#ef4444;margin-top:4px}.sw-char-count{font-size:11px;color:rgba(255,255,255,.2);text-align:right;margin-top:4px}.sw-foto-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}.sw-foto-slot{position:relative;aspect-ratio:3/4;border-radius:10px;overflow:hidden;background:rgba(255,255,255,.04);border:1.5px dashed rgba(255,255,255,.1);transition:border-color .2s}.sw-foto-slot:hover{border-color:rgba(255,255,255,.2)}.sw-foto-img{width:100%;height:100%;object-fit:cover}.sw-foto-remove{position:absolute;top:6px;right:6px;width:24px;height:24px;border-radius:50%;background:rgba(0,0,0,.7);border:none;color:#fff;font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center}.sw-foto-titulo{position:absolute;bottom:0;left:0;right:0;padding:6px 8px;background:rgba(0,0,0,.7);border:none;color:#fff;font-size:11px;font-family:'Inter',sans-serif;outline:none}.sw-foto-titulo::placeholder{color:rgba(255,255,255,.3)}.sw-foto-loading{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:1.5rem}.sw-foto-add{position:absolute;inset:0;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;font-size:1.5rem;color:rgba(255,255,255,.2);transition:color .2s}.sw-foto-add:hover{color:rgba(255,255,255,.4)}.sw-foto-add-text{font-size:10px}.sw-conquista-group{margin-bottom:20px}.sw-conquista-group-label{font-size:13px;font-weight:600;color:rgba(255,255,255,.5);margin-bottom:10px}.sw-conquista-list{display:flex;flex-wrap:wrap;gap:8px}.sw-conquista-chip{display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:20px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.6);font-size:12px;font-weight:500;cursor:pointer;transition:all .2s;font-family:'Inter',sans-serif}.sw-conquista-chip:hover{border-color:rgba(255,255,255,.2)}.sw-conquista-chip.sel{background:rgba(229,9,20,.12);border-color:rgba(229,9,20,.4);color:#fff}.sw-quiz-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:16px;margin-bottom:14px}.sw-quiz-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}.sw-quiz-num{font-size:12px;font-weight:700;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:1px}.sw-quiz-remove{background:none;border:none;font-size:16px;cursor:pointer;color:rgba(255,255,255,.3);transition:color .2s}.sw-quiz-remove:hover{color:#ef4444}.sw-quiz-opcao{display:flex;align-items:center;gap:8px;margin-bottom:8px}.sw-quiz-radio{width:32px;height:32px;border-radius:8px;flex-shrink:0;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.4);font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;font-family:'Inter',sans-serif}.sw-quiz-radio.sel{background:rgba(34,197,94,.15);border-color:rgba(34,197,94,.4);color:#22c55e}.sw-quiz-tip{font-size:10px;color:rgba(255,255,255,.2);margin-top:6px}.sw-quiz-add{width:100%;padding:12px;background:rgba(255,255,255,.04);border:1px dashed rgba(255,255,255,.12);border-radius:10px;color:rgba(255,255,255,.4);font-size:13px;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif;transition:all .2s}.sw-quiz-add:hover{border-color:rgba(229,9,20,.3);color:rgba(255,255,255,.6)}.sw-musica-preview{display:flex;align-items:center;gap:12px;padding:12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:10px;margin-top:12px}.sw-musica-thumb{width:56px;height:42px;border-radius:6px;object-fit:cover}.sw-musica-info{flex:1;min-width:0}.sw-musica-title{font-size:13px;font-weight:600;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.sw-musica-yt{font-size:11px;color:rgba(255,255,255,.3);margin-top:2px}.sw-musica-remove{width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,.08);border:none;color:rgba(255,255,255,.4);font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}.sw-review{display:flex;flex-direction:column;gap:8px;margin-bottom:20px}.sw-review-item{display:flex;align-items:center;gap:10px;padding:10px 14px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:8px;font-size:13px;color:rgba(255,255,255,.7)}.sw-review-item span{font-size:16px;flex-shrink:0}.sw-review-item strong{color:#fff}.sw-review-cost{display:flex;justify-content:space-between;padding:14px;background:rgba(229,9,20,.08);border:1px solid rgba(229,9,20,.2);border-radius:10px;font-size:14px;color:rgba(255,255,255,.7);margin-bottom:20px}.sw-review-cost strong{color:#E50914}.sw-create-btn{width:100%;padding:16px;background:linear-gradient(135deg,#E50914,#b20710);border:none;border-radius:8px;color:#fff;font-size:16px;font-weight:700;font-family:'Inter',sans-serif;cursor:pointer;transition:all .2s;box-shadow:0 4px 20px rgba(229,9,20,.3)}.sw-create-btn:hover{box-shadow:0 6px 30px rgba(229,9,20,.5);transform:translateY(-1px)}.sw-create-btn:disabled{opacity:.6;cursor:not-allowed;transform:none}.sw-nav{position:fixed;bottom:0;left:0;right:0;max-width:640px;display:flex;align-items:center;gap:8px;padding:14px 24px;background:rgba(10,10,10,.95);backdrop-filter:blur(10px);border-top:1px solid rgba(255,255,255,.06);z-index:50}.sw-nav-btn{padding:10px 20px;border-radius:6px;font-size:13px;font-weight:600;font-family:'Inter',sans-serif;cursor:pointer;transition:all .2s;border:none;-webkit-tap-highlight-color:transparent}.sw-nav-btn.back{background:rgba(255,255,255,.06);color:rgba(255,255,255,.6);border:1px solid rgba(255,255,255,.1)}.sw-nav-btn.back:hover{background:rgba(255,255,255,.1)}.sw-nav-btn.next{background:rgba(229,9,20,.9);color:#fff}.sw-nav-btn.next:hover{background:#E50914}.sw-preview-btn-mobile{display:none;padding:10px 16px;border-radius:6px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.6);font-size:13px;font-weight:600;font-family:'Inter',sans-serif;cursor:pointer}.sw-preview-frame{width:100%;max-width:430px;height:calc(100vh - 48px);border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,.08);background:#000;display:flex;flex-direction:column}.sw-preview-topbar{display:flex;align-items:center;gap:10px;padding:10px 14px;background:rgba(255,255,255,.04);border-bottom:1px solid rgba(255,255,255,.06);flex-shrink:0}.sw-preview-dots{display:flex;gap:5px}.sw-preview-dots span{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.12)}.sw-preview-url{font-size:11px;color:rgba(255,255,255,.2);font-family:monospace}.sw-preview-content{flex:1;overflow-y:auto;overflow-x:hidden;position:relative}.sw-preview-modal{position:fixed;inset:0;z-index:200;background:#000;display:flex;flex-direction:column}.sw-preview-modal-close{position:absolute;top:12px;right:12px;z-index:210;padding:8px 16px;border-radius:20px;background:rgba(255,255,255,.1);border:none;color:#fff;font-size:12px;font-weight:600;font-family:'Inter',sans-serif;cursor:pointer;backdrop-filter:blur(8px)}.sw-preview-modal-content{flex:1;overflow-y:auto}@media(max-width:960px){.sw-preview-side{display:none}.sw-form-side{max-width:100%}.sw-preview-btn-mobile{display:block}.sw-nav{max-width:100%}}@media(max-width:480px){.sw-content{padding:16px 16px}.sw-header{padding:12px 16px}.sw-title{padding:20px 16px 0;font-size:26px}.sw-subtitle{padding:4px 16px 0}.sw-steps{padding:16px 16px 0}.sw-nav{padding:12px 16px}.sw-foto-grid{grid-template-columns:1fr 1fr}}
`