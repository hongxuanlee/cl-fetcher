const gulp = require('gulp');
const babel = require('gulp-babel');
const sequence = require('run-sequence');
const gutil = require('gulp-util');
const child_process = require('child_process');
const del = require('del');
const webpack = require('webpack');
const path = require('path');

gulp.task('default', ['start']);

gulp.task('start', () => {
	sequence('clean', ['build', 'test-build', 'brower-build'], 'test');
});

gulp.task('clean', () => {
	return del(['lib/*', 'test/lib/*']);
});

gulp.task('build', () => {
	return gulp.src('src/**/*.js')
		.pipe(babel({
			presets: ['es2015', 'stage-0']
		}))
		.on('error', (err) => {
			gutil.log('babel Error!', err.message);
		})
		.pipe(gulp.dest('lib'));
});

gulp.task('test-build', () => {
	return gulp.src('test/src/**/*.js')
		.pipe(babel({
			presets: ['es2015', 'stage-0']
		}))
		.on('error', (err) => {
			gutil.log('babel Error!', err.message);
		})
		.pipe(gulp.dest('test/lib'));
});

gulp.task('brower-build', (callback) => {
	webpack({
		entry: {
			agent: './browser/src/browserAgent.js',
			test_tree: './test/phantom/tree.js'
		},
		output: {
			path: path.join(__dirname, 'browser/lib'),
			filename: '[name].js'
		},
		module: {
			loaders: [{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015', 'stage-0']
				}
			}]
		}
	}, (err, stats) => {
		if (err) throw new gutil.PluginError('webpack', err);
		gutil.log('[webpack]', stats.toString({
			colors: true
		}));
		callback();
	});
});

gulp.task('test', () => {
	child_process.exec("mocha-phantomjs test/html/*", {
		stdio: "inherit"
	}, function(err, stdout, stderr) {
		console.log('[phantomTest]: \n' + stdout);
		if (err) {
			console.log('[phantomTest stderr]: \n' + stderr);
		}
		child_process.spawn("mocha", ['test/lib', '--timeout', '15000'], {
			stdio: "inherit"
		});
	});
});

gulp.watch(['src/**/*.js', 'test/src/**/*.js', 'test/phantom/**/*.js', 'browser/src/**/*.js', 'test/data/**/*'], ['start']);






