"use client"

import { useState } from "react"
import { RippleButton } from "@/components/ui/ripple-button"

export default function RippleTestPage() {
  const [clickCount, setClickCount] = useState(0)
  const variants = ["default", "destructive", "outline", "secondary", "ghost", "link"] as const
  const sizes = ["default", "sm", "lg", "icon"] as const

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold">Ripple Button Test</h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">All Variants</h2>
          <div className="flex flex-wrap gap-4">
            {variants.map(variant => (
              <RippleButton key={variant} variant={variant}>
                {variant.charAt(0).toUpperCase() + variant.slice(1)}
              </RippleButton>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">All Sizes</h2>
          <div className="flex flex-wrap gap-4 items-center">
            {sizes.map(size => (
              <RippleButton key={size} size={size}>
                {size === "icon" ? "🎨" : size.toUpperCase()}
              </RippleButton>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Disabled State</h2>
          <div className="flex flex-wrap gap-4">
            <RippleButton disabled>Disabled Default</RippleButton>
            <RippleButton variant="secondary" disabled>Disabled Secondary</RippleButton>
            <RippleButton variant="outline" disabled>Disabled Outline</RippleButton>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">With Border Radius</h2>
          <div className="flex flex-wrap gap-4">
            <RippleButton className="rounded-full">Rounded Full</RippleButton>
            <RippleButton className="rounded-none">No Rounding</RippleButton>
            <RippleButton className="rounded-3xl">Extra Rounded</RippleButton>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Click Test (Try left/middle/right click)</h2>
          <RippleButton 
            variant="outline"
            className="text-lg px-8 py-4"
            onClick={() => setClickCount(c => c + 1)}
            onAuxClick={(e) => {
              e.preventDefault()
              console.log("Middle/Right click detected!")
            }}
          >
            Click Me! (Count: {clickCount})
          </RippleButton>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Ripple Disabled</h2>
          <RippleButton disableRipple variant="default">
            No Ripple Effect
          </RippleButton>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Debug: Mouse Events</h2>
          <RippleButton 
            variant="secondary"
            className="text-lg px-8 py-4"
            onMouseDown={() => console.log("onMouseDown fired")}
            onMouseUp={() => console.log("onMouseUp fired")}
            onClick={() => console.log("onClick fired")}
          >
            Check Console for Events
          </RippleButton>
        </div>
      </div>
    </div>
  )
}