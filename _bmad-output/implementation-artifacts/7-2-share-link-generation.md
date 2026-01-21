# Story 7.2: 分享链接生成

Status: done

## Story

As a **用户**,
I want **通过分享设置面板一键生成公开链接**,
so that **便捷地与他人分享我的想法和画布**。

## Acceptance Criteria

1. **分享按钮入口**: 想法详情和画布页面显示「分享」按钮，点击弹出分享设置面板。
2. **一体化分享面板**: 面板整合可见性切换、链接生成、复制功能，提供流畅的分享体验。
3. **剪贴板复制**: 链接复制到剪贴板后，显示「链接已复制」Toast 提示 + 成功动效。
4. **公开视图访问**: 访问者打开有效分享链接时，显示公开视图内容（无需登录）。
5. **链接失效处理**: 访问无效/过期链接时显示友好的「内容不存在」提示页。

## Tasks / Subtasks

- [x] **Task 1: 分享设置面板组件** (AC: 1, 2)
  - [x] 1.1 创建 `ShareSettingsModal.tsx` 弹窗组件
  - [x] 1.2 在 `IdeaDetail.tsx` 添加「分享」按钮，点击打开模态框
  - [x] 1.3 在 `CanvasEditor.tsx` 工具栏添加「分享」按钮入口

- [x] **Task 2: 复制 UX 增强** (AC: 3)
  - [x] 2.1 复制按钮成功后显示勾选图标动效（200ms → ✓）
  - [x] 2.2 生成链接时可选「自动复制到剪贴板」

- [x] **Task 3: 公开访问页面** (AC: 4, 5) ⚡ Story 7.1 已实现
  - [x] 3.1 `PublicIdeaPage.tsx` - 公开想法视图 (181行)
  - [x] 3.2 `PublicCanvasPage.tsx` - 公开画布视图 (267行, 含 Konva + 缩放)
  - [x] 3.3 路由 `/public/idea/:token`, `/public/canvas/:token` 已配置
  - [x] 3.4 404 Empty 状态已在两个页面实现

- [x] **Task 4: 前端 API 集成** (AC: 4) ⚡ Story 7.1 已实现
  - [x] 4.1 `api.get('/ideas/public/:token')` 已在 PublicIdeaPage 使用
  - [x] 4.2 `api.get('/canvases/public/:token')` 已在 PublicCanvasPage 使用

- [x] **Task 5: 单元测试** (AC: 1-3)
  - [x] 5.1 `ShareSettingsModal.test.tsx` - 测试弹窗交互、链接复制
  - [x] 5.2 公开视图测试 - 依赖 Story 7.1 测试覆盖

- [x] **Task 6: Sprint 状态更新**
  - [x] 6.1 Story 完成后更新 `sprint-status.yaml` 状态为 `review`

## Dev Notes

### ShareSettingsModal 组件规格

```tsx
// apps/web/src/components/ShareSettingsModal.tsx
interface ShareSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  type: 'idea' | 'canvas';
  isPublic: boolean;
  publicToken: string | null;
  onVisibilityChange: (isPublic: boolean) => Promise<void>;
}
```

**UI 布局:**

```
┌─────────────────────────────────────┐
│  分享设置                      [×]  │
├─────────────────────────────────────┤
│                                     │
│  公开分享 ─────────── [Switch]      │
│  启用后任何人都可以通过链接查看      │
│                                     │
│  ┌─ 公开时显示 ─────────────────┐   │
│  │  🔗 分享链接                 │   │
│  │  ┌────────────────┐ [复制✓] │   │
│  │  │ https://...    │          │   │
│  │  └────────────────┘          │   │
│  │  ✓ 生成时自动复制            │   │
│  └──────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**集成方式:**

- 复用 `ShareLinkCopy.tsx` 展示链接
- Switch 切换调用 `updateVisibility` API（Story 7.1 已实现）
- 使用 Arco Design `Modal`, `Switch`, `Checkbox`

### Story 7.1 已实现的基础设施

> ✅ **重要**: 以下功能已完全实现，本 Story 仅需创建入口 Modal

| 组件/功能              | 位置                                                  | 状态 |
| ---------------------- | ----------------------------------------------------- | ---- |
| `ShareLinkCopy.tsx`    | `apps/web/src/components/`                            | ✅   |
| `PublicIdeaPage.tsx`   | `apps/web/src/pages/`                                 | ✅   |
| `PublicCanvasPage.tsx` | `apps/web/src/pages/`                                 | ✅   |
| 公开路由配置           | `apps/web/src/router/index.tsx`                       | ✅   |
| `updateVisibility` API | `ideas.service.ts`, `canvas.service.ts`               | ✅   |
| 后端公开访问 API       | `GET /ideas/public/:token`, `/canvases/public/:token` | ✅   |
| Prisma 字段            | `isPublic`, `publicToken`                             | ✅   |

### 开发范围（实际工作量）

| 任务                   | 预估时间 | 说明                 |
| ---------------------- | -------- | -------------------- |
| ShareSettingsModal.tsx | 1h       | 新组件，整合已有功能 |
| IdeaDetail 分享按钮    | 15min    | 简单入口             |
| CanvasEditor 分享按钮  | 15min    | 简单入口             |
| 复制动效               | 30min    | IconCheck 动画       |
| 单元测试               | 30min    | Modal 基本测试       |
| **总计**               | ~2.5h    |                      |

### 技术规范

| 项目           | 规范                                       |
| -------------- | ------------------------------------------ |
| **UI 组件库**  | Arco Design (`Modal`, `Switch`, `Message`) |
| **剪贴板 API** | `navigator.clipboard.writeText()`          |
| **API 前缀**   | `/ideaFlow/api/v1/`                        |

### References

- [FR32 - 分享链接生成](file:///Users/offer/offer_work/ideaFlow/_bmad-output/planning-artifacts/epics.md#L1325)
- [Story 7.1 实现](file:///Users/offer/offer_work/ideaFlow/_bmad-output/implementation-artifacts/7-1-public-private-view-toggle.md)
- [ShareLinkCopy.tsx](file:///Users/offer/offer_work/ideaFlow/apps/web/src/components/ShareLinkCopy.tsx)
- [PublicIdeaPage.tsx](file:///Users/offer/offer_work/ideaFlow/apps/web/src/pages/PublicIdeaPage.tsx)

## Dev Agent Record

### Agent Model Used

Antigravity (Amelia)

### Completion Notes List

- 实现了统一的 `ShareSettingsModal` 组件，减少了重复逻辑。
- 在 `IdeaDetail` 和 `CanvasEditor` 中成功集成了分享入口。
- 增强了 `ShareLinkCopy` 的复制反馈动效（图标切换+文字提示）。
- 实现了「开启分享时自动复制」的可选逻辑。
- 删除了已废弃的 `CanvasVisibilitySettings.tsx` 及其相关行内控制。
- 单元测试覆盖率达标，所有测试用例通过。
- **[Code Review Fix]** 修复了 Dev Notes 中的接口规格（移除 resourceId）。
- **[Code Review Fix]** 用 `useEffect` 替换 `setTimeout` 修复 auto-copy 竞态条件。
- **[Code Review Fix]** 增强了单元测试覆盖率（8 个测试用例）。
- **[Code Review Fix]** 移除了测试文件中未使用的 mocks。

### File List

- `apps/web/src/components/ShareSettingsModal.tsx` [NEW]
- `apps/web/src/components/ShareSettingsModal.test.tsx` [NEW]
- `apps/web/src/components/ShareLinkCopy.tsx` [MODIFIED]
- `apps/web/src/features/ideas/components/IdeaDetail.tsx` [MODIFIED]
- `apps/web/src/features/canvas/components/CanvasToolbar.tsx` [MODIFIED]
- `apps/web/src/features/canvas/components/CanvasEditor.tsx` [MODIFIED]
- `apps/web/src/features/canvas/components/CanvasVisibilitySettings.tsx` [DELETE]
