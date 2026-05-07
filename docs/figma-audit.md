# Figma Audit

Source file key: `7i1Ds203DTymyr9aXd5AWn`

Audit policy: pages and layers whose names include `old`, `archive`, or `deprecated` are not used as implementation source.

Excluded old pages:

- `Screen 4: Live Route old`
- `Screen 9: Compare Peppers old`

Current screen pages:

- `Screen 1: Home / Start Visit`
- `Screen 2: Visit Planner`
- `Screen 3: Recommended Route`
- `Screen 4: Live Route`
- `Screen 5: Stop Detail`
- `Screen 6: Farm Map`
- `Screen 7: Pepper Catalog`
- `Screen 8: Pepper Detail`
- `Screen 9: Compare Peppers`
- `Screen 10: My Visit`
- `Screen 11 - How AI Works`
- `Screen 12 - Help / Accessibility`

Observed structure:

- Screens are organized as page-level frames with nested `Body`, `App`/screen-name containers, `Header`, `Main Content`/`Container`, and `Footer` layers.
- Component library pages exist: `Components_WEB` and `Components Mobile`.
- Component pages contain many reusable-looking frames such as `Button`, `Card`, `Chip`, `Badge`, `IconButton`, `RouteProgress`, `TopBar`, `BottomNav`, `RouteStopCard`, `PrimaryButton`, and `ChoiceChip`.
- These are currently ordinary Figma `FRAME` nodes, not real `COMPONENT`, `COMPONENT_SET`, or `INSTANCE` nodes.

Implementation consequence:

- Do not wait for Figma instances before coding.
- Recreate reusable UI as code components based on the Figma layer patterns and visual style.
- Treat the current Figma pages as visual/source references, with old pages excluded.

Known frame size variation:

- Many screens are desktop-oriented around 1536px width.
- Some current replacement screens use wider canvases, including Stop Detail and Compare Peppers. The web prototype should keep the visual logic while using responsive browser layouts.
