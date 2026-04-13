export type GamePhase = 'idle' | 'setup' | 'countdown' | 'playing' | 'complete';

export type TurnPhase =
  | 'waitingForLeft'
  | 'leftSelected'
  | 'resolving_success'
  | 'resolving_failure';

export type MathsMode = 'multiplication' | 'division';

export type Difficulty = 'easy' | 'notSoEasy' | 'aLittleTricky' | 'veryHard';

export type PlayerMode = 'solo' | 'twoPlayer';

export type ActivePlayer = 'A' | 'B';

export type CardStatus = 'faceDown' | 'faceUp' | 'matched' | 'incorrect';

export interface LeftCard {
  pairId: string;
  prompt: string;
  status: CardStatus;
}

export interface RightCard {
  pairId: string;
  answer: number;
  status: CardStatus;
}

export interface GameConfig {
  mode: MathsMode;
  difficulty: Difficulty;
  playerMode: PlayerMode;
  pairCount: number;
}

export interface BoardState {
  leftCards: LeftCard[];
  rightCards: RightCard[];
  matchedPairIds: string[];
  selectedLeftPairId: string | null;
  selectedRightPairId: string | null;
}

export interface SoloStats {
  guesses: number;
  matches: number;
  elapsedMs: number;
}

export interface TwoPlayerStats {
  scoreA: number;
  scoreB: number;
  activePlayer: ActivePlayer;
}

export interface GameState {
  phase: GamePhase;
  turnPhase: TurnPhase;
  isLocked: boolean;
  lastMatchResult: 'correct' | 'incorrect' | null;
  config: GameConfig | null;
  board: BoardState | null;
  soloStats: SoloStats;
  twoPlayerStats: TwoPlayerStats;
}

export interface MathsPair {
  id: string;
  mode: MathsMode;
  prompt: string;
  answer: number;
}
