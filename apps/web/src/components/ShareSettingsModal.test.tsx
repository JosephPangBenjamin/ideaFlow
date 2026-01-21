import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ShareSettingsModal } from './ShareSettingsModal';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock ShareLinkCopy
vi.mock('./ShareLinkCopy', () => ({
  default: ({ token }: { token: string }) => <div data-testid="share-link-copy">{token}</div>,
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('ShareSettingsModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when visible is false', () => {
    const { container } = render(
      <ShareSettingsModal
        visible={false}
        onClose={() => {}}
        type="idea"
        isPublic={false}
        publicToken={null}
        onVisibilityChange={async () => {}}
      />,
      { wrapper }
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render correctly when visible', () => {
    render(
      <ShareSettingsModal
        visible={true}
        onClose={() => {}}
        type="idea"
        isPublic={false}
        publicToken={null}
        onVisibilityChange={async () => {}}
      />,
      { wrapper }
    );
    expect(screen.getByText('分享设置')).toBeTruthy();
    expect(screen.getByText('公开分享')).toBeTruthy();
  });

  it('should show ShareLinkCopy when isPublic is true', () => {
    render(
      <ShareSettingsModal
        visible={true}
        onClose={() => {}}
        type="idea"
        isPublic={true}
        publicToken="test-token"
        onVisibilityChange={async () => {}}
      />,
      { wrapper }
    );
    expect(screen.getByTestId('share-link-copy')).toBeTruthy();
    expect(screen.getByText('test-token')).toBeTruthy();
  });

  it('should call onVisibilityChange when switch is toggled', async () => {
    const onVisibilityChange = vi.fn();
    render(
      <ShareSettingsModal
        visible={true}
        onClose={() => {}}
        type="idea"
        isPublic={false}
        publicToken={null}
        onVisibilityChange={onVisibilityChange}
      />,
      { wrapper }
    );

    const switchBtn = screen.getByRole('switch');
    fireEvent.click(switchBtn);

    expect(onVisibilityChange).toHaveBeenCalledWith(true);
  });

  it('should handle async visibility change', async () => {
    const onVisibilityChange = vi.fn().mockResolvedValue(undefined);

    render(
      <ShareSettingsModal
        visible={true}
        onClose={() => {}}
        type="idea"
        isPublic={false}
        publicToken={null}
        onVisibilityChange={onVisibilityChange}
      />,
      { wrapper }
    );

    const switchBtn = screen.getByRole('switch');
    fireEvent.click(switchBtn);

    await waitFor(() => {
      expect(onVisibilityChange).toHaveBeenCalledWith(true);
    });
  });

  it('should show autoCopy checkbox when public', () => {
    render(
      <ShareSettingsModal
        visible={true}
        onClose={() => {}}
        type="idea"
        isPublic={true}
        publicToken="test-token"
        onVisibilityChange={async () => {}}
      />,
      { wrapper }
    );

    expect(screen.getByText('启用时自动复制链接')).toBeTruthy();
  });

  it('should show private message when not public', () => {
    render(
      <ShareSettingsModal
        visible={true}
        onClose={() => {}}
        type="idea"
        isPublic={false}
        publicToken={null}
        onVisibilityChange={async () => {}}
      />,
      { wrapper }
    );

    expect(screen.getByText('当前内容为私密，仅您自己可见。')).toBeTruthy();
  });

  it('should display correct text for canvas type', () => {
    render(
      <ShareSettingsModal
        visible={true}
        onClose={() => {}}
        type="canvas"
        isPublic={false}
        publicToken={null}
        onVisibilityChange={async () => {}}
      />,
      { wrapper }
    );

    expect(screen.getByText(/画布/)).toBeTruthy();
  });
});
