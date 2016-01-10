'use strict';

module.exports = function () {
	var DEFAULT = {
		style: ['background-color', 'background-image', 'background-repeat', 'background-size', 'background-position', 'font-size', 'clear', 'color', 'display', 'float', 'opacity', 'text-align', 'visibility', 'position'],
		ignoreChildrenElements: ['img', 'canvas', 'input', 'textarea', 'audio', 'video', 'hr', 'embed', 'object', 'progress', 'select', 'table'],
		attributeFilters: ['id', 'class']
	};
	var igonreChildren = function igonreChildren(elem) {
		var ignoreChildrenElementReg = new RegExp('^(' + DEFAULT.ignoreChildrenElements.join('|') + ')$', 'i');
		ignoreChildrenElementReg.lastIndex = 0;
		return ignoreChildrenElementReg.test(elem.tagName);
	};
	var getStyles = function getStyles(elem) {
		var elemStyle = {};
		var filters = DEFAULT.style;
		var styles = getComputedStyle(elem, null);
		var display = styles.getPropertyValue('display');
		var opacity = styles.getPropertyValue('opacity');
		var visibility = styles.getPropertyValue('visibility');
		if (display !== 'none' && opacity !== '0' && visibility !== 'hidden') {
			var position = styles.getPropertyValue('position');
			if (position !== 'static') {
				filters.push('top', 'right', 'bottom', 'left');
			}
			filters.forEach(function (key) {
				elemStyle[key] = styles.getPropertyValue(key);
			});
		} else {
			return false;
		}
		return elemStyle;
	};
	var getRect = function getRect(elem) {
		var rect = elem.getBoundingClientRect();
		var doc = elem.ownerDocument;
		var win = doc.defaultView;
		var html = doc.documentElement;
		var x = Math.floor(rect.left + win.pageXOffset - html.clientLeft);
		var y = Math.floor(rect.top + win.pageYOffset - html.clientTop);
		var w = Math.floor(rect.width);
		var h = Math.floor(rect.height);
		return [x, y, w, h];
	};
	var getAttr = function getAttr(elem) {
		var ret = {};
		var filters = DEFAULT.attributeFilters;
		var hasAttr = false;
		if (elem.tagName === 'INPUT') {
			filters.push('type');
		}
		filters.forEach(function (key) {
			var attr = elem.getAttribute(key);
			if (attr !== null) {
				hasAttr = true;
				ret[key] = attr;
			}
		});
		return hasAttr ? ret : false;
	};

	var getTree = function getTree(elem) {
		var nodeInfo = {};
		if (elem.nodeType === 1 && elem.tagName !== "SCRIPT") {
			nodeInfo.tag = elem.tagName.toLowerCase();
			nodeInfo.rect = getRect(elem);
			if (getAttr(elem)) nodeInfo.attr = getAttr(elem);
			if (getStyles(elem)) nodeInfo.styles = getStyles(elem);
			var children = [].slice.call(elem.childNodes);
			var childArr = [];
			if (children.length > 0) {
				for (var i = 0; i < children.length; i++) {
					var child = getTree(children[i]);
					if (child) childArr.push(child);
				}
				nodeInfo.children = childArr;
			}
			return nodeInfo;
		} else if (elem.nodeType === 3) {
			var text = elem.nodeValue.trim();
			if (text.length > 0) {
				nodeInfo.tag = 'textNode';
				nodeInfo.text = text;
				return nodeInfo;
			}
		}
	};
	return getTree(document.body);
};