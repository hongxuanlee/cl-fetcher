'use strict';

/**
 * 剪枝，剪去非文本节点 
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
			findDeepNext(queue, index);
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
	var parentChildren = parentNode.children;
	parentChildren.splice(index, 1);
	var nextNodes = items.nextNodes;
	var parentIndex = items.index;
	if (!nextNodes || !nextNodes.length) {
		// only have this node,delete this parent node
		if (index === 0) {
			removeNode(parentNode, queue, parentIndex);
		} else {
			// find parent node not ergodic yet
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