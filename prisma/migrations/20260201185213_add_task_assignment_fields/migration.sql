-- ===========================================
-- Story 8.3 Migration: Task Assignment
-- ===========================================

-- 1. Task 表添加画布关联字段（用于团队验证）
ALTER TABLE tasks ADD COLUMN canvas_id UUID REFERENCES canvases(id) ON DELETE SET NULL;

-- 2. Task 表添加分配字段
ALTER TABLE tasks ADD COLUMN assignee_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- 3. 添加索引优化查询性能
CREATE INDEX idx_tasks_canvas_id ON tasks(canvas_id);
CREATE INDEX idx_tasks_assignee_id ON tasks(assignee_id);

-- 4. NotificationType 枚举扩展（PostgreSQL 手动）
-- 添加 TASK_ASSIGNED 通知类型
ALTER TYPE "NotificationType" ADD VALUE 'TASK_ASSIGNED';
