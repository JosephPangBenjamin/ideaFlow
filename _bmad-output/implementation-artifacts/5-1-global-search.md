# Story 5.1: 全局搜索 (Global Search)

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a 用户,
I want 快速搜索想法和任务,
so that 找到需要的内容.

## Acceptance Criteria

1. **⌘+K 快捷键触发搜索面板**:
   - **Given** 用户在任何页面
   - **When** 按下 ⌘+K (Mac) 或 Ctrl+K (Windows) 快捷键
   - **Then** 弹出全局搜索面板（模态框）
   - **And** 输入框自动获得焦点
   - **And** 按 ESC 键可关闭面板

2. **实时搜索结果显示**:
   - **Given** 搜索面板打开
   - **When** 输入搜索关键词（≥2 个字符）
   - **Then** 实时显示匹配结果（包含想法和任务）
   - **And** 结果按相关性排序
   - **And** 搜索过程显示加载状态
   - **And** 响应时间 < 300ms（NFR4）

3. **搜索结果分类展示**:
   - **Given** 搜索返回结果
   - **When** 结果包含想法和任务
   - **Then** 分组显示：「想法」和「任务」两个区域
   - **And** 每个结果显示：类型图标、标题/内容摘要、创建时间

4. **结果跳转导航**:
   - **Given** 搜索结果列表
   - **When** 点击某个结果（或使用键盘 ↑↓ 选择 + Enter 确认）
   - **Then** 关闭搜索面板
   - **And** 跳转到对应的想法/任务详情页面

5. **空结果友好提示**:
   - **Given** 搜索结果
   - **When** 无匹配内容
   - **Then** 显示「未找到相关内容」提示
   - **And** 显示空状态插画或图标

## Tasks / Subtasks

- [x] Task 1: 后端 - 搜索模块创建 (AC: #2, #3)
  - [x] 1.1 创建 `apps/api/src/modules/search` 模块目录结构
  - [x] 1.2 创建 `SearchModule`, `SearchController`, `SearchService`
  - [x] 1.3 实现 `GET /ideaFlow/api/v1/search?q=` API 端点
  - [x] 1.4 创建 `SearchQueryDto` 验证（q 参数必填，min 2 字符）
  - [x] 1.5 配置 JWT Guard 保护搜索端点
  - [x] 1.6 在 `app.module.ts` 中注册 SearchModule

- [x] Task 2: 后端 - PostgreSQL 搜索实现 (AC: #2)
  - [x] 2.1 实现想法搜索：使用 `ILIKE` 匹配 `content` 字段
  - [x] 2.2 实现任务搜索：使用 `ILIKE` 匹配 `title` 和 `description` 字段
  - [x] 2.3 统一返回格式 `{ ideas: [...], tasks: [...] }`
  - [x] 2.4 限制每类返回最多 10 条结果
  - [x] 2.5 添加搜索响应时间日志（确保 < 300ms）

- [x] Task 3: 前端 - 搜索 API 服务 (AC: #2)
  - [x] 3.1 创建 `apps/web/src/services/search.service.ts`
  - [x] 3.2 实现 `search(query: string)` 方法调用搜索 API
  - [x] 3.3 定义搜索响应类型接口

- [x] Task 4: 前端 - 全局搜索面板组件 (AC: #1, #3, #4, #5)
  - [x] 4.1 创建 `apps/web/src/components/GlobalSearch.tsx`
  - [x] 4.2 使用 Arco Design `Modal` 或自定义 Glassmorphism 弹窗
  - [x] 4.3 实现搜索输入框（带防抖 300ms，与 API 响应时间匹配）
  - [x] 4.4 实现分组结果列表（想法 + 任务）
  - [x] 4.5 实现键盘导航（↑↓ 选择，Enter 跳转，ESC 关闭）
  - [x] 4.6 实现空结果状态展示
  - [x] 4.7 添加加载状态指示器
  - [x] 4.8 实现搜索关键词高亮显示

- [x] Task 5: 前端 - 全局快捷键绑定 (AC: #1)
  - [x] 5.1 创建 `apps/web/src/hooks/useGlobalSearchHotkey.ts`
  - [x] 5.2 实现 ⌘+K / Ctrl+K 快捷键监听
  - [x] 5.3 在 `apps/web/src/store/ui.ts` 添加 `globalSearchOpenAtom` Jotai 状态原子
  - [x] 5.4 在 `Layout.tsx` 中集成快捷键 Hook 和搜索组件

- [x] Task 6: 验证与测试 (AC: 全部)
  - [x] 6.1 编写后端单元测试 `search.service.spec.ts`
  - [x] 6.2 编写前端组件测试 `GlobalSearch.test.tsx`
  - [x] 6.3 浏览器手动验证：快捷键、搜索、跳转、键盘导航
  - [x] 6.4 验证搜索响应时间 < 300ms

## Dev Notes

### 🎯 这是 Epic 5 的第一个故事

本故事开启「搜索与筛选」能力，Epic 5 状态将从 `backlog` 更新为 `in-progress`。

### 后端模块结构参考

**遵循现有 NestJS 模块模式**（参考 `modules/ideas/` 和 `modules/tasks/`）：

```
apps/api/src/modules/search/
├── search.module.ts
├── search.controller.ts
├── search.service.ts
├── search.service.spec.ts
└── dto/
    └── search-query.dto.ts
```

### PostgreSQL 搜索策略

**选择 ILIKE 而非全文搜索的理由：**

- 数据量适中（单用户想法/任务数量有限）
- 实现简单，无需额外 tsvector 索引配置
- 支持部分匹配（全文搜索要求精确分词）

**Prisma 实现示例：**

```typescript
// SearchService.search(userId: string, query: string)
const searchTerm = `%${query}%`;

const [ideas, tasks] = await Promise.all([
  this.prisma.idea.findMany({
    where: {
      userId,
      content: { contains: query, mode: 'insensitive' },
    },
    take: 10,
    orderBy: { createdAt: 'desc' },
    select: { id: true, content: true, createdAt: true },
  }),
  this.prisma.task.findMany({
    where: {
      userId,
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    },
    take: 10,
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, description: true, status: true, createdAt: true },
  }),
]);

return { ideas, tasks };
```

### 前端快捷键实现参考

**参考现有 `useQuickCaptureHotkey.ts` 模式**：

```typescript
// hooks/useGlobalSearchHotkey.ts
import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { globalSearchOpenAtom } from '@/store/ui';

export function useGlobalSearchHotkey() {
  const setSearchOpen = useSetAtom(globalSearchOpenAtom);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSearchOpen]);
}
```

### 搜索面板 UI 设计要求

**遵循项目玻璃拟态设计系统：**

- 背景：`bg-slate-900/80 backdrop-blur-xl`
- 边框：`border border-white/10`
- 圆角：`rounded-2xl`
- 阴影：`shadow-2xl shadow-black/50`
- 输入框：无边框，透明背景，大字体
- 结果列表：悬停高亮 `hover:bg-white/5`

**键盘导航实现：**

- 使用 `useState` 追踪选中索引
- `↑/↓` 键修改索引，循环滚动
- `Enter` 执行跳转
- 选中项视觉高亮 `bg-blue-500/20`

### ⚠️ 关键约束

| 约束             | 要求                         |
| ---------------- | ---------------------------- |
| **API 前缀**     | `/ideaFlow/api/v1/search`    |
| **响应时间**     | < 300ms (NFR4)               |
| **认证**         | 必须使用 `JwtAuthGuard`      |
| **搜索最小长度** | 2 个字符                     |
| **结果限制**     | 每类最多 10 条               |
| **前端防抖**     | 300ms（与 API 响应时间匹配） |
| **关键词高亮**   | 搜索结果中高亮匹配的关键词   |

### 关键代码位置

| 模块               | 文件路径                                                     |
| ------------------ | ------------------------------------------------------------ |
| **后端搜索模块**   | `apps/api/src/modules/search/` (新建)                        |
| **AppModule 注册** | `apps/api/src/app.module.ts` (修改)                          |
| **前端搜索组件**   | `apps/web/src/components/GlobalSearch.tsx` (新建)            |
| **快捷键 Hook**    | `apps/web/src/hooks/useGlobalSearchHotkey.ts` (新建)         |
| **搜索服务**       | `apps/web/src/services/search.service.ts` (新建)             |
| **UI 状态原子**    | `apps/web/src/store/ui.ts` (扩展)                            |
| **布局集成**       | `apps/web/src/components/Layout.tsx` (修改)                  |
| **参考模式**       | `apps/web/src/features/ideas/hooks/useQuickCaptureHotkey.ts` |

### 从 Story 4.6 继承的最佳实践

- 使用 `useMutation` 和 `useQuery` from `@tanstack/react-query`
- 错误处理使用 `Message.error()` 显示友好提示
- 加载状态使用 `isPending` 或 `isLoading`
- 保持与现有组件的视觉一致性

### Project Structure Notes

- 搜索模块是**新增模块**，遵循 NestJS 标准目录结构
- 前端搜索组件放在 `components/` 因为是全局共享组件（非 feature-specific）
- Jotai 原子添加到现有 `stores/ui.ts` 而非创建新文件

### References

- [Source: planning-artifacts/epics.md#Story 5.1]
- [Source: planning-artifacts/architecture.md#API Conventions]
- [Source: planning-artifacts/architecture.md#PostgreSQL + Prisma]
- [Source: apps/web/src/components/Layout.tsx] - 布局集成点
- [Source: apps/web/src/features/ideas/hooks/useQuickCaptureHotkey.ts] - 快捷键参考
- [Source: apps/api/src/modules/ideas/ideas.service.ts] - 后端服务模式参考

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4 (Antigravity)

### Debug Log References

无

### Completion Notes List

- ✅ Task 1-2: 后端搜索模块完成，使用 Prisma ILIKE 实现想法和任务搜索
- ✅ Task 3: 前端搜索服务完成，定义类型接口
- ✅ Task 4: GlobalSearch 组件完成，包含键盘导航、关键词高亮、玻璃拟态 UI
- ✅ Task 5: 快捷键 Hook 完成，⌘+K/Ctrl+K 触发
- ✅ Task 6: 后端测试 6/6 通过，前端测试 7/7 通过

### File List

- `apps/api/src/modules/search/search.module.ts`
- `apps/api/src/modules/search/search.controller.ts`
- `apps/api/src/modules/search/search.service.ts`
- `apps/api/src/modules/search/search.service.spec.ts`
- `apps/api/src/modules/search/dto/search-query.dto.ts`
- `apps/api/src/app.module.ts`
- `apps/web/src/services/search.service.ts`
- `apps/web/src/components/GlobalSearch.tsx`
- `apps/web/src/components/GlobalSearch.test.tsx`
- `apps/web/src/hooks/useGlobalSearchHotkey.ts`
- `apps/web/src/store/ui.ts`
- `apps/web/src/components/Layout.tsx`

### Code Review Record

- **Reviewer**: Auto-Review Workflow
- **Date**: 2026-01-19
- **Outcome**: Passed with fixes
- **Fixes Applied**:
  - Refactored `GlobalSearch.tsx` to use `dayjs` instead of custom `formatTime`
  - Added `useMemo` for `allResults` optimization
  - Extracted magic numbers/strings to constants
