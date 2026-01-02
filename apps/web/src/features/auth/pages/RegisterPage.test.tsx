import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'jotai';
import { RegisterPage } from './RegisterPage';

// Mock useAuth hook
const mockRegister = vi.fn();
vi.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({
        register: mockRegister,
        isAuthenticated: false,
    }),
}));

// Wrapper component for providers
const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider>
        <BrowserRouter>{children}</BrowserRouter>
    </Provider>
);

describe('RegisterPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render the registration form', () => {
            render(<RegisterPage />, { wrapper });

            expect(screen.getByText('创建账号')).toBeInTheDocument();
            expect(screen.getByLabelText(/用户名/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/^密码$/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/确认密码/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /注册/i })).toBeInTheDocument();
        });

        it('should render link to login page', () => {
            render(<RegisterPage />, { wrapper });

            expect(screen.getByText(/已有账号/i)).toBeInTheDocument();
            expect(screen.getByRole('link', { name: /立即登录/i })).toHaveAttribute('href', '/login');
        });
    });

    describe('Validation', () => {
        it('should show error when username is less than 3 characters', async () => {
            const user = userEvent.setup();
            render(<RegisterPage />, { wrapper });

            const usernameInput = screen.getByLabelText(/用户名/i);
            await user.type(usernameInput, 'ab');
            await user.tab(); // Trigger blur

            await waitFor(() => {
                expect(screen.getByText(/用户名至少3个字符/i)).toBeInTheDocument();
            });
        });

        it('should show error when password is less than 8 characters', async () => {
            const user = userEvent.setup();
            render(<RegisterPage />, { wrapper });

            const passwordInput = screen.getByLabelText(/^密码$/i);
            await user.type(passwordInput, 'Abc123');
            await user.tab();

            await waitFor(() => {
                expect(screen.getByText(/密码至少8位/i)).toBeInTheDocument();
            });
        });

        it('should show error when password has no letters', async () => {
            const user = userEvent.setup();
            render(<RegisterPage />, { wrapper });

            const passwordInput = screen.getByLabelText(/^密码$/i);
            await user.type(passwordInput, '12345678');
            await user.tab();

            await waitFor(() => {
                expect(screen.getByText(/需包含字母和数字/i)).toBeInTheDocument();
            });
        });

        it('should show error when passwords do not match', async () => {
            const user = userEvent.setup();
            render(<RegisterPage />, { wrapper });

            const passwordInput = screen.getByLabelText(/^密码$/i);
            const confirmInput = screen.getByLabelText(/确认密码/i);

            await user.type(passwordInput, 'Test1234');
            await user.type(confirmInput, 'Test5678');
            await user.tab();

            await waitFor(() => {
                expect(screen.getByText(/两次输入的密码不一致/i)).toBeInTheDocument();
            });
        });
    });

    describe('Form Submission', () => {
        it('should call register with username and password on valid submission', async () => {
            const user = userEvent.setup();
            mockRegister.mockResolvedValue(undefined);

            render(<RegisterPage />, { wrapper });

            await user.type(screen.getByLabelText(/用户名/i), 'testuser');
            await user.type(screen.getByLabelText(/^密码$/i), 'Test1234');
            await user.type(screen.getByLabelText(/确认密码/i), 'Test1234');
            await user.click(screen.getByRole('button', { name: /注册/i }));

            await waitFor(() => {
                expect(mockRegister).toHaveBeenCalledWith('testuser', 'Test1234');
            });
        });

        it('should show loading state during submission', async () => {
            const user = userEvent.setup();
            mockRegister.mockImplementation(() => new Promise(() => { })); // Never resolves

            render(<RegisterPage />, { wrapper });

            await user.type(screen.getByLabelText(/用户名/i), 'testuser');
            await user.type(screen.getByLabelText(/^密码$/i), 'Test1234');
            await user.type(screen.getByLabelText(/确认密码/i), 'Test1234');
            await user.click(screen.getByRole('button', { name: /注册/i }));

            await waitFor(() => {
                expect(screen.getByRole('button', { name: /注册/i })).toHaveClass('arco-btn-loading');
            });
        });

        it('should show error message when registration fails', async () => {
            const user = userEvent.setup();
            mockRegister.mockRejectedValue({
                response: { data: { message: '该账号已注册' } },
            });

            render(<RegisterPage />, { wrapper });

            await user.type(screen.getByLabelText(/用户名/i), 'existinguser');
            await user.type(screen.getByLabelText(/^密码$/i), 'Test1234');
            await user.type(screen.getByLabelText(/确认密码/i), 'Test1234');
            await user.click(screen.getByRole('button', { name: /注册/i }));

            await waitFor(() => {
                expect(screen.getByText(/该账号已注册/i)).toBeInTheDocument();
            });
        });
    });
});
