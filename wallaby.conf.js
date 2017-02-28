module.exports = function(wallaby) {
  process.env.WALLABY = 'true';
  return {
    files: [
      'src/**/*.ts',
      {pattern: 'tests/**/*.jsx', instrument: false, load: false, ignore: false},
      {pattern: 'tests/**/*.d.ts', instrument: false, load: false, ignore: false}
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
