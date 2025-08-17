const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      "crypto": require.resolve('crypto-browserify'),
      "stream": require.resolve('stream-browserify'),
      "assert": require.resolve('assert/'),
      "http": require.resolve('stream-http'),
      "https": require.resolve('https-browserify'),
      "os": require.resolve('os-browserify/browser'),
      "url": require.resolve('url/'),
      "net": false,
      "tls": require.resolve('tls-browserify'),
      "dns": require.resolve('dns'),
      "zlib": require.resolve('browserify-zlib'),
      "path": require.resolve('path-browserify'),
      "fs": false
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new ReactRefreshWebpackPlugin(),
    new Dotenv()
  ],
  devServer: {
    hot: true,
    historyApiFallback: true,
    port: 3000
  }
};