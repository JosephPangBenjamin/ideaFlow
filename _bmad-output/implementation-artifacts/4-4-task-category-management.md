# Story 4.4: 任务分类管理 (Task Category Management)

Status: in-progress

## Story

As a **用户**,
I want **对任务进行分类（模块/项目）**,
so that **按项目组织和管理大量任务**.

## Acceptance Criteria

1. **分类定义与存储 (Category Definition & Storage)**:
   - **Given** 系统需要支持任务分类
   - **Then** 数据库中应存在 `Category` 模型，包含 `id`, `name`, `color`, `userId` 等字段
   - **And** `Task` 模型应通过 `categoryId` 与 `Category` 建立关联

2. **分类管理 UI (Category Management UI)**:
   - **Given** 用户在设置页面或侧边栏
   - **When** 点击「分类管理」
   - **Then** 可以查看现有分类列表
   - **And** 支持创建新分类（自定义名称和颜色）
   - **And** 支持重命名现有分类
   - **And** 支持删除分类（需处理关联任务：设为未分类或提示用户）

3. **任务关联分类 (Assigning Category to Task)**:
   - **Given** 用户在创建或编辑任务
   - **When** 点击「分类」下拉选择器
   - **Then** 显示用户自定义的分类列表
   - **And** 支持在选择器内快速创建新分类
   - **And** 选中分类后，任务与该分类关联并显示对应的颜色标识

4. **按分类浏览 (View by Category)**:
   - **Given** 任务列表页
   - **When** 点击某个分类标签
   - **Then** 列表仅显示属于该分类的任务

## Tasks / Subtasks

- [ ] Task 1: Backend - 数据库与 API 层面
  - [ ] 1.1 修改 `schema.prisma` 增加 `Category` 模型
  - [ ] 1.2 修改 `Task` 模型，建立与 `Category` 的关联 (`categoryId`)
  - [ ] 1.3 创建数据库迁移
  - [ ] 1.4 实现 Category Controller 和 Service (CRUD)
  - [ ] 1.5 更新 Task Service 以支持 `categoryId` 的更新与查询

- [ ] Task 2: Frontend - 组件开发
  - [ ] 2.1 开发 `CategoryBadge` 组件 (展示分类名称及颜色)
  - [ ] 2.2 开发 `CategorySelect` 组件 (支持搜索、快速创建)
  - [ ] 2.3 开发 `CategoryManager` 弹窗/页面 (用于 CRUD)

- [ ] Task 3: Frontend - 页面集成
  - [ ] 3.1 在任务详情页集成 `CategorySelect`
  - [ ] 3.2 在侧边栏或任务列表页增加分类切换/筛选入口
  - [ ] 3.3 在任务列表卡片上展示分类标识

- [ ] Task 4: 测试验证
  - [ ] 4.1 编写后端 Category 单元测试
  - [ ] 4.2 验证分类删除时的级联逻辑 (SetNull)
  - [ ] 4.3 验证前端分类创建与选择的即时响应

## Dev Notes

### 技术要点提示

1. **Prisma Schema**:

   ```prisma
   model Category {
     id        String   @id @default(cuid())
     name      String
     color     String?  // 十六进制颜色值或 CSS 类名
     userId    String   @map("user_id")
     createdAt DateTime @default(now()) @map("created_at")
     updatedAt DateTime @updatedAt @map("updated_at")

     user  User   @relation(fields: [userId], references: [id])
     tasks Task[]

     @@map("categories")
   }

   // Task 模型需要添加 categoryId
   ```

2. **API 接口建议**:
   - `GET /ideaFlow/api/v1/categories` (列表)
   - `POST /ideaFlow/api/v1/categories` (创建)
   - `PATCH /ideaFlow/api/v1/categories/:id` (更新)
   - `DELETE /ideaFlow/api/v1/categories/:id` (删除)

3. **UI/UX 建议**:
   - 分类颜色支持预设调色盘。
   - 分类删除时，建议将任务的 `categoryId` 设为 `null` (未分类)。

### 架构合规性

- **国际化**: 分类名称支持 Unicode。
- **性能**: 任务列表查询时使用 `include: { category: true }`。

### References

- [Source: planning-artifacts/epics.md - Story 4.4]
- [Source: prisma/schema.prisma - Task Model]
