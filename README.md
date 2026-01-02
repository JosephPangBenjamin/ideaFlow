# IdeaFlow

> 捕捉想法、画布组织、转化任务的生产力工具

## 技术栈

- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS + Arco Design
- **Backend**: NestJS + TypeScript + Prisma + PostgreSQL  
- **Canvas**: Konva.js
- **State**: Jotai
- **Testing**: Vitest + Jest + Playwright

## 快速开始

### 环境要求

- Node.js 20+
- pnpm 9+
- Docker (用于本地 PostgreSQL)

### 安装

```bash
# 克隆仓库
git clone https://github.com/your-repo/ideaflow.git
cd ideaflow

# 安装依赖
pnpm install

# 复制环境变量
cp .env.example .env

# 启动数据库
pnpm docker:up

# 初始化数据库
pnpm db:push

# 启动开发服务器
pnpm dev
```

### 访问

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000/ideaFlow/api/v1/health

## 项目结构

```
ideaFlow/
├── apps/
│   ├── web/          # React 前端
│   └── api/          # NestJS 后端
├── packages/
│   └── shared/       # 共享类型定义
├── prisma/           # 数据库 Schema
└── docker-compose.yml
```

## 开发命令

```bash
pnpm dev          # 启动开发服务器（前后端并行）
pnpm build        # 构建生产版本
pnpm test         # 运行所有测试
pnpm lint         # 代码检查
pnpm format       # 代码格式化
pnpm docker:up    # 启动 Docker 服务
pnpm docker:down  # 停止 Docker 服务
```

## 许可证

MIT
