class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

// 从层序数组构建二叉树（LeetCode 风格）
function buildTreeFromArray(arr) {
  if (!arr || arr.length === 0 || arr[0] == null) return null;
  const root = new TreeNode(arr[0]);
  const queue = [root];
  let i = 1;
  while (i < arr.length && queue.length) {
    const node = queue.shift();
    // 左子
    if (i < arr.length) {
      const leftVal = arr[i++];
      if (leftVal != null) {
        node.left = new TreeNode(leftVal);
        queue.push(node.left);
      }
    }
    // 右子
    if (i < arr.length) {
      const rightVal = arr[i++];
      if (rightVal != null) {
        node.right = new TreeNode(rightVal);
        queue.push(node.right);
      }
    }
  }
  return root;
}

// 将二叉树按层序导出为数组（保留 null）
function treeToArray(root) {
  const res = [];
  if (!root) return res;
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    if (node) {
      res.push(node.val);
      queue.push(node.left);
      queue.push(node.right);
    } else {
      res.push(null);
    }
  }
  // 去掉末尾多余的 null
  while (res.length && res[res.length - 1] == null) res.pop();
  return res;
}

module.exports = { TreeNode, buildTreeFromArray, treeToArray };