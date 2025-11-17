// 层序遍历（BFS）

// 按层返回：Array<Array<number>>
function levelOrder(root) {
  const res = [];
  if (!root) return res;
  const queue = [root];
  while (queue.length) {
    const size = queue.length;
    const level = [];
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    res.push(level);
  }
  return res;
}

// 扁平返回：Array<number>
function levelOrderFlat(root) {
  const res = [];
  if (!root) return res;
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    res.push(node.val);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return res;
}

module.exports = { levelOrder, levelOrderFlat };