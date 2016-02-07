import tdiff from '../../lib/phantomjs/tdiff';
import assert from 'assert';
import fs from 'fs';

describe('tdiff test', () => {
	let tree1 = JSON.parse(fs.readFileSync('./test/data/test_simplify_res_3.json'));
	let tree2 = JSON.parse(fs.readFileSync('./test/data/test_simplify_res_4.json'));
	it('should reture false if is same', () => {
		assert(!tdiff.diff(tree1, tree1));
		assert(!tdiff.diff(tree2, tree2));
	});
	it('should reture true if is different', () => {
		assert(tdiff.diff(tree1, tree2));
	});
});