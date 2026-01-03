# Story 2.4: 编辑想法

**状态 (Status):** done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## 用户故事 (Story)

作为一个 **用户**,
我想要 **编辑已创建的想法**,
以便 **完善或修正我的记录**.

## 验收标准 (Acceptance Criteria)

1.  **进入编辑模式**:
    - **Given** 用户在想法详情面板
    - **When** 双击内容区域或点击编辑按钮
    - **Then** 内容变为可编辑状态
    - **And** 光标自动聚焦到编辑区域

2.  **保存编辑内容**:
    - **Given** 用户修改想法内容
    - **When** 点击保存按钮或失去焦点（blur）
    - **Then** 想法更新成功
    - **And** 显示「已保存 ✓」提示（1.5s 消失）
    - **And** 记录 `updatedAt` 时间

3.  **自动保存**:
    - **Given** 用户正在编辑
    - **When** 内容变化后 3 秒无操作
    - **Then** 系统自动保存（Debounce）
    - **And** 显示「自动保存中...」→「已保存 ✓」状态

4.  **离线缓存 (MVP 可选，优先级低)**:
    - **Given** 用户编辑中
    - **When** 网络断开
    - **Then** 内容自动保存到本地缓存
    - **And** 网络恢复后自动同步
    - **And** 显示「离线模式」提示

5.  **取消编辑**:
    - **Given** 用户在编辑模式
    - **When** 按下 Escape 键或点击取消按钮
    - **Then** 恢复原始内容
    - **And** 退出编辑模式

## 任务 / 子任务 (Tasks / Subtasks)

- [x] Task 1: Backend - 更新想法 API (AC: 2, 3)
  - [x] 创建 `UpdateIdeaDto` (content 可选, source 可选)
  - [x] 在 `IdeasService` 添加 `update(userId, ideaId, dto)` 方法
  - [x] 在 `IdeasController` 添加 `@Patch(':id')` 端点
  - [x] 验证想法属于当前用户（权限检查）
  - [x] 返回更新后的完整 Idea 对象
  - [x] 编写单元测试 (`ideas.service.spec.ts`)

- [x] Task 2: Backend - 获取单个想法 API
  - [x] 在 `IdeasService` 添加 `findOne(userId, ideaId)` 方法
  - [x] 在 `IdeasController` 添加 `@Get(':id')` 端点
  - [x] 处理 404 Not Found 情况
  - [x] 编写单元测试

- [x] Task 3: Frontend - IdeaDetail 编辑模式 (AC: 1, 2, 5)
  - [x] 在 `IdeaDetail` 添加 `isEditing` 状态
  - [x] 添加编辑按钮（IconEdit）触发编辑模式
  - [x] 双击内容区域进入编辑模式
  - [x] 使用 Arco `Input.TextArea` 实现编辑
  - [x] 保存/取消按钮组
  - [x] Escape 键取消编辑

- [x] Task 4: Frontend - 自动保存与状态提示 (AC: 3)
  - [x] 实现 debounce (3s) 使用 useRef + setTimeout
  - [x] 添加保存状态指示器: `saving` / `saved` / `error`
  - [x] `useMutation` + `invalidateQueries` 刷新列表缓存
  - [x] 编写组件测试 (`IdeaDetail.test.tsx`)

- [x] Task 5: Frontend - API 集成 (AC: 2)
  - [x] 在 `ideas.service.ts` 添加 `updateIdea(id, data)` 方法
  - [x] 集成 `useMutation` 处理更新请求
  - [x] 错误处理与 Toast 提示 (Message.error)

## 开发说明 (Dev Notes)

### 架构模式

- **API 设计**: 遵循 RESTful 规范，使用 `PATCH /ideaFlow/api/v1/ideas/:id`
- **状态管理**: 编辑状态使用本地 `useState`，更新后通过 `invalidateQueries(['ideas'])` 刷新列表

## 开发代理记录 (Dev Agent Record)

### 使用的代理模型

Antigravity (Gemini)

### 完成记录

**日期**: 2026-01-04

**测试结果**:

- Backend: 16/16 tests passed
- Frontend: 6/6 tests passed
- Total: 22 tests ✅

**实现摘要**:

- 后端 PATCH `/ideas/:id` 和 GET `/ideas/:id` 端点，带所有权验证
- 前端编辑模式：双击/按钮进入编辑，Escape 取消
- 3 秒自动保存 (debounce)
- 保存状态指示器 (saving/saved/error)
- React Query 缓存失效

### 文件列表

**新增**:

- `apps/api/src/modules/ideas/dto/update-idea.dto.ts`

**修改**:

- `apps/api/src/modules/ideas/ideas.service.ts` - 添加 findOne, update
- `apps/api/src/modules/ideas/ideas.controller.ts` - 添加 GET/:id, PATCH/:id
- `apps/api/src/modules/ideas/ideas.service.spec.ts` - 添加 findOne, update 测试
- `apps/api/src/modules/ideas/ideas.controller.spec.ts` - 添加端点测试
- `apps/web/src/features/ideas/types.ts` - 添加 UpdateIdeaDto
- `apps/web/src/features/ideas/services/ideas.service.ts` - 添加 getIdea, updateIdea
- `apps/web/src/features/ideas/components/IdeaDetail.tsx` - 重构支持编辑模式
- `apps/web/src/features/ideas/components/IdeaDetail.test.tsx` - 添加编辑模式测试
