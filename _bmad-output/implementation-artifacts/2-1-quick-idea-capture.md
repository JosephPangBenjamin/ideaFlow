# Story 2.1: 快速创建想法（闪念捕捉）

Status: done

<!-- 注意: 验证是可选的。在运行 dev-story 之前运行 validate-create-story 进行质量检查。 -->

## 用户故事 (Story)

作为一个 **用户**,
我想要 **在 3 秒内快速记录一个想法**,
以便 **不错过任何灵感闪现的时刻**.

## 验收标准 (Acceptance Criteria)

1.  **触发与界面 (Trigger & UI)**:
    - **Given / 假设** 用户在任何页面
    - **When / 当** 点击「+」按钮或按下 `⌘+N` 快捷键
    - **Then / 那么** 弹出极简的 QuickCapture 输入框
    - **And / 并且** 焦点自动在输入框中
    - **And / 并且** 响应时间 < 100ms (非功能需求 NFR)

2.  **创建流程 (Creation Flow)**:
    - **Given / 假设** 用户在 QuickCapture 输入框中输入内容
    - **When / 当** 按下 Enter 键或点击保存/失去焦点 (通常快捷键呼出的回车保存)
    - **Then / 那么** 想法保存成功
    - **And / 并且** 系统自动记录创建时间戳
    - **And / 并且** 显示「已保存 ✓」提示（1.5s 后消失）
    - **And / 并且** 想法列表（如果可见）自动更新
    - **And / 并且** 输入框清空并关闭 (MVP 设定：保存后关闭)

3.  **空状态 (Empty State)**:
    - **Given / 假设** 输入框为空
    - **When / 当** 按下 Enter
    - **Then / 那么** 不创建想法，输入框保持打开或提示不可为空

4.  **性能 (Performance)**:
    - 从点击触发到完成保存的操作流程需 ≤ 3秒

## 任务 / 子任务 (Tasks / Subtasks)

- [x] Task 1: 后端 - Idea 资源实现 (AC: 2)
  - [x] 在 `prisma/schema.prisma` 中定义 `Idea` 模型 (字段: `id`, `content`, `createdAt`, `updatedAt`, `userId`, `source` (JSONB, 目前可为空))。
  - [x] 创建 `IdeasModule`, `IdeasController`, `IdeasService`。
  - [x] 实现 `POST /ideaFlow/api/v1/ideas` 端点。
  - [x] 添加 DTO 验证 (`CreateIdeaDto` 包含 `content` 字符串，最大长度检查)。
  - [x] 为 Service 和 Controller 编写单元测试。

- [x] Task 2: 前端 - Idea 功能基础设施 (AC: 1, 4)
  - [x] 创建 `features/ideas` 目录结构 (`components`, `services`, `hooks`, `stores`)。
  - [x] 实现 `ideas.service.ts` 及其 `createIdea` 方法。
  - [x] 在 `stores/ideas.ts` 中创建 `ideasAtom` 用于管理想法列表状态。

- [x] Task 3: 前端 - QuickCapture 组件 (AC: 1, 2, 3)
  - [x] 创建 `QuickCapture` 组件 (模态框或覆盖层)。
  - [x] 实现 `⌘+N` 的全局按键监听 (考虑使用 `useHotkeys` hook)。
  - [x] 添加全局悬浮 "+" 按钮 (FAB)。
  - [x] 实现输入逻辑：自动聚焦，回车提交，ESC 关闭。
  - [x] 实现提交处理：调用 API，显示 Toast，更新 Atom，关闭模态框。
  - [x] 处理空状态验证。

- [x] Task 4: 埋点集成 (AC: N/A - 系统需求)
  - [x] 在创建成功时追踪 `idea_created` 事件。

## 开发说明 (Dev Notes)

- **2026-01-03**: 修复了 `IdeasController` 的路由问题。由于 `main.ts` 中已设置全局前缀 `ideaFlow/api/v1`，Controller 装饰器应使用 `@Controller('ideas')` 而非完整路径，否则会导致路由重复 (404 Error)。
- **2026-01-03**: 确认前端 `vite.config.ts` 中的代理配置正确，可以处理 `/ideaFlow/api` 开头的请求。

- **架构模式**:
  - 遵循前端 `features/ideas` 结构。
  - 使用 `Jotai` 全局控制 QuickCapture 模态框的可见性 (例如 `quickCaptureOpenAtom`)。
  - 确保 `QuickCapture` 挂载在根级别 (例如 `App.tsx` 或布局组件中)，以便在"任何页面"上工作。

- **涉及的源码组件**:
  - `prisma/schema.prisma`
  - `apps/api/src/modules/ideas/`
  - `apps/web/src/features/ideas/`
  - `apps/web/src/App.tsx` (用于挂载 QuickCapture)

- **测试标准**:
  - 后端：逻辑单元测试。
  - 前端：`QuickCapture` 的组件测试 (验证快捷键有效，输入有效，提交调用 API)。

### 项目结构说明

- **统一结构**: 确保 `Idea` 类型定义尽可能在 `packages/shared` 中共享，或者在 API 中严格定义并在 Web 中生成/推断。
- **命名**: `QuickCapture.tsx` (组件), `useQuickCapture` (Hook 如果逻辑复杂)。

### 参考资料

- [Epics: Story 2.1](file:///Users/offer/offer_work/ideaFlow/_bmad-output/planning-artifacts/epics.md#Story-2.1)
- [Architecture: Backend Modules](file:///Users/offer/offer_work/ideaFlow/_bmad-output/planning-artifacts/architecture.md#Backend-NestJS)
- [UX Design: QuickCapture](file:///Users/offer/offer_work/ideaFlow/_bmad-output/planning-artifacts/ux-design-specification.md)

## 开发代理记录 (Dev Agent Record)

### 使用的代理模型

Antigravity (simulated workflow)

### 调试日志参考

### 完成说明列表

- ✅ Implemented `Idea` resource in backend with unit tests.
- ✅ Created frontend `features/ideas` infrastructure (service, store, types).
- ✅ Implemented `QuickCapture` component using `Cmd+N` hotkey.
- ✅ **[Code Review Fix]** Added global floating button (FAB) `QuickCaptureFAB.tsx`.
- ✅ Integrated `QuickCapture` and FAB into `Layout`.
- ✅ Added `idea_created` analytics tracking.
- ✅ **[Code Review Fix]** Fixed M1: Removed unused `IsJSON` import.
- ✅ **[Code Review Fix]** Fixed M2: Corrected `useAnalytics` import path.
- ✅ **[Code Review Fix]** Fixed M3: Simplified placeholder text.

### 文件列表

- `apps/api/src/app.module.ts` (Modified)
- `apps/api/src/modules/ideas/dto/create-idea.dto.ts` (New)
- `apps/api/src/modules/ideas/ideas.controller.spec.ts` (New)
- `apps/api/src/modules/ideas/ideas.controller.ts` (New)
- `apps/api/src/modules/ideas/ideas.module.ts` (New)
- `apps/api/src/modules/ideas/ideas.service.spec.ts` (New)
- `apps/api/src/modules/ideas/ideas.service.ts` (New)
- `apps/web/src/components/Layout.tsx` (Modified)
- `apps/web/src/features/ideas/components/QuickCapture.test.tsx` (New)
- `apps/web/src/features/ideas/components/QuickCapture.tsx` (New)
- `apps/web/src/features/ideas/hooks/useQuickCaptureHotkey.ts` (New)
- `apps/web/src/features/ideas/services/ideas.service.ts` (New)
- `apps/web/src/features/ideas/stores/ideas.ts` (New)
- `apps/web/src/features/ideas/types.ts` (New)
- `apps/web/src/features/ideas/components/QuickCaptureFAB.tsx` (New)
