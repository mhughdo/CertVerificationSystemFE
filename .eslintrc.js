module.exports = {
  root: true,
  extends: ["plugin:@typescript-eslint/recommended", "airbnb-typescript", "plugin:@typescript-eslint/recommended", "plugin:@typescript-eslint/recommended-requiring-type-checking", 'airbnb', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: `./tsconfig.json`,
  },
  env: {
    browser: true,
    node: true,
    jquery: true,
    jest: true,
  },
  rules: {
    'no-debugger': 0,
    'no-alert': 0,
    'no-await-in-loop': 0,
    'no-return-assign': ['error', 'except-parens'],
    'no-restricted-syntax': [
      2,
      'ForInStatement',
      'LabeledStatement',
      'WithStatement',
    ],
    'no-unused-vars': [
      1,
      {
        ignoreRestSiblings: true,
        argsIgnorePattern: 'res|next|^err',
      },
    ],
    'prefer-const': [
      'error',
      {
        destructuring: 'all',
      },
    ],
    'arrow-body-style': [2, 'as-needed'],
    'no-unused-expressions': [
      2,
      {
        allowTaggedTemplates: true,
      },
    ],
    'no-param-reassign': [
      2,
      {
        props: false,
      },
    ],
    'no-console': 0,
    'import/prefer-default-export': 0,
    import: 0,
    'func-names': 0,
    'space-before-function-paren': 0,
    'comma-dangle': 0,
    'max-len': 0,
    'import/extensions': 0,
    'no-underscore-dangle': 0,
    'consistent-return': 0,
    'react/display-name': 1,
    'react/no-array-index-key': 0,
    'react/react-in-jsx-scope': 0,
    'react/prefer-stateless-function': 0,
    'react/forbid-prop-types': 0,
    'react/no-unescaped-entities': 0,
    'jsx-a11y/accessible-emoji': 0,
    'react/require-default-props': 0,
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.mdx'],
      },
    ],
    radix: 0,
    'no-shadow': [
      0,
      {
        hoist: 'all',
        allow: ['resolve', 'reject', 'done', 'next', 'err', 'error'],
      },
    ],
    quotes: [
      2,
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ],
    'jsx-a11y/href-no-hash': 'off',
    'jsx-a11y/anchor-is-valid': [
      'warn',
      {
        aspects: ['invalidHref'],
      },
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'es5',
        singleQuote: true,
        printWidth: 120,
        tabWidth: 2,
        jsxSingleQuote: true,
        semi: false,
        eslintIntegration: true,
        jsxBracketSameLine: true,
        bracketSpacing: true,
        proseWrap: 'always',
      },
    ],
    "import/no-unresolved": 0,
    'semi': 0,
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-inferrable-types": [
      "warn",
      {
        "ignoreParameters": true
      }
    ],
    "@typescript-eslint/no-unused-expressions": [
      2,
      {
        "allowTaggedTemplates": true
      }
    ],
    "@typescript-eslint/quotes": [
      2,
      "single",
      {
        "avoidEscape": true,
        "allowTemplateLiterals": true
      }
    ],
    "@typescript-eslint/no-unused-vars": [
      1,
      {
        "ignoreRestSiblings": true,
        "argsIgnorePattern": "res|next|^err"
      }
    ],
    "@typescript-eslint/return-await": "off",
    "@typescript-eslint/semi": "off",
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/member-delimiter-style": "off",
    "@typescript-eslint/no-floating-promises": 0,
    "@typescript-eslint/no-unsafe-member-access": 0,
    "@typescript-eslint/comma-dangle": 0,
    "@typescript-eslint/restrict-template-expressions": 0,
    "@typescript-eslint/no-unsafe-assignment": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/no-shadow": 0,
    "react/jsx-props-no-spreading": 0,
    "@typescript-eslint/no-unsafe-call": 1,
    "react/prop-types": 0,
    "@typescript-eslint/no-unsafe-call": 0,
  },
  plugins: ['html', 'prettier', 'react-hooks', '@typescript-eslint'],
};
