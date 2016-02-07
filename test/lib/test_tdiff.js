'use strict';

var _tdiff = require('../../lib/phantomjs/tdiff');

var _tdiff2 = _interopRequireDefault(_tdiff);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('tdiff test', function () {
	var tree1 = JSON.parse(_fs2.default.readFileSync('./test/data/test_simplify_res_3.json'));
	var tree2 = JSON.parse(_fs2.default.readFileSync('./test/data/test_simplify_res_4.json'));
	it('should reture false if is same', function () {
		(0, _assert2.default)(!_tdiff2.default.diff(tree1, tree1));
		(0, _assert2.default)(!_tdiff2.default.diff(tree2, tree2));
	});
	it('should reture true if is different', function () {
		(0, _assert2.default)(_tdiff2.default.diff(tree1, tree2));
	});
});