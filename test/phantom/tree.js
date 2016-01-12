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
    
    it("should has right react", () => {
        let bodyReact = tree.rect.join('-');
        let boxReact = tree.children[0].children[0].rect.join('-');
        expect(bodyReact).to.equal('0-5-400-446');
        expect(boxReact).to.equal('5-5-202-82');
    });

}); 