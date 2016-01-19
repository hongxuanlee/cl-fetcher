import assert from 'assert';
import Path from 'path';
import 'babel-polyfill';
import simplify from '../../lib/phantomjs/simplify';

describe('Tree simplyfy', () => {
	it('should get tree', async() => {
		let path = Path.join(__dirname, '../data/test_simplify_1.json');
		await simplify.getTree(path);
		assert(true);
	});

	it('should cut no textNode branch', async() => {
		let path = Path.join(__dirname, '../data/test_simplify_1.json');
		let tree = await simplify.getTree(path);
		let res = simplify.pruning(tree);
		let expectPath = Path.join(__dirname, '../data/test_simplify_res_1.json');
		let expectTree = await simplify.getTree(expectPath);
		assert.deepEqual(expectTree, res);
	});

	it('should cut no textNode branch', async() => {
		let path = Path.join(__dirname, '../data/test_simplify_2.json');
		let tree = await simplify.getTree(path);
		let res = simplify.pruning(tree);
		let expectPath = Path.join(__dirname, '../data/test_simplify_res_2.json');
		let expectTree = await simplify.getTree(expectPath);
		assert.deepEqual(expectTree, res);
	});

	it('should compress', async() => {
		let path = Path.join(__dirname, '../data/test_simplify_3.json');
		let tree = await simplify.getTree(path);
		let res = simplify.compress(tree);
		let expectPath = Path.join(__dirname, '../data/test_simplify_res_3.json');
		let expectTree = await simplify.getTree(expectPath);
		assert.deepEqual(expectTree, res);
	});

	it('should simplyfy', async() => {
		let path = Path.join(__dirname, '../data/test_simplify_4.json');
		let tree = await simplify.getTree(path);
		let res = simplify.simplify(tree);
		let expectPath = Path.join(__dirname, '../data/test_simplify_res_4.json');
		let expectTree = await simplify.getTree(expectPath);
		assert.deepEqual(expectTree,res);
	});

});