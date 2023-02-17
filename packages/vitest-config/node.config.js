const vitest = require('vitest/config');

const config = vitest.defineConfig({
  test: {
    include: [
      'tests/**/*.{test,spec}.{ts,tsx,mts,cts}',
    ],
  },
});

module.exports = config;
