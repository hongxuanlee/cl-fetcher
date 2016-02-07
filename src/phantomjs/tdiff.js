let isTextEqual = (left, right) => {
	if (left.tag === 'textNode' && right.tag === 'textNode') {
		if (left.text === right.text) {
			return true;
		}
	}
	return false;
};

let isNodeEqual = (left, right) => {
	if (left.tag !== 'textNode' && right.tag !== 'textNode') {
		if (left.children && right.children && left.children.length && left.children.length === right.children.length) {
			return true;
		}
	}
	return false;
};

let diff = (left, right) => {
	if (isTextEqual(left, right)) {
		return false;
	}
	if (isNodeEqual(left, right)) {
		let leftNodes = left.children;
		let rightNodes = right.children;
		for (let i = 0; i < leftNodes.length; i++) {
			if (diff(leftNodes[i], rightNodes[i])) {
				return true;
			}
		}
		return false;
	}
	return true;
};

module.exports = {
	diff
};