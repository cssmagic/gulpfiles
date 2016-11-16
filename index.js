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
	'stylus',
	'concat',
]
builders._cache = {}

availableTasks.forEach((item) => {
	Object.defineProperty(builders, item, {
		enumerable: true,
		get: function () {
			let plugin = this._cache[item]
			if (!plugin) {
				console.log('[Gulpfiles] lazy-loading module: "' + item + '"...')
				plugin = this._cache[item] = require('./' + item)
			}
			return plugin
		},
	})
})

module.exports = builders
