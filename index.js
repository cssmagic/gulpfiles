'use strict'

function builders(name, config) {
	try {
		let builder = builders[name]
		if (typeof builder === 'function') {
			return builder(config)
		} else {
			return () => {
				console.error('[Gulpfiles] Invalid task builder: ' + name)
			}
		}
	} catch (e) {
		console.error('[Gulpfiles] Not found task builder: ' + name)
	}
}

const availableTasks = [
	'del',
]
availableTasks.forEach((item) => {
	Object.defineProperty(builders, item, {
		enumerable: true,
		get: function () {
			console.log('[Gulpfiles] lazy-loading module: "' + item + '"...')
			return require('./' + item)
		},
	})
})

module.exports = builders
