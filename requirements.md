\# Maths Matching Game — Product Requirements Document



\## 1. Overview



\### Product name



Working title: \*\*Maths Match\*\*



\### Purpose



Build a \*\*simple, child-friendly React frontend game\*\* with \*\*no backend\*\*. The game is a digital matching game where players match a maths expression on the left side of the board with the correct numeric answer on the right side.



This should be designed as a \*\*static web app\*\* that can be deployed to \*\*Amazon S3 static hosting\*\*, \*\*Azure Storage Static Website\*\*, or any similar static hosting platform.



\### Core concept



Players flip one card from the \*\*left column/group\*\* to reveal a maths expression such as:



\* `12 ÷ 2`

\* `18 ÷ 3`

\* `3 x 7`

\* `10 x 4`



They must then choose the matching answer card from the \*\*right column/group\*\*, such as:



\* `6`

\* `7`

\* `21`

\* `40`



If they are correct, both cards are collected into a completed pile and score is updated.

If wrong, a clear incorrect animation plays and both cards flip back over.



\---



\## 2. Goals



\### Primary goals



\* Create a \*\*fun, colourful maths learning game for children\*\*.

\* Make gameplay extremely simple for \*\*mouse and touch users\*\*.

\* Support \*\*solo play\*\* and \*\*2-player mode\*\*.

\* Make it work as a \*\*frontend-only application\*\*.

\* Make deployment simple for static hosting.



\### Secondary goals



\* Encourage practice of multiplication and division facts.

\* Provide satisfying feedback through animations, timing, and scoring.

\* Ensure the design feels playful without becoming visually overwhelming.



\---



\## 3. Technical scope



\### In scope



\* React-based frontend application

\* Responsive layout for desktop and tablet, with reasonable mobile support

\* Static data generation in-app

\* Local game state only

\* Animations and visual effects

\* Timer and score tracking

\* 1-player and 2-player gameplay

\* End-of-game summary modal



\### Out of scope



\* Backend services

\* Login/accounts

\* Cloud save

\* Multiplayer over the internet

\* Leaderboards

\* Database storage

\* CMS/admin panel

\* Audio recording or voice control



\---



\## 4. Target users



\### Primary audience



\* Children learning multiplication and division facts

\* Parents helping children practise

\* Teachers using the game in class or for homework



\### Age range



Roughly \*\*6–10 years old\*\*, though flexible depending on difficulty chosen.



\---



\## 5. Platforms and hosting



\### Platforms



\* Modern desktop browsers

\* Tablet browsers

\* Mobile browsers



\### Hosting expectations



The app must build into static files that can be hosted on:



\* Amazon S3 static website hosting

\* Azure Storage Static Website

\* Netlify / Vercel / GitHub Pages as alternatives



\### Technical preference



\* React

\* No backend

\* No server-side rendering required

\* All game logic runs client-side



\### Suggested stack



Claude may choose the exact implementation, but a sensible default would be:



\* React

\* Vite

\* TypeScript preferred, but JavaScript acceptable

\* CSS Modules, Tailwind, or simple CSS depending on what keeps the app easy to maintain

\* Canvas is not required

\* A lightweight confetti library is acceptable



\---



\## 6. Game modes and content



\## 6.1 Maths categories



At game setup, the user must choose one of:



\* \*\*Multiplication\*\*

\* \*\*Division\*\*



\## 6.2 Example question sets



The initial version should support these question pools.



\### Division pools



\* Division by 2 up to `20 ÷ 2`

\* Division by 3 up to `30 ÷ 3`

\* Division by 10 up to `500 ÷ 10`



\### Multiplication pools



\* 2 times table up to `2 x 12` (result 24)

\* 3 times table up to `3 x 12` (result 36)

\* 10 times table up to `10 x 10` (result 100)



\## 6.3 Content structure recommendation



Each question should be represented in a data structure like:



\* unique id

\* mode: multiplication or division

\* prompt text (e.g. `18 ÷ 3`)

\* answer value (e.g. `6`)

\* difficulty suitability tag if needed



Example:



```ts

{

&#x20; id: 'div-3-18',

&#x20; type: 'division',

&#x20; prompt: '18 ÷ 3',

&#x20; answer: '6'

}

```



\## 6.4 Matching rules



\* Left-side cards always contain \*\*maths prompts\*\*

\* Right-side cards always contain \*\*answers\*\*

\* Each prompt must have exactly one correct answer

\* No duplicate answers should appear in the same round if it creates ambiguity

\* Generated board must always be valid and solvable



\---



\## 7. Difficulty system



At setup, the player chooses a difficulty level:



\* \*\*Easy\*\*

\* \*\*Not So Easy\*\*

\* \*\*Pretty Tricky\*\*

\* \*\*Really Hard\*\*



These difficulty levels determine \*\*how many pairs/cards are shown\*\*.



\### Suggested mapping



Claude can tune exact numbers, but use something close to:



\* Easy: \*\*4 pairs\*\*

\* Not So Easy: \*\*6 pairs\*\*

\* Pretty Tricky: \*\*8 pairs\*\*

\* Really Hard: \*\*10 pairs\*\*



That means:



\* 4 pairs = 4 left cards + 4 right cards

\* 6 pairs = 6 left cards + 6 right cards

\* etc.



\### Difficulty requirements



\* Difficulty only changes \*\*board size / number of pairs\*\* for v1

\* The actual maths pools can be reused, but harder levels should feel harder because there are more visible cards and more possible answers

\* Optional enhancement: larger difficulties may prefer more advanced tables from the chosen mode



\---



\## 8. Player modes



At setup, the user chooses:



\* \*\*Solo\*\*

\* \*\*2 Player\*\*



\## 8.1 Solo mode rules



\* One player attempts to clear the board

\* Track:



&#x20; \* elapsed time

&#x20; \* number of guesses / attempts

&#x20; \* number of successful matches

\* Final modal should show:



&#x20; \* celebratory success message

&#x20; \* total time taken

&#x20; \* total guesses made

&#x20; \* accuracy if useful



\## 8.2 Two-player mode rules



\* Two local players take turns on the same device

\* Players can be labelled:



&#x20; \* \*\*Player A\*\*

&#x20; \* \*\*Player B\*\*

\* On a successful match:



&#x20; \* current player scores a point

&#x20; \* current player may either keep the turn or end the turn depending on final design choice



\### Recommended rule for simplicity



\* \*\*A correct match gives the player another turn\*\*

\* \*\*An incorrect match passes the turn to the other player\*\*



This creates a familiar memory-game feel and makes scoring more exciting.



\### Two-player tracking



Track:



\* current turn

\* Player A matches

\* Player B matches

\* total pairs completed



\### Final modal in 2-player mode



Show:



\* Player A score

\* Player B score

\* winner clearly highlighted

\* crown icon on the winner

\* tie state if scores are equal



\---



\## 9. Full game flow



The game flow must follow this sequence.



\### Step 1: Landing / start screen



Show a welcoming start screen with:



\* game title

\* playful branding

\* primary CTA: \*\*Start New Game\*\*



\### Step 2: Mode selection



After starting, show setup choices:



1\. Choose \*\*Multiplication\*\* or \*\*Division\*\*

2\. Choose \*\*Difficulty\*\*

3\. Choose \*\*Solo\*\* or \*\*2 Player\*\*

4\. Button: \*\*Start Game\*\*



This may be one screen or a simple stepper flow.



\### Step 3: Countdown



When the game begins, show a large animated countdown overlay:



\* `3`

\* `2`

\* `1`

\* `Go!`



During countdown:



\* cards should not be clickable

\* timer should not start until gameplay begins



\### Step 4: Game board display



After countdown, show all cards laid out on the screen.



Layout concept:



\* \*\*Left side:\*\* prompt cards face down

\* \*\*Right side:\*\* answer cards face down

\* Board should visually suggest “pick left first, then right”



\### Step 5: First pick must be from left side



Rules:



\* Player must first choose one card from the \*\*left side only\*\*

\* Clicking a right-side card first should do nothing, or show a subtle hint

\* The selected left card flips over with animation to reveal the maths prompt



\### Step 6: Second pick from right side



\* Once a left card is revealed, right-side cards become selectable

\* User taps/clicks one right-side card

\* It flips over to reveal the answer



\### Step 7: Match validation



If answer is correct:



\* play success animation

\* optionally show confetti burst around the match

\* move both cards into a completed pile / remove them from the board with animation

\* increment score

\* in 2-player mode, same player continues



If answer is incorrect:



\* play failure animation, e.g. shake, red glow, red cross burst

\* pause briefly so the user can see the mismatch

\* flip both cards back face down

\* in 2-player mode, pass turn to the other player



\### Step 8: End of game



When all pairs are matched:



\* stop timer

\* show end-of-game modal/popup



\#### Solo mode modal



Show:



\* positive success message

\* total time

\* total guesses

\* total correct matches

\* button to play again

\* button to return to menu



\#### 2-player mode modal



Show:



\* positive completion message

\* Player A score

\* Player B score

\* winner with crown

\* tie message if equal

\* button to play again

\* button to return to menu



\---



\## 10. UX and interface requirements



\## 10.1 General design direction



The design should be:



\* simple

\* bright

\* colourful

\* child-friendly

\* easy to understand

\* playful but not cluttered



\### Visual style ideas



\* rounded cards

\* soft shadows

\* bright background or tabletop feeling

\* friendly fonts

\* clear contrast for readability

\* large tap-friendly click areas



\### Tone



\* encouraging, cheerful, positive

\* never punishing or harsh



\---



\## 10.2 Main screens



\### A. Start screen



Elements:



\* game logo/title

\* subtitle such as “Match the maths cards!”

\* Start New Game button



\### B. Setup screen



Elements:



\* choose maths type

\* choose difficulty

\* choose player mode

\* Start Game button



\### C. Countdown overlay



Elements:



\* full-screen overlay

\* large animated numbers



\### D. Main gameplay screen



Elements:



\* top status bar

\* board area

\* completed pile area

\* current turn indicator in 2-player mode



\### E. End game modal



Elements:



\* completion summary

\* winner or stats

\* replay/navigation buttons



\---



\## 10.3 Status bar requirements



The gameplay screen should include a top bar or header showing:



\### Always show



\* game type: Multiplication or Division

\* selected difficulty

\* restart/new game option



\### Solo mode should show



\* timer

\* guesses count

\* matches completed



\### Two-player mode should show



\* current player turn

\* Player A score

\* Player B score

\* optional timer



\---



\## 10.4 Board layout requirements



\### Structure



The board must be clearly split into two zones:



\* \*\*Left prompts\*\*

\* \*\*Right answers\*\*



\### Layout behaviour



\* Cards should align in neat grids or columns depending on screen size

\* The two sides should remain visually separate

\* On narrow screens, layout may stack but still needs clear labels such as “Pick from here first” and “Then find the answer”



\### Labels



Include child-friendly helper text, for example:



\* Left: \*\*Pick a maths card\*\*

\* Right: \*\*Find the answer\*\*



\---



\## 11. Card behaviour and animation requirements



\## 11.1 Card states



Each card should have clear states:



\* face down

\* selected

\* revealed

\* matched

\* disabled

\* incorrect feedback state



\## 11.2 Flip animation



When a card is revealed:



\* it should animate as a flip/turn over

\* animation should feel smooth and playful

\* timing should be quick but readable



\## 11.3 Success behaviour



On a correct match:



\* show celebratory effect

\* examples:



&#x20; \* confetti burst

&#x20; \* sparkle animation

&#x20; \* green glow

&#x20; \* bounce effect

\* matched cards should then:



&#x20; \* animate into a completed pile, or

&#x20; \* shrink/fade out and appear in a scored pile area



\## 11.4 Failure behaviour



On incorrect match:



\* show a very clear wrong state

\* examples:



&#x20; \* red outline

&#x20; \* shake animation

&#x20; \* red burst or cross

\* after a brief delay, both cards return to hidden state



\## 11.5 Interaction locking



While animations are resolving:



\* prevent extra clicks/taps

\* ensure no double-triggering or broken state transitions



\---



\## 12. Scoring and stats



\## 12.1 Solo mode metrics



Track at minimum:



\* number of guesses

\* number of matches

\* elapsed time



\### Guess definition



A “guess” means one complete attempt consisting of:



\* 1 left card chosen

\* 1 right card chosen

\* then validated



\## 12.2 Two-player scoring



\* Each correct match = 1 point

\* The player with most matches at the end wins



\## 12.3 Optional nice-to-have metrics



Optional but useful:



\* accuracy percentage in solo mode

\* best score stored in localStorage

\* best time stored in localStorage



These are optional, not required for v1.



\---



\## 13. Game logic rules



\## 13.1 Board generation



At game start:



\* choose a set of pairs based on mode/difficulty

\* shuffle left-side prompts independently

\* shuffle right-side answers independently

\* ensure matching is only possible through logic, not position



\## 13.2 Turn sequence state machine



Recommended gameplay state flow:



1\. waiting for left selection

2\. left selected / waiting for right selection

3\. validating guess

4\. resolving success or failure

5\. either continue turn or switch turn

6\. check for game complete



\## 13.3 Invalid actions



Handle these gracefully:



\* clicking right side first before a left card is selected

\* clicking already matched cards

\* clicking same card repeatedly during animation

\* clicking while board is locked



\## 13.4 Reset behaviour



Restarting the game should:



\* clear timer

\* clear guesses

\* clear scores

\* clear selections

\* generate a new shuffled board

\* return to either setup or immediate replay depending on chosen button



\---



\## 14. Accessibility requirements



Even though this is a children’s game, it should still aim for good accessibility.



\### Requirements



\* large buttons and tap targets

\* readable font sizes

\* sufficient colour contrast

\* visible focus states for keyboard users

\* semantic buttons rather than div-only clickable elements

\* animations should not be so fast that they are confusing



\### Keyboard support



Nice to have, but not essential for v1.

Mouse/touch support is essential.



\### Reduced motion



Nice to have:



\* respect `prefers-reduced-motion` by simplifying or reducing animations



\---



\## 15. Responsive design requirements



\### Desktop



\* side-by-side layout with clear left and right game columns



\### Tablet



\* maintain two-column feeling where possible

\* large touch targets



\### Mobile



\* acceptable to stack sections vertically

\* still preserve the rule that left is selected first and right second

\* instructions must remain clear

\* avoid tiny cards or crowded UI



\---



\## 16. Performance expectations



\* Fast initial load

\* No unnecessary heavy dependencies

\* Animations should stay smooth on common tablets and laptops

\* No backend calls required during gameplay



\---



\## 17. Suggested component structure



Claude can choose the exact architecture, but something like this would be sensible:



\* `App`

\* `GameShell`

\* `StartScreen`

\* `SetupScreen`

\* `CountdownOverlay`

\* `GameBoard`

\* `CardGrid`

\* `MathCard`

\* `AnswerCard`

\* `ScoreBoard`

\* `TurnIndicator`

\* `CompletedPile`

\* `EndGameModal`

\* `ConfettiEffect`



Potential hooks/utilities:



\* `useGameState`

\* `useTimer`

\* `generateRoundData`

\* `shuffleArray`

\* `evaluateMatch`



\---



\## 18. Data and configuration requirements



The app should be configurable enough that additional facts can be added easily.



\### Recommended configuration objects



\* available modes

\* difficulty-to-pair-count mapping

\* question pools for multiplication

\* question pools for division



This should allow future expansion to:



\* 4 times table

\* 5 times table

\* mixed mode

\* subtraction/addition



\---



\## 19. Animation and delight requirements



\### Minimum animation set



Required:



\* card flip animation

\* incorrect shake/red feedback

\* correct success feedback

\* countdown animation

\* end modal entrance animation



\### Optional delight features



Nice additions if easy:



\* confetti on each correct match

\* larger confetti burst on game completion

\* sparkle trail when cards move to completed pile

\* crown bounce animation for winner in 2-player mode



\---



\## 20. Copy / text guidance



The copy should be friendly and child-focused.



\### Examples



\* “Start New Game”

\* “Choose your challenge”

\* “Pick a maths card”

\* “Now find the answer!”

\* “Great job!”

\* “Oops, try again!”

\* “You did it!”

\* “Player A wins!”

\* “It’s a tie!”



Avoid overly wordy instructions.



\---



\## 21. Edge cases to handle



\* Very fast repeated clicking/tapping

\* Selecting a left card, then trying to select another left card before the right card

\* Duplicate numeric answers across a generated set causing ambiguity

\* Finishing the final pair during animation resolution

\* Restarting mid-game

\* Switching between solo and 2-player mode

\* Countdown interruption

\* Timer accuracy when game is paused or reset



\---



\## 22. Acceptance criteria



\## 22.1 Setup and navigation



\* User can start a new game from a landing screen

\* User can choose Multiplication or Division

\* User can choose one of four difficulty levels

\* User can choose Solo or 2 Player

\* User can begin the game from setup



\## 22.2 Countdown



\* A visible 3,2,1 countdown appears before gameplay starts

\* Cards cannot be selected during countdown



\## 22.3 Board rendering



\* Cards are shown in two separate groups: left prompts and right answers

\* Number of cards shown matches the selected difficulty

\* Cards begin face down



\## 22.4 Selection logic



\* User must choose a left-side card first

\* After left-side selection, right-side cards become selectable

\* Chosen cards flip to reveal values



\## 22.5 Match handling



\* Correct match is detected accurately

\* On correct match, success animation appears and cards are removed/collected

\* On incorrect match, failure animation appears and cards flip back after a short delay

\* No broken state occurs from rapid clicking



\## 22.6 Solo mode



\* Timer starts after countdown

\* Guesses are counted correctly

\* End modal shows time and guesses



\## 22.7 Two-player mode



\* Turn indicator is visible

\* Scores are tracked separately for Player A and Player B

\* Incorrect guesses switch turns

\* Final winner is clearly displayed with crown



\## 22.8 Completion



\* Game ends automatically when all pairs are matched

\* End modal provides replay options



\## 22.9 Deployment



\* App can be built into static assets

\* Static build can be hosted on S3 or Azure static hosting without server code



\---



\## 23. Suggested implementation notes for Claude



Claude should aim to build:



\* a clean and readable codebase

\* a polished but lightweight UI

\* a frontend-only React app ready for static deployment



\### Strong preferences



\* Keep the implementation simple

\* Prioritise reliable state management over flashy complexity

\* Child-friendly visuals matter

\* Touch support matters

\* Avoid overengineering



\### Recommended implementation choices



\* Use local component state or a reducer for game flow

\* Use CSS transforms for card flip animations

\* Use a lightweight confetti package or a simple custom particle burst

\* Use a modal component for the end-game summary

\* Keep game data in plain arrays/config objects



\---



\## 24. Nice-to-have enhancements after v1



These are not required for the first build, but should be easy to add later:



\* sound effects for success/failure

\* mute toggle

\* mixed multiplication + division mode

\* addition/subtraction packs

\* difficulty based on maths complexity as well as card count

\* high scores saved in localStorage

\* avatars for Player A and Player B

\* theme switcher

\* teacher mode / classroom mode



\---



\## 25. Final build request summary



Please build a \*\*React-based frontend-only maths matching game\*\* with these characteristics:



\* static deployable app

\* no backend

\* colourful child-friendly UI

\* game setup flow

\* multiplication/division mode selection

\* four difficulty levels based on card count

\* solo and 2-player gameplay

\* animated countdown

\* left side = maths prompts, right side = answers

\* left card must be selected first

\* correct and incorrect animations

\* score/timer tracking

\* winner summary / completion modal

\* suitable for hosting in an S3 bucket or similar static hosting container



The final implementation should feel polished, easy to understand, and fun for children to use.



