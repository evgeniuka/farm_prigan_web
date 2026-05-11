# Prigan Guide User Stories

Use this file as the stable source of truth for usability-test stories and acceptance criteria.

These stories describe what the prototype must support for visitors during a short farm visit. They should be read together with:

- `docs/project-context.md`
- `docs/implementation-plan.md`
- `docs/figma-audit.md`
- `docs/agents/prigan-qa-agent.md`

## Story Format

Each user story should be checked by the QA agent as:

- Story:
- Primary persona:
- Goal:
- Expected behavior:
- Acceptance criteria:
- Risk if missing:

## Personas

- Elena: family visitor, wants a short, simple, low-stress visit, prefers mild tasting and low reading load.
- Arkady: enthusiast visitor, wants deeper learning, pepper comparison, and more exploration.
- General visitor: any visitor using the web prototype during an on-site farm visit.

## Onboarding and Start

### US-01: Start Visit Without Registration

- Story: As a visitor, I want to start the visit without registration.
- Primary persona: General visitor
- Goal: Begin quickly from a QR code or browser link.
- Expected behavior: The app opens directly to the visit start flow without sign up, login, account creation, or personal data collection.
- Acceptance criteria: A visitor can reach the planner from Home in one primary action; no account screen blocks the flow.
- Risk if missing: The prototype feels unrealistic for a short farm visit and adds unnecessary friction.

### US-02: Choose Language at the Beginning

- Story: As a visitor, I want to choose my language at the beginning.
- Primary persona: General visitor
- Goal: Understand the visit flow in a comfortable language.
- Expected behavior: Language control is visible early, preferably in the header or start screen.
- Acceptance criteria: The language option is discoverable from Home and remains available during the flow.
- Risk if missing: Visitors may not understand route instructions or safety messages.

### US-03: Understand Route Duration Quickly

- Story: As a visitor, I want to quickly understand how long the route will take.
- Primary persona: Elena
- Goal: Decide if the route fits the available time.
- Expected behavior: Duration appears on Home, Recommended Route, Live Route, and My Visit.
- Acceptance criteria: Route duration is visible before accepting the route and during the active route.
- Risk if missing: Visitors may not trust the route or may abandon it mid-visit.

## Planner and Preferences

### US-04: Select Interests Quickly

- Story: As a visitor, I want to select my interests in just a few taps.
- Primary persona: Elena
- Goal: Personalize the route without long forms.
- Expected behavior: Interests are presented as compact chips/cards.
- Acceptance criteria: The planner can be completed without typing; selected interests are visibly active.
- Risk if missing: Planning feels slow and high-effort.

### US-05: Set Comfortable Spice Level

- Story: As a visitor, I want to set my comfortable spice level.
- Primary persona: General visitor
- Goal: Avoid tasting options that feel too spicy or unsafe.
- Expected behavior: Spice preference is clear, simple, and reflected in the recommendation.
- Acceptance criteria: Mild preference leads to beginner-friendly/mild route language and tasting suggestions.
- Risk if missing: The AI recommendation may feel careless or unsafe.

### US-06: Choose Visit Mode

- Story: As a visitor, I want to choose the visit mode: family, quick tour, or exploration.
- Primary persona: Elena and Arkady
- Goal: Shape the route around the visitor's context.
- Expected behavior: Visit modes are easy to compare and select.
- Acceptance criteria: The selected mode is visible in the planner and influences route explanation.
- Risk if missing: Different visitor needs collapse into one generic route.

### US-07: Specify Mobility Limitations

- Story: As a visitor, I want to specify any mobility limitations.
- Primary persona: General visitor
- Goal: Avoid difficult walking and inaccessible paths.
- Expected behavior: Planner includes walking/accessibility options.
- Acceptance criteria: The recommendation mentions short walking or accessibility when relevant.
- Risk if missing: The route may not feel safe or inclusive.

## Route Recommendation

### US-08: Get a Route, Not Just a List of Stops

- Story: As a visitor, I want to get a route, not just a list of stops.
- Primary persona: General visitor
- Goal: Know the sequence and where to go next.
- Expected behavior: The recommendation shows ordered stops, route line, duration, and next action.
- Acceptance criteria: Recommended Route clearly shows start, sequence, current/next stop, and CTA to accept.
- Risk if missing: The prototype becomes an information list instead of a guide.

### US-09: See Why the Route Was Recommended

- Story: As a visitor, I want to see why this route was recommended to me.
- Primary persona: General visitor
- Goal: Trust the AI recommendation.
- Expected behavior: A short explanation connects preferences to route logic.
- Acceptance criteria: The recommendation explains duration, spice level, mode, walking constraints, and safe visitor areas.
- Risk if missing: AI feels magical, opaque, or controlling.

### US-10: Understand Where to Go First

- Story: As a visitor, I want to understand where to go first.
- Primary persona: Elena
- Goal: Start moving without confusion.
- Expected behavior: The first stop and next action are obvious.
- Acceptance criteria: Live Route and map identify the current/first stop and the next direction.
- Risk if missing: Visitors hesitate or backtrack at the start.

### US-11: See Alternative Route

- Story: As a visitor, I want to see an alternative route.
- Primary persona: Arkady
- Goal: Compare the recommended route with another reasonable option.
- Expected behavior: Alternative route is available without overwhelming the main recommendation.
- Acceptance criteria: The user can find at least one alternate or manual route option from Recommended Route or Map.
- Risk if missing: AI feels like the only path and reduces user control.

## Live Route and Progress

### US-12: See Landmarks and Spatial Cues

- Story: As a visitor, I want to see landmarks and spatial cues.
- Primary persona: General visitor
- Goal: Orient myself inside the farm.
- Expected behavior: Map and route screens show visitor center, greenhouses, tasting points, product shop, parking, entrance/exit, and restricted areas.
- Acceptance criteria: Spatial cues are readable and do not overlap.
- Risk if missing: Visitors cannot translate the interface into physical movement.

### US-13: Understand Route Progress

- Story: As a visitor, I want to understand my route progress.
- Primary persona: General visitor
- Goal: Know what has been completed and what remains.
- Expected behavior: Progress indicator shows current stop and total stops.
- Acceptance criteria: Route progress stays consistent across Recommended Route, Live Route, Stop Detail, Map, and My Visit.
- Risk if missing: Context is lost between screens.

### US-14: Know I Am Moving in the Right Direction

- Story: As a visitor, I want to know that I am moving in the right direction.
- Primary persona: General visitor
- Goal: Feel confident while walking.
- Expected behavior: The app highlights current stop, next stop, and route line.
- Acceptance criteria: The map identifies "you are here" and the next route step.
- Risk if missing: The route feels static and unhelpful on-site.

### US-15: Return to Route After Pause

- Story: As a visitor, I want to return to my route after a pause.
- Primary persona: General visitor
- Goal: Resume without rebuilding the route.
- Expected behavior: My Visit and navigation preserve accepted route and active stop state.
- Acceptance criteria: Leaving to Catalog, Map, or My Visit does not reset active route progress.
- Risk if missing: Session context feels unreliable.

## Map and Manual Navigation

### US-16: Open Map at Any Time

- Story: As a visitor, I want to open the map at any time.
- Primary persona: General visitor
- Goal: Check location without losing task context.
- Expected behavior: Map access appears in main navigation and route-related screens.
- Acceptance criteria: Opening and closing the map preserves the current screen/route context.
- Risk if missing: Visitors lose orientation when they need it most.

### US-17: Open a List of Stops Instead of Map

- Story: As a visitor, I want to open a list of stops if the map is not convenient for me.
- Primary persona: General visitor
- Goal: Use an alternative representation when map reading is hard.
- Expected behavior: Map view offers a stop list or route list mode.
- Acceptance criteria: The user can understand route order without relying only on the schematic map.
- Risk if missing: Map-only interaction may fail for some users.

### US-18: Skip One Stop

- Story: As a visitor, I want to skip one stop.
- Primary persona: Elena
- Goal: Stay in control when a stop is not relevant or convenient.
- Expected behavior: Skip action advances to the next appropriate stop.
- Acceptance criteria: Skip updates active stop, progress, map marker, and My Visit state.
- Risk if missing: AI route feels rigid.

### US-19: Replan While Moving

- Story: As a visitor, I want to replan the route while I am on the move.
- Primary persona: General visitor
- Goal: Adapt to changing time, interest, or fatigue.
- Expected behavior: Edit/replan controls are available from active route screens.
- Acceptance criteria: Replanning does not erase saved peppers or visited stops.
- Risk if missing: The prototype does not support real on-site behavior.

### US-20: Shorten the Route

- Story: As a visitor, I want to shorten the route if I get tired or run out of time.
- Primary persona: Elena
- Goal: Finish gracefully with less effort.
- Expected behavior: Shorten route option creates a smaller route or jumps toward final stop.
- Acceptance criteria: The user can choose a shorter option without losing route context.
- Risk if missing: Visitors may abandon the guide instead of adjusting it.

### US-21: Manual Mode Without AI

- Story: As a visitor, I want to have a manual mode without AI.
- Primary persona: General visitor
- Goal: Choose stops independently.
- Expected behavior: Manual mode is available from planner, recommendation, or map.
- Acceptance criteria: The user can select stops without accepting the AI recommendation.
- Risk if missing: The app violates user control and freedom.

### US-22: Fallback if AI or Geolocation Does Not Work

- Story: As a visitor, I want a fallback option if the AI or geolocation does not work.
- Primary persona: General visitor
- Goal: Continue the visit even if smart features fail.
- Expected behavior: Static/manual route and map remain usable.
- Acceptance criteria: The prototype has a visible fallback/manual path and does not depend on real geolocation.
- Risk if missing: The guide feels fragile and unrealistic for usability testing.

## Stop Detail and Learning

### US-23: Understand What to Do at a Stop

- Story: As a visitor, I want to open a stop card and immediately understand what to do there.
- Primary persona: Elena
- Goal: Reduce reading and hesitation.
- Expected behavior: Stop Detail has one clear primary action and short "what to see" / "what to do" content.
- Acceptance criteria: The current stop page identifies stop number, purpose, action, safety note, and next stop.
- Risk if missing: Stop screens become informational but not actionable.

### US-24: Read Simple Explanations

- Story: As a visitor, I want to read explanations in simple language.
- Primary persona: Elena
- Goal: Learn without cognitive overload.
- Expected behavior: Text is short, scannable, and not academic.
- Acceptance criteria: AI and pepper explanations use plain language and avoid long paragraphs.
- Risk if missing: Visitors may skip important information.

### US-25: Expand Details Only When I Choose To

- Story: As a visitor, I want to expand details only when I choose to.
- Primary persona: Elena and Arkady
- Goal: Balance quick use with deeper learning.
- Expected behavior: Detail-heavy information is optional or placed behind clear controls.
- Acceptance criteria: The main path remains concise, while deeper details are available for interested users.
- Risk if missing: Elena faces too much reading or Arkady lacks depth.

## Peppers, Catalog, Save, and Compare

### US-26: See Pepper Photo and Short Description

- Story: As a visitor, I want to see a photo and a short description of the pepper variety.
- Primary persona: General visitor
- Goal: Recognize and learn about peppers visually.
- Expected behavior: Pepper cards and details include images and concise descriptions.
- Acceptance criteria: No broken image placeholders appear in catalog, detail, compare, or saved views.
- Risk if missing: Pepper learning feels abstract and unfinished.

### US-27: See a Clear Spice Scale

- Story: As a visitor, I want to see a clear spice scale.
- Primary persona: General visitor
- Goal: Understand heat level before tasting.
- Expected behavior: Spice level appears consistently on pepper cards, detail, and compare.
- Acceptance criteria: Heat indicators are readable and match textual spice labels.
- Risk if missing: Visitors may misjudge tasting comfort.

### US-28: Compare Two Pepper Varieties

- Story: As a visitor, I want to compare two pepper varieties.
- Primary persona: Arkady
- Goal: Understand differences between peppers.
- Expected behavior: Compare page shows side-by-side attributes.
- Acceptance criteria: User can compare at least two peppers and understand heat, origin, flavor, caution, and where to find them.
- Risk if missing: Enthusiast learning path is weak.

### US-29: Save Pepper Varieties I Like

- Story: As a visitor, I want to save the pepper varieties I like.
- Primary persona: General visitor
- Goal: Remember favorites during or after the visit.
- Expected behavior: Save action is available on pepper cards and detail views.
- Acceptance criteria: Saved peppers appear in My Visit and persist during the session.
- Risk if missing: The app loses a key personalization feature.

### US-30: See What I Have Already Tried

- Story: As a visitor, I want to see what I have already tried.
- Primary persona: General visitor
- Goal: Track tasting progress.
- Expected behavior: My Visit or stop-related screens show visited/tried items.
- Acceptance criteria: Visited stops or tried peppers are visibly distinguished from remaining items.
- Risk if missing: The visit state feels incomplete.

### US-31: Understand What Is Suitable for Beginners

- Story: As a visitor, I want to understand what is suitable for beginners.
- Primary persona: Elena
- Goal: Avoid overwhelming or too-spicy options.
- Expected behavior: Beginner-friendly tags appear on routes, stops, and peppers where relevant.
- Acceptance criteria: Mild/beginner suitability is visible in recommendation and pepper flows.
- Risk if missing: The prototype does not support low-stress family visits.

## AI Control, Trust, and Ethics

### US-32: Change Parameters Behind AI Recommendation

- Story: As a visitor, I want to change the parameters behind the AI recommendations.
- Primary persona: General visitor
- Goal: Understand and control personalization.
- Expected behavior: Edit Preferences returns to the planner or a compact preference editor.
- Acceptance criteria: Changing preferences visibly affects route explanation or recommendation state.
- Risk if missing: AI feels opaque and non-adjustable.

### US-33: Understand AI Works and Its Limitations

- Story: As a visitor, I want to understand how the AI works and what its limitations are.
- Primary persona: General visitor
- Goal: Build calibrated trust.
- Expected behavior: How AI Works page or panel explains that AI uses preferences and does not replace safety guidance.
- Acceptance criteria: The explanation is short, clear, and reachable from Home or route screens.
- Risk if missing: Users may overtrust or distrust the recommendation.

## Accessibility and Readability

### US-34: Large Buttons and Good Contrast

- Story: As a visitor, I want large buttons and good contrast.
- Primary persona: General visitor
- Goal: Use the interface while walking, outdoors, or with distractions.
- Expected behavior: Buttons are touch-friendly and text contrast is readable.
- Acceptance criteria: Primary actions are visually obvious, keyboard-accessible, and do not rely on tiny controls.
- Risk if missing: The prototype may fail basic usability testing.

## QA Traceability Notes

The QA agent should use these stories to check:

- Whether each story is supported by a real page, route, state, or control.
- Whether the story is testable during a moderated usability session.
- Whether missing support should be reported as `WARN` or `FAIL`.
- Whether app changes preserve the main route context and do not break saved peppers, compare state, map state, or active stop progress.
