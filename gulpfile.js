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
var destinationDir = './dist/';

gulp.task('js', ['lint', 'bundle']);

gulp.task('clearScreen', function() { clearScreen(); });

gulp.task('lint', ['clearScreen'], function() {
  return gulp.src(jsSources)
    .pipe(eslint())
    .pipe(eslint.format())
    //.pipe(eslint.failAfterError())
    ;
});

var bundleJs = function(jsEntryPoint) {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: jsEntryPoint,
    debug: true,
    // defining transforms here will avoid crashing your stream
    transform: [/*reactify*/]
  });

  return b.bundle()
    .pipe(source(jsEntryPoint))
    .pipe(buffer())
    .pipe(eslint())
        .on('error', gutil.log)
    .pipe(gulp.dest(destinationDir));
};

gulp.task('bundleOptionsPageJs', function () {
  return bundleJs('./src/options.js');
});

gulp.task('bundleBackgroundPageJs', function () {
  return bundleJs('./src/background.js');
});

gulp.task('bundleHtml', function () {
  return gulp.src('./src/options.html', { base: './src'})
    .pipe(gulp.dest(destinationDir));
});

gulp.task('bundleAssets', function () {
  return gulp.src([
    './src/images/*',
    './src/lib/*',
  ], { base: './src'})
  .pipe(gulp.dest(destinationDir));
});

gulp.task('bundle', [
  'bundleOptionsPageJs',
  'bundleBackgroundPageJs',
  'bundleHtml',
  'bundleAssets'
], function () {
  return gulp.src('./src/manifest.json')
    .pipe(gulp.dest(destinationDir));
});

gulp.task('watch', ['js'], function() {
  return gulp.watch(jsSources, ['js']);
});

