import React from 'react';
import { IconLink, IconImage, IconFile } from '@arco-design/web-react/icon';
import { IdeaSource } from '../types';
import { SourcePreview } from './SourcePreview';

interface SourceListProps {
  sources: IdeaSource[];
  className?: string;
}

export const SourceList: React.FC<SourceListProps> = ({ sources, className }) => {
  if (!sources || sources.length === 0) return null;

  const links = sources.filter((s) => s.type === 'link');
  const images = sources.filter((s) => s.type === 'image');
  const notes = sources.filter((s) => s.type === 'text');

  return (
    <div className={className}>
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-4">
        想法来源 ({sources.length})
      </span>

      {/* Notes Section - Debug moved to top */}
      {notes.length > 0 && (
        <div className="space-y-2 mb-4">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <IconFile className="text-yellow-400" /> 备注
          </div>
          {notes.map((src, idx) => (
            <SourcePreview key={`text-${idx}`} source={src} />
          ))}
        </div>
      )}

      {/* Links Section */}
      {links.length > 0 && (
        <div className="space-y-2 mb-4">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <IconLink className="text-blue-400" /> 链接
          </div>
          {links.map((src, idx) => (
            <SourcePreview key={`link-${idx}`} source={src} />
          ))}
        </div>
      )}

      {/* Images Section */}
      {images.length > 0 && (
        <div className="space-y-2 mb-4">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <IconImage className="text-green-400" /> 图片
          </div>
          <div className="grid grid-cols-3 gap-2">
            {images.map((src, idx) => (
              <SourcePreview key={`image-${idx}`} source={src} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
