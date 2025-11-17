// 多重背包（每件物品最多选 count 次）
// 输入：items: [{ weight, value, count }], 容量 W
// 输出：最大价值（number）
// 方案：倍增拆分，将多重背包转化为 0-1 背包（时间 O(Σlog count * W)）

function multipleKnapsack(items, W) {
  const packs = [];
  for (const { weight: w, value: v, count: c } of items) {
    if (w <= 0 || v < 0 || c <= 0) continue;
    let k = 1;
    let remaining = c;
    while (k <= remaining) {
      packs.push({ weight: k * w, value: k * v });
      remaining -= k;
      k <<= 1;
    }
    if (remaining > 0) packs.push({ weight: remaining * w, value: remaining * v });
  }

  const dp = Array(W + 1).fill(0);
  for (const { weight: w, value: v } of packs) {
    for (let j = W; j >= w; j--) {
      dp[j] = Math.max(dp[j], dp[j - w] + v);
    }
  }
  return dp[W];
}

module.exports = { multipleKnapsack };