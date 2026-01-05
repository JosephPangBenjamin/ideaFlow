import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Modal, Input, Message, Spin, Empty } from '@arco-design/web-react';
import { motion } from 'framer-motion';
import { IconPlus, IconDelete } from '@arco-design/web-react/icon';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getCanvases,
  createCanvas,
  deleteCanvas,
  Canvas as CanvasType,
} from './services/canvas.service';

export function Canvas() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newCanvasName, setNewCanvasName] = useState('');

  // Fetch canvases
  const { data, isLoading } = useQuery({
    queryKey: ['canvases'],
    queryFn: () => getCanvases(1, 50),
  });

  const canvases = data?.data || [];

  // Create canvas mutation
  const createMutation = useMutation({
    mutationFn: createCanvas,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['canvases'] });
      setCreateModalVisible(false);
      setNewCanvasName('');
      Message.success('画布创建成功');
      // Navigate to the new canvas
      navigate(`/canvas/${response.data.id}`);
    },
    onError: () => {
      Message.error('创建画布失败');
    },
  });

  // Delete canvas mutation
  const deleteMutation = useMutation({
    mutationFn: deleteCanvas,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['canvases'] });
      Message.success('画布已删除');
    },
    onError: () => {
      Message.error('删除画布失败');
    },
  });

  const handleCreateCanvas = () => {
    createMutation.mutate({ name: newCanvasName || undefined });
  };

  const handleDeleteCanvas = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个画布吗？此操作无法撤销。',
      onOk: () => deleteMutation.mutate(id),
    });
  };

  const handleCanvasClick = (canvas: CanvasType) => {
    navigate(`/canvas/${canvas.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spin size={40} />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">我的画布</h1>
        <Button type="primary" icon={<IconPlus />} onClick={() => setCreateModalVisible(true)}>
          新建画布
        </Button>
      </div>

      {/* Canvas Grid */}
      {canvases.length === 0 ? (
        <Empty description="还没有画布，点击新建画布开始" className="mt-20" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {canvases.map((canvas, index) => (
            <motion.div
              key={canvas.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl hover:border-green-500/50 transition-all group cursor-pointer"
                bordered={false}
                onClick={() => handleCanvasClick(canvas)}
                cover={
                  <div className="h-32 bg-slate-900/50 flex items-center justify-center border-b border-slate-700/30 group-hover:bg-slate-900/80 transition-colors relative">
                    <div className="text-4xl text-slate-700 group-hover:text-green-500/50 transition-colors">
                      {canvas._count?.nodes || 0}
                    </div>
                    <span className="absolute bottom-2 right-2 text-xs text-slate-500">
                      {canvas._count?.nodes || 0} 个节点
                    </span>
                    {/* Delete button */}
                    <button
                      className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
                      onClick={(e) => handleDeleteCanvas(canvas.id, e)}
                      aria-label="删除画布"
                    >
                      <IconDelete className="text-red-400" />
                    </button>
                  </div>
                }
              >
                <h3 className="text-lg font-semibold text-white mb-1 truncate">{canvas.name}</h3>
                <p className="text-slate-500 text-xs">
                  更新时间: {new Date(canvas.updatedAt).toLocaleDateString()}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Canvas Modal */}
      <Modal
        title="新建画布"
        visible={createModalVisible}
        onOk={handleCreateCanvas}
        onCancel={() => {
          setCreateModalVisible(false);
          setNewCanvasName('');
        }}
        confirmLoading={createMutation.isPending}
        okText="创建"
        cancelText="取消"
      >
        <Input
          placeholder='画布名称（可选，默认为"未命名画布"）'
          value={newCanvasName}
          onChange={(value) => setNewCanvasName(value)}
          maxLength={100}
        />
      </Modal>
    </div>
  );
}
