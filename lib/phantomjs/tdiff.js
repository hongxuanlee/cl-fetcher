'use strict';

var isTextEqual = function isTextEqual(left, right) {
	if (left.tag === 'textNode' && right.tag === 'textNode') {
		if (left.text === right.text) {
			return true;
		}
	}
	return false;
};

var isNodeEqual = function isNodeEqual(left, right) {
	if (left.tag !== 'textNode' && right.tag !== 'textNode') {
		if (left.children && right.children && left.children.length && left.children.length === right.children.length) {
			return true;
		}
	}
	return false;
};

var diff = function diff(left, right) {
	if (isTextEqual(left, right)) {
		return false;
	}
	if (isNodeEqual(left, right)) {
		var leftNodes = left.children;
		var rightNodes = right.children;
		for (var i = 0; i < leftNodes.length; i++) {
			if (diff(leftNodes[i], rightNodes[i])) {
				return true;
			}
		}
		return false;
	}
	return true;
};

module.exports = {
	diff: diff
};