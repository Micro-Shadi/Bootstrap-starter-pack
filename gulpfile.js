const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const purgecss = require('gulp-purgecss');
const uglify = require('gulp-uglify');
const runSequence = require('run-sequence');
const browserSync = require('browser-sync').create();
const image = require('gulp-image');
const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");

// Images compress
gulp.task('image', function(){
  gulp.src('src/images/*')
    .pipe(image())
    .pipe(gulp.dest('dist/images'));
});

// Copying bootstrap files
gulp.task('bootstrap', function(){
  return gulp.src('node_modules/bootstrap/dist/js/bootstrap.bundle.min.js')
      .pipe(gulp.dest('src/js'));
});

// Copy All HTML files
gulp.task('copyHtml', function(){
  return gulp.src('src/*.html')
      .pipe(gulp.dest('dist'));
});

// Compile Sass
gulp.task('sass', function(){
  return gulp.src('src/sass/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('tmp/css'));
});

// PurgeCSS
gulp.task('purgecss', function(){
  return gulp.src('tmp/css/*.css')
      .pipe(purgecss({
        content: ['dist/*.html']
      }))
      .pipe(cleanCSS({compatiblity: 'ie8'}))
      .pipe(rename("style.min.css"))
      .pipe(gulp.dest('dist/css'));
});

// Minify JS
gulp.task('minifyjs', function(){
  return gulp.src('src/js/*.js')
      .pipe(uglify())
      .pipe(rename("main.min.js"))
      .pipe(gulp.dest('tmp/js'));
});

// Concat JS
gulp.task('concat', function(){
  return gulp.src('tmp/js/*.js')
      .pipe(concat('app.min.js'))
      .pipe(gulp.dest('dist/js'));
});

// Static Server > watching SCSS/HTML/JS files
gulp.task('serve', function() {

  browserSync.init({
      server: "./dist"
  });

  gulp.watch('src/js/*.js', function(){ runSequence('minifyjs', 'concat')}).on('change', browserSync.reload);
  gulp.watch(['src/sass/*.scss', 'src/sass/**/*.scss'], function(){ runSequence('sass', 'purgecss')}).on('change', browserSync.reload);
  gulp.watch('src/*.html', function(){ runSequence('copyHtml', 'sass', 'purgecss')}).on('change', browserSync.reload);
});

/* gulp.task('default', [ 'copyHtml', 'sass', 'purgecss', 'minifyjs', 'concat']); */

// build
gulp.task('build', function() {
  runSequence('bootstrap', 'copyHtml', 'image', 'sass', 'purgecss', 'minifyjs', 'concat');
});
