# Story 4.5: 任务列表与筛选视图 (Task List & Filter View)

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a 用户,
I want 查看任务列表并按条件筛选,
so that 找到需要处理的任务.

## Acceptance Criteria

1. **多视图切换 (Multi-view Switching)**:
   - **Given** 任务主页面
   - **When** 点击顶部标签页 (Tabs)
   - **Then** 支持切换以下视图：
     - **今天 (Today)**: 截止日期为今天的任务。
     - **即将到来 (Upcoming)**: 截止日期在未来（明天及以后）的任务。
     - **个人 (Personal)**: 展示「未指定分类」的任务（Inbox）。
     - **项目 (Project)**: 对应特定的分类视图（接续 Story 4.4 实现的 Category 映射）。

2. **多维度筛选 (Multi-dimensional Filtering)**:
   - **Given** 任务列表显示中
   - **When** 展开筛选器面板
   - **Then** 支持按以下条件组合筛选：
     - **状态 (Status)**: 待办 (todo)、进行中 (in-progress)、已完成 (done)。
     - **分类 (Category)**: 从现有分类中选择一个或多个。
     - **时间 (Time)**: 自定义日期范围或预设时间段。

3. **空状态处理 (Empty State Handling)**:
   - **Given** 即使应用了筛选条件
   - **When** 搜索结果为空
   - **Then** 显示友好的空状态界面，包含引导文字及「清除筛选」按钮。

4. **分页与加载 (Pagination & Loading)**:
   - **Given** 大量任务存在
   - **When** 滚动至底部或点击下一页
   - **Then** 自动加载更多任务（使用 `meta` 中的分页元数据进行控制）。

## Tasks / Subtasks

- [x] Task 1: Backend - 增强任务筛选 API
  - [x] 1.1 **[CRITICAL]** 创建 `apps/api/src/modules/tasks/dto/get-tasks-filter.dto.ts` 用于查询参数校验
  - [x] 1.2 **[ENHANCEMENT]** 在后端引入 `dayjs` 统一日期处理逻辑（对齐前端）
  - [x] 1.3 更新 `TasksService.findAll` 以支持 `status`, `view`, `startDate`, `endDate` 参数
  - [x] 1.4 编写针对多维度过滤组合（如 status + category）的回归测试
  - [x] 1.5 确保与 `include: { category: true }` 兼容
  - [x] 1.6 更新 `apps/api/package.json` 确认 `dayjs` 依赖

- [x] Task 2: Frontend - 状态存储与筛选逻辑
  - [x] 2.1 在 `stores/tasks.ts` 中添加筛选状态原子 (Filter Atoms)
  - [x] 2.2 实现筛选逻辑的自定义 Hook `useTaskFilters`

- [x] Task 3: Frontend - UI 组件开发与集成
  - [x] 3.1 开发 `TaskTabs` 组件用于视图切换
  - [x] 3.2 开发 `TaskFilterPanel` 组件 (玻璃拟态风格)
  - [x] 3.3 实现 `TaskEmptyState` 组件
  - [x] 3.4 **[REFactor]** 优化并复用 `apps/web/src/features/tasks/components/TaskCard.tsx` 及其相关组件，避免重复实现逻辑
  - [x] 3.5 在 `Tasks.tsx` 中集成以上组件并连接数据

- [x] Task 4: 验证与验收
  - [x] 4.1 运行 Vitest 前端测试，确保标签页和筛选器连接正确
  - [x] 4.2 运行 Jest 后端测试，验证过滤逻辑
  - [x] 4.3 浏览器手动验证：切换视图、组合过滤、空状态展示
  - [x] 4.4 更新 `sprint-status.yaml` 为 `done`

## Dev Notes

### 技术要点提示

- 使用 `GetTasksFilterDto` 配合 `ValidationPipe` 强制类型转换。

2. **视图逻辑 (Logic Foundations)**:
   - 接续 Story 4.4 已实现的分类体系。
   - 玻璃拟态视觉：使用 `apps/web/src/features/categories/components/CategoryBadge.tsx` 中的样式作为参考。

3. **API 接口建议**:
   - `GET /ideaFlow/api/v1/tasks?view=today&status=todo&categoryId=...`

### 架构合规性

- 严格遵循 `/ideaFlow/api/v1/` 路径规范。
- 确保所有状态变更使用 Jotai 原子化更新。
- 分页元数据必须包含在 `meta` 字段中。

### References

- [Source: planning-artifacts/epics.md - Story 4.5]
- [Source: apps/api/src/modules/tasks/tasks.service.ts]
- [Source: apps/web/src/features/categories/]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### Code Review Record

- **Date**: 2026-01-12
- **Fixes Applied**:
  - **Backend**: Changed date filter logic in `TasksService` to target `dueDate` instead of `createdAt` to match user expectations. Updated tests accordingly.
  - **Frontend**: Fixed type safety issue in `TaskCard.tsx` (removed unsafe `as any` cast).
  - **Frontend**: Removed unused `CategoryManager` modal code and imports in `Tasks.tsx`.
  - **Documentation**: Populated the missing File List.

### File List

- `apps/api/src/modules/tasks/dto/get-tasks-filter.dto.ts`
- `apps/api/src/modules/tasks/services/tasks.service.ts`
- `apps/api/src/modules/tasks/tasks.controller.ts`
- `apps/web/src/stores/tasks.ts`
- `apps/web/src/features/tasks/hooks/useTaskFilters.ts`
- `apps/web/src/features/tasks/services/tasks.service.ts`
- `apps/web/src/features/tasks/components/TaskTabs.tsx`
- `apps/web/src/features/tasks/components/TaskFilterPanel.tsx`
- `apps/web/src/features/tasks/components/TaskEmptyState.tsx`
- `apps/web/src/features/tasks/components/TaskCard.tsx`
- `apps/web/src/features/tasks/Tasks.tsx`
- `apps/web/src/features/tasks/TaskDetail.tsx`
