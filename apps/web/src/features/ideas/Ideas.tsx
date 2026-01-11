import { useState } from 'react';
import { Drawer } from '@arco-design/web-react';
import { motion } from 'framer-motion';
import { staggerContainer } from '@/utils/motion';
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
        width={400}
        title={null}
        visible={!!selectedIdea}
        onOk={() => setSelectedIdea(null)}
        onCancel={() => setSelectedIdea(null)}
        footer={null}
        className="idea-detail-drawer"
        headerStyle={{ display: 'none' }}
        bodyStyle={{ padding: 0, height: '100%' }}
        maskClosable={true}
      >
        {selectedIdea && (
          <IdeaDetail
            idea={selectedIdea}
            onUpdate={setSelectedIdea}
            onDelete={() => setSelectedIdea(null)}
          />
        )}
      </Drawer>
    </motion.div>
  );
}
