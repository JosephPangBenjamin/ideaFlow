import React from 'react';
import { Tag, Button } from '@arco-design/web-react';
import { IconClose } from '@arco-design/web-react/icon';
import { motion, AnimatePresence } from 'framer-motion';

export interface FilterTagItem {
  key: string;
  label: string;
  onRemove: () => void;
}

interface FilterTagsProps {
  filters: FilterTagItem[];
  onClearAll: () => void;
}

export function FilterTags({ filters, onClearAll }: FilterTagsProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <AnimatePresence>
        {filters.map((filter) => (
          <motion.div
            key={filter.key}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <Tag
              closable
              onClose={filter.onRemove}
              className="bg-purple-600/10 border-purple-500/30 text-purple-200 hover:bg-purple-600/20 px-3 py-1 text-sm rounded-full flex items-center gap-2"
              closeIcon={<IconClose className="text-purple-400 hover:text-purple-200" />}
            >
              {filter.label}
            </Tag>
          </motion.div>
        ))}
      </AnimatePresence>

      {filters.length > 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-2">
          <Button
            type="text"
            size="mini"
            status="danger"
            onClick={onClearAll}
            className="text-slate-500 hover:text-red-400"
          >
            清除全部
          </Button>
        </motion.div>
      )}
    </div>
  );
}
