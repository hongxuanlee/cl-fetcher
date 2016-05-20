/**
 * to excute script in brower context
 */
module.exports = (options, remain) => {

	let FILTER_EVENT = ['xhrRequestOpen'];
	let isXhr = false;
	let eventCache = [];
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
		let filter = (options && options.filterEvent) ? options.filterEvent : FILTER_EVENT;
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
		eventCache =[];
		let isDeep = options.context && options.context.deepTraversal;
		console.log('isDeep', isDeep);
		while (!isXhr && (item = eventList.shift())) {
			let node = item.node;
			let type = item.type;
			let handles = item.handles;
			if (node.toString().indexOf('Element') > -1) {
				handles.forEach(function(func) {
					handleExec(node, func, type, isDeep);
				});
			}
		}
	};

	let handleExec = (node, func, type, isDeep) => {
		if(!node || isXhr){
			return;
		}
		let children = node.childNodes;
		let ev = document.createEvent('HTMLEvents');
		ev.initEvent(type, true, true);
		node.dispatchEvent(ev);
		if (children && isDeep) {
			for (let i = 0, len = children.length; i < len; i++) {
				let cur = children[i];
				handleExec(cur, func, type, isDeep);
			}
		}
	};

	let addXhrEvent = () => {
		let XHRhandles = function(e) {
			console.log('xhrOpen', JSON.stringify(e.opt.url));
			eventCache.push(e.opt.url);
			isXhr = true;
		};
		document.addEventListener('xhrRequestOpen',XHRhandles);
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