'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface Projectile {
  id: string
  side: 'left' | 'right'
  startY: number
  startX: number
  startTime: number
}

interface Impact {
  id: string
  x: number
  y: number
}

interface MuzzleFlash {
  id: string
  side: 'left' | 'right'
  y: number
  x: number
}

interface Debris {
  id: string
  x: number
  y: number
  side: 'left' | 'right'
}

interface TeleportEffect {
  id: string
  x: number
  y: number
  side: 'left' | 'right'
}

type LogoState = 'alive' | 'dying' | 'respawning' | 'invincible'

export default function BattleSystem({ children }: { children: React.ReactNode}) {
  const [projectiles, setProjectiles] = useState<Projectile[]>([])
  const [impacts, setImpacts] = useState<Impact[]>([])
  const [muzzleFlashes, setMuzzleFlashes] = useState<MuzzleFlash[]>([])
  const [deathDebris, setDeathDebris] = useState<Debris[]>([])
  const [teleportEffects, setTeleportEffects] = useState<TeleportEffect[]>([])
  const [battleEffects, setBattleEffects] = useState({
    screenShake: false,
    screenFlash: false,
    freezeFrame: false,
    shakeIntensity: 1.0 // A4: Multiplier for screen shake strength
  })
  const [logoState, setLogoState] = useState<{ left: LogoState; right: LogoState }>({
    left: 'alive',
    right: 'alive'
  })
  const [aggressionMode, setAggressionMode] = useState<{ left: 'aggressive' | 'cautious'; right: 'aggressive' | 'cautious' }>({
    left: 'aggressive',
    right: 'cautious' // Start offset for variety
  })
  // A1: State for shot telegraph (which logo is charging a shot)
  const [chargingShot, setChargingShot] = useState<{ left: boolean; right: boolean }>({
    left: false,
    right: false
  })
  // A2: State for hitlag freeze frame effect
  const [freezeFrame, setFreezeFrame] = useState(false)
  // E3: State for slow-motion death effect
  const [slowMotion, setSlowMotion] = useState(false)
  // A7: Victory tracking
  const [killCount, setKillCount] = useState({ left: 0, right: 0 })
  const [victoryState, setVictoryState] = useState<'none' | 'left' | 'right'>('none')

  // C3: Haptic feedback helper for mobile devices
  const triggerHaptic = useCallback((pattern: number | number[]) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern)
    }
  }, [])

  const projectileRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const lastShotTime = useRef({ left: 0, right: 0 })
  const animationFrameRef = useRef<number>()
  const lastCollisionCheckTime = useRef(0)
  const leftModeRef = useRef<'aggressive' | 'cautious'>('aggressive')
  const rightModeRef = useRef<'aggressive' | 'cautious'>('cautious')
  // FIX: Telegraph timeout references to prevent overlapping calls
  const telegraphTimeoutRef = useRef<{ left: NodeJS.Timeout | null; right: NodeJS.Timeout | null }>({
    left: null,
    right: null
  })
  // B3: Debounce tracking for aggression mode changes
  const lastAggressionChangeTime = useRef({ left: 0, right: 0 })
  const aggressionAutoTimers = useRef<{ left: NodeJS.Timeout | null; right: NodeJS.Timeout | null }>({
    left: null,
    right: null
  })
  const AGGRESSION_DEBOUNCE_MS = 500 // Prevent changes within 500ms

  // Get logo elements dynamically (query img, not container, to get animated position)
  const getLogoElement = useCallback((side: 'left' | 'right') => {
    const containers = document.querySelectorAll('.logo-container')
    if (containers.length < 2) return null
    const container = side === 'left' ? containers[0] : containers[1]
    const img = container?.querySelector('img')
    return img as HTMLElement | null
  }, [])

  // FIX: getBoundingClientRect() already includes CSS transforms - no need to add matrix offsets
  const getAnimatedPosition = useCallback((element: HTMLElement) => {
    // Browser applies CSS transforms before calculating bounding rect
    return element.getBoundingClientRect()
  }, [])

  // A1: Telegraph shot with 300ms charge-up animation before firing
  const telegraphShot = useCallback((side: 'left' | 'right') => {
    // Check cooldown AND if already charging (prevents overlapping telegraphs)
    const now = Date.now()
    const timeSinceLastShot = now - lastShotTime.current[side]
    if (timeSinceLastShot < 2000 || chargingShot[side]) return

    // FIX: Cancel any existing telegraph timeout for this side
    if (telegraphTimeoutRef.current[side]) {
      clearTimeout(telegraphTimeoutRef.current[side]!)
      telegraphTimeoutRef.current[side] = null
    }

    // Start charging animation FIRST (visual feedback)
    setChargingShot(prev => ({ ...prev, [side]: true }))

    // FIX: Capture position at T+300ms (fire time), not T=0ms
    telegraphTimeoutRef.current[side] = setTimeout(() => {
      setChargingShot(prev => ({ ...prev, [side]: false }))

      // Capture FRESH position at moment of firing
      const logoEl = getLogoElement(side)
      const projectileLayer = document.querySelector('.projectile-layer')
      if (!logoEl || !projectileLayer) {
        telegraphTimeoutRef.current[side] = null
        return
      }

      const logoRect = getAnimatedPosition(logoEl)
      const layerRect = projectileLayer.getBoundingClientRect()

      // Calculate fingertip offset based on SVG geometry
      // SVG: 1713.2 x 913.7, fingertip at (1280, 315), center at (856.6, 456.85)
      // Offset from center: +423.4px right, -141.85px up (in SVG space)
      const scaleFactor = logoRect.width / 1713.2
      const fingertipOffsetX = 423.4 * scaleFactor
      const fingertipOffsetY = -141.85 * scaleFactor

      // Calculate fingertip position
      const fingertipY = logoRect.top - layerRect.top + logoRect.height / 2 + fingertipOffsetY
      const fingertipX = side === 'left' ?
        logoRect.left - layerRect.left + logoRect.width / 2 + fingertipOffsetX :
        logoRect.right - layerRect.left - logoRect.width / 2 - fingertipOffsetX

      // Muzzle flash at same fingertip position
      const flashX = fingertipX

      shootProjectile(side, fingertipX, fingertipY, flashX)
      telegraphTimeoutRef.current[side] = null
    }, 300)
  }, [chargingShot, getLogoElement, getAnimatedPosition])

  // Shoot projectile from logo (accepts optional pre-captured positions)
  const shootProjectile = useCallback((side: 'left' | 'right', capturedX?: number, capturedY?: number, capturedFlashX?: number) => {
    const now = Date.now()

    // Update last shot time
    lastShotTime.current[side] = now

    let startX: number
    let startY: number
    let flashX: number

    // FIX: Use pre-captured positions if provided (from telegraph), otherwise query DOM
    if (capturedX !== undefined && capturedY !== undefined && capturedFlashX !== undefined) {
      startX = capturedX
      startY = capturedY
      flashX = capturedFlashX  // FIX: Use pre-captured flash position (no DOM re-query!)
    } else {
      // Legacy path: query position now (for direct calls without telegraph)
      const logoEl = getLogoElement(side)
      if (!logoEl) return

      const projectileLayer = document.querySelector('.projectile-layer')
      if (!projectileLayer) return

      const logoRect = getAnimatedPosition(logoEl)
      const layerRect = projectileLayer.getBoundingClientRect()

      startY = logoRect.top - layerRect.top + logoRect.height / 2
      startX = side === 'left' ?
        logoRect.left - layerRect.left + logoRect.width / 2 :
        logoRect.right - layerRect.left - logoRect.width / 2
      flashX = side === 'left' ?
        logoRect.right - layerRect.left :
        logoRect.left - layerRect.left - 28.56
    }

    const projectileId = `projectile-${side}-${now}`

    // Add projectile
    setProjectiles(prev => [...prev, {
      id: projectileId,
      side,
      startY,
      startX,
      startTime: now
    }])

    // B5: Add muzzle flash with pre-calculated position (avoid DOM queries in render)
    const flashId = `flash-${side}-${now}`
    setMuzzleFlashes(prev => [...prev, { id: flashId, side, y: startY, x: flashX }])

    // Remove muzzle flash after animation
    setTimeout(() => {
      setMuzzleFlashes(prev => prev.filter(f => f.id !== flashId))
    }, 120)

    // Remove projectile after travel time
    setTimeout(() => {
      setProjectiles(prev => prev.filter(p => p.id !== projectileId))
      projectileRefs.current.delete(projectileId)
    }, 1000)
  }, [getLogoElement, getAnimatedPosition])

  // Collision detection loop (throttled to 30fps for performance)
  useEffect(() => {
    const detectCollisions = (timestamp: number) => {
      // Throttle to 30fps (check every 33ms)
      if (timestamp - lastCollisionCheckTime.current < 33) {
        animationFrameRef.current = requestAnimationFrame(detectCollisions)
        return
      }
      lastCollisionCheckTime.current = timestamp

      // B1: Batch collision detection - collect all hits in this frame before processing
      const collisionsThisFrame: Array<{
        targetSide: 'left' | 'right'
        impactX: number
        impactY: number
      }> = []

      // #8: Memoize logo rects - query once per frame instead of per projectile
      const leftLogo = getLogoElement('left')
      const rightLogo = getLogoElement('right')
      const leftLogoRect = leftLogo?.getBoundingClientRect()
      const rightLogoRect = rightLogo?.getBoundingClientRect()

      projectiles.forEach(projectile => {
        // B4: Check if target logo is alive BEFORE expensive DOM queries
        const targetSide = projectile.side === 'left' ? 'right' : 'left'
        if (logoState[targetSide] !== 'alive') {
          // Logo is dead, dying, respawning, or invincible - skip collision check entirely
          return
        }

        const projectileEl = projectileRefs.current.get(projectile.id)
        if (!projectileEl) return

        // Use cached logo rect
        const logoRect = targetSide === 'left' ? leftLogoRect : rightLogoRect
        if (!logoRect) return

        const projectileRect = projectileEl.getBoundingClientRect()

        // Check horizontal overlap
        const horizontalOverlap =
          projectileRect.right >= logoRect.left &&
          projectileRect.left <= logoRect.right

        // FIX: Tighter vertical overlap tolerance (±20px) to reduce false positives
        const verticalOverlap =
          Math.abs(projectileRect.top - logoRect.top) < 40

        if (horizontalOverlap && verticalOverlap) {
          // Hit detected! Add to batch instead of processing immediately
          const impactLayer = document.querySelector('.impact-layer')
          if (!impactLayer) return

          const impactLayerRect = impactLayer.getBoundingClientRect()

          // Calculate position RELATIVE to impact layer
          const impactX = projectile.side === 'left' ?
            logoRect.left - impactLayerRect.left :
            logoRect.right - impactLayerRect.left
          const impactY = logoRect.top - impactLayerRect.top + logoRect.height / 2

          collisionsThisFrame.push({ targetSide, impactX, impactY })
        }
      })

      // B1: Process all collisions in this frame together (prevents race conditions)
      if (collisionsThisFrame.length > 0) {
        // Create all impact effects
        const newImpacts = collisionsThisFrame.map((collision, index) => ({
          id: `impact-${Date.now()}-${index}`,
          x: collision.impactX,
          y: collision.impactY
        }))
        setImpacts(prev => [...prev, ...newImpacts])

        // C3: Haptic feedback - double pulse for impact
        triggerHaptic([30, 50, 30])

        // A4: Calculate shake intensity based on collision metrics
        let intensity = 1.0 // Base intensity
        if (collisionsThisFrame.length > 1) {
          intensity = 1.5 // Multiple simultaneous hits (rare, dramatic)
        }

        // E3: Start slow-motion effect on hit
        setSlowMotion(true)
        setTimeout(() => setSlowMotion(false), 250) // 250ms slow-motion window

        // Trigger all visual effects in single state update
        setBattleEffects({ screenShake: true, screenFlash: true, freezeFrame: true, shakeIntensity: intensity })
        setTimeout(() => setBattleEffects(prev => ({ ...prev, freezeFrame: false })), 60)
        setTimeout(() => setBattleEffects(prev => ({ ...prev, screenFlash: false })), 150)
        setTimeout(() => setBattleEffects(prev => ({ ...prev, screenShake: false })), 200)

        // Update all hit logos to dying state in a single setState call
        setLogoState(prev => {
          const newState = { ...prev }
          collisionsThisFrame.forEach(collision => {
            newState[collision.targetSide] = 'dying'
          })
          return newState
        })

        // A7: Increment kill counter and check for victory
        collisionsThisFrame.forEach(collision => {
          const attackerSide = collision.targetSide === 'left' ? 'right' : 'left'
          setKillCount(prev => {
            const newCounts = { ...prev, [attackerSide]: prev[attackerSide] + 1 }

            // Check for victory condition (first to 5 kills)
            if (newCounts[attackerSide] >= 5 && victoryState === 'none') {
              setVictoryState(attackerSide)
            }

            return newCounts
          })
        })

        // A5: Create death debris particles at logo positions
        const newDebris: Debris[] = []
        collisionsThisFrame.forEach(collision => {
          const logoEl = getLogoElement(collision.targetSide)
          if (logoEl) {
            const logoRect = logoEl.getBoundingClientRect()
            newDebris.push({
              id: `debris-${Date.now()}-${collision.targetSide}`,
              x: logoRect.left + logoRect.width / 2,
              y: logoRect.top + logoRect.height / 2,
              side: collision.targetSide
            })
          }
        })
        setDeathDebris(prev => [...prev, ...newDebris])

        // Cleanup debris after animation (300ms)
        setTimeout(() => {
          setDeathDebris(prev => prev.filter(d => !newDebris.find(nd => nd.id === d.id)))
        }, 300)

        // B3: Force cautious mode for all hit logos using debounced setter
        collisionsThisFrame.forEach(collision => {
          setAggressionModeDebounced(collision.targetSide, 'cautious', 'death')
        })

        // Phase 1: Dying (150ms) - schedule state transitions for all hit logos
        setTimeout(() => {
          setLogoState(prev => {
            const newState = { ...prev }
            collisionsThisFrame.forEach(collision => {
              newState[collision.targetSide] = 'respawning'
            })
            return newState
          })

          // A6: Create teleport effect at respawn position
          const newTeleports: TeleportEffect[] = []
          collisionsThisFrame.forEach(collision => {
            const logoEl = getLogoElement(collision.targetSide)
            if (logoEl) {
              const logoRect = logoEl.getBoundingClientRect()
              newTeleports.push({
                id: `teleport-${Date.now()}-${collision.targetSide}`,
                x: logoRect.left + logoRect.width / 2,
                y: logoRect.top + logoRect.height / 2,
                side: collision.targetSide
              })
            }
          })
          setTeleportEffects(prev => [...prev, ...newTeleports])

          // Cleanup teleport effects after animation (400ms)
          setTimeout(() => {
            setTeleportEffects(prev => prev.filter(t => !newTeleports.find(nt => nt.id === t.id)))
          }, 400)
        }, 150)

        // Phase 2: Respawn flash starts (after 1500ms dead time)
        setTimeout(() => {
          setLogoState(prev => {
            const newState = { ...prev }
            collisionsThisFrame.forEach(collision => {
              newState[collision.targetSide] = 'invincible'
            })
            return newState
          })
        }, 1650) // 150ms dying + 1500ms dead

        // Phase 3: Back to alive (after invincibility frames)
        setTimeout(() => {
          setLogoState(prev => {
            const newState = { ...prev }
            collisionsThisFrame.forEach(collision => {
              newState[collision.targetSide] = 'alive'
            })
            return newState
          })
        }, 2450) // 150ms + 1500ms + 800ms invincibility

        // Remove impact effects after animation
        setTimeout(() => {
          setImpacts(prev => prev.filter(i => !newImpacts.some(ni => ni.id === i.id)))
        }, 250)

        // Remove all hit projectiles
        setProjectiles(prev => prev.filter(p => {
          const targetSide = p.side === 'left' ? 'right' : 'left'
          const wasHit = collisionsThisFrame.some(c => c.targetSide === targetSide)
          if (wasHit) {
            projectileRefs.current.delete(p.id)
          }
          return !wasHit
        }))
      }

      animationFrameRef.current = requestAnimationFrame(detectCollisions)
    }

    if (projectiles.length > 0) {
      animationFrameRef.current = requestAnimationFrame(detectCollisions)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [projectiles, getLogoElement, triggerHaptic])

  // Apply logo state to DOM via data attributes
  useEffect(() => {
    const containers = document.querySelectorAll('.logo-container')
    if (containers.length >= 2) {
      containers[0].setAttribute('data-state', logoState.left)
      containers[1].setAttribute('data-state', logoState.right)
      // Apply aggression mode for CSS animation speed
      containers[0].setAttribute('data-aggression', aggressionMode.left)
      containers[1].setAttribute('data-aggression', aggressionMode.right)
      // A1: Apply charging state for shot telegraph
      containers[0].setAttribute('data-charging', chargingShot.left.toString())
      containers[1].setAttribute('data-charging', chargingShot.right.toString())
      // A7: Apply victory state for victory pose animation
      containers[0].setAttribute('data-victory', (victoryState === 'left').toString())
      containers[1].setAttribute('data-victory', (victoryState === 'right').toString())
    }
  }, [logoState, aggressionMode, chargingShot, victoryState])

  // B3: Debounced aggression mode setter
  const setAggressionModeDebounced = useCallback((side: 'left' | 'right', mode: 'aggressive' | 'cautious', source: 'auto' | 'manual' | 'death') => {
    const now = Date.now()
    const timeSinceLastChange = now - lastAggressionChangeTime.current[side]

    // Manual/death changes override auto changes
    if (source === 'auto' && timeSinceLastChange < AGGRESSION_DEBOUNCE_MS) {
      return // Skip auto-change if too soon
    }

    // Update timestamp
    lastAggressionChangeTime.current[side] = now

    // Apply change
    setAggressionMode(prev => ({ ...prev, [side]: mode }))

    // Reset auto-cycle timer on manual/death changes
    if (source !== 'auto') {
      if (aggressionAutoTimers.current[side]) {
        clearTimeout(aggressionAutoTimers.current[side]!)
      }
    }
  }, [AGGRESSION_DEBOUNCE_MS])

  // GAMEPLAY AI: Aggression state machine (cycles between aggressive/cautious)
  useEffect(() => {
    // Update refs when aggression mode changes
    leftModeRef.current = aggressionMode.left
    rightModeRef.current = aggressionMode.right
  }, [aggressionMode])

  useEffect(() => {
    const cycleAggression = (side: 'left' | 'right') => {
      const newMode = side === 'left' ?
        (leftModeRef.current === 'aggressive' ? 'cautious' : 'aggressive') :
        (rightModeRef.current === 'aggressive' ? 'cautious' : 'aggressive')
      setAggressionModeDebounced(side, newMode, 'auto')
    }

    // Left hand: Aggressive (5s) → Cautious (4s) cycle
    const scheduleLeftCycle = () => {
      const duration = leftModeRef.current === 'aggressive' ? 5000 : 4000
      aggressionAutoTimers.current.left = setTimeout(() => {
        cycleAggression('left')
        scheduleLeftCycle()
      }, duration)
    }
    scheduleLeftCycle()

    // Right hand: Offset cycle for variety
    const scheduleRightCycle = () => {
      const duration = rightModeRef.current === 'aggressive' ? 5000 : 4000
      aggressionAutoTimers.current.right = setTimeout(() => {
        cycleAggression('right')
        scheduleRightCycle()
      }, duration)
    }
    scheduleRightCycle()

    return () => {
      if (aggressionAutoTimers.current.left) clearTimeout(aggressionAutoTimers.current.left)
      if (aggressionAutoTimers.current.right) clearTimeout(aggressionAutoTimers.current.right)
    }
  }, [])

  // NOTE: Vertical tracking disabled to prevent transform glitching
  // CSS animations handle all movement for smooth 60fps performance

  // GAMEPLAY AI: Alignment-based shooting with aggression states
  useEffect(() => {
    const checkAndShoot = () => {
      // Get logo positions
      const leftLogo = getLogoElement('left')
      const rightLogo = getLogoElement('right')
      if (!leftLogo || !rightLogo) return

      const leftRect = leftLogo.getBoundingClientRect()
      const rightRect = rightLogo.getBoundingClientRect()

      // Calculate vertical alignment
      const verticalDistance = Math.abs(leftRect.top - rightRect.top)
      const alignmentScore = Math.max(0, 1 - (verticalDistance / 100)) // 0-1 scale

      // Dynamic shoot chance based on alignment
      // Aligned (0px apart): 90% chance | Far apart (100px+): 20% chance
      const baseShootChance = 0.2 + (alignmentScore * 0.7)

      // LEFT HAND: Apply aggression modifier and check if should shoot
      const leftAggressionMod = aggressionMode.left === 'aggressive' ? 1.4 : 0.7
      const leftFinalChance = baseShootChance * leftAggressionMod
      const leftShootChance = Math.random()
      // FIX: Check telegraphTimeoutRef instead of chargingShot state to prevent re-render loop
      const leftCharging = telegraphTimeoutRef.current.left !== null
      if (leftShootChance < leftFinalChance && logoState.left === 'alive' && !leftCharging) {
        telegraphShot('left')
      }

      // RIGHT HAND: Apply aggression modifier and check if should shoot (randomized offset)
      const randomOffset = 200 + Math.random() * 200 // 200-400ms random delay
      setTimeout(() => {
        const rightAggressionMod = aggressionMode.right === 'aggressive' ? 1.4 : 0.7
        const rightFinalChance = baseShootChance * rightAggressionMod
        const rightShootChance = Math.random()
        // FIX: Check telegraphTimeoutRef instead of chargingShot state
        const rightCharging = telegraphTimeoutRef.current.right !== null
        if (rightShootChance < rightFinalChance && logoState.right === 'alive' && !rightCharging) {
          telegraphShot('right')
        }
      }, randomOffset)
    }

    // FIX: Randomized check interval (400-700ms) for more natural feel
    let shootInterval: NodeJS.Timeout
    const scheduleNextCheck = () => {
      const randomInterval = 400 + Math.random() * 300
      shootInterval = setTimeout(() => {
        checkAndShoot()
        scheduleNextCheck()
      }, randomInterval)
    }
    scheduleNextCheck()

    return () => clearTimeout(shootInterval)
  }, [telegraphShot, logoState, getLogoElement, aggressionMode])

  // C1: Touch gesture controls - swipe to change aggression modes
  useEffect(() => {
    let touchStartY: number | null = null
    let touchStartX: number | null = null
    let touchStartTime: number = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
      touchStartX = e.touches[0].clientX
      touchStartTime = Date.now()
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartY === null || touchStartX === null) return

      const touchEndY = e.changedTouches[0].clientY
      const touchEndX = e.changedTouches[0].clientX
      const touchDuration = Date.now() - touchStartTime

      const deltaY = touchEndY - touchStartY
      const deltaX = touchEndX - touchStartX
      const absDeltaY = Math.abs(deltaY)
      const absDeltaX = Math.abs(deltaX)

      // Require: Vertical swipe (more Y than X), at least 50px, completed in < 300ms
      if (absDeltaY > absDeltaX && absDeltaY > 50 && touchDuration < 300) {
        if (deltaY < 0) {
          // B3: Swipe up - set LEFT hand to aggressive
          setAggressionModeDebounced('left', 'aggressive', 'manual')
        } else {
          // B3: Swipe down - set LEFT hand to cautious
          setAggressionModeDebounced('left', 'cautious', 'manual')
        }
      }
      // Horizontal swipe for RIGHT hand
      else if (absDeltaX > absDeltaY && absDeltaX > 50 && touchDuration < 300) {
        if (deltaX > 0) {
          // B3: Swipe right - set RIGHT hand to aggressive
          setAggressionModeDebounced('right', 'aggressive', 'manual')
        } else {
          // B3: Swipe left - set RIGHT hand to cautious
          setAggressionModeDebounced('right', 'cautious', 'manual')
        }
      }

      // Reset
      touchStartY = null
      touchStartX = null
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  return (
    <div
      className={`battle-arena ${battleEffects.screenShake ? 'screen-shake-active' : ''} ${battleEffects.freezeFrame ? 'freeze-frame' : ''} ${slowMotion ? 'slow-motion' : ''}`}
      style={{
        // A4: Pass shake intensity to CSS
        '--shake-intensity': battleEffects.shakeIntensity
      } as React.CSSProperties}
    >
      {/* E1: Screen flash overlay */}
      {battleEffects.screenFlash && <div className="screen-flash" />}

      {/* Projectile layer */}
      <div className="projectile-layer">
        {projectiles.map(projectile => (
          <div
            key={projectile.id}
            ref={el => {
              if (el) projectileRefs.current.set(projectile.id, el)
            }}
            className={`projectile projectile-${projectile.side}`}
            style={{
              top: `${projectile.startY - 2.38}px`,
              left: `${projectile.startX}px`
            }}
          >
            {/* A3: Projectile trail particles */}
            <div className="projectile-trail trail-1" />
            <div className="projectile-trail trail-2" />
            <div className="projectile-trail trail-3" />

            <img
              src="/HTM-PROJECTILE-LINE.svg"
              alt=""
              className="projectile-core"
              style={{
                width: '28.56px',
                height: 'auto',
                imageRendering: 'pixelated'
              }}
            />
          </div>
        ))}

        {/* B5: Muzzle flashes - optimized with pre-calculated positions */}
        {muzzleFlashes.map(flash => (
          <img
            key={flash.id}
            src="/HTM-MUZZLE-FLASH.svg"
            alt=""
            className="muzzle-flash"
            style={{
              top: `${flash.y - 23.97}px`,
              left: `${flash.x - 14.28}px`,
              width: 'clamp(9.9px, 1.98vw, 28.56px)',
              height: 'auto',
              imageRendering: 'pixelated',
              transform: flash.side === 'right' ? 'scaleX(-1)' : undefined
            }}
          />
        ))}
      </div>

      {/* Impact layer */}
      <div className="impact-layer">
        {impacts.map(impact => (
          <div
            key={impact.id}
            className="impact-effect"
            style={{
              top: `${impact.y - 20}px`,
              left: `${impact.x - 20}px`
            }}
          >
            <div className="impact-burst" />
            <div className="impact-particles">
              {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
                <div
                  key={angle}
                  className="impact-particle"
                  style={{
                    transform: `rotate(${angle}deg) translateY(-15px)`,
                    animationDelay: `${angle / 360 * 50}ms`
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* A5: Death debris layer */}
      <div className="debris-layer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 100 }}>
        {deathDebris.map(debris => (
          <div key={debris.id} style={{ position: 'absolute', left: debris.x, top: debris.y }}>
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30) * (Math.PI / 180)
              const distance = 40 + Math.random() * 20
              return (
                <div
                  key={i}
                  className="death-debris"
                  style={{
                    '--debris-x': `${Math.cos(angle) * distance}px`,
                    '--debris-y': `${Math.sin(angle) * distance}px`,
                    animationDelay: `${i * 10}ms`
                  } as React.CSSProperties}
                />
              )
            })}
          </div>
        ))}
      </div>

      {/* A6: Teleport effects layer */}
      <div className="teleport-layer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 101 }}>
        {teleportEffects.map(effect => (
          <div key={effect.id} style={{ position: 'absolute', left: effect.x, top: effect.y }}>
            <div className="teleport-ring" />
            <div className="teleport-scanlines" />
            {/* Inward particle burst */}
            {[...Array(8)].map((_, i) => {
              const angle = (i * 45) * (Math.PI / 180)
              const distance = 60
              return (
                <div
                  key={i}
                  className="teleport-particle"
                  style={{
                    '--particle-x': `${Math.cos(angle) * distance}px`,
                    '--particle-y': `${Math.sin(angle) * distance}px`,
                    animationDelay: `${i * 20}ms`
                  } as React.CSSProperties}
                />
              )
            })}
          </div>
        ))}
      </div>

      {/* Main content */}
      {children}
    </div>
  )
}
