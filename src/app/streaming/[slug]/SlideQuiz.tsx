'use client'

import { useState, useEffect, useCallback } from 'react'
import type { StreamingDados } from './page'

// ─── Component ────────────────────────────────────────────────────────────────

export default function SlideQuiz({
  dados,
  onNext,
}: {
  dados: StreamingDados
  onNext: () => void
}) {
  const perguntas = dados?.quiz ?? []

  // Se não tem quiz, pula direto
  useEffect(() => {
    if (perguntas.length === 0) onNext()
  }, [perguntas.length, onNext])

  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [wrongSet, setWrongSet] = useState<Set<number>>(new Set())
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0) // acertos de primeira
  const [attempts, setAttempts] = useState(0) // tentativas na pergunta atual
  const [finished, setFinished] = useState(false)
  const [visible, setVisible] = useState(false)
  const [transitioning, setTransitioning] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(t)
  }, [])

  const q = perguntas[current]

  const handleSelect = useCallback((idx: number) => {
    if (isCorrect || selected === idx || wrongSet.has(idx)) return

    setSelected(idx)
    setAttempts(prev => prev + 1)

    if (idx === q?.correta) {
      setIsCorrect(true)
      if (attempts === 0) setScore(prev => prev + 1) // acertou de primeira

      // Avança após 1.5s
      setTimeout(() => {
        if (current + 1 < perguntas.length) {
          setTransitioning(true)
          setTimeout(() => {
            setCurrent(prev => prev + 1)
            setSelected(null)
            setWrongSet(new Set())
            setIsCorrect(false)
            setAttempts(0)
            setTransitioning(false)
          }, 400)
        } else {
          setFinished(true)
        }
      }, 1500)
    } else {
      // Errou — marca como errada, libera pra tentar de novo
      setWrongSet(prev => new Set(prev).add(idx))
      setTimeout(() => setSelected(null), 600)
    }
  }, [isCorrect, selected, wrongSet, q, current, perguntas.length, attempts])

  if (perguntas.length === 0) return null

  // ── Tela de resultado final ──
  if (finished) {
    const total = perguntas.length
    const pct = Math.round((score / total) * 100)
    const emoji = pct === 100 ? '🏆' : pct >= 66 ? '🌟' : pct >= 33 ? '😅' : '💔'
    const msg = pct === 100
      ? 'Vocês se conhecem perfeitamente!'
      : pct >= 66
        ? 'Quase lá! Vocês se conhecem bem.'
        : pct >= 33
          ? 'Dá pra melhorar! Mais maratonas juntos.'
          : 'Hora de prestar mais atenção!'

    return (
      <>
        <style>{quizStyles}</style>
        <div className="qz-wrap">
          <div className="qz-glow" />
          <div className="qz-result">
            <div className="qz-result-emoji">{emoji}</div>
            <div className="qz-result-score">{score}/{total}</div>
            <div className="qz-result-pct">{pct}% de acerto{pct !== 1 ? 's' : ''}</div>
            <div className="qz-result-msg">{msg}</div>

            {/* Resumo por pergunta */}
            <div className="qz-result-list">
              {perguntas.map((p, i) => (
                <div key={i} className="qz-result-item">
                  <span className="qz-result-check">✓</span>
                  <span className="qz-result-q">{p.pergunta}</span>
                  <span className="qz-result-a">{p.opcoes[p.correta]}</span>
                </div>
              ))}
            </div>

            <button className="qz-btn" onClick={onNext}>
              Continuar assistindo
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9,18 15,12 9,6" />
              </svg>
            </button>
          </div>
        </div>
      </>
    )
  }

  // ── Tela de pergunta ──
  return (
    <>
      <style>{quizStyles}</style>
      <div className="qz-wrap">
        <div className="qz-glow" />

        {/* Header */}
        <div className={`qz-hdr ${visible ? 'v' : ''}`}>
          <div className="qz-tag"><span>🎮</span>Quiz do Casal</div>
          <div className="qz-progress-bar">
            {perguntas.map((_, i) => (
              <div
                key={i}
                className={`qz-progress-seg ${i < current ? 'done' : i === current ? 'active' : ''}`}
              />
            ))}
          </div>
          <div className="qz-counter">Pergunta {current + 1} de {perguntas.length}</div>
        </div>

        {/* Pergunta */}
        <div
          className={`qz-question ${visible ? 'v' : ''}`}
          style={{ opacity: transitioning ? 0 : undefined, transform: transitioning ? 'translateY(-20px)' : undefined }}
        >
          <div className="qz-q-icon">❓</div>
          <h2 className="qz-q-text">{q.pergunta}</h2>
        </div>

        {/* Alternativas */}
        <div
          className="qz-options"
          style={{ opacity: transitioning ? 0 : 1, transform: transitioning ? 'translateY(20px)' : 'translateY(0)', transition: 'all .4s ease' }}
        >
          {q.opcoes.map((opcao, i) => {
            const isWrong = wrongSet.has(i)
            const isRight = isCorrect && i === q.correta
            const isSelectedWrong = selected === i && i !== q.correta

            let cls = 'qz-opt'
            if (isRight) cls += ' correct'
            else if (isSelectedWrong) cls += ' wrong'
            else if (isWrong) cls += ' disabled'

            return (
              <button
                key={i}
                className={cls}
                onClick={() => handleSelect(i)}
                disabled={isCorrect || isWrong}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(16px)',
                  transitionDelay: `${0.4 + i * 0.08}s`,
                }}
              >
                <span className="qz-opt-letter">{String.fromCharCode(65 + i)}</span>
                <span className="qz-opt-text">{opcao}</span>
                {isRight && <span className="qz-opt-check">✓</span>}
                {isSelectedWrong && <span className="qz-opt-x">✗</span>}
              </button>
            )
          })}
        </div>

        {/* Feedback */}
        {isCorrect && (
          <div className="qz-feedback correct">
            <span>🎉</span> Acertou{attempts === 1 ? ' de primeira!' : '!'}
          </div>
        )}
      </div>
    </>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const quizStyles = `
  .qz-wrap {
    width:100%; min-height:100dvh; background:#0a0a0a; color:#fff;
    font-family:'Inter',sans-serif;
    display:flex; flex-direction:column; align-items:center;
    position:relative; overflow:hidden;
    padding:0 0 40px;
  }
  .qz-glow {
    position:absolute; top:5%; left:50%; transform:translateX(-50%);
    width:360px; height:360px; border-radius:50%;
    background:radial-gradient(circle, rgba(229,9,20,.06) 0%, transparent 70%);
    pointer-events:none;
  }

  /* ── Header ────────────────────────────────────────────────────── */
  .qz-hdr {
    width:100%; max-width:460px; padding:48px 24px 0; text-align:center;
    opacity:0; transform:translateY(20px); transition:all .7s ease .1s;
  }
  .qz-hdr.v { opacity:1; transform:translateY(0); }
  .qz-tag {
    display:inline-flex; align-items:center; gap:6px;
    background:rgba(229,9,20,.12); border:1px solid rgba(229,9,20,.25);
    color:#E50914; font-size:11px; font-weight:700; letter-spacing:1.5px;
    text-transform:uppercase; padding:5px 14px; border-radius:20px;
    margin-bottom:20px;
  }

  .qz-progress-bar {
    display:flex; gap:4px; margin-bottom:12px;
  }
  .qz-progress-seg {
    flex:1; height:3px; border-radius:2px;
    background:rgba(255,255,255,.12); transition:background .4s ease;
  }
  .qz-progress-seg.done { background:#E50914; }
  .qz-progress-seg.active {
    background:linear-gradient(90deg, #E50914, rgba(229,9,20,.4));
  }

  .qz-counter {
    font-size:12px; color:rgba(255,255,255,.35);
    text-transform:uppercase; letter-spacing:1px; margin-bottom:8px;
  }

  /* ── Pergunta ──────────────────────────────────────────────────── */
  .qz-question {
    width:100%; max-width:460px; padding:24px 24px 0; text-align:center;
    opacity:0; transform:translateY(20px); transition:all .6s ease .25s;
  }
  .qz-question.v { opacity:1; transform:translateY(0); }
  .qz-q-icon { font-size:2.5rem; margin-bottom:12px; }
  .qz-q-text {
    font-family:'Bebas Neue',sans-serif;
    font-size:28px; font-weight:400; letter-spacing:1px;
    line-height:1.3; color:#fff;
  }

  /* ── Alternativas ──────────────────────────────────────────────── */
  .qz-options {
    width:100%; max-width:460px; padding:28px 24px 0;
    display:flex; flex-direction:column; gap:10px;
    transition:all .4s ease;
  }

  .qz-opt {
    position:relative; display:flex; align-items:center; gap:14px;
    width:100%; padding:16px 18px;
    background:rgba(255,255,255,.04);
    border:1.5px solid rgba(255,255,255,.1);
    border-radius:12px;
    color:#fff; font-family:'Inter',sans-serif; font-size:15px; font-weight:500;
    cursor:pointer; text-align:left;
    transition:all .3s ease;
    -webkit-tap-highlight-color:transparent;
  }
  .qz-opt:hover:not(:disabled) {
    background:rgba(255,255,255,.08);
    border-color:rgba(255,255,255,.2);
    transform:translateX(4px);
  }
  .qz-opt:active:not(:disabled) { transform:scale(.98); }

  .qz-opt.correct {
    background:rgba(34,197,94,.12);
    border-color:rgba(34,197,94,.5);
    box-shadow:0 0 20px rgba(34,197,94,.2);
    animation:qz-pop .4s ease;
  }
  .qz-opt.wrong {
    background:rgba(239,68,68,.12);
    border-color:rgba(239,68,68,.5);
    box-shadow:0 0 16px rgba(239,68,68,.15);
    animation:qz-shake .4s ease;
  }
  .qz-opt.disabled {
    opacity:.35; cursor:not-allowed;
    border-color:rgba(239,68,68,.2);
    background:rgba(239,68,68,.05);
  }

  .qz-opt-letter {
    width:32px; height:32px; border-radius:8px;
    background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.12);
    display:flex; align-items:center; justify-content:center;
    font-size:13px; font-weight:700; color:rgba(255,255,255,.5);
    flex-shrink:0; transition:all .3s ease;
  }
  .qz-opt.correct .qz-opt-letter {
    background:rgba(34,197,94,.2); border-color:rgba(34,197,94,.4); color:#22c55e;
  }
  .qz-opt.wrong .qz-opt-letter, .qz-opt.disabled .qz-opt-letter {
    background:rgba(239,68,68,.15); border-color:rgba(239,68,68,.3); color:#ef4444;
  }

  .qz-opt-text { flex:1; line-height:1.4; }

  .qz-opt-check {
    font-size:18px; font-weight:700; color:#22c55e;
    animation:qz-pop .4s ease;
  }
  .qz-opt-x {
    font-size:18px; font-weight:700; color:#ef4444;
    animation:qz-shake .4s ease;
  }

  /* ── Feedback ──────────────────────────────────────────────────── */
  .qz-feedback {
    margin-top:20px; padding:12px 24px; border-radius:12px;
    font-size:15px; font-weight:600;
    display:flex; align-items:center; gap:8px;
    animation:qz-fade-up .4s ease;
  }
  .qz-feedback.correct {
    background:rgba(34,197,94,.12); border:1px solid rgba(34,197,94,.3);
    color:#22c55e;
  }

  /* ── Resultado final ───────────────────────────────────────────── */
  .qz-result {
    width:100%; max-width:460px; padding:60px 24px 0;
    text-align:center; animation:qz-fade-up .6s ease;
    position:relative; z-index:1;
  }
  .qz-result-emoji {
    font-size:4rem; margin-bottom:16px;
    animation:qz-bounce 1s ease;
  }
  .qz-result-score {
    font-family:'Bebas Neue',sans-serif;
    font-size:72px; font-weight:400; letter-spacing:3px;
    color:#E50914; line-height:1;
  }
  .qz-result-pct {
    font-size:14px; color:rgba(255,255,255,.45);
    text-transform:uppercase; letter-spacing:1px; margin-top:4px;
  }
  .qz-result-msg {
    font-size:18px; font-weight:600; color:rgba(255,255,255,.85);
    margin-top:16px; line-height:1.5;
  }

  .qz-result-list {
    margin-top:28px; display:flex; flex-direction:column; gap:10px;
    text-align:left;
  }
  .qz-result-item {
    display:flex; align-items:flex-start; gap:10px;
    background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08);
    border-radius:10px; padding:12px 14px;
  }
  .qz-result-check {
    width:22px; height:22px; border-radius:6px;
    background:rgba(34,197,94,.15); color:#22c55e;
    display:flex; align-items:center; justify-content:center;
    font-size:12px; font-weight:700; flex-shrink:0;
  }
  .qz-result-q {
    flex:1; font-size:13px; color:rgba(255,255,255,.6); line-height:1.4;
  }
  .qz-result-a {
    font-size:13px; font-weight:600; color:rgba(255,255,255,.9);
    flex-shrink:0;
  }

  /* ── Botão ─────────────────────────────────────────────────────── */
  .qz-btn {
    display:flex; align-items:center; justify-content:center; gap:8px;
    margin:32px auto 0; padding:14px 32px;
    background:rgba(255,255,255,.1); color:#fff;
    border:1px solid rgba(255,255,255,.2); border-radius:4px;
    font-size:15px; font-weight:600; font-family:'Inter',sans-serif;
    cursor:pointer; transition:all .2s ease; -webkit-tap-highlight-color:transparent;
    width:100%; max-width:460px;
  }
  .qz-btn:hover { background:rgba(255,255,255,.15); }

  /* ── Keyframes ─────────────────────────────────────────────────── */
  @keyframes qz-pop {
    0% { transform:scale(1); }
    40% { transform:scale(1.05); }
    100% { transform:scale(1); }
  }
  @keyframes qz-shake {
    0%, 100% { transform:translateX(0); }
    20% { transform:translateX(-6px); }
    40% { transform:translateX(6px); }
    60% { transform:translateX(-4px); }
    80% { transform:translateX(4px); }
  }
  @keyframes qz-fade-up {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes qz-bounce {
    0%   { transform:scale(0.3); opacity:0; }
    50%  { transform:scale(1.15); }
    70%  { transform:scale(0.95); }
    100% { transform:scale(1); opacity:1; }
  }

  @media(max-width:480px) {
    .qz-hdr { padding:36px 20px 0; }
    .qz-q-text { font-size:24px; }
    .qz-options { padding:24px 16px 0; }
    .qz-opt { padding:14px 14px; font-size:14px; }
    .qz-opt-letter { width:28px; height:28px; font-size:12px; }
    .qz-result { padding:48px 20px 0; }
    .qz-result-score { font-size:56px; }
  }
`