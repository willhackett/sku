module.exports = {
  // See: https://github.com/babel/babel-eslint/issues/192
  ecmaFeatures: {
    modules: true
  },
  env: {
    browser: true
  },
  rules: {
    // React
    'react/display-name': 0,
    'react/forbid-prop-types': 0,
    'react/no-comment-textnodes': 0,
    'react/no-danger': 2,
    'react/no-deprecated': 2,
    'react/no-did-mount-set-state': 2,
    'react/no-did-update-set-state': 2,
    'react/no-direct-mutation-state': 2,
    'react/no-is-mounted': 2,
    'react/no-multi-comp': [2, { ignoreStateless: true }],
    'react/no-render-return-value': 2,
    'react/no-set-state': 0,
    'react/no-string-refs': 2,
    'react/no-unknown-property': 2,
    'react/prefer-es6-class': [2, 'always'],
    'react/prefer-stateless-function': 0, // 2,
    'react/prop-types': 2,
    'react/react-in-jsx-scope': 2,
    'react/require-extension': 0,
    'react/require-optimization': 0,
    'react/require-render-return': 2,
    'react/self-closing-comp': 2,
    'react/sort-comp': 2,
    'react/sort-prop-types': 0,
    'react/jsx-wrap-multilines': 2,

    'react/jsx-boolean-value': 0,
    'react/jsx-closing-bracket-location': [
      2,
      { selfClosing: 'tag-aligned', nonEmpty: 'after-props' }
    ],
    'react/jsx-curly-spacing': 0, // [2, "never", { "allowMultiline": false }],
    'react/jsx-equals-spacing': [2, 'never'],
    'react/jsx-filename-extension': [2, { extensions: ['.js'] }],
    'react/jsx-first-prop-new-line': [2, 'multiline'],
    'react/jsx-handler-names': 0, // 2,
    'react/jsx-indent': [2, 2],
    'react/jsx-indent-props': [2, 2],
    'react/jsx-key': 2,
    'react/jsx-max-props-per-line': 0,
    'react/jsx-no-bind': 2,
    'react/jsx-no-duplicate-props': 2,
    'react/jsx-no-literals': 0,
    'react/jsx-no-target-blank': 2,
    'react/jsx-no-undef': 2,
    'react/jsx-pascal-case': 2,
    'react/jsx-sort-props': 0,
    'react/jsx-space-before-closing': [2, 'always'],
    'react/jsx-uses-react': 2,
    'react/jsx-uses-vars': 2
  },
  plugins: ['react', 'css-modules'],
  extends: ['plugin:css-modules/recommended']
};
