# Prigan Guide Project Context

Prigan Guide is an HCI / Intelligent Interfaces course prototype for visitors at the Prigan pepper farm in Israel.

The product is a responsive browser-based visitor guide, not a native mobile app and not a generic farm website. The current Figma mockups are the visual source of truth. The prototype should preserve the warm farm-inspired UI system: cream backgrounds, terracotta CTAs, green route indicators, compact cards, chips, badges, soft borders, readable route panels, a schematic farm map, and explainable AI recommendation panels.

The AI is a narrow route recommendation assistant, not a chatbot. It suggests a route based on simple visit preferences while keeping user control visible. The user must be able to accept the route, edit preferences, open the full map, choose manually, skip or swap stops, view stop details, save peppers, compare peppers, and finish the visit.

Primary route:

1. Visitor Center
2. Greenhouse Entry / orientation
3. Greenhouse Route
4. Tasting GH 1-2
5. Product Shop

Recommended settings:

- Duration: 40-45 min
- Visitor mode: Family / Beginner-friendly
- Spice preference: Mild
- Walking preference: Easy walking
- Safety logic: avoid staff-only or restricted areas

Implementation stack:

- Vite
- React
- TypeScript
- Tailwind CSS
- React Router
- lucide-react
- Mock data only, stored in memory/localStorage

Build priority:

1. Code-level design system from the Figma visual language
2. App skeleton and routes
3. Core route E2E flow
4. Farm map flow
5. Pepper catalog/detail/compare flow
6. My Visit and finish flow
7. QA and responsive polish
