module.exports = {
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:security/recommended",
    "plugin:sonarjs/recommended"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  plugins: [
    "security",
    "sonarjs",
    "@typescript-eslint",
    "promise"
  ],
  rules: {
    // Security Rules
    "security/detect-object-injection": "error",
    "security/detect-non-literal-regexp": "error",
    "security/detect-non-literal-require": "error",
    "security/detect-eval-with-expression": "error",
    "security/detect-no-csrf-before-method-override": "error",
    "security/detect-possible-timing-attacks": "error",
    "security/detect-pseudoRandomBytes": "error",
    
    // Code Quality Rules
    "prefer-const": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "no-console": "warn",
    "no-debugger": "error",
    "no-alert": "error",
    
    // TypeScript Rules
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/no-non-null-assertion": "warn",
    
    // Security Headers Rules
    "sonarjs/cognitive-complexity": ["warn", 10],
    "sonarjs/max-switch-cases": ["warn", 30],
    "sonarjs/no-identical-functions": "warn",
    "sonarjs/no-duplicate-string": "warn",
    
    // Promise Rules
    "promise/always-return": "error",
    "promise/no-return-wrap": "error",
    "promise/param-names": "error",
    "promise/catch-or-return": "error",
    "promise/no-nesting": "warn"
  },
  overrides: [
    {
      "files": ["**/*.test.{ts,tsx}"],
      "env": {
        "jest": true
      },
      "rules": {
        "security/detect-object-injection": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "no-console": "off"
      }
    },
    {
      "files": ["scripts/**/*.{js,ts}"],
      "env": {
        "node": true
      },
      "rules": {
        "security/detect-object-injection": "off"
      }
    }
  ],
  ignorePatterns: [
    "node_modules/",
    "coverage/",
    "dist/",
    "build/",
    ".next/",
    "out/",
    "*.config.js",
    "*.config.ts"
  ]
};