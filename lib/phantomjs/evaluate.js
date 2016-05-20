'use strict';

/**
 * to excute script in brower context
 */
module.exports = function (options, remain) {

	var FILTER_EVENT = ['xhrRequestOpen'];
	var isXhr = false;
	var eventCache = [];
	var getEventList = function getEventList() {
		var eventList = eventAgent.getEventList();
		if (remain) {
			var remove = eventList.length - remain;
			eventList.splice(0, remove);
		}
		return eventList;
	};
	/**
  * To prevent repeated to add xhr event
  */
	var hasListen = function hasListen(eventList) {
		var l = eventList.length;
		var hasListen = false;
		while (l--) {
			var type = eventList[l].type;
			if (type === "xhrRequestOpen") {
				hasListen = true;
			}
		}
		return hasListen;
	};

	/**
  * filter customize event;
  */
	var filterEvent = function filterEvent(eventList) {
		var filter = options && options.filterEvent ? options.filterEvent : FILTER_EVENT;
		var l = eventList.length;
		while (l--) {
			var type = eventList[l].type;
			if (filter.indexOf(type) > -1) {
				eventList.splice(l, 1);
			}
		}
		return eventList;
	};

	/**
  * trigger event in eventList
  */
	var execEvent = function execEvent(eventList) {
		var item = undefined;
		eventCache = [];
		var isDeep = options.context && options.context.deepTraversal;
		console.log('isDeep', isDeep);

		var _loop = function _loop() {
			var node = item.node;
			var type = item.type;
			var handles = item.handles;
			if (node.toString().indexOf('Element') > -1) {
				handles.forEach(function (func) {
					handleExec(node, func, type, isDeep);
				});
			}
		};

		while (!isXhr && (item = eventList.shift())) {
			_loop();
		}
	};

	var handleExec = function handleExec(node, func, type, isDeep) {
		if (!node || isXhr) {
			return;
		}
		var children = node.childNodes;
		var ev = document.createEvent('HTMLEvents');
		ev.initEvent(type, true, true);
		node.dispatchEvent(ev);
		if (children && isDeep) {
			for (var i = 0, len = children.length; i < len; i++) {
				var cur = children[i];
				handleExec(cur, func, type, isDeep);
			}
		}
	};

	var addXhrEvent = function addXhrEvent() {
		var XHRhandles = function XHRhandles(e) {
			console.log('xhrOpen', JSON.stringify(e.opt.url));
			eventCache.push(e.opt.url);
			isXhr = true;
		};
		document.addEventListener('xhrRequestOpen', XHRhandles);
	};

	var main = function main() {
		var eventList = getEventList();
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