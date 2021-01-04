const withSass = require('@zeit/next-sass')
const { TEST } = require('config');

module.exports = withSass({
  publicRuntimeConfig: {
    TEST,
  },
})
