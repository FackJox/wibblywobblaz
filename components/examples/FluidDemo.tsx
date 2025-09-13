/**
 * FluidDemo Component - Demonstration of Utopia.fyi fluid system
 * 
 * This component showcases the fluid typography and spacing scales
 * working across different viewport sizes without media queries.
 */

import { css } from '@styled-system/css';
import { FluidPresets } from '@/utils/fluid-helpers';

export default function FluidDemo() {
  return (
    <div className={css({
      padding: 'fluid-2xl',
      maxWidth: '1200px',
      margin: '0 auto',
      background: 'card',
      borderRadius: 'lg',
      boxShadow: 'lg'
    })}>
      
      {/* Hero Section with Fluid Typography */}
      <header className={css({
        marginBottom: 'fluid-3xl',
        textAlign: 'center'
      })}>
        <h1 className={css({
          fontSize: 'fluid-6xl',
          fontWeight: 'bold',
          marginBottom: 'fluid-md',
          color: 'foreground'
        })}>
          Fluid Design System
        </h1>
        <p className={css({
          fontSize: 'fluid-lg',
          color: 'muted.foreground',
          marginBottom: 'fluid-lg'
        })}>
          Responsive typography and spacing that scales smoothly across all devices
        </p>
      </header>

      {/* Typography Scale Demo */}
      <section className={css({
        marginBottom: 'fluid-4xl'
      })}>
        <h2 className={css({
          fontSize: 'fluid-3xl',
          fontWeight: 'semibold',
          marginBottom: 'fluid-lg',
          color: 'foreground'
        })}>
          Typography Scale
        </h2>
        
        <div className={css({
          display: 'grid',
          gap: 'fluid-sm',
          marginBottom: 'fluid-xl'
        })}>
          <div className={css({ fontSize: 'fluid-xs', color: 'muted.foreground' })}>
            fluid-xs: The quick brown fox jumps over the lazy dog
          </div>
          <div className={css({ fontSize: 'fluid-sm', color: 'muted.foreground' })}>
            fluid-sm: The quick brown fox jumps over the lazy dog
          </div>
          <div className={css({ fontSize: 'fluid-base', color: 'foreground' })}>
            fluid-base: The quick brown fox jumps over the lazy dog
          </div>
          <div className={css({ fontSize: 'fluid-lg', color: 'foreground' })}>
            fluid-lg: The quick brown fox jumps over the lazy dog
          </div>
          <div className={css({ fontSize: 'fluid-xl', color: 'foreground' })}>
            fluid-xl: The quick brown fox jumps over the lazy dog
          </div>
          <div className={css({ fontSize: 'fluid-2xl', color: 'foreground' })}>
            fluid-2xl: The quick brown fox jumps over the lazy dog
          </div>
          <div className={css({ fontSize: 'fluid-3xl', color: 'foreground' })}>
            fluid-3xl: The quick brown fox jumps over the lazy dog
          </div>
        </div>
      </section>

      {/* Spacing Scale Demo */}
      <section className={css({
        marginBottom: 'fluid-4xl'
      })}>
        <h2 className={css({
          fontSize: 'fluid-3xl',
          fontWeight: 'semibold',
          marginBottom: 'fluid-lg',
          color: 'foreground'
        })}>
          Spacing Scale
        </h2>
        
        <div className={css({
          display: 'grid',
          gap: 'fluid-xs',
          marginBottom: 'fluid-xl'
        })}>
          <div className={css({ 
            padding: 'fluid-xs',
            background: 'secondary',
            borderRadius: 'sm'
          })}>
            <span className={css({ fontSize: 'fluid-sm' })}>
              fluid-xs padding: {FluidPresets.spacing.tight}
            </span>
          </div>
          <div className={css({ 
            padding: 'fluid-sm',
            background: 'secondary',
            borderRadius: 'sm'
          })}>
            <span className={css({ fontSize: 'fluid-sm' })}>
              fluid-sm padding
            </span>
          </div>
          <div className={css({ 
            padding: 'fluid-md',
            background: 'secondary',
            borderRadius: 'sm'
          })}>
            <span className={css({ fontSize: 'fluid-sm' })}>
              fluid-md padding: {FluidPresets.spacing.element}
            </span>
          </div>
          <div className={css({ 
            padding: 'fluid-lg',
            background: 'secondary',
            borderRadius: 'sm'
          })}>
            <span className={css({ fontSize: 'fluid-sm' })}>
              fluid-lg padding
            </span>
          </div>
          <div className={css({ 
            padding: 'fluid-xl',
            background: 'secondary',
            borderRadius: 'sm'
          })}>
            <span className={css({ fontSize: 'fluid-sm' })}>
              fluid-xl padding: {FluidPresets.spacing.component}
            </span>
          </div>
        </div>
      </section>

      {/* Card Grid with Fluid Gaps */}
      <section className={css({
        marginBottom: 'fluid-3xl'
      })}>
        <h2 className={css({
          fontSize: 'fluid-3xl',
          fontWeight: 'semibold',
          marginBottom: 'fluid-lg',
          color: 'foreground'
        })}>
          Responsive Grid
        </h2>
        
        <div className={css({
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'fluid-lg-xl', // Responsive pair: grows from lg to xl
        })}>
          {[1, 2, 3].map((num) => (
            <div key={num} className={css({
              padding: 'fluid-md-lg', // Responsive pair padding
              background: 'muted',
              borderRadius: 'md',
              border: '1px solid {colors.border}'
            })}>
              <h3 className={css({
                fontSize: 'fluid-xl',
                fontWeight: 'semibold',
                marginBottom: 'fluid-sm',
                color: 'foreground'
              })}>
                Card {num}
              </h3>
              <p className={css({
                fontSize: 'fluid-base',
                color: 'muted.foreground',
                lineHeight: 'relaxed'
              })}>
                This card demonstrates fluid spacing and typography. 
                The gaps and padding scale smoothly as you resize your browser.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Info */}
      <footer className={css({
        padding: 'fluid-lg',
        background: 'accent',
        borderRadius: 'md',
        textAlign: 'center'
      })}>
        <p className={css({
          fontSize: 'fluid-sm',
          color: 'accent.foreground',
          marginBottom: 'fluid-xs'
        })}>
          <strong>Viewport Range:</strong> 320px → 1920px
        </p>
        <p className={css({
          fontSize: 'fluid-xs',
          color: 'accent.foreground',
          opacity: 0.8
        })}>
          Resize your browser to see the fluid scaling in action. No media queries required!
        </p>
      </footer>
    </div>
  );
}