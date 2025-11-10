// eslint.config.js
module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  extends: ['eslint:recommended', 'prettier'],
  rules: {
    // Customize rules as needed
    'no-unused-vars': 'warn',
    'no-console': 'off', // Allow console logs for debugging
    'prefer-const': 'warn',
    eqeqeq: ['error', 'always'],
  },
  ignorePatterns: ['node_modules/', 'dist/', '*.config.js'],
};
