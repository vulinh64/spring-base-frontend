# `/post/[slug]/revisions`

This authenticated client route lists a post's revisions and allows a selected revision to be applied after confirmation.

It depends on the post and revision query keys and invalidates both after applying a revision. Revision application replaces current content, so retain explicit confirmation, disable confirmation actions while applying, and enforce backend authorization.

Post-loading and revision-loading failures render separate error states.
