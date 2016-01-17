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
 * DOM tree -> text tree map 
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
			findDeepNext(queue, ++index);
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
		let nextNode = nextNodes[0];
		queue.push({
			node: parentNode,
			nextNodes: nextNodes.slice(1),
			index
		});
		depthErgodic(nextNode, queue, index);
	}
};


// let simplify = (tree) => {   
// };

module.exports = {
	getTree,
	pruning,
	saveTree
};