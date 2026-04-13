# UX Game Designer — Maths Match

Produced by: `ux-game-designer` (claude-haiku-4-5)
Date: 2026-04-13

---

## 1. Assumptions

- The game is designed for children aged 6–10, some of whom may be on tablets or phones with touch as the primary input method.
- Parents, teachers, and older siblings may also play, but the design must remain simple and cheerful enough that younger players are not intimidated.
- Single device only — 2-player is pass-and-play, not networked.
- All setup choices are finite and discrete (no free-text input for names in v1).
- The countdown (3, 2, 1, Go!) is a moment of celebration/anticipation, not a rushed warning.
- Cards are physical metaphors — flipping and facing down/up should be clear and satisfying visually.
- "Correct" and "Incorrect" feedback should be obvious to a 6-year-old without reading words.
- Large touch targets are essential; minimum tap area is 44×44 px, preferably larger.
- Animations should be smooth but not so long that they feel boring. Flip ~300ms, feedback ~500–800ms total.
- No audio is required for v1, but UI animations must convey success/failure clearly.

---

## 2. Screen Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      START SCREEN                               │
│  Title: "Maths Match"                                           │
│  Subtitle: "Match the cards and test your maths skills"         │
│  Button: "Start New Game"                                       │
│  [touches Start New Game]                                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      SETUP SCREEN                               │
│  Question 1: "What maths type?"                                 │
│  [ Multiplication ]  [ Division ]                               │
│                                                                 │
│  Question 2: "Choose your difficulty"                           │
│  [ Easy ]  [ Not So Easy ]  [ Pretty Tricky ]  [ Really Hard ]  │
│                                                                 │
│  Question 3: "Play solo or with a friend?"                      │
│  [ Solo ]  [ 2 Player ]                                         │
│                                                                 │
│  [Back]  [Start Game!]                                          │
│  [touches Start Game!]                                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   COUNTDOWN OVERLAY                             │
│                                                                 │
│                            3                                    │
│                                                                 │
│  (animated bounce, 1 second)                                    │
│  [touches anywhere — no effect, locked]                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                            2                                    │
│  (animated bounce, 1 second)                                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                            1                                    │
│  (animated bounce, 1 second)                                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                          Go!                                    │
│  (larger, brighter, rapid zoom-in-and-out)                      │
│  (lasts 500ms, then fades away)                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      GAME BOARD                                 │
│                                                                 │
│  ┌─ STATUS BAR ──────────────────────────────────────────────┐ │
│  │ Division | Hard | Timer: 00:15 | Guesses: 5 | Pairs: 3/8 │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────┐         ┌──────────────┐                     │
│  │ Pick a card  │         │ Then find    │                     │
│  │ from here    │         │ the answer   │                     │
│  └──────────────┘         └──────────────┘                     │
│                                                                 │
│  ┌─ LEFT COLUMN (Prompts) ─┐   ┌─ RIGHT COLUMN (Answers) ─┐  │
│  │ [18 ÷ 3]  [10 x 4]      │   │ [21]  [6]  [40]  [6]     │  │
│  │ [2 x 7]   [12 ÷ 2]      │   │ [14]  [4]  [8]   [12]    │  │
│  │ [3 x 7]   [6 ÷ 2]       │   │ [6]   [3]  [24]  [5]     │  │
│  │ [20 ÷ 10] [4 x 3]       │   │ [2]   [7]  [12]  [15]    │  │
│  └─────────────────────────┘   └─────────────────────────┘   │
│                                                                 │
│  Player taps left card → flips, reveals "18 ÷ 3"               │
│  Player taps right card → flips                                │
│    → If match: success! cards disappear                        │
│    → If no match: red flash, shake, flip back                 │
│                                                                 │
│  (Can restart/return to menu via header button)                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
         (continues until all pairs matched)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   END GAME MODAL                                │
│                                                                 │
│  SOLO MODE:                  2-PLAYER MODE:                    │
│  ┌──────────────────────┐    ┌──────────────────────┐          │
│  │ You did it!          │    │ Game Complete!       │          │
│  │                      │    │                      │          │
│  │ Time: 2m 34s         │    │ Player A:    5       │          │
│  │ Guesses: 12          │    │ Player B:    3       │          │
│  │ Accuracy: 67%        │    │                      │          │
│  │                      │    │ Player A wins!       │          │
│  │ [Play Again]         │    │    (with crown)      │          │
│  │ [Return to Menu]     │    │                      │          │
│  │                      │    │ [Play Again]         │          │
│  │                      │    │ [Return to Menu]     │          │
│  └──────────────────────┘    └──────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                [touches Play Again]
                              ↓
                       (back to SETUP SCREEN)
```

---

## 3. Per-Screen UX Specification

### 3.1 START SCREEN

**Purpose:** Welcoming entry point, no decisions yet. Set a fun, playful tone.

**Layout (all screen sizes):**
- Centered vertically and horizontally
- Full-width gradient background (bright, colourful — e.g., soft blue to soft purple)
- Logo/title area at top third
- Subtitle below
- Large button at bottom

**Components:**

| Element | Content | Style Notes |
|---------|---------|-------------|
| **Logo** | "Maths Match" (or "Maths Match" with a playful icon: 2 overlapping cards with numbers) | Large, bold, friendly font (e.g. Nunito, Poppins, or system sans-serif). Colour: bright, contrasting to background. |
| **Subtitle** | "Match the cards and test your maths skills" | Smaller, lighter text. Encouraging tone, not intimidating. |
| **Button** | "Start New Game" | Full width (90% of container), ~60px height. Bright colour (e.g. lime green, hot pink, or vibrant orange). Rounded corners (24px radius). Large, readable text (18px+). Tap target at least 60×60px. |

**Interaction:**
- Tapping "Start New Game" navigates to the Setup Screen.
- No other interactions on this screen.

**Visual feedback:**
- Button hover state: slightly brighter/lighter shadow for desktop.
- Button press state: brief scale-down (98%) for tactile feedback.

---

### 3.2 SETUP SCREEN

**Purpose:** Configure the game before starting. Guide the child through three simple choices without overwhelming.

**Layout (all screen sizes):**
- Vertically stacked questions, one at a time or all three visible (designer choice; recommend all three for clarity, but with clear visual separation).
- On mobile, questions stack vertically. On desktop/tablet, can be left-aligned in a column.
- Each question has a clear label and 2–4 button options.

**Components:**

| Section | Content | Style Notes |
|---------|---------|-------------|
| **Header** | "Set up your game" or "Choose your challenge" | Title text, smaller than start screen, friendly. |
| **Question 1** | "What maths type?" | Label text (16px, friendly). |
| **Options 1** | `[Multiplication]` `[Division]` | Two buttons, equal width, side-by-side on desktop, stacked on mobile. ~50px height each. Background: light colour, no fill (outline style) until selected. Selected: brighter fill + checkmark or border glow. |
| **Question 2** | "Choose your difficulty" | Label text (16px, friendly). |
| **Options 2** | `[Easy]` `[Not So Easy]` `[Pretty Tricky]` `[Really Hard]` | Four buttons. On desktop: all in one row. On tablet: two rows, two per row. On mobile: two rows, two per row. ~50px height. Same selected/unselected styling as Q1. Descriptions optional: "4 pairs" under "Easy", etc. |
| **Question 3** | "Play solo or with a friend?" | Label text (16px, friendly). |
| **Options 3** | `[Solo]` `[2 Player]` | Two buttons, equal width, side-by-side on desktop, stacked on mobile. Same styling. |
| **Action Buttons** | `[Back]` `[Start Game!]` | At the bottom. Back: smaller, outline style, left side. Start Game: full-width, bright fill, 60px height, right side (or full width on mobile). |

**Interaction:**
- Tapping an option selects it (visual highlight).
- Tapping again de-selects (optional; allow single selection only).
- All three questions must be answered before "Start Game!" can be tapped (or grey it out until ready).
- "Back" returns to the Start Screen without saving choices.
- "Start Game!" navigates to the Countdown Screen.

**Visual feedback:**
- Selected option: bright border (4px) or filled background + white text.
- Unselected option: light border or transparent with text only.
- Hover state on desktop: subtle shadow or scale increase.
- Button press: brief scale-down (98%).

---

### 3.3 COUNTDOWN OVERLAY

**Purpose:** Build anticipation before gameplay starts. Lock all interactions. Make it feel fun, not stressful.

**Layout (all screen sizes):**
- Full-screen overlay (semi-transparent dark background, e.g. rgba(0,0,0,0.3)).
- Centered large number in the middle of the screen.

**Components:**

| Element | Content | Style Notes |
|---------|---------|-------------|
| **Number Display** | `3`, then `2`, then `1`, then `Go!` | Extremely large font (120px–200px depending on screen). Bright, bold colour (white, or a vibrant single colour). Centred both horizontally and vertically. |
| **Duration per number** | 1 second each for 3, 2, 1. 500ms for "Go!" | |
| **Animation** | Bounce/scale effect: grows briefly, shrinks back. Or fade-in-and-out. | Smooth CSS keyframe animation. Not too bouncy (looks silly) but noticeable. |

**Interaction:**
- All interactions are locked. Tapping anywhere does nothing.
- No visible countdown timer or progress bar (just the number).

**Visual feedback:**
- After "Go!" fades out, the overlay disappears instantly and the game board is revealed.

---

### 3.4 GAME BOARD

**Purpose:** The main gameplay area. Must clearly show left prompts and right answers, communicate turn state, and track progress.

**Layout (all screen sizes):**
- Top: Status Bar (fixed or sticky).
- Below: Two-column layout (left prompts, right answers).
  - **Desktop (>1024px):** true side-by-side, roughly equal widths, padding between.
  - **Tablet (768–1024px):** side-by-side, possibly narrower cards.
  - **Mobile (<768px):** Stack vertically (left column on top, right column below) with clear labels "Pick from here first" and "Then find the answer".
- Bottom: Completed Pile count or visual progress indicator.

**Components:**

#### 3.4.1 Status Bar

| Element | Show In | Content | Style |
|---------|---------|---------|-------|
| **Mode + Difficulty** | Always | "Multiplication — Hard" or "Division — Easy" | Left-aligned, small text (12–14px), muted colour. |
| **Timer** | Solo only | "Time: 1m 23s" | Centre-left, medium text (16px), bright colour to draw attention. Updates every 1s. |
| **Guesses** | Solo only | "Guesses: 7" | Centre, medium text (16px). |
| **Matches** | Solo + 2P | "3 of 8 pairs" or "Pairs matched: 3/8" | Centre-right, medium text (16px). |
| **Turn Indicator** | 2P only | "Player A's turn" (with colour/icon to distinguish). | Centre, medium text (16px), bold. Changes when turn switches. |
| **Scores** | 2P only | "Player A: 3  •  Player B: 1" | Right-aligned, medium text (16px). |
| **Reset Button** | Always | "New Game" or restart icon. | Far right, small button (~40×40px). Hover: tooltip "Start Over". |

**Status Bar Style:**
- Background: light, semi-transparent or subtle gradient.
- Text: high contrast with background.
- Height: ~60–80px on desktop, may compress on mobile.
- Border-bottom: subtle line (1px, light grey) to separate from board.

#### 3.4.2 Left Column (Prompts)

| Element | Content | Style |
|---------|---------|-------|
| **Column Label** | "Pick a maths card" | Above the cards, friendly small text (14px). |
| **Cards** | Face-down or revealed | See Card Spec below. |

**Layout:**
- Vertical stack on mobile.
- Grid (2 columns on tablet, 2–3 on desktop depending on pair count).
- Cards arranged in a neat grid, centred.
- Padding/gap between cards: 12–16px.

#### 3.4.3 Right Column (Answers)

| Element | Content | Style |
|---------|---------|-------|
| **Column Label** | "Find the answer" | Above the cards, same style as left label. |
| **Cards** | Face-down or revealed | See Card Spec below. |

**Layout:**
- Same grid arrangement as left column, independent shuffle.
- Positioned to the right of left column on desktop/tablet.
- Below left column on mobile.

#### 3.4.4 Card Component Spec

**Card Size:**
- Desktop: ~100–120px square (48–52pt tap target for 6-year-old fingers).
- Tablet: ~90–110px.
- Mobile: ~80–100px (ensure at least 44px, aim for 60px+).

**Card States:**

| State | Visual | Interaction |
|-------|--------|-------------|
| **Face Down** | Solid colour background (e.g. bright blue, pink, or purple), rounded corners (8px), subtle shadow. Centred icon/pattern (optional: e.g. a question mark, star, or card suit symbol). | Tappable if not matched and appropriate side. |
| **Face Up / Revealed** | Shows text (left: maths prompt; right: numeric answer). Background: white or light. Same rounded corners, shadow. Text centred, large font (24–32px), bold. | May be disabled if it's a right card and no left card is selected. |
| **Selected** | Glow effect (e.g. 2–4px outer shadow in bright colour, e.g. gold, lime green). Slightly raised shadow (scale up by 1–2px). | Not tappable again immediately (could be replaced by another left-side selection). |
| **Matched** | Fade out or shrink animation (300–400ms). Removed from board or moved to a "Completed" section. | Not tappable. |
| **Incorrect** | Red glow or red overlay, shake animation (300ms, 2–3px side-to-side movement). Brief pause (200ms) so player sees the mismatch. Then flips back. | Not tappable during animation. |

**Flip Animation:**
- Direction: 3D rotate on Y-axis (rotateY) so it looks like a card flip.
- Duration: 300ms (smooth but snappy).
- Easing: ease-in-out (cubic-bezier).
- CSS: `transform: rotateY(180deg)`; `backface-visibility: hidden`.

---

### 3.5 END GAME MODAL

**Purpose:** Celebrate completion and show final stats. Offer replay or navigation options.

**Layout (all screen sizes):**
- Centered modal, ~80% width on mobile, ~60% on tablet, ~50% on desktop.
- Minimum padding inside modal: 24px.
- Modal background: white or very light colour.
- Backdrop: semi-transparent dark overlay (rgba(0,0,0,0.5)).

**Components — SOLO MODE:**

| Element | Content | Style |
|---------|---------|-------|
| **Header** | "You did it!" or "Great job!" | Large, bold, celebratory (32px+). Colour: bright (e.g. lime green, hot pink). |
| **Subheader** | Optional: "You've matched all the pairs!" | Smaller, friendly text (16px). |
| **Stats** | Time: X m Yss Guesses: Z Accuracy: W% | Organized in a list or grid. Each stat on its own line or in columns. Medium text (16–18px). |
| **Confetti** | (Optional delight) | Small confetti animation around the "You did it!" text (e.g. canvas-confetti burst). |
| **Action Buttons** | `[Play Again]` (same settings) `[New Game]` or `[Return to Menu]` (go back to Setup) | Two buttons, stacked vertically on mobile, side-by-side on desktop. Bright colours, ~50–60px height. Play Again is primary (brighter). Return to Menu is secondary (outline style). |

**Components — 2-PLAYER MODE:**

| Element | Content | Style |
|---------|---------|-------|
| **Header** | "Game Complete!" | Large, bold (32px+). Neutral colour (e.g. dark blue). |
| **Scores** | Player A: 5   Player B: 3 | Large numbers (36–48px), one per line or side-by-side. Colours: distinct for each player (e.g. red for A, blue for B). |
| **Winner** | "Player A wins!" or "It's a tie!" | Very large, bold, celebratory (40px+). Colour: gold or bright. Winner only: crown emoji or icon (optional, but delightful). |
| **Confetti** | Full-screen confetti burst if there's a clear winner. | |
| **Action Buttons** | `[Play Again]` `[New Game]` | Same as Solo mode. |

**Modal Animation:**
- Entrance: fade-in + scale-up (starts at 90%, grows to 100%) over 400ms.
- Exit (if Play Again): fade-out over 300ms.

---

## 4. Interaction Patterns

### 4.1 Selection and Validation Flow

**Solo or 2-Player (same flow):**

1. **Waiting for Left Selection**
   - Status: Game board displayed, all left cards tappable.
   - Right cards: visually disabled (muted colour, lower opacity, or explicit label "disabled").
   - User taps a left card.

2. **Left Card Selected**
   - Immediately: left card flips over (300ms animation) to reveal the prompt.
   - Visual: card shows glow or selection indicator.
   - Status: right cards are now tappable. Left cards are disabled (no re-selection).
   - User taps a right card.
   - (If user taps another left card first: in 2-player, no effect; in solo, similar — left re-selection may be allowed per gameplay state docs, but UX should show it clearly.)

3. **Both Cards Selected**
   - Right card flips (300ms animation) to reveal the answer.
   - Immediate validation (no explicit "check" button; validation is automatic).
   - Board is locked (no more taps).

4a. **Match is Correct**
   - Both cards glow green or show a checkmark overlay.
   - Optional: confetti burst around the cards.
   - Both cards fade out or shrink (300–400ms total animation).
   - Cards are removed from the board and counted in the "Matched" stat.
   - Scores update: Solo matches += 1, guesses += 1. 2-Player: current player score += 1.
   - Board unlocks.
   - Game continues (waiting for next left selection).

4b. **Match is Incorrect**
   - Both cards glow red or show a red X.
   - Shake animation on both cards (300ms, 2–3px oscillation).
   - Pause (200–300ms) so player sees the mismatch clearly.
   - Both cards flip back to face-down (300ms animation).
   - Scores update: Solo guesses += 1 (but matches does not). 2-Player: same, and turn switches.
   - Board unlocks.
   - Game continues.

### 4.2 Two-Player Turn Switching

**On Correct Match:**
- Same player continues (allowed to play again immediately).
- UI clearly shows "Player A's turn" remains or updates to show the current player's name in a distinct colour.

**On Incorrect Match:**
- Turn switches to the other player.
- UI: "Player A's turn" → "Player B's turn" (with a brief transition or animation).
- Scores remain as they are.
- Next player taps to select a left card.

### 4.3 Rapid Click Protection

**During any animation (flip, shake, success fade, etc.):**
- Board is locked: `isLocked = true` in the reducer.
- Tapping any card has no effect (silent ignore, no error message or visual feedback).
- No visual change on the card (no hover state).
- When animation completes, lock is released and board becomes tappable again.

**Benefit for children:** Prevents accidental double-taps from breaking the game or causing confusion.

### 4.4 Right Card Selection Before Left Card

**User taps a right card first (before any left card is selected):**
- Reducer ignores the action (no state change).
- UI: right card does not flip or respond.
- Optional visual hint: right cards could have a subtle "disabled" opacity or label "Pick from the left first" (but only if not cluttering the UI).
- No error message or negative tone.

### 4.5 Restart / Return to Menu

**At any time during gameplay:**
- Tap the "New Game" button in the Status Bar header.
- Confirmation (optional): "Are you sure you want to start over? Your progress will be lost."
- Tapping "Yes" resets the game and returns to the Setup Screen.
- Tapping "No" closes the confirmation and continues the game.

**At the end of the game:**
- Modal shows "Play Again" (same settings, new board) and "New Game" (return to Setup).
- No confirmation needed; state is already complete.

---

## 5. Copy / Text Guidance

All text should be:
- Simple and friendly.
- Free of jargon (no "validate", "incorrect attempt", etc.).
- Encouraging and never harsh.
- Age-appropriate for 6–10-year-olds but not condescending.
- Brief (1–3 words for buttons, simple sentences for labels).

### 5.1 Button and Label Copy

| Location | Text | Notes |
|----------|------|-------|
| **Start Screen** | "Start New Game" | Warm, inviting CTA. |
| **Setup: Q1** | "What maths type?" | Casual, conversational. |
| **Setup: Option 1a** | "Multiplication" | Straightforward. |
| **Setup: Option 1b** | "Division" | Straightforward. |
| **Setup: Q2** | "Choose your difficulty" | Slightly motivating ("challenge yourself"). |
| **Setup: Option 2a** | "Easy" | Confidence builder. |
| **Setup: Option 2b** | "Not So Easy" | Friendly understatement; not "Medium" or "Normal". |
| **Setup: Option 2c** | "Pretty Tricky" | Playful, fun escalation. |
| **Setup: Option 2d** | "Really Hard" | Honest but not intimidating. |
| **Setup: Q3** | "Play solo or with a friend?" | Inclusive language ("friend" not "opponent"). |
| **Setup: Option 3a** | "Solo" | Short, clear. Alternatives: "Just me". |
| **Setup: Option 3b** | "2 Player" | Clear. Alternatives: "With a friend", "Pass and play". |
| **Setup: Button** | "Start Game!" | Exclamation mark for excitement. |
| **Setup: Button** | "Back" | Simple navigation. |
| **Status Bar: Label** | "Pick a maths card" (left) | Instruction, casual. |
| **Status Bar: Label** | "Find the answer" (right) | Instruction, friendly. |
| **Status Bar: Button** | "New Game" or restart icon | Minimal, clear. Tooltip on hover: "Start Over". |
| **End Game: Header (Solo)** | "You did it!" | Celebratory, warm. Alternatives: "Great job!", "All done!". |
| **End Game: Header (2P)** | "Game Complete!" | Neutral, inclusive. |
| **End Game: Stat (Solo)** | "Time: X m Ys" | Straightforward. |
| **End Game: Stat (Solo)** | "Guesses: Z" | Straightforward. |
| **End Game: Stat (Solo)** | "Accuracy: W%" | Optional. Definitions: (correct guesses / total guesses × 100). |
| **End Game: Stat (2P)** | "Player A: 5" | Plain score display. |
| **End Game: Winner (2P)** | "Player A wins!" | Celebratory. |
| **End Game: Tie (2P)** | "It's a tie!" | Encouraging (no loser). |
| **End Game: Button** | "Play Again" | Replay with same settings. |
| **End Game: Button** | "New Game" or "Return to Menu" | Go back to Setup. |

### 5.2 Inline Feedback (Non-Interactive)

| Situation | Text | Duration / Placement |
|-----------|------|----------------------|
| **Correct match** | Optional: "Great!" or "Yes!" (brief toast or pop-up text). | 500ms, fades out with the matched cards. |
| **Incorrect match** | Optional: "Oops, try again!" (brief toast). | 300ms, appears during the shake animation. |
| **Game complete** | (See End Game Modal) | Modal duration (until user taps a button). |

### 5.3 Help Text / Tooltips (Optional, Minimal)

| Trigger | Text | Show When |
|---------|------|-----------|
| **Right cards muted** | "Pick from the left first" | On hover on desktop, or visible persistently on mobile if space allows (but avoid clutter). |
| **Board locked** | (No text; just silent ignore of taps) | During animations. |
| **Restart button hover** | "Start a new game" or "Restart" | On desktop hover. |

---

## 6. Animation Recommendations

### 6.1 Card Flip Animation

**Trigger:** User taps a card (left or right).

**Duration:** 300ms

**Properties:**
- Transform: `rotateY(180deg)` (3D flip on Y-axis).
- Easing: `ease-in-out` (cubic-bezier(0.4, 0, 0.2, 1)).
- Backface: hidden on the back layer so the opposite side doesn't show through.

**CSS Pseudo-code:**
```css
.card {
  transform-style: preserve-3d;
  transition: transform 300ms ease-in-out;
}
.card.flipped {
  transform: rotateY(180deg);
}
.card-front, .card-back {
  backface-visibility: hidden;
  position: absolute;
}
.card-back {
  transform: rotateY(180deg);
}
```

**Perception:** Should feel smooth and satisfying, like a real card being flipped.

---

### 6.2 Incorrect Match Feedback

**Trigger:** Both cards selected and answer is wrong.

**Duration:** Total ~700ms (shake + pause + flip back).

**Breakdown:**
- 300ms: Shake animation (2–3px side-to-side oscillation). Red glow overlay on both cards.
- 200ms: Pause (cards stay shaking, no further movement). Red glow remains visible.
- 200ms: Flip back to face-down (same 3D flip as reveal, but reversed).

**CSS Keyframes (Shake):**
```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}
.card.incorrect {
  animation: shake 300ms ease-in-out;
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.8); /* red glow */
}
```

**Perception:** Very clear that the match was wrong, but not harsh or scary.

---

### 6.3 Correct Match Feedback

**Trigger:** Both cards selected and answer is correct.

**Duration:** Total ~800ms.

**Breakdown:**
- 0–300ms: Both cards briefly glow green. Optional: subtle scale-up (1.05x) for emphasis.
- 300–500ms: Green glow fades. Cards shrink and fade out (scale to 0.8, opacity to 0) OR slide toward a "completed" area.
- 500–800ms: Cards fully removed from the board.

**CSS Keyframes (Success Exit):**
```css
@keyframes successExit {
  0% {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(0, 255, 0, 1);
  }
  50% {
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
  }
  100% {
    transform: scale(0.8);
    opacity: 0;
  }
}
.card.matched {
  animation: successExit 500ms ease-out forwards;
}
```

**Optional: Confetti Burst**
- Use `canvas-confetti` library.
- Burst originates from the center of one or both matched cards.
- Duration: 1500ms.
- Intensity: moderate (50–100 confetti pieces).

**Perception:** Celebratory and rewarding.

---

### 6.4 Countdown Animation

**Trigger:** Game is about to start (after Setup).

**Duration:** 3.5 seconds total (1s each for 3, 2, 1; 500ms for "Go!").

**Per-number animation (e.g., "3"):**
- 0–400ms: Scale from 0.5 to 1.2 (grow).
- 400–900ms: Scale from 1.2 to 1.0 (settle).
- 900–1000ms: Fade out (opacity 1 → 0).
- Next number appears at 1000ms.

**"Go!" animation:**
- Appears after "1" fades.
- 0–200ms: Scale from 0 to 1.5 (rapid, energetic).
- 200–500ms: Scale from 1.5 to 1.0, opacity remains 1.
- 500ms: Fade out and overlay disappears.

**CSS Keyframes:**
```css
@keyframes countdownBounce {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }
  40% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}
.countdown-number {
  animation: countdownBounce 1000ms ease-out forwards;
  font-size: 150px;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}
```

**Perception:** Fun and exciting, builds anticipation without being stressful.

---

### 6.5 End Modal Entrance

**Trigger:** Game complete screen is shown.

**Duration:** 400ms.

**Animation:**
- Scale: 0.8 → 1.0.
- Opacity: 0 → 1.
- Easing: ease-out.

**CSS:**
```css
@keyframes modalEnter {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
.modal {
  animation: modalEnter 400ms ease-out;
}
```

**Perception:** Smooth, celebratory arrival of the results screen.

---

### 6.6 Status Bar / Score Update

**Trigger:** Scores are updated (after a correct match).

**Duration:** 200ms (subtle).

**Animation:** Brief scale/pulse on the updated stat (e.g., the "Guesses" or "Player A Score" number).

**CSS:**
```css
@keyframes scorePulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
.stat.updated {
  animation: scorePulse 200ms ease-out;
}
```

**Perception:** Draws attention to the score change without distracting.

---

### 6.7 Transition Between Screens

**All screen transitions (Start → Setup → Countdown → Playing → Complete):**
- Fade out the current screen (200ms opacity 1 → 0).
- Fade in the next screen (200ms opacity 0 → 1).
- No overlap; sequential fade.
- Alternative: slide transition (e.g. new screen slides up from bottom), but fade is simpler and works on all device sizes.

---

### 6.8 Respecting `prefers-reduced-motion`

**For users with motion sensitivity:**
- Animations should respect the `prefers-reduced-motion` CSS media query.
- Recommendation: keep animations (do not disable entirely) but reduce duration and easing:
  - Flip: 300ms → 150ms, no easing (linear).
  - Shake: disable (just show red glow, no movement).
  - Countdown: 1000ms per number → 500ms per number, linear scale.
  - Success/failure: fade effects only, no scale/movement.

**CSS:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  /* Or, more specifically: */
  .card {
    transition-duration: 150ms;
    transition-timing-function: linear;
  }
}
```

---

## 7. Child-Friendliness Checklist

- [ ] **No harsh error messages.** Instead of "WRONG", show a gentle red glow and shake. Instead of "INVALID", silently ignore incorrect actions.
- [ ] **Large tap targets.** Minimum 44×44px, ideally 60×60px+. Cards are ~100–120px.
- [ ] **Clear visual hierarchy.** Prompts and answers are in distinct zones (left and right, or top and bottom).
- [ ] **Encouraging tone in copy.** "You did it!", "Great job!", "Let's try another one!".
- [ ] **No timers that create stress.** Solo mode shows elapsed time, but it's informational, not a countdown that runs out.
- [ ] **No penalties or lives.** Wrong guesses don't reduce a score; they're just wrong. Each turn is a fresh start.
- [ ] **Bright, playful colours.** Avoid muted or dark tones. Use primary colours (red, blue, yellow, green) and pastels.
- [ ] **Rounded corners on all interactive elements.** Feels softer and more inviting.
- [ ] **Smooth, satisfying animations.** Flip is smooth (300ms), not instant or too slow. Success is celebratory, failure is brief and not embarrassing.
- [ ] **Clear feedback on every action.** Tapping a card → it flips. Correct match → green glow + removal. Wrong match → red glow + flip back. No ambiguity.
- [ ] **No text-heavy instructions.** Use labels like "Pick a card" and "Find the answer", not paragraphs.
- [ ] **Accessible fonts.** Use sans-serif (e.g. Nunito, Poppins, Arial) with sufficient contrast (WCAG AA minimum).
- [ ] **No flashing or seizure-inducing animations.** Avoid rapid flashing (>3Hz). All animations are smooth, not stroboscopic.
- [ ] **Pause/resume not required for v1.** Game flows continuously; no pause button needed.
- [ ] **Two-player mode is collaborative, not competitive.** Show both players' scores equally. Use neutral language ("Player A" and "Player B" are equals, not "winner" and "loser" until the end).
- [ ] **End-of-game celebration.** Even if a player loses in 2-player mode, show a tie or a friendly "Well played!" message. Avoid harsh winner/loser framing.

---

## 8. Risks and Open Questions

### Risk 1: Animations too fast on slower devices
**Mitigation:** Test on real tablets and phones (iPad 2, older Android tablets). If animations stutter, reduce complexity:
- Replace `rotateY` with `scaleX` if 3D transforms are slow.
- Simplify confetti particles (fewer pieces, larger).
- Use `will-change: transform` to hint hardware acceleration.

### Risk 2: Cards too small on mobile
**Mitigation:** Enforce minimum 60×60px tap target on all screen sizes. On mobile, this may require larger cards (possibly 80–100px) and fewer cards per row (1 column on very small screens).

### Risk 3: Countdown overlay blocks interactions too long
**Mitigation:** Ensure countdown completes in ≤4 seconds total. If the user taps the screen during countdown, silently ignore (do not dismiss early). Once "Go!" fades, reveal the board instantly (no delay).

### Risk 4: Confetti library too heavy or slow
**Mitigation:** Use `canvas-confetti` (~10 KB minified). If performance is poor, simplify to a CSS-based particle animation (less polished but lighter). Or disable confetti on low-power devices.

### Risk 5: Timer accuracy on 2-player mode
**Mitigation:** For v1, 2-player mode does not require a timer. If added later, use `Date.now()` delta (not an incrementing counter) to avoid drift.

### Risk 6: Unclear "pick left first" rule on mobile
**Mitigation:** Keep the left column label "Pick a maths card" persistent. On mobile, physically place the left column above the right column with space between. Consider a subtle disabled state on right cards until a left card is selected (lower opacity, greyed-out text, or explicit label).

### Risk 7: End modal too small to read on mobile
**Mitigation:** Ensure modal is at least 80% of viewport width on mobile. Font sizes: title ≥32px, stats ≥18px, buttons ≥16px text.

---

## 9. Recommended Next Handoff

**Primary: `visual-ui-builder` (claude-sonnet-4-6)**

This UX spec is now ready for implementation. The visual-ui-builder should:
- Create the React component tree from Section 3 (Start Screen, Setup Screen, Countdown, Game Board, End Modal).
- Implement all animations from Section 6 using CSS modules and the `canvas-confetti` library.
- Apply the copy from Section 5 to all UI elements.
- Ensure responsive layout (mobile, tablet, desktop) per the layout notes in Section 3.
- Follow the interaction patterns in Section 4 (defer detailed state logic to the gameplay-state-designer output; this document focuses on UX).
- Use the colour palette and typography recommendations (bright, rounded, child-friendly).

**Secondary: `qa-test-designer` (claude-haiku-4-5)** (after visual-ui-builder completes)

Produce acceptance tests and edge-case tests using this UX spec and the gameplay-state-designer spec:
- Verify all copy is present and correct.
- Verify all animations are smooth and respect `prefers-reduced-motion`.
- Verify tap targets are ≥44×44px on all screen sizes.
- Verify modal layout on mobile (≥80% width, readable text).
- Verify colour contrast (WCAG AA).
- Verify focus states on buttons (keyboard navigation).

---

## Artefacts Produced

- This document: `.claude/outputs/ux-game-designer.md`
- Defines: screen flow, per-screen layout and copy, interaction patterns, animation keyframes, child-friendly checklist, risks, and handoff.

## Dependencies

- **Upstream:** requirements.md, frontend-architect.md, gameplay-state-designer.md
- **Downstream:** visual-ui-builder (implementation), qa-test-designer (verification)

## Open Questions for Consensus

1. **Mobile card layout:** Should the right column be below the left on mobile, or should both columns be visible at 50% width (requiring horizontal scroll)? Recommend vertical stacking for clarity.

2. **Confetti:** Is the `canvas-confetti` library acceptable for v1, or should confetti be CSS-based animation only? Recommend canvas-confetti for delight; CSS fallback if performance is an issue.

3. **Status bar height:** Fixed or sticky (scrolls with content)? Recommend sticky so it's always visible during gameplay.

4. **Card grid density:** For "Really Hard" (10 pairs, 20 cards total), how many cards per row on mobile (1, 2, or 3)? Recommend 2 per row for balance of tap target size vs. visible board.

5. **2-Player timer:** Should 2-player mode show elapsed time, or just match count? PRD says "optional timer". Recommend showing match count only for v1; timer can be added later if desired.

These are not blockers; reasonable defaults are provided above. Confirm with the stakeholder if any deviation is preferred.

