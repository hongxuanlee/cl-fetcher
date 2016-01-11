'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var path = require('path');

var child_process = require('child_process');
var spawn = child_process.spawn;

var phantomjs = require('phantomjs');
var binPath = phantomjs.path;

// const DEFAULT_DATA_DIRNAME = process.cwd();
var PHANTOMJS_DIR = path.join(__dirname, 'phantomjs');
var PHANTOMJS_FILE = path.join(PHANTOMJS_DIR, 'main.js');

var Fetcher = (function () {
	function Fetcher(url, cb, option) {
		_classCallCheck(this, Fetcher);

		this.url = url;
		this.cb = cb;
		this.option = option || {};
		this.init();
	}

	_createClass(Fetcher, [{
		key: 'init',
		value: function init() {
			this.process();
		}
	}, {
		key: 'process',
		value: function process() {
			var self = this;
			var proc = spawn(binPath, [PHANTOMJS_FILE, this.url]);
			var log = '';
			var errlog = '';
			proc.stdout.on('data', function (msg) {
				log += msg;
			});
			proc.stderr.on('data', function (msg) {
				errlog += msg;
			});
			proc.on('exit', function () {
				// console.log('log:', log);
				// console.log('errlog', errlog);
				self.cb();
			});
		}
	}]);

	return Fetcher;
})();

module.exports = Fetcher;