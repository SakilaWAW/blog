# 二叉树遍历模板（JavaScript）

提供前序、中序、后序（递归+迭代）与层序（按层与扁平）标准模板。

- 前序（preorder）：根 → 左 → 右
- 中序（inorder）：左 → 根 → 右
- 后序（postorder）：左 → 右 → 根
- 层序（level-order）：按层从左到右（BFS）

## 使用方式
- 先引入 `TreeNode` 与数组构建工具：
  ```js
  const { TreeNode, buildTreeFromArray } = require('./00_TreeNode');
  ```
- 再引入遍历函数：
  ```js
  const { preorderRecursive, preorderIterative } = require('./01_前序遍历');
  const { inorderRecursive, inorderIterative } = require('./02_中序遍历');
  const { postorderRecursive, postorderIterative } = require('./03_后序遍历');
  const { levelOrder, levelOrderFlat } = require('./04_层序遍历');
  ```

## 时间复杂度与空间复杂度
- 时间复杂度：均为 `O(N)`，`N` 为节点数。
- 额外空间：
  - 递归：最坏 `O(H)`，`H` 为树高（递归栈）。
  - 迭代：栈/队列也为最坏 `O(H)` 或 `O(W)`（层序的队列宽度）。

## 数组构建约定
- 使用 LeetCode 风格的层序数组：如 `[1,2,3,4,5,null,6]` 表示：
  - 根 `1`，左子 `2`，右子 `3`；
  - `2` 的左右为 `4`、`5`；`3` 的左为 `null`，右为 `6`。