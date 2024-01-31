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
    'no-alert': 'off',
    'no-use-before-define': 'off',
  },
};
