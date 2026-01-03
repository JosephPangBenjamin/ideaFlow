import React, { useState, useCallback } from 'react';
import { IdeaSource } from '../types';
import {
  IconLink,
  IconImage,
  IconFile,
  IconLoading,
  IconDelete,
} from '@arco-design/web-react/icon';
import { api } from '../../../services/api';
import { Message } from '@arco-design/web-react';
import { SourcePreview } from './SourcePreview';

interface Props {
  value?: IdeaSource;
  onChange: (source: IdeaSource | undefined) => void;
}

type TabType = 'link' | 'image' | 'text';

export const SourceInput: React.FC<Props> = ({ value, onChange }) => {
  const [activeTab, setActiveTab] = useState<TabType>((value?.type as TabType) || 'link');
  const [isLoading, setIsLoading] = useState(false);

  // Link state
  const [linkUrl, setLinkUrl] = useState(value?.type === 'link' ? value.url : '');

  // Text state
  const [textContent, setTextContent] = useState(value?.type === 'text' ? value.content : '');

  // Image state
  const [imageUrl, setImageUrl] = useState(value?.type === 'image' ? value.url : '');

  const handleTabChange = (type: TabType) => {
    setActiveTab(type);
    onChange(undefined);
    setLinkUrl('');
    setTextContent('');
    setImageUrl('');
  };

  const handleLinkBlur = async () => {
    if (!linkUrl || !linkUrl.startsWith('http')) return;

    setIsLoading(true);
    try {
      const { data } = await api.post('/meta/preview', { url: linkUrl });
      onChange({
        type: 'link',
        url: linkUrl,
        meta: data,
      });
    } catch (error) {
      console.error(error);
      onChange({
        type: 'link',
        url: linkUrl,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinkUrl(e.target.value);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setTextContent(val);
    onChange({
      type: 'text',
      content: val,
    });
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
      setImageUrl(data.url);
      onChange({
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

  // 粘贴事件处理 - 自动识别 URL 或图片
  const handlePaste = useCallback(
    async (e: React.ClipboardEvent) => {
      const clipboardData = e.clipboardData;

      // 检查是否有图片
      const items = clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item && item.type.indexOf('image') !== -1) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            setActiveTab('image');
            handleImageUpload(file);
          }
          return;
        }
      }

      // 检查是否有有效 URL
      const text = clipboardData.getData('text/plain');
      if (text && (text.startsWith('http://') || text.startsWith('https://'))) {
        e.preventDefault();
        setActiveTab('link');
        setLinkUrl(text);

        // 自动获取预览
        setIsLoading(true);
        try {
          const { data } = await api.post('/meta/preview', { url: text });
          onChange({
            type: 'link',
            url: text,
            meta: data,
          });
        } catch (error) {
          console.error(error);
          onChange({
            type: 'link',
            url: text,
          });
        } finally {
          setIsLoading(false);
        }
      }
    },
    [onChange]
  );

  return (
    <div
      className="w-full mt-2 bg-slate-700/30 rounded-lg p-2 border border-slate-600/50"
      onPaste={handlePaste}
    >
      {/* Tabs */}
      <div className="flex space-x-1 mb-2 border-b border-slate-600/50 pb-2">
        <button
          onClick={() => handleTabChange('link')}
          className={`flex items-center space-x-1 px-3 py-1 text-sm rounded transition-colors ${
            activeTab === 'link' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <IconLink />
          <span>链接</span>
        </button>
        <button
          onClick={() => handleTabChange('image')}
          className={`flex items-center space-x-1 px-3 py-1 text-sm rounded transition-colors ${
            activeTab === 'image'
              ? 'bg-slate-600 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <IconImage />
          <span>图片</span>
        </button>
        <button
          onClick={() => handleTabChange('text')}
          className={`flex items-center space-x-1 px-3 py-1 text-sm rounded transition-colors ${
            activeTab === 'text' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <IconFile />
          <span>备注</span>
        </button>
      </div>

      {/* Paste hint */}
      <div className="text-xs text-slate-500 mb-2">💡 可直接粘贴链接或图片</div>

      {/* Content */}
      <div className="min-h-[60px]">
        {activeTab === 'link' && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={linkUrl}
                onChange={handleLinkChange}
                onBlur={handleLinkBlur}
                placeholder="输入链接 URL..."
                className="flex-1 bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                disabled={isLoading}
              />
              {isLoading && <IconLoading className="animate-spin text-blue-400" />}
            </div>
            {value?.type === 'link' && value.meta && (
              <div className="mt-2">
                <SourcePreview source={value} />
              </div>
            )}
          </div>
        )}

        {activeTab === 'image' && (
          <div className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-600 rounded hover:bg-slate-700/30 transition-colors relative">
            {imageUrl ? (
              <div className="relative group">
                <img
                  src={imageUrl.startsWith('http') ? imageUrl : imageUrl}
                  alt="uploaded"
                  className="max-h-32 rounded"
                />
                <button
                  onClick={() => {
                    setImageUrl('');
                    onChange(undefined);
                  }}
                  className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <IconDelete />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center text-slate-400 hover:text-blue-400 transition-colors">
                {isLoading ? (
                  <IconLoading className="text-2xl animate-spin mb-2" />
                ) : (
                  <IconImage className="text-2xl mb-2" />
                )}
                <span className="text-sm">{isLoading ? '上传中...' : '点击上传图片'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileInputChange}
                  disabled={isLoading}
                />
              </label>
            )}
          </div>
        )}

        {activeTab === 'text' && (
          <textarea
            value={textContent}
            onChange={handleTextChange}
            placeholder="输入备注..."
            className="w-full h-20 bg-slate-800 border border-slate-600 rounded px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
          />
        )}
      </div>
    </div>
  );
};
