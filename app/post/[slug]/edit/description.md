# `/post/[slug]/edit`

This authenticated client route loads a post through TanStack Query and edits it with the shared `PostEditorForm`. It tracks slug-specific draft data in memory, persists it when an authentication-expiry flow dispatches `session-expired`, blocks submission when Markdown H2 headings generate duplicate anchors, and invalidates list and detail queries after saving.

After saving, it redirects to the submitted slug and invalidates both old and new detail keys when the slug changes. Loading failures render an error state instead of dereferencing missing post data. The backend must enforce whether the current user may edit the post.
