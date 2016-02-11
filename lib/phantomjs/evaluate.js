'use strict';

/**
 * to excute script in brower context
 */
module.exports = function (option, remain) {

	var FILTER_EVENT = ['xhrRequestOpen'];
	var isXhr = false;
	var eventList = undefined;

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
		var filter = option && option.filterEvent ? option.filterEvent : FILTER_EVENT;
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

		var _loop = function _loop() {
			var node = item.node;
			var type = item.type;
			var handles = item.handles;
			console.log(node, type);
			if (node) {
				// console.log('id:' + node.getAttribute('id') + ' class:' + node.className + 'tag:' + node.tagName);
				handles.forEach(function (item) {
					handleExec(node, item);
				});
			}
		};

		while (!isXhr && (item = eventList.shift())) {
			_loop();
		}
	};

	var handleExec = function handleExec(node, item) {
		var children = node.childNodes;
		var ev = {};
		ev.target = node;
		item(ev);
		if (children) {
			for (var i = 0, len = children.length; i < len; i++) {
				var cur = children[i];
				handleExec(cur, item);
			}
		}
	};

	var addXhrEvent = function addXhrEvent() {
		document.addEventListener('xhrRequestOpen', function (e) {
			console.log('xhrOpen', JSON.stringify(e.opt.url));
			isXhr = true;
		});
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