module.exports = {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  bracketSpacing: true,
  arrowParens: 'always',
  proseWrap: 'preserve',
  printWidth: 120,
  overrides: [
    {
      files: ['*.vue'],
      options: {
        parser: 'vue',
      },
    },
    {
      files: ['*.js'],
      options: {
        parser: 'babel',
      },
    },
    {
      files: ['*.json'],
      options: {
        parser: 'json',
      },
    },
    {
      files: ['*.scss'],
      options: {
        parser: 'scss',
      },
    },
  ],
};
