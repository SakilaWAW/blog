// 题目：474. 一和零（Ones and Zeroes）
// 给定二进制字符串数组 `strs` 和两个整数 `m` 与 `n`，
// 要求选出一个子集，使得子集中所有字符串的 0 总数不超过 `m`，
// 且 1 总数不超过 `n`，并使该子集的大小最大，返回该最大大小。
//
// 解题思路（越细致越好）：
// 一、问题本质
// - 这是一个标准的二维 0-1 背包问题：
//   - “物品”是每个字符串 s；
//   - “重量”是该字符串的 0 的个数 zeros 与 1 的个数 ones（两个维度的资源消耗）；
//   - “背包容量”是 (m, n)，分别表示最多可用的 0 和 1 数量；
//   - “价值”是选中一个字符串所带来的数量 +1（目标是最大可选字符串数）。
//
// 二、状态定义
// - 使用二维数组 `dp[i][j]` 表示：在最多使用 i 个 0 和 j 个 1 的约束下，
//   能选出的字符串数量的最大值。
// - 最终答案为 `dp[m][n]`。
//
// 三、状态转移
// 1. 预处理：对每个字符串 s，统计 `zeros = 0 的个数` 和 `ones = 1 的个数`。
// 2. 遍历每个字符串（每个“物品”）并做 0-1 背包更新：
//    - 必须“倒序”更新 i 和 j（i 从 m 递减到 zeros，j 从 n 递减到 ones），
//      以保证每个字符串只能被选择一次（典型 0-1 背包的写法）。
//    - 转移方程：
//      dp[i][j] = max(dp[i][j], dp[i - zeros][j - ones] + 1)
//    - 含义：如果当前容量 (i, j) 能容纳字符串 s（即 i >= zeros 且 j >= ones），
//      那么选择 s 后的最优解与不选 s 的最优解取最大值。
//
// 四、初始化
// - `dp` 初值为 0（在不选择任何字符串的情况下，最大可选数量为 0）。
//
// 五、边界与细节
// - 遍历时只在 i >= zeros 且 j >= ones 时才尝试转移；
// - 倒序更新是关键：正序会导致同一物品被重复选用；
// - 预处理 zeros/ones 时要准确统计（字符只可能是 '0' 或 '1'）；
// - 如果某字符串的 zeros > m 或 ones > n，它永远无法被选中，可直接跳过以微幅优化。
//
// 六、时间与空间复杂度
// - 设字符串数量为 L，`dp` 的维度约为 (m + 1) × (n + 1)。
// - 时间复杂度：O(L × m × n)，对每个字符串都要尝试更新整个二维 dp。
// - 空间复杂度：O(m × n)。
//
// 七、示例推演（简例）
// - 示例 2：strs = ["10","0","1"], m = 1, n = 1
//   1) 初始：dp 全为 0。
//   2) 处理 "10"（zeros=1, ones=1）：
//      对 i=1..1, j=1..1 倒序更新：
//      dp[1][1] = max(dp[1][1], dp[0][0] + 1) = 1
//   3) 处理 "0"（zeros=1, ones=0）：
//      - 更新 dp[1][1] = max(dp[1][1], dp[0][1] + 1)
//        此时 dp[0][1] 仍为 0，所以 dp[1][1] 保持 1
//      - 同时 dp[1][0] = max(dp[1][0], dp[0][0] + 1) = 1
//   4) 处理 "1"（zeros=0, ones=1）：
//      - 更新 dp[1][1] = max(dp[1][1], dp[1][0] + 1) = max(1, 1 + 1) = 2
//   5) 答案：dp[1][1] = 2，对应子集 {"0","1"}。
//
// 八、常见错误
// - 使用正序更新导致同一字符串被重复选用；
// - 忘记判断 i >= zeros 或 j >= ones；
// - 统计 zeros/ones 出错（把字符计数写反或包含非 '0'/'1' 的情况）。
//
// 九、记忆化搜索的另一种写法（了解即可）
// - 也可用递归 + 记忆化：定义 f(idx, i, j) 表示处理到索引 idx、剩余容量 (i, j)
//   时的最大可选数量，转移为：
//   - 不选当前：f(idx + 1, i, j)
//   - 选当前（若可行）：1 + f(idx + 1, i - zeros, j - ones)
//   用哈希或三维数组记忆化。但迭代 DP 更直观且空间可控。
//
// 十、代码草稿（JavaScript，注释掉以免直接执行）
// /*
// function findMaxForm(strs, m, n) {
//   const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
//   for (const s of strs) {
//     let zeros = 0, ones = 0;
//     for (const ch of s) {
//       if (ch === '0') zeros++;
//       else ones++;
//     }
//     for (let i = m; i >= zeros; i--) {
//       for (let j = n; j >= ones; j--) {
//         dp[i][j] = Math.max(dp[i][j], dp[i - zeros][j - ones] + 1);
//       }
//     }
//   }
//   return dp[m][n];
// }
// */
//
// 总结：
// - 把每个字符串看作一个“物品”，其消耗是 (zeros, ones)，价值为 1；
// - 用二维 0-1 背包，倒序更新 dp，求 dp[m][n]；
// - 时间 O(L*m*n)，空间 O(m*n)，实现简洁且高效。

// ===== 实战：激活函数并输出调试表 =====
function findMaxForm(strs, m, n) {
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (const s of strs) {
    let zeros = 0, ones = 0;
    for (const ch of s) {
      if (ch === '0') zeros++;
      else ones++;
    }
    for (let i = m; i >= zeros; i--) {
      for (let j = n; j >= ones; j--) {
        dp[i][j] = Math.max(dp[i][j], dp[i - zeros][j - ones] + 1);
      }
    }
  }
  return dp[m][n];
}

function printDP(dp) {
  const m = dp.length - 1;
  const n = dp[0].length - 1;
  console.log(`DP 表（i=0..${m}, j=0..${n}）:`);
  for (let i = 0; i <= m; i++) {
    console.log(`${i.toString().padStart(2, ' ')}: ${dp[i].join(' ')}`);
  }
}

function findMaxFormTrace(strs, m, n) {
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  console.log('初始 DP:');
  printDP(dp);
  for (const s of strs) {
    let zeros = 0, ones = 0;
    for (const ch of s) {
      if (ch === '0') zeros++;
      else ones++;
    }
    for (let i = m; i >= zeros; i--) {
      for (let j = n; j >= ones; j--) {
        dp[i][j] = Math.max(dp[i][j], dp[i - zeros][j - ones] + 1);
      }
    }
    console.log(`处理 "${s}" (zeros=${zeros}, ones=${ones}) 后:`);
    printDP(dp);
  }
  console.log('最终答案:', dp[m][n]);
  return dp[m][n];
}

// 示例调用：你可以在终端运行 `node playground.js` 查看输出
if (typeof require !== 'undefined' && require.main === module) {
  const example1 = { strs: ["10","0001","111001","1","0"], m: 5, n: 3 };
  console.log('\n示例1:');
  findMaxFormTrace(example1.strs, example1.m, example1.n);

  const example2 = { strs: ["10","0","1"], m: 1, n: 1 };
  console.log('\n示例2:');
  findMaxFormTrace(example2.strs, example2.m, example2.n);
}