const gulp = require('gulp');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const purgecss = require('gulp-purgecss');

/*
  Top level fucntions
  gulp.task - Define tasks
  gulp.src - Point to fules to use
  gulp.dest - Points to folder to output
  gulp.watch - Watch files and folders for changes
*/

// Logs message
gulp.task('message', function(){
  return console.log('Gulp is running..');
});

// Copy All HTML files
gulp.task('copyHtml', function(){
  gulp.src('src/*.html')
      .pipe(gulp.dest('dist'));
});

// Compile Sass
gulp.task('sass', function(){
  gulp.src('src/sass/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('dist/css'));
});

// PurgeCSS 
gulp.task('purgecss', function(){
  gulp.src('src/sass/*.scss')
      .pipe(purgecss())
      .pipe(gulp.dest('dist/css'));
});

// Concat & Minify JS
gulp.task('scripts', function(){
  gulp.src('src/js/*.js')
      .pipe(concat('main.js'))
      .pipe(uglify())
      .pipe(gulp.dest('dist/js'));
});

// gulp default
gulp.task('default', ['message', 'copyHtml', 'sass', 'scripts', 'purgecss']);

// gulp Watch
gulp.task('watch', function(){
  gulp.watch('src/js/*.js', ['scripts']);
  gulp.watch('src/sass/*.scss', ['sass', 'purgecss']);
  gulp.watch('src/*.html', ['copyHtml']);
})