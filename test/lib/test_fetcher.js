'use strict';

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _fetcher = require('../../lib/fetcher');

var _fetcher2 = _interopRequireDefault(_fetcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('fetcher page', function () {
	it('should return', function (done) {
		var testUrl = 'http://www.baidu.com';
		var fetcherIns = new _fetcher2.default(testUrl, function () {
			done();
		});
	});
});