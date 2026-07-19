/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // "Case file / evidence room" palette — charcoal surfaces, steel-blue
        // as the primary signal color, muted (not neon) severity colors.
        bg: '#14181D',
        surface: '#1D2229',
        'surface-alt': '#262C35',
        border: '#37404B',
        'text-hi': '#EDEFF2',
        'text-lo': '#93A0AC',
        accent: {
          DEFAULT: '#4A90A4',
          dim: '#3A7285',
        },
        gold: '#C98A3B',
        critical: '#C1443C',
        verified: '#4F9D69',
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        // Deliberately tight radii throughout — evidence tags/labels, not
        // soft SaaS-app blobs.
        DEFAULT: '3px',
        sm: '2px',
        md: '4px',
      },
    },
  },
  plugins: [],
};
