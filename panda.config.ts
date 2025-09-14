import { defineConfig } from "@pandacss/dev";
import { FLUID_TYPOGRAPHY, FLUID_SPACING, FLUID_PAIRS } from "./utils/utopia";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations - updated for Next.js 15 App Router
  include: [
    "./app/**/*.{js,jsx,ts,tsx}", 
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}"
  ],

  // Files to exclude
  exclude: [],

  // Comprehensive theme configuration
  theme: {
    extend: {
      tokens: {
        colors: {
          // Core Colors
          background: { value: 'hsl(var(--background))' },
          foreground: { value: 'hsl(var(--foreground))' },
          
          // Card Colors
          card: { 
            DEFAULT: { value: 'hsl(var(--card))' },
            foreground: { value: 'hsl(var(--card-foreground))' }
          },
          
          // Popover Colors
          popover: {
            DEFAULT: { value: 'hsl(var(--popover))' },
            foreground: { value: 'hsl(var(--popover-foreground))' }
          },
          
          // Primary Colors
          primary: {
            DEFAULT: { value: 'hsl(var(--primary))' },
            foreground: { value: 'hsl(var(--primary-foreground))' }
          },
          
          // Secondary Colors
          secondary: {
            DEFAULT: { value: 'hsl(var(--secondary))' },
            foreground: { value: 'hsl(var(--secondary-foreground))' }
          },
          
          // Muted Colors
          muted: {
            DEFAULT: { value: 'hsl(var(--muted))' },
            foreground: { value: 'hsl(var(--muted-foreground))' }
          },
          
          // Accent Colors
          accent: {
            DEFAULT: { value: 'hsl(var(--accent))' },
            foreground: { value: 'hsl(var(--accent-foreground))' }
          },
          
          // Destructive Colors
          destructive: {
            DEFAULT: { value: 'hsl(var(--destructive))' },
            foreground: { value: 'hsl(var(--destructive-foreground))' }
          },
          
          // Form Colors
          border: { value: 'hsl(var(--border))' },
          input: { value: 'hsl(var(--input))' },
          ring: { value: 'hsl(var(--ring))' },
          
          // Chart Colors
          chart: {
            1: { value: 'hsl(var(--chart-1))' },
            2: { value: 'hsl(var(--chart-2))' },
            3: { value: 'hsl(var(--chart-3))' },
            4: { value: 'hsl(var(--chart-4))' },
            5: { value: 'hsl(var(--chart-5))' }
          },
          
          // Sidebar Colors
          sidebar: {
            DEFAULT: { value: 'hsl(var(--sidebar-background))' },
            foreground: { value: 'hsl(var(--sidebar-foreground))' },
            primary: { value: 'hsl(var(--sidebar-primary))' },
            'primary-foreground': { value: 'hsl(var(--sidebar-primary-foreground))' },
            accent: { value: 'hsl(var(--sidebar-accent))' },
            'accent-foreground': { value: 'hsl(var(--sidebar-accent-foreground))' },
            border: { value: 'hsl(var(--sidebar-border))' },
            ring: { value: 'hsl(var(--sidebar-ring))' }
          },
          
          // Pure black and white colors
          black: { value: '#000000' },
          white: { value: '#ffffff' }
        },
        
        fonts: {
          sans: { value: ['Arial', 'Helvetica', 'sans-serif'] },
          hegval: { value: ['Hegval', 'Arial', 'Helvetica', 'sans-serif'] }
        },
        
        // Border Radius Tokens
        radii: {
          DEFAULT: { value: 'var(--radius)' },
          lg: { value: 'var(--radius)' },
          md: { value: 'calc(var(--radius) - 2px)' },
          sm: { value: 'calc(var(--radius) - 4px)' }
        },
        
        // Spacing Tokens (Static + Fluid)
        spacing: {
          // Static spacing (Tailwind defaults)
          0: { value: '0' },
          px: { value: '1px' },
          0.5: { value: '0.125rem' },
          1: { value: '0.25rem' },
          1.5: { value: '0.375rem' },
          2: { value: '0.5rem' },
          2.5: { value: '0.625rem' },
          3: { value: '0.75rem' },
          3.5: { value: '0.875rem' },
          4: { value: '1rem' },
          5: { value: '1.25rem' },
          6: { value: '1.5rem' },
          7: { value: '1.75rem' },
          8: { value: '2rem' },
          9: { value: '2.25rem' },
          10: { value: '2.5rem' },
          11: { value: '2.75rem' },
          12: { value: '3rem' },
          14: { value: '3.5rem' },
          16: { value: '4rem' },
          20: { value: '5rem' },
          24: { value: '6rem' },
          28: { value: '7rem' },
          32: { value: '8rem' },
          36: { value: '9rem' },
          40: { value: '10rem' },
          44: { value: '11rem' },
          48: { value: '12rem' },
          52: { value: '13rem' },
          56: { value: '14rem' },
          60: { value: '15rem' },
          64: { value: '16rem' },
          72: { value: '18rem' },
          80: { value: '20rem' },
          96: { value: '24rem' },
          
          // Fluid spacing scales
          'fluid-xs': { value: FLUID_SPACING.xs.clamp },
          'fluid-sm': { value: FLUID_SPACING.sm.clamp },
          'fluid-md': { value: FLUID_SPACING.md.clamp },
          'fluid-lg': { value: FLUID_SPACING.lg.clamp },
          'fluid-xl': { value: FLUID_SPACING.xl.clamp },
          'fluid-2xl': { value: FLUID_SPACING['2xl'].clamp },
          'fluid-3xl': { value: FLUID_SPACING['3xl'].clamp },
          'fluid-4xl': { value: FLUID_SPACING['4xl'].clamp },
          'fluid-5xl': { value: FLUID_SPACING['5xl'].clamp },
          'fluid-6xl': { value: FLUID_SPACING['6xl'].clamp },
          'fluid-7xl': { value: FLUID_SPACING['7xl'].clamp },
          'fluid-8xl': { value: FLUID_SPACING['8xl'].clamp },
          'fluid-9xl': { value: FLUID_SPACING['9xl'].clamp },
          
          // Responsive pairs for advanced layouts
          'fluid-xs-sm': { value: FLUID_PAIRS['xs-sm'].clamp },
          'fluid-sm-md': { value: FLUID_PAIRS['sm-md'].clamp },
          'fluid-md-lg': { value: FLUID_PAIRS['md-lg'].clamp },
          'fluid-lg-xl': { value: FLUID_PAIRS['lg-xl'].clamp },
          'fluid-xl-2xl': { value: FLUID_PAIRS['xl-2xl'].clamp },
          'fluid-2xl-3xl': { value: FLUID_PAIRS['2xl-3xl'].clamp },
          'fluid-3xl-4xl': { value: FLUID_PAIRS['3xl-4xl'].clamp },
          'fluid-4xl-5xl': { value: FLUID_PAIRS['4xl-5xl'].clamp },
          'fluid-5xl-6xl': { value: FLUID_PAIRS['5xl-6xl'].clamp },
          'fluid-6xl-7xl': { value: FLUID_PAIRS['6xl-7xl'].clamp },
          'fluid-7xl-8xl': { value: FLUID_PAIRS['7xl-8xl'].clamp },
          'fluid-8xl-9xl': { value: FLUID_PAIRS['8xl-9xl'].clamp }
        },
        
        // Fluid Typography Scale (Utopia.fyi)
        fontSizes: {
          // Static fallback sizes
          xs: { value: '0.75rem' },
          sm: { value: '0.875rem' },
          base: { value: '1rem' },
          lg: { value: '1.125rem' },
          xl: { value: '1.25rem' },
          '2xl': { value: '1.5rem' },
          '3xl': { value: '1.875rem' },
          '4xl': { value: '2.25rem' },
          '5xl': { value: '3rem' },
          '6xl': { value: '3.75rem' },
          '7xl': { value: '4.5rem' },
          '8xl': { value: '6rem' },
          '9xl': { value: '8rem' },
          
          // Fluid typography scales
          'fluid-xs': { value: FLUID_TYPOGRAPHY.xs.clamp },
          'fluid-sm': { value: FLUID_TYPOGRAPHY.sm.clamp },
          'fluid-base': { value: FLUID_TYPOGRAPHY.base.clamp },
          'fluid-lg': { value: FLUID_TYPOGRAPHY.lg.clamp },
          'fluid-xl': { value: FLUID_TYPOGRAPHY.xl.clamp },
          'fluid-2xl': { value: FLUID_TYPOGRAPHY['2xl'].clamp },
          'fluid-3xl': { value: FLUID_TYPOGRAPHY['3xl'].clamp },
          'fluid-4xl': { value: FLUID_TYPOGRAPHY['4xl'].clamp },
          'fluid-5xl': { value: FLUID_TYPOGRAPHY['5xl'].clamp },
          'fluid-6xl': { value: FLUID_TYPOGRAPHY['6xl'].clamp },
          'fluid-7xl': { value: FLUID_TYPOGRAPHY['7xl'].clamp },
          'fluid-8xl': { value: FLUID_TYPOGRAPHY['8xl'].clamp },
          'fluid-9xl': { value: FLUID_TYPOGRAPHY['9xl'].clamp }
        },
        
        // Line Heights
        lineHeights: {
          none: { value: '1' },
          tight: { value: '1.25' },
          snug: { value: '1.375' },
          normal: { value: '1.5' },
          relaxed: { value: '1.625' },
          loose: { value: '2' }
        },
        
        // Transitions and Animations
        durations: {
          75: { value: '75ms' },
          100: { value: '100ms' },
          150: { value: '150ms' },
          200: { value: '200ms' },
          300: { value: '300ms' },
          500: { value: '500ms' },
          700: { value: '700ms' },
          1000: { value: '1000ms' }
        },
        
        // Easing Functions
        easings: {
          linear: { value: 'linear' },
          in: { value: 'cubic-bezier(0.4, 0, 1, 1)' },
          out: { value: 'cubic-bezier(0, 0, 0.2, 1)' },
          'in-out': { value: 'cubic-bezier(0.4, 0, 0.2, 1)' },
          'out-quart': { value: 'cubic-bezier(0.25, 1, 0.5, 1)' },
          'out-expo': { value: 'cubic-bezier(0.16, 1, 0.3, 1)' },
          bounce: { value: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' }
        }
      },
      
      // Breakpoints (matching Tailwind defaults)
      breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px'
      },
      
      // Keyframes for animations (moved to proper location)
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'slideUpBounce': {
          '0%': { transform: 'translateY(100vh)', opacity: '0' },
          '15%': { opacity: '0.6' },
          '40%': { opacity: '1', transform: 'translateY(10px)' },
          '70%': { transform: 'translateY(-10px)' },
          '85%': { transform: 'translateY(5px)' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'slideUpFromBottom': {
          '0%': { transform: 'translateY(100vh)', opacity: '0' },
          '10%': { opacity: '0.3' },
          '30%': { opacity: '0.8' },
          '60%': { opacity: '1', transform: 'translateY(20px)' },
          '80%': { transform: 'translateY(-5px)' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'fadeInReduced': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        
        // Dialog and overlay animations
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        'dialog-in': {
          '0%': { 
            opacity: '0', 
            transform: 'translate(-50%, -50%) scale(0.95)'
          },
          '100%': { 
            opacity: '1', 
            transform: 'translate(-50%, -50%) scale(1)'
          }
        },
        'dialog-out': {
          '0%': { 
            opacity: '1', 
            transform: 'translate(-50%, -50%) scale(1)'
          },
          '100%': { 
            opacity: '0', 
            transform: 'translate(-50%, -50%) scale(0.95)'
          }
        },
        
        // Dropdown/Popover animations
        'dropdown-in': {
          '0%': { 
            opacity: '0', 
            transform: 'scale(0.95)'
          },
          '100%': { 
            opacity: '1', 
            transform: 'scale(1)'
          }
        },
        'dropdown-out': {
          '0%': { 
            opacity: '1', 
            transform: 'scale(1)'
          },
          '100%': { 
            opacity: '0', 
            transform: 'scale(0.95)'
          }
        },
        'popover-in': {
          '0%': { 
            opacity: '0', 
            transform: 'scale(0.95)'
          },
          '100%': { 
            opacity: '1', 
            transform: 'scale(1)'
          }
        },
        'popover-out': {
          '0%': { 
            opacity: '1', 
            transform: 'scale(1)'
          },
          '100%': { 
            opacity: '0', 
            transform: 'scale(0.95)'
          }
        },
        
        // Tooltip animations
        'tooltip-in': {
          '0%': { 
            opacity: '0', 
            transform: 'scale(0.95)'
          },
          '100%': { 
            opacity: '1', 
            transform: 'scale(1)'
          }
        },
        'tooltip-out': {
          '0%': { 
            opacity: '1', 
            transform: 'scale(1)'
          },
          '100%': { 
            opacity: '0', 
            transform: 'scale(0.95)'
          }
        },
        
        // Slide animations for positioned elements
        'slide-in-from-top': {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(-8px)'
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)'
          }
        },
        'slide-in-from-bottom': {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(8px)'
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)'
          }
        },
        'slide-in-from-left': {
          '0%': { 
            opacity: '0', 
            transform: 'translateX(-8px)'
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateX(0)'
          }
        },
        'slide-in-from-right': {
          '0%': { 
            opacity: '0', 
            transform: 'translateX(8px)'
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateX(0)'
          }
        },
        
        // Progress shimmer animation
        'shimmer': {
          '0%': { 
            backgroundPosition: '-200% 0'
          },
          '100%': { 
            backgroundPosition: '200% 0'
          }
        },
        
        // Toast slide animations
        'slide-out-to-right': {
          '0%': { 
            opacity: '1', 
            transform: 'translateX(0)'
          },
          '100%': { 
            opacity: '0', 
            transform: 'translateX(100%)'
          }
        }
      },
      
      // Note: Animations will be handled via utility patterns or CSS-in-JS
    },
    
    // Define semantic tokens for theme switching
    semanticTokens: {
      // Fluid design semantic tokens
      fontSizes: {
        // Semantic typography scales using fluid values
        display: { value: '{fontSizes.fluid-8xl}' },
        heading: { value: '{fontSizes.fluid-6xl}' },
        title: { value: '{fontSizes.fluid-4xl}' },
        subtitle: { value: '{fontSizes.fluid-2xl}' },
        body: { value: '{fontSizes.fluid-base}' },
        caption: { value: '{fontSizes.fluid-sm}' },
        footnote: { value: '{fontSizes.fluid-xs}' },
        
        // Brand-specific semantic tokens
        brand: { value: '{fontSizes.fluid-7xl}' }, // For "WIBBLY WOBBLAZ" text
        hero: { value: '{fontSizes.fluid-6xl}' },
        section: { value: '{fontSizes.fluid-4xl}' }
      },
      
      spacing: {
        // Semantic spacing scales using fluid values
        section: { value: '{spacing.fluid-6xl}' },
        container: { value: '{spacing.fluid-4xl}' },
        component: { value: '{spacing.fluid-2xl}' },
        element: { value: '{spacing.fluid-lg}' },
        tight: { value: '{spacing.fluid-xs}' },
        
        // Layout-specific semantic tokens
        heroGap: { value: '{spacing.fluid-5xl-6xl}' },
        cardGap: { value: '{spacing.fluid-lg-xl}' },
        listGap: { value: '{spacing.fluid-sm-md}' },
        buttonPadding: { value: '{spacing.fluid-xs-sm}' }
      },
      
      colors: {
        // Light theme values
        background: {
          DEFAULT: { value: { _light: '0 0% 100%', _dark: '0 0% 3.9%' } },
        },
        foreground: {
          DEFAULT: { value: { _light: '0 0% 3.9%', _dark: '0 0% 98%' } },
        },
        card: {
          DEFAULT: { value: { _light: '0 0% 100%', _dark: '0 0% 3.9%' } },
          foreground: { value: { _light: '0 0% 3.9%', _dark: '0 0% 98%' } },
        },
        popover: {
          DEFAULT: { value: { _light: '0 0% 100%', _dark: '0 0% 3.9%' } },
          foreground: { value: { _light: '0 0% 3.9%', _dark: '0 0% 98%' } },
        },
        primary: {
          DEFAULT: { value: { _light: '0 0% 9%', _dark: '0 0% 98%' } },
          foreground: { value: { _light: '0 0% 98%', _dark: '0 0% 9%' } },
        },
        secondary: {
          DEFAULT: { value: { _light: '0 0% 96.1%', _dark: '0 0% 14.9%' } },
          foreground: { value: { _light: '0 0% 9%', _dark: '0 0% 98%' } },
        },
        muted: {
          DEFAULT: { value: { _light: '0 0% 96.1%', _dark: '0 0% 14.9%' } },
          foreground: { value: { _light: '0 0% 45.1%', _dark: '0 0% 63.9%' } },
        },
        accent: {
          DEFAULT: { value: { _light: '0 0% 96.1%', _dark: '0 0% 14.9%' } },
          foreground: { value: { _light: '0 0% 9%', _dark: '0 0% 98%' } },
        },
        destructive: {
          DEFAULT: { value: { _light: '0 84.2% 60.2%', _dark: '0 62.8% 30.6%' } },
          foreground: { value: { _light: '0 0% 98%', _dark: '0 0% 98%' } },
        },
        border: { value: { _light: '0 0% 89.8%', _dark: '0 0% 14.9%' } },
        input: { value: { _light: '0 0% 89.8%', _dark: '0 0% 14.9%' } },
        ring: { value: { _light: '0 0% 3.9%', _dark: '0 0% 83.1%' } },
      }
    },

    // Component Recipes for consistent styling
    recipes: {
      // Button recipe (re-exported from existing implementation)
      button: {
        className: 'button',
        base: {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2',
          whiteSpace: 'nowrap',
          borderRadius: 'md',
          fontSize: 'sm',
          fontWeight: 'medium',
          transitionProperty: 'colors',
          transitionDuration: '150ms',
          transitionTimingFunction: 'ease-in-out',
          cursor: 'pointer',
          outline: 'none',
          
          // Ring styles for focus
          _focusVisible: {
            outline: 'none',
            ringWidth: '2px',
            ringColor: 'ring',
            ringOffsetWidth: '2px',
            ringOffsetColor: 'background'
          },
          
          // Disabled styles
          _disabled: {
            pointerEvents: 'none',
            opacity: 0.5
          },
          
          // SVG icon styles
          '& svg': {
            pointerEvents: 'none',
            width: '4',
            height: '4',
            flexShrink: 0
          }
        },
        variants: {
          variant: {
            default: {
              backgroundColor: 'primary',
              color: 'primary.foreground',
              _hover: {
                backgroundColor: 'primary',
                opacity: 0.9
              }
            },
            destructive: {
              backgroundColor: 'destructive',
              color: 'destructive.foreground',
              _hover: {
                backgroundColor: 'destructive',
                opacity: 0.9
              }
            },
            outline: {
              borderWidth: '1px',
              borderColor: 'input',
              backgroundColor: 'background',
              _hover: {
                backgroundColor: 'accent',
                color: 'accent.foreground'
              }
            },
            secondary: {
              backgroundColor: 'secondary',
              color: 'secondary.foreground',
              _hover: {
                backgroundColor: 'secondary',
                opacity: 0.8
              }
            },
            ghost: {
              backgroundColor: 'transparent',
              _hover: {
                backgroundColor: 'accent',
                color: 'accent.foreground'
              }
            },
            link: {
              color: 'primary',
              textUnderlineOffset: '4px',
              backgroundColor: 'transparent',
              _hover: {
                textDecoration: 'underline'
              }
            }
          },
          size: {
            default: {
              height: '10',
              paddingX: '4',
              paddingY: '2'
            },
            sm: {
              height: '9',
              borderRadius: 'md',
              paddingX: '3'
            },
            lg: {
              height: '11',
              borderRadius: 'md',
              paddingX: '8'
            },
            icon: {
              height: '10',
              width: '10'
            }
          }
        },
        defaultVariants: {
          variant: 'default',
          size: 'default'
        },
        compoundVariants: [
          {
            variant: 'link',
            size: 'sm',
            css: {
              paddingX: 0,
              paddingY: 0,
              height: 'auto'
            }
          },
          {
            variant: 'link',
            size: 'lg',
            css: {
              paddingX: 0,
              paddingY: 0,
              height: 'auto'
            }
          },
          {
            variant: 'link',
            size: 'icon',
            css: {
              paddingX: 0,
              paddingY: 0,
              width: 'auto',
              height: 'auto'
            }
          }
        ]
      },

      // Card container recipe
      card: {
        className: 'card',
        base: {
          borderRadius: 'lg',
          border: '1px solid {colors.border}',
          backgroundColor: 'card',
          color: 'card.foreground',
          boxShadow: 'sm'
        },
        variants: {
          elevation: {
            flat: {
              boxShadow: 'none',
              borderWidth: '1px'
            },
            low: {
              boxShadow: 'sm'
            },
            medium: {
              boxShadow: 'md'
            },
            high: {
              boxShadow: 'lg'
            }
          },
          padding: {
            none: {
              padding: '0'
            },
            sm: {
              padding: 'fluid-sm'
            },
            md: {
              padding: 'fluid-md'
            },
            lg: {
              padding: 'fluid-lg'
            }
          }
        },
        defaultVariants: {
          elevation: 'low',
          padding: 'none'
        }
      },

      // Card header recipe
      cardHeader: {
        className: 'cardHeader',
        base: {
          display: 'flex',
          flexDirection: 'column',
          gap: 'fluid-xs',
          padding: 'fluid-lg'
        },
        variants: {
          spacing: {
            tight: {
              gap: 'fluid-xs',
              padding: 'fluid-sm'
            },
            normal: {
              gap: 'fluid-xs',
              padding: 'fluid-lg'
            },
            loose: {
              gap: 'fluid-sm',
              padding: 'fluid-xl'
            }
          }
        },
        defaultVariants: {
          spacing: 'normal'
        }
      },

      // Card title recipe
      cardTitle: {
        className: 'cardTitle',
        base: {
          fontSize: 'fluid-2xl',
          fontWeight: 'semibold',
          lineHeight: 'none',
          letterSpacing: 'tight'
        },
        variants: {
          size: {
            sm: {
              fontSize: 'fluid-lg'
            },
            md: {
              fontSize: 'fluid-xl'
            },
            lg: {
              fontSize: 'fluid-2xl'
            },
            xl: {
              fontSize: 'fluid-3xl'
            }
          }
        },
        defaultVariants: {
          size: 'lg'
        }
      },

      // Card description recipe
      cardDescription: {
        className: 'cardDescription',
        base: {
          fontSize: 'fluid-sm',
          color: 'muted.foreground'
        },
        variants: {
          size: {
            sm: {
              fontSize: 'fluid-xs'
            },
            md: {
              fontSize: 'fluid-sm'
            },
            lg: {
              fontSize: 'fluid-base'
            }
          }
        },
        defaultVariants: {
          size: 'md'
        }
      },

      // Card content recipe
      cardContent: {
        className: 'cardContent',
        base: {
          padding: 'fluid-lg',
          paddingTop: '0'
        },
        variants: {
          spacing: {
            tight: {
              padding: 'fluid-sm',
              paddingTop: '0'
            },
            normal: {
              padding: 'fluid-lg',
              paddingTop: '0'
            },
            loose: {
              padding: 'fluid-xl',
              paddingTop: '0'
            }
          }
        },
        defaultVariants: {
          spacing: 'normal'
        }
      },

      // Card footer recipe
      cardFooter: {
        className: 'cardFooter',
        base: {
          display: 'flex',
          alignItems: 'center',
          padding: 'fluid-lg',
          paddingTop: '0'
        },
        variants: {
          spacing: {
            tight: {
              padding: 'fluid-sm',
              paddingTop: '0'
            },
            normal: {
              padding: 'fluid-lg',
              paddingTop: '0'
            },
            loose: {
              padding: 'fluid-xl',
              paddingTop: '0'
            }
          },
          alignment: {
            start: {
              justifyContent: 'flex-start'
            },
            center: {
              justifyContent: 'center'
            },
            end: {
              justifyContent: 'flex-end'
            },
            between: {
              justifyContent: 'space-between'
            },
            around: {
              justifyContent: 'space-around'
            }
          }
        },
        defaultVariants: {
          spacing: 'normal',
          alignment: 'start'
        }
      },

      // Form component recipes
      formItem: {
        className: 'formItem',
        base: {
          display: 'flex',
          flexDirection: 'column',
          gap: 'fluid-xs'
        },
        variants: {
          spacing: {
            tight: {
              gap: 'fluid-xs'
            },
            normal: {
              gap: '2'
            },
            loose: {
              gap: 'fluid-sm'
            }
          }
        },
        defaultVariants: {
          spacing: 'normal'
        }
      },

      formLabel: {
        className: 'formLabel',
        base: {
          fontSize: 'fluid-sm',
          fontWeight: 'medium',
          lineHeight: 'none',
          // Base peer styles for form field associations
          _peerDisabled: {
            cursor: 'not-allowed',
            opacity: 0.7
          }
        },
        variants: {
          state: {
            default: {
              color: 'foreground'
            },
            error: {
              color: 'destructive'
            },
            success: {
              color: 'green.600'
            },
            warning: {
              color: 'amber.600'
            }
          },
          size: {
            sm: {
              fontSize: 'fluid-xs'
            },
            md: {
              fontSize: 'fluid-sm'
            },
            lg: {
              fontSize: 'fluid-base'
            }
          }
        },
        defaultVariants: {
          state: 'default',
          size: 'md'
        }
      },

      formControl: {
        className: 'formControl',
        base: {
          // Base styles for form control wrapper
          position: 'relative',
          width: 'full'
        }
      },

      formDescription: {
        className: 'formDescription',
        base: {
          fontSize: 'fluid-sm',
          color: 'muted.foreground',
          lineHeight: 'relaxed'
        },
        variants: {
          size: {
            sm: {
              fontSize: 'fluid-xs'
            },
            md: {
              fontSize: 'fluid-sm'
            },
            lg: {
              fontSize: 'fluid-base'
            }
          }
        },
        defaultVariants: {
          size: 'md'
        }
      },

      formMessage: {
        className: 'formMessage',
        base: {
          fontSize: 'fluid-sm',
          fontWeight: 'medium',
          lineHeight: 'tight'
        },
        variants: {
          state: {
            error: {
              color: 'destructive'
            },
            success: {
              color: 'green.600'
            },
            warning: {
              color: 'amber.600'
            },
            info: {
              color: 'blue.600'
            }
          },
          size: {
            sm: {
              fontSize: 'fluid-xs'
            },
            md: {
              fontSize: 'fluid-sm'
            },
            lg: {
              fontSize: 'fluid-base'
            }
          }
        },
        defaultVariants: {
          state: 'error',
          size: 'md'
        }
      },

      // Input field recipe
      input: {
        className: 'input',
        base: {
          display: 'flex',
          height: '10',
          width: 'full',
          borderRadius: 'md',
          border: '1px solid {colors.input}',
          backgroundColor: 'background',
          paddingX: '3',
          paddingY: '2',
          fontSize: 'fluid-base',
          ringOffsetColor: 'background',
          transition: 'all 150ms ease-in-out',
          
          // File input styles
          '&[type="file"]': {
            '& input[type="file"]::-webkit-file-upload-button': {
              border: 0,
              backgroundColor: 'transparent',
              fontSize: 'sm',
              fontWeight: 'medium',
              color: 'foreground'
            }
          },
          
          // Placeholder styles
          _placeholder: {
            color: 'muted.foreground'
          },
          
          // Focus styles
          _focusVisible: {
            outline: 'none',
            ringWidth: '2px',
            ringColor: 'ring',
            ringOffsetWidth: '2px'
          },
          
          // Disabled styles
          _disabled: {
            cursor: 'not-allowed',
            opacity: 0.5
          },
          
          // Responsive font size
          '@media (min-width: 768px)': {
            fontSize: 'sm'
          }
        },
        variants: {
          state: {
            default: {
              borderColor: 'input'
            },
            error: {
              borderColor: 'destructive',
              _focusVisible: {
                ringColor: 'destructive'
              }
            },
            success: {
              borderColor: 'green.500',
              _focusVisible: {
                ringColor: 'green.500'
              }
            },
            warning: {
              borderColor: 'amber.500',
              _focusVisible: {
                ringColor: 'amber.500'
              }
            }
          },
          size: {
            sm: {
              height: '8',
              paddingX: '2',
              paddingY: '1',
              fontSize: 'sm'
            },
            md: {
              height: '10',
              paddingX: '3',
              paddingY: '2',
              fontSize: 'fluid-base'
            },
            lg: {
              height: '12',
              paddingX: '4',
              paddingY: '3',
              fontSize: 'fluid-lg'
            }
          }
        },
        defaultVariants: {
          state: 'default',
          size: 'md'
        }
      },

      // Textarea recipe
      textarea: {
        className: 'textarea',
        base: {
          display: 'flex',
          minHeight: '20',
          width: 'full',
          borderRadius: 'md',
          border: '1px solid {colors.input}',
          backgroundColor: 'background',
          paddingX: '3',
          paddingY: '2',
          fontSize: 'fluid-base',
          ringOffsetColor: 'background',
          transition: 'all 150ms ease-in-out',
          resize: 'vertical',
          
          // Placeholder styles
          _placeholder: {
            color: 'muted.foreground'
          },
          
          // Focus styles
          _focusVisible: {
            outline: 'none',
            ringWidth: '2px',
            ringColor: 'ring',
            ringOffsetWidth: '2px'
          },
          
          // Disabled styles
          _disabled: {
            cursor: 'not-allowed',
            opacity: 0.5
          },
          
          // Responsive font size
          '@media (min-width: 768px)': {
            fontSize: 'sm'
          }
        },
        variants: {
          state: {
            default: {
              borderColor: 'input'
            },
            error: {
              borderColor: 'destructive',
              _focusVisible: {
                ringColor: 'destructive'
              }
            },
            success: {
              borderColor: 'green.500',
              _focusVisible: {
                ringColor: 'green.500'
              }
            },
            warning: {
              borderColor: 'amber.500',
              _focusVisible: {
                ringColor: 'amber.500'
              }
            }
          },
          size: {
            sm: {
              minHeight: '16',
              paddingX: '2',
              paddingY: '1',
              fontSize: 'sm'
            },
            md: {
              minHeight: '20',
              paddingX: '3',
              paddingY: '2',
              fontSize: 'fluid-base'
            },
            lg: {
              minHeight: '24',
              paddingX: '4',
              paddingY: '3',
              fontSize: 'fluid-lg'
            }
          }
        },
        defaultVariants: {
          state: 'default',
          size: 'md'
        }
      },

      // Select trigger recipe
      selectTrigger: {
        className: 'selectTrigger',
        base: {
          display: 'flex',
          height: '10',
          width: 'full',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: 'md',
          border: '1px solid {colors.input}',
          backgroundColor: 'background',
          paddingX: '3',
          paddingY: '2',
          fontSize: 'sm',
          ringOffsetColor: 'background',
          transition: 'all 150ms ease-in-out',
          
          // Placeholder styles
          _placeholder: {
            color: 'muted.foreground'
          },
          
          // Focus styles
          _focus: {
            outline: 'none',
            ringWidth: '2px',
            ringColor: 'ring',
            ringOffsetWidth: '2px'
          },
          
          // Disabled styles
          _disabled: {
            cursor: 'not-allowed',
            opacity: 0.5
          },
          
          // Child span line clamp
          '& > span': {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }
        },
        variants: {
          state: {
            default: {
              borderColor: 'input'
            },
            error: {
              borderColor: 'destructive',
              _focus: {
                ringColor: 'destructive'
              }
            },
            success: {
              borderColor: 'green.500',
              _focus: {
                ringColor: 'green.500'
              }
            },
            warning: {
              borderColor: 'amber.500',
              _focus: {
                ringColor: 'amber.500'
              }
            }
          },
          size: {
            sm: {
              height: '8',
              paddingX: '2',
              fontSize: 'xs'
            },
            md: {
              height: '10',
              paddingX: '3',
              fontSize: 'sm'
            },
            lg: {
              height: '12',
              paddingX: '4',
              fontSize: 'base'
            }
          }
        },
        defaultVariants: {
          state: 'default',
          size: 'md'
        }
      },

      // Dialog overlay recipe
      dialogOverlay: {
        className: 'dialogOverlay',
        base: {
          position: 'fixed',
          inset: '0',
          zIndex: '50',
          backgroundColor: 'black',
          opacity: '0.8',
          
          // Data state animations
          '&[data-state=open]': {
            animation: 'fade-in 150ms ease-out'
          },
          '&[data-state=closed]': {
            animation: 'fade-out 150ms ease-in'
          }
        }
      },

      // Dialog content recipe
      dialogContent: {
        className: 'dialogContent',
        base: {
          position: 'fixed',
          left: '50%',
          top: '50%',
          zIndex: '50',
          display: 'grid',
          width: 'full',
          maxWidth: 'lg',
          transform: 'translate(-50%, -50%)',
          gap: '4',
          border: '1px solid {colors.border}',
          backgroundColor: 'background',
          padding: 'fluid-lg',
          boxShadow: 'lg',
          transitionDuration: '200ms',
          borderRadius: 'lg',
          
          // Data state animations
          '&[data-state=open]': {
            animation: 'dialog-in 200ms ease-out'
          },
          '&[data-state=closed]': {
            animation: 'dialog-out 200ms ease-in'
          }
        },
        variants: {
          size: {
            sm: {
              maxWidth: 'md',
              padding: 'fluid-sm'
            },
            md: {
              maxWidth: 'lg',
              padding: 'fluid-lg'
            },
            lg: {
              maxWidth: 'xl',
              padding: 'fluid-xl'
            },
            xl: {
              maxWidth: '2xl',
              padding: 'fluid-2xl'
            },
            full: {
              maxWidth: '95vw',
              maxHeight: '95vh',
              padding: 'fluid-lg'
            }
          }
        },
        defaultVariants: {
          size: 'md'
        }
      },

      // Dialog close button recipe
      dialogClose: {
        className: 'dialogClose',
        base: {
          position: 'absolute',
          right: '4',
          top: '4',
          borderRadius: 'sm',
          opacity: '0.7',
          ringOffsetColor: 'background',
          transition: 'opacity 150ms ease-in-out',
          cursor: 'pointer',
          
          _hover: {
            opacity: '1'
          },
          
          _focusVisible: {
            outline: 'none',
            ringWidth: '2px',
            ringColor: 'ring',
            ringOffsetWidth: '2px'
          },
          
          _disabled: {
            pointerEvents: 'none'
          },
          
          '&[data-state=open]': {
            backgroundColor: 'accent',
            color: 'muted.foreground'
          }
        }
      },

      // Dialog header recipe
      dialogHeader: {
        className: 'dialogHeader',
        base: {
          display: 'flex',
          flexDirection: 'column',
          gap: 'fluid-xs',
          textAlign: 'center',
          
          '@media (min-width: 640px)': {
            textAlign: 'left'
          }
        },
        variants: {
          alignment: {
            left: {
              textAlign: 'left'
            },
            center: {
              textAlign: 'center'
            },
            right: {
              textAlign: 'right'
            }
          }
        },
        defaultVariants: {
          alignment: 'left'
        }
      },

      // Dialog footer recipe
      dialogFooter: {
        className: 'dialogFooter',
        base: {
          display: 'flex',
          flexDirection: 'column-reverse',
          gap: '2',
          
          '@media (min-width: 640px)': {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: '2'
          }
        },
        variants: {
          alignment: {
            start: {
              '@media (min-width: 640px)': {
                justifyContent: 'flex-start'
              }
            },
            center: {
              '@media (min-width: 640px)': {
                justifyContent: 'center'
              }
            },
            end: {
              '@media (min-width: 640px)': {
                justifyContent: 'flex-end'
              }
            },
            between: {
              '@media (min-width: 640px)': {
                justifyContent: 'space-between'
              }
            }
          }
        },
        defaultVariants: {
          alignment: 'end'
        }
      },

      // Dialog title recipe
      dialogTitle: {
        className: 'dialogTitle',
        base: {
          fontSize: 'fluid-lg',
          fontWeight: 'semibold',
          lineHeight: 'none',
          letterSpacing: 'tight'
        },
        variants: {
          size: {
            sm: {
              fontSize: 'fluid-base'
            },
            md: {
              fontSize: 'fluid-lg'
            },
            lg: {
              fontSize: 'fluid-xl'
            },
            xl: {
              fontSize: 'fluid-2xl'
            }
          }
        },
        defaultVariants: {
          size: 'md'
        }
      },

      // Dialog description recipe
      dialogDescription: {
        className: 'dialogDescription',
        base: {
          fontSize: 'fluid-sm',
          color: 'muted.foreground'
        },
        variants: {
          size: {
            sm: {
              fontSize: 'fluid-xs'
            },
            md: {
              fontSize: 'fluid-sm'
            },
            lg: {
              fontSize: 'fluid-base'
            }
          }
        },
        defaultVariants: {
          size: 'md'
        }
      },

      // Dropdown menu content recipe
      dropdownMenuContent: {
        className: 'dropdownMenuContent',
        base: {
          zIndex: '50',
          minWidth: '8rem',
          overflow: 'hidden',
          borderRadius: 'md',
          border: '1px solid {colors.border}',
          backgroundColor: 'popover',
          padding: '1',
          color: 'popover.foreground',
          boxShadow: 'md',
          
          // Data state animations
          '&[data-state=open]': {
            animation: 'dropdown-in 150ms ease-out'
          },
          '&[data-state=closed]': {
            animation: 'dropdown-out 150ms ease-in'
          },
          
          // Side-specific slide animations
          '&[data-side=bottom]': {
            '&[data-state=open]': {
              animation: 'slide-in-from-top 150ms ease-out'
            }
          },
          '&[data-side=left]': {
            '&[data-state=open]': {
              animation: 'slide-in-from-right 150ms ease-out'
            }
          },
          '&[data-side=right]': {
            '&[data-state=open]': {
              animation: 'slide-in-from-left 150ms ease-out'
            }
          },
          '&[data-side=top]': {
            '&[data-state=open]': {
              animation: 'slide-in-from-bottom 150ms ease-out'
            }
          }
        },
        variants: {
          size: {
            sm: {
              minWidth: '6rem',
              padding: '0.5'
            },
            md: {
              minWidth: '8rem',
              padding: '1'
            },
            lg: {
              minWidth: '12rem',
              padding: '1.5'
            }
          }
        },
        defaultVariants: {
          size: 'md'
        }
      },

      // Dropdown menu item recipe
      dropdownMenuItem: {
        className: 'dropdownMenuItem',
        base: {
          position: 'relative',
          display: 'flex',
          cursor: 'default',
          userSelect: 'none',
          alignItems: 'center',
          gap: '2',
          borderRadius: 'sm',
          paddingX: '2',
          paddingY: '1.5',
          fontSize: 'sm',
          outline: 'none',
          transition: 'colors 150ms ease-in-out',
          
          _focus: {
            backgroundColor: 'accent',
            color: 'accent.foreground'
          },
          
          '&[data-disabled]': {
            pointerEvents: 'none',
            opacity: '0.5'
          },
          
          // Icon styles
          '& svg': {
            pointerEvents: 'none',
            width: '4',
            height: '4',
            flexShrink: '0'
          }
        },
        variants: {
          inset: {
            true: {
              paddingLeft: '8'
            }
          },
          size: {
            sm: {
              paddingX: '1.5',
              paddingY: '1',
              fontSize: 'xs'
            },
            md: {
              paddingX: '2',
              paddingY: '1.5',
              fontSize: 'sm'
            },
            lg: {
              paddingX: '3',
              paddingY: '2',
              fontSize: 'base'
            }
          }
        },
        defaultVariants: {
          inset: false,
          size: 'md'
        }
      },

      // Dropdown menu separator recipe
      dropdownMenuSeparator: {
        className: 'dropdownMenuSeparator',
        base: {
          marginX: '-1',
          marginY: '1',
          height: '1px',
          backgroundColor: 'muted'
        }
      },

      // Dropdown menu label recipe
      dropdownMenuLabel: {
        className: 'dropdownMenuLabel',
        base: {
          paddingX: '2',
          paddingY: '1.5',
          fontSize: 'sm',
          fontWeight: 'semibold'
        },
        variants: {
          inset: {
            true: {
              paddingLeft: '8'
            }
          }
        },
        defaultVariants: {
          inset: false
        }
      },

      // Dropdown menu shortcut recipe
      dropdownMenuShortcut: {
        className: 'dropdownMenuShortcut',
        base: {
          marginLeft: 'auto',
          fontSize: 'xs',
          letterSpacing: 'widest',
          opacity: '0.6'
        }
      },

      // Popover content recipe
      popoverContent: {
        className: 'popoverContent',
        base: {
          zIndex: '50',
          width: '72',
          borderRadius: 'md',
          border: '1px solid {colors.border}',
          backgroundColor: 'popover',
          padding: 'fluid-lg',
          color: 'popover.foreground',
          boxShadow: 'md',
          outline: 'none',
          
          // Data state animations
          '&[data-state=open]': {
            animation: 'popover-in 150ms ease-out'
          },
          '&[data-state=closed]': {
            animation: 'popover-out 150ms ease-in'
          },
          
          // Side-specific slide animations
          '&[data-side=bottom]': {
            '&[data-state=open]': {
              animation: 'slide-in-from-top 150ms ease-out'
            }
          },
          '&[data-side=left]': {
            '&[data-state=open]': {
              animation: 'slide-in-from-right 150ms ease-out'
            }
          },
          '&[data-side=right]': {
            '&[data-state=open]': {
              animation: 'slide-in-from-left 150ms ease-out'
            }
          },
          '&[data-side=top]': {
            '&[data-state=open]': {
              animation: 'slide-in-from-bottom 150ms ease-out'
            }
          }
        },
        variants: {
          size: {
            sm: {
              width: '56',
              padding: 'fluid-sm'
            },
            md: {
              width: '72',
              padding: 'fluid-lg'
            },
            lg: {
              width: '96',
              padding: 'fluid-xl'
            },
            auto: {
              width: 'auto'
            }
          }
        },
        defaultVariants: {
          size: 'md'
        }
      },

      // Tooltip content recipe
      tooltipContent: {
        className: 'tooltipContent',
        base: {
          zIndex: '50',
          overflow: 'hidden',
          borderRadius: 'md',
          border: '1px solid {colors.border}',
          backgroundColor: 'popover',
          paddingX: '3',
          paddingY: '1.5',
          fontSize: 'sm',
          color: 'popover.foreground',
          boxShadow: 'md',
          
          // Animation states
          animation: 'tooltip-in 150ms ease-out',
          
          '&[data-state=closed]': {
            animation: 'tooltip-out 150ms ease-in'
          },
          
          // Side-specific slide animations
          '&[data-side=bottom]': {
            animation: 'slide-in-from-top 150ms ease-out'
          },
          '&[data-side=left]': {
            animation: 'slide-in-from-right 150ms ease-out'
          },
          '&[data-side=right]': {
            animation: 'slide-in-from-left 150ms ease-out'
          },
          '&[data-side=top]': {
            animation: 'slide-in-from-bottom 150ms ease-out'
          }
        },
        variants: {
          size: {
            sm: {
              paddingX: '2',
              paddingY: '1',
              fontSize: 'xs'
            },
            md: {
              paddingX: '3',
              paddingY: '1.5',
              fontSize: 'sm'
            },
            lg: {
              paddingX: '4',
              paddingY: '2',
              fontSize: 'base'
            }
          }
        },
        defaultVariants: {
          size: 'md'
        }
      },

      // Checkbox recipe
      checkbox: {
        className: 'checkbox',
        base: {
          height: '4',
          width: '4',
          flexShrink: '0',
          borderRadius: 'sm',
          border: '1px solid {colors.primary}',
          ringOffsetColor: 'background',
          transition: 'all 150ms ease-in-out',
          cursor: 'pointer',
          
          _focusVisible: {
            outline: 'none',
            ringWidth: '2px',
            ringColor: 'ring',
            ringOffsetWidth: '2px'
          },
          
          _disabled: {
            cursor: 'not-allowed',
            opacity: 0.5
          },
          
          '&[data-state=checked]': {
            backgroundColor: 'primary',
            color: 'primary.foreground'
          },
          
          '&[data-state=unchecked]': {
            backgroundColor: 'background'
          }
        },
        variants: {
          size: {
            sm: {
              height: '3.5',
              width: '3.5'
            },
            md: {
              height: '4',
              width: '4'
            },
            lg: {
              height: '5',
              width: '5'
            }
          }
        },
        defaultVariants: {
          size: 'md'
        }
      },

      // Checkbox indicator recipe
      checkboxIndicator: {
        className: 'checkboxIndicator',
        base: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'current'
        }
      },

      // Radio Group recipe
      radioGroup: {
        className: 'radioGroup',
        base: {
          display: 'grid',
          gap: '2'
        },
        variants: {
          orientation: {
            vertical: {
              display: 'grid',
              gap: '2'
            },
            horizontal: {
              display: 'flex',
              gap: '4'
            }
          },
          spacing: {
            tight: {
              gap: '1'
            },
            normal: {
              gap: '2'
            },
            loose: {
              gap: '4'
            }
          }
        },
        defaultVariants: {
          orientation: 'vertical',
          spacing: 'normal'
        }
      },

      // Radio Group Item recipe
      radioGroupItem: {
        className: 'radioGroupItem',
        base: {
          aspectRatio: '1',
          height: '4',
          width: '4',
          borderRadius: 'full',
          border: '1px solid {colors.primary}',
          color: 'primary',
          ringOffsetColor: 'background',
          transition: 'all 150ms ease-in-out',
          cursor: 'pointer',
          
          _focus: {
            outline: 'none'
          },
          
          _focusVisible: {
            ringWidth: '2px',
            ringColor: 'ring',
            ringOffsetWidth: '2px'
          },
          
          _disabled: {
            cursor: 'not-allowed',
            opacity: 0.5
          }
        },
        variants: {
          size: {
            sm: {
              height: '3.5',
              width: '3.5'
            },
            md: {
              height: '4',
              width: '4'
            },
            lg: {
              height: '5',
              width: '5'
            }
          }
        },
        defaultVariants: {
          size: 'md'
        }
      },

      // Radio Group Indicator recipe
      radioGroupIndicator: {
        className: 'radioGroupIndicator',
        base: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      },

      // Switch recipe
      switchComponent: {
        className: 'switch',
        base: {
          display: 'inline-flex',
          height: '6',
          width: '11',
          flexShrink: '0',
          cursor: 'pointer',
          alignItems: 'center',
          borderRadius: 'full',
          border: '2px solid transparent',
          transitionProperty: 'colors',
          transitionDuration: '200ms',
          transitionTimingFunction: 'ease-in-out',
          
          _focusVisible: {
            outline: 'none',
            ringWidth: '2px',
            ringColor: 'ring',
            ringOffsetWidth: '2px',
            ringOffsetColor: 'background'
          },
          
          _disabled: {
            cursor: 'not-allowed',
            opacity: 0.5
          },
          
          '&[data-state=checked]': {
            backgroundColor: 'primary'
          },
          
          '&[data-state=unchecked]': {
            backgroundColor: 'input'
          }
        },
        variants: {
          size: {
            sm: {
              height: '5',
              width: '9'
            },
            md: {
              height: '6',
              width: '11'
            },
            lg: {
              height: '7',
              width: '13'
            }
          }
        },
        defaultVariants: {
          size: 'md'
        }
      },

      // Switch thumb recipe
      switchThumb: {
        className: 'switchThumb',
        base: {
          pointerEvents: 'none',
          display: 'block',
          height: '5',
          width: '5',
          borderRadius: 'full',
          backgroundColor: 'background',
          boxShadow: 'lg',
          ringWidth: '0',
          transitionProperty: 'transform',
          transitionDuration: '200ms',
          transitionTimingFunction: 'ease-in-out',
          
          '&[data-state=checked]': {
            transform: 'translateX(20px)'
          },
          
          '&[data-state=unchecked]': {
            transform: 'translateX(0)'
          }
        },
        variants: {
          size: {
            sm: {
              height: '4',
              width: '4',
              '&[data-state=checked]': {
                transform: 'translateX(16px)'
              }
            },
            md: {
              height: '5',
              width: '5',
              '&[data-state=checked]': {
                transform: 'translateX(20px)'
              }
            },
            lg: {
              height: '6',
              width: '6',
              '&[data-state=checked]': {
                transform: 'translateX(24px)'
              }
            }
          }
        },
        defaultVariants: {
          size: 'md'
        }
      },

      // Slider recipe
      slider: {
        className: 'slider',
        base: {
          position: 'relative',
          display: 'flex',
          width: 'full',
          touchAction: 'none',
          userSelect: 'none',
          alignItems: 'center',
          cursor: 'pointer'
        },
        variants: {
          orientation: {
            horizontal: {
              flexDirection: 'row'
            },
            vertical: {
              flexDirection: 'column',
              height: '48'
            }
          }
        },
        defaultVariants: {
          orientation: 'horizontal'
        }
      },

      // Slider track recipe
      sliderTrack: {
        className: 'sliderTrack',
        base: {
          position: 'relative',
          height: '2',
          width: 'full',
          flexGrow: '1',
          overflow: 'hidden',
          borderRadius: 'full',
          backgroundColor: 'secondary'
        },
        variants: {
          orientation: {
            horizontal: {
              height: '2',
              width: 'full'
            },
            vertical: {
              height: 'full',
              width: '2'
            }
          },
          size: {
            sm: {
              height: '1.5'
            },
            md: {
              height: '2'
            },
            lg: {
              height: '3'
            }
          }
        },
        defaultVariants: {
          orientation: 'horizontal',
          size: 'md'
        }
      },

      // Slider range recipe
      sliderRange: {
        className: 'sliderRange',
        base: {
          position: 'absolute',
          height: 'full',
          backgroundColor: 'primary'
        }
      },

      // Slider thumb recipe
      sliderThumb: {
        className: 'sliderThumb',
        base: {
          display: 'block',
          height: '5',
          width: '5',
          borderRadius: 'full',
          border: '2px solid {colors.primary}',
          backgroundColor: 'background',
          ringOffsetColor: 'background',
          transitionProperty: 'colors',
          transitionDuration: '200ms',
          transitionTimingFunction: 'ease-in-out',
          cursor: 'grab',
          
          _focusVisible: {
            outline: 'none',
            ringWidth: '2px',
            ringColor: 'ring',
            ringOffsetWidth: '2px'
          },
          
          _disabled: {
            pointerEvents: 'none',
            opacity: 0.5
          },
          
          _active: {
            cursor: 'grabbing'
          }
        },
        variants: {
          size: {
            sm: {
              height: '4',
              width: '4'
            },
            md: {
              height: '5',
              width: '5'
            },
            lg: {
              height: '6',
              width: '6'
            }
          }
        },
        defaultVariants: {
          size: 'md'
        }
      },

      // Label recipe
      label: {
        className: 'label',
        base: {
          fontSize: 'fluid-sm',
          fontWeight: 'medium',
          lineHeight: 'none',
          
          // Peer styles for form field associations
          _peerDisabled: {
            cursor: 'not-allowed',
            opacity: 0.7
          }
        },
        variants: {
          size: {
            sm: {
              fontSize: 'fluid-xs'
            },
            md: {
              fontSize: 'fluid-sm'
            },
            lg: {
              fontSize: 'fluid-base'
            }
          },
          weight: {
            normal: {
              fontWeight: 'normal'
            },
            medium: {
              fontWeight: 'medium'
            },
            semibold: {
              fontWeight: 'semibold'
            },
            bold: {
              fontWeight: 'bold'
            }
          }
        },
        defaultVariants: {
          size: 'md',
          weight: 'medium'
        }
      },

      // Alert component recipes
      alert: {
        className: 'alert',
        base: {
          position: 'relative',
          width: 'full',
          borderRadius: 'lg',
          border: '1px solid {colors.border}',
          padding: '4',
          
          // Icon and content positioning
          '& > svg ~ *': {
            paddingLeft: '7'
          },
          '& > svg + div': {
            transform: 'translateY(-3px)'
          },
          '& > svg': {
            position: 'absolute',
            left: '4',
            top: '4',
            color: 'foreground'
          }
        },
        variants: {
          variant: {
            default: {
              backgroundColor: 'background',
              color: 'foreground'
            },
            destructive: {
              borderColor: 'destructive',
              borderOpacity: '0.5',
              color: 'destructive',
              '& > svg': {
                color: 'destructive'
              }
            },
            warning: {
              borderColor: 'amber.500',
              backgroundColor: 'amber.50',
              color: 'amber.900',
              '& > svg': {
                color: 'amber.600'
              }
            },
            success: {
              borderColor: 'green.500',
              backgroundColor: 'green.50',
              color: 'green.900',
              '& > svg': {
                color: 'green.600'
              }
            },
            info: {
              borderColor: 'blue.500',
              backgroundColor: 'blue.50',
              color: 'blue.900',
              '& > svg': {
                color: 'blue.600'
              }
            }
          },
          size: {
            sm: {
              padding: 'fluid-sm',
              fontSize: 'fluid-sm'
            },
            md: {
              padding: '4',
              fontSize: 'fluid-base'
            },
            lg: {
              padding: 'fluid-lg',
              fontSize: 'fluid-lg'
            }
          }
        },
        defaultVariants: {
          variant: 'default',
          size: 'md'
        }
      },

      // Alert title recipe
      alertTitle: {
        className: 'alertTitle',
        base: {
          marginBottom: '1',
          fontWeight: 'medium',
          lineHeight: 'none',
          letterSpacing: 'tight'
        },
        variants: {
          size: {
            sm: {
              fontSize: 'fluid-sm'
            },
            md: {
              fontSize: 'fluid-base'
            },
            lg: {
              fontSize: 'fluid-lg'
            }
          }
        },
        defaultVariants: {
          size: 'md'
        }
      },

      // Alert description recipe
      alertDescription: {
        className: 'alertDescription',
        base: {
          fontSize: 'fluid-sm',
          '& p': {
            lineHeight: 'relaxed'
          }
        },
        variants: {
          size: {
            sm: {
              fontSize: 'fluid-xs'
            },
            md: {
              fontSize: 'fluid-sm'
            },
            lg: {
              fontSize: 'fluid-base'
            }
          }
        },
        defaultVariants: {
          size: 'md'
        }
      },

      // Badge recipe
      badge: {
        className: 'badge',
        base: {
          display: 'inline-flex',
          alignItems: 'center',
          borderRadius: 'full',
          border: '1px solid transparent',
          paddingX: '2.5',
          paddingY: '0.5',
          fontSize: 'xs',
          fontWeight: 'semibold',
          transitionProperty: 'colors',
          transitionDuration: '150ms',
          transitionTimingFunction: 'ease-in-out',
          
          _focusVisible: {
            outline: 'none',
            ringWidth: '2px',
            ringColor: 'ring',
            ringOffsetWidth: '2px'
          }
        },
        variants: {
          variant: {
            default: {
              borderColor: 'transparent',
              backgroundColor: 'primary',
              color: 'primary.foreground',
              _hover: {
                backgroundColor: 'primary',
                opacity: '0.8'
              }
            },
            secondary: {
              borderColor: 'transparent',
              backgroundColor: 'secondary',
              color: 'secondary.foreground',
              _hover: {
                backgroundColor: 'secondary',
                opacity: '0.8'
              }
            },
            destructive: {
              borderColor: 'transparent',
              backgroundColor: 'destructive',
              color: 'destructive.foreground',
              _hover: {
                backgroundColor: 'destructive',
                opacity: '0.8'
              }
            },
            outline: {
              color: 'foreground',
              borderColor: 'border'
            },
            success: {
              borderColor: 'transparent',
              backgroundColor: 'green.100',
              color: 'green.800',
              _hover: {
                backgroundColor: 'green.200'
              }
            },
            warning: {
              borderColor: 'transparent',
              backgroundColor: 'amber.100',
              color: 'amber.800',
              _hover: {
                backgroundColor: 'amber.200'
              }
            },
            info: {
              borderColor: 'transparent',
              backgroundColor: 'blue.100',
              color: 'blue.800',
              _hover: {
                backgroundColor: 'blue.200'
              }
            }
          },
          size: {
            sm: {
              paddingX: '2',
              paddingY: '0.5',
              fontSize: '2xs',
              height: '5'
            },
            md: {
              paddingX: '2.5',
              paddingY: '0.5',
              fontSize: 'xs',
              height: '6'
            },
            lg: {
              paddingX: '3',
              paddingY: '1',
              fontSize: 'sm',
              height: '7'
            }
          }
        },
        defaultVariants: {
          variant: 'default',
          size: 'md'
        }
      },

      // Progress recipe
      progress: {
        className: 'progress',
        base: {
          position: 'relative',
          height: '4',
          width: 'full',
          overflow: 'hidden',
          borderRadius: 'full',
          backgroundColor: 'secondary'
        },
        variants: {
          size: {
            sm: {
              height: '2'
            },
            md: {
              height: '4'
            },
            lg: {
              height: '6'
            },
            xl: {
              height: '8'
            }
          },
          variant: {
            default: {
              backgroundColor: 'secondary'
            },
            success: {
              backgroundColor: 'green.200'
            },
            warning: {
              backgroundColor: 'amber.200'
            },
            error: {
              backgroundColor: 'red.200'
            }
          }
        },
        defaultVariants: {
          size: 'md',
          variant: 'default'
        }
      },

      // Progress indicator recipe
      progressIndicator: {
        className: 'progressIndicator',
        base: {
          height: 'full',
          width: 'full',
          flex: '1',
          backgroundColor: 'primary',
          transitionProperty: 'transform',
          transitionDuration: '300ms',
          transitionTimingFunction: 'ease-in-out'
        },
        variants: {
          variant: {
            default: {
              backgroundColor: 'primary'
            },
            success: {
              backgroundColor: 'green.500'
            },
            warning: {
              backgroundColor: 'amber.500'
            },
            error: {
              backgroundColor: 'red.500'
            }
          },
          animated: {
            true: {
              background: 'linear-gradient(90deg, transparent, {colors.white}, transparent)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s infinite'
            }
          }
        },
        defaultVariants: {
          variant: 'default',
          animated: false
        }
      },

      // Avatar recipe
      avatar: {
        className: 'avatar',
        base: {
          position: 'relative',
          display: 'flex',
          height: '10',
          width: '10',
          flexShrink: '0',
          overflow: 'hidden',
          borderRadius: 'full'
        },
        variants: {
          size: {
            xs: {
              height: '6',
              width: '6'
            },
            sm: {
              height: '8',
              width: '8'
            },
            md: {
              height: '10',
              width: '10'
            },
            lg: {
              height: '12',
              width: '12'
            },
            xl: {
              height: '16',
              width: '16'
            },
            '2xl': {
              height: '20',
              width: '20'
            }
          },
          shape: {
            circle: {
              borderRadius: 'full'
            },
            square: {
              borderRadius: 'md'
            }
          }
        },
        defaultVariants: {
          size: 'md',
          shape: 'circle'
        }
      },

      // Avatar image recipe
      avatarImage: {
        className: 'avatarImage',
        base: {
          aspectRatio: '1',
          height: 'full',
          width: 'full',
          objectFit: 'cover'
        }
      },

      // Avatar fallback recipe
      avatarFallback: {
        className: 'avatarFallback',
        base: {
          display: 'flex',
          height: 'full',
          width: 'full',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'full',
          backgroundColor: 'muted',
          color: 'muted.foreground',
          fontSize: 'sm',
          fontWeight: 'medium'
        },
        variants: {
          size: {
            xs: {
              fontSize: 'xs'
            },
            sm: {
              fontSize: 'xs'
            },
            md: {
              fontSize: 'sm'
            },
            lg: {
              fontSize: 'base'
            },
            xl: {
              fontSize: 'lg'
            },
            '2xl': {
              fontSize: 'xl'
            }
          }
        },
        defaultVariants: {
          size: 'md'
        }
      },

      // Separator recipe
      separator: {
        className: 'separator',
        base: {
          flexShrink: '0',
          backgroundColor: 'border'
        },
        variants: {
          orientation: {
            horizontal: {
              height: '1px',
              width: 'full'
            },
            vertical: {
              height: 'full',
              width: '1px'
            }
          },
          size: {
            sm: {
              '&[data-orientation=horizontal]': {
                marginY: '2'
              },
              '&[data-orientation=vertical]': {
                marginX: '2'
              }
            },
            md: {
              '&[data-orientation=horizontal]': {
                marginY: '4'
              },
              '&[data-orientation=vertical]': {
                marginX: '4'
              }
            },
            lg: {
              '&[data-orientation=horizontal]': {
                marginY: '6'
              },
              '&[data-orientation=vertical]': {
                marginX: '6'
              }
            }
          }
        },
        defaultVariants: {
          orientation: 'horizontal',
          size: 'md'
        }
      },

      // Toast viewport recipe
      toastViewport: {
        className: 'toastViewport',
        base: {
          position: 'fixed',
          top: '0',
          zIndex: '100',
          display: 'flex',
          maxHeight: '100vh',
          width: 'full',
          flexDirection: 'column-reverse',
          padding: '4',
          
          '@media (min-width: 640px)': {
            bottom: '0',
            right: '0',
            top: 'auto',
            flexDirection: 'column',
            maxWidth: '420px'
          }
        }
      },

      // Toast recipe
      toast: {
        className: 'toast',
        base: {
          group: true,
          pointerEvents: 'auto',
          position: 'relative',
          display: 'flex',
          width: 'full',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '4',
          overflow: 'hidden',
          borderRadius: 'md',
          border: '1px solid {colors.border}',
          padding: '6',
          paddingRight: '8',
          boxShadow: 'lg',
          transitionProperty: 'all',
          transitionDuration: '300ms',
          transitionTimingFunction: 'ease-in-out',
          
          // Data state animations
          '&[data-swipe=cancel]': {
            transform: 'translateX(0)'
          },
          '&[data-swipe=end]': {
            transform: 'translateX(var(--radix-toast-swipe-end-x))'
          },
          '&[data-swipe=move]': {
            transform: 'translateX(var(--radix-toast-swipe-move-x))',
            transitionProperty: 'none'
          },
          '&[data-state=open]': {
            animation: 'slide-in-from-top 300ms ease-out',
            '@media (min-width: 640px)': {
              animation: 'slide-in-from-bottom 300ms ease-out'
            }
          },
          '&[data-state=closed]': {
            animation: 'fade-out 200ms ease-in, slide-out-to-right 200ms ease-in'
          }
        },
        variants: {
          variant: {
            default: {
              backgroundColor: 'background',
              color: 'foreground'
            },
            destructive: {
              borderColor: 'destructive',
              backgroundColor: 'destructive',
              color: 'destructive.foreground'
            },
            success: {
              borderColor: 'green.500',
              backgroundColor: 'green.50',
              color: 'green.900'
            },
            warning: {
              borderColor: 'amber.500',
              backgroundColor: 'amber.50',
              color: 'amber.900'
            },
            info: {
              borderColor: 'blue.500',
              backgroundColor: 'blue.50',
              color: 'blue.900'
            }
          },
          size: {
            sm: {
              padding: 'fluid-sm',
              paddingRight: 'fluid-md'
            },
            md: {
              padding: '6',
              paddingRight: '8'
            },
            lg: {
              padding: 'fluid-lg',
              paddingRight: 'fluid-xl'
            }
          }
        },
        defaultVariants: {
          variant: 'default',
          size: 'md'
        }
      },

      // Toast action recipe
      toastAction: {
        className: 'toastAction',
        base: {
          display: 'inline-flex',
          height: '8',
          flexShrink: '0',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'md',
          border: '1px solid {colors.border}',
          backgroundColor: 'transparent',
          paddingX: '3',
          fontSize: 'sm',
          fontWeight: 'medium',
          ringOffsetColor: 'background',
          transitionProperty: 'colors',
          transitionDuration: '150ms',
          transitionTimingFunction: 'ease-in-out',
          
          _hover: {
            backgroundColor: 'secondary'
          },
          
          _focusVisible: {
            outline: 'none',
            ringWidth: '2px',
            ringColor: 'ring',
            ringOffsetWidth: '2px'
          },
          
          _disabled: {
            pointerEvents: 'none',
            opacity: '0.5'
          },
          
          // Group variant styles
          '.group.destructive &': {
            borderColor: 'muted',
            borderOpacity: '0.4',
            _hover: {
              borderColor: 'destructive',
              borderOpacity: '0.3',
              backgroundColor: 'destructive',
              color: 'destructive.foreground'
            },
            _focusVisible: {
              ringColor: 'destructive'
            }
          }
        }
      },

      // Toast close recipe
      toastClose: {
        className: 'toastClose',
        base: {
          position: 'absolute',
          right: '2',
          top: '2',
          borderRadius: 'md',
          padding: '1',
          color: 'foreground',
          opacity: '0',
          transitionProperty: 'opacity',
          transitionDuration: '150ms',
          transitionTimingFunction: 'ease-in-out',
          
          _hover: {
            color: 'foreground',
            opacity: '1'
          },
          
          _focusVisible: {
            opacity: '1',
            outline: 'none',
            ringWidth: '2px'
          },
          
          '.group:hover &': {
            opacity: '1'
          },
          
          // Group variant styles
          '.group.destructive &': {
            color: 'red.300',
            _hover: {
              color: 'red.50'
            },
            _focusVisible: {
              ringColor: 'red.400',
              ringOffsetColor: 'red.600'
            }
          }
        }
      },

      // Toast title recipe
      toastTitle: {
        className: 'toastTitle',
        base: {
          fontSize: 'sm',
          fontWeight: 'semibold'
        },
        variants: {
          size: {
            sm: {
              fontSize: 'xs'
            },
            md: {
              fontSize: 'sm'
            },
            lg: {
              fontSize: 'base'
            }
          }
        },
        defaultVariants: {
          size: 'md'
        }
      },

      // Toast description recipe
      toastDescription: {
        className: 'toastDescription',
        base: {
          fontSize: 'sm',
          opacity: '0.9'
        },
        variants: {
          size: {
            sm: {
              fontSize: 'xs'
            },
            md: {
              fontSize: 'sm'
            },
            lg: {
              fontSize: 'base'
            }
          }
        },
        defaultVariants: {
          size: 'md'
        }
      },

      // PAGE STRUCTURE RECIPES
      // Main page container recipe
      pageContainer: {
        className: 'pageContainer',
        base: {
          position: 'fixed',
          inset: '0',
          overflow: 'hidden'
        }
      },

      // Page transition wrapper recipe
      pageTransitionWrapper: {
        className: 'pageTransitionWrapper',
        base: {
          display: 'flex',
          width: '200%',
          height: 'full',
          transition: 'transform 0.7s ease-in-out'
        },
        variants: {
          page: {
            links: {
              transform: 'translateX(0)'
            },
            parties: {
              transform: 'translateX(-50%)'
            }
          }
        },
        defaultVariants: {
          page: 'links'
        }
      },

      // Individual page wrapper recipe
      pageWrapper: {
        className: 'pageWrapper',
        base: {
          width: '50%',
          height: 'full'
        }
      },

      // Page content layout recipe
      pageContent: {
        className: 'pageContent',
        base: {
          height: 'screen',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        },
        variants: {
          theme: {
            light: {
              backgroundColor: 'white',
              color: 'black'
            },
            dark: {
              backgroundColor: 'black',
              color: 'white'
            }
          }
        },
        defaultVariants: {
          theme: 'light'
        }
      },

      // NAVIGATION RECIPES
      // Main navigation recipe
      navigation: {
        className: 'navigation',
        base: {
          borderBottomWidth: '4px',
          padding: 'fluid-md',
          flexShrink: '0',
          position: 'sticky',
          top: '0',
          zIndex: '50'
        },
        variants: {
          theme: {
            light: {
              borderBottomColor: 'black',
              backgroundColor: 'white'
            },
            dark: {
              borderBottomColor: 'white',
              backgroundColor: 'black'
            }
          }
        },
        defaultVariants: {
          theme: 'light'
        }
      },

      // Navigation container recipe
      navigationContainer: {
        className: 'navigationContainer',
        base: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }
      },

      // Brand text recipe
      brandText: {
        className: 'brandText',
        base: {
          fontSize: 'brand',
          fontWeight: '900',
          letterSpacing: 'tighter',
          fontFamily: 'hegval',
          whiteSpace: 'nowrap'
        },
        variants: {
          theme: {
            light: {
              color: 'black'
            },
            dark: {
              color: 'white'
            }
          },
          size: {
            sm: {
              fontSize: 'fluid-lg'
            },
            md: {
              fontSize: 'brand'
            },
            lg: {
              fontSize: 'fluid-8xl'
            }
          }
        },
        defaultVariants: {
          theme: 'light',
          size: 'md'
        }
      },

      // Desktop navigation buttons container recipe
      desktopNavigation: {
        className: 'desktopNavigation',
        base: {
          display: 'none',
          gap: 'fluid-lg'
        },
        variants: {
          responsive: {
            hidden: {
              display: 'none'
            },
            visible: {
              display: 'flex',
              md: {
                display: 'flex'
              }
            }
          }
        },
        defaultVariants: {
          responsive: 'visible'
        }
      },

      // Navigation button recipe
      navigationButton: {
        className: 'navigationButton',
        base: {
          fontSize: 'xl',
          fontWeight: '900',
          transition: 'colors 0.2s ease-in-out'
        },
        variants: {
          theme: {
            light: {
              color: 'black',
              _hover: {
                backgroundColor: 'black',
                color: 'white'
              }
            },
            dark: {
              color: 'white',
              _hover: {
                backgroundColor: 'white',
                color: 'black'
              }
            }
          },
          active: {
            true: {},
            false: {}
          }
        },
        compoundVariants: [
          {
            theme: 'light',
            active: true,
            css: {
              backgroundColor: 'black',
              color: 'white'
            }
          },
          {
            theme: 'dark',
            active: true,
            css: {
              backgroundColor: 'white',
              color: 'black'
            }
          }
        ],
        defaultVariants: {
          theme: 'light',
          active: false
        }
      },

      // Mobile menu button recipe
      mobileMenuButton: {
        className: 'mobileMenuButton',
        base: {
          padding: '2',
          display: 'block'
        },
        variants: {
          responsive: {
            hidden: {
              display: 'block',
              md: {
                display: 'none'
              }
            },
            visible: {
              display: 'block'
            }
          },
          theme: {
            light: {
              color: 'black'
            },
            dark: {
              color: 'white',
              _hover: {
                backgroundColor: 'white',
                color: 'black'
              }
            }
          }
        },
        defaultVariants: {
          responsive: 'hidden',
          theme: 'light'
        }
      },

      // Mobile navigation menu recipe
      mobileNavigation: {
        className: 'mobileNavigation',
        base: {
          marginTop: 'fluid-md',
          borderTopWidth: '2px',
          paddingTop: 'fluid-md',
          display: 'none'
        },
        variants: {
          visible: {
            true: {
              display: 'block',
              md: {
                display: 'none'
              }
            },
            false: {
              display: 'none'
            }
          },
          theme: {
            light: {
              borderTopColor: 'black'
            },
            dark: {
              borderTopColor: 'white'
            }
          }
        },
        defaultVariants: {
          visible: false,
          theme: 'light'
        }
      },

      // Mobile navigation container recipe
      mobileNavigationContainer: {
        className: 'mobileNavigationContainer',
        base: {
          display: 'flex',
          flexDirection: 'column',
          gap: '2'
        }
      },

      // LAYOUT RECIPES
      // Scrollable content container recipe
      scrollableContent: {
        className: 'scrollableContent',
        base: {
          flex: '1',
          overflow: 'hidden'
        },
        variants: {
          scrollable: {
            true: {
              overflowY: 'auto',
              // Mobile scroll optimization
              WebkitOverflowScrolling: 'touch'
            },
            false: {
              overflow: 'hidden'
            }
          }
        },
        defaultVariants: {
          scrollable: false
        }
      },

      // Links page layout recipe
      linksPageLayout: {
        className: 'linksPageLayout',
        base: {
          display: 'flex',
          flexDirection: 'column',
          height: 'full'
        },
        variants: {
          responsive: {
            mobile: {
              flexDirection: 'column'
            },
            desktop: {
              flexDirection: 'column',
              md: {
                flexDirection: 'row'
              }
            }
          }
        },
        defaultVariants: {
          responsive: 'desktop'
        }
      },

      // Logo section recipe
      logoSection: {
        className: 'logoSection',
        base: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'fluid-md',
          backgroundColor: 'white',
          flex: '1'
        },
        variants: {
          responsive: {
            mobile: {
              padding: 'fluid-md'
            },
            desktop: {
              padding: 'fluid-md',
              md: {
                padding: 'fluid-lg',
                height: 'full'
              }
            }
          }
        },
        defaultVariants: {
          responsive: 'desktop'
        }
      },

      // Links section recipe
      linksSection: {
        className: 'linksSection',
        base: {
          flex: '1',
          backgroundColor: 'black',
          color: 'white',
          padding: 'fluid-md',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        },
        variants: {
          responsive: {
            mobile: {
              padding: 'fluid-md'
            },
            desktop: {
              padding: 'fluid-md',
              md: {
                padding: 'fluid-lg',
                height: 'full'
              }
            }
          }
        },
        defaultVariants: {
          responsive: 'desktop'
        }
      },

      // Parties page content recipe
      partiesPageContent: {
        className: 'partiesPageContent',
        base: {
          position: 'relative',
          zIndex: '10',
          padding: 'fluid-md'
        },
        variants: {
          responsive: {
            mobile: {
              padding: 'fluid-md'
            },
            desktop: {
              padding: 'fluid-md',
              md: {
                padding: 'fluid-lg'
              }
            }
          }
        },
        defaultVariants: {
          responsive: 'desktop'
        }
      },

      // Parties grid recipe
      partiesGrid: {
        className: 'partiesGrid',
        base: {
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 'fluid-md',
          maxWidth: '7xl',
          marginX: 'auto',
          '@media (min-width: 768px)': {
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 'fluid-lg'
          },
          '@media (min-width: 1024px)': {
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 'fluid-lg'
          }
        },
        variants: {
          responsive: {
            mobile: {
              gridTemplateColumns: '1fr',
              gap: 'fluid-md'
            },
            desktop: {
              // Desktop variant inherits base responsive styles
            }
          }
        },
        defaultVariants: {
          responsive: 'desktop'
        }
      }
    }
  },

  // The output directory for your css system
  outdir: "styled-system",
  
  // Ensure compatibility with existing build process
  hash: true,
  minify: true
});
