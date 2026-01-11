import React, { useState, useCallback, useEffect } from 'react';
import { IdeaSource } from '../types';
import { IconLink, IconImage, IconFile, IconLoading, IconPlus } from '@arco-design/web-react/icon';
import { api } from '../../../services/api';
import { Message, Button, Progress, Image } from '@arco-design/web-react';

interface Props {
  value?: IdeaSource[];
  onChange: (sources: IdeaSource[]) => void;
  onLoadingChange?: (loading: boolean) => void;
}

type TabType = 'link' | 'image' | 'text';

export const SourceInput: React.FC<Props> = ({ value = [], onChange, onLoadingChange }) => {
  const [activeTab, setActiveTab] = useState<TabType>('link');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  // Loading message rotation removed - now driven by real events
  useEffect(() => {
    if (!isLoading) {
      setLoadingMessage('');
      setProgress(0);
    }
  }, [isLoading]);

  // Input states
  const [linkUrl, setLinkUrl] = useState('');
  const [textContent, setTextContent] = useState('');

  const addSource = (source: IdeaSource) => {
    onChange([...value, source]);
  };

  const removeSource = (index: number) => {
    const newSources = [...value];
    newSources.splice(index, 1);
    onChange(newSources);
  };

  const handleLinkAdd = async (url: string) => {
    if (!url || !url.startsWith('http')) return;

    // Check if already added
    if (value.some((s) => s.type === 'link' && s.url === url)) {
      Message.warning('链接已存在');
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setLoadingMessage('准备分析链接...');

    const authData = localStorage.getItem('ideaflow-auth');
    let token = '';
    if (authData) {
      try {
        token = JSON.parse(authData).accessToken;
      } catch (e) {
        console.error('Failed to parse auth data', e);
      }
    }
    const apiBaseUrl = (import.meta as any).env?.VITE_API_URL || '';
    const sseUrl = `${apiBaseUrl}/ideaFlow/api/v1/meta/preview-stream?url=${encodeURIComponent(url)}${token ? `&token=${token}` : ''}`;
    const eventSource = new EventSource(sseUrl);

    eventSource.onmessage = (event) => {
      const { type, data, message } = JSON.parse(event.data);
      if (type === 'progress') {
        setLoadingMessage(data.message);
        setProgress(data.percent);
      } else if (type === 'result') {
        addSource({
          type: 'link',
          url,
          meta: data,
        });
        setLinkUrl('');
        eventSource.close();
        setIsLoading(false);
      } else if (type === 'error') {
        Message.error('解析链接失败: ' + message);
        addSource({ type: 'link', url }); // Fallback to raw link
        setLinkUrl('');
        eventSource.close();
        setIsLoading(false);
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE Error:', err);
      // If SSE fails (e.g. auth), we might want to fallback to the old POST or just wait/timeout
      Message.error('连接分析服务失败，尝试使用基础模式...');
      eventSource.close();
      // Fallback
      handleLinkAddLegacy(url);
    };
  };

  const handleLinkAddLegacy = async (url: string) => {
    try {
      const { data } = await api.post('/meta/preview', { url });
      addSource({ type: 'link', url, meta: data });
      setLinkUrl('');
    } catch {
      addSource({ type: 'link', url });
      setLinkUrl('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextAdd = () => {
    if (!textContent.trim()) return;
    addSource({
      type: 'text',
      content: textContent,
    });
    setTextContent('');
  };

  const handleImageUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      Message.error('图片大小不能超过 5MB');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await api.post('/meta/upload', formData);
      addSource({
        type: 'image',
        url: data.url,
      });
    } catch (error) {
      Message.error('上传失败');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handlePaste = useCallback(
    async (e: React.ClipboardEvent) => {
      const clipboardData = e.clipboardData;
      const items = clipboardData.items;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item && item.type.indexOf('image') !== -1) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            handleImageUpload(file);
          }
          return;
        }
      }

      const text = clipboardData.getData('text/plain');
      if (text && (text.startsWith('http://') || text.startsWith('https://'))) {
        e.preventDefault();
        handleLinkAdd(text);
      }
    },
    [value, onChange] // Dependencies for handleLinkAdd via closure
  );

  return (
    <div
      className="w-full mt-2 bg-slate-700/30 rounded-lg p-3 border border-slate-600/50 space-y-3"
      onPaste={handlePaste}
    >
      {/* Sources Display by Category */}
      {value.length > 0 && (
        <div className="space-y-3 mb-3 max-h-40 overflow-y-auto">
          {/* Links Section */}
          {value.filter((s) => s.type === 'link').length > 0 && (
            <div>
              <div className="text-[10px] text-slate-400 mb-1 flex items-center gap-1">
                <IconLink className="text-blue-400" /> 链接 (
                {value.filter((s) => s.type === 'link').length})
              </div>
              <div className="space-y-1">
                {value
                  .filter((s) => s.type === 'link')
                  .map((src, idx) => (
                    <div
                      key={`link-${idx}`}
                      className="flex items-center justify-between bg-slate-800/50 rounded px-2 py-1 text-xs group"
                    >
                      <span className="text-slate-300 truncate flex-1" title={src.url}>
                        {src.meta?.title || src.url}
                      </span>
                      <button
                        onClick={() => removeSource(value.indexOf(src))}
                        className="text-slate-500 hover:text-red-400 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Images Section */}
          {value.filter((s) => s.type === 'image').length > 0 && (
            <div>
              <div className="text-[10px] text-slate-400 mb-1 flex items-center gap-1">
                <IconImage className="text-green-400" /> 图片 (
                {value.filter((s) => s.type === 'image').length})
              </div>
              <div className="flex flex-wrap gap-2">
                {value
                  .filter((s) => s.type === 'image')
                  .map((src, idx) => (
                    <div key={`image-${idx}`} className="relative group">
                      <Image
                        src={src.url}
                        alt="Preview"
                        width={48}
                        height={48}
                        style={{ objectFit: 'cover' }}
                        className="rounded border border-slate-600"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSource(value.indexOf(src));
                        }}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10"
                      >
                        ×
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Notes Section */}
          {value.filter((s) => s.type === 'text').length > 0 && (
            <div>
              <div className="text-[10px] text-slate-400 mb-1 flex items-center gap-1">
                <IconFile className="text-yellow-400" /> 备注 (
                {value.filter((s) => s.type === 'text').length})
              </div>
              <div className="space-y-1">
                {value
                  .filter((s) => s.type === 'text')
                  .map((src, idx) => (
                    <div
                      key={`text-${idx}`}
                      className="flex items-center justify-between bg-slate-800/50 rounded px-2 py-1 text-xs group"
                    >
                      <span className="text-slate-300 truncate flex-1" title={src.content}>
                        {src.content?.substring(0, 50)}
                        {(src.content?.length ?? 0) > 50 ? '...' : ''}
                      </span>
                      <button
                        onClick={() => removeSource(value.indexOf(src))}
                        className="text-slate-500 hover:text-red-400 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input Area */}
      <div className="space-y-3">
        {/* Tabs for switching input mode */}
        <div className="flex space-x-1 border-b border-slate-600/50 pb-2">
          <button
            onClick={() => setActiveTab('link')}
            className={`flex items-center space-x-1 px-3 py-1 text-xs rounded transition-colors ${
              activeTab === 'link'
                ? 'bg-slate-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <IconLink />
            <span>链接</span>
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`flex items-center space-x-1 px-3 py-1 text-xs rounded transition-colors ${
              activeTab === 'image'
                ? 'bg-slate-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <IconImage />
            <span>图片</span>
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center space-x-1 px-3 py-1 text-xs rounded transition-colors ${
              activeTab === 'text'
                ? 'bg-slate-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <IconFile />
            <span>备注</span>
          </button>
        </div>

        <div className="min-h-[40px]">
          {activeTab === 'link' && (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLinkAdd(linkUrl)}
                placeholder="粘贴或输入链接 URL..."
                className="flex-1 bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                disabled={isLoading}
              />
              <Button
                size="small"
                type="primary"
                icon={isLoading ? <IconLoading className="animate-spin" /> : <IconPlus />}
                onClick={() => handleLinkAdd(linkUrl)}
                disabled={!linkUrl || isLoading}
              />
            </div>
          )}

          {activeTab === 'image' && (
            <div className="flex items-center justify-center">
              <label className="w-full flex flex-col items-center justify-center p-4 border border-dashed border-slate-600 rounded hover:bg-slate-700/30 transition-colors cursor-pointer text-slate-400 hover:text-blue-400">
                {isLoading ? (
                  <IconLoading className="text-xl animate-spin mb-1" />
                ) : (
                  <IconImage className="text-xl mb-1" />
                )}
                <span className="text-xs">{isLoading ? '上传中...' : '点击或粘贴图片上传'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileInputChange}
                  disabled={isLoading}
                />
              </label>
            </div>
          )}

          {activeTab === 'text' && (
            <div className="flex flex-col space-y-2">
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="输入备注内容..."
                className="w-full h-16 bg-slate-800 border border-slate-600 rounded px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
              <div className="flex justify-end">
                <Button
                  size="small"
                  type="primary"
                  icon={<IconPlus />}
                  onClick={handleTextAdd}
                  disabled={!textContent.trim()}
                >
                  添加备注
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Footer with loading progress indicator */}
      {isLoading ? (
        <div className="flex items-center gap-2 text-[10px] text-blue-400 bg-slate-800/50 rounded px-2 py-1.5 border border-blue-500/30">
          <IconLoading className="animate-spin" />
          <span className="flex-1">{loadingMessage}</span>
          <div className="w-24">
            <Progress percent={progress} size="mini" showText={false} color="#3b82f6" />
          </div>
        </div>
      ) : (
        <div className="text-[10px] text-slate-500">💡 可多次添加、粘贴链接或图片</div>
      )}
    </div>
  );
};
