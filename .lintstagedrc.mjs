export default {
  '*/**/*.{ts,tsx}': [
    'prettier -w -l -u',
    'eslint --fix',
    () => 'tsc -p ./tsconfig.app.json --noEmit ',
  ],
  '*.{css,scss}': ['stylelint --fix'],
  '*.{css,scss,json,md,html}': ['prettier -w -l -u'],
};
