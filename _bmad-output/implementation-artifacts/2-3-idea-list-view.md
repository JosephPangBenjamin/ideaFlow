# Story 2.3: 想法列表与查看

**状态 (Status):** done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## 用户故事 (Story)

作为一个 **用户**,
我想要 **查看我的所有想法**,
以便 **回顾和管理我的灵感**.

## 验收标准 (Acceptance Criteria)

1.  **想法列表展示**:
    - **Given** 用户在想法页面
    - **When** 页面加载
    - **Then** 显示想法列表（按创建时间倒序）
    - **And** 列表采用响应式布局（Grid 或 Stack）
    - **And** 如果没有想法，显示友好的空状态 (Empty State)

2.  **无限滚动分页**:
    - **Given** 想法列表
    - **When** 滚动到底部
    - **Then** 自动加载下一页想法
    - **And** 加载过程中显示 Loading 指示器
    - **And** 所有数据加载完毕后显示“没有更多了”

3.  **想法卡片 (Idea Card)**:
    - **Given** 想法列表中的一项
    - **Then** 卡片应显示：
      - 内容摘要 (限制行数，例如 3 行)
      - 创建时间 (友好格式，如“2小时前”)
      - 来源图标 (Link/Image/Text) 用于指示是否包含来源
    - **And** 卡片应具备 Hover 效果

4.  **详情查看 (View Detail)**:
    - **Given** 想法卡片
    - **When** 点击卡片
    - **Then** 右侧滑出详情面板 (Drawer) 或 打开模态框 (Modal)
    - **And** 显示完整内容
    - **And** 显示完整的来源预览 (Link Card / Full Image / Note)
    - **And** URL 来源应可点击跳转

5.  **性能 (Performance)**:
    - **Then** 列表滚动应保持 60fps 流畅
    - **And** 详情面板打开动画应流畅

## 任务 / 子任务 (Tasks / Subtasks)

- [x] Task 1: Backend - 想法查询 API (AC: 1, 2)
  - [x] 更新 `IdeasService.findAll` 以支持分页 (建议：MVP 阶段使用 Offset/Limit，或者为了更佳的体验使用 Cursor 游标分页)。
  - [x] 实现查询参数：`page`, `limit` (默认 20)。
  - [x] 响应格式应通过 `meta` 字段包含分页信息 (total, page, etc)。
  - [x] 确保默认排序为按创建时间倒序 (`orderBy: { createdAt: 'desc' }`)。

- [x] Task 2: Frontend - 组件重构 (AC: 3, 4)
  - [x] **重构**: 从 `SourceInput.tsx` 中提取 `SourcePreview` 组件。
    - 创建 `apps/web/src/features/ideas/components/SourcePreview.tsx`。
    - Props: `source: IdeaSource`, `compact?: boolean` (用于卡片视图 vs 详情视图)。
    - 使用新组件替换 `SourceInput.tsx` 中的内联预览代码。

- [x] Task 3: Frontend - 想法卡片与列表 (AC: 1, 2, 3)
  - [x] 创建 `IdeaCard` 组件。
    - 使用 `Arco Design` 的 Card 组件或自定义样式 div。
    - 显示文本摘要 (截断)、时间 (使用 dayjs)、来源图标。
  - [x] 创建 `IdeaList` 组件。
    - 集成 `@tanstack/react-query` 的 `useInfiniteQuery`。
    - 实现无限滚动逻辑 (建议使用 `react-intersection-observer` 或原生滚动事件)。
    - 处理 加载中、错误、空数据、已加载全部 等状态。

- [x] Task 4: Frontend - 详情面板 (AC: 4)
  - [x] 创建 `IdeaDetail` 组件 (Drawer 内容)。
  - [x] 实现右侧滑出 Drawer 逻辑。
  - [x] 展示完整内容和来源 (复用 `SourcePreview` with `compact={false}`)。
  - (约束: MVP 暂不实现 URL 同步更新，仅做侧滑展示)。

## 开发说明 (Dev Notes)

- **架构模式**:
  - **状态管理**: 列表数据使用 `useInfiniteQuery` 管理。除非需要跨组件访问，否则**不要**将列表存储在全局 Jotai atom 中 (Query Cache 通常足够)。
  - **UI 组件**: 使用 `Arco Design` 的 List/Grid 和 Drawer 组件。
  - **路由**: `IdeaList` 应该是 `/ideas` 路由的主体内容。

- **源代码组件**:
  - `apps/api/src/modules/ideas/ideas.service.ts`
  - `apps/api/src/modules/ideas/ideas.controller.ts`
  - `apps/web/src/features/ideas/components/IdeaCard.tsx` (新增)
  - `apps/web/src/features/ideas/components/IdeaList.tsx` (新增)
  - `apps/web/src/features/ideas/components/IdeaDetail.tsx` (新增)
  - `apps/web/src/features/ideas/components/SourcePreview.tsx` (新增/重构)

- **依赖库**:
  - `@tanstack/react-query`: 必须用于处理分页和缓存。
  - `react-intersection-observer`: 推荐用于无限滚动触发检测。
  - `dayjs` (Arco 依赖): 用于日期格式化。

### 项目结构说明

- 确保 `IdeaCard` 等组件位于 `apps/web/src/features/ideas/components/` 目录下。
- 验证 `SourcePreview` 的提取重构不会破坏 Story 2.2 (Idea Source) 的现有功能，通过 regression check。

## 开发代理记录 (Dev Agent Record)

### 使用的代理模型

Antigravity

### 项目上下文参考

- **语言规则**: TypeScript Strict Mode。
- **样式**: TailwindCSS。
- **组件规则**: 函数式组件，强类型 Props。
