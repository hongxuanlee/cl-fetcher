phantom.onError = (msg, trace) => {
	var msgStack = ['ERROR: ' + msg];
	if (trace && trace.length) {
		msgStack.push('TRACE:');
		trace.forEach(function (t) {
			msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
		});
	}
	console.log(msgStack.join('\n'));
};

import WebPage from 'webpage';
import system from 'system';
import fs from 'fs';

/**
 * open original page and replace original page content 
 */
let openOriginalPage = (pageObject, url, callback) => {
	pageObject.open(url, function(status) {
		if (status !== 'success') {
			console.log('FAIL to load this url');
		} else {
			let content = pageObject.content;
			let script = fs.read('browser/lib/agent.js');
			let pageContent = content.replace('<head>', '<head><script>' + script + '</script>');
			fs.write('./result.html', pageContent);
			callback(pageContent);
		}
	});
};

/**
 * to render pageContent,and execute script
 */
let pageHandle = (pageContent) => {
	var curpage = WebPage.create();
	curpage.setContent(pageContent, url);
	curpage.onConsoleMessage = (msg) => {
		console.log(msg);
	};
	curpage.onError = (msg, trace) => {
		var msgStack = ['ERROR: ' + msg];
		if (trace && trace.length) {
			msgStack.push('TRACE:');
			trace.forEach((t) => {
				msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function+'")' : ''));
			});
		}
		console.log(msgStack.join('\n'));
	};
	curpage.onLoadFinished = (status) => {
		if (status !== 'success') {
			console.log('FAIL to load this url');
		} else {
			console.log('curpage load finished');
			phantom.exit(0);
		}
	};
};

if (system.args.length === 1) {
	console.log('Usage: index.js <some URL>');
	phantom.exit(1);
}
const url = system.args[1];
let Main = () => {
	let originalPage = WebPage.create();
	openOriginalPage(originalPage, url, (res) => {
		originalPage.close();
		pageHandle(res);
	});
};

Main();

