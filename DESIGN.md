# Design

<!-- impeccable:design-schema 1 -->

## World

Industrial Precisionist — flat overlapping geometric planes under one hard raking light, refusing the food-delivery-app default (rounded cards, warm gradients, cartoon mascot). Built from grounded direction #5 (grain-elevator-as-planes / painted industrial plate), which won both axes (audience identification, product clarity) against the dealt challenger (drive-thru LED board) in the direction round. Seed key `4a4c6a8d`. No image generation was available this session, so the build is code-led: no comp, ambition carried directly in code and audited by eye against the direction contract.

## Palette — Restrained-to-Committed

- `--color1` `#2B2F33` slate — dark planes: header, sidebar, footer, hard-shadow ink.
- `--color2` `#B33F2C` rust/oxide — raking-light accent, links, scrollbar, error 404 mark.
- `--color3` `#E8A33D` amber — primary action (all buttons), signal/selected state.
- `--color4` `#D9663B` warm oxide — hover/selected plane highlight (sidebar active item).
- `--color5` `#F4F1EA` chalk white — light surfaces: page background, cards, form panels.
- `--grey1..4` slate-to-warm-grey scale for text and borders.

No gradients anywhere. Color is applied at plane scale (whole backgrounds), never as a scattered accent.

## Typography

- Display: **Big Shoulders Stencil** (Google Fonts) — reserved for the BIGBURGER wordmark and the header brand mark only. Literal stencil/industrial-signage character; avoided the AI-overused-font list (Inter, Space Grotesk, Fraunces, etc. — flagged by `impeccable detect`).
- Body/UI: **IBM Plex Sans** — all headings (h1–h4, antd Typography), forms, tables, buttons. Bold weight (700) carries heading hierarchy instead of the stencil face, so admin tables and forms stay legible.

## Shape & Depth

- `--radius: 2px` — square-cut geometry, no pill buttons, no rounded cards.
- Hard offset shadows only (`--shadow-hard`, `-sm`, `-press`: `Npx Npx 0 var(--color1)`), never blurred. This is a deliberate signature of the committed world (raking light → hard-edged shadow), not a neobrutalist default.
- Buttons press by translating toward the shadow and flattening it to 0 on `:active` — no scale-up hover.

## Components touched

Login (full rebuild: raking-light diagonal planes, wordmark, flat form panel), Header (geometric triangle mark + wordmark replacing the mascot logo), Sidebar (dark plane nav, amber/oxide active state), Footer (wordmark replacing mascot), Home layout background, product/cart/order cards and tables (hard shadow, square corners), Error 404 (oversized rust numeral mark replacing the stock clipart image), global button/input/focus/selection/scrollbar theming in `index.css`.

## Assets replaced

`logo-transparente.png` (cartoon mascot) is no longer referenced anywhere in `src/` — replaced by an authored inline SVG mark (two triangles, header) and typographic wordmarks (login, footer). The Error page's external clipart background was replaced by a CSS-drawn numeral mark.

## Known gap

No image-generation tool was available this session, so this shipped code-led per the skill's own fallback (no comp, ambition audited in code against the direction contract's FIRST VIEWPORT block). Desktop was inspected across all seven routes (login, catalog, cart, my orders, admin products/orders/users); the tool used to resize the browser viewport did not actually change the rendered viewport this session, so the mobile breakpoint (`Login.scss` `@media max-width: 700px` and antd's own responsive `Sider`/`Table` behavior) was reviewed in source but not visually captured — verify on a real phone or DevTools device toolbar before treating it as confirmed.
