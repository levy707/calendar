const isProduction = process.env.NODE_ENV === 'production';
const path = require('path');

const { resolve } = path;

module.exports = {
    root: true,
    env: {
        node: true,
        es6: true,
        jest: true,
    },
    extends: [
        'airbnb-base',
        'plugin:vue/recommended',
        'eslint:recommended',
        'plugin:prettier/recommended',
    ],
    parserOptions: {
        parser: '@babel/eslint-parser',
        requireConfigFile: false,
    },
    settings: {
        'import/resolver': {
            webpack: {
                config: {
                    resolve: {
                        extensions: ['.js', '.vue', '.css', '.scss'],
                        alias: {
                            '@': resolve(__dirname, './src'),
                        },
                    },
                },
            },
        },
    },
    rules: {
        'prettier/prettier': isProduction ? 0 : 2,
        'import/prefer-default-export': 'off',
        'max-len': [
            'error',
            {
                code: 100,
                ignorePattern:
                    '(^import.+)|(^const.\\w+.=.require\\(.+)|((^|\\s*)(describe|it)\\(.+)',
            },
        ],
        'vue/no-v-html': ['off'],
        'vue/component-name-in-template-casing': ['error', 'PascalCase'],
        'no-console': 'off',
        'no-debugger': isProduction ? 'error' : 'off',
        'object-curly-newline': 0,
        'arrow-parens': ['error', 'as-needed', { requireForBlockBody: false }],
        'func-names': ['warn', 'never'],
        'import/no-extraneous-dependencies': 0,
        'import/no-unresolved': 'error',
        'no-param-reassign': ['error', { props: false }],
        'consistent-return': 0,
        indent: ['error', 4, { SwitchCase: 1 }],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
        'import/extensions': ['error', 'ignorePackages', { '': 'never' }],
        camelcase: ['off'],
        'vue/multiline-html-element-content-newline': ['error'],
        'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
        'vue/no-unused-properties': [
            'error',
            {
                groups: ['props', 'data', 'computed', 'methods'],
            },
        ],
        'vue/v-slot-style': [
            'error',
            {
                atComponent: 'shorthand',
            },
        ],
        'vue/padding-line-between-blocks': ['error', 'always'],
        'vue/v-on-function-call': ['error', 'always'],
        'vue/multi-word-component-names': ['off'],
        'padding-line-between-statements': [
            'error',
            {
                blankLine: 'always',
                prev: '*',
                next: ['return', 'function', 'multiline-block-like'],
            },
            {
                blankLine: 'always',
                prev: ['const', 'let', 'var', 'multiline-block-like'],
                next: '*',
            },
            {
                blankLine: 'any',
                prev: ['const', 'let', 'var'],
                next: ['const', 'let', 'var'],
            },
        ],
        curly: ['error', 'all'],
    },
    overrides: [
        {
            files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
            env: {
                jest: true,
            },
        },
    ],
};
