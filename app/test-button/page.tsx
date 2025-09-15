"use client"

import { Button } from "@/components/ui/button"
import { css } from "@/styled-system/css"

export default function TestButtonPage() {
  return (
    <div className={css({
      padding: '8',
      '& > * + *': {
        marginTop: '8'
      }
    })}>
      <h1 className={css({
        fontSize: '3xl',
        fontWeight: 'bold'
      })}>Button Recipe Test</h1>
      
      <section className={css({
        '& > * + *': {
          marginTop: '4'
        }
      })}>
        <h2 className={css({
          fontSize: 'xl',
          fontWeight: 'semibold'
        })}>Variants</h2>
        <div className={css({
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4'
        })}>
          <Button variant="default">Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      <section className={css({
        '& > * + *': {
          marginTop: '4'
        }
      })}>
        <h2 className={css({
          fontSize: 'xl',
          fontWeight: 'semibold'
        })}>Sizes</h2>
        <div className={css({
          display: 'flex',
          alignItems: 'center',
          gap: '4'
        })}>
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">🔥</Button>
        </div>
      </section>

      <section className={css({
        '& > * + *': {
          marginTop: '4'
        }
      })}>
        <h2 className={css({
          fontSize: 'xl',
          fontWeight: 'semibold'
        })}>Combined Variants</h2>
        <div className={css({
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4'
        })}>
          <Button variant="outline" size="sm">Small Outline</Button>
          <Button variant="destructive" size="lg">Large Destructive</Button>
          <Button variant="ghost" size="icon">👻</Button>
          <Button variant="secondary" size="sm">Small Secondary</Button>
        </div>
      </section>

      <section className={css({
        '& > * + *': {
          marginTop: '4'
        }
      })}>
        <h2 className={css({
          fontSize: 'xl',
          fontWeight: 'semibold'
        })}>States</h2>
        <div className={css({
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4'
        })}>
          <Button disabled>Disabled</Button>
          <Button variant="outline" disabled>Disabled Outline</Button>
          <Button variant="destructive" disabled>Disabled Destructive</Button>
        </div>
      </section>

      <section className={css({
        '& > * + *': {
          marginTop: '4'
        }
      })}>
        <h2 className={css({
          fontSize: 'xl',
          fontWeight: 'semibold'
        })}>With Icons</h2>
        <div className={css({
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4'
        })}>
          <Button>
            <svg className={css({
              width: '4',
              height: '4',
              marginRight: '2'
            })} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Item
          </Button>
          <Button variant="outline">
            <svg className={css({
              width: '4',
              height: '4',
              marginRight: '2'
            })} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </Button>
        </div>
      </section>
    </div>
  )
}