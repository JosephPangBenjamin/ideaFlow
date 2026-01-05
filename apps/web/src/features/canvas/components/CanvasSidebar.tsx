import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Idea } from '@/features/ideas/types';
import { IconLoading, IconDragDotVertical } from '@arco-design/web-react/icon';
import { Empty } from '@arco-design/web-react';

interface IdeasResponse {
  data: Idea[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const CanvasSidebar: React.FC = () => {
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
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
      <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2 p-4">
        <IconLoading className="animate-spin text-2xl" />
        <span className="text-xs">加载想法...</span>
      </div>
    );
  }

  if (isError) {
    return <div className="p-4 text-center text-red-400 text-xs">加载失败，请重试</div>;
  }

  return (
    <div className="flex flex-col h-full bg-slate-800/80 border-r border-slate-700/50 w-64 overflow-hidden">
      <div className="p-4 border-b border-slate-700/50">
        <h2 className="text-sm font-medium text-slate-200">库 (想法列表)</h2>
        <p className="text-[10px] text-slate-500 mt-1">拖拽想法到画布以创建节点</p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <div className="p-3 space-y-3">
          {ideas.length === 0 ? (
            <Empty
              description={<span className="text-slate-500 text-xs">没有想法</span>}
              className="mt-10"
            />
          ) : (
            ideas.map((idea) => (
              <div
                key={idea.id}
                draggable
                onDragStart={(e) => handleDragStart(e, idea.id)}
                className="p-3 bg-slate-900/50 border border-slate-700/50 rounded-lg cursor-grab active:cursor-grabbing hover:border-blue-500/50 hover:bg-slate-900 transition-all group relative"
              >
                <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <IconDragDotVertical className="text-slate-600" />
                </div>
                <div className="pl-2">
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {idea.content}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] text-slate-600">
                      {new Date(idea.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}

          {hasNextPage && (
            <div className="py-2 text-center">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="text-[10px] text-blue-400 hover:text-blue-300 disabled:text-slate-600"
              >
                {isFetchingNextPage ? '加载中...' : '加载更多'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
