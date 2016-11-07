'use strict'

module.exports = ({src, dest, options = {}, config = {}}) => {

	const path = require('path')
	const gulp = require('gulp')
	const stylus = require('gulp-stylus')
	const rename = require('gulp-rename')
	const gulpIf = require('gulp-if')
	const nib = require('nib')

	const isString = require('./util/is-string')

	/*
	options = {
		src: {},
		dest: {},
	}
	config = {
		rename: '...',
		'...': '...',
	}
	*/

	// util
	function getFilename(src, dest) {
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
		if (file) {
			file = file.replace(/\.styl$/, '.css')
			destFile = options.dest && options.dest.cwd ?
				path.resolve(options.dest.cwd, dest, file) :
				path.resolve(dest, file)
		} else {
			destFile = path.join(dest, '*.css')
		}
		return path.relative(process.cwd(), destFile)
	}

	return function () {
		const defaults = {
			use: [nib()],
			import: 'nib',
			linenos: false,
			compress: false,
			errors: true,
		}
		const cfg = Object.assign(defaults, config)
		const stream = gulp.src(src, options.src)
			.pipe(stylus(cfg))
			.pipe(gulpIf(!!config.rename, rename(config.rename)))
			.pipe(gulp.dest(dest, options.dest))
			.on('finish', function () {
				// for pretty output
				let file = getFilename(src, dest)
				// TODO: how to get file name from stream? (ToT)

				console.log('[Gulpfiles] [stylus] compiling stylus: ' + src)
				console.log('[Gulpfiles] [stylus] output css: ' + file)
			})
			.on('error', function (err) {
				console.error(err.message)
				this.emit('end')
			})
		return stream
	}

}
