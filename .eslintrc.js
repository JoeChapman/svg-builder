module.exports = {
  'parser': '@typescript-eslint/parser', // Specifies the ESLint parser
  'parserOptions': {
    'ecmaVersion': 2020, // Allows for the parsing of modern ECMAScript features
    'sourceType': 'module', // Allows for the use of imports
  },
  'env': {
    'jest': true,
  },
  'extends': [
    'plugin:@typescript-eslint/recommended',
  ],
  'rules': {
    'no-console': 'warn',
    'no-eval': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'object-property-newline': ['error', { 'allowAllPropertiesOnSameLine': false }],
    'no-multiple-empty-lines': [
      'error', {
        'max': 2,
        'maxEOF': 0,
      },
    ],
    'indent': [2, 2],
    'eol-last': ['error', 'always'],
    'padded-blocks': ['error', 'never', { 'allowSingleLineBlocks': false }],
    'quotes': [1, 'single'],
    'comma-dangle': ['error', 'always-multiline'],
    'semi': ['error', 'always'],
    '@typescript-eslint/no-non-null-assertion': 'off',
    'object-curly-spacing': ['error', 'always'],
    'object-curly-newline': ['error', {
      'ImportDeclaration': {
        'multiline': true,
        'minProperties': 2,
      },
      'ExportDeclaration': {
        'multiline': true,
        'minProperties': 1 ,
      },
    }],
  },
};
