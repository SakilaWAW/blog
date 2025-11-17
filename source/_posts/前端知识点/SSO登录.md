---
layout: post
title: "SSO登录"
date: 2025-11-13 10:00:00 +0800
categories: 前端知识点
tags: [认证, OAuth2, OIDC, 安全]
---

# SSO（单点登录）与 Refresh Token 原理详解

> 目标：系统性梳理基于 OAuth2/OIDC 的 SSO 登录流程、核心会话机制，以及 Refresh Token 的设计与安全实践。

---

## 一、概念与关系

- SSO：用户在统一身份提供者（IdP）登录一次，各应用共享这次身份。
- OAuth2：授权框架，颁发访问令牌给客户端调用资源。
- OIDC：在 OAuth2 上叠加“身份层”，标准化登录身份（`id_token`），Web 场景常用来实现 SSO。

角色与术语：
- User：最终用户
- Client：应用（A/B）
- IdP / Authorization Server：身份提供者/授权服务器（如 Okta、Keycloak）
- Resource Server：业务 API 服务
- 令牌：`access_token`（调 API）、`refresh_token`（续期）、`id_token`（身份声明，OIDC）

---

## 二、SSO 登录流程（OIDC 授权码 + PKCE）

假设用户访问应用 A，未登录；A 采用授权码 + PKCE 与 IdP 对接。

1) 重定向到 IdP 授权端点
- A 发现本地会话缺失，重定向到 `https://idp.example.com/authorize`
- 参数：
  - `response_type=code`
  - `client_id`
  - `redirect_uri`（白名单）
  - `scope=openid profile email`（至少包含 `openid`）
  - `state`（防 CSRF）
  - `nonce`（防重放/令牌混淆）
  - `code_challenge` + `code_challenge_method=S256`（PKCE）

2) 在 IdP 登录并建立 IdP 会话
- 用户在 IdP 完成认证（密码/MFA/WebAuthn）
- IdP 在自己的域名下设置会话 `cookie`（如 `idp_session`，`HttpOnly`、`Secure`，`SameSite=Lax/None`）

3) 回跳授权码
- IdP 重定向至 A 的 `redirect_uri`，携带 `code` 与原始 `state`
- A 校验 `state` 一致性

4) 用 `code` 换令牌（后端）
- A 的后端调用 IdP 的 `token` 端点：
  - `grant_type=authorization_code`
  - `code`
  - `redirect_uri`
  - PKCE：`code_verifier`
- 返回：`access_token`、`id_token`、可能的 `refresh_token`

5) 验签与建立应用会话
- 后端验证 `id_token`：签名、`iss/aud/exp/iat/nbf`、`nonce`
- A 建立自己的会话（应用域 `cookie` 或服务器会话），并将令牌句柄安全保存
  - `access_token`：前端内存（避免被脚本读取）
  - `refresh_token`：`HttpOnly + Secure + SameSite` 的 `cookie` 或仅存后端会话

6) 调用资源服务
- 前端/后端请求头携带 `Authorization: Bearer <access_token>`
- 资源服务验证令牌签名与声明，按 `scope` 授权

7) 访问应用 B（实现 SSO）
- B 重定向到同一 IdP 的 `authorize`
- 浏览器自动携带 IdP 域的会话 `cookie`
- IdP 识别会话 → 直接回跳 `code`（可能展示同意页）→ B 换令牌 → 无需再次输入密码

8) 静默登录（可选）
- B 可能用隐藏 `iframe` 访问 `authorize?prompt=none` 检查 IdP 会话并获取新 `id_token`
- 需要 `SameSite=None; Secure` 且浏览器允许第三方 `cookie`

流程示意：

```
User  →  App A  →  IdP/authorize → 登录 → 回跳 code → A/token → 会话 & 令牌
       →  App B  →  IdP/authorize → 识别会话 → 回跳 code → B/token → 会话 & 令牌
```

---

## 三、会话与登出

- IdP 会话：存在于 IdP 域名下的 `cookie`，用于跨应用识别登录态（SSO 的基础）
- 应用会话：每个应用各自的登录态（应用域 `cookie`/服务器会话）
- 本地登出：清除应用会话；IdP 会话仍在，访问其他应用仍可免密
- 单点登出（SSO 彻底登出）：
  - 清除 IdP 会话（`end_session_endpoint`）
  - 前通道/后通道通知各应用清理本地会话

---

## 四、Refresh Token 原理与实践

用途与特点：
- 用途：在 `access_token` 过期后，凭 `refresh_token` 向 IdP 的 `token` 端点换取新的 `access_token`
- 特点：生命周期长、权限受限，不直接用于访问业务 API，仅用于续期

续期流程：
1) 检测 `access_token` 过期或临近过期
2) 后端（或前端携带 `HttpOnly cookie`）调用 `token` 端点：
   - `grant_type=refresh_token`
   - `refresh_token`
3) 返回新的 `access_token`（以及可能新的 `refresh_token`）
4) 更新会话与令牌存储，继续使用新令牌调用 API

轮换与复用检测：
- 轮换（Rotation）：每次刷新返回新的 `refresh_token`，旧的立即作废，降低泄露风险
- 复用检测（Reuse Detection）：发现旧 `refresh_token` 被再次使用时，标记异常并吊销会话

存储与绑定：
- 存放位置：优先服务器侧或 `HttpOnly + Secure + SameSite` 的浏览器 `cookie`
- 绑定对象：与 `client_id`、用户会话、`jti` 唯一标识、设备指纹（可选）关联，便于撤销与审计

撤销与失效：
- 主动登出或风控触发时，撤销 `refresh_token`（黑名单/状态存储）
- `access_token` 设计为短时效（如 5–15 分钟），`refresh_token` 设计为较长但可撤销

安全要点：
- 仅 HTTPS 传输；不放在 `localStorage/sessionStorage`
- 前端只持 `access_token` 于内存，`refresh_token` 走 `HttpOnly` `cookie` 或由后端保管
- 严格校验令牌声明：`iss/aud/exp/iat/nbf`，限制 `scope`（最小权限）

常见问题解释：
- “为什么再次访问没有跳转到 IdP？”→ 应用本地会话有效或后台用 `refresh_token` 静默续期，无需前端重定向
- “静默登录失败？”→ 浏览器阻止第三方 `cookie` 时，`prompt=none` 可能失败，需顶级重定向

---

## 五、端点与响应规范（参考 OIDC）

### OIDC 是什么
- 在 OAuth2 之上叠加“身份层”，标准化登录身份
- 核心产物：`id_token`（JWT）与`/userinfo`；至少请求`scope=openid`
- 区别：OAuth2 只颁发访问令牌；OIDC 增加身份声明与相关端点

### id_token 结构与校验
- 形式：JWS（常用`RS256/ES256`），`header.alg/kid`，`payload`含声明
- 关键声明：`iss`（发行者）、`aud`（受众/客户端）、`sub`（用户ID）、`exp/iat/nbf`、`nonce`（防混淆）
- 校验步骤：获取`/.well-known/openid-configuration`→下载`/jwks`→验签→校验`iss/aud/exp/nonce`→允许少量时钟偏差
- `id_token`用于建立应用会话；不用于调用业务 API

### 端点与登出
- 发现文档：`/.well-known/openid-configuration`
- 授权端点：`/authorize`
- 令牌端点：`/token`
- 用户信息端点：`/userinfo`
- 公钥集：`/jwks`
- 登出端点：`/end_session_endpoint`（支持前/后通道单点登出）

### 常用参数与流程
- 推荐授权流：授权码 + PKCE；避免隐式/混合（遗留场景）
- 常用作用域：`openid`（必选）、`profile`、`email`、`offline_access`（发刷新令牌）
- 安全参数：`state`（防CSRF）、`nonce`（防令牌混淆）、`max_age/prompt`（控制重新认证）

错误与状态：
- 未认证：`401` + `WWW-Authenticate: Bearer`
- 权限不足：`403`

---

## 六、实施清单（简版）

- Web 应用：授权码 + PKCE；`redirect_uri` 严格白名单
- 令牌策略：短 `access_token` + 轮换型 `refresh_token` + 复用检测
- 存储策略：`access_token` 仅内存；`refresh_token` 用 `HttpOnly + Secure + SameSite` `cookie` 或后端会话
- 会话与登出：支持 SSO 单点登出；清理 IdP 和各应用会话
- 安全参数：校验 `state/nonce`；只用 HTTPS；CSP 防脚本窃取

---

## 七、流程速记图

```
App 未登录 → 重定向 IdP/authorize
        → 登录（IdP 建会话 cookie）
        → 回跳 code（含 state）
        → 服务器 token 交换（含 PKCE）→ access_token + id_token (+ refresh_token)
        → 验签与建应用会话 → 调用 API（Bearer）
        → 访问其他应用：利用 IdP 会话完成 SSO
        → 令牌过期：用 refresh_token 静默续期
        → 单点登出：清 IdP 会话并通知各应用
```

---

### 参考与标准

- RFC 6749 — OAuth 2.0
- OpenID Connect Core 1.0
- RFC 7636 — PKCE
- OAuth 2.0 Security Best Current Practice