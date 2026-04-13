# Gameplay State Designer — Maths Match

## 1. Assumptions

- The app uses a single top-level reducer (`gameReducer`) with a `useReducer` hook, wrapped in a `GameProvider` context. All game state lives here.
- Animations are owned by the UI layer (CSS classes/transitions). The reducer does not manage animation timers directly. Instead, the reducer sets a flag (`isLocked: true`) and the UI schedules a `RESOLVE_COMPLETE` dispatch after the animation duration via `setTimeout`.
- "Animation lock" means the reducer ignores all card-click actions while `isLocked === true`. This is enforced inside the reducer, not just in the UI, so double-dispatch is harmless.
- The countdown is UI-driven (3→2→1→Go!) using a local `useEffect` timer. Only `START_PLAYING` is dispatched to the reducer when the countdown finishes.
- The solo timer is managed by a `useTimer` hook that reads `phase === 'playing'` to start/stop. The reducer stores `elapsedMs` only at game-end, not continuously, to avoid unnecessary re-renders.
- Board generation always guarantees unique answer values across the selected pair set. If the raw pool contains collisions, pairs are filtered before sampling.
- "Guess" in solo mode = one complete left+right attempt (regardless of outcome), incremented at validation time.
- Player names are fixed as "Player A" and "Player B". No custom name input required for v1.
- `RESTART_SAME_SETTINGS` replays with the same mode/difficulty/playerMode but generates a fresh board. `GO_TO_SETUP` returns to the idle/setup phase and clears all game state.
- Left-side card re-selection (clicking a different left card while one is already selected but before a right card is chosen) is permitted: the new left card becomes the selection and the previous one returns to face-down.

---

## 2. State Machine Overview

### Top-level phases

```
idle → setup → countdown → playing → complete
                                ↑         |
                                └─────────┘  (RESTART_SAME_SETTINGS loops back to countdown)
                    ↑
                    └── GO_TO_SETUP from complete returns here
```

### Playing sub-states (tracked via `turnPhase` field)

```
waitingForLeft
      │  SELECT_LEFT
      ▼
leftSelected
      │  SELECT_RIGHT
      ▼
validating          ← reducer evaluates match synchronously
      │
      ├─ correct ──→ resolving_success
      │                    │ RESOLVE_COMPLETE (dispatched after animation timeout)
      │                    ├─ pairs remaining → waitingForLeft (same player, 2p keeps turn)
      │                    └─ no pairs remaining → (phase = complete)
      │
      └─ incorrect ─→ resolving_failure
                           │ RESOLVE_COMPLETE (dispatched after animation timeout)
                           └─ waitingForLeft (solo: same player / 2p: switch turn)
```

### Phase field values

```
'idle' | 'setup' | 'countdown' | 'playing' | 'complete'
```

### TurnPhase field values (only meaningful when phase === 'playing')

```
'waitingForLeft' | 'leftSelected' | 'resolving_success' | 'resolving_failure'
```

---

## 3. Full TypeScript State Shape

```typescript
// --- Enums / union types ---

type GamePhase = 'idle' | 'setup' | 'countdown' | 'playing' | 'complete';

type TurnPhase =
  | 'waitingForLeft'
  | 'leftSelected'
  | 'resolving_success'
  | 'resolving_failure';

type MathsMode = 'multiplication' | 'division';

type Difficulty = 'easy' | 'notSoEasy' | 'prettyTricky' | 'reallyHard';

type PlayerMode = 'solo' | 'twoPlayer';

type ActivePlayer = 'A' | 'B';

// --- Data types ---

interface MathsPair {
  id: string;          // e.g. 'mul-2-7', 'div-3-18'
  mode: MathsMode;
  prompt: string;      // e.g. '3 x 7', '18 ÷ 3'
  answer: number;      // numeric value, e.g. 21, 6
}

type CardStatus = 'faceDown' | 'faceUp' | 'matched' | 'incorrect';

interface LeftCard {
  pairId: string;      // references MathsPair.id
  prompt: string;
  status: CardStatus;
}

interface RightCard {
  pairId: string;      // references MathsPair.id
  answer: number;
  status: CardStatus;
}

// --- Setup config (populated during setup phase) ---

interface GameConfig {
  mode: MathsMode;
  difficulty: Difficulty;
  playerMode: PlayerMode;
  pairCount: number;   // derived from difficulty: 4 | 6 | 8 | 10
}

// --- Scoring ---

interface SoloStats {
  guesses: number;
  matches: number;
  elapsedMs: number;   // 0 during play; set on game complete
}

interface TwoPlayerStats {
  scoreA: number;
  scoreB: number;
  activePlayer: ActivePlayer;
}

// --- Board ---

interface BoardState {
  leftCards: LeftCard[];
  rightCards: RightCard[];
  matchedPairIds: string[];       // pairIds of successfully matched pairs
  selectedLeftPairId: string | null;
  selectedRightPairId: string | null;
}

// --- Root state ---

interface GameState {
  phase: GamePhase;
  turnPhase: TurnPhase;
  isLocked: boolean;              // true while animations are resolving
  config: GameConfig | null;      // null in idle phase
  board: BoardState | null;       // null until countdown completes
  soloStats: SoloStats;
  twoPlayerStats: TwoPlayerStats;
  lastMatchResult: 'correct' | 'incorrect' | null;  // drives UI animation class
}

// --- Initial state ---

const INITIAL_SOLO_STATS: SoloStats = { guesses: 0, matches: 0, elapsedMs: 0 };

const INITIAL_TWO_PLAYER_STATS: TwoPlayerStats = {
  scoreA: 0,
  scoreB: 0,
  activePlayer: 'A',
};

const INITIAL_BOARD: BoardState = {
  leftCards: [],
  rightCards: [],
  matchedPairIds: [],
  selectedLeftPairId: null,
  selectedRightPairId: null,
};

export const INITIAL_STATE: GameState = {
  phase: 'idle',
  turnPhase: 'waitingForLeft',
  isLocked: false,
  config: null,
  board: null,
  soloStats: INITIAL_SOLO_STATS,
  twoPlayerStats: INITIAL_TWO_PLAYER_STATS,
  lastMatchResult: null,
};
```

---

## 4. Events / Actions (Discriminated Union)

```typescript
type GameAction =
  // --- Navigation ---
  | { type: 'START_SETUP' }
  // User has finished filling in setup choices and presses Start Game
  | {
      type: 'CONFIRM_SETUP';
      payload: {
        mode: MathsMode;
        difficulty: Difficulty;
        playerMode: PlayerMode;
      };
    }
  // Countdown UI has finished; board is provided by the action
  | {
      type: 'START_PLAYING';
      payload: {
        leftCards: LeftCard[];
        rightCards: RightCard[];
      };
    }

  // --- In-game card selection ---
  | { type: 'SELECT_LEFT'; payload: { pairId: string } }
  | { type: 'SELECT_RIGHT'; payload: { pairId: string } }

  // --- Animation resolution ---
  // Dispatched by UI via setTimeout after animation completes
  | { type: 'RESOLVE_COMPLETE'; payload: { elapsedMs?: number } }

  // --- End-of-game navigation ---
  // Replay with same config (goes back to countdown)
  | { type: 'RESTART_SAME_SETTINGS' }
  // Return to full setup screen
  | { type: 'GO_TO_SETUP' };
```

---

## 5. Transition Rules

Each rule is: `[current phase / turnPhase + isLocked] + action → next state`.

### START_SETUP
- Guard: `phase === 'idle'`
- Effect: `phase = 'setup'`

### CONFIRM_SETUP
- Guard: `phase === 'setup'`
- Effect:
  - Populate `config` from payload
  - Derive `config.pairCount` from difficulty map
  - `phase = 'countdown'`
  - Reset `soloStats`, `twoPlayerStats`, `board = null`, `isLocked = false`
  - Note: board generation happens in the UI layer before `START_PLAYING` is dispatched; the countdown UI triggers board generation and passes the result to the action.

### START_PLAYING
- Guard: `phase === 'countdown'`
- Effect:
  - `board = { leftCards, rightCards (both from payload), matchedPairIds: [], selectedLeftPairId: null, selectedRightPairId: null }`
  - `phase = 'playing'`
  - `turnPhase = 'waitingForLeft'`
  - `isLocked = false`

### SELECT_LEFT
- Guard: `phase === 'playing' && !isLocked && card is not already matched`
- `turnPhase === 'waitingForLeft'` OR `turnPhase === 'leftSelected'` (re-selection allowed)
- Effect:
  - If `turnPhase === 'leftSelected'` (changing selection): flip previous left card back to `faceDown`
  - Set `board.selectedLeftPairId = pairId`
  - Set matching `leftCard.status = 'faceUp'`
  - `turnPhase = 'leftSelected'`

### SELECT_RIGHT
- Guard: `phase === 'playing' && !isLocked && turnPhase === 'leftSelected' && card is not already matched`
- Effect:
  - Set `board.selectedRightPairId = pairId`
  - Set matching `rightCard.status = 'faceUp'`
  - Evaluate match (see section 6):
    - If `selectedLeftPairId === selectedRightPairId`:
      - `lastMatchResult = 'correct'`
      - `turnPhase = 'resolving_success'`
      - `isLocked = true`
      - Increment guesses (solo) or nothing yet (score applied on RESOLVE_COMPLETE)
    - Else:
      - `lastMatchResult = 'incorrect'`
      - Set both selected cards `status = 'incorrect'`
      - `turnPhase = 'resolving_failure'`
      - `isLocked = true`
      - Increment guesses (solo)

### RESOLVE_COMPLETE
- Guard: `phase === 'playing' && isLocked`
- Effect (branch on `turnPhase`):

  **If `resolving_success`:**
  - Mark both selected cards `status = 'matched'`
  - Add `selectedLeftPairId` to `board.matchedPairIds`
  - Clear `board.selectedLeftPairId = null`, `board.selectedRightPairId = null`
  - Update scores:
    - Solo: `soloStats.matches += 1`, `soloStats.guesses += 1`
    - 2-player: increment `scoreA` or `scoreB` based on `activePlayer`
  - `isLocked = false`
  - `lastMatchResult = null`
  - Check if all pairs matched:
    - If `board.matchedPairIds.length === config.pairCount`:
      - `phase = 'complete'`
      - `soloStats.elapsedMs = payload.elapsedMs ?? 0`
    - Else:
      - `turnPhase = 'waitingForLeft'`
      - (2-player: active player keeps their turn on correct match — no switch)

  **If `resolving_failure`:**
  - Reset both selected cards `status = 'faceDown'`
  - Clear `board.selectedLeftPairId = null`, `board.selectedRightPairId = null`
  - `isLocked = false`
  - `lastMatchResult = null`
  - `turnPhase = 'waitingForLeft'`
  - 2-player: switch `activePlayer` (A→B or B→A)
  - Solo: no turn switch

### RESTART_SAME_SETTINGS
- Guard: `phase === 'complete'` OR `phase === 'playing'` (mid-game restart)
- Effect:
  - Keep `config` as-is
  - Reset `board = null`, `soloStats = INITIAL_SOLO_STATS`, `twoPlayerStats = INITIAL_TWO_PLAYER_STATS`
  - `phase = 'countdown'`
  - `turnPhase = 'waitingForLeft'`
  - `isLocked = false`
  - `lastMatchResult = null`
  - Note: UI layer re-generates the board during countdown and dispatches `START_PLAYING`

### GO_TO_SETUP
- Guard: any phase
- Effect: full reset to `INITIAL_STATE` but set `phase = 'setup'`

---

## 6. Pseudocode for Board Generation

Board generation runs in the UI layer (e.g. a `generateBoard(config: GameConfig)` utility function), called just before `START_PLAYING` is dispatched. The result is passed as the action payload.

```
function generateBoard(config: GameConfig): { leftCards: LeftCard[], rightCards: RightCard[] }

  // Step 1: Get the full candidate pool for the chosen mode
  pool = getAllPairs(config.mode)
  // getAllPairs returns all MathsPair objects for multiplication or division

  // Step 2: Remove any pairs whose answer value appears more than once in the pool
  // This prevents ambiguous right-side cards
  answerCounts = countBy(pool, pair => pair.answer)
  uniquePool = pool.filter(pair => answerCounts[pair.answer] === 1)

  // Step 3: Validate pool is large enough
  if uniquePool.length < config.pairCount:
    throw new Error('Insufficient unique pairs for difficulty: ' + config.difficulty)
    // This should never happen with the defined pools but is a safety guard

  // Step 4: Sample pairCount pairs at random from uniquePool
  selectedPairs = shuffle(uniquePool).slice(0, config.pairCount)

  // Step 5: Build left cards from selectedPairs (in shuffled order)
  leftCards = shuffle(selectedPairs).map(pair => ({
    pairId: pair.id,
    prompt: pair.prompt,
    status: 'faceDown'
  }))

  // Step 6: Build right cards independently shuffled (so positions do not match left)
  rightCards = shuffle(selectedPairs).map(pair => ({
    pairId: pair.id,
    answer: pair.answer,
    status: 'faceDown'
  }))

  // Step 7: Final sanity check — ensure no two right cards share the same answer value
  answerValues = rightCards.map(c => c.answer)
  if hasDuplicates(answerValues):
    // This should be impossible given step 2, but guard anyway
    return generateBoard(config)  // retry (or throw in development)

  return { leftCards, rightCards }
```

### getAllPairs implementation note

The question pool for each mode should be defined as a static constant array in a `data/mathsPairs.ts` file. The division-by-2, division-by-3, and division-by-10 pools produce answers: 1–10, 1–10, and 1–50 respectively. Division-by-2 and division-by-3 share answer values (e.g. both produce the answer 6: 12÷2 and 18÷3). When both pools are active simultaneously, collisions arise.

Resolution: for v1, when the user selects "Division", sample from all three division sub-pools combined, then apply the uniqueness filter at step 2. This ensures the board always has non-ambiguous answers. No pair is excluded without replacement — if a needed count cannot be met after filtering, an error is thrown (development guard only; pool sizes should be verified to always satisfy max difficulty of 10 pairs after filtering).

---

## 7. Pseudocode for Match Resolution (with Animation Lock)

This lives in the React component layer, not the reducer. The reducer sets `isLocked = true` synchronously. The component observes `lastMatchResult` and `isLocked` via `useEffect` to schedule the resolution dispatch.

```
// Inside the React component or a custom hook useMatchResolution

useEffect(() => {
  if (!isLocked) return
  if (phase !== 'playing') return

  if (lastMatchResult === 'correct') {
    // Success animation duration: 800ms
    // UI applies 'matched' CSS class to both selected cards during this window
    const timer = setTimeout(() => {
      dispatch({
        type: 'RESOLVE_COMPLETE',
        payload: { elapsedMs: timerHook.getElapsedMs() }
      })
    }, SUCCESS_ANIMATION_DURATION_MS)   // constant: 800

    return () => clearTimeout(timer)
  }

  if (lastMatchResult === 'incorrect') {
    // Failure animation duration: 700ms (shake + pause to see mismatch)
    // UI applies 'incorrect' CSS class to both selected cards during this window
    const timer = setTimeout(() => {
      dispatch({
        type: 'RESOLVE_COMPLETE',
        payload: {}
      })
    }, FAILURE_ANIMATION_DURATION_MS)   // constant: 700

    return () => clearTimeout(timer)
  }
}, [isLocked, lastMatchResult, phase])
```

### Why the reducer does not hold the timeout

If the timeout were inside the reducer it would introduce a side effect that React's StrictMode double-invocation would break. Keeping it in a `useEffect` with proper cleanup handles:
- Component unmount during animation
- React StrictMode double-invocation (effect cleans up and re-runs; only one timer fires)
- Hot-reload during development

### Match evaluation logic (inside reducer, SELECT_RIGHT handler)

```
function evaluateMatch(selectedLeftPairId: string, selectedRightPairId: string): boolean
  return selectedLeftPairId === selectedRightPairId
```

Match is valid when both selected pairIds are equal. The left card carries a `pairId` from the prompt, the right card carries the same `pairId` from the answer. This is the sole truth source. The reducer never compares answer strings or numeric values directly.

---

## 8. Edge Cases and How Each is Handled

### 8.1 Rapid clicking during animation
- Guard: `isLocked === true` in the reducer for all `SELECT_LEFT` and `SELECT_RIGHT` actions.
- The reducer simply returns the current state unchanged when locked. No state corruption is possible.

### 8.2 Clicking right card before a left card is selected
- Guard: `SELECT_RIGHT` is only processed when `turnPhase === 'leftSelected'`.
- In all other `turnPhase` values, the reducer returns state unchanged.
- The UI should additionally apply `pointer-events: none` or `disabled` to right-side cards when `turnPhase !== 'leftSelected'` for UX clarity, but the reducer is the authoritative guard.

### 8.3 Clicking an already-matched card
- Guard: cards with `status === 'matched'` are ignored in `SELECT_LEFT` and `SELECT_RIGHT` handlers.
- Check: `board.leftCards.find(c => c.pairId === pairId)?.status !== 'matched'`.

### 8.4 Clicking the same left card again (re-selection)
- Allowed, but no-op: if the clicked card is already `selectedLeftPairId`, the reducer returns state unchanged (status stays `faceUp`).

### 8.5 Changing left card selection after a left card is already face-up
- Allowed: reducer flips the previously selected left card back to `faceDown`, sets the new card to `faceUp`, updates `selectedLeftPairId`.
- This only applies when `turnPhase === 'leftSelected'` and `!isLocked`.

### 8.6 Selecting the right card that corresponds to the currently selected left card (self-match scenario)
- This is a valid correct match. `selectedLeftPairId === selectedRightPairId` is true. Handled normally.

### 8.7 Final pair being matched
- `RESOLVE_COMPLETE` with `resolving_success` checks `board.matchedPairIds.length === config.pairCount` after adding the final pair.
- If true, transitions to `phase = 'complete'` in the same dispatch. The end modal renders when `phase === 'complete'`.
- The timer hook stops when `phase !== 'playing'`.

### 8.8 Mid-game restart
- `RESTART_SAME_SETTINGS` is accepted during `phase === 'playing'`.
- The in-flight `setTimeout` in `useMatchResolution` will attempt to dispatch `RESOLVE_COMPLETE`, but because `phase` will be `'countdown'` by then, the reducer guard (`phase === 'playing' && isLocked`) will block it harmlessly.

### 8.9 RESOLVE_COMPLETE dispatched when board is already complete
- If somehow `RESOLVE_COMPLETE` fires after `phase` is already `'complete'`, the guard `phase === 'playing' && isLocked` blocks it. Safe.

### 8.10 Board generation pool exhaustion
- Division pools combined: div-by-2 (10 unique pairs, answers 1–10), div-by-3 (10 unique pairs, answers 1–10), div-by-10 (50 unique pairs, answers 1–50).
- After removing pairs whose answer value appears in more than one sub-pool (1–10 appear in both div-by-2 and div-by-3), the unique answer pool for division is: div-by-10 answers 11–50 (40 pairs) + whichever of div-by-2/div-by-3 answers 1–10 don't collide.
- Actually: answers 1–10 appear in BOTH div-by-2 and div-by-3, so all of them are excluded from the unique pool. This would leave only div-by-10 answers 11–50 = 40 pairs. This is sufficient for max 10 pairs.
- Alternative resolution (recommended): treat sub-pools independently — when "Division" is selected, pick randomly from one division sub-pool at a time per round, rather than combining all three. This avoids the collision problem entirely. generateBoard picks one sub-pool based on a random or difficulty-driven selection, then samples from it. All answers within a single sub-pool (e.g. div-by-3: 3,6,9...30 → answers 1–10) are unique within that pool. This is the simpler and safer approach.
- Decision: use single-sub-pool sampling per round. The specific sub-pool can be chosen randomly or rotated. This guarantees no collisions by design.

### 8.11 Countdown interrupted by navigation / back button
- The countdown is UI-only. If the user navigates away (browser back), the app state persists (React state in memory). On return, the app renders the current phase.
- No cleanup needed for countdown since it is a local `useEffect` timer.

### 8.12 Timer accuracy on tab switch / backgrounding
- `useTimer` should use `Date.now()` delta rather than an incrementing counter, so backgrounded tab timer catch-up does not inflate the elapsed time artificially. Record `startTime = Date.now()` when play begins, compute `elapsed = Date.now() - startTime` on each tick.

### 8.13 Duplicate pairId on right-side re-click
- If the user clicks the same right-side card that is already `faceUp` and selected, the `SELECT_RIGHT` handler checks `pairId !== board.selectedRightPairId` — if it is the same card, return state unchanged.

### 8.14 Two-player: all remaining pairs completed in a single turn by one player
- Correct. Player A can complete every pair if they match correctly every time. Score ends at e.g. 10:0. End modal shows Player A wins with crown.

### 8.15 Tie in 2-player mode
- When `scoreA === scoreB` at game completion, the end modal shows a tie state. No crown awarded. Friendly tie message is shown.

---

## 9. Recommended Safeguards

### S1: Reducer is the single authority for locked state
Do not rely on UI disabling alone. The reducer must validate `isLocked` on every card action. This prevents a scenario where a fast double-tap fires two events before React re-renders with the locked state.

### S2: Unique pairIds
All `MathsPair.id` values must be globally unique. Use a deterministic scheme: `'mul-2-7'` (multiplication, multiplier 2, multiplicand 7), `'div-3-18'` (division, divisor 3, dividend 18). No UUID needed.

### S3: Board generation must never be called inside the reducer
The reducer must be a pure function. Board generation (which uses `Math.random`) goes in a utility function called from the UI layer. The generated board is passed into `START_PLAYING` as payload.

### S4: No floating references to selected cards
`selectedLeftPairId` and `selectedRightPairId` are cleared to `null` on every `RESOLVE_COMPLETE`. If they were left set, subsequent renders could show stale selections.

### S5: Animation duration constants are shared between UI and the resolution hook
Define `SUCCESS_ANIMATION_DURATION_MS = 800` and `FAILURE_ANIMATION_DURATION_MS = 700` in a single `constants.ts` file. This prevents mismatch where the CSS animation is shorter than the setTimeout or vice versa.

### S6: `turnPhase` resets correctly on `RESTART_SAME_SETTINGS`
Always reset `turnPhase = 'waitingForLeft'` on restart. Do not retain stale `turnPhase` from the previous game.

### S7: Solo timer stops on phase transition
`useTimer` should watch `phase`. When `phase` changes from `'playing'` to anything else, the interval must be cleared immediately. This prevents elapsed time accumulating during the end modal.

### S8: `lastMatchResult` cleared on resolution
`lastMatchResult` must be set back to `null` inside `RESOLVE_COMPLETE`. If it retains a value, any component watching it could re-trigger effects on unrelated re-renders.

### S9: Right cards receive independent shuffle from left cards
The shuffle of right cards must not depend on the order of left cards. Both are shuffled independently so card positions on screen do not imply pairings.

### S10: Guard against impossible states with a default reducer case
The reducer default case returns `state` unchanged. Never throw in production. Log a warning in development only.

---

## 10. Recommended Next Handoff

### Primary: qa-test-designer (claude-haiku-4-5)

Consume this document to produce:
- Acceptance test matrix (all phases and transitions)
- Edge case test cases (sections 8.1–8.15)
- State transition table for regression testing
- Invalid action test cases

Input for qa-test-designer:
- This document (`gameplay-state-designer.md`)
- The UX flow document (from `ux-game-designer`)

### Secondary: visual-ui-builder (claude-sonnet-4-6)

Consume this document to implement:
- `gameReducer.ts` — full reducer implementing all transitions in section 5
- `GameContext.tsx` — provider wrapping `useReducer`
- `useMatchResolution.ts` — the animation lock + setTimeout resolution hook (section 7)
- `useTimer.ts` — `Date.now()`-based elapsed timer, active only when `phase === 'playing'`
- `generateBoard.ts` — board generation utility (section 6)
- `constants.ts` — animation duration constants
- `types.ts` — all TypeScript types from section 3
- `actions.ts` — discriminated union from section 4

The visual-ui-builder should not deviate from the state shape or action names defined here without documenting the change.

---

## Artefacts

- **File:** `.claude/outputs/gameplay-state-designer.md` (this document)

## Open Risks

1. Division pool collision (answered in section 8.10): resolved by using single-sub-pool per round.
2. React StrictMode double-effect firing: resolved by cleanup function pattern in `useMatchResolution`.
3. Timer drift on backgrounded tabs: resolved by `Date.now()` delta approach.
4. Extremely fast double-tap on mobile dispatching two `SELECT_RIGHT` actions before re-render: mitigated by reducer `isLocked` guard set synchronously on first `SELECT_RIGHT`.
