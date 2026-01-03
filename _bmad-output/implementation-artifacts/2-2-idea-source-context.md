# Story 2.2: 想法来源与上下文记录

Status: done

<!-- 注意: 验证是可选的。在运行 dev-story 之前运行 validate-create-story 进行质量检查。 -->

## 用户故事 (Story)

作为一个 **用户**,
我想要 **可选地为想法添加来源或原因**,
以便 **未来回顾时能想起当时的场景**.

## 验收标准 (Acceptance Criteria)

1.  **来源输入扩展 (Source Input Expansion)**:
    - **Given** 用户在 QuickCapture 输入框中
    - **When** 点击「添加来源」或「展开」按钮
    - **Then** 显示来源输入区域
    - **And** 提供三种类型选项：链接 (Link)、图片 (Image)、文字备注 (Note)

2.  **链接预览 (Link Preview)**:
    - **Given** 用户选择链接类型并粘贴 URL
    - **When** URL 有效 (且后端解析成功)
    - **Then** 显示链接预览卡片 (Title, Domain, Thumbnail if available)
    - **And** 提交时，完整的元数据 (OG data) 作为来源保存

3.  **图片上传 (Image Upload)**:
    - **Given** 用户选择图片类型
    - **When** 粘贴图片 或 拖拽图片文件 或 点击上传
    - **Then** 显示图片上传进度
    - **And** 上传完成后显示缩略图预览
    - **And** 提交时，图片路径 (URL) 作为来源保存

4.  **数据持久化 (Persistence)**:
    - **Given** 带有来源的想法被提交
    - **When** 保存到数据库
    - **Then** `Idea` 表的 `source` 字段 (JSONB) 正确存储结构化数据
    - **And** 结构包含: `{ type: 'link' | 'image' | 'text', content: string, meta?: object }`

5.  **想法详情查看 (View Detail)** (注：详情页可能是后续 Story，但需确保数据可读):
    - **Given** 已保存带有来源的想法
    - **When** 请求该想法数据
    - **Then** 返回包含 `source` 的完整对象

## 任务 / 子任务 (Tasks / Subtasks)

- [x] Task 1: 后端 - 媒体与元数据服务 (AC: 2, 3)
  - [x] 安装依赖: `open-graph-scraper`, `multer` (以及类型定义)。
  - [x] 创建 `MetaModule` & `MetaService`。
  - [x] 实现 URL 预览 API: `POST /ideaFlow/api/v1/meta/preview` (输入 URL，返回 OG data)。
  - [x] 实现图片上传 API: `POST /ideaFlow/api/v1/upload` (处理 multipart/form-data，保存到本地 `uploads` 目录或配置静态资源服务)。
  - [x] 配置 `NestJS` 静态资源服务以提供上传的图片访问。

- [x] Task 2: 前端 - 来源输入组件 (AC: 1, 2, 3)
  - [x] 定义 Source 类型: `IdeaSource` (Link, Image, Text)。
  - [x] 更新 `QuickCapture` UI，增加「添加来源」按钮。
  - [x] 实现 `SourceInput` 组件：包含 Tab 切换 (链接/图片/备注)。
  - [x] 集成 `POST /meta/preview` 接口实现链接自动预览。
  - [x] 实现图片上传逻辑 (调用 `/upload` 接口)。
  - [x] 处理粘贴事件 (Paste Event) 自动识别 URL 或图片。

- [x] Task 3: 前端 - 集成与状态更新 (AC: 4)
  - [x] 更新 `CreateIdeaDto` 及 `ideasService.createIdea` 以支持 `source` 字段。
  - [x] 在 `QuickCapture` 提交逻辑中包含 `source` 数据。
  - [x] 验证提交后的 Toast 依然正常，且数据正确发送。

- [x] Task 4: 验证与清理 (AC: 5)
  - [x] 验证数据库中 `source` 字段的 JSON 结构。
  - [x] 确保上传的图片可访问。
  - [x] 补充单元测试 (Backend MetaService, Frontend SourceInput)。

## 开发说明 (Dev Notes)

- **Source JSONB 结构建议**:

  ```typescript
  type IdeaSource =
    | {
        type: 'link';
        url: string;
        meta?: { title?: string; description?: string; image?: string; siteName?: string };
      }
    | { type: 'image'; url: string; width?: number; height?: number } // url 是相对路径或完整 CDN 路径
    | { type: 'text'; content: string };
  ```

- **图片存储 (DevOps)**:
  - MVP 阶段建议存储在 `apps/api/uploads` 目录，并通过 `ServeStaticModule` 暴露为 `/uploads/...`。
  - **Critical**: 在 Docker 部署中，必须将 `/app/apps/api/uploads` 挂载为 Volume，否则重启容器将丢失用户上传的图片！
  - 确保 `.gitignore` 包含 `uploads` 但保留 `.gitkeep`。

- **安全 (Security)**:
  - **图片上传**: 需通过 `FileInterceptor` 限制文件类型 (jpg, png, webp) 和大小 (e.g., 5MB)。
  - **URL 预览**: `MetaService` 在请求外部 URL 时应增加超时控制 (Timeout)，并防范 SSRF (Server-Side Request Forgery) 攻击（例如禁止访问内网 IP）。

## 参考资料 (References)

- [Epics: Story 2.2](file:///Users/offer/offer_work/ideaFlow/_bmad-output/planning-artifacts/epics.md#Story-2.2)
- [NestJS File Upload](https://docs.nestjs.com/techniques/file-upload)
- [open-graph-scraper](https://www.npmjs.com/package/open-graph-scraper)

## 开发代理记录 (Dev Agent Record)

### 使用的代理模型

Antigravity

### 完成说明列表

- [x] Task 1 Completed
- [x] Task 2 Completed
- [x] Task 3 Completed
- [x] Task 4 Completed

### 文件列表

- `apps/api/src/modules/meta/meta.module.ts`
- `apps/api/src/modules/meta/meta.service.ts`
- `apps/api/src/modules/meta/meta.controller.ts`
- `apps/api/src/modules/meta/dto/preview-url.dto.ts`

- `apps/web/src/features/ideas/components/SourceInput.tsx`
- `apps/web/src/features/ideas/components/SourceInput.test.tsx`
- `apps/web/src/features/ideas/components/QuickCapture.tsx`
- `apps/web/src/features/ideas/types.ts`
- `apps/api/src/modules/ideas/dto/create-idea.dto.ts`
