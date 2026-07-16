/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-display)', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        signal: {
          DEFAULT: '#9A3412',
          dim: '#7C2D12',
        },
        cream: '#FFFCF8',
        clay: {
          50: '#FBF6F1',
          200: '#EADDCE',
          400: '#A89684',
          500: '#8A7663',
          600: '#5F4F41',
          900: '#221A14',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.clay.600'),
            '--tw-prose-headings': theme('colors.clay.900'),
            '--tw-prose-links': theme('colors.signal.DEFAULT'),
            '--tw-prose-bold': theme('colors.clay.900'),
            '--tw-prose-counters': theme('colors.clay.500'),
            '--tw-prose-bullets': theme('colors.clay.200'),
            '--tw-prose-hr': theme('colors.clay.200'),
            '--tw-prose-quotes': theme('colors.clay.900'),
            '--tw-prose-quote-borders': theme('colors.signal.DEFAULT'),
            '--tw-prose-code': theme('colors.clay.900'),
            '--tw-prose-pre-bg': theme('colors.clay.900'),
            '--tw-prose-pre-code': theme('colors.clay.50'),
            maxWidth: 'none',
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
