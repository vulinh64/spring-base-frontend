# `/post/new`

This authenticated client route creates posts through the shared `PostEditorForm`. It tracks current draft data in memory, persists it when an authentication-expiry flow dispatches `session-expired`, blocks submission when Markdown H2 headings generate duplicate anchors, calls `postApi.create`, invalidates post queries, and redirects to the created post.

Preserve draft cleanup and query invalidation after successful creation. Backend authorization remains required despite the `AuthGuard`.
