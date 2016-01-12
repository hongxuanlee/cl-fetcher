import diff from '../../lib/phantomjs/diff';
import assert from 'assert';
import fs from 'fs';

describe('Dom diff', () => {
	it('should judge equal node', () => {
		let node1 = {
			"attr": {
				"class": "box",
				"id": "box1"
			},
			"children": [],
			"rect": [13, 8, 202, 82],
			"tag": "div"
		};
		let node2 = {
			"attr": {
				"class": "box",
				"id": "box1"
			},
			"children": [],
			"rect": [13, 8, 202, 82],
			"tag": "div"
		};
		assert(diff.isEqualNode(node1, node2));
	});

	it('should judge unequal node', () => {
		let node1 = {
			"attr": {
				"class": "box",
				"id": "box1"
			},
			"children": [],
			"rect": [13, 8, 202, 82],
			"tag": "div"
		};
		let node2 = {
			"attr": {
				"class": "box",
				"id": "box2"
			},
			"children": [],
			"rect": [13, 8, 202, 82],
			"tag": "div"
		};
		assert(!diff.isEqualNode(node1, node2));
	});

	it('should diff dom Tree', (done) => {
		let dom1 = JSON.parse(fs.readFileSync('./test/data/test_diff_1.json', 'utf8'));
		let dom2 = JSON.parse(fs.readFileSync('./test/data/test_diff_2.json', 'utf8'));
		let diffRes = diff.diff(dom1, dom2);
		let expect = [{
			"type": 2,
			"node": {
				"attr": {
					"class": "box",
					"id": "newbox"
				},
				"children": [{
					"tag": "textNode",
					"text": "here is new content!"
				}],
				"rect": [13, 269, 202, 82],
				"tag": "div"
			},
			"index": 3
		}];
		done();
	})
});