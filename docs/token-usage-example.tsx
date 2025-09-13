/**
 * Example Usage of Fluid Semantic Tokens in PandaCSS
 * 
 * This demonstrates how Stream C can use the tokens integrated by Stream B
 */

import { css } from '../styled-system/css'

// Example 1: Using semantic typography tokens
const BrandTitle = () => (
  <h1 className={css({
    fontSize: 'brand', // Maps to fluid-7xl - perfect for "WIBBLY WOBBLAZ"
    fontWeight: 'black',
    letterSpacing: 'tight',
    fontFamily: 'hegval',
    textAlign: 'center',
    whiteSpace: 'nowrap' // Prevent wrapping
  })}>
    WIBBLY WOBBLAZ
  </h1>
)

// Example 2: Using semantic spacing tokens
const Section = ({ children }: { children: React.ReactNode }) => (
  <section className={css({
    padding: 'section', // Maps to fluid-6xl
    marginBottom: 'container' // Maps to fluid-4xl
  })}>
    {children}
  </section>
)

// Example 3: Using responsive pairs for advanced layouts
const CardGrid = ({ children }: { children: React.ReactNode }) => (
  <div className={css({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 'cardGap', // Maps to fluid-lg-xl responsive pair
    padding: 'component' // Maps to fluid-2xl
  })}>
    {children}
  </div>
)

// Example 4: Direct fluid token usage
const HeroSection = () => (
  <section className={css({
    fontSize: 'hero', // fluid-6xl
    padding: 'heroGap', // fluid-5xl-6xl
    textAlign: 'center',
    background: 'black',
    color: 'white'
  })}>
    <h1 className={css({
      fontSize: 'display', // fluid-8xl - even larger than hero
      marginBottom: 'element' // fluid-lg
    })}>
      Welcome to the Party
    </h1>
    <p className={css({
      fontSize: 'body', // fluid-base
      marginBottom: 'tight' // fluid-xs
    })}>
      Experience fluid design that adapts perfectly to every screen
    </p>
  </section>
)

// Example 5: Typography hierarchy using semantic tokens
const ContentHierarchy = () => (
  <article className={css({
    padding: 'component',
    '& h1': { fontSize: 'heading' }, // fluid-6xl
    '& h2': { fontSize: 'title' },   // fluid-4xl  
    '& h3': { fontSize: 'subtitle' }, // fluid-2xl
    '& p': { fontSize: 'body' },      // fluid-base
    '& small': { fontSize: 'caption' }, // fluid-sm
    '& .footnote': { fontSize: 'footnote' } // fluid-xs
  })}>
    <h1>Main Heading</h1>
    <h2>Section Title</h2>
    <h3>Subsection</h3>
    <p>Body content that scales beautifully across all viewports.</p>
    <small>Caption text</small>
    <div className="footnote">Footnote information</div>
  </article>
)

// Example 6: Complete component using fluid system
const WibblyWobblazCard = () => (
  <div className={css({
    background: 'white',
    border: '4px solid black',
    padding: 'component',
    borderRadius: 'md',
    _hover: {
      background: 'black',
      color: 'white'
    },
    transition: 'all 0.3s ease'
  })}>
    <h2 className={css({
      fontSize: 'brand', // The special "WIBBLY WOBBLAZ" size
      fontWeight: 'black',
      marginBottom: 'element',
      whiteSpace: 'nowrap'
    })}>
      WIBBLY WOBBLAZ
    </h2>
    
    <p className={css({
      fontSize: 'body',
      marginBottom: 'tight',
      lineHeight: 'relaxed'
    })}>
      This card demonstrates the complete fluid system integration.
    </p>
    
    <div className={css({
      display: 'flex',
      gap: 'listGap', // fluid-sm-md
      marginTop: 'element'
    })}>
      <button className={css({
        padding: 'buttonPadding', // fluid-xs-sm
        fontSize: 'caption',
        background: 'transparent',
        border: '2px solid currentColor',
        borderRadius: 'sm',
        fontWeight: 'bold',
        cursor: 'pointer',
        _hover: {
          background: 'currentColor',
          color: 'background'
        }
      })}>
        GET TICKETS
      </button>
      
      <button className={css({
        padding: 'buttonPadding',
        fontSize: 'caption',
        background: 'transparent',
        border: '2px solid currentColor',
        borderRadius: 'sm',
        fontWeight: 'bold',
        cursor: 'pointer'
      })}>
        LEARN MORE
      </button>
    </div>
  </div>
)

/**
 * Available Semantic Tokens Summary:
 * 
 * Typography:
 * - display, heading, title, subtitle, body, caption, footnote
 * - brand, hero, section (brand-specific)
 * 
 * Spacing:
 * - section, container, component, element, tight
 * - heroGap, cardGap, listGap, buttonPadding (layout patterns)
 * 
 * Direct Fluid Tokens:
 * - fontSize: fluid-xs → fluid-9xl
 * - spacing: fluid-xs → fluid-9xl
 * - pairs: fluid-xs-sm → fluid-8xl-9xl
 */

export {
  BrandTitle,
  Section,
  CardGrid,
  HeroSection,
  ContentHierarchy,
  WibblyWobblazCard
}