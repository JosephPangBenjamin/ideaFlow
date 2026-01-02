# Story 1.3: 用户登录功能

Status: done

<!-- Note: This story must be implemented using TDD (Red-Green-Refactor) -->

## Story

As a **已注册用户**,
I want **使用手机号或用户名+密码登录系统**,
so that **我可以访问我的想法和任务**.

**FRs 覆盖**：FR2, FR45

## Acceptance Criteria

1. **Given** 用户在登录页面 **When** 输入正确的账号和密码 **Then** 系统验证成功
2. **And** 返回 JWT Access Token (15min) 和 Refresh Token (7天 HttpOnly Cookie)
3. **And** 自动跳转到主页面（仪表盘）
4. **Given** 用户输入错误的密码 **When** 点击登录按钮 **Then** 显示错误提示「账号或密码错误」 **And** 不透露是账号还是密码错误
5. **Given** Access Token 过期 **When** 发起 API 请求 **Then** 系统自动使用 Refresh Token 刷新 Access Token **And** 请求正常完成（用户无感知）
6. **Given** Refresh Token 过期 **When** 发起 API 请求 **Then** 返回 401 未授权 **And** 自动跳转到登录页面

## Tasks / Subtasks (TDD Approach)

### Phase 1: Backend Tests First (RED)
- [x] Task 1: 编写 AuthService 登录测试
  - [x] 测试 `validateUser()` - 验证账号密码正确性
  - [x] 测试 `login()` - 成功登录返回 Access/Refresh Tokens
  - [x] 测试 `login()` - 密码错误返回 UnauthorizedException
- [x] Task 2: 编写 Token 刷新逻辑测试
  - [x] 测试 `refreshTokens()` - 使用有效 Refresh Token 获取新 Tokens
  - [x] 测试 `refreshTokens()` - 使用无效/过期 Refresh Token 抛出异常
- [x] Task 3: 编写 E2E 测试
  - [x] 测试 `POST /ideaFlow/api/v1/auth/login` - 200 成功
  - [x] 测试 `POST /ideaFlow/api/v1/auth/login` - 401 失败
  - [x] 测试 `POST /ideaFlow/api/v1/auth/refresh` - 200 刷新成功

### Phase 2: Backend Implementation (GREEN)
- [x] Task 4: 实现 Auth 登录逻辑
  - [x] 更新 `AuthService.login()` 处理密码验证和 Token 生成
  - [x] 在 `AuthController` 添加 `login` 端点
- [x] Task 5: 实现 Refresh Token 机制
  - [x] 实现 Refresh Token 的生成与存储 (HttpOnly Cookie)
  - [x] 实现 `/auth/refresh` 自动续期逻辑
- [x] Task 6: 集成 JWT Guard 保护端点
  - [x] 验证 `JwtAuthGuard` 正确拦截未授权请求

### Phase 3: Frontend Tests First (RED)
- [x] Task 7: 编写 LoginPage 组件测试
  - [x] 创建 `LoginPage.test.tsx`
  - [x] 测试登录表单渲染与基本逻辑
  - [x] 测试登录失败时的错误提示
- [x] Task 8: 编写 Axios 拦截器测试
  - [x] 测试 401 响应时触发 Token 刷新
  - [x] 测试刷新失败时重定向到登录页

### Phase 4: Frontend Implementation (GREEN)
- [x] Task 9: 实现 LoginPage 组件
  - [x] 使用 Arco Design 构建登录页面
  - [x] 调用 AuthService 进行登录
- [x] Task 10: 优化 Auth 流程
  - [x] 实现 Axios 拦截器处理静默刷新
  - [x] 更新 `useAuth` Hook 支持登录状态管理

### Phase 5: Refactor
- [x] Task 11: 性能与安全优化
  - [x] 确保 bcrypt cost=10
  - [x] 检查 Token 过期时间设置与架构要求对齐 [Source: architecture.md#L210]

## Dev Notes

- **认证方案**: JWT + Refresh Token
  - Access Token: 15min
  - Refresh Token: 7 days (HttpOnly Cookie)
- **加密**: bcrypt (cost=10)
- **API 路径**: `/ideaFlow/api/v1/auth/login`
- **前端结构**: 在 `apps/web/src/features/auth/pages/` 下创建 `LoginPage.tsx`
- **后端结构**: 在 `apps/api/src/modules/auth/` 中实现

### Project Structure Notes

- 遵循 Monorepo 结构，共享类型应考虑在 `packages/shared`（如果已初始化）。
- 前端使用 Arco Design 组件库。

### References

- [Architecture: Authentication & Security](file:///Users/offer/offer_work/ideaFlow/_bmad-output/planning-artifacts/architecture.md#L208-L219)
- [Epic 1: Story 1.3 Details](file:///Users/offer/offer_work/ideaFlow/_bmad-output/planning-artifacts/epics.md#L441-L476)
- [Previous Story: User Registration](file:///Users/offer/offer_work/ideaFlow/_bmad-output/implementation-artifacts/1-2-user-registration.md)

## Dev Agent Record

### Agent Model Used

### Completion Notes List

### Review Fixes (AI)
- [x] Fixed Frontend Infinite Loop Risk in `api.ts`
- [x] Integrated `JwtAuthGuard` in `AuthController` (`/logout` and `/me`)
- [x] Implemented `cookie-parser` for robust cookie handling
- [x] Verified fixes with `test:e2e` and `test`

### File List
- apps/api/src/modules/auth/auth.controller.ts
- apps/api/src/modules/auth/auth.service.ts
- apps/api/src/modules/auth/jwt-auth.guard.ts
- apps/api/src/modules/auth/jwt.strategy.ts
- apps/api/src/main.ts
- apps/web/src/features/auth/pages/LoginPage.tsx
- apps/web/src/services/api.ts
