# `app/_lib/components/comment`

This folder implements the interactive comment experience. It contains the comment list, individual comment display/actions, and comment form.

The components connect to comment API functions and TanStack Query hooks and are rendered below server-fetched post content. New-comment drafts use `useSessionDraft`; inline comment edits do not. Adding and editing comments show toast feedback and invalidate the relevant comment query after success.
