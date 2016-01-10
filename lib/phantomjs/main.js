'use strict';

var _webpage = require('webpage');

var _webpage2 = _interopRequireDefault(_webpage);

var _system = require('system');

var _system2 = _interopRequireDefault(_system);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

phantom.onError = function (msg, trace) {
	var msgStack = ['ERROR: ' + msg];
	if (trace && trace.length) {
		msgStack.push('TRACE:');
		trace.forEach(function (t) {
			msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
		});
	}
	console.log(msgStack.join('\n'));
};

/**
 * open original page and replace original page content 
 */
var openOriginalPage = function openOriginalPage(pageObject, url, callback) {
	pageObject.open(url, function (status) {
		if (status !== 'success') {
			console.log('FAIL to load this url');
		} else {
			var content = pageObject.content;
			var script = _fs2.default.read('browser/lib/agent.js');
			var pageContent = content.replace('<head>', '<head><script>' + script + '</script>');
			_fs2.default.write('./result.html', pageContent);
			callback(pageContent);
		}
	});
};

/**
 * to render pageContent,and execute script
 */
var pageHandle = function pageHandle(pageContent) {
	var curpage = _webpage2.default.create();
	curpage.setContent(pageContent, url);
	curpage.onConsoleMessage = function (msg) {
		console.log(msg);
	};
	curpage.onError = function (msg, trace) {
		var msgStack = ['ERROR: ' + msg];
		if (trace && trace.length) {
			msgStack.push('TRACE:');
			trace.forEach(function (t) {
				msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
			});
		}
		console.log(msgStack.join('\n'));
	};
	curpage.onLoadFinished = function (status) {
		if (status !== 'success') {
			console.log('FAIL to load this url');
		} else {
			console.log('curpage load finished');
			phantom.exit(0);
		}
	};
};

if (_system2.default.args.length === 1) {
	console.log('Usage: index.js <some URL>');
	phantom.exit(1);
}
var url = _system2.default.args[1];
var Main = function Main() {
	var originalPage = _webpage2.default.create();
	openOriginalPage(originalPage, url, function (res) {
		originalPage.close();
		pageHandle(res);
	});
};

Main();