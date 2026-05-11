# Prigan Guide Evaluation Plan

This document is the working moderated usability-test script for the HCI prototype.

## Goal

Evaluate whether an explainable AI-assisted farm route helps visitors understand where to go, why the route was suggested, and how to stay in control.

## Conditions

- AI-assisted route: use `/recommended`.
- Static baseline route: use `/recommended?mode=static`.
- Fresh participant start: open `/?resetVisit=1`.
- Prototype analytics: PostHog may be enabled only for classroom demo activity. Disable it for final submission unless the demo explicitly needs it.

## Participants

- 6 to 8 participants.
- Include Elena-like visitors: family, short visit, mild tasting, low reading preference.
- Include Arkady-like visitors: deeper learning, pepper comparison, longer exploration.

## Metrics

- Task success: completed, completed with help, failed.
- Time on task.
- Errors and backtracking.
- Clarity rating after each task: 1 to 5.
- Trust/control rating after AI-related tasks: 1 to 5.
- Notes on hesitation, wrong clicks, missed controls, and verbal confusion.

## Task Script

### Task 1: Start The Visit

Prompt: "You just scanned the farm QR code. Start a short visit without registering."

Expected behavior:
- User starts from Home.
- User understands no account/download is required.
- User reaches Planner.

Success criteria:
- Reaches Planner without asking about sign-up.
- Can say roughly what the guide helps with.

### Task 2: Set Preferences

Prompt: "Plan a family-friendly visit with mild tasting and easy walking."

Expected behavior:
- User selects duration, family/beginner mode, mild spice, and easy walking.
- User sees a short explanation of how the recommendation works.

Success criteria:
- Preferences are visibly selected.
- User can generate a route.

### Task 3: Understand The Route

Prompt: "Look at the suggested route and explain why it was recommended."

Expected behavior:
- User sees route duration, stop count, route sequence, and AI explanation.
- User can open the full explanation if needed.

Success criteria:
- User identifies at least two recommendation reasons.
- User notices that the route is optional and editable.

### Task 4: Follow And Change The Route

Prompt: "Continue the route, then skip one stop or shorten the route."

Expected behavior:
- User can continue to the next stop.
- User can skip or shorten without losing route context.

Success criteria:
- Current stop/progress updates correctly.
- User can still open the map.

### Task 5: Use The Map

Prompt: "Open the map and find where you are and where to go next."

Expected behavior:
- User sees current stop, next stop, route line, landmarks, and restricted area.
- User can use list/manual fallback if map is not convenient.

Success criteria:
- User identifies current and next stop.
- User avoids restricted/staff-only area.

### Task 6: Learn About Peppers

Prompt: "Find a pepper you might taste, save it, and compare it with another pepper."

Expected behavior:
- User opens Catalog, Pepper Detail, and Compare.
- User sees heat scale, caution, tasting availability, and save/compare controls.

Success criteria:
- Saves a pepper.
- Opens Compare with up to 3 peppers.
- Can identify which pepper is safer for beginners.

### Task 7: Resume Or Finish

Prompt: "Go to My Visit and decide what to do next."

Expected behavior:
- User sees progress, saved peppers, next route action, and finish option.

Success criteria:
- User can continue route, open details/map, or finish visit.

## Observation Notes Template

- Participant:
- Persona match:
- Condition: AI-assisted / static baseline
- Task:
- Success:
- Time:
- Errors/backtracking:
- Clarity rating:
- Trust/control rating:
- Notes:

## Pilot Checklist

- Build passes.
- Fresh start opens with `?resetVisit=1`.
- Home, Planner, Recommended, Live Route, Stop Detail, Map, Catalog, Pepper Detail, Compare, My Visit, Finish all open.
- No broken images.
- Route stays 5 stops.
- Current and next stop remain consistent.
- Saved peppers appear in My Visit.
- Compare supports up to 3 peppers.
- AI explanations are short and visible.
- Manual/skip/shorten controls are available.
