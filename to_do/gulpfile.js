const {
  watch,
  src,
  dest,
  series,
  parallel
} = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const less = require('gulp-less');
const del = require('del');
const browserSync = require('browser-sync').create();
const webpack = require('webpack-stream');

const conf = {
  dest: './build',
  src: './src'
};

let isDev = true;
let isProd = !isDev;

let webConfig = {
  output: {
    filename: 'all.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader'
      // exclude: '/node_modules/'
    }]
  },
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'eval-source-map' : 'none'
};



function lessToCss(cb) {
  return src(conf.src + '/less/**/style.less')
    .pipe(less({
      paths: [
        '.',
        './node_modules/bootstrap-less'
      ]
    }))
    .pipe(less())
    .pipe(dest(conf.src + '/css'));
}

function css(cb) {
  return src(conf.src + '/css/**/*.css')
    .pipe(concat('style.css'))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(dest(conf.dest + '/css'))
    .pipe(browserSync.stream());
}

function js() {
  return src(conf.src + '/js/main.js')
    .pipe(webpack(webConfig))
    .pipe(dest(conf.dest + '/js'))
    .pipe(browserSync.stream());
}

function html() {
  return src(conf.src + '/*.html')
    .pipe(dest(conf.dest))
    .pipe(browserSync.stream());
}

function img() {
  return src(conf.src + '/img/**/*.img')
    .pipe(dest(conf.dest + '/img'));
}

function clean() {
  return del([conf.dest + '/*']);
}

module.exports.js = js;

module.exports.watch = function() {
  browserSync.init({
    server: {
      baseDir: conf.dest + '/'
    }
  });
  watch(conf.src + '/css/**/*.css', css);
  watch(conf.src + '/*.html', browserSync.reload);
  watch(conf.src + '/less/**/style.less', lessToCss);
  watch(conf.src + '/img/**/*.img', img);
  watch(conf.src + '/*.html', html);
  watch(conf.src + '/js/main.js', js);
}

module.exports.build = series(
  clean,
  lessToCss,
  parallel(
    css,
    js,
    html,
    img
  )
);

module.exports.dev = series(module.exports.build, module.exports.watch);
