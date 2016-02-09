'use strict';

/**
 * 剪枝，剪去非文本节点 
 */
var pruning = function pruning(tree) {
	var stack = [];
	depthErgodic(tree, stack, 0);
	return tree;
};

/**
 * 深度遍历剪枝
 * node: 节点
 * index: node节点基于父节点的索引
 * stack: array
 * {
 * 	 node:推入栈的节点
 * 	 nodeIndex:node相对于父索引的节点
 * 	 nextIndex: 取栈时遍历节点的索引
 * }
 */
var depthErgodic = function depthErgodic(node, stack, index) {
	if (!node) {
		return;
	}
	var children = node.children;
	//leaf node
	if (!children || !children.length) {
		if (node.tag === 'textNode') {
			findDeepNext(stack);
		} else {
			removeNode(node, stack, index);
		}
	} else {
		// element node
		var curNode = children[0];
		stack.push({
			node: node,
			nodeIndex: index,
			nextIndex: 1
		});
		depthErgodic(curNode, stack, 0);
	}
};

// find next node ergodic
var findDeepNext = function findDeepNext(stack) {
	var nodeItems = stack.pop();
	if (!nodeItems) return;
	var sibling = nodeItems.node.children;
	var curIndex = nodeItems.nextIndex;
	if (sibling && sibling[curIndex]) {
		stack.push({
			node: nodeItems.node,
			nodeIndex: nodeItems.nodeIndex,
			nextIndex: parseInt(curIndex) + 1
		});
		depthErgodic(sibling[curIndex], stack, curIndex);
	} else {
		findDeepNext(stack);
	}
};

// remove no textNode branch
var removeNode = function removeNode(node, stack, index) {
	var nodeItems = stack.pop();
	if (!nodeItems) return;
	var parentNode = nodeItems.node;
	// remove current node
	var sibling = parentNode.children;
	if (!sibling || !sibling[index]) {
		return;
	}
	sibling.splice(index, 1);
	var nodeIndex = nodeItems.nodeIndex;
	var nextIndex = nodeItems.nextIndex;
	if (!sibling[nextIndex]) {
		// only have this node,delete this parent node
		if (index === 0 && sibling.length === 1) {
			removeNode(parentNode, stack, nodeIndex);
		} else {
			// find parent node not ergodic yet
			findDeepNext(stack);
		}
	} else {
		stack.push({
			node: parentNode,
			nodeIndex: nodeIndex,
			nextIndex: nextIndex
		});
		depthErgodic(sibling[index], stack, index);
	}
};

var simplify = function simplify(tree) {
	compress(pruning(tree));
	return tree;
};
/**
 * DOM tree -> text tree map 
 * compress tree
 * 
 */
var compress = function compress(node) {
	var children = node.children;
	if (!children || children.length === 0) {
		return;
	}
	if (needCompress(children)) {
		for (var i = 0, len = children.length; i < len; i++) {
			var pre = children[i];
			var cur = children[i].children[0];
			var _compress = pre.compress || [];
			_compress.push(pre.tag);
			cur.compress = _compress;
			node.children[i] = cur;
		}
		compress(node);
	} else {
		for (var j = 0, lenth = children.length; j < lenth; j++) {
			compress(children[j]);
		}
	}
	return node;
};

var needCompress = function needCompress(nodes) {
	var item = undefined;
	for (var i = 0; i < nodes.length; i++) {
		item = nodes[i];
		if (item.children && item.children.length === 1 && item.children[0].tagName !== 'textNode') {
			continue;
		} else {
			return false;
		}
	}
	return true;
};

module.exports = {
	pruning: pruning,
	compress: compress,
	simplify: simplify
};