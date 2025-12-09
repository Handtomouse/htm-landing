'use client'

import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function BattleSystem({ children }: Props) {
  return (
    <div
      className="battle-container"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%'
      }}
    >
      {children}
    </div>
  )
}
