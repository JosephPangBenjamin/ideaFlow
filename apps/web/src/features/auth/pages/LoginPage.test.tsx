import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginPage } from './LoginPage';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Message } from '@arco-design/web-react';

// Mock useAuth
const mockLogin = vi.fn();
vi.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({
        login: mockLogin,
    }),
}));

// Mock Arco Message
vi.mock('@arco-design/web-react', async () => {
    const actual = await vi.importActual('@arco-design/web-react') as any;
    return {
        ...actual,
        Message: {
            success: vi.fn(),
            error: vi.fn(),
        },
    };
});

describe('LoginPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders login form', () => {
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );
        expect(screen.getByText('欢迎回来')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('请输入用户名')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('请输入密码')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '登录' })).toBeInTheDocument();
    });

    it('submits form with valid data', async () => {
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('请输入用户名'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('请输入密码'), { target: { value: 'password' } });
        fireEvent.click(screen.getByRole('button', { name: '登录' }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('testuser', 'password');
        });
    });

    it('shows error message on failed login', async () => {
        const errorMessage = 'Invalid credentials';
        mockLogin.mockRejectedValue({
            response: {
                data: {
                    message: errorMessage
                }
            }
        });

        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('请输入用户名'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('请输入密码'), { target: { value: 'wrongpass' } });
        fireEvent.click(screen.getByRole('button', { name: '登录' }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalled();
            expect(Message.error).toHaveBeenCalledWith(errorMessage);
        });
    });
});
