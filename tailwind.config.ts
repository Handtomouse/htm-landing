import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bb-orange': '#FF9D23',
      },
      fontFamily: {
        'vt323': ['VT323', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
