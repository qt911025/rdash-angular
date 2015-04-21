'use strict';

var gulp = require('gulp'),
  $ = require('gulp-load-plugins')(),
  mainBowerFiles = require('main-bower-files'),
  open = require('open'),
  karmaServer = require('karma').server;

gulp.task('clean-dist', function(){
  return gulp.src('dist', {read: false})
    .pipe($.clean());
});

gulp.task('clean-css', function(){
  return gulp.src('src/app.css', {read: false})
    .pipe($.clean());
});

gulp.task('build-css', ['clean-css'], function () {
  return gulp.src('src/app.less')
    .pipe($.inject(gulp.src([
      'src/**/*.less',
      '!src/bower_components/**/*',
      '!src/app.less'
    ], {
      read: false
    }), {
      relative: true,
      starttag: '// inject:less',
      endtag: '// endinject',
      transform: function(filePath, file, i, length){
        return '@import \'' + filePath + '\';';
      }
    }))
    .pipe(gulp.dest('src/'))
    .pipe($.less())
    .pipe($.autoprefixer({
      browser: ['last 1 version']
    }))
    .pipe(gulp.dest('src/'));
});


gulp.task('lint', function(){
  gulp.src([
    'src/**/*.js',
    '!src/bower_components/**/*'
  ])
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
});

/**
 * inject and lint
 */
gulp.task('inject-js', ['lint'], function(){
  gulp.src('src/index.html')
    .pipe($.inject(
      gulp.src([
        'src/**/*.js',
        '!src/bower_components/**/*',
        '!src/**/*.spec.js'
      ], {
        read: false
      })
      , {
        relative: true
      }))
    .pipe(gulp.dest('src/'));
});

gulp.task('inject', ['build-css', 'inject-js'], function () {
  return gulp.src('src/index.html')
    .pipe($.inject(gulp.src(
      mainBowerFiles(), {
      read: false
    }),{
      name: 'bower',
      relative: true
    }))
    .pipe($.inject(
      gulp.src([
        'src/**/*.css',
        '!src/bower_components/**/*',
        '!src/app.css'
      ], {
        read: false
      }), {
        relative: true
      }))
    .pipe(gulp.dest('src/'));
});

gulp.task('inject-karma', function () {
  return gulp.src('karma.conf.js')
    .pipe($.inject(
      gulp
        .src(mainBowerFiles(), {
          read: false
        })
        .pipe($.filter('**/*.js'))
      , {
        relative: true,
        starttag: '// inject:karma',
        endtag: '// endinject',
        transform: function (filePath, file, i, length) {
          return '\'' + filePath + '\',';
        }
      }))
    .pipe(gulp.dest('./'));
});

/**
 * Watch custom files
 */
gulp.task('watch', function () {
  gulp.watch(['src/**/*.less', '!src/bower_components/*'], ['build-css']);
  gulp.watch(['src/**/*.js', '!src/bower_components/*'], ['inject-js']);
});

/**
 * Live reload server
 */
gulp.task('devServer', ['inject'], function () {
  $.connect.server({
    root: 'src',
    livereload: true,
    port: 9000
  });
});
gulp.task('prodServer', function () {
  $.connect.server({
    root: 'dist',
    port: 9000
  });
});

gulp.task('livereload', function () {
  gulp.src([
    'src/**/*.html',
    'src/app.css',
    'src/**/*.js',
    '!src/bower_components/**/*',
    '!src/**/*.spec.js'
  ])
    .pipe($.watch())
    .pipe($.connect.reload())
});

gulp.task('wait', ['devServer'], function(cb){
  gulp.run(['livereload', 'watch']);
  setTimeout(function(){
    cb();
  }, 1500)
});

/**
 * Gulp tasks
 */
gulp.task('serve', ['wait'], function(){
  open('http://localhost:9000');
});
gulp.task('test', ['inject', 'inject-karma'], function(done){
  karmaServer.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});
gulp.task('simple-build', ['clean-dist', 'inject'], function () {
  $.merge(
    gulp.src([
      'src/**/*.html',
      'src/app.css',
      'src/**/*.js',
      'src/assets/**/*',
      'src/bower_components/**/*',
      'src/bower_components/rdash-ui/**/*',//Why should this exist?
      '!src/**/*.spec.js'
    ], {
      base: 'src/'
    }),
    gulp.src([
      'bower.json'
    ])
  )
    .pipe(gulp.dest('dist/'));
});

//TODO ng-tpl ng-annotates usemin ocncat uglify
//gulp.task('build', ['usemin', 'build-assets', 'build-custom']);
gulp.task('default', ['simple-build'], function(){
  gulp.run(['prodServer']);
});