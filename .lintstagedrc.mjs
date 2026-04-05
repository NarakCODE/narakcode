/**
 * @type {import('lint-staged').Configuration}
 */
const lintStagedConfig = {
  "*.{js,jsx,ts,tsx,mdx}": "prettier --write",
};

export default lintStagedConfig;
