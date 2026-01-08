import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Idea } from '@/features/ideas/types';
import { IconLoading, IconDragDotVertical } from '@arco-design/web-react/icon';

interface IdeasResponse {
  data: Idea[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const CanvasLibrary: React.FC = () => {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['ideas-sidebar'],
    queryFn: async ({ pageParam }) => {
      const { data } = await api.get<IdeasResponse>('/ideas', {
        params: { page: pageParam, limit: 20 },
      });
      return data;
    },
    getNextPageParam: (lastPage: IdeasResponse) => {
      if (lastPage.meta.page < lastPage.meta.totalPages) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  const ideas = data?.pages.flatMap((page) => page.data) || [];

  const handleDragStart = (e: React.DragEvent, ideaId: string) => {
    e.dataTransfer.setData('ideaId', ideaId);
    e.dataTransfer.effectAllowed = 'copy';
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-4 h-full text-slate-500">
        <IconLoading className="animate-spin text-lg" />
        <span className="text-[10px]">加载中...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center h-full px-4 gap-4 overflow-hidden border-l border-slate-700 mx-4">
      <div className="flex-shrink-0 flex flex-col justify-center">
        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">
          Idea Library
        </span>
        <span className="text-[9px] text-slate-600">Drag to canvas</span>
      </div>

      <div className="flex-1 flex items-center gap-3 overflow-x-auto scrollbar-hide py-1">
        {ideas.map((idea) => (
          <div
            key={idea.id}
            draggable
            onDragStart={(e) => handleDragStart(e, idea.id)}
            className="flex-shrink-0 w-48 h-10 px-3 flex items-center gap-2 bg-slate-900/60 border border-slate-700/50 rounded-lg cursor-grab active:cursor-grabbing hover:border-blue-500/50 hover:bg-slate-900 transition-all group relative overflow-hidden"
          >
            <div className="absolute left-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <IconDragDotVertical className="text-slate-600 text-[10px]" />
            </div>
            <p className="text-[11px] text-slate-300 truncate pl-2">{idea.content}</p>
          </div>
        ))}

        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="flex-shrink-0 px-3 py-1 text-[10px] text-blue-400 hover:text-blue-300 disabled:text-slate-600 transition-colors"
          >
            {isFetchingNextPage ? '...' : 'More'}
          </button>
        )}
      </div>
    </div>
  );
};
