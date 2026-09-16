# Homepage parity — 2026-09-16

Reference: this repository's `master:app/(home)/page.tsx` and
`master:components/common/ProductCard.tsx`, read directly. Work stays on
`sonnet_dev`, uncommitted for review.

The existing Container and SectionSlider match master and remain unchanged.
All six original titles/order are restored, with up to eight real products per
rail. Empty/failed queries hide their rail; no padding or mock products.

| Rail | GET /api/v1/products parameters | Reason / limitation |
| --- | --- | --- |
| Best Selling | sort=popular, pageSize=8 | Upstream sales_count descending. |
| Trending Products | sort=popular, page=2, pageSize=8 | More best-sellers, disjoint from the first rail; no measured trend/velocity ranking exists. Title retained for reference parity. |
| Top Electronics | category=gadgets, sort=popular, pageSize=8 | Real parent category includes descendants. |
| Latest Fashion | category=women-wear, sort=newest, pageSize=8 | Pick one real fashion category; avoids implying an API-wide fashion category exists. |
| Premium Bags | category=bags, sort=price_desc, pageSize=8 | Higher source price is a proxy for premium, not a quality certification. Existing API sorting is before merchant price overrides. |
| You May Also Like | sort=newest, pageSize=8 | General catalog discovery; not personalized recommendations. |

The existing `newest` API sorts by descending catalog ID, not created_at. These
rails use that existing contract; the New badge independently uses actual
created_at. Cross-rail overlap can occur naturally across category/newest rails.

Card spacing, image ratio, typography, wishlist placement, metadata row,
green shipping pill and price/strike layout follow master. Taka remains whole
BDT. Compare overlay, MOQ badge and review-count text are removed from this
shared card to match the reference; their other product-page controls remain.
Guest wishlist support is intentionally retained because the real backend
supports guests. Missing rating and sold count explicitly display 0.

The backend summary adds facts to all product listing paths (ordinary listings,
search, brand and vendor):

- `originalPriceBdt`: computed default shelf price only when an absolute
  `curation.price_override_bdt` lowers the final rounded price. This backs the
  green Sale badge and strike price. Equal/higher overrides and margin-only
  changes have neither. No fabricated percent badges or upstream previous-price
  assumptions. Sale is the selected discount treatment from the reference.
- `isNew`: catalog created_at is within the past 30 days, excluding future dates.
  This means new to the catalog, not newly manufactured.
- `inStock`: nullable boolean from upstream stock_qty (`master_quantity`);
  explicit zero produces Out of stock. Unknown never means out of stock. Raw
  quantities are not displayed. This is the latest imported availability,
  not live inventory. Badge priority: Out of stock, Sale, New.
- Hot is omitted: no defined threshold or real hotness classification exists.

GET /api/v1/checkout/terms now exposes `shippingDaysMin` and `shippingDaysMax`
from admin-editable merchant_config. The homepage fetches them once and passes
one estimate to every card. Missing/failed/invalid estimates omit the pill;
there is no hardcoded delivery fallback. Equal endpoints show a single day
count. The backend's existing settings cache/invalidation remains in effect.
Other pages can pass shippingTime to the shared card but do not fetch it per
card. Unknown availability is omitted from homepage structured data; real
reviews alone supply aggregateRating even though the visible fallback is 0.

HeroSlider and fetchSliderImages are untouched and remain off until real banner
data is available (HYDRA 3e1d1569). No schema migration is needed. Deploy the
backend before the frontend to enable the new card facts and shipping pill.

## Verification

- Frontend: `~/.local/bin/pnpm --ignore-workspace exec tsc --noEmit` passed.
- Frontend: `~/.local/bin/pnpm --ignore-workspace exec next build` passed.
  Network access was needed for existing Google Fonts imports. The build logs
  the existing multiple-lockfile warning and cookie/static-render diagnostics;
  the final homepage route is dynamic and the build exits successfully.
- Backend: `~/.local/bin/pnpm --ignore-workspace exec tsc --noEmit` passed.
- Backend: focused Jest suites for checkout terms, merchant config, product
  service units and pricing: **4 suites, 70 tests passed**. Local database
  access was needed for the merchant-config suite.
- Both repositories: `git diff --check` passed.
- Layout checked against master source; no browser screenshot comparison run.
