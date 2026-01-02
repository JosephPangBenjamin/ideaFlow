# Story 1.5: 未授权访问保护

Status: ready-for-dev

<!-- Note: This story must be implemented using TDD (Red-Green-Refactor) -->

## Story

As a **系统安全管理员**,
I want **确保未登录用户无法访问受保护的页面（如仪表盘、想法列表）**,
So that **用户数据的安全性和隐私得到保护**.

**FRs 覆盖**：FR4 (安全保护)

## Acceptance Criteria

1.  **Given** 用户未登录 **When** 尝试访问 `/dashboard`, `/ideas`, `/tasks`, `/canvas` 等受保护路由 **Then** 系统自动重定向到 `/login`
2.  **Given** 用户已登录 **When** 访问受保护路由 **Then** 正常显示页面
3.  **Given** 用户未登录 **When** 访问不存在的页面 (`*`) **Then** 重定向到 `/login` (而不是 `/dashboard`)
4.  **Given** 用户被重定向到登录页 **When** 登录成功 **Then** (可选/Nice to have) 跳转回最初尝试访问的页面

## Tasks / Subtasks (TDD Approach)

### Phase 1: Frontend Tests First (RED)
- [ ] Task 1: 编写 ProtectedRoute 组件测试
  - [ ] 创建 `components/ProtectedRoute.test.tsx`
  - [ ] 测试已认证用户渲染子组件
  - [ ] 测试未认证用户重定向到 `/login`

### Phase 2: Frontend Implementation (GREEN)
- [ ] Task 2: 实现 ProtectedRoute 组件
  - [ ] 创建 `apps/web/src/components/ProtectedRoute.tsx`
  - [ ] 使用 `useAuth` hook 检查认证状态
  - [ ] 使用 `Navigate` 组件处理重定向

- [ ] Task 3: 集成路由保护
  - [ ] 更新 `apps/web/src/router/index.tsx`
  - [ ] 使用 `ProtectedRoute` 包裹需要保护的路由 (`/dashboard`, `/ideas`, `/tasks`, `/canvas` 等)
  - [ ] 更新根路由 `/` 和通配符路由 `*` 的重定向逻辑

### Phase 3: Refactor
- [ ] Task 4: 代码质量优化
  - [ ] 确保测试通过
  - [ ] 检查是否存在循环重定向风险

## Dev Notes

- **组件位置**: `apps/web/src/components/ProtectedRoute.tsx`
- **状态检查**: 使用 `useAuth().isAuthenticated` 或 `useAuth().user`
- **Jotai**: 确保 `atomWithStorage` 初始加载时的闪烁问题得到处理（可能需要 Loading 状态）
