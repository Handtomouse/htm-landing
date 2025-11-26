'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function HandGameAnimation({ version = 'v1' }: { version?: 'v1' | 'v2' }) {
  const [showV2Effects, setShowV2Effects] = useState(version === 'v2')

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
      <style jsx>{`
        /* ========================================
           HAND GAME ANIMATION - VERSION 1
           Frame-accurate recreation of GIF
           Total loop: 1.8s
           ======================================== */

        @keyframes hand-left-moves {
          0% { top: 40%; }
          /* 100ms: Right fires, left dodges down */
          5.56% { top: 40%; }
          /* 250ms: Left settles low */
          13.89% { top: 70%; }
          /* 400ms: Left fires (stays low) */
          22.22% { top: 70%; }
          /* 700ms: Right fires, left jitter-dodge up */
          38.89% { top: 70%; }
          /* 850ms: Left settles mid */
          47.22% { top: 50%; }
          /* 1000ms: Left fires (stays mid) */
          55.56% { top: 50%; }
          /* 1300ms: Reset sequence begins */
          72.22% { top: 50%; }
          /* 1500ms: Full reset to start */
          83.33% { top: 40%; }
          /* 1800ms: Loop */
          100% { top: 40%; }
        }

        @keyframes hand-right-moves {
          0% { top: 60%; }
          /* 100ms: Right fires (stays) */
          5.56% { top: 60%; }
          /* 400ms: Left fires, right dodges up */
          22.22% { top: 60%; }
          /* 550ms: Right settles high */
          30.56% { top: 30%; }
          /* 700ms: Right fires (stays high) */
          38.89% { top: 30%; }
          /* 1000ms: Left fires, right jitter-dodge down */
          55.56% { top: 30%; }
          /* 1150ms: Right settles slightly lower */
          63.89% { top: 55%; }
          /* 1300ms: Reset sequence */
          72.22% { top: 55%; }
          /* 1500ms: Full reset */
          83.33% { top: 60%; }
          /* 1800ms: Loop */
          100% { top: 60%; }
        }

        @keyframes projectile-right-1 {
          /* Fires at 100ms, travels 300ms */
          0%, 5.56% { left: calc(100% - 120px); opacity: 0; }
          5.57% { left: calc(100% - 120px); opacity: 1; }
          22.22% { left: 120px; opacity: 1; }
          22.23% { opacity: 0; }
          100% { opacity: 0; }
        }

        @keyframes projectile-left-1 {
          /* Fires at 400ms, travels 300ms */
          0%, 22.22% { left: 120px; opacity: 0; }
          22.23% { left: 120px; opacity: 1; }
          38.89% { left: calc(100% - 120px); opacity: 1; }
          38.90% { opacity: 0; }
          100% { opacity: 0; }
        }

        @keyframes projectile-right-2 {
          /* Fires at 700ms, travels 300ms */
          0%, 38.89% { left: calc(100% - 120px); opacity: 0; }
          38.90% { left: calc(100% - 120px); opacity: 1; }
          55.56% { left: 120px; opacity: 1; }
          55.57% { opacity: 0; }
          100% { opacity: 0; }
        }

        @keyframes projectile-left-2 {
          /* Fires at 1000ms, travels 300ms */
          0%, 55.56% { left: 120px; opacity: 0; }
          55.57% { left: 120px; opacity: 1; }
          72.22% { left: calc(100% - 120px); opacity: 1; }
          72.23% { opacity: 0; }
          100% { opacity: 0; }
        }

        @keyframes jitter {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(1px); }
        }

        /* ========================================
           VERSION 2 ENHANCEMENTS
           Collision effects, recoil, glow
           ======================================== */

        @keyframes collision-flash {
          0% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0; transform: scale(0.8); }
        }

        @keyframes hand-recoil {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-2px); }
        }

        @keyframes projectile-glow {
          0%, 100% { filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.3)); }
          50% { filter: drop-shadow(0 0 4px rgba(255, 157, 35, 0.8)); }
        }

        /* Hand sprites */
        .hand-left {
          position: absolute;
          left: 80px;
          width: 64px;
          height: 64px;
          animation: hand-left-moves 1.8s ease-in-out infinite;
        }

        .hand-right {
          position: absolute;
          right: 80px;
          width: 64px;
          height: 64px;
          animation: hand-right-moves 1.8s ease-in-out infinite;
        }

        /* Projectiles */
        .projectile {
          position: absolute;
          top: 50%;
          width: 2px;
          height: 2px;
          background: #fff;
          box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
        }

        .projectile-r1 {
          animation: projectile-right-1 1.8s linear infinite;
        }

        .projectile-l1 {
          animation: projectile-left-1 1.8s linear infinite;
        }

        .projectile-r2 {
          animation: projectile-right-2 1.8s linear infinite;
        }

        .projectile-l2 {
          animation: projectile-left-2 1.8s linear infinite;
        }

        ${showV2Effects ? `
          .hand-left {
            animation: hand-left-moves 1.8s ease-in-out infinite,
                       jitter 0.15s ease-in-out infinite;
          }

          .hand-right {
            animation: hand-right-moves 1.8s ease-in-out infinite,
                       jitter 0.15s ease-in-out infinite;
          }

          .projectile {
            animation-name: projectile-right-1, projectile-glow;
            animation-duration: 1.8s, 0.3s;
            animation-iteration-count: infinite, infinite;
          }

          .collision-flash {
            position: absolute;
            width: 32px;
            height: 32px;
            background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
          }

          .flash-left {
            left: 100px;
            top: calc(70% - 16px);
            animation: collision-flash 0.08s ease-out;
            animation-delay: 0.4s;
          }

          .flash-right {
            right: 100px;
            top: calc(30% - 16px);
            animation: collision-flash 0.08s ease-out;
            animation-delay: 1.2s;
          }
        ` : ''}

        /* CRT scanline overlay (v2 only) */
        .crt-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.15),
            rgba(0, 0, 0, 0.15) 1px,
            transparent 1px,
            transparent 2px
          );
          pointer-events: none;
          opacity: ${showV2Effects ? '0.3' : '0'};
        }
      `}</style>

      {/* Game container */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Left hand (pointing right) */}
        <div className="hand-left pixel-art">
          <Image
            src="/hand-sprite-left.svg"
            alt="Left hand"
            width={64}
            height={64}
            className="pixel-art"
            priority
          />
        </div>

        {/* Right hand (pointing left) */}
        <div className="hand-right pixel-art">
          <Image
            src="/hand-sprite-right.svg"
            alt="Right hand"
            width={64}
            height={64}
            className="pixel-art"
            priority
          />
        </div>

        {/* Projectiles */}
        <div className="projectile projectile-r1" />
        <div className="projectile projectile-l1" />
        <div className="projectile projectile-r2" />
        <div className="projectile projectile-l2" />

        {/* V2 effects */}
        {showV2Effects && (
          <>
            <div className="collision-flash flash-left" />
            <div className="collision-flash flash-right" />
          </>
        )}

        {/* CRT overlay */}
        <div className="crt-overlay" />
      </div>

      {/* Version toggle (for testing) */}
      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={() => setShowV2Effects(!showV2Effects)}
          className="absolute bottom-4 right-4 px-4 py-2 bg-bb-orange text-black text-sm font-vt323"
          style={{ zIndex: 100 }}
        >
          {showV2Effects ? 'V2 (Enhanced)' : 'V1 (Accurate)'}
        </button>
      )}
    </div>
  )
}
