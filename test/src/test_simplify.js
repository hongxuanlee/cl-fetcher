import assert from 'assert';
import Path from 'path';
import 'babel-polyfill';
import simplify from '../../lib/phantomjs/simplify';

describe('Tree simplyfy', () => {
	it('should cut no textNode branch', async () => {
		let path = Path.join(__dirname, '../data/test_simplify_1.json');
		let tree = await simplify.getTree(path);
		let res =  simplify.pruning(tree);
		assert.equal(res.children[0].children.length,2);
		assert.equal(res.children[0].children[0].attr.class,'text1');
		assert.equal(res.children[0].children[1].attr.class,'text2');
		assert.equal(res.children[0].children[0].children[0].tag,'textNode');
		assert.equal(res.children[0].children[1].children[0].tag,'textNode');
		assert.equal(res.children[0].children[0].children[0].text,'here is content 1 !');

	});
});