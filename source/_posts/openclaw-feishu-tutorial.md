---
title: OpenClaw 对接飞书（Feishu）最详细教程
date: 2026-03-03 18:45:00
author: DemonWutian
tags:
  - OpenClaw
  - Feishu
  - 飞书
  - 教程
categories:
  - 技术教程
---

> 作者：DemonWutian  
> 日期：2026年3月3日  
> 版本：v1.0 最终版

---

## 📋 目录

1. [前言](#前言)
2. [准备工作](#准备工作)
3. [第一步：安装飞书插件](#第一步安装飞书插件)
4. [第二步：创建飞书应用](#第二步创建飞书应用)
5. [第三步：配置 OpenClaw](#第三步配置-openclaw)
6. [第四步：启动与测试](#第四步启动与测试)
7. [高级配置](#高级配置)
8. [常用命令一览](#常用命令一览)
9. [常见问题与解决方案](#常见问题与解决方案)
10. [配置参数详解](#配置参数详解)
11. [总结与后续](#总结与后续)

---

## 前言

### 什么是 OpenClaw？

OpenClaw 是一个开源的 AI 助手框架，可以帮助你快速搭建自己的 AI 助手。它支持多种消息渠道，包括 Telegram、Discord、Slack、WhatsApp，以及我们今天要介绍的飞书（Feishu/Lark）。

### 为什么要对接飞书？

飞书是字节跳动推出的企业协作平台，在国内企业中使用广泛。通过将 OpenClaw 对接飞书，你可以：

- 🤖 在飞书上与 AI 助手对话
- 📚 让 AI 帮你处理工作事务
- 🔧 集成到企业工作流中
- 📊 实现自动化办公

---

## 准备工作

### 环境要求

在开始之前，请确保你的环境满足以下要求：

| 要求 | 说明 | 备注 |
|------|------|------|
| 操作系统 | Linux/macOS/Windows (WSL) | 推荐使用 Linux 或 macOS |
| Node.js | v18 或更高版本 | `node -v` 检查 |
| npm | v9 或更高版本 | `npm -v` 检查 |
| Git | 任意版本 | 用于克隆仓库 |

### 必备账号

- **飞书企业账号**：你需要是一个飞书企业的成员，如果是企业管理员更好
- **GitHub 账号**（可选）：用于下载 OpenClaw 源码

### 安装 OpenClaw

如果还没有安装 OpenClaw，请先安装：

```bash
# 方式一：直接安装（推荐）
curl -sL https://get.openclaw.ai | sh

# 方式二：手动安装
git clone https://github.com/openclaw/openclaw.git
cd openclaw
npm install
npm run build
```

安装完成后，运行初始化配置：

```bash
openclaw init
```

---

## 第一步：安装飞书插件

OpenClaw 通过插件系统支持不同的消息渠道。飞书插件是独立安装的。

### 1.1 安装命令

```bash
# 使用 npm 安装（推荐）
openclaw plugins install @openclaw/feishu

# 如果你是从源码运行 OpenClaw，使用本地路径
openclaw plugins install ./extensions/feishu
```

### 1.2 验证安装

安装完成后，验证飞书插件是否安装成功：

```bash
openclaw plugins list
```

你应该能看到类似输出：

```
📦 已安装的插件：
  - @openclaw/feishu (enabled)
  - @openclaw/core (enabled)
```

### 1.3 常见问题

**Q: 提示权限不足？**
```bash
# 如果安装失败，尝试加上 sudo
sudo openclaw plugins install @openclaw/feishu
```

**Q: 网络问题导致安装失败？**
```bash
# 设置国内镜像源
npm config set registry https://registry.npmmirror.com
# 然后重试
openclaw plugins install @openclaw/feishu
```

---

## 第二步：创建飞书应用

这是整个流程中最关键的步骤。飞书应用相当于你在飞书平台上的"身份证"，有了它，OpenClaw 才能接收和发送消息。

### 2.1 访问飞书开放平台

打开浏览器，访问 [飞书开放平台](https://open.feishu.cn/app)。

> 📌 **注意**：如果是国际版 Lark 用户，请使用：https://open.larksuite.com/app

使用你的飞书账号登录。如果是企业账号，建议使用管理员账号。

### 2.2 创建新应用

登录后，你会看到应用管理页面。点击 **「创建企业应用」** 按钮。

![创建应用按钮位置](./images/feishu-step2-create-app.png)

在弹出的对话框中填写：

| 字段 | 示例 | 说明 |
|------|------|------|
| 应用名称 | OpenClaw AI 助手 | 你的机器人名字 |
| 应用描述 | 基于 OpenClaw 的 AI 助手 | 简单描述功能 |
| 应用图标 | 📷 | 上传一个图标，建议 1024x1024 |

填写完成后，点击 **「确定创建」**。

### 2.3 获取应用凭证

应用创建成功后，会自动跳转到应用详情页。你需要在这里获取两个关键凭证：

1. **App ID**（应用 ID）
2. **App Secret**（应用密钥）

在左侧菜单点击 **「凭证与基础信息」**，在页面中间位置可以看到：

- **App ID**：格式类似 `cli_xxxxxxxxxxxxxxxx`
- **App Secret**：点击「获取」按钮后会显示，**只显示一次，请立即复制保存！**

![凭证页面](./images/feishu-step3-credentials.png)

> ⚠️ **重要提示**：
> - App Secret 只显示一次，请立即保存到安全的地方
> - 不要将 App Secret 泄露给他人
> - 如果泄露，需要在飞书开放平台重置

### 2.4 配置权限

为了让机器人能够接收和发送消息，我们需要配置相应的权限。

点击左侧菜单 **「权限」**，切换到 **「权限配置」** 标签页。

点击右上角的 **「批量导入」** 按钮，在弹出的文本框中粘贴以下 JSON：

```json
{
  "scopes": {
    "tenant": [
      "aily:file:read",
      "aily:file:write",
      "application:application.app_message_stats.overview:readonly",
      "application:application:self_manage",
      "application:bot.menu:write",
      "contact:user.employee_id:readonly",
      "corehr:file:download",
      "event:ip_list",
      "im:chat.access_event.bot_p2p_chat:read",
      "im:chat.members:bot_access",
      "im:message",
      "im:message.group_at_msg:readonly",
      "im:message.p2p_msg:readonly",
      "im:message:readonly",
      "im:message:send_as_bot",
      "im:resource"
    ],
    "user": [
      "aily:file:read",
      "aily:file:write",
      "im:chat.access_event.bot_p2p_chat:read"
    ]
  }
}
```

粘贴完成后，点击 **「批量添加」**。

![权限配置页面](./images/feishu-step4-permissions.png)

**权限说明：**

| 权限名称 | 用途 |
|----------|------|
| `im:message` | 接收消息 |
| `im:message:send_as_bot` | 发送消息 |
| `im:message:readonly` | 读取消息 |
| `im:resource` | 上传下载文件 |
| `im:chat.members:bot_access` | 访问群成员 |

### 2.5 开启机器人能力

点击左侧菜单 **「应用能力」**，然后点击 **「机器人」**。

在机器人页面：

1. 点击 **「开启机器人能力」** 开关
2. 在 **「机器人名称」** 栏填写你的机器人名称（这将是用户在飞书中看到的名字）
3. 可以选择上传机器人头像

![机器人能力页面](./images/feishu-step5-bot-capability.png)

### 2.6 配置事件订阅

这是最关键的一步！事件订阅决定了机器人能接收哪些消息。

> ⚠️ **重要提示**：在配置事件订阅之前，请确保你的 OpenClaw 网关已经在运行，否则可能会配置失败。

点击左侧菜单 **「事件订阅」**。

#### 2.6.1 选择接收方式

在 **「接收消息」** 部分，选择 **「使用长连接接收事件」**（WebSocket 方式）。

这种方式不需要公网域名，适合个人开发者使用。

#### 2.6.2 添加事件

在 **「订阅事件」** 部分，点击 **「添加事件」**。

在搜索框中输入 `im.message.receive_v1`，这是接收消息的事件。

找到后点击它，然后点击 **「确定」**。

![事件订阅页面](./images/feishu-step6-event-subscription.png)

#### 2.6.3 关键事件列表

以下是推荐订阅的事件：

| 事件名称 | 说明 |
|----------|------|
| `im.message.receive_v1` | 接收消息（必选）|
| `im.chat.access_event.bot_p2p_chat` | 用户开始私聊机器人 |
| `im.chat.access_event.bot_added_to_chat` | 机器人被添加到群聊 |
| `im.chat.access_event.bot_removed_from_chat` | 机器人被移出群聊 |

### 2.7 发布应用

完成以上配置后，你需要发布应用才能正式使用。

点击左侧菜单 **「版本管理与发布」**。

1. 点击 **「创建新版本」**
2. 填写版本号（如 `1.0.0`）和更新说明
3. 点击 **「提交发布」**

提交后，如果是企业自建应用，通常不需要审批即可使用。如果是付费企业应用，可能需要管理员审批。

![发布页面](./images/feishu-step7-publish.png)

---

## 第三步：配置 OpenClaw

现在我们已经创建好了飞书应用，接下来需要告诉 OpenClaw 如何连接到这个应用。

### 3.1 方法一：使用配置向导（推荐）

这是最简单的方式，适合大多数用户。

```bash
# 运行配置向导
openclaw channels add
```

终端会显示交互式菜单：

```
请选择要添加的渠道：
1. Telegram
2. Discord
3. Slack
4. Feishu
5. WhatsApp
...
```

输入 `4` 选择 Feishu，然后按照提示输入：

- **App ID**：粘贴你之前保存的 App ID
- **App Secret**：粘贴你之前保存的 App Secret

### 3.2 方法二：手动配置文件

如果你更倾向于手动配置，或者需要更复杂的配置，可以直接编辑配置文件。

OpenClaw 的配置文件位于 `~/.openclaw/openclaw.json`。

```bash
# 编辑配置文件
nano ~/.openclaw/openclaw.json
```

添加或修改 `channels` 部分：

```json
{
  "channels": {
    "feishu": {
      "enabled": true,
      "dmPolicy": "pairing",
      "accounts": {
        "main": {
          "appId": "cli_xxxxxxxxxxxxxxxx",
          "appSecret": "你的AppSecret",
          "botName": "OpenClaw AI"
        }
      }
    }
  }
}
```

### 3.3 方法三：环境变量

如果你使用 Docker 或其他容器化部署，环境变量会更方便。

```bash
# 设置环境变量
export FEISHU_APP_ID="cli_xxxxxxxxxxxxxxxx"
export FEISHU_APP_SECRET="你的AppSecret"
```

### 3.4 国际版 Lark 配置

如果你的飞书账号是国际版（Lark），需要额外配置 domain：

```json
{
  "channels": {
    "feishu": {
      "domain": "lark",
      "accounts": {
        "main": {
          "appId": "cli_xxxxxxxxxxxxxxxx",
          "appSecret": "你的AppSecret"
        }
      }
    }
  }
}
```

### 3.5 配置参数说明

| 参数 | 类型 | 说明 | 可选值 |
|------|------|------|--------|
| `enabled` | boolean | 是否启用飞书渠道 | true/false |
| `domain` | string | API 域名 | feishu/lark |
| `dmPolicy` | string | 私聊策略 | pairing/allowlist/open/disabled |
| `groupPolicy` | string | 群聊策略 | open/allowlist/disabled |
| `streaming` | boolean | 是否启用流式输出 | true/false |

---

## 第四步：启动与测试

### 4.1 启动网关

配置完成后，现在启动 OpenClaw 网关：

```bash
# 启动网关
openclaw gateway
```

你应该看到类似输出：

```
🚀 启动网关...
✅ 网关已启动
📡 正在连接飞书...
✅ 飞书连接成功
```

### 4.2 检查状态

```bash
# 查看网关状态
openclaw gateway status
```

### 4.3 在飞书中找到你的机器人

1. 打开飞书应用
2. 在搜索框中搜索你的机器人名称
3. 点击进入聊天窗口

### 4.4 发送测试消息

向机器人发送一条消息，比如：

```
你好！请介绍一下你自己。
```

### 4.5 配对授权（首次使用）

如果你的 `dmPolicy` 设置为 `pairing`（默认），首次使用时需要配对。

机器人会回复你一个配对码，格式类似：

```
🔐 配对码：ABC123
请让管理员运行以下命令授权：
openclaw pairing approve feishu ABC123
```

你需要（或者让管理员）运行：

```bash
# 查看配对请求
openclaw pairing list feishu

# 批准配对
openclaw pairing approve feishu ABC123
```

配对成功后，就可以正常对话了！

---

## 高级配置

### 5.1 群聊配置

#### 5.1.1 群聊策略

控制机器人是否响应群聊消息：

```json
{
  "channels": {
    "feishu": {
      "groupPolicy": "open"
    }
  }
}
```

| 值 | 说明 | 适用场景 |
|---|---|---|
| `open` | 允许所有群聊 | 公开社群 |
| `allowlist` | 只允许白名单群聊 | 企业内部 |
| `disabled` | 禁用群聊 | 仅私聊 |

#### 5.1.2 @mention 设置

默认情况下，用户需要在群聊中 @机器人才会回复。如果你想改变这个行为：

```json
{
  "channels": {
    "feishu": {
      "groups": {
        "oc_xxxxxxxxxxxx": {
          "requireMention": false
        }
      }
    }
  }
}
```

> 📌 **如何获取群聊 ID？**
> 1. 让机器人在群里发送一条消息
> 2. 运行 `openclaw logs --follow` 查看日志
> 3. 日志中会显示 `chat_id`，格式为 `oc_xxx`

### 5.2 流式输出

飞书支持流式卡片输出，让 AI 的回复像打字机一样逐字显示：

```json
{
  "channels": {
    "feishu": {
      "streaming": true,
      "blockStreaming": true
    }
  }
}
```

- `streaming`: 启用流式卡片输出
- `blockStreaming`: 启用块级流式输出（更流畅）

### 5.3 多机器人配置

如果需要同时运行多个飞书机器人：

```json
{
  "channels": {
    "feishu": {
      "accounts": {
        "main": {
          "appId": "cli_xxx1",
          "appSecret": "xxx1",
          "botName": "主机器人"
        },
        "backup": {
          "appId": "cli_xxx2",
          "appSecret": "xxx2",
          "botName": "备用机器人",
          "enabled": false
        }
      }
    }
  }
}
```

### 5.4 消息限制设置

```json
{
  "channels": {
    "feishu": {
      "textChunkLimit": 2000,
      "mediaMaxMb": 30
    }
  }
}
```

- `textChunkLimit`: 单条消息最大字符数（飞书限制 2000）
- `mediaMaxMb`: 媒体文件大小限制（MB）

---

## 常用命令一览

### 网关管理

| 命令 | 说明 |
|------|------|
| `openclaw gateway` | 启动网关 |
| `openclaw gateway status` | 查看网关状态 |
| `openclaw gateway stop` | 停止网关 |
| `openclaw gateway restart` | 重启网关 |

### 日志查看

| 命令 | 说明 |
|------|------|
| `openclaw logs` | 查看日志 |
| `openclaw logs --follow` | 实时查看日志（类似 tail -f）|
| `openclaw logs --lines 100` | 查看最近 100 行日志 |

### 配对管理

| 命令 | 说明 |
|------|------|
| `openclaw pairing list feishu` | 查看所有配对请求 |
| `openclaw pairing approve feishu <CODE>` | 批准配对 |
| `openclaw pairing reject feishu <CODE>` | 拒绝配对 |

### 飞书内命令

用户可以在飞书中发送以下命令：

| 命令 | 说明 |
|------|------|
| `/status` | 查看机器人状态 |
| `/reset` | 重置当前会话 |
| `/model` | 查看/切换模型 |
| `/help` | 查看帮助信息 |

---

## 常见问题与解决方案

### Q1: 机器人一直不回复消息

**可能原因：**

1. **应用未发布**：检查应用是否已发布
2. **事件订阅未配置**：确认已添加 `im.message.receive_v1` 事件
3. **网关未启动**：运行 `openclaw gateway status` 检查
4. **权限不足**：检查权限配置是否完整

**排查步骤：**

```bash
# 1. 检查网关状态
openclaw gateway status

# 2. 查看实时日志
openclaw logs --follow

# 3. 重启网关
openclaw gateway restart
```

### Q2: 群聊中无法@机器人

**可能原因：**

1. 机器人不在群聊中
2. `groupPolicy` 设置为 `disabled`
3. 未正确 @机器人

**解决方案：**

```json
{
  "channels": {
    "feishu": {
      "groupPolicy": "open"
    }
  }
}
```

### Q3: 消息发送失败

**可能原因：**

1. 权限不足（缺少 `im:message:send_as_bot`）
2. 应用未发布
3. 消息过长

**解决方案：**

1. 在飞书开放平台检查权限
2. 确保应用已发布
3. 缩短消息长度，或开启自动分片

### Q4: App Secret 泄露了怎么办？

**解决方案：**

1. 登录飞书开放平台
2. 进入 **凭证与基础信息**
3. 点击 **重置 App Secret**
4. 使用新密钥更新 OpenClaw 配置
5. 重启网关

### Q5: 如何查看用户/群聊 ID？

**方法一：通过日志**

```bash
openclaw logs --follow
```

当用户发送消息时，日志会显示：

```
📥 收到消息 from user:ou_xxxxxxxx (私聊)
📥 收到消息 from chat:oc_xxxxxxxx (群聊)
```

**方法二：通过配对请求**

```bash
openclaw pairing list feishu
```

输出中会显示用户的 Open ID。

---

## 配置参数详解

### 完整配置示例

```json
{
  "channels": {
    "feishu": {
      "enabled": true,
      "domain": "feishu",
      "connectionMode": "websocket",
      "dmPolicy": "pairing",
      "allowFrom": [],
      "groupPolicy": "open",
      "groupAllowFrom": [],
      "textChunkLimit": 2000,
      "mediaMaxMb": 30,
      "streaming": true,
      "blockStreaming": true,
      "accounts": {
        "main": {
          "appId": "cli_xxx",
          "appSecret": "xxx",
          "botName": "AI助手",
          "enabled": true
        }
      },
      "groups": {
        "oc_xxx": {
          "enabled": true,
          "requireMention": true
        }
      }
    }
  }
}
```

### 参数详细说明

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enabled` | boolean | true | 是否启用 |
| `domain` | string | feishu | API 域名 (feishu/lark) |
| `connectionMode` | string | websocket | 连接模式 (websocket/webhook) |
| `dmPolicy` | string | pairing | 私聊策略 |
| `groupPolicy` | string | open | 群聊策略 |
| `textChunkLimit` | number | 2000 | 消息分块大小 |
| `mediaMaxMb` | number | 30 | 媒体文件限制 |
| `streaming` | boolean | true | 流式输出 |
| `blockStreaming` | boolean | true | 块级流式输出 |

---

## 总结与后续

### 恭喜你！🎉

如果你已经完成以上所有步骤，那么恭喜你！你已经成功将 OpenClaw 对接到了飞书。

现在你可以：

- ✅ 在飞书私聊中与 AI 对话
- ✅ 在群聊中 @AI 助手
- ✅ 自定义配置打造专属 AI

### 后续探索

- 📖 阅读 [OpenClaw 官方文档](https://docs.openclaw.ai) 学习更多
- 🤖 配置其他渠道（Telegram、Discord 等）
- 🧠 定制专属的 AI 角色和技能
- 🔧 集成到你的工作流中

### 获取帮助

如果遇到问题：

1. 查看日志：`openclaw logs --follow`
2. 查阅文档：https://docs.openclaw.ai
3. 社区支持：https://discord.gg/clawd
4. GitHub Issue：https://github.com/openclaw/openclaw/issues

---

**Happy coding! 🚀**

---

*本文档基于 OpenClaw v最新版本编写，如有问题欢迎反馈。*
