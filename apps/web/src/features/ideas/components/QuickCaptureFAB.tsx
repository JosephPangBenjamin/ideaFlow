import { useSetAtom } from 'jotai';
import { motion } from 'framer-motion';
import { IconPlus } from '@arco-design/web-react/icon';
import { quickCaptureOpenAtom } from '../stores/ideas';

export const QuickCaptureFAB = () => {
  const setIsOpen = useSetAtom(quickCaptureOpenAtom);

  return (
    <motion.button
      onClick={() => setIsOpen(true)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center text-white hover:shadow-xl hover:shadow-blue-500/40 transition-shadow"
      title="新建想法 (⌘+N)"
    >
      <IconPlus className="w-7 h-7" />
    </motion.button>
  );
};
