"use client"

import * as React from "react"
import { css } from "@/styled-system/css"
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
    <div className={css({
      minHeight: '100vh',
      backgroundColor: 'background'
    })}>
      {/* Navigation */}
      <div className={css({
        borderBottom: '1px solid',
        borderColor: 'border'
      })}>
        <div className={css({
          maxWidth: 'container',
          marginX: 'auto',
          paddingX: '4',
          paddingY: '4'
        })}>
          <div className={css({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          })}>
            <Link href="/">
              <Button variant="ghost" size="sm" className={css({
                gap: '2'
              })}>
                <ArrowLeft className={css({
                  height: '4',
                  width: '4'
                })} />
                Back to Main
              </Button>
            </Link>
            <h1 className={css({
              fontSize: 'xl',
              fontWeight: 'bold'
            })}>Animation System Demo</h1>
            <div className={css({ width: '24' })} /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={css({
        maxWidth: 'container',
        marginX: 'auto',
        paddingX: '4',
        paddingY: '8'
      })}>
        <div className={css({
          maxWidth: '7xl',
          marginX: 'auto',
          '& > * + *': {
            marginTop: '12'
          }
        })}>
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
      <footer className={css({
        borderTop: '1px solid',
        borderColor: 'border',
        marginTop: '16'
      })}>
        <div className={css({
          maxWidth: 'container',
          marginX: 'auto',
          paddingX: '4',
          paddingY: '8'
        })}>
          <div className={css({
            textAlign: 'center',
            color: 'muted.foreground'
          })}>
            <p className={css({
              marginBottom: '2'
            })}>Animation Performance System Demo</p>
            <p className={css({
              fontSize: 'sm'
            })}>
              This demo shows how animations adapt to device capabilities and user preferences.
              Open DevTools → Console and use Ctrl+Shift+P for performance overlay.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}