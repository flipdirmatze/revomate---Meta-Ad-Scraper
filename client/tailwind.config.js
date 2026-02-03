/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          800: '#1E293B',
          900: '#0F172A',
        },
        accent: {
          emerald: '#10B981',
          blue: '#3B82F6',
          purple: '#8B5CF6',
        },
        background: '#FAFAFA',
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'btn': '12px',
        'card': '16px',
        'lg-card': '24px',
      },
      boxShadow: {
        'card': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'card-hover': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        revomate: {
          "primary": "#0F172A",
          "primary-content": "#ffffff",
          "secondary": "#1E293B",
          "secondary-content": "#ffffff",
          "accent": "#3B82F6",
          "accent-content": "#ffffff",
          "neutral": "#475569",
          "neutral-content": "#ffffff",
          "base-100": "#FAFAFA",
          "base-200": "#F8FAFC",
          "base-300": "#E2E8F0",
          "base-content": "#0F172A",
          "info": "#3B82F6",
          "success": "#10B981",
          "warning": "#F59E0B",
          "error": "#EF4444",
        },
      },
    ],
  },
}
