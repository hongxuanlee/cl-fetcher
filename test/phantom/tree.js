import getTree from '../../src/phantomjs/tree.js';

describe("DOM Tree Tests", function () {
    let tree = getTree();
    it("get dom tree", function () {
        expect(tree).to.not.equal(null);
    });
  
    it("root is body", function () {
        expect(tree.tag).to.equal('body');
    });
 
    it("has the right children count", function () {
        expect(tree.children.length).to.equal(1);
        expect(tree.children[0].children.length).to.equal(5);
    });

    it("has right attributes", function () {
        var container = tree.children[0];
        expect(container.tag).to.equal('div');
        expect(container.attr.class).to.equal('container');
        expect(container.attr.id).to.equal('ctn');
    });
    
}); 