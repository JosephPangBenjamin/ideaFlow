import React from 'react';
import { IdeaSource } from '../types';
import { IconFile } from '@arco-design/web-react/icon';
import { Image } from '@arco-design/web-react';

interface Props {
  source: IdeaSource;
  compact?: boolean;
}

export const SourcePreview: React.FC<Props> = ({ source, compact = false }) => {
  if (source.type === 'link') {
    if (!source.meta) return <div className="text-blue-400 text-xs truncate">{source.url}</div>;

    return (
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`block bg-slate-800 rounded p-2 flex space-x-2 text-xs text-slate-400 hover:bg-slate-700/50 transition-colors ${compact ? '' : 'w-full'}`}
      >
        {source.meta.image && (
          <img
            src={source.meta.image.url}
            alt={source.meta.title || 'link preview'}
            className={`${compact ? 'w-8 h-8' : 'w-12 h-12'} object-cover rounded flex-shrink-0`}
          />
        )}
        <div className="overflow-hidden min-w-0 flex-1">
          <div className="font-medium text-slate-200 truncate">{source.meta.title}</div>
          <div className="truncate text-slate-500">
            {source.meta.description || source.meta.siteName || source.url}
          </div>
        </div>
      </a>
    );
  }

  if (source.type === 'image') {
    if (!source.url) return null;
    return (
      <div className="relative group">
        <Image
          src={source.url}
          alt="preview"
          className={`${compact ? 'w-16 h-16' : 'max-h-64 w-full'} object-cover rounded bg-slate-800`}
        />
      </div>
    );
  }

  if (source.type === 'text') {
    return (
      <div
        className={`bg-slate-800 rounded p-2 text-slate-300 text-xs flex items-start space-x-2 ${compact ? 'truncate' : ''}`}
      >
        <IconFile className="flex-shrink-0 mt-0.5" />
        <span className={compact ? 'truncate' : 'whitespace-pre-wrap'}>{source.content}</span>
      </div>
    );
  }

  return null;
};
