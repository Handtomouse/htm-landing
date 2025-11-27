'use client'

import { useState, useEffect } from 'react'

interface PulseWaveProjectileProps {
  startX: number
  startY: number
  direction: 'left' | 'right'
  onDestroy: () => void
}

export default function PulseWaveProjectile({ startX, startY, direction, onDestroy }: PulseWaveProjectileProps) {
  const [x, setX] = useState(startX)
  const [pulseWidth, setPulseWidth] = useState(4)

  // Pulsing animation (4px ↔ 6px, 150ms cycle)
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseWidth(prev => prev === 4 ? 6 : 4)
    }, 150)

    return () => clearInterval(pulseInterval)
  }, [])

  // Movement animation (450px/second)
  useEffect(() => {
    const speed = 450 // px per second
    const fps = 60
    const distance = speed / fps
    const moveInterval = setInterval(() => {
      setX(prev => {
        const newX = direction === 'right' ? prev + distance : prev - distance

        // Check if off screen
        if (newX > window.innerWidth + 100 || newX < -100) {
          onDestroy()
          return prev
        }

        return newX
      })
    }, 1000 / fps)

    return () => clearInterval(moveInterval)
  }, [direction, onDestroy])

  return (
    <div
      className="fixed pointer-events-none"
      style={{
        left: `${x}px`,
        top: `${startY}px`,
        transform: 'translateY(-50%)',
        zIndex: 5
      }}
    >
      <div
        style={{
          width: `${pulseWidth}px`,
          height: '50px',
          background: '#ff9d23',
          boxShadow: '0 0 12px rgba(255, 157, 35, 0.8)',
          transition: 'width 150ms ease-in-out'
        }}
      />
    </div>
  )
}
