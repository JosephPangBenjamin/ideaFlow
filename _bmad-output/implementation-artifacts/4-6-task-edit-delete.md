# Story 4.6: 任务编辑与删除 (Task Edit & Delete)

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a 用户,
I want 编辑任务详情和删除任务,
so that 管理任务信息.

## Acceptance Criteria

1. **任务标题编辑 (Task Title Editing)**:
   - **Given** 用户在任务详情页面
   - **When** 双击标题区域或点击编辑图标
   - **Then** 标题变为可编辑的 Input 组件
   - **And** 失去焦点或按 Enter 时自动保存
   - **And** 显示「已保存 ✓」提示（1.5s 消失）

2. **任务描述编辑 (Task Description Editing)**:
   - **Given** 用户在任务详情页面
   - **When** 双击描述区域或点击编辑图标
   - **Then** 描述变为可编辑的 TextArea 组件
   - **And** 支持 Debounce 自动保存（300ms）
   - **And** 保存时显示「正在保存...」状态

3. **删除确认对话框 (Delete Confirmation Dialog)**:
   - **Given** 用户在任务详情或任务卡片
   - **When** 点击删除按钮
   - **Then** 弹出确认对话框「确定删除这个任务吗？」
   - **And** 对话框包含「确认」和「取消」两个按钮

4. **任务删除执行 (Task Deletion Execution)**:
   - **Given** 用户在删除确认对话框中
   - **When** 点击「确认」按钮
   - **Then** 任务删除成功（软删除实现已存在，当前为硬删除）
   - **And** 页面返回任务列表
   - **And** 显示「已删除」成功提示
   - **And** 任务从列表中移除

5. **关联想法保留 (Linked Idea Preservation)**:
   - **Given** 任务已关联想法
   - **When** 删除该任务
   - **Then** 关联的想法保留不受影响
   - **And** 想法的 `task` 引用被清除

## Tasks / Subtasks

- [x] Task 1: 前端 - 标题内联编辑 (AC: #1)
  - [x] 1.1 在 `TaskDetail.tsx` 中将 `Title` 组件改为可切换的内联编辑模式
  - [x] 1.2 使用 Arco Design 的 `Input` 组件实现编辑状态
  - [x] 1.3 实现双击激活和 Enter/Blur 保存逻辑
  - [x] 1.4 调用 `updateTaskMutation` 更新标题

- [x] Task 2: 前端 - 描述内联编辑 (AC: #2)
  - [x] 2.1 在 `TaskDetail.tsx` 中将描述 `Paragraph` 改为可编辑的 `Input.TextArea`
  - [x] 2.2 实现 Debounce 自动保存（使用现有 `debounce` 工具或 `useDebouncedCallback`）
  - [x] 2.3 添加「正在保存...」的加载状态指示器

- [x] Task 3: 前端 - 删除功能与确认 (AC: #3, #4)
  - [x] 3.1 在 `TaskDetail.tsx` 中添加「删除任务」按钮
  - [x] 3.2 使用 Arco Design `Modal.confirm` 实现确认对话框
  - [x] 3.3 创建 `deleteTaskMutation` 调用 `tasksService.deleteTask`
  - [x] 3.4 删除成功后导航回 `/tasks` 并显示成功消息

- [ ] Task 4: 前端 - TaskCard 删除入口 (可选优化)
  - [ ] 4.1 在 `TaskCard.tsx` 中添加更多操作菜单（Dropdown）
  - [ ] 4.2 包含「删除」选项，复用相同的确认和删除逻辑

- [x] Task 5: 验证与测试 (AC: 全部)
  - [x] 5.1 编写 `TaskDetail.test.tsx` 测试用例：编辑标题、编辑描述、删除流程
  - [x] 5.2 浏览器手动验证：编辑保存、删除确认、返回列表
  - [x] 5.3 更新 `sprint-status.yaml` 为 `review`

## Dev Notes

### 🎯 关键参考：复用 `IdeaDetail.tsx` 模式

> **重要**: `apps/web/src/features/ideas/components/IdeaDetail.tsx` 已完美实现编辑删除功能，**必须参考该组件**的实现模式，避免重新发明轮子。

**IdeaDetail.tsx 提供的成熟模式：**

- `isEditing` 状态切换
- `handleSave` 条件保存（仅在内容更改时触发 mutation）
- `handleCancel` 重置编辑内容
- `handleKeyDown` ESC 键取消编辑
- `Modal.confirm` 删除确认对话框
- `useMutation` 配合 `isPending` 加载状态

### 现有实现分析

**后端已完全实现：**

- `PATCH /ideaFlow/api/v1/tasks/:id` → `TasksService.update()` - 支持 title, description, status, categoryId, dueDate
- `DELETE /ideaFlow/api/v1/tasks/:id` → `TasksService.remove()` - 硬删除，验证用户权限
- `UpdateTaskDto` 已包含所有必要字段验证

**前端服务已实现：**

- `tasksService.updateTask(id, dto)` - 调用 PATCH API
- `tasksService.deleteTask(id)` - 调用 DELETE API
- `updateTaskMutation` 已在 `TaskDetail.tsx` 中实现

**仅需前端 UI 增强：**

- 当前 `TaskDetail.tsx` 标题和描述为只读显示
- 需添加内联编辑模式和删除按钮

### ⚠️ 验证规则

| 字段     | 规则                             |
| -------- | -------------------------------- |
| **标题** | 不能为空，保存前需 `trim()` 验证 |
| **描述** | 可以为空字符串                   |

**验证实现示例：**

```typescript
const handleSaveTitle = () => {
  const trimmed = titleValue.trim();
  if (!trimmed) {
    Message.warning('标题不能为空');
    return;
  }
  if (trimmed !== task.title) {
    updateTaskMutation.mutate({ title: trimmed });
  }
  setIsEditingTitle(false);
};
```

### 关键代码位置

| 模块            | 文件路径                                                |
| --------------- | ------------------------------------------------------- |
| **⭐ 参考模板** | `apps/web/src/features/ideas/components/IdeaDetail.tsx` |
| 任务详情页      | `apps/web/src/features/tasks/TaskDetail.tsx`            |
| 任务卡片        | `apps/web/src/features/tasks/components/TaskCard.tsx`   |
| 前端服务        | `apps/web/src/features/tasks/services/tasks.service.ts` |
| 后端服务        | `apps/api/src/modules/tasks/tasks.service.ts`           |

### 推荐实现模式

**直接参考 `IdeaDetail.tsx` 第 26-116 行的实现：**

- 编辑状态管理：L27-28
- 保存逻辑：L86-92
- 取消逻辑：L94-97
- ESC 键处理：L99-103
- 删除确认：L105-116

### 从 Story 4.5 继承的最佳实践

- 使用 `queryClient.invalidateQueries` 刷新相关缓存
- 保持与现有 `TaskStatusSelect`、`CategorySelect` 组件的视觉一致性
- 对于已完成任务（`isDone`），编辑时保持 `line-through opacity-60` 样式

### Project Structure Notes

- 新增代码应直接修改 `TaskDetail.tsx`，无需创建新组件
- 测试文件 `TaskDetail.test.tsx` 已存在，需扩展测试用例

### References

- [Source: planning-artifacts/epics.md#Story 4.6]
- [Source: apps/web/src/features/ideas/components/IdeaDetail.tsx] ⭐ 主要参考
- [Source: apps/web/src/features/tasks/TaskDetail.tsx]
- [Source: apps/api/src/modules/tasks/tasks.service.ts#remove]

## Dev Agent Record

### Agent Model Used

Claude (Anthropic) - claude-sonnet-4-20250514

### Debug Log References

- 无需调试，实现顺利

### Completion Notes List

- ✅ **Task 1 完成**: 标题内联编辑功能 - 双击激活编辑模式，使用 Arco Design Input 组件，Enter/Blur 保存
- ✅ **Task 2 完成**: 描述内联编辑功能 - 双击激活 TextArea，实现 300ms Debounce 自动保存，添加"正在保存..."状态
- ✅ **Task 3 完成**: 删除功能与确认 - 添加删除按钮，使用 Modal.confirm 确认对话框，删除后导航回任务列表
- ⏭️ **Task 4 跳过**: TaskCard 删除入口（标记为可选优化）
- ✅ **Task 5 完成**: 验证与测试 - 13 个单元测试通过，浏览器手动验证成功

**技术决策说明：**

- 参照 `IdeaDetail.tsx` 成熟实现模式，保持代码一致性
- 使用 `useRef<any>` 规避 Arco Design Input ref 类型兼容问题
- Debounce 采用原生 setTimeout 实现，避免额外依赖

### File List

- `apps/web/src/features/tasks/TaskDetail.tsx` - 主要修改：添加标题/描述编辑和删除功能
- `apps/web/src/features/tasks/TaskDetail.test.tsx` - 扩展测试：添加 9 个新测试用例（包括审查后新增）

### Change Log

| 日期       | 变更描述                                                      |
| ---------- | ------------------------------------------------------------- |
| 2026-01-18 | 实现 Story 4.6：任务标题/描述内联编辑，任务删除确认流程       |
| 2026-01-18 | 代码审查修复：H1-假测试修复，M1-类型安全修复，M2-错误处理改进 |

## Senior Developer Review (AI)

### Review Date: 2026-01-18

### Issues Found & Fixed:

| ID  | Severity | Issue                                                                                | Status       |
| --- | -------- | ------------------------------------------------------------------------------------ | ------------ |
| H1  | HIGH     | Fake Test - Delete button test asserted button exists instead of actual delete logic | ✅ Fixed     |
| M1  | MEDIUM   | TypeScript `any` hack in useRef - violated type safety rules                         | ✅ Fixed     |
| M2  | MEDIUM   | Generic error message in deleteTaskMutation - poor UX                                | ✅ Fixed     |
| L1  | LOW      | Unnecessary mutation pre-check logic                                                 | Acknowledged |

### Fixes Applied:

1. **[H1]** Rewrote delete tests to spy on `Modal.confirm` and verify:
   - Correct dialog configuration (title, content, buttons)
   - `deleteTask` service is called with correct ID
   - Navigation to `/tasks` after successful deletion

2. **[M1]** Imported `RefInputType` from `@arco-design/web-react/es/Input/interface` and replaced `useRef<any>` with proper typing.

3. **[M2]** Enhanced `deleteTaskMutation.onError` to extract and display specific error messages.

### Outcome: APPROVED

All HIGH and MEDIUM issues fixed. 14/14 tests passing.
