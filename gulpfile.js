const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const purgecss = require('gulp-purgecss');
const uglify = require('gulp-uglify');

/*
  Top level fucntions
  gulp.task - Define tasks
  gulp.src - Point to fules to use
  gulp.dest - Points to folder to output
  gulp.watch - Watch files and folders for changes
*/

// Copying bootstrap files
gulp.task('bootstrap', function(){
  console.log('Copying bootstrap files into src');
  gulp.src('node_modules/bootstrap/scss/*.scss')
      .pipe(gulp.dest('src/sass'));
  gulp.src('node_modules/bootstrap/scss/mixins/*.scss')
      .pipe(gulp.dest('src/sass/mixins'));
  gulp.src('node_modules/bootstrap/scss/utilities/*.scss')
      .pipe(gulp.dest('src/sass/utilities'));
  gulp.src('node_modules/bootstrap/dist/js/bootstrap.bundle.min.js')
      .pipe(gulp.dest('src/js'));
});

// Copy All HTML files
gulp.task('copyHtml', function(){
  gulp.src('src/*.html')
      .pipe(gulp.dest('dist'));
});

// PurgeCSS 
gulp.task('purgecss', function(){
  gulp.src('src/sass/*.scss')
      .pipe(purgecss({
        content: ['src/*.html']
      }))
      .pipe(gulp.dest('tmp/sass'));
});

// Compile Sass
gulp.task('sass', function(){
  gulp.src('tmp/sass/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('dist/css'));
});

// Concat & Minify JS
gulp.task('scripts', function(){
  gulp.src('src/js/*.js')
      .pipe(uglify())
      .pipe(gulp.dest('dist/js'));
});

// gulp default
gulp.task('default', ['bootstrap', 'copyHtml', 'sass', 'purgecss', 'scripts']);

// gulp Watch
gulp.task('watch', function(){
  gulp.watch('src/js/*.js', ['scripts']);
  gulp.watch('src/sass/*.scss', ['purgecss', 'sass']);
  gulp.watch('src/*.html', ['copyHtml']);
})