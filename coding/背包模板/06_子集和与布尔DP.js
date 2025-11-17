// 子集和（是否能凑出目标和）与计数版本
// 输入：nums[], target

function subsetSum(nums, target) {
  const dp = Array(target + 1).fill(false);
  dp[0] = true;
  for (const x of nums) {
    for (let s = target; s >= x; s--) {
      dp[s] = dp[s] || dp[s - x];
    }
  }
  return dp[target];
}

function countSubsetSum(nums, target) {
  const dp = Array(target + 1).fill(0);
  dp[0] = 1;
  for (const x of nums) {
    for (let s = target; s >= x; s--) {
      dp[s] += dp[s - x];
    }
  }
  return dp[target];
}

module.exports = { subsetSum, countSubsetSum };