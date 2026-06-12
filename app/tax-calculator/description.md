# `/tax-calculator`

This client route exposes the standalone Vietnamese personal income tax calculator implemented in `@/components/tax-calculator`. Its locale toggle switches primary labels between Vietnamese and English while also changing number formatting.

The route itself is intentionally thin. Keep calculation logic and reusable UI in the feature component folder, and verify time-sensitive tax rules before changing constants.
