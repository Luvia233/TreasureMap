# TreasureMap - 宝藏地图 | 家庭物品定位小程序

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![WeChat](https://img.shields.io/badge/WeChat-Mini%20Program-green.svg)](https://developers.weixin.qq.com/miniprogram/dev/framework/)

---

## 📖 中文文档

### 项目简介

**TreasureMap（宝藏地图）**是一款微信小程序，帮助家庭用户轻松记录和管理家中物品的放置位置。就像一张家庭宝藏地图，让你快速找到每件"宝藏"的藏身之处！支持手动/语音输入、按空间浏览、全文搜索、家庭共享等功能。

### ✨ 功能特性

| 功能 | 描述 |
|------|------|
| 🔐 **用户认证** | 微信授权一键登录，安全便捷 |
| 👨‍👩‍👧 **家庭共享** | 创建/加入家庭，邀请码分享，家庭成员共同管理 |
| 🏠 **按空间浏览** | 按客厅、卧室、厨房等空间分类查看物品 |
| 📦 **物品管理** | 添加、编辑、删除物品，支持照片上传 |
| 🔍 **全文搜索** | 关键词模糊搜索，快速定位物品 |
| 🎤 **语音输入** | 语音识别输入物品名称（开发中） |
| 📴 **离线缓存** | 离线时自动读取缓存数据 |
| 🎨 **温馨UI** | 温暖配色，流畅动画，舒适体验 |

### 🛠️ 技术栈

- **前端**: 微信小程序原生框架 (WXML, WXSS, JavaScript)
- **后端**: 微信云开发 (云函数、云数据库、云存储)
- **UI设计**: 温馨家庭风格，渐变配色

### 📁 项目结构

```
treasuremap/
├── miniprogram/                # 小程序主体
│   ├── pages/                  # 页面
│   │   ├── login/              # 登录页
│   │   ├── createFamily/       # 创建家庭页
│   │   ├── joinFamily/         # 加入家庭页
│   │   ├── index/              # 首页（按空间浏览）
│   │   ├── search/             # 搜索页
│   │   ├── add/                # 添加物品页
│   │   ├── detail/             # 物品详情页
│   │   ├── edit/               # 编辑物品页
│   │   └── family/             # 家庭管理页
│   ├── components/             # 组件
│   │   └── voiceInput/         # 语音输入组件
│   ├── utils/                  # 工具函数
│   │   ├── storage.js          # 离线缓存
│   │   └── voice.js            # 语音识别
│   ├── app.js                  # 应用入口
│   ├── app.json                # 应用配置
│   └── app.wxss                # 全局样式
├── cloudfunctions/             # 云函数
│   ├── login/                  # 登录
│   ├── createFamily/           # 创建家庭
│   ├── joinFamily/             # 加入家庭
│   ├── generateInviteCode/     # 生成邀请码
│   ├── getItems/               # 获取物品列表
│   ├── addItem/                # 添加物品
│   ├── updateItem/             # 更新物品
│   ├── deleteItem/             # 删除物品
│   ├── searchItems/            # 搜索物品
│   └── utils/                  # 工具函数
└── project.config.json         # 项目配置
```

### 🚀 快速开始

#### 1. 克隆项目

```bash
git clone https://github.com/Luvia233/TreasureMap.git
```

#### 2. 导入项目

1. 下载并安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 打开微信开发者工具，选择"导入项目"
3. 选择项目目录 `treasuremap`
4. 填写你的 AppID（可在[微信公众平台](https://mp.weixin.qq.com/)获取）

#### 3. 配置云开发

1. 在微信开发者工具中，点击"云开发"按钮
2. 开通云开发环境，记录环境 ID
3. 修改 `miniprogram/app.js` 中的云开发环境 ID：

```javascript
wx.cloud.init({
  env: 'your-env-id',  // 替换为你的云开发环境ID
  traceUser: true,
})
```

#### 4. 创建数据库集合

在云开发控制台创建以下集合：

| 集合名 | 说明 |
|--------|------|
| `users` | 用户信息 |
| `families` | 家庭信息 |
| `items` | 物品信息 |
| `invite_codes` | 邀请码 |

#### 5. 部署云函数

1. 在微信开发者工具中，右键点击 `cloudfunctions` 目录下的每个云函数文件夹
2. 选择"上传并部署：云端安装依赖"

#### 6. 运行项目

点击微信开发者工具的"编译"按钮，即可在模拟器中预览项目。

### 📱 界面预览

| 首页 | 搜索页 | 添加页 |
|:---:|:---:|:---:|
| 按空间浏览物品 | 关键词搜索 | 添加新物品 |

### 🔒 安全设计

- 邀请码有效期：7天
- 邀请码使用次数限制：5次
- 家庭数据隔离：每个家庭只能看到自己家的物品
- 用户权限区分：房主和普通成员权限不同

### 📄 许可证

本项目采用 [MIT](LICENSE) 许可证。

---

## 📖 English Documentation

### Introduction

**TreasureMap** is a WeChat Mini Program that helps families easily record and manage the location of household items. Like a family treasure map, it helps you quickly find where every "treasure" is hidden! It supports manual/voice input, browsing by space, full-text search, family sharing, and more.

### ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **User Authentication** | One-click login via WeChat authorization, secure and convenient |
| 👨‍👩‍👧 **Family Sharing** | Create/join families, share via invite codes, manage together |
| 🏠 **Browse by Space** | View items categorized by living room, bedroom, kitchen, etc. |
| 📦 **Item Management** | Add, edit, delete items with photo upload support |
| 🔍 **Full-text Search** | Fuzzy keyword search for quick item location |
| 🎤 **Voice Input** | Voice recognition for item names (in development) |
| 📴 **Offline Cache** | Automatically read cached data when offline |
| 🎨 **Warm UI** | Warm color scheme, smooth animations, comfortable experience |

### 🛠️ Tech Stack

- **Frontend**: WeChat Mini Program Native Framework (WXML, WXSS, JavaScript)
- **Backend**: WeChat Cloud Development (Cloud Functions, Cloud Database, Cloud Storage)
- **UI Design**: Warm family style, gradient color scheme

### 📁 Project Structure

```
treasuremap/
├── miniprogram/                # Mini Program Main
│   ├── pages/                  # Pages
│   │   ├── login/              # Login Page
│   │   ├── createFamily/       # Create Family Page
│   │   ├── joinFamily/         # Join Family Page
│   │   ├── index/              # Home (Browse by Space)
│   │   ├── search/             # Search Page
│   │   ├── add/                # Add Item Page
│   │   ├── detail/             # Item Detail Page
│   │   ├── edit/               # Edit Item Page
│   │   └── family/             # Family Management Page
│   ├── components/             # Components
│   │   └── voiceInput/         # Voice Input Component
│   ├── utils/                  # Utilities
│   │   ├── storage.js          # Offline Cache
│   │   └── voice.js            # Voice Recognition
│   ├── app.js                  # App Entry
│   ├── app.json                # App Config
│   └── app.wxss                # Global Styles
├── cloudfunctions/             # Cloud Functions
│   ├── login/                  # Login
│   ├── createFamily/           # Create Family
│   ├── joinFamily/             # Join Family
│   ├── generateInviteCode/     # Generate Invite Code
│   ├── getItems/               # Get Items List
│   ├── addItem/                # Add Item
│   ├── updateItem/             # Update Item
│   ├── deleteItem/             # Delete Item
│   ├── searchItems/            # Search Items
│   └── utils/                  # Utilities
└── project.config.json         # Project Config
```

### 🚀 Quick Start

#### 1. Clone the Project

```bash
git clone https://github.com/Luvia233/TreasureMap.git
```

#### 2. Import Project

1. Download and install [WeChat Developer Tools](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. Open WeChat Developer Tools, select "Import Project"
3. Select the project directory `treasuremap`
4. Enter your AppID (available at [WeChat Public Platform](https://mp.weixin.qq.com/))

#### 3. Configure Cloud Development

1. Click "Cloud Development" button in WeChat Developer Tools
2. Enable cloud development and note the environment ID
3. Modify the cloud environment ID in `miniprogram/app.js`:

```javascript
wx.cloud.init({
  env: 'your-env-id',  // Replace with your cloud environment ID
  traceUser: true,
})
```

#### 4. Create Database Collections

Create the following collections in the Cloud Development Console:

| Collection | Description |
|------------|-------------|
| `users` | User Information |
| `families` | Family Information |
| `items` | Item Information |
| `invite_codes` | Invite Codes |

#### 5. Deploy Cloud Functions

1. In WeChat Developer Tools, right-click each cloud function folder under `cloudfunctions`
2. Select "Upload and Deploy: Install dependencies in the cloud"

#### 6. Run the Project

Click the "Compile" button in WeChat Developer Tools to preview the project in the simulator.

### 📱 Screenshots

| Home | Search | Add Item |
|:---:|:---:|:---:|
| Browse by space | Keyword search | Add new item |

### 🔒 Security Design

- Invite code validity: 7 days
- Invite code usage limit: 5 times
- Family data isolation: Each family can only see their own items
- User permission distinction: Different permissions for owners and members

### 📄 License

This project is licensed under the [MIT](LICENSE) License.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

If you have any questions or suggestions, please open an issue on GitHub.

---

⭐ If this project helps you, please give it a star!
