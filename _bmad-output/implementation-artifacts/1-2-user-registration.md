# Story 1.2: 用户注册功能（手机号/用户名密码）

Status: done

<!-- Note: This story must be implemented using TDD (Red-Green-Refactor) -->

## Story

As a **新用户**,
I want **使用手机号或用户名+密码注册账号**,
So that **我可以使用 IdeaFlow 的功能**.

**FRs 覆盖**：FR1, FR45

## Acceptance Criteria

1. **Given** 用户在注册页面 **When** 输入有效的用户名和密码（≥8位，含字母和数字） **Then** 系统创建新用户账户
2. **And** 密码使用 bcrypt (cost=10) 加密存储
3. **And** 返回 JWT Access Token (15min) 和 Refresh Token (7天 HttpOnly Cookie)
4. **And** 自动跳转到主页面

5. **Given** 用户输入已注册的用户名 **When** 点击注册按钮 **Then** 显示错误提示「该账号已注册」

6. **Given** 用户输入弱密码（少于8位或纯数字/纯字母） **When** 尝试提交注册 **Then** 表单验证失败，显示密码强度要求

7. **Given** 用户未填写必填项 **When** 点击注册按钮 **Then** 对应字段显示红框和错误提示

## Tasks / Subtasks (TDD Approach)

### Phase 1: Backend Tests First (RED)
- [x] Task 1: 编写 UsersService 失败测试
  - [x] 创建 `users.service.spec.ts`
  - [x] 测试 `create()` - 创建用户
  - [x] 测试 `findByUsername()` - 查找用户

- [x] Task 2: 编写 AuthService 失败测试
  - [x] 创建 `auth.service.spec.ts`
  - [x] 测试 `register()` - 成功注册返回 token
  - [x] 测试 `register()` - 重复用户名抛出 ConflictException
  - [x] 测试密码加密 bcrypt (cost=10)

- [x] Task 3: 编写 E2E 失败测试
  - [x] 创建 `auth.e2e-spec.ts`
  - [x] 测试 `POST /ideaFlow/api/v1/auth/register` - 201 创建成功
  - [x] 测试 `POST /ideaFlow/api/v1/auth/register` - 400 用户名已存在
  - [x] 测试 `POST /ideaFlow/api/v1/auth/register` - 400 密码太弱

### Phase 2: Backend Implementation (GREEN)
- [x] Task 4: 实现 Prisma 模块
  - [x] 创建 `prisma.service.ts`
  - [x] 创建 `prisma.module.ts`

- [x] Task 5: 实现 Users 模块
  - [x] 创建 `users.service.ts` (让 Task 1 测试通过)
  - [x] 创建 `users.module.ts`

- [x] Task 6: 实现 Auth 模块
  - [x] 创建 DTOs
  - [x] 创建 `auth.service.ts` (让 Task 2 测试通过)
  - [x] 创建 `auth.controller.ts`
  - [x] 创建 `auth.module.ts`
  - [x] 验证 E2E 测试通过

### Phase 3: Frontend Tests First (RED)
- [x] Task 7: 编写 RegisterPage 组件测试
  - [x] 创建 `RegisterPage.test.tsx`
  - [x] 测试表单渲染
  - [x] 测试密码强度验证
  - [x] 测试表单提交

### Phase 4: Frontend Implementation (GREEN)
- [x] Task 8: 实现 Frontend 组件
  - [x] 创建 `RegisterPage.tsx` (让 Task 7 测试通过)
  - [x] 创建 `auth.service.ts`
  - [x] 创建 `authAtom.ts`
  - [x] 创建 `useAuth.ts`
  - [x] 更新路由

### Phase 5: Refactor
- [x] Task 9: 代码质量优化
  - [x] 确保测试覆盖率 100%
  - [x] 代码风格优化
  - [x] 运行 lint 检查

## Dev Notes

### TDD 流程 (Architecture 规定)

```
1. RED: 先写失败测试
2. GREEN: 写最小实现通过测试
3. REFACTOR: 重构优化
```

### 技术栈与版本

| 技术 | 版本 | 用途 |
|------|------|------|
| bcrypt | latest | 密码加密 (cost=10) |
| @nestjs/jwt | latest | JWT 生成/验证 |
| @nestjs/passport | latest | 认证策略 |
| passport-jwt | latest | JWT 策略 |
| class-validator | latest | DTO 验证 |
| vitest | latest | 前端测试 |
| jest | latest | NestJS 测试 |

### 认证方案 (from Architecture)

| 配置 | 值 |
|------|------|
| Access Token 过期 | **15 分钟** |
| Refresh Token 过期 | **7 天** |
| Refresh Token 存储 | **HttpOnly Cookie** |
| 密码加密 | **bcrypt (cost=10)** |

---

## Dev Agent Record

### Agent Model Used

(To be filled after TDD implementation)

### Completion Notes List

(To be filled after TDD implementation)

### File List

(To be filled after TDD implementation)

### Change Log

- 2026-01-02: Story reset for TDD reimplementation
