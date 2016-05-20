import log from './log.js';
import fs from 'fs';
let cookie = (cookieStr, url) => {
	let cookieArr = cookieStr.split('; ');
	let per = {};
	let res = [];
	let val;
	let domain = url.match(/\/\/(.*?)[\?\/$]/)[1];
	cookieArr.forEach((cookie) => {
		val = cookie.match(/(.*?)\=(.*?$)/);
		per = {
			name: val[1],
			value: val[2],
			domain,
			path: '/',
			httponly: true,
			secure: false,
			expires: (new Date()).getTime() + (1000 * 60 * 60) /* <-- expires in 1 hour */
		};
		res.push(per);
	});
	return res;
};

let getConfig = () => {
	let path = phantom.libraryPath + '/../../.cl-config';
	let config  = fs.read(path);
	if(!path){
		return null;
	}
	try{
		return JSON.parse(config);
	}catch(e){
		log.error('config parse error', e);
	}
};

let isObject = (source) => {
	if (!source) return false;
	return source.toString() === '[object Object]';
};

let saveTree = (tree, name, treeQueue, options) => {
	options = options || {};
	let storagePath = options.storage || 'data';
	let root = options.root ? options.root : phantom.libraryPath + '/' + storagePath;
	let dirname = options.dirName ? options.dirName : 'default';
	if (!name) {
		let time = Date.now();
		name = time;
	}
	treeQueue.push(name);
	if (isObject(tree)) {
		tree = JSON.stringify(tree);
	}
	let dir = `${root}/${dirname}`;
	let path;
	if (fs.exists(dir) || fs.makeDirectory(dir)) {
		path = `${dir}/${name}.json`;
		log.debug('save json in  [' + path + ']');
		fs.write(path, tree);
		return true;
	} else {
		throw new Error('unable to make directory[' + dir + ']');
	}
};

let getTree = (name, options) => {
	options = options || {};
	let storagePath = options.storage || 'data';
	let root = options.root ? options.root : phantom.libraryPath + '/' + storagePath;
	let dirname = options.dirName ? options.dirName : 'default';
	let file = `${root}/${dirname}/${name}.json`;
	log.debug('get tree from ' + file);
	if (fs.exists(file)) {
		return JSON.parse(fs.read(file));
	}
};

module.exports = {
	cookie,
	isObject,
	saveTree,
	getTree,
	getConfig
};