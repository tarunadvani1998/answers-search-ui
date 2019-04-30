const { series, parallel } = require('gulp')

const templates = require('./conf/gulp-tasks/templates.gulpfile.js')
const library = require('./conf/gulp-tasks/library.gulpfile.js')

exports.default = exports.build = parallel(
                                    templates.default,
                                    library.default
                                  );
exports.dev = parallel(
                templates.dev,
                library.dev
              );
