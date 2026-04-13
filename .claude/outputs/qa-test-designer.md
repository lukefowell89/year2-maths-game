# QA Test Designer — Maths Match

Produced by: `qa-test-designer` (claude-haiku-4-5)
Date: 2026-04-13

---

## 1. Assumptions

- The app uses a single-screen state machine driven by a `phase` enum: `idle` → `setup` → `countdown` → `playing` → `complete`.
- The reducer is the authoritative lock. All interaction guards are verified both in the reducer and (optionally) in the UI via `isLocked` flag.
- Board generation is called during the countdown phase and returns unique (non-duplicate) answer values per round.
- Animations are CSS-based with JavaScript `setTimeout` fallbacks to dispatch resolution actions.
- The solo timer uses `Date.now()` delta, not an incrementing counter. Timer is stopped when `phase !== 'playing'`.
- "Guess" in solo mode = one complete left+right attempt, counted when validation occurs (not when resolution completes).
- 2-player mode uses fixed names "Player A" and "Player B"; no custom names in v1.
- Rapid clicking is mitigated by `isLocked: true` preventing all card selections during animation.
- All tests are manual (no automated test framework code). Tests are written for human or engineer execution.
- Static build tests assume the app is built to `dist/` via `npm run build` and can be served from any root path with relative asset paths.

---

## 2. Test Strategy

### Approach
- **Scope:** UI flows, state transitions, edge cases, animation locks, scoring accuracy, responsive layouts, and deployment readiness.
- **Priority levels:**
  1. **Critical (must pass):** Setup flow, board solvability, left-first selection enforcement, match validation, game completion, solo/2-player scoring
  2. **High (should pass):** Rapid clicking, animation timing, timer accuracy, 2-player turn switching, restart flows, responsive layouts
  3. **Medium (nice to pass):** Accessibility, animations, visual feedback, deployment checks
- **Execution method:** Manual testing by a human or QA engineer using the running app in a browser.
- **Device coverage:** Desktop (Chrome/Edge), tablet (iPad or DevTools tablet mode), mobile (iPhone or Android equivalent, or DevTools mobile mode).

### Key areas to test
1. Start → Setup → Countdown → Playing → Complete flow
2. Board generation validity and no-duplicate-answer guarantee
3. Left-first selection enforcement with right-side card click during waiting state
4. Match evaluation and animation resolution
5. Solo mode timer, guess counting, final stats
6. 2-player turn switching and score tracking
7. Rapid clicking / double-tap resilience
8. Restart and replay flows
9. Responsive design at breakpoints
10. Static build and relative asset paths

---

## 3. Core Functional Test Cases

All test cases use the Given/When/Then format.

### 3.1 Start Screen and Navigation

**TC-001: Start screen renders on first load**
- Given: App is first loaded
- When: Page fully loads
- Then: Start screen is visible with title "Maths Match" (or similar), a subtitle, and a "Start New Game" button

**TC-002: Navigation to setup screen**
- Given: Start screen is displayed
- When: User clicks "Start New Game" button
- Then: Setup screen appears with options for game mode (Multiplication/Division), difficulty, and player mode (Solo/2 Player)

**TC-003: All setup options are selectable**
- Given: Setup screen is displayed
- When: User clicks each option (Multiplication, Division, Easy, Not So Easy, Pretty Tricky, Really Hard, Solo, 2 Player)
- Then: Each option toggles visually (selected state is clear) and state updates correctly

### 3.2 Countdown Phase

**TC-004: Countdown appears after pressing Start Game**
- Given: Setup choices are confirmed (e.g., Multiplication, Easy, Solo)
- When: User clicks "Start Game" button
- Then: A countdown overlay appears with 3, 2, 1 sequence visible and then "Go!" or similar

**TC-005: Countdown blocks all interaction**
- Given: Countdown overlay is active
- When: User attempts to click cards on the board behind the overlay
- Then: No cards are selected; clicks are ignored

**TC-006: Countdown duration is reasonable (approx 3-4 seconds)**
- Given: Countdown starts
- When: Timer runs through 3, 2, 1, Go
- Then: Countdown completes in approximately 3-4 seconds and transitions to playing state

**TC-007: Timer does not start during countdown**
- Given: Countdown is in progress (solo mode)
- When: Countdown completes and board appears
- Then: Solo timer shows 0 seconds and begins counting from that point

### 3.3 Board Generation and Layout

**TC-008: Board renders with correct pair count**
- Given: Game starts after countdown (Easy = 4 pairs, Not So Easy = 6, Pretty Tricky = 8, Really Hard = 10)
- When: Board appears
- Then: Exactly N left cards and N right cards are visible, where N matches selected difficulty

**TC-009: All cards begin face down**
- Given: Board is rendered
- When: Page loads the game board
- Then: All cards show a generic card back or placeholder; no prompt or answer text is visible

**TC-010: Left and right columns are visually distinct**
- Given: Board is displayed
- When: User observes the layout
- Then: Left column is clearly labeled or positioned on the left, right column on the right. Labels such as "Pick a maths card" (left) and "Find the answer" (right) are present or implied

**TC-011: No duplicate answer values on the board**
- Given: A round is generated
- When: Game plays and all cards are flipped
- Then: Each right-side answer card shows a unique numeric value; no two right cards show the same number

**TC-012: Board is always solvable**
- Given: A round is generated with N pairs
- When: All N prompts are matched with all N answers
- Then: Every prompt has exactly one correct answer card; the pairing is 1:1 and complete

### 3.4 Left-First Selection Enforcement

**TC-013: Clicking right card first is ignored**
- Given: Game is in playing state with no left card selected
- When: User clicks a right-side card
- Then: The right card does not flip; no selection is registered. Game remains in "waiting for left selection" state

**TC-014: Clicking left card flips it**
- Given: Game is in playing state with no card selected
- When: User clicks a left-side card
- Then: That left card flips to reveal the maths prompt. The card status changes to "face up" or "selected"

**TC-015: After left selection, right cards become selectable**
- Given: A left card is selected and face-up
- When: User clicks a right-side card
- Then: The right card flips to reveal the answer. Both cards are now visible

**TC-016: Clicking left card again while waiting for right replaces selection**
- Given: A left card is selected (face-up) and waiting for right card
- When: User clicks a different left-side card
- Then: The previously selected left card flips back to face down. The new left card flips face up. Selection transfers to the new card

**TC-017: Cannot select already-matched cards**
- Given: A pair has been matched and is no longer on the board (or shows as "completed")
- When: User attempts to click a completed card
- Then: The click is ignored; no state change occurs

### 3.5 Match Validation — Correct

**TC-018: Correct match is detected**
- Given: Player selects a left card showing "3 x 7" and right card showing "21"
- When: The match is evaluated
- Then: The system recognizes this as a correct match (pairId matches)

**TC-019: Success animation plays on correct match**
- Given: A correct match has been validated
- When: Match result is shown
- Then: A visual feedback appears (e.g., cards glow, bounce, fade out) and success sound or confetti may appear

**TC-020: Matched cards are removed from board**
- Given: A pair has been successfully matched and animation completes
- When: Animation finishes
- Then: Both cards disappear from the playing area or move to a "completed pile" visual area

**TC-021: Score is updated on correct match**
- Given: Solo mode or 2-player mode
- When: A correct match is resolved
- Then: In solo mode: matches counter increments by 1. In 2-player mode: current player's score increments by 1

**TC-022: Guess counter increments on any match attempt**
- Given: Solo mode with initial guess count = 0
- When: A complete left+right selection is made and evaluated (correct or incorrect)
- Then: Guess count increments by 1

**TC-023: Correct match allows player to keep turn (2-player)**
- Given: 2-player mode, Player A completes a correct match
- When: Match is resolved
- Then: Turn indicator still shows Player A (turn does not switch)

### 3.6 Match Validation — Incorrect

**TC-024: Incorrect match is detected**
- Given: Player selects left card "3 x 7" (answer should be 21) and right card "18"
- When: Match is evaluated
- Then: System recognizes pairIds do not match; incorrect result is triggered

**TC-025: Failure animation plays on incorrect match**
- Given: An incorrect match has been validated
- When: Match result is shown
- Then: A visual feedback appears (e.g., red outline, shake, cross burst)

**TC-026: Incorrect cards flip back to face-down**
- Given: Incorrect match animation completes
- When: Animation finishes and resolution occurs
- Then: Both selected cards return to face-down state; their content is hidden again

**TC-027: No score increment on incorrect match (solo)**
- Given: Solo mode, Player makes an incorrect guess
- When: Cards flip back
- Then: Guess counter increments but matches counter does NOT increment

**TC-028: Turn switches to other player on incorrect (2-player)**
- Given: 2-player mode, Player A makes an incorrect match
- When: Failure animation completes and resolution occurs
- Then: Turn indicator switches to Player B

**TC-029: Incorrect animation timing is consistent**
- Given: Multiple incorrect matches occur
- When: Cards flip back multiple times
- Then: Each flip-back animation duration is consistent (approx 700ms as per spec)

### 3.7 Solo Mode — Timer and Stats

**TC-030: Timer starts counting after countdown**
- Given: Solo mode, countdown completes
- When: Board appears and first card is flipped
- Then: Solo timer has started from 0 seconds and is incrementing

**TC-031: Timer continues during gameplay**
- Given: Solo mode is playing
- When: Player selects cards and makes guesses
- Then: Timer continues incrementing without pause or reset between matches

**TC-032: Timer stops on game complete**
- Given: Solo mode, last pair is matched
- When: Game completion is triggered
- Then: Timer stops incrementing at the final elapsed time

**TC-033: Guess counter starts at 0**
- Given: Solo mode begins after countdown
- When: Board is visible
- Then: Guess counter displays 0

**TC-034: Guess counter increments for each attempt**
- Given: Solo mode, guess counter = N
- When: Player selects left and right cards and match is evaluated
- Then: Guess counter becomes N+1 (regardless of correct/incorrect)

**TC-035: Matches counter tracks correct pairs only**
- Given: Solo mode, 3 correct matches and 2 incorrect attempts made
- When: Game progresses
- Then: Matches counter shows 3 (only successful matches counted)

**TC-036: Final stats modal shows correct timer value**
- Given: Solo game completes
- When: Completion modal appears
- Then: Modal displays final elapsed time (e.g., "2:34") matching the timer value

**TC-037: Final stats modal shows correct guess count**
- Given: Solo game completes with 12 total attempts
- When: Completion modal appears
- Then: Modal displays "12 guesses"

### 3.8 Two-Player Mode — Turns and Scoring

**TC-038: Turn indicator shows current player**
- Given: 2-player mode starts
- When: Board is visible
- Then: A turn indicator clearly shows "Player A's turn" or similar label

**TC-039: Player A starts the game**
- Given: 2-player mode begins
- When: Countdown completes
- Then: Turn indicator shows Player A's turn

**TC-040: Correct match keeps current player's turn**
- Given: 2-player mode, Player A's turn, Player A matches correctly
- When: Match resolves as success
- Then: Turn indicator still shows Player A (turn does not switch)

**TC-041: Incorrect match switches to other player**
- Given: 2-player mode, Player A's turn, Player A matches incorrectly
- When: Failure resolution completes
- Then: Turn indicator switches to "Player B's turn"

**TC-042: Player B can continue playing after incorrect A**
- Given: Turn switches to Player B after an incorrect A match
- When: Player B selects a left card
- Then: Player B's selection is accepted and registered

**TC-043: Scores tracked separately**
- Given: 2-player mode
- When: Player A matches 2 pairs correctly and Player B matches 3 pairs correctly
- Then: Score display shows Player A: 2, Player B: 3

**TC-044: Score increments only for correct matches by current player**
- Given: 2-player mode, current player attempts a match
- When: Incorrect match occurs (wrong selection)
- Then: Current player's score does not increment; turn switches to other player

**TC-045: Player can keep turn multiple times**
- Given: 2-player mode, Player A's turn
- When: Player A makes 5 correct matches in a row
- Then: Turn remains with Player A throughout all 5 matches; score increments to 5

### 3.9 Game Completion and End Modal

**TC-046: Game completes when all pairs matched**
- Given: X pairs generated for difficulty
- When: X pairs have been successfully matched
- Then: Game automatically transitions to "complete" phase and end modal appears

**TC-047: Solo completion modal shows correct format**
- Given: Solo game completes
- When: End modal renders
- Then: Modal displays: celebratory message, elapsed time, guess count, and "Play Again" and "Back to Menu" buttons

**TC-048: 2-player completion modal shows scores**
- Given: 2-player game completes (Player A: 6, Player B: 4)
- When: End modal renders
- Then: Modal displays both scores clearly (Player A: 6, Player B: 4)

**TC-049: 2-player winner is clearly identified**
- Given: 2-player game completes with unequal scores
- When: End modal renders
- Then: The winning player is highlighted with a crown icon or prominent visual

**TC-050: 2-player tie is shown when scores equal**
- Given: 2-player game completes with equal scores (e.g., 3-3)
- When: End modal renders
- Then: A tie message appears (e.g., "It's a tie!") instead of crowning a single winner

### 3.10 Restart and Replay

**TC-051: Play Again button restarts with same settings**
- Given: End modal is displayed
- When: User clicks "Play Again" button
- Then: Countdown appears and a new board is generated with the same mode/difficulty/playerMode. Game restarts to playing state

**TC-052: New board is different from previous round**
- Given: Two consecutive games with same settings are played
- When: Both boards are fully revealed
- Then: Card positions and/or card selections differ between rounds (shuffling is applied)

**TC-053: Stats reset on replay**
- Given: Play Again is clicked
- When: New game begins
- Then: Solo timer restarts at 0, guess count resets to 0, matches reset to 0. For 2-player, scores reset to 0-0

**TC-054: Back to Menu button returns to start screen**
- Given: End modal is displayed
- When: User clicks "Back to Menu" button
- Then: Game transitions back to start screen; setup choices are cleared

**TC-055: Restart button on game board returns to setup**
- Given: Game is in playing state (cards visible)
- When: User clicks "New Game" or "Restart" button in status bar
- Then: Game transitions back to setup screen; board and scores are cleared

---

## 4. Edge Case Test Cases

### 4.1 Rapid Clicking and Interaction Locking

**EC-001: Rapid left card clicks**
- Given: Game in playing state, no left card selected
- When: User rapidly clicks two different left cards in quick succession (< 100ms apart)
- Then: Only the first or most recent click is processed; no duplicate state corruption occurs. Final state is consistent

**EC-002: Rapid right card clicks during animation**
- Given: A match has been evaluated and animation is playing (cards locked)
- When: User clicks right-side cards rapidly while locked
- Then: All clicks are ignored. Game state remains locked until animation completes

**EC-003: Clicking left card before right card animation finishes**
- Given: A right card is in the middle of flip animation
- When: User clicks a left card
- Then: Click is ignored due to isLocked flag. No state change occurs

**EC-004: Double-tap on same card**
- Given: Card is already selected and face-up
- When: User clicks the same card again
- Then: No change; card remains face-up. If it is a left card in leftSelected state, clicking it again is a no-op

**EC-005: Spamming both left and right simultaneously**
- Given: Game is in leftSelected state (left card face-up, waiting for right)
- When: User clicks left card, then immediately right card, then immediately left again (all within 50ms)
- Then: Only the first left+right pair is processed. Subsequent clicks are queued or ignored. Final state is valid

### 4.2 Left-Card Re-selection

**EC-006: Changing left selection mid-turn**
- Given: Game in leftSelected state with left card A face-up
- When: User clicks left card B (different card)
- Then: Card A flips back to face-down. Card B flips to face-up. Board state is valid. Selection transfers to B

**EC-007: Re-selecting same left card**
- Given: Left card A is face-up and selected
- When: User clicks the same card A again
- Then: Card A remains face-up. State does not change (no-op)

### 4.3 Matched Card Interaction

**EC-008: Cannot select matched cards**
- Given: Cards (left, right) have been matched and removed from board
- When: User attempts to click where those cards were
- Then: Click is ignored; no state change (card is already removed/hidden or disabled)

**EC-009: Cannot flip matched card again**
- Given: A matched pair shows in a "completed pile" or dimmed area
- When: User attempts to click a completed card
- Then: Click has no effect

### 4.4 Final Pair Completion

**EC-010: Game completes on final pair match**
- Given: One pair remains unmatched (total N pairs)
- When: User selects the last left and right cards and they match
- Then: Match is resolved as success, cards are removed, matchedPairIds.length === N, phase transitions to complete immediately

**EC-011: Animation plays on final pair before completion modal**
- Given: Final pair is matched
- When: Success animation duration elapses
- Then: Cards animate out, RESOLVE_COMPLETE is dispatched, phase becomes complete, end modal appears

### 4.5 Board Generation Edge Cases

**EC-012: Division pool collision handling**
- Given: Division mode is selected (combines div-by-2, div-by-3, div-by-10 sub-pools)
- When: Board is generated
- Then: No two right-side cards show the same answer value. Sub-pools are sampled in a way that avoids duplicates (single sub-pool per round or de-duplication applied)

**EC-013: Smallest difficulty generates 4 pairs**
- Given: Easy difficulty is selected
- When: Board is generated
- Then: Exactly 4 left cards and 4 right cards are created

**EC-014: Largest difficulty generates 10 pairs**
- Given: Really Hard difficulty is selected
- When: Board is generated
- Then: Exactly 10 left cards and 10 right cards are created

### 4.6 Timer Edge Cases (Solo)

**EC-015: Timer accuracy over 60 seconds**
- Given: Solo game in progress
- When: 60+ seconds elapse
- Then: Timer display increments accurately (e.g., shows 1:00, 1:01, etc.). No drift or acceleration

**EC-016: Timer stops exactly on game completion**
- Given: Solo game, final pair matched
- When: Match animation completes and game transitions to complete
- Then: Timer value is frozen at the final elapsed time (e.g., 2:34). Timer does not continue incrementing

**EC-017: Tab switch during solo timer**
- Given: Solo game in progress, tab is backgrounded
- When: Tab is backgrounded for 5 seconds then brought back to focus
- Then: Timer shows elapsed time including the 5 background seconds (not paused) and continues from there

### 4.7 Two-Player Specific Edge Cases

**EC-018: Player A completes all pairs**
- Given: 2-player mode with 4 pairs
- When: Player A matches all 4 pairs correctly without error
- Then: Player A score = 4, Player B score = 0. Player A is crowned winner

**EC-019: Perfect score tie at game end**
- Given: 2-player mode, final game state is 3-3 matches each
- When: Game completes
- Then: End modal shows tie message; neither player has crown

**EC-020: Turn indicator updates after each match**
- Given: 2-player mode
- When: A series of correct and incorrect matches are made
- Then: Turn indicator updates correctly after each incorrect match, remains on same player after correct match

### 4.8 Restart and Navigation Edge Cases

**EC-021: Mid-game restart clears in-flight animation**
- Given: Game in playing state, animation is in progress (isLocked = true)
- When: User clicks "New Game" button
- Then: In-flight setTimeout is cleared, phase changes to setup, animation effects are abandoned, no orphaned state remains

**EC-022: RESOLVE_COMPLETE after restart is ignored**
- Given: Game is in playing state, animation timer is active
- When: User clicks "New Game", phase becomes setup or countdown
- Then: When in-flight RESOLVE_COMPLETE timeout fires, the action is ignored by the reducer (phase guard fails)

**EC-023: Return to menu from playing state**
- Given: Game is in playing state
- When: User clicks "Back to Menu" button
- Then: Game returns to start screen, board is cleared, scores are reset

### 4.9 Countdown Edge Cases

**EC-024: Countdown is not interruptible by back button**
- Given: Countdown overlay is active
- When: User presses browser back button
- Then: Browser navigates back (or nothing happens if it is the only state). Countdown state is preserved in React state if page is not unloaded

**EC-025: Countdown animation is smooth**
- Given: Countdown starts
- When: 3→2→1→Go sequence plays
- Then: Numbers animate smoothly with no freezes or jumps. Timing is even (approximately 1 second per number)

### 4.10 Card Animation Timing

**EC-026: Flip animation completes before reveal**
- Given: Card flip animation is CSS-based with 300ms duration
- When: User clicks a card
- Then: Card visibly flips before content appears. No content is visible during the flip motion

**EC-027: Incorrect shake animation is 700ms**
- Given: Incorrect match occurs
- When: Shake animation plays
- Then: Cards shake for approximately 700ms, then flip back to face-down. Timing is consistent across multiple attempts

**EC-028: Success animation is 800ms**
- Given: Correct match occurs
- When: Success animation plays (glow, fade, sparkle, confetti, etc.)
- Then: Animation completes in approximately 800ms. Cards are removed/hidden after this duration

---

## 5. Responsive and Device Test Cases

### 5.1 Desktop Layout

**RD-001: Desktop side-by-side layout**
- Given: App is viewed on desktop (1920x1080 or larger)
- When: Game board is displayed
- Then: Left column and right column are positioned side-by-side with clear separation

**RD-002: Cards are large and easy to click**
- Given: Desktop view with 10 pairs
- When: Cards are visible
- Then: Each card is at least 80x80px in size; tap targets are comfortable for mouse/trackpad

**RD-003: Status bar is visible and unobstructed**
- Given: Desktop view during playing state
- When: Board is displayed
- Then: Status bar (timer, scores, turn indicator) is always visible at top or side; does not overlap cards

### 5.2 Tablet Layout

**RD-004: Tablet maintains two-column feel**
- Given: App is viewed on tablet (iPad, 1024x768 or similar)
- When: Game board is displayed
- Then: Left and right columns are visible side-by-side (or stacked with clear labels if needed)

**RD-005: Tablet cards are touch-friendly**
- Given: Tablet view with 8 pairs
- When: Cards are visible
- Then: Each card is at least 70x70px. Spacing between cards allows easy touch without accidental mis-taps

**RD-006: Tablet orientation change is smooth**
- Given: Tablet is in portrait, then rotated to landscape
- When: Rotation occurs
- Then: Layout reflows without breaking. Cards remain playable. Game state is preserved

### 5.3 Mobile Layout

**RD-007: Mobile stacks columns vertically**
- Given: App is viewed on mobile (375x667 or similar)
- When: Game board is displayed
- Then: Left column appears above right column (or with clear labels). Layout is vertically scrollable if needed

**RD-008: Mobile cards are touch-friendly**
- Given: Mobile view with 6 pairs
- When: Cards are visible
- Then: Each card is at least 60x60px. Cards do not crowd the screen. Tap targets are large enough for child fingers

**RD-009: Mobile status bar is visible**
- Given: Mobile view during playing state
- When: Board is displayed
- Then: Status bar (timer, scores, turn) is visible without requiring scroll. Essential info is always accessible

**RD-010: Mobile does not require horizontal scroll for board**
- Given: Mobile view with 10 pairs (worst case)
- When: Board is fully rendered
- Then: All cards fit within viewport width. No horizontal scrolling is required to see all cards

### 5.4 Orientation and Responsive Breakpoints

**RD-011: Setup screen is responsive**
- Given: Setup screen is displayed at desktop, tablet, and mobile sizes
- When: Each breakpoint is tested
- Then: Buttons and labels are sized appropriately. No text overflow. Layout is readable

**RD-012: End modal is centered and responsive**
- Given: End modal appears at different screen sizes
- When: Modal is rendered
- Then: Modal is centered or appropriately positioned. Text is readable. Buttons are tappable at all breakpoints

**RD-013: Countdown overlay is full-screen at all sizes**
- Given: Countdown overlay appears at desktop, tablet, mobile
- When: Overlay is active
- Then: Overlay covers the full viewport. Countdown numbers are large and centered. Animation is smooth

### 5.5 Font and Text Responsiveness

**RD-014: Text is readable at smallest device**
- Given: Mobile phone (375px width)
- When: Game screens render
- Then: All text (labels, prompt text, numbers) is at least 16px or equivalent. No text is cut off

**RD-015: Prompt and answer text fit within cards**
- Given: Cards display maths prompts and answers
- When: Cards are rendered at mobile, tablet, desktop sizes
- Then: Text fits entirely within card bounds at all breakpoints. No text overflow or truncation

---

## 6. Accessibility Test Cases

### 6.1 Color Contrast and Readability

**A-001: Text contrast meets WCAG AA standard**
- Given: Any text on the page (buttons, labels, numbers)
- When: Viewed against its background
- Then: Contrast ratio is at least 4.5:1 for normal text, 3:1 for large text (per WCAG AA)

**A-002: Color is not the only indicator**
- Given: Card selected state, correct/incorrect state, turn indicator
- When: These states are displayed
- Then: Visual cues use shape, position, or text label in addition to color (e.g., selected card has border + glow, not just color change)

### 6.2 Keyboard Navigation (Nice-to-have, not required for v1)

**A-003: Buttons are keyboard navigable**
- Given: App has interactive buttons (Start, Setup choices, Play Again, etc.)
- When: Tab key is pressed to navigate
- Then: Each button receives focus (visible focus ring) and can be activated with Enter/Space (nice-to-have)

**A-004: Focus indicators are visible**
- Given: Keyboard navigation is attempted
- When: Focus shifts to interactive elements
- Then: A visible focus outline or glow appears around the focused element (nice-to-have)

### 6.3 Touch and Pointer Accessibility

**A-005: Touch targets are large**
- Given: Game cards and buttons
- When: Viewed on mobile or tablet
- Then: Touch targets are at least 48x48px (ideally 56x56px) to accommodate child fingers and motor skill variation

**A-006: Hover/active states are clear**
- Given: User hovers over or clicks a button or card
- When: State changes
- Then: Visual feedback is immediate and clear (color change, scale, shadow, cursor change)

### 6.4 Motion and Animation

**A-007: Animations are not too fast**
- Given: Card flip, shake, success animations play
- When: Animations occur
- Then: Animation duration is at least 200ms and not more than 1000ms, ensuring they are perceivable but not slow

**A-008: Reduced motion is respected (nice-to-have)**
- Given: System `prefers-reduced-motion` is enabled
- When: Game plays
- Then: Animations are simplified or removed while preserving game functionality (nice-to-have)

### 6.5 Semantic HTML and Accessibility Tree

**A-009: Buttons are semantic button elements**
- Given: Interactive elements in the app
- When: Accessibility tree is inspected
- Then: Buttons use `<button>` tags, not divs. Links use `<a>` tags. Form inputs use proper semantic HTML

**A-010: Card interactions have accessible descriptions**
- Given: Cards are clickable game elements
- When: Accessibility tree is examined
- Then: Each card has an accessible name or description (e.g., via aria-label) or is grouped under a region with a clear purpose

---

## 7. Static Deployment Verification

### 7.1 Build and Asset Integrity

**DW-001: App builds successfully**
- Given: Development environment with all dependencies installed
- When: `npm run build` is executed
- Then: Build completes without errors. `dist/` folder is created with all assets

**DW-002: Build output has expected files**
- Given: Build completes
- When: `dist/` folder is inspected
- Then: Contains `index.html`, `assets/` folder with JS/CSS chunks, `favicon.svg` (or favicon), no server files

**DW-003: No unminified files in production build**
- Given: `dist/` folder exists
- When: Contents are inspected
- Then: JavaScript and CSS files are minified. File sizes are reasonable (no obvious duplication or large uncompressed assets)

### 7.2 Static Hosting Compatibility

**DW-004: Relative asset paths in bundle**
- Given: Built app in `dist/`
- When: Served from a non-root path (e.g., https://example.com/game/)
- Then: All asset paths (JS, CSS, images) are relative (`./assets/...`) not absolute (`/assets/...`). App functions correctly

**DW-005: Single-page app fallback works**
- Given: App is served from AWS S3 with error.html or index.html fallback configured
- When: User navigates directly to a URL path (e.g., `/game/setup`) or refreshes mid-game
- Then: index.html is served. React router/state manager handles the path. App renders correctly

**DW-006: index.html is the entry point**
- Given: Static hosting is configured to serve `dist/index.html` as the default
- When: User accesses the root path
- Then: index.html loads, React bootstraps, app starts on the start screen

### 7.3 Dependency and Bundle Size

**DW-007: No server-side code in bundle**
- Given: Build output is inspected
- When: `dist/` contents are reviewed
- Then: No Node.js or backend code is present. Only browser-compatible JavaScript and static assets

**DW-008: Canvas-confetti is included if used**
- Given: App uses confetti animations
- When: Build completes
- Then: canvas-confetti library is bundled. App can call `confetti()` without additional loading

**DW-009: CSS and JS are co-located or properly linked**
- Given: Built app is served
- When: Network tab is inspected
- Then: CSS is loaded (either in JS or as separate files). No 404s for missing stylesheets

### 7.4 Browser and Environment Compatibility

**DW-010: App works in modern browsers**
- Given: Built app is served
- When: Accessed in Chrome, Firefox, Safari, Edge (latest versions)
- Then: App runs without console errors. All functionality works

**DW-011: No console errors or warnings on startup**
- Given: App loads in a browser
- When: Console is opened
- Then: No errors or critical warnings appear. React dev warnings in dev mode are acceptable; production build should have none

**DW-012: Favicon loads without 404**
- Given: App is served from static hosting
- When: Browser requests favicon
- Then: Favicon loads successfully (or 404 is graceful with no console warning)

### 7.5 Environment Variables (if applicable)

**DW-013: No hardcoded API URLs**
- Given: App code is reviewed
- When: Production build is created
- Then: No localhost URLs, dev API endpoints, or sensitive information are embedded. App is pure client-side

**DW-014: App has no backend dependencies**
- Given: App is running in browser
- When: Network tab is inspected during gameplay
- Then: No requests are made to external APIs (except optional CDN for confetti, which should be optional). Game is fully offline-capable

### 7.6 Static Hosting Platform Specifics

**DW-015: S3 static hosting works**
- Given: Built app is deployed to S3 bucket configured for static website hosting
- When: Bucket policy allows public read and error.html is set to index.html
- Then: App loads and plays correctly at the bucket URL

**DW-016: Azure Static Website works**
- Given: Built app is deployed to Azure Storage static website feature
- When: index.html fallback is configured in routing
- Then: App loads and plays correctly at the storage account URL

**DW-017: Netlify/Vercel static deploy works**
- Given: `dist/` is deployed to Netlify or Vercel
- When: Build settings are configured for static file serving
- Then: App loads and plays correctly. No build-time surprises

---

## 8. Highest-Risk Areas

Based on architecture and common game bugs, these are the areas most likely to contain defects:

### 1. **Interaction Locking and Rapid Clicking**
- **Risk:** Double-selection, out-of-order actions, state corruption during animation
- **Test focus:** EC-001 through EC-005, rapid spamming of cards, interrupt animations
- **Mitigation:** Reducer validates `isLocked` on every action. UI double-checks with pointer-events or disabled attribute

### 2. **Board Generation and Duplicate Answers**
- **Risk:** Two right cards with the same answer value, ambiguous matching
- **Test focus:** TC-011, EC-012, play multiple rounds and flip all cards
- **Mitigation:** generateRound() applies de-duplication. Pool design avoids collisions (single sub-pool per round for division)

### 3. **Timer Accuracy and Backgrounding**
- **Risk:** Timer drifts on tab switch, accumulates incorrectly, shows wrong final time
- **Test focus:** EC-015, EC-016, EC-017, leave game in background for 30+ seconds
- **Mitigation:** Timer uses `Date.now()` delta, not incrementing counter. `useTimer` watches phase and stops on non-playing

### 4. **Animation Timeout and Resolution**
- **Risk:** RESOLVE_COMPLETE fires at wrong time, animation duration doesn't match CSS, orphaned timeouts cause stale state
- **Test focus:** EC-027, EC-028, rapidly alternate between correct and incorrect matches
- **Mitigation:** Animation durations are constants shared between CSS and component. useEffect cleanup handles unmount. isLocked prevents re-entry

### 5. **2-Player Turn Switching**
- **Risk:** Turn doesn't switch on incorrect, score increments for wrong player, final winner is wrong
- **Test focus:** TC-040 through TC-045, EC-018, EC-019, play full 2-player game with tied and unequal scores
- **Mitigation:** Reducer explicitly switches activePlayer on RESOLVE_COMPLETE with resolving_failure. Scores are keyed by player

### 6. **Left-First Selection Enforcement**
- **Risk:** Right card selectable before left, left-re-selection breaks state, matched cards still clickable
- **Test focus:** TC-013 through TC-017, EC-006 through EC-009, try every wrong interaction order
- **Mitigation:** SELECT_RIGHT guarded by `turnPhase === 'leftSelected'`. Matched card check filters them from selection

### 7. **Solo Mode Guess and Match Counting**
- **Risk:** Guess counter increments wrong number of times, matches count includes incorrect attempts, timer doesn't save to final state
- **Test focus:** TC-022, TC-034, TC-035, TC-037, make intentional wrong guesses and verify counts
- **Mitigation:** Increment guesses on SELECT_RIGHT (validation time), increment matches on RESOLVE_COMPLETE (success branch only)

### 8. **Game Completion Detection**
- **Risk:** Game doesn't complete on final pair, modal doesn't appear, state transitions incorrectly
- **Test focus:** TC-046, EC-010, EC-011, play to the very last pair
- **Mitigation:** RESOLVE_COMPLETE checks matchedPairIds.length against pairCount. Phase transitions to complete synchronously

### 9. **Responsive Layout on Mobile**
- **Risk:** Cards overflow, status bar hidden, cannot see all cards without scroll
- **Test focus:** RD-007 through RD-010, play full game on mobile portrait and landscape
- **Mitigation:** CSS media queries, flexbox layout, relative sizing. No fixed-width containers

### 10. **Static Build Relative Paths**
- **Risk:** Assets 404 when served from non-root path, app doesn't load CSS/JS
- **Test focus:** DW-004, DW-005, deploy to S3 in a subdirectory and test
- **Mitigation:** Vite config has `base: './'`. All imports are relative. No absolute paths to assets

---

## 9. Regression Checklist

After each code change or before deployment, verify:

- [ ] Countdown blocks all interaction (cards not clickable during 3...2...1...Go)
- [ ] Left card must be selected first; clicking right card when no left is selected does nothing
- [ ] Cards flip with animation when selected
- [ ] Correct match plays success animation and cards are removed
- [ ] Incorrect match plays failure animation and cards flip back
- [ ] Guess counter increments for every left+right attempt (correct or incorrect)
- [ ] Matches counter increments only for correct matches
- [ ] Solo timer starts after countdown and stops on game complete
- [ ] Final elapsed time is saved and displayed in completion modal
- [ ] 2-player: turn switches on incorrect match, stays with player on correct match
- [ ] 2-player: scores increment only for correct matches by current player
- [ ] 2-player: final scores are displayed and winner is crowned (or tie shown)
- [ ] Game completes when all pairs matched
- [ ] Completion modal shows correct final stats
- [ ] Play Again button restarts game with same settings
- [ ] Back to Menu button returns to start screen
- [ ] Rapid clicking does not corrupt state or cause double-selection
- [ ] Mid-game restart clears animations and resets board
- [ ] All text is readable at mobile size (16px+)
- [ ] Cards are tappable at all device sizes (48x48px+)
- [ ] Build completes without errors (`npm run build`)
- [ ] `dist/` contains index.html and assets folder
- [ ] Static build serves from any root path (relative asset paths)
- [ ] No console errors on startup
- [ ] No external API calls during gameplay (fully offline-capable)

---

## 10. Recommended Next Handoff

**Primary: `visual-ui-builder` (claude-sonnet-4-6)**

Implement the app using this QA plan as acceptance criteria. The builder should:
- Create the full React/Vite/TypeScript app per frontend-architect spec
- Implement all reducer transitions per gameplay-state-designer spec
- Build responsive CSS ensuring cards are touch-friendly
- Apply child-friendly visual design and colors
- Ensure all animations meet the timing contracts (flip 300ms, shake 700ms, success 800ms)
- Create the build output for static deployment

**Secondary: `qa-test-designer` (claude-haiku-4-5) — Post-Implementation Pass**

After visual-ui-builder completes:
- Re-run this QA plan against the built app
- Verify each acceptance criterion and edge case works
- Test responsive layout on real devices
- Verify static build works on S3/Azure/Netlify
- Document any deviations or unmet criteria for escalation

**Tertiary: `static-deployment-helper` (claude-haiku-4-5) — Pre-Deployment**

Before pushing to production:
- Verify build integrity and relative paths
- Create deployment guide for S3 / Azure / Netlify
- Test app from static host URL
- Confirm no backend dependencies

**Escalation: `claude-opus-4-6`**

Only if:
- A state machine bug cannot be resolved by Sonnet
- A critical responsive layout issue exists
- A fundamental architecture change is needed post-implementation

---

## Artefacts Produced

- This document: `.claude/outputs/qa-test-designer.md`
- Format: Numbered test cases with Given/When/Then structure
- Coverage: Acceptance criteria, edge cases, responsive design, accessibility, deployment
- Intended use: Manual testing checklist for humans and QA engineers

---

## Open Risks for Next Agent

1. **Animation timing contract:** Ensure CSS animation durations match setTimeout durations. Off-by-one or typos will cause misalignment.
2. **Division pool collision:** Confirm that the selected division sub-pool avoids duplicate answers. Test with all 10 "Really Hard" pairs and verify no duplicates.
3. **Timer delta calculation:** Ensure `Date.now()` delta approach is used, not incrementing counter. Test backgrounding to verify no artificial time inflation.
4. **2-player turn switch:** Confirm turn switches on RESOLVE_COMPLETE with resolving_failure branch, not elsewhere.
5. **Mobile breakpoints:** Confirm card sizes and spacing work for 375px width and below (smallest phones).
6. **Vite base path:** Confirm `base: './'` is set in vite.config.ts. Test with subdirectory deployment.

