"use client"

import * as React from "react"
import { FeatureFlagsDemo } from "../../components/examples/feature-flags-demo"
import { IntegrationExamples, CodeExamples } from "../../components/examples/integration-examples"
import { Button } from "../../components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

/**
 * Demo page showcasing the feature flag and lazy loading system
 */
export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Main
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Animation System Demo</h1>
            <div className="w-24" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Feature Flags Demo */}
          <section>
            <FeatureFlagsDemo />
          </section>

          {/* Integration Examples */}
          <section>
            <IntegrationExamples />
          </section>

          {/* Code Examples */}
          <section>
            <CodeExamples />
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p className="mb-2">Animation Performance System Demo</p>
            <p className="text-sm">
              This demo shows how animations adapt to device capabilities and user preferences.
              Open DevTools → Console and use Ctrl+Shift+P for performance overlay.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}