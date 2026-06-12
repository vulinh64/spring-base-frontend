# `app/_lib/components/category`

This folder contains reusable category presentation UI. `CategoryBadge.tsx` links a post's category to its category route and is currently used on post detail pages. Post cards render their own category link and styling.

Category links use `categorySlug`; account for the separate badge and post-card implementations when changing category presentation.
