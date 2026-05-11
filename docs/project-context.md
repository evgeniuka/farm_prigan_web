# Prigan Guide Project Context

Prigan Guide is an HCI / Intelligent Interfaces course prototype for visitors at the Prigan pepper farm in Israel.

The product is a responsive browser-based visitor guide, not a native mobile app and not a generic farm website. The current Figma mockups are the visual source of truth. The prototype should preserve the warm farm-inspired UI system: cream backgrounds, terracotta CTAs, green route indicators, compact cards, chips, badges, soft borders, readable route panels, a schematic farm map, and explainable AI recommendation panels.

## 1. Project Overview

- Prigan Guide is a responsive web interface for farm visitors.
- It helps users start the visit quickly.
- It gives a clear route through the farm.
- It helps users learn about pepper types.
- It supports tasting, comparison, and saving favorites.
- It uses AI to suggest a route.
- The user can still change the route at any time.

## 2. Why Web

- Visitors can open it fast with a QR code.
- No download is needed.
- No app store is needed.
- No long setup is needed.
- A farm visit is short and occasional.
- People do not want to install an app for one visit.
- A web prototype is realistic for this course.
- It is enough to show HCI, AI, and usability logic.

## 3. Problem Space

- Visitors may not know where to start.
- Visitors may not know what to do first.
- Visitors may miss important places.
- Visitors may not understand the difference between peppers.
- There may be too much information at once.
- People walk, read, talk, and choose at the same time.
- This creates cognitive load.
- If AI gives a route without explanation, trust can break.
- Users also need to skip or change the route during the visit.

## 4. Users

Persona A: Elena, 34, family visitor.

- She wants a short, easy, low-stress visit.
- She does not want too much reading.
- She prefers mild tasting options.

Persona B: Arkady, 52, enthusiast visitor.

- He wants deeper learning and pepper comparison.
- He is ready for a longer visit.

Shared needs:

- Both users need a clear route.
- Both users need simple next steps.
- Both users need to understand why the route was suggested.

## 5. Research Logic

- We want to test if explainable AI route planning helps visitors.
- We compare it with a simpler static route.
- Research question: does AI route support improve clarity and task success?
- Hypothesis: users will do better if they see route reasons and can edit the route.
- We want to measure usability.
- We want to measure trust.
- We want to measure clarity.
- We want to measure task success and errors.

## 6. Product Structure

- Main navigation: Home, Plan Visit, Route, Catalog, My Visit.
- Home helps users start the visit.
- Planner collects simple preferences.
- Route shows the suggested path.
- Catalog helps users explore peppers.
- My Visit stores progress and saved items.
- Support pages include Help, Accessibility, and How AI Works.
- The route is the main part of the experience.
- Other pages support the route with learning and control.

## 7. Core Screens

Primary flow screens:

1. Home / Start Visit
2. Visit Planner
3. Recommended Route
4. Live Route
5. Stop Detail

These screens show the full main flow. They cover entry, planning, route use, and on-site interaction.

Supporting screens can include:

- Farm Map
- Pepper Catalog
- Pepper Detail
- Compare Peppers
- My Visit
- Help / Accessibility
- How AI Works
- Finish Visit

Build priority: build the main route flow first, then add supporting screens.

## 8. AI, Trust, and Ethics

The AI is a narrow route recommendation assistant, not a chatbot.

- AI should suggest a route.
- AI should explain why this route was chosen.
- AI should adapt the route if the user changes plans.
- AI should offer alternatives.
- AI should not control the whole experience.
- AI should not hide its logic.
- The user must be able to skip, shorten, edit, or switch to manual mode.
- The system should not collect too much data.
- Personalization should help the user, not manipulate the user.
- The goal is clear, safe, human-controlled AI.

Required user controls:

- Accept the route.
- Edit preferences.
- Open the full map.
- Choose manually.
- Skip or swap stops.
- View stop details.
- Save peppers.
- Compare peppers.
- Finish the visit.

## 9. Evaluation Plan

- We will run a small moderated usability test.
- We plan 6 to 8 participants.
- Some participants will be closer to Elena.
- Some participants will be closer to Arkady.
- Users will do real tasks in the prototype.

Example tasks:

- Start visit.
- Build route.
- Explain route.
- Skip stop.
- Compare peppers.

Metrics:

- Task success.
- Time on task.
- Errors and backtracking.
- Clarity.
- Usability.
- Trust.

## Primary Route

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

## Implementation Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- React Router
- lucide-react
- Mock data only, stored in memory/localStorage

## Build Priority

1. Code-level design system from the Figma visual language.
2. App skeleton and routes.
3. Core route E2E flow.
4. Farm map flow.
5. Pepper catalog/detail/compare flow.
6. My Visit and finish flow.
7. QA and responsive polish.
