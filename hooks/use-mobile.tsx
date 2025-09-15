"use client"

import * as React from "react"
import { css } from "@/styled-system/css"

// Use PandaCSS breakpoint tokens for consistency
const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280
} as const

type ScreenSize = 'mobile' | 'tablet' | 'desktop'

/**
 * Hook for responsive device detection using PandaCSS patterns
 * Provides JavaScript-based detection when CSS media queries aren't sufficient
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${BREAKPOINTS.mobile - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.mobile)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < BREAKPOINTS.mobile)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

/**
 * Enhanced hook for responsive screen size detection
 * Returns current screen size and boolean helpers
 */
export function useResponsiveDetection() {
  const [screenSize, setScreenSize] = React.useState<ScreenSize>('mobile')

  React.useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth
      if (width < BREAKPOINTS.mobile) {
        setScreenSize('mobile')
      } else if (width < BREAKPOINTS.tablet) {
        setScreenSize('tablet')
      } else {
        setScreenSize('desktop')
      }
    }

    updateScreenSize()
    window.addEventListener('resize', updateScreenSize)
    return () => window.removeEventListener('resize', updateScreenSize)
  }, [])

  return React.useMemo(() => ({
    screenSize,
    isMobile: screenSize === 'mobile',
    isTablet: screenSize === 'tablet',
    isDesktop: screenSize === 'desktop'
  }), [screenSize])
}

/**
 * Hook for generating responsive CSS styles using PandaCSS
 * Provides a CSS-first approach to responsive design
 */
export function useResponsiveStyles(
  mobileStyles: Parameters<typeof css>[0],
  tabletStyles?: Parameters<typeof css>[0],
  desktopStyles?: Parameters<typeof css>[0]
) {
  return React.useMemo(() => {
    return css({
      // Mobile-first base styles
      ...mobileStyles,
      
      // Tablet breakpoint using PandaCSS responsive tokens
      md: {
        ...tabletStyles
      },
      
      // Desktop breakpoint using PandaCSS responsive tokens
      lg: {
        ...desktopStyles
      }
    })
  }, [mobileStyles, tabletStyles, desktopStyles])
}

/**
 * Hook for generating responsive CSS classes
 * Returns pre-defined responsive utility classes
 */
export function useResponsiveVisibility() {
  const { screenSize } = useResponsiveDetection()
  
  // Static responsive classes using PandaCSS
  const responsiveClasses = React.useMemo(() => ({
    showOnMobile: css({
      display: 'block',
      md: { display: 'none' }
    }),
    
    showOnTablet: css({
      display: 'none',
      md: { display: 'block' },
      lg: { display: 'none' }
    }),
    
    showOnDesktop: css({
      display: 'none',
      lg: { display: 'block' }
    }),
    
    hideOnMobile: css({
      display: 'none',
      md: { display: 'block' }
    })
  }), [])
  
  return React.useMemo(() => ({
    ...responsiveClasses,
    // JavaScript-based visibility (for when CSS isn't enough)
    currentSize: screenSize
  }), [responsiveClasses, screenSize])
}
