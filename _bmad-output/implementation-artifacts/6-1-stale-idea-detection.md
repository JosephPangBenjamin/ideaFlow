# Story 6.1: 沉底点子识别 (Stale Idea Detection)

Status: done

## Story

As a 系统,
I want 识别 7天+ 未操作的想法,
so that 帮助用户发现被遗忘的点子.

## Acceptance Criteria

1. **沉底状态自动标记**:
   - **Given** 想法创建或最后更新时间
   - **When** 超过 7 天未操作（无编辑、无查看详情）
   - **Then** 系统自动标记该想法为「沉底点子」状态
   - **And** 沉底状态基于 `updatedAt` 字段计算

2. **沉底想法视觉标识**:
   - **Given** 沉底点子
   - **When** 在想法列表中显示
   - **Then** 卡片右上角显示 💤 图标
   - **And** 使用淡紫色背景区分（与现有 IdeaCard 风格一致）

3. **定时任务更新沉底状态**:
   - **Given** 定时任务运行（每日凌晨 2:00）
   - **When** 扫描所有想法
   - **Then** 更新 7天+ 未操作的想法为 `isStale: true`
   - **And** 将 7天内有操作的想法恢复为 `isStale: false`

4. **沉底想法筛选**:
   - **Given** 用户在想法列表
   - **When** 展开筛选面板
   - **Then** 可选择「仅显示沉底点子」筛选项
   - **And** 显示沉底想法计数（如「💤 3 个点子等待回顾」）

5. **沉底状态查询 API**:
   - **Given** 前端请求想法列表
   - **When** API 返回数据
   - **Then** 每个想法包含 `isStale: boolean` 字段
   - **And** 支持 `?isStale=true` 筛选参数

## Tasks / Subtasks

- [x] Task 1: 数据库 Schema 更新 (AC: #1, #3)
  - [x] 1.1 在 `prisma/schema.prisma` 的 `Idea` 模型添加 `isStale Boolean @default(false)` 字段
  - [x] 1.2 添加 `@@index([isStale])` 优化查询性能
  - [x] 1.3 运行 `npx prisma db push` (使用 db push 替代 migrate，因权限问题)
  - [x] 1.4 自动生成 Prisma Client

- [x] Task 2: 后端 - 沉底检测服务 (AC: #1, #3)
  - [x] 2.1 创建 `apps/api/src/modules/ideas/stale-detection.service.ts`
  - [x] 2.2 实现 `handleStaleDetection()` 定时任务方法
  - [x] 2.3 添加 `runManualDetection()` 和 `getStaleCount()` 公开方法
  - [x] 2.4 编写 `stale-detection.service.spec.ts` 单元测试

- [x] Task 3: 后端 - 模块注册与定时任务配置 (AC: #3)
  - [x] 3.1 安装依赖：`pnpm add @nestjs/schedule --filter=api`
  - [x] 3.2 在 `app.module.ts` 导入 `ScheduleModule.forRoot()`
  - [x] 3.3 在 `ideas.module.ts` 的 providers 添加 `StaleDetectionService`
  - [x] 3.4 添加日志记录定时任务执行结果

- [x] Task 4: 后端 - API 更新支持沉底筛选 (AC: #5)
  - [x] 4.1 更新 `GetIdeasFilterDto` 添加 `isStale?: boolean` 参数
  - [x] 4.2 更新 `IdeasService.findAll()` 支持 `isStale` 和 `deletedAt: null` 条件
  - [x] 4.3 API 响应包含 `isStale` 字段 (Prisma 自动返回)
  - [x] 4.4 单元测试通过

- [x] Task 5: 前端 - 类型定义更新 (AC: #2, #5)
  - [x] 5.1 更新 `packages/shared/src/types/index.ts` 的 `Idea` 接口添加 `isStale?: boolean`
  - [x] 5.2 更新 `apps/web/src/features/ideas/types.ts` 添加 `isStale?: boolean`

- [x] Task 6: 前端 - 沉底状态视觉展示 (AC: #2)
  - [x] 6.1 更新 `IdeaCard.tsx`：保持 `motion.div` 结构，添加 💤 图标
  - [x] 6.2 添加沉底条件样式：`idea.isStale && 'ring-1 ring-purple-500/40'`
  - [x] 6.3 添加 title 提示：「这个点子已经沉底 7 天了」

- [x] Task 7: 前端 - 筛选面板增强 (AC: #4)
  - [x] 7.1 在 `useIdeaFilters.ts` 添加 `ideaIsStaleAtom` 状态
  - [x] 7.2 更新 `ideaFiltersAtom` 合并 `isStale` 筛选条件
  - [x] 7.3 更新 `IdeaFilterPanel.tsx` 添加沉底筛选复选框
  - [x] 7.4 前端 API 自动传递 isStale 参数 (通过 filters 对象)

- [x] Task 8: 验证与测试 (AC: 全部)
  - [x] 8.1 后端测试：21 个测试全部通过 (stale-detection + ideas.service)
  - [x] 8.2 StaleDetectionService 单元测试覆盖完整
  - [x] 8.3 前端代码实现完成，待手动验证
  - [x] 8.4 更新 `sprint-status.yaml` 状态

## Dev Notes

### 🎯 核心实现思路

- 使用 `updatedAt` 字段判断最后操作时间（7 天 = 604800000 毫秒）
- 定时任务每日凌晨 2:00 扫描，使用 `updateMany` 批量操作
- 提供手动触发方法便于开发测试

### ⚠️ 关键约束

| 约束         | 要求                                          |
| ------------ | --------------------------------------------- |
| **沉底阈值** | 固定 7 天                                     |
| **性能优化** | `updateMany` 批量 + `@@index([isStale])`      |
| **API 兼容** | `isStale` 默认返回，不破坏现有接口            |
| **代码风格** | 保持 IdeaCard 的 `motion.div` 结构            |
| **模块注册** | StaleDetectionService 必须在 IdeasModule 注册 |

### 沉底检测服务（精简版）

```typescript
// stale-detection.service.ts - 关键逻辑
@Injectable()
export class StaleDetectionService {
  private readonly STALE_DAYS = 7;

  constructor(private readonly prisma: PrismaService) {}

  @Cron('0 2 * * *')
  async handleStaleDetection() {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - this.STALE_DAYS);

    await Promise.all([
      this.prisma.idea.updateMany({
        where: { updatedAt: { lt: threshold }, isStale: false, deletedAt: null },
        data: { isStale: true },
      }),
      this.prisma.idea.updateMany({
        where: { updatedAt: { gte: threshold }, isStale: true },
        data: { isStale: false },
      }),
    ]);
  }

  // 开发/测试用 - 手动触发
  async runManualDetection() {
    return this.handleStaleDetection();
  }
}
```

### 模块注册（必须）

```typescript
// ideas.module.ts
import { StaleDetectionService } from './stale-detection.service';

@Module({
  imports: [PrismaModule],
  controllers: [IdeasController],
  providers: [IdeasService, StaleDetectionService], // ⚠️ 必须添加
})
export class IdeasModule {}
```

### Prisma Schema 更新

```prisma
model Idea {
  // ... 现有字段
  isStale     Boolean   @default(false) @map("is_stale")

  @@index([isStale])
}
```

### useIdeaFilters Hook 扩展

```typescript
// useIdeaFilters.ts - 添加 isStale atom
export const ideaIsStaleAtom = atom<boolean | null>(null);

export const ideaFiltersAtom = atom((get) => {
  const dateRange = get(ideaDateRangeAtom);
  const sort = get(ideaSortAtom);
  const isStale = get(ideaIsStaleAtom);

  return {
    startDate: dateRange.startDate || undefined,
    endDate: dateRange.endDate || undefined,
    sortBy: sort.sortBy,
    sortOrder: sort.sortOrder,
    isStale: isStale ?? undefined,
  };
});
```

### IdeaCard 沉底样式（保持现有风格）

```tsx
// IdeaCard.tsx - 在现有 motion.div 基础上添加
<motion.div className={`rounded-2xl p-6 ... ${idea.isStale ? 'ring-1 ring-purple-500/30' : ''}`}>
  {idea.isStale && (
    <div className="absolute top-3 right-3 text-lg opacity-80" title="沉底 7 天了">
      💤
    </div>
  )}
  {/* 现有内容 */}
</motion.div>
```

### 关键代码位置

| 模块              | 文件路径                                                            |
| ----------------- | ------------------------------------------------------------------- |
| **Prisma Schema** | `prisma/schema.prisma`                                              |
| **沉底检测服务**  | `apps/api/src/modules/ideas/stale-detection.service.ts` (新建)      |
| **模块注册**      | `apps/api/src/modules/ideas/ideas.module.ts` (修改)                 |
| **想法 DTO**      | `apps/api/src/modules/ideas/dto/get-ideas-filter.dto.ts` (修改)     |
| **想法服务**      | `apps/api/src/modules/ideas/ideas.service.ts` (修改)                |
| **共享类型**      | `packages/shared/src/types/index.ts` (修改)                         |
| **前端类型**      | `apps/web/src/features/ideas/types.ts` (修改)                       |
| **想法卡片**      | `apps/web/src/features/ideas/components/IdeaCard.tsx` (修改)        |
| **筛选 Hook**     | `apps/web/src/features/ideas/hooks/useIdeaFilters.ts` (修改)        |
| **筛选面板**      | `apps/web/src/features/ideas/components/IdeaFilterPanel.tsx` (修改) |

### References

- [Source: epics.md#Story 6.1](file:///Users/offer/offer_work/ideaFlow/_bmad-output/planning-artifacts/epics.md)
- [Source: 5-2-list-filter-sort.md](file:///Users/offer/offer_work/ideaFlow/_bmad-output/implementation-artifacts/5-2-list-filter-sort.md) ⭐ 筛选参考
- [Source: ideas.service.ts](file:///Users/offer/offer_work/ideaFlow/apps/api/src/modules/ideas/ideas.service.ts)
- [Source: IdeaCard.tsx](file:///Users/offer/offer_work/ideaFlow/apps/web/src/features/ideas/components/IdeaCard.tsx)

## Dev Agent Record

### Agent Model Used

Gemini 2.5 Pro → Claude (Code Review)

### Debug Log References

- 21 tests pass: `pnpm test:api -- --testPathPattern="stale-detection|ideas.service"`
- Code Review 后新增 3 个 isStale 筛选单元测试

### Completion Notes List

- Task 1: Prisma schema 更新，使用 `db push` 代替 `migrate dev`（权限问题）
- Task 2-3: StaleDetectionService 创建，@nestjs/schedule 安装和配置完成
- Task 4: API 支持 isStale 筛选，同时添加了 deletedAt: null 条件
- Task 5-7: 前端类型、IdeaCard 视觉展示、筛选面板全部实现
- 预存在的测试失败（canvases.service, ideas.controller, meta.controller）不在本 Story 范围内

**Code Review 修复 (Claude):**

- 🔴 修复 `IdeaCard.tsx` 的 `source` → `sources` 数组访问 Bug
- 🔴 修复 `packages/shared` 类型 `source` → `sources[]` 与 Prisma 一致
- 🔴 实现 AC4 沉底计数显示「💤 N 个点子等待回顾」
- 🟡 修复 cron 恢复逻辑：添加 `deletedAt: null` 条件
- 🟡 新增 3 个 isStale 筛选单元测试
- 🟢 修复 lint warning：移除未使用的 React import
- 🛠️ **Bug Fix (Manual Test):** 修复了更新点子或查看详情时状态不立即恢复的问题（AC3 即时恢复）

### File List

**新建:**

- `apps/api/src/modules/ideas/stale-detection.service.ts`
- `apps/api/src/modules/ideas/stale-detection.service.spec.ts`

**修改:**

- `prisma/schema.prisma` - 添加 isStale 字段和索引
- `apps/api/package.json` - 添加 @nestjs/schedule 依赖
- `apps/api/src/app.module.ts` - 添加 ScheduleModule
- `apps/api/src/modules/ideas/ideas.module.ts` - 注册 StaleDetectionService
- `apps/api/src/modules/ideas/dto/get-ideas-filter.dto.ts` - 添加 isStale 参数
- `apps/api/src/modules/ideas/ideas.service.ts` - 支持 isStale 筛选
- `apps/api/src/modules/ideas/ideas.service.spec.ts` - 更新测试期望 + 新增 isStale 测试
- `packages/shared/src/types/index.ts` - Idea 接口 sources[] + isStale
- `apps/web/src/features/ideas/types.ts` - Idea 接口添加 isStale
- `apps/web/src/features/ideas/components/IdeaCard.tsx` - 💤 图标 + sources 修复
- `apps/web/src/features/ideas/hooks/useIdeaFilters.ts` - ideaIsStaleAtom
- `apps/web/src/features/ideas/components/IdeaFilterPanel.tsx` - 沉底筛选 + 计数显示
- `apps/web/src/features/ideas/services/ideas.service.ts` - getStaleCount API
- `pnpm-lock.yaml` - 依赖锁定更新
