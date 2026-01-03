import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Settings } from './Settings';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { userService } from '@/services/user.service';
import { Message } from '@arco-design/web-react';

// Mock userService
vi.mock('@/services/user.service', () => ({
  userService: {
    getMe: vi.fn(),
    updateMe: vi.fn(),
    changePassword: vi.fn(),
  },
}));

// Mock useAuth
const mockLogout = vi.fn();
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    logout: mockLogout,
  }),
}));

// Mock Arco Message and components
vi.mock('@arco-design/web-react', async () => {
  const actual = (await vi.importActual('@arco-design/web-react')) as any;
  return {
    ...actual,
    Message: {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
    },
  };
});

// Mock Framer Motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('Settings Component', () => {
  const mockUser = {
    id: 'user-123',
    username: 'testuser',
    phone: '13812341234',
    nickname: 'Test Nick',
    avatarUrl: null,
    createdAt: '2025-12-30T12:00:00.000Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (userService.getMe as any).mockResolvedValue({ data: mockUser, meta: {} });
  });

  it('renders user profile information', async () => {
    render(<Settings />);

    await waitFor(() => {
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.getByText('138****1234')).toBeInTheDocument();
      expect(screen.getByText('Test Nick')).toBeInTheDocument();
    });
  });

  it('allows editing username', async () => {
    (userService.updateMe as any).mockResolvedValue({
      data: { ...mockUser, username: 'newname' },
      meta: { message: '保存成功' },
    });

    const { container } = render(<Settings />);

    await waitFor(() => expect(screen.getByText('testuser')).toBeInTheDocument());

    // Username is the first edit button
    const editBtns = container.querySelectorAll('.arco-icon-edit');
    const usernameEditBtn = editBtns[0].closest('button');
    if (!usernameEditBtn) throw new Error('Username edit button not found');
    fireEvent.click(usernameEditBtn);

    const input = screen.getByPlaceholderText('新用户名');
    fireEvent.change(input, { target: { value: 'newname' } });

    const saveBtn = container.querySelector('.arco-icon-check')?.closest('button');
    if (!saveBtn) throw new Error('Save button not found');
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(userService.updateMe).toHaveBeenCalledWith({ username: 'newname' });
      expect(screen.getByText('newname')).toBeInTheDocument();
    });
  });

  it('allows editing nickname', async () => {
    (userService.updateMe as any).mockResolvedValue({
      data: { ...mockUser, nickname: 'New Nick' },
      meta: { message: '保存成功' },
    });

    const { container } = render(<Settings />);

    await waitFor(() => expect(screen.getByText('Test Nick')).toBeInTheDocument());

    // Nickname is the 3rd edit button now (Username, Phone, Nickname)
    const editBtns = container.querySelectorAll('.arco-icon-edit');
    const nicknameEditBtn = editBtns[2].closest('button');
    if (!nicknameEditBtn) throw new Error('Nickname edit button not found');
    fireEvent.click(nicknameEditBtn);

    const input = screen.getByPlaceholderText('输入昵称');
    fireEvent.change(input, { target: { value: 'New Nick' } });

    // Click save button - it's the one with arco-icon-check
    const saveBtn = container.querySelector('.arco-icon-check')?.closest('button');
    if (!saveBtn) throw new Error('Save button not found');
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(userService.updateMe).toHaveBeenCalledWith({ nickname: 'New Nick' });
      expect(Message.success).toHaveBeenCalledWith('保存成功');
      expect(screen.getByText('New Nick')).toBeInTheDocument();
    });
  });

  it('shows password change form', async () => {
    render(<Settings />);

    await waitFor(() => expect(screen.getByText('修改密码')).toBeInTheDocument());

    fireEvent.click(screen.getByText('修改密码'));

    expect(screen.getAllByPlaceholderText('••••••••')[0]).toBeInTheDocument();
    // Since all three have the same placeholder, we might need a different way to check
    // but for now let's just use getAllByPlaceholderText and check length
    expect(screen.getAllByPlaceholderText('••••••••')).toHaveLength(3);
  });

  it('validates password fields before submission', async () => {
    render(<Settings />);

    await waitFor(() => fireEvent.click(screen.getByText('修改密码')));

    fireEvent.click(screen.getByText('立即更新'));

    expect(Message.warning).toHaveBeenCalledWith('请填写所有密码字段');
  });

  it('calls changePassword and logs out on success', async () => {
    (userService.changePassword as any).mockResolvedValue({
      data: null,
      meta: { message: '密码修改成功' },
    });

    render(<Settings />);

    await waitFor(() => fireEvent.click(screen.getByText('修改密码')));

    const inputs = screen.getAllByPlaceholderText('••••••••');
    fireEvent.change(inputs[0], { target: { value: 'Old12345' } });
    fireEvent.change(inputs[1], { target: { value: 'New12345' } });
    fireEvent.change(inputs[2], { target: { value: 'New12345' } });

    fireEvent.click(screen.getByText('立即更新'));

    await waitFor(() => {
      expect(userService.changePassword).toHaveBeenCalled();
      expect(Message.success).toHaveBeenCalledWith('密码修改成功');
    });

    // Check for logout call after delay
    await waitFor(
      () => {
        expect(mockLogout).toHaveBeenCalled();
      },
      { timeout: 2000 }
    );
  });
});
