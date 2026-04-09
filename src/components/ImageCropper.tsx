'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

type ImageCropperProps = {
  file: File
  aspect?: number          // Ex: 4/3 — default 4/3
  maxWidth?: number        // Largura máxima do output (default 1200)
  quality?: number         // Qualidade JPEG (default 0.85)
  allowSkip?: boolean      // Se true, mostra botão "Usar original"
  currentIndex?: number    // Pra mostrar "Foto 2 de 5"
  totalCount?: number
  onConfirm: (blob: Blob) => void
  onSkip?: (originalFile: File) => void
  onCancel: () => void
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export default function ImageCropper({
  file,
  aspect = 4 / 3,
  maxWidth = 1200,
  quality = 0.85,
  allowSkip = true,
  currentIndex,
  totalCount,
  onConfirm,
  onSkip,
  onCancel,
}: ImageCropperProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const [imgSrc, setImgSrc] = useState<string>('')
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<Crop>()
  const [processing, setProcessing] = useState(false)

  // Carrega o arquivo em data URL ao montar
  useEffect(() => {
    const reader = new FileReader()
    reader.addEventListener('load', () => setImgSrc(reader.result?.toString() ?? ''))
    reader.readAsDataURL(file)
  }, [file])

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height, aspect))
  }

  const handleConfirm = useCallback(async () => {
    const image = imgRef.current
    if (!image || !completedCrop) return

    setProcessing(true)

    try {
      // Dimensões reais da imagem (não as renderizadas)
      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height

      const cropX = completedCrop.x * scaleX
      const cropY = completedCrop.y * scaleY
      const cropWidth = completedCrop.width * scaleX
      const cropHeight = completedCrop.height * scaleY

      // Calcula dimensão final respeitando maxWidth
      const ratio = cropWidth / cropHeight
      let outputWidth = Math.min(cropWidth, maxWidth)
      let outputHeight = outputWidth / ratio

      // Cria canvas com o crop
      const canvas = document.createElement('canvas')
      canvas.width = outputWidth
      canvas.height = outputHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas context não disponível')

      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(
        image,
        cropX, cropY, cropWidth, cropHeight,
        0, 0, outputWidth, outputHeight,
      )

      // Converte pra blob JPEG com compressão
      canvas.toBlob(
        (blob) => {
          if (blob) {
            onConfirm(blob)
          } else {
            alert('Erro ao processar imagem. Tente novamente.')
          }
          setProcessing(false)
        },
        'image/jpeg',
        quality,
      )
    } catch (err) {
      console.error('Erro no crop:', err)
      alert('Erro ao processar imagem. Tente novamente.')
      setProcessing(false)
    }
  }, [completedCrop, maxWidth, quality, onConfirm])

  const showCounter = typeof currentIndex === 'number' && typeof totalCount === 'number' && totalCount > 1

  return (
    <>
      <style>{`
        .cropper-overlay {
          position: fixed; inset: 0; z-index: 2000;
          background: rgba(0,0,0,.75); backdrop-filter: blur(6px);
          display: flex; flex-direction: column;
          padding: 16px;
        }
        .cropper-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 4px 16px; color: white;
          flex-shrink: 0;
        }
        .cropper-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem; font-weight: 700;
        }
        .cropper-counter {
          font-size: .8rem; color: rgba(255,255,255,.7);
          margin-top: 2px;
        }
        .cropper-close {
          background: rgba(255,255,255,.1); border: none;
          color: white; width: 36px; height: 36px;
          border-radius: 50%; font-size: 1rem; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
        }
        .cropper-body {
          flex: 1;
          display: flex; align-items: center; justify-content: center;
          overflow: auto;
          background: rgba(0,0,0,.3);
          border-radius: 12px;
          padding: 16px;
        }
        .cropper-body .ReactCrop {
          max-width: 100%;
          max-height: 100%;
        }
        .cropper-body img {
          max-width: 100%;
          max-height: 65vh;
          display: block;
        }
        .cropper-footer {
          display: flex; gap: 10px; padding: 16px 4px 8px;
          flex-shrink: 0;
        }
        .cropper-btn {
          flex: 1; padding: 14px 16px;
          border-radius: 12px; font-family: 'Lato', sans-serif;
          font-size: .9rem; font-weight: 700; cursor: pointer;
          border: none; transition: opacity .2s, transform .2s;
        }
        .cropper-btn:active { transform: scale(.97); }
        .cropper-btn:disabled { opacity: .5; cursor: not-allowed; }
        .cropper-btn-confirm {
          background: linear-gradient(135deg, #e8627a, #c94f68);
          color: white;
          box-shadow: 0 4px 16px rgba(232,98,122,.4);
        }
        .cropper-btn-skip {
          background: rgba(255,255,255,.15);
          color: white;
          border: 1px solid rgba(255,255,255,.25);
        }
        .cropper-hint {
          text-align: center; color: rgba(255,255,255,.6);
          font-size: .78rem; padding: 0 8px 8px;
        }
        @media (min-width: 700px) {
          .cropper-overlay {
            align-items: center; justify-content: center;
            padding: 40px;
          }
          .cropper-modal {
            background: #1a1a2e;
            border-radius: 20px;
            padding: 20px;
            max-width: 720px;
            width: 100%;
            max-height: calc(100vh - 80px);
            display: flex; flex-direction: column;
          }
          .cropper-body img {
            max-height: 60vh;
          }
        }
      `}</style>

      <div className="cropper-overlay">
        <div className="cropper-modal" style={{ display: 'contents' }}>
          <div className="cropper-header">
            <div>
              <div className="cropper-title">Enquadrar foto</div>
              {showCounter && (
                <div className="cropper-counter">
                  Foto {currentIndex! + 1} de {totalCount}
                </div>
              )}
            </div>
            <button className="cropper-close" onClick={onCancel} aria-label="Cancelar">✕</button>
          </div>

          <div className="cropper-body">
            {imgSrc && (
              <ReactCrop
                crop={crop}
                onChange={(_, pct) => setCrop(pct)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspect}
                minWidth={50}
                keepSelection
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img ref={imgRef} alt="" src={imgSrc} onLoad={onImageLoad} />
              </ReactCrop>
            )}
          </div>

          <p className="cropper-hint">
            Arraste para mover · Ajuste as bordas para redimensionar
          </p>

          <div className="cropper-footer">
            {allowSkip && onSkip && (
              <button
                className="cropper-btn cropper-btn-skip"
                onClick={() => onSkip(file)}
                disabled={processing}
              >
                Usar original
              </button>
            )}
            <button
              className="cropper-btn cropper-btn-confirm"
              onClick={handleConfirm}
              disabled={processing || !completedCrop}
            >
              {processing ? 'Processando…' : 'Confirmar'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}