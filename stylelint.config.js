/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-clean-order'],
  ignoreFiles: ['**/dist/**', '**/build/**', '**/coverage/**', '**/*.min.css'],
};
