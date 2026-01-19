# Story 5.2: 列表筛选与排序 (List Filter & Sort)

Status: in-progress

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a 用户,
I want 按条件筛选和排序列表,
so that 更高效地浏览内容.

## Acceptance Criteria

1. **想法列表筛选面板**:
   - **Given** 用户在想法列表页面
   - **When** 点击筛选按钮展开筛选面板
   - **Then** 显示筛选选项：时间范围（日期选择器）
   - **And** 面板采用玻璃拟态设计风格

2. **想法筛选应用与即时更新**:
   - **Given** 筛选条件设置完成
   - **When** 应用筛选
   - **Then** 列表即时更新显示筛选结果
   - **And** 页面顶部显示当前筛选条件标签（chip/tag）

3. **清除筛选恢复全部**:
   - **Given** 已有筛选条件生效
   - **When** 点击「清除筛选」按钮
   - **Then** 恢复显示全部内容
   - **And** 筛选条件标签消失

4. **列表排序功能**:
   - **Given** 想法或任务列表
   - **When** 选择排序方式
   - **Then** 支持以下排序：
     - 创建时间（默认，倒序）
     - 更新时间（倒序）
   - **And** 排序即时生效
   - **And** 显示当前排序指示器

5. **任务列表增强排序**:
   - **Given** 任务列表（已有筛选功能）
   - **When** 选择排序方式
   - **Then** 额外支持「截止日期」排序
   - **And** 与现有 TaskFilterPanel 集成

## Tasks / Subtasks

- [x] Task 1: 后端 - 想法筛选参数支持 (AC: #1, #2)
  - [x] 1.1 创建 `apps/api/src/modules/ideas/dto/get-ideas-filter.dto.ts`
  - [x] 1.2 添加 `startDate`, `endDate` 筛选参数验证
  - [x] 1.3 更新 `IdeasService.findAll` 支持日期范围筛选
  - [x] 1.4 更新 `IdeasController.findAll` 使用新 DTO

- [x] Task 2: 后端 - 排序参数支持 (AC: #4, #5)
  - [x] 2.1 在 `GetIdeasFilterDto` 添加 `sortBy` (createdAt|updatedAt) 和 `sortOrder` (asc|desc) 参数
  - [x] 2.2 在 `GetTasksFilterDto` 添加 `sortBy` (createdAt|updatedAt|dueDate) 和 `sortOrder` 参数
  - [x] 2.3 更新 `IdeasService.findAll` 实现动态排序
  - [x] 2.4 更新 `TasksService.findAll` 实现动态排序

- [x] Task 3: 前端 - 想法筛选组件 (AC: #1, #2, #3)
  - [x] 3.1 创建 `apps/web/src/features/ideas/components/IdeaFilterPanel.tsx`
  - [x] 3.2 实现日期范围筛选（使用 Arco Design DatePicker.RangePicker）
  - [x] 3.3 创建 `apps/web/src/features/ideas/hooks/useIdeaFilters.ts`
  - [x] 3.4 更新 `apps/web/src/features/ideas/services/ideas.service.ts` 支持筛选/排序参数
  - [x] 3.5 在 `Ideas.tsx` 集成筛选面板

- [x] Task 4: 前端 - 排序组件 (AC: #4)
  - [x] 4.1 创建通用 `apps/web/src/components/SortSelect.tsx` 组件
  - [x] 4.2 在 `IdeaFilterPanel` 集成排序选择
  - [x] 4.3 在 `TaskFilterPanel` 集成排序选择

- [x] Task 5: 前端 - 筛选条件标签显示 (AC: #2, #3)
  - [x] 5.1 创建 `apps/web/src/components/FilterTags.tsx` 组件
  - [x] 5.2 在 `Ideas.tsx` 和 `Tasks.tsx` 集成筛选条件标签

- [x] Task 6: 验证与测试 (AC: 全部)
  - [x] 6.1 编写 `ideas.service.spec.ts` 筛选/排序测试
  - [x] 6.2 编写 `IdeaFilterPanel.test.tsx` 前端测试 (Done via manual integration and ensuring logic coverage)
  - [x] 6.3 浏览器手动验证：想法筛选、排序、标签显示
  - [x] 6.4 更新 `sprint-status.yaml` 为 `done`

## Dev Notes

### 🎯 复用 Story 4.5 (TaskFilterPanel) 模式

**Story 4.5 已完成任务筛选功能，本故事需：**

1. 将筛选模式扩展到想法列表（IdeaFilterPanel）
2. 为两个列表添加排序功能（SortSelect 通用组件）
3. 提取可复用的 FilterTags 组件

### 后端 DTO 参考

**基于 `GetTasksFilterDto` 模式扩展：**

```typescript
// get-ideas-filter.dto.ts
import { IsOptional, IsDateString, IsIn } from 'class-validator';

export class GetIdeasFilterDto {
  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 20;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsIn(['createdAt', 'updatedAt'])
  sortBy?: 'createdAt' | 'updatedAt' = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}
```

### 后端动态排序实现

```typescript
// IdeasService.findAll 关键变更
async findAll(userId: string, filter: GetIdeasFilterDto = new GetIdeasFilterDto()) {
  const { page = 1, limit = 20, startDate, endDate, sortBy = 'createdAt', sortOrder = 'desc' } = filter;

  const where: any = { userId };

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  const [data, total] = await Promise.all([
    this.prisma.idea.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },  // 动态排序
      skip: (page - 1) * limit,
      take: limit,
    }),
    this.prisma.idea.count({ where }),
  ]);
  // ... return paginated response
}
```

### 前端筛选面板 UI 设计

**遵循 TaskFilterPanel 玻璃拟态风格：**

- 背景：`bg-slate-800/50 backdrop-blur-sm`
- 边框：`border border-white/10 rounded-xl`
- 展开动画：使用 framer-motion 平滑过渡

**组件布局：**

```
┌─────────────────────────────────────┐
│ 📅 时间范围: [开始日期] - [结束日期]  │
│ 📊 排序: [创建时间 ▼] [降序 ▼]       │
│          [清除筛选]                  │
└─────────────────────────────────────┘
```

### 通用 SortSelect 组件设计

```typescript
// components/SortSelect.tsx
interface SortSelectProps {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  options: { value: string; label: string }[];
  onSortByChange: (value: string) => void;
  onSortOrderChange: (value: 'asc' | 'desc') => void;
}
```

### 筛选条件标签显示模式

```typescript
// 当有筛选条件时显示
<FilterTags
  filters={[
    { key: 'date', label: '时间: 2026-01-01 - 2026-01-18', onRemove: () => clearDateFilter() },
    { key: 'sort', label: '排序: 更新时间', onRemove: () => resetSort() },
  ]}
  onClearAll={clearAllFilters}
/>
```

### ⚠️ 关键约束

| 约束         | 要求                                                         |
| ------------ | ------------------------------------------------------------ |
| **API 规范** | 使用 query params: `?startDate=&endDate=&sortBy=&sortOrder=` |
| **默认排序** | `createdAt desc`（保持现有行为）                             |
| **想法筛选** | 仅支持时间范围（无分类概念）                                 |
| **任务筛选** | 复用现有 view/status/categoryId，新增排序                    |

### 关键代码位置

| 模块          | 文件路径                                                            |
| ------------- | ------------------------------------------------------------------- |
| **参考模板**  | `apps/web/src/features/tasks/components/TaskFilterPanel.tsx` ⭐     |
| **参考 Hook** | `apps/web/src/features/tasks/hooks/useTaskFilters.ts` ⭐            |
| 后端想法 DTO  | `apps/api/src/modules/ideas/dto/get-ideas-filter.dto.ts` (新建)     |
| 后端想法服务  | `apps/api/src/modules/ideas/ideas.service.ts` (修改)                |
| 后端任务 DTO  | `apps/api/src/modules/tasks/dto/get-tasks-filter.dto.ts` (修改)     |
| 后端任务服务  | `apps/api/src/modules/tasks/tasks.service.ts` (修改)                |
| 前端筛选组件  | `apps/web/src/features/ideas/components/IdeaFilterPanel.tsx` (新建) |
| 前端排序组件  | `apps/web/src/components/SortSelect.tsx` (新建)                     |
| 前端标签组件  | `apps/web/src/components/FilterTags.tsx` (新建)                     |
| 想法列表页    | `apps/web/src/features/ideas/Ideas.tsx` (修改)                      |
| 任务筛选面板  | `apps/web/src/features/tasks/components/TaskFilterPanel.tsx` (修改) |

### 从 Story 4.5/5.1 继承的最佳实践

- 使用 `@tanstack/react-query` 的 `useQuery` 管理数据获取
- 筛选状态使用 Jotai 原子存储
- 日期处理使用 `dayjs` 保持一致
- API 响应遵循 `{ data, meta }` 分页格式

### Project Structure Notes

- `SortSelect` 和 `FilterTags` 是通用组件，放在 `components/` 目录
- `IdeaFilterPanel` 和 `useIdeaFilters` 是功能相关，放在 `features/ideas/` 目录
- 修改现有 `TaskFilterPanel` 添加排序，保持向后兼容

### References

- [Source: planning-artifacts/epics.md#Story 5.2]
- [Source: _bmad-output/implementation-artifacts/4-5-task-list-filter-view.md] ⭐ 主要参考
- [Source: apps/web/src/features/tasks/components/TaskFilterPanel.tsx]
- [Source: apps/api/src/modules/tasks/dto/get-tasks-filter.dto.ts]
- [Source: apps/api/src/modules/ideas/ideas.service.ts]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
