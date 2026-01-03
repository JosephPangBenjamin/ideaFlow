import { Card, Tag } from '@arco-design/web-react';
import { motion } from 'framer-motion';
import { IconCheckCircle } from '@arco-design/web-react/icon';

export function Tasks() {
  const defaultTasks = [
    {
      id: 1,
      title: '任务一',
      description: '完成主界面的 UI 优化',
      status: '进行中',
      color: 'blue',
    },
    { id: 2, title: '任务二', description: '对接后端 API 接口', status: '待处理', color: 'orange' },
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {defaultTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl hover:border-purple-500/50 transition-colors"
              bordered={false}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <IconCheckCircle className="text-purple-400 text-xl" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                    <Tag color={task.color} bordered>
                      {task.status}
                    </Tag>
                  </div>
                  <p className="text-slate-400 text-sm">{task.description}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
