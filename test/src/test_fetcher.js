import assert from 'assert';
import Fetcher from '../../lib/fetcher';

describe('fetcher page', function() {
	it('should return', function(done){
		let testUrl = 'http://www.baidu.com';
		let fetcherIns = new Fetcher(testUrl, () => {
			assert(true);
			done();
		});
	});
	it('should return', function(done){
		let testUrl = 'http://www.baidu.com';
		let fetcherIns = new Fetcher(testUrl, () => {
			assert(true);
			done();
		});
	});
})