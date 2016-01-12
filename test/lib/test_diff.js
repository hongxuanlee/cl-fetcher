'use strict';

var _diff = require('../../lib/phantomjs/diff');

var _diff2 = _interopRequireDefault(_diff);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Dom diff', function () {
	it('should judge equal node', function () {
		var node1 = {
			"attr": {
				"class": "box",
				"id": "box1"
			},
			"children": [],
			"rect": [13, 8, 202, 82],
			"tag": "div"
		};
		var node2 = {
			"attr": {
				"class": "box",
				"id": "box1"
			},
			"children": [],
			"rect": [13, 8, 202, 82],
			"tag": "div"
		};
		(0, _assert2.default)(_diff2.default.isEqualNode(node1, node2));
	});

	it('should judge unequal node', function () {
		var node1 = {
			"attr": {
				"class": "box",
				"id": "box1"
			},
			"children": [],
			"rect": [13, 8, 202, 82],
			"tag": "div"
		};
		var node2 = {
			"attr": {
				"class": "box",
				"id": "box2"
			},
			"children": [],
			"rect": [13, 8, 202, 82],
			"tag": "div"
		};
		(0, _assert2.default)(!_diff2.default.isEqualNode(node1, node2));
	});

	it('should diff dom Tree', function (done) {
		var dom1 = JSON.parse(_fs2.default.readFileSync('./test/data/test_diff_1.json', 'utf8'));
		var dom2 = JSON.parse(_fs2.default.readFileSync('./test/data/test_diff_2.json', 'utf8'));
		var diffRes = _diff2.default.diff(dom1, dom2);
		var expect = [{
			"type": 2,
			"node": {
				"attr": {
					"class": "box",
					"id": "newbox"
				},
				"children": [{
					"tag": "textNode",
					"text": "here is new content!"
				}],
				"rect": [13, 269, 202, 82],
				"tag": "div"
			},
			"index": 3
		}];
		done();
	});
});