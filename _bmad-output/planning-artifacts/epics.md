---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - planning-artifacts/prd.md
  - planning-artifacts/architecture.md
  - planning-artifacts/ux-design-specification.md
---

# IdeaFlow - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for IdeaFlow, decomposing the requirements from the PRD, UX Design, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

**用户身份管理（Phase 1）：**
- FR1: 用户可以使用手机号注册账号
- FR2: 用户可以使用手机号登录系统
- FR3: 用户可以退出登录
- FR4: 用户可以修改个人基本信息
- FR45: 用户可以使用用户名+密码注册/登录

**想法捕捉（Phase 1）：**
- FR5: 用户可以快速创建想法（闪念捕捉）
- FR6: 系统自动记录想法的创建时间
- FR7: 用户可以可选地添加想法来源或原因
- FR8: 用户可以查看想法列表
- FR9: 用户可以编辑已创建的想法
- FR10: 用户可以删除想法

**自由画布（Phase 1）：**
- FR11: 用户可以在画布上自由拖拽想法节点
- FR12: 用户可以缩放画布视图
- FR13: 用户可以平移画布视图
- FR14: 用户可以在节点之间绘制连线（拉线标注）
- FR15: 用户可以为连线添加文字标注
- FR16: 用户可以删除连线
- FR17: 用户可以创建多个画布
- FR18: 用户可以在画布间切换
- FR38: 用户可以在画布上创建区域（视觉分组）
- FR39: 用户可以将节点拖入区域进行分组

**任务管理（Phase 1）：**
- FR19: 用户可以将想法转化为任务
- FR20: 用户可以设置任务的时间（截止日期）
- FR21: 用户可以修改任务状态（待办/进行中/已完成）
- FR22: 用户可以查看任务进度
- FR23: 用户可以对任务进行分类（模块）
- FR24: 用户可以查看任务列表（按分类筛选）
- FR25: 用户可以编辑任务详情
- FR26: 用户可以删除任务

**搜索与筛选（Phase 1）：**
- FR40: 用户可以搜索想法和任务
- FR41: 用户可以按时间/状态/分类筛选列表

**上下文与记忆（Phase 1-2）：**
- FR27: 用户可以查看想法的创建上下文（时间+来源）
- FR28: 系统可以识别7天+未操作的"沉底点子"（Phase 2）
- FR29: 系统可以向用户发送沉底点子提醒（Phase 2）
- FR30: 用户可以查看"记忆恢复"卡片展示（Phase 2）

**视图与展示（Phase 2）：**
- FR31: 用户可以切换公开/私密视图
- FR32: 系统可以生成干净的公开分享视图

**通知功能（Phase 2）：**
- FR43: 用户可以查看系统通知列表
- FR44: 用户可以设置通知偏好

**团队协作（Phase 3）：**
- FR33: 用户可以通过链接分享画布给他人
- FR34: 受邀用户可以注册并加入团队
- FR35: 用户可以@成员分配任务
- FR36: 团队成员可以查看共享画布
- FR37: 团队成员可以在画布上添加内容

**数据埋点（Phase 1）：**
- FR42: 系统记录关键用户行为（idea_created, task_completed等）

**第三方登录（Phase 2）：**
- FR46: 用户可以使用第三方账号登录（微信/Apple ID）

**统计：总需求数 46个（Phase 1: 34个, Phase 2: 7个, Phase 3: 5个）**

### NonFunctional Requirements

**性能：**
- NFR1: 首屏加载时间（4G/WiFi）< 2s
- NFR2: 画布节点拖拽响应 < 100ms
- NFR3: 画布缩放平移响应 60fps 无卡顿
- NFR4: API响应时间（正常网络）< 300ms
- NFR5: 单画布最大节点数 ≤100个

**安全：**
- NFR6: 用户密码加密存储（bcrypt或argon2）
- NFR7: 数据传输加密（HTTPS/TLS 1.2+）
- NFR8: Session管理（JWT 24h过期 + Refresh Token 7天）
- NFR9: 私密内容访问控制（仅创建者可见）
- NFR10: 分享链接权限控制（仅授权用户可访问）
- NFR25: 隐私合规（符合个人信息保护法）
- NFR26: 密码强度验证（≥8位，含字母和数字）

**用户反馈：**
- NFR19: 加载状态显示（所有等待操作必须显示loading）
- NFR20: 防重复提交（按钮点击后显示loading，禁用重复点击）
- NFR21: 错误提示（API失败时显示友好提示+重试按钮）
- NFR22: 表单验证反馈（错误即时显示在对应字段下方）
- NFR23: 离线提示（网络断开显示提示，恢复后自动重连）

**可靠性：**
- NFR11: 系统可用性 99.5% uptime
- NFR12: 数据自动保存（操作后≤3秒保存，离线时本地缓存）
- NFR13: 数据备份（每日备份，保留7天）
- NFR14: 错误恢复（自动保存草稿，防止丢失）
- NFR24: 日志记录（记录关键操作日志，支持运维排查）

**浏览器兼容性：**
- NFR15: 支持Chrome（最新-2版本）
- NFR16: 支持Safari（最新-2版本）
- NFR17: 支持Firefox（最新-2版本）
- NFR18: 支持Edge（最新版本）

**统计：总NFR数 26个（性能5个, 安全7个, 用户反馈5个, 可靠性5个, 兼容性4个）**

### Additional Requirements

**从 Architecture 文档提取的技术要求：**

**Starter Template 配置：**
- 使用 Monorepo（pnpm workspaces）项目结构
- Frontend: Vite + React 18 + TypeScript + TailwindCSS
- Backend: NestJS + TypeScript
- 数据库: PostgreSQL + Prisma ORM
- 画布渲染引擎: Konva.js
- 状态管理: Jotai

**认证方案（JWT + Refresh Token）：**
- Access Token 过期 15 分钟
- Refresh Token 过期 7 天，存储在 HttpOnly Cookie
- 密码加密 bcrypt (cost=10)
- 安全中间件：NestJS Guards、class-validator、Helmet、Rate Limiting

**API 设计规范：**
- API 前缀：`/ideaFlow/api/v1/...`
- 统一 JSON 响应格式
- 分页响应格式带 meta 信息

**部署方案（Docker 自部署）：**
- 前端 Nginx 静态文件
- 后端 Docker 容器
- PostgreSQL Docker 容器
- GitHub Actions 自动部署

**开发规范：**
- TDD（测试驱动开发）
- 核心功能 100% 测试覆盖
- 测试框架：Vitest（前端） + Jest（NestJS） + Playwright（E2E）
- 代码规范：ESLint + Prettier + Husky

**从 UX 文档提取的设计要求：**

**核心体验要求：**
- 闪念捕捉 ≤3秒完成
- 「创建时静默，回顾时惊艳」的上下文设计
- 自由画布 60fps 流畅交互
- 「私密时自由，公开时体面」的双视图设计

**设计系统要求：**
- 核心 UI 组件库：Arco Design
- 画布渲染引擎：Konva.js
- 主色：#3B82F6（蓝色）+ #8B5CF6（紫色辅助）
- 圆角：8px（卡片）、6px（按钮）
- 字体：系统字体优先

**自定义组件：**
- IdeaCard（想法卡片）
- SourcePreview（来源预览：链接/图片/文件）
- MemoryRecoveryCard（记忆恢复卡片）
- CanvasNode（画布节点）
- ConnectionLine（连线标注）
- QuickCapture（闪念捕捉）

**响应式策略：**
- Desktop (1024px+): 完整功能
- Tablet (768-1023px): 核心功能（无画布编辑）
- Mobile (<768px): 只读浏览 + 闪念捕捉

**无障碍要求：**
- WCAG 2.1 Level AA
- 对比度 ≥4.5:1
- 焦点指示清晰
- 键盘导航支持

### FR Coverage Map

| FR | Epic | 描述 |
|----|------|------|
| FR1 | Epic 1 | 手机号注册 |
| FR2 | Epic 1 | 手机号登录 |
| FR3 | Epic 1 | 退出登录 |
| FR4 | Epic 1 | 修改个人信息 |
| FR45 | Epic 1 | 用户名+密码注册/登录 |
| FR42 | Epic 1 | 数据埋点基础 |
| FR5 | Epic 2 | 快速创建想法 |
| FR6 | Epic 2 | 自动记录创建时间 |
| FR7 | Epic 2 | 可选添加来源/原因 |
| FR8 | Epic 2 | 查看想法列表 |
| FR9 | Epic 2 | 编辑想法 |
| FR10 | Epic 2 | 删除想法 |
| FR27 | Epic 2 | 查看想法上下文 |
| FR11 | Epic 3 | 画布拖拽节点 |
| FR12 | Epic 3 | 缩放画布视图 |
| FR13 | Epic 3 | 平移画布视图 |
| FR14 | Epic 3 | 节点间绘制连线 |
| FR15 | Epic 3 | 连线添加文字标注 |
| FR16 | Epic 3 | 删除连线 |
| FR17 | Epic 3 | 创建多个画布 |
| FR18 | Epic 3 | 画布间切换 |
| FR38 | Epic 3 | 创建区域分组 |
| FR39 | Epic 3 | 节点拖入区域 |
| FR19 | Epic 4 | 想法转化为任务 |
| FR20 | Epic 4 | 设置任务时间 |
| FR21 | Epic 4 | 修改任务状态 |
| FR22 | Epic 4 | 查看任务进度 |
| FR23 | Epic 4 | 任务分类 |
| FR24 | Epic 4 | 任务列表筛选 |
| FR25 | Epic 4 | 编辑任务详情 |
| FR26 | Epic 4 | 删除任务 |
| FR40 | Epic 5 | 搜索想法和任务 |
| FR41 | Epic 5 | 按条件筛选列表 |
| FR28 | Epic 6 | 识别沉底点子 |
| FR29 | Epic 6 | 沉底点子提醒 |
| FR30 | Epic 6 | 记忆恢复卡片 |
| FR31 | Epic 7 | 公开/私密视图切换 |
| FR32 | Epic 7 | 生成公开分享视图 |
| FR43 | Epic 7 | 系统通知列表 |
| FR44 | Epic 7 | 通知偏好设置 |
| FR46 | Epic 7 | 第三方账号登录 |
| FR33 | Epic 8 | 链接分享画布 |
| FR34 | Epic 8 | 受邀用户加入团队 |
| FR35 | Epic 8 | @成员分配任务 |
| FR36 | Epic 8 | 团队查看共享画布 |
| FR37 | Epic 8 | 团队画布添加内容 |

## Epic List

### Epic 1: 用户认证与基础架构

**用户价值**：用户可以注册、登录并管理自己的账户，系统具备完整的基础架构

**FRs 覆盖**：FR1, FR2, FR3, FR4, FR45, FR42

**技术说明**：
- 初始化 Monorepo 项目结构（pnpm workspaces）
- 前端：Vite + React 18 + TypeScript + TailwindCSS + Arco Design
- 后端：NestJS + TypeScript + Prisma + PostgreSQL
- JWT 认证系统完整实现（Access Token 15min + Refresh Token 7天）
- 基础 UI 框架和路由搭建
- 埋点服务基础架构

---

### Epic 2: 想法捕捉与管理

**用户价值**：用户可以快速捕捉想法（≤3秒）、记录上下文，并查看/编辑/删除想法

**FRs 覆盖**：FR5, FR6, FR7, FR8, FR9, FR10, FR27

**技术说明**：
- QuickCapture 闪念捕捉组件
- IdeaCard 想法卡片组件
- SourcePreview 来源预览组件（链接/图片/文件）
- 想法 CRUD API
- 自动时间戳记录
- 「创建时静默，回顾时惊艳」的上下文展示

---

### Epic 3: 自由画布体验

**用户价值**：用户可以在自由画布上组织想法，通过拖拽、缩放、连线来可视化思维关系

**FRs 覆盖**：FR11, FR12, FR13, FR14, FR15, FR16, FR17, FR18, FR38, FR39

**技术说明**：
- Konva.js 画布渲染引擎
- 60fps 流畅交互（NFR3）
- CanvasNode 画布节点组件
- ConnectionLine 连线标注组件
- Region 区域分组组件
- 多画布管理
- 画布数据持久化

---

### Epic 4: 任务管理与执行

**用户价值**：用户可以将想法转化为任务，设置截止日期，追踪进度，完成执行

**FRs 覆盖**：FR19, FR20, FR21, FR22, FR23, FR24, FR25, FR26

**技术说明**：
- 想法→任务一键转化流程
- 任务状态机（待办/进行中/已完成）
- 任务列表多视图（今天/即将到来/个人/项目）
- TaskCard 任务卡片组件
- 任务分类/模块管理
- 完成动效庆祝

---

### Epic 5: 搜索与筛选

**用户价值**：用户可以快速搜索想法和任务，按条件筛选找到需要的内容

**FRs 覆盖**：FR40, FR41

**技术说明**：
- ⌘+K 全局搜索快捷键
- PostgreSQL 全文搜索
- 筛选器组件（时间/状态/分类）
- 实时搜索结果

---

### Epic 6: 智能提醒与记忆恢复（Phase 2）

**用户价值**：用户收到沉底点子提醒，打开旧想法时看到记忆恢复卡片，重拾遗忘的灵感

**FRs 覆盖**：FR28, FR29, FR30

**技术说明**：
- MemoryRecoveryCard 记忆恢复卡片组件
- 定时任务检测 7天+ 未操作的沉底点子
- 通知推送服务
- 「回顾时惊艳」的 UI 设计

---

### Epic 7: 公开分享与视图切换（Phase 2）

**用户价值**：用户可以切换公开/私密视图，生成干净的分享链接给他人

**FRs 覆盖**：FR31, FR32, FR43, FR44, FR46

**技术说明**：
- 「私密时自由，公开时体面」双视图设计
- 分享链接权限控制
- 系统通知中心
- 通知偏好设置
- 第三方 OAuth 集成（微信/Apple ID）

---

### Epic 8: 团队协作（Phase 3）

**用户价值**：用户可以邀请团队成员，@分配任务，多人共同在画布上协作

**FRs 覆盖**：FR33, FR34, FR35, FR36, FR37

**技术说明**：
- 团队/权限模块
- 刷新同步（MVP 不做实时协作）
- @提及通知
- 协作者入口（受邀注册）
- 共享画布权限管理

---

## Epic 1 Stories: 用户认证与基础架构

### Story 1.1: 项目初始化与基础架构搭建

As a **开发者**,
I want **完成 Monorepo 项目初始化及基础配置**,
So that **后续功能开发有统一的技术栈和项目结构**.

**Acceptance Criteria:**

**Given** 一个空的项目目录
**When** 执行项目初始化脚本
**Then** 创建 pnpm workspaces Monorepo 结构
**And** 前端项目使用 Vite + React 18 + TypeScript + TailwindCSS 初始化
**And** 后端项目使用 NestJS + TypeScript 初始化
**And** 共享类型包 (packages/shared) 创建完成
**And** Prisma 配置连接 PostgreSQL 数据库
**And** ESLint + Prettier + Husky 配置完成
**And** Docker Compose 本地开发环境可用
**And** 基础路由和布局组件搭建完成（侧边栏 + 主内容区）
**And** Arco Design 组件库集成完成

**技术验收标准：**
- `pnpm install` 成功
- `pnpm dev` 可同时启动前后端
- 前端访问 `localhost:5173` 显示基础布局
- 后端 API `localhost:3000/ideaFlow/api/v1/health` 返回 200

---

### Story 1.2: 用户注册功能（手机号/用户名密码）

As a **新用户**,
I want **使用手机号或用户名+密码注册账号**,
So that **我可以使用 IdeaFlow 的功能**.

**FRs 覆盖**：FR1, FR45

**Acceptance Criteria:**

**Given** 用户在注册页面
**When** 输入有效的手机号/用户名和密码（≥8位，含字母和数字）
**Then** 系统创建新用户账户
**And** 密码使用 bcrypt (cost=10) 加密存储
**And** 返回 JWT Access Token (15min) 和 Refresh Token (7天 HttpOnly Cookie)
**And** 自动跳转到主页面

**Given** 用户输入已注册的手机号/用户名
**When** 点击注册按钮
**Then** 显示错误提示「该账号已注册」

**Given** 用户输入弱密码（少于8位或纯数字）
**When** 尝试提交注册
**Then** 表单验证失败，显示密码强度要求

**Given** 用户未填写必填项
**When** 点击注册按钮
**Then** 对应字段显示红框和错误提示

**技术验收标准：**
- Prisma User 表创建成功
- POST `/ideaFlow/api/v1/auth/register` 正常工作
- 密码不以明文存储
- JWT 正确生成和验证

---

### Story 1.3: 用户登录功能

As a **已注册用户**,
I want **使用手机号或用户名+密码登录系统**,
So that **我可以访问我的想法和任务**.

**FRs 覆盖**：FR2, FR45

**Acceptance Criteria:**

**Given** 用户在登录页面
**When** 输入正确的账号和密码
**Then** 系统验证成功
**And** 返回 JWT Access Token 和 Refresh Token
**And** 自动跳转到主页面（仪表盘）

**Given** 用户输入错误的密码
**When** 点击登录按钮
**Then** 显示错误提示「账号或密码错误」
**And** 不透露是账号还是密码错误

**Given** Access Token 过期
**When** 发起 API 请求
**Then** 系统自动使用 Refresh Token 刷新 Access Token
**And** 请求正常完成（用户无感知）

**Given** Refresh Token 过期
**When** 发起 API 请求
**Then** 返回 401 未授权
**And** 自动跳转到登录页面

**技术验收标准：**
- POST `/ideaFlow/api/v1/auth/login` 正常工作
- JWT Guard 保护需要认证的路由
- Token 刷新机制正常工作

---

### Story 1.4: 用户退出登录

As a **已登录用户**,
I want **安全退出登录**,
So that **保护我的账户安全**.

**FRs 覆盖**：FR3

**Acceptance Criteria:**

**Given** 用户已登录
**When** 点击「退出登录」按钮
**Then** 清除本地存储的 Access Token
**And** 清除 HttpOnly Cookie 中的 Refresh Token
**And** 跳转到登录页面

**Given** 用户退出后
**When** 尝试直接访问需要认证的页面
**Then** 重定向到登录页面

**技术验收标准：**
- POST `/ideaFlow/api/v1/auth/logout` 正常工作
- Cookie 正确清除
- 前端路由守卫正常工作

---

### Story 1.5: 用户个人信息管理

As a **已登录用户**,
I want **查看和修改我的个人信息**,
So that **保持我的账户信息准确**.

**FRs 覆盖**：FR4

**Acceptance Criteria:**

**Given** 用户在设置页面
**When** 查看个人信息区域
**Then** 显示当前用户名、手机号（脱敏显示）

**Given** 用户修改昵称
**When** 填写新昵称并保存
**Then** 昵称更新成功
**And** 显示「保存成功」提示

**Given** 用户修改密码
**When** 输入正确的旧密码和新密码
**Then** 密码更新成功
**And** 自动退出登录，要求重新登录

**Given** 用户输入错误的旧密码
**When** 尝试修改密码
**Then** 显示错误提示「旧密码错误」

**技术验收标准：**
- GET `/ideaFlow/api/v1/users/me` 返回当前用户信息
- PATCH `/ideaFlow/api/v1/users/me` 更新用户信息
- 敏感信息（手机号）脱敏返回

---

### Story 1.6: 数据埋点基础架构

As a **产品经理**,
I want **系统能够记录关键用户行为**,
So that **我可以分析用户使用情况**.

**FRs 覆盖**：FR42

**Acceptance Criteria:**

**Given** 用户完成注册
**When** 注册成功
**Then** 系统记录 `user_registered` 事件
**And** 包含时间戳和用户 ID

**Given** 用户登录
**When** 登录成功
**Then** 系统记录 `user_logged_in` 事件

**Given** 埋点数据
**When** 存储到数据库
**Then** 包含事件名称、用户 ID、时间戳、元数据 JSON
**And** 支持后续扩展更多事件类型

**技术验收标准：**
- Prisma AnalyticsEvent 表创建成功
- POST `/ideaFlow/api/v1/analytics/track` 正常工作
- 前端 `useAnalytics` Hook 可用

---

**Epic 1 Stories 完成：6 个 Stories，覆盖 FR1, FR2, FR3, FR4, FR42, FR45**

---

## Epic 2 Stories: 想法捕捉与管理

### Story 2.1: 快速创建想法（闪念捕捉）

As a **用户**,
I want **在 3 秒内快速记录一个想法**,
So that **不错过任何灵感闪现的时刻**.

**FRs 覆盖**：FR5, FR6

**Acceptance Criteria:**

**Given** 用户在任何页面
**When** 点击「+」按钮或按下 ⌘+N 快捷键
**Then** 弹出极简的 QuickCapture 输入框
**And** 焦点自动在输入框中

**Given** 用户在 QuickCapture 输入框中输入内容
**When** 按下 Enter 键或失去焦点
**Then** 想法保存成功
**And** 系统自动记录创建时间戳
**And** 显示「已保存 ✓」提示（1.5s 消失）
**And** 想法出现在想法列表中

**Given** 输入框为空
**When** 按下 Enter
**Then** 不创建想法，输入框保持打开

**技术验收标准：**
- Prisma Idea 表创建成功
- POST `/ideaFlow/api/v1/ideas` 正常工作
- QuickCapture 组件响应时间 < 100ms
- 从点击到完成保存 ≤ 3秒

---

### Story 2.2: 想法来源与上下文记录

As a **用户**,
I want **可选地为想法添加来源或原因**,
So that **未来回顾时能想起当时的场景**.

**FRs 覆盖**：FR7, FR27

**Acceptance Criteria:**

**Given** 用户在 QuickCapture 输入框中
**When** 点击展开按钮
**Then** 显示来源输入区域（非必填）
**And** 支持链接、图片、文字备注三种来源类型

**Given** 用户粘贴一个 URL
**When** URL 有效
**Then** 系统自动获取 Open Graph 信息
**And** 显示链接预览卡片（标题 + 缩略图 + 域名）

**Given** 用户粘贴或拖拽图片
**When** 图片有效
**Then** 显示图片缩略图预览
**And** 图片上传到服务器存储

**Given** 用户查看想法详情
**When** 想法有来源
**Then** 显示来源预览和创建时间

**技术验收标准：**
- SourcePreview 组件实现
- 链接 Open Graph 解析 API
- 图片上传 API 正常工作
- 来源数据存储在 JSONB 字段

---

### Story 2.3: 想法列表与查看

As a **用户**,
I want **查看我的所有想法**,
So that **回顾和管理我的灵感**.

**FRs 覆盖**：FR8

**Acceptance Criteria:**

**Given** 用户在想法页面
**When** 页面加载
**Then** 显示想法列表（按创建时间倒序）
**And** 每个想法卡片显示：内容摘要、创建时间、来源图标

**Given** 想法列表
**When** 滚动到底部
**Then** 自动加载更多想法（分页加载）

**Given** 想法卡片
**When** 点击卡片
**Then** 右侧滑出详情面板
**And** 显示完整内容、来源预览、创建上下文

**技术验收标准：**
- GET `/ideaFlow/api/v1/ideas` 支持分页
- IdeaCard 组件实现
- 详情面板动画流畅

---

### Story 2.4: 编辑想法

As a **用户**,
I want **编辑已创建的想法**,
So that **完善或修正我的记录**.

**FRs 覆盖**：FR9

**Acceptance Criteria:**

**Given** 用户在想法详情面板
**When** 双击内容区域或点击编辑按钮
**Then** 内容变为可编辑状态

**Given** 用户修改想法内容
**When** 点击保存或失去焦点
**Then** 想法更新成功
**And** 显示「已保存 ✓」提示
**And** 记录更新时间

**Given** 用户编辑中
**When** 网络断开
**Then** 内容自动保存到本地缓存
**And** 网络恢复后自动同步

**技术验收标准：**
- PATCH `/ideaFlow/api/v1/ideas/:id` 正常工作
- 自动保存（Debounce 3秒）
- 离线缓存支持

---

### Story 2.5: 删除想法

As a **用户**,
I want **删除不再需要的想法**,
So that **保持我的想法库整洁**.

**FRs 覆盖**：FR10

**Acceptance Criteria:**

**Given** 用户在想法详情或列表
**When** 点击删除按钮
**Then** 弹出确认对话框「确定删除这个想法吗？」

**Given** 用户确认删除
**When** 点击确认
**Then** 想法删除成功
**And** 从列表中移除
**And** 显示「已删除」提示

**Given** 想法已关联任务
**When** 尝试删除
**Then** 提示「此想法已关联任务，删除后关联将解除」

**技术验收标准：**
- DELETE `/ideaFlow/api/v1/ideas/:id` 正常工作
- 软删除实现
- 关联关系正确处理

---

**Epic 2 Stories 完成：5 个 Stories，覆盖 FR5, FR6, FR7, FR8, FR9, FR10, FR27**

---

## Epic 3 Stories: 自由画布体验

### Story 3.1: 画布创建与基础渲染

As a **用户**,
I want **创建一个自由画布并添加想法节点**,
So that **可视化组织我的想法**.

**FRs 覆盖**：FR17

**Acceptance Criteria:**

**Given** 用户在画布页面
**When** 点击「新建画布」
**Then** 创建一个空白画布
**And** 画布使用 Konva.js 渲染

**Given** 用户在画布中
**When** 从想法列表拖拽想法到画布
**Then** 在画布上创建对应的节点
**And** 节点显示想法摘要

**Given** 画布
**When** 有节点存在
**Then** 自动保存画布状态（Debounce 3秒）

**技术验收标准：**
- Prisma Canvas 表创建成功
- Konva.js Stage 初始化
- CanvasNode 组件实现
- POST `/ideaFlow/api/v1/canvases` 正常工作

---

### Story 3.2: 画布缩放与平移

As a **用户**,
I want **缩放和平移画布视图**,
So that **查看不同区域和不同粒度的内容**.

**FRs 覆盖**：FR12, FR13

**Acceptance Criteria:**

**Given** 用户在画布中
**When** 使用鼠标滚轮或双指捏合
**Then** 画布平滑缩放（60fps）
**And** 缩放以鼠标/触控点为中心

**Given** 用户在画布空白区域
**When** 按住拖拽
**Then** 画布平滑平移（60fps）

**Given** 缩放操作
**When** 缩放比例
**Then** 限制在 10%-400% 范围内
**And** 显示当前缩放比例

**技术验收标准：**
- Konva.js Stage scale 和 position 设置
- 60fps 无卡顿（NFR3）
- 触控板和鼠标兼容

---

### Story 3.3: 节点拖拽与定位

As a **用户**,
I want **在画布上自由拖拽节点**,
So that **按照我的思维方式组织内容**.

**FRs 覆盖**：FR11

**Acceptance Criteria:**

**Given** 用户在画布上有节点
**When** 拖拽节点
**Then** 节点跟随鼠标平滑移动（< 100ms 响应）

**Given** 节点拖拽
**When** 释放鼠标
**Then** 节点停在新位置
**And** 位置自动保存

**Given** 多个节点
**When** 拖拽使其重叠
**Then** 被拖拽节点在顶层显示

**技术验收标准：**
- Konva.js 拖拽事件处理
- 位置数据持久化
- 响应时间 < 100ms（NFR2）

---

### Story 3.4: 节点连线与标注

As a **用户**,
I want **在节点之间绘制连线并添加文字标注**,
So that **表达想法之间的关系**.

**FRs 覆盖**：FR14, FR15, FR16

**Acceptance Criteria:**

**Given** 用户选中一个节点
**When** 从节点边缘拖出
**Then** 显示连线预览
**And** 连线跟随鼠标移动

**Given** 连线预览
**When** 拖到另一个节点并释放
**Then** 创建两节点间的连线
**And** 可以双击连线添加文字标注

**Given** 已有连线
**When** 选中连线并按 Delete
**Then** 删除该连线

**Given** 节点被拖动
**When** 有连线连接
**Then** 连线自动跟随更新位置

**技术验收标准：**
- ConnectionLine 组件实现
- Konva.js Line 和 Text 元素
- 连线数据持久化

---

### Story 3.5: 画布区域分组

As a **用户**,
I want **在画布上创建区域来组织节点**,
So that **将相关想法分类整理**.

**FRs 覆盖**：FR38, FR39

**Acceptance Criteria:**

**Given** 用户在画布中
**When** 从工具栏选择「区域」工具并拖拽
**Then** 创建一个矩形区域
**And** 区域可设置名称和颜色

**Given** 已有区域
**When** 将节点拖入区域
**Then** 节点与区域建立分组关系

**Given** 区域包含节点
**When** 移动区域
**Then** 区域内所有节点一起移动

**技术验收标准：**
- Region 组件实现
- Konva.js Rect + Group
- 分组关系数据持久化

---

### Story 3.6: 多画布管理

As a **用户**,
I want **创建多个画布并在它们之间切换**,
So that **用不同画布管理不同主题的想法**.

**FRs 覆盖**：FR17, FR18

**Acceptance Criteria:**

**Given** 用户在侧边栏
**When** 查看画布列表
**Then** 显示所有画布名称

**Given** 画布列表
**When** 点击某个画布
**Then** 切换到该画布显示

**Given** 画布列表
**When** 点击「新建画布」
**Then** 创建新画布并自动切换

**Given** 画布
**When** 右键菜单选择「重命名」
**Then** 可以修改画布名称

**技术验收标准：**
- GET `/ideaFlow/api/v1/canvases` 返回画布列表
- 画布切换流畅

---

**Epic 3 Stories 完成：6 个 Stories，覆盖 FR11, FR12, FR13, FR14, FR15, FR16, FR17, FR18, FR38, FR39**

---

## Epic 4 Stories: 任务管理与执行

### Story 4.1: 想法转化为任务

As a **用户**,
I want **将想法一键转化为任务**,
So that **推动想法落地执行**.

**FRs 覆盖**：FR19

**Acceptance Criteria:**

**Given** 用户在想法详情或画布节点
**When** 点击「转为任务」按钮
**Then** 弹出简洁的任务创建面板
**And** 想法内容自动填入任务标题

**Given** 任务创建面板
**When** 点击「创建任务」
**Then** 任务创建成功
**And** 想法与任务保持关联
**And** 显示「任务已创建 🎉」庆祝动效

**Given** 任务已从想法转化
**When** 查看任务详情
**Then** 可以看到原始想法的链接

**技术验收标准：**
- Prisma Task 表创建成功
- POST `/ideaFlow/api/v1/tasks` 正常工作
- 想法-任务关联关系存储

---

### Story 4.2: 任务时间设置

As a **用户**,
I want **为任务设置截止日期**,
So that **按时完成任务**.

**FRs 覆盖**：FR20

**Acceptance Criteria:**

**Given** 用户在任务详情
**When** 点击日期选择器
**Then** 弹出日历组件

**Given** 日历组件
**When** 选择日期
**Then** 任务截止日期更新
**And** 日期选择器显示选中日期

**Given** 任务有截止日期
**When** 临近截止（3天内）
**Then** 任务卡片显示橙色提醒标记

**Given** 任务已过期
**When** 查看任务列表
**Then** 任务卡片显示红色过期标记

**技术验收标准：**
- DatePicker 组件集成
- 截止日期数据存储和查询

---

### Story 4.3: 任务状态管理

As a **用户**,
I want **修改任务状态（待办/进行中/已完成）**,
So that **追踪任务进度**.

**FRs 覆盖**：FR21, FR22

**Acceptance Criteria:**

**Given** 用户查看任务
**When** 点击状态切换按钮
**Then** 任务状态循环切换：待办 → 进行中 → 已完成

**Given** 任务标记为已完成
**When** 状态变更
**Then** 播放完成庆祝动效 🎉
**And** 记录完成时间
**And** 记录 `task_completed` 埋点事件

**Given** 任务列表
**When** 查看进度统计
**Then** 显示完成数/总数百分比

**技术验收标准：**
- 任务状态枚举实现
- 状态变更 API
- 进度统计 API

---

### Story 4.4: 任务分类管理

As a **用户**,
I want **对任务进行分类（模块）**,
So that **按项目组织任务**.

**FRs 覆盖**：FR23

**Acceptance Criteria:**

**Given** 用户创建/编辑任务
**When** 点击分类选择
**Then** 显示分类列表（可创建新分类）

**Given** 分类列表
**When** 选择分类
**Then** 任务归属到该分类

**Given** 用户在设置中
**When** 管理分类
**Then** 可以创建、重命名、删除分类

**技术验收标准：**
- Prisma Category 表创建成功
- 分类 CRUD API

---

### Story 4.5: 任务列表与筛选视图

As a **用户**,
I want **查看任务列表并按条件筛选**,
So that **找到需要处理的任务**.

**FRs 覆盖**：FR24

**Acceptance Criteria:**

**Given** 用户在任务页面
**When** 点击顶部标签页
**Then** 切换不同视图：今天 / 即将到来 / 个人 / 项目

**Given** 任务列表
**When** 使用筛选器
**Then** 可按状态、分类、时间筛选

**Given** 筛选结果
**When** 有匹配任务
**Then** 显示筛选后的任务列表

**Given** 筛选结果
**When** 无匹配任务
**Then** 显示空状态引导

**技术验收标准：**
- 任务列表分页和筛选 API
- 标签页切换组件
- 筛选器组件

---

### Story 4.6: 任务编辑与删除

As a **用户**,
I want **编辑任务详情和删除任务**,
So that **管理任务信息**.

**FRs 覆盖**：FR25, FR26

**Acceptance Criteria:**

**Given** 用户在任务详情
**When** 修改标题、描述、日期等
**Then** 自动保存更改

**Given** 用户在任务详情
**When** 点击删除按钮
**Then** 弹出确认对话框

**Given** 确认删除
**When** 点击确认
**Then** 任务删除成功（软删除）
**And** 关联的想法保留

**技术验收标准：**
- PATCH `/ideaFlow/api/v1/tasks/:id` 正常工作
- DELETE `/ideaFlow/api/v1/tasks/:id` 正常工作

---

**Epic 4 Stories 完成：6 个 Stories，覆盖 FR19, FR20, FR21, FR22, FR23, FR24, FR25, FR26**

---

## Epic 5 Stories: 搜索与筛选

### Story 5.1: 全局搜索

As a **用户**,
I want **快速搜索想法和任务**,
So that **找到需要的内容**.

**FRs 覆盖**：FR40

**Acceptance Criteria:**

**Given** 用户在任何页面
**When** 按下 ⌘+K 快捷键
**Then** 弹出全局搜索面板

**Given** 搜索面板打开
**When** 输入搜索关键词
**Then** 实时显示匹配结果（包含想法和任务）
**And** 结果按相关性排序

**Given** 搜索结果
**When** 点击某个结果
**Then** 跳转到对应的想法/任务详情

**Given** 搜索结果
**When** 无匹配
**Then** 显示「未找到相关内容」

**技术验收标准：**
- PostgreSQL 全文搜索实现
- GET `/ideaFlow/api/v1/search?q=` API
- 搜索响应时间 < 300ms

---

### Story 5.2: 列表筛选与排序

As a **用户**,
I want **按条件筛选和排序列表**,
So that **更高效地浏览内容**.

**FRs 覆盖**：FR41

**Acceptance Criteria:**

**Given** 用户在想法/任务列表
**When** 展开筛选面板
**Then** 显示筛选选项（时间范围、状态、分类）

**Given** 筛选条件设置
**When** 应用筛选
**Then** 列表即时更新显示筛选结果
**And** 显示当前筛选条件标签

**Given** 有筛选条件
**When** 点击「清除筛选」
**Then** 恢复显示全部内容

**Given** 列表
**When** 选择排序方式
**Then** 支持按创建时间、更新时间、截止日期排序

**技术验收标准：**
- 筛选器组件实现
- API 支持筛选和排序参数

---

**Epic 5 Stories 完成：2 个 Stories，覆盖 FR40, FR41**

---

## Epic 6 Stories: 智能提醒与记忆恢复（Phase 2）

### Story 6.1: 沉底点子识别

As a **系统**,
I want **识别 7天+ 未操作的想法**,
So that **帮助用户发现被遗忘的点子**.

**FRs 覆盖**：FR28

**Acceptance Criteria:**

**Given** 想法创建或最后更新时间
**When** 超过 7 天未操作
**Then** 系统标记为「沉底点子」

**Given** 沉底点子
**When** 在想法列表中
**Then** 显示特殊标记（💤 图标）

**Given** 定时任务运行
**When** 每日凌晨执行
**Then** 更新沉底点子状态

**技术验收标准：**
- 定时任务（Cron）配置
- 沉底状态字段和查询

---

### Story 6.2: 沉底提醒通知

As a **用户**,
I want **收到沉底点子的提醒**,
So that **回顾被遗忘的想法**.

**FRs 覆盖**：FR29

**Acceptance Criteria:**

**Given** 用户有沉底点子
**When** 定时任务检测到
**Then** 创建应用内通知

**Given** 通知
**When** 用户查看
**Then** 显示「你有 N 个想法放了超过 7 天，要不要看看？」

**Given** 用户点击通知
**When** 进入详情
**Then** 跳转到沉底点子列表

**技术验收标准：**
- 通知服务实现
- Prisma Notification 表

---

### Story 6.3: 记忆恢复卡片

As a **用户**,
I want **打开旧想法时看到记忆恢复卡片**,
So that **回想起当时记录的原因**.

**FRs 覆盖**：FR30

**Acceptance Criteria:**

**Given** 用户打开 7天+ 的想法
**When** 想法详情加载
**Then** 显示记忆恢复卡片（突出展示）

**Given** 记忆恢复卡片
**When** 展示内容
**Then** 包含：创建时间（「2周前」格式）、来源备注、参考链接

**Given** 记忆恢复卡片
**When** 用户交互后
**Then** 显示反馈按钮「这个想法帮到你了吗？」

**技术验收标准：**
- MemoryRecoveryCard 组件实现
- 时间格式化（相对时间）

---

**Epic 6 Stories 完成：3 个 Stories，覆盖 FR28, FR29, FR30**

---

## Epic 7 Stories: 公开分享与视图切换（Phase 2）

### Story 7.1: 公开/私密视图切换

As a **用户**,
I want **切换公开/私密视图**,
So that **分享时呈现干净的内容**.

**FRs 覆盖**：FR31

**Acceptance Criteria:**

**Given** 用户在画布或想法详情
**When** 点击「私密/公开」切换按钮
**Then** 视图模式切换

**Given** 公开视图
**When** 查看内容
**Then** 隐藏私密标注和草稿内容
**And** 显示整洁的展示版本

**技术验收标准：**
- 内容可见性字段
- 视图切换组件

---

### Story 7.2: 分享链接生成

As a **用户**,
I want **生成干净的公开分享链接**,
So that **与他人分享我的想法**.

**FRs 覆盖**：FR32

**Acceptance Criteria:**

**Given** 用户在画布或想法详情
**When** 点击「分享」按钮
**Then** 弹出分享设置面板

**Given** 分享设置面板
**When** 选择「生成链接」
**Then** 创建唯一的分享链接
**And** 复制到剪贴板
**And** 显示「链接已复制」提示

**Given** 访问者打开分享链接
**When** 链接有效
**Then** 显示公开视图内容

**技术验收标准：**
- 分享 Token 生成
- 公开访问页面

---

### Story 7.3: 通知中心

As a **用户**,
I want **查看系统通知列表**,
So that **了解重要事件**.

**FRs 覆盖**：FR43

**Acceptance Criteria:**

**Given** 用户在任何页面
**When** 点击通知图标
**Then** 弹出通知列表面板

**Given** 通知列表
**When** 有未读通知
**Then** 图标显示红点标记

**Given** 通知列表
**When** 点击某条通知
**Then** 标记为已读
**And** 跳转到相关内容

**技术验收标准：**
- GET `/ideaFlow/api/v1/notifications` API
- 通知面板组件

---

### Story 7.4: 通知偏好设置

As a **用户**,
I want **设置通知偏好**,
So that **控制我收到的通知类型**.

**FRs 覆盖**：FR44

**Acceptance Criteria:**

**Given** 用户在设置页面
**When** 进入通知设置
**Then** 显示通知类型开关列表

**Given** 通知设置
**When** 关闭某类通知
**Then** 不再收到该类通知

**技术验收标准：**
- 用户偏好设置存储
- 通知发送前检查偏好

---

### Story 7.5: 第三方账号登录

As a **用户**,
I want **使用微信或 Apple ID 登录**,
So that **更便捷地登录系统**.

**FRs 覆盖**：FR46

**Acceptance Criteria:**

**Given** 用户在登录页面
**When** 点击「微信登录」
**Then** 跳转微信授权页面

**Given** 微信授权成功
**When** 回调返回
**Then** 如已绑定账号，直接登录
**And** 如未绑定，创建新账号并登录

**Given** 用户在登录页面
**When** 点击「Apple ID 登录」
**Then** 触发 Apple Sign In 流程

**技术验收标准：**
- OAuth 2.0 集成
- 第三方账号绑定表

---

**Epic 7 Stories 完成：5 个 Stories，覆盖 FR31, FR32, FR43, FR44, FR46**

---

## Epic 8 Stories: 团队协作（Phase 3）

### Story 8.1: 画布分享链接

As a **用户**,
I want **通过链接分享画布给他人**,
So that **邀请他人查看或协作**.

**FRs 覆盖**：FR33

**Acceptance Criteria:**

**Given** 用户在画布页面
**When** 点击「分享」按钮
**Then** 生成协作分享链接

**Given** 分享链接
**When** 设置权限
**Then** 可选择「仅查看」或「可编辑」

**Given** 访问者打开链接
**When** 链接有效
**Then** 可以查看画布内容

**技术验收标准：**
- 分享权限模型
- 协作链接访问验证

---

### Story 8.2: 协作者注册加入

As a **受邀者**,
I want **通过链接注册并加入团队**,
So that **参与画布协作**.

**FRs 覆盖**：FR34

**Acceptance Criteria:**

**Given** 受邀者打开协作链接
**When** 未登录
**Then** 显示注册/登录页面

**Given** 受邀者注册成功
**When** 完成注册
**Then** 自动加入团队
**And** 跳转到共享画布

**技术验收标准：**
- 团队成员关系表
- 邀请链接验证

---

### Story 8.3: @成员分配任务

As a **用户**,
I want **@成员分配任务**,
So that **明确任务负责人**.

**FRs 覆盖**：FR35

**Acceptance Criteria:**

**Given** 用户在任务详情
**When** 输入 @ 符号
**Then** 显示团队成员列表

**Given** 选择成员
**When** 点击成员
**Then** 任务分配给该成员
**And** 成员收到通知

**技术验收标准：**
- 成员选择器组件
- 任务分配通知

---

### Story 8.4: 团队查看共享画布

As a **团队成员**,
I want **查看共享画布**,
So that **了解项目进展**.

**FRs 覆盖**：FR36

**Acceptance Criteria:**

**Given** 团队成员登录
**When** 查看画布列表
**Then** 显示有权限访问的画布（个人 + 共享）

**Given** 共享画布
**When** 打开查看
**Then** 可以看到完整内容

**技术验收标准：**
- 画布权限查询
- 共享画布标记

---

### Story 8.5: 团队画布协作编辑

As a **团队成员**,
I want **在画布上添加内容**,
So that **共同完善想法**.

**FRs 覆盖**：FR37

**Acceptance Criteria:**

**Given** 团队成员有编辑权限
**When** 在画布上添加节点
**Then** 节点创建成功
**And** 标记创建者

**Given** 多人同时编辑
**When** 刷新页面
**Then** 看到其他人的更改（刷新同步）

**技术验收标准：**
- 节点创建者字段
- 刷新同步机制

---

**Epic 8 Stories 完成：5 个 Stories，覆盖 FR33, FR34, FR35, FR36, FR37**

---

## 📊 Stories 统计汇总

| Epic | Stories 数量 | FRs 覆盖 |
|------|-------------|----------|
| Epic 1: 用户认证与基础架构 | 6 | FR1, FR2, FR3, FR4, FR42, FR45 |
| Epic 2: 想法捕捉与管理 | 5 | FR5, FR6, FR7, FR8, FR9, FR10, FR27 |
| Epic 3: 自由画布体验 | 6 | FR11-18, FR38, FR39 |
| Epic 4: 任务管理与执行 | 6 | FR19-26 |
| Epic 5: 搜索与筛选 | 2 | FR40, FR41 |
| Epic 6: 智能提醒（Phase 2）| 3 | FR28, FR29, FR30 |
| Epic 7: 分享与通知（Phase 2）| 5 | FR31, FR32, FR43, FR44, FR46 |
| Epic 8: 团队协作（Phase 3）| 5 | FR33, FR34, FR35, FR36, FR37 |
| **合计** | **38** | **全部 46 个 FR** |
