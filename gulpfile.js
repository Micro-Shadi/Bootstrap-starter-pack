const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const purgecss = require('gulp-purgecss');
const uglify = require('gulp-uglify');
const runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();

/*
  Top level fucntions
  gulp.task - Define tasks
  gulp.src - Point to fules to use
  gulp.dest - Points to folder to output
  gulp.watch - Watch files and folders for changes
*/

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
      .pipe(gulp.dest('dist/css'));
});

// Minify JS
gulp.task('minifyjs', function(){
  return gulp.src('src/js/*.js')
      .pipe(uglify())
      .pipe(gulp.dest('tmp/js'));
});

// Concat JS
gulp.task('concat', function(){
  return gulp.src('tmp/js/*.js')
      .pipe(concat('app.min.js'))
      .pipe(gulp.dest('dist/js'));
});

// Static Server + watching scss/html files
gulp.task('serve', function() {

  browserSync.init({
      server: "./dist"
  });

  gulp.watch("src/sass/*.scss", ['sass', 'purgecss']).on('change', browserSync.reload);
  gulp.watch("src/*.html", ['copyHtml']).on('change', browserSync.reload);
});

// gulp default
/*gulp.task('default', [ 'copyHtml', 'sass', 'purgecss', 'minifyjs', 'concat']); */
gulp.task('build', function() {
  runSequence('bootstrap', 'copyHtml', 'sass', 'purgecss', 'minifyjs', 'concat');
});

// gulp Watch
gulp.task('watch', function(){
  gulp.watch('src/js/*.js', ['minifyjs', 'concat']);
  gulp.watch('src/sass/*.scss', ['sass', 'purgecss']);
  gulp.watch('src/*.html', ['copyHtml']);
})