import getTree from '../../src/phantomjs/tree.js';

describe("DOM Tree Tests", () => {
    let tree = getTree();
    it("should get dom tree", () => {
        expect(tree).to.not.equal(null);
    });

    it("should root is body", () => {
        expect(tree.tag).to.equal('body');
    });

    it("should has the right children count", () => {
        expect(tree.children.length).to.equal(1);
        expect(tree.children[0].children.length).to.equal(5);
    });

    it("should has right attributes", () => {
        let container = tree.children[0];
        expect(container.tag).to.equal('div');
        expect(container.attr.class).to.equal('container');
        expect(container.attr.id).to.equal('ctn');
    });
});