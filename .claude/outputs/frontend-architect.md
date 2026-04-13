# Frontend Architecture — Maths Match

Produced by: `frontend-architect` (claude-sonnet-4-6)
Date: 2026-04-13

---

## 1. Assumptions

- The app is purely client-side. There is no API, auth, or persistent server.
- All question data is generated at runtime from in-memory config. No JSON files to fetch.
- A single Vite project will produce `dist/` as the static output — suitable for S3 or Azure Static Website with no redirect rules needed beyond a wildcard fallback for the index.
- There is no routing between URL paths. The game screen is a single-page app driven entirely by React state (a `screen` enum).
- "2-player" means pass-and-play on the same device. There is no network play.
- Timer precision of 1-second intervals (via `setInterval`) is sufficient. Sub-second precision is not needed.
- CSS Modules are chosen for styles (see Architecture Decisions below). Tailwind is explicitly excluded to keep the build simple and avoid a PostCSS pipeline.
- Framer Motion is excluded. All animations are implemented with plain CSS transitions and keyframes, keeping the bundle small.
- A lightweight confetti library (`canvas-confetti`) is acceptable for the success burst. It is the only non-essential dependency.
- The answer de-duplication rule applies per generated round, not globally. If a pool produces duplicate numeric answers after sampling, the board generation re-samples until the set is unique.
- Players cannot re-select a left card after having already selected one — selecting a second left card replaces the first selection while no right card is yet selected.
- There are no audio requirements for v1.

---

## 2. Architecture Decisions

### Single reducer for all game state
Game state is complex enough to benefit from a reducer pattern: there are multiple phases, interaction locks, turn switching, timers, and score tracking. A `useReducer` hook at the top level of `GameShell` manages all of this. Context passes the state and dispatch downward. No external state library (Redux, Zustand, Jotai) is needed.

### Screen-level navigation via state enum, not React Router
The app has five logical screens: `start`, `setup`, `countdown`, `playing`, `complete`. These are driven by a `screen` field in the top-level app state. Using React Router would add complexity and require a proper SPA redirect rule on the host. A plain state enum is simpler and works on any static host.

### CSS Modules for component styles
CSS Modules give scoped class names without a build-time PostCSS dependency. They are natively supported by Vite. Each component gets a `.module.css` file. Global styles (reset, fonts, CSS variables for the colour palette, keyframes) live in `src/styles/global.css`.

### CSS transforms for flip animations
Card flip is achieved with a `rotateY` 3D CSS transform on a card wrapper that has two faces (front/back). The wrapper gets `transform-style: preserve-3d`. The back face has `backface-visibility: hidden`. Toggling a CSS class triggers the flip. No JavaScript animation library needed.

### Interaction lock via a boolean in state
While an animation is resolving (match validation, failure shake, success exit, countdown), `isLocked: true` is set in the reducer state. All card click handlers check this before dispatching. This is simpler and more reliable than per-component guards.

### Question data as pure TypeScript config
All question pools are generated from typed config objects in `src/data/questions.ts`. No JSON fetch. Pools are generated at module load time and exported as arrays. Board generation samples from these arrays at game start.

### No-duplicate answer validation in board generation
`generateRound()` samples pairs from the pool, checks for duplicate answer strings in the sampled set, and re-samples if duplicates are found. This is a synchronous operation done once at game start. Max retries guard against infinite loops (unlikely but safe).

### Timer as a custom hook
`useTimer` encapsulates `setInterval`, start/stop/reset. It returns elapsed seconds. It is called from within `GameShell` and feeds into state only for display; it does not drive reducer transitions.

### Component responsibility boundary
- `App` — mounts `GameShell`, provides context
- `GameShell` — owns the reducer, the timer hook, and the screen switcher
- Screen components (`StartScreen`, `SetupScreen`, `CountdownOverlay`, `GameBoard`) are purely presentational relative to the reducer — they receive state slices and dispatch from context
- `Card` is a single reusable component that handles both prompt and answer sides via a `side` prop
- `EndGameModal` reads final stats from context and is rendered as a portal

---

## 3. Suggested Tech Stack

| Package | Version | Purpose |
|---|---|---|
| react | ^19.1.0 | UI framework |
| react-dom | ^19.1.0 | DOM renderer |
| typescript | ^5.8.3 | Type safety |
| vite | ^6.3.1 | Build tool and dev server |
| @vitejs/plugin-react | ^4.4.1 | Vite React plugin (uses Babel fast-refresh) |
| canvas-confetti | ^1.9.3 | Confetti burst on correct match and game complete |
| @types/canvas-confetti | ^1.9.0 | Types for canvas-confetti |

No other runtime dependencies. No routing library. No state management library. No CSS framework. No animation library.

Dev dependencies only:

| Package | Version | Purpose |
|---|---|---|
| @types/react | ^19.1.0 | React types |
| @types/react-dom | ^19.1.0 | React DOM types |
| vite | ^6.3.1 | (also listed above) |

---

## 4. Folder Structure

```
maths-game/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── package.json
├── .gitignore
├── public/
│   └── favicon.svg
└── src/
    ├── main.tsx                        # Vite entry point
    ├── App.tsx                         # Root component, mounts GameShell
    ├── styles/
    │   └── global.css                  # Reset, CSS vars, keyframes, fonts
    ├── types/
    │   └── game.ts                     # All shared TypeScript types and enums
    ├── data/
    │   ├── questions.ts                # Question pool definitions and generators
    │   └── config.ts                   # Difficulty map, mode labels, pair counts
    ├── state/
    │   ├── gameReducer.ts              # useReducer reducer function
    │   ├── gameActions.ts              # Action type union and action creators
    │   ├── initialState.ts             # Factory for initial/reset state shape
    │   └── GameContext.ts             # React context definition
    ├── hooks/
    │   ├── useTimer.ts                 # setInterval-based elapsed timer
    │   └── useGameContext.ts           # Typed context consumer hook
    ├── utils/
    │   ├── shuffle.ts                  # Fisher-Yates shuffle
    │   ├── generateRound.ts            # Board generation with de-dup logic
    │   └── evaluateMatch.ts            # Match validation pure function
    ├── components/
    │   ├── GameShell/
    │   │   ├── GameShell.tsx           # Reducer owner, screen router
    │   │   └── GameShell.module.css
    │   ├── StartScreen/
    │   │   ├── StartScreen.tsx
    │   │   └── StartScreen.module.css
    │   ├── SetupScreen/
    │   │   ├── SetupScreen.tsx
    │   │   └── SetupScreen.module.css
    │   ├── CountdownOverlay/
    │   │   ├── CountdownOverlay.tsx
    │   │   └── CountdownOverlay.module.css
    │   ├── GameBoard/
    │   │   ├── GameBoard.tsx           # Renders left column + right column
    │   │   └── GameBoard.module.css
    │   ├── CardColumn/
    │   │   ├── CardColumn.tsx          # One column of cards (prompts or answers)
    │   │   └── CardColumn.module.css
    │   ├── Card/
    │   │   ├── Card.tsx                # Flip card, handles face-down/revealed/matched states
    │   │   └── Card.module.css
    │   ├── StatusBar/
    │   │   ├── StatusBar.tsx           # Top bar with timer, scores, turn indicator
    │   │   └── StatusBar.module.css
    │   ├── CompletedPile/
    │   │   ├── CompletedPile.tsx       # Visual matched-pair count
    │   │   └── CompletedPile.module.css
    │   ├── EndGameModal/
    │   │   ├── EndGameModal.tsx        # ReactDOM.createPortal modal
    │   │   └── EndGameModal.module.css
    │   └── ConfettiEffect/
    │       └── ConfettiEffect.ts       # canvas-confetti wrapper (no JSX, imperative)
    └── assets/
        └── crown.svg                   # Winner crown icon
```

---

## 5. Component Tree

Props are described as TypeScript-style signatures. Context is available to all components via `useGameContext()` — props below show only what is passed explicitly in JSX for clarity.

```
App
  └── GameShell
        │  [owns: useReducer(gameReducer), useTimer(), GameContext.Provider]
        │
        ├── StartScreen                          (screen === 'start')
        │     props: { onStart: () => void }
        │
        ├── SetupScreen                          (screen === 'setup')
        │     props: { onConfirm: (config: GameConfig) => void
        │              onBack: () => void }
        │
        ├── CountdownOverlay                     (screen === 'countdown')
        │     props: { onComplete: () => void }
        │     [local state: countdown 3→2→1→Go, useEffect interval]
        │
        ├── GameBoard                            (screen === 'playing')
        │     props: none (reads all from context)
        │     │
        │     ├── StatusBar
        │     │     props: { mode: GameMode
        │     │              difficulty: Difficulty
        │     │              playerMode: PlayerMode
        │     │              elapsedSeconds: number
        │     │              guesses: number
        │     │              matchesComplete: number
        │     │              totalPairs: number
        │     │              currentPlayer: Player       (2-player only)
        │     │              scores: Record<Player, number> (2-player only)
        │     │              onNewGame: () => void }
        │     │
        │     ├── CardColumn  (side='prompt')
        │     │     props: { cards: PromptCard[]
        │     │              selectedId: string | null
        │     │              matchedIds: Set<string>
        │     │              isLocked: boolean
        │     │              onSelect: (id: string) => void }
        │     │     └── Card (×N)
        │     │           props: { card: PromptCard | AnswerCard
        │     │                    isFlipped: boolean
        │     │                    isMatched: boolean
        │     │                    isSelected: boolean
        │     │                    isIncorrect: boolean
        │     │                    isDisabled: boolean
        │     │                    onClick: () => void }
        │     │
        │     ├── CardColumn  (side='answer')
        │     │     props: { cards: AnswerCard[]
        │     │              selectedId: string | null
        │     │              matchedIds: Set<string>
        │     │              isLocked: boolean
        │     │              onSelect: (id: string) => void }
        │     │     └── Card (×N)
        │     │
        │     └── CompletedPile
        │           props: { matchCount: number
        │                    totalPairs: number }
        │
        └── EndGameModal                         (screen === 'complete')
              props: none (reads all from context)
              [rendered via ReactDOM.createPortal into document.body]
```

---

## 6. State Model

Full TypeScript type definitions. These belong in `src/types/game.ts` and `src/state/initialState.ts`.

```typescript
// src/types/game.ts

export type Screen = 'start' | 'setup' | 'countdown' | 'playing' | 'complete';

export type GameMode = 'multiplication' | 'division';

export type Difficulty = 'easy' | 'notSoEasy' | 'prettyTricky' | 'reallyHard';

export type PlayerMode = 'solo' | 'twoPlayer';

export type Player = 'playerA' | 'playerB';

export type TurnPhase =
  | 'waitingForPrompt'      // no card selected, waiting for left pick
  | 'waitingForAnswer'      // prompt selected, waiting for right pick
  | 'validating'            // both picked, evaluation in progress (locked)
  | 'resolvingSuccess'      // correct match, animation playing (locked)
  | 'resolvingFailure';     // wrong match, shake animation playing (locked)

export interface GameConfig {
  mode: GameMode;
  difficulty: Difficulty;
  playerMode: PlayerMode;
}

export interface PromptCard {
  id: string;               // e.g. 'prompt-mul-2-7'
  side: 'prompt';
  prompt: string;           // e.g. '2 x 7'
  answerId: string;         // id of the matching AnswerCard
  answerValue: string;      // e.g. '14'
}

export interface AnswerCard {
  id: string;               // e.g. 'answer-14-0'
  side: 'answer';
  value: string;            // e.g. '14'
  matchesPromptId: string;  // id of the matching PromptCard
}

export type AnyCard = PromptCard | AnswerCard;

export interface SoloStats {
  guesses: number;
  matches: number;
  elapsedSeconds: number;
}

export interface TwoPlayerStats {
  scores: Record<Player, number>;
  currentPlayer: Player;
}

export interface GameState {
  screen: Screen;

  // Setup choices — null until setup is confirmed
  config: GameConfig | null;

  // Board data — null until round is generated
  promptCards: PromptCard[];
  answerCards: AnswerCard[];

  // Turn state
  turnPhase: TurnPhase;
  selectedPromptId: string | null;
  selectedAnswerId: string | null;

  // Matched pairs — stored as prompt IDs
  matchedPromptIds: string[];

  // Cards currently showing incorrect feedback
  incorrectIds: string[];       // the two card ids that just failed

  // Interaction lock (true during any animation)
  isLocked: boolean;

  // Solo stats
  solo: SoloStats;

  // Two-player stats
  twoPlayer: TwoPlayerStats;
}
```

```typescript
// src/state/initialState.ts

import type { GameState } from '../types/game';

export function createInitialState(): GameState {
  return {
    screen: 'start',
    config: null,
    promptCards: [],
    answerCards: [],
    turnPhase: 'waitingForPrompt',
    selectedPromptId: null,
    selectedAnswerId: null,
    matchedPromptIds: [],
    incorrectIds: [],
    isLocked: false,
    solo: { guesses: 0, matches: 0, elapsedSeconds: 0 },
    twoPlayer: { scores: { playerA: 0, playerB: 0 }, currentPlayer: 'playerA' },
  };
}
```

---

## 7. Data Model

```typescript
// src/data/questions.ts

export interface QuestionDefinition {
  id: string;
  mode: GameMode;
  prompt: string;
  answer: string;       // string representation of the numeric answer
}

// Example entries (generator produces the full pool):
// { id: 'mul-2-1', mode: 'multiplication', prompt: '2 x 1', answer: '2' }
// { id: 'div-2-4', mode: 'division', prompt: '4 ÷ 2', answer: '2' }
```

```typescript
// src/data/config.ts

import type { Difficulty, GameMode } from '../types/game';

export const PAIR_COUNTS: Record<Difficulty, number> = {
  easy: 4,
  notSoEasy: 6,
  prettyTricky: 8,
  reallyHard: 10,
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  notSoEasy: 'Not So Easy',
  prettyTricky: 'Pretty Tricky',
  reallyHard: 'Really Hard',
};

export const MODE_LABELS: Record<GameMode, string> = {
  multiplication: 'Multiplication',
  division: 'Division',
};
```

```typescript
// src/utils/generateRound.ts

// generateRound(config: GameConfig): { promptCards: PromptCard[]; answerCards: AnswerCard[] }
//
// Algorithm:
//   1. Select pool of QuestionDefinitions matching config.mode
//   2. Sample PAIR_COUNTS[config.difficulty] items without replacement
//   3. Check for duplicate answer strings in sample
//   4. If duplicates found, re-sample (max 20 attempts, then use first valid superset)
//   5. For each sampled question, create a PromptCard and an AnswerCard with linked IDs
//   6. Shuffle promptCards array independently
//   7. Shuffle answerCards array independently
//   8. Return both arrays
```

The id linking strategy:

- `PromptCard.id` = `'prompt-' + question.id`
- `AnswerCard.id` = `'answer-' + question.id`
- `PromptCard.answerId` = `AnswerCard.id`
- `AnswerCard.matchesPromptId` = `PromptCard.id`

Match validation in `evaluateMatch.ts`:

```typescript
// evaluateMatch(promptCard: PromptCard, answerCard: AnswerCard): boolean
// Returns promptCard.answerId === answerCard.id
```

---

## 8. Key Events / Actions

These are the action types the reducer handles. Full action payloads belong in `src/state/gameActions.ts`.

```typescript
type GameAction =
  // Navigation
  | { type: 'NAVIGATE_TO_SETUP' }
  | { type: 'NAVIGATE_TO_START' }

  // Setup
  | { type: 'CONFIRM_SETUP'; payload: GameConfig }

  // Countdown
  | { type: 'COUNTDOWN_COMPLETE' }

  // Gameplay — card selection
  | { type: 'SELECT_PROMPT'; payload: { id: string } }
  | { type: 'SELECT_ANSWER'; payload: { id: string } }

  // Match resolution (dispatched after animations finish)
  | { type: 'RESOLVE_MATCH_SUCCESS' }
  | { type: 'RESOLVE_MATCH_FAILURE' }

  // Timer (dispatched each second from useTimer)
  | { type: 'TICK'; payload: { elapsedSeconds: number } }

  // Reset
  | { type: 'REPLAY_SAME_CONFIG' }
  | { type: 'RETURN_TO_MENU' }
```

Reducer transition summary:

| Current phase | Action | Next phase | Side effects |
|---|---|---|---|
| `waitingForPrompt` | `SELECT_PROMPT` | `waitingForAnswer` | set selectedPromptId, isLocked=false |
| `waitingForAnswer` | `SELECT_PROMPT` | `waitingForAnswer` | replace selectedPromptId (left re-select) |
| `waitingForAnswer` | `SELECT_ANSWER` | `validating` → immediate eval | set selectedAnswerId, isLocked=true |
| `validating` (correct) | internal | `resolvingSuccess` | add to matchedPromptIds, increment score, isLocked=true |
| `validating` (wrong) | internal | `resolvingFailure` | set incorrectIds, isLocked=true |
| `resolvingSuccess` | `RESOLVE_MATCH_SUCCESS` | `waitingForPrompt` or `complete` | clear selections, check if board done |
| `resolvingFailure` | `RESOLVE_MATCH_FAILURE` | `waitingForPrompt` | clear selections, incorrectIds, switch player if 2P |

Animation timing contract (handled in components, not reducer):

- Flip animation: 300ms CSS transition
- Incorrect shake: 500ms CSS animation, then dispatch `RESOLVE_MATCH_FAILURE`
- Success exit: 400ms CSS animation, then dispatch `RESOLVE_MATCH_SUCCESS`
- Components use `onAnimationEnd` or a `setTimeout` fallback to dispatch resolution actions

---

## 9. Dependency Recommendations

### Include

- `canvas-confetti` — ~10 KB minified, well-maintained, imperative API, no JSX. Call `confetti()` from `ConfettiEffect.ts` (a plain TypeScript module, not a component) on match success and game complete.

### Explicitly exclude

- React Router — not needed; screen state replaces routing entirely
- Framer Motion — all animations are CSS-based; bundle cost not justified
- Tailwind CSS — adds PostCSS config; CSS Modules are sufficient and simpler for this scale
- Redux / Zustand / Jotai — `useReducer` + Context is sufficient
- Any date/time library — `Date.now()` and `setInterval` are sufficient for the timer
- Any testing library in v1 — QA testing design is a separate agent handoff

### Vite config notes

- Set `base: './'` in `vite.config.ts` so that asset paths are relative — required for S3/Azure hosting where the app may not be served from the root path.
- Output goes to `dist/` by default. No additional configuration needed for static hosting.

```typescript
// vite.config.ts skeleton
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
  },
});
```

---

## 10. Risks and Tradeoffs

### Risk: Animation timing via setTimeout is fragile
Dispatching `RESOLVE_MATCH_SUCCESS` / `RESOLVE_MATCH_FAILURE` via `setTimeout` in components can misfire if the component unmounts. Mitigation: use `useEffect` with a cleanup that clears the timeout. The `isLocked` flag prevents re-entry even if timing is slightly off.

### Risk: Re-sampling on duplicate answers may be slow for small pools
The division-by-2 pool has 10 items; difficulty "Really Hard" needs 10 pairs. In this worst case, every question in the pool is used. If the pool itself contains duplicate answers (it won't for the defined pools, but could for future additions), the re-sampling loop would loop forever. Mitigation: the loop has a hard cap of 20 retries and falls back gracefully, plus the question pools are designed to avoid this.

### Tradeoff: No URL routing means no deep-linking
Users cannot bookmark or share a direct link to a game in progress. This is acceptable because the game is designed as a self-contained session, not a navigable web app.

### Tradeoff: Context for state distribution adds a small re-render surface
Every context consumer re-renders on any state change. For this app's scale (no more than ~25 components), this is not a performance concern. The tradeoff is simplicity over micro-optimisation.

### Tradeoff: CSS Modules over Tailwind
CSS Modules require more verbose class name authoring but produce fully predictable, scoped styles. For a child-friendly app with a custom colour palette and specific animation keyframes, CSS Modules are more appropriate than a utility-class system.

### Tradeoff: Single reducer vs split reducers
A single reducer is chosen for simplicity. The game state is unified (turn phase, scores, board) and transitions often touch multiple slices simultaneously (e.g. a correct match updates `matchedPromptIds`, `solo.matches`, `twoPlayer.scores`, `turnPhase`, and `isLocked` in one action). Splitting would require coordination logic.

---

## 11. Recommended Next Handoff

**Immediate: `gameplay-state-designer` (claude-sonnet-4-6)**

Hand off this architecture document. The gameplay-state-designer should:
- Lock all reducer transitions in full detail (every action, every state field change)
- Define the animation timing contract precisely (which component owns each timeout, what CSS class is applied, when resolution actions fire)
- Define turn-switch logic for 2-player mode
- Define the game-complete detection check (done inside reducer after `RESOLVE_MATCH_SUCCESS`)
- Define the exact board generation algorithm and duplicate-answer handling

**Subsequent: `visual-ui-builder` (claude-sonnet-4-6)**

Once the gameplay state is locked, the visual-ui-builder should scaffold the Vite project, implement all components per this tree and state model, and apply the child-friendly visual design.

---

## Artefacts Produced

- This document: `.claude/outputs/frontend-architect.md`
- Defines: folder structure, component tree, full TypeScript state shape, data model, action list, dependency decisions, vite config note

## Open Risks for Next Agent

1. Confirm the animation timing contract — which side (component vs reducer) owns the delay timer for failure resolution
2. Confirm behaviour when player selects a second left card after already selecting one — this architecture assumes it replaces the first selection silently
3. Confirm whether the 2-player timer is shown or hidden (PRD says "optional timer" for 2-player)
4. Confirm the exact duplicate-answer re-sampling strategy for the `generateRound` utility
