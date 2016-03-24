"use strict"

const gulp = require('gulp')
const babel = require('gulp-babel')
const sourcemaps = require('gulp-sourcemaps')
const plumber = require('gulp-plumber')

gulp.task('babel', () => {
	return gulp.src('src/*.js')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist'))
})

gulp.task('watch', () => {
	gulp.watch('src/*.js', ['babel'])
})

gulp.task('default', ['watch'])