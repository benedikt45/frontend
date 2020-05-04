const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const less = require('gulp-less');
const del = require('del');
const browserSync = require('browser-sync').create();


const cssFiles = [
   'src/css/reset.css',
  'src/css/style.css'
];

function scripts() {
  return gulp.src('src/scripts/**/*.js')
    .pipe(concat('script.js'))
    .pipe(uglify({
      toplevel: true
    }))
    .pipe(gulp.dest('build/scripts/'))
    .pipe(browserSync.stream());
}

function lessToCss() {
  return gulp.src('src/less/style.less')
    // .pipe(concat('style.less'))
    .pipe(less())
    .pipe(gulp.dest('src/css/'));
}

function styles() {
  // return gulp.src('.src/css/**/*.css')
  return gulp.src(cssFiles)
    .pipe(concat('style.css'))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(gulp.dest('build/css/'))
    .pipe(browserSync.stream());
}

function clean() {
  return del(['build/*']);
}

gulp.task('less', lessToCss);
gulp.task('styles', styles);
gulp.task('scripts', scripts);

function watch() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });

  gulp.watch('src/less/**/*.less', lessToCss);
  gulp.watch(cssFiles, styles);
  gulp.watch('src/js/**/*.js', scripts);
  gulp.watch('*.html', browserSync.reload);
}

gulp.task('watch', watch);

gulp.task('build', gulp.series(clean,
  'less',
  gulp.parallel('styles', 'scripts')
));

gulp.task('dev', gulp.series('build', 'watch')); //Почему тут в кавычках, а выше Билд клин нет?
//Потому что тут это вызов тасков, а выше - функций

// module.exports.watch = watch; (либо тут без вотч в экспортс)
