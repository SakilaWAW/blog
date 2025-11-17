const { buildTreeFromArray } = require('./00_TreeNode');
const { preorderRecursive, preorderIterative } = require('./01_前序遍历');
const { inorderRecursive, inorderIterative } = require('./02_中序遍历');
const { postorderRecursive, postorderIterative } = require('./03_后序遍历');
const { levelOrder, levelOrderFlat } = require('./04_层序遍历');

// 示例树： [1,2,3,4,5,null,6]
const root = buildTreeFromArray([1, 2, 3, 4, 5, null, 6]);

console.log('前序-递归:', preorderRecursive(root));
console.log('前序-迭代:', preorderIterative(root));

console.log('中序-递归:', inorderRecursive(root));
console.log('中序-迭代:', inorderIterative(root));

console.log('后序-递归:', postorderRecursive(root));
console.log('后序-迭代:', postorderIterative(root));

console.log('层序-按层:', JSON.stringify(levelOrder(root)));
console.log('层序-扁平:', levelOrderFlat(root));