import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, Message } from '@arco-design/web-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { tasksService, CreateTaskDto, TaskStatus } from '../services/tasks.service';
import { useAnalytics } from '@/hooks/useAnalytics';

interface CreateTaskModalProps {
  visible: boolean;
  ideaId?: string;
  initialTitle?: string;
  initialSources?: any[];
  onCancel: () => void;
  onSuccess?: (taskId?: string) => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  visible,
  ideaId,
  initialTitle = '',
  initialSources,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [showConfetti, setShowConfetti] = useState(false);
  const queryClient = useQueryClient();
  const { track } = useAnalytics();

  const mutation = useMutation({
    mutationFn: (values: CreateTaskDto) => tasksService.createTask(values),
    onSuccess: (data) => {
      setShowConfetti(true);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
      queryClient.invalidateQueries({ queryKey: ['canvas'] });

      Message.success('任务创建成功 🎉');

      track('task_created', {
        ideaId,
        taskId: data.id,
        category: data.category,
      });

      setTimeout(() => {
        setShowConfetti(false);
        onSuccess?.(data.id);
        form.resetFields();
      }, 2000);
    },
    onError: () => {
      Message.error('创建任务失败，请稍后重试');
    },
  });

  const handleSubmit = async () => {
    try {
      const values = await form.validate();

      // Arco Design DatePicker returns a string or Date object
      let dueDate: string | undefined;
      if (values.dueDate) {
        // If it's already a string and valid, use it; otherwise verify it's a Date
        dueDate =
          typeof values.dueDate === 'string' ? values.dueDate : values.dueDate.toISOString();
      }

      mutation.mutate({
        ...values,
        ideaId,
        sources: initialSources,
        dueDate,
      });
    } catch (error) {
      // Validation failed
    }
  };

  return (
    <>
      <Modal
        title="将想法转为任务"
        visible={visible}
        onOk={handleSubmit}
        onCancel={onCancel}
        confirmLoading={mutation.isPending}
        okText="创建任务"
        cancelText="取消"
        className="max-w-md"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            title: initialTitle,
            status: TaskStatus.todo,
          }}
        >
          <Form.Item
            label="任务标题"
            field="title"
            rules={[{ required: true, message: '请输入任务标题' }]}
          >
            <Input placeholder="输入任务标题..." />
          </Form.Item>

          <Form.Item label="任务描述" field="description">
            <Input.TextArea placeholder="输入任务详细描述（可选）" autoSize={{ minRows: 2 }} />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="截止日期" field="dueDate">
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item label="分类" field="category">
              <Input placeholder="如：工作、个人" />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-[9999] flex items-center justify-center"
          >
            {/* Simple celebration sparks with framer-motion */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, scale: 0 }}
                animate={{
                  x: (Math.random() - 0.5) * 600,
                  y: (Math.random() - 0.5) * 600,
                  scale: [0, 1, 0],
                  rotate: Math.random() * 360,
                }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="absolute w-4 h-4 rounded-full"
                style={{
                  backgroundColor: ['#A855F7', '#3B82F6', '#10B981', '#F59E0B'][i % 4],
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
