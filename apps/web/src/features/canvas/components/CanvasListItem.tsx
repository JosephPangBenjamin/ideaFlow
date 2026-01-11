import { useState } from 'react';
import { Dropdown, Menu, Modal, Input, Typography, Message, Button } from '@arco-design/web-react';
import { IconEdit, IconDelete, IconMore, IconApps } from '@arco-design/web-react/icon';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Canvas, updateCanvas, deleteCanvas } from '../services/canvas.service';
import { formatUpdateTime } from '../utils/canvasUtils';
import { hoverAnimation, tapAnimation } from '@/utils/motion';
import './CanvasListItem.css';

const { Text } = Typography;

export interface CanvasListItemProps {
  canvas: Canvas;
  isActive?: boolean;
  onSelect?: (canvas: Canvas) => void;
  onDelete?: (canvas: Canvas) => void;
}

/**
 * 画布列表项组件
 * 支持点击选择、双击重命名、右键菜单删除
 * AC: #4 重命名画布, #5 删除画布
 */
export function CanvasListItem({ canvas, isActive, onSelect, onDelete }: CanvasListItemProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(canvas.name);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // 重命名 mutation
  const renameMutation = useMutation({
    mutationFn: (name: string) => updateCanvas(canvas.id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['canvases'] });
      Message.success('已保存 ✓');
      setIsEditing(false);
    },
    onError: () => {
      Message.error('重命名失败');
      setEditName(canvas.name); // 恢复原名
      setIsEditing(false);
    },
  });

  // 删除 mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteCanvas(canvas.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['canvases'] });
      Message.success('画布已删除');
      onDelete?.(canvas);
    },
    onError: () => {
      Message.error('删除失败');
    },
  });

  // 处理保存重命名
  const handleSaveRename = () => {
    const trimmedName = editName.trim();
    if (trimmedName && trimmedName !== canvas.name) {
      renameMutation.mutate(trimmedName);
    } else {
      setEditName(canvas.name);
      setIsEditing(false);
    }
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveRename();
    } else if (e.key === 'Escape') {
      setEditName(canvas.name);
      setIsEditing(false);
    }
  };

  // 处理删除确认
  const handleDeleteConfirm = () => {
    Modal.confirm({
      title: '确定删除这个画布吗？',
      content: '所有节点和连线将被删除，此操作无法撤销。',
      okText: '删除',
      cancelText: '取消',
      okButtonProps: { status: 'danger' },
      onOk: () => deleteMutation.mutate(),
    });
  };

  // 右键菜单
  const dropdownMenu = (
    <Menu>
      <Menu.Item
        key="rename"
        onClick={(e) => {
          e.stopPropagation();
          setIsEditing(true);
          setDropdownVisible(false);
        }}
      >
        <IconEdit /> 重命名
      </Menu.Item>
      <Menu.Item
        key="delete"
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteConfirm();
          setDropdownVisible(false);
        }}
      >
        <IconDelete style={{ color: 'rgb(var(--danger-6))' }} />
        <span style={{ color: 'rgb(var(--danger-6))' }}>删除</span>
      </Menu.Item>
    </Menu>
  );

  const nodeCount = canvas._count?.nodes || 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ ...hoverAnimation, y: -4, backgroundColor: 'rgba(30, 41, 59, 0.6)' }}
      whileTap={tapAnimation}
      className={`rounded-2xl p-6 bg-slate-800/40 backdrop-blur-md border border-white/10 shadow-xl shadow-black/5 cursor-pointer group overflow-hidden relative h-[200px] ${isActive ? 'ring-2 ring-blue-500/50 bg-slate-800/60' : ''}`}
      data-testid={`canvas-item-${canvas.id}`}
      onClick={() => !isEditing && onSelect?.(canvas)}
    >
      {/* Dynamic Glow Effect */}
      <div
        className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity ${isActive ? 'bg-blue-500 opacity-20' : 'bg-slate-400 opacity-5'}`}
      />

      <div className="flex flex-col h-full justify-between relative z-10">
        <div className="flex items-start justify-between">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 ${isActive ? 'text-blue-400 border-blue-400/30 bg-blue-500/10' : 'text-slate-400 group-hover:text-blue-400'}`}
          >
            <IconApps className="text-xl" />
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
              {formatUpdateTime(canvas.updatedAt)}
            </span>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Dropdown
                droplist={dropdownMenu}
                trigger="click"
                position="bl"
                popupVisible={dropdownVisible}
                onVisibleChange={setDropdownVisible}
              >
                <Button
                  type="text"
                  size="small"
                  icon={<IconMore />}
                  className="text-slate-400 hover:text-white hover:bg-white/10"
                  onClick={(e) => e.stopPropagation()}
                />
              </Dropdown>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">画布项目</p>
          {isEditing ? (
            <Input
              autoFocus
              size="small"
              value={editName}
              onChange={setEditName}
              onPressEnter={handleSaveRename}
              onBlur={handleSaveRename}
              onKeyDown={handleKeyDown}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900/60 border-blue-500/50 text-white rounded-lg mt-1"
            />
          ) : (
            <h3 className="text-lg font-heading font-bold text-white tracking-tight line-clamp-1 group-hover:text-blue-50 transition-colors mt-1">
              {canvas.name}
            </h3>
          )}

          <div className="flex items-center gap-2 mt-2 text-xs font-medium text-slate-500 group-hover:text-slate-300 transition-colors">
            <span>{nodeCount} 个节点</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
