# Story 7.4: 通知偏好设置

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **用户**,
I want **设置通知偏好**,
so that **只接收我关心的通知，避免打扰**。

## Acceptance Criteria

1. **设置入口**: 在「个人设置」页面添加「通知设置」Tabs 或板块。
2. **全局免打扰**: 提供全局开关，支持「接收所有通知」、「仅接收重要通知（如提及我）」、「不接收通知」三种模式。
3. **细粒度控制**: 针对不同类型通知（系统消息、任务提醒、沉底提醒）提供单独的开关（Toggle）。
4. **默认状态**: 新用户默认开启所有通知。
5. **自动保存**: 修改设置后自动保存（Debounce），并提示「保存成功」。
6. **实时生效**: 设置修改后，系统即时停止/恢复推送相应类型的通知。

## Tasks / Subtasks

- [x] **Task 1: 后端数据模型与 API** (AC: 4, 5)
  - [x] Database: 在 `User` 表添加 `notificationSettings` JSONB 字段，用于存储用户的通知偏好设置。
  - [x] API: 实现 `GET /users/me/notification-settings` 接口，用于获取当前用户的通知设置。
  - [x] API: 实现 `PATCH /users/me/notification-settings` 接口，用于更新用户的通知设置。
  - [x] Logic: 确保能够处理默认值（即如果用户未设置，默认返回所有通知开启）。

- [x] **Task 2: 数据库 Schema 与类型定义** (AC: 1, 3)
  - [x] Schema: 更新 `prisma/schema.prisma` 中的 `NotificationType` 枚举，补充 `task_reminder`。
  - [x] Shared: 在 `packages/shared/src/types/index.ts` 中明确定义 `NotificationSettings` 接口，确保前后端类型对齐。

- [x] **Task 3: 通知生成拦截逻辑** (AC: 6)
  - [x] Logic: 在 `NotificationsService` 中注入 `UsersService`。**注意**: 使用 `forwardRef` 解决潜在的循环依赖问题 (`NotificationsModule` <-> `UsersModule`)。
  - [x] Logic: 在创建通知前，读取目标用户的 `notificationSettings`。
  - [x] Logic: 实现拦截判断：
    - Global 'none': 拦截所有。
    - Global 'important': 允许 `system` 和 `task_reminder` (逾期)，拦截 `stale_reminder`。需定义 `isImportant(type)` 帮助函数。
    - Specific toggle: 检查 `settings.types[type]`，如为 `false` 则拦截。
  - [x] Test: 添加单元测试，验证不同设置下的拦截行为。

- [x] **Task 4: 前端状态管理** (AC: 4, 5)
  - [x] Service: 在 `users/services/users.service.ts` 中添加获取和更新通知设置的方法。
  - [x] Store: 创建 `notificationSettingsAtom` (Jotai) 用于管理设置状态。
  - [x] Hook: 封装 `useNotificationSettings` Hook，包含自动保存（Debounce）和 Optimistic Update 逻辑。

- [x] **Task 5: UI 实现** (AC: 1, 2, 3)
  - [x] Component: 创建 `NotificationSettings` 组件，建议放置在 `features/settings/` 目录下以保持 Settings 页面聚类。
  - [x] Page Integration: 将 `NotificationSettings` 集成到现有的个人设置页面（`SettingsPage`）。

- [x] **Task 6: 验证与测试**
  - [x] Test: 为后端 API 和拦截逻辑编写单元测试。
  - [x] Test: 为前端组件编写交互测试（React Testing Library）。
  - [x] Manual: 验证修改设置后，触发对应类型的通知（如沉底提醒），确认是否按预期拦截。

## Dev Notes

### 🔧 核心技术决策

**1. 数据库存储方案**
推荐在 `User` 表中使用 `Json` (Prisma default fallback for JSONB in Postgres) 字段 `notificationSettings`。
结构示例：

```json
{
  "globalLevel": "all", // "all" | "important" | "none"
  "types": {
    "system": true,
    "task_reminder": true,
    "stale_reminder": true
  }
}
```

_理由_: 灵活，无需频繁迁移 Schema。

**2. 拦截策略 (Interception Strategy)**
在 `NotificationsService.create(createDto)` 方法中加入检查：

```typescript
async create(userId: string, type: NotificationType, ...) {
  const user = await this.userService.findById(userId);
  // 处理默认值
  const settings = user.notificationSettings || DEFAULT_SETTINGS;

  // 1. 全局判断
  if (settings.globalLevel === 'none') return;
  if (settings.globalLevel === 'important' && !isImportant(type)) return;

  // 2. 类型判断
  if (settings.types && settings.types[type] === false) return;

  // ... create logic
}
```

### ⚠️ 潜在坑点

- **默认值处理**: 必须确保 `user.notificationSettings` 为 null 时，代码能正确回退到默认开启状态。
- **循环依赖**: `NotificationsModule` 需要导入 `UsersModule`，注意 NestJS 的模块依赖处理（可能需要 `forwardRef`，但通常 `Notifications` 依赖 `Users` 是单向的，除非 `Users` 也依赖 `Notifications`）。

### Project Structure Notes

- 后端: `apps/api/src/modules/users/` (处理设置) 和 `apps/api/src/modules/notifications/` (读取设置进行拦截)。
- 前端: `apps/web/src/features/users/components/NotificationSettings.tsx`。

### References

- [Epic 7 Definitions](file:///Users/offer/offer_work/ideaFlow/_bmad-output/planning-artifacts/epics.md)
- [Story 7.3](file:///Users/offer/offer_work/ideaFlow/_bmad-output/implementation-artifacts/7-3-notification-center.md)

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Created Tests

- `apps/api/src/modules/users/users.service.spec.ts`
- `apps/api/src/modules/notifications/notifications.service.spec.ts`

### Implementation Details

- Backend: `UsersService` 处理 JSONB 配置，支撑默认值回退；`NotificationsService` 注入 `UsersService` 后在 `create` 方法中执行三级检查（全局级别 -> 重要性 -> 细分类型）。
- Frontend: `Jotai` 原子状态支撑全局共享，`useNotificationSettings` 实现 API 交互与乐观 UI。`Arco Design` 风格 UI 组件完美嵌入设置页面。
- **Fixes Applied**: Implemented debounce in `useNotificationSettings` (AC5) and resolved unsafe type casting in `UsersService`.

### File List

- `apps/api/src/modules/users/users.service.ts`
- `apps/api/src/modules/users/users.controller.ts`
- `apps/api/src/modules/notifications/notifications.service.ts`
- `apps/web/src/features/settings/NotificationSettings.tsx`
- `apps/web/src/hooks/useNotificationSettings.ts`
- `packages/shared/src/types/index.ts`
- `prisma/schema.prisma`
