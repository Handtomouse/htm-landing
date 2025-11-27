'use client'

import { ReactNode } from 'react'

interface BBOSCardProps {
  children: ReactNode
  className?: string
  glow?: boolean
}

export default function BBOSCard({ children, className = '', glow = false }: BBOSCardProps) {
  return (
    <div
      className={`
        border-2
        border-accent/50
        bg-gradient-to-br
        from-accent/10
        to-accent/5
        backdrop-blur-sm
        transition-all
        duration-[var(--duration-slow)]
        ${glow ? 'hover:shadow-[0_0_40px_rgba(255,157,35,0.5)]' : ''}
        ${className}
      `.trim()}
    >
      {children}
    </div>
  )
}
