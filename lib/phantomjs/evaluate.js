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
			var ev = {};
			console.log(node, type);
			if (node && node.toString().indexOf('Element') > -1) {
				console.log('id:' + node.getAttribute('id') + ' tag:' + node.tagName);
				handles.forEach(function (item) {
					ev.target = node;
					item(ev);
				});
			}
		};

		while (!isXhr && (item = eventList.shift())) {
			_loop();
		}
	};

	var addXhrEvent = function addXhrEvent() {
		document.addEventListener('xhrRequestOpen', function (e) {
			console.log('xhrOpen', e.opt.url);
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