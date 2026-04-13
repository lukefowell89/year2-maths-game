# Claude Project Instructions

You are building a React frontend-only maths matching game for children.

## Product summary
Create a colourful, child-friendly maths game where the player matches a maths prompt on the left side of the board with the correct answer on the right side.

Examples:
- 12 ÷ 2 → 6
- 18 ÷ 3 → 6
- 2 x 12 → 24
- 3 x 7 → 21
- 10 x 4 → 40

This is a static frontend app only.
There is no backend.
It should be suitable for deployment to Amazon S3 static hosting, Azure Storage Static Website, or similar static hosting.

## Core game flow
1. Start New Game
2. Choose Multiplication or Division
3. Choose difficulty:
   - Easy
   - Not So Easy
   - Pretty Tricky
   - Really Hard
4. Choose Solo or 2 Player
5. Show a 3,2,1 countdown
6. Render the board with left-side prompt cards and right-side answer cards
7. Player must always pick a left-side card first
8. Then player picks a right-side answer card
9. If correct:
   - play success animation
   - move cards to completed pile
   - update score
10. If incorrect:
   - play failure animation
   - flip cards back
11. At the end:
   - show completion modal
   - in solo: show time and guesses
   - in 2-player: show Player A vs Player B and crown the winner

## Functional requirements
- React app only
- No backend
- Responsive layout
- Touch-friendly and mouse-friendly
- Child-friendly design
- Smooth flip animations
- Clear success and failure feedback
- Score tracking
- Timer in solo mode
- Two-player local pass-and-play mode
- Static build output

## Maths content
Support:
### Division
- divide by 2 up to 20 ÷ 2
- divide by 3 up to 30 ÷ 3
- divide by 10 up to 500 ÷ 10

### Multiplication
- 2 times table up to 2 x 12
- 3 times table up to 3 x 12
- 10 times table up to 10 x 10

## Difficulty
Suggested pair counts:
- Easy: 4 pairs
- Not So Easy: 6 pairs
- Pretty Tricky: 8 pairs
- Really Hard: 10 pairs

## UX expectations
- Bright, simple, colourful
- Clear labels
- Large tap targets
- Friendly text
- Easy for children aged roughly 6–10
- Not visually cluttered

## Technical preferences
Preferred:
- React
- Vite
- TypeScript
- Simple maintainable structure
- Local state or reducer
- Lightweight dependencies only

## Working rules
- Keep implementation simple
- Prioritise clarity and maintainability over complexity
- Avoid unnecessary abstractions
- Make game state robust against rapid clicking
- Prevent interaction during animation resolution
- Ensure board generation is always valid
- Do not allow ambiguous duplicate answers in a single round

## Cost-optimised model routing
Use the cheapest model that is likely to do the job well.

### Default model choices
- `claude-haiku-4-5`:
  - fast planning passes
  - UX notes
  - QA test matrix
  - deployment notes
  - summarising outputs from other agents
- `claude-sonnet-4-6`:
  - app architecture
  - reducer/state design
  - component design
  - code generation
  - refactoring
  - code review
- `claude-opus-4-6`:
  - use only as an escalation path
  - architecture disputes
  - tricky state bugs
  - difficult tradeoff decisions
  - only when Sonnet is getting stuck repeatedly

### Spend discipline
- Start with Haiku for planning-oriented specialist agents.
- Use Sonnet for architecture and implementation.
- Escalate to Opus only for narrow, high-value reasoning tasks.
- Do not use Opus for routine file creation, boilerplate, or simple summaries.

## Startup protocol
When asked to begin, follow this exact sequence.

### Step 1: Confirm the execution plan
State that you will:
- use the PRD in this repo as the source of truth
- start with lightweight planning agents
- consolidate outputs
- then implement in React/Vite/TypeScript
- keep the app static-hosting friendly

### Step 2: Trigger the first two handoffs
Run these first:

1. `ux-game-designer`
   - model: `claude-haiku-4-5`
   - goal: produce UX flow, child-friendly copy, and interaction guidance

2. `frontend-architect`
   - model: `claude-sonnet-4-6`
   - goal: define the app structure, component tree, reducer/state approach, and dependencies

### Step 3: Trigger the next two handoffs after those return
Then run:

3. `gameplay-state-designer`
   - model: `claude-sonnet-4-6`
   - depends on: frontend architecture draft
   - goal: lock state machine, events, turn logic, animation locks, and match validation

4. `qa-test-designer`
   - model: `claude-haiku-4-5`
   - depends on: UX and gameplay logic drafts
   - goal: create acceptance and edge-case test coverage

### Step 4: Consolidate before writing code
Before implementation, produce:
- one final component tree
- one final state shape
- one final event/action list
- one dependency list
- one implementation order

### Step 5: Build
Then use:
- `visual-ui-builder`
- model: `claude-sonnet-4-6`

This agent should implement the actual app using the consolidated architecture and state model.

### Step 6: Final verification and deployment
After implementation:
- run `qa-test-designer` again with `claude-haiku-4-5`
- run `static-deployment-helper` with `claude-haiku-4-5`
- only escalate to `claude-opus-4-6` if there is a persistent design or logic issue Sonnet cannot resolve cleanly

## Handoff format
Every agent response should use this structure:
1. Assumptions
2. Decisions made
3. Open risks
4. Recommendations
5. Artefacts produced
6. Dependencies or next handoff

## Expected output style
When asked to build:
- be concrete
- produce usable code
- keep naming consistent
- explain tradeoffs briefly when needed
- avoid unnecessary verbosity
