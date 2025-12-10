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
  const [screenFlash, setScreenFlash] = useState(false)
  const [chargingShot, setChargingShot] = useState<{ left: boolean; right: boolean }>({
    left: false,
    right: false
  })

  // Animation timestamps for JS-driven transforms
  const animationStartTime = useRef<{ left: number; right: number }>({ left: 0, right: 0 })

  // Refs for stable values across renders
  const lastShotTime = useRef({ left: 0, right: 0 })
  const animationFrameId = useRef<number>()
  const projectileIdCounter = useRef(0)
  const impactIdCounter = useRef(0)
  const telegraphTimeoutRef = useRef<{ left: NodeJS.Timeout | null; right: NodeJS.Timeout | null }>({
    left: null,
    right: null
  })

  // Constants
  const SHOT_COOLDOWN = 1000 // 1 second between shots
  const TELEGRAPH_DURATION = 400 // Telegraph charge time (increased for better anticipation)
  const PROJECTILE_SPEED = 400 // pixels per second
  const PROJECTILE_DURATION = 3000 // Remove after 3 seconds
  const IMPACT_DURATION = 300 // Impact effect lasts 300ms
  const MUZZLE_FLASH_DURATION = 200 // Muzzle flash (increased visibility)
  const DEATH_DURATION = 800 // Death animation (professional timing)
  const RESPAWN_DURATION = 800 // Respawn ceremony (dramatic timing)
  const INVINCIBLE_DURATION = 2000 // Invincibility (4 pulse cycles @ 500ms each)

  // SVG fingertip geometry (from HTM-LOGO-ICON-01.svg)
  const SVG_WIDTH = 1713.2
  const SVG_HEIGHT = 913.7
  const FINGERTIP_X = 1705  // Right edge of rightmost yellow square (1648.1 + 56.6)
  const FINGERTIP_Y = 315   // Vertical center of yellow squares (287.1 + 28.3)

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

    // Apply offset from center (negate X for right hand to mirror the position)
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

    // Check if hands exist (they render conditionally after loading animation)
    const logo = getLogoElement(side)
    if (!logo) return // Hands not ready yet

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

  // Use ref to track hand state for collision checks (avoid stale closures)
  const handStateRef = useRef(handState)

  useEffect(() => {
    handStateRef.current = handState
  }, [handState])

  // Check collision between projectile and logo
  const checkCollision = (projectile: Projectile, targetSide: 'left' | 'right'): boolean => {
    // Can't hit dead/dying/respawning targets
    const currentHandState = handStateRef.current[targetSide]
    if (currentHandState !== 'alive' && currentHandState !== 'invincible') {
      return false
    }

    // Can't hit during invincibility
    if (currentHandState === 'invincible') {
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
    const now = Date.now()

    // Create impact effect
    const newImpact: Impact = {
      id: `impact-${side}-${impactIdCounter.current++}`,
      x: impactX,
      y: impactY,
      timestamp: now
    }
    setImpacts(prev => [...prev, newImpact])

    // Screen effects (shake + flash)
    setScreenShake(true)
    setTimeout(() => setScreenShake(false), 150)

    setScreenFlash(true)
    setTimeout(() => setScreenFlash(false), 300)

    // Record animation start time for JS-driven transforms
    animationStartTime.current[side] = now

    // Kill the hand
    setHandState(prev => ({ ...prev, [side]: 'dying' }))

    // Death sequence
    setTimeout(() => {
      animationStartTime.current[side] = Date.now()
      setHandState(prev => ({ ...prev, [side]: 'respawning' }))

      setTimeout(() => {
        animationStartTime.current[side] = Date.now()
        setHandState(prev => ({ ...prev, [side]: 'invincible' }))

        setTimeout(() => {
          animationStartTime.current[side] = 0 // Reset
          setHandState(prev => ({ ...prev, [side]: 'alive' }))
        }, INVINCIBLE_DURATION)
      }, RESPAWN_DURATION)
    }, DEATH_DURATION)
  }

  // Apply state via data-state attribute (CSS expects this)
  useEffect(() => {
    const leftLogo = getLogoElement('left')
    const rightLogo = getLogoElement('right')

    if (leftLogo) {
      leftLogo.setAttribute('data-state', handState.left)
      console.log('🎯 LEFT hand state:', handState.left, 'Element:', leftLogo)
    }

    if (rightLogo) {
      rightLogo.setAttribute('data-state', handState.right)
      console.log('🎯 RIGHT hand state:', handState.right, 'Element:', rightLogo)
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

  // Apply JS-driven transforms based on animation state
  const applyAnimationTransforms = (side: 'left' | 'right', now: number) => {
    const logo = getLogoElement(side)
    if (!logo) return

    const img = logo.querySelector('img')
    if (!img) return

    const startTime = animationStartTime.current[side]
    if (startTime === 0) {
      // Reset to base state
      img.style.transform = side === 'right' ? 'scaleX(-1)' : ''
      img.style.opacity = '0.8'
      img.style.filter = 'blur(0.2px) drop-shadow(0 0 4px rgba(247, 168, 53, 0.4)) drop-shadow(0 0 8px rgba(247, 168, 53, 0.2)) drop-shadow(0 0 16px rgba(247, 168, 53, 0.1))'
      return
    }

    const elapsed = now - startTime
    const state = handStateRef.current[side]

    if (state === 'dying') {
      // Death animation: 0-800ms (professional wobble-collapse)
      const progress = Math.min(elapsed / DEATH_DURATION, 1)

      // Elastic ease-out for wobble feel (overshoot then settle)
      const easeElastic = progress < 0.5
        ? 1 - Math.pow(1 - progress, 3)
        : 1 - Math.pow(1 - progress, 3) * Math.cos(progress * Math.PI * 2) * 0.3

      // Scale: 1 → 1.15 (flash) → 1.4 (peak) → 0 (collapse)
      let scale = 1
      if (progress < 0.1) {
        scale = 1 + (0.15 * (progress / 0.1)) // Quick flash 1 → 1.15
      } else if (progress < 0.3) {
        scale = 1.15 + (0.25 * ((progress - 0.1) / 0.2)) // Expand 1.15 → 1.4
      } else {
        scale = 1.4 * (1 - ((progress - 0.3) / 0.7)) // Collapse 1.4 → 0
      }

      // Rotation: 0 → 25 → -25 → 90 (wobble then tip over)
      let rotation = 0
      if (progress < 0.25) {
        rotation = 25 * Math.sin(progress / 0.25 * Math.PI) // Wobble right
      } else if (progress < 0.5) {
        rotation = -25 * Math.sin((progress - 0.25) / 0.25 * Math.PI) // Wobble left
      } else {
        rotation = 90 * ((progress - 0.5) / 0.5) // Tip over
      }

      // Opacity: 1 → 0.8 → 0
      const opacity = progress < 0.3 ? 1 - (0.2 * (progress / 0.3)) : 0.8 * (1 - ((progress - 0.3) / 0.7))

      // Brightness: 1 → 1.8 (subtle flash) → 1.2 → 0.3
      let brightness = 1
      if (progress < 0.1) {
        brightness = 1 + (0.8 * (progress / 0.1)) // Flash 1 → 1.8
      } else if (progress < 0.4) {
        brightness = 1.8 - (0.6 * ((progress - 0.1) / 0.3)) // Dim 1.8 → 1.2
      } else {
        brightness = 1.2 - (0.9 * ((progress - 0.4) / 0.6)) // Fade 1.2 → 0.3
      }

      const baseTransform = side === 'right' ? 'scaleX(-1) ' : ''
      img.style.transform = `${baseTransform}scale(${scale}) rotate(${rotation}deg)`
      img.style.opacity = String(opacity)
      img.style.filter = `blur(${8 * progress}px) brightness(${brightness})`

    } else if (state === 'respawning') {
      // Respawn animation: 0-800ms - ceremonial teleport-in with bounce
      const progress = Math.min(elapsed / RESPAWN_DURATION, 1)

      // Elastic bounce-in (overshoot then settle) - BB-OS signature
      const t = progress
      const c4 = (2 * Math.PI) / 3
      const easeElastic = t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1

      // Scale with elastic bounce: 0 → 1.2 (overshoot) → 1.0 (settle)
      const scale = easeElastic

      // Opacity: 0 → 1 with faster ramp
      const opacity = progress < 0.3 ? progress / 0.3 : 1

      // Blur: 12px (heavy) → 0px (sharp)
      const blur = 12 * (1 - progress)

      // Chromatic aberration: simulate RGB split convergence
      // Red/blue offset converges to 0 as hand materializes
      const chromaticOffset = (1 - progress) * 3 // 3px → 0px

      const baseTransform = side === 'right' ? 'scaleX(-1) ' : ''
      img.style.transform = `${baseTransform}scale(${scale})`
      img.style.opacity = String(opacity * 0.8) // Max 0.8
      img.style.filter = `blur(${blur}px) brightness(${1 + progress * 0.5}) drop-shadow(${chromaticOffset}px 0 0 rgba(255,0,0,${0.6 * (1-progress)})) drop-shadow(-${chromaticOffset}px 0 0 rgba(0,255,255,${0.6 * (1-progress)}))`

    } else if (state === 'invincible') {
      // Invincibility animation: 0-2000ms - transparency flash (4 cycles @ 500ms)
      const progress = elapsed / INVINCIBLE_DURATION
      const pulse = Math.sin(progress * Math.PI * 8) * 0.5 + 0.5 // 4 full cycles (classic arcade blink)

      // Opacity flashes between 0.3 (transparent) and 1.0 (solid)
      const opacity = 0.3 + (pulse * 0.7)

      // Subtle brightness pulse to emphasize flash
      const brightness = 1.0 + (pulse * 0.3)

      const baseTransform = side === 'right' ? 'scaleX(-1)' : ''
      img.style.transform = baseTransform
      img.style.opacity = String(opacity)
      img.style.filter = `blur(0.2px) brightness(${brightness}) drop-shadow(0 0 4px rgba(247, 168, 53, 0.4)) drop-shadow(0 0 8px rgba(247, 168, 53, 0.2)) drop-shadow(0 0 16px rgba(247, 168, 53, 0.1))`
    }
  }

  // Main game loop
  useEffect(() => {
    let lastTime = Date.now()

    const gameLoop = () => {
      const now = Date.now()
      const deltaTime = now - lastTime
      lastTime = now

      // Apply JS-driven animations
      applyAnimationTransforms('left', now)
      applyAnimationTransforms('right', now)

      // Auto-shoot logic (random intervals)
      if (Math.random() < 0.03) shoot('left') // ~3% chance per frame
      if (Math.random() < 0.03) shoot('right')

      // Update projectiles
      setProjectiles(prev => {
        const updated = prev.map(p => {
          // Check age
          if (now - p.startTime > PROJECTILE_DURATION) {
            return { ...p, active: false }
          }

          // Check collision
          const targetSide = p.side === 'left' ? 'right' : 'left'
          const collision = checkCollision(p, targetSide)
          if (p.active && collision) {
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
  }, []) // Empty deps - game loop runs continuously without restarting

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
      className={`battle-container ${screenShake ? 'screen-shake' : ''} ${screenFlash ? 'screen-flash-active' : ''}`}
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
              left: f.side === 'left' ? `${f.x - 14.28}px` : `${f.x - 28.56}px`,
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
