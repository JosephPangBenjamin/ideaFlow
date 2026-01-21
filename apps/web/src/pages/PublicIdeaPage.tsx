import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Spin, Empty, Typography, Card, Tag } from '@arco-design/web-react';
import { IconBulb } from '@arco-design/web-react/icon';
import { api } from '@/services/api';

interface PublicIdea {
  id: string;
  content: string;
  createdAt: string;
  sources?: Array<{
    type: 'link' | 'image' | 'text';
    url?: string;
    content?: string;
    meta?: { title?: string; description?: string };
  }>;
  tasks?: Array<{
    id: string;
    title: string;
    status: string;
  }>;
}

export function PublicIdeaPage() {
  const { token } = useParams<{ token: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ['public-idea', token],
    queryFn: async () => {
      const response = await api.get<{ data: PublicIdea }>(`/ideas/public/${token}`);
      return response.data.data;
    },
    enabled: !!token,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Spin size={40} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Empty
          icon={<IconBulb style={{ fontSize: 48, color: '#64748b' }} />}
          description={
            <div className="text-center">
              <Typography.Title heading={4} className="text-white">
                页面不存在
              </Typography.Title>
              <Typography.Text className="text-slate-400">
                该内容已设为私密或链接已失效
              </Typography.Text>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="sticky top-0 bg-slate-900/80 backdrop-blur-md border-b border-white/5 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-500/20 border border-purple-500/30">
            <IconBulb style={{ fontSize: 20, color: '#a855f7' }} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-purple-400 uppercase tracking-[0.2em]">
              公开分享
            </div>
            <h1 className="text-lg font-bold">IdeaFlow</h1>
          </div>
          <Tag color="blue" className="ml-auto">
            只读
          </Tag>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card className="bg-slate-800/50 border-slate-700">
          {/* Idea Content */}
          <div className="mb-6">
            <Typography.Text className="text-slate-400 text-xs">
              {new Date(data.createdAt).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography.Text>
            <div className="mt-4 text-white text-lg leading-relaxed whitespace-pre-wrap">
              {data.content}
            </div>
          </div>

          {/* Sources */}
          {data.sources && data.sources.length > 0 && (
            <div className="border-t border-slate-700 pt-6">
              <Typography.Text className="text-slate-400 text-xs uppercase tracking-wider mb-4 block">
                来源参考 ({data.sources.length})
              </Typography.Text>
              <div className="space-y-3">
                {data.sources.map((source, index) => (
                  <div
                    key={index}
                    className="p-3 bg-slate-700/50 rounded-lg border border-slate-600"
                  >
                    {source.type === 'link' && source.url && (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 hover:underline"
                      >
                        {source.meta?.title || source.url}
                      </a>
                    )}
                    {source.type === 'image' && source.url && (
                      <img src={source.url} alt="来源图片" className="max-w-full rounded-lg" />
                    )}
                    {source.type === 'text' && source.content && (
                      <div className="text-slate-300">{source.content}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tasks */}
          {data.tasks && data.tasks.length > 0 && (
            <div className="border-t border-slate-700 pt-6 mt-6">
              <Typography.Text className="text-slate-400 text-xs uppercase tracking-wider mb-4 block">
                关联任务 ({data.tasks.length})
              </Typography.Text>
              <div className="space-y-2">
                {data.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 bg-slate-700/50 rounded-lg border border-slate-600 flex items-center gap-3"
                  >
                    <Tag
                      color={
                        task.status === 'done'
                          ? 'green'
                          : task.status === 'in_progress'
                            ? 'blue'
                            : 'gray'
                      }
                    >
                      {task.status === 'done'
                        ? '已完成'
                        : task.status === 'in_progress'
                          ? '进行中'
                          : '待办'}
                    </Tag>
                    <span className="text-slate-300">{task.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          由 <span className="text-purple-400">IdeaFlow</span> 生成的公开分享页面
        </div>
      </div>
    </div>
  );
}

export default PublicIdeaPage;
