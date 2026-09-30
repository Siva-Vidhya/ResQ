/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        app: {
          bg: '#FFF9F4',
          card: '#FFFFFF',
        },
        plum: {
          DEFAULT: '#2B2A4C',
          muted: '#6B6A8A',
          dark: '#1C1B33',
        },
        coral: {
          DEFAULT: '#F2677A',
          dark: '#DE5568',
          light: '#FFEAEF',
        },
        periwinkle: {
          DEFAULT: '#8FA8FF',
          light: '#F0F4FF',
        },
        pastel: {
          cream: '#FFF9F4',
          blue: '#DCEBFF',
          lavender: '#E8DEFF',
          mint: '#D8F5E6',
          peach: '#FFE3D3',
          blush: '#FFDDE8',
          butter: '#FFF2C4',
        },
        ocean: {
          DEFAULT: '#F2677A',
          dark: '#DE5568',
          light: '#E8DEFF',
        },
        sky: {
          DEFAULT: '#8FA8FF',
          light: '#DCEBFF',
        },
        teal: {
          DEFAULT: '#34C38F',
          light: '#D8F5E6',
        },
        risk: {
          safe: '#34C38F',
          clear: '#34C38F',
          low: '#F5C451',
          prone: '#F59A4A',
          danger: '#E5484D',
          flooded: '#E5484D',
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
        'brand-gradient': 'linear-gradient(135deg, #F2677A 0%, #E8DEFF 60%, #DCEBFF 100%)',
        'soft-highlight': 'linear-gradient(135deg, rgba(232, 222, 255, 0.4) 0%, rgba(220, 235, 255, 0.3) 100%)',
      },
      boxShadow: {
        soft: '0 10px 30px -5px rgba(43, 42, 76, 0.05), 0 4px 14px -2px rgba(43, 42, 76, 0.03)',
        'soft-hover': '0 16px 36px -6px rgba(43, 42, 76, 0.09), 0 6px 16px -3px rgba(43, 42, 76, 0.04)',
        'btn-primary': '0 8px 20px -4px rgba(242, 103, 122, 0.35)',
      },
    },
  },
  plugins: [],
};
