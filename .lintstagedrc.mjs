export default {
  '*/**/*.{ts,tsx}': [
    'npm run format',
    'eslint',
    () => 'tsc -p ./tsconfig.app.json --noEmit ',
  ],
  '*/**/*.{css,scss}': ['npm run format'],
  '*.{json,md}': ['npm run format'],
};
