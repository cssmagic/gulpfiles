'use strict'

module.exports = ({src, dest, options = {}, config = {}}) => {

	const path = require('path')
	const gulp = require('gulp')
	const gulpIf = require('gulp-if')
	const rename = require('gulp-rename')

	const isString = require('./util/is-string')

	/*
	options = {
		src: {},
		dest: {},
	}
	config = {
		rename: 'foo.umd.js',
	}
	*/

	// util
	function getFilename(src, dest, options, config) {
		let file = ''
		let simpleGlob = ''
		if (isString(config.rename)) {
			file = config.rename
		} else {
			if (isString(src)) {
				simpleGlob = src
			} else if (Array.isArray(src) && src.length === 1) {
				simpleGlob = src[0]
			}
		}

		if (simpleGlob) {
			if (options.src && options.src.base) {
				file = path.relative(options.src.base, simpleGlob)
			} else {
				file = path.basename(simpleGlob)
			}
		}

		let destFile
		let destPath = options.dest && options.dest.cwd ?
			path.resolve(options.dest.cwd, dest) : dest
		if (file) {
			destFile = path.resolve(destPath, file)
		} else {
			destFile = path.join(destPath, '*.*')
		}
		return path.relative(process.cwd(), destFile)
	}


	return function () {
		return gulp
			.src(src, options.src)
			.pipe(gulpIf(!!config.rename, rename(config.rename)))
			.pipe(gulp.dest(dest, options.dest))
			.on('finish', function () {
				// output src
				const glob = Array.isArray(src) ? src : [src]
				const logSrc = '[Gulpfiles] [copy] copying: '
				if (glob.length > 1) {
					console.log(logSrc)
					glob.forEach(function (item) {
						console.log('  - ' + item)
					})
				} else {
					console.log(logSrc + glob[0])
				}

				// output pipes
				let file = getFilename(src, dest, options, config)
				console.log('[Gulpfiles] [copy] ===> ' + file)
			})
	}

}
