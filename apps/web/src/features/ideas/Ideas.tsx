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
