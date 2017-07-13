var bootstrapSupported = require('bootstrap/grunt/postcss').autoprefixer.browsers;
if (bootstrapSupported == null) { console.log("Cannot find autoprefixer's browser configuration...") };

module.exports = {
  plugins: {
    'postcss-flexbugs-fixes': {},
    'autoprefixer': {
      browsers: bootstrapSupported
    }
  }
}
