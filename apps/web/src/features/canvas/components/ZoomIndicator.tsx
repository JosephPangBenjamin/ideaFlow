import { useAtom } from 'jotai';
import { scalePercentAtom } from '../stores/canvasAtoms';

interface ZoomIndicatorProps {
  onReset: () => void;
}

export function ZoomIndicator({ onReset }: ZoomIndicatorProps) {
  const [scalePercent] = useAtom(scalePercentAtom);

  return (
    <div
      data-testid="zoom-indicator"
      className="absolute bottom-4 right-4 bg-slate-800/80 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2 text-sm text-slate-200 shadow-lg"
    >
      <span data-testid="zoom-percent">{scalePercent}%</span>
      {scalePercent !== 100 && (
        <button
          data-testid="zoom-reset-button"
          onClick={onReset}
          className="ml-1 px-2 py-0.5 text-xs bg-slate-700 hover:bg-slate-600 rounded transition-colors"
          title="重置视图 (100%)"
        >
          重置
        </button>
      )}
    </div>
  );
}
