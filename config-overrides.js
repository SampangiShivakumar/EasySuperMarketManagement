const { override, addBabelPlugin } = require('customize-cra');

module.exports = override(
  addBabelPlugin('@babel/plugin-proposal-nullish-coalescing-operator'),
  addBabelPlugin('@babel/plugin-proposal-optional-chaining'),
  (config) => {
    // Add polyfills in a webpack 4 compatible way
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/')
      }
    };
    return config;
  }
);