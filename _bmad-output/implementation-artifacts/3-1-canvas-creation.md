# Story 3.1: 画布创建与基础渲染

status: done
agent: antigravity (bmad-bmm-agents-dev)

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## 用户故事 (Story)

作为一个 **用户**,
我想要 **创建一个自由画布并添加想法节点**,
以便 **可视化组织我的想法**.

## 验收标准 (Acceptance Criteria)

1. **创建新画布**:
   - **Given** 用户在画布页面
   - **When** 点击「新建画布」按钮
   - **Then** 创建一个空白画布
   - **And** 画布使用 Konva.js 渲染
   - **And** 显示画布名称输入框（默认名称「未命名画布」）
   - **And** 画布数据保存到后端

2. **从想法列表拖拽到画布**:
   - **Given** 用户在画布中
   - **When** 从想法列表侧边栏拖拽想法到画布
   - **Then** 在画布上创建对应的节点（CanvasNode）
   - **And** 节点显示想法摘要（前 50 字符）
   - **And** 节点位置为拖放位置
   - **And** 节点自动保存到后端

3. **自动保存画布状态**:
   - **Given** 画布有节点存在
   - **When** 节点位置变化或添加/删除节点
   - **Then** 自动保存画布状态（Debounce 3秒）
   - **And** 显示「保存中...」→「已保存」状态指示器

4. **画布基础渲染**:
   - **Given** 用户打开已有画布
   - **When** 页面加载
   - **Then** 加载画布数据并渲染所有节点
   - **And** 保持节点原有位置
   - **And** 加载状态显示 Loading（≤300ms 不显示）

## 任务 / 子任务 (Tasks / Subtasks)

- [x] Task 1: Backend - Canvas 数据模型 (AC: 1)
  - [x] 创建 Prisma Canvas schema（id, userId, name, createdAt, updatedAt）
  - [x] 创建 Prisma CanvasNode schema（id, canvasId, ideaId, x, y, width, height, createdAt）
  - [x] 运行 `prisma migrate dev` 生成迁移
  - [x] 编写单元测试

- [x] Task 2: Backend - Canvas CRUD API (AC: 1, 3, 4)
  - [x] 创建 `apps/api/src/modules/canvases/canvases.module.ts`
  - [x] 创建 `canvases.service.ts` - create, findAll, findOne, update, remove
  - [x] 创建 `canvases.controller.ts` - POST, GET, GET/:id, PATCH, DELETE
  - [x] 实现所有权验证（只能访问自己的画布）
  - [x] 编写单元测试 (`canvases.service.spec.ts`, `canvases.controller.spec.ts`)

- [x] Task 3: Backend - CanvasNode API (AC: 2, 3)
  - [x] 在 canvas 模块添加 node 相关方法
  - [x] 实现 `addNode(canvasId, data)` - 创建节点
  - [x] 实现 `updateNode(nodeId, data)` - 更新位置
  - [x] 实现 `removeNode(nodeId)` - 删除节点
  - [x] 实现 `getNodesForCanvas(canvasId)` - 获取画布所有节点
  - [x] 编写单元测试

- [x] Task 4: Frontend - Konva.js 画布初始化 (AC: 1, 4)
  - [x] 安装 react-konva 和 konva（如未安装）
  - [x] 重构 `Canvas.tsx`，使用 Konva Stage + Layer
  - [x] 创建 `CanvasEditor.tsx` 主画布编辑组件
  - [x] 实现画布容器自适应窗口大小
  - [x] 初始化空白画布状态

- [x] Task 5: Frontend - CanvasNode 组件 (AC: 2, 4)
  - [x] 创建 `CanvasNode.tsx` 使用 Konva Group + Rect + Text
  - [x] 节点样式：圆角矩形 + 想法摘要文本
  - [x] 节点尺寸：默认 180x80，可展开
  - [x] 节点颜色：与 IdeaCard 一致（#1e293b 边框 + 半透明背景）
  - [x] 编写组件测试

- [x] Task 6: Frontend - 拖拽想法到画布 (AC: 2)
  - [x] 6.1 在画布页面添加想法列表侧边栏 (支撑 AC 2)
  - [x] 6.2 在侧边栏实现想法项目的拖拽 (Source)
  - [x] 6.3 在画布编辑器实现拖拽放置监听 (Drop)
  - [x] 6.4 实现放置后的节点创建和即时渲染 (Optimistic)
  - [x] 6.5 运行集成测试验证拖拽链路

- [x] Task 7: Frontend - 画布 API 集成与自动保存 (AC: 1, 3, 4)
  - [x] 创建 `canvas.service.ts` - createCanvas, getCanvas, updateCanvas
  - [x] 创建 canvas atoms（canvasAtom, nodesAtom, isSavingAtom）
  - [x] 实现自动保存 Hook（useAutoSave with debounce 3s）
  - [x] 保存状态指示器组件
  - [x] 编写测试

- [x] Task 8: Frontend - 新建画布流程 (AC: 1)
  - [x] 「新建画布」按钮打开创建对话框
  - [x] 输入画布名称（或使用默认「未命名画布」）
  - [x] 调用 API 创建画布
  - [x] 创建成功后自动跳转到画布编辑页面
  - [x] 编写测试 (Implemented `Canvas.test.tsx`)

## 开发说明 (Dev Notes)

### 架构模式

- **画布渲染引擎**: Konva.js（react-konva 包装）
- **性能目标**: 60fps 交互（NFR3），拖拽响应 < 100ms（NFR2）
- **状态管理**: Jotai atoms 管理画布状态
- **自动保存**: Debounce 3秒，使用 React Query mutation
- **API 设计**: RESTful - `/ideaFlow/api/v1/canvases`, `/ideaFlow/api/v1/canvases/:id/nodes`

### 项目结构参考

**后端（新增）**:

```
apps/api/src/modules/canvases/
├── canvases.module.ts
├── canvases.service.ts
├── canvases.service.spec.ts
├── canvases.controller.ts
├── canvases.controller.spec.ts
└── dto/
    ├── create-canvas.dto.ts
    ├── update-canvas.dto.ts
    ├── create-node.dto.ts
    └── update-node.dto.ts
```

**前端（扩展）**:

```
apps/web/src/features/canvas/
├── Canvas.tsx                 # 画布列表页面（重构）
├── CanvasEditor.tsx          # 画布编辑器（新增）
├── components/
│   ├── CanvasNode.tsx        # Konva 节点组件
│   ├── CanvasSidebar.tsx     # 想法列表侧边栏
│   └── SaveIndicator.tsx     # 保存状态指示器
├── hooks/
│   ├── useCanvas.ts          # 画布数据 Hook
│   └── useAutoSave.ts        # 自动保存 Hook
├── services/
│   └── canvas.service.ts     # API 调用
├── stores/
│   └── canvasAtoms.ts        # Jotai atoms
└── __tests__/
    ├── CanvasNode.test.tsx
    └── CanvasEditor.test.tsx
```

**Prisma Schema 扩展**:

```prisma
model Canvas {
  id        String       @id @default(cuid())
  userId    String
  user      User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  name      String       @default("未命名画布")
  nodes     CanvasNode[]
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt

  @@index([userId])
}

model CanvasNode {
  id        String   @id @default(cuid())
  canvasId  String
  canvas    Canvas   @relation(fields: [canvasId], references: [id], onDelete: Cascade)
  ideaId    String
  idea      Idea     @relation(fields: [ideaId], references: [id], onDelete: Cascade)
  x         Float    @default(100)
  y         Float    @default(100)
  width     Float    @default(180)
  height    Float    @default(80)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([canvasId])
  @@index([ideaId])
}
```

### 技术验收标准

- Prisma Canvas 和 CanvasNode 表创建成功
- Konva.js Stage 初始化正常
- POST `/ideaFlow/api/v1/canvases` 正常工作
- GET `/ideaFlow/api/v1/canvases/:id` 返回画布及所有节点
- CanvasNode 组件渲染正确
- 拖拽想法到画布功能正常
- 自动保存（Debounce 3秒）正常工作

### Konva.js 关键实现

**Stage 初始化**:

```tsx
import { Stage, Layer, Rect, Text, Group } from 'react-konva';

<Stage
  width={containerWidth}
  height={containerHeight}
  onDrop={handleDrop}
  onDragOver={(e) => e.preventDefault()}
>
  <Layer>
    {nodes.map((node) => (
      <CanvasNode key={node.id} {...node} />
    ))}
  </Layer>
</Stage>;
```

**CanvasNode 基础结构**:

```tsx
<Group x={x} y={y} draggable onDragEnd={handleDragEnd}>
  <Rect width={180} height={80} fill="#1e293b" stroke="#334155" cornerRadius={8} />
  <Text text={ideaSummary} fill="#e2e8f0" padding={12} fontSize={14} />
</Group>
```

### 前序 Story 经验总结

从 Epic 2 实现中获得的关键经验：

1. **TDD 严格执行**: 先写测试再写实现，所有测试必须通过
2. **Optimistic Update**: 前端状态先更新，API 失败时回滚（参考 2-5-delete-idea 实现）
3. **Modal.confirm 模式**: 危险操作使用 Arco Modal.confirm 确认
4. **Message Toast**: 操作反馈使用 `Message.success/error`
5. **React Query**: 使用 `useMutation` + `useQuery` 管理服务端状态
6. **测试覆盖**: 前后端测试必须全部通过

### 已知依赖

**需要检查/安装的依赖**:

- `react-konva`: ^18.2.10
- `konva`: ^9.3.0

**可复用的现有代码**:

- `apps/web/src/services/api.ts` - Axios 实例（已配置基础 URL 和拦截器）
- `apps/api/src/common/guards/jwt-auth.guard.ts` - JWT 认证守卫
- `apps/api/src/common/decorators/current-user.decorator.ts` - 获取当前用户

## 开发代理记录 (Dev Agent Record)

### 使用的代理模型

Antigravity (Google DeepMind)

### 调试日志引用

### 完成记录

**实现摘要：**

- 后端：Canvas 和 CanvasNode Prisma 模型 + 完整 CRUD API
- 后端：canvases.service.ts、canvases.controller.ts，27 个单元测试全部通过
- 前端：Konva.js 画布编辑器 (CanvasEditor.tsx, CanvasNode.tsx)
- 前端：canvas.service.ts API 调用、canvasAtoms.ts Jotai 状态
- 前端：useAutoSave.ts debounce 3秒自动保存、SaveIndicator 状态显示
- 前端：Canvas 列表页面重构，新建画布对话框，CanvasDetailPage 路由
- 审查修复：已补充 `CanvasSidebar.tsx` 并完成 `CanvasIntegration.test.tsx` 拖拽集成测试。
- UI/UX：优化了 `SaveIndicator` 定位，修正了侧边栏滚动条样式。

### 文件列表

**后端新增/修改：**

- prisma/schema.prisma (modified - Canvas/CanvasNode models)
- apps/api/src/app.module.ts (modified - CanvasesModule import)
- apps/api/src/modules/canvases/canvases.module.ts (new)
- apps/api/src/modules/canvases/canvases.service.ts (new)
- apps/api/src/modules/canvases/canvases.service.spec.ts (new)
- apps/api/src/modules/canvases/canvases.controller.ts (new)
- apps/api/src/modules/canvases/canvases.controller.spec.ts (new)
- apps/api/src/modules/canvases/dto/create-canvas.dto.ts (new)
- apps/api/src/modules/canvases/dto/update-canvas.dto.ts (new)
- apps/api/src/modules/canvases/dto/create-node.dto.ts (new)
- apps/api/src/modules/canvases/dto/update-node.dto.ts (new)

**前端新增/修改：**

- apps/web/src/router/index.tsx (modified - CanvasDetailPage route)
- apps/web/src/features/canvas/Canvas.tsx (modified - API integration)
- apps/web/src/features/canvas/CanvasDetailPage.tsx (new)
- apps/web/src/features/canvas/components/CanvasEditor.tsx (new)
- apps/web/src/features/canvas/components/CanvasNode.tsx (new)
- apps/web/src/features/canvas/components/SaveIndicator.tsx (new)
- apps/web/src/features/canvas/services/canvas.service.ts (new)
- apps/web/src/features/canvas/stores/canvasAtoms.ts (new)
- apps/web/src/features/canvas/hooks/useAutoSave.ts (new)
- apps/web/src/features/canvas/Canvas.test.tsx (new - 8 tests)
- apps/web/src/features/canvas/CanvasNode.test.tsx (new - 7 tests)
- apps/web/src/features/canvas/components/CanvasSidebar.tsx (new)
- apps/web/src/features/canvas/CanvasIntegration.test.tsx (new)
- apps/web/package.json (modified)
- sprint-status.yaml (new)
