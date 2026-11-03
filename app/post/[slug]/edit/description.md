# `/post/[slug]/edit`

This authenticated client route loads a post through TanStack Query and edits it with the shared `PostEditorForm`. It tracks slug-specific draft data in memory, persists it when an authentication-expiry flow dispatches `session-expired`, blocks submission when Markdown H2 headings generate duplicate anchors, and invalidates list and detail queries after saving.

Loading failures render an error state instead of dereferencing missing post data. The backend must enforce whether the current user may edit the post.

The route mounts a stable `PostEditSession` keyed by post ID. Background query refreshes do not replace the baseline or draft. Saving stays on the edit screen, freezes fields during requests, and refreshes the snapshot/version from the server after success. On conflict, an expanded native details comparison preserves the draft and requires explicit baseline adoption before further saves. Deleted posts, permission loss, unrelated errors, and failed latest-fetch requests retain work. No automatic conflict retry occurs.

## Optimistic-lock validation

Verified on 2026-11-03 using two browser tabs against the backend's local-noauth fixture (UUID `33333333-3333-3333-3333-333333333333`), without resetting it:

- Both editors loaded version 2. First save succeeded; the stale editor submitted version 2 and received HTTP 409/M1005. All draft fields remained intact, details opened automatically, and Save was disabled.
- Manual continue/edit/baseline adoption allowed a successful save. A further remote save caused another conflict after adoption; the draft and latest comparison remained intact.
- Canceling discard confirmation retained the draft. Confirming discard initialized every field from the compared server snapshot.
- Successful PATCH version 6 was followed by a fresh stable-ID GET returning version 7. The next PATCH submitted version 7 and succeeded (fixture reached version 8).
- Browser-only fault injection made the fresh GET fail after a real conflict: the draft remained intact, saving stayed blocked, and retry recovered the comparison. A synthetic unrelated HTTP 409/errorCode `E2E_UNRELATED_CONFLICT` produced an ordinary error without opening comparison or adopting a version. These two failure cases used temporary XMLHttpRequest instrumentation, restored afterward; they do not establish backend failure behavior.
- Keyboard Enter collapsed and expanded the native summary. At a 390px mobile viewport, document width equaled viewport width and comparison columns stacked. HTML event-handler text inserted into the conflicted draft remained text: no image/script nodes appeared in details and no handler ran.

Production build and lint passed after implementation. Browser verification did not exercise deletion, permission loss, cross-account session-draft restoration, category changes (fixture exposed only Uncategorized), or true simultaneous transaction commits. Backend enforcement/transaction tests are maintained by the backend agent. No automated frontend test framework was added.
