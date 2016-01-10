import assert from 'assert';
import Fetcher from '../../lib/fetcher';

describe('fetcher page', () => {
	it('should return', (done)=>{
		let testUrl = 'http://www.baidu.com';
		let fetcherIns = new Fetcher(testUrl, () => {
			done();
		});
	});
})