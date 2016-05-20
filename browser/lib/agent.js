/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	window.eventAgent = __webpack_require__(1);
	window.xhrAgent = __webpack_require__(2);

	eventAgent.proxy();
	xhrAgent.proxyXhrOpen();

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	var eventMatrix = [];
	var proxyList = [];

	var globalObject = window;
	var domRepresent = globalObject.document;

	var proxyEventInterface = function proxyEventInterface() {
		proxyAddEvent(globalObject);
		proxyAddEvent(domRepresent);

		proxyRemoveEvent(globalObject);
		proxyRemoveEvent(domRepresent);
	};

	var proxyAddEvent = function proxyAddEvent(represent) {
		var funName = getAddName();
		proxyFun(represent, funName, function (owner, funName) {
			var oldFun = owner[funName];
			owner[funName] = function (eventType, eventHandler, useCapture) {
				var node = this;
				addEventInfoToList(node, eventType, eventHandler);
				return oldFun.apply(this, [eventType, eventHandler, useCapture]);
			};
		});
	};

	var proxyRemoveEvent = function proxyRemoveEvent(represent) {
		var funName = getRemoveName();
		proxyFun(represent, funName, function (owner, funName) {
			var oldFun = owner[funName];
			owner[funName] = function (eventType, eventHandler, useCapture) {
				var node = this;
				removeEventInfoFromList(node, eventType, eventHandler);
				return oldFun.apply(this, [eventType, eventHandler, useCapture]);
			};
		});
	};

	var proxyFun = function proxyFun(represent, funName, callback) {
		var owner = findFunOwner(represent, funName);
		if (!owner || containInProxyList(owner, funName)) return;
		callback && callback(owner, funName);
		proxyList.push({
			owner: owner,
			funName: funName
		});
	};

	var addEventInfoToList = function addEventInfoToList(node, eventType, eventHandler) {
		if (!node || !eventType || !isFunction(eventHandler)) return;
		var eventList = findEventList(node, true);
		if (!eventList) return;
		var eventTypeList = findEventTypeList(eventType, eventList, true);
		if (!eventTypeList) return;
		eventTypeList.handlers.push(eventHandler);
	};

	var removeEventInfoFromList = function removeEventInfoFromList(node, eventType, eventHandler) {
		if (!node || !eventType || !isFunction(eventHandler)) return;
		var eventList = findEventList(node, false);
		if (!eventList) return;
		var eventTypeList = findEventTypeList(eventType, eventList, false);
		if (!eventTypeList) return;
		var handlers = eventTypeList.handlers;
		removeFromList(handlers, eventHandler);
		// clear
		if (handlers.length === 0) {
			removeFromList(eventList.events, eventTypeList);
		}
		if (eventList.events.length === 0) {
			removeFromList(eventMatrix, eventList);
		}
	};

	var findEventTypeList = function findEventTypeList(eventType, eventList, auto) {
		var newEvt = null;
		if (!eventType) return newEvt;
		var events = eventList.events;
		for (var i = 0; i < events.length; i++) {
			var evt = events[i];
			if (eventType === evt.type) {
				return evt;
			}
		}
		if (auto) {
			newEvt = {
				type: eventType,
				handlers: []
			};
			events.push(newEvt);
		}
		return newEvt;
	};

	var findEventList = function findEventList(node, auto) {
		var newEventList = null;
		if (!node) return newEventList;
		for (var i = 0; i < eventMatrix.length; i++) {
			var eventList = eventMatrix[i];
			if (eventList.node === node) {
				return eventList;
			}
		}
		if (auto) {
			newEventList = {
				node: node,
				events: []
			};
			eventMatrix.push(newEventList);
		}
		return newEventList;
	};

	var containInProxyList = function containInProxyList(owner, funName) {
		for (var i = 0; i < proxyList.length; i++) {
			var proxyObj = proxyList[i];
			if (proxyObj.owner === owner && proxyObj.funName === funName) {
				return true;
			}
		}
		return false;
	};

	var findFunOwner = function findFunOwner(startObj, funName) {
		if (!startObj) return null;
		var curObj = startObj;
		while (curObj) {
			if (curObj.hasOwnProperty(funName)) {
				return curObj;
			} else {
				if (Object.getPrototypeOf) {
					curObj = Object.getPrototypeOf(curObj);
				} else {
					curObj = curObj.__proto__;
				}
			}
		}
		return null;
	};

	var getAddName = function getAddName() {
		return domRepresent.addEventListener ? "addEventListener" : "attachEvent";
	};

	var getRemoveName = function getRemoveName() {
		return domRepresent.removeEventListener ? "removeEventListener" : "detachEvent";
	};

	var isFunction = function isFunction(fn) {
		return !!fn && !fn.nodeName && fn.constructor != String && fn.constructor != RegExp && fn.constructor != Array && /function/i.test(fn + "");
	};

	var getErgodicList = function getErgodicList() {
		var list = [];
		for (var i = 0; i < eventMatrix.length; i++) {
			var eventList = eventMatrix[i];
			var node = eventList.node;
			var events = eventList.events;
			for (var j = 0; j < events.length; j++) {
				var eventTypeList = events[j];
				var type = eventTypeList.type;
				var handlers = eventTypeList.handlers;
				for (var k = 0; k < handlers.length; k++) {
					var handler = handlers[k];
					list.push({
						node: node,
						type: type,
						handler: handler,
						eventList: eventList,
						eventTypeList: eventTypeList
					});
				}
			}
		}
		return list;
	};
	var getEventList = function getEventList() {
		var list = [];
		for (var i = 0; i < eventMatrix.length; i++) {
			var eventList = eventMatrix[i];
			var node = eventList.node;
			var events = eventList.events;
			for (var j = 0; j < events.length; j++) {
				list.push({
					node: node,
					type: events[j].type,
					handles: events[j].handlers
				});
			}
		}
		eventMatrix.splice(0, eventMatrix.length);
		return list;
	};
	var removeFromList = function removeFromList(list, item) {
		for (var i = 0; i < list.length; i++) {
			if (list[i] === item) {
				list.splice(i, 1);
				i = i - 1;
			}
		}
	};

	module.exports = {
		proxy: proxyEventInterface,
		getRemoveName: getRemoveName,
		getAddName: getAddName,
		getErgodicList: getErgodicList,
		getEventList: getEventList
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * only adapted XMLHttpRequest object.
	 **/

	var xhrObjectList = [];

	var proxyXhrOpen = function proxyXhrOpen() {
		var handle = function handle() {
			var e = document.createEvent('Events');
			e.initEvent('xhrRequestOpen');
			var option = {
				url: arguments.length <= 1 ? undefined : arguments[1],
				method: arguments.length <= 0 ? undefined : arguments[0]
			};
			e.opt = option;
			document.dispatchEvent(e);
			xhrObjectList.push(option);
		};
		proxy('open', handle);
	};

	// var proxyStateChange = function() {
	// 	var xhrObject = getXhrProto();
	// 	window.xhrDone  = false;
	// 	Object.defineProperty(xhrObject, 'onreadystatechange', {
	// 		get: function() {
	// 			return value;
	// 		},
	// 		set: function(func) {
	// 			var that = this;
	// 			value = function(){
	// 				func.apply(that);
	// 				console.log('new');
	// 				if(that.readyState == 4){
	// 					window.xhrDone = true;
	// 					console.log('xhrDone');
	// 				}
	// 			}
	// 			// value.prototype = xhrObject.onreadystatechange;
	// 		}
	// 	});
	// }

	var proxy = function proxy(funcName, injectFunc) {
		if (!funcName || !injectFunc || typeof injectFunc !== 'function') {
			return false;
		}
		var xhrObject = getXhrProto();
		if (xhrObject && xhrObject[funcName] && typeof xhrObject[funcName] === 'function') {
			(function () {
				var oldFunc = xhrObject[funcName];
				xhrObject[funcName] = function () {
					for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
						args[_key] = arguments[_key];
					}

					injectFunc.apply(this, args);
					oldFunc.apply(this, args);
				};
			})();
		}
		return true;
	};

	var getXhrProto = function getXhrProto() {
		return window.XMLHttpRequest.prototype;
	};

	var getXhrList = function getXhrList() {
		return xhrObjectList;
	};

	// let trigger = (eventName,dataMap) => {
	// 	let e = document.createEvent('Events');
	// 	e.initEvent(eventName);
	// 	if (dataMap) {
	// 		for (let propName in dataMap) {
	// 			e[propName] = dataMap[propName];
	// 		}
	// 	}
	// 	document.dispatchEvent(e);
	// };
	//
	module.exports = {
		proxyXhrOpen: proxyXhrOpen,
		proxy: proxy,
		getXhrList: getXhrList
	};

/***/ }
/******/ ]);