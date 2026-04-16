'use client'

import { RetroProvider, type Dados } from './RetroProvider'
import SlideNavigation from './SlideNavigation'
import SlideIntro from './slides/SlideIntro'
import SlidePlaceholder from './slides/SlidePlaceholder'

export default function RetrospectivaV2({ dados }: { dados: Dados }) {
  return (
    <RetroProvider dados={dados}>
      <SlideNavigation>
        <SlideIntro />
        <SlidePlaceholder index={1} label="Estação" icon="🌸" bgKey="season" />
        <SlidePlaceholder index={2} label="Tempo juntos" icon="⏱️" bgKey="counter" />
        <SlidePlaceholder index={3} label="Céu estrelado" icon="🌙" bgKey="sky" />
        <SlidePlaceholder index={4} label="Fotos" icon="📷" bgKey="photos" />
        <SlidePlaceholder index={5} label="Estatísticas" icon="📊" bgKey="stats" />
        <SlidePlaceholder index={6} label="Conquistas" icon="🏆" bgKey="achievements" />
        <SlidePlaceholder index={7} label="Mensagem" icon="💌" bgKey="message" />
        <SlidePlaceholder index={8} label="Para sempre" icon="❤️" bgKey="end" />
      </SlideNavigation>
    </RetroProvider>
  )
}