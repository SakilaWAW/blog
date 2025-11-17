// 中序遍历：左 -> 根 -> 右

function inorderRecursive(root) {
  const res = [];
  function dfs(node) {
    if (!node) return;
    dfs(node.left);
    res.push(node.val);
    dfs(node.right);
  }
  dfs(root);
  return res;
}

function inorderIterative(root) {
  const res = [];
  const stack = [];
  let curr = root;
  while (curr || stack.length) {
    while (curr) {
      stack.push(curr);
      curr = curr.left;
    }
    const node = stack.pop();
    res.push(node.val);
    curr = node.right;
  }
  return res;
}

module.exports = { inorderRecursive, inorderIterative };