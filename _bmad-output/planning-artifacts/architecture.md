---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - planning-artifacts/prd.md
  - planning-artifacts/product-brief-ideaFlow-2025-12-28.md
  - planning-artifacts/ux-design-specification.md
workflowType: 'architecture'
project_name: 'ideaFlow'
user_name: 'Offer'
date: '2025-12-30'
---

# Architecture Decision Document - IdeaFlow

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

---

## Project Context Analysis

### Requirements Overview

**Functional Requirements (46个)：**

| 模块 | 数量 | Phase | 架构影响 |
|------|------|-------|---------|
| 用户身份管理 | 4 | 1 | 认证模块 |
| 想法捕捉 | 6 | 1 | Idea CRUD |
| 自由画布 | 10 | 1 | Canvas 渲染引擎 |
| 任务管理 | 8 | 1 | Task CRUD + 状态机 |
| 搜索与筛选 | 2 | 1 | 搜索服务 |
| 上下文与记忆 | 4 | 1-2 | 上下文采集 + AI 提醒 |
| 视图与展示 | 2 | 2 | 公开/私密视图 |
| 通知功能 | 2 | 2 | 通知服务 |
| 团队协作 | 5 | 3 | 团队/权限模块 |
| 数据埋点 | 1 | 1 | 埋点服务 |

**Non-Functional Requirements (26个)：**

| 类别 | 关键指标 | 架构影响 |
|------|---------|---------|
| **性能** | 首屏 <2s，画布 60fps，API <300ms | CDN + 优化渲染 + 数据库索引 |
| **安全** | HTTPS，JWT，bcrypt | 认证中间件 + 加密层 |
| **可靠性** | 99.5% uptime，自动保存 | 高可用部署 + 本地缓存 |
| **兼容性** | Chrome/Safari/Firefox | 浏览器兼容测试 |

### Scale & Complexity

| 维度 | 评估 |
|------|------|
| **项目复杂度** | Medium-High |
| **技术领域** | Full-Stack Web App |
| **实时需求** | MVP 刷新同步，V2.0 WebSocket |
| **多租户** | Phase 3 团队协作 |
| **预估架构组件** | ~15个模块 |

### Technical Constraints & Dependencies

**已确定的技术栈：**

| 层级 | 技术 | 选择理由 |
|------|------|---------|
| **Frontend** | React 18 + TypeScript | 组件化 + 类型安全 |
| **样式** | TailwindCSS | 响应式 + 高效开发 |
| **状态管理** | Jotai | 原子化，轻量 |
| **构建工具** | Vite | 快速 HMR |
| **路由** | React Router（Hash） | 简化部署 |
| **画布渲染** | Konva.js | Canvas 性能优秀 |
| **Backend** | NestJS + TypeScript | 模块化 + 类型一致 |
| **API 风格** | RESTful | 简单，易于理解 |

**约束条件：**
- 单画布 ≤100 节点
- MVP 不支持实时协作（刷新同步）
- Mobile 仅只读浏览

### Cross-Cutting Concerns Identified

| 关注点 | 影响范围 | 解决策略 |
|-------|---------|---------|
| **认证授权** | 全部模块 | JWT + Guard 中间件 |
| **自动保存** | 画布、想法、任务 | Debounce + 本地缓存 |
| **错误处理** | 全局统一 | 全局异常过滤器 |
| **Loading 状态** | 所有异步操作 | React Suspense / 状态原子 |
| **响应式适配** | 全部 UI | TailwindCSS 断点

---

## Starter Template Evaluation

### Primary Technology Domain

Full-Stack Web App（SPA 前端 + RESTful 后端）

### Project Structure

**Monorepo（pnpm workspaces）**

```
ideaFlow/
├── apps/
│   ├── web/          # React 前端
│   └── api/          # NestJS 后端
├── packages/
│   └── shared/       # 共享类型定义
├── package.json      # Workspaces 根配置
└── pnpm-workspace.yaml
```

### Selected Starter Configuration

**Frontend: Vite + React + TypeScript + TailwindCSS**

```bash
# 创建 Frontend 项目
npm create vite@latest apps/web -- --template react-ts
cd apps/web
pnpm install

# 安装核心依赖
pnpm add react-router-dom jotai react-konva konva axios @tanstack/react-query
pnpm add -D tailwindcss postcss autoprefixer vitest @testing-library/react
npx tailwindcss init -p
```

**Backend: NestJS + TypeScript**

```bash
# 创建 Backend 项目
nest new apps/api --strict --skip-git --package-manager pnpm
cd apps/api

# 安装核心依赖
pnpm add @nestjs/config @prisma/client class-validator class-transformer bcrypt
pnpm add -D prisma @types/bcrypt
```

### Development Standards

| 规范 | 要求 |
|------|------|
| **开发方法** | TDD（测试驱动开发） |
| **测试覆盖** | 核心功能 100% 覆盖 |
| **测试框架** | Vitest（前端）+ Jest（NestJS）+ Playwright（E2E） |
| **代码规范** | ESLint + Prettier + Husky |
| **埋点设计** | MVP 即包含数据追踪能力 |

### API Conventions

| 规范 | 要求 |
|------|------|
| **API 前缀** | `/ideaFlow/api/v1/...` |
| **路由示例** | `/ideaFlow/api/v1/auth/login` |
| **版本控制** | URL 路径版本号 (v1) |

### Database & ORM

| 技术 | 选择 | 理由 |
|------|------|------|
| **数据库** | PostgreSQL | 功能全面，生态成熟 |
| **ORM** | Prisma | 类型安全，Schema-first |
| **连接** | Prisma Client | 自动生成类型 |

### Architectural Decisions Provided by Starter

**Language & Runtime:**
- TypeScript 5.x（严格模式）
- Node.js 20 LTS
- pnpm 包管理器

**Styling Solution:**
- TailwindCSS 3.x
- PostCSS + Autoprefixer

**Build Tooling:**
- Vite（前端）
- NestJS CLI（后端）

**Testing Framework:**
- Vitest + Testing Library（前端单元测试）
- Jest（NestJS 单元测试）
- Playwright（E2E 测试）

**Code Organization:**
- 前端：按功能模块组织 (features/)
- 后端：NestJS 模块化 (modules/)

---

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- 认证方案：JWT + Refresh Token
- 数据库：PostgreSQL + Prisma
- 部署方案：Docker 自部署

**Important Decisions (Shape Architecture):**
- API 设计模式：RESTful + 统一格式
- 前后端分离架构

**Deferred Decisions (Post-MVP):**
- 实时协作（WebSocket）
- CDN 加速
- 水平扩展

### Authentication & Security

**认证方案：JWT + Refresh Token**

| 配置 | 值 |
|------|------|
| Access Token 过期 | 15 分钟 |
| Refresh Token 过期 | 7 天 |
| Refresh Token 存储 | HttpOnly Cookie |
| 密码加密 | bcrypt (cost=10) |
| 传输加密 | HTTPS/TLS 1.2+ |

**安全中间件：**
- NestJS Guards（认证守卫）
- class-validator（输入验证）
- Helmet（HTTP 安全头）
- Rate Limiting（限流）

### API & Communication Patterns

**API 设计规范：**

| 规范 | 要求 |
|------|------|
| 前缀 | `/ideaFlow/api/v1/...` |
| 版本控制 | URL 路径版本号 |
| 请求格式 | JSON |
| 响应格式 | 统一 JSON 结构 |

**错误响应格式：**
```json
{
  "statusCode": 400,
  "message": "验证失败",
  "errors": [
    { "field": "email", "message": "邮箱格式不正确" }
  ],
  "timestamp": "2025-12-30T12:00:00.000Z"
}
```

**分页响应格式：**
```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "pageSize": 20,
    "totalPages": 5
  }
}
```

### Infrastructure & Deployment

**部署方案：Docker 自部署**

| 组件 | 部署方式 |
|------|----------|
| **前端** | Nginx 静态文件 |
| **后端** | Docker 容器 |
| **数据库** | Docker PostgreSQL |
| **反向代理** | Nginx |

**服务器配置：**
- 2核 2G 云服务器
- PostgreSQL: ~512MB
- NestJS API: ~512MB
- Nginx: ~64MB
- 系统预留: ~900MB

**CI/CD：**
- GitHub Actions 自动部署
- SSH 部署到服务器
- Docker Compose 管理服务

### Decision Impact Analysis

**实现顺序：**
1. 项目初始化（Monorepo + 基础配置）
2. 数据库 Schema 设计（Prisma）
3. 认证模块（JWT）
4. 核心业务模块（Idea/Task/Canvas）
5. 前端界面开发
6. Docker 部署配置
7. CI/CD 管道

---

## Implementation Patterns & Consistency Rules

### Naming Patterns

**数据库命名：**
| 元素 | 规范 | 示例 |
|------|------|------|
| 表名 | 小写复数 snake_case | `users`, `canvas_nodes` |
| 列名 | 小写 snake_case | `user_id`, `created_at` |
| 外键 | `{表名单数}_id` | `user_id`, `canvas_id` |
| 索引 | `idx_{表}_{列}` | `idx_users_email` |

**API 命名：**
| 元素 | 规范 | 示例 |
|------|------|------|
| 路由 | 复数名词 | `/ideaFlow/api/v1/ideas` |
| 路由参数 | `:id` 格式 | `/ideas/:id` |
| 查询参数 | camelCase | `?pageSize=20&sortBy=createdAt` |

**代码命名：**
| 元素 | 规范 | 示例 |
|------|------|------|
| 组件/类 | PascalCase | `IdeaCard`, `UserService` |
| 文件名 | kebab-case | `idea-card.tsx`, `user.service.ts` |
| 函数/变量 | camelCase | `getUserById`, `isLoading` |
| 常量 | UPPER_SNAKE_CASE | `MAX_PAGE_SIZE`, `API_PREFIX` |

### Structure Patterns

**前端（React）：**
```
apps/web/src/
├── features/           # 按功能模块组织
│   ├── auth/          # 认证模块
│   ├── ideas/         # 想法模块
│   ├── tasks/         # 任务模块
│   └── canvas/        # 画布模块
├── components/        # 共享组件
├── hooks/             # 自定义 Hooks
├── stores/            # Jotai atoms
├── services/          # API 调用
└── utils/             # 工具函数
```

**后端（NestJS）：**
```
apps/api/src/
├── modules/           # 业务模块
│   ├── auth/          # 认证模块
│   ├── users/         # 用户模块
│   ├── ideas/         # 想法模块
│   ├── tasks/         # 任务模块
│   └── canvases/      # 画布模块
├── common/            # 共享代码
│   ├── guards/        # 守卫
│   ├── filters/       # 异常过滤器
│   ├── interceptors/  # 拦截器
│   └── decorators/    # 装饰器
└── config/            # 配置
```

### Format Patterns

**JSON 格式规范：**
| 规范 | 选择 |
|------|------|
| 字段命名 | camelCase |
| 日期格式 | ISO 8601 (`2025-12-30T15:00:00.000Z`) |
| 空值处理 | 返回 `null`，不省略字段 |
| 布尔值 | `true` / `false` |

### Testing Patterns

**测试文件位置（Co-located）：**
- `user.service.ts` → `user.service.spec.ts`
- E2E 测试 → `apps/api/test/` 目录

**TDD 流程：**
1. 先写失败测试（Red）
2. 写最小实现通过测试（Green）
3. 重构优化（Refactor）

### Error Handling Patterns

**前端错误处理：**
```typescript
try {
  await api.createIdea(data);
  toast.success('创建成功');
} catch (error) {
  toast.error(error.message || '操作失败');
}
```

**后端异常过滤器：**
- 统一捕获异常
- 格式化错误响应
- 记录日志

### Loading State Patterns

**Jotai 加载状态：**
```typescript
const loadingAtom = atom(false);
const dataAtom = atom<Data | null>(null);
```

**加载显示规则：**
- ≤ 300ms 不显示 loading
- 骨架屏模拟真实布局
- 按钮加载时禁用防重复提交

---

## Project Structure & Boundaries

### Complete Project Directory Structure

```
ideaFlow/
├── README.md
├── package.json                    # Monorepo 根配置
├── pnpm-workspace.yaml
├── .gitignore
├── .env.example
├── docker-compose.yml              # 本地开发 + 部署
├── .github/
│   └── workflows/
│       ├── ci.yml                  # CI 测试
│       └── deploy.yml              # CD 部署
│
├── apps/
│   ├── web/                        # React 前端
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.js
│   │   ├── tsconfig.json
│   │   ├── index.html
│   │   └── src/
│   │       ├── main.tsx
│   │       ├── App.tsx
│   │       ├── index.css
│   │       ├── features/
│   │       │   ├── auth/           # 认证模块
│   │       │   ├── ideas/          # 想法模块
│   │       │   ├── tasks/          # 任务模块
│   │       │   └── canvas/         # 画布模块
│   │       ├── components/         # 共享组件
│   │       ├── hooks/              # 自定义 Hooks
│   │       ├── stores/             # Jotai atoms
│   │       ├── services/           # API 调用
│   │       └── utils/              # 工具函数
│   │
│   └── api/                        # NestJS 后端
│       ├── package.json
│       ├── nest-cli.json
│       ├── tsconfig.json
│       ├── Dockerfile
│       └── src/
│           ├── main.ts
│           ├── app.module.ts
│           ├── config/             # 配置
│           ├── modules/
│           │   ├── auth/           # 认证模块
│           │   ├── users/          # 用户模块
│           │   ├── ideas/          # 想法模块
│           │   ├── tasks/          # 任务模块
│           │   ├── canvases/       # 画布模块
│           │   └── analytics/      # 埋点模块
│           └── common/
│               ├── guards/         # 守卫
│               ├── filters/        # 异常过滤器
│               ├── interceptors/   # 拦截器
│               └── decorators/     # 装饰器
│
├── packages/
│   └── shared/                     # 共享类型
│       ├── package.json
│       └── src/
│           ├── types/              # TypeScript 类型
│           └── constants/          # 共享常量
│
└── prisma/
    ├── schema.prisma               # 数据库 Schema
    └── migrations/                 # 迁移文件
```

### Architectural Boundaries

**API 边界：**
| 边界 | 说明 |
|------|------|
| `/ideaFlow/api/v1/auth/*` | 认证接口（无需登录） |
| `/ideaFlow/api/v1/*` | 业务接口（需 JWT） |

**组件边界：**
| 层级 | 职责 |
|------|------|
| `features/*` | 业务组件，可包含局部状态 |
| `components/` | 纯 UI 组件，无业务逻辑 |
| `stores/` | 全局状态，Jotai atoms |
| `services/` | API 调用，无状态 |

### Requirements to Structure Mapping

| 功能需求 | 前端位置 | 后端位置 |
|---------|---------|----------|
| 用户注册登录 | `features/auth/` | `modules/auth/` |
| 想法捕捉 | `features/ideas/` | `modules/ideas/` |
| 任务管理 | `features/tasks/` | `modules/tasks/` |
| 自由画布 | `features/canvas/` | `modules/canvases/` |
| 数据埋点 | `hooks/useAnalytics.ts` | `modules/analytics/` |

### Data Flow

```
用户操作 → React 组件 → Jotai Store → API Service
                                          ↓
                                    NestJS Controller
                                          ↓
                                    NestJS Service
                                          ↓
                                    Prisma Repository
                                          ↓
                                    PostgreSQL
```

---

## Architecture Validation Results

### Coherence Validation ✅

**决策兼容性：**
| 检查项 | 状态 |
|-------|------|
| 技术栈兼容 | ✅ React 18 + NestJS + PostgreSQL 完全兼容 |
| 版本一致 | ✅ TypeScript 5.x 前后端统一 |
| 模式对齐 | ✅ RESTful API + Jotai 状态管理符合 SPA 架构 |

**结构对齐：**
| 检查项 | 状态 |
|-------|------|
| Monorepo 结构 | ✅ pnpm workspaces 前后端分离 |
| 共享类型 | ✅ packages/shared 跨端复用 |
| 边界清晰 | ✅ features/components/services 职责分明 |

### Requirements Coverage Validation ✅

**功能需求覆盖（46个）：**
| 模块 | 覆盖状态 |
|------|----------|
| 用户身份管理 (4) | ✅ `modules/auth` + `modules/users` |
| 想法捕捉 (6) | ✅ `modules/ideas` |
| 自由画布 (10) | ✅ `modules/canvases` + Konva.js |
| 任务管理 (8) | ✅ `modules/tasks` |
| 搜索与筛选 (2) | ✅ PostgreSQL 全文搜索 |
| 上下文与记忆 (4) | ✅ JSONB 存储上下文 |
| 数据埋点 (1) | ✅ `modules/analytics` |

**非功能需求覆盖（26个）：**
| 类别 | 覆盖状态 |
|------|----------|
| 性能 (5) | ✅ Vite 构建优化 + Konva 60fps |
| 安全 (7) | ✅ JWT + bcrypt + Helmet |
| 可靠性 (5) | ✅ 自动保存 + Docker 部署 |
| 兼容性 (4) | ✅ TailwindCSS 响应式 |
| 用户反馈 (5) | ✅ Toast + Loading 状态 |

### Implementation Readiness Validation ✅

| 检查项 | 状态 |
|-------|------|
| 技术决策完整 | ✅ 所有关键技术已选定 |
| 项目结构完整 | ✅ 完整目录树已定义 |
| 命名规范完整 | ✅ 数据库/API/代码规范已确立 |
| 实现模式完整 | ✅ TDD/错误处理/加载状态 |

### Architecture Completeness Checklist

**✅ 需求分析**
- [x] 项目上下文分析
- [x] 规模与复杂度评估
- [x] 技术约束识别

**✅ 架构决策**
- [x] 技术栈完整指定
- [x] 认证方案（JWT）
- [x] 部署方案（Docker）

**✅ 实现模式**
- [x] 命名规范
- [x] 结构模式
- [x] 测试模式（TDD）

**✅ 项目结构**
- [x] 完整目录结构
- [x] 组件边界
- [x] 数据流

### Architecture Readiness Assessment

**整体状态：✅ 准备就绪**

**置信度：高**

**架构优势：**
- 前后端 TypeScript 统一，类型安全
- Monorepo 结构便于共享代码
- TDD 保证代码质量
- Docker 部署简化运维

**未来增强方向：**
- V2.0: WebSocket 实时协作
- V2.0: CDN 静态资源加速
- V2.0: 水平扩展支持

### Implementation Handoff

**AI Agent 指南：**
- 严格遵循所有架构决策
- 一致使用实现模式
- 尊重项目结构和边界
- 架构问题参考本文档

**首优先实现步骤：**
1. 初始化 Monorepo 结构
2. 配置 Prisma Schema
3. 实现认证模块
