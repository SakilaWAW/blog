// 前序遍历：根 -> 左 -> 右

function preorderRecursive(root) {
  const res = [];
  function dfs(node) {
    if (!node) return;
    res.push(node.val);
    dfs(node.left);
    dfs(node.right);
  }
  dfs(root);
  return res;
}

function preorderIterative(root) {
  const res = [];
  if (!root) return res;
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    res.push(node.val);
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }
  return res;
}

module.exports = { preorderRecursive, preorderIterative };