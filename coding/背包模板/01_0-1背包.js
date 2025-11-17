// 0-1 背包（每件物品最多一次）
// 输入：weights[]，values[]，容量 W
// 输出：最大价值（number）

function knapsack01(weights, values, W) {
  const n = weights.length;
  const dp = Array(W + 1).fill(0);
  for (let i = 0; i < n; i++) {
    const w = weights[i];
    const v = values[i];
    for (let j = W; j >= w; j--) {
      dp[j] = Math.max(dp[j], dp[j - w] + v);
    }
  }
  return dp[W];
}

// 二维版本（可用于路径回溯或教学）：
function knapsack01_2D(weights, values, W) {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    const w = weights[i - 1];
    const v = values[i - 1];
    for (let j = 0; j <= W; j++) {
      dp[i][j] = dp[i - 1][j];
      if (j >= w) dp[i][j] = Math.max(dp[i][j], dp[i - 1][j - w] + v);
    }
  }
  return dp[n][W];
}

module.exports = { knapsack01, knapsack01_2D };