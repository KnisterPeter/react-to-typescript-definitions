module.exports = function(wallaby) {
  process.env.WALLABY = 'true';
  return {
    files: [
      'src/**/*.ts',
      {pattern: 'tests/**/*.js*', instrument: false},
      {pattern: 'tests/**/*.d.ts', instrument: false},
      {pattern: 'node_modules/dts-dom/package.json', instrument: false},
      {pattern: 'node_modules/dts-dom/bin/index.d.ts', instrument: false}
    ],
    tests: [
      'tests/**/*-test.ts',
      '!tests/cli-test.ts',
    ],
    env: {
      type: 'node'
    },
    testFramework: 'ava',
    debug: false
  };
}
