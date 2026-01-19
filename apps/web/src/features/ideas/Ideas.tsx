import { useState, useMemo } from 'react';
import { Drawer } from '@arco-design/web-react';
import { motion } from 'framer-motion';
import { staggerContainer } from '@/utils/motion';
import { IdeaList } from './components/IdeaList';
import { QuickCapture } from './components/QuickCapture';
import { QuickCaptureFAB } from './components/QuickCaptureFAB';
import { IdeaDetail } from './components/IdeaDetail';
import { Idea } from './types';
import { IdeaFilterPanel } from './components/IdeaFilterPanel';
import { FilterTags } from '../../components/FilterTags';
import { useIdeaFilters } from './hooks/useIdeaFilters';

export function Ideas() {
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const { dateRange, setDateRange, resetFilters } = useIdeaFilters();

  const handleItemClick = (idea: Idea) => {
    setSelectedIdea(idea);
  };

  const activeFilters = useMemo(() => {
    const tags = [];
    if (dateRange.startDate) {
      tags.push({
        key: 'dateRange',
        label: `时间: ${dateRange.startDate} ~ ${dateRange.endDate}`,
        onRemove: () => setDateRange({ startDate: null, endDate: null }),
      });
    }
    return tags;
  }, [dateRange, setDateRange]);

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <motion.div variants={staggerContainer} initial="hidden" animate="show">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">想法池</h2>
            <p className="text-slate-400 text-sm">捕捉和管理你的每一个灵感瞬间</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <IdeaFilterPanel />
          </div>
        </div>

        <FilterTags filters={activeFilters} onClearAll={resetFilters} />

        <IdeaList onItemClick={handleItemClick} />

        <QuickCapture />
        <QuickCaptureFAB />

        <Drawer
          width={380}
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
    </div>
  );
}
