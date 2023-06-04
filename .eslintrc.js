module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: { jsx: true },
    jsx: true,
    useJSXTextNode: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', '@unocss', 'plugin:prettier/recommended'],
  plugins: ['@typescript-eslint', 'import', 'prettier'],
  rules: {
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type', 'unknown'],
      },
    ],
    'no-sparse-arrays': 0,
  },
}
