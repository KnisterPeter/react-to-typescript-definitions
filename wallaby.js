module.exports = function (wallaby) {
  return {
    files: [
      'index.ts',
      {pattern: 'tests/**/*.jsx', instrument: false},
      'tests/**/*.d.ts'
    ],
    tests: [
      'tests/**/*-test.ts'
    ],
    testFramework: 'mocha',
    env: {
      type: 'node'
    },
    compilers: {
      '**/*.ts': wallaby.compilers.typeScript({
        typescript: require('typescript'),
        module: 1 // commonjs
      })
    }
  };
};
