# `/categories/[[...page]]`

This optional catch-all route renders `/categories` and numbered category pages. It fetches categories on the server, generates metadata, converts one-based URL pages to zero-based backend pages, and redirects invalid, multi-segment, or page-one URLs to canonical paths. It accepts positive integer pages and the shared page-size options, preserving a valid non-default size in canonical and out-of-range redirects. It redirects out-of-range pages to the last page only when the backend reports at least one page.

Preserve canonical `/categories` behavior for page one and keep pagination consistent with the backend `Page` contract.
