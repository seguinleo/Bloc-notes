module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  ignorePatterns: ['*.min.js'],
  rules: {
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'no-alert': 'off',
    'no-restricted-globals': 'off',
    'no-use-before-define': 'off',
    'no-undef': 'off',
  },
};
