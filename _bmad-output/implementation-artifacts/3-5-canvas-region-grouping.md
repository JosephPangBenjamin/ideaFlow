# Story 3.5: 画布区域分组 (Canvas Region Grouping)

Status: review

## Story

As a **用户**,
I want **在画布上创建区域来组织节点**,
so that **我可以对相关的想法进行分类和整理**.

## Acceptance Criteria

1. **创建区域 (Region Creation)**:
   - **Given** 用户从工具栏选择“区域”工具
   - **When** 在画布上点击并拖动
   - **Then** 创建一个矩形区域，显示预览虚线框
   - **And** 释放鼠标后，区域被固定，并赋予默认名称和颜色（紫色）
   - **And** 数据自动保存到后端

2. **节点归类 (Node Grouping)**:
   - **Given** 画布上已有一个区域
   - **When** 用户将一个节点（子想法、批注或图片）拖入该区域内
   - **Then** 节点与该区域建立父子关系 (`parentId`)
   - **And** 区域背景略微高亮（反馈已识别节点进入）
   - **And** 重载页面后，节点依然属于该区域

3. **区域移动与联动 (Region Movement & Linking)**:
   - **Given** 一个包含多个节点的区域
   - **When** 用户拖动该区域
   - **Then** 区域内的所有节点跟随区域同步移动
   - **And** 保持节点在区域内的相对位置不变
   - **And** 60fps 流畅体验，无交互延迟

4. **解除分组 (Ungrouping)**:
   - **Given** 一个属于某区域的节点
   - **When** 用户将该节点拖出区域边界
   - **Then** 节点与区域的父子关系解除 (`parentId` 设为 null)
   - **And** 区域移动时，该节点不再跟随

5. **区域属性编辑 (Region Editing)**:
   - **Given** 选中一个区域
   - **When** 双击区域标题部分
   - **Then** 弹出编辑框，允许修改区域名称和背景颜色
   - **And** 保存后立即生效

## Tasks / Subtasks

- [x] Task 1: Backend - 数据库与模型扩展
  - [x] 修改 `prisma/schema.prisma`：在 `CanvasNodeType` 枚举中添加 `region`
  - [x] 修改 `CanvasNode` 模型：添加 `color` (String) 和 `parentId` (String, 指向自身)
  - [x] 运行 `npx prisma migrate dev` 同步数据库
  - [x] 编写 DTO 验证逻辑（`create-node.dto.ts`, `update-node.dto.ts`）

- [x] Task 2: Backend - 业务逻辑实现
  - [x] 在 `CanvasesService` 中处理 `parentId` 的关联与解除
  - [x] 实现层级关系的查询优化（获取画布节点时同时返回其父子关系）
  - [x] 编写相关单元测试

- [x] Task 3: Frontend - Region 渲染与工具栏集成
  - [x] 修改 `canvas.service.ts` 支持新字段和类型
  - [x] 在 `CanvasToolbar.tsx` 中增加区域工具按钮
  - [x] 在 `CanvasNode.tsx` 中实现 `region` 类型的特殊渲染（置于底层，带标题栏和半透明背景）

- [x] Task 4: Frontend - 交互模式切换
  - [x] 在 `canvasAtoms.ts` 中增加 `interactionMode` (select | create_region)
  - [x] 在 `CanvasEditor.tsx` 中实现点击拖动创建区域的逻辑

- [x] Task 5: Frontend - 联动移动与分组逻辑
  - [x] 实现节点 Drop 时的区域碰撞检测
  - [x] 优化 `setNodes` 逻辑：当区域移动时，根据相对位移更新所有子节点的 `x, y`
  - [x] 运行集成测试，验证 60fps 性能

## Dev Notes

### 技术要点

- **层级处理**：Konva 不直接使用 DOM 层级，而是通过渲染顺序。区域节点应位于 Layer 的最底层。
- **碰撞检测**：使用 Canvas 坐标系进行矩形包围盒（AABB）检测。
- **性能优化**：在 `onDragMove` 中批量更新子节点位置时，使用 `batchDraw()` 或 React 的高效状态更新手段。

### 依赖组件

- `Konva.Rect` & `Konva.Text` 用于区域渲染。
- Arco Design 的 `ColorPicker`（如果支持）或简单的颜色预设用于区域颜色切换。

## File List

- prisma/schema.prisma
- apps/api/src/modules/canvases/canvases.service.ts
- apps/api/src/modules/canvases/canvases.service.spec.ts
- apps/api/src/modules/canvases/canvases.controller.ts
- apps/api/src/modules/canvases/dto/create-node.dto.ts
- apps/api/src/modules/canvases/dto/update-node.dto.ts
- apps/web/src/features/canvas/services/canvas.service.ts
- apps/web/src/features/canvas/components/CanvasToolbar.tsx
- apps/web/src/features/canvas/components/CanvasNode.tsx
- apps/web/src/features/canvas/components/CanvasEditor.tsx
- apps/web/src/features/canvas/components/CanvasSidebar.tsx
- apps/web/src/features/canvas/components/ConnectionLine.tsx
- apps/web/src/features/canvas/stores/canvasAtoms.ts
- apps/web/src/features/canvas/utils/constants.ts
- apps/web/src/features/canvas/CanvasDetailPage.tsx
- apps/web/src/features/canvas/CanvasIntegration.test.tsx
- apps/web/src/features/ideas/components/IdeaCard.tsx
- apps/web/src/features/ideas/components/IdeaDetail.tsx
- apps/web/src/App.tsx
- apps/web/src/index.css

## Dev Agent Record

- **Implementation Notes**:
  - Validated backend schema changes and verified DB migration for `CanvasNode` (`region` type, `color`, `parentId`).
  - Implemented strict backend validation for `parentId` to ensure nodes can only be grouped under `region` type nodes within the same canvas.
  - Added comprehensive unit tests in `canvases.service.spec.ts` covering validation rules and cascading updates.
  - Verified frontend `CanvasEditor.tsx` implementation for Region creation (drag-to-create), grouping (drag-into-region), and synchronized movement.
  - Enhanced `CanvasNode.tsx` to render a distinct title bar for Region nodes.
  - Verified `CanvasToolbar.tsx` interaction for switching to region creation mode.

## Change Log

- **Backend**:
  - Updated `CanvasesService` to handle `parentId` logic and validation.
  - Updated unit tests to cover new logic.
- **Frontend**:
  - `CanvasNode.tsx`: Added title bar rendering for Region nodes.
  - Verified existing implementation of creation and grouping interactions.
