import assert from 'assert';
import Fetcher from '../../lib/fetcher';

describe('fetcher page', function() {
	it('should return', function(done) {
		let testUrl = 'file:///Users/kino/Workspace/cl-fetcher/test/data/fetcher2.html';
		let fetcherIns = new Fetcher(testUrl, 'test1', () => {
			assert(true);
			done();
		});
	});
	it('should return', function(done) {
		let testUrl = 'file:///Users/kino/Workspace/cl-fetcher/test/data/fetcher1.html';
		let fetcherIns = new Fetcher(testUrl, 'test2', () => {
			assert(true);
			done();
		});
	});
	it('should return', function(done) {
		let testUrl = 'https://www.baidu.com/';
		let str = '';// your baidu cookie
		new Fetcher(testUrl, 'baidu', () => {
			assert(true);
			done();
		}, {
			cookie:str
		});
	});
	it('should return', function(done) {
		let testUrl = 'https://www.weibo.com/';
		let str = ''; // your weibo cookie
		new Fetcher(testUrl, 'weibo', () => {
			assert(true);
			done();
		}, {
			cookie:str
		});
	});
	it('should return', function(done) {
		let testUrl = 'http://waimai.baidu.com/waimai/shoplist/4650b3c02fe61358';
		new Fetcher(testUrl, 'waimai', () => {
			assert(true);
			done();
		});
	});
});