export default {
  '*/**/*.{ts,tsx}': [
    'npm run format',
    'eslint',
    () => 'tsc -p ./tsconfig.app.json --noEmit ',
  ],
  '*.{css,scss,json,md,html}': ['npm run format'],
};
