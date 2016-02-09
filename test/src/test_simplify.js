import assert from 'assert';
import fs from 'fs';
import Path from 'path';
import 'babel-polyfill';
import simplify from '../../lib/phantomjs/simplify';

let getTree = (path) => {
	let data = fs.readFileSync(path);
	return JSON.parse(data);
};

let saveTree = (path, data) => {
	return fs.writeFileSync(path, JSON.stringify(data));
};

describe('Tree simplyfy', () => {
	it('should get tree', async() => {
		let path = Path.join(__dirname, '../data/test_simplify_1.json');
		getTree(path);
		assert(true);
	});

	it('should cut no textNode branch 1', async() => {
		let path = Path.join(__dirname, '../data/test_simplify_1.json');
		let tree = getTree(path);
		let res = simplify.pruning(tree);
		let expectPath = Path.join(__dirname, '../data/test_simplify_res_1.json');
		let expectTree = getTree(expectPath);
		assert.deepEqual(res, expectTree);
	});

	it('should cut no textNode branch', async() => {
		let path = Path.join(__dirname, '../data/test_simplify_2.json');
		let tree = getTree(path);
		let res = simplify.pruning(tree);
		let expectPath = Path.join(__dirname, '../data/test_simplify_res_2.json');
		let expectTree = getTree(expectPath);
		assert.deepEqual(res,expectTree);
	});

	it('should compress', async() => {
		let path = Path.join(__dirname, '../data/test_simplify_3.json');
		let tree = getTree(path);
		let res = simplify.compress(tree);
		let expectPath = Path.join(__dirname, '../data/test_simplify_res_3.json');
		let expectTree = getTree(expectPath);
		assert.deepEqual(res,expectTree);
	});

	it('should simplyfy', async() => {
		let path = Path.join(__dirname, '../data/test_simplify_4.json');
		let tree = getTree(path);
		let res = simplify.simplify(tree);
		let expectPath = Path.join(__dirname, '../data/test_simplify_res_4.json');
		let expectTree = getTree(expectPath);
		assert.deepEqual(res,expectTree);
	});

	it('should simplyfy', async() => {
		let path = Path.join(__dirname, '../data/test_simplify_5.json');
		let tree = getTree(path);
		let res = simplify.simplify(tree);
		let expectPath = Path.join(__dirname, '../data/test_simplify_res_5.json');
		let expectTree = getTree(expectPath);
		assert.deepEqual(res,expectTree);
	});

});