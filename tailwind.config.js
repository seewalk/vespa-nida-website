/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // App Router paths (your current structure)
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    
    // Pages Router paths (backup compatibility)
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    
    // Src folder paths (if you ever move to src structure)
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
      },
    },
    extend: {
      colors: {
        'ivory-white': '#F9F7F1',
        'graphite-black': '#2B2B2B',
        'sage-green': '#9AA89C',
        'sand-beige': '#E9DCC9',
        'chrome-silver': '#B0B0B0',
      },
      fontFamily: {
        sans: [
          'var(--font-inter)', 
          'Inter', 
          'Helvetica Neue', 
          'ui-sans-serif', 
          'system-ui', 
          'sans-serif'
        ],
        syne: [
          'var(--font-syne)', 
          'Syne', 
          'serif'
        ],
        playfair: [
          'var(--font-playfair)', 
          'Playfair Display', 
          'serif'
        ],
      },
    },
  },
  plugins: [],
}