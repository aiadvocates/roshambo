// .eslintrc.js
module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  parserOptions: { ecmaVersion: 8 }, // to enable features such as async/await
  extends: ["eslint:recommended", "plugin:tailwind/recommended"],
  overrides: [
    // This configuration will apply only to TypeScript files
    {
      files: ["**/*.ts", "**/*.tsx"],
      parser: "@typescript-eslint/parser",
      settings: { react: { version: "detect" } },
      env: {
        browser: true,
        node: true,
        es6: true,
      },
      extends: [
        "plugin:tailwind/recommended",
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended", // TypeScript rules
        "plugin:react/recommended", // React rules
        "plugin:react-hooks/recommended", // React hooks rules
        "plugin:jsx-a11y/recommended", // Accessibility rules
        "plugin:prettier/recommended", // Prettier plugin
      ],
      rules: {
        "prettier/prettier": ["error", {}, { usePrettierrc: true }], // Includes .prettierrc.js rules

        // We will use TypeScript's types for component props instead
        "react/prop-types": "off",

        // No need to import React when using Next.js
        "react/react-in-jsx-scope": "off",
        "react/no-unescaped-entities": "off",

        // This rule is not compatible with Next.js's <Link /> components
        "jsx-a11y/anchor-is-valid": "off",
        "jsx-a11y/no-static-element-interactions": "off",
        "jsx-a11y/click-events-have-key-events": "off",

        // Why would you want unused vars?
        "@typescript-eslint/no-unused-vars": ["error"],

        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-non-null-asserted-optional-chain": "off",

        // I suggest this setting for requiring return types on functions only where useful
        "@typescript-eslint/explicit-function-return-type": [
          "warn",
          {
            allowExpressions: true,
            allowConciseArrowFunctionExpressionsStartingWithVoid: true,
          },
        ],
      },
    },
  ],
};
