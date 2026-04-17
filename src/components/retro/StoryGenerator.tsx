'use client'

import { toPng } from 'html-to-image'

/**
 * Captura o container do player como PNG.
 * Usa html-to-image pra renderizar o DOM real — o que você vê é o que exporta.
 *
 * @param container - o elemento .retro-v2-player
 * @param filename - nome do arquivo de download
 * @param pixelRatio - resolução (2 = 2x pra retina, resulta em ~860×1920 em tela 430px)
 */
export async function captureSlideAsPNG(
  container: HTMLElement,
  filename: string,
  pixelRatio: number = 2,
): Promise<void> {
  try {
    const dataUrl = await toPng(container, {
      quality: 1,
      pixelRatio,
      // Filtra elementos que não devem aparecer na imagem exportada
      filter: (node: HTMLElement) => {
        // Remove botões de navegação ‹ ›
        if (node.classList?.contains('retro-v2-nav')) return false
        // Remove chip de música
        if (node.classList?.contains('retro-music-chip')) return false
        return true
      },
    })

    // Download
    const a = document.createElement('a')
    a.download = filename
    a.href = dataUrl
    a.click()
  } catch (err) {
    console.error('Erro ao capturar slide:', err)
  }
}

/**
 * Captura múltiplos slides sequencialmente.
 * Navega pro slide, espera renderizar, captura, e segue pro próximo.
 *
 * @param container - o elemento .retro-v2-player
 * @param slideIds - array de IDs dos slides pra capturar (0-8)
 * @param goTo - função pra navegar pro slide
 * @param nome1 - nome 1 (pro filename)
 * @param nome2 - nome 2 (pro filename)
 * @param onProgress - callback com progresso (0 a 1)
 */
export async function captureMultipleSlides(
  container: HTMLElement,
  slideIds: number[],
  goTo: (idx: number) => void,
  nome1: string,
  nome2: string,
  currentSlide: number,
  onProgress?: (progress: number) => void,
): Promise<void> {
  const sorted = [...slideIds].sort((a, b) => a - b)
  const total = sorted.length

  for (let i = 0; i < total; i++) {
    const id = sorted[i]

    // Navega pro slide
    goTo(id)

    // Espera o slide renderizar (transição CSS + animações de entrada)
    await new Promise((r) => setTimeout(r, 800))

    // Captura
    const filename = `retrospectiva-${nome1}-${nome2}-slide${id + 1}.png`
    await captureSlideAsPNG(container, filename)

    // Progresso
    onProgress?.((i + 1) / total)

    // Pausa entre downloads (evita travar o browser)
    if (i < total - 1) {
      await new Promise((r) => setTimeout(r, 400))
    }
  }

  // Volta pro slide original (ou pro último slide = encerramento)
  goTo(currentSlide)
}