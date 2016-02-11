/**
 * to excute script in brower context
 */
module.exports = (option, remain) => {

	let FILTER_EVENT = ['xhrRequestOpen'];
	let isXhr = false;
	let eventList;

	let getEventList = () => {
		let eventList = eventAgent.getEventList();
		if (remain) {
			let remove = eventList.length - remain;
			eventList.splice(0, remove);
		}
		return eventList;
	};
	/**
	 * To prevent repeated to add xhr event
	 */
	let hasListen = (eventList) => {
		let l = eventList.length;
		let hasListen = false;
		while (l--) {
			let type = eventList[l].type;
			if (type === "xhrRequestOpen") {
				hasListen = true;
			}
		}
		return hasListen;
	};

	/**
	 * filter customize event;
	 */
	let filterEvent = (eventList) => {
		let filter = (option && option.filterEvent) ? option.filterEvent : FILTER_EVENT;
		let l = eventList.length;
		while (l--) {
			let type = eventList[l].type;
			if (filter.indexOf(type) > -1) {
				eventList.splice(l, 1);
			}
		}
		return eventList;
	};

	/**
	 * trigger event in eventList
	 */
	let execEvent = (eventList) => {
		let item;
		while (!isXhr && (item = eventList.shift())) {
			let node = item.node;
			let type = item.type;
			let handles = item.handles;
			console.log(node, type);
			if (node) {
				// console.log('id:' + node.getAttribute('id') + ' class:' + node.className + 'tag:' + node.tagName);
				handles.forEach(function(item) {
					handleExec(node, item);
				});
			}
		}
	};

	let handleExec = (node, item) => {
		let children = node.childNodes;
		let ev = {};
		ev.target = node;
		item(ev);
		if (children) {
			for (let i = 0, len = children.length; i < len; i++) {
				let cur = children[i];
				handleExec(cur, item);
			}
		}

	};

	let addXhrEvent = () => {
		document.addEventListener('xhrRequestOpen', function(e) {
			console.log('xhrOpen', JSON.stringify(e.opt.url));
			isXhr = true;
		});
	};

	let main = () => {
		let eventList = getEventList();
		if (!hasListen(eventList)) {
			addXhrEvent();
		}
		eventList = filterEvent(eventList);
		execEvent(eventList);
		return {
			statusChange: isXhr,
			eventRemain: eventList.length
		};

	};
	return main();
};