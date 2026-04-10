'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useNovoContext } from '../NovoContext'
import styles from './steps.module.css'

export default function PassoMusica() {
  const supabase = createClient()
  const {
    cfg,
    set,
    musicInputRef,
    uploadingMusica,
    setUploadingMusica,
    setErro,
  } = useNovoContext()

  const [musicaTab, setMusicaTab] = useState(0) // 0=youtube 1=upload
  const [musicaLink, setMusicaLink] = useState('')
  const [musicaErro, setMusicaErro] = useState('')
  const [musicaLoading, setMusicaLoading] = useState(false)

  function extrairVideoId(url: string): string | null {
    const m = url.match(/(?:v=|youtu\.be\/|shorts\/)([\w-]{11})/)
    return m ? m[1] : null
  }

  async function handleMusicaYouTube() {
    const videoId = extrairVideoId(musicaLink)
    if (!videoId) {
      setMusicaErro('Link do YouTube inválido.')
      return
    }
    setMusicaLoading(true)
    setMusicaErro('')
    try {
      const res = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
      )
      if (!res.ok) throw new Error()
      const data = await res.json()
      set('musica_info', { videoId, title: data.title })
      set('musica_url', '')
    } catch {
      setMusicaErro('Não foi possível carregar esse vídeo. Verifique o link.')
    }
    setMusicaLoading(false)
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

  return (
    <>
      <style>{`
        .pm-tabs {
          display: flex;
          gap: 0;
          margin-bottom: 14px;
          border-radius: 12px;
          overflow: hidden;
          border: 2px solid var(--rose-mid);
        }
        .pm-tab {
          flex: 1;
          padding: 11px 0;
          border: none;
          cursor: pointer;
          font-family: 'Lato', sans-serif;
          font-size: 0.88rem;
          font-weight: 700;
          background: white;
          color: var(--text-soft);
          transition: all 0.2s;
        }
        .pm-tab.active {
          background: var(--rose);
          color: white;
        }
        .pm-yt-row {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
        }
        .pm-yt-row input {
          flex: 1;
          padding: 12px 16px;
          border: 2px solid var(--rose-mid);
          border-radius: 12px;
          font-family: 'Lato', sans-serif;
          font-size: 0.92rem;
          outline: none;
        }
        .pm-yt-row input:focus {
          border-color: var(--rose);
        }
        .pm-yt-btn {
          padding: 12px 20px;
          background: var(--rose);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Lato', sans-serif;
        }
        .pm-yt-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .pm-info {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--rose-pale);
          border: 1.5px solid var(--rose-mid);
          border-radius: 12px;
          padding: 14px 16px;
          margin-bottom: 12px;
        }
        .pm-info img {
          width: 56px;
          height: 42px;
          border-radius: 6px;
          object-fit: cover;
        }
        .pm-info-text {
          flex: 1;
        }
        .pm-info-title {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 2px;
        }
        .pm-info-source {
          font-size: 0.74rem;
          color: var(--text-soft);
        }
        .pm-info-remove {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--rose);
          font-size: 0.82rem;
          font-weight: 700;
        }
        .pm-upload {
          border: 2px dashed var(--rose-mid);
          border-radius: 12px;
          padding: 24px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          background: white;
        }
        .pm-upload:hover {
          border-color: var(--rose);
          background: var(--rose-pale);
        }
        .pm-error {
          font-size: 0.82rem;
          color: #c0415a;
          margin-top: 6px;
        }
      `}</style>

      <div className={styles.stepHeader}>
        <p className={styles.stepEyebrow}>Trilha sonora · opcional</p>
        <h1 className={styles.stepTitle}>
          A música <em>de vocês</em>
        </h1>
        <p className={styles.stepDescription}>
          Adicione uma música pra tocar enquanto a pessoa rola o presente.
          Pode ser um link do YouTube ou um arquivo MP3.
        </p>
      </div>

      {cfg.musica_info ? (
        <div className="pm-info">
          <img
            src={`https://img.youtube.com/vi/${cfg.musica_info.videoId}/default.jpg`}
            alt=""
          />
          <div className="pm-info-text">
            <div className="pm-info-title">{cfg.musica_info.title}</div>
            <div className="pm-info-source">YouTube</div>
          </div>
          <button
            className="pm-info-remove"
            onClick={() => {
              set('musica_info', null)
              setMusicaLink('')
            }}
          >
            Remover
          </button>
        </div>
      ) : cfg.musica_url ? (
        <div className="pm-info">
          <div style={{ fontSize: '1.6rem' }}>🎵</div>
          <div className="pm-info-text">
            <div className="pm-info-title">Arquivo de música</div>
            <div className="pm-info-source">MP3 enviado</div>
          </div>
          <button className="pm-info-remove" onClick={() => set('musica_url', '')}>
            Remover
          </button>
        </div>
      ) : (
        <>
          <div className="pm-tabs">
            <button
              className={`pm-tab ${musicaTab === 0 ? 'active' : ''}`}
              onClick={() => setMusicaTab(0)}
            >
              ▶️ YouTube
            </button>
            <button
              className={`pm-tab ${musicaTab === 1 ? 'active' : ''}`}
              onClick={() => setMusicaTab(1)}
            >
              📁 Upload MP3
            </button>
          </div>

          {musicaTab === 0 ? (
            <>
              <div className="pm-yt-row">
                <input
                  type="url"
                  placeholder="Cole o link do YouTube…"
                  value={musicaLink}
                  onChange={e => setMusicaLink(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleMusicaYouTube()}
                />
                <button
                  className="pm-yt-btn"
                  onClick={handleMusicaYouTube}
                  disabled={musicaLoading || !musicaLink}
                >
                  {musicaLoading ? '⏳' : 'OK'}
                </button>
              </div>
              {musicaErro && <div className="pm-error">{musicaErro}</div>}
            </>
          ) : (
            <>
              <div
                className="pm-upload"
                onClick={() => !uploadingMusica && musicInputRef.current?.click()}
              >
                <div style={{ fontSize: '2rem', marginBottom: 6 }}>
                  {uploadingMusica ? '⏳' : '🎵'}
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text)' }}>
                  {uploadingMusica ? 'Enviando…' : 'Escolher arquivo MP3'}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-soft)', marginTop: 4 }}>
                  Máximo 10MB
                </div>
              </div>
              <input
                ref={musicInputRef}
                type="file"
                accept="audio/mpeg,audio/mp3"
                style={{ display: 'none' }}
                onChange={handleMusicaUpload}
              />
            </>
          )}
        </>
      )}
    </>
  )
}