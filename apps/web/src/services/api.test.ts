import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createOnResponseError } from './api';
import { AxiosError } from 'axios';

describe('API Interceptor', () => {
    let mockApi: any;
    let onResponseError: ReturnType<typeof createOnResponseError>;

    beforeEach(() => {
        mockApi = vi.fn();
        mockApi.post = vi.fn();
        mockApi.request = vi.fn();
        onResponseError = createOnResponseError(mockApi);
    });

    it('should try to refresh token on 401', async () => {
        const error = {
            config: { url: '/some/endpoint', _retry: false },
            response: { status: 401 },
        } as unknown as AxiosError;

        // Mock refresh success
        mockApi.post.mockResolvedValue({ data: { accessToken: 'new_token' } });
        mockApi.mockResolvedValue({ data: 'retry_success' });

        // Call the error handler
        await onResponseError(error);

        expect(mockApi.post).toHaveBeenCalledWith('/auth/refresh');
        expect(mockApi).toHaveBeenCalledWith(error.config);
    });

    it('should not retry if already retried', async () => {
        const error = {
            config: { url: '/some/endpoint', _retry: true },
            response: { status: 401 },
        } as unknown as AxiosError;

        await expect(onResponseError(error)).rejects.toBe(error);
        expect(mockApi.post).not.toHaveBeenCalledWith('/auth/refresh');
    });

    it('should not retry for login route', async () => {
        const error = {
            config: { url: '/auth/login', _retry: false },
            response: { status: 401 },
        } as unknown as AxiosError;

        await expect(onResponseError(error)).rejects.toBe(error);
        expect(mockApi.post).not.toHaveBeenCalledWith('/auth/refresh');
    });

    it('should not retry for refresh route', async () => {
        const error = {
            config: { url: '/auth/refresh', _retry: false },
            response: { status: 401 },
        } as unknown as AxiosError;

        await expect(onResponseError(error)).rejects.toBe(error);
        expect(mockApi.post).not.toHaveBeenCalledWith('/auth/refresh');
    });
});
