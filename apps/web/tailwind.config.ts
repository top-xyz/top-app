import type { Config } from 'tailwindcss'
import { shadcnPreset } from '@repo/design-system/lib/shadcn-preset'

const config = {
  presets: [shadcnPreset],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/design-system/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-up': 'scale-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'slide-up': {
          '0%': { 
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'scale-up': {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.95)'
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1)'
          }
        },
        'shimmer': {
          '0%': { 
            backgroundPosition: '200% 0',
            opacity: '0.5'
          },
          '100%': { 
            backgroundPosition: '-200% 0',
            opacity: '1'
          }
        },
        'pulse': {
          '0%, 100%': { 
            opacity: '1'
          },
          '50%': { 
            opacity: '0.5'
          }
        }
      },
      backgroundSize: {
        'shimmer': '200% 100%'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
} satisfies Config

export default config
