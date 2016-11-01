'use strict'

module.exports = ({src, options}) => {

	const path = require('path')
	const gulp = require('gulp')
	const del = require('del')

	gulp.task('clean', function () {
		return del(src, options).then(function (deletedFiles) {
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
