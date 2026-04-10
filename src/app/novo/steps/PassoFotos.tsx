'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import ImageCropper from '@/components/ImageCropper'
import { useNovoContext } from '../NovoContext'
import styles from './steps.module.css'

export default function PassoFotos() {
  const supabase = createClient()
  const { cfg, set, removerFoto, fileInputRef, uploadingFoto, setUploadingFoto, setErro } = useNovoContext()

  const [cropQueue, setCropQueue] = useState<File[]>([])
  const [cropIndex, setCropIndex] = useState(0)

  async function handleFotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    let files = Array.from(e.target.files ?? [])
    if (!files.length) return
    const restante = 5 - cfg.fotos.length
    if (files.length > restante) {
      files = files.slice(0, restante)
      setErro(
        `Máximo de 5 fotos. Apenas ${restante} foto${restante !== 1 ? 's' : ''} será${restante !== 1 ? 'ão' : ''} adicionada${restante !== 1 ? 's' : ''}.`,
      )
    }
    setCropQueue(files)
    setCropIndex(0)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function uploadFotoBlob(blob: Blob, originalName: string): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
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
    setCropQueue([])
    setCropIndex(0)
  }

  return (
    <>
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
        .pf-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }
        .pf-thumb {
          position: relative;
          aspect-ratio: 4/3;
          border-radius: 12px;
          overflow: hidden;
          background: #f5f5f5;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .pf-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .pf-remove {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          border: none;
          font-size: 0.78rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pf-upload {
          border: 2px dashed var(--rose-mid);
          border-radius: 16px;
          padding: 32px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          background: white;
        }
        .pf-upload:hover {
          border-color: var(--rose);
          background: var(--rose-pale);
        }
        .pf-upload-icon {
          font-size: 2.4rem;
          margin-bottom: 8px;
        }
        .pf-upload-text {
          font-size: 0.95rem;
          color: var(--text);
          font-weight: 700;
        }
        .pf-upload-hint {
          font-size: 0.78rem;
          color: var(--text-soft);
          margin-top: 4px;
        }
      `}</style>

      <div className={styles.stepHeader}>
        <p className={styles.stepEyebrow}>Memórias visuais</p>
        <h1 className={styles.stepTitle}>
          Suas <em>fotos</em> favoritas
        </h1>
        <p className={styles.stepDescription}>
          Adicione até 5 fotos. Vai poder enquadrar cada uma do jeito que ficar melhor.
        </p>
      </div>

      {cfg.fotos.length > 0 && (
        <div className="pf-grid">
          {cfg.fotos.map((url, i) => (
            <div className="pf-thumb" key={i}>
              <img src={url} alt={`Foto ${i + 1}`} />
              <button className="pf-remove" onClick={() => removerFoto(i)} aria-label="Remover">
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {cfg.fotos.length < 5 && (
        <>
          <div
            className="pf-upload"
            onClick={() => !uploadingFoto && fileInputRef.current?.click()}
          >
            <div className="pf-upload-icon">{uploadingFoto ? '⏳' : '📷'}</div>
            <div className="pf-upload-text">
              {uploadingFoto ? 'Enviando…' : 'Adicionar fotos'}
            </div>
            <div className="pf-upload-hint">
              {cfg.fotos.length}/5 fotos · Pode selecionar várias de uma vez
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={handleFotoUpload}
          />
        </>
      )}
    </>
  )
}