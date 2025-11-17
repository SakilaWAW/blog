// 背包问题通用模式速查（代码片段）

// 1) 0-1 背包（容量倒序）
function template01(weights, values, W) {
  const dp = Array(W + 1).fill(0);
  for (let i = 0; i < weights.length; i++) {
    const w = weights[i], v = values[i];
    for (let j = W; j >= w; j--) {
      dp[j] = Math.max(dp[j], dp[j - w] + v);
    }
  }
  return dp[W];
}

// 2) 完全背包（容量正序）
function templateComplete(weights, values, W) {
  const dp = Array(W + 1).fill(0);
  for (let i = 0; i < weights.length; i++) {
    const w = weights[i], v = values[i];
    for (let j = w; j <= W; j++) {
      dp[j] = Math.max(dp[j], dp[j - w] + v);
    }
  }
  return dp[W];
}

// 3) 二维 0-1 背包（双容量倒序）
function template2D(items, C1, C2) {
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

// 4) 子集和（布尔）
function templateSubsetSum(nums, target) {
  const dp = Array(target + 1).fill(false);
  dp[0] = true;
  for (const x of nums) {
    for (let s = target; s >= x; s--) {
      dp[s] = dp[s] || dp[s - x];
    }
  }
  return dp[target];
}

module.exports = {
  template01,
  templateComplete,
  template2D,
  templateSubsetSum,
};