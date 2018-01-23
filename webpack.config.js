// Variables

const isBuild = process.env.NODE_ENV === 'production'

const webpack = require('webpack')
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const providePluginList = {
  $: 'jquery',
  jQuery: 'jquery',
  'window.jQuery': 'jquery',
  Popper: ['popper.js', 'default'],
  // Bootstrap scripts
  Alert: 'exports-loader?Alert!bootstrap/js/src/alert',
  Button: 'exports-loader?Button!bootstrap/js/src/button',
  Carousel: 'exports-loader?Carousel!bootstrap/js/src/carousel',
  Collapse: 'exports-loader?Collapse!bootstrap/js/src/collapse',
  Dropdown: 'exports-loader?Dropdown!bootstrap/js/src/dropdown',
  Modal: 'exports-loader?Modal!bootstrap/js/src/modal',
  Popover: 'exports-loader?Popover!bootstrap/js/src/popover',
  Scrollspy: 'exports-loader?Scrollspy!bootstrap/js/src/scrollspy',
  Tab: 'exports-loader?Tab!bootstrap/js/src/tab',
  Tooltip: 'exports-loader?Tooltip!bootstrap/js/src/tooltip',
  Util: 'exports-loader?Util!bootstrap/js/src/util'
}

// Main config

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'public')
  },
  module: {
    rules: [{
      // SCSS
      test: /\.scss$/,
      use: isBuild ? ExtractTextPlugin.extract({
        publicPath: '',
        fallback: 'style-loader?sourceMap',
        use: [
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              minimize: {
                discardComments: {
                  removeAll: true
                }
              }
            }
          }, {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              ident: 'postcss',
              plugins: (loader) => [
                require('autoprefixer')()
              ]
            }
          },
          'sass-loader?sourceMap'
        ]
      }) : [
        'style-loader?sourceMap',
        'css-loader?sourceMap',
        'sass-loader?sourceMap'
      ]
    }, {
      // JS
      test: /\.js$/,
      exclude: /.*node_modules\/((?!bootstrap\/js\/src).)*$/,
      use: isBuild ? [
        'babel-loader',
        'eslint-loader'
      ] : [
        'babel-loader',
        'webpack-module-hot-accept',
        'eslint-loader'
      ]
    }, {
      // HTML
      test: /\.html$/,
      use: [
        'file-loader?useRelativePath&name=[name].[ext]',
        'extract-loader',
        'html-loader'
      ]
    }, {
      // Other files
      test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf)$/,
      use: ['file-loader?name=assets/[name].[ext]']
    }]
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    hot: true,
    overlay: true,
    port: 2222
  },
  devtool: isBuild ? 'source-map' : 'eval',
  plugins: isBuild ? [
    new CleanWebpackPlugin('public'),
    new webpack.ProvidePlugin(providePluginList),
    new ExtractTextPlugin('main.css'),
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      sourceMap: true
    })
  ] : [
    new CleanWebpackPlugin('public'),
    new webpack.ProvidePlugin(providePluginList),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
}
