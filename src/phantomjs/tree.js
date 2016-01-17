import md5 from 'md5';
module.exports = () => {
	let DEFAULT = {
		style: [
			'background-color', 'background-image', 'background-repeat',
			'background-size', 'background-position', 'font-size',  
			'clear', 'color', 'display', 'float', 'opacity', 'text-align',
			'visibility','position'
		],
		ignoreChildrenElements: [
			'img', 'canvas', 'input', 'textarea', 'audio',
			'video', 'hr', 'embed', 'object', 'progress',
			'select', 'table'
		],
		attributeFilters: ['id', 'class']
	};
	let igonreChildren = (elem) => {
		let ignoreChildrenElementReg = new RegExp('^(' + DEFAULT.ignoreChildrenElements.join('|') + ')$', 'i');
		ignoreChildrenElementReg.lastIndex = 0;
		return ignoreChildrenElementReg.test(elem.tagName);
	};
	let getStyles = (elem) => {
		let elemStyle = {};
		let filters = DEFAULT.style;
		let styles = getComputedStyle(elem, null);
		let display = styles.getPropertyValue('display');
		let opacity = styles.getPropertyValue('opacity');
		let visibility = styles.getPropertyValue('visibility');
		if (display !== 'none' && opacity !== '0' && visibility !== 'hidden') {
			let position = styles.getPropertyValue('position');
			if (position !== 'static') {
				filters.push('top', 'right', 'bottom', 'left');
			}
			filters.forEach(function(key) {
				elemStyle[key] = styles.getPropertyValue(key);
			});
		} else {
			return false;
		}
		return elemStyle;
	};
	let getRect = (elem) => {
		let rect = elem.getBoundingClientRect();
		let doc = elem.ownerDocument;
		let win = doc.defaultView;
		let html = doc.documentElement;
		let x = Math.floor(rect.left + win.pageXOffset - html.clientLeft);
		let y = Math.floor(rect.top + win.pageYOffset - html.clientTop);
		let w = Math.floor(rect.width);
		let h = Math.floor(rect.height);
		return [x, y, w, h];
	};
	let getAttr = (elem) => {
		let ret = {};
		let filters = DEFAULT.attributeFilters;
		let hasAttr = false;
		if (elem.tagName === 'INPUT') {
			filters.push('type');
		}
		filters.forEach((key) => {
			let attr = elem.getAttribute(key);
			if (attr !== null) {
				hasAttr = true;
				ret[key] = attr;
			}
		});
		return hasAttr ? ret : false;
	};

	let getTree = (elem) => {
		let nodeInfo = {};
		if (elem.nodeType === 1 && elem.tagName !== "SCRIPT") {
			nodeInfo.tag = elem.tagName.toLowerCase();
			nodeInfo.rect = getRect(elem);
			if (getAttr(elem)) nodeInfo.attr = getAttr(elem);
			if (getStyles(elem)) {
				let styles = getStyles(elem);
				nodeInfo.styles = styles;
				nodeInfo.styleFinger = md5(JSON.stringify(styles));
			}
			let children = [].slice.call(elem.childNodes);
			let childArr = [];
			if (children.length > 0) {
				for (let i = 0; i < children.length; i++) {
					let child = getTree(children[i]);
					if (child) childArr.push(child);
				}
				nodeInfo.children = childArr;
			}
			return nodeInfo;
		} else if (elem.nodeType === 3) {
			let text = elem.nodeValue.trim();
			if (text.length > 0) {
				nodeInfo.tag = 'textNode';
				nodeInfo.text = text;
				return nodeInfo;
			}
		}
	};
	return getTree(document.body);
};