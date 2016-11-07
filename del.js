'use strict'

module.exports = ({glob, options = {}}) => {

	const path = require('path')
	const del = require('del')

	return function () {
		return del(glob, options).then(function (deletedFiles) {
			const infoTitle = `[Gulpfiles] [del] deleted: `
			if (deletedFiles.length) {
				console.log(infoTitle)
				deletedFiles.forEach(function (item) {
					item = path.relative(process.cwd(), item)
					console.log('  - ' + item)
				})
			} else {
				console.log(infoTitle + '(no files).')
			}
		})
	}

}
