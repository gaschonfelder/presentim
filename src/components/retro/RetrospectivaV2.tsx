'use client'

import { RetroProvider, type Dados } from './RetroProvider'
import SlideNavigation from './SlideNavigation'
import SlideIntro from './slides/SlideIntro'
import SlideSeason from './slides/SlideSeason'
import SlideCounter from './slides/SlideCounter'
import SlidePhotos from './slides/SlidePhotos'
import SlideStats from './slides/SlideStats'
import SlideAchievements from './slides/SlideAchievements'
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
        <SlidePhotos />
        <SlideStats />
        <SlideAchievements />
        <SlideMessage />
        <SlideEnd />
      </SlideNavigation>
    </RetroProvider>
  )
}