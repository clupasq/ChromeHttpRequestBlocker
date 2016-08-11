/*global require*/
'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var eslint = require('gulp-eslint');

var jsSources = ['./src/**/*.js','gulpfile.js'];

gulp.task('js', ['lint', 'uglify']);

gulp.task('lint', function() {
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

gulp.task('uglify', ['bundle'], function() {
  gulp.src('dist/mobile.videoChannel.js')
    .pipe(rename('mobile.videoChannel.min.js'))
    .pipe(sourcemaps.init({loadMaps: true}))
         //Add transformation tasks to the pipeline here.
        .pipe(uglify())
    .pipe(gulp.dest('./dist/mobile.videoChannel.min.js'));
});

gulp.task('watch', ['js'], function() {
  return gulp.watch(jsSources, ['js']);
});

