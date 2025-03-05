const { join } = require('path');
const { heroui } = require('@heroui/theme');
const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    '../../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#569ee2',
        'brand-primary-hover': '#3391fe',
        'brand-primary-pressed': '#126eda',
        'brand-primary-transparent': '#167bf140',
        'brand-primary-transparent-hover': '#3391fe',
        'brand-secondary': '#b6393a',
        'brand-danger': '#db4e5c',
        'brand-success': '#099232',
        'text-primary': '#181818',
        'text-secondary': '#7e858a',
        'text-tertiary': '#edf0f3',
        'text-foreground': '#ffffff',
        'background-primary': '#f3f5f7',
        'background-secondary': '#ffffff',
        'background-tertiary': '#f1f2f4',
        'background-primary-transparent': '#167bf140',
        'background-elevated': '#ffffff',
        'background-elevated-shadow': '#1a456d10',
        'status-danger': '#d83a4a',
        'status-success': '#3dc55b',
        'status-warning': '#feb62b',
      },
    },
  },
  darkMode: 'class',
  plugins: [heroui()],
};
