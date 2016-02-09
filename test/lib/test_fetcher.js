'use strict';

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _fetcher = require('../../lib/fetcher');

var _fetcher2 = _interopRequireDefault(_fetcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('fetcher page', function () {
	it('should return', function (done) {
		var testUrl = 'file:///Users/kino/Workspace/cl-fetcher/test/data/fetcher2.html';
		var fetcherIns = new _fetcher2.default(testUrl, 'test1', function () {
			(0, _assert2.default)(true);
			done();
		});
	});
	it('should return', function (done) {
		var testUrl = 'file:///Users/kino/Workspace/cl-fetcher/test/data/fetcher1.html';
		var fetcherIns = new _fetcher2.default(testUrl, 'test2', function () {
			(0, _assert2.default)(true);
			done();
		});
	});
	it('should return', function (done) {
		var testUrl = 'http://news.baidu.com/';
		var fetcherIns = new _fetcher2.default(testUrl, 'baidu', function () {
			(0, _assert2.default)(true);
			done();
		});
	});
});