'use client'

import { CardDemo } from '@/components/examples/CardDemo'
import { css } from '@/styled-system/css'

export default function TestCardPage() {
  return (
    <div className={css({
      minHeight: '100vh',
      backgroundColor: 'background'
    })}>
      <CardDemo />
    </div>
  )
}