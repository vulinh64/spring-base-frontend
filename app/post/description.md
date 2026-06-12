# `app/post`

This route tree contains individual post workflows: public detail pages, authenticated creation and editing, and revision management.

The `[slug]` detail route combines server-rendered article content with client-side comments, subscriptions, and author actions. Keep the public content server-rendered and isolate mutations in client components.
