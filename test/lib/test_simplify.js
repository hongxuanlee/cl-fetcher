'use strict';

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

require('babel-polyfill');

var _simplify = require('../../lib/phantomjs/simplify');

var _simplify2 = _interopRequireDefault(_simplify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

describe('Tree simplyfy', function () {
	it('should cut no textNode branch', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
		var path, tree, res;
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						path = _path2.default.join(__dirname, '../data/test_simplify_1.json');
						_context.next = 3;
						return _simplify2.default.getTree(path);

					case 3:
						tree = _context.sent;
						res = _simplify2.default.pruning(tree);

						_assert2.default.equal(res.children[0].children.length, 2);
						_assert2.default.equal(res.children[0].children[0].attr.class, 'text1');
						_assert2.default.equal(res.children[0].children[1].attr.class, 'text2');
						_assert2.default.equal(res.children[0].children[0].children[0].tag, 'textNode');
						_assert2.default.equal(res.children[0].children[1].children[0].tag, 'textNode');
						_assert2.default.equal(res.children[0].children[0].children[0].text, 'here is content 1 !');

					case 11:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, undefined);
	})));
});