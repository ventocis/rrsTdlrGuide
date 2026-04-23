/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // All colors are CSS variables in src/styles/global.css — update there.
        'proto-teal': 'var(--proto-teal)',
        'proto-teal-dark': 'var(--proto-teal-dark)',
        'proto-teal-bg': 'var(--proto-teal-bg)',
        'proto-teal-border': 'var(--proto-teal-border)',
        'proto-page-bg': 'var(--proto-page-bg)',
        'proto-card-border': 'var(--proto-card-border)',
        'proto-text': 'var(--proto-text)',
        'proto-text-muted': 'var(--proto-text-muted)',
        'proto-text-light': 'var(--proto-text-light)',
        'proto-header-from': 'var(--proto-header-from)',
        'proto-header-to': 'var(--proto-header-to)',
      },
      fontFamily: {
        sans: ["'DM Sans'", 'system-ui', 'sans-serif'],
        heading: ["'Outfit'", 'sans-serif'],
        body: ["'Inter'", 'sans-serif'],
      },
    },
  },
  plugins: [],
};
