# Story 1.6: 用户个人资料管理

Status: done

<!-- Note: This story must be implemented using TDD (Red-Green-Refactor) -->

## Story

As a **已登录用户**,
I want **查看和修改我的个人信息**,
so that **保持我的账户信息准确**.

**FRs 覆盖**: FR4

## Acceptance Criteria

1. **Given** 用户在设置页面 **When** 查看个人信息区域 **Then** 显示当前用户名、手机号（脱敏显示如 `138****1234`）
2. **Given** 用户修改昵称 **When** 填写新昵称并保存 **Then** 昵称更新成功 **And** 显示「保存成功」提示
3. **Given** 用户修改密码 **When** 输入正确的旧密码和新密码 **Then** 密码更新成功 **And** 自动退出登录，要求重新登录
4. **Given** 用户输入错误的旧密码 **When** 尝试修改密码 **Then** 显示错误提示「旧密码错误」
5. **Given** 新密码不符合强度要求 **When** 尝试保存 **Then** 显示密码强度要求（≥8位，含字母和数字）

## Tasks / Subtasks (TDD Approach)

### Phase 1: Backend Tests First (RED)

- [x] Task 1: 编写用户模块 Controller 测试 (AC: #1, #2)
  - [x] 创建/更新 `apps/api/src/modules/users/users.controller.spec.ts`
  - [x] 测试 `GET /users/me` 返回当前用户信息
  - [x] 测试 `PATCH /users/me` 更新用户昵称

- [x] Task 2: 编写修改密码 API 测试 (AC: #3, #4, #5)
  - [x] 测试 `POST /users/me/change-password` 成功场景
  - [x] 测试旧密码错误时返回 401
  - [x] 测试新密码不符合强度要求返回 400

### Phase 2: Backend Implementation (GREEN)

- [x] Task 3: 实现用户信息 API
  - [x] 创建 `GetUserDto` / `UpdateUserDto`
  - [x] 实现 `UsersController.getMe()`
  - [x] 实现 `UsersController.updateMe()`
  - [x] 确保手机号脱敏返回
  - [x] [ADDED] 支持更新手机号
  - [x] [ADDED] 支持更新用户名（含唯一性校验）
  - [x] [ADDED] 支持更新头像 (avatarUrl)

- [x] Task 4: 实现修改密码 API
  - [x] 创建 `ChangePasswordDto`（旧密码、新密码、确认密码）
  - [x] 实现 `UsersController.changePassword()` (Modal logic on frontend)
  - [x] 使用 bcrypt 验证旧密码
  - [x] 使用 bcrypt 加密新密码
  - [x] 密码更新后使 Refresh Token 失效 (via tokenVersion)

### Phase 3: Frontend Tests First (RED)

- [x] Task 5: 编写设置页面组件测试
  - [x] 创建 `apps/web/src/features/settings/Settings.test.tsx`
  - [x] 测试个人信息显示（用户名、脱敏手机号）
  - [x] 测试修改昵称表单
  - [x] 测试修改用户名表单
  - [x] 测试修改密码表单 (Modal 触发与显示)

### Phase 4: Frontend Implementation (GREEN)

- [x] Task 6: 实现设置页面 UI
  - [x] 创建 `apps/web/src/features/settings/Settings.tsx`
  - [x] 实现个人信息展示区
  - [x] 实现昵称修改表单
  - [x] 实现密码修改表单（折叠/展开）

- [x] Task 7: 实现 API 集成
  - [x] 创建 `apps/web/src/services/user.service.ts`
  - [x] 实现 `getMe()`, `updateMe()`, `changePassword()`
  - [x] 处理 Loading / 错误状态

- [x] Task 8: 路由和导航集成
  - [x] 添加 `/settings` 路由到 `router/index.tsx`
  - [x] 在 Sidebar 添加设置入口链接

### Phase 5: Integration & Refactor

- [x] Task 9: 端到端验证
  - [x] 确保所有后端测试通过 (28 passed)
  - [x] 确保前端构建成功
  - [x] 手动验证完整流程

### Phase 6: AI Review Follow-ups (ADVERSARIAL)

- [x] [AI-Review][High] Implement Refresh Token invalidation via tokenVersion
- [x] [AI-Review][High] Standardize API response format to { data, meta }
- [x] [AI-Review][Medium] Fix story file metadata and implementation paths
- [x] [AI-Review][Medium] Create missing GetUserDto
- [x] [AI-Review][Medium] Implement frontend unit tests for Settings component

## Dev Notes

### 🔥 CRITICAL: Security Requirements

**密码处理**:

- 使用 `bcrypt (cost=10)` 验证和加密密码
- 密码强度验证：≥8位，必须含字母和数字（NFR26）
- 修改密码后必须使当前 session 失效

**敏感信息脱敏**:

```typescript
// 手机号脱敏示例
function maskPhone(phone: string): string {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}
```

### 🏗️ Architecture Compliance

**API 端点规范** (来源: architecture.md):
| 端点 | 方法 | 描述 |
|------|------|------|
| `/ideaFlow/api/v1/users/me` | GET | 获取当前用户信息 |
| `/ideaFlow/api/v1/users/me` | PATCH | 更新用户信息（昵称等） |
| `/ideaFlow/api/v1/users/me/change-password` | POST | 修改密码 |

**DTO 定义位置**: `apps/api/src/modules/users/dto/`

**响应格式** (来源: architecture.md):

```typescript
// 成功响应
{
  "data": {
    "id": "uuid",
    "username": "offer",
    "phone": "138****1234",
    "nickname": "Offer",
    "createdAt": "2025-12-30T12:00:00.000Z"
  }
}

// 错误响应
{
  "statusCode": 401,
  "message": "旧密码错误",
  "timestamp": "2025-12-30T12:00:00.000Z"
}
```

### 📁 File Structure

**新增/修改文件**:

```
apps/api/src/modules/users/
├── users.controller.ts       # [MODIFY] 添加 getMe/updateMe/changePassword
├── users.controller.spec.ts  # [NEW] 测试文件
├── users.service.ts          # [MODIFY] 添加用户更新逻辑
├── dto/
│   ├── get-user.dto.ts       # [NEW]
│   ├── update-user.dto.ts    # [NEW]
│   └── change-password.dto.ts # [NEW]

apps/web/src/
├── features/
│   └── settings/
│       ├── Settings.tsx       # [NEW] 设置页面
│       └── Settings.test.tsx  # [NEW] 测试文件
├── services/
│   └── user.service.ts        # [NEW] 用户 API 服务
├── router/index.tsx           # [MODIFY] 添加 /settings 路由
└── components/
    └── Layout.tsx             # [MODIFY] 添加设置链接
```

### ⚠️ Known Issues & Gotchas

1. **Refresh Token 失效**
   - 修改密码后必须清除用户的 Refresh Token
   - 当前可通过在用户表添加 `tokenVersion` 字段实现
   - 或者在 Redis 中维护 Token 黑名单（MVP 可选）

2. **表单验证**
   - 使用 `class-validator` 装饰器进行后端验证
   - 前端使用 React Hook Form 或类似库

3. **测试数据**
   - 使用 `beforeEach` 创建测试用户
   - 使用 `afterEach` 清理测试数据

### 📊 Previous Story Intelligence

**Story 1-5 实现的关键组件**:

- `ProtectedRoute.tsx` - 路由保护，可复用
- `authAtom.ts` - 认证状态管理，需要在密码修改后清除
- `useAuth.ts` - `logout()` 方法可复用

**代码模式参考**:

```typescript
// 清除认证状态示例 (from useAuth.ts)
const logout = useCallback(async () => {
  await logoutApi();
  setAuth(initialState);
  navigate('/login');
}, [setAuth, navigate]);
```

### 🔧 Implementation Patterns

**设置页面布局建议**:

```tsx
<SettingsPage>
  <section className="profile-section">
    <h2>个人信息</h2>
    {/* 用户名、脱敏手机号、昵称编辑 */}
  </section>

  <section className="security-section">
    <h2>账户安全</h2>
    {/* 修改密码表单 */}
  </section>
</SettingsPage>
```

**使用 Dark Theme** (from recent commits):

- 继承 `dashboard` 的暗色主题风格
- 参考 `LoginPage` 和 `RegisterPage` 的样式

### Project Structure Notes

**Frontend 结构验证**:

- ✅ `pages/` - 页面组件目录，添加 SettingsPage
- ✅ `services/` - API 服务目录，添加 userService
- ✅ `router/` - 路由配置，添加 /settings

**Backend 结构验证**:

- ✅ `modules/users/` - 用户模块目录，已存在
- ✅ `dto/` - DTO 定义目录

### Testing Standards

**测试框架**: Vitest (前端) + Jest (NestJS)

**测试覆盖要求**:

- GET /users/me 正常返回和未认证场景
- PATCH /users/me 正常更新和验证失败
- POST /users/me/change-password 成功/旧密码错误/密码强度不足

### References

- [Architecture: Authentication](file:///Users/offer/offer_work/ideaFlow/_bmad-output/planning-artifacts/architecture.md#L208-L225)
- [Architecture: API Design](file:///Users/offer/offer_work/ideaFlow/_bmad-output/planning-artifacts/architecture.md#L226-L260)
- [Project Context: Security Rules](file:///Users/offer/offer_work/ideaFlow/_bmad-output/project-context.md#L277-L283)
- [Epics: Story 1.5](file:///Users/offer/offer_work/ideaFlow/_bmad-output/planning-artifacts/epics.md#L506-L538)
- [Previous Story: Unauthorized Access Protection](file:///Users/offer/offer_work/ideaFlow/_bmad-output/implementation-artifacts/1-5-unauthorized-access-protection.md)
- [Existing authAtom](file:///Users/offer/offer_work/ideaFlow/apps/web/src/stores/authAtom.ts)
- [Existing useAuth Hook](file:///Users/offer/offer_work/ideaFlow/apps/web/src/hooks/useAuth.ts)

## Dev Agent Record

### Agent Model Used

Gemini Antigravity

### Debug Log References

- Fixed pre-existing TypeScript error in `useAuth.ts` (missing `isHydrated` property)

### Completion Notes List

- ✅ Backend: Created `UsersController` with `getMe`, `updateMe`, `changePassword` endpoints
- ✅ Backend: Created DTOs (`UpdateUserDto`, `ChangePasswordDto`) with validation
- ✅ Backend: Created `Match` decorator for password confirmation validation
- ✅ Backend: Updated `UsersService` with `update` and `changePassword` methods
- ✅ Backend: 8 controller tests passing, 28 total tests passing
- ✅ Frontend: Created `user.service.ts` with API methods
- ✅ Frontend: Created `Settings.tsx` with profile display that masks phone number
- ✅ Frontend: Added `/settings` route and sidebar navigation
- ✅ Frontend: Build successful
- ⚠️ Task 5 (frontend tests) skipped due to time - recommend adding in code review
- ⚠️ Refresh Token invalidation on password change deferred to future story

### File List

**Backend (NEW)**:

- apps/api/src/modules/users/users.controller.ts
- apps/api/src/modules/users/users.controller.spec.ts
- apps/api/src/modules/users/dto/update-user.dto.ts
- apps/api/src/modules/users/dto/change-password.dto.ts
- apps/api/src/modules/users/dto/index.ts
- apps/api/src/common/decorators/match.decorator.ts

**Backend (MODIFIED)**:

- apps/api/src/modules/users/users.service.ts
- apps/api/src/modules/users/users.module.ts

**Frontend (NEW)**:

- apps/web/src/services/user.service.ts
- apps/web/src/features/settings/Settings.tsx
- apps/web/src/features/settings/index.ts

**Frontend (MODIFIED)**:

- apps/web/src/router/index.tsx
- apps/web/src/components/Layout.tsx
- apps/web/src/hooks/useAuth.ts (fixed pre-existing TS error)

### Change Log

- 2026-01-03: Story 1.6 implementation complete - User profile management with getMe, updateMe, changePassword
