'use strict';

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _fetcher = require('../../lib/fetcher');

var _fetcher2 = _interopRequireDefault(_fetcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('fetcher page', function () {
	// it('should return', function(done) {
	// 	let testUrl = 'file:///Users/kino/Workspace/cl-fetcher/test/data/fetcher2.html';
	// 	let fetcherIns = new Fetcher(testUrl, 'test1', () => {
	// 		assert(true);
	// 		done();
	// 	});
	// });
	// it('should return', function(done) {
	// 	let testUrl = 'file:///Users/kino/Workspace/cl-fetcher/test/data/fetcher1.html';
	// 	let fetcherIns = new Fetcher(testUrl, 'test2', () => {
	// 		assert(true);
	// 		done();
	// 	});
	// });
	it('should return', function (done) {
		var testUrl = 'http://www.baidu.com/';
		var str = ''; // your baidu cookie!
		var fetcherIns = new _fetcher2.default(testUrl, 'baidu', function () {
			(0, _assert2.default)(true);
			done();
		}, {
			cookie: str
		});
	});
});