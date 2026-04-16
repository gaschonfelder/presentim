'use client'

import { RetroProvider, type Dados } from './RetroProvider'
import SlideNavigation from './SlideNavigation'
import MusicPlayer from './MusicPlayer'
import SlideIntro from './slides/SlideIntro'
import SlideSeason from './slides/SlideSeason'
import SlideCounter from './slides/SlideCounter'
import SlideSky from './slides/SlideSky'
import SlidePhotos from './slides/SlidePhotos'
import SlideStats from './slides/SlideStats'
import SlideAchievements from './slides/SlideAchievements'
import SlideMessage from './slides/SlideMessage'
import SlideEnd from './slides/SlideEnd'

export default function RetrospectivaV2({ dados }: { dados: Dados }) {
  return (
    <RetroProvider dados={dados}>
      <SlideNavigation>
        <SlideIntro />
        <SlideSeason />
        <SlideCounter />
        <SlideSky />
        <SlidePhotos />
        <SlideStats />
        <SlideAchievements />
        <SlideMessage />
        <SlideEnd />
        <MusicPlayer />
      </SlideNavigation>
    </RetroProvider>
  )
}