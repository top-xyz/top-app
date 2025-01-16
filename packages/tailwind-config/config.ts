import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';
import defaultTheme from 'tailwindcss/defaultTheme';
import typographyConfig from './typography.config';

export const config: Config = {
  darkMode: ['class'],
  content: [
    './node_modules/@repo/design-system/components/**/*.{ts,tsx}',
    './node_modules/@repo/design-system/lib/**/*.{ts,tsx}',
    './node_modules/@repo/design-system/index.tsx',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './providers/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
          foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
          foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
          foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
        },
        success: {
          DEFAULT: 'hsl(var(--success) / <alpha-value>)',
          foreground: 'hsl(var(--success-foreground) / <alpha-value>)',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning) / <alpha-value>)',
          foreground: 'hsl(var(--warning-foreground) / <alpha-value>)',
        },
        brand: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-geist-mono)', ...defaultTheme.fontFamily.mono],
      },
      boxShadow: {
        'glow': '0 0 20px -5px rgba(var(--primary-rgb) / 0.1)',
        'glow-primary': '0 0 20px -5px rgba(var(--primary-rgb) / 0.3)',
        'glow-subtle': '0 0 15px -5px rgba(var(--foreground-rgb) / 0.1)',
        'glass': '0 2px 8px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'glass-sm': '0 1px 4px -1px rgba(0, 0, 0, 0.08)',
        'glass-lg': '0 4px 16px -2px rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'text-glow': '0 0 10px rgba(var(--primary-rgb) / 0.3)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'float': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(10px, 10px)' },
          '50%': { transform: 'translate(-5px, 15px)' },
          '75%': { transform: 'translate(-15px, -5px)' },
        },
        'gradient-flow': {
          '0%, 100%': { 
            backgroundPosition: '0% 50%',
            filter: 'saturate(120%) brightness(110%)'
          },
          '50%': { 
            backgroundPosition: '400% 50%',
            filter: 'saturate(150%) brightness(120%)'
          }
        },
        'mist-flow-1': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'mist-flow-2': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'fade-in-up': {
          '0%': { 
            opacity: '0',
            transform: 'translateY(10px)',
            visibility: 'hidden'
          },
          '1%': {
            visibility: 'visible'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)',
            visibility: 'visible'
          },
        },
        'fade-in-scale': {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.95)',
            visibility: 'hidden'
          },
          '1%': {
            visibility: 'visible'
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1)',
            visibility: 'visible'
          },
        },
        'fade-in-down': {
          '0%': { 
            opacity: '0',
            transform: 'translateY(-10px)',
            visibility: 'hidden'
          },
          '1%': {
            visibility: 'visible'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)',
            visibility: 'visible'
          },
        },
        'bounce-in': {
          '0%': { 
            transform: 'scale(0.3)',
            opacity: '0'
          },
          '50%': {
            transform: 'scale(1.05)',
            opacity: '0.8'
          },
          '70%': { transform: 'scale(0.9)' },
          '100%': { 
            transform: 'scale(1)',
            opacity: '1'
          }
        },
        'glass-menu-in': {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.95)',
            backdropFilter: 'blur(0px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1)',
            backdropFilter: 'blur(8px)'
          }
        },
        'glass-menu-out': {
          '0%': { 
            opacity: '1',
            transform: 'scale(1)',
            backdropFilter: 'blur(8px)'
          },
          '100%': { 
            opacity: '0',
            transform: 'scale(0.95)',
            backdropFilter: 'blur(0px)'
          }
        },
        'shimmer': {
          '0%': { 
            backgroundPosition: '-1000px 0',
          },
          '100%': { 
            backgroundPosition: '1000px 0',
          },
        },
        'glow-pulse': {
          '0%, 100%': { 
            opacity: '0.3',
            boxShadow: '0 0 20px -5px rgba(var(--primary-rgb) / 0.1)'
          },
          '50%': { 
            opacity: '0.6',
            boxShadow: '0 0 25px -5px rgba(var(--primary-rgb) / 0.2)'
          }
        },
        'border-pulse': {
          '0%, 100%': { 
            borderColor: 'rgba(var(--primary-rgb) / 0.1)',
          },
          '50%': { 
            borderColor: 'rgba(var(--primary-rgb) / 0.2)',
          }
        },
        'card-press': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0.98)' }
        },
        'slide-in-up': {
          '0%': { 
            transform: 'translateY(10px)',
            opacity: '0'
          },
          '100%': { 
            transform: 'translateY(0)',
            opacity: '1'
          }
        },
        'fade-in': {
          '0%': { 
            opacity: '0',
          },
          '100%': { 
            opacity: '1',
          },
        },
        'slide-up': {
          '0%': { 
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'slide-down': {
          '0%': { 
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'scale-up': {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.95)',
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        'text-stream': {
          '0%': { 
            width: '0%',
            visibility: 'hidden'
          },
          '100%': { 
            width: '100%',
            visibility: 'visible'
          }
        },
        'float-subtle': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(0, 5px)' },
        },
        'float-delayed': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(0, 20px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'gradient-flow': 'gradient-flow 3s ease infinite',
        'mist-flow-1': 'mist-flow-1 20s linear infinite',
        'mist-flow-2': 'mist-flow-2 15s linear infinite',
        'fade-in-up': 'fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-scale': 'fade-in-scale 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-down': 'fade-in-down 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'bounce-in': 'bounce-in 0.3s ease-out',
        'glass-menu-in': 'glass-menu-in 0.3s cubic-bezier(0.32, 0.72, 0, 1) forwards',
        'glass-menu-out': 'glass-menu-out 0.3s cubic-bezier(0.32, 0.72, 0, 1) forwards',
        'shimmer': 'shimmer 8s linear infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'border-pulse': 'border-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'card-press': 'card-press 100ms ease-in-out forwards',
        'slide-in-up': 'slide-in-up 0.5s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slide-down 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-up': 'scale-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'text-stream': 'text-stream 2s ease-out forwards',
        'float-subtle': 'float-subtle 4s ease-in-out infinite',
        'float-delayed': 'float-delayed 6s ease-in-out infinite 3s',
      },
      backgroundSize: {
        '400%': '400% 400%',
      },
      typography: typographyConfig,
    },
  },
  plugins: [
    animate,
    typography,
    function({ addUtilities }: { addUtilities: (utilities: Record<string, any>) => void }) {
      addUtilities({
        '.interactive-scale': {
          'transform-style': 'preserve-3d',
          'transform': 'translateZ(0)',
          'will-change': 'transform',
          'transition-property': 'transform',
          'transition-duration': '200ms',
          'transition-timing-function': 'cubic-bezier(0.32, 0, 0.67, 0)',
          '&:hover': {
            'transform': 'scale(1.02)',
            'transition-duration': '300ms',
            'transition-timing-function': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          },
          '&:active': {
            'transform': 'scale(0.98)',
            'transition-duration': '100ms',
            'transition-timing-function': 'cubic-bezier(0.32, 0, 0.67, 0)',
          }
        },
        '.glass-panel': {
          'background': 'rgba(255, 255, 255, 0.05)',
          'backdrop-filter': 'blur(8px)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
          'box-shadow': '0 2px 8px -1px rgba(0, 0, 0, 0.1)',
        },
        '.hide-scrollbar': {
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
      })
    },
  ],
} as const;

