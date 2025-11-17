// 二维 0-1 背包（两个容量约束）
// 输入：items: [{ w1, w2, value }], 容量 C1, C2
// 输出：最大价值（number）

function knapsack2D(items, C1, C2) {
  const dp = Array.from({ length: C1 + 1 }, () => Array(C2 + 1).fill(0));
  for (const { w1, w2, value } of items) {
    for (let i = C1; i >= w1; i--) {
      for (let j = C2; j >= w2; j--) {
        dp[i][j] = Math.max(dp[i][j], dp[i - w1][j - w2] + value);
      }
    }
  }
  return dp[C1][C2];
}

module.exports = { knapsack2D };