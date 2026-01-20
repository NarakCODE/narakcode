/**
 * @type {import('lint-staged').Configuration}
 */
const lintStagedConfig = {
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.mdx": "prettier --write",
};

export default lintStagedConfig;

// "lint-staged": {
//   "./src/**/*.{ts,tsx}": [
//     "eslint --fix",
//     "prettier --write"
//   ],
//   "./src/**/*.mdx": "prettier --write"
// },
