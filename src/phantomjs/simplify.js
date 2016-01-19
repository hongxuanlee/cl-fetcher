import 'babel-polyfill';
import fs from 'fs';
import promise from 'bluebird';

let readFile = promise.promisify(fs.readFile);
let writeFile = promise.promisify(fs.writeFile);

let getTree = async(path) => {
	let data = await readFile(path);
	return JSON.parse(data);
};

let saveTree = async(path, data) => {
	return await writeFile(path, JSON.stringify(data));
};

/**
 * 剪枝 -> 非文本节点 
 */
let pruning = (tree) => {
	let queue = [];
	depthErgodic(tree, queue, 0);
	return tree;
};

/**
 * 深度遍历剪枝
 */
let depthErgodic = (node, queue, index) => {
	if (!node) {
		return;
	}
	let children = node.children;
	//leaf node
	if (!children || !children.length) {
		if (node.tag === 'textNode') {
			findDeepNext(queue, index);
		} else {
			removeNode(node, queue, index);
		}
	} else {
		// element node
		let curNode = children[0];
		let nextNodes = children.slice(1);
		queue.push({
			node,
			nextNodes,
			index: 0
		});
		depthErgodic(curNode, queue, 0);
	}

};

// find next node ergodic

let findDeepNext = (queue, index) => {
	index = index || 0;
	let nodeItems = queue.pop();
	if (!nodeItems) return;
	let nextNodes = nodeItems.nextNodes;
	if (nextNodes && nextNodes.length) {
		let nextNode = nextNodes[0];
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
let removeNode = (node, queue, index) => {
	let items = queue.pop();
	if (!items) return;
	let parentNode = items.node;
	// remove current node
	parentNode.children.splice(index, 1);
	let nextNodes = items.nextNodes;
	let parentIndex = items.index;
	if (!nextNodes || !nextNodes.length) {
		// only have this node,delete this parent node
		if (index === 0) {
			removeNode(parentNode, queue, parentIndex);
		} else {
			// find parent node not ergodic yet
			findDeepNext(queue, ++parentIndex);
		}
	} else {
		let nextNode = nextNodes[0];
		queue.push({
			node: parentNode,
			nextNodes: nextNodes.slice(1),
			index
		});
		depthErgodic(nextNode, queue, index);
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
	if (!children || children.length === 0 ) {
		return;
	}
	console.log(node.tag);
	if (needCompress(children)) {
		for (var i = 0, len = children.length; i < len; i++) {
			node.children[i] = children[i].children[0];
		}
		compress(node);
	} else {
		for (var j = 0, lenth = children.length; j < lenth; j++) {
			compress(children[j]);
		}
	}
	return node;
};

let needCompress = (nodes) => {
	let item;
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
	getTree,
	saveTree,
	pruning,
	compress,
	simplify
};