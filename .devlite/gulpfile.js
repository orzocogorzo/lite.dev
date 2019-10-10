// VENDOR
const { src, dest, parallel, series, watch } = require('gulp');
const del = require('del');
const browserify = require('browserify');
const http = require("http");

// GULP PLUGINS
const htmlmin = require('gulp-html-minifier');
const babel = require('gulp-babel');
const stylus = require('gulp-stylus');
const image = require('gulp-image');
const vinylSource = require('vinyl-source-stream');
// const gulpBuffer = require('gulp-buffer');
const vinylBuffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
// const concat = require('gulp-concat');
const connect = require('gulp-connect');
const rename = require('gulp-rename');


function clean (done) {
  return del([
    "../.dist/*"
  ], {
    force: true
  });
}
clean.description = "Remove .dist folder contents";
exports.clean = clean;


function dist (done) {
  return src("*.*", {read: false})
    .pipe(dest("../.dist/assets"))
    .pipe(dest("../.dist/assets/images"))
    .pipe(dest("../.dist/assets/data"))
};
dist.description = "Create dist directory structure";
exports.dist = dist;


function js (done) {
  const b = browserify({
      entries: "../src/index.js",
      debug: true
  });

  return b.bundle()
    .pipe(vinylSource('bundle.js'))
    .pipe(vinylBuffer())
    .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(babel({presets: ['@babel/preset-env']}))
      .pipe(uglify())
      .on('error', console.error)
    .pipe(sourcemaps.write())
    .pipe(connect.reload())
    .pipe(dest('../.dist'));
}
js.description = 'Bundle js files, compile them with buble and uglify and move the output to the .dist folder';
exports.js = js;

function css (done) {
  return src('../src/styles/index.styl')
    .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(stylus({
        compress: true
      }))
    .pipe(sourcemaps.write())
    .pipe(rename('bundle.css'))
    .pipe(connect.reload())
    .pipe(dest('../.dist'));
}
css.descriptions = "Budnle all styuls files, compile them and move the output to the .dist folder";
exports.css = css;


function imageCompress (done) {
  return src("../src/assets/images/*")
    .pipe(image())
    .pipe(connect.reload())
    .pipe(dest("../.dist/assets/images"));
}
imageCompress.description = "Compress images and move them to the .dist/assets/images folder";
exports.image = imageCompress;

function data (done) {
  return src("../src/assets/data/*")
    .pipe(connect.reload())
    .pipe(dest("../.dist/assets/data"));
};
data.description = "Move data to .dist folder";
exports.data = data;


function html (done) {
  return src("../src/index.html")
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(connect.reload())
    .pipe(dest("../.dist"));
}
html.description = "Minify index.html and put it on the .dist folder";
exports.html = html;

// function reload (done) {
//   done();
//   connect.reload();
// }


const bundle = parallel(html, js, css, imageCompress, data);
exports.bundle = bundle;
const pipeline = series(clean, dist, bundle);
exports.pipeline = pipeline;


const serve = series(pipeline, function serve (done) {
  connect.server({
    livereload: true,
    port: 8050,
    root: '../.dist',
    debug: true,
    name: 'lite-dev',
    middleware: function (connect, opt) {
      return [function (req, res, next) {
        res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate");
        res.setHeader("Pragme", "no-cache");
        res.setHeader("Expires", "-1");
        next();
      }];
    }
  });

  watch("../src/index.html", series(html));
  watch("../src/**/*.js", series(js));
  watch("../src/**/*.styl", series(css));
  watch("../src/assets/images/*", series(imageCompress));
  watch("../src/assets/data/*", series(data));
});
serve.description = "Setup a static server, start a livereload listener and put gulp watching for changes";
exports.serve = serve;


function defaultTask () {
  serve();
}

exports.default = defaultTask;