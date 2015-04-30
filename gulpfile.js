'use strict';

var gulp = require('gulp'),
  $ = require('gulp-load-plugins')(),
  mainBowerFiles = require('main-bower-files'),
  open = require('open'),
  karmaServer = require('karma').server,
  addStream = require('add-stream'),
  through2 = require('through2');

var mainModuleName = 'RDash';

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
    .pipe($.inject(
      gulp.src(
        mainBowerFiles(), {
          read: false
        }), {
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
 * Build project.
 */

gulp.task('clean-dist', function(){
  return gulp.src('dist', {read: false})
    .pipe($.clean());
});

gulp.task('copy-assets', ['clean-dist'], function(){
  return gulp.src('src/assets/**/*', {
      base: 'src/'
    })
    .pipe(gulp.dest('dist/'));
});

gulp.task('copy-fonts', ['clean-dist'], function(){
  return $.merge(
    gulp.src('src/bower_components/rdash-ui/dist/fonts/**/*'),
    gulp.src('src/bower_components/font-awesome/fonts/**/*'),
    gulp.src('src/bower_components/bootstrap/fonts/**/*')
  ).pipe(gulp.dest('dist/fonts/'));
});

gulp.task('usemin', ['copy-assets', 'copy-fonts', 'inject'], function() {
  return gulp.src('src/index.html')
    .pipe($.usemin({
      bowerJs: ['concat', $.uglify(), $.rev()],
      js: [
        addStream.obj(
          gulp.src(['src/**/*.html', '!src/index.html'])
            .pipe($.minifyHtml({
              empty: true,
              spare: true
            }))
            .pipe($.ngTemplates({
              module: mainModuleName,
              standalone: false
            }))
        ),
        $.ngAnnotate(),
        'concat',
        $.uglify(),
        $.rev()],
      bowerCss: ['concat', $.minifyCss({keepSpecialComments: 0}), $.rev()],
      css: ['concat', $.minifyCss({keepSpecialComments: 0}), $.rev()]
    }))
    .pipe(gulp.dest('dist/'));
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

/**
 * Watch custom files
 */
gulp.task('watch', ['devServer'], function () {
  gulp.watch(['src/**/*.less', '!src/bower_components/*'], ['build-css']);
  gulp.watch(['src/**/*.js', '!src/bower_components/*'], ['inject-js']);
});

gulp.task('livereload', ['devServer'], function () {
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

gulp.task('wait', ['watch', 'livereload'], function(cb){
  setTimeout(function(){
    cb();
  }, 1500)
});

/**
 * Production serve
 */
gulp.task('prodServer', ['usemin'], function () {
  $.connect.server({
    root: 'dist',
    port: 9000
  });
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

gulp.task('build', ['usemin']);
gulp.task('default', ['prodServer'], function(){

});