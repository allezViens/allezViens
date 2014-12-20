var gulp = require('gulp'),
    inject = require('gulp-inject'),
    wiredep = require('wiredep').stream,
    sass = require('gulp-sass'),
    watch = require('gulp-watch'),
    runSequence = require('run-sequence'),
    es = require('event-stream'),
    karma = require('karma').server;

var paths = {
  bower : "./client/bower_components/",
  index : "./client/index.html",
  client : "./client/",
  sass: "./client/sass/style.scss",
  core: "./client/app/core/**/*.js",
  app: "./client/app/app.js"
}

// Compile all .scss files ----> styles.css
gulp.task('sass', function () {
    gulp.src(paths.sass)
        .pipe(sass())
        .pipe(gulp.dest(paths.client));
});

// Inject all bower dependencies listed in bower.json ---> index.html
gulp.task('bower', function () {  
  gulp.src(paths.index)
    .pipe(wiredep({
      directory: paths.bower,
      bowerJson: require('./bower.json'),
    }))
    .pipe(gulp.dest(paths.client));
});

gulp.task('core', function () {
    var core = gulp.src( paths.core, {read:false} );
    var app = gulp.src(paths.app, {read:false});
    var options = { read:false, name: 'core', ignorePath: '/client' };  
    
    return gulp.src( paths.index )
      .pipe( inject( es.merge( core, app ), options))
      .pipe( gulp.dest( paths.client ) )
})


gulp.task('watch', function() {
  gulp.watch('./client/sass/*.scss', ['sass']);
});

gulp.task('karma', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
  }, done);
});

gulp.task('default', function() {
    runSequence('core', 'sass','bower','watch', 'karma', function () {
      console.log('gulp success!')
    });
});

