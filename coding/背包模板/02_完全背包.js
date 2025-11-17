// 完全背包（物品可无限次选）
// 输入：weights[]，values[]，容量 W
// 输出：最大价值（number）

function completeKnapsack(weights, values, W) {
  const n = weights.length;
  const dp = Array(W + 1).fill(0);
  for (let i = 0; i < n; i++) {
    const w = weights[i];
    const v = values[i];
    // 正序遍历容量，允许重复选同一物品
    for (let j = w; j <= W; j++) {
      dp[j] = Math.max(dp[j], dp[j - w] + v);
    }
  }
  return dp[W];
}

module.exports = { completeKnapsack };