import { Card } from '@arco-design/web-react';
import { motion } from 'framer-motion';
import { IconCommon } from '@arco-design/web-react/icon';

export function Canvas() {
  const defaultCanvases = [
    { id: 1, title: '画布一', lastModified: '2026-01-03' },
    { id: 2, title: '画布二', lastModified: '2026-01-02' },
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {defaultCanvases.map((canvas, index) => (
          <motion.div
            key={canvas.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl hover:border-green-500/50 transition-all group"
              bordered={false}
              cover={
                <div className="h-32 bg-slate-900/50 flex items-center justify-center border-b border-slate-700/30 group-hover:bg-slate-900/80 transition-colors">
                  <IconCommon className="text-4xl text-slate-700 group-hover:text-green-500/50 transition-colors" />
                </div>
              }
            >
              <h3 className="text-lg font-semibold text-white mb-1">{canvas.title}</h3>
              <p className="text-slate-500 text-xs">上次修改: {canvas.lastModified}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
