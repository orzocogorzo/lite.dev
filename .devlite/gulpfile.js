// SYS
const path = require("path");
const fs = require("fs");

// VENDOR
const { src, dest, parallel, series, watch } = require('gulp');
const del = require('del');
const browserify = require('browserify');
// const http = require("http");

// GULP PLUGINS
const htmlmin = require('gulp-html-minifier');
const babel = require('gulp-babel');
const stylus = require('gulp-stylus');
const image = require('gulp-image');
const vinylSource = require('vinyl-source-stream');
const vinylBuffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const replace = require('gulp-token-replace');
const connect = require('gulp-connect');
const rename = require('gulp-rename');

const join = path.join;
const rc = (function () {
  const template = {
    build: "../server/statics",
    dist: ".dist",
    src: "src",
    js: "scripts/index.js",
    html: "index.html",
    css: "styles/index.styl",
    images: "assets/images",
    data: "assets/data"
  }
  try {
    const rc = require("../devliterc.js");
    const user = Object.keys(rc).reduce((a, k) => {
      a[k] = k === "dist" || k === "src" || k === "build" ? join("..", rc[k]) : rc[k];
      return a;
    }, new Object());
    Object.keys(rc).map((k) => {
      user[k] = user[k] || template[k];
    });
    return user;
  } catch (e) {
    console.error(e);
    console.warn("Not devlite.rc file found");
    return template;
  }
})();

function getEnv () {
  let envs = new Map([
    ["pro", "./build/build.pro.js"],
    ["pre", "./build/build.pre.js"],
    ["dev", "./build/build.dev.js"]
  ]);

  fs.readdir(path.join(__dirname, "../build"), function (err, files) {
    if (err) {console.log("Can't find build directory defined by the user.");}
    else {
      if (files.length == 0) {console.log("Can't find build environments defined by the user.");}
      let env;
      files.filter(file => file.match(/^build\./)).forEach(file => {
        env = file.match(/^build\.([^\.]*)\.js$/);
        envs.set(env, path.join(__dirname, "../build", file));
      });
    }
  });

  return require(envs.get(process.env.NODE_ENV) || envs.get("dev"));
}

function clean (done) {
  return del([
    join(rc.dist + "\*")
  ], {
    force: true
  });
}
clean.description = "Remove dist folder contents";
// exports.clean = clean;


function dist (done) {
  const assets = join(rc.dist, "assets");
  return src("*.*", {read: false})
    .pipe(dest(join(assets)))
    .pipe(dest(join(assets, "images")))
    .pipe(dest(join(assets, "data")));
};
dist.description = "Create dist directory structure";
// exports.dist = dist;

function deploy (done) {
  return src(join(rc.dist, "\*"))
    .pipe(dest(join(rc.build)));
}
deploy.description = 'Deploy bundling to the server';
// exports.deploy;


function environ (done) {
  const environ = require("../envs.js")[process.env.NODE_ENV === "production" ? "pro" : "dev"];
  fs.writeFile(join(rc.dist, "env.js"), "var environment = " + JSON.stringify(environ), function (err) {
    if (err) console.error(err);
    done();
  });
}
environ.description = "Declare environment configuration for the compiled code";

function js (done) {
  const b = browserify({
      entries: join(rc.src, rc.js),
      debug: true
  });

  var proc = b.bundle()
    .pipe(vinylSource('bundle.js'))
    .pipe(vinylBuffer());

  // if (process.env.NODE_ENV === 'production') {
  //   proc = proc.pipe(sourcemaps.init({loadMaps: true}))
  //     .pipe(babel({presets: ['@babel/preset-env']}))
  //     .pipe(uglify())
  //     .on('error', console.error)
  //   .pipe(sourcemaps.write());
  // } else {
  //   proc = proc.pipe(connect.reload());
  // }
  proc = proc.pipe(connect.reload());

  return proc.pipe(dest(rc.dist));
}
js.description = 'Bundle js files, compile them with buble and uglify and move the output to the .dist folder';
// exports.js = js;

function css (done) {
  return src(join(rc.src, rc.css))
    .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(stylus({
        compress: true,
        'include css': true
      }))
    .pipe(sourcemaps.write())
    .pipe(rename('bundle.css'))
    .pipe(connect.reload())
    .pipe(dest(rc.dist));
}
css.descriptions = "Bundle all styuls files, compile them and move the output to the .dist folder";
// exports.css = css;


function imageCompress (done) {
  return src(join(rc.src, rc.images, "\*"))
    // .pipe(image())
    // .pipe(connect.reload())
    .pipe(dest(join(rc.dist, "assets/images")));
}
imageCompress.description = "Compress images and move them to the .dist/assets/images folder";
// exports.image = imageCompress;

function data (done) {
  return src(join(rc.src, rc.data, "\*"))
    .pipe(connect.reload())
    .pipe(dest("../.dist/assets/data"));
};
data.description = "Move data to .dist folder";
// exports.data = data;


function html (done) {
  const env = getEnv();
  return src(join(rc.src, rc.html))
    .pipe(replace({global: env}))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(connect.reload())
    .pipe(dest(rc.dist));
}
html.description = "Minify index.html and put it on the .dist folder";
// exports.html = html;

const bundle = parallel(environ, html, js, css, imageCompress, data);
exports.bundle = bundle;
const pipeline = series(clean, dist, bundle);
// exports.pipeline = pipeline;


const serve = series(pipeline, function serve (done) {
  connect.server({
    livereload: true,
    port: 8050,
    root: rc.dist,
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

  watch(join(rc.src, rc.html), series(html));
  watch(join(rc.src, "\*\*/\*.js"), series(js));
  watch(join(rc.src, "\*\*/\*.(styl|css)"), series(css));
  watch(join(rc.src, rc.images, "\*"), series(imageCompress));
  watch(join(rc.src, rc.data, "\*"), series(data));
});
serve.description = "Setup a static server, start a livereload listener and put gulp watching for changes";
exports.serve = serve;

const build = series(function (done) {
  process.env.NODE_ENV = "production";  
  return done();
}, pipeline, deploy);
build.description = "Execute build for production rutine and deploy the result on the server";
exports.build = build;

const local = series(function (done) {
  process.env.NODE_ENV = "local";
  return done();
}, pipeline, deploy);
local.description = "Execute build for local routine and deploy the results on the server";
exports.local = local;

function defaultTask () {
  serve();
}

exports.default = defaultTask;
