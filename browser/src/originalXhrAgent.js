/**
 * only adapted XMLHttpRequest object.
 **/
let xhrObjectList = [];

let proxyXhrOpen = () => {
	let handle = (...args) => {
		let e = document.createEvent('Events');
		e.initEvent('xhrRequestOpen');
		let option = {
			url: args[1],
			method: args[0]
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

let proxy = (funcName, injectFunc) => {
	if (!funcName || !injectFunc || typeof injectFunc !== 'function') {
		return false;
	}
	let xhrObject = getXhrProto();
	if (xhrObject && xhrObject[funcName] && typeof xhrObject[funcName] === 'function') {
		let oldFunc = xhrObject[funcName];
		xhrObject[funcName] = function(...args){
			injectFunc.apply(this, args);
			oldFunc.apply(this, args);
		};
	}
	return true;
};

let getXhrProto = () => {
	return window.XMLHttpRequest.prototype;
};

let getXhrList = () => {
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
	proxyXhrOpen,
	proxy,
	getXhrList
};