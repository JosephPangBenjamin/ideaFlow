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
  isHydrated: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isHydrated: true,
};

// Basic atom with storage
const baseAuthAtom = atomWithStorage<AuthState>('ideaflow-auth', initialState);

// Wrap to handle hydration flag
export const authAtom = atom(
  (get) => get(baseAuthAtom),
  (get, set, update: AuthState | ((prev: AuthState) => AuthState)) => {
    const nextValue = typeof update === 'function' ? update(get(baseAuthAtom)) : update;
    // If isHydrated is not explicitly false in the update, set it to true
    const isHydrated = nextValue.isHydrated !== false;
    set(baseAuthAtom, { ...nextValue, isHydrated });
  }
);

// Derived atoms for convenience
export const isAuthenticatedAtom = atom((get) => get(authAtom).isAuthenticated);
export const currentUserAtom = atom((get) => get(authAtom).user);
export const accessTokenAtom = atom((get) => get(authAtom).accessToken);
