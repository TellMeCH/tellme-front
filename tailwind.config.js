const { join } = require('path');
const { heroui } = require('@heroui/theme');
const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, '{src,pages,components,apps,libs}/**/*!(*.stories|*.spec).{ts,tsx,html}'),
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
        'brand-tertiary': '#ee7016',
        'brand-danger': '#db4e5c',
        'brand-danger-hover': '#d83a4a',
        'brand-danger-pressed': '#c02434',
        'brand-success': '#099232',
        'brand-background': '#f2f1ef',
        'text-primary': '#181818',
        'text-secondary': '#7e858a',
        'text-tertiary': '#edf0f3',
        'text-foreground': '#ffffff',
        'text-control': '#b1b1b1',
        'background-primary': '#f3f5f7',
        'background-secondary': '#ffffff',
        'background-tertiary': '#f1f2f4',
        'background-primary-transparent': '#167bf140',
        'background-elevated': '#ffffff',
        'background-elevated-shadow': '#1a456d10',
        'background-landing': '#fbfaf9',
        'status-danger': '#d83a4a',
        'status-success': '#3dc55b',
        'status-warning': '#feb62b',
        'control-primary': '#62aaed',
        'control-primary-transparent': '#e0eefb',
        'control-secondary': '#bec9d4',
        'control-secondary-transparent': '#bec9d430',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            danger: '#db4e5c',
            primary: '#569ee2',
          },
        },
      },
    }),
  ],
};
