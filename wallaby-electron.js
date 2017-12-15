module.exports = function () {
  return {
    files: [
      'src/electron/**/*.js',
      '!src/electron/**/*.spec.js'
    ],

    tests: [
      'src/electron/**/*spec.js'
    ],

    env: {
      type: 'node'
    },
    testFramework: 'jasmine'
  }
}
