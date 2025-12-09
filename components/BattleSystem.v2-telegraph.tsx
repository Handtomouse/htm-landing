'use client'

import { useState, useEffect, useRef, ReactNode } from 'react'

// Simple interfaces
interface Projectile {
  id: string
  side: 'left' | 'right'
  x: number // Spawn X position
  y: number // Spawn Y position
  startTime: number
  active: boolean
}

interface Impact {
  id: string
  x: number
  y: number
  timestamp: number
}

interface MuzzleFlash {
  id: string
  side: 'left' | 'right'
  x: number // Fingertip X position
  y: number // Fingertip Y position
  timestamp: number
}

type HandState = 'alive' | 'dying' | 'respawning' | 'invincible'

interface Props {
  children: ReactNode
}

export default function BattleSystem({ children }: Props) {
  // Core state
  const [projectiles, setProjectiles] = useState<Projectile[]>([])
  const [impacts, setImpacts] = useState<Impact[]>([])
  const [muzzleFlashes, setMuzzleFlashes] = useState<MuzzleFlash[]>([])
  const [handState, setHandState] = useState<{ left: HandState; right: HandState }>({
    left: 'alive',
    right: 'alive'
  })
  const [screenShake, setScreenShake] = useState(false)
  const [chargingShot, setChargingShot] = useState<{ left: boolean; right: boolean }>({
    left: false,
    right: false
  })

  // Refs for stable values across renders
  const lastShotTime = useRef({ left: 0, right: 0 })
  const animationFrameId = useRef<number>()
  const projectileIdCounter = useRef(0)
  const telegraphTimeoutRef = useRef<{ left: NodeJS.Timeout | null; right: NodeJS.Timeout | null }>({
    left: null,
    right: null
  })

  // Constants
  const SHOT_COOLDOWN = 2000 // 2 seconds between shots
  const TELEGRAPH_DURATION = 300 // Telegraph charge time before shot
  const PROJECTILE_SPEED = 400 // pixels per second
  const PROJECTILE_DURATION = 3000 // Remove after 3 seconds
  const IMPACT_DURATION = 300 // Impact effect lasts 300ms
  const MUZZLE_FLASH_DURATION = 150 // Muzzle flash lasts 150ms
  const DEATH_DURATION = 300 // Death animation duration
  const RESPAWN_DURATION = 1500 // Respawn animation duration
  const INVINCIBLE_DURATION = 1000 // Invincibility after respawn

  // SVG fingertip geometry (from HTM-LOGO-ICON-WHITE.svg)
  const SVG_WIDTH = 1713.2
  const SVG_HEIGHT = 913.7
  const FINGERTIP_X = 1280  // SVG fingertip X coordinate
  const FINGERTIP_Y = 315   // SVG fingertip Y coordinate

  // Get logo element (first .logo-container = left, second = right)
  const getLogoElement = (side: 'left' | 'right'): HTMLElement | null => {
    const containers = document.querySelectorAll('.logo-container')
    if (containers.length < 2) return null
    const container = side === 'left' ? containers[0] : containers[1]
    return container as HTMLElement | null
  }

  // Calculate fingertip position from logo
  const calculateFingertipPosition = (side: 'left' | 'right') => {
    const logo = getLogoElement(side)
    if (!logo) return null

    const logoRect = logo.getBoundingClientRect()
    const projectileLayer = document.querySelector('.projectile-layer')
    if (!projectileLayer) return null

    const layerRect = projectileLayer.getBoundingClientRect()

    // Calculate scale factor based on rendered logo size
    const scaleFactor = logoRect.width / SVG_WIDTH

    // Calculate offset from logo center to fingertip
    const fingertipOffsetX = (FINGERTIP_X - SVG_WIDTH / 2) * scaleFactor
    const fingertipOffsetY = (FINGERTIP_Y - SVG_HEIGHT / 2) * scaleFactor

    // Calculate absolute fingertip position
    const centerX = logoRect.left + logoRect.width / 2
    const centerY = logoRect.top + logoRect.height / 2

    // Apply offset (negate X for right hand since it's flipped)
    const fingertipX = centerX + (side === 'left' ? fingertipOffsetX : -fingertipOffsetX)
    const fingertipY = centerY + fingertipOffsetY

    // Convert to projectile layer coordinates
    return {
      x: fingertipX - layerRect.left,
      y: fingertipY - layerRect.top
    }
  }

  // Fire projectile (after telegraph)
  const fireProjectile = (side: 'left' | 'right') => {
    const now = Date.now()

    // Calculate fingertip position
    const fingertip = calculateFingertipPosition(side)
    if (!fingertip) return

    // Create projectile at fingertip
    const newProjectile: Projectile = {
      id: `projectile-${side}-${projectileIdCounter.current++}`,
      side,
      x: fingertip.x,
      y: fingertip.y,
      startTime: now,
      active: true
    }

    // Create muzzle flash at fingertip
    const newFlash: MuzzleFlash = {
      id: `flash-${side}-${now}`,
      side,
      x: fingertip.x,
      y: fingertip.y,
      timestamp: now
    }

    setProjectiles(prev => [...prev, newProjectile])
    setMuzzleFlashes(prev => [...prev, newFlash])
    lastShotTime.current[side] = now

    // End charging state
    setChargingShot(prev => ({ ...prev, [side]: false }))
  }

  // Shoot projectile (with telegraph)
  const shoot = (side: 'left' | 'right') => {
    const now = Date.now()

    // Check cooldown and hand state
    if (
      now - lastShotTime.current[side] < SHOT_COOLDOWN ||
      handState[side] !== 'alive' ||
      chargingShot[side] // Don't start new shot while charging
    ) {
      return
    }

    // Start telegraph charge
    setChargingShot(prev => ({ ...prev, [side]: true }))

    // Clear any existing timeout
    if (telegraphTimeoutRef.current[side]) {
      clearTimeout(telegraphTimeoutRef.current[side]!)
    }

    // Fire after telegraph delay
    telegraphTimeoutRef.current[side] = setTimeout(() => {
      fireProjectile(side)
      telegraphTimeoutRef.current[side] = null
    }, TELEGRAPH_DURATION)
  }

  // Check collision between projectile and logo
  const checkCollision = (projectile: Projectile, targetSide: 'left' | 'right'): boolean => {
    // Can't hit dead/dying/respawning targets
    if (handState[targetSide] !== 'alive' && handState[targetSide] !== 'invincible') {
      return false
    }

    // Can't hit during invincibility
    if (handState[targetSide] === 'invincible') {
      return false
    }

    const projectileEl = document.querySelector(`[data-projectile-id="${projectile.id}"]`)
    const targetLogo = getLogoElement(targetSide)

    if (!projectileEl || !targetLogo) return false

    const projRect = projectileEl.getBoundingClientRect()
    const logoRect = targetLogo.getBoundingClientRect()

    // Simple AABB collision
    const collision = !(
      projRect.right < logoRect.left ||
      projRect.left > logoRect.right ||
      projRect.bottom < logoRect.top ||
      projRect.top > logoRect.bottom
    )

    return collision
  }

  // Handle hit on a hand
  const handleHit = (side: 'left' | 'right', impactX: number, impactY: number) => {
    // Create impact effect
    const newImpact: Impact = {
      id: `impact-${side}-${Date.now()}`,
      x: impactX,
      y: impactY,
      timestamp: Date.now()
    }
    setImpacts(prev => [...prev, newImpact])

    // Screen shake
    setScreenShake(true)
    setTimeout(() => setScreenShake(false), 100)

    // Kill the hand
    setHandState(prev => ({ ...prev, [side]: 'dying' }))

    // Death sequence
    setTimeout(() => {
      setHandState(prev => ({ ...prev, [side]: 'respawning' }))

      setTimeout(() => {
        setHandState(prev => ({ ...prev, [side]: 'invincible' }))

        setTimeout(() => {
          setHandState(prev => ({ ...prev, [side]: 'alive' }))
        }, INVINCIBLE_DURATION)
      }, RESPAWN_DURATION)
    }, DEATH_DURATION)
  }

  // Apply state classes to logo containers
  useEffect(() => {
    const leftLogo = getLogoElement('left')
    const rightLogo = getLogoElement('right')

    if (leftLogo) {
      // Remove all state classes
      leftLogo.classList.remove('logo-alive', 'logo-dying', 'logo-respawning', 'logo-invincible')
      // Add current state class
      leftLogo.classList.add(`logo-${handState.left}`)
    }

    if (rightLogo) {
      rightLogo.classList.remove('logo-alive', 'logo-dying', 'logo-respawning', 'logo-invincible')
      rightLogo.classList.add(`logo-${handState.right}`)
    }
  }, [handState])

  // Apply charging state to logo containers
  useEffect(() => {
    const leftLogo = getLogoElement('left')
    const rightLogo = getLogoElement('right')

    if (leftLogo) {
      leftLogo.setAttribute('data-charging', String(chargingShot.left))
    }

    if (rightLogo) {
      rightLogo.setAttribute('data-charging', String(chargingShot.right))
    }
  }, [chargingShot])

  // Main game loop
  useEffect(() => {
    let lastTime = Date.now()

    const gameLoop = () => {
      const now = Date.now()
      const deltaTime = now - lastTime
      lastTime = now

      // Auto-shoot logic (random intervals)
      if (Math.random() < 0.015) shoot('left') // ~1.5% chance per frame
      if (Math.random() < 0.015) shoot('right')

      // Update projectiles
      setProjectiles(prev => {
        const updated = prev.map(p => {
          // Check age
          if (now - p.startTime > PROJECTILE_DURATION) {
            return { ...p, active: false }
          }

          // Check collision
          const targetSide = p.side === 'left' ? 'right' : 'left'
          if (p.active && checkCollision(p, targetSide)) {
            // Calculate impact position
            const logo = getLogoElement(targetSide)
            const container = document.querySelector('.battle-container')
            if (logo && container) {
              const logoRect = logo.getBoundingClientRect()
              const containerRect = container.getBoundingClientRect()
              const impactX = logoRect.left - containerRect.left + logoRect.width / 2
              const impactY = logoRect.top - containerRect.top + logoRect.height / 2
              handleHit(targetSide, impactX, impactY)
            }
            return { ...p, active: false }
          }

          return p
        })

        // Remove inactive projectiles
        return updated.filter(p => p.active)
      })

      // Clean up old impacts
      setImpacts(prev => prev.filter(i => now - i.timestamp < IMPACT_DURATION))

      // Clean up old muzzle flashes
      setMuzzleFlashes(prev => prev.filter(f => now - f.timestamp < MUZZLE_FLASH_DURATION))

      // Continue loop
      animationFrameId.current = requestAnimationFrame(gameLoop)
    }

    animationFrameId.current = requestAnimationFrame(gameLoop)

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
      // Clean up telegraph timeouts
      if (telegraphTimeoutRef.current.left) {
        clearTimeout(telegraphTimeoutRef.current.left)
      }
      if (telegraphTimeoutRef.current.right) {
        clearTimeout(telegraphTimeoutRef.current.right)
      }
    }
  }, [handState]) // Depend on handState for collision checks

  // Calculate projectile position
  const getProjectileX = (projectile: Projectile): number => {
    const elapsed = Date.now() - projectile.startTime
    const distance = (elapsed / 1000) * PROJECTILE_SPEED

    if (projectile.side === 'left') {
      return distance // Move right from left edge
    } else {
      return -distance // Move left from right edge (CSS will handle positioning)
    }
  }

  return (
    <div
      className={`battle-container ${screenShake ? 'screen-shake' : ''}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'visible' // Allow hands to move beyond container
      }}
    >
      {/* Projectile layer for effects */}
      <div
        className="projectile-layer"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 10
        }}
      >
        {/* Projectiles */}
        {projectiles.map(p => (
          <img
            key={p.id}
            data-projectile-id={p.id}
            src="/HTM-PROJECTILE-LINE.svg"
            alt=""
            className={`projectile projectile-${p.side}`}
            style={{
              position: 'absolute',
              left: `${p.x}px`,
              top: `${p.y}px`,
              width: 'clamp(14.28px, 2.856vw, 28.56px)',
              height: 'auto',
              transform: `translateX(${getProjectileX(p)}px) ${p.side === 'right' ? 'scaleX(-1)' : ''}`,
              imageRendering: 'pixelated',
              transition: 'none',
              pointerEvents: 'none'
            }}
          />
        ))}

        {/* Muzzle flashes */}
        {muzzleFlashes.map(f => (
          <img
            key={f.id}
            src="/HTM-MUZZLE-FLASH.svg"
            alt=""
            className="muzzle-flash"
            style={{
              position: 'absolute',
              left: `${f.x - 14.28}px`,
              top: `${f.y - 23.97}px`,
              width: 'clamp(9.9px, 1.98vw, 28.56px)',
              height: 'auto',
              transform: f.side === 'right' ? 'scaleX(-1)' : undefined,
              imageRendering: 'pixelated',
              animation: 'flash-fade 150ms ease-out forwards',
              pointerEvents: 'none'
            }}
          />
        ))}

        {/* Impact effects */}
        {impacts.map(i => (
          <div
            key={i.id}
            className="impact-effect"
            style={{
              position: 'absolute',
              width: '40px',
              height: '40px',
              border: '3px solid #FF9D23',
              borderRadius: '50%',
              left: `${i.x}px`,
              top: `${i.y}px`,
              transform: 'translate(-50%, -50%)',
              animation: 'impact-expand 300ms ease-out forwards',
              pointerEvents: 'none'
            }}
          />
        ))}
      </div>

      {/* Main content (TerminalTypewriter with logos) */}
      {children}
    </div>
  )
}
