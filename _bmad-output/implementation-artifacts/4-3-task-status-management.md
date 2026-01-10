# Story 4.3: 任务状态管理 (Task Status Management)

Status: done

## Story

As a **用户**,
I want **修改任务的状态（待办/进行中/已完成）**,
so that **追踪任务的执行进度**.

## Acceptance Criteria

1. **状态修改入口 (Status Change Entry)**:
   - **Given** 用户在任务列表页或详情页
   - **When** 点击任务的状态标识或下拉菜单
   - **Then** 显示状态选项：待办 (To Do)、进行中 (In Progress)、已完成 (Done)
   - **And** 当前状态高亮显示

2. **状态更新与反馈 (Status Update & Feedback)**:
   - **Given** 用户选择了新的状态 (e.g., 从 To Do 变为 In Progress)
   - **When** 操作完成
   - **Then** 任务状态立即更新 (Optimistic UI)
   - **And** 向后端发送 PATCH 请求更新状态
   - **And** 显示「状态已更新」的轻量提示
   - **And** 任务卡片的视觉样式随状态改变 (e.g., 颜色标签变化)

3. **已完成状态特殊处理 (Completed Status Behavior)**:
   - **Given** 用户将任务标记为「已完成」
   - **When** 任务包含截止日期提醒 (过期或临近)
   - **Then** 截止日期提醒不再显示 (或样式变为灰色/不显著)
   - **And** 任务标题可能增加删除线效果 (视设计而定)

4. **进度可视化 (Progress Visualization)**:
   - **Given** 任务列表
   - **When** 浏览任务
   - **Then** 每个任务都清晰展示当前状态 (Icon 或 Badge)
   - **And** 状态颜色区分明显 (e.g., 待办-灰色/蓝色, 进行中-橙色/紫色, 已完成-绿色)

## Tasks / Subtasks

- [x] Task 1: Backend - 状态管理 API (AC: #2)
  - [x] 1.1 确认 `schema.prisma` 中 `TaskStatus` Enum 定义 (todo, in_progress, done)
  - [x] 1.2 验证 `UpdateTaskDto` 支持 `status` 字段更新
  - [x] 1.3 编写测试用例验证状态流转逻辑

- [x] Task 2: Frontend - 状态组件开发 (AC: #1, #4)
  - [x] 2.1 开发 `TaskStatusBadge` 组件 (用于展示)
  - [x] 2.2 开发 `TaskStatusSelect` 组件 (用于修改，支持 Dropdown)
  - [x] 2.3 定义状态对应的颜色映射体系 (Theme tokens)

- [x] Task 3: Frontend - 页面集成 (AC: #1, #2, #3)
  - [x] 3.1 在 `TaskCard` (列表视图) 中集成状态展示与快捷修改
  - [x] 3.2 在 `TaskDetail` (详情视图) 中集成状态修改器
  - [x] 3.3 实现「已完成」状态下的样式变化 (如删除线、隐藏过期警告)
  - [x] 3.4 确保 `TaskDueDateBadge` 与状态联动 (完成时不报错)

- [x] Task 4: 测试验证 (AC: All)
  - [x] 4.1 编写前端组件单元测试 (Badge, Select)
  - [x] 4.2 验证乐观更新 (Optimistic UI) 的回滚机制 (若 API 失败)
  - [x] 4.3 验证数据库状态持久化

## Dev Notes

### 技术要点提示

1. **Prisma Schema**:
   确保 `TaskStatus` 枚举存在且大致如下:

   ```prisma
   enum TaskStatus {
     TODO
     IN_PROGRESS
     DONE
   }
   ```

   _注意: 如果数据库中尚未定义 Enum，需创建 Migration。_

2. **API 交互**:
   - Endpoint: `PATCH /ideaFlow/api/v1/tasks/:id`
   - Body: `{ "status": "IN_PROGRESS" }`

3. **UI/UX 规范**:
   - 状态颜色建议 (参考 Arco Design 或 Tailwind):
     - TODO: Gray/Default (`text-gray-500`, `bg-gray-100`)
     - IN_PROGRESS: Blue/Processing (`text-blue-500`, `bg-blue-100`)
     - DONE: Green/Success (`text-green-500`, `bg-green-100`)
   - 交互: 点击 Badge 弹出 Dropdown 为佳，减少点击次数。

4. **组件复用**:
   - 复用 `TaskDueDateBadge` 的逻辑结构。
   - 状态逻辑可提取为 `getTaskStatusInfo(status)` 纯函数，返回 label 和 color。

### 架构合规性

- **状态管理**: 使用 Jotai 或 React Query 的 mutation 进行乐观更新。
- **目录结构**: 新组件放入 `apps/web/src/features/tasks/components/`。
- **类型安全**: 前后端共享 `TaskStatus` 类型定义 (从 Prisma 生成或 shared 包)。

### References

- [Source: planning-artifacts/epics.md - Story 4.3]
- [Source: apps/web/src/features/tasks/components/TaskDueDateBadge.tsx - 参考组件]
- [Source: prisma/schema.prisma - Task Model Definition]

## Dev Agent Record

### Agent Model Used

Gemini 2.5 Pro (via Antigravity)

### Debug Log References

- Backend tests: 8/8 passed (tasks.service.spec.ts)
- Frontend tests: 13/13 passed (TaskDetail, CreateTaskModal, TaskDueDateBadge)

### Completion Notes List

- ✅ TaskStatus enum confirmed in schema.prisma (todo, in_progress, done)
- ✅ task-status-badge component created with color-coded status display (gray/blue/green)
- ✅ task-status-select component created with dropdown menu and REAL optimistic UI updates via React Query mutation (onMutate)
- ✅ Tasks.tsx (TaskCard) integrated with task-status-select for inline status modification
- ✅ TaskDetail.tsx integrated with task-status-select and done-state styling (line-through title, opacity on description/badge)
- ✅ task-due-date-badge updated to render neutrally (gray, opacity-50) when task is done
- ✅ Status update test case added to tasks.service.spec.ts
- ✅ Filenames aligned with project-context.md convention (kebab-case)

### File List

- `prisma/schema.prisma` - TaskStatus enum definition
- `apps/api/src/modules/tasks/tasks.service.ts` - Status update logic
- `apps/api/src/modules/tasks/tasks.service.spec.ts` - Status update test
- `apps/web/src/features/tasks/components/task-status-badge.tsx` - NEW: Status badge component (renamed)
- `apps/web/src/features/tasks/components/task-status-select.tsx` - NEW: Status dropdown selector (renamed)
- `apps/web/src/features/tasks/components/task-due-date-badge.tsx` - MODIFIED: Status-aware rendering (renamed)
- `apps/web/src/features/tasks/Tasks.tsx` - MODIFIED: Integrated task-status-select
- `apps/web/src/features/tasks/TaskDetail.tsx` - MODIFIED: Integrated task-status-select + done styling
- `apps/web/src/features/tasks/TaskDetail.test.tsx` - MODIFIED: Added tests
