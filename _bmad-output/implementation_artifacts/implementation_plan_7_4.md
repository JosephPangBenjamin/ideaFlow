# Story 7.4: 通知偏好设置

本计划旨在实现用户对通知类型的细粒度控制，包括数据库 Schema 更新、后端拦截逻辑以及前端设置界面。

## User Review Required

> [!IMPORTANT]
> **循环依赖处理**: `NotificationsService` 需要读取用户的 `notificationSettings` 进行拦截，这会导致 `NotificationsModule` 依赖 `UsersModule`。如果 `UsersModule` 也需要发送通知，则需使用 `forwardRef`。

## Proposed Changes

### [Backend/Database]

#### [MODIFY] [schema.prisma](file:///Users/offer/offer_work/ideaFlow/prisma/schema.prisma)

- 更新 `NotificationType` 枚举，增加 `task_reminder`。
- 在 `User` 模型中增加 `notificationSettings` Json 字段。

#### [MODIFY] [NotificationService](file:///Users/offer/offer_work/ideaFlow/apps/api/src/modules/notifications/notifications.service.ts)

- 注入 `UsersService`（使用 `forwardRef`）。
- 在 `create` 方法中实现拦截逻辑：
  - 加载接收者的 `notificationSettings`。
  - 根据 `globalLevel` 和 `types` 开关判断是否继续创建。

#### [NEW] [users.dto.ts](file:///Users/offer/offer_work/ideaFlow/apps/api/src/modules/users/dto/update-notification-settings.dto.ts)

- 定义 `UpdateNotificationSettingsDto`。

#### [MODIFY] [UsersController](file:///Users/offer/offer_work/ideaFlow/apps/api/src/modules/users/users.controller.ts)

- 增加 `GET /users/me/notification-settings`。
- 增加 `PATCH /users/me/notification-settings`。

### [Shared/Frontend]

#### [MODIFY] [types/index.ts](file:///Users/offer/offer_work/ideaFlow/packages/shared/src/types/index.ts)

- 增加 `NotificationSettings` 接口定义。
- 更新 `NotificationType` 联合类型。

#### [NEW] [NotificationSettings.tsx](file:///Users/offer/offer_work/ideaFlow/apps/web/src/features/settings/NotificationSettings.tsx)

- 使用 Arco Design 的 `Radio.Group` 和 `Switch` 实现设置界面。

#### [NEW] [useNotificationSettings.ts](file:///Users/offer/offer_work/ideaFlow/apps/web/src/features/notifications/hooks/useNotificationSettings.ts)

- 封装获取和更新设置的逻辑，包含 Debounce。

---

## Verification Plan

### Automated Tests

- **Backend Unit Tests**:
  - `apps/api/src/modules/notifications/notifications.service.spec.ts`: 增加测试用例，验证当用户关闭某类型通知或开启全局免打扰时，通知是否被拦截。
  - `apps/api/src/modules/users/users.service.spec.ts`: 验证通知设置的保存和读取逻辑。
- **Command**: `pnpm test:api` (针对特定模块)

### Manual Verification

1. 登录系统，进入「设置 -> 通知设置」。
2. 切换「全局免打扰」模式，观察保存提示。
3. 关闭「沉底提醒」开关。
4. 在后台或通过脚本触发一个沉底提醒，验证通知中心是否**未出现**新消息。
5. 开启开关后再次触发，验证消息成功送达。
