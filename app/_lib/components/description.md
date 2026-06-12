# `app/_lib/components`

This folder contains reusable UI grouped by feature: category, comment, common, layout, post, and tax calculator.

Many components are shared by multiple routes, while some feature components currently have a single route consumer. They use Tailwind classes with the repository's dark-theme conventions. Reuse these components before adding route-local duplicates, and mark files as client components only when they use state, effects, browser APIs, or client hooks.
