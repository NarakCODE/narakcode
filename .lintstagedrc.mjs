import path from "path";

// ESLint 9 flat config with lint-staged
const buildEslintCommand = (filenames) =>
  `eslint ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" ")}`;

/**
 * @type {import('lint-staged').Configuration}
 */
const lintStagedConfig = {
  "*.{js,jsx,ts,tsx}": [buildEslintCommand, "prettier --write"],
  "*.mdx": "prettier --write",
};

export default lintStagedConfig;
