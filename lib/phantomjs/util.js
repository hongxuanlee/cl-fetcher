'use strict';

var _log = require('./log.js');

var _log2 = _interopRequireDefault(_log);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cookie = function cookie(cookieStr, url) {
	var cookieArr = cookieStr.split('; ');
	var per = {};
	var res = [];
	var val = undefined;
	var domain = url.match(/\/\/(.*?)[\?\/$]/)[1];
	cookieArr.forEach(function (cookie) {
		val = cookie.match(/(.*?)\=(.*?$)/);
		per = {
			name: val[1],
			value: val[2],
			domain: domain,
			path: '/',
			httponly: true,
			secure: false,
			expires: new Date().getTime() + 1000 * 60 * 60 /* <-- expires in 1 hour */
		};
		res.push(per);
	});
	return res;
};

var getConfig = function getConfig() {
	var path = phantom.libraryPath + '/../../.cl-config';
	var config = _fs2.default.read(path);
	if (!path) {
		return null;
	}
	try {
		return JSON.parse(config);
	} catch (e) {
		_log2.default.error('config parse error', e);
	}
};

var isObject = function isObject(source) {
	if (!source) return false;
	return source.toString() === '[object Object]';
};

var saveTree = function saveTree(tree, name, treeQueue, options) {
	options = options || {};
	var storagePath = options.storage || 'data';
	var root = options.root ? options.root : phantom.libraryPath + '/' + storagePath;
	var dirname = options.dirName ? options.dirName : 'default';
	if (!name) {
		var time = Date.now();
		name = time;
	}
	treeQueue.push(name);
	if (isObject(tree)) {
		tree = JSON.stringify(tree);
	}
	var dir = root + '/' + dirname;
	var path = undefined;
	if (_fs2.default.exists(dir) || _fs2.default.makeDirectory(dir)) {
		path = dir + '/' + name + '.json';
		_log2.default.debug('save json in  [' + path + ']');
		_fs2.default.write(path, tree);
		return true;
	} else {
		throw new Error('unable to make directory[' + dir + ']');
	}
};

var getTree = function getTree(name, options) {
	options = options || {};
	var storagePath = options.storage || 'data';
	var root = options.root ? options.root : phantom.libraryPath + '/' + storagePath;
	var dirname = options.dirName ? options.dirName : 'default';
	var file = root + '/' + dirname + '/' + name + '.json';
	_log2.default.debug('get tree from ' + file);
	if (_fs2.default.exists(file)) {
		return JSON.parse(_fs2.default.read(file));
	}
};

module.exports = {
	cookie: cookie,
	isObject: isObject,
	saveTree: saveTree,
	getTree: getTree,
	getConfig: getConfig
};