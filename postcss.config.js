var bootstrapSupported = require('bootstrap/grunt/postcss').autoprefixer.browsers;
if (bootstrapSupported == null) { console.log("Cannot find autoprefixer's browser configuration...") };

var config = {
  plugins: {
    'postcss-flexbugs-fixes': {},
    'autoprefixer': {
      browsers: bootstrapSupported
    }
  }
}

module.exports = config;
