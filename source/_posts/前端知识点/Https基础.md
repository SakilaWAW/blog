---
layout: post
title: "Https基础"
date: 2025-11-10 18:22:04 +0800
categories: 前端知识点
tags: [网络基础]
---

# HTTPS 通信原理详解

> 本文整理了 **HTTPS（HTTP over SSL/TLS）** 的核心原理、通信流程、加密机制及常见面试问点，便于快速复习与查阅。

---

## 一、HTTPS 是什么？

**HTTPS（Hyper Text Transfer Protocol Secure）** 是在 **HTTP 基础上加入 SSL/TLS 加密层** 的安全通信协议。
它能保证数据在客户端和服务器之间的 **机密性、完整性和身份认证**。

---

## 二、HTTPS 解决的三大问题

| 问题   | HTTPS 的解决方式            |
| ---- | ---------------------- |
| 窃听风险 | 使用 **加密传输**（对称加密）      |
| 篡改风险 | 使用 **完整性校验**（MAC/AEAD） |
| 伪装风险 | 使用 **数字证书** 进行身份验证     |

---

## 三、核心加密机制

HTTPS 结合了三种加密手段：

1. **对称加密**：用于实际数据传输（速度快）
2. **非对称加密**：用于密钥交换和身份验证（安全）
3. **摘要算法**：用于数据完整性校验（防篡改）

> 简而言之：
> 公钥加密 + 私钥解密 → 安全协商
> 同一密钥加解密 → 数据传输

---

## 四、HTTPS 通信流程（TLS 握手）

以下以 **TLS 1.2 / 1.3** 为例说明现代 HTTPS 的通信过程。

### 1️⃣ TCP 三次握手

HTTPS 建立在 TCP 之上，首先需要完成 TCP 连接。

---

### 2️⃣ 客户端发送 ClientHello

客户端向服务器发起 TLS 握手请求，包含：

* 支持的 TLS 版本（如 TLS 1.2 / 1.3）
* 支持的加密算法列表（Cipher Suites）
* 客户端随机数 `client_random`
* SNI（Server Name Indication）：指定访问的域名
* （TLS 1.3）可能附带客户端公钥（用于密钥交换）

---

### 3️⃣ 服务器返回 ServerHello + 证书

服务器响应内容包括：

* 确认的 TLS 版本与加密算法
* 服务器随机数 `server_random`
* **服务器证书（Certificate）**，包含：

  * 服务器公钥
  * 域名信息
  * 有效期
  * CA 签名
* （TLS 1.2）可能还包含 ServerKeyExchange、ServerHelloDone 等信息

---

### 4️⃣ 客户端验证证书

客户端验证以下内容：

1. 证书是否过期
2. 域名是否匹配
3. 签发链是否可信（根证书 → 中间 CA → 服务器证书）
4. 证书是否被吊销（通过 CRL 或 OCSP）

验证通过后，进入密钥协商阶段。

---

### 5️⃣ 密钥交换阶段

#### TLS 1.2

* 通常使用 **ECDHE（椭圆曲线 Diffie–Hellman 临时密钥交换）**
* 客户端与服务器各生成临时密钥对，交换公钥
* 双方通过 Diffie–Hellman 算法生成共享密钥 `pre_master_secret`
* 结合双方随机数生成 `master_secret`

> ⚠️ 旧版（RSA Key Exchange）中，客户端会用服务器公钥加密随机密钥发送给服务器，
> 不具备 **前向保密性（PFS）**，现已淘汰。

#### TLS 1.3

* 全部使用 ECDHE 或 DHE
* 简化握手流程，仅需 1-RTT 完成
* 通过 HKDF 派生多级密钥

---

### 6️⃣ 生成会话密钥

双方使用伪随机函数（PRF / HKDF）计算出多个密钥：

* 对称加密密钥（AES / ChaCha20）
* 消息认证码密钥（HMAC）
* 初始化向量（IV）

这些密钥用于后续数据加密与解密。

---

### 7️⃣ 握手结束

双方发送 `ChangeCipherSpec` 与 `Finished` 消息，
确认后续通信都使用加密通道。

---

### 8️⃣ 加密通信阶段

客户端与服务器使用协商好的 **对称密钥算法**（如 AES-GCM）进行通信。
所有 HTTP 请求与响应都会被加密再传输。

---

## 五、证书体系与信任链

### 1. 证书结构

| 字段         | 含义          |
| ---------- | ----------- |
| Subject    | 证书颁发对象（域名）  |
| Issuer     | 签发机构（CA 名称） |
| Public Key | 公钥          |
| Validity   | 有效期         |
| Signature  | 上级 CA 的数字签名 |

---

### 2. 证书信任链

```
Root CA（内置在浏览器）
   ↓ 签发
Intermediate CA（中间证书）
   ↓ 签发
Server Certificate（服务器证书）
```

客户端使用根 CA 的公钥验证中间 CA，
再用中间 CA 的公钥验证服务器证书签名，层层递归完成信任验证。

---

## 六、HTTPS 的安全特性

| 特性         | 说明                |
| ---------- | ----------------- |
| 加密性        | 防止通信内容被窃听         |
| 完整性        | 防止通信内容被篡改         |
| 身份认证       | 确保访问的服务器真实可信      |
| 前向保密性（PFS） | 即使私钥泄露，历史通信也无法被解密 |

---

## 七、常见扩展机制

| 名称                                           | 作用                    |
| -------------------------------------------- | --------------------- |
| HSTS（HTTP Strict Transport Security）         | 强制浏览器仅使用 HTTPS        |
| OCSP Stapling                                | 服务器缓存证书吊销状态，加快验证      |
| ALPN（Application-Layer Protocol Negotiation） | 协商 HTTP/1.1 或 HTTP/2  |
| SNI（Server Name Indication）                  | 支持同一 IP 托管多个 HTTPS 站点 |
| Certificate Transparency（CT）                 | 防止 CA 滥发证书            |

---

## 八、常见面试问点

1. HTTPS 与 HTTP 的区别是什么？
2. HTTPS 为什么安全？
3. 对称加密与非对称加密分别用在什么场景？
4. 什么是前向保密？
5. TLS 1.2 与 TLS 1.3 的主要区别？
6. 证书是如何验证合法性的？
7. 为什么要信任 CA？

---

## 九、简化通信流程图

```
Client                      Server
  |---- ClientHello -------------------->|
  |<--- ServerHello + Certificate -------|
  |------ 验证证书 + ECDHE 密钥交换 ------|
  |------ ChangeCipherSpec + Finished -->|
  |<----- ChangeCipherSpec + Finished ---|
  |========= 加密通信开始（HTTPS） ========|
```

---

## 十、参考资料

* RFC 5246 — The Transport Layer Security (TLS) Protocol Version 1.2
* RFC 8446 — The Transport Layer Security (TLS) Protocol Version 1.3
* Mozilla Developer Network (MDN): [HTTPS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview)

---

### 📘 复习提示

* TLS 握手目标：安全协商密钥 + 身份认证
* 核心机制：非对称协商密钥，对称加密通信
* TLS 1.3 更快、更安全（1-RTT、前向保密）

---