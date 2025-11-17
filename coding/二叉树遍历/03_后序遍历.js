// 后序遍历：左 -> 右 -> 根

function postorderRecursive(root) {
  const res = [];
  function dfs(node) {
    if (!node) return;
    dfs(node.left);
    dfs(node.right);
    res.push(node.val);
  }
  dfs(root);
  return res;
}

// 迭代版（单栈 + lastVisited 指针）
function postorderIterative(root) {
  const res = [];
  const stack = [];
  let curr = root;
  let lastVisited = null;
  while (curr || stack.length) {
    while (curr) {
      stack.push(curr);
      curr = curr.left;
    }
    const peek = stack[stack.length - 1];
    if (peek && peek.right && lastVisited !== peek.right) {
      curr = peek.right;
    } else {
      const node = stack.pop();
      res.push(node.val);
      lastVisited = node;
    }
  }
  return res;
}

module.exports = { postorderRecursive, postorderIterative };