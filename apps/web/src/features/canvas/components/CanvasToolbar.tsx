import React from 'react';
import { Button, Space, Tooltip } from '@arco-design/web-react';
import {
  IconPlus,
  IconMessage,
  IconImage,
  IconSave,
  IconApps,
  IconShareExternal,
} from '@arco-design/web-react/icon';
import { CanvasNodeType as NodeTypeEnum } from '../services/canvas.service';

interface CanvasToolbarProps {
  onAddNode: (type: NodeTypeEnum) => void;
  onSave: () => void;
  onShare: () => void;
  onCollabShare?: () => void;
  isSaving?: boolean;
  hasPendingUpdates?: boolean;
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  onAddNode,
  onSave,
  onShare,
  onCollabShare,
  isSaving = false,
  hasPendingUpdates = false,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Space size="small">
        <Tooltip content="添加子想法" position="bottom">
          <Button
            size="small"
            shape="circle"
            type="secondary"
            icon={<IconPlus />}
            onClick={() => onAddNode(NodeTypeEnum.sub_idea)}
            aria-label="添加子想法"
            className="bg-blue-600 border-none text-white hover:bg-blue-500 hover:scale-110 transition-transform"
          />
        </Tooltip>

        <Tooltip content="添加批注" position="bottom">
          <Button
            size="small"
            shape="circle"
            type="secondary"
            icon={<IconMessage />}
            onClick={() => onAddNode(NodeTypeEnum.annotation)}
            aria-label="添加批注"
            className="bg-teal-600 border-none text-white hover:bg-teal-500 hover:scale-110 transition-transform"
          />
        </Tooltip>

        <Tooltip content="添加图片" position="bottom">
          <Button
            size="small"
            shape="circle"
            type="secondary"
            icon={<IconImage />}
            onClick={() => onAddNode(NodeTypeEnum.image)}
            aria-label="添加图片"
            className="bg-indigo-600 border-none text-white hover:bg-indigo-500 hover:scale-110 transition-transform"
          />
        </Tooltip>

        <Tooltip content="创建区域" position="bottom">
          <Button
            size="small"
            shape="circle"
            type="secondary"
            icon={<IconApps />}
            onClick={() => onAddNode(NodeTypeEnum.region)}
            aria-label="创建区域"
            className="bg-purple-600 border-none text-white hover:bg-purple-500 hover:scale-110 transition-transform"
          />
        </Tooltip>

        <Tooltip content="公开分享" position="bottom">
          <Button
            size="small"
            shape="circle"
            type="secondary"
            icon={<IconShareExternal />}
            onClick={onShare}
            aria-label="公开分享"
            className="bg-blue-600 border-none text-white hover:bg-blue-500 hover:scale-110 transition-transform"
          />
        </Tooltip>

        {onCollabShare && (
          <Tooltip content="协作分享" position="bottom">
            <Button
              size="small"
              shape="circle"
              type="secondary"
              icon={<IconShareExternal />}
              onClick={onCollabShare}
              aria-label="协作分享"
              className="bg-purple-600 border-none text-white hover:bg-purple-500 hover:scale-110 transition-transform"
            />
          </Tooltip>
        )}

        <div className="w-[1px] h-6 bg-slate-700 mx-1" />

        <Tooltip content={hasPendingUpdates ? '保存更改' : '无需保存'} position="bottom">
          <Button
            size="small"
            type="primary"
            status={hasPendingUpdates ? 'success' : 'default'}
            icon={<IconSave />}
            onClick={onSave}
            loading={isSaving}
            className={`transition-all h-8 ${hasPendingUpdates ? 'scale-105 shadow-lg shadow-green-900/40' : 'opacity-60 grayscale'}`}
          >
            保存
          </Button>
        </Tooltip>
      </Space>
    </div>
  );
};
