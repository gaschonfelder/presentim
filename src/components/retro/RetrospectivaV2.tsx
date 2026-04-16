'use client'

import { RetroProvider, type Dados } from './RetroProvider'
import SlideNavigation from './SlideNavigation'
import SlideIntro from './slides/SlideIntro'
import SlideSeason from './slides/SlideSeason'
import SlideCounter from './slides/SlideCounter'
import SlideMessage from './slides/SlideMessage'
import SlideEnd from './slides/SlideEnd'
import SlidePlaceholder from './slides/SlidePlaceholder'

export default function RetrospectivaV2({ dados }: { dados: Dados }) {
  return (
    <RetroProvider dados={dados}>
      <SlideNavigation>
        <SlideIntro />
        <SlideSeason />
        <SlideCounter />
        <SlidePlaceholder index={3} label="Céu estrelado" icon="🌙" bgKey="sky" />
        <SlidePlaceholder index={4} label="Fotos" icon="📷" bgKey="photos" />
        <SlidePlaceholder index={5} label="Estatísticas" icon="📊" bgKey="stats" />
        <SlidePlaceholder index={6} label="Conquistas" icon="🏆" bgKey="achievements" />
        <SlideMessage />
        <SlideEnd />
      </SlideNavigation>
    </RetroProvider>
  )
}