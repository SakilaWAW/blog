// 0-1 背包路径回溯：从二维 dp 恢复选取方案
// 输入：weights[], values[], W
// 输出：{ value: 最大价值, chosen: 选中的索引数组（升序） }

function reconstructKnapsack01(weights, values, W) {
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

  const chosen = [];
  let j = W;
  for (let i = n; i >= 1; i--) {
    const w = weights[i - 1];
    const v = values[i - 1];
    // 如果选择第 i 件能达到最优，则它被选中
    if (j >= w && dp[i][j] === dp[i - 1][j - w] + v) {
      chosen.push(i - 1);
      j -= w;
    }
  }
  chosen.reverse();
  return { value: dp[n][W], chosen };
}

module.exports = { reconstructKnapsack01 };