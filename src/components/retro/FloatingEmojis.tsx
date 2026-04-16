'use client'

import { useMemo } from 'react'
import { pseudoRand } from '@/lib/retro'

type Props = {
  emojis: string[]
  count?: number
  /** Se 'bottom', sobem de baixo pra cima (padrão da intro). Se 'spread', espalhados. */
  mode?: 'bottom' | 'spread'
}

export default function FloatingEmojis({ emojis, count = 16, mode = 'bottom' }: Props) {
  const data = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: `${(pseudoRand(i * 13 + 1) * 100).toFixed(4)}%`,
        top:
          mode === 'bottom'
            ? `${(60 + pseudoRand(i * 7 + 3) * 40).toFixed(4)}%`
            : `${(pseudoRand(i * 13 + 5) * 100).toFixed(4)}%`,
        fontSize: `${(0.8 + pseudoRand(i * 5 + 2) * 1.1).toFixed(4)}rem`,
        duration: `${(7 + pseudoRand(i * 11 + 4) * 10).toFixed(4)}s`,
        delay: `${(pseudoRand(i * 9 + 6) * 12).toFixed(4)}s`,
        emoji: emojis[i % emojis.length],
      })),
    [emojis, count, mode],
  )

  return (
    <>
      {data.map((h, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: h.left,
            top: h.top,
            fontSize: h.fontSize,
            opacity: 0,
            animation: 'floatUp linear infinite',
            animationDuration: h.duration,
            animationDelay: h.delay,
            pointerEvents: 'none',
          }}
        >
          {h.emoji}
        </div>
      ))}
    </>
  )
}