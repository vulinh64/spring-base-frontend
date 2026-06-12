# `app/categories`

This route area serves the paginated category index at `/categories` and contains client-side administrative controls in `categories-admin.tsx`.

The catch-all page folder performs server-side category loading and canonical pagination redirects, then embeds client controls that render only when `AuthProvider` reports the `ADMIN` role. Category links and delete buttons are sibling controls rather than nested interactive elements. Category deletion disables its confirmation actions while the request is pending. The route itself is not wrapped in `AuthGuard`; keep public listing data server-rendered and enforce real category authorization in the backend.
