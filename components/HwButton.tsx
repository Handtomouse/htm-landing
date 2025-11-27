'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'

interface HwButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary'
}

export default function HwButton({
  children,
  variant = 'primary',
  className = '',
  ...props
}: HwButtonProps) {
  const baseStyles = `
    relative
    px-6 py-3
    font-heading text-base uppercase
    border-2
    rounded-none
    transition-all
    duration-[var(--duration-instant)]
    active:scale-95
    disabled:opacity-50
    disabled:cursor-not-allowed
  `

  const variantStyles = variant === 'primary'
    ? `
      bg-gradient-to-b from-[#141414] to-[#000000]
      border-accent
      text-accent
      hover:border-accent-hover
      hover:text-accent-hover
      hover:shadow-[0_0_12px_rgba(255,157,35,0.5)]
    `
    : `
      bg-transparent
      border-grid
      text-ink
      hover:border-accent/50
      hover:text-accent
    `

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  )
}
