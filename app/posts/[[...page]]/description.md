# `/posts/[[...page]]`

This optional catch-all route renders `/posts` and numbered post pages. It loads posts on the server, generates page metadata, applies default sorting, and redirects invalid, multi-segment, or page-one URLs to canonical paths. It accepts positive integer pages and the shared page-size options, preserving a valid non-default size in canonical and out-of-range redirects. It redirects out-of-range pages to the last page only when the backend reports at least one page.

URL pages are one-based while backend pages are zero-based. Preserve that conversion when changing pagination.
