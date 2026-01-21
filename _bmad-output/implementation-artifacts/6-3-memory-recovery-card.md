# Story 6.3: 记忆恢复卡片 (Memory Recovery Card)

Status: done

## Story

As a 用户,
I want 打开旧想法时看到记忆恢复卡片,
so that 回想起当时记录的原因.

## Acceptance Criteria

1. **Given** 用户打开 7天+ 的想法 (`idea.isStale === true`), **When** 想法详情加载, **Then** 在详情面板顶部突出显示记忆恢复卡片.
2. **Given** 记忆恢复卡片, **When** 展示内容, **Then** 包含：创建时间（使用 `date-fns` 的 `formatDistanceToNow` 显示「2周前」格式）、来源备注 (`idea.sources[]`)、参考链接预览.
3. **Given** 记忆恢复卡片, **When** 用户交互后, **Then** 显示反馈按钮「这个想法帮到你了吗？」，点击后通过 `analyticsService.track('memory_recovery_helpful', ...)` 记录埋点.

## Tasks / Subtasks

- [x] Task 1: 创建 `MemoryRecoveryCard` 组件 (AC: 1, 2)
  - [x] 1.1 创建 `apps/web/src/features/ideas/components/MemoryRecoveryCard.tsx`
  - [x] 1.2 使用渐变背景 (`bg-gradient-to-r from-purple-500/20 to-blue-500/20`) + 圆角 (`rounded-xl`)
  - [x] 1.3 使用 `date-fns/formatDistanceToNow` + `{ locale: zhCN }` 格式化相对时间
  - [x] 1.4 复用 `SourcePreview` 组件展示 `sources[]` 来源信息
- [x] Task 2: 在想法详情中集成记忆恢复逻辑 (AC: 1)
  - [x] 2.1 在 `IdeaDetail.tsx` (或 `IdeaCard` 详情面板) 中检测 `idea.isStale === true`
  - [x] 2.2 条件渲染 `<MemoryRecoveryCard idea={idea} />`
  - [x] 2.3 确保仅在详情面板展开时显示，列表视图不显示
- [x] Task 3: 实现反馈交互功能 (AC: 3)
  - [x] 3.1 添加「👍 有帮助 / 👎 没帮助」按钮
  - [x] 3.2 使用现有 `useAnalytics` Hook 记录埋点 `memory_recovery_helpful: { ideaId, helpful: boolean }`
  - [x] 3.3 点击后按钮状态变为「感谢反馈！」并禁用
- [x] Task 4: 编写测试 (AC: 1, 2, 3)
  - [x] 4.1 使用 `Vitest` + `@testing-library/react` 编写 `MemoryRecoveryCard.test.tsx`
  - [x] 4.2 测试：沉底想法 → 显示卡片，非沉底 → 不显示
  - [x] 4.3 测试：反馈按钮点击后状态变更

## Dev Notes

### 🎯 核心实现思路

- **复用沉底状态**: 直接使用 `idea.isStale` 字段 (Story 6.1 已实现)，无需前端重新计算 7 天逻辑
- **「回顾时惊艳」设计**: 使用渐变背景 + 微动画，视觉层级高于普通 IdeaCard
- **埋点复用**: 使用现有 `analyticsService` + `useAnalytics` Hook (Story 1.7 已实现)

### ⚠️ 关键约束

| 约束          | 要求                                               |
| ------------- | -------------------------------------------------- |
| **沉底判断**  | 使用 `idea.isStale` 字段 (Story 6.1)，不要前端计算 |
| **UI 组件库** | TailwindCSS + Arco Design 混合使用                 |
| **来源展示**  | 复用 `SourcePreview` 组件 (Story 2.2 已实现)       |
| **时间库**    | 使用 `date-fns` + `zhCN` locale                    |
| **埋点**      | 使用 `analyticsService.track()` (Story 1.7 已实现) |
| **TDD**       | 先写测试，组件测试覆盖完整                         |

### 类型定义

```typescript
// MemoryRecoveryCard.tsx
interface MemoryRecoveryCardProps {
  idea: Idea; // 复用 packages/shared/src/types/index.ts 的 Idea 类型
}

// Idea 类型已包含 (Story 6.1 添加):
// - isStale?: boolean
// - sources?: SourceItem[]  ← 注意是数组！
// - createdAt: string
```

### 组件结构示例

```tsx
// MemoryRecoveryCard.tsx
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { SourcePreview } from './SourcePreview';
import { useAnalytics } from '@/hooks/useAnalytics';

export function MemoryRecoveryCard({ idea }: MemoryRecoveryCardProps) {
  const { track } = useAnalytics();
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const handleFeedback = (helpful: boolean) => {
    track('memory_recovery_helpful', { ideaId: idea.id, helpful });
    setFeedbackGiven(true);
  };

  const timeAgo = formatDistanceToNow(new Date(idea.createdAt), {
    addSuffix: true,
    locale: zhCN,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30"
    >
      <div className="flex items-center gap-2 text-purple-300 mb-2">
        <span>💡</span>
        <span className="text-sm">记忆恢复</span>
      </div>
      <p className="text-slate-300 text-sm mb-2">
        这个想法创建于 <span className="text-purple-400">{timeAgo}</span>
      </p>
      {idea.sources?.length > 0 && (
        <div className="mb-3">
          <SourcePreview sources={idea.sources} />
        </div>
      )}
      {!feedbackGiven ? (
        <div className="flex gap-2 mt-3">
          <button onClick={() => handleFeedback(true)} className="...">
            👍 有帮助
          </button>
          <button onClick={() => handleFeedback(false)} className="...">
            👎 没帮助
          </button>
        </div>
      ) : (
        <p className="text-purple-400 text-sm mt-3">感谢反馈！</p>
      )}
    </motion.div>
  );
}
```

### 关键代码位置

| 模块          | 文件路径                                                                       |
| ------------- | ------------------------------------------------------------------------------ |
| **新组件**    | `apps/web/src/features/ideas/components/MemoryRecoveryCard.tsx` [NEW]          |
| **测试文件**  | `apps/web/src/features/ideas/components/MemoryRecoveryCard.test.tsx` [NEW]     |
| **详情集成**  | `apps/web/src/features/ideas/components/IdeaDetail.tsx` (或相关详情组件) [MOD] |
| **来源预览**  | `apps/web/src/features/ideas/components/SourcePreview.tsx` [REUSE]             |
| **埋点 Hook** | `apps/web/src/hooks/useAnalytics.ts` [REUSE]                                   |
| **共享类型**  | `packages/shared/src/types/index.ts` [REUSE] ← Idea 类型                       |

### Previous Story Intelligence (Story 6.1 & 6.2)

**从 Story 6.1 学习：**

- ✅ `idea.isStale` 字段已在 Prisma Schema 和前端类型中添加
- ✅ `sources` 是数组类型 (`sources[]`)，注意不是 `source`
- ✅ IdeaCard 已有沉底视觉样式 (💤 图标 + 紫色边框)，可参考风格保持一致

**从 Story 6.2 学习：**

- ✅ Arco Design 组件集成方式
- ✅ 前端服务/hooks/stores 目录结构规范
- ✅ 埋点使用 `analyticsService.track()` 模式

### References

- [epics.md#Story 6.3](file:///Users/offer/offer_work/ideaFlow/_bmad-output/planning-artifacts/epics.md)
- [6-1-stale-idea-detection.md](file:///Users/offer/offer_work/ideaFlow/_bmad-output/implementation-artifacts/6-1-stale-idea-detection.md) ⭐
- [6-2-stale-reminder-notification.md](file:///Users/offer/offer_work/ideaFlow/_bmad-output/implementation-artifacts/6-2-stale-reminder-notification.md) ⭐
- [project-context.md](file:///Users/offer/offer_work/ideaFlow/_bmad-output/project-context.md)
- [IdeaCard.tsx](file:///Users/offer/offer_work/ideaFlow/apps/web/src/features/ideas/components/IdeaCard.tsx)

## Dev Agent Record

### Agent Model Used

Gemini 2.5 Pro (Antigravity Dev Agent)

### Debug Log References

- 7 tests passed: `pnpm test:web -- --run MemoryRecoveryCard`

### Completion Notes List

- Task 1: 创建 `MemoryRecoveryCard.tsx` 组件，包含渐变背景、相对时间、来源预览
- Task 2: 在 `IdeaDetail.tsx` 中集成，仅对 `isStale=true` 的想法显示
- Task 3: 反馈按钮使用 `useAnalytics` Hook 记录埋点事件 `memory_recovery_helpful`
- Task 4: 编写 7 个单元测试，覆盖所有 AC

### File List

- [NEW] [MemoryRecoveryCard.tsx](file:///Users/offer/offer_work/ideaFlow/apps/web/src/features/ideas/components/MemoryRecoveryCard.tsx)
- [NEW] [MemoryRecoveryCard.test.tsx](file:///Users/offer/offer_work/ideaFlow/apps/web/src/features/ideas/components/MemoryRecoveryCard.test.tsx)
- [MOD] [IdeaDetail.tsx](file:///Users/offer/offer_work/ideaFlow/apps/web/src/features/ideas/components/IdeaDetail.tsx)
- [MOD] [package.json](file:///Users/offer/offer_work/ideaFlow/apps/web/package.json) (added date-fns -> refactored to dayjs)

## Senior Developer Review (AI)

### 🔴 HIGH SEVERITY ISSUES (FIXED)

- **架构不一致**: 已移除冗余的 `date-fns` 依赖，统一使用项目中既有的 `dayjs` 工具函数 `formatRelativeTime`。
- **缺失集成测试**: 已在 `IdeaDetail.test.tsx` 中增加集成验证，确保卡片按需挂载。

### 🟡 MEDIUM ISSUES (FIXED)

- **无障碍支持**: 为反馈按钮增加了 `aria-label` 和 `title` 属性。

### 🟢 LOW ISSUES (FIXED)

- **埋点细节**: `memory_recovery_helpful` 事件现在包含 `daysStale` 字段，用于衡量时间跨度的价值。
- **健壮性**: 使用 `dayjs` 进行安全的日期解析。

**Outcome: Approved (After AI-Fixes)**
_Reviewer: Offer (AI Persona) on 2026-01-21_
