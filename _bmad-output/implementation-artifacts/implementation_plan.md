# Implementation Plan - User Logout (Story 1.4)

## Goal
Implement secure user logout functionality ensuring tokens are cleared from both client and server side (cookie).

## User Review Required
None. Standard JWT logout implementation.

## Proposed Changes

### Backend
#### [MODIFY] [auth.service.ts](file:///Users/offer/offer_work/ideaFlow/apps/api/src/modules/auth/auth.service.ts)
- Add `logout(userId: string)` method (placeholder for future token revocation or blacklist).

#### [MODIFY] [auth.controller.ts](file:///Users/offer/offer_work/ideaFlow/apps/api/src/modules/auth/auth.controller.ts)
- Add `POST /logout` endpoint.
- Use `JwtAuthGuard`.
- Clear `refresh_token` cookie.
- Call `authService.logout(userId)`.

### Frontend
#### [MODIFY] [api.ts](file:///Users/offer/offer_work/ideaFlow/apps/web/src/services/api.ts)
- Add `auth.logout()` API call.

#### [MODIFY] [useAuth.ts](file:///Users/offer/offer_work/ideaFlow/apps/web/src/hooks/useAuth.ts)
- Add `logout` function to clear local state and call API.

#### [MODIFY] [App.tsx](file:///Users/offer/offer_work/ideaFlow/apps/web/src/App.tsx)
- Ensure navigation to login page upon logout.

## Verification Plan

### Automated Tests
- **Backend Unit**: `AuthService.logout` behavior.
- **Backend E2E**: `POST /auth/logout` clears cookies.
- **Frontend Unit**: `useAuth.logout` clears state.

### Manual Verification
1. Login to application.
2. Verify `refresh_token` cookie exists.
3. Click Logout.
4. Verify redirected to Login page.
5. Verify `refresh_token` cookie is gone/expired.
6. Try to access protected route -> should redirect to login.
