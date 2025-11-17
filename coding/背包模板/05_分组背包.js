// 分组背包（物品分组，每组最多选一件）
// 输入：groups: Array<Array<{ weight, value }>>, 容量 W
// 输出：最大价值（number）

function groupKnapsack(groups, W) {
  let dp = Array(W + 1).fill(0);
  for (const group of groups) {
    const ndp = dp.slice(); // 基于旧 dp 生成新一行，避免同组重复选
    for (const { weight: w, value: v } of group) {
      for (let j = W; j >= w; j--) {
        ndp[j] = Math.max(ndp[j], dp[j - w] + v);
      }
    }
    dp = ndp;
  }
  return dp[W];
}

module.exports = { groupKnapsack };