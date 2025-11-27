'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface PongHandProps {
  side: 'left' | 'right'
  onFire: (position: { x: number; y: number }) => void
  onPositionChange: (position: { x: number; y: number }) => void
  shouldDodge?: boolean
  hitFlash?: boolean
}

export default function PongHand({ side, onFire, onPositionChange, shouldDodge, hitFlash }: PongHandProps) {
  const [yPosition, setYPosition] = useState(50) // Percentage
  const [isRecoiling, setIsRecoiling] = useState(false)

  // Random AI movement (arcade Pong feel)
  useEffect(() => {
    const moveInterval = setInterval(() => {
      // Random position between 10% and 90%
      const newY = Math.random() * 80 + 10
      setYPosition(newY)

      // Notify parent of position change
      const x = side === 'left' ? 80 : window.innerWidth - 80
      const y = (newY / 100) * window.innerHeight
      onPositionChange({ x, y })
    }, Math.random() * 1000 + 1000) // 1-2 seconds

    return () => clearInterval(moveInterval)
  }, [side, onPositionChange])

  // Random shooting (2-4 seconds)
  useEffect(() => {
    const fireInterval = setInterval(() => {
      if (Math.random() > 0.5) { // 50% chance to fire
        const x = side === 'left' ? 80 : window.innerWidth - 80
        const y = (yPosition / 100) * window.innerHeight
        onFire({ x, y })
      }
    }, Math.random() * 2000 + 2000) // 2-4 seconds

    return () => clearInterval(fireInterval)
  }, [side, yPosition, onFire])

  // Dodge animation
  useEffect(() => {
    if (shouldDodge) {
      // Quick dodge move
      const dodgeAmount = Math.random() > 0.5 ? 10 : -10
      setYPosition(prev => Math.max(10, Math.min(90, prev + dodgeAmount)))
    }
  }, [shouldDodge])

  // Hit flash/recoil
  useEffect(() => {
    if (hitFlash) {
      setIsRecoiling(true)
      setTimeout(() => setIsRecoiling(false), 100)
    }
  }, [hitFlash])

  const xPosition = side === 'left' ? 80 : 'calc(100vw - 180px)'

  return (
    <div
      className="fixed transition-all duration-300 ease-out"
      style={{
        left: side === 'left' ? xPosition : 'auto',
        right: side === 'right' ? '80px' : 'auto',
        top: `${yPosition}%`,
        transform: `translateY(-50%) ${isRecoiling ? 'translateX(' + (side === 'left' ? '-10px' : '10px') + ')' : ''}`,
        filter: hitFlash ? 'brightness(2)' : 'none',
        zIndex: 10
      }}
    >
      <Image
        src="/HTM-LOGO-ICON-01.svg"
        alt={`${side} hand`}
        width={100}
        height={100}
        className="pixel-art"
        style={{
          transform: side === 'left' ? 'scaleX(-1)' : 'none' // Mirror left hand
        }}
        priority
      />
    </div>
  )
}
