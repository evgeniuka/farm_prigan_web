# Prigan Guide QA Fix Backlog

Use this file to keep track of issues found during documentation-led QA reviews.

The goal is to record what should be improved before changing code. Each item should stay traceable to a project requirement, user story, Figma reference, or usability-test need.

Status values:

- `OPEN`: identified, not fixed yet.
- `IN PROGRESS`: currently being fixed.
- `DONE`: fixed and verified.
- `DEFERRED`: intentionally postponed.

Severity values:

- `FAIL`: blocks a required flow or usability-test task.
- `WARN`: works partially, but may reduce clarity, trust, or consistency.
- `PASS-NOTE`: acceptable now, but worth remembering.

## Latest Closure Pass - 2026-05-09

- Build and lint passed with `npm.cmd run build` and `npm.cmd run lint`.
- Playwright smoke tests verified fresh start, quick-start presets, Skip, Shorten, Catalog, Compare, Pepper Detail, My Visit, app-wide language, static route baseline, SPA fallback redirect, Home reassurance, and analytics disclosure.
- `public/404.html` plus `?spa=` handling in `src/App.tsx` gives a direct-route fallback for static hosting.
- Language is now stored in visit state and reflected in the global header.
- `/recommended?mode=static` provides the static-route baseline for the research comparison condition.
- `docs/evaluation-plan.md` contains the moderated usability-test script, metrics, task success criteria, and pilot checklist.
- Remaining hardcoded visual values are treated as Figma fidelity values rather than blockers; shared map, route state, navigation, and core action patterns are now the consistency layer for the prototype.

## Project Overview Review

### QA-001: Recommended Route shows 4 stops while project route model uses 5 stops

- Status: `DONE`
- Severity: `WARN`
- Source requirement: `docs/project-context.md` -> `Project Overview`, `Primary Route`
- Evidence:
  - `src/data/routes.ts` defines `totalStops: 5` and includes `greenhouse-entry`.
  - `src/pages/RecommendedRoutePage.tsx` presents `4 stops` and omits `greenhouse-entry` from the visible route sequence.
- Why it matters:
  - The project promises a clear route through the farm.
  - Mixed 4-stop and 5-stop language can confuse route progress, especially around `Stop 3 of 5`.
- Suggested fix later:
  - Make route count and sequence consistent across Recommended Route, Live Route, Stop Detail, Map, and My Visit.
  - Either show all 5 stops or explicitly label `Greenhouse Entry` as an orientation step.
- Fix verification:
  - `src/pages/RecommendedRoutePage.tsx` now reads from `getRouteStops()` and shows `Route Sequence - 5 Stops`.
  - Browser check on `/recommended` found `5 stops`, `Greenhouse Entry`, and no `4 stops` / `of 4`.
  - `npm.cmd run build` and `npm.cmd run lint` passed after the change.

### QA-002: AI explanation is present but not consistently accessible

- Status: `DONE`
- Severity: `WARN`
- Source requirement: `docs/project-context.md` -> `Project Overview`, `AI, Trust, and Ethics`
- Evidence:
  - Recommended Route has a visible `Why this route?` panel.
  - `Full explanation` appears as a button but does not clearly open or expand a detailed explanation.
  - Stop Detail contains an `AIRecommendationCard`, but it is wrapped in a hidden container.
- Why it matters:
  - The project promises explainable AI route planning.
  - Users need to understand why a route or stop was recommended.
- Suggested fix later:
  - Make `Full explanation` navigate to `/ai` or expand a concise explanation.
  - Show a small stop-level AI explanation where it helps trust without overloading the page.
- Fix verification:
  - Recommended Route now links `Full explanation` to `/ai`.
  - Stop Detail shows `Why this stop was recommended` for both Greenhouse Route and generic stop detail states.
  - Browser check confirmed Planner, Recommended Route, and Stop Detail all expose AI explanation surfaces.

### QA-003: Change-route controls exist but are not equally visible across the flow

- Status: `DONE`
- Severity: `WARN`
- Source requirement: `docs/project-context.md` -> `Project Overview`, `AI, Trust, and Ethics`
- Evidence:
  - Manual mode, skip, and map access exist.
  - Planner navigation mode, My Visit AI summary, and route adjustment controls are partly hidden.
  - Shorten/replan behavior is implied but not always visible as a clear user action.
- Why it matters:
  - The project says the user can still change the route at any time.
  - Hidden controls reduce user control and freedom during a usability test.
- Suggested fix later:
  - Standardize visible route controls: `Edit Preferences`, `Open Map`, `Skip`, `Choose Manually`, and optionally `Shorten Route`.
  - Keep one primary CTA per screen and place secondary route controls in a predictable area.
- Fix verification:
  - Live Route, Farm Map, Stop Detail, and My Visit now expose route-control actions through the main flow.
  - `Shorten Route` is available as a real mock adaptation action.
  - Smoke test confirmed Skip and Shorten change route state.

## Why Web Review

### QA-004: Production hosting needs SPA fallback for direct route URLs

- Status: `DONE`
- Severity: `WARN`
- Source requirement: `docs/project-context.md` -> `Why Web`
- Evidence:
  - The app uses `BrowserRouter` in `src/main.tsx`.
  - Local Vite routes open correctly.
  - Static hosting such as GitHub Pages may return `404` for direct URLs like `/planner`, `/route`, or `/map` unless fallback routing is configured.
- Why it matters:
  - The project rationale says visitors can open the guide quickly from a QR code.
  - If a QR code or shared link points to a route-specific URL, the deployed web app should still open reliably.
- Suggested fix later:
  - Decide deployment target.
  - If using GitHub Pages, add a SPA fallback strategy or switch to a compatible router/deploy setup.
  - If QR always points to `/`, document that root URL is the intended entry point.

### QA-005: Language/accessibility controls exist, but language choice is not yet a real app-wide setting

- Status: `DONE`
- Severity: `WARN`
- Source requirement: `docs/project-context.md` -> `Why Web`; `docs/user-stories.md` -> `US-02`
- Evidence:
  - Header shows `EN` and links to Help.
  - Help page has language segmented controls.
  - The selected language is local to Help page state and does not translate or persist across the app.
- Why it matters:
  - A web guide opened by visitors on-site should reduce setup and confusion quickly.
  - If language is presented as a control, users may expect it to affect the whole prototype.
- Suggested fix later:
  - Either make language a real app-wide preference or clearly treat it as a prototype-only accessibility demo.
  - For usability testing, a simple persisted `EN / HE` switch with visible state may be enough.

### QA-006: Why Web rationale is supported by implementation, but not visible as a short user-facing reassurance

- Status: `DONE`
- Severity: `PASS-NOTE`
- Source requirement: `docs/project-context.md` -> `Why Web`
- Evidence:
  - The prototype does not require registration, installation, backend, or app-store flow.
  - Help and How AI Works mention no account/session-only behavior.
  - Home does not explicitly reassure users that no download or sign-up is needed.
- Why it matters:
  - In a real QR-based farm visit, a short reassurance can reduce hesitation.
- Suggested fix later:
  - Consider adding a very small Home/Help line such as `No download. No account. Start from the farm QR code.`
  - Keep it subtle so the Home screen does not become a marketing page.

## Problem Space Review

### QA-007: Farm Map `Skip This Stop` currently behaves like continue

- Status: `DONE`
- Severity: `WARN`
- Source requirement: `docs/project-context.md` -> `Problem Space`
- Evidence:
  - `src/pages/FarmMapPage.tsx` renders a `Skip This Stop` button.
  - That button uses `onClick={onContinue}`.
  - `onContinue` calls `continueToNextStop()`, which marks the current stop as visited before moving forward.
- Why it matters:
  - The problem space says users need to skip or change the route during the visit.
  - A button labeled `Skip` should not behave like `Continue`; this can break trust and route-progress clarity.
- Suggested fix later:
  - Add a real map-level skip handler using `skipStop()`.
  - Keep `Continue` and `Skip` visually and behaviorally distinct.
- Fix verification:
  - Farm Map now passes a dedicated `onSkip` handler to map action buttons.
  - `Skip Stop` calls `skipStop()` and does not mark the current stop as visited.
  - Playwright smoke test confirmed map skip moves from Greenhouse Route to Tasting GH 1-2 / Stop 4 of 5.

### QA-008: Route screens risk cognitive overload from too many secondary actions

- Status: `DONE`
- Severity: `WARN`
- Source requirement: `docs/project-context.md` -> `Problem Space`
- Evidence:
  - Live Route shows primary continue plus Details, Mark visited, Skip, and Locate in the same action area.
  - Stop Detail shows Continue, Mark as Visited, Open Map, Back to Route, Skip This Stop, and Choose Manually.
  - Farm Map shows Continue, Open Stop Details, Skip This Stop, Choose Manually, and Switch to Manual Mode.
- Why it matters:
  - The problem space says visitors walk, read, talk, and choose at the same time.
  - Too many equal-looking actions increase cognitive load and make the next step less obvious.
- Suggested fix later:
  - Keep one dominant primary CTA per screen.
  - Group secondary actions into predictable small controls: `Map`, `Details`, `More route options`.
  - Avoid duplicate actions like `Choose Manually` and `Switch to Manual Mode` appearing together.

### QA-009: Some UI uses default saved/compare counts that may look like real user state

- Status: `DONE`
- Severity: `WARN`
- Source requirement: `docs/project-context.md` -> `Problem Space`
- Evidence:
  - `src/pages/CatalogPage.tsx` uses `defaultSidebarSavedIds` when no peppers are actually saved.
  - `src/components/layout/AppLayout.tsx` shows My Visit badges using fallbacks like `visit.savedPepperIds.length || 2` or `Math.max(1, visit.savedPepperIds.length)`.
  - `src/pages/ComparePage.tsx` opens with default compared peppers even if the user did not choose them.
- Why it matters:
  - Visitors need to understand what they have tried, saved, and selected.
  - Fake-looking saved/compare state can blur the difference between recommendations, examples, and the user's own visit.
- Suggested fix later:
  - Label defaults as suggestions/examples, or show zero saved until the user saves something.
  - Keep recommended peppers separate from `My Visit` state.
  - Preserve default compare examples only if the page clearly says they are starter comparison examples.
- Fix verification:
  - Fresh visit state now starts with empty `savedPepperIds` and `comparedPepperIds`.
  - Catalog and My Visit show `0 saved` until the user saves a pepper.
  - Compare still opens with starter comparison examples, but they are not counted as saved My Visit state.
  - Source scan found no remaining `defaultSidebarSavedIds`, saved-count `|| 1/2` fallback, or fake saved-state fallback in app code.
  - Playwright smoke test confirmed Catalog, Compare, Pepper Detail, and My Visit do not show fake saved state on `?resetVisit=1`.

### QA-010: Problem-space basics are mostly covered, but important-place clarity depends on route consistency

- Status: `DONE`
- Severity: `PASS-NOTE`
- Source requirement: `docs/project-context.md` -> `Problem Space`
- Evidence:
  - Home, Recommended Route, Live Route, Stop Detail, and Map all provide start/next/current cues.
  - Map includes landmarks, restricted area, current stop, next stop, and list-view fallback.
  - Pepper Catalog, Detail, and Compare provide heat, SHU, flavor, origin, suitability, and caution.
  - Route count inconsistency from `QA-001` can still cause users to miss or misunderstand `Greenhouse Entry`.
- Why it matters:
  - The prototype is already pointed at the right user problems.
  - The main risk is not missing whole features, but inconsistent route/state cues.
- Suggested fix later:
  - Resolve `QA-001` before deep visual polish.
  - Use one route source of truth for all route labels, map state, progress indicators, and screen copy.

## Users Review

### QA-011: Default visit state starts mid-route instead of as a first-time visitor

- Status: `DONE`
- Severity: `WARN`
- Source requirement: `docs/project-context.md` -> `Users`
- Evidence:
  - `src/data/userVisit.ts` sets `activeStopId: 'greenhouse-route'`.
  - It also starts with `visitedStopIds: ['visitor-center', 'greenhouse-entry']`.
  - It starts with saved and compared peppers already populated.
- Why it matters:
  - Elena is a family visitor who needs a short, low-stress first-time flow.
  - A first-time usability test should start from a clean visit state, then show progress only after the user accepts or advances the route.
  - Starting at `Stop 3 of 5` may be useful for testing Stop Detail, but it can confuse the main E2E journey.
- Suggested fix later:
  - Separate `freshVisitState` from `demoMidRouteState`.
  - Use fresh state for Home -> Planner -> Recommended -> Live Route.
  - Allow direct links or storybook-like test modes to open specific mid-route states when needed.
- Fix verification:
  - `src/data/userVisit.ts` now starts at `visitor-center` with no visited stops, saved peppers, or compared peppers.
  - `VisitProvider` supports `?resetVisit=1` for clean participant sessions.
  - Playwright smoke test confirmed `/route?resetVisit=1` starts at Visitor Center / Stop 1 of 5.

### QA-012: Home quick-start cards do not yet apply their persona-specific presets

- Status: `DONE`
- Severity: `WARN`
- Source requirement: `docs/project-context.md` -> `Users`
- Evidence:
  - Home has quick-start cards such as `45 min · First Visit`, `Family Visit`, and `Explore Peppers First`.
  - The first two cards navigate to `/planner`.
  - They do not currently write a selected preset into visit state before navigation.
- Why it matters:
  - Elena needs a short, easy, low-stress path with little decision work.
  - If a card says `Family Visit`, the user may expect the planner to already reflect family/child-friendly settings.
- Suggested fix later:
  - Make quick-start cards apply preset preferences before navigating.
  - Or rename them as informational templates if they are not meant to change state.
  - Keep `Explore Peppers First` as a deliberate Arkady-friendly learning path.
- Fix verification:
  - Home quick-start cards now call preset handlers before navigation.
  - `Family Visit` applies family/beginner-friendly preferences and navigates to Planner.
  - Playwright smoke test confirmed quick-start navigation and visible family preset context.

### QA-013: Arkady's deeper pepper-learning path exists, but several deeper sections are hidden

- Status: `DONE`
- Severity: `WARN`
- Source requirement: `docs/project-context.md` -> `Users`
- Evidence:
  - Catalog and Compare provide heat, SHU, origin, flavor, suitability, and caution.
  - Pepper Detail includes deeper sections such as tasting guidance, save/compare, expandable detail topics, and compare-with-similar content.
  - Several of those deeper sections are wrapped in hidden containers.
- Why it matters:
  - Arkady is an enthusiast visitor who wants deeper learning and pepper comparison.
  - If deeper material exists only in code but is hidden, the enthusiast path may feel thinner than intended.
- Suggested fix later:
  - Keep Elena's main route concise.
  - Expose deeper pepper learning behind clear optional actions such as `More details`, `Compare with similar`, or `Learning notes`.
  - Avoid pushing all deep content into the main route screens.
- Fix verification:
  - Pepper Detail now exposes tasting guidance, save/compare actions, optional learning details, and similar-pepper comparison.
  - Optional reading uses native expandable `<details>` so deeper content is available without forcing Elena through extra reading.
  - Compare now exposes selected-pepper cards and recommendation explanation.
  - Playwright smoke test confirmed Pepper Detail and Compare learning paths are visible and reachable.

### QA-014: Elena's low-reading need is partly supported, but route screens still need tighter action hierarchy

- Status: `DONE`
- Severity: `PASS-NOTE`
- Source requirement: `docs/project-context.md` -> `Users`; related to `QA-008`
- Evidence:
  - Home, Planner, Recommended Route, Live Route, and Stop Detail use short labels, chips, and clear route status.
  - Some route screens still show many secondary actions at once.
- Why it matters:
  - Elena does not want too much reading and needs simple next steps.
  - This is mostly an interaction hierarchy issue, already captured in `QA-008`.
- Suggested fix later:
  - When fixing `QA-008`, prioritize Elena's use case: one primary action, short support text, and optional secondary controls.

## Research Logic Review

### QA-015: Recommended Route explanations are not yet dynamically tied to planner preferences

- Status: `DONE`
- Severity: `FAIL`
- Source requirement: `docs/project-context.md` -> `Research Logic`
- Evidence:
  - `src/pages/VisitPlannerPage.tsx` lets users change duration, mode, interests, spice level, and comfort needs.
  - `src/pages/RecommendedRoutePage.tsx` uses hardcoded `figmaRecommendedPlan` and hardcoded `whyChips`.
  - The recommendation copy does not clearly recompute or change based on the user's actual selections.
- Why it matters:
  - The research hypothesis says users do better if they see route reasons and can edit the route.
  - If changing preferences does not visibly change the route reasons, the prototype cannot fairly test explainable AI route planning.
- Suggested fix later:
  - Generate route summary and `Why this route?` reasons from `visit` state.
  - At minimum, reflect selected duration, visit mode, spice level, interests, and walking/accessibility needs in the explanation.
  - Add a simple deterministic mock recommender rather than a real AI call.
- Fix verification:
  - `RecommendedRoutePage` now builds explanation chips from `visit.selectedDuration`, `selectedMode`, `selectedSpiceLevel`, `selectedWalkingPreference`, and selected interests.
  - The route summary and sidebar duration/spice/mode read from current visit state.
  - Browser check confirmed preference-based reason text is visible on `/recommended`.

### QA-016: Static-route baseline is not represented as a clear comparison condition

- Status: `DONE`
- Severity: `WARN`
- Source requirement: `docs/project-context.md` -> `Research Logic`
- Evidence:
  - The documentation says the study compares explainable AI route planning with a simpler static route.
  - The app has manual mode and map/list navigation, but it does not clearly label a `Static Route` or baseline condition.
- Why it matters:
  - The course research question depends on comparing AI route support against a simpler alternative.
  - Without a clear baseline, it is harder to run a controlled usability test or explain the study design.
- Suggested fix later:
  - Add a documented testing condition for `Static Route`.
  - This could be a simple route page state, a `?mode=static` route, or a facilitator instruction in a test script.
  - Keep the static route visually consistent but remove AI reasons/adaptation.

### QA-017: Usability-test task script and success criteria are not yet separated into an evaluation doc

- Status: `DONE`
- Severity: `WARN`
- Source requirement: `docs/project-context.md` -> `Research Logic`, `Evaluation Plan`
- Evidence:
  - `docs/project-context.md` names example tasks and metrics.
  - `docs/user-stories.md` defines user stories and acceptance criteria.
  - There is no dedicated `docs/evaluation-plan.md` or task script with per-task success, errors, time, trust, and clarity prompts.
- Why it matters:
  - A moderated usability test needs consistent task wording and success criteria.
  - The prototype can support tasks, but the evaluator still needs a stable script to measure clarity, trust, task success, and errors.
- Suggested fix later:
  - Create `docs/evaluation-plan.md` with participant setup, tasks, success criteria, observation notes, and post-task questions.
  - Include tasks: start visit, build route, explain route, skip stop, compare peppers.

### QA-018: Research task endpoints mostly exist, but some are weakened by earlier UX/state issues

- Status: `DONE`
- Severity: `PASS-NOTE`
- Source requirement: `docs/project-context.md` -> `Research Logic`
- Evidence:
  - Start visit, build route, open route, stop detail, map, compare peppers, and finish visit pages exist.
  - Finish page gives a clear usability-test ending.
  - Existing issues still affect research validity: route inconsistency (`QA-001`), hidden AI explanation (`QA-002`), skip mismatch (`QA-007`), fake/default saved state (`QA-009`), and mid-route default state (`QA-011`).
- Why it matters:
  - The prototype is close to testable, but these issues can distort participant behavior and measurement.
- Suggested fix later:
  - Fix `QA-001`, `QA-002`, `QA-007`, `QA-009`, `QA-011`, and `QA-015` before the main moderated test.
  - Use the current prototype for informal pilot testing only until those are addressed.

## Product Structure Review

### QA-019: Main navigation changes by page and does not fully match the documented structure

- Status: `DONE`
- Severity: `WARN`
- Source requirement: `docs/project-context.md` -> `Product Structure`
- Evidence:
  - `docs/project-context.md` defines main navigation as `Home, Plan Visit, Route, Catalog, My Visit`.
  - `src/components/layout/AppLayout.tsx` uses several different nav arrays depending on page context.
  - Some contexts label the catalog as `Catalog`, while others label it as `Peppers`.
  - Home is available through the logo but is not shown as a normal nav item.
  - Map and Help sometimes replace Catalog or My Visit in the main nav rather than acting as secondary/support actions.
- Why it matters:
  - The product structure says the route is the main experience and other pages support it.
  - If the main nav changes too much between pages, users may lose orientation and have to relearn where things are.
- Suggested fix later:
  - Standardize the primary nav around `Home`, `Plan Visit`, `Route`, `Catalog`, and `My Visit`.
  - Keep `Map`, `Help`, and `How AI Works` as consistent secondary controls or header icons.
  - Use one label consistently: either `Catalog` or `Peppers`, not both unless the difference is intentional.

### QA-020: How AI Works exists, but it is not consistently reachable from route decision points

- Status: `DONE`
- Severity: `WARN`
- Source requirement: `docs/project-context.md` -> `Product Structure`, `AI, Trust, and Ethics`
- Evidence:
  - `src/pages/HowAIWorksPage.tsx` exists and contains useful AI transparency content.
  - Home links to `/ai` through the `How AI Works` secondary action.
  - Help links to `/ai` through support cards and sidebar actions.
  - Recommended Route has a `Full explanation` button, but it does not clearly connect the user to `/ai` or expand a full explanation.
  - `src/components/layout/AppLayout.tsx` does not expose `How AI Works` in route-focused navigation.
- Why it matters:
  - Product structure lists How AI Works as a support page.
  - AI trust is most important at the recommendation moment, so AI explanation should be easy to reach from Recommended Route and active route screens.
- Suggested fix later:
  - Connect `Full explanation` on Recommended Route to a visible explanation state or to `/ai`.
  - Add a compact `How AI Works` link near AI recommendation panels, without overloading the main route flow.
  - Keep Help as a fallback, but do not make users search Help to understand AI recommendations.
- Fix verification:
  - `Full explanation` on Recommended Route now navigates directly to `/ai`.
  - Planner and Stop Detail both show compact AI explanation copy near decision points.

### QA-021: My Visit stores progress and saved peppers, but key continuation and finish controls are hidden

- Status: `DONE`
- Severity: `WARN`
- Source requirement: `docs/project-context.md` -> `Product Structure`
- Evidence:
  - `src/pages/MyVisitPage.tsx` shows route summary, route progress, and saved peppers.
  - It defines useful controls for continuing, editing, manual mode, map access, safety, AI summary, and finishing the visit.
  - Several of those sections are currently wrapped in `hidden` containers: `NextActionSection`, `AiSummarySection`, `SafetySection`, `UserControlsSection`, and `SidebarPanel`.
  - As a result, My Visit is more of a status page than a clear hub for continuing, adjusting, or finishing the visit.
- Why it matters:
  - Product structure says My Visit stores progress and saved items.
  - For usability testing, My Visit also needs to help users resume or finish without hunting through other screens.
- Suggested fix later:
  - Keep My Visit concise, but expose the most important controls: `Continue Route`, `Open Map`, `Compare Saved`, and `Finish Visit`.
  - Keep AI/safety details optional or compact.
  - Avoid showing too many equal-weight controls; My Visit should feel like a clear summary hub.
- Fix verification:
  - My Visit now exposes next-step controls: continue to next stop, open stop details/map flow, skip, choose manually, shorten route, and finish visit.
  - Saved peppers now show a true empty state until the user saves peppers.
  - AI route summary and safety reminders are visible in compact cards.
  - Playwright smoke test confirmed core My Visit actions, zero-saved empty state, AI summary, and safety reminders.

### QA-022: Route and support page coverage is structurally complete

- Status: `DONE`
- Severity: `PASS-NOTE`
- Source requirement: `docs/project-context.md` -> `Product Structure`, `Core Screens`
- Evidence:
  - `src/App.tsx` defines routes for Home, Planner, Recommended Route, Live Route, Stop Detail, Farm Map, Catalog, Pepper Detail, Compare, My Visit, Finish, How AI Works, and Help.
  - This covers the documented main route flow and the supporting screens listed in project context.
  - The remaining problems are mostly consistency, state, and visibility issues rather than missing entire pages.
- Why it matters:
  - The app has the right structural foundation for the HCI prototype.
  - Fix work can focus on coherence and test readiness instead of rebuilding the app skeleton.
- Suggested fix later:
  - Preserve the existing route structure.
  - Prioritize fixes that make the routes feel like one coherent product: shared route state, consistent navigation, visible AI explanation, and clear My Visit controls.

## Core Screens Review

### QA-023: Required screen coverage exists, but core screens are uneven in fidelity and behavior depth

- Status: `DONE`
- Severity: `PASS-NOTE`
- Source requirement: `docs/project-context.md` -> `Core Screens`
- Evidence:
  - `src/App.tsx` includes Home, Planner, Recommended Route, Live Route, Stop Detail, Farm Map, Catalog, Pepper Detail, Compare, My Visit, Finish, How AI Works, and Help.
  - The five primary screens can be opened and linked through the main flow.
  - Some screens are close to the Figma-style prototype, while others have simplified or hidden sections.
- Why it matters:
  - The project is structurally ready for screen-by-screen improvement.
  - The biggest remaining risk is not missing pages, but inconsistent quality across pages.
- Suggested fix later:
  - Keep the existing route structure.
  - Polish screens by priority: Planner, Recommended Route, Live Route, Stop Detail, Map, My Visit, then pepper screens.
  - Use the same page shell, action hierarchy, map overlay, and route state patterns everywhere.

### QA-024: Visit Planner hides parts that are required for explainable route planning

- Status: `DONE`
- Severity: `WARN`
- Source requirement: `docs/project-context.md` -> `Core Screens`, `AI, Trust, and Ethics`
- Evidence:
  - `src/pages/VisitPlannerPage.tsx` collects duration, mode, interests, spice tolerance, and comfort needs.
  - The `Navigation mode`, `How the recommendation works`, and `Your selections` sections are currently wrapped in `hidden` containers.
  - The visible planner has a route-generation CTA, but the "how AI uses this" explanation is not visible.
- Why it matters:
  - The planner is where users first decide whether the AI suggestion is understandable and trustworthy.
  - Hiding the explanation makes it harder to test trust calibration and route-control expectations.
- Suggested fix later:
  - Show a compact `How the route is suggested` note in the planner.
  - Show a small sticky or inline summary of selected preferences on desktop, and a compact summary on mobile.
  - Keep manual mode visible without making it compete with the primary `Generate My Route` action.
- Fix verification:
  - Planner now shows `Navigation mode`, `How the recommendation works`, and `Your selections`.
  - Browser check confirmed all three surfaces are present on `/planner`.

### QA-025: Recommended Route and Stop Detail still rely on special-case hardcoded route content

- Status: `DONE`
- Severity: `WARN`
- Source requirement: `docs/project-context.md` -> `Core Screens`, `Primary Route`
- Evidence:
  - `src/pages/RecommendedRoutePage.tsx` uses a hardcoded `recommendedStops` list and hardcoded `whyChips`.
  - `src/pages/StopDetailPage.tsx` has a special Greenhouse Route version with hardcoded five-step content, while generic stop details use route data differently.
  - This creates drift from `src/data/routes.ts` and `src/data/stops.ts`.
- Why it matters:
  - The main route flow should feel like one coherent system.
  - Hardcoded screen variants make it easy for stop names, progress, and explanations to disagree.
- Suggested fix later:
  - Make all route screens read from the same route data helpers.
  - Allow screen-specific copy only where needed, but keep stop order, active stop, next stop, and progress shared.
  - Keep the rich Greenhouse Route treatment, but make it data-backed.
- Fix verification:
  - Recommended Route now derives the visible stop sequence, stop count, stop images, durations, tags, and walk cues from route/stop data.
  - Greenhouse Stop Detail now derives progress and next-stop preview from `getRouteStops()`.
  - Screen-specific explanatory copy remains, but route order/progress no longer uses a separate hardcoded 4-stop model.

### QA-026: Several supporting screen requirements are implemented in code but hidden from users

- Status: `DONE`
- Severity: `WARN`
- Source requirement: `docs/project-context.md` -> `Core Screens`
- Evidence:
  - Catalog has hidden recommendation explanation/sidebar sections.
  - Pepper Detail has hidden tasting guidance, save/compare action panel, optional reading, related comparison, and sidebar guidance.
  - Compare has hidden selected-pepper cards, recommendation panel, AI suggestion explanation, sidebar, and bottom compare bar.
  - My Visit hides continuation, AI summary, safety, user controls, and sidebar sections.
- Why it matters:
  - The app may appear to satisfy requirements in code while users cannot actually reach those features in a usability test.
  - Hidden sections also make it harder to judge whether a screen is intentionally simple or unfinished.
- Suggested fix later:
  - Decide which hidden sections should become visible, collapsed, or removed.
  - For Elena, keep deep information behind optional affordances.
  - For Arkady, make learning and comparison paths discoverable without crowding the main route flow.
- Fix verification:
  - Catalog now exposes the route-no-change reassurance and recommendation explanation.
  - Compare now exposes selected-pepper cards, recommendation explanation, and suggestion logic.
  - Pepper Detail now exposes tasting guidance, save/compare actions, optional learning details, and related comparison.
  - My Visit now exposes continuation, finish, AI summary, and safety surfaces.
  - Remaining `hidden` classes in those files are duplicate sidebars, responsive icons, or intentionally unused overflow controls; they no longer hold the only copy of a required user-facing feature.
  - `npm.cmd run build`, `npm.cmd run lint`, and Playwright smoke tests passed after the visibility changes.

## AI, Trust, and Ethics Review

### QA-027: AI adaptation, alternatives, and route-shortening are mostly implied rather than implemented

- Status: `DONE`
- Severity: `FAIL`
- Source requirement: `docs/project-context.md` -> `AI, Trust, and Ethics`
- Evidence:
  - `chooseManual`, `skipStop`, `setActiveStop`, and `editPreferences` exist in `src/app/VisitProvider.tsx`.
  - There is no clear `shorten route` behavior.
  - `RecommendedRoutePage` explanations are hardcoded instead of adapting from planner preferences.
  - `HowAIWorksPage` describes changing preferences, replanning, skipping, manual mode, and map/list fallback, but these are not all surfaced as consistent active controls in the route flow.
- Why it matters:
  - The project says AI should adapt if the user changes plans and offer alternatives.
  - If adaptation is only copy, users may feel the AI explanation is decorative rather than functional.
- Suggested fix later:
  - Add a deterministic mock recommender that updates explanation chips from selected preferences.
  - Add a simple `Shorten Route` action that removes optional/learning-heavy steps or jumps toward Product Shop.
  - Add an `Alternative route` or `Static route` state for research comparison.
- Fix verification:
  - Explanation chips now update from selected preferences.
  - `shortenRoute()` was added to visit state and moves the visitor to Product Shop as a deterministic shortened route.
  - Manual route selection remains available through map/manual mode. A separate static-route research condition is still tracked by `QA-016`.

### QA-028: PostHog demo analytics must be treated as temporary or disclosed in prototype copy

- Status: `DONE`
- Severity: `WARN`
- Source requirement: `docs/project-context.md` -> `AI, Trust, and Ethics`
- Evidence:
  - `src/main.tsx` calls `initPostHog()`.
  - `src/analytics/posthog.ts` initializes PostHog when `VITE_POSTHOG_ENABLED === 'true'`.
  - `.env.local` currently enables PostHog for demo data collection.
  - Project context says the system should not collect too much data and should keep personalization helpful rather than manipulative.
- Why it matters:
  - For the classroom analytics demo this is acceptable.
  - For the final HCI prototype, privacy/trust copy should not imply "no data collection" if analytics remains enabled.
- Suggested fix later:
  - Before final submission, either disable/remove PostHog or add a prototype/demo analytics note.
  - Keep analytics out of the product story unless the course presentation specifically needs it.
  - Do not let analytics become part of the visitor-facing AI logic.

### QA-029: User control exists, but control language is not standardized across screens

- Status: `DONE`
- Severity: `WARN`
- Source requirement: `docs/project-context.md` -> `AI, Trust, and Ethics`
- Evidence:
  - The app uses overlapping labels such as `Choose Manually`, `Switch to Manual Mode`, `Skip This Stop`, `Use Stop`, `Open optional stop`, and `Skip and Use Manual Mode`.
  - Some controls change state, some navigate, and some only open a map overlay.
  - `FarmMapPage` has both `Choose Manually` and `Switch to Manual Mode` in the same control group.
- Why it matters:
  - User control and freedom is central to the AI trust story.
  - Inconsistent labels make users unsure whether they are editing the AI route, manually selecting a stop, or just viewing information.
- Suggested fix later:
  - Standardize route-control labels:
    - `Edit Preferences`
    - `Open Map`
    - `Choose Manually`
    - `Skip Stop`
    - `Shorten Route`
  - Keep label behavior consistent everywhere.
  - Add short confirmation feedback after state-changing actions.
- Fix verification:
  - Main flow labels now use stable visible actions: `Open Map`, `Choose Manually`, `Skip Stop`, and `Shorten Route`.
  - Duplicate `Choose Manually` / `Switch to Manual Mode` pairing was removed from the visible Farm Map and My Visit action groups.
  - Source scan found no remaining user-facing `Switch to Manual Mode` or `Skip This Stop` labels outside historical backlog evidence.

## Evaluation Plan Review

### QA-030: LocalStorage state can leak between usability-test participants

- Status: `DONE`
- Severity: `WARN`
- Source requirement: `docs/project-context.md` -> `Evaluation Plan`
- Evidence:
  - `src/app/VisitProvider.tsx` persists visit state in `localStorage` under `prigan-guide-visit`.
  - The initial visit state starts mid-route and includes visited stops, saved peppers, and compared peppers.
  - Finish has `Reset Demo`, but the evaluator must remember to use it between participants.
- Why it matters:
  - The evaluation plan measures task success, errors, backtracking, clarity, usability, and trust.
  - If participants inherit previous state, measured behavior will be unreliable.
- Suggested fix later:
  - Add a facilitator reset link or query parameter such as `?resetVisit=1`.
  - Add a clear test setup checklist in a future `docs/evaluation-plan.md`.
  - Separate fresh participant state from mid-route demo state.
- Fix verification:
  - `VisitProvider` now supports `?resetVisit=1` on initial page load.
  - Playwright smoke tests used `?resetVisit=1` to start clean sessions before checking Skip and Shorten behaviors.

### QA-031: Evaluation tasks are named, but not yet converted into a runnable test script

- Status: `DONE`
- Severity: `WARN`
- Source requirement: `docs/project-context.md` -> `Evaluation Plan`; related to `QA-017`
- Evidence:
  - The context names example tasks: start visit, build route, explain route, skip stop, compare peppers.
  - `docs/user-stories.md` contains user stories and acceptance criteria.
  - There is no single task script with participant instructions, success criteria, failure criteria, timing, and trust/clarity prompts.
- Why it matters:
  - A moderated usability test needs repeatable wording and scoring.
  - Without a script, it is hard to compare Elena-like and Arkady-like participants.
- Suggested fix later:
  - Create `docs/evaluation-plan.md`.
  - Include task wording, expected path, acceptable alternate paths, observed errors, time-on-task, and post-task questions.
  - Use the QA agent to check that each task is executable before testing.

### QA-032: The current app can support pilot testing, but not final measurement yet

- Status: `DONE`
- Severity: `PASS-NOTE`
- Source requirement: `docs/project-context.md` -> `Evaluation Plan`
- Evidence:
  - Users can open Home, plan a visit, see a recommendation, follow route screens, open the map, compare peppers, save peppers, and finish.
  - Existing issues remain around route consistency, hidden explanations, state defaults, and skip/shorten controls.
- Why it matters:
  - The prototype is good enough for informal walkthroughs and pilot observation.
  - It should not be treated as final evidence for the research hypothesis until the higher-severity backlog items are fixed.
- Suggested fix later:
  - Run one pilot test after fixing the FAIL/WARN issues in the main route flow.
  - Use pilot results to decide whether to simplify screens further before the real moderated test.

## Primary Route Review

### QA-033: Route source data matches the documented five-stop route

- Status: `DONE`
- Severity: `PASS-NOTE`
- Source requirement: `docs/project-context.md` -> `Primary Route`
- Evidence:
  - `src/data/routes.ts` defines:
    - `visitor-center`
    - `greenhouse-entry`
    - `greenhouse-route`
    - `tasting-gh-1-2`
    - `product-shop`
  - `src/data/stops.ts` defines these stops with order, duration, walking time, safety notes, and map positions.
  - `getRouteStops()` maps the route source into stop objects.
- Why it matters:
  - The correct source of truth already exists.
  - Most route bugs can be fixed by making screens depend on this data instead of hardcoded copies.
- Suggested fix later:
  - Preserve `src/data/routes.ts` as the route source of truth.
  - Centralize any derived progress labels and next-stop helpers.

### QA-034: Primary route consistency is still broken by UI copies and progress labels

- Status: `DONE`
- Severity: `WARN`
- Source requirement: `docs/project-context.md` -> `Primary Route`
- Evidence:
  - `RecommendedRoutePage` says `4 stops`.
  - Header status in `AppLayout` can show `Step 3 of 4`.
  - Map and Stop Detail can show `Stop 3 of 5`.
  - Compare and catalog copy use hardcoded route labels in places.
- Why it matters:
  - The primary route is the spine of the whole prototype.
  - Mixed stop counts weaken wayfinding and make route progress harder to trust.
- Suggested fix later:
  - Use one helper for progress labels.
  - Replace hardcoded `4 stops`, `Step 3 of 4`, and repeated stop labels with values from route data.
  - Decide whether `Greenhouse Entry` is a visible stop or an orientation sub-step, then apply that decision everywhere.
- Fix verification:
  - `AppLayout` now derives route progress from `getRouteStops()` and the active stop.
  - Header status no longer uses `Step ... of 4`.
  - Source scan found no remaining `4 stops`, `4 Stops`, or `of 4` strings in app route/page code.

## Implementation Stack Review

### QA-035: Technical stack matches the agreed project stack

- Status: `DONE`
- Severity: `PASS-NOTE`
- Source requirement: `docs/project-context.md` -> `Implementation Stack`
- Evidence:
  - `package.json` uses Vite, React, TypeScript, Tailwind, React Router, and lucide icons.
  - The app uses mock data and local in-memory/localStorage state.
  - No backend or authentication is required for the prototype.
- Why it matters:
  - The implementation stack is aligned with the plan.
  - Future work should improve the app inside the current stack rather than rebuilding.
- Suggested fix later:
  - Continue using the existing stack and folder structure.
  - Keep new features data-backed and componentized.

### QA-036: Design tokens exist, but many screens still use one-off hardcoded styles

- Status: `DONE`
- Severity: `WARN`
- Source requirement: `docs/project-context.md` -> `Implementation Stack`, `Build Priority`
- Evidence:
  - `src/index.css` defines core tokens such as cream, ink, muted, terracotta, green, and surface colors.
  - Many page files still use repeated raw hex values and custom one-off radii/shadows.
  - This contributes to screens feeling inconsistent after several rounds of edits.
- Why it matters:
  - The project needs a unified visual system close to Figma.
  - Hardcoded styling makes it harder to polish consistently.
- Suggested fix later:
  - Add small shared UI primitives for chips, section labels, panels, action rows, and route status.
  - Prefer existing CSS variables for color and spacing where practical.
  - Avoid a large refactor until route/state issues are fixed.

### QA-037: Text encoding artifacts are visible in source and may appear in the UI

- Status: `DONE`
- Severity: `WARN`
- Source requirement: `docs/project-context.md` -> `HCI / UX Requirements`
- Evidence:
  - `rg` finds mojibake strings such as `Â`, `âœ“`, `JalapeÃ±o`, and `â€“` across multiple pages.
  - Affected files include Home, Planner-related copy, Map, Catalog, Pepper Detail, Compare, and layout/footer text.
- Why it matters:
  - Broken characters make the prototype look unfinished and can hurt trust.
  - This is especially visible in a classroom presentation or usability test.
- Suggested fix later:
  - Replace mojibake with plain ASCII equivalents where possible.
  - Use proper UTF-8 only where needed, such as `Jalapeño`, after confirming file encoding.
  - Add a quick `rg "Â|â"` check to the final QA routine.

## Build Priority Review

### QA-038: Build priority is broadly followed, but final QA/polish remains the active phase

- Status: `DONE`
- Severity: `PASS-NOTE`
- Source requirement: `docs/project-context.md` -> `Build Priority`
- Evidence:
  - Design system foundations, app skeleton, core E2E flow, map flow, pepper flow, My Visit, and Finish all exist.
  - The backlog now contains consistency, state, copy, interaction, and visual polish issues.
- Why it matters:
  - The project has moved past skeleton-building.
  - The next work should be deliberate QA-driven improvement, not more feature sprawl.
- Suggested fix later:
  - Fix high-impact route and AI trust issues first.
  - Then fix visual consistency and responsive polish.
  - Use `docs/agents/prigan-qa-agent.md` before and after each major fix batch.

### QA-039: Figma fidelity should be improved through shared patterns, not isolated screen rewrites

- Status: `DONE`
- Severity: `WARN`
- Source requirement: `docs/project-context.md` -> `Build Priority`; Figma screen references
- Evidence:
  - Earlier screen-by-screen work improved individual screens, but quality still varies.
  - The map is now centralized through `UnifiedFarmMap`, which is a good model for other shared patterns.
  - Other areas still have repeated page-specific panels, chips, action rows, and status copy.
- Why it matters:
  - Isolated rewrites can make one page better while making the whole app less consistent.
  - A prototype for HCI testing needs a stable mental model across screens.
- Suggested fix later:
  - Create or tighten shared components for:
    - route page header
    - route action bar
    - AI explanation panel
    - preference summary
    - stop progress
    - pepper action footer
  - Then update screens to use those components gradually.
  - Keep changes guided by Figma, but prioritize interaction clarity over pixel-perfect decoration.
