import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAtom } from '@/stores/authAtom';
import { authService } from '@/services/auth.service';

export function useAuth() {
    const [auth, setAuth] = useAtom(authAtom);
    const navigate = useNavigate();

    const register = useCallback(
        async (username: string, password: string) => {
            const response = await authService.register({ username, password });
            setAuth({
                user: response.user,
                accessToken: response.accessToken,
                isAuthenticated: true,
            });
            navigate('/dashboard');
        },
        [setAuth, navigate]
    );

    const login = useCallback(
        async (username: string, password: string) => {
            const response = await authService.login({ username, password });
            setAuth({
                user: response.user,
                accessToken: response.accessToken,
                isAuthenticated: true,
            });
            navigate('/dashboard');
        },
        [setAuth, navigate]
    );

    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setAuth({
                user: null,
                accessToken: null,
                isAuthenticated: false,
            });
            navigate('/login');
        }
    }, [setAuth, navigate]);

    return {
        user: auth.user,
        isAuthenticated: auth.isAuthenticated,
        accessToken: auth.accessToken,
        register,
        login,
        logout,
    };
}
