"use client"

import { FormDemo } from "@/components/examples/FormDemo"
import { css } from "@/styled-system/css"

export default function TestFormPage() {
  return (
    <div className={css({
      minHeight: '100vh',
      backgroundColor: 'background'
    })}>
      <div className={css({
        maxWidth: '6xl',
        marginX: 'auto'
      })}>
        <FormDemo />
      </div>
    </div>
  )
}