# `app/_lib/components/post`

This folder contains shared blog-post presentation and editing UI. `PostCard.tsx` and `PostList.tsx` render post summaries; `PostEditorForm.tsx` implements the create/edit form, Markdown editing, category and tag inputs, and unsaved-draft behavior.

Post editing is used by both new and edit routes. Keep request shaping aligned with `PostCreationRequest`, preserve draft restoration, and invalidate relevant post queries after mutations. Dirty forms warn on browser close or refresh and confirm the form's Cancel action without inserting synthetic browser-history entries. Submission is blocked when two Markdown H2 headings normalize to the same base anchor, preventing ambiguous table-of-contents targets in newly created or edited content.
