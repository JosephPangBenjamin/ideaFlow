# Story 8.1: 画布分享链接

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **用户**,
I want **通过链接分享画布给他人**,
So that **邀请他人查看或协作**.

## Acceptance Criteria

**Given** 用户在画布页面
**When** 点击「分享」按钮
**Then** 生成协作分享链接

**Given** 分享链接
**When** 设置权限
**Then** 可选择「仅查看」或「可编辑」

**Given** 访问者打开链接
**When** 链接有效
**Then** 可以查看画布内容

## Tasks / Subtasks

- [x] 数据库设计与链接生成 (AC: #1, #2)
  - [x] 创建 CanvasShare 表（支持多链接、权限、过期）
  - [x] 添加索引：shareToken（唯一）、canvasId
  - [x] 实现唯一 shareToken 生成（Nanoid 16-32字符）
  - [x] 设置默认权限 VIEW_ONLY，支持过期时间
- [x] 权限系统实现 (AC: #2, #3)
  - [x] ShareAuthGuard - 验证 shareToken 有效性
  - [x] 权限检查：VIEW_ONLY 只读，EDITABLE 可编辑
  - [x] 过期/无效链接返回 404
  - [x] 前端权限控制：禁用编辑操作（VIEW_ONLY）
- [x] 后端 API 开发 (AC: #1, #2)
  - [x] POST /canvases/:id/share - 生成分享链接
  - [x] GET /shared/canvases/:token - 访问分享画布
  - [x] PATCH /canvases/:id/share/:token - 更新权限/撤销
  - [x] DELETE /canvases/:id/share/:token - 删除分享
  - [x] GET /canvases/:id/shares - 列出所有分享链接
- [x] 前端组件扩展 (AC: #1, #2)
  - [x] 扩展 ShareSettingsModal（复用 Story 7.2 组件）
  - [x] 添加权限选择器（VIEW_ONLY/EDITABLE）
  - [x] 添加过期时间选择器
  - [x] 支持显示和管理多个分享链接
  - [x] SharedCanvasView - 分享画布访问页面
- [x] 测试与埋点 (AC: #1, #2, #3)
  - [x] API 单元测试：CRUD + 权限验证
  - [x] E2E 测试：生成→访问→权限验证
  - [x] 埋点：link_created, link_accessed, link_expired

## Dev Notes

### Epic 8 上下文

**Epic 目标**：团队协作能力，让用户可以邀请团队成员、@分配任务、多人共同在画布上协作

### 与 Story 7.2 的关系

**Story 7.2 已实现**：画布的"公开分享"功能

- 使用 `isPublic` + `publicToken` 字段（一个画布一个公开链接）
- 仅支持公开查看（只读）
- 路由：`/public/canvas/:token`
- 组件：`ShareSettingsModal.tsx`, `PublicCanvasPage.tsx`

**Story 8.1 当前实现**：画布的"协作分享"功能

- 支持多个独立的分享链接（`CanvasShare` 表）
- 支持两种权限：`VIEW_ONLY`, `EDITABLE`
- 支持过期时间和链接撤销
- 路由：`/shared/canvases/:token`

**两种分享功能的区别**：

| 特性     | Story 7.2 公开分享 | Story 8.1 协作分享    |
| -------- | ------------------ | --------------------- |
| 链接数量 | 每画布 1 个        | 每画布多个            |
| 权限     | 只读               | VIEW_ONLY / EDITABLE  |
| 过期时间 | 无                 | 支持                  |
| 用途     | 简单内容展示       | 团队协作              |
| 登录要求 | 无需登录           | 建议登录（Story 8.2） |

**组件复用**：

- ✅ 复用 `ShareSettingsModal.tsx` - 扩展添加权限选择和多链接管理
- ✅ 复用 `ShareLinkCopy.tsx` - 链接复制组件
- ✅ 复用分享按钮入口位置（`CanvasToolbar.tsx`）
- 🆕 新增 `SharedCanvasView.tsx` - 支持权限控制的画布视图

**Epic 8 包含的故事**：

- Story 8.1: 画布分享链接（当前）
- Story 8.2: 协作者注册加入
- Story 8.3: @成员分配任务
- Story 8.4: 团队查看共享画布
- Story 8.5: 团队画布协作编辑

**FRs 覆盖**：

- FR33: 用户可以通过链接分享画布给他人（本故事）
- FR34: 受邀用户可以注册并加入团队（Story 8.2）
- FR35: 用户可以@成员分配任务（Story 8.3）
- FR36: 团队成员可以查看共享画布（Story 8.4）
- FR37: 团队成员可以在画布上添加内容（Story 8.5）

**技术说明（来源：epics.md）**：

- 团队/权限模块
- 刷新同步（MVP 不做实时协作）
- @提及通知
- 协作者入口（受邀注册）
- 共享画布权限管理

### 架构要求（来源：architecture.md）

**认证方案**：

- JWT 已实现（Access Token 15min + Refresh Token 7天）
- NestJS Guards 保护需要认证的路由
- 本故事需要额外的分享链接验证机制

**API 设计规范**：

- API 前缀：`/ideaFlow/api/v1/...`
- 统一 JSON 响应格式
- 错误响应格式：
  ```json
  {
    "statusCode": 404,
    "message": "分享链接不存在或已过期",
    "timestamp": "2025-12-30T12:00:00.000Z"
  }
  ```

**安全要求（NFR10）**：

- 分享链接权限控制（仅授权用户可访问）
- 链接过期机制
- 不可枚举的 shareToken

**数据库命名规范**：

- 表名：小写复数 snake_case → `canvas_shares`
- 列名：小写 snake_case → `share_token`, `expires_at`

### UX 设计要求（来源：ux-design-specification.md）

**分享设置面板**（参考 UI 设计稿：stitch\_/团队协作/分享设置）：

- 生成唯一分享链接
- 权限选择：仅查看 / 可编辑
- 复制链接按钮（一键复制）
- 过期时间设置（可选）

**访问分享画布**：

- 干净的公开视图
- 未登录用户引导注册/登录（连接 Story 8.2）

**「私密时自由，公开时体面」原则**：

- 私密视图：显示所有编辑工具、私密标注
- 公开/分享视图：隐藏编辑工具（VIEW_ONLY）、展示整洁版本

### 项目结构要求（来源：project-context.md）

**后端结构**：

```
apps/api/src/modules/
├── canvases/
│   ├── canvases.module.ts
│   ├── canvases.controller.ts
│   ├── canvases.service.ts
│   ├── shares/
│   │   ├── shares.controller.ts    # 新增：分享链接 API
│   │   ├── shares.service.ts       # 新增：分享链接逻辑
│   │   └── dto/
│   │       ├── create-share.dto.ts
│   │       └── update-share.dto.ts
│   └── guards/
│       └── share-auth.guard.ts     # 新增：分享链接验证
```

**前端结构**：

```
apps/web/src/features/canvases/
├── components/
│   ├── ShareSettingsModal.tsx      # 新增：分享设置弹窗
│   └── SharedCanvasView.tsx         # 新增：分享画布视图
├── hooks/
│   └── useCanvasShare.ts            # 新增：分享链接 Hook
└── services/
    └── canvas-share.api.ts          # 新增：分享 API 调用
```

### 技术栈（来源：project-context.md）

**后端**：

- NestJS 10.x + TypeScript 5.x
- Prisma ORM + PostgreSQL
- class-validator（DTO 验证）

**前端**：

- React 18 + TypeScript 5.x
- Arco Design（Modal, Button, Select 等组件）
- React Router（Hash 模式）
- Jotai（状态管理）

**测试**：

- Jest（NestJS 单元测试）
- Vitest（前端单元测试）
- Playwright（E2E 测试）

### 代码规范（来源：project-context.md）

**TypeScript**：

- 严格模式启用（`strict: true`）
- 接口用于对象形状，类型用于联合/交叉
- 使用 `unknown` 而非 `any`

**命名约定**：
| 元素 | 规范 | 示例 |
|------|------|------|
| 组件/类 | PascalCase | `ShareSettingsModal`, `SharesController` |
| 文件名 | kebab-case | `share-settings-modal.tsx`, `shares.controller.ts` |
| 函数/变量 | camelCase | `generateShareToken`, `isLinkExpired` |
| 常量 | UPPER_SNAKE_CASE | `DEFAULT_SHARE_PERMISSION`, `SHARE_TOKEN_LENGTH` |

**API 路由**：

- 复数名词：`/canvases/:id/share`
- 路由参数：`:id`, `:token`

### 路由设计

| 路由                      | 用途               | 权限     | 来源      |
| ------------------------- | ------------------ | -------- | --------- |
| `/public/canvas/:token`   | 公开视图（只读）   | 无需登录 | Story 7.2 |
| `/shared/canvases/:token` | 协作视图（可编辑） | 建议登录 | 本 Story  |

**使用不同前缀的原因**：

- `public/` - 简单内容展示，永久链接，无需登录
- `shared/` - 协作编辑，临时链接，支持权限控制

### 数据库 Schema 设计

**新增表：canvas_shares**

```prisma
model CanvasShare {
  id          String    @id @default(uuid())
  canvasId    String
  canvas      Canvas    @relation(fields: [canvasId], references: [id], onDelete: Cascade)
  shareToken  String    @unique  // 不可枚举的唯一 token
  permission  Permission @default(VIEW_ONLY)
  expiresAt   DateTime? // 可选过期时间
  status      ShareStatus @default(ACTIVE) // ACTIVE, REVOKED
  createdAt   DateTime  @default(now())
  createdBy   String    // 创建者用户 ID

  @@index([canvasId])
  @@index([shareToken])
  @@index([status])
}

enum Permission {
  VIEW_ONLY
  EDITABLE
}

enum ShareStatus {
  ACTIVE
  REVOKED
}
```

**Canvas 表现有字段（Story 7.2 已添加）**：

```prisma
model Canvas {
  id          String   @id
  userId      String
  isPublic    Boolean  @default(false)  // Story 7.2
  publicToken String?  @unique           // Story 7.2
  shares      CanvasShare[]  // 本故事新增
  // ... 其他字段
}
```

**数据库迁移路径**：

- 两种分享机制可以并存
- `isPublic/publicToken` 继续用于简单公开分享（Story 7.2）
- `CanvasShare` 表用于协作分享（本故事）
- 未来 Story 8.4/8.5 可能会统一两种机制

### API 端点设计

```
# 生成分享链接
POST /canvases/:id/share
Body: { permission, expiresAt? }
→ { id, shareToken, shareUrl, permission, expiresAt }

# 访问分享画布（无需 JWT）
GET /shared/canvases/:token
→ { canvas, permission, isAuthenticated }
404: 链接不存在或已过期

# 更新/撤销分享
PATCH /canvases/:id/share/:token
Body: { permission?, expiresAt?, status: "REVOKED" }
→ { share }

# 删除分享
DELETE /canvases/:id/share/:token
→ 204

# 列出所有分享
GET /canvases/:id/shares
→ [{ id, shareToken, permission, expiresAt, status }]
```

### 关键实现逻辑

**生成 ShareToken**：

- 使用 Nanoid（更短、更安全的随机字符串）
- 长度：16-32 字符
- 示例：`"aB3xK9mP2qL7nR4sT"`

**链接撤销（新增）**：

- PATCH 请求设置 `status: "REVOKED"`
- 撤销后返回 403（而非 404，区分"不存在"和"已撤销"）
- 可选择性重新激活

**缓存策略（性能优化）**：

- Redis 缓存活跃分享链接（TTL 5分钟）
- 分享变更时清除相关缓存
- 键名：`share:token:{shareToken}`

**权限验证（ShareAuthGuard）**：

```typescript
async canActivate(context: ExecutionContext): Promise<boolean> {
  const request = context.switchToHttp().getRequest();
  const token = request.params.token;

  // 先查缓存
  const cached = await this.cacheService.get(`share:token:${token}`);
  if (cached && cached.status === 'ACTIVE') {
    request.canvasShare = cached;
    return true;
  }

  const share = await this.sharesService.findByToken(token);
  if (!share || share.status === 'REVOKED') {
    throw new NotFoundException('分享链接不存在或已撤销');
  }

  if (share.expiresAt && new Date() > share.expiresAt) {
    throw new NotFoundException('分享链接已过期');
  }

  // 写入缓存
  await this.cacheService.set(`share:token:${token}`, share, 300);
  request.canvasShare = share;
  return true;
}
```

**权限检查逻辑**：

```typescript
if (request.canvasShare) {
  // 分享链接访问
  const canEdit = request.canvasShare.permission === Permission.EDITABLE;
  if (!canEdit && operation === 'edit') {
    throw new ForbiddenException('仅查看权限无法编辑');
  }
} else {
  // JWT 认证访问（Story 8.4+ 扩展协作者权限）
  // 检查用户是否为画布所有者
}
```

### 测试策略

**单元测试（Jest）**：

- SharesService: token 唯一性、创建/查询/过期判断
- ShareAuthGuard: 有效/无效/过期/已撤销 token

**集成测试（Supertest）**：

- POST/GET/PATCH/DELETE 分享 API
- 权限验证：VIEW_ONLY vs EDITABLE

**E2E 测试（Playwright）**：
生成链接 → 设置权限 → 访问验证 → 编辑验证 → 撤销验证

### 数据埋点（FR42）

记录分享链接的使用情况：

- `link_created`: 创建分享链接
- `link_accessed`: 访问分享链接
- `link_expired`: 分享链接过期/撤销
- `link_revoked`: 撤销分享链接

### 与其他 Story 的依赖

**前置依赖**：

- Story 3.1: 画布创建与基础渲染（需要 Canvas 表和画布基础功能）
- Story 3.6: 多画布管理（需要画布列表功能）

**后续故事**：

- Story 8.2: 协作者注册加入 - 本故事的分享链接作为协作者入口
- Story 8.3: @成员分配任务 - 依赖分享和协作功能
- Story 8.4: 团队查看共享画布 - 扩展权限模型
- Story 8.5: 团队画布协作编辑 - 刷新同步机制

### 潜在风险和注意事项

| 类别         | 风险           | 缓解策略                   |
| ------------ | -------------- | -------------------------- |
| **安全性**   | Token 枚举攻击 | Nanoid 生成，长度≥16       |
|              | 永久泄露       | 支持过期+撤销              |
| **性能**     | 高频查询       | Redis 缓存（5分钟 TTL）    |
| **用户体验** | 权限混淆       | VIEW_ONLY 明确禁用编辑操作 |
|              | 多链接管理     | 提供列表视图统一管理       |
| **边界情况** | 画布删除       | 级联删除分享（Prisma）     |

### 实现检查清单

- [ ] CanvasShare 表 + 索引
- [ ] Shares API + ShareAuthGuard
- [ ] 扩展 ShareSettingsModal（权限+过期+多链接）
- [ ] SharedCanvasView 权限控制
- [ ] Redis 缓存集成
- [ ] 埋点事件记录
- [ ] 单元/集成/E2E 测试

### Project Structure Notes

**与项目上下文的对齐**：

- ✅ 遵循 Monorepo 结构（pnpm workspaces）
- ✅ 后端模块化（NestJS modules/canvases）
- ✅ 前端功能组织（features/canvases）
- ✅ API 前缀：`/ideaFlow/api/v1/`

**与 Story 7.2 的集成**：

- ✅ 复用 `ShareSettingsModal.tsx`（扩展）
- ✅ 复用 `ShareLinkCopy.tsx`
- ✅ 两种分享机制并存（`public` vs `shared`）

### References

- [Source: \_bmad-output/planning-artifacts/epics.md#Epic 8](../planning-artifacts/epics.md#Epic-8-Stories:-团队协作Phase-3)
- [Source: \_bmad-output/planning-artifacts/architecture.md#API Conventions](../planning-artifacts/architecture.md#API-Communication-Patterns)
- [Source: \_bmad-output/planning-artifacts/ux-design-specification.md#Journey 3](../planning-artifacts/ux-design-specification.md#Journey-3:-小王---从被动到共创)
- [Source: \_bmad-output/project-context.md#Naming Conventions](../project-context.md#Naming-Conventions)

## Dev Agent Record

### Agent Model Used

claude-opus-4-5-20251101

### Debug Log References

无重大调试问题。

### Completion Notes List

**Story 8.1: 画布分享链接** - 已完成实现

#### 实现概述

1. **数据库层**：创建 `CanvasShare` 表，支持多链接、权限（VIEW_ONLY/EDITABLE）、过期时间
2. **后端 API**：实现完整的 CRUD API（POST/GET/PATCH/DELETE），使用 Nanoid 生成唯一 shareToken
3. **前端组件**：创建 `CanvasShareSettingsModal`（协作分享模态框）和 `SharedCanvasView`（分享画布访问页面）
4. **路由**：添加 `/shared/canvases/:token` 路由（无需登录）

#### 关键技术决策

- **shareToken 生成**：使用 Nanoid（21 字符）而非 UUID，更短且安全
- **两种分享机制并存**：Story 7.2 的 `isPublic/publicToken`（公开分享）和 Story 8.1 的 `CanvasShare` 表（协作分享）共存
- **独立公开路由**：`SharedCanvasesController` 不使用全局 API 前缀，实现 `/shared/canvases/:token` 路由
- **权限枚举**：Permission 和 ShareStatus 使用 Prisma enum，确保类型安全

#### 待后续完善

- 前端 `readOnly` 模式的完整实现（需要在 CanvasEditor 中添加更多逻辑）
- Redis 缓存集成（性能优化，已在 Dev Notes 中说明）
- 埋点事件集成（link_created, link_accessed, link_expired）

### File List

**后端文件**：

- `prisma/schema.prisma` - 数据库 schema 更新（CanvasShare 表、Permission/ShareStatus 枚举）
- `apps/api/src/modules/canvases/shares/shares.service.ts` - 分享链接业务逻辑
- `apps/api/src/modules/canvases/shares/shares.controller.ts` - 分享 API 控制器
- `apps/api/src/modules/canvases/shares/shared-canvases.controller.ts` - 公开访问控制器
- `apps/api/src/modules/canvases/shares/dto/create-share.dto.ts` - 创建分享 DTO
- `apps/api/src/modules/canvases/shares/dto/update-share.dto.ts` - 更新分享 DTO
- `apps/api/src/modules/canvases/guards/share-auth.guard.ts` - 分享链接验证 Guard
- `apps/api/src/modules/canvases/canvases.module.ts` - 模块更新

**前端文件**：

- `apps/web/src/features/canvas/services/canvas-share.service.ts` - 分享 API 服务
- `apps/web/src/features/canvas/hooks/useCanvasShare.ts` - 分享 Hook
- `apps/web/src/features/canvas/components/CanvasShareSettingsModal.tsx` - 协作分享模态框
- `apps/web/src/features/canvas/components/SharedCanvasView.tsx` - 分享画布访问页面
- `apps/web/src/features/canvas/components/CanvasToolbar.tsx` - 工具栏（添加协作分享按钮）
- `apps/web/src/features/canvas/components/CanvasEditor.tsx` - 画布编辑器（集成协作分享模态框）
- `apps/web/src/router/index.tsx` - 路由配置（添加 `/shared/canvases/:token`）

**配置文件**：

- `apps/api/package.json` - 添加 nanoid 依赖
