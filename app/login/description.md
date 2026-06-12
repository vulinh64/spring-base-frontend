# `/login`

This client route presents the login form, uses `AuthProvider` to establish the cookie-backed session, and normally redirects to the requested path. Redirect query values are restricted to same-origin application paths; invalid or external destinations fall back to `/`.

It checks the single session-storage draft-owner ID after login. When a different user signs in, it clears all persisted drafts and redirects to `/` instead of the requested path. Preserve that safeguard and do not store passwords or tokens in browser storage.
