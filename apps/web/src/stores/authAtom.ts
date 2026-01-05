import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

interface User {
  id: string;
  username: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
}

// Basic atom with storage - only persist user, token and auth status
const baseAuthAtom = atomWithStorage<Omit<AuthState, 'isHydrated'>>('ideaflow-auth', {
  user: null,
  accessToken: null,
  isAuthenticated: false,
});

// Loading state atom - stays false until first mount/hydration
const hydrationAtom = atom(false);

// Combined atom for the application
export const authAtom = atom(
  (get) => {
    const base = get(baseAuthAtom);
    const isHydrated = get(hydrationAtom);
    return { ...base, isHydrated };
  },
  (get, set, update: AuthState | ((prev: AuthState) => AuthState)) => {
    const prev = get(authAtom);
    const nextValue = typeof update === 'function' ? update(prev) : update;

    // Update persistent state
    set(baseAuthAtom, {
      user: nextValue.user,
      accessToken: nextValue.accessToken,
      isAuthenticated: nextValue.isAuthenticated,
    });

    // Update hydration state if changed
    if (nextValue.isHydrated !== undefined) {
      set(hydrationAtom, nextValue.isHydrated);
    }
  }
);

// Derived atoms for convenience
export const isAuthenticatedAtom = atom((get) => get(authAtom).isAuthenticated);
export const currentUserAtom = atom((get) => get(authAtom).user);
export const accessTokenAtom = atom((get) => get(authAtom).accessToken);
