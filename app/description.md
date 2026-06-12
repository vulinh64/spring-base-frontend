# `app`

This is the Next.js App Router source tree. Root files define the global layout, providers, landing page, loading fallback, error boundary, not-found page, and global Tailwind/CSS behavior; route folders map directly to public URLs.

`layout.tsx` wraps every route with the header, footer, TanStack Query provider, authentication provider, and toast provider. The providers are implemented behind a Client Component boundary, but route content passed through the provider's `children` slot remains Server Component content unless it declares its own client boundary. `_lib/` contains reusable implementation code that is intentionally separated from routes.

Preserve the current component boundaries: public post and category routes fetch and compose content with Server Components, while authentication, mutations, browser state, and interactive tools use Client Components. Client Components can still appear in the initial server-generated HTML and then hydrate in the browser; component type should not be treated as equivalent to SSR or CSR. Add route-specific code here, but move reusable code into `_lib/`.

The root `loading.tsx` renders the shared spinner while route segments wait. The root `error.tsx` catches uncaught route failures and displays a generic server-error state without retry controls or technical details; explicit not-found handling still uses `not-found.tsx`.

Global typography uses Noto Sans for body and interface text, Be Vietnam Pro for major `h1` and `h2` headings including post titles, locally hosted JetBrains Mono for code, and Roboto Mono for tax-calculator numeric values.
