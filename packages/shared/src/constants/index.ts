/**
 * API Constants
 */

export const API_PREFIX = '/ideaFlow/api/v1';

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_PREFIX}/auth/login`,
        REGISTER: `${API_PREFIX}/auth/register`,
        LOGOUT: `${API_PREFIX}/auth/logout`,
        REFRESH: `${API_PREFIX}/auth/refresh`,
    },
    USERS: {
        ME: `${API_PREFIX}/users/me`,
    },
    IDEAS: {
        BASE: `${API_PREFIX}/ideas`,
        BY_ID: (id: string) => `${API_PREFIX}/ideas/${id}`,
    },
    TASKS: {
        BASE: `${API_PREFIX}/tasks`,
        BY_ID: (id: string) => `${API_PREFIX}/tasks/${id}`,
    },
    CANVASES: {
        BASE: `${API_PREFIX}/canvases`,
        BY_ID: (id: string) => `${API_PREFIX}/canvases/${id}`,
    },
    ANALYTICS: {
        TRACK: `${API_PREFIX}/analytics/track`,
    },
    HEALTH: `${API_PREFIX}/health`,
} as const;

/**
 * App Constants
 */

export const MAX_PAGE_SIZE = 50;
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_CANVAS_NODES = 100;

/**
 * Time Constants
 */

export const JWT_ACCESS_EXPIRY = '15m';
export const JWT_REFRESH_EXPIRY = '7d';
export const AUTO_SAVE_DEBOUNCE_MS = 3000;
