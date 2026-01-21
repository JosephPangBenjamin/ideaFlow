# Story 7.3: 通知中心

Status: done

## Story

As a **用户**,
I want **查看系统通知列表**,
so that **了解重要事件并不错过沉底提醒等关键消息**。

## Acceptance Criteria

1. **通知图标入口**: 页面右上角显示通知铃铛图标，点击弹出通知列表面板。
2. **未读红点标记**: 有未读通知时，铃铛图标显示红点标记（Badge）。
3. **通知列表展示**: 面板显示通知列表，包含标题、消息、时间、已读状态。
4. **点击标记已读**: 点击某条通知后，标记为已读并跳转到相关内容。
5. **全部已读**: 提供「全部标记为已读」按钮，一键清除所有未读状态。
6. **空状态处理**: 无通知时显示友好的空状态提示。
7. **分页加载**: 通知列表支持滚动分页加载更多历史通知。

## Tasks / Subtasks

> ⚡ **Story 6.2 已实现核心基础设施**，本 Story 聚焦：跳转逻辑完善 + 无限滚动 + 测试

- [x] **Task 1: 后端 API** (AC: 1, 3, 5) ✅ Story 6.2 已完成
  - [x] `GET /notifications` - 分页列表
  - [x] `GET /notifications/unread-count` - 未读数量
  - [x] `PATCH /notifications/:id/read` - 单条已读
  - [x] `PATCH /notifications/read-all` - 全部已读

- [x] **Task 2: 基础 UI 组件** (AC: 1, 2, 3, 5, 6) ✅ Story 6.2 已完成
  - [x] `NotificationBell.tsx` - 铃铛 + Badge
  - [x] `NotificationDropdown.tsx` - 下拉面板 + 全部已读按钮 + Empty 状态
  - [x] `NotificationItem.tsx` - 通知条目 + 已读/未读样式

- [x] **Task 3: 点击跳转逻辑完善**
  - [x] 扩展 `handleItemClick` 逻辑，支持 `system` 类型通知
  - [x] 实现根据 `data.ideaId` 跳转到点子详情
  - [x] 实现根据 `data.canvasId` 跳转到画布视图
  - [x] 添加跳转逻辑单元测试

- [x] **Task 4: 无限滚动分页**
  - [x] 在 `useNotifications` hook 中添加分页状态管理
  - [x] 实现 `loadMore` 加载更多功能
  - [x] 在 `NotificationDropdown` 中集成 `IntersectionObserver` 触发加载
  - [x] 添加分页逻辑单元测试

- [x] **Task 5: 单元测试增强**
  - [x] 完善 `NotificationBell` 测试 (覆盖 Badge 显示逻辑)
  - [x] 完善 `NotificationDropdown` 测试 (覆盖跳转和空状态)
  - [x] 完善 `NotificationItem` 测试 (覆盖不同类型渲染)

## Dev Notes

### 🔧 核心改动点

**1. 扩展 `handleItemClick` (NotificationDropdown.tsx:11-17)**

```typescript
// 当前实现（仅 stale_reminder）:
if (notification?.type === 'stale_reminder') {
  navigate('/ideas?isStale=true');
}

// 需补充 system 类型跳转:
if (notification?.type === 'stale_reminder') {
  navigate('/ideas?isStale=true');
} else if (notification?.data?.ideaId) {
  navigate(`/ideas/${notification.data.ideaId}`);
} else if (notification?.data?.canvasId) {
  navigate(`/canvas/${notification.data.canvasId}`);
}
// 无 data 时仅标记已读，不跳转
```

**2. 无限滚动实现**

```typescript
// useNotifications.ts 扩展
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);

const loadMore = async () => {
  if (!hasMore || isLoading) return;
  const nextPage = page + 1;
  const result = await notificationsService.getAll({ page: nextPage, pageSize: 10 });
  setNotifications(prev => [...prev, ...result.data]);
  setHasMore(result.meta.page < result.meta.totalPages);
  setPage(nextPage);
};

// NotificationDropdown.tsx 添加 Observer
const observerRef = useRef<HTMLDivElement>(null);
useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => { if (entry.isIntersecting) loadMore(); },
    { threshold: 0.1 }
  );
  if (observerRef.current) observer.observe(observerRef.current);
  return () => observer.disconnect();
}, [hasMore, isLoading]);

// 列表底部添加观察点
<div ref={observerRef} className="h-4" />
{isLoading && <Spin size="small" />}
```

### 现有代码位置

| 文件                                                                                                                                        | 说明                     |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| [NotificationDropdown.tsx](file:///Users/offer/offer_work/ideaFlow/apps/web/src/features/notifications/components/NotificationDropdown.tsx) | 扩展跳转 + 添加 Observer |
| [useNotifications.ts](file:///Users/offer/offer_work/ideaFlow/apps/web/src/features/notifications/hooks/useNotifications.ts)                | 添加 loadMore + hasMore  |

### 技术规范

| 项目          | 规范                             |
| ------------- | -------------------------------- |
| **UI 组件库** | Arco Design                      |
| **分页**      | pageSize = 10                    |
| **时间格式**  | dayjs `fromNow()` (已配置 zh-cn) |

### References

- [FR43](file:///Users/offer/offer_work/ideaFlow/_bmad-output/planning-artifacts/epics.md#L1355)
- [Story 6.2](file:///Users/offer/offer_work/ideaFlow/_bmad-output/implementation-artifacts/6-2-stale-reminder-notification.md)
- [project-context.md](file:///Users/offer/offer_work/ideaFlow/_bmad-output/project-context.md)

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

- [NotificationBell.tsx](file:///Users/offer/offer_work/ideaFlow/apps/web/src/features/notifications/components/NotificationBell.tsx)
- [NotificationDropdown.tsx](file:///Users/offer/offer_work/ideaFlow/apps/web/src/features/notifications/components/NotificationDropdown.tsx)
- [NotificationItem.tsx](file:///Users/offer/offer_work/ideaFlow/apps/web/src/features/notifications/components/NotificationItem.tsx)
- [useNotifications.ts](file:///Users/offer/offer_work/ideaFlow/apps/web/src/features/notifications/hooks/useNotifications.ts)
- [notifications.ts](file:///Users/offer/offer_work/ideaFlow/apps/web/src/features/notifications/stores/notifications.ts)
- [dayjs.ts](file:///Users/offer/offer_work/ideaFlow/apps/web/src/utils/dayjs.ts)
- [Test Files](file:///Users/offer/offer_work/ideaFlow/apps/web/src/features/notifications/components/)
