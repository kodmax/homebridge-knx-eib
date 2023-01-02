const path = require('path')

module.exports = {
    env: {
        browser: true,
        es2021: true,
        jest: true
    },
    extends: [
        'standard'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
    },
    plugins: [
        '@typescript-eslint'
    ],
    rules: {
    },
    overrides: [
        {
            files: ['*.ts'],
            extends: [],
            parserOptions: {
                project: ['./tsconfig.spec.json'],
                ecmaVersion: 'latest',
                sourceType: 'module',
                tsconfigRootDir: path.resolve(__dirname)
            },
            rules: {
                'no-useless-constructor': 'off',
                indent: ['warn', 4, { SwitchCase: 1 }],
                quotes: ['warn', 'single'],
                'no-trailing-spaces': 'warn',
                'comma-dangle': ['warn', 'never'],
                semi: ['warn', 'never'],
                'eol-last': ['warn', 'always'],
                'no-empty-pattern': 'off',
                'max-len': ['warn', 160],
                'no-whitespace-before-property': 'off',
                'padded-blocks': 'off',
                'multiline-ternary': 'off',
                'arrow-parens': ['warn', 'as-needed'],
                'prefer-arrow-callback': 'warn',
                camelcase: 'off',
                'no-mixed-operators': 'off',
                '@typescript-eslint/triple-slash-reference': 'off',
                '@typescript-eslint/indent': ['warn', 4, { SwitchCase: 1 }],
                '@typescript-eslint/quotes': ['warn', 'single'],
                '@typescript-eslint/comma-dangle': ['warn', 'only-multiline'],
                '@typescript-eslint/semi': ['warn', 'never'],
                '@typescript-eslint/restrict-template-expressions': 'off',
                '@typescript-eslint/no-unused-vars': 'warn',
                '@typescript-eslint/no-empty-interface': 'off',
                '@typescript-eslint/member-delimiter-style': ['warn', {
                    multiline: {
                        delimiter: 'none',
                        requireLast: true
                    },
                    singleline: {
                        delimiter: 'semi',
                        requireLast: false
                    },
                    multilineDetection: 'brackets'
                }],
                '@typescript-eslint/consistent-type-definitions': 'off',
                '@typescript-eslint/promise-function-async': 'warn',
                '@typescript-eslint/strict-boolean-expressions': 'off',
                'no-void': 'off',
                '@typescript-eslint/prefer-function-type': 'off',
                '@typescript-eslint/restrict-plus-operands': 'off',
                '@typescript-eslint/no-non-null-assertion': 'off',
                '@typescript-eslint/return-await': 'off',
                'dot-notation': 'off'
            }
        },
        {
            files: ['*.js'],
            extends: [
            ],
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module'
            },
            rules: {
                indent: ['warn', 4, { SwitchCase: 1 }],
                quotes: ['warn', 'single'],
                'no-trailing-spaces': 'warn',
                'comma-dangle': ['warn', 'never'],
                semi: ['warn', 'never'],
                'eol-last': ['warn', 'always'],
                'no-empty-pattern': 'off',
                'max-len': ['warn', 160],
                'no-whitespace-before-property': 'off',
                'padded-blocks': 'off',
                'multiline-ternary': 'off',
                'arrow-parens': ['warn', 'as-needed'],
                'prefer-arrow-callback': 'warn',
                'no-void': 'off'
            }
        }
    ]
}
