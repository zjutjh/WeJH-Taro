/**
 * @type {import('lint-staged').Config}
 */
export default {
  "*.{(m)ts,(m)js,vue,css,scss,json,html}": ["pnpm run lint"],
  "*": ["cspell"]
};
