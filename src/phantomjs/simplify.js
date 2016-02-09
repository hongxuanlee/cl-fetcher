/**
 * 剪枝，剪去非文本节点 
 */
let pruning = (tree) => {
	let stack = [];
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
let depthErgodic = (node, stack, index) => {
	if (!node) {
		return;
	}
	let children = node.children;
	//leaf node
	if (!children || !children.length) {
		if (node.tag === 'textNode') {
			findDeepNext(stack);
		} else {
			removeNode(node, stack, index);
		}
	} else {
		// element node
		let curNode = children[0];
		stack.push({
			node,
			nodeIndex: index,
			nextIndex: 1
		});
		depthErgodic(curNode, stack, 0);
	}
};

// find next node ergodic
let findDeepNext = (stack) => {
	let nodeItems = stack.pop();
	if (!nodeItems) return;
	let sibling = nodeItems.node.children;
	let curIndex = nodeItems.nextIndex;
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
let removeNode = (node, stack, index) => {
	let nodeItems = stack.pop();
	if (!nodeItems) return;
	let parentNode = nodeItems.node;
	// remove current node
	let sibling = parentNode.children;
	if (!sibling || !sibling[index]) {
		return;
	}
	sibling.splice(index, 1);
	let nodeIndex = nodeItems.nodeIndex;
	let nextIndex = nodeItems.nextIndex;
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
			nodeIndex,
			nextIndex:nextIndex
		});
		depthErgodic(sibling[index], stack, index);
	}
};


let simplify = (tree) => {
	compress(pruning(tree));
	return tree;
};
/**
 * DOM tree -> text tree map 
 * compress tree
 * 
 */
let compress = (node) => {
	let children = node.children;
	if (!children || children.length === 0) {
		return;
	}
	if (needCompress(children)) {
		for (let i = 0, len = children.length; i < len; i++) {
			let pre = children[i];
			let cur = children[i].children[0];
			let compress = pre.compress || [];
			compress.push(pre.tag);
			cur.compress = compress;
			node.children[i] = cur;
		}
		compress(node);
	} else {
		for (let j = 0, lenth = children.length; j < lenth; j++) {
			compress(children[j]);
		}
	}
	return node;
};

let needCompress = (nodes) => {
	let item;
	for (let i = 0; i < nodes.length; i++) {
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
	pruning,
	compress,
	simplify
};