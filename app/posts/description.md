# `app/posts`

This route area serves the public post index. `new-post-link.tsx` is a small client-side control that conditionally exposes post creation based on authentication state.

The nested optional catch-all route owns server-rendered pagination. Keep interactive authentication checks isolated from the public Server Component.
