var gulp = require('gulp'),
    react = require('gulp-react'),
    browserify = require('browserify'),
    uglify = require('gulp-uglify'),
    webserver = require('gulp-webserver')
    plumber = require('gulp-plumber'),
    gutil = require("gulp-util"),
    source = require('vinyl-source-stream'),
    watchify = require('watchify'),
    notify = require('gulp-notify'),
    reactify = require('reactify'),
    streamify = require('gulp-streamify')
    gulpif = require('gulp-if');

var env = process.env.NODE_ENV || "dev";
var isProd = function() { return env === 'prod' };
var whenProd = function(act) { return gulpif(isProd(), act) };


function onError (error) {
  console.log(error);
}

function handleError(task) {
  return function(err) {
    gutil.log(gutil.colors.red(err));
    notify.onError(task + ' failed, check the logs..')(err);
  };
}

function scripts(watch) {
  var bundler, rebundle;
  console.log(__dirname)
  bundler = browserify({
    basedir: __dirname,
    entries: './js/app.jsx',
    debug: !isProd(),
    cache: {}, // required for watchify
    packageCache: {}, // required for watchify
    fullPaths: watch // required to be true only for watchify
  });
  if(watch) {
    bundler = watchify(bundler)
  }

  bundler.transform(reactify);

  rebundle = function() {
    var stream = bundler.bundle();
    stream.on('error', handleError('Browserify'));
    stream = stream.pipe(source('app.js'));
    console.log("rebundle")
    return stream
        .pipe(whenProd(streamify(uglify())))
        .pipe(gulpif(isProd(), gulp.dest('./dist/build/js'), gulp.dest('./build/js')))
  };

  bundler.on('update', rebundle);
  return rebundle();
}

gulp.task('scripts', function() {
    scripts(false)
});

gulp.task('webserver', function() {
  gulp.src('.')
    .pipe(webserver({
          livereload: true,
          directoryListing: false,
          open: true
        }));
});

gulp.task('watchScripts', function() {
  return scripts(true);
});

gulp.task('prodenv', function() {
  env = 'prod'
})

gulp.task('prod', ['prodenv','scripts'])

gulp.task('default', ['watchScripts', 'webserver']);