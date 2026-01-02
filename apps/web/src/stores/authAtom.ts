import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

interface User {
    id: string;
    username: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
};

export const authAtom = atomWithStorage<AuthState>('ideaflow-auth', initialState);

// Derived atoms for convenience
export const isAuthenticatedAtom = atom((get) => get(authAtom).isAuthenticated);
export const currentUserAtom = atom((get) => get(authAtom).user);
export const accessTokenAtom = atom((get) => get(authAtom).accessToken);
