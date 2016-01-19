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
	it('should get tree', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
		var path;
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						path = _path2.default.join(__dirname, '../data/test_simplify_1.json');
						_context.next = 3;
						return _simplify2.default.getTree(path);

					case 3:
						(0, _assert2.default)(true);

					case 4:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, undefined);
	})));

	it('should cut no textNode branch', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
		var path, tree, res, expectPath, expectTree;
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						path = _path2.default.join(__dirname, '../data/test_simplify_1.json');
						_context2.next = 3;
						return _simplify2.default.getTree(path);

					case 3:
						tree = _context2.sent;
						res = _simplify2.default.pruning(tree);
						expectPath = _path2.default.join(__dirname, '../data/test_simplify_res_1.json');
						_context2.next = 8;
						return _simplify2.default.getTree(expectPath);

					case 8:
						expectTree = _context2.sent;

						_assert2.default.deepEqual(expectTree, res);

					case 10:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, undefined);
	})));

	it('should cut no textNode branch', _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
		var path, tree, res, expectPath, expectTree;
		return regeneratorRuntime.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						path = _path2.default.join(__dirname, '../data/test_simplify_2.json');
						_context3.next = 3;
						return _simplify2.default.getTree(path);

					case 3:
						tree = _context3.sent;
						res = _simplify2.default.pruning(tree);
						expectPath = _path2.default.join(__dirname, '../data/test_simplify_res_2.json');
						_context3.next = 8;
						return _simplify2.default.getTree(expectPath);

					case 8:
						expectTree = _context3.sent;

						_assert2.default.deepEqual(expectTree, res);

					case 10:
					case 'end':
						return _context3.stop();
				}
			}
		}, _callee3, undefined);
	})));

	it('should compress', _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
		var path, tree, res, expectPath, expectTree;
		return regeneratorRuntime.wrap(function _callee4$(_context4) {
			while (1) {
				switch (_context4.prev = _context4.next) {
					case 0:
						path = _path2.default.join(__dirname, '../data/test_simplify_3.json');
						_context4.next = 3;
						return _simplify2.default.getTree(path);

					case 3:
						tree = _context4.sent;
						res = _simplify2.default.compress(tree);
						expectPath = _path2.default.join(__dirname, '../data/test_simplify_res_3.json');
						_context4.next = 8;
						return _simplify2.default.getTree(expectPath);

					case 8:
						expectTree = _context4.sent;

						_assert2.default.deepEqual(expectTree, res);

					case 10:
					case 'end':
						return _context4.stop();
				}
			}
		}, _callee4, undefined);
	})));

	it('should simplyfy', _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
		var path, tree, res, expectPath, expectTree;
		return regeneratorRuntime.wrap(function _callee5$(_context5) {
			while (1) {
				switch (_context5.prev = _context5.next) {
					case 0:
						path = _path2.default.join(__dirname, '../data/test_simplify_4.json');
						_context5.next = 3;
						return _simplify2.default.getTree(path);

					case 3:
						tree = _context5.sent;
						res = _simplify2.default.simplify(tree);
						expectPath = _path2.default.join(__dirname, '../data/test_simplify_res_4.json');
						_context5.next = 8;
						return _simplify2.default.getTree(expectPath);

					case 8:
						expectTree = _context5.sent;

						_assert2.default.deepEqual(expectTree, res);

					case 10:
					case 'end':
						return _context5.stop();
				}
			}
		}, _callee5, undefined);
	})));
});