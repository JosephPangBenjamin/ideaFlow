import { useAtom } from 'jotai';
import { saveStatusAtom } from '../stores/canvasAtoms';
import { IconCheck, IconLoading, IconClose } from '@arco-design/web-react/icon';

export function SaveIndicator() {
  const [saveStatus] = useAtom(saveStatusAtom);

  if (saveStatus === 'idle') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/80 backdrop-blur-sm text-sm">
      {saveStatus === 'saving' && (
        <>
          <IconLoading className="animate-spin text-blue-400" />
          <span className="text-slate-300">保存中...</span>
        </>
      )}
      {saveStatus === 'saved' && (
        <>
          <IconCheck className="text-green-400" />
          <span className="text-slate-300">已保存</span>
        </>
      )}
      {saveStatus === 'error' && (
        <>
          <IconClose className="text-red-400" />
          <span className="text-slate-300">保存失败</span>
        </>
      )}
    </div>
  );
}
