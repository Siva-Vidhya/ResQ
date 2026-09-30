/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        app: {
          bg: '#F5F9FF',
          card: '#FFFFFF',
        },
        ocean: {
          DEFAULT: '#2563EB',
          dark: '#1D4ED8',
          light: '#EFF6FF',
        },
        sky: {
          DEFAULT: '#0EA5E9',
          light: '#E0F2FE',
        },
        teal: {
          DEFAULT: '#14B8A6',
          light: '#CCFBF1',
        },
        risk: {
          safe: '#22C55E',
          prone: '#F59E0B',
          danger: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        card: '20px',
        '2xl': '20px',
        '3xl': '20px',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 55%, #14B8A6 100%)',
        'soft-highlight': 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(14, 165, 233, 0.08) 50%, rgba(20, 184, 166, 0.08) 100%)',
      },
      boxShadow: {
        soft: '0 10px 30px -5px rgba(37, 99, 235, 0.07), 0 4px 14px -2px rgba(15, 23, 42, 0.05)',
        'soft-hover': '0 16px 36px -6px rgba(37, 99, 235, 0.13), 0 6px 16px -3px rgba(15, 23, 42, 0.06)',
        'btn-primary': '0 10px 24px -4px rgba(37, 99, 235, 0.35)',
      },
    },
  },
  plugins: [],
};
