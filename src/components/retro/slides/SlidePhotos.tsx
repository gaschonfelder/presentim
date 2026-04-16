'use client'

import { useRetro } from '../RetroProvider'
import PhotoCarousel from '../PhotoCarousel'

export default function SlidePhotos() {
  const { slide, theme } = useRetro()
  const isActive = slide === 4

  return (
    <div
      className={`retro-v2-slide ${isActive ? 'active' : ''}`}
      style={{
        background: theme.bg.photos,
        padding: 0, // carrossel ocupa tudo
        overflow: 'hidden',
      }}
    >
      <PhotoCarousel />
    </div>
  )
}