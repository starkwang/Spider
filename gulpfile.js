var gulp = require('gulp'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    babel = require('gulp-babel')

gulp.task('default', ['watch', 'babel']);

gulp.task("babel", function() {
    return gulp
        .src('src/*.js')
        .pipe(babel({
            presets:['es2015']
        }))
        .pipe(gulp.dest('build/'));
});

gulp.task('watch', function() {
    gulp.watch('src/*.js', ['babel']);
});
