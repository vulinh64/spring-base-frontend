# `/category/[slug]/[[...page]]`

This route renders the server-fetched post list for a category and its optional page number. It generates slug-based metadata without an additional backend request, converts URL pagination to backend pagination, and lets backend failures reach either explicit `404` handling or the shared server-error boundary. The current backend returns an empty page rather than `404` for an unknown category, so missing and empty categories render the same fallback slug state. The route redirects invalid, multi-segment, or page-one URLs to the canonical no-suffix path and redirects out-of-range pages to the last page only when the backend reports at least one page.

Preserve the canonical no-suffix URL for page one and the fixed page-size assumptions unless pagination behavior is intentionally redesigned.
