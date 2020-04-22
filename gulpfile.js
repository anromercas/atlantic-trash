var gulp = require('gulp');
var del = require('del');
var javascriptObfuscator = require('gulp-javascript-obfuscator');
var exec = require('child_process').exec;

gulp.task('build', function(done) {
  return exec('ng build -c production');
});

gulp.task('clean', function() {
  return del(['dist/*.map']);
});

gulp.task('obfuscate', function() {
  return gulp
    .src(['dist/*.js', '!dist/vendor.*.js', '!dist/polyfills.*.js'])
    .pipe(
      javascriptObfuscator({
        compact: true,
        controlFlowFlattening: false,
        deadCodeInjection: false,
        debugProtection: false,
        debugProtectionInterval: false,
        disableConsoleOutput: false,
        identifierNamesGenerator: 'hexadecimal',
        log: false,
        renameGlobals: false,
        rotateStringArray: false,
        selfDefending: false,
        stringArray: false,
        sourceMap: false,
        unicodeEscapeSequence: false,
        domainLock: [
          'atlantic-basura-admin.firebaseapp.com',
          'ac-actua.es',
          'api.ac-actua.es'
        ]
      })
    )
    .pipe(gulp.dest('dist'));
});

gulp.task('default', gulp.series('build', 'obfuscate'));
