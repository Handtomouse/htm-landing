"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useHapticFeedback } from "@/lib/hooks";
import {
  DESTINATIONS,
  EASTER_EGGS,
  COUNTDOWN_MESSAGES,
  DESTINATION_HINTS,
  PARALLAX_MULTIPLIERS,
  LAYER_SIZE_MULTIPLIERS,
  LAYER_OPACITY_MULTIPLIERS,
  SPEED_LINE_COUNT,
  SPEED_LINE_INDICES,
} from "@/lib/wormholeData";

// TypeScript declarations for webkit-prefixed APIs
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

// Shared AudioContext - create once and reuse for all sounds (major memory savings)
let sharedAudioContext: AudioContext | null = null;
const getAudioContext = () => {
  if (!sharedAudioContext && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      sharedAudioContext = new AudioContextClass();
    }
  }
  return sharedAudioContext;
};

interface Star {
  id: number;
  x: number;
  y: number;
  z: number;
  speed: number;
  colorPhase: number;
  layer: number; // 0 = background (slow), 1 = mid (normal), 2 = foreground (fast)
}

// Configuration constants
const WORMHOLE_CONFIG = {
  // Countdown settings
  COUNTDOWN_DURATION: 3,
  ABORT_WINDOW_MS: 1000,

  // Animation timings (ms)
  HYPERHYPERSPACE_DURATION: 2000,
  FADE_TRANSITION_DURATION: 300,
  WHITE_FLASH_DURATION: 800,
  ABORT_FEEDBACK_DURATION: 2000,
  HECTIC_SPEED_DURATION: 3000,
  BOOST_DURATION: 2000,
  KONAMI_DURATION: 10000,

  // Particle settings
  MAX_PARTICLES: 200,
  PARTICLES_HYPERHYPERSPACE: 60,
  PARTICLES_HECTIC: 40,
  PARTICLES_NORMAL: 25,

  // Color shift animation
  COLOR_SHIFT_INCREMENT: 0.01,
  COLOR_SHIFT_THROTTLE_MS: 100,

  // Journey tracking
  STREAK_TIMEOUT_HOURS: 24,
  RECENT_DESTINATIONS_LIMIT: 10,
  JOURNEY_HISTORY_LIMIT: 100,
  EASTER_EGG_PROBABILITY: 0.01,

  // Mobile detection
  MOBILE_BREAKPOINT: 640,
  MOBILE_STAR_DENSITY: 35,
  DESKTOP_STAR_DENSITY: 75,

  // Double-tap detection
  DOUBLE_TAP_WINDOW_MS: 300,
} as const;

export default function WormholeContent() {
  const triggerHaptic = useHapticFeedback();

  // Refs for cleanup and focus management
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const [stars, setStars] = useState<Star[]>([]);
  const [isWarping, setIsWarping] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(true);
  const [acceptedRisk, setAcceptedRisk] = useState(false);
  const [hasSeenWarning, setHasSeenWarning] = useState(false);
  const [countdown, setCountdown] = useState(WORMHOLE_CONFIG.COUNTDOWN_DURATION);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [journeyCount, setJourneyCount] = useState(0);
  const [currentHint, setCurrentHint] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [canAbort, setCanAbort] = useState(false);
  const [colorShift, setColorShift] = useState(0);
  const [showAbortFeedback, setShowAbortFeedback] = useState(false);
  const [boost, setBoost] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showStreakBadge, setShowStreakBadge] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [hecticSpeed, setHecticSpeed] = useState(false);
  const [showHecticMessage, setShowHecticMessage] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [currentDestination, setCurrentDestination] = useState<{url: string, category: string, hint: string} | null>(null);
  const [enabledCategories, setEnabledCategories] = useState<Record<string, boolean>>({
    interactive: true,
    games: true,
    weirdFun: true,
    music: true,
    educational: true,
    retro: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [konamiActive, setKonamiActive] = useState(false);
  const [starDensity, setStarDensity] = useState(WORMHOLE_CONFIG.DESKTOP_STAR_DENSITY);
  const [showWhiteFlash, setShowWhiteFlash] = useState(false);
  const [isHyperhyperspace, setIsHyperhyperspace] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'interactive' | 'games' | 'weirdFun' | 'music' | 'educational' | 'retro' | 'all'>('all');
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [journeyHistory, setJourneyHistory] = useState<Array<{url: string, hint: string, timestamp: number}>>([]);

  // Viewport dimensions for responsive calculations
  const [viewportWidth, setViewportWidth] = useState(480); // Default to BB width
  const [viewportHeight, setViewportHeight] = useState(800); // Default to BB height
  const [viewportReady, setViewportReady] = useState(false);

  // Particle burst state
  const [burstParticles, setBurstParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
  }>>([]);

  // Sound effects using Web Audio API (shared context for performance)
  const playSound = useCallback((type: 'whoosh' | 'beep' | 'warp' | 'abort') => {
    if (!soundEnabled) return;

    try {
      const audioContext = getAudioContext();
      if (!audioContext) return;

      // Resume audio context if suspended (iOS requirement)
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      switch (type) {
        case 'whoosh':
          oscillator.type = 'sawtooth';
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.3);
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.3);
          break;

        case 'beep':
          oscillator.type = 'square';
          oscillator.frequency.value = 600;
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.1);
          break;

        case 'warp':
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(40, audioContext.currentTime + 1.5);
          gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 1.5);
          break;

        case 'abort':
          oscillator.type = 'triangle';
          oscillator.frequency.value = 400;
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.setValueAtTime(0, audioContext.currentTime + 0.05);
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + 0.1);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.3);
          break;
      }
    } catch (error) {
      // Silently fail if audio playback fails (common on iOS)
      console.warn('Audio playback failed:', error);
    }
  }, [soundEnabled]);

  // Toggle sound and save preference
  const toggleSound = useCallback(() => {
    triggerHaptic(10);
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    try {
      localStorage.setItem("wormhole_sound", newValue.toString());
    } catch (error) {
      // Gracefully handle localStorage errors
    }
    if (newValue) {
      playSound('beep');
    }
  }, [soundEnabled, triggerHaptic, playSound]);

  // Load journey data from localStorage (runs after hydration)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("wormhole_journeys");
      const history = localStorage.getItem("wormhole_history");
      const savedStreak = localStorage.getItem("wormhole_streak");
      const lastJourney = localStorage.getItem("wormhole_last_journey");
      const savedSound = localStorage.getItem("wormhole_sound");
      const savedCategories = localStorage.getItem("wormhole_categories");

      setJourneyCount(saved ? parseInt(saved) : 0);
      setSoundEnabled(savedSound === "true");
      if (savedCategories) {
        setEnabledCategories(JSON.parse(savedCategories));
      }
      if (history) {
        setJourneyHistory(JSON.parse(history));
      }

      // Check if streak is still valid (within configured hours)
      if (lastJourney) {
        const hoursSinceLastJourney = (Date.now() - parseInt(lastJourney)) / (1000 * 60 * 60);
        if (hoursSinceLastJourney < WORMHOLE_CONFIG.STREAK_TIMEOUT_HOURS) {
          setStreak(savedStreak ? parseInt(savedStreak) : 0);
        } else {
          localStorage.removeItem("wormhole_streak");
          setStreak(0);
        }
      }
    } catch (error) {
      // Gracefully handle localStorage errors (private browsing, quota exceeded, etc.)
      // App continues to work with default values
    }
  }, []);

  // Cleanup timeouts, intervals, and AudioContext on unmount
  useEffect(() => {
    return () => {
      // Clear countdown interval
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      // Clear all animation timeouts
      animationTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      animationTimeoutsRef.current = [];
      // Close AudioContext to prevent memory leak
      if (sharedAudioContext && sharedAudioContext.state !== 'closed') {
        sharedAudioContext.close();
        sharedAudioContext = null;
      }
    };
  }, []);

  // Focus trap for exit warning modal
  useEffect(() => {
    if (!showExitWarning || !modalRef.current) return;

    // Save the previously focused element
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Get all focusable elements in the modal
    const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus the first element
    if (firstElement) {
      firstElement.focus();
    }

    // Trap focus within modal
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab: move to previous element
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab: move to next element
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
      // Restore focus when modal closes
      if (previousFocusRef.current && !showExitWarning) {
        previousFocusRef.current.focus();
      }
    };
  }, [showExitWarning]);

  // Track viewport dimensions for responsive calculations
  useEffect(() => {
    const updateViewport = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      // Detect rotation during warp (aspect ratio flip)
      const wasPortrait = viewportHeight > viewportWidth;
      const isPortrait = newHeight > newWidth;
      const rotationDetected = wasPortrait !== isPortrait;

      // If rotating during warp, abort warp for safety
      if (isWarping && rotationDetected && viewportReady) {
        handleAbort();
      }

      setViewportWidth(newWidth);
      setViewportHeight(newHeight);
      setViewportReady(true);
      // Update star density based on mobile detection
      if (newWidth < WORMHOLE_CONFIG.MOBILE_BREAKPOINT) {
        setStarDensity(WORMHOLE_CONFIG.MOBILE_STAR_DENSITY);
      } else {
        setStarDensity(WORMHOLE_CONFIG.DESKTOP_STAR_DENSITY);
      }
    };

    // Set initial values
    updateViewport();

    // Update on resize with debounce
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateViewport, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [isWarping, viewportWidth, viewportHeight, viewportReady]);

  // Initialize stars, shimmers, and loading - adapted for BB screen (480x800)
  useEffect(() => {
    const initialStars: Star[] = Array.from({ length: starDensity }, (_, i) => {
      const rand = Math.random();
      const layer = rand < 0.4 ? 0 : (rand < 0.8 ? 1 : 2);

      return {
        id: i,
        x: (Math.random() - 0.5) * 1000,
        y: (Math.random() - 0.5) * 1000,
        z: Math.random() * 2000,
        speed: 2,
        colorPhase: Math.random() * Math.PI * 2,
        layer,
      };
    });
    setStars(initialStars);

    setIsLoading(false);

  }, [starDensity]);

  // Animate stars using requestAnimationFrame
  useEffect(() => {
    let animationFrameId: number;

    const calculateBaseSpeed = () => {
      if (isHyperhyperspace) return 300;
      if (hecticSpeed) return 150;
      if (isWarping) return 50;
      if (konamiActive) return 30;
      if (boost) return 20;
      return 2;
    };

    const animateStars = () => {
      const baseSpeed = calculateBaseSpeed();

      setStars((prevStars) =>
        prevStars.map((star) => {
          const layerMultipliers = [0.5, 1, 1.5];
          const currentSpeed = baseSpeed * layerMultipliers[star.layer] * (konamiActive ? 1.5 : 1);

          let newZ = star.z - currentSpeed;
          let newColorPhase = star.colorPhase + (isWarping ? 0.1 : 0.01);

          if (newZ <= 0) {
            return {
              ...star,
              x: (Math.random() - 0.5) * 1000,
              y: (Math.random() - 0.5) * 1000,
              z: 2000,
              speed: currentSpeed,
              colorPhase: newColorPhase,
              layer: star.layer,
            };
          }

          return { ...star, z: newZ, speed: currentSpeed, colorPhase: newColorPhase };
        })
      );

      animationFrameId = requestAnimationFrame(animateStars);
    };

    animationFrameId = requestAnimationFrame(animateStars);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isWarping, boost, hecticSpeed, konamiActive, isHyperhyperspace]);


  // Color shift animation (optimized with RAF throttling)
  useEffect(() => {
    let animationFrameId: number;
    let lastUpdate = 0;

    const updateColorShift = (timestamp: number) => {
      if (timestamp - lastUpdate >= WORMHOLE_CONFIG.COLOR_SHIFT_THROTTLE_MS) {
        setColorShift((prev) => (prev + WORMHOLE_CONFIG.COLOR_SHIFT_INCREMENT) % (Math.PI * 2));
        lastUpdate = timestamp;
      }
      animationFrameId = requestAnimationFrame(updateColorShift);
    };

    animationFrameId = requestAnimationFrame(updateColorShift);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Track mouse movement for parallax effect (throttled with RAF for 60fps max)
  useEffect(() => {
    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId !== null) return; // Skip if already scheduled

      rafId = requestAnimationFrame(() => {
        const centerX = viewportWidth / 2;
        const centerY = viewportHeight / 2;
        setMousePos({
          x: (e.clientX - centerX) * 0.05,
          y: (e.clientY - centerY) * 0.05,
        });
        rafId = null;
      });
    };

    const handleOrientation = (e: DeviceOrientationEvent) => {
      const beta = e.beta || 0;
      const gamma = e.gamma || 0;

      setMousePos({
        x: (gamma / 90) * 30,
        y: (beta / 180) * 30,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Only add orientation listener on mobile devices (optimize performance)
    if (window.innerWidth < WORMHOLE_CONFIG.MOBILE_BREAKPOINT) {
      window.addEventListener("deviceorientation", handleOrientation);
    }

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
      // Always remove both listeners (safe even if not added)
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [isWarping, showExitWarning, viewportWidth, viewportHeight]);


  // Click to boost & double-tap for ludicrous speed
  // Only active during warp or when controls are hidden
  useEffect(() => {
    // Only attach boost handler when warping OR when controls are hidden (pre-warning)
    const shouldAttachBoostHandler = isWarping || !hasSeenWarning || showExitWarning;

    if (!shouldAttachBoostHandler) {
      // Don't attach handler when controls are visible
      return;
    }

    const handleClick = (e: Event) => {
      // Prevent boost on button clicks
      const target = e.target as HTMLElement;
      if (target.closest('button')) {
        return; // Ignore clicks on buttons
      }

      if (!isWarping && !showExitWarning) {
        const now = Date.now();
        const timeSinceLastClick = now - lastClickTime;

        if (timeSinceLastClick < WORMHOLE_CONFIG.DOUBLE_TAP_WINDOW_MS && timeSinceLastClick > 0) {
          triggerHaptic([10, 30, 10, 30, 10]);
          setHecticSpeed(true);
          setShowHecticMessage(true);
          playSound('warp');
          setTimeout(() => {
            setHecticSpeed(false);
            setShowHecticMessage(false);
          }, WORMHOLE_CONFIG.HECTIC_SPEED_DURATION);
        } else {
          triggerHaptic(10);
          setBoost(true);
          playSound('whoosh');
          setTimeout(() => setBoost(false), WORMHOLE_CONFIG.BOOST_DURATION);
        }

        setLastClickTime(now);
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [isWarping, showExitWarning, hasSeenWarning]); // Removed lastClickTime, triggerHaptic, playSound to prevent unnecessary re-renders

  // Konami Code detection (lazy loaded - only active when arrow keys pressed)
  useEffect(() => {
    if (konamiActive) return; // Don't attach if already active

    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let sequence: string[] = [];

    const handleKonami = (e: KeyboardEvent) => {
      // Only track relevant keys to reduce overhead
      const relevantKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
      if (!relevantKeys.includes(e.key)) return;

      sequence.push(e.key);
      if (sequence.length > 10) sequence.shift();

      if (sequence.length === 10 && sequence.join(',') === konamiCode.join(',')) {
        setKonamiActive(true);
        playSound('warp');
        setTimeout(() => setKonamiActive(false), WORMHOLE_CONFIG.KONAMI_DURATION);
        sequence = []; // Reset
      }
    };

    window.addEventListener('keydown', handleKonami);
    return () => window.removeEventListener('keydown', handleKonami);
  }, [konamiActive, playSound]);

  // Abort warp with feedback
  const abortWarp = useCallback(() => {
    triggerHaptic([15, 50, 15]);
    setIsWarping(false);
    setCanAbort(false);
    setCountdown(WORMHOLE_CONFIG.COUNTDOWN_DURATION);
    setShowAbortFeedback(true);
    playSound('abort');
    setTimeout(() => setShowAbortFeedback(false), WORMHOLE_CONFIG.ABORT_FEEDBACK_DURATION);
  }, [triggerHaptic, soundEnabled]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " && !isWarping && !showExitWarning) {
        e.preventDefault();
        handleWarpButtonClick();
      } else if (e.key === "Escape") {
        e.preventDefault();
        if (showExitWarning) {
          setShowExitWarning(false);
          setAcceptedRisk(false);
        } else if (isWarping && canAbort) {
          abortWarp();
        }
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        setMousePos({ x: 0, y: 0 });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isWarping, canAbort, showExitWarning]);

  // Particle burst on speed change
  useEffect(() => {
    const createBurst = () => {
      const newParticles: Array<{
        id: number;
        x: number;
        y: number;
        vx: number;
        vy: number;
        life: number;
        color: string;
      }> = [];
      const particleCount = isHyperhyperspace
        ? (isMobile ? 30 : WORMHOLE_CONFIG.PARTICLES_HYPERHYPERSPACE)
        : (hecticSpeed ? (isMobile ? 20 : WORMHOLE_CONFIG.PARTICLES_HECTIC) : WORMHOLE_CONFIG.PARTICLES_NORMAL);
      const baseId = Date.now();

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const speed = 3 + Math.random() * 4;
        const color = 'rgba(255,255,255,0.9)'; // Pure white for Star Wars hyperspace

        newParticles.push({
          id: baseId + i,
          x: viewportWidth / 2,
          y: viewportHeight / 2,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1.0,
          color
        });
      }

      setBurstParticles(prev => {
        const combined = [...prev, ...newParticles];
        // Enforce hard limit by keeping only the newest particles
        const maxParticles = isMobile ? 100 : WORMHOLE_CONFIG.MAX_PARTICLES;
        return combined.length > maxParticles
          ? combined.slice(combined.length - maxParticles)
          : combined;
      });
    };

    if (isWarping || hecticSpeed || isHyperhyperspace) {
      createBurst();
    }
  }, [isWarping, hecticSpeed, isHyperhyperspace]);

  // Animate burst particles
  useEffect(() => {
    if (burstParticles.length === 0) return;

    let animationFrameId: number;

    const animateParticles = () => {
      setBurstParticles(prev => {
        const updated = prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 0.02
          }))
          .filter(p => p.life > 0);

        if (updated.length > 0) {
          animationFrameId = requestAnimationFrame(animateParticles);
        }

        return updated;
      });
    };

    animationFrameId = requestAnimationFrame(animateParticles);
    return () => cancelAnimationFrame(animationFrameId);
  }, [burstParticles.length]);

  // Memoize category weights (only recalculate per hour)
  const currentHour = new Date().getHours();
  const baseCategoryWeights = useMemo(() => {
    if (currentHour >= 6 && currentHour < 12) {
      return { interactive: 0.35, educational: 0.3, music: 0.2, retro: 0.15 };
    } else if (currentHour >= 22 || currentHour < 6) {
      return { weirdFun: 0.4, games: 0.3, interactive: 0.2, retro: 0.1 };
    } else {
      return { interactive: 0.3, games: 0.25, weirdFun: 0.2, music: 0.1, educational: 0.1, retro: 0.05 };
    }
  }, [currentHour]);

  // Get random destination (respecting category filters)
  const getRandomDestination = useCallback(() => {
    const isEasterEgg = Math.random() < WORMHOLE_CONFIG.EASTER_EGG_PROBABILITY;

    if (isEasterEgg) {
      return {
        url: EASTER_EGGS[Math.floor(Math.random() * EASTER_EGGS.length)],
        category: "RARE",
        hint: "LEGENDARY",
      };
    }

    let chosenCategory: string;

    if (selectedCategory !== 'all') {
      chosenCategory = selectedCategory;
    } else {
      const enabledCats = Object.keys(enabledCategories).filter(cat => enabledCategories[cat]);

      if (enabledCats.length === 0) {
        return {
          url: DESTINATIONS.interactive[0],
          category: "interactive",
          hint: "Interactive",
        };
      }

      const filteredWeights: Record<string, number> = {};
      let totalWeight = 0;
      for (const cat of enabledCats) {
        const weight = baseCategoryWeights[cat] || (1 / enabledCats.length);
        filteredWeights[cat] = weight;
        totalWeight += weight;
      }

      for (const cat in filteredWeights) {
        filteredWeights[cat] /= totalWeight;
      }

      const rand = Math.random();
      let cumulative = 0;
      chosenCategory = enabledCats[0];

      for (const [cat, weight] of Object.entries(filteredWeights)) {
        cumulative += weight;
        if (rand <= cumulative) {
          chosenCategory = cat;
          break;
        }
      }
    }

    let recent: string[] = [];
    try {
      const recentStr = localStorage.getItem("wormhole_recent");
      recent = recentStr ? JSON.parse(recentStr) : [];
    } catch (error) {
      // Gracefully handle localStorage errors
    }

    const category = DESTINATIONS[chosenCategory as keyof typeof DESTINATIONS];
    const available = category.filter(url => !recent.includes(url));
    const pool = available.length > 0 ? available : category;
    const url = pool[Math.floor(Math.random() * pool.length)];

    const newRecent = [url, ...recent.slice(0, WORMHOLE_CONFIG.RECENT_DESTINATIONS_LIMIT - 1)];
    try {
      localStorage.setItem("wormhole_recent", JSON.stringify(newRecent));
    } catch (error) {
      // Gracefully handle localStorage errors
    }

    const hints = DESTINATION_HINTS[chosenCategory as keyof typeof DESTINATION_HINTS] || ["UNKNOWN"];
    const hint = hints[Math.floor(Math.random() * hints.length)];

    return { url, category: chosenCategory, hint };
  }, [selectedCategory, enabledCategories, baseCategoryWeights]);

  // Handle initial warning acceptance
  const handleWarningAccept = () => {
    if (!acceptedRisk) return;

    triggerHaptic(15);
    setShowExitWarning(false);
    setAcceptedRisk(false);
    setHasSeenWarning(true);
  };

  // Start warp sequence
  const handleWarpButtonClick = () => {
    triggerHaptic(20);
    setIsWarping(true);
    setCountdown(WORMHOLE_CONFIG.COUNTDOWN_DURATION);
    setCanAbort(true);
    playSound('warp');

    const destination = getRandomDestination();
    setCurrentDestination(destination);
    setCurrentHint(destination.hint);
    setCurrentMessage(COUNTDOWN_MESSAGES[Math.floor(Math.random() * COUNTDOWN_MESSAGES.length)]);

    // Save to history (capped at 100 entries)
    const newHistory = [
      { url: destination.url, hint: destination.hint, timestamp: Date.now() },
      ...journeyHistory.slice(0, WORMHOLE_CONFIG.JOURNEY_HISTORY_LIMIT - 1)
    ];
    setJourneyHistory(newHistory);
    try {
      localStorage.setItem("wormhole_history", JSON.stringify(newHistory));
    } catch (error) {
      // Gracefully handle localStorage errors
    }

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }

          // Smooth async animation sequence
          (async () => {
            setIsHyperhyperspace(true);
            const t1 = setTimeout(() => {}, WORMHOLE_CONFIG.HYPERHYPERSPACE_DURATION);
            animationTimeoutsRef.current.push(t1);
            await new Promise(resolve => setTimeout(resolve, WORMHOLE_CONFIG.HYPERHYPERSPACE_DURATION));

            setIsHyperhyperspace(false);
            const t2 = setTimeout(() => {}, WORMHOLE_CONFIG.FADE_TRANSITION_DURATION);
            animationTimeoutsRef.current.push(t2);
            await new Promise(resolve => setTimeout(resolve, WORMHOLE_CONFIG.FADE_TRANSITION_DURATION));

            setShowWhiteFlash(true);
            const flashDuration = isMobile ? 500 : WORMHOLE_CONFIG.WHITE_FLASH_DURATION;
            const t3 = setTimeout(() => {}, flashDuration);
            animationTimeoutsRef.current.push(t3);
            await new Promise(resolve => setTimeout(resolve, flashDuration));

            setIsFadingOut(true);

            // Save journey count BEFORE navigation (prevent data loss)
            const newCount = journeyCount + 1;
            setJourneyCount(newCount);
            try {
              localStorage.setItem("wormhole_journeys", newCount.toString());
            } catch (error) {
              // Gracefully handle localStorage errors
            }

            // Navigate immediately with comprehensive error handling
            try {
              window.location.href = destination.url;
            } catch (error) {
              console.warn('Direct navigation failed, trying fallback:', error);
              // Fallback: open in new tab
              try {
                window.open(destination.url, '_blank', 'noopener,noreferrer');
              } catch (fallbackError) {
                console.error('All navigation methods failed:', fallbackError);
                // Last resort: show URL to user
                alert(`Unable to navigate automatically. Please visit: ${destination.url}`);
              }
            }
          })();

          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    countdownIntervalRef.current = countdownInterval;

    const abortTimeout = setTimeout(() => setCanAbort(false), WORMHOLE_CONFIG.ABORT_WINDOW_MS);
    animationTimeoutsRef.current.push(abortTimeout);
  };

  // Get star color - Star Wars style (pure white/blue) - Memoized for performance
  const getStarColor = useCallback((colorPhase: number) => {
    if (!isWarping) {
      // Pure white stars at rest
      return `rgb(255, 255, 255)`;
    }

    // Blue-tinted hyperspace (classic Star Wars look)
    if (isHyperhyperspace) {
      return `rgb(220, 235, 255)`; // Bright blue-white
    }

    // Regular warp: white with slight blue tint
    return `rgb(235, 245, 255)`;
  }, [isWarping, isHyperhyperspace]);

  // Memoized filtered stars for performance
  const filteredStars = useMemo(() => {
    return isWarping ? stars.filter((_, i) => i % 2 === 0) : stars;
  }, [stars, isWarping]);

  // Mobile detection state for responsive styling (prevents hydration errors)
  const [isMobile, setIsMobile] = useState(false);

  // Landscape detection for countdown animation optimization
  const isLandscape = viewportWidth > viewportHeight;
  const isMobileLandscape = isMobile && isLandscape;

  useEffect(() => {
    // Set isMobile after mount to prevent hydration mismatch
    setIsMobile(viewportWidth < WORMHOLE_CONFIG.MOBILE_BREAKPOINT);
  }, [viewportWidth]);

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        background: "#0b0b0b",
        height: '100vh', // Fallback for older browsers
        height: '-webkit-fill-available', // iOS Safari fallback
        height: '100dvh', // Dynamic viewport height for modern mobile browsers
        touchAction: 'manipulation', // Prevent iOS zoom on double-tap
        transition: 'opacity 0.2s ease',
        animation: isHyperhyperspace ? (isMobile ? 'screen-shake-intense-mobile 0.08s infinite' : 'screen-shake-intense 0.08s infinite') :
                   (hecticSpeed ? (isMobile ? 'screen-shake-strong-mobile 0.1s infinite' : 'screen-shake-strong 0.1s infinite') :
                   (isWarping ? (isMobile ? 'screen-shake-medium-mobile 0.15s infinite' : 'screen-shake-medium 0.15s infinite') :
                   (boost ? (isMobile ? 'screen-shake-light-mobile 0.2s infinite' : 'screen-shake-light 0.2s infinite') : 'none'))),
        opacity: isFadingOut ? 0 : 1
      }}
    >
      {/* Loading Screen */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-[100]" style={{ background: "#0b0b0b" }}>
          <div className="text-center">
            <div style={{
              fontSize: "3rem",
              color: "var(--accent)",
              textShadow: "0 0 40px rgba(255, 157, 35, 0.6)",
              animation: "pulse 2s ease-in-out infinite"
            }}>
              ✦
            </div>
            <p style={{
              fontFamily: "monospace",
              letterSpacing: "0.08em",
              fontSize: "0.875rem",
              color: "rgba(255, 255, 255, 0.8)",
              marginTop: "1.5rem"
            }}>
              Calibrating wormhole...
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--accent)", animationDelay: "0s" }}></div>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--accent)", animationDelay: "0.2s" }}></div>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--accent)", animationDelay: "0.4s" }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Nebula background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `
              radial-gradient(ellipse at 15% 25%, rgba(255, 157, 35, 0.15), transparent 45%),
              radial-gradient(ellipse at 85% 75%, rgba(100, 149, 237, 0.18), transparent 50%)
            `,
            animation: "nebula-rotate-slow 60s linear infinite",
          }}
        />
      </div>

      {/* Mouse Trail & Shimmer Particles removed for pure Star Wars aesthetic */}

      {/* Starfield - responsive to viewport dimensions */}
      <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'hidden' }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${viewportWidth} ${viewportHeight}`} preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", top: 0, left: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {/* SVG Filters for Star Wars-style glow */}
          <defs>
            <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
            <filter id="streakGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
            <linearGradient id="streakGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="white" stopOpacity="0"/>
              <stop offset="100%" stopColor="white" stopOpacity="1"/>
            </linearGradient>
          </defs>

          {/* Stars */}
          {filteredStars.map((star) => {
            const perspective = 1000;
            const scale = perspective / (perspective + star.z);

            // Dynamic center point based on viewport
            const centerX = viewportWidth / 2;
            const centerY = viewportHeight / 2;

            // Parallax depth effect based on layer (background moves slower than foreground)
            const parallaxX = mousePos.x * PARALLAX_MULTIPLIERS[star.layer];
            const parallaxY = mousePos.y * PARALLAX_MULTIPLIERS[star.layer];

            const x = star.x * scale + centerX + parallaxX;
            const y = star.y * scale + centerY + parallaxY;

            const brightness = (1 - star.z / 2000) * LAYER_OPACITY_MULTIPLIERS[star.layer];
            const size = Math.max(1.5, 4 * scale * LAYER_SIZE_MULTIPLIERS[star.layer]);

            // Star Wars-style dramatic streak multipliers
            const streakMultiplier = isHyperhyperspace ? 25 : (isWarping ? 12 : (boost ? 5 : 1));
            const streakZ = star.z + (star.speed * streakMultiplier);
            const streakScale = perspective / (perspective + streakZ);
            const streakX = star.x * streakScale + centerX;
            const streakY = star.y * streakScale + centerY;

            const starColor = getStarColor(star.colorPhase);

            return (
              <g key={star.id}>
                {(isHyperhyperspace || isWarping || boost) && (
                  <line
                    x1={streakX}
                    y1={streakY}
                    x2={x}
                    y2={y}
                    stroke={starColor}
                    strokeWidth={size * 1.5}
                    opacity={brightness * 0.9}
                    filter="url(#streakGlow)"
                    strokeLinecap="round"
                  />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={size}
                  fill={starColor}
                  opacity={brightness}
                  filter="url(#starGlow)"
                />
              </g>
            );
          })}

          {/* Particle burst */}
          {burstParticles.map(particle => (
            <circle
              key={particle.id}
              cx={particle.x}
              cy={particle.y}
              r={4 * particle.life}
              fill={particle.color}
              opacity={particle.life * 0.8}
              style={{
                filter: `blur(${2 * (1 - particle.life)}px)`
              }}
            />
          ))}
        </svg>
      </div>

      {/* Blue Hyperspace Tunnel Effect (Star Wars style) */}
      {(isWarping || isHyperhyperspace) && (
        <>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, transparent 20%, rgba(150, 200, 255, 0.15) 60%, rgba(100, 150, 255, 0.3) 100%)",
              animation: isHyperhyperspace ? "hyperspace-pulse 0.5s ease-in-out infinite" : "hyperspace-pulse 2s ease-in-out infinite"
            }}
          />
          {/* Center Lens Flare */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: isMobile ? "120px" : "200px",
              height: isMobile ? "120px" : "200px",
              top: 'calc(50% + max(0px, env(safe-area-inset-top) / 2))',
              left: 'calc(50% + max(0px, env(safe-area-inset-left) / 2))',
              transform: "translate(-50%, -50%)",
              background: "radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(200, 220, 255, 0.2) 20%, transparent 50%)",
              filter: "blur(30px)",
              opacity: isHyperhyperspace ? 0.8 : 0.4,
              animation: "hyperspace-pulse 1s ease-in-out infinite"
            }}
          />

          {/* Horizontal Lens Flare Streaks */}
          <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'hidden' }}>
            <div
              className="absolute left-0 top-1/2"
              style={{
                width: '100%',
                height: '2px',
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
                transform: 'translateY(-50%)',
                opacity: isHyperhyperspace ? 0.9 : 0.6,
                animation: 'lens-flare-horizontal 1.5s ease-in-out infinite'
              }}
            />
            <div
              className="absolute left-0 top-1/2"
              style={{
                width: '100%',
                height: '1px',
                background: 'linear-gradient(90deg, transparent 0%, rgba(150,200,255,0.6) 50%, transparent 100%)',
                transform: 'translateY(calc(-50% - 10px))',
                opacity: isHyperhyperspace ? 0.7 : 0.4,
                animation: 'lens-flare-horizontal 1.5s ease-in-out infinite 0.2s'
              }}
            />
            <div
              className="absolute left-0 top-1/2"
              style={{
                width: '100%',
                height: '1px',
                background: 'linear-gradient(90deg, transparent 0%, rgba(150,200,255,0.6) 50%, transparent 100%)',
                transform: 'translateY(calc(-50% + 10px))',
                opacity: isHyperhyperspace ? 0.7 : 0.4,
                animation: 'lens-flare-horizontal 1.5s ease-in-out infinite 0.4s'
              }}
            />
          </div>
        </>
      )}

      {/* Enhanced Vignette with graduated darkness */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isHyperhyperspace
            ? "radial-gradient(circle at center, transparent 15%, rgba(0,0,0,0.95) 100%)"
            : (isWarping || hecticSpeed
              ? "radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.85) 100%)"
              : "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.7) 100%)"),
          transition: 'background 0.3s ease'
        }}
      />

      {/* White Flash - Covers entire viewport including OS UI */}
      {showWhiteFlash && (
        <div
          className="fixed inset-0 bg-white z-[9999]"
          style={{ animation: isMobile ? "white-flash-mobile 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards" : "white-flash 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards" }}
          onAnimationEnd={() => setShowWhiteFlash(false)}
        />
      )}

      {/* Abort Feedback */}
      {showAbortFeedback && (
        <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center pointer-events-none z-50">
          <div className="text-center">
            <p className="font-mono text-4xl text-red-500 mb-2 font-bold">WARP ABORTED</p>
            <p className="font-mono text-sm text-white">Returning to normal space...</p>
          </div>
        </div>
      )}

      {/* Konami Code Activation */}
      {konamiActive && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="text-center px-4">
            <p className="text-3xl mb-2" style={{
              background: "linear-gradient(90deg, var(--accent), #6495ED, #BA55D3, #40E0D0, var(--accent))",
              backgroundSize: "400% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "rainbow 1.5s linear infinite",
              fontWeight: "bold"
            }}>
              ✦ COSMIC MODE ✦
            </p>
            <p className="text-white/80 text-xs" style={{ letterSpacing: "0.1em" }}>
              The universe bends to your will
            </p>
          </div>
        </div>
      )}

      {/* Hectic Speed Message with Speed Lines */}
      {showHecticMessage && (
        <>
          {/* Speed Lines (Comic book style motion lines) */}
          <div className="absolute inset-0 pointer-events-none z-[99]" style={{ overflow: 'hidden' }}>
            {SPEED_LINE_INDICES.map((i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  left: '50%',
                  top: '50%',
                  width: '200%',
                  height: '3px',
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
                  transform: `translate(-50%, -50%) rotate(${i * 30}deg)`,
                  transformOrigin: 'center',
                  animation: `speed-line-pulse 0.3s ease-out ${i * 0.02}s infinite`
                }}
              />
            ))}
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[100]">
            <div className={`${isMobile ? 'px-3 py-4' : 'px-12 py-10'} bg-black/90 rounded-xl`} style={{
              border: isMobile ? "3px solid #ffffff" : "4px solid #ffffff",
              boxShadow: "0 0 80px rgba(255, 255, 255, 1), 0 0 40px rgba(255, 255, 255, 0.8)",
              animation: "hectic-speed-entrance 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
              transform: "scale(1.1)",
              maxWidth: isMobile ? "85%" : "auto"
            }}>
              <p className={`${isMobile ? 'text-2xl' : 'text-5xl'} font-bold mb-3`} style={{
                background: "linear-gradient(135deg, #ffffff 0%, #bbdefb 50%, #64b5f6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 50px rgba(255, 255, 255, 1), 0 0 20px rgba(255, 255, 255, 0.8)"
              }}>
                HECTIC SPEED
              </p>
              <p className={`text-white ${isMobile ? 'text-xs' : 'text-base'} text-center font-bold`}>Fast! Fast! Fast!</p>
            </div>
          </div>
        </>
      )}

      {/* Countdown Overlay */}
      {isWarping && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            padding: 'max(2rem, env(safe-area-inset-top)) max(1.5rem, env(safe-area-inset-right)) max(2rem, env(safe-area-inset-bottom)) max(1.5rem, env(safe-area-inset-left))'
          }}
          role="alert"
          aria-live="assertive"
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: isMobile ? '90vw' : '700px',
              width: '100%',
              margin: '0 auto'
            }}
            aria-label={countdown === 3 ? `Warp initiating in ${countdown} seconds to ${currentHint}` : countdown === 0 ? `Warping to ${currentHint} now` : undefined}
          >
            {/* Emoji Icon */}
            {countdown > 0 && currentDestination && (
              <div
                style={{
                  fontSize: isMobile ? "3rem" : "4rem",
                  lineHeight: 1,
                  filter: "drop-shadow(0 0 16px rgba(255, 157, 35, 0.6))",
                  animation: prefersReducedMotion ? 'none' : "flip-reveal 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  marginBottom: isMobile ? '1.5rem' : '2rem'
                }}
              >
                {currentDestination.category === 'interactive' && '🎮'}
                {currentDestination.category === 'games' && '🎯'}
                {currentDestination.category === 'weirdFun' && '🎪'}
                {currentDestination.category === 'music' && '🎵'}
                {currentDestination.category === 'educational' && '📚'}
                {currentDestination.category === 'retro' && '👾'}
                {currentDestination.category === 'RARE' && '✦'}
              </div>
            )}

            {/* Screen reader announcement */}
            <span className="sr-only" aria-live="polite" aria-atomic="true">
              {countdown === 3 && `Warp initiating in ${countdown} seconds to ${currentHint}`}
              {countdown === 0 && `Warping to ${currentHint} now`}
            </span>

            {/* Countdown Number */}
            <div
              key={countdown}
              style={{
                fontFamily: "monospace",
                fontSize: isMobile ? "clamp(4rem, 15vw, 5rem)" : "6rem",
                fontWeight: 700,
                lineHeight: 1.2,
                color: "var(--accent)",
                filter: "drop-shadow(0 0 24px rgba(255, 157, 35, 0.8))",
                animation: prefersReducedMotion ? 'none' : 'countdown-bounce 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.1s',
                marginBottom: isMobile ? '1rem' : '1.5rem'
              }}
            >
              {countdown}
            </div>

            {/* Message Text */}
            <p style={{
              fontFamily: "monospace",
              fontSize: isMobile ? "clamp(1rem, 4vw, 1.125rem)" : "1.25rem",
              lineHeight: 1.4,
              letterSpacing: "0.04em",
              color: "rgba(255, 255, 255, 0.9)",
              textAlign: 'center',
              maxWidth: isMobile ? '80vw' : '65vw',
              marginBottom: isMobile ? '1rem' : '1.5rem',
              animation: prefersReducedMotion ? 'none' : 'fade-in 0.3s ease-out 0.2s backwards'
            }}>
              {currentMessage}
            </p>

            {/* Hint with Decorative Lines */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: isMobile ? '0.75rem' : '1rem',
                width: '100%',
                maxWidth: isMobile ? '90vw' : '600px',
                marginBottom: isMobile ? '1rem' : '1.5rem',
                animation: prefersReducedMotion ? 'none' : 'fade-in 0.3s ease-out 0.3s backwards'
              }}
            >
              <div style={{
                height: "1px",
                flex: "1 1 0",
                minWidth: isMobile ? "1rem" : "2rem",
                maxWidth: isMobile ? "4rem" : "6rem",
                background: "linear-gradient(to right, transparent, var(--accent))"
              }}></div>
              <p style={{
                fontFamily: "monospace",
                fontSize: isMobile ? "clamp(0.875rem, 3.5vw, 1rem)" : "1rem",
                letterSpacing: "0.04em",
                fontWeight: "600",
                color: "var(--accent)",
                textAlign: "center",
                margin: 0,
                maxWidth: isMobile ? "50vw" : "350px",
                lineHeight: 1.3,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: isMobile ? "normal" : "nowrap"
              } as React.CSSProperties}>
                {currentHint}
              </p>
              <div style={{
                height: "1px",
                flex: "1 1 0",
                minWidth: isMobile ? "1rem" : "2rem",
                maxWidth: isMobile ? "4rem" : "6rem",
                background: "linear-gradient(to left, transparent, var(--accent))"
              }}></div>
            </div>

            {/* ESC to abort - show on all devices */}
            {canAbort && (
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: isMobile ? "0.75rem" : "0.875rem",
                  color: "rgba(255, 255, 255, 0.6)",
                  letterSpacing: "0.08em",
                  textAlign: "center",
                  margin: 0,
                  animation: prefersReducedMotion ? 'none' : 'pulse 2s ease-in-out infinite'
                }}
                aria-label="Press escape key or tap to abort warp"
              >
                {isMobile ? 'TAP to abort' : 'ESC to abort'}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Exit Warning Modal */}
      {showExitWarning && (
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-warning-title"
          className="absolute inset-0 flex items-center justify-center pointer-events-auto z-50"
          style={{
            backdropFilter: "blur(20px)",
            backgroundColor: "rgba(11, 11, 11, 0.85)",
            paddingTop: isMobile ? 'max(1.5rem, env(safe-area-inset-top))' : 'max(var(--grid-3x), env(safe-area-inset-top))',
            paddingBottom: isMobile ? 'max(1.5rem, calc(env(safe-area-inset-bottom) + 0.5rem))' : 'max(var(--grid-3x), env(safe-area-inset-bottom))',
            paddingLeft: isMobile ? 'max(1.5rem, env(safe-area-inset-left))' : 'max(var(--grid-3x), env(safe-area-inset-left))',
            paddingRight: isMobile ? 'max(1.5rem, env(safe-area-inset-right))' : 'max(var(--grid-3x), env(safe-area-inset-right))'
          }}
          onClick={(e) => {
            // Dismiss modal when clicking backdrop (not content)
            if (e.target === e.currentTarget) {
              triggerHaptic(10);
              setShowExitWarning(false);
              setAcceptedRisk(false);
            }
          }}
        >
          <div className="w-full backdrop-blur-xl shadow-2xl" style={{
            background: "rgba(11, 11, 11, 0.6)",
            border: "1px solid rgba(255, 157, 35, 0.2)",
            boxShadow: "0 0 60px rgba(255, 157, 35, 0.15), inset 0 1px 0 rgba(255, 157, 35, 0.1)",
            maxWidth: isMobile ? "400px" : "550px",
            width: "100%",
            margin: "0 auto",
            borderRadius: "12px",
            padding: isMobile ? "1.25rem" : "clamp(1.25rem, 4vw, 2rem)"
          }}>
            <div className="text-center">
              <div
                style={{
                  fontSize: isMobile ? "1.5rem" : "2rem",
                  marginBottom: isMobile ? "1rem" : "1rem",
                  color: "var(--accent)",
                  textShadow: "0 0 20px rgba(255, 157, 35, 0.3)"
                }}
                aria-hidden="true"
              >✦</div>
              <h2 id="exit-warning-title" style={{
                fontFamily: "system-ui",
                fontSize: isMobile ? "1rem" : "clamp(1.125rem, 3vw, 1.25rem)",
                marginBottom: isMobile ? "0.75rem" : "0.5rem",
                color: "var(--accent)",
                letterSpacing: "0.02em",
                fontWeight: "600"
              }}>
                Your Journey Awaits
              </h2>
              <p style={{
                fontFamily: "monospace",
                fontSize: isMobile ? "0.625rem" : "0.75rem",
                marginBottom: isMobile ? "1rem" : "1rem",
                color: "rgba(255, 255, 255, 0.6)"
              }}>
                Step into the unknown
              </p>
            </div>

            <div style={{ marginBottom: isMobile ? "1rem" : "1rem" }}>
              <p style={{
                fontFamily: "monospace",
                fontSize: isMobile ? "0.625rem" : "0.75rem",
                lineHeight: "1.5",
                color: "rgba(255, 255, 255, 0.8)",
                marginBottom: isMobile ? "1rem" : "1rem",
                textAlign: "center"
              }}>
                You're about to embark on a curated journey through the internet.
              </p>

              <div style={{
                background: "rgba(255, 157, 35, 0.05)",
                border: "1px solid rgba(255, 157, 35, 0.1)",
                borderRadius: "8px",
                padding: isMobile ? "0.75rem" : "1rem",
                marginBottom: isMobile ? "1rem" : "1rem"
              }}>
                <p style={{
                  fontFamily: "monospace",
                  fontSize: "0.625rem",
                  color: "rgba(255, 255, 255, 0.5)",
                  marginBottom: "0.5rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase"
                }}>
                  What to expect
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "0.5rem" : "0.5rem" }}>
                  <div className="flex items-start" style={{ gap: "0.5rem" }}>
                    <span style={{ color: "var(--accent)", fontSize: isMobile ? "0.75rem" : "0.875rem" }}>→</span>
                    <p style={{
                      fontFamily: "monospace",
                      fontSize: isMobile ? "0.75rem" : "0.875rem",
                      color: "rgba(255, 255, 255, 0.7)",
                      lineHeight: "1.4"
                    }}>
                      You'll be transported to an external website
                    </p>
                  </div>
                  <div className="flex items-start" style={{ gap: "0.5rem" }}>
                    <span style={{ color: "var(--accent)", fontSize: isMobile ? "0.75rem" : "0.875rem" }}>→</span>
                    <p style={{
                      fontFamily: "monospace",
                      fontSize: isMobile ? "0.75rem" : "0.875rem",
                      color: "rgba(255, 255, 255, 0.7)",
                      lineHeight: "1.4"
                    }}>
                      Each destination is handpicked and unique
                    </p>
                  </div>
                  <div className="flex items-start" style={{ gap: "0.5rem" }}>
                    <span style={{ color: "var(--accent)", fontSize: isMobile ? "0.75rem" : "0.875rem" }}>→</span>
                    <p style={{
                      fontFamily: "monospace",
                      fontSize: isMobile ? "0.75rem" : "0.875rem",
                      color: "rgba(255, 255, 255, 0.7)",
                      lineHeight: "1.4"
                    }}>
                      You may discover something extraordinary
                    </p>
                  </div>
                </div>
              </div>

              <label
                className={`flex items-center justify-center gap-6 cursor-pointer ${isMobile ? 'py-2' : 'py-3'}`}
                style={{
                  minHeight: '44px',
                  padding: isMobile ? '0.5rem' : '0.5rem'
                }}
              >
                <input
                  type="checkbox"
                  checked={acceptedRisk}
                  onChange={(e) => setAcceptedRisk(e.target.checked)}
                  className="cursor-pointer"
                  style={{
                    accentColor: "var(--accent)",
                    width: isMobile ? "32px" : "24px",
                    height: isMobile ? "32px" : "24px",
                    minWidth: isMobile ? "32px" : "24px",
                    minHeight: isMobile ? "32px" : "24px"
                  }}
                />
                <span style={{
                  fontFamily: "monospace",
                  fontSize: "0.75rem",
                  color: "rgba(255, 255, 255, 0.8)"
                }}>
                  I'm ready to explore
                </span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
              <button
                onClick={() => {
                  triggerHaptic(10);
                  setShowExitWarning(false);
                  setAcceptedRisk(false);
                }}
                aria-label="Return to home page"
                style={{
                  flex: '1',
                  fontFamily: "monospace",
                  fontSize: "clamp(0.7rem, 1.8vw, 0.75rem)",
                  letterSpacing: "0.05em",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "rgba(255, 255, 255, 0.8)",
                  borderRadius: "6px",
                  padding: isMobile ? "0.625rem 0.875rem" : "0.75rem 1rem",
                  minHeight: "44px",
                  background: "transparent",
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
              >
                ← RETURN
              </button>
              <button
                onClick={handleWarningAccept}
                disabled={!acceptedRisk}
                aria-label="Enter wormhole"
                aria-disabled={!acceptedRisk}
                style={{
                  flex: '1',
                  fontFamily: "monospace",
                  fontSize: "clamp(0.7rem, 1.8vw, 0.75rem)",
                  letterSpacing: "0.05em",
                  background: acceptedRisk
                    ? "linear-gradient(to right, var(--accent), var(--accent-hover))"
                    : "rgba(255, 255, 255, 0.1)",
                  color: acceptedRisk ? "#0b0b0b" : "rgba(255, 255, 255, 0.3)",
                  cursor: acceptedRisk ? "pointer" : "not-allowed",
                  boxShadow: acceptedRisk ? "0 0 30px rgba(255, 157, 35, 0.3)" : "none",
                  borderRadius: "6px",
                  padding: isMobile ? "0.625rem 0.875rem" : "0.75rem 1rem",
                  minHeight: "44px",
                  fontWeight: "600",
                  transition: 'all 0.2s',
                  border: 'none'
                }}
              >
                ENTER →
              </button>
            </div>

            <p className="text-center" style={{
              fontFamily: "monospace",
              fontSize: "0.625rem",
              marginTop: isMobile ? "0.5rem" : "1rem",
              color: "rgba(255, 255, 255, 0.4)"
            }}>
              ESC to cancel
            </p>
          </div>
        </div>
      )}

      {/* Controls */}
      {!isWarping && !isLoading && !showExitWarning && hasSeenWarning && viewportReady && (
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center z-10 ${isMobile ? 'px-4' : 'px-8'}`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0', // Explicit - using spacer divs instead
            minHeight: '100vh', // Fallback for older browsers
            minHeight: '-webkit-fill-available', // iOS Safari fallback
            minHeight: '100dvh', // Dynamic viewport height for modern mobile (with notches)
            paddingTop: 'max(1.75rem, env(safe-area-inset-top))',
            paddingBottom: 'max(2rem, env(safe-area-inset-bottom))',
            paddingLeft: 'max(1rem, env(safe-area-inset-left))',
            paddingRight: 'max(1rem, env(safe-area-inset-right))',
            pointerEvents: 'auto' // CRITICAL: Enable pointer events for buttons
          }}
        >
          {/* Category Selector - Two rows with even distribution */}
          <div style={{ width: '100%', maxWidth: isMobile ? '95%' : '600px', display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '20px' }}>
            {/* Top row: 4 buttons */}
            <div style={{ display: 'flex', gap: isMobile ? '12px' : '16px', width: '100%' }}>
              {(['all', 'interactive', 'games', 'weirdFun'] as const).map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      triggerHaptic(10);
                      setSelectedCategory(cat);
                      playSound('beep');
                    }}
                    onFocus={(e) => {
                      e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                    }}
                    aria-label={`Filter by ${cat === 'weirdFun' ? 'weird' : cat} category`}
                    aria-pressed={isSelected}
                    className="transition-all hover:scale-105 active:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                    style={{
                      fontFamily: "monospace",
                      fontSize: isMobile ? "0.625rem" : "clamp(0.75rem, 1.8vw, 0.8rem)",
                      letterSpacing: "0.05em",
                      textTransform: "capitalize",
                      background: isSelected ? "var(--accent)" : "rgba(255, 255, 255, 0.1)",
                      color: isSelected ? "#0b0b0b" : "rgba(255, 255, 255, 0.9)",
                      border: `1px solid ${isSelected ? "var(--accent)" : "rgba(255, 255, 255, 0.2)"}`,
                      borderRadius: isMobile ? "6px" : "8px",
                      padding: isMobile ? "0.625rem 0.75rem" : "0.625rem 0.875rem",
                      minHeight: "44px",
                      flex: "1",
                      boxShadow: isSelected ? "0 0 20px rgba(255, 157, 35, 0.3)" : "none",
                      filter: isSelected ? "drop-shadow(0 0 10px rgba(255, 157, 35, 0.5))" : "none",
                      cursor: "pointer",
                      touchAction: "manipulation"
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.boxShadow = "0 0 15px rgba(255, 157, 35, 0.2)";
                        e.currentTarget.style.filter = "drop-shadow(0 0 5px rgba(255, 157, 35, 0.3))";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.filter = "none";
                      }
                    }}
                  >
                    {cat === 'weirdFun' ? 'Weird' : cat}
                  </button>
                );
              })}
            </div>
            {/* Bottom row: 3 buttons */}
            <div style={{ display: 'flex', gap: isMobile ? '12px' : '16px', width: '100%' }}>
              {(['music', 'educational', 'retro'] as const).map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      triggerHaptic(10);
                      setSelectedCategory(cat);
                      playSound('beep');
                    }}
                    onFocus={(e) => {
                      e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                    }}
                    aria-label={`Filter by ${cat} category`}
                    aria-pressed={isSelected}
                    className="transition-all hover:scale-105 active:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                    style={{
                      fontFamily: "monospace",
                      fontSize: isMobile ? "0.625rem" : "clamp(0.75rem, 1.8vw, 0.8rem)",
                      letterSpacing: "0.05em",
                      textTransform: "capitalize",
                      background: isSelected ? "var(--accent)" : "rgba(255, 255, 255, 0.1)",
                      color: isSelected ? "#0b0b0b" : "rgba(255, 255, 255, 0.9)",
                      border: `1px solid ${isSelected ? "var(--accent)" : "rgba(255, 255, 255, 0.2)"}`,
                      borderRadius: isMobile ? "6px" : "8px",
                      padding: isMobile ? "0.625rem 0.75rem" : "0.625rem 0.875rem",
                      minHeight: "44px",
                      flex: "1",
                      boxShadow: isSelected ? "0 0 20px rgba(255, 157, 35, 0.3)" : "none",
                      filter: isSelected ? "drop-shadow(0 0 10px rgba(255, 157, 35, 0.5))" : "none",
                      cursor: "pointer",
                      touchAction: "manipulation"
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.boxShadow = "0 0 15px rgba(255, 157, 35, 0.2)";
                        e.currentTarget.style.filter = "drop-shadow(0 0 5px rgba(255, 157, 35, 0.3))";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.filter = "none";
                      }
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fixed spacer - matches category row gap */}
          <div style={{ height: isMobile ? '16px' : '20px' }} />

          {/* Warp Button Section */}
          <div className={`flex flex-col items-center`} style={{ width: '100%', maxWidth: isMobile ? '95%' : '600px', gap: isMobile ? '32px' : '40px' }}>
            <button
              onClick={handleWarpButtonClick}
              aria-label={`Initiate warp to ${selectedCategory === 'all' ? 'random' : selectedCategory} destination`}
              className="hover:scale-105 active:scale-100 transition-all group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              style={{
                fontFamily: "monospace",
                fontSize: isMobile ? "1rem" : "clamp(1rem, 2.5vw, 1.125rem)",
                letterSpacing: "0.1em",
                fontWeight: "700",
                background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)",
                color: "#0b0b0b",
                boxShadow: "0 0 40px rgba(255, 157, 35, 0.5)",
                borderRadius: "12px",
                padding: "1rem 1.5rem",
                minHeight: "56px",
                width: "100%",
                border: "2px solid var(--accent)",
                animation: "button-pulse 2s ease-in-out infinite",
                cursor: "pointer",
                touchAction: "manipulation"
              }}
            >
              INITIATE WARP
            </button>

            <p style={{
              fontFamily: "monospace",
              fontSize: isMobile ? "0.875rem" : "0.75rem",
              color: "rgba(255, 255, 255, 0.5)",
              letterSpacing: "0.05em",
              textAlign: "center",
              width: "100%",
              margin: 0,
              marginTop: isMobile ? "24px" : "32px"
            }}>
              {isMobile ? "TAP TO BOOST" : "PRESS SPACE TO BOOST"}
            </p>
          </div>

          {/* Fixed spacer - 32px gap between warp button and sound toggle */}
          <div style={{ height: isMobile ? '32px' : '40px' }} />

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label={soundEnabled ? "Turn sound off" : "Turn sound on"}
            aria-pressed={soundEnabled}
            className="transition-all hover:scale-105 active:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            style={{
              fontFamily: "monospace",
              fontSize: "clamp(0.75rem, 1.8vw, 0.8rem)",
              color: "rgba(255, 255, 255, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "6px",
              padding: "0.75rem 1rem",
              minHeight: "44px",
              minWidth: isMobile ? "120px" : "140px",
              background: "rgba(255, 255, 255, 0.05)",
              cursor: "pointer",
              touchAction: "manipulation"
            }}
          >
            <span aria-hidden="true">{soundEnabled ? "🔊" : "🔇"}</span> Sound {soundEnabled ? "ON" : "OFF"}
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes nebula-rotate-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes countdown-bounce {
          0% { transform: scale(2); opacity: 0; }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes countdown-zero {
          0% { transform: scale(3); opacity: 0; }
          50% { transform: scale(1.3) rotate(5deg); }
          70% { transform: scale(0.9) rotate(-5deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes flip-reveal {
          0% { transform: rotateY(90deg); opacity: 0; }
          100% { transform: rotateY(0deg); opacity: 1; }
        }
        /* Graduated screen shake intensity levels */
        @keyframes screen-shake-light {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-2px, 2px); }
          50% { transform: translate(2px, -2px); }
          75% { transform: translate(-2px, -2px); }
        }
        @keyframes screen-shake-medium {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-4px, 4px); }
          50% { transform: translate(4px, -4px); }
          75% { transform: translate(-4px, -4px); }
        }
        @keyframes screen-shake-strong {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-6px, 5px); }
          40% { transform: translate(5px, -6px); }
          60% { transform: translate(-5px, -5px); }
          80% { transform: translate(6px, 6px); }
        }
        @keyframes screen-shake-intense {
          0% { transform: translate(0, 0); }
          10% { transform: translate(-8px, 6px); }
          20% { transform: translate(6px, -8px); }
          30% { transform: translate(-6px, -6px); }
          40% { transform: translate(8px, 8px); }
          50% { transform: translate(-8px, -6px); }
          60% { transform: translate(6px, 8px); }
          70% { transform: translate(-6px, 6px); }
          80% { transform: translate(8px, -8px); }
          90% { transform: translate(-8px, 8px); }
          100% { transform: translate(0, 0); }
        }
        /* Mobile screen shake - reduced intensity for better UX */
        @keyframes screen-shake-light-mobile {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-1px, 1px); }
          50% { transform: translate(1px, -1px); }
          75% { transform: translate(-1px, -1px); }
        }
        @keyframes screen-shake-medium-mobile {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-2px, 2px); }
          50% { transform: translate(2px, -2px); }
          75% { transform: translate(-2px, -2px); }
        }
        @keyframes screen-shake-strong-mobile {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-3px, 3px); }
          40% { transform: translate(3px, -3px); }
          60% { transform: translate(-3px, -3px); }
          80% { transform: translate(3px, 3px); }
        }
        @keyframes screen-shake-intense-mobile {
          0% { transform: translate(0, 0); }
          10% { transform: translate(-4px, 3px); }
          20% { transform: translate(3px, -4px); }
          30% { transform: translate(-3px, -3px); }
          40% { transform: translate(4px, 4px); }
          50% { transform: translate(-4px, -3px); }
          60% { transform: translate(3px, 4px); }
          70% { transform: translate(-3px, 3px); }
          80% { transform: translate(4px, -4px); }
          90% { transform: translate(-4px, 4px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes white-flash {
          0% { opacity: 0; }
          20% { opacity: 1; }
          60% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes white-flash-mobile {
          0% { opacity: 0; }
          25% { opacity: 1; }
          70% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes hectic-speed-entrance {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          100% {
            transform: scale(1.1);
            opacity: 1;
          }
        }
        @keyframes speed-line-pulse {
          0% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.2); }
        }
        @keyframes lens-flare-horizontal {
          0%, 100% { opacity: 0.3; transform: scaleX(0.8); }
          50% { opacity: 1; transform: scaleX(1.2); }
        }
        @keyframes button-pulse {
          0%, 100% {
            box-shadow: 0 0 40px rgba(255, 157, 35, 0.5);
          }
          50% {
            box-shadow: 0 0 60px rgba(255, 157, 35, 0.7);
          }
        }
        @keyframes emoji-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes rainbow {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        @keyframes hyperspace-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
