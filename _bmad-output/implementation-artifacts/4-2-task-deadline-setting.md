# Story 4.2: 任务时间设置 (Task Deadline Setting)

Status: done

## Story

As a **用户**,
I want **为任务设置截止日期**,
so that **按时完成任务**.

## Acceptance Criteria

1. **日期选择器入口 (Date Picker Entry)**:
   - **Given** 用户在任务详情页面
   - **When** 点击日期选择区域
   - **Then** 弹出日历组件
   - **And** 已设置的日期高亮显示

2. **日期选择与保存 (Date Selection & Save)**:
   - **Given** 日历组件已打开
   - **When** 选择一个日期
   - **Then** 任务截止日期立即更新（调用 `PATCH` 并支持 ISO 字符串）
   - **And** 日期选择器显示选中的日期
   - **And** 显示「已保存」提示

3. **临近截止提醒 (Approaching Deadline Warning)**:
   - **Given** 任务有截止日期
   - **When** 临近截止日期（≤ 3天，定义为常量）
   - **Then** 任务卡片显示橙色提醒标记（⚠️）
   - **And** 截止日期文字变为橙色

4. **过期警告 (Overdue Alert)**:
   - **Given** 任务已过期（截止日期已过）
   - **When** 查看任务列表或任务详情
   - **Then** 任务卡片显示红色过期标记（🔴）
   - **And** 截止日期文字变为红色

5. **清除截止日期 (Clear Deadline)**:
   - **Given** 任务已有截止日期
   - **When** 在日期选择器中点击「清除」按钮
   - **Then** 发送 `dueDate: null` 到后端 API
   - **And** 截止日期被移除，任务卡片不再显示相关样式

## Tasks / Subtasks

- [x] Task 1: Backend - 验证与增强截止日期 API (AC: #2, #5)
  - [x] 1.1 验证 `PATCH /api/v1/tasks/:id` 能够正确处理 `dueDate: null`（Prisma 应更新为数据库 NULL）
  - [x] 1.2 确认 `UpdateTaskDto` 支持显式 `null` 或可选值
  - [x] 1.3 编写测试用例验证日期更新及清除逻辑

- [x] Task 2: Frontend - TaskDetail 日期集成 (AC: #1, #2, #5)
  - [x] 2.1 在 `TaskDetail.tsx` 集成 Arco `DatePicker`
  - [x] 2.2 实现日期变更逻辑，使用 `apps/web/src/utils/date.ts` 中的工具进行预处理
  - [x] 2.3 实现清除按钮并发送 `null` 更新
  - [x] 2.4 集成 `Message` 提示保存状态

- [x] Task 3: Frontend - TaskCard 视觉增强 (AC: #3, #4)
  - [x] 3.1 创建 `TaskDueDateBadge.tsx` 组件
  - [x] UI: Added TaskDueDateBadge component with status colors
- [x] UI: Integrated DatePicker in TaskDetail
- [x] Fix: Refactored deadline logic into shared `task-utils.ts` (Code Review)
- [x] Fix: Updated DTO to support `null` for clearing deadlines (Code Review)
- [x] Fix: Unified visual feedback logic between Badge and Detail button (Code Review)
  - [x] 3.2 使用变量 `APPROACHING_THRESHOLD_DAYS = 3` 实现状态逻辑
  - [x] 3.3 确保组件使用 `React.memo` 优化性能
  - [x] 3.4 适配不同视图（列表页/详情页）

- [x] Task 4: 测试验证 (AC: All)
  - [x] 4.1 编写 `getDueDateStatus` 纯函数的单元测试
  - [x] 4.2 验证不同时区下的日期显示准确性
  - [x] 4.3 确认前后端 100% 测试覆盖

## Dev Notes

### 技术要点提示

1. **API 数据格式**:
   - 更新日期: `PATCH { "dueDate": "2026-01-15T00:00:00.000Z" }`
   - 清除日期: `PATCH { "dueDate": null }` (必须明确发送 null 以便 Prisma 执行更新)

2. **逻辑常量与工具**:
   - 阈值定义: `const APPROACHING_THRESHOLD_DAYS = 3;`
   - 日期处理: 优先复用 `src/utils/date.ts` 中的 `formatFullTime`。
   - 状态计算逻辑：

     ```typescript
     function getDueDateStatus(dueDate: string | null): DueDateStatus {
       if (!dueDate) return 'none';
       const due = dayjs(dueDate); // 建议集成 dayjs 简化
       const now = dayjs();
       const diffDays = due.diff(now, 'day');

       if (diffDays < 0) return 'overdue';
       if (diffDays <= 3) return 'approaching';
       return 'normal';
     }
     ```

3. **视觉规范**:
   - `approaching`: Tailwind `text-orange-500`
   - `overdue`: Tailwind `text-red-500`

### 架构合规性

- **API 规范**: `/ideaFlow/api/v1/tasks/:id`
- **组件目录**: `apps/web/src/features/tasks/components/`
- **性能**: 复用 Story 4.1 中的 `React.memo` 模式。

### References

- [Source: prisma/schema.prisma - Task Model]
- [Source: apps/web/src/utils/date.ts - 工具函数]
- [Source: validation-report-4-2.md - 质量审计建议]

## Dev Agent Record

### Agent Model Used

Claude 3.7 Sonnet

### Debug Log References

无

### Completion Notes List

- ✅ Task 1: 验证后端 API 已正确处理 `dueDate: null` 和 ISO string，测试覆盖完整 (7/7 通过)
- ✅ Task 2: `TaskDetail.tsx` 已集成 DatePicker、清除按钮、Message 提示
- ✅ Task 3: `TaskDueDateBadge.tsx` 实现 approaching/overdue 状态逻辑，使用 `React.memo` 优化
- ✅ Task 4: `getDueDateStatus` 单元测试全部通过 (5/5)

### File List

- `apps/api/src/modules/tasks/tasks.service.ts` (验证)
- `apps/api/src/modules/tasks/dto/update-task.dto.ts` (验证)
- `apps/api/src/modules/tasks/tasks.service.spec.ts` (验证)
- `apps/web/src/features/tasks/TaskDetail.tsx` (修改 - 添加清除按钮)
- `apps/web/src/features/tasks/Tasks.tsx` (验证)
- `apps/web/src/features/tasks/components/TaskDueDateBadge.tsx` (验证)
- `apps/web/src/features/tasks/components/TaskDueDateBadge.test.tsx` (验证)

### Review Fixes Applied (AI)

- **Backend**: 重构 `TasksService` 提取 `prepareDueDate` 私有方法，消除重复代码。
- **Frontend**:
  - 修复 `TaskDueDateBadge` 过期逻辑精度至分钟级。
  - 为 `TaskDueDateBadge` 增加每分钟定时刷新机制，确保离屏/长挂场景状态准确。
  - 优化 `TaskDetail` 设置成功提示。
  - 补全 `TaskDetail` 中截止日期按钮的 AC 状态颜色样式。
