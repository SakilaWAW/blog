---
layout: post
title: "Canvas性能优化"
date: 2025-11-17 22:00:00 +0800
categories: 前端知识点
tags: [Canvas, 性能优化, 前端, 图形]
---

# Canvas 性能优化（系统化速记）

> 目标：用尽可能少的绘制成本实现足够好的帧率与体验。强调“少画、分层、异步、缓存、按需”。

“少、层、异、缓、需”

---

## 核心思路
- 少画：只重绘变化区域（Dirty Rect），避免整屏清空重画
- 分层：静态与动态分开，多画布或离屏缓冲减少重复绘制
- 异步：把重任务移出主线程；能用 `OffscreenCanvas` / `createImageBitmap` 就用
- 缓存：路径、文本、位图、测量结果都可缓存，减少重复计算
- 按需：控制刷新节奏，资源解码与缩放在加载时做，不在每帧做

---

## 绘制开销来源
- 过多 draw calls（频繁状态切换、绘制命令）
- 大面积像素读写（`getImageData/putImageData`）
- 动态缩放与解码（`drawImage`对原始大图每帧缩放/解码）
- 繁重的样式（阴影、复杂合成、全局透明）
- 频繁的保存/恢复状态（`save/restore`）
- 主线程阻塞（布局、JS计算与绘制抢同一帧）

---

## 快速原则
- 使用 `requestAnimationFrame` 驱动动画
- 每帧只更新变动区域；其余保持不动
- 预计算与缓存：`Path2D`、`measureText`、渐变/图案、位图
- 避免每帧 `save/restore`；用 `setTransform` 一次性设置矩阵
- 减少样式切换（`fillStyle/strokeStyle/globalAlpha/shadow`）
- 控制画布像素尺寸；高 DPI 用比例缩放而非超大像素

---

## 尺寸与缩放
- DPI 适配：`canvas.width = cssWidth * devicePixelRatio`；渲染后用 CSS 缩回显示尺寸
- 避免巨型画布（超大像素必慢）；需要高分图时可分片渲染或按需放大
- 缩放策略：优先在资源加载时处理到目标大小，减少运行时 `drawImage` 动态缩放

---

## 图像与资源
- 预载与解码：`await img.decode()`；或用 `createImageBitmap(img)` 加速位图传输
- 位图缓存：将常用图形画入离屏画布（或 `OffscreenCanvas`），按需拷贝到主画布
- 避免每帧缩放同一大图：预生成多尺度版本（sprite/多级缓存）
- `imageSmoothingEnabled` 按需启用/关闭，平衡质量与速度

示例：离屏缓存与快速拷贝
```js
const off = document.createElement('canvas');
off.width = w; off.height = h;
const offCtx = off.getContext('2d');
offCtx.drawImage(srcImg, 0, 0, w, h);
// 帧内复用
ctx.drawImage(off, x, y);
```

---

## 文本与路径
- 文本：缓存 `measureText` 结果；减少字体/样式切换；静态文本单独图层
- 路径：用 `Path2D` 缓存复杂形状；复用渐变与图案对象
```js
const p = new Path2D();
p.moveTo(0,0); p.arc(50,50,40,0,Math.PI*2);
ctx.fill(p);
```

---

## 脏矩形与分层
- 脏矩形：记录变动区域，仅清理与重绘该区域
- 分层渲染：背景/网格/静态元素一个画布，动态元素单独画布叠加；更新时只重绘动态层
- 双缓冲：在离屏绘制完成后一次性拷贝到主屏，减少闪烁与撕裂

---

## 变换与状态
- 尽量用 `setTransform(a,b,c,d,e,f)` 一次性设置矩阵，避免多次 `translate/rotate/scale`
- 控制 `save/restore` 次数，批量同类绘制减少状态切换
- 合理绘制顺序：将相同样式的图元批量绘制

---

## 像素级操作
- 只在必要时使用 `getImageData/putImageData`；区域越小越好
- 使用 `Uint8ClampedArray` 等类型数组一次性批量处理
- 多步滤镜考虑 WebGL/GLSL 或 GPU 加速

---

## 主线程与异步
- `OffscreenCanvas`：在 Worker 中绘制，主线程只合成结果（Chrome/Firefox 支持较好）
- 任务切分：重计算分段到多帧或 Worker；主线程负责事件与轻量绘制
- 避免与布局/测量同帧争抢时间（减少同步读写样式）

Worker 示例（简化版）：
```js
// 主线程
const worker = new Worker('render.js');
const off = new OffscreenCanvas(w, h);
worker.postMessage({ canvas: off }, [off]);

// render.js
onmessage = e => {
  const ctx = e.data.canvas.getContext('2d');
  // 绘制重任务
  // ...
  postMessage('done');
};
```

---

## 调度与节流
- 用单一 `rAF` 循环协调更新；避免多个不受控的动画源
- 跳帧策略：复杂帧耗时过长时减少绘制频率或分帧渲染
- 事件节流/防抖：`mousemove/resize/scroll` 等联动绘制要节流

---

## 合成与样式开销
- 阴影/模糊/复杂合成谨慎使用；预渲染静态阴影，动态仅平移拷贝
- 全局透明（`globalAlpha`）在大面积绘制上开销大，优先局部或预合成
- 混合模式 `globalCompositeOperation` 用在少量元素上；避免整屏反复切换

---

## 常见反模式
- 每帧清空整画布再全量重绘
- 动态缩放/解码原始大图
- 大量 `save/restore` 与样式频繁切换
- 过度像素级操作、逐像素循环写入大区域
- 在主线程做重计算、与布局/样式强耦合

---

## 实战清单（落地版）
- rAF 驱动，单循环
- 设备像素比适配，控制画布像素尺寸
- 脏矩形 + 分层（静态/动态）
- 离屏缓存（`OffscreenCanvas` 或隐藏 `canvas`）
- 资源预解码与位图缓存（`createImageBitmap`）
- `Path2D`、`measureText` 等结果缓存
- 减少样式切换与状态保存
- 必要时 Worker 渲染或任务切分
- 事件节流、防抖
- DevTools 性能面板定位瓶颈（CPU占用、绘制时间、帧率）

---

## 结语
- Canvas 的优化本质是“减少不必要的工作”：少画、分层、异步、缓存、按需。先用性能面板找出最大开销，再按以上清单逐个消除，大多数场景都能把帧率稳到 60fps 左右。

---

## 面试速答（标准版）
- 核心原则：少画、分层、异步、缓存、按需。
- 关键手段：
  - 脏矩形：只重绘变化区域，避免整屏清空。
  - 分层/离屏：静态与动态分开；离屏画布或 `OffscreenCanvas` 复用背景与重任务。
  - 资源优化：`createImageBitmap` 预解码；预生成多尺度位图，减少每帧缩放。
  - 路径与文本缓存：`Path2D`、`measureText` 结果复用；减少样式切换与 `save/restore`。
  - 变换与DPI：一次性 `setTransform` 合并矩阵；按 `devicePixelRatio` 放大像素、CSS 缩回。
  - 调度与节流：统一 `requestAnimationFrame` 循环；对 `mousemove/resize` 做节流/防抖。
- 度量指标：
  - FPS 与平均帧时（Performance 面板）；绘制调用数、重绘面积、像素操作规模；CPU/内存占用。
  - 目标：动画稳定 ≥60 FPS；关键帧时长 ≤16.7ms；避免大面积像素读写与样式高开销。
- 典型场景答法：
  - 大图缩放卡顿：预解码 + 预缩放缓存；帧内直接 `drawImage` 缓存。
  - 背景不变但动画卡：背景离屏或分层；每帧只清/画动态层。
  - 阴影/合成导致掉帧：静态阴影预渲染；减少 `globalAlpha` 大面积使用与合成模式切换。
  - 文本与复杂形状：`measureText`、`Path2D` 缓存；批量绘制、减少样式切换。
  - 设备模糊：按 `dpr` 设置画布像素；`setTransform` 以 CSS 坐标绘制。
- 反模式速记：每帧整屏重绘；每帧缩放/解码原始大图；过度像素级处理；频繁 `save/restore` 与样式切换；主线程重计算与布局耦合。

一句话收尾：先量化（FPS/帧时/重绘面积），再用“脏矩形 + 分层 + 离屏/异步 + 资源与路径缓存 + 一次性变换”逐项削峰，场景化举措能稳定把动画拉回 60 FPS。