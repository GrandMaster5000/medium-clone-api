module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    "eslint:recommended",
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:prettier/recommended"
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    "@typescript-eslint/explicit-function-return-type": [
			"warn"
		],
    "@typescript-eslint/no-unused-vars": [
			"off"
		],
    "@typescript-eslint/no-empty-interface": 'off',
    "prettier/prettier": [
			"error",
			{
				"singleQuote": true,
				"useTabs": true,
				"semi": true,
				"trailingComma": "all",
				"bracketSpacing": true,
				"printWidth": 100,
				"endOfLine": "auto"
			}
		]
  },
};
