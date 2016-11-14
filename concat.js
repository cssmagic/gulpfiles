'use strict'

module.exports = ({rules = {}, dest, options = {}, config = {}}) => {

	const path = require('path')
	const gulp = require('gulp')
	const concat = require('gulp-concat')
	const rename = require('gulp-rename')
	const replace = require('gulp-replace')
	const wrap = require('gulp-wrap')
	const uglify = require('gulp-uglify')

	/*
	rules = {
		'foo.js': [
			'./node_modules/foo/src/a.js',
			'./node_modules/foo/src/b.js',
			'./node_modules/foo/src/c.js',
		],
		'bar.js': [],
	}
	options = {
		src: {},
		dest: {},
		filter: (key) => {},  // to filter `rules`.
	}
	config = {
		concat: {
			newLine: '\n;',
		},
		pipes: [{
			plugin: 'wrap'
			rename: 'foo.umd.js',
			config: {src: 'path/foo.bar'},
		}, {
			plugin: 'replace'
			rename: 'bar.umd.js',
			config: ['form', 'to'],
		}, {
			plugin: 'uglify',
			rename: 'bar.min.js',
			config: {
				preserveComments: 'some',
			}
		}],
	}
	*/

	const streamToPromise = require('gulp-stream-to-promise')

	return function () {
		var tasks = []
		var jsFilenames = Object.keys(rules)
		jsFilenames.forEach(function (filename) {
			// use filter to exclude unwanted keys
			let filter = options.filter
			if (filter && typeof filter === 'function' && !filter(filename)) return

			var src = rules[filename]
			if (!src.length) return

			let names = []

			// concat
			let concatConfig = config.concat || {}
			let hasBeenOutput = false	// flag to remember if concat result is written to disk
			if (filename.endsWith('.js') && !concatConfig.newLine) concatConfig.newLine = '\n;\n'
			let stream = gulp
				.src(src, options.src)
				.pipe(concat(filename, concatConfig))
			names.push({
				plugin: 'concat',
				name: filename,
			})

			// pipes
			if (Array.isArray(config.pipes) && config.pipes.length) {
				config.pipes.forEach(function (pipe) {
					let config = pipe.config
					let plugin = pipe.plugin
					if (!config || !plugin) return

					if (pipe.rename) {
						if (!hasBeenOutput) {
							stream = stream.pipe(gulp.dest(dest, options.dest))
							hasBeenOutput = true
						}
					}
					switch (plugin) {
						case 'wrap':
							stream = stream.pipe(wrap(config))
							break
						case 'replace':
							stream = stream.pipe(replace(config[0], config[1]))
							break
						case 'uglify':
							stream = stream.pipe(uglify(config))
							break
					}
					if (pipe.rename) {
						stream = stream
							.pipe(rename(pipe.rename))
							.pipe(gulp.dest(dest, options.dest))
						names.push({
							plugin,
							name: pipe.rename,
						})
					}
				})
			}

			if (!hasBeenOutput) {
				stream = stream.pipe(gulp.dest(dest, options.dest))
				hasBeenOutput = true
			}

			// output debug info
			stream
				.on('finish', function () {
					// output src
					console.log('[Gulpfiles] [concat] combining files: ')
					src.forEach(function (item) {
						console.log('  - ' + item)
					})

					// output pipes
					names.forEach(function (pipe) {
						let plugin = pipe.plugin
						let name = pipe.name
						let destFile = options.dest && options.dest.cwd ?
							path.resolve(options.dest.cwd, dest, name) :
							path.resolve(dest, name)
						destFile = path.relative(process.cwd(), destFile)
						console.log('[Gulpfiles] [' + plugin + '] ===> ' + destFile)
					})
				})
			tasks.push(streamToPromise(stream))
		})
		return Promise.all(tasks)
	}

}
