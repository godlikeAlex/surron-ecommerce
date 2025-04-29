export default {
  '*/**/*.{ts,tsx}': [
    'npx prettier -w',
    'eslint',
    () => 'tsc -p ./tsconfig.app.json --noEmit ',
  ],
};
