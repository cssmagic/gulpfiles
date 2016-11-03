# Gulpfiles

> Build Gulp tasks rapidly.

## Usage

```js
// require this package
var gulpfiles = require('gulpfiles')

// define task, like this:
gulp.task('clean', gulpfiles.del({
	glob: './dist/*.*',
}))

// or like this:
gulp.task('clean', gulpfiles('del', {
	glob: './dist/*.*',
}))
```

***

## License

[MIT License](http://www.opensource.org/licenses/mit-license.php)
