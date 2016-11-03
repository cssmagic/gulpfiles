'use strict'

function fn(name, config) {
	try {
		let genTask = require('./' + name)
		if (typeof genTask === 'function') {
			return genTask(config)
		} else {
			return () => {
				console.error('[Gulpfiles] Invalid task builder: ' + name)
			}
		}
	} catch (e) {
		console.error('[Gulpfiles] Not found task builder: ' + name)
	}
}

module.exports = fn
