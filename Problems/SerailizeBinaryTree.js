/*
Given the root to a binary tree, implement serialize(root), 
which serializes the tree into a string, and deserialize(s), which deserializes the string back into the tree.

 */
class Node {
    constructor(val) {
        this.val = val;
        this.right = null;
        this.left = null;
    }
}

class BinaryTree {
    constructor() {
        this.root = null;
    }

    insert(val) {
        const node = new Node(val);
        if(this.root == null) {
            this.root = node;
            return this;
        }
        
            let currentNode = this.root;
            while(true) {
                if(val == currentNode.val) return undefined;
                if(val < currentNode.val) {
                    if(currentNode.left == null) {
                        currentNode.left = node;
                        return this;
                    }
                    currentNode = currentNode.left;
                }
                else {
                    if(currentNode.right == null) {
                        currentNode.right = node;
                        return this;
                    }
                    currentNode = currentNode.right;
                }
            }
    }
}

function serializeBinaryTree (root) {
    if(!root) return;
    return `${root.val} ${serializeBinaryTree(root.left)} ${serializeBinaryTree(root.right)}`
}