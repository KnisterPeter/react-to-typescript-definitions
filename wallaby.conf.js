module.exports = function(wallaby) {
  process.env.WALLABY = 'true';
  return {
    files: [
      'src/**/*.ts',
      {pattern: 'tests/**/*.js*', instrument: false},
      {pattern: 'tests/**/*.d.ts', instrument: false}
    ],
    tests: [
      'tests/**/*-test.ts'
    ],
    env: {
      type: 'node'
    },
    testFramework: 'ava',
    debug: false
  };
}
