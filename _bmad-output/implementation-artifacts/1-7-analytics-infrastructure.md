# Story 1.7: 数据埋点基础架构

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **产品经理**,
I want **系统具备记录关键用户行为的能力**,
so that **我可以分析用户的使用模式**.

**FRs Covered**: FR42

## Acceptance Criteria

1. **Given** 用户完成注册 **When** 注册成功 **Then** 系统记录 `user_registered` 事件 **And** 包含时间戳和用户ID。
2. **Given** 用户登录 **When** 登录成功 **Then** 系统记录 `user_logged_in` 事件。
3. **Given** 埋点数据 **When** 存储到数据库 **Then** 包含事件名称、用户ID、时间戳和元数据 JSON **And** 支持未来扩展更多事件类型。
4. **Given** 前端应用 **When** 发生关键操作 **Then** 可以使用 `useAnalytics` Hook 来追踪事件。

## Tasks / Subtasks

- [x] Task 1: 数据库 Schema 与后端设置 (AC: #3)
  - [x] 在 `prisma/schema.prisma` 中添加 `AnalyticsEvent` 模型 (字段: id, userId, eventName, metadata, createdAt)
  - [x] 创建 `apps/api/src/modules/analytics` 模块、服务和控制器
  - [x] 实现 `POST /analytics/track` 端点

- [x] Task 2: 后端集成与事件 (AC: #1, #2)
  - [x] 将 `AnalyticsService` 集成到 `AuthService`
  - [x] 在 `register` 方法中追踪 `user_registered`
  - [x] 在 `login` 方法中追踪 `user_logged_in`
  - [x] 为 `AnalyticsService` 编写单元测试

- [x] Task 3: 前端实现 (AC: #4)
  - [x] 创建 `apps/web/src/hooks/useAnalytics.ts`
  - [x] 实现调用后端 API 的 `track(eventName, metadata)` 函数
  - [x] 创建 `apps/web/src/services/analytics.service.ts`

- [x] Task 4: 集成验证
  - [x] 验证注册和登录时数据库是否创建了记录
  - [x] 确保 `metadata` JSON 被正确存储和读取

## Dev Notes

### 🏗️ Architecture Compliance

**Database Schema**:

```prisma
model AnalyticsEvent {
  id        String   @id @default(uuid())
  userId    String?  // 对于匿名事件可选，但对于 FR42 核心范围是必需的
  eventName String
  metadata  Json?
  createdAt DateTime @default(now())

  user      User?    @relation(fields: [userId], references: [id])
  @@index([userId])
  @@index([eventName])
  @@map("analytics_events")
}
```

**API Endpoints**:

- `POST /ideaFlow/api/v1/analytics/track`
  - Body: `{ eventName: string, metadata?: object }`
  - Auth: 由 JWT 保护 (从 token 提取用户 ID)

### 🔧 Implementation Patterns

- **异步追踪**: 事件追踪不应阻塞关键流程（如登录/注册）。在后端服务中使用 `void this.analyticsService.track(...)` 或类似的即发即弃模式，但要优雅地处理错误（仅记录日志），以便即使追踪失败，主流程也能成功。
- **前端 Hook**:
  ```typescript
  const { track } = useAnalytics();
  // 使用示例
  track('some_interaction', { buttonId: '123' });
  ```

### 📁 File Structure

- Service: `apps/api/src/modules/analytics/analytics.service.ts`
- Controller: `apps/api/src/modules/analytics/analytics.controller.ts`
- Frontend Hook: `apps/web/src/hooks/useAnalytics.ts`

### Testing Standards

- **Backend**: Mock `PrismaService` 以验证 `analyticsEvent.create` 被调用。
- **Integration**: 验证 `AuthService` 调用 `AnalyticsService` 时，如果关注阻塞性能则不使用 await（虽然对于 MV 来说为了可靠性使用 `await` 也是可接受的）。

### References

- [Epics: Story 1.6 (Data Analytics)](file:///Users/offer/offer_work/ideaFlow/_bmad-output/planning-artifacts/epics.md#L541-L570)
- [Architecture: Requirements Mapping](file:///Users/offer/offer_work/ideaFlow/_bmad-output/planning-artifacts/architecture.md#L509)

## Dev Agent Record

### Agent Model Used

Gemini Antigravity

### Debug Log References

### Completion Notes List

- [Fixed] Critical: Removed redundant API path prefix in `AnalyticsController`. Fixed `double-prefix` bug where route was `ideaFlow/api/v1/ideaFlow/api/v1/analytics`. Corrected to `analytics`.

### File List
