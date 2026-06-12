# `app/_lib/utils`

This folder contains small reusable helpers for date formatting, role checks, slug generation, and session-storage drafts.

Utilities should remain focused and side-effect-light. Browser-storage helpers guard against server execution; preserve that behavior because shared code may be evaluated during server rendering. Draft storage uses one shared owner key for all drafts, verifies it during restoration, and removes it when no persisted drafts remain. Pagination helpers define accepted page sizes and validate route parameters. Heading-anchor helpers parse H2 Markdown into plain text and source offsets, generate deterministic unique IDs shared by Markdown rendering and table-of-contents extraction, allow fallback heading IDs to reserve the Markdown-derived IDs, and detect headings that normalize to the same base anchor.
