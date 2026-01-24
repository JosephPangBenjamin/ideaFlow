import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SocialLoginButtons } from './SocialLoginButtons';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock @arco-design/web-react
vi.mock('@arco-design/web-react', () => ({
  Button: ({ children, onClick, icon, loading, ...props }: any) => (
    <button onClick={onClick} disabled={loading} {...props}>
      {icon}
      {children}
    </button>
  ),
  Message: {
    error: vi.fn(),
  },
}));

// Mock @/utils/motion
vi.mock('@/utils/motion', () => ({
  tapAnimation: {},
}));

describe('SocialLoginButtons', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    // Mock window.location
    delete (window as any).location;
    window.location = { ...originalLocation, href: '' } as any;
    vi.clearAllMocks();
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  it('应该渲染微信和Google登录按钮', () => {
    render(<SocialLoginButtons />);

    expect(screen.getByText('微信登录')).toBeInTheDocument();
    expect(screen.getByText('Google 登录')).toBeInTheDocument();
  });

  it('应该显示分隔线文字', () => {
    render(<SocialLoginButtons />);

    expect(screen.getByText('或使用第三方账号登录')).toBeInTheDocument();
  });

  it('点击微信登录按钮应该重定向到微信OAuth端点', () => {
    render(<SocialLoginButtons />);

    const wechatButton = screen.getByText('微信登录');
    fireEvent.click(wechatButton);

    expect(window.location.href).toContain('/auth/wechat');
  });

  it('点击Google登录按钮应该重定向到Google OAuth端点', () => {
    render(<SocialLoginButtons />);

    const googleButton = screen.getByText('Google 登录');
    fireEvent.click(googleButton);

    expect(window.location.href).toContain('/auth/google');
  });

  it('微信登录按钮应该使用微信品牌色', () => {
    render(<SocialLoginButtons />);

    const wechatButton = screen.getByText('微信登录').closest('button');
    expect(wechatButton).toHaveClass('!bg-[#07C160]');
  });

  it('Google登录按钮应该使用Google品牌色', () => {
    render(<SocialLoginButtons />);

    const googleButton = screen.getByText('Google 登录').closest('button');
    expect(googleButton).toHaveClass('!bg-[#4285F4]');
  });
});
