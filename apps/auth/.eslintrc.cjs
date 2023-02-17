module.exports = {
  extends: '@package/eslint-config/node.config.js',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
