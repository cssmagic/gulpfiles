'use strict'

const path = require('path')
const gulp = require('gulp')
const del = require('del')

module.exports = (globSrc, options) => {

	gulp.task('clean', function () {
		return del(globSrc, options).then(function (deletedFiles) {
			const infoTitle = '[clean] deleted: '
			if (deletedFiles.length) {
				console.log(infoTitle)
				deletedFiles.forEach(function (item) {
					item = path.relative(__dirname, item)
					console.log('  - ' + item)
				})
			} else {
				console.log(infoTitle + '(no files).')
			}
		})
	})

}
