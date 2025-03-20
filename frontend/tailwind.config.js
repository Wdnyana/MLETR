/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
    './src/components/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
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
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' },
        },
      },

      boxShadow: {},

      fontSize: {
        'fluid-xs': 'clamp(0.75rem, 0.5vw + 0.5rem, 1rem)',
        'fluid-sm': 'clamp(0.875rem, 1vw + 0.5rem, 1.125rem)',
        'fluid-base': 'clamp(1rem, 1.5vw + 0.5rem, 1.25rem)',
        'fluid-lg': 'clamp(1.25rem, 2vw + 0.5rem, 1.5rem)',
        'fluid-xl': 'clamp(1.5rem, 2.5vw + 0.5rem, 2rem)',

        h1: [
          'clamp(1.75rem, 4vw, 3rem)',
          { lineHeight: '1.1', fontWeight: '700' },
        ],
        h2: [
          'clamp(1.35rem, 3vw, 2.25rem)',
          { lineHeight: '1.2', fontWeight: '600' },
        ],
        h3: [
          'clamp(1.15rem, 2.5vw, 1.65rem)',
          { lineHeight: '1.3', fontWeight: '600' },
        ],
        h4: [
          'clamp(1rem, 1.8vw, 1.35rem)',
          { lineHeight: '1.4', fontWeight: '500' },
        ],
      },

      fontFamily: {
        'passion-one': ['Passion One', 'serif'],
        lato: ['Lato', 'serif'],
      },

      // Responsive spacing with fluid approach
      spacing: {
        'fluid-xs': 'clamp(0.5rem, 1vw, 1rem)',
        'fluid-sm': 'clamp(1rem, 2vw, 1.5rem)',
        'fluid-md': 'clamp(1.5rem, 3vw, 2rem)',
        'fluid-lg': 'clamp(2rem, 4vw, 3rem)',
        'fluid-xl': 'clamp(3rem, 5vw, 4rem)',
      },

      // Advanced grid and flex utilities
      gridTemplateColumns: {
        'auto-fit-sm': 'repeat(auto-fit, minmax(200px, 1fr))',
        'auto-fit-md': 'repeat(auto-fit, minmax(250px, 1fr))',
        'auto-fit-lg': 'repeat(auto-fit, minmax(300px, 1fr))',
      },

      gridTemplateRows: {
        layout: 'auto 1fr auto',
      },

      // Responsive container max-widths with fluid approach
      maxWidth: {
        'fluid-container': 'clamp(100%, 90vw, 1440px)',
      },

      // Enhanced gap utilities
      gap: {
        'fluid-sm': 'clamp(0.5rem, 2vw, 1rem)',
        'fluid-md': 'clamp(1rem, 3vw, 1.5rem)',
        'fluid-lg': 'clamp(1.5rem, 4vw, 2rem)',
      },
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
      blink: {
        '0%, 100%': { opacity: 1 },
        '50%': { opacity: 0 },
      },
    },
    animation: {
      'accordion-down': 'accordion-down 0.2s ease-out',
      'accordion-up': 'accordion-up 0.2s ease-out',
      'caret-blink': 'caret-blink 1.25s ease-out infinite',
    },

    screens: {
      xs: '375px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const responsiveContainer = {
        '.responsive-container': {
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: 'max(1rem, 4vw)',
          paddingRight: 'max(1rem, 4vw)',
          maxWidth: 'clamp(100%, 90vw, 1440px)',
          height: '100%',
        },
      }
      addUtilities(responsiveContainer)
    },
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('tailwindcss-animate'),
  ],
}
