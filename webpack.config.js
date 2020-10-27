var webpack = require('webpack'),
  path = require('path'),
  CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin,
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  WriteFilePlugin = require('write-file-webpack-plugin')

var options = {
  // Use the content.js file as an entry point 
  entry: {
    content: path.join(__dirname, 'src', 'js', 'content.ts'),
  },
  mode: process.env.NODE_ENV || 'development',
  // Write output to a build folder
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].bundle.js'
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ],
  },
  plugins: [
    // clean the build folder
    new CleanWebpackPlugin(),
    // Generates the manifest file using package.json fields and src/manifest.json content
    new CopyWebpackPlugin({
      patterns: [{
        from: 'src/manifest.json',
        transform: function (content, path) {
          return Buffer.from(JSON.stringify({
            name: process.env.npm_package_name,
            description: process.env.npm_package_description,
            version: process.env.npm_package_version,
            ...JSON.parse(content.toString())
          }))
        }
      }],
    }),
    new WriteFilePlugin()
  ]
}

module.exports = options
