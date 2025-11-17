// 滑动窗口标准模板：变长窗口与定长窗口

// 变长窗口：最长不含重复字符的子串长度
function lengthOfLongestSubstring(s) {
  const lastIndex = new Map();
  let left = 0;
  let maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (lastIndex.has(ch) && lastIndex.get(ch) >= left) {
      left = lastIndex.get(ch) + 1;
    }
    lastIndex.set(ch, right);
    const currentLen = right - left + 1;
    if (currentLen > maxLen) maxLen = currentLen;
  }
  return maxLen;
}

// 变长窗口：最小覆盖子串
function minWindow(s, t) {
  if (!s || !t || t.length > s.length) return "";
  const need = new Map();
  for (const c of t) need.set(c, (need.get(c) || 0) + 1);
  const window = new Map();
  let valid = 0;
  const needKinds = need.size;

  let left = 0;
  let start = 0;
  let minLen = Infinity;

  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    if (need.has(c)) {
      window.set(c, (window.get(c) || 0) + 1);
      if (window.get(c) === need.get(c)) valid++;
    }

    while (valid === needKinds) {
      const len = right - left + 1;
      if (len < minLen) {
        minLen = len;
        start = left;
      }
      const d = s[left];
      if (need.has(d)) {
        window.set(d, window.get(d) - 1);
        if (window.get(d) < need.get(d)) valid--;
      }
      left++;
    }
  }

  return minLen === Infinity ? "" : s.slice(start, start + minLen);
}

// 定长窗口：固定大小 k 的最大连续子数组和
function maxSumFixedWindow(arr, k) {
  if (!Array.isArray(arr) || k <= 0 || k > arr.length) return 0;
  let sum = 0;
  let maxSum = -Infinity;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
    if (i >= k) sum -= arr[i - k];
    if (i >= k - 1) {
      if (sum > maxSum) maxSum = sum;
    }
  }
  return maxSum;
}

module.exports = {
  lengthOfLongestSubstring,
  minWindow,
  maxSumFixedWindow,
};