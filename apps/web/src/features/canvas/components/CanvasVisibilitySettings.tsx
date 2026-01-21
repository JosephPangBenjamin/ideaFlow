import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Switch, Message, Typography } from '@arco-design/web-react';
import ShareLinkCopy from '../../../components/ShareLinkCopy';
import { updateCanvasVisibility, Canvas } from '../services/canvas.service';

interface CanvasVisibilitySettingsProps {
  canvas: Canvas;
  onUpdate?: (canvas: Canvas) => void;
}

export const CanvasVisibilitySettings: React.FC<CanvasVisibilitySettingsProps> = ({
  canvas,
  onUpdate,
}) => {
  const queryClient = useQueryClient();

  const visibilityMutation = useMutation({
    mutationFn: (isPublic: boolean) => updateCanvasVisibility(canvas.id, isPublic),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['canvases'] });
      queryClient.invalidateQueries({ queryKey: ['canvas', canvas.id] });
      onUpdate?.(response.data);
      Message.success(response.data.isPublic ? '画布已设为公开' : '画布已设为私密');
    },
    onError: () => {
      Message.error('更新可见性失败');
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
        <div className="flex flex-col">
          <Typography.Text className="text-white font-medium">公开分享</Typography.Text>
          <Typography.Text type="secondary" className="text-[11px]">
            开启后，任何人都可以通过链接访问此画布。
          </Typography.Text>
        </div>
        <Switch
          checked={canvas.isPublic}
          loading={visibilityMutation.isPending}
          onChange={(checked) => visibilityMutation.mutate(checked)}
        />
      </div>

      {canvas.isPublic && canvas.publicToken && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <ShareLinkCopy token={canvas.publicToken} type="canvas" />
        </div>
      )}
    </div>
  );
};
