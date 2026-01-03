import React, { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { api } from '../../../services/api';
import { Idea } from '../types';
import { IdeaCard } from './IdeaCard';
import { IconLoading } from '@arco-design/web-react/icon';
import { Empty } from '@arco-design/web-react';
import { isSidebarOpenAtom } from '@/store/ui';

interface Props {
  onItemClick: (idea: Idea) => void;
}

interface IdeasResponse {
  data: Idea[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const IdeaList: React.FC<Props> = ({ onItemClick }) => {
  const isSidebarOpen = useAtomValue(isSidebarOpenAtom);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useInfiniteQuery({
      queryKey: ['ideas'],
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

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0] && entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-500 space-x-2">
        <IconLoading className="animate-spin" />
        <span>加载中...</span>
      </div>
    );
  }

  if (isError) {
    return <div className="text-center text-red-500 py-10">加载失败，请稍后重试</div>;
  }

  const ideas = data?.pages.flatMap((page) => page.data) || [];

  if (ideas.length === 0) {
    return (
      <div className="py-20 text-center">
        <Empty description={<span className="text-slate-500">还没有想法，快去捕捉灵感吧！</span>} />
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-10">
      <div
        className={`grid gap-6 transition-all duration-500 ease-spring ${
          isSidebarOpen
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
        }`}
      >
        {ideas.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} onClick={onItemClick} />
        ))}
      </div>

      <div ref={loadMoreRef} className="flex justify-center py-4 text-slate-500 text-sm">
        {isFetchingNextPage ? (
          <div className="flex items-center space-x-2">
            <IconLoading className="animate-spin" />
            <span>加载更多...</span>
          </div>
        ) : hasNextPage ? (
          <span>滚动加载更多</span>
        ) : (
          <span>没有更多了</span>
        )}
      </div>
    </div>
  );
};
