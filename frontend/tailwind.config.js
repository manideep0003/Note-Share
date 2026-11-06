/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm Ivory system
        ivory: {
          50: '#FCFBF9',
          100: '#F7F5F0', // Primary Page Background
          200: '#EFECE3', // Subtle Card Surface / Borders
          300: '#E3DFD3', // Inactive Elements / Subtle Dividers
          400: '#D5D0C2',
          500: '#BDB6A4',
        },
        // Deep Academic Navy
        navy: {
          50: '#F0F4FA',
          100: '#E2E9F4',
          200: '#C5D4E8',
          300: '#9DB8D9',
          400: '#6B94C5',
          500: '#3D6FA8',
          600: '#2C5588',
          700: '#23446C',
          800: '#1C3657',
          900: '#172B4D', // Primary Academic Navy
          950: '#0F1C33', // Deepest Slate Contrast
        },
        // Muted Blue Accent
        academicBlue: {
          50: '#F1F6FB',
          100: '#E1EDF7',
          200: '#C2DBEE',
          300: '#93C0E1',
          400: '#5D9FD1',
          500: '#3A82BF',
          600: '#2967A2',
          700: '#225283',
          800: '#1E466E',
          900: '#1D3B5C',
        },
        // Soft Sage Secondary
        sage: {
          50: '#F4F7F4',
          100: '#E4EBE4', // Soft Sage Accent
          200: '#CAD8CA',
          300: '#A7BFA7',
          400: '#81A382',
          500: '#5B7F67', // Balanced Sage
          600: '#486652',
          700: '#3B5142',
          800: '#314237',
          900: '#2A372E',
        },
        // Soft Lavender Secondary
        lavender: {
          50: '#F7F6FB',
          100: '#E8E6F2', // Soft Lavender Accent
          200: '#D4D0E7',
          300: '#B8B1D7',
          400: '#9B8FC5',
          500: '#8F85C7', // Refined Academic Lavender
          600: '#7568B0',
          700: '#5F5294',
          800: '#4F447B',
          900: '#423A65',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'academic-sm': '0 1px 2px 0 rgba(23, 43, 77, 0.04)',
        'academic': '0 2px 6px -1px rgba(23, 43, 77, 0.06), 0 8px 16px -2px rgba(23, 43, 77, 0.04)',
        'academic-md': '0 4px 12px -2px rgba(23, 43, 77, 0.08), 0 12px 24px -4px rgba(23, 43, 77, 0.06)',
        'academic-lg': '0 8px 24px -4px rgba(23, 43, 77, 0.1), 0 20px 32px -6px rgba(23, 43, 77, 0.08)',
        // Restrained claymorphic shadow (dual light/dark soft shadows)
        'clay': '4px 4px 10px rgba(23, 43, 77, 0.05), -4px -4px 10px rgba(255, 255, 255, 0.85)',
        'clay-hover': '6px 6px 14px rgba(23, 43, 77, 0.08), -5px -5px 12px rgba(255, 255, 255, 0.95)',
        'clay-inset': 'inset 2px 2px 5px rgba(23, 43, 77, 0.05), inset -2px -2px 5px rgba(255, 255, 255, 0.75)',
        'clay-btn': '3px 3px 6px rgba(23, 43, 77, 0.08), -2px -2px 6px rgba(255, 255, 255, 0.9)',
      },
      borderRadius: {
        'academic': '10px',
        'academic-lg': '14px',
        'academic-xl': '18px',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
