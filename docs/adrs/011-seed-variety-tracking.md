# ADR 011: Seed Variety Tracking

## Status
Accepted

## Date
2026-01-01

## Context

The application tracks planting data but lacked visibility into seed inventory. Users need to:
- Know what seed varieties they've used historically
- Track which suppliers they purchase from
- Know what seeds they have vs need to order
- See spending patterns across years

Variety data already existed in `src/data/my-varieties.ts` with 30+ varieties including supplier, price, and years used, but was not exposed in the UI.

## Decision

Create a simple read-only Seeds page (`/seeds`) that:

1. Displays existing variety data grouped by vegetable type
2. Adds a "have seeds" toggle per variety stored in localStorage
3. Shows supplier links and spending statistics
4. Links to Garden Organic heritage seed shop

The implementation prioritizes simplicity:
- No editing of variety data (stays in source code)
- Simple localStorage for "have seeds" status
- Collapsible UI for easy browsing

## Consequences

### Positive
- Users can see all tracked varieties in one place
- Simple "have/need" tracking helps with ordering
- Spending visibility across years
- Direct links to suppliers for ordering

### Negative
- Varieties are hardcoded, not user-editable via UI
- No sync between devices for "have seeds" status

### Future Considerations
- Could add variety editing through a form
- Could integrate with allotment planting (auto-suggest varieties)
- Could add seed expiry tracking
