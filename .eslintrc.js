module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.eslint.json',
        tsconfigRootDir: __dirname,
    },
    plugins: ['@typescript-eslint', 'react', 'react-hooks'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'airbnb',
    ],
    settings: {
        react: { version: 'detect' },
        'import/resolver': {
            typescript: {
                alwaysTryTypes: true,
                project: './tsconfig.eslint.json',
            },
        },
    },
    rules: {
        // React / JSX
        'react/jsx-indent': [2, 4],
        'react/jsx-indent-props': [2, 4],
        'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.tsx'] }],
        'react/jsx-props-no-spreading': 'warn',
        'react/react-in-jsx-scope': 'off',
        'react/require-default-props': 'off',
        'react/function-component-definition': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'error',
        'react/prop-types': 'off',
        'react/no-array-index-key': 'warn',

        // Accessibility
        'jsx-a11y/click-events-have-key-events': 'warn',
        'jsx-a11y/no-static-element-interactions': 'warn',

        // TypeScript
        '@typescript-eslint/no-unused-vars': 'warn',

        // Отключаем стандартное правило indent
        indent: 'off',

        // Import / Airbnb
        'import/no-unresolved': 'off',
        'import/extensions': 'off',
        'import/no-extraneous-dependencies': 'off',
        'import/prefer-default-export': 'off',

        // Code style
        'no-tabs': ['error', { allowIndentationTabs: true }],
        'max-len': ['error', { code: 200, ignoreComments: true }],
        'linebreak-style': ['error', process.platform === 'win32' ? 'windows' : 'unix'],
        'no-shadow': 'off',
        'no-unused-vars': 'off',
        'no-param-reassign': 'off',
        'no-undef': 'off',
        'no-underscore-dangle': 'off',
        'no-plusplus': 'off',
    },
    globals: {
        __IS_DEV__: 'readonly',
    },
    ignorePatterns: ['node_modules/', 'dist/', 'build/'],
};
