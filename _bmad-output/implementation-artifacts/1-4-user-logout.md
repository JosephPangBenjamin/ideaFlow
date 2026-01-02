# Story 1.4: 用户退出登录

Status: done

<!-- Note: This story must be implemented using TDD (Red-Green-Refactor) -->

## Story

As a **已登录用户**,
I want **安全退出登录**,
so that **保护我的账户安全**.

**FRs 覆盖**: FR3

## Acceptance Criteria

1. **Given** 用户已登录 **When** 点击「退出登录」按钮 **Then** 清除本地存储的 Access Token
2. **And** 清除 HttpOnly Cookie 中的 Refresh Token
3. **And** 跳转到登录页面

## Tasks / Subtasks (TDD Approach)

### Phase 1: Backend Tests First (RED)
- [x] Task 1: 编写 AuthService 退出测试
  - [x] 测试 `logout()` - 成功清除 Refresh Token (如果服务端存储了 Token)
- [x] Task 2: 编写 AuthController E2E 测试
  - [x] 测试 `POST /ideaFlow/api/v1/auth/logout` - 200 成功
  - [x] 测试 `POST /ideaFlow/api/v1/auth/logout` - 验证 Set-Cookie 清除指令 (Max-Age=0)

### Phase 2: Backend Implementation (GREEN)
- [x] Task 3: 实现 Backend Logout 逻辑
  - [x] 在 `AuthController` 添加 `/logout` 端点
  - [x] 使用 `@UseGuards(JwtAuthGuard)` 保护端点
  - [x] 实现 `response.clearCookie('refresh_token')`
  - [x] (可选) 如果实现了服务端 Token 黑名单，调用 `AuthService.revokeToken()`

### Phase 3: Frontend Tests First (RED)
- [x] Task 4: 编写 Logout 逻辑测试
  - [x] 测试 `useAuth.logout()` - 调用 API 并清除状态

### Phase 4: Frontend Implementation (GREEN)
- [x] Task 5: 前端 Logout 集成
  - [x] 在 `api.ts` 添加 `logout` 方法
  - [x] 在 `useAuth` Hook 实现 `logout` 函数 (清除 Atom 状态)
  - [x] 在侧边栏/用户菜单添加退出按钮并绑定事件

### Phase 5: Refactor
- [x] Task 6: 安全与清理
  - [x] 确保前端本地存储 (Local Storage / Session Storage) 彻底清理
  - [x] 验证 Cookie 属性 (Path, HttpOnly, Secure) 与设置时一致，否则无法清除

## Dev Notes

- **API Path**: `/ideaFlow/api/v1/auth/logout`
- **Method**: POST
- **Security**: Requires JWT Auth (`@UseGuards(JwtAuthGuard)`)
- **Cookies**: Clearing cookies requires sending the same options (path, domain, secure, httpOnly) as when they were set, but with an expiration date in the past.

### Project Structure Notes

- Backend: `apps/api/src/modules/auth`
- Frontend: `apps/web/src/features/auth`

### References

- [Architecture: Authentication](file:///Users/offer/offer_work/ideaFlow/_bmad-output/planning-artifacts/architecture.md#L208-L219)
- [Epic 1: Story 1.4 Details](file:///Users/offer/offer_work/ideaFlow/_bmad-output/planning-artifacts/epics.md#L479-L504)
- [Previous Story: User Login](file:///Users/offer/offer_work/ideaFlow/_bmad-output/implementation-artifacts/1-3-user-login.md)

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Completion Notes List
- Implemented backend logout endpoint (`/auth/logout`) which clears `refresh_token` cookie.
- Verified backend logic with unit tests (`auth.service.spec.ts`) and E2E tests (`auth.e2e-spec.ts`).
- Verified frontend logic with unit tests (`useAuth.test.tsx`).
- Added Logout button to Sidebar/User Section in `Layout.tsx`.
- Verified secure cookie clearing (Path, HttpOnly, Secure) matches setting configuration.
- **Note**: Route protection (redirect after logout) moved to Story 1.5.

### File List
- apps/api/src/modules/auth/auth.service.ts
- apps/api/src/modules/auth/auth.controller.ts
- apps/api/src/modules/auth/auth.service.spec.ts
- apps/api/test/auth.e2e-spec.ts
- apps/web/src/hooks/useAuth.ts
- apps/web/src/hooks/useAuth.test.tsx
- apps/web/src/components/Layout.tsx
- apps/web/src/services/api.ts
- apps/web/src/services/auth.service.ts
