import type { GameState } from '../types/game';

export const INITIAL_STATE: GameState = {
  phase: 'idle',
  turnPhase: 'waitingForLeft',
  isLocked: false,
  lastMatchResult: null,
  config: null,
  board: null,
  soloStats: { guesses: 0, matches: 0, elapsedMs: 0 },
  twoPlayerStats: { scoreA: 0, scoreB: 0, activePlayer: 'A' },
};
