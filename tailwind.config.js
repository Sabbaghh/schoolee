/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export const darkMode = ['class'];
export const content = [
  './app/**/*.{ts,tsx}',
  './components/**/*.{ts,tsx}',
  './src/**/*.{ts,tsx}', // (optional if you have src folder)
];
export const theme = {
  extend: {
    fontFamily: {
      primary: ['var(--font-primary)', ...defaultTheme.fontFamily.sans],
    },
  },
};
export const plugins = [];
