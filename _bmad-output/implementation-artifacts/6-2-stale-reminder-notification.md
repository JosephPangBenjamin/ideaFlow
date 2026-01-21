# Story 6.2: 沉底提醒通知 (Stale Reminder Notification)

Status: done

## Story

As a 用户,
I want 收到沉底点子的提醒,
so that 回顾被遗忘的想法.

## Acceptance Criteria

1. **沉底提醒通知生成**:
   - **Given** 用户有沉底点子（`isStale: true`）
   - **When** 定时任务（沉底检测后触发）检测到用户有新的沉底点子
   - **Then** 系统为该用户创建一条应用内通知
   - **And** 通知内容为「你有 N 个想法放了超过 7 天，要不要看看？」
   - **And** 同一用户每天最多收到一条沉底提醒（防骚扰）

2. **通知列表查看**:
   - **Given** 用户在任意页面
   - **When** 点击顶部导航栏的通知图标（🔔）
   - **Then** 弹出通知下拉菜单
   - **And** 显示未读通知列表（按时间倒序）
   - **And** 未读通知有视觉区分（加粗或标记）

3. **通知详情交互**:
   - **Given** 用户点击通知
   - **When** 进入详情
   - **Then** 跳转到沉底点子列表（`/ideas?isStale=true`）
   - **And** 该通知标记为已读

4. **通知未读计数**:
   - **Given** 用户有未读通知
   - **When** 查看顶部导航栏
   - **Then** 通知图标显示未读数量徽章（红色圆点 + 数字）
   - **And** 点击通知后徽章数量减少（乐观更新）

5. **通知 API**:
   - **Given** 前端请求通知列表
   - **When** API 返回数据
   - **Then** 响应包含分页通知列表
   - **And** 每条通知包含 `id`, `type`, `title`, `message`, `data`, `isRead`, `createdAt`
   - **And** 支持 `?isRead=false` 筛选未读通知

6. **通知空状态**:
   - **Given** 用户没有任何通知
   - **When** 打开通知下拉菜单
   - **Then** 显示「暂无通知」空状态提示

## Tasks / Subtasks

- [x] Task 1: 数据库 Schema 更新 (AC: #1, #5)
  - [x] 1.1 在 `prisma/schema.prisma` 添加 `Notification` 模型
  - [x] 1.2 添加 `NotificationType` 枚举（`stale_reminder`, `system`）
  - [x] 1.3 添加索引：`@@index([userId])`, `@@index([isRead])`, `@@index([createdAt])`
  - [x] 1.4 在 `User` 模型添加 `notifications Notification[]` 关系
  - [x] 1.5 运行 `npx prisma db push` 更新数据库

- [x] Task 2: 后端 - 通知模块创建 (AC: #5)
  - [x] 2.1 创建 `apps/api/src/modules/notifications/` 目录
  - [x] 2.2 创建 `notifications.module.ts`（导出 `NotificationsService`）
  - [x] 2.3 创建 `notifications.service.ts`
  - [x] 2.4 创建 `notifications.controller.ts`
  - [x] 2.5 创建 DTOs: `create-notification.dto.ts`, `get-notifications.dto.ts`
  - [x] 2.6 在 `app.module.ts` 注册 `NotificationsModule`

- [x] Task 3: 后端 - 通知服务实现 (AC: #1, #5)
  - [x] 3.1 `create()` - 创建通知
  - [x] 3.2 `findAll()` - 分页 + isRead 筛选
  - [x] 3.3 `markAsRead()` - 标记单条已读
  - [x] 3.4 `markAllAsRead()` - 全部已读
  - [x] 3.5 `getUnreadCount()` - 未读数量
  - [x] 3.6 `hasSentTodayByType()` - 防骚扰检查
  - [x] 3.7 编写 `notifications.service.spec.ts` 单元测试

- [x] Task 4: 后端 - 沉底提醒服务（独立模块避免循环依赖）(AC: #1)
  - [x] 4.1 创建 `apps/api/src/modules/notifications/stale-reminder.service.ts`
  - [x] 4.2 注入 `PrismaService` 和 `NotificationsService`
  - [x] 4.3 实现 `sendStaleReminders()` 方法
  - [x] 4.4 在 `StaleDetectionService.handleStaleDetection()` 末尾调用（使用事件或直接导入）
  - [x] 4.5 使用 `forwardRef()` 或事件解耦处理 `IdeasModule` ⇔ `NotificationsModule` 依赖
  - [x] 4.6 更新单元测试

- [x] Task 5: 前端 - 类型定义 (AC: #2, #5)
  - [x] 5.1 `packages/shared/src/types/index.ts` 添加 `Notification` 和 `NotificationType`
  - [x] 5.2 `apps/web/src/features/notifications/types.ts` 前端类型

- [x] Task 6: 前端 - 通知服务层 (AC: #5)
  - [x] 6.1 创建 `apps/web/src/features/notifications/` 目录
  - [x] 6.2 `services/notifications.service.ts` - API 调用
  - [x] 6.3 `stores/notifications.ts` - Jotai atoms
  - [x] 6.4 `hooks/useNotifications.ts` - 带乐观更新的 hook

- [x] Task 7: 前端 - 通知 UI 组件 (AC: #2, #3, #4, #6)
  - [x] 7.1 `components/NotificationBell.tsx` - 使用 `IconNotification` (Arco Design)
  - [x] 7.2 `components/NotificationDropdown.tsx` - 使用 `Dropdown` (Arco Design)
  - [x] 7.3 `components/NotificationItem.tsx` - 通知项
  - [x] 7.4 在 `components/Layout.tsx` header 区域集成 NotificationBell

- [x] Task 8: 前端 - 通知跳转与更新策略 (AC: #3)
  - [x] 8.1 点击通知 → 调用 `markAsRead` + 乐观更新计数
  - [x] 8.2 `stale_reminder` 类型跳转 `/ideas?isStale=true`
  - [x] 8.3 更新策略：首次加载 + 页面切换刷新（MVP 不实现 WebSocket）

- [x] Task 9: 验证与测试 (AC: 全部)
  - [x] 9.1 后端：NotificationsService 单元测试通过
  - [x] 9.2 后端：StaleReminderService 单元测试通过
  - [x] 9.3 手动：触发沉底检测 → 生成通知
  - [x] 9.4 手动：前端通知显示、点击跳转、已读标记
  - [x] 9.5 更新 `sprint-status.yaml`

## Dev Notes

### 🎯 核心实现思路

- **通知模块独立**：为 Epic 7 通知中心打基础
- **独立提醒服务**：`StaleReminderService` 放在 `NotificationsModule` 避免循环依赖
- **防骚扰**：每用户每日最多一条 `stale_reminder`
- **乐观更新**：点击通知时前端先减少计数，API 失败时回滚

### ⚠️ 关键约束

| 约束          | 要求                                                                   |
| ------------- | ---------------------------------------------------------------------- |
| **循环依赖**  | ⚠️ 使用 `StaleReminderService` 在 `NotificationsModule` 或使用事件解耦 |
| **UI 组件库** | 使用 Arco Design：`IconNotification`, `Dropdown`, `Badge`              |
| **布局集成**  | 在 `components/Layout.tsx` 的 header 区域添加                          |
| **更新策略**  | 首次加载 + 页面切换刷新，MVP 不实现 WebSocket                          |
| **API 前缀**  | `/ideaFlow/api/v1/notifications`                                       |
| **认证**      | 所有 API 需 `@UseGuards(JwtAuthGuard)`                                 |
| **TDD**       | 先写测试，核心方法 100% 覆盖                                           |

### Prisma Schema

```prisma
enum NotificationType {
  stale_reminder
  system
}

model Notification {
  id        String           @id @default(cuid())
  userId    String           @map("user_id")
  type      NotificationType
  title     String
  message   String
  data      Json?
  isRead    Boolean          @default(false) @map("is_read")
  createdAt DateTime         @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([isRead])
  @@index([createdAt])
  @@map("notifications")
}

// User 模型添加:
// notifications Notification[]
```

### 循环依赖解决方案

```typescript
// 方案：将 sendStaleReminders 放在 NotificationsModule
// apps/api/src/modules/notifications/stale-reminder.service.ts
@Injectable()
export class StaleReminderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService
  ) {}

  async sendReminders(): Promise<void> {
    const usersWithStale = await this.prisma.idea.groupBy({
      by: ['userId'],
      where: { isStale: true, deletedAt: null },
      _count: true,
    });

    for (const user of usersWithStale) {
      const alreadySent = await this.notificationsService.hasSentTodayByType(
        user.userId,
        'stale_reminder'
      );
      if (alreadySent) continue;

      await this.notificationsService.create(user.userId, {
        type: 'stale_reminder',
        title: '沉底点子提醒',
        message: `你有 ${user._count} 个想法放了超过 7 天，要不要看看？`,
        data: { staleCount: user._count },
      });
    }
  }
}

// stale-detection.service.ts 修改
@Injectable()
export class StaleDetectionService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => StaleReminderService))
    private readonly staleReminderService: StaleReminderService
  ) {}

  @Cron('0 2 * * *')
  async handleStaleDetection() {
    // ... 现有检测逻辑 ...
    await this.staleReminderService.sendReminders();
  }
}
```

### 前端组件（使用 Arco Design）

```tsx
// NotificationBell.tsx
import { IconNotification } from '@arco-design/web-react/icon';
import { Badge, Dropdown } from '@arco-design/web-react';

export function NotificationBell() {
  const [unreadCount] = useAtom(unreadCountAtom);

  return (
    <Dropdown droplist={<NotificationDropdown />} trigger="click">
      <Badge count={unreadCount} maxCount={99}>
        <motion.button className="p-2 rounded-lg hover:bg-white/10">
          <IconNotification className="w-5 h-5 text-slate-300" />
        </motion.button>
      </Badge>
    </Dropdown>
  );
}
```

### API 端点

| 方法  | 端点                                          | 描述                   |
| ----- | --------------------------------------------- | ---------------------- |
| GET   | `/ideaFlow/api/v1/notifications`              | 分页列表 + isRead 筛选 |
| GET   | `/ideaFlow/api/v1/notifications/unread-count` | 未读数量               |
| PATCH | `/ideaFlow/api/v1/notifications/:id/read`     | 单条已读               |
| PATCH | `/ideaFlow/api/v1/notifications/read-all`     | 全部已读               |

### 关键代码位置

| 模块          | 文件路径                                                              |
| ------------- | --------------------------------------------------------------------- |
| Prisma Schema | `prisma/schema.prisma`                                                |
| 通知模块      | `apps/api/src/modules/notifications/` (新建)                          |
| 沉底提醒服务  | `apps/api/src/modules/notifications/stale-reminder.service.ts` (新建) |
| 沉底检测服务  | `apps/api/src/modules/ideas/stale-detection.service.ts` (修改)        |
| 共享类型      | `packages/shared/src/types/index.ts` (修改)                           |
| 前端通知      | `apps/web/src/features/notifications/` (新建)                         |
| 布局集成      | `apps/web/src/components/Layout.tsx` (修改)                           |

### References

- [epics.md#Story 6.2](file:///Users/offer/offer_work/ideaFlow/_bmad-output/planning-artifacts/epics.md)
- [6-1-stale-idea-detection.md](file:///Users/offer/offer_work/ideaFlow/_bmad-output/implementation-artifacts/6-1-stale-idea-detection.md) ⭐
- [architecture.md](file:///Users/offer/offer_work/ideaFlow/_bmad-output/planning-artifacts/architecture.md)
- [Layout.tsx](file:///Users/offer/offer_work/ideaFlow/apps/web/src/components/Layout.tsx)
- [project-context.md](file:///Users/offer/offer_work/ideaFlow/_bmad-output/project-context.md)

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

- [NEW] [apps/api/src/modules/notifications/](file:///Users/offer/offer_work/ideaFlow/apps/api/src/modules/notifications/)
- [NEW] [apps/web/src/features/notifications/](file:///Users/offer/offer_work/ideaFlow/apps/web/src/features/notifications/)
- [MOD] [apps/api/src/app.module.ts](file:///Users/offer/offer_work/ideaFlow/apps/api/src/app.module.ts)
- [MOD] [apps/api/src/modules/ideas/ideas.module.ts](file:///Users/offer/offer_work/ideaFlow/apps/api/src/modules/ideas/ideas.module.ts)
- [MOD] [apps/api/src/modules/ideas/stale-detection.service.ts](file:///Users/offer/offer_work/ideaFlow/apps/api/src/modules/ideas/stale-detection.service.ts)
- [MOD] [apps/web/src/components/Layout.tsx](file:///Users/offer/offer_work/ideaFlow/apps/web/src/components/Layout.tsx)
- [MOD] [packages/shared/src/types/index.ts](file:///Users/offer/offer_work/ideaFlow/packages/shared/src/types/index.ts)
- [MOD] [prisma/schema.prisma](file:///Users/offer/offer_work/ideaFlow/prisma/schema.prisma)
- [MOD] [\_bmad-output/implementation-artifacts/sprint-status.yaml](file:///Users/offer/offer_work/ideaFlow/_bmad-output/implementation-artifacts/sprint-status.yaml)
- [NEW] [apps/api/src/modules/notifications/stale-reminder.service.spec.ts](file:///Users/offer/offer_work/ideaFlow/apps/api/src/modules/notifications/stale-reminder.service.spec.ts)
