/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#02040a',
          900: '#050c16',
          800: '#0a1628',
          700: '#0f2040',
          600: '#1a3a6b',
        },
        flame: {
          50:  '#fff8f0',
          100: '#ffecd1',
          200: '#ffd4a3',
          300: '#ffb56b',
          400: '#ff8c2a',
          500: '#ff6b00',
          600: '#e55300',
          700: '#c43d00',
          800: '#9c3000',
          900: '#7a2600',
        },
        ember: {
          400: '#ff4500',
          500: '#e63e00',
        },
        glow: {
          blue:   '#00cfff',
          purple: '#7c3aed',
          green:  '#10b981',
          gold:   '#f59e0b',
        }
      },
      fontFamily: {
        sans:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:    ['"DM Mono"', 'monospace'],
        serif:   ['"Source Serif 4"', 'Georgia', 'serif'],
        display: ['"Source Serif 4"', 'Orbitron', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'starfield': 'radial-gradient(ellipse at center, #0a1628 0%, #02040a 100%)',
      },
      animation: {
        'flame-flicker': 'flicker 2s ease-in-out infinite alternate',
        'pulse-glow':    'pulseGlow 3s ease-in-out infinite',
        'float':         'float 6s ease-in-out infinite',
        'orbit':         'orbit 20s linear infinite',
        'fade-up':       'fadeUp 0.6s ease-out forwards',
        'scan-line':     'scanLine 3s linear infinite',
      },
      keyframes: {
        flicker: {
          '0%':   { opacity: '1',    transform: 'scaleY(1)' },
          '25%':  { opacity: '0.95', transform: 'scaleY(1.02) scaleX(0.98)' },
          '50%':  { opacity: '0.9',  transform: 'scaleY(0.98) scaleX(1.01)' },
          '75%':  { opacity: '0.97', transform: 'scaleY(1.01) scaleX(0.99)' },
          '100%': { opacity: '1',    transform: 'scaleY(1)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,107,0,0.3)' },
          '50%':      { boxShadow: '0 0 40px rgba(255,107,0,0.6), 0 0 80px rgba(255,107,0,0.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-15px)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scanLine: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        orbit: {
          '0%':   { transform: 'rotate(0deg) translateX(120px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(120px) rotate(-360deg)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
