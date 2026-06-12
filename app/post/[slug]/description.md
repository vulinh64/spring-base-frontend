# `/post/[slug]`

This dynamic route renders an individual post by slug. `page.tsx` server-fetches content and metadata, renders Markdown and a table of contents, then delegates comments, subscriptions, deletion, and author actions to `post-detail-client.tsx`. Post deletion disables confirmation actions while its request is pending. Backend `404` responses become the not-found page; other backend failures remain server errors.

Treat Markdown rendering and heading extraction as stored-content compatibility concerns. H2 extraction parses Markdown into plain heading text plus source offsets, then passes deterministic unique IDs to the renderer so each table-of-contents entry binds to the exact rendered Markdown heading even when inline formatting, raw HTML headings, or repeated text are present. Raw HTML headings keep collision-free fallback IDs and are not included in the table of contents. Keep browser interactions out of the Server Component.
