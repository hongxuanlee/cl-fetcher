'use strict';

require('babel-polyfill');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

var readFile = _bluebird2.default.promisify(_fs2.default.readFile);
var writeFile = _bluebird2.default.promisify(_fs2.default.writeFile);

var getTree = (function () {
	var _this = this;

	var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(path) {
		var data;
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						_context.next = 2;
						return readFile(path);

					case 2:
						data = _context.sent;
						return _context.abrupt('return', JSON.parse(data));

					case 4:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, _this);
	}));

	return function getTree(_x) {
		return ref.apply(this, arguments);
	};
})();

var saveTree = (function () {
	var _this2 = this;

	var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(path, data) {
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						_context2.next = 2;
						return writeFile(path, JSON.stringify(data));

					case 2:
						return _context2.abrupt('return', _context2.sent);

					case 3:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, _this2);
	}));

	return function saveTree(_x2, _x3) {
		return ref.apply(this, arguments);
	};
})();

/**
 * DOM tree -> text tree map 
 */
var pruning = function pruning(tree) {
	var queue = [];
	depthErgodic(tree, queue, 0);
	return tree;
};

/**
 * 深度遍历剪枝
 */
var depthErgodic = function depthErgodic(node, queue, index) {
	if (!node) {
		return;
	}
	var children = node.children;
	//leaf node
	if (!children || !children.length) {
		if (node.tag === 'textNode') {
			findDeepNext(queue, ++index);
		} else {
			removeNode(node, queue, index);
		}
	} else {
		// element node
		var curNode = children[0];
		var nextNodes = children.slice(1);
		queue.push({
			node: node,
			nextNodes: nextNodes,
			index: 0
		});
		depthErgodic(curNode, queue, 0);
	}
};

// find next node ergodic

var findDeepNext = function findDeepNext(queue, index) {
	index = index || 0;
	var nodeItems = queue.pop();
	if (!nodeItems) return;
	var nextNodes = nodeItems.nextNodes;
	if (nextNodes && nextNodes.length) {
		var nextNode = nextNodes[0];
		queue.push({
			node: nodeItems.node,
			nextNodes: nextNodes.slice(1),
			index: nodeItems.index
		});
		depthErgodic(nextNode, queue, ++index);
	} else {
		findDeepNext(queue, parseInt(nodeItems.index) + 1);
	}
};

// remove no textNode branch
var removeNode = function removeNode(node, queue, index) {
	var items = queue.pop();
	if (!items) return;
	var parentNode = items.node;
	// remove current node
	parentNode.children.splice(index, 1);
	var nextNodes = items.nextNodes;
	var parentIndex = items.index;
	// 同级节点已经遍历完
	if (!nextNodes || !nextNodes.length) {
		// 只剩下该节点，继续删除
		if (index === 0) {
			removeNode(parentNode, queue, parentIndex);
			// 寻找上级节点未遍历的同级节点
		} else {
				findDeepNext(queue, ++parentIndex);
			}
	} else {
		var nextNode = nextNodes[0];
		queue.push({
			node: parentNode,
			nextNodes: nextNodes.slice(1),
			index: index
		});
		depthErgodic(nextNode, queue, index);
	}
};

// let simplify = (tree) => {  
// };

module.exports = {
	getTree: getTree,
	pruning: pruning,
	saveTree: saveTree
};