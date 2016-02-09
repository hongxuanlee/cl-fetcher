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
		let testUrl = 'http://news.baidu.com/';
		let fetcherIns = new Fetcher(testUrl, 'baidu', () => {
			assert(true);
			done();
		});
	});
});