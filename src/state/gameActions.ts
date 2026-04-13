import type { MathsMode, Difficulty, PlayerMode, LeftCard, RightCard } from '../types/game';

export type GameAction =
  | { type: 'START_SETUP' }
  | {
      type: 'CONFIRM_SETUP';
      payload: { mode: MathsMode; difficulty: Difficulty; playerMode: PlayerMode };
    }
  | {
      type: 'START_PLAYING';
      payload: { leftCards: LeftCard[]; rightCards: RightCard[] };
    }
  | { type: 'SELECT_LEFT'; payload: { pairId: string } }
  | { type: 'SELECT_RIGHT'; payload: { pairId: string } }
  | { type: 'RESOLVE_COMPLETE'; payload: { elapsedMs?: number } }
  | { type: 'RESTART_SAME_SETTINGS' }
  | { type: 'GO_TO_SETUP' }
  | { type: 'GO_TO_IDLE' };
