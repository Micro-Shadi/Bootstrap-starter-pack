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
const sourcemaps = require('gulp-sourcemaps');

// Move videos to dist/videos
gulp.task('video', function(){
  gulp.src('src/videos/*')
    .pipe(gulp.dest('dist/videos'));
});

// Move Images to dist/images
gulp.task('image', function(){
  gulp.src('src/images/*')
    .pipe(gulp.dest('dist/images'));
});

// Images compress
gulp.task('imageMin', function(){
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

// Copy fonts to dist/css/fonts
gulp.task('moveFonts', function(){
  gulp.src('src/fonts/**/*.*')
    .pipe(gulp.dest('dist/css/fonts'));
});

// Compile Sass
gulp.task('sass', function(){
  return gulp.src('src/sass/*.scss')
      .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('tmp/css'))
      .on('end', function(){ console.log('SASS to CSS is done.'); });
});

// PurgeCSS
gulp.task('purgecss', function(){
  return gulp.src('tmp/css/*.css')
      .pipe(purgecss({
        // whitelist: [],
        content: ['dist/*.html', 'tmp/js/*.js']
      }))
      .pipe(cleanCSS({level: 2}))
      .pipe(rename("style.min.css"))
      .pipe(gulp.dest('dist/css'));
});

// Minify JS
gulp.task('minifyjs', function(){
  return gulp.src('src/js/**.js')
      .pipe(uglify())
      // .pipe(rename("main.min.js"))
      .pipe(gulp.dest('tmp/js'));
});

// Concat JS
gulp.task('concat', function(){
  return gulp.src('tmp/js/*.js')
      .pipe(concat('app.min.js'))
      .pipe(gulp.dest('dist/js'));
});

// Static Server > watching SCSS/HTML/JS/Images/Fonts files
gulp.task('serve', function() {

  browserSync.init({
      server: "./dist"
  });

  gulp.watch('src/js/*.js', function(){ runSequence('minifyjs', 'concat')}).on('change', browserSync.reload);
  gulp.watch(['src/sass/*.scss', 'src/sass/**/*.scss'], function(){ runSequence('sass', 'purgecss')}).on('change', browserSync.reload);
  gulp.watch('src/*.html', function(){ runSequence('copyHtml', 'sass', 'purgecss')}).on('change', browserSync.reload);
  gulp.watch('src/images/**.*', function(){ runSequence('image')}).on('change', browserSync.reload);
  gulp.watch('src/fonts/**.*', function(){ runSequence('moveFonts')}).on('change', browserSync.reload);
  gulp.watch('src/videos/**.*', function(){ runSequence('video')}).on('change', browserSync.reload);
});

/* gulp.task('default', [ 'copyHtml', 'sass', 'purgecss', 'minifyjs', 'concat']); */

// build
gulp.task('build', function() {
  runSequence('bootstrap', 'copyHtml', 'image', 'sass', 'purgecss', 'minifyjs', 'concat', 'video', 'moveFonts');
});
