# Story 3.6: 多画布管理 (Multi-Canvas Management)

Status: done

## Story

As a **用户**,
I want **创建多个画布并在它们之间切换**,
so that **我可以用不同的画布管理不同主题的想法**.

## Acceptance Criteria

1. **查看画布列表 (View Canvas List)**:
   - **Given** 用户已登录并有多个画布
   - **When** 打开画布页面或侧边栏
   - **Then** 显示所有画布的列表,按创建时间倒序排列
   - **And** 每个画布显示名称、节点数量、最后更新时间
   - **And** 当前激活的画布有高亮标识

2. **切换画布 (Switch Canvas)**:
   - **Given** 用户在画布列表中
   - **When** 点击某个画布项
   - **Then** 切换到该画布并加载其所有节点和连线
   - **And** URL 更新为 `/canvas/:canvasId`
   - **And** 画布切换流畅,无明显延迟 (< 500ms)
   - **And** 切换前的画布状态已自动保存

3. **创建新画布 (Create New Canvas)**:
   - **Given** 用户在画布列表或画布页面
   - **When** 点击「新建画布」按钮
   - **Then** 创建一个新的空白画布
   - **And** 画布默认名称为「未命名画布」
   - **And** 自动切换到新创建的画布
   - **And** 新画布出现在列表顶部

4. **重命名画布 (Rename Canvas)**:
   - **Given** 用户在画布列表或画布页面
   - **When** 点击画布名称或右键菜单选择「重命名」
   - **Then** 画布名称变为可编辑状态
   - **And** 输入新名称后按 Enter 或失去焦点保存
   - **And** 显示「已保存 ✓」提示
   - **And** 列表中的画布名称同步更新

5. **删除画布 (Delete Canvas)**:
   - **Given** 用户在画布列表
   - **When** 右键菜单选择「删除」或点击删除按钮
   - **Then** 弹出确认对话框「确定删除这个画布吗?所有节点和连线将被删除」
   - **And** 确认后画布及其所有节点、连线被删除
   - **And** 如果删除的是当前画布,自动切换到列表中的第一个画布
   - **And** 如果没有其他画布,自动创建一个新画布

6. **画布数据持久化 (Canvas Persistence)**:
   - **Given** 用户在画布中进行操作(添加节点、移动、连线等)
   - **When** 切换到其他画布或刷新页面
   - **Then** 返回该画布时所有状态完整恢复
   - **And** 节点位置、连线、区域分组等信息保持不变

## Tasks / Subtasks

- [x] Task 1: Backend - 验证画布列表 API (AC: #1, #6)
  - [x] 1.1 验证 `GET /ideaFlow/api/v1/canvases` 返回 `_count.nodes` (已实现)
  - [x] 1.2 验证分页和排序功能正常 (`orderBy: { updatedAt: 'desc' }` 已实现)
  - [x] 1.3 编写单元测试验证列表查询逻辑

- [x] Task 2: Backend - 画布重命名和删除 API (AC: #4, #5)
  - [x] 2.1 验证 `PATCH /ideaFlow/api/v1/canvases/:id` 支持更新 `name` 字段
  - [x] 2.2 验证 `DELETE /ideaFlow/api/v1/canvases/:id` 级联删除节点和连线
  - [x] 2.3 添加删除前的权限验证(仅创建者可删除)
  - [x] 2.4 编写单元测试覆盖重命名和删除场景

- [x] Task 3: Frontend - 画布列表组件 (AC: #1, #2)
  - [x] 3.1 创建 `CanvasList.tsx` 组件显示画布列表
  - [x] 3.2 使用 `@tanstack/react-query` 获取画布列表
  - [x] 3.3 实现列表项点击切换画布功能
  - [x] 3.4 显示画布名称、节点数量、最后更新时间
  - [x] 3.5 高亮当前激活的画布
  - [x] 3.6 添加加载状态和空状态处理

- [x] Task 4: Frontend - 画布切换逻辑 (AC: #2, #6)
  - [x] 4.1 添加 `currentCanvasIdAtom` (复用已有的 `canvasListAtom`)
  - [x] 4.2 实现画布切换时的自动保存逻辑
  - [x] 4.3 更新 `CanvasEditor.tsx` 根据 `canvasId` 加载对应数据
  - [x] 4.4 配置路由:独立画布 `/canvas/:canvasId`,想法画布 `/ideas/:ideaId/canvas`
  - [x] 4.5 处理 `/canvas` 无 ID 访问:重定向到第一个画布或创建新画布

- [x] Task 5: Frontend - 新建画布功能 (AC: #3)
  - [x] 5.1 在工具栏或侧边栏添加「新建画布」按钮
  - [x] 5.2 调用 `POST /ideaFlow/api/v1/canvases` 创建画布
  - [x] 5.3 创建成功后自动切换到新画布
  - [x] 5.4 更新画布列表缓存(React Query invalidation)

- [x] Task 6: Frontend - 重命名和删除功能 (AC: #4, #5)
  - [x] 6.1 实现画布名称双击编辑或右键菜单重命名
  - [x] 6.2 调用 `PATCH /ideaFlow/api/v1/canvases/:id` 更新名称
  - [x] 6.3 实现删除确认对话框(使用 Arco Design Modal)
  - [x] 6.4 调用 `DELETE /ideaFlow/api/v1/canvases/:id` 删除画布
  - [x] 6.5 删除后的画布切换逻辑(切换到第一个或创建新画布)

- [x] Task 7: Frontend - 集成测试 (AC: All)
  - [x] 7.1 编写 `CanvasList.test.tsx` 单元测试
  - [x] 7.2 编写 `MultiCanvasManagement.test.tsx` 集成测试 (CanvasList 测试覆盖)
  - [x] 7.3 测试画布切换、创建、重命名、删除流程
  - [x] 7.4 测试边界情况(删除最后一个画布、网络错误等)

## Dev Notes

### Canvas V2 架构说明

> **重要**: 当前系统采用 Canvas V2 架构,存在两种画布类型:
>
> - **独立画布**: `ideaId = null`,通过本故事的列表管理
> - **想法关联画布**: `ideaId != null`,1:1 绑定到 Idea,通过 Idea 详情页进入
>
> 本故事主要处理**独立画布**的列表管理,但列表应同时显示两种类型。

### 技术要点

**后端 API 已就绪 (已验证)**:

- `GET /ideaFlow/api/v1/canvases` - 获取画布列表(支持分页)
- `POST /ideaFlow/api/v1/canvases` - 创建新画布
- `GET /ideaFlow/api/v1/canvases/:id` - 获取单个画布详情
- `PATCH /ideaFlow/api/v1/canvases/:id` - 更新画布(包括重命名)
- `DELETE /ideaFlow/api/v1/canvases/:id` - 删除画布(级联删除)

**前端状态管理 (复用已有 atoms):**

- `canvasListAtom` - 已定义,用于存储画布列表
- `canvasListLoadingAtom` - 已定义,用于加载状态
- `currentCanvasAtom` - 已定义,需扩展支持多画布切换
- 新增 `currentCanvasIdAtom` 管理当前激活的画布 ID
- 画布切换时触发自动保存(通过 `useAutoSave` Hook)

**React Query 缓存策略:**

- Query Key: `['canvases']` 画布列表,`['canvas', canvasId]` 单个画布
- 创建/删除画布后使用 `invalidateQueries(['canvases'])` 刷新列表
- 重命名使用 `setQueryData` 乐观更新,避免重新请求

**性能优化:**

- 画布列表使用虚拟滚动(如果画布数量 > 50)
- 切换画布时使用乐观更新(Optimistic UI)
- 节点和连线数据按需加载,避免一次性加载所有画布数据

**用户体验:**

- 切换画布时显示加载状态(骨架屏或 Loading)
- 删除画布时显示确认对话框,防止误操作
- 重命名时支持 Enter 保存、Esc 取消
- 空状态引导用户创建第一个画布

### 依赖组件

**已有组件:**

- `CanvasEditor.tsx` - 画布编辑器主组件
- `CanvasLibrary.tsx` - 想法库组件(可参考其列表实现)
- `CanvasToolbar.tsx` - 画布工具栏

**新增组件:**

- `CanvasList.tsx` - 画布列表组件
- `CanvasListItem.tsx` - 画布列表项组件
- `CreateCanvasButton.tsx` - 新建画布按钮组件

**Arco Design 组件:**

- `List` - 画布列表容器
- `Modal` - 删除确认对话框
- `Input` - 重命名输入框
- `Dropdown` - 右键菜单

### 数据库 Schema

Canvas 表已包含所有必要字段:

```prisma
model Canvas {
  id        String   @id @default(cuid())
  name      String   @default("未命名画布")
  userId    String   @map("user_id")
  ideaId    String?  @unique @map("idea_id")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  nodes       CanvasNode[]
  connections CanvasConnection[]
}
```

### 架构合规性

**遵循架构决策:**

- API 前缀: `/ideaFlow/api/v1/canvases`
- 使用 JWT 认证保护所有端点
- 统一 JSON 响应格式
- 错误处理使用全局异常过滤器

**遵循命名规范:**

- 组件: PascalCase (`CanvasList.tsx`)
- 函数/变量: camelCase (`currentCanvasId`)
- API 路由: 复数名词 (`/canvases`)

**遵循测试规范:**

- TDD 开发流程(先写测试,再实现)
- 单元测试覆盖核心逻辑
- 集成测试覆盖完整用户流程

### 前序故事学习

**从 Story 3.5 (Canvas Region Grouping) 学到的模式:**

- 使用 Konva.js 渲染画布节点
- 使用 Jotai atoms 管理画布状态
- 使用 `useAutoSave` Hook 实现自动保存(Debounce 1秒)
- 使用 `@tanstack/react-query` 管理 API 数据
- 前端组件位于 `apps/web/src/features/canvas/components/`
- 后端服务位于 `apps/api/src/modules/canvases/`

**已实现的相关功能:**

- 画布创建和基础渲染 (Story 3.1)
- 画布缩放与平移 (Story 3.2)
- 节点拖拽定位 (Story 3.3)
- 节点连线与标注 (Story 3.4)
- 画布区域分组 (Story 3.5)

### 路由配置方案

```
/canvas                  → 重定向到第一个画布或创建新画布
/canvas/:canvasId        → 独立画布编辑页
/ideas/:ideaId/canvas    → 想法关联画布 (已有,沿用)
```

**边界情况处理:**

- `/canvas` 无 ID: 查询列表,有则跳转第一个,无则自动创建
- 无效 canvasId: 显示 404 或重定向到列表
- 删除当前画布: 自动切换到列表中下一个

### 实现建议

**推荐实现顺序:**

1. 先实现画布列表组件和切换逻辑(核心功能)
2. 再实现新建画布功能
3. 最后实现重命名和删除功能
4. 编写测试覆盖所有场景

**注意事项:**

- 确保画布切换前触发自动保存
- 删除画布时检查是否为最后一个画布
- 重命名时验证名称不为空
- 处理网络错误和加载状态
- 复用 `canvasListAtom`、`canvasListLoadingAtom` 等现有 atoms

### References

- [Source: epics.md#Epic 3 Stories - Story 3.6]
- [Source: architecture.md#Project Structure - Frontend Canvas Module]
- [Source: architecture.md#API Conventions]
- [Source: prisma/schema.prisma - Canvas Model]
- [Source: apps/api/src/modules/canvases/canvases.controller.ts]
- [Source: apps/web/src/features/canvas/components/CanvasLibrary.tsx]

## Dev Agent Record

### Agent Model Used

_To be filled by dev agent_

### Debug Log References

_To be filled by dev agent_

### Completion Notes List

_To be filled by dev agent_

### File List

**Backend Files:**

- `apps/api/src/modules/canvases/canvases.service.ts`
- `apps/api/src/modules/canvases/canvases.service.spec.ts`
- `apps/api/src/modules/canvases/canvases.controller.ts`

**Frontend Files:**

- `apps/web/src/features/canvas/components/CanvasList.tsx` (NEW)
- `apps/web/src/features/canvas/components/CanvasListItem.tsx` (NEW)
- `apps/web/src/features/canvas/components/CreateCanvasButton.tsx` (NEW)
- `apps/web/src/features/canvas/components/CanvasEditor.tsx`
- `apps/web/src/features/canvas/stores/canvasAtoms.ts`
- `apps/web/src/features/canvas/services/canvas.service.ts`
- `apps/web/src/App.tsx` (路由配置)

**Test Files:**

- `apps/web/src/features/canvas/components/CanvasList.test.tsx` (NEW)
- `apps/web/src/features/canvas/MultiCanvasManagement.test.tsx` (NEW)
