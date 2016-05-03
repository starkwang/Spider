var gulp = require('gulp'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    babel = require('gulp-babel')
    ,sourcemaps = require('gulp-sourcemaps')


gulp.task('default', ['watch', 'babel']);

gulp.task("babel", function() {
    return gulp
        .src('src/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets:['es2015'],
            sourceMaps: "both"
        }))
        .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: '../src'}))
        .pipe(gulp.dest('build/'));
});

gulp.task('watch', function() {
    gulp.watch('src/*.js', ['babel']);
});
