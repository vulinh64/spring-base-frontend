# `/category/[slug]`

This dynamic route represents a category identified by its URL slug. Its nested optional page route renders the category's paginated post list.

Metadata uses the route slug to avoid an additional backend request. The rendered page derives the display name from the first returned post's category and falls back to the slug when the result page is empty. The content backend has no category-by-slug details endpoint, its category-search slug filter is a partial match, and its post-by-category endpoint returns an empty page for unknown categories. The route therefore cannot distinguish an empty category from a missing category without another backend request. A slug is the only reliable request-free metadata identity and may not equal the user-facing category name.
