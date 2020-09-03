module.exports = {
  globals: {
    __PATH_PREFIX__: true,
  },
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    'eslint:recommended',
    // 'plugin:@typescript-eslint/recommended',
    // 'prettier/@typescript-eslint',
    // 'plugin:prettier/recommended',
  ],
  env: {
    browser: false,
    node: true,
    es6: true,
    jest: true,
  },
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-console': 'off',
    'no-unused-vars': 'off',
  },
  overrides: [
    // Override some TypeScript rules just for .js files
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off', //
      },
    },
  ],
};
