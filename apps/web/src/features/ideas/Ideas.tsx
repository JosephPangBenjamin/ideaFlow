import { Card } from '@arco-design/web-react';
import { motion } from 'framer-motion';
import { IconBulb } from '@arco-design/web-react/icon';

export function Ideas() {
  const defaultIdeas = [
    { id: 1, title: '想法一', content: '这是一个绝妙的创意，需要进一步细化。' },
    { id: 2, title: '想法二', content: '关于提升效率的新构思，可以尝试集成 AI。' },
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {defaultIdeas.map((idea, index) => (
          <motion.div
            key={idea.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl hover:border-blue-500/50 transition-colors"
              bordered={false}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <IconBulb className="text-blue-400 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{idea.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{idea.content}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
