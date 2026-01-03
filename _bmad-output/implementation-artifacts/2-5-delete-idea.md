# Story 2.5: 删除想法

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## 用户故事 (Story)

作为一个 **用户**,
我想要 **删除不再需要的想法**,
以便 **保持我的想法库整洁**.

## 验收标准 (Acceptance Criteria)

1.  **删除确认**:
    - **Given** 用户在想法详情或列表
    - **When** 点击删除按钮
    - **Then** 弹出确认对话框「确定删除这个想法吗？」
    - **And** 对话框包含「取消」和「确定」按钮

2.  **执行删除**:
    - **Given** 用户确认删除
    - **When** 点击确认按钮
    - **Then** 想法删除成功
    - **And** 从列表中移除（使用 optimistic update）
    - **And** 显示「已删除」提示（Toast 通知）
    - **And** 详情面板/抽屉关闭

3.  **关联任务处理 (Phase 4 预留)**:
    - **Given** 想法已关联任务
    - **When** 尝试删除
    - **Then** 提示「此想法已关联任务，删除后关联将解除」
    - (MVP：不实现任务关联，仅预留逻辑，直接删除)

4.  **取消删除**:
    - **Given** 用户在确认对话框
    - **When** 点击「取消」或按 Escape 键
    - **Then** 对话框关闭
    - **And** 想法保持不变

## 任务 / 子任务 (Tasks / Subtasks)

- [x] Task 1: Backend - 删除想法 API (AC: 2)
  - [x] 在 `IdeasService` 添加 `remove(userId, ideaId)` 方法
  - [x] 实现硬删除（MVP 不需要软删除）
  - [x] 在 `IdeasController` 添加 `@Delete(':id')` 端点
  - [x] 验证想法属于当前用户（权限检查）
  - [x] 返回 200 + 成功消息
  - [x] 编写单元测试 (`ideas.service.spec.ts`, `ideas.controller.spec.ts`)

- [x] Task 2: Frontend - 删除按钮与确认对话框 (AC: 1, 4)
  - [x] 在 `IdeaDetail` 添加删除按钮 (IconDelete)
  - [x] 在 `IdeaCard` 添加删除按钮（hover 显示）
  - [x] 使用 Arco `Modal.confirm` 确认对话框
  - [x] 对话框包含「取消」和「确定」按钮

- [x] Task 3: Frontend - 删除 API 集成与乐观更新 (AC: 2)
  - [x] 在 `ideas.service.ts` 添加 `deleteIdea(id)` 方法
  - [x] 使用 `useMutation` + 真正的 optimistic update（缓存操作 + 回滚）
  - [x] 删除成功后关闭详情抽屉
  - [x] Toast 提示「已删除」

- [x] Task 4: Frontend - 组件测试 (AC: 1, 2, 4)
  - [x] IdeaDetail 删除按钮渲染测试
  - [x] Modal.confirm 显示测试
  - [x] deleteIdea API 调用测试
  - [x] IdeaCard 删除按钮测试

### Review Follow-ups (AI - Completed)

- [x] [AI-Review][CRITICAL] Add missing delete tests to IdeaDetail.test.tsx
- [x] [AI-Review][HIGH] Add delete button to IdeaCard with hover visibility
- [x] [AI-Review][MEDIUM] Implement true optimistic update with cache manipulation
- [x] [AI-Review][MEDIUM] Add aria-label for accessibility

## 开发说明 (Dev Notes)

### 架构模式

- **API 设计**: 遵循 RESTful 规范，使用 `DELETE /ideaFlow/api/v1/ideas/:id`
- **状态管理**: 使用真正的 optimistic update（onMutate 缓存操作 + onError 回滚）
- **用户反馈**: `Modal.confirm` + `Message.success/error` Toast 通知

### 项目结构参考

- 后端：扩展 `apps/api/src/modules/ideas/` 目录下的现有文件
- 前端：修改 `apps/web/src/features/ideas/components/IdeaDetail.tsx` 和 `IdeaCard.tsx`
- 服务：扩展 `apps/web/src/features/ideas/services/ideas.service.ts`

### 技术验收标准

- DELETE `/ideaFlow/api/v1/ideas/:id` 正常工作 ✅
- 删除前弹出确认对话框 ✅
- 删除后列表立即刷新（optimistic update） ✅
- 所有测试通过 ✅

## 开发代理记录 (Dev Agent Record)

### 使用的代理模型

Antigravity (Gemini)

### 调试日志引用

无

### 完成记录

**日期**: 2026-01-04

**测试结果**:

- Backend (ideas module): 24/24 tests passed
- Frontend: 57/57 tests passed
- Total: 81 tests ✅

**实现摘要**:

- 后端 `DELETE /ideas/:id` 端点，带所有权验证
- 前端删除按钮 + `Modal.confirm` 确认对话框（IdeaDetail + IdeaCard）
- 真正的 optimistic update：立即从缓存移除，错误时回滚
- 删除成功后自动关闭抽屉、刷新列表、Toast 提示

### 文件列表

**修改**:

- `apps/api/src/modules/ideas/ideas.service.ts` - 添加 remove()
- `apps/api/src/modules/ideas/ideas.controller.ts` - 添加 @Delete(':id')
- `apps/api/src/modules/ideas/ideas.service.spec.ts` - 添加 remove() 测试
- `apps/api/src/modules/ideas/ideas.controller.spec.ts` - 添加 remove 端点测试
- `apps/web/src/features/ideas/services/ideas.service.ts` - 添加 deleteIdea()
- `apps/web/src/features/ideas/components/IdeaDetail.tsx` - 添加删除按钮、Modal.confirm、optimistic update
- `apps/web/src/features/ideas/components/IdeaDetail.test.tsx` - 添加删除功能测试
- `apps/web/src/features/ideas/components/IdeaCard.tsx` - 添加删除按钮（hover）、Modal.confirm、optimistic update
- `apps/web/src/features/ideas/components/IdeaCard.test.tsx` - 添加 QueryClientProvider wrapper 和删除按钮测试
- `apps/web/src/features/ideas/Ideas.tsx` - 添加 onDelete 回调
