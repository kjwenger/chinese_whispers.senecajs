module.exports = function () {
  return {
    files: [
      'lib/**/*.js'
    ],
    tests: [
      'test/**/*.js'
    ],
    testFramework: 'mocha',
    delays: {
      run: 500
    },
    debug: true,
    reportConsoleErrorAsError: true
  }
}
