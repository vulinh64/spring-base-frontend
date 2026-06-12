# `app/_lib/components/layout`

This folder contains application-wide layout UI: the header, footer, and `AuthGuard`.

The root layout renders the header and footer around all pages. `AuthGuard` controls authenticated UI access and redirects, but it must not be treated as backend authorization.
