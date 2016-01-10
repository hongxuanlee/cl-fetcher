function isEqual(left, right) {
    var type = typeof left;
    if (type !== typeof right) return false;
    if (type == 'object') {
        var leftKeys = Object.keys(left);
        var rightKeys = Object.keys(right);
        if (leftKeys.length !== rightKeys.length) return false;
        for (var i = 0; i < leftKeys.length; i++) {
            var key = leftKeys[i];
            if (!right.hasOwnProperty(key) || (left[key] !== right[key])) {
                return false;
            }
        }
        return true;
    } else {
        return left === right;
    }
}

function isEqualNode(left, right) {
    return (left.tag === right.tag) && isEqual(left.attr, right.attr);
}

/**
 * Longest common subsequence
 */
function execLcs(leftNodes, rightNodes) {
    var rLine = [];
    leftNodes.forEach(function(left) {
        var cLine = [];
        rightNodes.forEach(function(right, i) {
            if (isEqualNode(left, right)) {
                var sub = cLine[i - 1] || [];
                sub.push({
                    rIdx: i,
                    tag: right.tag,
                    old: left,
                    cur: right
                });
                cLine[i] = sub;
            } else {
                var cNode = cLine[i - 1];
                var rNode = rLine[i];
                if (cNode && rNode) {
                    cLine[i] = (cNode.length < rNode.length) ? rNode : cNode;
                } else if (cNode) {
                    cLine[i] = cNode;
                } else if (rLine) {
                    cLine[i] = rNode;
                }
            }
        })
        rLine = cLine;
    });
    return (rLine.pop() || []);
}

/**
 * to diff two json tree
 * change { 
 *    type:   1 contents  001
 *            2 add       010           
 *            4 remove    100
 * }
 */
var diff = function(left, right) {
    var result = [];
    var change = {
        indicator: 0,
        node: right
    }
    var leftChild = left.children;
    var rightChild = right.children;
    execLcs(leftChild, rightChild).forEach(function(item) {
        var old = item.old;
        var cur = item.cur;
        old.matched = cur.matched = true;
        if (cur.name === 'textNode') {
            if (old.text !== cur.text) {
                change.type |= 1;
            }
        } else {
            result = result.concat(diff(old, cur));
        }
    });
    rightChild.forEach(function(node, i) {
        if (!node.matched) {
            if (node.name === 'textNode') {
                change.type |= 1;
            } else {
                result.push({
                    type: 2,
                    node: node,
                    index: i,
                });
            }
        }
    });
    leftChild.forEach(function(node, j) {
        if (!node.matched) {
            if (node.name === 'textNode') {
                change.type |= 1;
            } else {
                result.push({
                    type: 4,
                    node: node,
                    index: j
                });
            }
        }
    });
    if (change.type) {
        result.push(change);
    }
    return result;
};

module.exports = {
    diff,
    isEqualNode
};