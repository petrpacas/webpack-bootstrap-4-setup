// Requires

var webpack = require('webpack');
var path = require('path');

var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

// Plugins

//// Common
var pluginsCommon = [
  new CleanWebpackPlugin('dist'),
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery',
    Tether: 'tether',
    'window.Tether': 'tether'
  })
];

//// Dev
var pluginsDev = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NamedModulesPlugin()
].concat(pluginsCommon);

//// Build
var pluginsBuild = [
  new ExtractTextPlugin('main.css'),
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

module.exports = (function(env) {
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
        // SCSS
        test: /\.scss$/,
        use: (function() {
          if (isBuild) {
            return ExtractTextPlugin.extract({
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
        // JS
        test: /\.js$/,
        exclude: /.*node_modules\/((?!bootstrap\/js\/src).)*$/,
        use: (function() {
          var loaders = [{
            loader: 'babel-loader',
            options: {
              presets: 'env'
            }
          }];
          if (!isBuild) {
            loaders.push({ loader: 'webpack-module-hot-accept' });
          }
          return loaders;
        })()
      }, {
        // Other files
        test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'assets/[name].[ext]'
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
});
