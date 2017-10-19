module.exports = function (wallaby) {
  return {
    files: [
      'lib/**/*.js'
    ],
    tests: [
      'test/**/*.js'
    ],
    compilers: {
      '**/*.js': wallaby.compilers.babel()
    },
    testFramework: 'mocha',
    delays: {
      run: 500
    },
    debug: true,
    reportConsoleErrorAsError: true
  }
}
