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

  // Theme configuration for initial setup
  theme: {
    extend: {
      tokens: {
        colors: {
          background: { value: 'hsl(var(--background))' },
          foreground: { value: 'hsl(var(--foreground))' },
          primary: { value: 'hsl(var(--primary))' },
          secondary: { value: 'hsl(var(--secondary))' },
          border: { value: 'hsl(var(--border))' }
        },
        
        fonts: {
          sans: { value: ['Arial', 'Helvetica', 'sans-serif'] },
          hegval: { value: ['Hegval', 'Arial', 'Helvetica', 'sans-serif'] }
        }
      }
    },
  },

  // The output directory for your css system
  outdir: "styled-system",
  
  // Ensure compatibility with existing build process
  hash: true,
  minify: true
});
