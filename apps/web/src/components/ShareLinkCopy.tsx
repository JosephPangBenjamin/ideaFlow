import { Input, Button, Message, Typography } from '@arco-design/web-react';
import { IconCopy, IconCheck } from '@arco-design/web-react/icon';
import { useState, useImperativeHandle, forwardRef } from 'react';

interface ShareLinkCopyProps {
  token: string;
  type: 'idea' | 'canvas';
}

export interface ShareLinkCopyHandle {
  copy: () => Promise<void>;
}

const ShareLinkCopy = forwardRef<ShareLinkCopyHandle, ShareLinkCopyProps>(
  ({ token, type }, ref) => {
    const [copied, setCopied] = useState(false);
    // 使用 HashRouter 格式的 URL
    const shareUrl = `${window.location.origin}/#/public/${type}/${token}`;

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        Message.success('链接已复制到剪贴板');
        setTimeout(() => setCopied(false), 2000);
      } catch {
        Message.error('复制失败，请手动选择复制');
      }
    };

    useImperativeHandle(ref, () => ({
      copy: handleCopy,
    }));

    return (
      <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <Typography.Text
            type="secondary"
            className="text-[11px] font-medium uppercase tracking-wider"
          >
            公开分享链接
          </Typography.Text>
          {copied && (
            <Typography.Text
              type="success"
              className="text-[10px] animate-in fade-in slide-in-from-right-1"
            >
              已复制
            </Typography.Text>
          )}
        </div>
        <div className="flex gap-0 group">
          <Input
            readOnly
            value={shareUrl}
            className="flex-1 bg-black/20 border-white/10 text-slate-300 rounded-l-xl rounded-r-none focus:border-blue-500/50"
          />
          <Button
            type="primary"
            icon={copied ? <IconCheck /> : <IconCopy />}
            onClick={handleCopy}
            className={`rounded-r-xl rounded-l-none border-none transition-all duration-300 ${
              copied ? 'bg-green-600 hover:bg-green-500' : 'bg-blue-600 hover:bg-blue-500'
            }`}
          >
            {copied ? '已复制' : '复制'}
          </Button>
        </div>
        <Typography.Text type="secondary" className="text-[11px] opacity-60">
          拥有此链接的任何人都可以查看此内容。
        </Typography.Text>
      </div>
    );
  }
);

ShareLinkCopy.displayName = 'ShareLinkCopy';

export default ShareLinkCopy;
