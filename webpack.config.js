// Requires

var webpack = require('webpack');
var path = require('path');

var cleanWebpackPlugin = require('clean-webpack-plugin');
var extractTextPlugin = require('extract-text-webpack-plugin');


// Plugins

//// Common
var pluginsCommon = [
  new cleanWebpackPlugin('dist'),
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery',
    Tether: 'tether',
    'window.Tether': 'tether',
    Alert: 'exports-loader?Alert!bootstrap/js/dist/alert',
    Button: 'exports-loader?Button!bootstrap/js/dist/button',
    Carousel: 'exports-loader?Carousel!bootstrap/js/dist/carousel',
    Collapse: 'exports-loader?Collapse!bootstrap/js/dist/collapse',
    Dropdown: 'exports-loader?Dropdown!bootstrap/js/dist/dropdown',
    Modal: 'exports-loader?Modal!bootstrap/js/dist/modal',
    Popover: 'exports-loader?Popover!bootstrap/js/dist/popover',
    Scrollspy: 'exports-loader?Scrollspy!bootstrap/js/dist/scrollspy',
    Tab: 'exports-loader?Tab!bootstrap/js/dist/tab',
    Tooltip: 'exports-loader?Tooltip!bootstrap/js/dist/tooltip',
    Util: 'exports-loader?Util!bootstrap/js/dist/util'
  })
];

//// Dev
var pluginsDev = [
  new webpack.HotModuleReplacementPlugin()
].concat(pluginsCommon);

//// Build
var pluginsBuild = [
  new extractTextPlugin('main.css'),
  new webpack.optimize.UglifyJsPlugin({
    mangle: {
      screw_ie8: true,
      keep_fnames: true
    },
    compress: {
      screw_ie8: true,
      warnings: false
    },
    comments: false,
    sourceMap: true
  })
].concat(pluginsCommon);


// Main config

module.exports = function(env) {
  var isBuild = (env.build === true);

  return {
    entry: './src/main.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'main.js',
      publicPath: 'dist/'
    },

    module: {
      rules: [{
        test: /\.scss$/,
        use: (function() {
          if (isBuild) {
            return extractTextPlugin.extract({
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
                },
                'postcss-loader?sourceMap',
                'sass-loader?sourceMap'
              ],
              publicPath: ''
            });
          } else {
            return [
              'style-loader?sourceMap',
              'css-loader?sourceMap',
              'postcss-loader?sourceMap',
              'sass-loader?sourceMap'
            ];
          }
        })()
      }, {
        test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf)$/,
        use: [{
          loader: 'url-loader',
          options: {
            name: 'assets/[name].[ext]',
            limit: 10000
          }
        }]
      }]
    },

    devtool: (function() {
      if (isBuild) {
        return 'source-map';
      } else {
        return 'eval';
      }
    })(),

    devServer: {
      contentBase: path.resolve(__dirname),
      hot: true,
      port: 2222
    },

    plugins: (function() {
      if (isBuild) {
        return pluginsBuild;
      } else {
        return pluginsDev;
      }
    })()
  };
};
