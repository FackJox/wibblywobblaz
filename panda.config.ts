import { defineConfig } from "@pandacss/dev";

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

  // Comprehensive theme configuration migrated from Tailwind
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
          }
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
        
        // Spacing Tokens (Tailwind defaults + custom)
        spacing: {
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
          96: { value: '24rem' }
        },
        
        // Typography Scale
        fontSizes: {
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
          '9xl': { value: '8rem' }
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
        }
      },
      
      // Animations
      animations: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'shhh-slide-up': 'slideUpBounce 900ms cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
        'shhh-slide-up-slow': 'slideUpFromBottom 1200ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-reduced': 'fadeInReduced 400ms ease-out forwards'
      }
    },
    
    // Define semantic tokens for theme switching
    semanticTokens: {
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
    }
  },

  // The output directory for your css system
  outdir: "styled-system",
  
  // Ensure compatibility with existing build process
  hash: true,
  minify: true
});
