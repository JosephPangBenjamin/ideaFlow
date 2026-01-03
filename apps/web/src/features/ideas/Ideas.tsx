import { useState } from 'react';
import { Drawer } from '@arco-design/web-react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/utils/motion';
import { IdeaList } from './components/IdeaList';
import { QuickCapture } from './components/QuickCapture';
import { QuickCaptureFAB } from './components/QuickCaptureFAB';
import { IdeaDetail } from './components/IdeaDetail';
import { Idea } from './types';

export function Ideas() {
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);

  const handleItemClick = (idea: Idea) => {
    setSelectedIdea(idea);
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="w-full">
      {/* Header Section aligned with Dashboard style */}
      <div className="mb-10 flex items-end justify-between">
        <motion.div variants={fadeInUp}>
          <h1 className="text-4xl font-heading font-bold text-white tracking-tight">想法流</h1>
          <p className="text-slate-400 mt-2 text-lg">在这里捕捉、整理和链接您的每一个灵感碎片。</p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="hidden md:flex items-center gap-4 text-slate-300 bg-white/5 px-4 py-2 rounded-full border border-white/5 backdrop-blur-sm"
        >
          <span>💡 灵感爆发中</span>
        </motion.div>
      </div>

      <IdeaList onItemClick={handleItemClick} />

      <QuickCapture />
      <QuickCaptureFAB />

      <Drawer
        width={500}
        title={<span className="text-white font-semibold">想法详情</span>}
        visible={!!selectedIdea}
        onOk={() => setSelectedIdea(null)}
        onCancel={() => setSelectedIdea(null)}
        footer={null}
        className="bg-slate-900"
        headerStyle={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          backgroundColor: '#0f172a',
        }}
        maskClosable={true}
      >
        <div className="text-slate-200">
          {selectedIdea && (
            <IdeaDetail
              idea={selectedIdea}
              onUpdate={setSelectedIdea}
              onDelete={() => setSelectedIdea(null)}
            />
          )}
        </div>
      </Drawer>
    </motion.div>
  );
}
