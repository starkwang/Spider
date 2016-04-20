var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    connect = require('gulp-connect');;

var webpack = require('gulp-webpack');
var webpackConfig = require('./webpack.config');
gulp.task('default', ['clean', 'watch', 'sass:watch', 'sass', 'webpack']);
gulp.task('build', ['clean', 'sass', 'webpack']);

gulp.task("webpack", function() {
    return gulp
        .src('./')
        .pipe(webpack(webpackConfig))
        //.pipe(uglify())
        .pipe(gulp.dest('./build'));
});
gulp.task('sass', function() {
    gulp.src(['src/*.scss'])
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(concat('index.css'))
        .pipe(minifycss())
        .pipe(gulp.dest('build/'));
});

gulp.task('sass:watch', function() {
    gulp.watch('src/*.scss', ['sass']);
});
gulp.task('clean', function() {
    return gulp.src(['build/'], {
            read: false
        })
        .pipe(clean());
});

gulp.task('watch', function() {
    gulp.watch('src/*.js', ['webpack']);
});
