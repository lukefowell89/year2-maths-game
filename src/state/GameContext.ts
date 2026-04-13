import { createContext } from 'react';
import type { GameState } from '../types/game';
import type { GameAction } from './gameActions';
import { INITIAL_STATE } from './initialState';

export interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  elapsedMs: number;
}

export const GameContext = createContext<GameContextValue>({
  state: INITIAL_STATE,
  dispatch: () => undefined,
  elapsedMs: 0,
});
