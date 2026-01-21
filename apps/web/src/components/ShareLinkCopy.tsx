import React from 'react';
import { Input, Button, Message, Typography } from '@arco-design/web-react';
import { IconCopy } from '@arco-design/web-react/icon';

interface ShareLinkCopyProps {
  token: string;
  type: 'idea' | 'canvas';
}

const ShareLinkCopy: React.FC<ShareLinkCopyProps> = ({ token, type }) => {
  // 使用 HashRouter 格式的 URL
  const shareUrl = `${window.location.origin}/#/public/${type}/${token}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      Message.success('链接已复制到剪贴板');
    } catch {
      Message.error('复制失败，请手动选择复制');
    }
  };

  return (
    <div
      style={{
        marginTop: 16,
        padding: '12px 16px',
        backgroundColor: 'var(--color-fill-1)',
        borderRadius: 4,
      }}
    >
      <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 8, fontSize: 12 }}>
        公开分享链接
      </Typography.Text>
      <div style={{ display: 'flex', width: '100%' }}>
        <Input
          readOnly
          value={shareUrl}
          style={{
            backgroundColor: 'var(--color-bg-2)',
            flex: 1,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          }}
        />
        <Button
          type="primary"
          icon={<IconCopy />}
          onClick={handleCopy}
          style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
        >
          复制
        </Button>
      </div>
      <Typography.Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: 12 }}>
        拥有此链接的任何人都可以查看此内容。
      </Typography.Text>
    </div>
  );
};

export default ShareLinkCopy;
