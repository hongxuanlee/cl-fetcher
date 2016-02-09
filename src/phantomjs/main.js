import log from './log.js';
import util from './util.js';
phantom.onError = (msg, trace) => {
	let msgStack = ['ERROR: ' + msg];
	if (trace && trace.length) {
		msgStack.push('TRACE:');
		trace.forEach(function(t) {
			msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function+'")' : ''));
		});
	}
	log.error(msgStack.join('\n'));
};


import WebPage from 'webpage';
import system from 'system';
import fs from 'fs';
import evaluateScript from './evaluate.js';
import Tree from './tree.js';
import simplify from './simplify.js';
import tdiff from './tdiff.js';

let pageStateMatrix = [];
let treeQueue = [];
let status = 0;

// add login cookie
let addCookie = (cookieStr, url) => {
	if(! cookieStr || !cookieStr.length){
		return;
	}
	let cookieArr = util.cookie(cookieStr, url);
	cookieArr.forEach((item) => {
		log.debug(JSON.stringify(item));
		phantom.addCookie(item);
	});
};
/**
 * to inject args to evaluate script
 */
let evaluate = (...args) => {
	let page = args[0];
	let arr = args.slice(1);
	return page.evaluate.apply(page, arr);
};

let isObject = (source) => {
	if (!source) return false;
	return source.toString() === '[object Object]';
};

let saveTree = (tree, name, options) => {
	options = options || {};
	let root = options.root ? options.root : phantom.libraryPath + '/../../data';
	let dirname = options.dirname ? options.dirname : dirName;
	if (!name) {
		let time = Date.now();
		name = time;
	}
	treeQueue.push(name);
	if (isObject(tree)) {
		tree = JSON.stringify(tree);
	}
	let dir = root + '/' + dirname;
	if (fs.exists(dir) || fs.makeDirectory(dir)) {
		log.debug('save json in  [' + dir + ']');
		fs.write(dir + '/' + name + '.json', tree);
		return true;
	} else {
		throw new Error('unable to make directory[' + dir + ']');
	}
};

let getTree = (name, options) => {
	options = options || {};
	let root = options.root ? options.root : phantom.libraryPath + '/../../data';
	let dirname = options.dirname ? options.dirname : dirName;
	let file = root + '/' + dirname + '/' + name + '.json';
	log.debug('get tree from ' + file);
	if (fs.exists(file)) {
		return JSON.parse(fs.read(file));
	}
};

let diffTree = (tree) => {
	let len = treeQueue.length;
	let compare;
	if (len) {
		log.debug('diff start!');
		for (let i = 0; i < len; i++) {
			compare = getTree(treeQueue[i]);
			if (tdiff.diff(tree, compare)) {
				return true;
			}
		}
		return false;
	}
	return true;
};

/**
 * to ergodic page state
 */
let ergodicState = (curpage, pageContent, isRecover, remain) => {
	if (!isRecover) {
		log.info('this is status' + status);
		let treeJson = curpage.evaluate(Tree);
		log.debug('treeJson:', JSON.stringify(treeJson));
		treeJson = JSON.parse(JSON.stringify(treeJson));
		simplify.simplify(treeJson);
		if (diffTree(treeJson)) {
			let name = 'status' + status;
			saveTree(treeJson, name);
			status++;
		}
	}
	let evaluateRet = evaluate(curpage, evaluateScript, {}, remain);
	let eventRemain = evaluateRet.eventRemain;
	let statusChange = evaluateRet.statusChange;
	if (eventRemain > 0) {
		pageStateMatrix.push({
			content: pageContent,
			eventRemain: eventRemain
		});
	}
	if (statusChange) {
		setTimeout(function() {
			ergodicState(curpage, pageContent);
		}, 1000);
	} else {
		if (pageStateMatrix.length > 0) {
			let curStatus = pageStateMatrix.pop();
			eventRemain = curStatus.eventRemain;
			pageContent = curStatus.content;
			curpage.close();
			pageHandle(pageContent, true, eventRemain);
		} else {
			log.debug('page fetch done!');
			phantom.exit(0);
		}
	}
};

/**
 * open original page and replace original page content 
 */
let openOriginalPage = (pageObject, url, callback) => {
	pageObject.open(url, function(status) {
		if (status !== 'success') {
			log.error('FAIL to load this url');
		} else {
			let content = pageObject.content;
			let script = fs.read('browser/lib/agent.js');
			let pageContent = content.replace('<head>', '<head><script>' + script + '</script>');
			// fs.write('./res.html', pageContent);
			callback(pageContent);
		}
	});
};

/**
 * to render pageContent,and execute script;
 */
let pageHandle = (pageContent, isRecover, remain) => {
	let curpage = WebPage.create();
	curpage.setContent(pageContent, url);
	curpage.onConsoleMessage = (msg) => {
		log.debug(msg);
	};
	curpage.onError = (msg, trace) => {
		let msgStack = ['ERROR: ' + msg];
		if (trace && trace.length) {
			msgStack.push('TRACE:');
			trace.forEach((t) => {
				msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function+'")' : ''));
			});
		}
		log.error(msgStack.join('\n'));
	};
	curpage.onLoadFinished = (status) => {
		if (status !== 'success') {
			log.error('Fail to load this url');
		} else {
			log.debug('curpage first load finished');
			window.setTimeout(function(){
				ergodicState(curpage, pageContent, isRecover, remain);
			},5000);
			
		}
	};
};

if (system.args.length === 1) {
	log.info('Usage: index.js <some URL>');
	phantom.exit(1);
}
const url = system.args[1];
const dirName = system.args[2];
const cookieStr = system.args[3] || '';
let Main = () => {
	addCookie(cookieStr, url);
	let originalPage = WebPage.create();
	openOriginalPage(originalPage, url, (res) => {
		originalPage.close();
		pageHandle(res);
	});
};

Main();