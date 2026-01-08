import { IconLoading } from '@arco-design/web-react/icon';

export function Loading() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-950 fixed inset-0 z-50">
      <div className="flex flex-col items-center gap-3">
        <IconLoading className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="text-slate-500 text-sm font-medium">Loading...</span>
      </div>
    </div>
  );
}
