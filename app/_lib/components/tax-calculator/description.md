# `app/_lib/components/tax-calculator`

This folder implements the Vietnamese personal income tax calculator. `TaxCalculator.tsx` owns the interactive form and result display, `TaxUtils.tsx` contains validation, parsing, formatting, and calculation logic, and `TaxSupport.tsx` contains constants and calculation types.

The calculator includes separate probation and normal-employment paths and tax-period-specific rates and deductions. Tax-period selection explicitly chooses between the `true` and `false` constant sets. The Vietnamese-locale toggle switches number formatting and the calculator's primary form labels between Vietnamese and English. Numeric input and result values use the globally defined Roboto Mono tax-numeric font while surrounding labels retain the normal interface font. Treat constants as legally time-sensitive and verify them before changing behavior. Until the project adopts automated tests, manually verify focused calculation scenarios whenever this logic changes.
