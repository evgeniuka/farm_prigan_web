# Implementation Plan

## Phase 1 - Setup

- Create Vite React TypeScript app.
- Add Tailwind CSS, React Router, and lucide-react.
- Add project context and Figma audit docs.

## Phase 2 - Code Design System

- Define app-level visual tokens in CSS variables.
- Build reusable UI components: buttons, pills, cards, page shell, route progress, pepper cards, AI explanation panels, and schematic map components.
- Keep the look close to the Figma mockups without requiring Figma instances.

## Phase 3 - App Skeleton

- Add routes for all current Figma screens.
- Add a persistent header and navigation.
- Add mock data files for stops, route, peppers, and visit state.
- Add localStorage-backed visit state.

## Phase 4 - Core E2E Flow

- Implement Home -> Planner -> Recommended Route -> Live Route.
- Support Accept Route, Edit Preferences, Open Map, Open Stop Details, Choose Manually, Skip Stop, Mark Visited, and Continue.
- Keep route progress consistent with Stop 3 of 5.

## Phase 5 - Map And Peppers

- Build a readable schematic farm map with visitor, current, next, route, and restricted markers.
- Implement Pepper Catalog, Pepper Detail, Compare Peppers, saved peppers, and My Visit connections.

## Phase 6 - QA

- Run build/typecheck.
- Check major navigation paths.
- Check no broken image placeholders.
- Check compare max 3 peppers, saved peppers persistence, map readability, and clear primary CTAs.
