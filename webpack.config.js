// Variables

var isBuild = process.env.NODE_ENV === 'production';

var webpack = require('webpack');
var path = require('path');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');


// Main config

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    publicPath: 'dist/'
  },
  module: {
    rules: [{
      // SCSS
      test: /\.scss$/,
      use: isBuild ? ExtractTextPlugin.extract({
        publicPath: '',
        fallback: 'style-loader?sourceMap',
        use: [{
          loader: 'css-loader',
          options: {
            sourceMap: true,
            minimize: {
              discardComments: {
                removeAll: true
              }
            }
          }
        }, 'postcss-loader?sourceMap', 'sass-loader?sourceMap']
      }) : [
        'style-loader?sourceMap',
        'css-loader?sourceMap',
        'postcss-loader?sourceMap',
        'sass-loader?sourceMap'
      ]
    }, {
      // JS
      test: /\.js$/,
      exclude: /.*node_modules\/((?!bootstrap\/js\/src).)*$/,
      use: isBuild ? [
        'babel-loader?presets=env'
      ] : [
        'babel-loader?presets=env',
        'webpack-module-hot-accept'
      ]
    }, {
      // Other files
      test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf)$/,
      use: ['file-loader?name=assets/[name].[ext]']
    }]
  },
  devServer: {
    contentBase: path.resolve(__dirname),
    hot: true,
    port: 2222,
    watchContentBase: true
  },
  devtool: isBuild ? 'source-map' : 'eval',
  plugins: isBuild ? [
    new CleanWebpackPlugin('dist'),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Tether: 'tether',
      'window.Tether': 'tether'
    }),
    new ExtractTextPlugin('main.css'),
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      sourceMap: true
    })
  ] : [
    new CleanWebpackPlugin('dist'),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Tether: 'tether',
      'window.Tether': 'tether'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
};
