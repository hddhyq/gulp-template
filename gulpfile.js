const gulp = require('gulp');
const build = require('./build/gulpfile.build.js');
gulp.task('build', build);
gulp.task('default', build);
