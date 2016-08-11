/*global require*/
'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
//var uglify = require('gulp-uglify');
//var sourcemaps = require('gulp-sourcemaps');
var eslint = require('gulp-eslint');
var clearScreen = require('clear');

var jsSources = ['./src/**/*.js','gulpfile.js'];

gulp.task('js', ['lint', 'bundle']);

gulp.task('clearScreen', function() { clearScreen(); });

gulp.task('lint', ['clearScreen'], function() {
  return gulp.src(jsSources)
    .pipe(eslint())
    .pipe(eslint.format())
    //.pipe(eslint.failAfterError())
    ;
});

gulp.task('bundle', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './src/background.js',
    debug: true,
    // defining transforms here will avoid crashing your stream
    transform: [/*reactify*/]
  });

  return b.bundle()
    .pipe(source('src/index.js'))
    .pipe(buffer())
    .pipe(eslint())
        .on('error', gutil.log)
    .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', ['js'], function() {
  return gulp.watch(jsSources, ['js']);
});

