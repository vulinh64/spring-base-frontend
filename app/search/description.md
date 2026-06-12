# `/search`

This client route reads the `q` query parameter, searches posts through the `useSearchPosts` TanStack Query hook, and handles loading, error, empty, and paginated result states.

Search pagination is client state rather than a path segment and resets to page zero when `q` changes. Keep API access in the existing hook and reuse shared post-list and feedback components.
