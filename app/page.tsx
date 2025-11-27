'use client'

import { useState, useCallback, useEffect } from 'react'
import TerminalTypewriter from '@/components/TerminalTypewriter'
import PongHand from '@/components/PongHand'
import PulseWaveProjectile from '@/components/PulseWaveProjectile'

interface Projectile {
  id: string
  startX: number
  startY: number
  direction: 'left' | 'right'
}

interface HandPosition {
  x: number
  y: number
}

export default function Home() {
  const [projectiles, setProjectiles] = useState<Projectile[]>([])
  const [leftHandPos, setLeftHandPos] = useState<HandPosition>({ x: 80, y: window.innerHeight / 2 })
  const [rightHandPos, setRightHandPos] = useState<HandPosition>({ x: window.innerWidth - 80, y: window.innerHeight / 2 })
  const [leftDodge, setLeftDodge] = useState(false)
  const [rightDodge, setRightDodge] = useState(false)
  const [leftHit, setLeftHit] = useState(false)
  const [rightHit, setRightHit] = useState(false)

  // Hand fires projectile
  const handleFire = useCallback((position: { x: number; y: number }, side: 'left' | 'right') => {
    const newProjectile: Projectile = {
      id: `${Date.now()}-${Math.random()}`,
      startX: position.x,
      startY: position.y,
      direction: side === 'left' ? 'right' : 'left'
    }
    setProjectiles(prev => [...prev, newProjectile])
  }, [])

  // Remove projectile
  const handleProjectileDestroy = useCallback((id: string) => {
    setProjectiles(prev => prev.filter(p => p.id !== id))
  }, [])

  // Simple collision detection
  const checkCollisions = useCallback(() => {
    projectiles.forEach(proj => {
      const targetHand = proj.direction === 'left' ? leftHandPos : rightHandPos
      const distance = Math.abs(proj.startX - targetHand.x)

      // If projectile is near hand
      if (distance < 100 && Math.abs(proj.startY - targetHand.y) < 50) {
        // 70% dodge, 30% hit
        if (Math.random() < 0.7) {
          // Dodge
          if (proj.direction === 'left') {
            setLeftDodge(true)
            setTimeout(() => setLeftDodge(false), 300)
          } else {
            setRightDodge(true)
            setTimeout(() => setRightDodge(false), 300)
          }
        } else {
          // Hit
          if (proj.direction === 'left') {
            setLeftHit(true)
            setTimeout(() => setLeftHit(false), 100)
          } else {
            setRightHit(true)
            setTimeout(() => setRightHit(false), 100)
          }
        }
        handleProjectileDestroy(proj.id)
      }
    })
  }, [projectiles, leftHandPos, rightHandPos, handleProjectileDestroy])

  // Check collisions periodically
  useEffect(() => {
    const interval = setInterval(checkCollisions, 50)
    return () => clearInterval(interval)
  }, [checkCollisions])

  const handleEmailSubmit = async (email: string) => {
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
    } catch (error) {
      console.error('Subscription error:', error)
    }
  }

  return (
    <main
      className="relative w-full h-screen overflow-hidden"
      style={{ background: '#000' }}
    >
      {/* Left Hand */}
      <PongHand
        side="left"
        onFire={(pos) => handleFire(pos, 'left')}
        onPositionChange={setLeftHandPos}
        shouldDodge={leftDodge}
        hitFlash={leftHit}
      />

      {/* Right Hand */}
      <PongHand
        side="right"
        onFire={(pos) => handleFire(pos, 'right')}
        onPositionChange={setRightHandPos}
        shouldDodge={rightDodge}
        hitFlash={rightHit}
      />

      {/* Projectiles */}
      {projectiles.map(proj => (
        <PulseWaveProjectile
          key={proj.id}
          startX={proj.startX}
          startY={proj.startY}
          direction={proj.direction}
          onDestroy={() => handleProjectileDestroy(proj.id)}
        />
      ))}

      {/* Terminal (centered) */}
      <TerminalTypewriter onEmailSubmit={handleEmailSubmit} />
    </main>
  )
}
