module.exports = {
	root: true,
	extends: ['airbnb', 'airbnb-typescript', 'plugin:prettier/recommended'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: './tsconfig.json',
	},
	rules: {
		'absolute-imports-only/only-absolute-imports': 'off',
	},
};
