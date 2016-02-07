import assert from 'assert';
import Fetcher from '../../lib/fetcher';

describe('fetcher page', function() {
	it('should return', function(done) {
		let testUrl = 'file:///Users/kino/Workspace/cl-fetcher/test/html/fetcher2.html';
		let fetcherIns = new Fetcher(testUrl, () => {
			assert(true);
			done();
		});
	});
	it('should return', function(done) {
		let testUrl = 'file:///Users/kino/Workspace/cl-fetcher/test/html/fetcher1.html';
		let fetcherIns = new Fetcher(testUrl, () => {
			assert(true);
			done();
		});
	});
	it('should return', function(done) {
		let testUrl = 'http://www.baidu.com';
		let fetcherIns = new Fetcher(testUrl, () => {
			assert(true);
			done();
		});
	});
});