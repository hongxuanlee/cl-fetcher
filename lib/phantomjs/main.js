'use strict';

var _log = require('./log.js');

var _log2 = _interopRequireDefault(_log);

var _util = require('./util.js');

var _util2 = _interopRequireDefault(_util);

var _webpage = require('webpage');

var _webpage2 = _interopRequireDefault(_webpage);

var _system = require('system');

var _system2 = _interopRequireDefault(_system);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _evaluate = require('./evaluate.js');

var _evaluate2 = _interopRequireDefault(_evaluate);

var _tree = require('./tree.js');

var _tree2 = _interopRequireDefault(_tree);

var _simplify = require('./simplify.js');

var _simplify2 = _interopRequireDefault(_simplify);

var _tdiff = require('./tdiff.js');

var _tdiff2 = _interopRequireDefault(_tdiff);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

phantom.onError = function (msg, trace) {
	var msgStack = ['ERROR: ' + msg];
	if (trace && trace.length) {
		msgStack.push('TRACE:');
		trace.forEach(function (t) {
			msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
		});
	}
	_log2.default.error(msgStack.join('\n'));
};

var statusStack = [];
var treeQueue = [];
var status = 0;
var route = 0;
var statuMatrix = [];

// add login cookie
var addCookie = function addCookie(cookieStr, url) {
	if (!cookieStr || !cookieStr.length) {
		return;
	}
	var cookieArr = _util2.default.cookie(cookieStr, url);
	cookieArr.forEach(function (item) {
		phantom.addCookie(item);
	});
};
/**
 * to inject args to evaluate script
 */
var evaluate = function evaluate() {
	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
	}

	var page = args[0];
	var arr = args.slice(1);
	return page.evaluate.apply(page, arr);
};
/**
 * to estimate is identical with exist trees.
 */
var diffTree = function diffTree(tree) {
	var len = treeQueue.length;
	var compare = undefined;
	if (len) {
		_log2.default.debug('diff start!');
		for (var i = 0; i < len; i++) {
			compare = _util2.default.getTree(treeQueue[i], options);
			if (!_tdiff2.default.diff(tree, compare)) {
				return false;
			}
		}
	}
	return true;
};

/**
 * to ergodic page state
 */
var ergodicState = function ergodicState(curpage, pageContent, isRecover, remain) {
	if (!isRecover) {
		var treeJson = curpage.evaluate(_tree2.default);
		treeJson = JSON.parse(JSON.stringify(treeJson));
		_simplify2.default.simplify(treeJson);
		route++;
		_log2.default.info('this is route' + route);
		if (diffTree(treeJson)) {
			status++;
			_log2.default.info('this is status' + status);
			var name = 'status' + status;
			_util2.default.saveTree(treeJson, name, treeQueue, options);
		}
	}
	var evaluateRet = evaluate(curpage, _evaluate2.default, options, remain);
	var eventRemain = evaluateRet.eventRemain;
	var statusChange = evaluateRet.statusChange;
	if (eventRemain > 0) {
		statusStack.push({
			content: pageContent,
			eventRemain: eventRemain
		});
	}
	if (statusChange) {
		setTimeout(function () {
			ergodicState(curpage, pageContent);
		}, 1000);
	} else {
		if (statusStack.length > 0) {
			var curStatus = statusStack.pop();
			eventRemain = curStatus.eventRemain;
			pageContent = curStatus.content;
			curpage.close();
			pageHandle(pageContent, true, eventRemain);
		} else {
			_log2.default.debug('page fetch done!');
			phantom.exit(0);
		}
	}
};

/**
 * open original page and replace original page content 
 */
var openOriginalPage = function openOriginalPage(pageObject, url, callback) {
	pageObject.open(url, function (status) {
		if (status !== 'success') {
			_log2.default.error('FAIL to load this url');
		} else {
			var content = pageObject.content;
			var script = _fs2.default.read('browser/lib/agent.js');
			var pageContent = content.replace('<head>', '<head><script>' + script + '</script>');
			// fs.write('./res.html', pageContent);
			callback(pageContent);
		}
	});
};

/**
 * to render pageContent,and execute script;
 */
var pageHandle = function pageHandle(pageContent, isRecover, remain) {
	var curpage = _webpage2.default.create();
	curpage.setContent(pageContent, url);
	curpage.navigationLocked = true;
	curpage.onConsoleMessage = function (msg) {
		_log2.default.debug(msg);
	};
	curpage.onError = function (msg, trace) {
		var msgStack = ['ERROR: ' + msg];
		if (trace && trace.length) {
			msgStack.push('TRACE:');
			trace.forEach(function (t) {
				msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
			});
		}
		_log2.default.error(msgStack.join('\n'));
	};
	curpage.onLoadFinished = function (status) {
		if (status !== 'success') {
			_log2.default.error('Fail to load this url');
		} else {
			_log2.default.debug('curpage first load finished');
			window.setTimeout(function () {
				ergodicState(curpage, pageContent, isRecover, remain);
			}, 5000);
		}
	};
};

if (_system2.default.args.length === 1) {
	_log2.default.info('Usage: index.js <some URL>');
	phantom.exit(1);
}
var url = _system2.default.args[1];
var dirName = _system2.default.args[2];
var cookieStr = _system2.default.args[3] || '';
var config = _util2.default.getConfig();
var options = config || {};
options.dirName = dirName;

var Main = function Main() {
	addCookie(cookieStr, url);
	var originalPage = _webpage2.default.create();
	openOriginalPage(originalPage, url, function (res) {
		originalPage.close();
		pageHandle(res);
	});
};

Main();