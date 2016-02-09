'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var path = require('path');

var child_process = require('child_process');
var spawn = child_process.spawn;

var phantomjs = require('phantomjs');
var binPath = phantomjs.path;

var PHANTOMJS_DIR = path.join(__dirname, 'phantomjs');
var PHANTOMJS_FILE = path.join(PHANTOMJS_DIR, 'main.js');

var Fetcher = (function () {
	function Fetcher(url, dirname, cb, option) {
		_classCallCheck(this, Fetcher);

		this.url = url;
		this.dirname = dirname;
		this.cb = cb;
		this.option = option || {};
		this.cookie = this.option.cookie || '';
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
			var proc = spawn(binPath, [PHANTOMJS_FILE, self.url, self.dirname, self.cookie], {
				stdio: "inherit"
			});
			proc.on('exit', function () {
				self.cb();
			});
		}
	}]);

	return Fetcher;
})();

module.exports = Fetcher;